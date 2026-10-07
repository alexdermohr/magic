# magic

Commander-Decklabor für Alexander.

Dieses Repository pflegt mehrere Commander als getrennte Bereiche. Jede aktive Linie hat eine aktuelle Empfehlung und unveränderliche, datierte Versionen.

## Aktive Decks

### Ruxa, Patient Professor

**Ziel:** oberes Bracket 3 bei möglichst geringer Pilotenkomplexität.

- Aktuell: [decks/ruxa/current.txt](decks/ruxa/current.txt)
- Analyse: [decks/ruxa/analysis.md](decks/ruxa/analysis.md)
- Designregeln: [decks/ruxa/DESIGN_PRINCIPLES.md](decks/ruxa/DESIGN_PRINCIPLES.md)
- Versionen: [decks/ruxa/versions/](decks/ruxa/versions/)

### Mishra, Eminent One

Mishra wird in zwei getrennten Linien gepflegt:

- **Bracket 3 / Upgraded:** aktuelle Hauptfassung, stark und Mishra-spezifisch optimiert, ohne auf frühe/regelmäßige Game-Win-Combos zu bauen
- **Bracket 4 / Optimized:** separate schnelle Combo-Fassung mit Fast Mana, starken Tutoren und freier Interaktion

Links:

- Aktuell (B3 v4): [decks/mishra/current.txt](decks/mishra/current.txt)
- Analyse: [decks/mishra/analysis.md](decks/mishra/analysis.md)
- B4 v1: [decks/mishra/versions/2026-10-07-optimized-b4-v1.txt](decks/mishra/versions/2026-10-07-optimized-b4-v1.txt)
- Alle Versionen: [decks/mishra/versions/](decks/mishra/versions/)

## Versionierung

Die Konvention steht in [decks/README.md](decks/README.md).

Kurz:
- `current.txt` ist die aktuell empfohlene Liste und darf sich ändern.
- `versions/*.txt` sind datierte Snapshots und werden nicht überschrieben.
- Eine relevante Neuoptimierung erhält einen neuen Snapshot und wird anschließend, wenn sie gewinnt, nach `current.txt` übernommen.
- Alternative Leistungsstufen können als eigene Snapshots bestehen bleiben, ohne `current.txt` zu ersetzen.

## Aktueller Stand

- **Ruxa current:** 2026-10-06 Upper Bracket 3 v2
- **Mishra current:** 2026-10-07 Upper Bracket 3 v4
- **Mishra alternative:** 2026-10-07 Optimized Bracket 4 v1
- Ruxa current, Mishra current und Mishra B4 enthalten jeweils exakt 100 Karten.

Bracket-, Bannlisten- und Game-Changer-Aussagen werden bei neuen finalen Versionen frisch gegen die offiziellen Commander-Regeln geprüft.
