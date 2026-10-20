#!/usr/bin/env python3
"""Offline structural checks for this repository's Commander deck lists.

Index contract: ordinary inline Markdown links/images and literal decks/...
file/directory mentions in README.md and decks/README.md. This deliberately
does not attempt to implement GitHub Flavored Markdown rendering.
Only the documented offline copy-limit/name exceptions are checked; this is
not a full Oracle, color-identity, ban-list, or Commander-bracket legality check.
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
# Bounded, source-backed snapshot; see deck-card-rules.md before updating.
# None means any number (still subject to the 100-card deck size).
COPY_LIMITS = {
    "Cid, Timeless Artificer": None,
    "Dragon's Approach": None,
    "Hare Apparent": None,
    "Nazgûl": 9,
    "Persistent Petitioners": None,
    "Rat Colony": None,
    "Relentless Rats": None,
    "Seven Dwarves": 7,
    "Shadowborn Apostle": None,
    "Slime Against Humanity": None,
    "Sphinx's Approach": None,
    "Tempest Hawk": None,
    "Templar Knight": None,
}
INTERCHANGEABLE_NAMES = (
    ("Rick, Steadfast Leader", "Greymond, Avacyn's Stalwart"),
    ("Daryl, Hunter of Walkers", "Hansk, Slayer Zealot"),
    ("Glenn, the Voice of Calm", "Gregor, Shrewd Magistrate"),
    ("Michonne, Ruthless Survivor", "Enkira, Hostile Scavenger"),
    ("Negan, the Cold-Blooded", "Malik, Grim Manipulator"),
    ("Lucille", "Gisa's Favorite Shovel"),
    ("Chief Jim Hopper", "Sophina, Spearsage Deserter"),
    ("Dustin, Gadget Genius", "Hargilde, Kindly Runechanter"),
    ("Eleven, the Mage", "Cecily, Haunted Mage"),
    ("Lucas, the Sharpshooter", "Bjorna, Nightfall Alchemist"),
    ("Max, the Daredevil", "Elmar, Ulvenwald Informant"),
    ("Mike, the Dungeon Master", "Othelm, Sigardian Outcast"),
    ("Will the Wise", "Wernog, Rider's Chaplain"),
    ("Mind Flayer, the Shadow", "Arvinox, the Mind Flail"),
    ("Hawkins National Laboratory // The Upside Down",
     "Havengul Laboratory // Havengul Mystery"),
    ("E. Honda, Sumo Champion", "Baldin, Century Herdmaster"),
    ("Ryu, World Warrior", "Vikya, Scorching Stalwart"),
    ("Ken, Burning Brawler", "Aisha of Sparks and Smoke"),
    ("Blanka, Ferocious Friend", "The Howling Abomination"),
    ("Guile, Sonic Soldier", "Immard, the Stormcleaver"),
    ("Zangief, the Red Cyclone", "Maarika, Brutal Gladiator"),
    ("Dhalsim, Pliable Pacifist", "Tadeas, Juniper Ascendant"),
    ("Chun-Li, Countless Kicks", "Zethi, Arcane Blademaster"),
)


def normalized_name(name: str) -> str:
    return unicodedata.normalize("NFC", name.casefold())


# The full DFC import name and its front-face name identify the same card.
NAME_ALIASES = {
    normalized_name(spelling): normalized_name(pair[1].split(" // ")[0])
    for pair in INTERCHANGEABLE_NAMES
    for name in pair
    for spelling in (name, name.split(" // ")[0])
}
BASIC_KEYS = frozenset(normalized_name(name) for name in BASICS)
COPY_LIMIT_KEYS = {normalized_name(name): limit for name, limit in COPY_LIMITS.items()}
CARD = re.compile(r"^([1-9][0-9]*) (.+)$")
# The two indexes use ordinary inline links plus plain deck paths.
INLINE_LINK_START = re.compile(r"\[(?P<label>[^\]\n]*)\]\(\s*")
INLINE_LINK_END = re.compile(
    r"""\s*(?:"[^"\n]*"|'[^'\n]*'|\([^)\n]*\))?\s*\)"""
)
LITERAL_PATH = re.compile(r"(?<![\w/.-])decks/[\w.+/-]+")
EXTERNAL = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
FENCE = re.compile(r"^ {0,3}(\x60{3,}|~{3,})")
LIST_FENCE = re.compile(r"^ {0,3}(?:[-+*]|\d+[.)]) +(?P<rest>.*)$")


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
        key = normalized_name(name)
        key = NAME_ALIASES.get(key, key)
        seen[key] += quantity
        limit = None if key in BASIC_KEYS else COPY_LIMIT_KEYS.get(key, 1)
        if limit is not None and seen[key] > limit:
            raise DeckValidationError(
                f"{path}: duplicate nonbasic card {name!r}: "
                f"{seen[key]} copies, maximum {limit} (including interchangeable names)"
            )
    return cards[0][1]


def visible_index_source(markdown: str) -> str:
    """Ignore fenced examples; scan other text conservatively, including comments."""
    lines: list[str] = []
    fence: tuple[str, int] | None = None
    for line in markdown.splitlines():
        # A fence can start on a Markdown list item ("- \`\`\`python").
        item = LIST_FENCE.match(line)
        candidate = item.group("rest") if item else line
        marker = FENCE.match(candidate)
        if fence is not None:
            if marker:
                run = marker.group(1)
                if run[0] == fence[0] and len(run) >= fence[1] and not candidate[marker.end():].strip():
                    fence = None
            continue
        if marker:
            run = marker.group(1)
            # Backticks in a backtick-fence info string invalidate the opener.
            if run[0] != chr(96) or chr(96) not in candidate[marker.end():]:
                fence = (run[0], len(run))
                continue
        lines.append(line)
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

    # Scan plain destinations with balanced parentheses instead of stopping
    # at the first ")" (and honor backslash-escaped parentheses).
    parts: list[str] = []
    last = 0
    for match in INLINE_LINK_START.finditer(source):
        if match.start() < last:
            continue
        pos = match.end()
        if pos >= len(source):
            continue
        if source[pos] == "<":
            end = source.find(">", pos + 1)
            if end < 0 or "\n" in source[pos:end]:
                continue
            destination, pos = source[pos + 1:end], end + 1
        else:
            begin, depth = pos, 0
            while pos < len(source):
                char = source[pos]
                if char == "\\" and pos + 1 < len(source) and source[pos + 1] != "\n":
                    pos += 2
                elif char == "(":
                    depth += 1
                    pos += 1
                elif char == ")":
                    if depth == 0:
                        break
                    depth -= 1
                    pos += 1
                elif char.isspace():
                    break
                else:
                    pos += 1
            if depth or begin == pos:
                continue
            destination = re.sub(r"\\([\\()])", r"\1", source[begin:pos])
        suffix = INLINE_LINK_END.match(source, pos)
        if suffix is None:
            continue
        record(destination, index.parent)
        parts.extend((source[last:match.start()], match.group("label")))
        last = suffix.end()
    parts.append(source[last:])
    text = "".join(parts)
    # Avoid treating literal external URL path components as local references.
    text = re.sub(r"(?i)(?:https?://|//|www\.)[^\s<>]+", "", text)
    for match in LITERAL_PATH.finditer(text):
        path = match.group().rstrip(".,;:!?)]}\"'")
        # Directory mentions do not need a trailing slash or extension.
        if path:
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
