#!/usr/bin/env python3
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

root = Path(sys.argv[1]).resolve()
source = Path(__file__).resolve().parent.parent / "src/types/scryfall.ts"
symbols = re.search(r"export const MANA_CODES = \[(.*?)\] as const", source.read_text(), re.S)
if symbols is None:
    raise ValueError("Mana codes not found")
codes = list(dict.fromkeys(re.findall(r'"([^"]+)"', symbols.group(1))))
target = root / "card-symbols"
target.mkdir(parents=True, exist_ok=True)

def install(code):
    filename = {"½": "HALF", "∞": "INFINITY"}.get(code, code.replace("/", "")) + ".svg"
    path = target / filename
    if path.exists() and "<svg" in path.read_text() and path.stat().st_size > 70:
        return "cached"
    url = "https://svgs.scryfall.io/card-symbols/" + urllib.parse.quote(filename)
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Manabrew-iPad-Offline/1.0"}), timeout=25) as r:
            blob = r.read()
        if b"<svg" not in blob or len(blob) < 70:
            raise ValueError("Invalid SVG " + filename)
        path.write_bytes(blob)
        return "downloaded"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return "unavailable"
        raise

with ThreadPoolExecutor(max_workers=5) as pool:
    futures = {pool.submit(install, code): code for code in codes}
    results = {futures[f]: f.result() for f in as_completed(futures)}

for must in "W U B R G C T Q X 0 1 2 3".split():
    if results.get(must) == "unavailable":
        raise RuntimeError("Missing essential symbol " + must)

back = root / "backs/large/0/a/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg"
back.parent.mkdir(parents=True, exist_ok=True)
if not back.exists() or back.stat().st_size < 10000:
    url = "https://backs.scryfall.io/large/0/a/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Manabrew-iPad-Offline/1.0"}), timeout=40) as r:
        back.write_bytes(r.read())
if back.stat().st_size < 10000:
    raise RuntimeError("Card back is incomplete")
print(json.dumps({"symbols": len(codes), "counts": {status: list(results.values()).count(status) for status in set(results.values())}, "missing": sorted(code for code, result in results.items() if result == "unavailable"), "backBytes": back.stat().st_size}))