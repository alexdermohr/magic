#!/usr/bin/env python3
"""Read-only Mishra B3 invariant checker. Optional --oracle fetches Scryfall's live card data."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EXPECTED_GC = {"Demonic Tutor", "Mana Vault", "Bolas's Citadel"}
# Explicitly excluded sweepers from erweiterter-kreis.md; not an exhaustive semantic wipe classifier.
EXPLICITLY_EXCLUDED_WIPES = {"Blasphemous Act", "The Meathook Massacre", "Karn's Sylex", "Toxic Deluge"}
EXPECTED_ROCKS = {
    "Sol Ring", "Arcane Signet", "Fellwar Stone",
    "Dimir Signet", "Izzet Signet", "Rakdos Signet",
    "Talisman of Dominance", "Talisman of Creativity", "Talisman of Indulgence",
    "Mind Stone", "Liquimetal Torque", "Mox Opal", "Mana Vault",
}
BASELINE_B4_BLOB = "bab5a7b03416b77112c0ccaeec7aa3297fbd9a4d"
USER_AGENT = "MishraB3Validator/1.0 (https://github.com/alexdermohr/magic)"


def assert_ok(test: bool, message: str) -> None:
    if not test:
        raise ValueError(message)


def names_and_docs() -> list[str]:
    deck = ROOT.joinpath("current.txt").read_text(encoding="utf-8").splitlines()
    assert_ok(all(re.match(r"^1 .+$", line) for line in deck), "deck row is not '1 NAME'")
    names = [line.split(" ", 1)[1].strip() for line in deck]
    assert_ok(len(names) == 100 and len(set(names)) == 100, "not 100 distinct cards")
    assert_ok(names[0] == "Mishra, Eminent One", "unexpected commander")
    root_readme = ROOT.parent.parent.joinpath("README.md").read_text(encoding="utf-8")
    mishra_summaries = re.findall(r"^- Mishra: \*\*Bracket 3[^\n]+$", root_readme, re.MULTILINE)
    assert_ok(len(mishra_summaries) == 1, "root README must contain exactly one current Mishra B3 summary")
    for required in ("100 verschiedene Karten", "35 Länder", "47 Artefakte",
                     f"{len(EXPECTED_ROCKS)} Mana-Artefakte", "drei Game Changer"):
        assert_ok(required in mishra_summaries[0],
                  f"root README Mishra summary stale or incomplete: {required}")
    gc_summary = re.search(r"genau drei Game Changer\*\* \(\*\*([^*]+)\*\*\)", mishra_summaries[0])
    assert_ok(gc_summary is not None, "root README Game Changer summary not found")
    gc_names = {name.strip() for name in gc_summary.group(1).split(",")}
    assert_ok(gc_names == EXPECTED_GC, "root README Game Changers do not match current deck")
    matrix = ROOT.joinpath("replaceability.md").read_text(encoding="utf-8").splitlines()
    rated = [
        m.group(1).strip()
        for line in matrix
        if (m := re.match(r"^\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*\*\*[1-5]\*\*", line))
    ]
    assert_ok(len(rated) == 100 and Counter(rated) == Counter(names),
              "replaceability matrix does not contain precisely 100 active names")
    extra = ROOT.joinpath("erweiterter-kreis.md").read_text(encoding="utf-8")
    assert_ok("## A. Früher in Mishra B3" in extra and
              "## B. Konkret geprüft" in extra and
              "## Gegenwärtige Testreihenfolge" in extra,
              "extended circle section boundaries missing")
    section_a = extra.split("## A. ", 1)[1].split("## B. ", 1)[0]
    section_b = extra.split("## B. ", 1)[1].split("## Gegenwärtige Testreihenfolge", 1)[0]
    pattern = r"^\|\s*\*\*(.*?)\*\*\s*\|"
    historic = re.findall(pattern, section_a, re.MULTILINE)
    alternatives = re.findall(pattern, section_b, re.MULTILINE)
    assert_ok(len(historic) == 40, f"expected 40 historical cuts, found {len(historic)}")
    assert_ok(len(alternatives) == 95, f"expected 95 external candidates, found {len(alternatives)}")
    outside = historic + alternatives
    assert_ok(len(outside) == 135 and len(set(outside)) == 135,
              "extended circle must contain 135 unique excluded names")
    assert_ok(not (set(outside) & set(names)), "excluded card still active")
    blob = ROOT.joinpath("versions/2026-10-07-optimized-b4-v1.txt").read_bytes()
    blobsha = hashlib.sha1(b"blob " + str(len(blob)).encode() + b"\0" + blob).hexdigest()
    assert_ok(blobsha == BASELINE_B4_BLOB, "bracket 4 baseline was modified")
    assert_ok(EXPECTED_GC.issubset(set(names)), "required Game Changer removed")
    assert_ok(EXPECTED_ROCKS.issubset(set(names)), "one of 13 required mana artifacts removed")
    assert_ok(not (EXPLICITLY_EXCLUDED_WIPES & set(names)),
              "explicitly excluded creature/permanent sweeper present")
    print(f"STRUCTURE PASS: 100 singleton / matrix 100 / extended {len(historic)} historical + {len(alternatives)} alternatives = {len(outside)} disjoint / B4 blob unchanged")
    return names


def get_json(req: urllib.request.Request) -> dict:
    with urllib.request.urlopen(req, timeout=15) as response:
        return json.load(response)


def fetch_oracle(names: list[str]) -> dict[str, dict]:
    cards: dict[str, dict] = {}
    for begin in range(0, len(names), 75):
        group = names[begin : begin + 75]
        data = json.dumps({"identifiers": [{"name": x} for x in group]}).encode("utf-8")
        req = urllib.request.Request(
            "https://api.scryfall.com/cards/collection",
            data=data,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        page = get_json(req)
        assert_ok(not page.get("not_found"), f"Scryfall unmatched: {page.get('not_found')}")
        for card in page.get("data", []):
            title = card["name"].split(" // ", 1)[0]
            assert_ok(title not in cards, f"duplicate Oracle result: {title}")
            cards[title] = card
    assert_ok(set(cards) == set(names),
              f"Scryfall mismatch: missing={set(names) - set(cards)}, extra={set(cards) - set(names)}")
    return cards


def run_oracle(names: list[str]) -> None:
    cards = fetch_oracle(names)
    bad_legality = [
        n for n, card in cards.items()
        if card.get("legalities", {}).get("commander") != "legal"
    ]
    wrong_colors = [
        (n, card.get("color_identity"))
        for n, card in cards.items()
        if not set(card.get("color_identity", ())).issubset({"U", "B", "R"})
    ]
    no_gc_flag = [n for n, card in cards.items() if "game_changer" not in card]
    gc = {n for n, card in cards.items() if card.get("game_changer") is True}
    lands = [n for n, card in cards.items() if "Land" in card.get("type_line", "").split(" — ")[0]]
    artifacts = [n for n, card in cards.items() if "Artifact" in card.get("type_line", "").split(" — ")[0]]
    assert_ok(not bad_legality, f"not Commander legal: {bad_legality}")
    assert_ok(not wrong_colors, f"outside Grixis: {wrong_colors}")
    assert_ok(not no_gc_flag, f"missing live game_changer flags: {no_gc_flag}")
    assert_ok(gc == EXPECTED_GC, f"Game Changer set differs: {sorted(gc)}")
    assert_ok(len(lands) == 35, f"lands {len(lands)} not 35")
    assert_ok(len(artifacts) == 47, f"artifacts {len(artifacts)} not 47")
    assert_ok(len(EXPECTED_ROCKS & set(names)) == 13, "mana artifacts not 13")
    print("SCRYFALL PASS: 100 names Commander-legal; Grixis color identities")
    print("COUNTS PASS: 35 lands; 47 artifacts; 13 named mana rocks; 3 Game Changers")
    print("GAME CHANGERS:", ", ".join(sorted(gc)))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--oracle", action="store_true", help="Validate all 100 cards against live Scryfall data")
    args = parser.parse_args()
    try:
        names = names_and_docs()
        if args.oracle:
            run_oracle(names)
        else:
            print("Live Oracle check NOT RUN (use --oracle).")
    except (ValueError, OSError, urllib.error.URLError, KeyError, json.JSONDecodeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())