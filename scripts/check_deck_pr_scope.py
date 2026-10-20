#!/usr/bin/env python3
"""Deckdateien und zentrale READMEs im lokalen PR-Diff getrennt halten.

Nur lesende Git-Aufrufe; keine Shell, Netzabfragen oder Git-Schreibaktionen.
Aufruf im Repository-Stamm mit PR_BASE_SHA und PR_HEAD_SHA aus dem PR-Ereignis.
"""
from __future__ import annotations

from collections.abc import Iterable
import os
from pathlib import Path
import re
import subprocess
import sys


CENTRAL_READMES = frozenset({"README.md", "decks/README.md"})
FULL_SHA = re.compile(r"(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})")


class ScopeCheckError(ValueError):
    """Ungültiger PR-Vergleich oder unzulässiger Dateiumfang."""


def check_scope(paths: Iterable[str]) -> None:
    changed = set(paths)
    central = changed & CENTRAL_READMES
    has_deck = any(
        path.startswith("decks/") and path != "decks/README.md"
        for path in changed
    )
    if has_deck and central:
        names = ", ".join(sorted(central))
        raise ScopeCheckError(
            f"Deck-PRs dürfen {names} nicht ändern. "
            "Entferne die Änderungen an den zentralen READMEs aus dem PR-Diff "
            "und übernimm deren Fassung aus dem aktualisierten main. "
            "Deckinhalte gehören ausschließlich in den eigenen Deckordner; "
            "Konventionsänderungen gehören in einen separaten Doku-PR."
        )


def git_read(root: Path, *arguments: str) -> bytes:
    result = subprocess.run(
        ["git", "--no-pager", *arguments],
        cwd=root,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode:
        raise ScopeCheckError(
            f"Git-{arguments[0]} fehlgeschlagen. Beide Ereignis-SHAs und ihre "
            "gemeinsame Historie müssen lokal verfügbar sein "
            "(bei PRs fetch-depth: 0)."
        )
    return result.stdout


def changed_paths(root: Path, base_sha: str, head_sha: str) -> list[str]:
    for name, value in (("PR_BASE_SHA", base_sha), ("PR_HEAD_SHA", head_sha)):
        if FULL_SHA.fullmatch(value) is None:
            raise ScopeCheckError(f"{name} muss ein vollständiger Git-Commit-SHA sein.")
    bases = git_read(root, "merge-base", "--all", base_sha, head_sha).splitlines()
    if len(bases) != 1:
        raise ScopeCheckError("Keine eindeutige Merge-Base für die Ereignis-SHAs.")
    merge_base = bases[0].decode("ascii")
    diff = git_read(
        root, "diff", "--no-ext-diff", "--no-textconv", "--no-renames",
        "--name-only", "-z", merge_base, head_sha, "--",
    )
    # NUL-Trennung erhält auch Leerzeichen, Zeilenumbrüche und Unicode in Pfaden.
    # Ohne Rename-Erkennung werden alter und neuer Pfad jeweils berücksichtigt.
    return [os.fsdecode(path) for path in diff.split(b"\0") if path]


def main() -> int:
    try:
        paths = changed_paths(
            Path.cwd(), os.environ.get("PR_BASE_SHA", ""),
            os.environ.get("PR_HEAD_SHA", ""),
        )
        check_scope(paths)
    except (ScopeCheckError, OSError, UnicodeError) as exc:
        print(f"PR-Scope-Prüfung FEHLGESCHLAGEN: {exc}", file=sys.stderr)
        return 1
    print("PASS: Deckdateien und zentrale READMEs sind im PR-Diff getrennt.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
