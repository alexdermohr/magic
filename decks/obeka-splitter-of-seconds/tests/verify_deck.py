#!/usr/bin/env python3
"""Reproduzierbare Obeka-Prüfung. Python-Standardbibliothek; --oracle benötigt Netzwerk."""
from __future__ import annotations

import argparse
import collections
import json
import random
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMMANDER = "Obeka, Splitter of Seconds"
SEED = 20261018
TRIALS = 100_000

# Früh einsetzbare 1-/2-Mana-Rocks (keine späteren Ramp-Effekte).
EARLY_ROCKS = {
    "Sol Ring", "Arcane Signet", "Fellwar Stone",
    "Talisman of Dominance", "Talisman of Indulgence", "Talisman of Creativity",
    "Dimir Signet", "Izzet Signet", "Rakdos Signet",
}
EARLY_EVASION = {
    "Brotherhood Regalia", "Aqueous Form", "Thassa, God of the Sea",
    "Key to the City", "Shizo, Death's Storehouse", "Prowler's Helm",
    "Trailblazer's Boots",
}
HASTE = {
    "Swiftfoot Boots", "Lightning Greaves", "Lavaspur Boots",
    "Ring of Valkas", "Arena of Glory",
}
UPKEEP_PAYOFFS = {
    "Court of Embereth", "Court of Ambition", "Court of Cunning", "Court of Ire",
    "Court of Locthwain", "Court of Vantress",
    "Bonehoard Dracosaur", "Plargg and Nassari", "Twilight Prophet",
    "Dragonmaster Outcast", "Creeping Bloodsucker", "The Scarab God",
    "Stolen Strategy", "Mechanized Production", "Extravagant Replication",
    "Smaug the Magnificent", "Sheoldred, Whispering One",
    "Virtue of Persistence", "Struggle for Project Purity", "Phyrexian Arena",
    "Theater of Horrors", "Chronozoa", "Replicating Ring", "Midnight Clock",
    "Ring of Valkas", "Ring of Evos Isle", "Super Intelligence",
    "Bitterblossom", "Rousing Refrain", "Profane Tutor",
}
COLOR_ID = {"U", "B", "R"}


def read_list(path: Path) -> list[str]:
    names = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw.strip():
            continue
        amount, name = raw.strip().split(" ", 1)
        assert amount == "1" and name, f"Nicht-Singleton: {raw!r}"
        names.append(name)
    assert len(names) == 100, f"{path.name}: {len(names)} statt 100"
    assert len(set(names)) == 100, f"{path.name}: doppelte Karten"
    assert names.count(COMMANDER) == 1 and names[0] == COMMANDER
    return names


def land_names(names: list[str]) -> set[str]:
    # Die Importliste hat die 37 gedruckten Länder am Ende gruppiert.
    assert "Command Tower" in names
    suffix = names[names.index("Command Tower"):]
    assert len(suffix) == 37, f"{len(suffix)} statt 37 feste Länder"
    return set(suffix) | {"Malakir Rebirth"}  # MDFC / Landseite Malakir Mire


def monte_carlo(names: list[str], trials: int) -> dict[str, float]:
    rng = random.Random(SEED)
    deck = [x for x in names if x != COMMANDER]
    lands = land_names(names)
    ctr = collections.Counter()
    for _ in range(trials):
        rng.shuffle(deck)
        h7, t2, t4, t5 = deck[:7], deck[:9], deck[:11], deck[:12]
        opener_lands = sum(x in lands for x in h7)
        mana_t2 = sum(x in lands for x in t2)
        mana_t4 = sum(x in lands for x in t4)
        early_rock = bool(EARLY_ROCKS.intersection(t2))
        # Optimistische Commander-T4-Näherung: Farben, getappte Länder und
        # genaue Mana-Ausgaben werden NICHT simuliert.
        cmd_t4 = mana_t4 >= 4 or (
            mana_t4 >= 3 and mana_t2 >= 2 and early_rock
        )
        evasion = bool(EARLY_EVASION.intersection(t5))
        payoff = bool(UPKEEP_PAYOFFS.intersection(t5))
        haste = bool(HASTE.intersection(t4))
        ctr["2-4 lands opening"] += 2 <= opener_lands <= 4
        ctr["4+ land-sources by T4"] += mana_t4 >= 4
        ctr["nominal mana for commander by T4"] += cmd_t4
        ctr["early evasion accessed by T5"] += evasion
        ctr["upkeep payoff accessed by T5"] += payoff
        ctr["commander+evasion+payoff accessed by T5"] += cmd_t4 and evasion and payoff
        ctr["haste accessed by T4"] += haste
    return {k: round(100 * v / trials, 2) for k, v in ctr.items()}


def oracle_check(names: list[str]) -> None:
    cards = []
    for start in range(0, len(names), 75):
        body = json.dumps({
            "identifiers": [{"name": n} for n in names[start:start + 75]]
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://api.scryfall.com/cards/collection", data=body,
            headers={"Content-Type": "application/json",
                     "Accept": "application/json",
                     "User-Agent": "obeka-deck-validation/1.0"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            payload = json.load(response)
        assert not payload.get("not_found"), payload["not_found"]
        cards.extend(payload["data"])
    resolved = {c["name"].split(" // ")[0]: c for c in cards}
    assert set(resolved) == set(names), "Oracle-Namen passen nicht zur Deckliste"
    assert all(c["legalities"]["commander"] == "legal" for c in cards), "Verbotene Karten"
    assert all(set(c["color_identity"]) <= COLOR_ID for c in cards), "Ungültige Farbidentität"
    changers = sorted(c["name"] for c in cards if c.get("game_changer", False))
    assert len(changers) <= 3, f"Zu viele Game Changer: {changers}"
    print("ORACLE_PASS 100/100 Commander-legal, Grixis, Game Changers:", changers)
    nonland = [c for c in cards if "Land" not in c["type_line"]]
    curve = dict(sorted(collections.Counter(int(c["cmc"]) for c in nonland).items()))
    print("ORACLE_CURVE", curve, "nonland spells", len(nonland),
          "MDFC as virtual land", "Malakir Rebirth" in names)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--oracle", action="store_true",
                        help="Aktuelle Legalität/Oracle/GC live bei Scryfall prüfen")
    parser.add_argument("--trials", type=int, default=TRIALS)
    args = parser.parse_args()
    assert 1 <= args.trials <= 1_000_000
    v1 = read_list(ROOT / "versions/2026-10-18-b3-v1.txt")
    v2 = read_list(ROOT / "versions/2026-10-18-b3-v2.txt")
    v3 = read_list(ROOT / "versions/2026-10-18-b3-v3.txt")
    v4 = read_list(ROOT / "versions/2026-10-18-b3-v4.txt")
    v5 = read_list(ROOT / "versions/2026-10-18-b3-v5.txt")
    current = read_list(ROOT / "current.txt")
    assert v5 == current, "current.txt weicht von dokumentierter V5 ab"
    assert "Ring of Valkas" in UPKEEP_PAYOFFS, "Review-Regression: Ring of Valkas fehlt"
    assert "Ring of Evos Isle" in UPKEEP_PAYOFFS, "Ring of Evos Isle fehlt"
    for label, names in [("v1", v1), ("v2", v2), ("v3", v3), ("v4", v4), ("v5/current", v5)]:
        print(label, f"{len(names)} einzigartige Karten; 37 Länder + MDFC")
        print(json.dumps(monte_carlo(names, args.trials), indent=2, sort_keys=True))
    if args.oracle:
        oracle_check(current)
    print("LOCAL_PASS: Singleton, Versionengleichheit, deterministische Starttest-Statistik")


if __name__ == "__main__":
    main()
