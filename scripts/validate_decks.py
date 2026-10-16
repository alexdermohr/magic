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
# Do not match a .md/.txt prefix of a longer filename (e.g. .md.bak).
# A solitary trailing period is prose punctuation and still ends the path.
LINK = re.compile(r"decks/[A-Za-z0-9_./-]+\.(?:md|txt)(?![\w/~+-]|\.[\w-])")


# Mistune 3.3.4 is checked in as auditable Python source with an upstream
# wheel hash and license; CI never installs dependencies or fetches the network.
_VENDOR_ROOT = Path(__file__).resolve().parent / "_vendor"
_MARKDOWN_AST = None



def gfm_table_plugin(md) -> None:
    """Match GitHub-style table delimiters and pad/drop uneven body cells.

    The pinned Mistune table plugin allows one-hyphen headers and rejects
    uneven rows. Both differ from GitHub Flavored Markdown link rendering.
    Keep its token shapes and safe escaped-pipe splitter without editing
    verified upstream vendor source.
    """
    from mistune.plugins.table import (
        TABLE_PATTERN, NP_TABLE_PATTERN, _parse_invalid_pipe_table,
        _is_escaped_pipe, _process_thead, _split_table_cells,
    )

    def strip_gfm_table_row(line, *, require_pipe=False):
        """Normalize edge pipes and indentation in a GFM table row.

        Only 0–3 initial spaces are allowed at the current block depth.
        Header/delimiter lines require a pipe; established body rows do not.
        Mistune invokes this parser inside the relevant list/quote container.
        """
        raw = line.rstrip("\r\n").rstrip(" \t")
        indent = len(raw) - len(raw.lstrip(" "))
        if indent > 3:
            return None
        text = raw[indent:]
        if not text or text.startswith("\t") or (require_pipe and "|" not in text):
            return None
        if text.startswith("|"):
            text = text[1:]
        if text.endswith("|") and not _is_escaped_pipe(text, len(text) - 1):
            text = text[:-1]
        return text

    def parse_table(block, match, state, *, piped):
        header = strip_gfm_table_row(match.group(0), require_pipe=True)
        if header is None:
            return None
        pos = match.end()
        delimiter_line = state.get_line(pos)
        delimiter = strip_gfm_table_row(delimiter_line, require_pipe=True)
        if delimiter is None:
            return None
        # GFM requires >=3 dashes per delimiter, optional outer colons.
        delimiter_cells = _split_table_cells(delimiter)
        valid = delimiter_cells and all(
            re.fullmatch(r":?-{3,}:?", cell.strip()) is not None
            for cell in delimiter_cells
        )
        if not valid:
            return (_parse_invalid_pipe_table(state, pos + len(delimiter_line))
                    if piped else None)
        thead, aligns = _process_thead(header, delimiter)
        if not thead or aligns is None:
            return (_parse_invalid_pipe_table(state, pos + len(delimiter_line))
                    if piped else None)
        pos += len(delimiter_line)
        rows = []
        while pos < state.cursor_max:
            line = state.get_line(pos)
            # A GFM table ends when a new block starts. The presence of a
            # pipe in a fenced-code info string must not swallow the fence:
            # doing so exposes the following code example as a live link.
            if any(re.match(block.SPECIFICATION[kind], line) for kind in (
                "fenced_code", "atx_heading", "thematic_break",
                "block_quote", "list", "raw_html", "ref_link",
            )):
                break
            text = strip_gfm_table_row(line)
            if text is None:
                break
            # GFM ignores excess cells and pads missing cells with blanks.
            cells = (_split_table_cells(text) + [""] * len(aligns))[:len(aligns)]
            rows.append({
                "type": "table_row",
                "children": [
                    {"type": "table_cell", "text": text,
                     "attrs": {"align": aligns[i], "head": False}}
                    for i, text in enumerate(cells)
                ],
            })
            pos += len(line)
        state.append_token({
            "type": "table",
            "children": [thead, {"type": "table_body", "children": rows}],
        })
        return pos

    md.block.register(
        "table", TABLE_PATTERN,
        lambda block, match, state: parse_table(block, match, state, piped=True),
        before="paragraph",
    )
    md.block.register(
        "nptable", NP_TABLE_PATTERN,
        lambda block, match, state: parse_table(block, match, state, piped=False),
        before="paragraph",
    )


def rendered_markdown_references(source: str) -> list[tuple[bool, str]]:
    """Return (literal-root-path, destination) for rendered Markdown references.

    AST link and image nodes carry real URLs, including reference-style links.
    Raw HTML, comments, fenced/indented code, and code spans are not rendered
    Markdown links; only literal paths in rendered text remain root-relative.
    """
    import importlib

    if not _VENDOR_ROOT.is_dir() or _VENDOR_ROOT.is_symlink():
        raise DeckValidationError("offline Markdown parser source is missing")
    if str(_VENDOR_ROOT) not in sys.path:
        sys.path.insert(0, str(_VENDOR_ROOT))
    mistune = importlib.import_module("mistune")
    if (
        getattr(mistune, "__version__", None) != "3.3.4"
        or not Path(mistune.__file__).resolve().is_relative_to(_VENDOR_ROOT)
    ):
        raise DeckValidationError("offline Markdown parser has an unexpected identity")

    from mistune.plugins.table import table_in_quote, table_in_list
    from mistune.plugins.url import parse_url_link
    def gfm_url_plugin(md):
        md.inline.register("url_link", GFM_URL_AUTOLINK_PATTERN, parse_url_link)

    # Raw extended autolinks belong to GFM's URI span, including interior
    # commas/semicolons. Do not reinterpret a URL suffix as a local file.
    ast = mistune.create_markdown(
        renderer="ast",
        plugins=[gfm_table_plugin, table_in_quote, table_in_list, gfm_url_plugin],
    )(source)
    found: list[tuple[bool, str]] = []

    def visit(tokens: list[dict]) -> None:
        for token in tokens:
            kind = token.get("type")
            if kind in {"link", "image"}:
                destination = token.get("attrs", {}).get("url")
                if isinstance(destination, str):
                    found.append((False, destination))
            elif kind == "text":
                for reference in literal_deck_references(token.get("raw", "")):
                    found.append((True, reference))
            children = token.get("children")
            if isinstance(children, list):
                visit(children)

    visit(ast)
    return found


# Bare mentions like decks/name/current.txt remain repository-root relative;
# Markdown links use the directory containing their index. No bare suffix of
# an external URL is a local reference.
URI_AUTHORITY = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:|//")
# GFM autolinks require a dotted domain with no underscore in its final two labels.
# The pinned Mistune URL plugin is more permissive and can hide literal deck paths.
GFM_HTTP_DOMAIN = r"(?:[A-Za-z0-9_-]+\.)*[A-Za-z0-9-]+\.[A-Za-z0-9-]+(?![A-Za-z0-9_-])"
GFM_URL_AUTOLINK_PATTERN = r"https?://" + GFM_HTTP_DOMAIN + r"(?:[^\s<]*[^<.,:;\"')\]\s])?"
GFM_HTTP_PREFIX = re.compile(r"^https?://" + GFM_HTTP_DOMAIN, re.IGNORECASE)
GFM_HTTP_START = re.compile(r"^https?://", re.IGNORECASE)
GFM_EMAIL_START = re.compile(r"^(?:mailto|xmpp):", re.IGNORECASE)
# GFM allows www.-autolinks only at the beginning of a token or after these
# explicit inline delimiters. The final two domain labels may not contain "_".
GFM_WWW_AUTHORITY = re.compile(
    r"(?:^|[*_~(])www\.([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+)"
)


def gfm_www_autolink_prefix(prefix: str) -> bool:
    for match in GFM_WWW_AUTHORITY.finditer(prefix):
        labels = match.group(1).split(".")
        if ("_" not in labels[-1] and "_" not in labels[-2]
                and "<" not in prefix[match.end():]):
            return True
    return False


def literal_deck_references(content: str) -> list[str]:
    references: list[str] = []
    for match in LINK.finditer(content):
        if match.start() and (
            content[match.start() - 1].isalnum()
            or content[match.start() - 1] in "_/.-"
        ):
            continue
        token_start = max(
            content.rfind(chr(sep), 0, match.start())
            for sep in (9, 10, 13, 32)
        ) + 1
        prefix = content[token_start:match.start()].rsplit("](", 1)[-1]
        # A bare URL's interior punctuation is part of the autolink;
        # only a true whitespace/punctuation-separated local text token
        # is a repository-root mention. URL children remain exempt.
        candidate = prefix.lstrip("*_~(")
        # The mailto:/xmpp: email grammar ends before a separate bare path.
        if (GFM_EMAIL_START.match(candidate)
                or (GFM_HTTP_START.match(candidate)
                    and not GFM_HTTP_PREFIX.match(candidate))
                or not (URI_AUTHORITY.search(prefix)
                        or gfm_www_autolink_prefix(prefix))):
            references.append(match.group())
    return references


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

    if headers and headers not in (
        [("Commander", 0), ("Deck", 1)],
        [("Commander", 0), ("Deck", 2)],
    ):
        raise DeckValidationError(f"{path}: section headers must be Commander then Deck")
    if not cards or cards[0][0] != 1:
        raise DeckValidationError(f"{path}: exactly one first-card commander required")
    if headers and headers[1][1] == 2 and cards[1][0] != 1:
        raise DeckValidationError(f"{path}: second commander must have exactly one copy")
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
        # AST nodes represent rendered links and images, whereas literal
        # historical deck paths are scanned only in rendered Markdown text.
        references: list[tuple[Path, str]] = []
        for literal, destination in rendered_markdown_references(
            index.read_text(encoding="utf-8")
        ):
            if literal:
                references.append((root, destination))
                continue
            decoded = destination  # Mistune AST URLs are already CommonMark entity-decoded.
            if (decoded.startswith(("#", "//"))
                    or re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", decoded)):
                continue
            local_path = unquote(decoded.split("#", 1)[0].split("?", 1)[0])
            if local_path.startswith("/"):
                references.append((root, local_path.lstrip("/")))
            elif local_path:
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