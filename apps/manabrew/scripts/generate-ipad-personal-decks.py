#!/usr/bin/env python3
import hashlib
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

source = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[3]
dest = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path("dist/personal-decks.json")
cache_path = Path(sys.argv[3]).resolve() if len(sys.argv) > 3 else Path.home() / ".cache/manabrew-ipad-scryfall-cards.json"
prefix = uuid.uuid5(uuid.NAMESPACE_URL, "https://github.com/alexdermohr/magic")
basic_types = {"Basic", "Legendary", "Snow", "World", "Ongoing"}
name_pattern = re.compile(r"^(\d+)\s+(.+)$")
headers = {
    "Accept": "application/json",
    "User-Agent": "Manabrew-iPad-PersonalDeckLoader/1.0 (local personal MTG decks)",
    "Content-Type": "application/json",
}
cache_path.parent.mkdir(parents=True, exist_ok=True)
cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}

def api(path, body=None):
    data = json.dumps(body, ensure_ascii=False).encode() if body is not None else None
    req = urllib.request.Request("https://api.scryfall.com" + path, data=data, headers=headers, method="POST" if data else "GET")
    for attempt in range(7):
        try:
            with urllib.request.urlopen(req, timeout=55) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as err:
            if err.code not in (429, 502, 503, 504):
                raise RuntimeError(f"HTTP {err.code}: {path} {err.read(500).decode(errors='replace')}") from err
        except (TimeoutError, urllib.error.URLError):
            pass
        time.sleep(min(20, 2 ** attempt))
    raise RuntimeError("Scryfall unavailable: " + path)

def save_cache():
    tmp = cache_path.with_suffix(".tmp")
    tmp.write_text(json.dumps(cache, ensure_ascii=False, separators=(",", ":")))
    tmp.replace(cache_path)

decks = []
wanted = {}
for path in sorted((source / "decks").glob("*/current.txt")):
    section = "main"
    contents = []
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.lower() in ("commander", "commanders"):
            section = "commanders"
            continue
        if line.lower() in ("deck", "main", "mainboard"):
            section = "main"
            continue
        match = name_pattern.match(line)
        if not match:
            raise ValueError(f"{path}: unrecognized line: {line}")
        count, name = int(match[1]), match[2]
        if count < 1:
            raise ValueError(f"{path}: invalid count")
        contents.append({"name": name, "count": count, "section": section})
        wanted.setdefault(name.split(" // ")[0].casefold(), name.split(" // ")[0])
    if sum(x["count"] for x in contents) != 100:
        raise ValueError(f"{path}: Commander list must contain exactly 100 cards")
    if not any(x["section"] == "commanders" for x in contents):
        contents[0]["section"] = "commanders"
    if sum(x["count"] for x in contents if x["section"] == "commanders") not in (1, 2):
        raise ValueError(f"{path}: not 1/2 commanders")
    decks.append((path, contents))

names = [(key, name) for key, name in sorted(wanted.items()) if key not in cache]
print("Decks:", len(decks), "distinct cards:", len(wanted), "uncached:", len(names), flush=True)
for start in range(0, len(names), 75):
    batch = names[start:start + 75]
    answer = api("/cards/collection", {"identifiers": [{"name": name} for _, name in batch]})
    for card in answer.get("data", []):
        cache[card["name"].split(" // ")[0].casefold()] = card
    for missing in answer.get("not_found", []):
        name = missing["name"]
        key = name.casefold()
        try:
            found = api("/cards/named?fuzzy=" + urllib.parse.quote(name))
            if found.get("object") == "card":
                cache[key] = found
            else:
                print("UNRESOLVED", name, flush=True)
        except RuntimeError as exc:
            print("UNRESOLVED", name, str(exc)[:180], flush=True)
        time.sleep(0.13)
    save_cache()
    print("Resolved batch", min(start + 75, len(names)), "/", len(names), flush=True)
    time.sleep(0.16)

missing = [(name, key) for key, name in wanted.items() if key not in cache]
if missing:
    raise ValueError("Missing cards: " + json.dumps(missing[:80], ensure_ascii=False))

def parse_type(sc):
    text = (sc.get("type_line") or sc.get("card_faces", [{}])[0].get("type_line") or "").split("//")[0]
    major, _, minor = text.partition("—")
    major_tokens = major.split()
    return [p for p in major_tokens if p not in basic_types], minor.split(), [p for p in major_tokens if p in basic_types]

def backface(sc):
    faces = sc.get("card_faces") or []
    if len(faces) < 2 or not faces[1].get("image_uris"):
        return None
    back = faces[1]
    return {
        "name": back["name"], "manaCost": back.get("mana_cost", ""),
        "typeLine": back.get("type_line", ""), "oracleText": back.get("oracle_text", ""),
        "power": back.get("power"), "toughness": back.get("toughness"),
        "uris": {k: v for k, v in back["image_uris"].items() if k in ("normal", "large", "small", "png", "art_crop", "border_crop")},
    }

def deck_card(source_slug, name, nth):
    sc = cache[name.split(" // ")[0].casefold()]
    front = (sc.get("card_faces") or [{}])[0]
    uris = sc.get("image_uris") or front.get("image_uris")
    if not uris:
        raise ValueError("Card has no image metadata: " + name)
    types, subtypes, supertypes = parse_type(sc)
    identity = {
        "id": str(uuid.uuid5(prefix, f"{source_slug}:{name}:{nth}")),
        "name": sc["name"].split(" // ")[0], "setCode": sc["set"],
        "cardNumber": sc["collector_number"],
    }
    obj = {
        "identity": identity,
        "color": "".join(sc.get("colors") if sc.get("colors") is not None else front.get("colors", [])),
        "colorIdentity": sc.get("color_identity", []),
        "manaCost": sc.get("mana_cost") or front.get("mana_cost", ""),
        "cmc": sc.get("cmc", 0),
        "types": types, "subtypes": subtypes, "supertypes": supertypes,
        "text": sc.get("oracle_text") or front.get("oracle_text", ""),
        "uris": {k: v for k, v in uris.items() if k in ("normal", "large", "small", "art_crop")},
        "imageLanguage": sc.get("lang", "en"), "layout": sc.get("layout", "normal"),
        "allParts": [{"name": x["name"], "component": x.get("component", "")} for x in sc.get("all_parts", [])],
    }
    if sc.get("power") or front.get("power"):
        obj["power"] = sc.get("power") or front.get("power")
    if sc.get("toughness") or front.get("toughness"):
        obj["toughness"] = sc.get("toughness") or front.get("toughness")
    back = backface(sc)
    if back:
        obj["backFace"] = back
        obj["isDoubleFaced"] = True
    return obj

result = []
for path, entries in decks:
    slug = path.parent.name
    commander = []
    main = []
    index = 0
    for entry in entries:
        for _ in range(entry["count"]):
            card = deck_card(slug, entry["name"], index)
            index += 1
            (commander if entry["section"] == "commanders" else main).append(card)
    name = " / ".join(x["identity"]["name"] for x in commander)
    deck = {
        "name": name, "description": "Eigene Commander-Deckliste aus alexdermohr/magic · Bracket 3",
        "format": "commander", "cards": main, "commanders": commander, "sideboard": [],
        "coverCardName": commander[0]["identity"]["name"], "draft": False,
    }
    source_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    result.append({
        "id": "github:alexdermohr/magic:" + slug, "deck": deck,
        "savedAt": 1793592000000, "sourceHash": source_hash,
        "slug": slug,
    })
    if len(main) + len(commander) != 100:
        raise ValueError(slug + ": erroneous assembled count")

data = {"source": "https://github.com/alexdermohr/magic", "revision": subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip(), "decks": result}
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
print("WRITTEN", str(dest), "decks", len(result), "bytes", dest.stat().st_size, "per-card average", round(dest.stat().st_size / (len(result) * 100)), flush=True)