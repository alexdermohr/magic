#!/usr/bin/env python3
"""Offline structural checks for this repository's Commander deck lists.

Index contract: ordinary inline Markdown links/images and literal decks/...
file/directory mentions in README.md and decks/README.md. This deliberately
does not attempt to implement GitHub Flavored Markdown rendering.
No Oracle, color-identity, ban-list, or Commander-bracket legality checks.
"""
from __future__ import annotations

from collections import Counter
from pathlib import Path
import re
import sys
import unicodedata
from urllib.parse import unquote

BASICS = frozenset({
    "Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes",
    "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp",
    "Snow-Covered Mountain", "Snow-Covered Forest", "Snow-Covered Wastes",
})
CARD = re.compile(r"^([1-9][0-9]*) (.+)$")
# The two indexes use ordinary inline links plus plain deck paths.
INLINE_LINK = re.compile(
    r'\[(?P<label>[^\]\n]*)\]\(\s*'
    r'(?:<(?P<angle>[^>\n]+)>|(?P<plain>[^\s)]+))'
    r'\s*(?:"[^"\n]*"|\'[^\'\n]*\'|\([^)\n]*\))?\s*\)'
)
LITERAL_PATH = re.compile(r"(?<![\w/.-])decks/[\w.+/-]+")
EXTERNAL = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
FENCE = re.compile(r"^ {0,3}(\x60{3,}|~{3,})")


class DeckValidationError(ValueError):
    """An active deck or documented local repository path is invalid."""


def validate_list(path: Path) -> str:
    """Check the 100-card structural/singleton contract, including commander."""
    if path.is_symlink() or not path.is_file():
        raise DeckValidationError(f"{path}: current.txt must be a regular file")
    cards: list[tuple[int, str]] = []
    headers: list[tuple[str, int]] = []
    for line_number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        if raw in {"Commander", "Deck"}:
            headers.append((raw, len(cards)))
            continue
        match = CARD.fullmatch(raw)
        if match is None or match.group(2) != match.group(2).strip():
            raise DeckValidationError(f"{path}:{line_number}: invalid 'COUNT NAME' line")
        quantity = int(match.group(1))
        if quantity > 100:
            raise DeckValidationError(f"{path}:{line_number}: quantity exceeds 100")
        cards.append((quantity, match.group(2)))

    if headers and headers not in (
        [("Commander", 0), ("Deck", 1)],
        [("Commander", 0), ("Deck", 2)],
    ):
        raise DeckValidationError(f"{path}: section headers must be Commander then Deck")
    if not cards or cards[0][0] != 1:
        raise DeckValidationError(f"{path}: first card must be one commander")
    if headers and headers[1][1] == 2 and cards[1][0] != 1:
        raise DeckValidationError(f"{path}: second commander must have one copy")
    count = sum(quantity for quantity, _ in cards)
    if count != 100:
        raise DeckValidationError(f"{path}: expected 100 cards, found {count}")

    seen: Counter[str] = Counter()
    for quantity, name in cards:
        if name not in BASICS and quantity != 1:
            raise DeckValidationError(f"{path}: nonbasic card {name!r} has quantity {quantity}")
        key = unicodedata.normalize("NFC", name.casefold())
        seen[key] += quantity
        if name not in BASICS and seen[key] != 1:
            raise DeckValidationError(f"{path}: duplicate nonbasic card {name!r}")
    return cards[0][1]


def visible_index_source(markdown: str) -> str:
    """Exclude fenced examples and HTML comments without conflating their delimiters."""
    lines: list[str] = []
    fence: tuple[str, int] | None = None
    in_comment = False
    for line in markdown.splitlines():
        if fence is not None:
            marker = FENCE.match(line)
            if marker:
                run = marker.group(1)
                if run[0] == fence[0] and len(run) >= fence[1] and not line[marker.end():].strip():
                    fence = None
            continue
        if not in_comment:
            marker = FENCE.match(line)
            if marker:
                run = marker.group(1)
                fence = (run[0], len(run))
                continue
        visible: list[str] = []
        pos = 0
        while pos < len(line):
            if in_comment:
                end = line.find("-->", pos)
                if end < 0:
                    break
                in_comment = False
                pos = end + 3
            else:
                start = line.find("<!--", pos)
                if start < 0:
                    visible.append(line[pos:])
                    break
                visible.append(line[pos:start])
                in_comment = True
                pos = start + 4
        lines.append("".join(visible))
    return "\n".join(lines)

def local_index_references(markdown: str, index: Path, root: Path) -> list[Path]:
    """Resolve documented link forms, not arbitrary rendered Markdown text."""
    source = visible_index_source(markdown)
    targets: list[Path] = []

    def record(destination: str, base: Path) -> None:
        destination = destination.strip()
        if not destination or destination.startswith(("#", "//")) or EXTERNAL.match(destination):
            return
        # A percent-encoded # or ? is filename data, not a URI delimiter.
        path = unquote(destination.split("#", 1)[0].split("?", 1)[0])
        if path.startswith("/"):
            targets.append(root / path.lstrip("/"))
        elif path:
            targets.append(base / path)

    def replace_link(match: re.Match[str]) -> str:
        record(match.group("angle") or match.group("plain"), index.parent)
        return match.group("label")

    text = INLINE_LINK.sub(replace_link, source)
    # Avoid treating literal external URL path components as local references.
    text = re.sub(r"(?i)(?:https?://|//|www\.)[^\s<>]+", "", text)
    for match in LITERAL_PATH.finditer(text):
        path = match.group().rstrip(".,;:!?)]}\"'")
        if path.endswith((".txt", ".md", "/")):
            record(path, root)
    return targets


def validate_repository(root: Path) -> list[str]:
    root = root.resolve(strict=True)
    deck_root = root / "decks"
    if not deck_root.is_dir():
        raise DeckValidationError(f"{deck_root}: missing deck directory")
    directories = sorted(p for p in deck_root.iterdir() if p.is_dir() or p.is_symlink())
    if not directories:
        raise DeckValidationError(f"{root}: no current decks")
    summaries: list[str] = []
    for directory in directories:
        if directory.is_symlink() or not directory.is_dir():
            raise DeckValidationError(f"{directory}: deck directory must be regular")
        current = directory / "current.txt"
        if current.is_symlink() or not current.is_file():
            raise DeckValidationError(f"{current}: missing regular current.txt")
        summaries.append(f"{current.relative_to(root)}: 100 cards; {validate_list(current)}")
    for index in (root / "README.md", deck_root / "README.md"):
        if index.is_symlink() or not index.is_file():
            raise DeckValidationError(f"{index}: missing regular Markdown index")
        references = local_index_references(index.read_text(encoding="utf-8"), index, root)
        for path in references:
            if (not path.resolve().is_relative_to(root)
                    or not (path.is_file() or path.is_dir())):
                raise DeckValidationError(f"{index}: missing local reference {path}")
    return summaries


def main() -> int:
    try:
        for summary in validate_repository(Path(__file__).resolve().parents[1]):
            print(summary)
    except (DeckValidationError, OSError, UnicodeError) as exc:
        print(f"Deck validation failed: {exc}", file=sys.stderr)
        return 1
    print("PASS: structural 100-card and documented index-reference checks; NOT Oracle legality")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
