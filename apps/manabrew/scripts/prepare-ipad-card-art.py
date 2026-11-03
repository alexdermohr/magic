#!/usr/bin/env python3
import hashlib
import io
import json
import os
import sys
import threading
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


root = Path(sys.argv[1]).resolve()
card_cache = json.loads(Path(sys.argv[2]).read_text())
deck_file = root / "personal-decks.json"
decks = json.loads(deck_file.read_text())
art = root / "a"
art.mkdir(parents=True, exist_ok=True)

urls = {}
crops = {}
for card in card_cache.values():
    card_id = card["id"]
    front = card.get("image_uris") or (card.get("card_faces") or [{}])[0].get("image_uris")
    if not front or not front.get("normal"):
        raise RuntimeError("Missing front image: " + card["name"])
    stem = hashlib.sha256(card_id.encode()).hexdigest()[:14]
    urls[stem] = front["normal"]
    if not front.get("art_crop"):
        raise RuntimeError("Missing front artwork crop: " + card["name"])
    crops[stem] = front["art_crop"]
    faces = card.get("card_faces") or []
    if len(faces) >= 2 and faces[1].get("image_uris"):
        back = hashlib.sha256((card_id + ":back").encode()).hexdigest()[:14]
        urls[back] = faces[1]["image_uris"]["normal"]
        if not faces[1]["image_uris"].get("art_crop"):
            raise RuntimeError("Missing reverse artwork crop: " + card["name"])
        crops[back] = faces[1]["image_uris"]["art_crop"]

if len(urls) != len(set(urls.keys())):
    raise RuntimeError("Image filename collision")

gate = threading.Lock()
last_start = 0

def download(item):
    global last_start
    stem, url, crop = item
    target = art / (stem + ("-art.jpg" if crop else ".webp"))
    if target.exists() and target.stat().st_size > 1500:
        return target.stat().st_size
    for attempt in range(5):
        with gate:
            wait = max(0.0, 0.16 - (time.monotonic() - last_start))
            if wait:
                time.sleep(wait)
            last_start = time.monotonic()
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Manabrew-iPad-Offline-Art/1.0"})
            with urllib.request.urlopen(request, timeout=40) as resp:
                binary = resp.read()
                if resp.status != 200 or not binary:
                    raise RuntimeError(f"Invalid artwork response: {resp.status}")
            if crop:
                if not binary.startswith(b"\xff\xd8\xff"):
                    raise RuntimeError("Artwork crop is not a JPEG: " + url)
                output = binary
            else:
                from PIL import Image
                with Image.open(io.BytesIO(binary)) as source:
                    front = source.convert("RGB")
                    front.thumbnail((440, 616), Image.Resampling.LANCZOS)
                    buffer = io.BytesIO()
                    front.save(buffer, format="WEBP", quality=79, method=5)
                output = buffer.getvalue()
            if len(output) < 1500:
                raise RuntimeError("Encoded image unexpectedly small")
            temporary = target.with_suffix(".tmp")
            temporary.write_bytes(output)
            temporary.replace(target)
            return len(output)
        except Exception:
            if attempt == 4:
                raise
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError("Unreachable")

if len(crops) != len(urls):
    raise RuntimeError("Each card face needs its own artwork crop")
pending = (
    [(stem, url, False) for stem, url in urls.items() if not (art / (stem + ".webp")).exists()] +
    [(stem, url, True) for stem, url in crops.items() if not (art / (stem + "-art.jpg")).exists()]
)
print("Artwork:", len(urls), "full images,", len(crops), "art crops; to download:", len(pending), flush=True)
errors = []
with ThreadPoolExecutor(max_workers=5) as workers:
    futures = {workers.submit(download, item): item[0] for item in pending}
    for index, future in enumerate(as_completed(futures), 1):
        try:
            future.result()
        except Exception as error:
            errors.append((futures[future], str(error)))
        if index % 100 == 0:
            print("Artwork done", index, "/", len(pending), flush=True)
if errors:
    raise RuntimeError("Missing images: " + str(errors[:16]))

for stem in urls:
    target = art / (stem + ".webp")
    crop = art / (stem + "-art.jpg")
    if not target.exists() or target.stat().st_size < 1500:
        raise RuntimeError("Full card image missing: " + stem)
    if not crop.exists() or crop.stat().st_size < 1500:
        raise RuntimeError("Artwork crop missing: " + stem)

uri_keys = ("small", "normal", "large", "png", "art_crop", "border_crop")
for saved in decks["decks"]:
    for card in saved["deck"]["cards"] + saved["deck"]["commanders"]:
        key = card["identity"]["name"].casefold()
        source = card_cache.get(key)
        if source is None:
            raise ValueError("No image card: " + card["identity"]["name"])
        stem = hashlib.sha256(source["id"].encode()).hexdigest()[:14]
        card["uris"] = {k: f"/a/{stem}.webp" for k in uri_keys}
        card["uris"]["art_crop"] = f"/a/{stem}-art.jpg"
        if "backFace" in card:
            back = hashlib.sha256((source["id"] + ":back").encode()).hexdigest()[:14]
            card["backFace"]["uris"] = {k: f"/a/{back}.webp" for k in uri_keys}
            card["backFace"]["uris"]["art_crop"] = f"/a/{back}-art.jpg"
        card["imageLanguage"] = "en"
        card["identity"].pop("oracleId", None)
        if card.get("layout") == "normal":
            card.pop("layout")

temporary = deck_file.with_suffix(".json.tmp")
temporary.write_text(json.dumps(decks, ensure_ascii=False, separators=(",", ":")) + "\n")
temporary.replace(deck_file)
total = sum(p.stat().st_size for p in art.iterdir() if p.suffix in {".webp", ".jpg"})
print("ART_READY",len(urls),"full images",len(crops),"art crops",total,"bytes", "DECK_DATA",deck_file.stat().st_size,"bytes", flush=True)