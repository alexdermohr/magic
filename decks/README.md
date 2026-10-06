# Deck-Struktur und Versionierung

Jeder Commander besitzt einen eigenen Ordner unter `decks/`.

## Dateien pro Commander

- `current.txt` — aktuell empfohlene, importierbare 100-Karten-Liste
- `analysis.md` — aktueller Designstand, Bracket-Einordnung und Spielplan
- `versions/` — unveränderliche Snapshots wichtiger Entwicklungsstände
- zusätzliche commander-spezifische Designregeln bei Bedarf

## Versionsregel

Dateinamen folgen:

`YYYY-MM-DD-kurzbeschreibung-vN.txt`

Ein Versions-Snapshot wird nach seiner Ablage nicht still verändert. Eine neue relevante Optimierung erhält eine neue Versionsdatei. Erst danach wird `current.txt` auf denselben Inhalt gesetzt.

Damit bleiben historische Stände vergleichbar, während `current.txt` immer die gegenwärtige Empfehlung bezeichnet.
