"""PR-Scope-Regressionen mit echten lokalen Git-Branches und dem CLI-Aufruf."""
from __future__ import annotations

from itertools import product
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "check_deck_pr_scope.py"
sys.path.insert(0, str(SCRIPT.parent))
from check_deck_pr_scope import ScopeCheckError, changed_paths, check_scope


class ScopeClassificationTests(unittest.TestCase):
    def test_local_readmes_and_snapshots_are_deck_files(self) -> None:
        for path in ("decks/new/README.md", "decks/new/analysis.md",
                     "decks/new/versions/old.txt", "decks/.gitkeep"):
            with self.subTest(path=path):
                check_scope([path])
                for central in ("README.md", "decks/README.md"):
                    with self.assertRaisesRegex(ScopeCheckError, central):
                        check_scope([path, central])

    def test_similarly_named_paths_are_not_central_readmes(self) -> None:
        check_scope(["decks/new/current.txt", "docs/README.md",
                     "README.md.bak", "decks/readme.md"])

    def test_other_directories_do_not_make_a_deck_pr(self) -> None:
        check_scope(["README.md", "decks/README.md", "decks-old/current.txt",
                     "docs/decks/sample.md", "scripts/check.py"])


class GitScopeTests(unittest.TestCase):
    def setUp(self) -> None:
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        self.env = os.environ.copy()
        # Die isolierten Test-Repos brauchen weder Benutzerkonfiguration noch Hooks.
        for key in list(self.env):
            if key.startswith("GIT_") or key in {"PR_BASE_SHA", "PR_HEAD_SHA"}:
                del self.env[key]
        self.env.update({"GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull})
        self.git("init", "--initial-branch=main")
        self.git("config", "user.name", "Scope-Test")
        self.git("config", "user.email", "scope-test@example.invalid")
        self.git("config", "core.hooksPath", os.devnull)
        self.git("config", "commit.gpgsign", "false")
        self.initial = {
            "README.md": "Startseite\n",
            "decks/README.md": "Konventionen\n",
            "decks/sample/current.txt": "Testliste\n",
            "docs/notes.md": "Dokumentation\n",
        }
        self.base = self.commit(self.initial)

    def git(self, *arguments: str) -> str:
        return subprocess.run(
            ["git", *arguments], cwd=self.root, env=self.env, check=True,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        ).stdout.strip()

    def commit(self, changes: dict[str, str | None]) -> str:
        for name, content in changes.items():
            path = self.root / name
            if content is None:
                path.unlink()
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")
        self.git("add", "--all")
        self.git("commit", "-m", "Teständerung")
        return self.git("rev-parse", "HEAD")

    def run_guard(self, base: str | None, head: str | None) -> subprocess.CompletedProcess:
        env = self.env.copy()
        if base is not None:
            env["PR_BASE_SHA"] = base
        if head is not None:
            env["PR_HEAD_SHA"] = head
        return subprocess.run(
            [sys.executable, str(SCRIPT)], cwd=self.root, env=env,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )

    def test_all_16_scope_combinations_with_real_refs_and_cli(self) -> None:
        paths = ("decks/sample/current.txt", "README.md", "decks/README.md",
                 "docs/notes.md")
        for bits in product((False, True), repeat=4):
            with self.subTest(deck=bits[0], root=bits[1], conventions=bits[2], other=bits[3]):
                branch = "case-" + "".join(str(int(bit)) for bit in bits)
                self.git("switch", "-c", branch, self.base)
                changes = {path: "Geändert\n" for path, enabled in zip(paths, bits) if enabled}
                head = self.commit(changes) if changes else self.git("rev-parse", branch)
                self.assertEqual(set(changed_paths(self.root, self.base, head)), set(changes))
                result = self.run_guard(self.base, head)
                blocked = bits[0] and (bits[1] or bits[2])
                self.assertEqual(result.returncode, int(blocked), result.stderr)
                if blocked:
                    self.assertIn("Deck-PRs dürfen", result.stderr)
                    self.assertIn("separaten Doku-PR", result.stderr)
                else:
                    self.assertIn("PASS", result.stdout)

    def test_advanced_base_readme_is_not_part_of_deck_pr(self) -> None:
        self.git("switch", "-c", "deck-pr")
        head = self.commit({"decks/sample/current.txt": "PR-Deck\n"})
        self.git("switch", "main")
        base = self.commit({"README.md": "Neue Basis\n", "decks/sample/current.txt": "Basis-Deck\n"})
        self.assertEqual(changed_paths(self.root, base, head), ["decks/sample/current.txt"])
        self.assertEqual(self.run_guard(base, head).returncode, 0)

    def test_advanced_base_deck_is_not_part_of_docs_pr(self) -> None:
        self.git("switch", "-c", "docs-pr")
        head = self.commit({"README.md": "PR-Dokumentation\n"})
        self.git("switch", "main")
        base = self.commit({"decks/sample/current.txt": "Basis-Deck\n"})
        self.assertEqual(changed_paths(self.root, base, head), ["README.md"])
        self.assertEqual(self.run_guard(base, head).returncode, 0)

    def test_current_checkout_and_dirty_files_do_not_change_event_diff(self) -> None:
        self.git("switch", "-c", "deck-pr")
        head = self.commit({"decks/sample/current.txt": "PR-Deck\n"})
        self.git("switch", "main")
        (self.root / "README.md").write_text("Nicht committiert\n", encoding="utf-8")
        self.assertEqual(changed_paths(self.root, self.base, head), ["decks/sample/current.txt"])
        before = self.git("status", "--porcelain")
        self.assertEqual(self.run_guard(self.base, head).returncode, 0)
        self.assertEqual(self.git("status", "--porcelain"), before)
        self.assertEqual(self.git("rev-parse", "HEAD"), self.base)

    def test_reverted_deck_changes_do_not_block_docs_pr(self) -> None:
        self.commit({"decks/sample/current.txt": "Zwischenstand\n"})
        head = self.commit({"decks/sample/current.txt": self.initial["decks/sample/current.txt"],
                            "README.md": "Doku-Änderung\n"})
        self.assertEqual(changed_paths(self.root, self.base, head), ["README.md"])
        self.assertEqual(self.run_guard(self.base, head).returncode, 0)

    def test_deleting_a_deck_file_with_readme_change_is_blocked(self) -> None:
        head = self.commit({"decks/sample/current.txt": None, "decks/README.md": "Geändert\n"})
        self.assertEqual(self.run_guard(self.base, head).returncode, 1)

    def test_renaming_central_readme_into_deck_is_blocked(self) -> None:
        self.git("mv", "README.md", "decks/sample/README.md")
        head = self.commit({})
        self.assertEqual(set(changed_paths(self.root, self.base, head)),
                         {"README.md", "decks/sample/README.md"})
        self.assertEqual(self.run_guard(self.base, head).returncode, 1)

    def test_renaming_deck_to_central_readme_is_blocked(self) -> None:
        self.git("mv", "-f", "decks/sample/current.txt", "README.md")
        head = self.commit({})
        self.assertEqual(set(changed_paths(self.root, self.base, head)),
                         {"README.md", "decks/sample/current.txt"})
        self.assertEqual(self.run_guard(self.base, head).returncode, 1)

    def test_renaming_within_a_deck_passes(self) -> None:
        self.git("mv", "decks/sample/current.txt", "decks/sample/old.txt")
        head = self.commit({})
        self.assertEqual(self.run_guard(self.base, head).returncode, 0)

    def test_nul_delimited_unusual_filenames(self) -> None:
        name = "decks/sample/Notizen mit ü und\nZeilenumbruch.md"
        head = self.commit({name: "Test\n", "README.md": "Geändert\n"})
        self.assertEqual(set(changed_paths(self.root, self.base, head)), {name, "README.md"})
        self.assertEqual(self.run_guard(self.base, head).returncode, 1)

    def test_missing_shas_fail_closed(self) -> None:
        for base, head in ((None, self.base), (self.base, None), (None, None)):
            with self.subTest(base=base, head=head):
                result = self.run_guard(base, head)
                self.assertEqual(result.returncode, 1)
                self.assertIn("vollständiger Git-Commit-SHA", result.stderr)

    def test_invalid_and_shell_like_shas_fail_without_execution(self) -> None:
        for value in ("main", "HEAD", "--help", self.base[:12],
                      "a" * 39, "g" * 40, self.base + "\n", "$(touch INJECTED)",
                      "`touch INJECTED`", self.base + "; touch INJECTED"):
            for base, head in ((value, self.base), (self.base, value)):
                with self.subTest(base=base, head=head):
                    result = self.run_guard(base, head)
                    self.assertEqual(result.returncode, 1)
                    self.assertIn("vollständiger Git-Commit-SHA", result.stderr)
                    self.assertFalse((self.root / "INJECTED").exists())

    def test_nonexistent_commit_fails_closed(self) -> None:
        result = self.run_guard(self.base, "0" * 40)
        self.assertEqual(result.returncode, 1)
        self.assertIn("Historie", result.stderr)

    def test_unrelated_histories_fail_closed(self) -> None:
        self.git("switch", "--orphan", "unrelated")
        head = self.commit({"other.txt": "Andere Historie\n"})
        result = self.run_guard(self.base, head)
        self.assertEqual(result.returncode, 1)
        self.assertIn("Historie", result.stderr)

    def test_shallow_history_fails_closed(self) -> None:
        head = self.commit({"decks/sample/current.txt": "PR-Deck\n"})
        (self.root / ".git" / "shallow").write_text(head + "\n", encoding="ascii")
        result = self.run_guard(self.base, head)
        self.assertEqual(result.returncode, 1)
        self.assertIn("fetch-depth: 0", result.stderr)

    def test_ambiguous_merge_base_fails_closed(self) -> None:
        self.git("switch", "-c", "left")
        left = self.commit({"left.txt": "Links\n"})
        self.git("switch", "-c", "right", self.base)
        right = self.commit({"right.txt": "Rechts\n"})
        self.git("switch", "left")
        self.git("merge", "--no-ff", "-m", "Merge rechts", right)
        base = self.git("rev-parse", "HEAD")
        self.git("switch", "right")
        self.git("merge", "--no-ff", "-m", "Merge links", left)
        head = self.git("rev-parse", "HEAD")
        self.assertEqual(len(self.git("merge-base", "--all", base, head).splitlines()), 2)
        result = self.run_guard(base, head)
        self.assertEqual(result.returncode, 1)
        self.assertIn("eindeutige Merge-Base", result.stderr)


if __name__ == "__main__":
    unittest.main()
