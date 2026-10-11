# Mishra, Eminent One

## Verbindliche Dateien

Mishra hat genau **eine aktive Bracket-3-Deckliste** sowie eine separat gepflegte Bracket-4-Liste. Alle vom Deck ausgeschlossenen, aber bekannten Karten bleiben im **Erweiterten Kreis**, nicht in konkurrierenden B3-Versionen.

| Zweck | Datei |
|---|---|
| **Aktuelles Bracket-3-Deck (100 Karten)** | [current.txt](current.txt) |
| **Erweiterter Kreis (historisch entfernt oder geprüft, aber nicht eingebaut)** | [erweiterter-kreis.md](erweiterter-kreis.md) |
| **Aktuelle individuelle Bewertung aller 100 Karten** | [replaceability.md](replaceability.md) |
| **Entscheidungen, Karteninteraktionen und historische Revisionen** | [analysis.md](analysis.md) |
| **Separates Bracket-4-Deck (unverändert)** | [versions/2026-10-07-optimized-b4-v1.txt](versions/2026-10-07-optimized-b4-v1.txt) |
| **Manabrew-Funktionsprüfung / Testfälle** | [manabrew-tests.md](manabrew-tests.md) |
| **Reproduzierbare Struktur-/Scryfall-Validierung** | [validate.py](validate.py) (`python3 decks/mishra/validate.py --oracle`) |

## Aktuelles Mishra Bracket 3 – zwei weitere gezielte Optimierungen (11.10.2026)

| Entfernt | Aufgenommen | Warum |
|---|---|---|
| **Chromatic Lantern** | **Mephitic Draught** | Der Nutzer beurteilt die vorhandene Farbversorgung durch Länder/Manarocks als ausreichend. Das günstige {1}{B}-Artefakt zieht beim ETB eine Karte und eine weitere, sobald es aus dem Spielfeld in den Friedhof geht; durch Mishras Warform regelmäßig zwei Karten, verbunden mit **insgesamt zwei Lebenspunkten Verlust**. |
| **Reckless Fireweaver** | **Tezzeret, Master of the Bridge** | Statt punktuellem ETB-Schaden ein unabhängiger Abschluss für {4}{U}{B}: Tezzerets **+2 verursacht X Schaden an jedem Gegner**, wobei X die Zahl eigener Artefakte ist, und du gewinnst **einmal X Leben**; die −3-Fähigkeit holt Artefakte zurück. |

**Aktuelle Struktur (verbindlich [current.txt](current.txt)):** 100 unterschiedliche Karten einschließlich Mishra, **35 Länder, 45 Artefakte, 12 Mana-Artefakte**, exakt drei Game Changer (**Demonic Tutor, Rhystic Study, Cyclonic Rift**); kein absichtlicher früher Zweikarten-Loop und keine Kreaturenwipes. **Thousand-Year Elixir**, Arcum Dagsson, Demonic Junker, Whir of Invention und The Mightstone and Weakstone bleiben enthalten. Der [Erweiterte Kreis](erweiterter-kreis.md) verwaltet **38 frühere Cuts + 95 weitere Alternativen = 133 nicht aktive Karten**. Bracket 4 ist unverändert.

**Echte Opportunitätskosten:** Chromatic Lantern verbesserte alle Farbquellen; ohne sie gibt es weniger verfügbare Manaquellen. Mephitic Draught zieht gegen Lebensverlust, und der neue Sechs-Mana-Finisher ist langsamer als Fireweavers {1}{R}-Druck. Das ist eine begründete Priorisierung von **Kartennachschub und einer von Mishra unabhängigen Gewinnoption**, keine statistisch verifizierte höhere Siegquote. Die aktuellen Spielinteraktionen in Manabrew sind noch nicht durch Partien nachgewiesen; [Testfälle](manabrew-tests.md).

## Vorangegangener Deckstand – Thousand-Year Elixir (historisch, 11.10.2026)

**Damals jüngster bestätigter Tausch:** **Thought Monitor raus → Thousand-Year Elixir rein.** Das Elixier ermöglicht Arcum Dagsson, Goblin Welder, Goblin Engineer, Emry und Master Transmuter, Tap-Fähigkeiten bereits im Ausspielzug einzusetzen, und kann für {1},{T} eine Kreatur enttappen. Es ist nun ein **Nichtkreatur-Artefakt** und kann selbst als Mishra-Warform kopiert werden; die Kopie hat nur die bis zum Endsegment zur Verfügung stehenden Aktivierungen. Es gibt **keinen sofortigen Kartenzieh-ETB** wie Thought Monitor. Die Software-Interaktionen sind noch nicht in Manabrew nachgespielt.

**Damals unverändert:** 100 Singleton-Karten, 35 Länder, 45 Artefakte, 13 Mana-Artefakte, drei Game Changer (**Demonic Tutor, Rhystic Study, Cyclonic Rift**); kein Kreaturenwipe oder absichtlich frühe Zweikarten-Endloskombo. Der Erweiterte Kreis enthielt zu diesem Zeitpunkt **37 historische Cuts und 95 weitere Alternativen**, insgesamt 132. Thought Monitor ist mit Gegenargument und Rückkehrbedingung eingetragen, Elixir nicht mehr als ausgeschlossen geführt. **Bracket 4 bleibt separat unverändert.**

## Vorherige Nachprüfung vom 11. Oktober 2026 (historisch, vor Elixir)

- **Damals noch unverändertes Deck:** Zu diesem Zeitpunkt war kein neuer Kandidat anhand der noch ungetesteten Manabrew-Interaktionen eindeutig überlegen. Die zuletzt vorgenommenen Tausche **Spine of Ish Sah → Nautiloid Ship** und **Fabricate → Arcum Dagsson** bleiben bestehen.
- **Live-Scryfall-Prüfung:** Alle 100 Karten Commander-legal und innerhalb Grixis; die drei offiziellen Game Changer sind bestätigt. 100 unterschiedliche Namen in [current.txt](current.txt); genau diese 100 in [replaceability.md](replaceability.md); 132 ausgeschlossene andere Namen in [erweiterter-kreis.md](erweiterter-kreis.md), keine Überschneidung.
- **Manabrew:** Die Browser-Startseite wurde erreicht. **Keine** Nautiloid-/Arcum-/Kopiersequenz wurde in einer Partie reproduziert. Papierregeln sind **kein** Manabrew-Funktionsnachweis. [Reproduzierbares Testprotokoll](manabrew-tests.md).
- **Damals offene Tauschhypothese:** **Thousand-Year Elixir** kann Arcum Dagsson, Goblin Welder, Goblin Engineer, Emry und Master Transmuter früher aktivieren, benötigt aber einen Synergieslot. **The Master, Multiplied** verhindert Warform-Opfertrigger nach Papierregeln, kostet jedoch sechs Mana und ist in Manabrew ungetestet.
- **Bracket 3 bleibt die Grenze:** Drei Game Changer, keine Kreaturenwipes, keine bewusst frühe Zweikarten-Endloskombo. Der Validator prüft namentlich ausdrücklich ausgeschlossene Wipes (u. a. Toxic Deluge, Karn's Sylex), aber nicht jede mögliche Massenentfernung semantisch; bei neuen Karten ist zusätzlich die fachliche Prüfung nötig. **The Mightstone and Weakstone, Demonic Junker, Whir of Invention** bleiben. Bracket 4 unverändert.

## Aktuelle Bracket-3-Fassung

**Stand: 11. Oktober 2026** · einzig verbindlich ist die [aktive Bracket-3-Deckliste](current.txt); frühere Commit-Verweise stehen ausschließlich in der chronologischen Analyse.

- **Commander:** Mishra, Eminent One (Grixis).
- **100 Karten**, alle Singleton, **35 Länder**, **45 Artefakte** einschließlich Artefaktkreaturen und Artefaktländer, **12 Mana-Artefakte**.
- **Genau drei Game Changer:** Demonic Tutor, Rhystic Study und Cyclonic Rift.
- **Keine klassischen Kreaturenwipes**, keine absichtlich frühe Zweikarten-Endloskombo, kein Mass-Land-Denial und keine Extrazug-Kette.
- Sundial of the Infinite bleibt wegen des berichteten manabrew.app-Problems draußen; Coveted Jewel wegen Kontrollverlust-Risiko. Beide sind im [Erweiterten Kreis](erweiterter-kreis.md) vermerkt.
- **The Mightstone and Weakstone** und **Demonic Junker** sind weiterhin enthalten.

### Zwei vorausgegangene bestätigte Tausche

| Raus | Rein | Warum |
|---|---|---|
| **Spine of Ish Sah** | **Nautiloid Ship** | Viermana-Flugfahrzeug. Mishras fliegende Warform exiliert beim Eintritt einen Spielerfriedhof; nach Kampfschaden kann sie eine mit sich selbst exilierte Kreatur übernehmen. Verliert Spines universelle Permanent-Zerstörung. |
| **Fabricate** | **Arcum Dagsson** | Arcum kann eine eigene Warform opfern, um ein beliebiges **Nichtkreatur-Artefakt** direkt aus der Bibliothek ins Spiel zu legen, sogar Portal to Phyrexia. Benötigt eine einsatzbereite Tap-Kreatur und ein Artefaktkreatur-Ziel; Fabricate war sofort einsatzbereit und suchte auf die Hand. |

Der aktuelle Plan verbindet wiederholbare Warform-ETBs von **Knight Paladin, Mephitic Draught, Ichor Wellspring und Cryogen Relic** mit Arcum-Tutoring, Welder/Engineer/Emry-Rekursion und mit **Tezzerets artefaktabhängigem Gruppenschaden** einem eigenen Siegweg. Oni-Cult Anvil, Esoteric Duplicator, Worldwalker Helm und Brudiclad erzeugen zusätzlichen Token- und Opferwert. Die Aufnahme von Tezzeret ersetzt nicht die übrigen Abschlüsse Kappa Cannoneer, Simulacrum Synthesizer oder Knight Paladin.

**Urza's Saga** kann derzeit genau **Sol Ring** und **Mox Opal** anhand der Manakosten {0}/{1} suchen. Frühere Ziele Skullclamp und Nihil Spellbomb sind entfernt; Lich's Relic mit Manakosten {B} ist kein Saga-Suchziel.

## Pflegevereinbarung: Erweiterter Kreis

Bei **jeder** künftigen Optimierung gehört jede Karte, die **aus `current.txt` entfernt wird**, mit Grund und Rückkehrbedingung in [erweiterter-kreis.md](erweiterter-kreis.md). Ebenso jede geprüfte Karte, die **nicht hineinkommt**. Wird eine Karte wieder aktiv, darf sie nicht zugleich als „derzeit nicht aufgenommen“ im Erweiterten Kreis stehen; ihre Rückkehr wird in der [Analyse](analysis.md) protokolliert.

Historische Revisionen müssen nicht als neue B3-Deckdateien gepflegt werden. Die Git-Historie enthält alle früheren Fassungen, die [Analyse](analysis.md) enthält die chronologischen Entscheidungen. Das [Archiv der früher ausgewerteten B3-Versionen](https://github.com/alexdermohr/magic/commits/main/decks/mishra/current.txt) bildet die Grundlage des erweiterten Kreises.

## Quellen und Grenzen

[Offizielle Commander-Brackets](https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta) · [Wizards Februar-2026-Update](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Mishra-Regelhinweise](https://magic.wizards.com/en/news/feature/the-brothers-war-release-notes) · [Scryfall](https://scryfall.com/docs/api/cards/collection).

Die publizierte Liste wurde gegen Scryfall auf Commander-Legalität, Grixis-Farbidentität und Game Changer geprüft. Neue Mischmechaniken sind nicht automatisch in manabrew.app auf ihre korrekte Ausführung getestet.