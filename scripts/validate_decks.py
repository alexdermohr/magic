#!/usr/bin/env python3
"""Deterministic offline Commander decklist structure checks.

Not a proof of legality, color identity, ban lists or Commander brackets.
"""
from __future__ import annotations
from collections import Counter
from pathlib import Path
import re
import sys
from urllib.parse import unquote

BASICS = frozenset({
    "Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
    "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp",
    "Snow-Covered Mountain", "Snow-Covered Forest",
})
CARD = re.compile(r"^([1-9][0-9]*) (.+)$")
LINK = re.compile(r"decks/[A-Za-z0-9_./-]+\.(?:md|txt)")
# Inline Markdown destinations may have optional quoted titles.
MARKDOWN_LINK = re.compile(
    r"""\[[^\]]+\]\(\s*(?:<([^<>]*)>|([^\s)>]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)"""
)
# Exclude URLs from the legacy literal deck-path scan, including raw prose URLs.
EXTERNAL_URL = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*://[^\s)\]>]+")


class DeckValidationError(ValueError):
    """A deck or documented local reference violates the file contract."""


def validate_list(path: Path) -> str:
    """Return the first card only after verifying a 100-card singleton list."""
    if path.is_symlink() or not path.is_file():
        raise DeckValidationError(f"{path}: current.txt must be regular")
    cards: list[tuple[int, str]] = []
    headers: list[tuple[str, int]] = []
    for line_number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        if raw in {"Commander", "Deck"}:
            headers.append((raw, len(cards)))
            continue
        m = CARD.fullmatch(raw)
        if m is None or m.group(2).strip() != m.group(2):
            raise DeckValidationError(f"{path}:{line_number}: invalid 'COUNT NAME' line")
        quantity, name = int(m.group(1)), m.group(2)
        if quantity > 100:
            raise DeckValidationError(f"{path}:{line_number}: quantity exceeds 100")
        cards.append((quantity, name))

    if headers and headers != [("Commander", 0), ("Deck", 1)]:
        raise DeckValidationError(f"{path}: section headers must be Commander then Deck")
    if not cards or cards[0][0] != 1:
        raise DeckValidationError(f"{path}: exactly one first-card commander required")
    total = sum(quantity for quantity, _ in cards)
    if total != 100:
        raise DeckValidationError(f"{path}: expected 100 cards, found {total}")

    seen: Counter[str] = Counter()
    for quantity, name in cards:
        if name not in BASICS and quantity != 1:
            raise DeckValidationError(f"{path}: nonbasic card {name!r} has quantity {quantity}")
        seen[name.casefold()] += quantity
        if name not in BASICS and seen[name.casefold()] != 1:
            raise DeckValidationError(f"{path}: duplicate nonbasic card {name!r}")
    return cards[0][1]


def validate_repository(root: Path) -> list[str]:
    """Check active lists, inline local Markdown links and literal deck file references."""
    root = root.resolve(strict=True)
    deck_files = sorted((root / "decks").glob("*/current.txt"))
    if not deck_files:
        raise DeckValidationError(f"{root}: no current decks")
    summaries: list[str] = []
    for path in deck_files:
        if not path.resolve().is_relative_to(root):
            raise DeckValidationError(f"{path}: escapes repository")
        summaries.append(f"{path.relative_to(root)}: 100 cards; {validate_list(path)}")
    for index in (root / "README.md", root / "decks" / "README.md"):
        if index.is_symlink() or not index.is_file():
            raise DeckValidationError(f"{index}: missing regular Markdown index")
        content = index.read_text(encoding="utf-8")
        # Historical literal paths are rooted at the repository, while Markdown
        # links are relative to the index that actually contains each link.
        references = [(root, ref) for ref in LINK.findall(EXTERNAL_URL.sub("", content))]
        for angle_target, ordinary_target in MARKDOWN_LINK.findall(content):
            destination = angle_target or ordinary_target
            if (destination.startswith(("#", "//"))
                    or re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", destination)):
                continue  # anchors and external URLs do not denote repo files
            local_path = unquote(destination.split("#", 1)[0].split("?", 1)[0])
            if local_path:
                references.append((index.parent, local_path))
        for base, reference in references:
            target = base / reference
            if (not target.resolve().is_relative_to(root)
                    or not (target.is_file() or target.is_dir())):
                raise DeckValidationError(f"{index}: missing local reference {reference}")
    return summaries


def main() -> int:
    try:
        for summary in validate_repository(Path(__file__).resolve().parents[1]):
            print(summary)
    except (DeckValidationError, OSError, UnicodeError) as exc:
        print(f"Deck validation failed: {exc}", file=sys.stderr)
        return 1
    print("PASS: structural 100-card and local-reference contracts; NOT an Oracle legality check")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
