# Deck-Konventionen

Die [Deckordnerliste](./) zeigt auf GitHub automatisch die vorhandenen Unterordner des gewählten Branches. Ein neues Deck benötigt nur einen eigenen Ordner mit `current.txt`; zentrale README-Einträge sind nicht nötig.

## Dateien und Versionierung

- Pro Deck ein eigener Ordner mit einem dauerhaften Slug; Deckinhalte bleiben ausschließlich in diesem Ordner.
- `current.txt` enthält die aktive, importierbare Liste. `analysis.md` für Spielplan, Quellen und Risiken, eine lokale `README.md` sowie **`card-pool.md` als erweiterte Kartenbasis** sind optional.
- Historische Snapshots bleiben unverändert erhalten, üblicherweise unter `versions/`. Optimierungen ersetzen `current.txt`; echte ältere Fassungen können dort archiviert werden.
- **Mishra-Ausnahme:** genau eine aktive B3-Liste in `current.txt`; keine zusätzlichen B3-Dateien oder datierten B3-Snapshots anlegen. B4 bleibt separat. Bereits überlieferte Historie bleibt erhalten, auch in Git.

## Erweiterte Kartenbasis je Deck (empfohlen, optional)

Für **jedes Deck** darf und soll bei Bedarf eine eigene `decks/<deck-slug>/card-pool.md` gepflegt werden. Sie ist ein **Kandidaten- und Entscheidungsspeicher**, keine zweite Deckliste: Aufgenommene Karten aus `current.txt` bleiben allein spiel- und importrelevant; der Kartenpool zählt nicht zu den 100 Karten.

Sinnvolle Einträge sind insbesondere ausgetauschte Karten für einen möglichen Wiedereinbau, interessante Alternativen und bewusst verworfene Optionen. Für jeden Eintrag möglichst knapp **Kartenname, Funktion/Synergie, Grund für Aufnahme oder Ausschluss, Wiedereinbau-Bedingung bzw. mögliche Tauschoption und gegebenenfalls Datum** notieren. Bereits diskutierte oder entfernte Karten sollten nicht verloren gehen; spätere Entscheidungen können den Status aktualisieren.

Die Datei ist **keine Pflicht** für jedes vorhandene Deck und löst keine neuen Validator- oder Review-Gates aus. Sie kann beim normalen Optimieren schrittweise entstehen. Sie liegt im jeweiligen Deckordner und wird in Deck-PRs mitgepflegt; Änderungen an dieser zentralen Konventions-README erfolgen dagegen **separat** gemäß [Beitragsregeln](../CONTRIBUTING.md).

## Listenformat und Commander-Regeln

- Genau **100 Karten einschließlich aller Commander**: normalerweise 99 plus ein Commander, bei einer regelkonformen Kombination zweier Commander 98 plus zwei.
- Eine Zeile pro Karte im Format `ANZAHL Englischer Kartenname`, Commander zuerst. Optional sind die Abschnittsüberschriften `Commander` und `Deck` erlaubt. Leerzeilen sind erlaubt.
- Singleton gilt mit der Standardlandausnahme: Standardländer dürfen mehrfach vorkommen, einschließlich verschneiter Standardländer und Wastes. Andere Länder sind nicht allein aufgrund ihres Landtyps ausgenommen.
- Kartentext kann weitere Mengen-Ausnahmen erlauben; der strukturelle Validator unterstützt diese derzeit nicht. Solche Listen brauchen eine gesonderte Anpassung des Validators und Prüfung der Regeln.
- Commander-Eignung, Farbidentität, Oracle-Kartentext und Bannliste müssen gesondert anhand offizieller Quellen geprüft werden: [Commander-Regeln und Bannlistenverweis](https://magic.wizards.com/en/formats/commander), [Gatherer-Kartendatenbank](https://gatherer.wizards.com/).

## Bracket-Ziel und Prüfgrenzen

**Bracket 3 / Upgraded ist der Standard**, mit maximal drei Karten aus der jeweils geltenden [Wizards-Liste der Game Changers](https://magic.wizards.com/en/formats/commander). Eine andere Zielstufe wird im eigenen Deckordner begründet und klar getrennt dokumentiert.

Die Game-Changer-Zahl allein belegt keine Bracket-Eignung. Auch Spieltempo, Zweikarten-Endlosschleifen, Extrazüge und Massen-Landverweigerung müssen anhand der [Wizards-Bracket-Leitlinien](https://magic.wizards.com/en/formats/commander) beurteilt werden. Brackets dienen der Spielabsprache; sie ersetzen weder die Commander-Legalität noch Partietests oder das Gespräch vor dem Spiel.

Die Offline-CI prüft ausschließlich Listenstruktur, Kartenanzahl, unterstützte Singleton-Regeln und lokale Verweise der zentralen READMEs. Sie validiert **keine Oracle-Namen oder -Texte, Commander-Eignung, Farbidentität, Bannlisten, Game Changers oder Bracket-Legalität**. Ein grüner Check ist kein Nachweis dafür.

## Beiträge und Historie

Für Deck-PRs gelten die [Beitragsregeln](../CONTRIBUTING.md). Sobald ein PR Dateien unterhalb dieses Verzeichnisses außer dieser Konventionsseite ändert, dürfen weder diese Seite noch die Root-README im PR-Diff geändert sein.

Frühere zentrale Deckbeschreibungen und Kartenstände sind über die [historische Archivübersicht](../docs/archive/README.md) erhalten.
