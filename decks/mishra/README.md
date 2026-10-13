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

## Aktuelles Bracket 3: Mishra's Workshop + Memory Jar (12.10.2026)

**Aktiv und verbindlich ist nur [current.txt](current.txt).** Kein The One Ring und keine Bolas's Citadel; keine Aetherflux Reservoir oder Krark-Clan Ironworks. **Brudiclad**, **Ashnod's Altar** und **Sensei's Divining Top** bleiben.

| Raus | Rein | Nutzen und Grenze |
|---|---|---|
| **Bolas's Citadel** (Game Changer) | **Memory Jar** (kein Game Changer) | Mishras Warform kann vor dem zweiten Hauptsegment sieben temporäre Karten zugänglich machen, ohne Lebenszahlung. Gegner ziehen ebenfalls sieben und können ihre neuen Instants verwenden. |
| **Buried Ruin** (farbloses Land) | **Mishra's Workshop** (Game Changer) | Liefert jede Runde {C}{C}{C} nur zum Wirken von Artefaktzaubern; keine Kosten für Mishra selbst oder Aktivierungen, kein eigenes Schadensrisiko. Die einmalige Land-Rekursion entfällt. |

**Drei Game Changer:** **Demonic Tutor, Mana Vault, Mishra's Workshop**. Die bisher aus dem Deck gestrichenen Rhystic Study und Cyclonic Rift bleiben draußen. Die bisherige Sensei's Top bleibt ein Saga-Suchtreffer und arbeitet mit Fetchlands, aber **ohne Citadel existiert kein Top-/Life-Casting-Loop**. Brudiclad kann die nichtlegendäre Memory-Jar-Warform in weitere Tokenkopien verwandeln, ohne dadurch zusätzliche ETBs auszulösen.

**Struktur:** 100 unterschiedliche legale Commander-Karten, **35 Länder, 47 Artefakte und 13 definierte Mana-Artefakte**, maximal drei Game Changer. Der [Erweiterte Kreis](erweiterter-kreis.md) führt **42 historische Cuts und 99 Alternativen = 141 disjunkte Karten**. Die separate Bracket-4-Liste bleibt unverändert. Neue Engine-/Manabrew-Tests noch ohne bestandene Spielsequenzen.

[Analyse und Gegenargumente](analysis.md) · [100 Einzelbewertungen](replaceability.md) · [Manabrew-Prüfprotokoll](manabrew-tests.md)

## Archiv früherer Revisionen (nicht maßgeblich)

Die folgenden Abschnitte dokumentieren frühere B3-Stände; ihre damaligen Aussagen über „aktuell“ und Game Changer gelten **nicht** für die einzige verbindliche [Liste oben](current.txt). Für Reproduktionen historische Commit-Links verwenden.

## Vorangegangener Deckentscheid: Brudiclad/Ashnod erhalten und Top aufgenommen (historisch, 12.10.2026)



**[current.txt](current.txt) ist die einzige verbindliche B3-Liste.** Brudiclad, Telchor Engineer und Ashnod's Altar bleiben nach Nutzerentscheidung im Deck. Aetherflux Reservoir und Krark-Clan Ironworks waren nur vorübergehende Vorschläge auf dem noch offenen PR-Branch und wurden wieder gestrichen.

| Gegenüber dem bestehenden GitHub-`main` | Nutzen und Risiko |
|---|---|
| **Lich's Relic → Sensei's Divining Top** | Die Top ist mit **Urza's Saga** suchbar, verbessert die Qualität der obersten Karten und arbeitet mit Fetchländern sowie **Bolas's Citadel**. Ohne Reservoir dient sie dem kontrollierten Nachziehen statt einer schnellen Siegkombination. Gegenargument: Das kopierbare Kreaturen-Removal von Lich's Relic geht verloren. |

**Brudiclad** kann nach Mishras Kampfauslöser bestehende Tokens dauerhaft zu Warform-Kopien machen (ohne zusätzliche ETBs). **Ashnod's Altar** liefert für drei Mana eine kostenlose Opferfähigkeit für Warforms und andere Kreaturen. Die Game Changer bleiben **Demonic Tutor, Mana Vault und Bolas's Citadel**; kein vierter Slot.

**Struktur:** 100 Karten, 35 Länder, 47 Artefakte, 13 benannte Mana-Artefakte, drei Game Changer. [Erweiterter Kreis](erweiterter-kreis.md): **40 historische Cuts + 96 nicht aktive Alternativen = 136 Karten**, disjunkt zur aktiven Liste. Bracket 4 bleibt unverändert. Live-Spieltests der neuen Top-/Brudiclad-Sequenzen stehen aus.

[Entscheidungsanalyse](analysis.md) · [100 Einzelbewertungen](replaceability.md) · [Manabrew-Tests](manabrew-tests.md)

## Historischer GC-Tausch – Mana Vault und Bolas's Citadel (11.10.2026)

**Die [historische B3-Liste vom 11.10.2026](https://github.com/alexdermohr/magic/blob/48f83922912ae1faf48756276d3caeadc65738d8/decks/mishra/current.txt) enthielt als drei Game Changer Demonic Tutor, Mana Vault und Bolas's Citadel.** Die bisherigen Game Changer Rhystic Study und Cyclonic Rift wurden nach Nutzerentscheidung entfernt.

| Raus | Rein | Zweck und wichtigste Kosten |
|---|---|---|
| **Rhystic Study** | **Mana Vault** | Für {1} sofort {C}{C}{C}, statt zusätzlichem Multiplayer-Draw. Mishras Warform kopiert Mana Vault als {3}-Manaquelle; Thousand-Year Elixir kann für {1} eine solche Kreatur enttappen. Mana Vault ist auch per **Urza's Saga** suchbar. Das Original enttappt nicht im Untap-Segment, lässt sich für {4} enttappen und kostet getappt 1 Leben im Ziehsegment. |
| **Cyclonic Rift** | **Bolas's Citadel** | Grixis-legales legendäres **Nichtkreatur-Artefakt** ({3}{B}{B}{B}), direkt per Arcum suchbar oder durch Welder/Transmuter nutzbar. Ermöglicht Topdeck-Spielen und Casting gegen Leben; {T} und zehn geopferte Nichtland-Permanents lassen jeden Gegner 10 Leben verlieren. Dafür fehlt nun der asymmetrische Instant-Bounce; Schwarzbedarf und Lebensverbrauch steigen. |

**Damals gültige Struktur:** **100 Einzelkarten, 35 Länder, 47 Artefakte, 13 Mana-Artefakte, exakt drei Game Changer**. Keine Kreaturenwipes, keine bewusst eingebaute frühe Zweikarten-Endloskombo. Demonic Tutor, Arcum Dagsson, Thousand-Year Elixir, Tezzeret, Master of the Bridge, Demonic Junker, Whir of Invention und The Mightstone and Weakstone bleiben im Deck.

Im damaligen Stand standen **40 historische Cuts + 95 weitere geprüfte Alternativen = 135 nicht aktive Karten**, ohne Überschneidung. [Ersetzbarkeitsmatrix](replaceability.md) bewertet genau die 100 aktiven. **B4 unverändert.** Die Regeltexte sind verifizierbar, die neuen Engine-Fälle F1–F6 jedoch **nicht durch Manabrew-Testpartien bestätigt**.

## Vorherige Optimierung – Draught und Tezzeret (historisch, 11.10.2026)

| Entfernt | Aufgenommen | Warum |
|---|---|---|
| **Chromatic Lantern** | **Mephitic Draught** | Der Nutzer beurteilt die vorhandene Farbversorgung durch Länder/Manarocks als ausreichend. Das günstige {1}{B}-Artefakt zieht beim ETB eine Karte und eine weitere, sobald es aus dem Spielfeld in den Friedhof geht; durch Mishras Warform regelmäßig zwei Karten, verbunden mit **insgesamt zwei Lebenspunkten Verlust**. |
| **Reckless Fireweaver** | **Tezzeret, Master of the Bridge** | Statt punktuellem ETB-Schaden ein unabhängiger Abschluss für {4}{U}{B}: Tezzerets **+2 verursacht X Schaden an jedem Gegner**, wobei X die Zahl eigener Artefakte ist, und du gewinnst **einmal X Leben**; die −3-Fähigkeit holt Artefakte zurück. |

**Damals gültige Struktur der vorherigen Deckfassung:** 100 unterschiedliche Karten einschließlich Mishra, **35 Länder, 45 Artefakte, 12 Mana-Artefakte**, exakt drei Game Changer (**Demonic Tutor, Rhystic Study, Cyclonic Rift**); kein absichtlicher früher Zweikarten-Loop und keine Kreaturenwipes. **Thousand-Year Elixir**, Arcum Dagsson, Demonic Junker, Whir of Invention und The Mightstone and Weakstone bleiben enthalten. Der [Erweiterte Kreis](erweiterter-kreis.md) verwaltet **38 frühere Cuts + 95 weitere Alternativen = 133 nicht aktive Karten**. Bracket 4 ist unverändert.

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

## Historische B3-Fassung vom 11.10.2026 (nicht aktuell)

**Stand: 11. Oktober 2026 (historisch)** · [Eingefrorene 100-Karten-Liste](https://github.com/alexdermohr/magic/blob/48f83922912ae1faf48756276d3caeadc65738d8/decks/mishra/current.txt). Die heutige verbindliche Deckliste steht **ausschließlich oben** unter [current.txt](current.txt).

- **Commander:** Mishra, Eminent One (Grixis).
- **100 Karten**, alle Singleton, **35 Länder**, **47 Artefakte** einschließlich Artefaktkreaturen und Artefaktländer, **13 Mana-Artefakte**.
- **Genau drei Game Changer:** Demonic Tutor, Mana Vault und Bolas's Citadel.
- **Keine klassischen Kreaturenwipes**, keine absichtlich frühe Zweikarten-Endloskombo, kein Mass-Land-Denial und keine Extrazug-Kette.
- Sundial of the Infinite bleibt wegen des berichteten manabrew.app-Problems draußen; Coveted Jewel wegen Kontrollverlust-Risiko. Beide sind im [Erweiterten Kreis](erweiterter-kreis.md) vermerkt.
- **The Mightstone and Weakstone** und **Demonic Junker** sind weiterhin enthalten.

### Zwei vorausgegangene bestätigte Tausche

| Raus | Rein | Warum |
|---|---|---|
| **Spine of Ish Sah** | **Nautiloid Ship** | Viermana-Flugfahrzeug. Mishras fliegende Warform exiliert beim Eintritt einen Spielerfriedhof; nach Kampfschaden kann sie eine mit sich selbst exilierte Kreatur übernehmen. Verliert Spines universelle Permanent-Zerstörung. |
| **Fabricate** | **Arcum Dagsson** | Arcum kann eine eigene Warform opfern, um ein beliebiges **Nichtkreatur-Artefakt** direkt aus der Bibliothek ins Spiel zu legen, sogar Portal to Phyrexia. Benötigt eine einsatzbereite Tap-Kreatur und ein Artefaktkreatur-Ziel; Fabricate war sofort einsatzbereit und suchte auf die Hand. |

Damals beschleunigte **Mana Vault** große Artefakt-ETBs; **Bolas's Citadel** bot einen zusätzlichen Artefakt-Topdeckmotor. Ohne Cyclonic Rift stehen weiterhin gezieltes Removal, Counter und Portal to Phyrexia zur Verfügung; einen gleichwertigen asymmetrischen Reset ersetzen sie nicht. Der damalige Plan verband wiederholbare Warform-ETBs von **Knight Paladin, Mephitic Draught, Ichor Wellspring und Cryogen Relic** mit Arcum-Tutoring, Welder/Engineer/Emry-Rekursion und mit **Tezzerets artefaktabhängigem Gruppenschaden** einem eigenen Siegweg. Oni-Cult Anvil, Esoteric Duplicator, Worldwalker Helm und Brudiclad erzeugen zusätzlichen Token- und Opferwert. Die Aufnahme von Tezzeret ersetzt nicht die übrigen Abschlüsse Kappa Cannoneer, Simulacrum Synthesizer oder Knight Paladin.

**Urza's Saga** konnte in dieser historischen Fassung **Sol Ring**, **Mana Vault** und **Mox Opal** anhand der aufgedruckten Manakosten {0}/{1} suchen; die später aufgenommene **Sensei's Divining Top** ist in der aktuellen Liste ebenfalls ein legales Ziel. Frühere Ziele Skullclamp und Nihil Spellbomb sind entfernt; Lich's Relic mit Manakosten {B} ist kein Saga-Suchziel.

## Pflegevereinbarung: Erweiterter Kreis

Bei **jeder** künftigen Optimierung gehört jede Karte, die **aus `current.txt` entfernt wird**, mit Grund und Rückkehrbedingung in [erweiterter-kreis.md](erweiterter-kreis.md). Ebenso jede geprüfte Karte, die **nicht hineinkommt**. Wird eine Karte wieder aktiv, darf sie nicht zugleich als „derzeit nicht aufgenommen“ im Erweiterten Kreis stehen; ihre Rückkehr wird in der [Analyse](analysis.md) protokolliert.

Historische Revisionen müssen nicht als neue B3-Deckdateien gepflegt werden. Die Git-Historie enthält alle früheren Fassungen, die [Analyse](analysis.md) enthält die chronologischen Entscheidungen. Das [Archiv der früher ausgewerteten B3-Versionen](https://github.com/alexdermohr/magic/commits/main/decks/mishra/current.txt) bildet die Grundlage des erweiterten Kreises.

## Quellen und Grenzen

[Offizielle Commander-Brackets](https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta) · [Wizards Februar-2026-Update](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Mishra-Regelhinweise](https://magic.wizards.com/en/news/feature/the-brothers-war-release-notes) · [Scryfall](https://scryfall.com/docs/api/cards/collection).

Die publizierte Liste wurde gegen Scryfall auf Commander-Legalität, Grixis-Farbidentität und Game Changer geprüft. Neue Mischmechaniken sind nicht automatisch in manabrew.app auf ihre korrekte Ausführung getestet.