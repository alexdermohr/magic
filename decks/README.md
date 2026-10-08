# Deck-Struktur und Versionierung

Jeder Commander besitzt einen eigenen Ordner unter `decks/`.

## Ruxa

- `decks/ruxa/current.txt`: aktuelle 100-Karten-Liste.
- `decks/ruxa/versions/`: datierte historische Snapshots.
- `analysis.md` / `DESIGN_PRINCIPLES.md`: Analyse und Regeln.

## Mishra (bewusste Ausnahme: eine B3-Version)

- **Einzige gepflegte B3-Liste:** `decks/mishra/current.txt`.
- **Separate B4-Liste:** `decks/mishra/versions/2026-10-07-optimized-b4-v1.txt`.
- `decks/mishra/analysis.md`: Mana- und Synergiebegründung.
- Keine zusätzliche Mishra-B3-Datei, keine datierten B3-Snapshots. Verbesserungen werden in `current.txt` übernommen.
- Historische B3-Fassungen sind aus dem aktuellen Baum gelöscht, über Git-Historie aber weiterhin verfügbar.

Damit liegt für jeden der beiden Mishra-Brackets exakt **eine importierbare 100-Karten-Liste** vor.
