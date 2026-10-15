"""Positive and negative tests for the generic Magic deck-file contract."""
from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from scripts.validate_decks import DeckValidationError, validate_list, validate_repository


class DeckValidationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "decks" / "sample").mkdir(parents=True)
        (self.root / "README.md").write_text(
            "[deck](decks/sample/current.txt)\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            "decks/sample/current.txt\n", encoding="utf-8"
        )
        self.deck = self.root / "decks" / "sample" / "current.txt"

    def write_deck(self, content: str) -> None:
        self.deck.write_text(content, encoding="utf-8")

    def test_flat_import_format_with_basic_lands(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        self.assertEqual(validate_list(self.deck), "Sample Commander")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_sectioned_kinnan_import_format(self) -> None:
        self.write_deck("Commander\n1 Sample Commander\n\nDeck\n99 Island\n")
        self.assertEqual(validate_list(self.deck), "Sample Commander")

    def test_card_count_must_be_100(self) -> None:
        self.write_deck("1 Sample Commander\n98 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "expected 100"):
            validate_list(self.deck)

    def test_duplicate_nonbasic_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n1 Sol Ring\n1 Sol Ring\n97 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "duplicate nonbasic"):
            validate_list(self.deck)

    def test_nonbasic_multiplicity_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n2 Sol Ring\n97 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "nonbasic card"):
            validate_list(self.deck)

    def test_bad_header_position_rejected(self) -> None:
        self.write_deck("Commander\nDeck\n1 Sample Commander\n99 Island\n")
        with self.assertRaisesRegex(DeckValidationError, "section headers"):
            validate_list(self.deck)

    def test_malformed_card_line_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n1Island\n98 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "invalid"):
            validate_list(self.deck)

    def test_existing_relative_deck_index_markdown_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "analysis.md").write_text(
            "# Sample\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            "[analysis](sample/analysis.md)\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_missing_relative_deck_index_markdown_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis](sample/misspelled.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_external_urls_with_deck_paths_are_not_local(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "README.md").write_text(
            "[external](https://example.test/decks/guide.md)\n"
            "https://example.test/decks/other.md\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_missing_relative_titled_markdown_link_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/typo.md "details")\n', encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_missing_angle_link_with_spaces_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis](<sample/missing file.md>)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_existing_angle_link_with_spaces_and_title(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "real file.md").write_text(
            "# Analyses\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            '[analysis](<sample/real file.md> "details")\n', encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_existing_directory_link_without_trailing_slash(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "versions").mkdir()
        (self.root / "decks" / "README.md").write_text(
            "[versions](sample/versions)\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_missing_directory_link_without_trailing_slash(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[versions](sample/versions)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_protocol_relative_external_link_and_raw_url(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[external](//example.test/decks/guide.md)\n"
            "//example.test/decks/other.md\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_existing_balanced_parentheses_markdown_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "report(1).md").write_text(
            "# Report\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            "[report](sample/report(1).md)\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_missing_balanced_parentheses_markdown_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[report](sample/missing(1).md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_existing_nested_balanced_parentheses_markdown_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "report(a(b)).md").write_text(
            "# Nested\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            '[report](sample/report(a(b)).md "details")\n', encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_external_urls_with_balanced_parentheses_do_not_block(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[external](https://example.test/wiki/Foo_(bar)/decks/guide.md)\n"
            "//example.test/wiki/Bar_(baz)/decks/other.md\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_external_url_does_not_hide_adjacent_missing_local_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[external](https://example.test/wiki/Foo_(bar)/decks/guide.md)"
            "[missing](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_ipv6_host_external_urls_are_not_local_refs(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[ipv6](http://[::1]/decks/guide.md)\n"
            "http://[2001:db8::1]/wiki/Foo_(bar)/decks/another.md\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_adjacent_ipv6_url_does_not_hide_real_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[external](http://[::1]/decks/guide.md)"
            "[missing](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_every_deck_directory_requires_current_list(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "orphan").mkdir()
        with self.assertRaisesRegex(DeckValidationError, r"orphan/current\.txt"):
            validate_repository(self.root)

    def test_nested_bracket_label_validates_missing_local_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[see [analysis]](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_inline_code_examples_are_not_file_references(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`[sample](sample/missing.md)` and "
            "`decks/sample/missing.txt` are examples.\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_fenced_code_examples_do_not_create_missing_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "~~~markdown\n"
            "[example](sample/missing.md)\n"
            "decks/sample/not-present.txt\n"
            "~~~\n"
            "````markdown\n"
            "``` is literal inside the longer fence\n"
            "[another](sample/missing2.md)\n"
            "````\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_inline_code_does_not_hide_adjacent_real_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`[example](sample/ignored.md)` "
            "[actual](sample/actually-missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "actually-missing.md"):
            validate_repository(self.root)

    def test_unclosed_backtick_does_not_mask_genuine_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`unmatched [actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_double_backtick_span_with_inner_single_backticks_is_ignored(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "``example `[missing](sample/ignored.md)` "
            "decks/sample/ignored.txt``\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_fenced_code_does_not_hide_following_missing_local_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "   ```markdown\n"
            "[example](sample/ignored.md)\n"
            "   ```\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_escaped_backticks_do_not_mask_real_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "\`escaped [actual](sample/missing.md)\`\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_code_spans_do_not_cross_blank_paragraph_boundaries(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "Press ` to open the console.\n\n"
            "[actual](sample/missing.md)\n\n"
            "Use ` again.\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_code_span_ending_with_backslash_keeps_real_link_visible(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`C:\` then [actual](sample/missing.md) then `x`\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_code_span_does_not_cross_markdown_heading(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "Open ` here\n"
            "# Heading\n"
            "[actual](sample/missing.md)\n"
            "Close ` there\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_code_spans_can_cross_soft_line_breaks_inside_a_paragraph(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`sample code\n"
            "[ignored](sample/ignored.md)` "
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_wrapped_markdown_link_label_must_validate_local_target(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis\ncontinued](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_blockquote_fenced_markdown_links_are_examples(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> ~~~markdown\n"
            "> [example](sample/missing.md)\n"
            "> ~~~\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_list_fenced_markdown_links_are_examples(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- ```markdown\n"
            "  [example](sample/missing.md)\n"
            "  ```\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_blockquote_fence_keeps_following_real_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> ~~~\n"
            "> [example](sample/ignored.md)\n"
            "> ~~~\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_empty_alt_image_missing_target_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "![](sample/missing.png)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.png"):
            validate_repository(self.root)

    def test_empty_alt_external_image_is_not_local(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "![](https://example.test/art.png)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_sectioned_two_commander_import_format(self) -> None:
        self.write_deck(
            "Commander\n1 Partner One\n1 Partner Two\n\nDeck\n98 Plains\n"
        )
        self.assertEqual(validate_list(self.deck), "Partner One")

    def test_second_commander_must_be_single_copy(self) -> None:
        self.write_deck(
            "Commander\n1 Partner One\n2 Partner Two\n\nDeck\n97 Plains\n"
        )
        with self.assertRaisesRegex(DeckValidationError, "commander"):
            validate_list(self.deck)

    def test_nested_decks_path_is_not_an_extra_root_reference(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "archive" / "decks").mkdir(parents=True)
        (self.root / "decks" / "archive" / "decks" / "guide.md").write_text(
            "# Guide\n", encoding="utf-8"
        )
        (self.root / "decks" / "archive" / "current.txt").write_text(
            "1 Archive Commander\n99 Plains\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            "[archive](archive/decks/guide.md)\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 2)

    def test_unclosed_blockquote_fence_must_end_with_container(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> ~~~markdown\n"
            "> [example](sample/ignored.md)\n"
            "\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_unclosed_list_fence_must_end_with_container(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- ~~~markdown\n"
            "  [example](sample/ignored.md)\n"
            "\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_html_escaped_local_file_name_is_decoded(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "a&b.md").write_text(
            "# Real file\n", encoding="utf-8"
        )
        (self.root / "decks" / "README.md").write_text(
            "[analysis](sample/a&amp;b.md)\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_html_escaped_missing_file_still_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis](sample/a&amp;missing.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "a&missing.md"):
            validate_repository(self.root)

    def test_root_fence_containing_quote_example_stays_masked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "~~~markdown\n"
            "> [example](sample/missing.md)\n"
            "~~~\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_legacy_decks_path_requires_word_boundary(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "notdecks/nonexistent.md is ordinary prose, not a root link.\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_root_fence_list_marker_is_not_closer(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "~~~markdown\n- ~~~\n~~~\n[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_root_fence_quote_marker_is_not_closer(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "~~~markdown\n> ~~~\n~~~\n[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_wrapped_list_item_label_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- [analysis\n  continued](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_wrapped_blockquote_label_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> [analysis\n> continued](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_root_relative_markdown_link_uses_repo_root(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[deck](/decks/sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_entity_encoded_external_and_anchor_destinations(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[site](https&#58;//example.test/guide.md)\n"
            "[anchor](&#35;details)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_html_comment_local_link_is_not_rendered(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<!-- [old](sample/removed.md) -->\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_multiline_html_comment_does_not_hide_later_broken_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<!--\n[old](sample/removed.md)\n-->\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_html_comment_example_inside_code_does_not_mask_real_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "`<!--` [actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_indented_code_examples_and_continuations_are_not_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "    [example](sample/missing.md)\n"
            "    decks/sample/missing.txt\n"
            "\n"
            "    [continued](sample/also-missing.md)\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_indented_paragraph_continuation_is_still_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "Intro paragraph without an empty line.\n"
            "    [actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_list_indentation_after_blank_remains_a_real_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- A list item\n"
            "\n"
            "    [actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_indented_code_inside_list_is_not_a_reference(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- A list item\n"
            "\n"
            "      [example](sample/missing.md)\n"
            "      decks/sample/missing.txt\n"
            "\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_indented_code_inside_quote_is_not_a_reference(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            ">     [example](sample/missing.md)\n"
            ">     decks/sample/missing.txt\n"
            "\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_multiline_markdown_link_title_still_checks_destination(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/missing.md "first\nsecond")\n',
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_multiline_markdown_link_title_existing_destination_passes(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/current.txt "first\nsecond")\n',
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_code_span_cannot_cross_setext_heading_boundary(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for underline in ("===", "---"):
            with self.subTest(underline=underline):
                (self.root / "decks" / "README.md").write_text(
                    "Open ` in title\n"
                    f"{underline}\n"
                    "[actual](sample/missing.md)\n"
                    "Close ` after heading\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_atx_heading_inside_list_breaks_cross_heading_codespan(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- # Open ` in heading\n"
            "  [actual](sample/missing.md) close ` here\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_inline_link_title_can_start_after_soft_line_break(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/missing.md\n "details")\n',
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_multiline_separated_title_existing_target(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/current.txt\n "details")\n',
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_unmatched_table_cell_code_does_not_hide_real_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| First | Second |\n"
            "| --- | --- |\n"
            "| Open ` | ordinary |\n"
            "| [actual](sample/missing.md) | Close ` |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_raw_html_pre_block_examples_are_not_live_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<pre>\n"
            "[example](sample/missing.md)\n"
            "decks/sample/missing.txt\n"
            "</pre>\n"
            "[real](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_raw_html_block_does_not_hide_later_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<pre>\n"
            "[example](sample/ignored.md)\n"
            "</pre>\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_unclosed_inline_html_comment_does_not_hide_later_real_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "See also <!-- TODO\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_unclosed_block_html_comment_hides_remaining_examples(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<!-- pending draft\n"
            "[example](sample/missing.md)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_short_setext_h2_underline_ends_code_span(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for underline in ("-", "--"):
            with self.subTest(underline=underline):
                (self.root / "decks" / "README.md").write_text(
                    "Open ` in title\n"
                    f"{underline}\n"
                    "[actual](sample/missing.md)\n"
                    "Close ` after heading\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_quoted_table_header_code_cannot_hide_link_in_other_cell(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> | Open ` | [actual](sample/missing.md) close ` |\n"
            "> | --- | --- |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_double_quoted_table_header_uses_own_cells(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> > | Open ` | [actual](sample/missing.md) close ` |\n"
            "> > | --- | --- |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_table_header_code_cannot_hide_link_in_other_cell(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| Open ` | [actual](sample/missing.md) close ` |\n"
            "| --- | --- |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_even_backslash_run_keeps_table_pipe_as_cell_boundary(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for count in (2, 4):
            with self.subTest(backslashes=count):
                (self.root / "decks" / "README.md").write_text(
                    f"| Open ` {chr(92) * count}| [actual](sample/missing.md) close ` |\n"
                    "| --- | --- |\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_odd_backslash_run_escapes_table_cell_pipe(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for count in (1, 3):
            with self.subTest(backslashes=count):
                (self.root / "decks" / "README.md").write_text(
                    f"| Open ` {chr(92) * count}| [actual](sample/missing.md) close ` | end |\n"
                    "| --- | --- |\n",
                    encoding="utf-8",
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_inline_link_destination_starts_after_soft_line_break(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[actual](\nsample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_inline_link_existing_destination_after_soft_line_break(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[actual](\nsample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_missing_documented_deck_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "README.md").write_text(
            "[missing](decks/sample/analysis.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)


if __name__ == "__main__":
    unittest.main()