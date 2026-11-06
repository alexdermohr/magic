#!/usr/bin/env python3
"""The offline art pipeline must not substitute a full card for artwork crops."""
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

script = Path(__file__).with_name("prepare-ipad-card-art.py")
card_id = "scryfall-card-test"
stem = hashlib.sha256(card_id.encode()).hexdigest()[:14]
back = hashlib.sha256((card_id + ":back").encode()).hexdigest()[:14]

with tempfile.TemporaryDirectory(prefix="manabrew-artcrop-") as tmp:
    base = Path(tmp)
    art = base / "a"
    art.mkdir()
    for face in (stem, back):
        (art / f"{face}.webp").write_bytes(b"RIFF" + b"\x00" * 2400)
        (art / f"{face}-art.jpg").write_bytes(b"\xff\xd8\xff" + b"\x00" * 2400)
    data = {
        "sample": {
            "id": card_id,
            "name": "Example Commander",
            "image_uris": {"normal": "https://example.invalid/full.jpg", "art_crop": "https://example.invalid/crop.jpg"},
            "card_faces": [
                {},
                {"image_uris": {"normal": "https://example.invalid/back-full.jpg", "art_crop": "https://example.invalid/back-crop.jpg"}},
            ],
        },
    }
    cache = base / "scryfall.json"
    cache.write_text(json.dumps(data))
    deck = {
        "decks": [{"deck": {
            "cards": [{"identity": {"name": "Sample"}, "backFace": {"uris": {}}}],
            "commanders": [],
        }}],
    }
    data["sample"]["name"] = "Sample"
    cache.write_text(json.dumps(data))
    deckfile = base / "personal-decks.json"
    deckfile.write_text(json.dumps(deck))
    result = subprocess.run([sys.executable, str(script), str(base), str(cache)],
                            capture_output=True, text=True, timeout=25)
    assert result.returncode == 0, result.stderr
    installed = json.loads(deckfile.read_text())["decks"][0]["deck"]["cards"][0]
    front = installed["uris"]
    reverse = installed["backFace"]["uris"]
    assert front["normal"] == f"/a/{stem}.webp"
    assert front["art_crop"] == f"/a/{stem}-art.jpg"
    assert reverse["normal"] == f"/a/{back}.webp"
    assert reverse["art_crop"] == f"/a/{back}-art.jpg"
    assert front["normal"] != front["art_crop"]
    assert reverse["normal"] != reverse["art_crop"]
    data["sample"]["image_uris"].pop("art_crop")
    cache.write_text(json.dumps(data))
    missing = subprocess.run([sys.executable, str(script), str(base), str(cache)],
                             capture_output=True, text=True, timeout=10)
    # A missing crop URL must fail immediately, never fall back to a full card.
    assert missing.returncode != 0
    print("IPAD_ART_CROP_PASS", json.dumps({"front": front["art_crop"], "back": reverse["art_crop"]}))
