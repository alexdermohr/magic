# Beiträge und Deck-PR-Regeln

## Decks pflegen

1. Neue Decks erhalten ausschließlich einen eigenen Ordner unter `decks/` mit dauerhaftem Slug und einer `current.txt`. Für Listenformat, Bracket-Ziel und Prüfgrenzen gelten die [Deck-Konventionen](decks/README.md).
2. Inhaltliche Änderungen eines Deck-PRs bleiben im jeweiligen Deckordner. Analysen und lokale READMEs sind optional. Historische Snapshots bleiben unverändert; die Mishra-Ausnahme zur B3-Versionierung gilt weiterhin.
3. **Ein Deck-PR darf weder `README.md` noch `decks/README.md` ändern.** Ein PR zählt für den Guard als Deck-PR, sobald er irgendeine Datei unter `decks/` außer `decks/README.md` ändert, hinzufügt, löscht oder umbenennt. Eine lokale Deck-README zählt ebenfalls als Deckdatei.
4. Die zentrale Startseite und die Deck-Konventionen enthalten keine Deckkataloge, laufenden Kartenstände oder Versionsübersichten. Neue Ordner erscheinen automatisch in der direkt browsbaren [Deckordnerliste](decks/). Die [historischen Archive](docs/archive/README.md) bleiben unverändert.
5. Änderungen der zentralen READMEs gehören in einen separaten Doku-PR ohne Deckdateien. Der Check `validate-decks` erlaubt diese Kombination. Andere Infrastrukturdateien lösen für sich allein keinen Deck-PR aus; der Guard erzwingt konkret nur die Trennung von Deckdateien und den beiden zentralen READMEs.

## PRs auf den stabilen Stand bringen

Offene Deck-PRs müssen beim Aktualisieren auf `main` sämtliche eigenen Änderungen an beiden zentralen READMEs aus ihrem PR-Diff entfernen. Die zentralen Dateien werden in der Fassung des aktualisierten `main` übernommen; Deckbeschreibungen und Analysen werden im eigenen Deckordner gepflegt. Historische Archive werden dabei nicht erweitert. Danach den vollständigen PR-Diff und die Checks prüfen.

## Lokale Prüfungen

```bash
python3 scripts/validate_decks.py
python3 tests/test_validate_decks.py
python3 -m unittest discover -s tests -p 'test_*.py'
git diff --check
```

Den Scope-Guard vom Repository-Stamm aus mit vollständigen Commit-SHAs prüfen, lokal beispielsweise für die Branches `main` und `HEAD`:

```bash
PR_BASE_SHA="$(git rev-parse main)" PR_HEAD_SHA="$(git rev-parse HEAD)" python3 scripts/check_deck_pr_scope.py
```

Der Guard liest ausschließlich lokale Git-Daten. Er bestimmt die Merge-Base der beiden angegebenen Commits und prüft den exakten Dateidiff von dort zum Head, einschließlich Löschungen und beider Seiten einer Umbenennung. Fehlende oder ungültige SHAs sowie unvollständige Historie lassen die Prüfung fehlschlagen. Die CI lädt deshalb bei PRs die volle Historie und verwendet den Standard-Checkout des synthetischen PR-Merges. Der Scope-Guard verwendet unabhängig vom ausgecheckten Arbeitsbaum weiterhin die originalen Ereignis-SHAs `PR_BASE_SHA` und `PR_HEAD_SHA`; auf `main`-Pushes wird er übersprungen und der gepushte Commit ausgecheckt. Der bestehende strukturelle Deckvalidator und die Tests laufen bei beiden Ereignissen im Required Check `validate-decks`.

Ein grüner Check bestätigt die dokumentierten Struktur- und Workflow-Regeln. Oracle-, Farbidentitäts-, Bannlisten- und Bracket-Prüfungen sowie Spieltests sind getrennt zu belegen.
