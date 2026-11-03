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
for card in card_cache.values():
    card_id = card["id"]
    front = card.get("image_uris") or (card.get("card_faces") or [{}])[0].get("image_uris")
    if not front or not front.get("normal"):
        raise RuntimeError("Missing front image: " + card["name"])
    urls[hashlib.sha256(card_id.encode()).hexdigest()[:14]] = front["normal"]
    faces = card.get("card_faces") or []
    if len(faces) >= 2 and faces[1].get("image_uris"):
        urls[hashlib.sha256((card_id + ":back").encode()).hexdigest()[:14]] = faces[1]["image_uris"]["normal"]

if len(urls) != len(set(urls.keys())):
    raise RuntimeError("Image filename collision")

gate = threading.Lock()
last_start = 0

def download(item):
    from PIL import Image
    global last_start
    stem, url = item
    target = art / (stem + ".webp")
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

pending = [(stem, url) for stem, url in urls.items() if not (art / (stem + ".webp")).exists()]
print("Artwork:", len(urls), "to download:", len(pending), flush=True)
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
    if not target.exists() or target.stat().st_size < 1500:
        raise RuntimeError("Artwork missing: " + stem)

uri_keys = ("small", "normal", "large", "png", "art_crop", "border_crop")
for saved in decks["decks"]:
    for card in saved["deck"]["cards"] + saved["deck"]["commanders"]:
        key = card["identity"]["name"].casefold()
        source = card_cache.get(key)
        if source is None:
            raise ValueError("No image card: " + card["identity"]["name"])
        stem = hashlib.sha256(source["id"].encode()).hexdigest()[:14]
        card["uris"] = {k: f"/a/{stem}.webp" for k in uri_keys}
        if "backFace" in card:
            back = hashlib.sha256((source["id"] + ":back").encode()).hexdigest()[:14]
            card["backFace"]["uris"] = {k: f"/a/{back}.webp" for k in uri_keys}
        card["imageLanguage"] = "en"
        card["identity"].pop("oracleId", None)
        if card.get("layout") == "normal":
            card.pop("layout")

temporary = deck_file.with_suffix(".json.tmp")
temporary.write_text(json.dumps(decks, ensure_ascii=False, separators=(",", ":")) + "\n")
temporary.replace(deck_file)
total = sum(p.stat().st_size for p in art.glob("*.webp"))
print("ART_READY",len(urls),"images",total,"bytes", "DECK_DATA",deck_file.stat().st_size,"bytes", flush=True)