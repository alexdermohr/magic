"""Regression tests for the repository's offline, intentionally narrow contract."""
from __future__ import annotations

from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_decks import DeckValidationError, validate_list, validate_repository


class DeckValidationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "decks" / "sample").mkdir(parents=True)
        (self.root / "README.md").write_text("", encoding="utf-8")
        (self.root / "decks" / "README.md").write_text("", encoding="utf-8")
        self.deck = self.root / "decks" / "sample" / "current.txt"
        self.write_deck("1 Sample Commander\n99 Plains\n")

    def write_deck(self, content: str) -> None:
        self.deck.write_text(content, encoding="utf-8")

    def write_index(self, text: str, *, root: bool = False) -> None:
        index = self.root / "README.md" if root else self.root / "decks" / "README.md"
        index.write_text(text, encoding="utf-8")

    def test_plain_list_and_basics_pass(self) -> None:
        self.assertEqual(validate_list(self.deck), "Sample Commander")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_sectioned_single_commander(self) -> None:
        self.write_deck("Commander\n1 Sample Commander\nDeck\n99 Island\n")
        self.assertEqual(validate_list(self.deck), "Sample Commander")

    def test_sectioned_two_commanders(self) -> None:
        self.write_deck("Commander\n1 Sample Commander\n1 Second Commander\nDeck\n98 Island\n")
        self.assertEqual(validate_list(self.deck), "Sample Commander")

    def test_wrong_header_position_is_rejected(self) -> None:
        self.write_deck("Commander\nDeck\n1 Sample Commander\n99 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "section headers"):
            validate_list(self.deck)

    def test_wrong_count_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n98 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "expected 100"):
            validate_list(self.deck)

    def test_nonbasic_duplicate_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n1 Sol Ring\n1 sol ring\n97 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "duplicate nonbasic"):
            validate_list(self.deck)

    def test_unicode_equivalent_duplicate_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n1 Caf\u00e9\n1 Cafe\u0301\n97 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "duplicate nonbasic"):
            validate_list(self.deck)

    def test_nonbasic_quantity_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n2 Sol Ring\n97 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "nonbasic"):
            validate_list(self.deck)

    def test_malformed_card_line_is_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n1Sol Ring\n98 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "invalid"):
            validate_list(self.deck)

    def test_commander_count_is_one(self) -> None:
        self.write_deck("2 Sample Commander\n98 Plains\n")
        with self.assertRaisesRegex(DeckValidationError, "first card"):
            validate_list(self.deck)

    def test_missing_deck_current_is_rejected(self) -> None:
        (self.root / "decks" / "orphan").mkdir()
        with self.assertRaisesRegex(DeckValidationError, "orphan/current.txt"):
            validate_repository(self.root)

    def test_index_relative_valid_link(self) -> None:
        (self.root / "decks" / "sample" / "analysis.md").write_text("# OK\n")
        self.write_index('[analysis](sample/analysis.md "details")\n')
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_index_relative_missing_link_is_rejected(self) -> None:
        self.write_index("[analysis](sample/missing.md)\n")
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_index_angle_link_with_spaces(self) -> None:
        (self.root / "decks" / "sample" / "notes file.md").write_text("OK\n")
        self.write_index('[analysis](<sample/notes file.md> "details")\n')
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_existing_directory_link_without_slash(self) -> None:
        (self.root / "decks" / "sample" / "versions").mkdir()
        self.write_index("[versions](sample/versions)\n")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_root_relative_link(self) -> None:
        self.write_index("[deck](/decks/sample/current.txt)\n", root=True)
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_plain_documented_deck_path_must_exist(self) -> None:
        self.write_index("The list decks/sample/missing.txt is referenced.\n")
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_plain_existing_deck_path_in_inline_code(self) -> None:
        self.write_index("See " + chr(96) + "decks/sample/current.txt" + chr(96) + ".\n")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_external_urls_with_deck_paths_are_ignored(self) -> None:
        self.write_index("[site](https://example.org/decks/wrong.md)\n"
                         "https://example.org/decks/missing.md\n"
                         "[site](//example.org/decks/wrong.txt)\n", root=True)
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_external_link_cannot_mask_adjacent_local_link(self) -> None:
        self.write_index("[site](https://example.org/decks/wrong.md)"
                         "[missing](sample/missing.md)\n")
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_fenced_code_is_an_example_not_a_reference(self) -> None:
        ticks = chr(96) * 3
        self.write_index(ticks + "\n[example](sample/missing.md)\n"
                         "decks/sample/missing.md\n" + ticks + "\n")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_html_comment_delimiters_in_different_fences_do_not_hide_link(self) -> None:
        ticks = chr(96) * 3
        self.write_index(
            ticks + "\n<!--\n" + ticks + "\n"
            "[real](sample/missing.md)\n" +
            ticks + "\n-->\n" + ticks + "\n"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_multiline_html_comment_hides_example_not_later_link(self) -> None:
        (self.root / "decks" / "sample" / "analysis.md").write_text("# OK\n")
        self.write_index(
            "<!--\n[example](sample/missing.md)\n-->\n"
            "[real](sample/analysis.md)\n"
        )
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_html_comment_is_not_a_reference(self) -> None:
        self.write_index("<!-- [example](sample/missing.md) -->\n")
        self.assertEqual(len(validate_repository(self.root)), 1)

    def test_local_link_cannot_escape_repository(self) -> None:
        self.write_index("[bad](../../outside.md)\n")
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)

    def test_missing_index_is_rejected(self) -> None:
        (self.root / "README.md").unlink()
        with self.assertRaisesRegex(DeckValidationError, "Markdown index"):
            validate_repository(self.root)

    def test_symlinked_current_is_rejected(self) -> None:
        self.deck.unlink()
        self.deck.symlink_to(self.root / "README.md")
        with self.assertRaisesRegex(DeckValidationError, "regular current.txt"):
            validate_repository(self.root)


if __name__ == "__main__":
    unittest.main()
