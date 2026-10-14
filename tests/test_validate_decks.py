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

    def test_missing_documented_deck_rejected(self) -> None:
        self.write_deck("1 Sample Commander\n99 Plains\n")
        (self.root / "README.md").write_text(
            "[missing](decks/sample/analysis.md)\n", encoding="utf-8"
        )
        with self.assertRaisesRegex(DeckValidationError, "missing local reference"):
            validate_repository(self.root)


if __name__ == "__main__":
    unittest.main()
