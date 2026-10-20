#!/usr/bin/env python3
"""The Master, Multiplied Bracket-3: local invariant checker; optional live Scryfall Oracle check."""
from __future__ import annotations
import argparse
from collections import Counter
import json
from pathlib import Path
import re
import sys
import urllib.request

ROOT = Path(__file__).resolve().parent
EXPECTED_GC = {"Ancient Tomb", "Demonic Tutor", "Jeska's Will"}
COMMANDER = "The Master, Multiplied"
BASICS = {"Swamp", "Mountain"}
SWAPS_V2_TO_V3 = {
    "Mirage Phalanx": "Redoubled Stormsinger",
    "Warchief Giant": "Goldlust Triad",
    "Mirror Box": "Samut, Hazoret's Champion",
    "Etali, Primal Storm": "Rionya, Fire Dancer",
    "Kardur, Doomscourge": "Heat Shimmer",
    "Firbolg Flutist": "Molten Duplication",
    "Sauron, the Necromancer": "Mimic Vat",
    "Gemstone Caverns": "Hall of Echoes",
}
SWAPS_V3_TO_V4 = {
    "Shared Animosity": "Shredder, Shadow Master",
    "Mimic Vat": "Splinter Twin",
    "Heat Shimmer": "Wheel of Fortune",
    "Rising of the Day": "Brotherhood Regalia",
    "Rogue's Passage": "War Room",
}
SWAPS_V4_TO_V5 = {
    "Grenzo, Havoc Raiser": "Ingris Stingerquill",
    "Feldon of the Third Path": "Saw in Half",
    "Dolmen Gate": "Liquimetal Torque",
    "Feed the Swarm": "Withering Torment",
}
EXPECTED_ROCKS = {
    "Sol Ring", "Arcane Signet", "Rakdos Signet",
    "Talisman of Indulgence", "Fellwar Stone", "Mind Stone",
    "Cursed Mirror", "Liquimetal Torque",
}

def assert_ok(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)

def names(path: Path) -> list[str]:
    lines=path.read_text(encoding="utf-8").splitlines()
    assert_ok(all(re.fullmatch(r"1 .+",row) for row in lines),f"{path}: expected '1 NAME' per line")
    cards=[line.split(" ",1)[1] for line in lines]
    counts=Counter(cards)
    assert_ok(len(cards)==100,f"{path}: {len(cards)} cards, not 100")
    assert_ok(cards[0]==COMMANDER,f"{path}: unexpected commander")
    assert_ok(all(q==1 or card in BASICS for card,q in counts.items()),f"{path}: non-basic singleton violation")
    assert_ok(counts["Swamp"]==3 and counts["Mountain"]==3,f"{path}: basics count differs")
    return cards

def oracle(cards: list[str]) -> dict[str,dict]:
    unique=list(dict.fromkeys(cards))  # Scryfall API may return duplicate basic land identifiers.
    found={}
    for i in range(0,len(unique),75):
        group=unique[i:i+75]
        body=json.dumps({"identifiers":[{"name":c} for c in group]}).encode("utf-8")
        req=urllib.request.Request(
            "https://api.scryfall.com/cards/collection",data=body,
            headers={"User-Agent":"TheMasterB3Validator/5.0 (https://github.com/alexdermohr/magic)",
                     "Accept":"application/json","Content-Type":"application/json"},method="POST")
        with urllib.request.urlopen(req,timeout=20) as res:
            data=json.load(res)
        assert_ok(not data.get("not_found"),f"Unmatched Scryfall names: {data.get('not_found')}")
        for c in data.get("data",[]):
            title=c["name"] if c["name"] in unique else c["name"].split(" // ",1)[0]
            assert_ok(title in unique,f"Unexpected Oracle response: {c['name']}")
            assert_ok(title not in found,f"Duplicate Oracle response: {title}")
            found[title]=c
    assert_ok(set(found)==set(unique),f"Scryfall mismatch: {set(unique)-set(found)}")
    return found

def main() -> int:
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--oracle",action="store_true",help="Fetch live Scryfall legality, color identity, GC flag, and mana curve")
    a=p.parse_args()
    current=names(ROOT/"current.txt")
    v1=names(ROOT/"versions/2026-10-18-b3-v1.txt")
    v2=names(ROOT/"versions/2026-10-18-b3-v2.txt")
    v3=names(ROOT/"versions/2026-10-18-b3-v3.txt")
    v4=names(ROOT/"versions/2026-10-18-b3-v4.txt")
    for required in ["README.md","analysis.md"]:
        assert_ok((ROOT/required).is_file(),f"Missing documentation {required}")
    out23=set(v2)-set(v3)
    in23=set(v3)-set(v2)
    out34=set(v3)-set(v4)
    in34=set(v4)-set(v3)
    out45=set(v4)-set(current)
    in45=set(current)-set(v4)
    assert_ok(out23==set(SWAPS_V2_TO_V3),f"V2 outgoing swap mismatch: {sorted(out23)}")
    assert_ok(in23==set(SWAPS_V2_TO_V3.values()),f"V3 incoming swap mismatch: {sorted(in23)}")
    assert_ok(out34==set(SWAPS_V3_TO_V4),f"V3 outgoing swap mismatch: {sorted(out34)}")
    assert_ok(in34==set(SWAPS_V3_TO_V4.values()),f"V4 incoming swap mismatch: {sorted(in34)}")
    assert_ok(out45==set(SWAPS_V4_TO_V5),f"V4 outgoing swap mismatch: {sorted(out45)}")
    assert_ok(in45==set(SWAPS_V4_TO_V5.values()),f"V5 incoming swap mismatch: {sorted(in45)}")
    assert_ok(len({frozenset(v) for v in [v1,v2,v3,v4,current]})==5,"Historical versions not distinct")
    assert_ok(EXPECTED_ROCKS.issubset(set(current)) and len(EXPECTED_ROCKS)==8,
              "Expected 8 active mana artifacts missing")
    assert_ok(not {"Combat Celebrant","Kiki-Jiki, Mirror Breaker"} & set(current),"Early combo package unexpectedly restored")
    analysis=(ROOT/"analysis.md").read_text(encoding="utf-8")
    for index,card in enumerate(current,1):
        assert_ok(f"| {index} | {card} |" in analysis,
                  f"Active card missing in ordered 100-slot analysis: {index} {card}")
    print("STRUCTURE PASS: 100 cards, 8 mana artifacts, V1-V4 archived, 8/5/4 historical swaps, 100/100 analysis")
    if not a.oracle:
        print("LIVE ORACLE NOT RUN (execute with --oracle)")
        return 0
    found=oracle(current)
    illegals=[n for n,c in found.items() if c["legalities"]["commander"]!="legal"]
    bad_colors=[(n,c["color_identity"]) for n,c in found.items()
                if not set(c["color_identity"]).issubset({"B","R"})]
    absent_gc=[n for n,c in found.items() if "game_changer" not in c]
    gc={n for n,c in found.items() if c.get("game_changer") is True}
    land_names=[n for n,c in found.items() if "Land" in c["type_line"].split(" // ",1)[0].split(" — ",1)[0]]
    actual_lands=sum(current.count(n) for n in land_names)
    nonland_mana=Counter(int(c["cmc"]) for n,c in found.items() if n not in land_names)
    assert_ok(not illegals,f"Commander-illegal cards: {illegals}")
    assert_ok(not bad_colors,f"Off-color cards: {bad_colors}")
    assert_ok(not absent_gc,f"Missing Game Changer flags: {absent_gc}")
    assert_ok(gc==EXPECTED_GC,f"Game Changers: expected {EXPECTED_GC}, found {gc}")
    assert_ok(actual_lands==36,f"Expected 36 lands, found {actual_lands}")
    assert_ok("Malakir Rebirth" in found and "Land" in found["Malakir Rebirth"]["type_line"],
              "Expected dual-faced utility land Malakir Rebirth")
    print(f"ORACLE PASS: live Scryfall: {len(current)} cards, {len(found)} unique names, Commander legal, Rakdos identities")
    print(f"LANDS PASS: {actual_lands} cards with land-front; Malakir Rebirth is a spell/land MDFC")
    print("GAME CHANGERS PASS:",", ".join(sorted(gc)))
    print("NONLAND MANA CURVE (unique cards):",json.dumps(sorted(nonland_mana.items())))
    return 0

if __name__=="__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print("FAIL:",error,file=sys.stderr)
        sys.exit(1)
