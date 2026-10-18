#!/usr/bin/env python3
"""Deterministic offline Commander decklist structure checks.

Not a proof of legality, color identity, ban lists or Commander brackets.
"""
from __future__ import annotations
from bisect import bisect_left
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
# Do not match a .md/.txt prefix of a longer filename (e.g. .md.bak).
# A solitary trailing period is prose punctuation and still ends the path.
# Only unescaped terminal punctuation can be treated as prose after .md/.txt.
_PROSE_TRAILING_PUNCT = frozenset(".,;:!?)]}>") | {chr(39), chr(34)}
_DECK_EXTENSIONS = re.compile(r"\.(?:md|txt)")


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
        TABLE_PATTERN, NP_TABLE_PATTERN,
        _is_escaped_pipe, _process_thead, _split_table_cells,
    )
    from mistune.core import BlockState

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

    def begins_real_block(block, state, pos, line):
        # A block-specification regex may match an inline tag at the start
        # of a valid GFM table cell. Only end the table if the actual pinned
        # HTML block parser accepts the candidate in an isolated state.
        if any(re.match(block.SPECIFICATION[kind], line) for kind in (
            "atx_heading", "thematic_break", "block_quote", "list",
        )):
            return True
        fence_spec = block.SPECIFICATION["fenced_code"]
        if re.match(fence_spec, line) is not None:
            trial = BlockState()
            # Classification needs only the current candidate line. Copying
            # the suffix for each table row grows quadratically.
            trial.process(line)
            candidate = re.match(fence_spec, trial.src, re.M)
            if candidate is not None and block.parse_fenced_code(candidate, trial) is not None:
                return True
        # GFM reference definitions are paragraph constructs, not a new
        # block that can interrupt an established table's body rows.
        html_spec = block.SPECIFICATION["raw_html"]
        if re.match(html_spec, line) is None:
            return False
        trial = BlockState()
        # HTML block eligibility is decided by the opener on this line;
        # never copy the entire table tail for each rejected candidate.
        trial.process(line)
        candidate = re.match(html_spec, trial.src)
        return (candidate is not None
                and block.parse_raw_html(candidate, trial) is not None)

    def parse_table(block, match, state, *, piped):
        # Lazy container continuation lines can extend paragraphs, not GFM tables.
        if match.start() in state.lazy_line_starts:
            return None
        header = strip_gfm_table_row(match.group(0), require_pipe=True)
        if header is None:
            return None
        pos = match.end()
        if pos in state.lazy_line_starts:
            return None
        delimiter_line = state.get_line(pos)
        delimiter = strip_gfm_table_row(delimiter_line, require_pipe=True)
        if delimiter is None:
            return None
        # GFM permits one or more dashes per delimiter, optional colons.
        delimiter_cells = _split_table_cells(delimiter)
        valid = delimiter_cells and all(
            re.fullmatch(r":?-+:?", cell.strip()) is not None
            for cell in delimiter_cells
        )
        if not valid:
            return None
        thead, aligns = _process_thead(header, delimiter)
        if not thead or aligns is None:
            return None
        pos += len(delimiter_line)
        rows = []
        while pos < state.cursor_max:
            if pos in state.lazy_line_starts:
                break
            line = state.get_line(pos)
            # A GFM table ends when a new block starts. The presence of a
            # pipe in a fenced-code info string must not swallow the fence:
            # doing so exposes the following code example as a live link.
            if begins_real_block(block, state, pos, line):
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



def gfm_strikethrough_plugin(md) -> None:
    """Support GFM's one- and two-tilde strikethrough without editing Mistune."""
    from mistune.plugins.formatting import strikethrough

    strikethrough(md)  # Keep the pinned rule and output conventions.

    def parse_tildes(inline, match, state, marker):
        source = state.src
        opening = match.start()
        backslashes = 0
        cursor = opening - 1
        while cursor >= 0 and source[cursor] == "\\":
            backslashes += 1
            cursor -= 1
        if backslashes % 2:
            return None
        start = match.end()
        cache_key = (id(source), marker)
        cached = state.formatting_no_end.get(cache_key)
        if cached is not None and cached[0] is source and start <= cached[1]:
            return None
        # A closer inside an opaque inline token must not terminate the
        # deletion. Search the full source, not just through the closer:
        # angle autolinks and HTML tags require their final ">" to match.
        closer_pattern = re.compile(r"(?<!~)" + re.escape(marker) + r"(?!~)")
        rules = [
            "escape", "codespan", "link", "auto_link", "auto_email",
            "inline_html",
        ]
        # The GFM URL plugin is available in production but not required
        # when this formatting plugin is tested standalone.
        if "url_link" in inline.specification:
            rules.append("url_link")
        if "www_link" in inline.specification:
            rules.append("www_link")
        special_rules = inline.compile_sc(rules)
        scan = start
        special = special_rules.search(source, scan)
        closing = closer_pattern.search(source, scan)
        while closing is not None:
            if special is not None and special.start() < closing.start():
                if special.lastgroup == "codespan":
                    probe = state.copy()
                    probe.src = source
                    end_of_code = inline.parse_codespan(special, probe)
                    if probe.tokens[-1]["type"] == "codespan":
                        scan = end_of_code
                        if scan > closing.start():
                            closing = closer_pattern.search(source, scan)
                        special = special_rules.search(source, scan)
                        continue
                if special.lastgroup == "link":
                    probe = state.copy()
                    probe.src = source
                    end_of_link = inline.parse_link(special, probe)
                    if end_of_link is not None:
                        scan = end_of_link
                        if scan > closing.start():
                            closing = closer_pattern.search(source, scan)
                        special = special_rules.search(source, scan)
                        continue
                scan = special.end()
                if scan > closing.start():
                    closing = closer_pattern.search(source, scan)
                special = special_rules.search(source, scan)
                continue

            end = closing.start()
            scan = closing.end()
            closing = closer_pattern.search(source, scan)
            if end <= start or source[end - 1].isspace():
                continue
            cursor = end - 1
            backslashes = 0
            while cursor >= start and source[cursor] == "\\":
                backslashes += 1
                cursor -= 1
            if backslashes % 2:
                continue
            content = source[start:end]
            if re.search(r"\n[ \t]*\n", content):
                return None
            nested = state.copy()
            nested.src = content
            state.append_token({
                "type": "strikethrough",
                "children": inline.render(nested),
            })
            return end + len(marker)
        state.formatting_no_end[cache_key] = (source, len(source))
        return None

    def parse_single_tilde(inline, match, state):
        return parse_tildes(inline, match, state, "~")

    def parse_double_tilde(inline, match, state):
        return parse_tildes(inline, match, state, "~~")

    # Override the pinned double-tilde closer only for token-aware matching.
    # Preserve its token name and registration order; vendored bytes stay fixed.
    md.inline.register(
        "strikethrough",
        r"~~(?=[^\s~])",
        parse_double_tilde,
        before="link",
    )
    md.inline.register(
        "gfm_single_strikethrough",
        r"~(?<!~~)(?=[^\s~])",
        parse_single_tilde,
        before="strikethrough",
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
    from mistune.plugins.footnotes import footnotes
    from mistune import list_parser
    from mistune.plugins.url import parse_url_link
    def gfm_url_plugin(md):
        md.inline.register("url_link", GFM_URL_AUTOLINK_PATTERN, parse_url_link)

        def parse_www_link(inline, match, state):
            # GFM makes the complete bare www. span one link token. Parsing
            # its interior as Markdown could invent local destinations.
            raw = match.group(0)
            state.append_token({
                "type": "link",
                "children": [{"type": "text", "raw": raw}],
                "attrs": {"url": "http://" + raw},
            })
            return match.end()

        md.inline.register("www_link", GFM_WWW_AUTOLINK_PATTERN, parse_www_link)

    # Raw extended autolinks belong to GFM's URI span, including interior
    # commas/semicolons. Do not reinterpret a URL suffix as a local file.
    # Mistune 3.3.4 rejects escaped punctuation in <angle-link> targets,
    # even though CommonMark permits it. Override only during this parse;
    # the vendored source and its provenance remain unchanged.
    from mistune import helpers
    from string import punctuation
    def gfm_angle_link_href(text, opening):
        begin = opening + 1
        pos = begin
        while pos < len(text):
            char = text[pos]
            if char == "\\" and pos + 1 < len(text) and text[pos + 1] in punctuation:
                pos += 2
                continue
            if char == ">":
                return text[begin:pos], pos + 1
            if char in "<\n\r\x00":
                return None, None
            pos += 1
        return None, None
    # GFM permits 999-character reference labels; pinned Mistune 3.3.4
    # limits both inline lookup and block definitions to 500. Change only
    # this parsing window, keeping the checked-in vendor bytes untouched.
    from mistune.block_parser import BlockParser
    gfm_label = r"(?:[^\\\[\]]|\\.){0,999}"

    class SourceBoundLabelPattern:
        """The regex counts escapes as tokens; GFM limits source characters."""

        def __init__(self, pattern):
            self.pattern = pattern

        def match(self, text, pos=0):
            candidate = self.pattern.match(text, pos)
            return (candidate if candidate is not None
                    and len(candidate.group(0)) - 1 <= 999 else None)

    def parse_gfm_ref_link(block, match, state):
        if len(match.group("reflink_1")) > 999:
            return None
        return BlockParser.parse_ref_link(block, match, state)

    # Mistune retains lazy-line origins for quotes, but list-item extraction
    # discards that flag. Recover only the unindented child line starts from
    # the consumed original lines; GFM tables cannot continue lazily.
    original_list_item = list_parser._parse_list_item

    def parse_gfm_list_item(block, bullet, item, token, state, rules):
        start_cursor = state.cursor
        first, continue_width = list_parser._compile_continue_width(
            item.text, item.leading_width
        )
        original_child_state = state.child_state

        def list_child_state(src, lazy_line_starts=None):
            child = original_child_state(src, lazy_line_starts)
            if src.startswith(first):
                offset = len(first)
                consumed = state.src[start_cursor:state.cursor]
                for raw in consumed.splitlines(keepends=True):
                    normalized = list_parser._clean_list_item_text(
                        raw, continue_width
                    )
                    if not src.startswith(normalized, offset):
                        break  # A following list item was already consumed.
                    if (raw.strip() and not list_parser._has_continuation_indent(
                            raw, continue_width)):
                        child.lazy_line_starts.add(offset)
                    offset += len(normalized)
            return child

        state.child_state = list_child_state
        try:
            return original_list_item(block, bullet, item, token, state, rules)
        finally:
            state.child_state = original_child_state

    list_parser._parse_list_item = parse_gfm_list_item
    original_inline_label = helpers._INLINE_LINK_LABEL_RE
    original_angle_parser = helpers._parse_angle_link_href
    helpers._INLINE_LINK_LABEL_RE = SourceBoundLabelPattern(re.compile(gfm_label + r"\]"))
    helpers._parse_angle_link_href = gfm_angle_link_href
    try:
        markdown = mistune.create_markdown(
            renderer="ast",
            plugins=[gfm_table_plugin, table_in_quote, table_in_list, footnotes, gfm_url_plugin, gfm_strikethrough_plugin],
        )
        markdown.block.register(
            "ref_link",
            r"^ {0,3}\[(?P<reflink_1>" + gfm_label + r")\]:",
            parse_gfm_ref_link,
        )
        # The pinned Mistune comment rule misses GFM's three valid empty
        # / abrupt comment forms. Extend only this parser instance; leave
        # the SHA-verified vendor source and rule precedence untouched.
        from mistune.inline_parser import INLINE_HTML, InlineParser
        markdown.inline.register(
            "inline_html",
            r"<!--(?:>|->|-->)|" + INLINE_HTML,
            InlineParser.parse_inline_html,
        )
        # Mistune's raw_html start regex also matches malformed <pre./<div:
        # prefixes, and its rule-1 closing-tag search is case-sensitive.
        # CommonMark/GFM require a tag-name boundary and allow case-insensitive
        # </pre>, </script>, </style> or </textarea> to finish rule 1.
        original_raw_html = markdown.block.parse_raw_html
        rule_one_tags = frozenset(("pre", "script", "style", "textarea"))
        # Filtered script/style/textarea wrappers still follow GFM's
        # first-rule-1-closer Markdown block boundary. GitHub then renders
        # following 4-space indented text as code. An HTML <pre> wrapper,
        # however, stays an example until its own actual closing tag.
        rule_one_any_end = re.compile(
            r"</(?:pre|script|style|textarea)\s*>", re.IGNORECASE
        )

        def parse_gfm_raw_html(match, state):
            marker = match.group(0).strip()
            tag = re.fullmatch(r"</?([A-Za-z][A-Za-z0-9-]*)", marker)
            if tag is not None:
                boundary = state.src[match.end():match.end() + 1]
                if boundary and boundary not in " \t\n\r/>":
                    return None
                if marker.startswith("<") and not marker.startswith("</") and tag.group(1).lower() in rule_one_tags:
                    # Only a matching </pre> closes visible <pre> examples;
                    # forbidden wrappers use GFM's Markdown block terminator.
                    if tag.group(1).lower() == "pre":
                        rule_end = re.compile(
                            r"</pre\s*>", re.IGNORECASE
                        )
                    else:
                        rule_end = rule_one_any_end
                    ending = rule_end.search(state.src, match.end())
                    if ending is None:
                        end = state.cursor_max
                    else:
                        offset = state.src.find("\n", ending.end())
                        end = state.cursor_max if offset == -1 else offset + 1
                    state.append_token({"type": "block_html", "raw": state.src[state.cursor:end]})
                    return end
            return original_raw_html(match, state)

        markdown.block.parse_raw_html = parse_gfm_raw_html
        markdown.block.register("raw_html", None, lambda block, match, state: parse_gfm_raw_html(match, state))
        ast = markdown(source)
    finally:
        list_parser._parse_list_item = original_list_item
        helpers._INLINE_LINK_LABEL_RE = original_inline_label
        helpers._parse_angle_link_href = original_angle_parser
    found: list[tuple[bool, str]] = []

    # GFM removes unsupported and unknown inline markup without replacing
    # its visible text. Therefore only explicit structural/replaced elements
    # should break a rendered filename; a growing tag allowlist is incomplete.
    transparent_tag = re.compile(
        r"""</?([A-Za-z][A-Za-z0-9-]*)\b(?:[^<>"']|"[^"]*"|'[^']*')*>"""
    )

    # GFM tagfilter escapes the leading "<" of these tags; formerly raw HTML
    # may therefore contain rendered literal deck paths. Keep ordinary HTML
    # markup and comments opaque.
    disallowed_html_tag = re.compile(
        r"</?(?:title|textarea|style|xmp|iframe|noembed|noframes|script|plaintext)(?=[\s/>])",
        re.IGNORECASE,
    )
    from html.parser import HTMLParser

    class VisibleRawHTML(HTMLParser):
        """Collect browser-visible raw HTML text, excluding markup and examples."""

        BLOCK_TAGS = frozenset({
            "div", "p", "details", "summary", "table", "thead", "tbody",
            "tfoot", "tr", "td", "th", "br", "hr", "ul", "ol", "li",
            "blockquote", "section", "article", "header", "footer",
            "h1", "h2", "h3", "h4", "h5", "h6",
        })
        # HTML <code> is visible phrasing; only <pre> remains example text.
        CODE_TAGS = frozenset({"pre"})
        # Only elements kept by GitHub's sanitizer interrupt visible text.
        # Other HTML5 void tags above are removed rather than replaced.
        VOID_TAGS = frozenset({"br", "hr", "img"})
        # GitHub's GFM tagfilter renders these tag spellings as literal text
        # rather than HTML, including attributes of the forbidden tags.
        FILTERED_TAGS = frozenset({
            "title", "textarea", "style", "xmp", "iframe", "noembed",
            "noframes", "script", "plaintext",
        })

        def __init__(self) -> None:
            super().__init__(convert_charrefs=True)
            self.parts: list[str] = []
            self.hidden: list[str] = []
            self.destinations: list[str] = []

        def record_live_target(self, tag, attrs) -> None:
            # GitHub renders permitted raw <a href> and <img src> as links.
            # HTMLParser already decodes attribute character references.
            # Other attributes are not navigation targets and stay opaque.
            attribute = "href" if tag == "a" else "src" if tag == "img" else None
            if attribute is not None:
                value = next((v for key, v in attrs if key == attribute), None)
                if isinstance(value, str):
                    self.destinations.append(value)

        def set_cdata_mode(self, elem, *, escapable=False) -> None:
            # GitHub's GFM tagfilter escapes forbidden wrappers before
            # browser parsing. Their contents are therefore ordinary HTML,
            # not the browser's script/style/textarea raw-text or RCDATA.
            if elem in self.FILTERED_TAGS:
                return
            super().set_cdata_mode(elem, escapable=escapable)

        def handle_starttag(self, tag, attrs) -> None:
            if self.hidden:
                if tag in self.CODE_TAGS:
                    self.hidden.append(tag)
                else:
                    # <pre> hides literal prose from deck-path scanning, but
                    # an actual <a href> or <img src> remains clickable.
                    self.record_live_target(tag, attrs)
                return
            if tag in self.FILTERED_TAGS:
                raw_start = self.get_starttag_text() or "<" + tag + ">"
                self.parts.extend((" ", decode_character_references(raw_start), " "))
            else:
                self.record_live_target(tag, attrs)
            if tag in self.CODE_TAGS:
                self.hidden.append(tag)
                self.parts.append(" ")
            elif tag in self.BLOCK_TAGS or tag in self.VOID_TAGS:
                # HTML replaced/void elements interrupt visible path text.
                self.parts.append(" ")

        def handle_endtag(self, tag) -> None:
            if self.hidden:
                if tag == self.hidden[-1]:
                    self.hidden.pop()
                    self.parts.append(" ")
                return
            if tag in self.FILTERED_TAGS:
                self.parts.extend((" ", "</" + tag + ">", " "))
            elif tag in self.BLOCK_TAGS or tag in self.VOID_TAGS:
                self.parts.append(" ")

        def handle_startendtag(self, tag, attrs) -> None:
            if self.hidden:
                self.record_live_target(tag, attrs)
                return
            if tag in self.FILTERED_TAGS:
                raw_start = self.get_starttag_text() or "<" + tag + "/>"
                self.parts.extend((" ", decode_character_references(raw_start), " "))
            else:
                self.record_live_target(tag, attrs)
            if tag in self.BLOCK_TAGS or tag in self.VOID_TAGS:
                self.parts.append(" ")

        def handle_data(self, data) -> None:
            if not self.hidden:
                # HTMLParser does not unescape CDATA inside script/style;
                # GFM tagfilter displays their text as ordinary HTML-escaped
                # prose. Decode once, never again for already decoded data.
                if self.cdata_elem in {"script", "style"}:
                    data = decode_character_references(data)
                self.parts.append(data)


    # Some structural tags split paragraphs when used as inline markup,
    # even though GFM strips them inside an established raw HTML block.
    inline_separators = (
        VisibleRawHTML.BLOCK_TAGS
        | VisibleRawHTML.VOID_TAGS
        | VisibleRawHTML.CODE_TAGS
        | frozenset({"form", "fieldset", "address", "aside", "main",
                     "figure", "nav", "center", "menu", "dl", "dt",
                     "dd", "dir"})
    )

    # CommonMark decodes semicolon-terminated numeric and named character
    # references only within each text token. Decoding a concatenated run
    # would accidentally turn a backslash-escaped ampersand (split by Mistune
    # into separate tokens) into a character reference.
    from html import unescape as unescape_character_reference
    from html.entities import html5 as named_character_references
    character_reference = re.compile(
        r"&(?:#[xX][0-9A-Fa-f]{1,6}|#[0-9]{1,7}|[A-Za-z][A-Za-z0-9]{1,31});"
    )

    def decode_character_references(raw: str) -> str:
        def replace(match: re.Match[str]) -> str:
            entity = match.group(0)
            if entity.startswith("&#") or entity[1:] in named_character_references:
                return unescape_character_reference(entity)
            return entity
        return character_reference.sub(replace, raw)

    # HTML pre nesting can span several AST blocks and paragraph visits.
    inline_pre_depth = 0

    def visit(tokens: list[dict]) -> None:
        # Mistune may split one rendered filename into adjacent text tokens
        # at escaped punctuation or emphasis boundaries. Check the combined
        # visible inline run, without crossing code, HTML or block boundaries.
        rendered: list[str] = []
        inside_link_label = 0
        rendered_label_text = False
        rendered_length = 0
        previous_text_token = False
        escaped_terminal_offsets: set[int] = set()

        def append_rendered(value: str, *, escaped_terminal: bool = False) -> None:
            nonlocal rendered_label_text, rendered_length
            if escaped_terminal:
                escaped_terminal_offsets.add(rendered_length)
            rendered.append(value)
            rendered_length += len(value)
            if value and inside_link_label:
                rendered_label_text = True

        def flush_text() -> None:
            nonlocal rendered_label_text, rendered_length, previous_text_token
            if rendered:
                for reference in literal_deck_references(
                    "".join(rendered),
                    suppress_bare_autolinks=not rendered_label_text,
                    escaped_terminal_offsets=frozenset(escaped_terminal_offsets),
                ):
                    found.append((True, reference))
                rendered.clear()
                rendered_label_text = False
            escaped_terminal_offsets.clear()
            rendered_length = 0
            previous_text_token = False

        def visit_inline(token: dict) -> None:
            nonlocal inside_link_label, inline_pre_depth, previous_text_token
            kind = token.get("type")
            children = token.get("children")
            if kind != "text":
                previous_text_token = False
            # Inline <pre> is a rendered example just like block <pre>.
            # Its ordinary text is not a live deck reference.
            if kind == "inline_html" and isinstance(token.get("raw"), str):
                tag = token["raw"]
                if re.match(r"(?i)^<pre(?=[\s/>])", tag):
                    flush_text()
                    inline_pre_depth += 1
                    return
                if inline_pre_depth and re.fullmatch(r"(?i)</pre\s*>", tag):
                    inline_pre_depth -= 1
                    return
            if inline_pre_depth:
                # Mistune can move subsequent standalone HTML into a block
                # token while a browser still has the earlier inline <pre>
                # open. Preserve the HTML parser's hidden-pre state across
                # that token and accept only live href/src and post-close text.
                if kind == "block_html" and isinstance(token.get("raw"), str):
                    flush_text()
                    visitor = VisibleRawHTML()
                    visitor.hidden = ["pre"] * inline_pre_depth
                    visitor.feed(token["raw"])
                    visitor.close()
                    inline_pre_depth = len(visitor.hidden)
                    for destination in visitor.destinations:
                        found.append((False, destination))
                    for reference in literal_deck_references(
                        "".join(visitor.parts)
                    ):
                        found.append((True, reference))
                    return
                # Only rendered bare text is an opaque preformatted example.
                # GFM still emits clickable Markdown links/images and raw
                # HTML href/src inside inline pre elements.
                if kind in {"link", "image"}:
                    destination = token.get("attrs", {}).get("url")
                    if isinstance(destination, str):
                        found.append((False, destination))
                raw = token.get("raw")
                if (kind == "inline_html" and isinstance(raw, str)
                        and re.match(r"(?i)^<(?:a|img)(?=[\s/>])", raw)):
                    visitor = VisibleRawHTML()
                    visitor.feed(raw)
                    visitor.close()
                    for destination in visitor.destinations:
                        found.append((False, destination))
                if kind in {"strong", "emphasis", "strikethrough"}:
                    if isinstance(children, list):
                        for child in children:
                            visit_inline(child)
                elif isinstance(children, list) and kind not in {"link", "image"}:
                    # An open inline pre persists across paragraph/list AST
                    # containers; their close tags and live links remain visible.
                    visit(children)
                return
            if kind == "block_html":
                flush_text()
                raw = token.get("raw")
                if isinstance(raw, str):
                    # GitHub's tagfilter renders forbidden tag markup as
                    # literal text. Ordinary allowed HTML tags are markup:
                    # only their data nodes (not attributes) are displayed.
                    # HTMLParser recognizes comment boundaries only in
                    # markup, not inside quoted tag attributes. A comment
                    # contributes no text and never splits adjacent fragments.
                    # Tag filtering occurs in the handlers instead of an
                    # unscoped regex that also touches comments/attributes.
                    visitor = VisibleRawHTML()
                    visitor.feed(raw)
                    visitor.close()
                    for destination in visitor.destinations:
                        found.append((False, destination))
                    for reference in literal_deck_references(
                        "".join(visitor.parts)
                    ):
                        found.append((True, reference))
                return
            if kind == "text":
                raw = token.get("raw")
                if isinstance(raw, str):
                    # Mistune splits a source backslash-escaped punctuation
                    # character into a single adjacent text token. Keep its
                    # provenance: it is literal filename data, not a comma
                    # or quote punctuating surrounding prose.
                    escaped = (
                        previous_text_token and len(raw) == 1
                        and raw in _PROSE_TRAILING_PUNCT
                    )
                    append_rendered(
                        decode_character_references(raw),
                        escaped_terminal=escaped,
                    )
                    previous_text_token = True
                else:
                    flush_text()
                return
            if kind in {"link", "image"}:
                if kind == "link" and inside_link_label:
                    # GFM does not create a nested bare-URL hyperlink inside
                    # an explicit Markdown label. Mistune's URL plugin does,
                    # so its child text is still visible and must be scanned.
                    if isinstance(children, list):
                        for child in children:
                            visit_inline(child)
                    return
                destination = token.get("attrs", {}).get("url")
                if isinstance(destination, str):
                    found.append((False, destination))
                if kind == "image":
                    # Image alt text is an HTML attribute, not visible
                    # prose; the replaced image also breaks text runs.
                    flush_text()
                    return
                # URI autolinks repeat the URL as one text child. That is
                # the link's URI, not a separate bare local deck reference.
                if (
                    kind == "link"
                    and isinstance(destination, str)
                    and re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", destination)
                    and isinstance(children, list)
                    and len(children) == 1
                    and children[0].get("type") == "text"
                    and (
                        children[0].get("raw") == destination
                        or children[0].get("raw") == unquote(destination)
                        or (
                            isinstance(children[0].get("raw"), str)
                            and children[0]["raw"].lower().startswith("www.")
                            and destination == "http://" + children[0]["raw"]
                        )
                    )
                ):
                    flush_text()
                    return
                if kind == "link":
                    if isinstance(children, list):
                        inside_link_label += 1
                        try:
                            for child in children:
                                visit_inline(child)
                        finally:
                            inside_link_label -= 1
                    return
            if kind in {"strong", "emphasis", "strikethrough"}:
                if isinstance(children, list):
                    for child in children:
                        visit_inline(child)
                return
            if kind == "inline_html":
                raw = token.get("raw")
                if isinstance(raw, str) and disallowed_html_tag.match(raw):
                    # Filtered tags are visible markup, but they do not
                    # concatenate their attribute text into adjacent filenames.
                    flush_text()
                    append_rendered(decode_character_references(raw))
                    flush_text()
                    return
                # Comments and transparent text-level HTML add no visible
                # separator; their attributes and bodies are never scanned.
                if isinstance(raw, str):
                    if (
                        re.fullmatch(r"<!--[\s\S]*?-->", raw)
                        or raw in {"<!-->", "<!--->"}
                        or (raw.startswith("<?") and raw.endswith("?>"))
                        or re.fullmatch(r"<![A-Z]+[ \t\r\n\f]+[^>]*>", raw)
                        or (raw.startswith("<![CDATA[") and raw.endswith("]]>"))
                    ):
                        # GFM emits these as invisible HTML comments,
                        # declarations or processing instructions; browsers
                        # join the surrounding visible text unchanged.
                        return
                    if re.match(r"(?i)^<(?:a|img)(?=[\s/>])", raw):
                        visitor = VisibleRawHTML()
                        visitor.feed(raw)
                        visitor.close()
                        for destination in visitor.destinations:
                            found.append((False, destination))
                    tag = transparent_tag.fullmatch(raw)
                    if (tag is not None
                            and tag.group(1).lower() not in inline_separators):
                        # GFM ends a www.-autolink before an HTML token.
                        # Otherwise joined rendered text could mistake the
                        # following visible deck path for an URL suffix.
                        if gfm_www_autolink_prefix("".join(rendered)):
                            flush_text()
                        return
            flush_text()
            if isinstance(children, list):
                visit(children)

        for token in tokens:
            visit_inline(token)
        flush_text()

    visit(ast)
    return found


# Bare mentions like decks/name/current.txt remain repository-root relative;
# Markdown links use the directory containing their index. No bare suffix of
# an external URL is a local reference.
# GFM autolinks require a dotted domain with no underscore in its final two labels.
# The pinned Mistune URL plugin is more permissive and can hide literal deck paths.
GFM_HTTP_DOMAIN = r"(?:[A-Za-z0-9_-]+\.)*[A-Za-z0-9-]+\.[A-Za-z0-9-]+(?![A-Za-z0-9_-])"
GFM_URL_AUTOLINK_PATTERN = r"(?<![^\s*_~(])https?://" + GFM_HTTP_DOMAIN + r"(?:[^\s<]*[^<.,:;\"')\]\s])?"
GFM_HTTP_PREFIX = re.compile(r"^https?://" + GFM_HTTP_DOMAIN, re.IGNORECASE)
# GFM allows www.-autolinks only at the beginning of a token or after these
# explicit inline delimiters. The final two domain labels may not contain "_".
GFM_WWW_AUTHORITY = re.compile(
    r"(?:^|[*_~(])www\.([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+)",
    re.IGNORECASE,
)
# The same extended link must be opaque to GFM strikethrough delimiters.
# Reject prefixes that do not start a URL token, and stop at HTML/whitespace.
GFM_WWW_AUTOLINK_PATTERN = (
    r"(?<![^\s*_~(])(?i:www\.)" + GFM_HTTP_DOMAIN
    + r"(?:[^\s<]*[^<.,:;\"')\]\s])?"
)


def gfm_www_autolink_prefix(prefix: str) -> bool:
    for match in GFM_WWW_AUTHORITY.finditer(prefix):
        labels = match.group(1).split(".")
        if ("_" not in labels[-1] and "_" not in labels[-2]
                and "<" not in prefix[match.end():]):
            return True
    return False


def unicode_filename_continuation(character: str) -> bool:
    """Unicode letters, marks and symbols continue paths; punctuation ends them."""
    return (
        ord(character) > 127
        and not character.isspace()
        and unicodedata.category(character)[0] != "P"
    )


def literal_deck_references(
    content: str, *, suppress_bare_autolinks: bool = True,
    escaped_terminal_offsets: frozenset[int] = frozenset(),
) -> list[str]:
    # Scan each contiguous path-like run once. A backtracking match beginning
    # at every nested "decks/" takes quadratic time on repeated prefixes.
    references: list[str] = []
    markers = sorted(escaped_terminal_offsets)
    length = len(content)
    offset = 0
    while (start := content.find("decks/", offset)) >= 0:
        end = start + 6
        # The AST gives rendered (not raw Markdown) text. Literal filenames
        # may use printable punctuation, including quotes and malformed entity
        # fragments, so an ASCII allowlist drops real missing references.
        # Actual HTML token boundaries are handled by the AST visitor, not
        # guessed from visible literal angle characters.
        while (
            end < length
            and content[end].isprintable()
            and not content[end].isspace()
        ):
            end += 1

        # Greedy legacy regex semantics: use the rightmost extension whose
        # following characters satisfy the original Markdown-path boundary.
        match_end = None
        for extension in _DECK_EXTENSIONS.finditer(content, start + 7, end):
            candidate_end = extension.end()
            # Only terminal prose punctuation may follow a .md/.txt basename.
            # A nonpunctuation suffix, or punctuation followed by filename
            # characters, means the apparent extension is internal data.
            trailer = content[candidate_end:end]
            if trailer and not all(
                char in _PROSE_TRAILING_PUNCT or
                (ord(char) > 127 and unicodedata.category(char).startswith("P"))
                for char in trailer
            ):
                continue
            if trailer and markers:
                marker = bisect_left(markers, candidate_end)
                if marker < len(markers) and markers[marker] < end:
                    continue
            match_end = candidate_end

        # Nested "decks/" in the same uninterrupted path cannot provide
        # another independent root-relative reference.
        offset = max(end, start + 6)
        if match_end is None:
            continue
        if start and (
            content[start - 1].isalnum()
            or content[start - 1] in "_/.-"
        ):
            continue
        token_start = max(
            content.rfind(chr(sep), 0, start)
            for sep in (9, 10, 13, 32)
        ) + 1
        prefix = content[token_start:start].rsplit("](", 1)[-1]
        # A bare URL's interior punctuation is part of the autolink;
        # only a true whitespace/punctuation-separated local text token
        # is a repository-root mention. URL children remain exempt.
        candidate = prefix.lstrip("*_~(")
        # Only a supported GFM bare HTTP(S)/www autolink hides its
        # own URL suffix. Arbitrary URI-looking prose (e.g. See:) does not.
        if (not suppress_bare_autolinks
                or not (GFM_HTTP_PREFIX.match(candidate)
                        or gfm_www_autolink_prefix(prefix))):
            references.append(content[start:match_end])
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
        key = unicodedata.normalize("NFC", unicodedata.normalize("NFC", name).casefold())
        seen[key] += quantity
        if name not in BASICS and seen[key] != 1:
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
            # A percent-encoded colon in a local basename is data, not a
            # URI scheme delimiter. A literal colon before any /?# is the
            # structural separator (including percent-encoded scheme names).
            raw_prefix = re.split(r"[/?#]", destination, maxsplit=1)[0]
            decoded = unquote(destination)
            if (destination.startswith(("#", "//"))
                    or (":" in raw_prefix
                        and re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", decoded))):
                continue
            # Split source URI delimiters before decoding: %23 in a local
            # filename is data, not an unencoded fragment separator.
            local_path = unquote(destination.split("#", 1)[0].split("?", 1)[0])
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
