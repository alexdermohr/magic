"""Originalbytes der historischen Indizes und neue lokale Archivlinks sichern."""
from __future__ import annotations

import hashlib
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "docs" / "archive"
sys.path.insert(0, str(ROOT / "scripts"))
from validate_decks import local_index_references


class IndexArchiveTests(unittest.TestCase):
    def test_original_index_bytes_are_preserved(self) -> None:
        # SHA-256 der unveränderten Originalblobs aus main@351195da57223e86f2fc8387965d0b7a210d919d.
        originals = {
            "root-index-before-stabilization-2026-10-20.md":
                (8933, "e7e1a142a28403364f0db35786d3af466314e682c4ea4e1f548d77b920af767a"),
            "decks-index-before-stabilization-2026-10-20.md":
                (4707, "5f83381fd683ae292bbd048bdca141312dd5eb2169fdf119a316f60a184e5f2c"),
        }
        for name, (length, digest) in originals.items():
            with self.subTest(archive=name):
                content = (ARCHIVE / name).read_bytes()
                self.assertTrue(content.startswith(b"# HISTORISCHES ARCHIV:"))
                self.assertTrue(content.endswith(b"\n```\n"))
                original = content.split(b"```markdown\n", 1)[1].removesuffix(b"\n```\n")
                self.assertEqual(len(original), length)
                self.assertEqual(hashlib.sha256(original).hexdigest(), digest)

    def test_new_documentation_links_resolve(self) -> None:
        documents = [ROOT / "README.md", ROOT / "decks" / "README.md",
                     ROOT / "CONTRIBUTING.md", *sorted(ARCHIVE.glob("*.md"))]
        for document in documents:
            for target in local_index_references(document.read_text(encoding="utf-8"), document, ROOT):
                with self.subTest(document=document.relative_to(ROOT), target=target):
                    self.assertTrue(target.resolve().is_relative_to(ROOT))
                    self.assertTrue(target.is_file() or target.is_dir(), str(target))


if __name__ == "__main__":
    unittest.main()
