# Ruxa, Patient Professor

## Spielplan (Zielwechsel am 2026-11-19)

**Ab jetzt für vier Spieler (Multiplayer Commander)** optimieren: maximale tatsächliche Stärke am oberen Rand von **Commander Bracket 3**, ohne Einschränkung der Pilotenkomplexität. 1v1 ist nicht länger die maßgebliche Zielumgebung. Ruxa verstärkt fähigkeitslose Kreaturentoken; große Vanilla-Kreaturen bleiben für Ruxas Friedhofs-Rückholung. Langfristig zählen Durchhaltevermögen, wiederholbarer Kartenvorteil, Wiederaufbau nach Boardwipes und verlässliche Abschlüsse gegen mehrere Gegner.

Die aktive v6-Liste setzt die Vier-Spieler-Optimierung fort: Nature's Will liefert mit Ruxas Kampfschaden Land-Enttappung, Elemental Bond kontinuierlichen Kartenvorteil. Der isolierte Manabrew-Deckgenerator-Import ist **auch für v6 bestanden**; ein echter Forge-Spielstart, iPad-Safari-E2E und Vier-Spieler-Testpartien mit v6 sind weiterhin nicht bestätigt.

## Aktive Version

- `current.txt` = `versions/2026-11-19-upper-b3-four-player-v6.txt`
- 100 Karten / 35 reine Länder + 1 modale Land-/Zauberkarte / 18 Kreaturen einschließlich Ruxa / 3 echte Vanilla-Kreaturenkarten / drei Game Changer
- **V6-Verifikation (19.11.2026):** alle 73 unterschiedlichen Kartennamen über Scryfall gefunden, 0 Commander-illegale Karten, 0 Farbidentitätsfehler, genau drei Game Changer (Ancient Tomb, Gaea's Cradle, Natural Order), 18 Kreaturen einschließlich Ruxa. Ein isolierter Durchlauf des **echten Manabrew-iPad-Deckgenerators** mit v6 bestand (99 Hauptkarten + Commander, eindeutige Karten-IDs, MDFC-Rückseite korrekt erkannt; Grabowski-Job `a89538ea2de4`). Deckstruktur-CI und echtes Forge-/Vier-Spieler-Spiel sind getrennt zu bewerten.
- Bracket-3-Eignung nach veröffentlichten Wizards-Kriterien geprüft; keine tatsächliche Gewinnrate oder manabrew.app-Umsetzung gemessen.

## Historische Versionen

- `versions/2026-10-05-baseline-v1.txt`: ursprüngliche Vanilla-Stompy-Fassung
- `versions/2026-10-06-upper-b3-v2.txt`: optimierte Vanilla-/Token-Mischung
- `versions/2026-10-08-upper-b3-v3.txt`: vorherige Fassung mit niedriger Pilotenkomplexität
- `versions/2026-10-11-upper-b3-v4.txt`: vorheriger, überwiegend 1v1-orientierter Token-Value-Ansatz
- `versions/2026-11-19-upper-b3-four-player-v5.txt`: erste Vier-Spieler-Überarbeitung (historisch, unverändert)
- `versions/2026-11-19-upper-b3-four-player-v6.txt`: aktuelle Vier-Spieler-Fassung mit Nature's Will und Elemental Bond

Siehe [analysis.md](analysis.md), [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md) und den [Kandidatenpool](card-pool.md).
