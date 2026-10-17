"""Positive and negative tests for the generic Magic deck-file contract."""
from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import time

from scripts.validate_decks import (DeckValidationError, validate_list, validate_repository, literal_deck_references, rendered_markdown_references)


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

    def test_gfm_marked_container_table_cells_keep_correct_visibility(self) -> None:
        """Explicitly marked table body cells remain GFM tables."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "> | A | B |\n> | - | - |\n> | text | [live](sample/missing.md) |\n",
            "- | A | B |\n  | - | - |\n  | text | [live](sample/missing.md) |\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

        # This link-like label is split into two genuine list-table cells.
        (self.root / "decks" / "README.md").write_text(
            "- | A | B |\n  | - | - |\n"
            "  | [not | live](sample/missing.md) |\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_literal_deck_scanner_keeps_greedy_path_boundaries(self) -> None:
        cases = {
            "decks/sample/current.txt": ["decks/sample/current.txt"],
            "decks/sample/note.md.": ["decks/sample/note.md"],
            "decks/sample/a.md.bak": [],
            "decks/sample/a.md/other.txt": ["decks/sample/a.md/other.txt"],
            "decks/a.md.decks/b.txt": ["decks/a.md.decks/b.txt"],
            "decks/..md": ["decks/..md"],
            "decks/.md": [],
            "path/to/decks/x.md": [],
            "decks/x.md https://example.test/decks/b.md": ["decks/x.md"],
        }
        for source, expected in cases.items():
            with self.subTest(source=source):
                self.assertEqual(literal_deck_references(source), expected)

    def test_adversarial_literal_paths_and_opaque_tildes_are_bounded(self) -> None:
        start = time.monotonic()
        self.assertEqual(literal_deck_references("decks/" * 30000), [])
        self.assertLess(time.monotonic() - start, 2.0)
        start = time.monotonic()
        self.assertEqual(
            rendered_markdown_references(
                "~x" + (" " + chr(96) + "a" + chr(96)) * 3200 + " ~"
            ),
            [],
        )
        self.assertLess(time.monotonic() - start, 2.0)

    def test_gfm_table_lazy_container_lines_keep_links_live(self) -> None:
        """GitHub does not lazily continue tables in blockquotes or lists."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "> | A | B |\n> | - | - |\n[live | x](sample/missing.md)\n",
            "> [live | x](sample/missing.md)\n--- | ---\n",
            "- | A | B |\n  | - | - |\n[live | x](sample/missing.md)\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_invalid_backtick_info_preserves_live_table_cell(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            "``` x` | [live](sample/missing.md) `\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_malformed_or_uppercase_html_preserves_following_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "<pre.\n\n[live](sample/missing.md)\n",
            "<div:\n[live](sample/missing.md)\n",
            "<PRE>\nx\n</PRE>\n\n[live](sample/missing.md)\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_footnote_continuation_contains_live_markdown_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "Note[^1]\n\n[^1]: ok text\n\n    [live](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_disallowed_html_tags_expose_visible_deck_paths(self) -> None:
        """GFM escapes disallowed tags so their text is displayed literally."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "<script>decks/sample/missing.md</script>\n",
            "<SCRIPT>decks/sample/missing.md</SCRIPT>\n",
            "<style>\ndecks/sample/missing.md\n</style>\n",
            "<iframe>decks/sample/missing.md</iframe>\n",
            "<script data-ref='decks/sample/missing.md'>safe</script>\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_gfm_tagfilter_keeps_other_html_attributes_and_comments_opaque(self) -> None:
        """Filtering one tag does not expose unrelated raw HTML attributes."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "<div data-ref='decks/sample/missing.md'><script>safe</script></div>\n",
            "<!-- <script>decks/sample/missing.md</script> -->\n",
            "<!-- <script>decks/sample/missing.md\n",
            "<!-- open comment\n<script>decks/sample/missing.md\n",
            "<pre>\n[example](sample/missing.md)\n</pre>\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_disallowed_inline_html_tag_attributes_are_visible(self) -> None:
        """The filtered inline tag itself is visible, including attributes."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "See <script data-ref='decks/sample/missing.md'>safe</script> here\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
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

    def test_quoted_soft_wrapped_link_destination_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> [analysis](\n> sample/missing.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_title_followed_by_soft_break_before_final_paren_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            '[analysis](sample/missing.md "details"\n)\n', encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_missing_reference_style_destination_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis][ref]\n\n[ref]: sample/missing.md\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_existing_reference_style_destination_is_accepted(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[analysis][ref]\n\n[ref]: sample/current.txt\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_html_block_literal_links_are_not_rendered(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for tag in ("div", "table", "details"):
            with self.subTest(tag=tag):
                (self.root / "decks" / "README.md").write_text(
                    f"<{tag}>\n[example](sample/missing.md)\n</{tag}>\n\n"
                    "[actual](sample/current.txt)\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_real_link_after_html_block_is_still_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<div>\n[example](sample/ignored.md)\n</div>\n\n"
            "[actual](sample/missing.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_comment_backtick_cannot_hide_later_real_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<!-- " + chr(96) + " -->\n[actual](sample/missing.md) " + chr(96) + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_spaced_underscore_thematic_break_ends_code_span(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "Open " + chr(96) + "\n_ _ _\n[actual](sample/missing.md) close " + chr(96) + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_missing_documented_deck_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "README.md").write_text(
            "[missing](decks/sample/analysis.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)


    def test_ast_urls_are_not_html_entity_decoded_twice(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        cases = (
            ("a&notit.md", "a&notit.md"),
            ("a&amp;b.md", "a&amp;amp;b.md"),
        )
        for name, target in cases:
            with self.subTest(name=name):
                (self.root / "decks" / "sample" / name).write_text(
                    "present\n", encoding="utf-8"
                )
                (self.root / "decks" / "README.md").write_text(
                    f"[existing](sample/{target})\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_extra_body_cells_do_not_mask_real_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n"
            "| --- | --- |\n"
            "| " + chr(96) + " | [actual](sample/missing.md) | ignored " + chr(96) + " |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_short_body_rows_pad_missing_cells(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n"
            "| --- | --- |\n"
            "| [actual](sample/missing.md) |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_single_hyphen_delimiters_keep_cell_links_visible(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n"
            "| - | - |\n"
            "| " + chr(96) + " | [example](sample/missing.md) close " + chr(96) + " |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_single_hyphen_table_existing_link_is_accepted(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| - | - |\n"
            "| ok | [exists](sample/current.txt) |\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_valid_3_hyphen_table_keeps_cell_link_visible(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n"
            "| --- | --- |\n"
            "| " + chr(96) + " | [actual](sample/missing.md) close " + chr(96) + " |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)



    def test_gfm_table_invalid_reference_prefix_keeps_link_live(self) -> None:
        """An invalid [label]: row remains a table row, not a block boundary."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "| A | B |\n| --- | --- |\n[x]: ` | [actual](sample/missing.md) close `\n",
            "| A | B |\n| --- | --- |\n[x]: ` | [actual](sample/missing.md) close ` |\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_gfm_table_reference_definition_is_cell_text(self) -> None:
        """Reference-like text in table body does not define a global link."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            "[x]: sample/missing.md\n\n"
            "[actual][x]\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_table_real_reference_definition_after_blank_line(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            "text | text\n\n"
            "[x]: sample/missing.md\n\n[actual][x]\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_table_valid_reference_looking_row_keeps_link_live(self) -> None:
        """A ref-def-looking title across cells still renders a live second-cell link."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            '[x]: sample/current.txt "t | [live](sample/missing.md)"\n',
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_invalid_table_header_retries_next_line(self) -> None:
        """A rejected header may precede a real two-column table."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "| x |\n| a | b |\n| --- | --- |\n"
            "| ` | [live](sample/missing.md) ` |\n",
            "x |\na | b\n--- | ---\n"
            "` | [live](sample/missing.md) `\n",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source, encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_table_mixed_outer_pipes_cannot_hide_missing_link(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        samples = (
            "| A | B |\n--- | ---\n",
            "| A | B |\n| --- | ---\n",
            "A | B\n| --- | --- |\n",
            "| A | B |\n--- | --- |\n",
        )
        for header in samples:
            with self.subTest(header=header):
                (self.root / "decks" / "README.md").write_text(
                    header + chr(96) + " | [actual](sample/missing.md) close " + chr(96) + "\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_mixed_outer_pipes_inside_blockquote(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "> | A | B |\n"
            "> --- | ---\n"
            "> " + chr(96) + " | [actual](sample/missing.md) close " + chr(96) + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_autolink_interior_punctuation_is_not_local(self) -> None:
        """GFM allows commas and semicolons inside an unspaced external URL."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for separator in (",", ";"):
            with self.subTest(separator=separator):
                (self.root / "decks" / "README.md").write_text(
                    "https://example.test/decks/guide.md"
                    + separator + "decks/sample/missing.md\n",
                    encoding="utf-8",
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_local_path_after_whitespace_separated_url_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for separator in (",", ";"):
            with self.subTest(separator=separator):
                (self.root / "decks" / "README.md").write_text(
                    "https://example.test/decks/guide.md"
                    + separator + " decks/sample/missing.md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_fenced_code_interrupts_mixed_piped_table(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for fence in (chr(96) * 3 + "md | example", "~~~md | example"):
            with self.subTest(fence=fence):
                closer = chr(96) * 3 if fence.startswith(chr(96)) else "~~~"
                (self.root / "decks" / "README.md").write_text(
                    "| A | B |\n"
                    "--- | ---\n"
                    + fence + "\n"
                    "[example](sample/missing.md)\n"
                    + closer + "\n",
                    encoding="utf-8",
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_real_link_after_table_fenced_code_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n"
            "--- | ---\n"
            + chr(96) * 3 + "md | example\n"
            "[example](sample/ignored.md)\n"
            + chr(96) * 3 + "\n"
            "[actual](sample/missing.md)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_raw_uri_path_is_still_excluded_from_local_targets(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "https://example.test/decks/remote.md "
            "[local](sample/current.txt)\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)


    def test_gfm_mixed_outer_pipes_inside_list(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "- | A | B |\n"
            "  --- | ---\n"
            "  " + chr(96) + " | [actual](sample/missing.md) close " + chr(96) + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)


    def test_gfm_pipe_less_body_rows_keep_links_in_separate_cells(self) -> None:
        """GFM example 202: pipe-less body lines remain table cells."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for opening in ("open `", "first\nopen `"):
            with self.subTest(opening=opening):
                (self.root / "decks" / "README.md").write_text(
                    "| A | B |\n| --- | --- |\n"
                    + opening + "\n[actual](sample/missing.md) close `\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_pipe_less_table_code_example_stays_literal(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            "`[example](sample/ignored.md)`\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_four_space_indented_delimiter_is_not_a_table(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| Open ` | [example](sample/missing.md) close ` |\n"
            "    | --- | --- |\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_three_space_indented_delimiter_can_start_table(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| Open ` | [actual](sample/missing.md) close ` |\n"
            "   | --- | --- |\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
            validate_repository(self.root)

    def test_gfm_www_autolinks_keep_nontrailing_punctuation(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for separator in (",", ";"):
            with self.subTest(separator=separator):
                (self.root / "decks" / "README.md").write_text(
                    "www.example.com" + separator + "decks/sample/missing.md\n",
                    encoding="utf-8",
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_www_autolink_does_not_hide_separate_local_path(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for sep in (", ", "; ", ". ", "\n"):
            with self.subTest(sep=sep):
                (self.root / "decks" / "README.md").write_text(
                    "www.example.com" + sep + "decks/sample/missing.md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_gfm_invalid_www_authority_does_not_mask_local_path(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "www.bad_domain.com,decks/sample/missing.md\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
            validate_repository(self.root)


    def test_gfm_email_protocol_boundary_exposes_local_suffix(self) -> None:
        """Commas and semicolons terminate mailto/xmpp email autolinks."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for scheme in ("mailto", "xmpp"):
            for boundary in (",", ";"):
                with self.subTest(scheme=scheme, boundary=boundary):
                    (self.root / "decks" / "README.md").write_text(
                        f"{scheme}:foo@bar.example{boundary}decks/sample/missing.md\n",
                        encoding="utf-8",
                    )
                    with self.assertRaisesRegex(
                        DeckValidationError, "decks/sample/missing.md"
                    ):
                        validate_repository(self.root)


    def test_literal_deck_paths_require_full_extension_boundary(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for path in (
            "decks/sample/notes.md.bak",
            "decks/sample/notes.txt.old",
            "decks/sample/notes.md2",
            "decks/sample/notes.txt~",
            "decks/sample/notes.txt-extra",
            "decks/sample/notes.md/archive",
        ):
            with self.subTest(path=path):
                (self.root / "decks" / "README.md").write_text(
                    path + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

        for punctuation in ("", ".", ",", ")", ";"):
            with self.subTest(punctuation=punctuation):
                (self.root / "decks" / "README.md").write_text(
                    "decks/sample/missing.md" + punctuation + "\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)



    def test_invalid_http_authority_exposes_adjacent_local_reference(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for host in ("bad_domain.example", "sub.bad_domain.example"):
            with self.subTest(host=host):
                (self.root / "decks" / "README.md").write_text(
                    f"https://{host},decks/sample/missing.md\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_valid_http_authority_keeps_external_url_interior(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for host in ("example.test", "sub_part.a.example"):
            with self.subTest(host=host):
                (self.root / "decks" / "README.md").write_text(
                    f"https://{host},decks/sample/missing.md\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_mail_protocol_boundaries_expose_adjacent_local_reference(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for protocol in ("mailto", "xmpp"):
            for punctuation in (")", "]", ",", ";", "?"):
                with self.subTest(protocol=protocol, punctuation=punctuation):
                    (self.root / "decks" / "README.md").write_text(
                        f"{protocol}:foo@bar.example{punctuation}decks/sample/missing.md\n",
                        encoding="utf-8",
                    )
                    with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                        validate_repository(self.root)



    def test_http_autolink_requires_supported_gfm_start_boundary(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for prefix in ("x", "]", "="):
            with self.subTest(prefix=prefix):
                (self.root / "decks" / "README.md").write_text(
                    f"{prefix}https://example.test,decks/sample/missing.md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_angle_destination_escaped_punctuation_missing_target_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            r"[analysis](<sample/missing\&b.md>)" + "\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "sample/missing&b.md"):
            validate_repository(self.root)

    def test_angle_destination_escaped_punctuation_existing_target_is_accepted(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "sample" / "a&b.md").write_text("# valid\n", encoding="utf-8")
        (self.root / "decks" / "README.md").write_text(
            r"[analysis](<sample/a\&b.md>)" + "\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)


    def test_angle_uri_autolink_label_is_not_local_deck_path(self) -> None:
        """Angle URI autolinks use their rendered URI label, not literal path prose."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for url in (
            "https://bad_domain.example,decks/sample/missing.md",
            "https://example.test,decks/sample/missing.md",
            "mailto:foo@bar.example,decks/sample/missing.md",
            "xmpp:foo@bar.example,decks/sample/missing.md",
        ):
            with self.subTest(url=url):
                (self.root / "decks" / "README.md").write_text(
                    f"<{url}>\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_angle_autolink_does_not_hide_adjacent_literal_path(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<https://bad_domain.example,decks/sample/ignored.md> "
            "decks/sample/missing.md\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
            validate_repository(self.root)

    def test_normal_external_markdown_link_label_still_checks_literal_path(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "[decks/sample/missing.md](https://example.test)\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
            validate_repository(self.root)


    def test_rendered_inline_fragments_join_literal_deck_references(self) -> None:
        """GFM backslash escapes and emphasis still render one local path."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for rendered_path in (
            r"decks/sample/missing\.md",
            r"decks/sample/missing\.txt",
            "decks/sample/**missing**.md",
            "decks/sample/miss*ing*.md",
            r"[decks/sample/missing\.md](https://example.test)",
        ):
            with self.subTest(rendered_path=rendered_path):
                (self.root / "decks" / "README.md").write_text(
                    rendered_path + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing"
                ):
                    validate_repository(self.root)

    def test_split_rendered_reference_inside_blockquote_is_checked(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            r"> decks/sample/missing\.md" + "\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
            validate_repository(self.root)

    def test_code_and_block_boundaries_do_not_join_literal_paths(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for separated in (
            "decks/sample/missing" + chr(96) + "code" + chr(96) + ".md\n",
            "decks/sample/missing\n\n.md\n",
        ):
            with self.subTest(separated=separated):
                (self.root / "decks" / "README.md").write_text(
                    separated, encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_angle_uri_autolink_does_not_hide_following_split_local_path(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<https://bad_domain.example,decks/sample/ignored.md> "
            r"decks/sample/missing\.md" + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
            validate_repository(self.root)


    def test_inline_html_formatting_preserves_visible_deck_path(self) -> None:
        """A styled portion of one path is still visible local-path prose."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "decks/sample/<em>missing</em>.md",
            "decks/sample/<span class='link'>missing</span>.md",
            "decks/sample/<a href='https://example.test'>missing</a>.md",
            "decks/sample/<b>mis</b><i>sing</i>.md",
            "decks/sample/<strong data-target='decks/sample/other.md'>missing</strong>.md",
            "decks/sample/<!-- label annotation -->missing.md",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_html_attributes_and_comments_are_not_local_references(self) -> None:
        """Hidden markup/attributes are not separate rendered filenames."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "<span data-target='decks/sample/missing.md'>safe</span>",
            "<!-- decks/sample/missing.md -->",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_nontransparent_html_breaks_deck_path_run(self) -> None:
        """A line break or image cannot silently merge separate path parts."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "decks/sample/missing<br>thing.md",
            "decks/sample/missing<img src='icon.svg'>thing.md",
            "decks/sample/missing<hr>thing.md",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)


    def test_gfm_strikethrough_is_visible_local_path_text(self) -> None:
        """GFM renders single and double tilde pairs as strikethrough."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "decks/sample/~~miss~~ing.md",
            "decks/sample/~miss~ing.md",
            "decks/sample/~~mis~~**sing**.md",
            "decks/sample/**mis**~sing~.md",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_gfm_strikethrough_does_not_strip_literal_or_triple_tildes(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "decks/sample/~~~miss~~~ing.md",
            r"decks/sample/\~miss\~ing.md",
            "decks/sample/~missing.md",
            "decks/sample/~~miss~ing.md",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)


    def test_gfm_strikethrough_code_span_tildes_do_not_activate_links(self) -> None:
        """A tilde inside an actual code span cannot close outer deletion."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~open `code~ [actual](sample/missing.md) close`~",
            "~~open `code~~ [actual](sample/missing.md) close`~~",
            "~~open ``code~~ [actual](sample/missing.md) close``~~",
            "~open ``code~ [actual](sample/missing.md) close``~",
            "~open ``code ` tick~ [actual](sample/missing.md) close``~",
            "~open `code~ [actual](sample/missing.md) close`~ and more",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_strikethrough_angle_autolink_tildes_are_opaque(self) -> None:
        """Angle URI autolink contents cannot terminate surrounding deletions."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~open <https://example.com/~[actual](sample/missing.md)> close~",
            "~~open <https://example.com/~~[actual](sample/missing.md)> close~~",
            "~open <mailto:one~[actual](sample/missing.md)@example.test> close~",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_strikethrough_html_tildes_are_opaque(self) -> None:
        """Valid inline HTML tags and comments cannot supply a tilde closer."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            '~open <span data-note="~[actual](sample/missing.md)">ok</span> close~',
            '~~open <span data-note="~~[actual](sample/missing.md)">ok</span> close~~',
            "~open <!-- ~[actual](sample/missing.md) --> close~",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_strikethrough_opaque_tokens_do_not_hide_adjacent_links(self) -> None:
        """Skipping opaque tokens still exposes actual links outside the tokens."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~open <https://example.com/~[fake](sample/fake.md)> close~ "
            "[live](sample/missing.md)",
            '~open <span data-note="~[fake](sample/fake.md)">ok</span> close~ '
            "[live](sample/missing.md)",
            "~open <https://example.com/~ [live](sample/missing.md) close~",
            r"~open \<https://example.com/~ [live](sample/missing.md) close~",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_gfm_strikethrough_link_tildes_keep_references_live(self) -> None:
        """Bracketed inline links bind more tightly than outer tilde closers."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source, target in (
            ("~5 [x](sample/a~b.md)", "sample/a~b.md"),
            ("~3 lands; see [Plan~B](sample/missing.md)", "sample/missing.md"),
            ("~~5 [x](sample/a~~b.md)", "sample/a~~b.md"),
            ('~5 [x](sample/missing.md "ti~tle")', "sample/missing.md"),
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, target):
                    validate_repository(self.root)

    def test_gfm_strikethrough_link_tildes_preserve_valid_links(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~5 [x](sample/current.txt)",
            "~3 [Plan~B](sample/current.txt)",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_gfm_strikethrough_external_link_tildes_are_opaque(self) -> None:
        """A complete external link destination cannot expose nested-looking links."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~open [safe](https://example.com/~[actual](sample/missing.md)) close~",
            "~~open [safe](https://example.com/~~[actual](sample/missing.md)) close~~",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)

    def test_pinned_mistune_sources_match_provenance_sha256(self) -> None:
        """CI must verify every vendored source and the pinned license bytes."""
        import hashlib
        import json

        root = Path(__file__).resolve().parents[1] / "scripts" / "_vendor"
        source_root = root / "mistune"
        self.assertFalse(root.is_symlink())
        self.assertFalse(source_root.is_symlink())
        manifest = json.loads((root / "PROVENANCE.json").read_text("utf-8"))
        actual = {
            path.relative_to(root).as_posix(): hashlib.sha256(
                path.read_bytes()
            ).hexdigest()
            for path in source_root.rglob("*.py")
            if path.is_file() and not path.is_symlink()
        }
        self.assertDictEqual(actual, manifest["files_sha256"])
        self.assertEqual(
            hashlib.sha256((root / "LICENSE.mistune").read_bytes()).hexdigest(),
            manifest["license_sha256"],
        )

    def test_gfm_strikethrough_unclosed_runs_use_bound_cache_and_fast_path(self) -> None:
        """Many unmatched tildes must not repeatedly scan the entire tail."""
        from scripts.validate_decks import (
            gfm_strikethrough_plugin, rendered_markdown_references,
        )

        rendered_markdown_references("")  # load the same pinned parser
        import mistune

        md = mistune.create_markdown(renderer="ast", plugins=[
            gfm_strikethrough_plugin,
        ])
        self.assertIn("~", md.inline._get_fast_trigger_chars())
        source = " ".join(["~open"] * 200)
        state = md.inline.state_cls({"ref_links": {}})
        state.src = source
        md.inline.render(state)
        self.assertEqual(
            state.formatting_no_end.get((id(source), "~")),
            (source, len(source)),
        )

    def test_gfm_strikethrough_still_checks_visible_links_near_code_spans(self) -> None:
        """Unmatched or escaped backticks cannot hide actual local links."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "~open `code~ [hidden](sample/hidden.md) close`~ "
            "[live](sample/missing.md)",
            r"~open \`literal~ [live](sample/missing.md) \`~",
            "~open `unclosed~ [live](sample/missing.md)",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "sample/missing.md"
                ):
                    validate_repository(self.root)


    def test_gfm_reference_labels_support_501_through_999_characters(self) -> None:
        """GFM permits reference labels up to 999 characters; Mistune defaults to 500."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for length in (500, 501, 750, 999):
            with self.subTest(length=length):
                label = "a" * length
                (self.root / "decks" / "README.md").write_text(
                    f"[analysis][{label}]\n\n[{label}]: sample/missing.md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_gfm_reference_label_above_999_is_not_link(self) -> None:
        """A thousand-character label must not accidentally become a real link."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        label = "a" * 1000
        (self.root / "decks" / "README.md").write_text(
            f"[analysis][{label}]\n\n[{label}]: sample/missing.md\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_angle_destination_unescaped_backslash_is_literal(self) -> None:
        """GFM retains a backslash preceding a non-punctuation character."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            r"[analysis](<sample/a\qb.md>)" + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)
        (self.root / "decks" / "sample" / "a\\qb.md").write_text(
            "# present\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_angle_destination_escaped_punctuation_and_literal_backslash(self) -> None:
        """Punctuation escapes still unescape; non-punctuation slashes remain literal."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            r"[analysis](<sample/a\&b\qc.md>)" + "\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)
        (self.root / "decks" / "sample" / "a&b\\qc.md").write_text(
            "# present\n", encoding="utf-8"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)


    def test_unsupported_bare_protocols_do_not_hide_local_deck_paths(self) -> None:
        """Only real GFM bare autolinks may suppress a rendered deck reference."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for prefix in (
            "See:",
            "custom:",
            "ftp:",
            "javascript:",
            "data:text/plain,",
            "//example.test,",
        ):
            with self.subTest(prefix=prefix):
                (self.root / "decks" / "README.md").write_text(
                    prefix + "decks/sample/missing.md\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_other_transparent_inline_html_tags_preserve_deck_paths(self) -> None:
        """Phrasing tags add no visible separator between local-path fragments."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for opening, closing in (
            ("<dfn>", "</dfn>"),
            ("<kbd>", "</kbd>"),
            ("<var>", "</var>"),
            ("<time datetime='2026-10-16'>", "</time>"),
            ("<samp>", "</samp>"),
            ("<data value='1'>", "</data>"),
            ("<code>", "</code>"),
            ("<bdi>", "</bdi>"),
            ("<bdo dir='ltr'>", "</bdo>"),
        ):
            with self.subTest(opening=opening):
                (self.root / "decks" / "README.md").write_text(
                    "decks/sample/" + opening + "missing" + closing + ".md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(
                    DeckValidationError, "decks/sample/missing.md"
                ):
                    validate_repository(self.root)

    def test_inline_html_table_row_keeps_live_link_in_other_cell(self) -> None:
        """A phrasing tag plus a pipe is not an HTML block starting a new line."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for tag in ("span", "label", "ruby"):
            with self.subTest(tag=tag):
                row = "<" + tag + ">" + chr(96) + "</" + tag + ">" + (
                    " | [actual](sample/missing.md) close " + chr(96)
                )
                (self.root / "decks" / "README.md").write_text(
                    "| A | B |\n| --- | --- |\n" + row + "\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                    validate_repository(self.root)

    def test_actual_html_block_still_ends_gfm_table(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "| A | B |\n| --- | --- |\n"
            "<div>\n[actual](sample/missing.md)\n\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_more_textual_inline_html_wrappers_preserve_visible_paths(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for opening, closing in (
            ("<label for='x'>", "</label>"),
            ("<ruby>", "</ruby>"),
            ("<rb>", "</rb>"),
            ("<output>", "</output>"),
            ("<font color='red'>", "</font>"),
            ("<strike>", "</strike>"),
            ("<tt>", "</tt>"),
        ):
            with self.subTest(opening=opening):
                (self.root / "decks" / "README.md").write_text(
                    "decks/sample/" + opening + "missing" + closing + ".md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)


    def test_commonmark_character_references_form_visible_deck_paths(self) -> None:
        """Rendered text decodes valid semicolon-terminated HTML entities."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            "decks/sample/miss&#x69;ng.md",
            "decks/sample/miss&#105;ng.md",
            "decks&sol;sample&sol;missing.md",
            "decks/sample/miss&#x69;<em>ng</em>.md",
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_invalid_or_escaped_character_references_do_not_join_paths(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for source in (
            r"decks/sample/miss\&#x69;ng.md",
            "decks/sample/miss&#x69ng.md",
            "decks/sample/miss&notanentity;ng.md",
            "decks/sample/miss&<em>#x69;</em>ng.md",
            "<span title='decks/sample/miss&#x69;ng.md'>safe</span>",
            chr(96) + "decks/sample/miss&#x69;ng.md" + chr(96),
        ):
            with self.subTest(source=source):
                (self.root / "decks" / "README.md").write_text(
                    source + "\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)


    def test_gfm_999_character_label_counts_source_escapes(self) -> None:
        """Each backslash escape is two source characters, not one."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for n, is_valid in ((499, True), (500, False)):
            label = "\\!" * n
            with self.subTest(source_characters=len(label)):
                (self.root / "decks" / "README.md").write_text(
                    f"[{label}]: sample/missing.md\n\n[{label}]\n",
                    encoding="utf-8",
                )
                if is_valid:
                    with self.assertRaisesRegex(DeckValidationError, "sample/missing.md"):
                        validate_repository(self.root)
                else:
                    self.assertEqual(len(validate_repository(self.root)), 1)


    def test_quote_aware_html_tag_attributes_keep_contiguous_visible_paths(self) -> None:
        """Angle brackets inside quoted attributes never separate rendered text."""
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for opening, closing in (
            ('<span title=">">', "</span>"),
            ("<dfn title='x<y'>", "</dfn>"),
            ('<time datetime="2026-10-16" title="a > b">', "</time>"),
            ('<kbd title="a < b > c">', "</kbd>"),
        ):
            with self.subTest(opening=opening):
                (self.root / "decks" / "README.md").write_text(
                    "decks/sample/" + opening + "missing" + closing + ".md\n",
                    encoding="utf-8",
                )
                with self.assertRaisesRegex(DeckValidationError, "decks/sample/missing.md"):
                    validate_repository(self.root)

    def test_quoted_html_void_and_structural_tags_still_separate(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        for fragment in (
            '<img alt=">">',
            '<span title=">"/>',
            '<section title=">">',
        ):
            with self.subTest(fragment=fragment):
                (self.root / "decks" / "README.md").write_text(
                    "decks/sample/" + fragment + "missing.md\n", encoding="utf-8"
                )
                self.assertEqual(len(validate_repository(self.root)), 1)


    def test_transparent_tag_attributes_still_do_not_create_paths(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "decks" / "README.md").write_text(
            "<dfn data-target='decks/sample/missing.md'>safe</dfn>\n",
            encoding="utf-8",
        )
        self.assertEqual(len(validate_repository(self.root)), 1)


if __name__ == "__main__":
    unittest.main()