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
# Balanced label brackets must be parsed rather than stopped at the inner ']'.
def inline_link_destination_starts(source: str) -> list[int]:
    """Find inline Markdown destination openings with balanced link labels."""
    stack: list[int] = []
    starts: list[int] = []
    index = 0
    while index < len(source):
        char = source[index]
        if char == "\\" and index + 1 < len(source):
            index += 2  # Escaped brackets do not affect the label stack.
            continue
        if char in "\r\n":
            stack.clear()
        elif char == "[":
            stack.append(index)
        elif char == "]" and stack:
            opening = stack.pop()
            if (
                index > opening + 1
                and index + 1 < len(source)
                and source[index + 1] == "("
            ):
                starts.append(index + 2)
        index += 1
    return starts


# Classify literal deck paths by their preceding whitespace-delimited token.
# Bracketed external URI authorities contain ']', so stripping URLs with
# a single regex can leave their path misidentified as local.
URI_AUTHORITY = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:|//")


def literal_deck_references(content: str) -> list[str]:
    """Find legacy deck paths but never suffixes of external URI tokens."""
    references: list[str] = []
    for match in LINK.finditer(content):
        token_start = max(
            content.rfind(chr(sep), 0, match.start())
            for sep in (9, 10, 13, 32)
        ) + 1
        # Adjacent Markdown links form separate targets without whitespace.
        prefix = content[token_start:match.start()].rsplit("](", 1)[-1]
        if not URI_AUTHORITY.search(prefix):
            references.append(match.group())
    return references


def inline_link_destinations(source: str) -> list[str]:
    """Parse local inline link destinations, including balanced bare parentheses.

    This is deliberately scoped to inline Markdown, not reference-style links
    or a complete CommonMark parser. Validate references only from well-formed
    inline link syntax; ignore malformed fragments and external targets.
    """
    found: list[str] = []
    for start in inline_link_destination_starts(source):
        index = start
        while index < len(source) and source[index] in " \t":
            index += 1
        angle = index < len(source) and source[index] == "<"
        if angle:
            index += 1
        pieces: list[str] = []
        depth = 0
        closed = False
        while index < len(source):
            char = source[index]
            if char in "\r\n":
                break
            if char == "\\" and index + 1 < len(source):
                pieces.append(source[index + 1])
                index += 2
                continue
            if angle and char == ">":
                closed = True
                index += 1
                break
            if angle and char == "<":
                break
            if not angle and char == "(":
                depth += 1
            elif not angle and char == ")":
                if depth == 0:
                    closed = True
                    break
                depth -= 1
            elif not angle and char.isspace() and depth == 0:
                closed = True
                break
            pieces.append(char)
            index += 1
        if not closed or depth or not pieces:
            continue

        # A destination is followed by ')' or an optional quoted/parenthesized
        # Markdown title. Reject an unterminated title or unrelated suffix.
        after = index
        while after < len(source) and source[after] in " \t":
            after += 1
        if after < len(source) and source[after] == ")":
            found.append("".join(pieces))
            continue
        if after == index or after >= len(source) or source[after] not in {chr(34), chr(39), "("}:
            continue
        opening = source[after]
        closing = ")" if opening == "(" else opening
        after += 1
        title_depth = 1
        while after < len(source):
            char = source[after]
            if char in "\r\n":
                break
            if char == "\\" and after + 1 < len(source):
                after += 2
                continue
            if opening == "(" and char == "(":
                title_depth += 1
            if char == closing:
                title_depth -= 1
                if title_depth == 0:
                    after += 1
                    break
            after += 1
        if title_depth:
            continue
        while after < len(source) and source[after] in " \t":
            after += 1
        if after < len(source) and source[after] == ")":
            found.append("".join(pieces))
    return found


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
    deck_root = root / "decks"
    deck_directories = sorted(
        path for path in deck_root.iterdir()
        if path.is_dir() or path.is_symlink()
    )
    if not deck_directories:
        raise DeckValidationError(f"{root}: no current decks")
    deck_files: list[Path] = []
    for directory in deck_directories:
        if directory.is_symlink() or not directory.is_dir():
            raise DeckValidationError(f"{directory}: deck directory must be regular")
        current = directory / "current.txt"
        if current.is_symlink() or not current.is_file():
            raise DeckValidationError(f"{current}: missing regular current.txt")
        deck_files.append(current)
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
        references = [(root, ref) for ref in literal_deck_references(content)]
        for destination in inline_link_destinations(content):
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
