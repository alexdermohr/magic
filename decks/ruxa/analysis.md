# Ruxa – Bracket 3 Multiplayer Token-Value v6

**Stand:** 2026-11-19
**Aktive Liste:** [current.txt](current.txt)
**Snapshot:** [versions/2026-11-19-upper-b3-four-player-v6.txt](versions/2026-11-19-upper-b3-four-player-v6.txt)
**Vorige Liste:** [versions/2026-11-19-upper-b3-four-player-v5.txt](versions/2026-11-19-upper-b3-four-player-v5.txt)

## Ziel und Verifikationsgrenze

Ruxa wird auf **vier Spieler**, nicht mehr auf 1v1 ausgerichtet. Ziel ist der obere Rand des regulären **Commander Bracket 3**: längere Partien überstehen, drei Gegner kontrollieren bzw. überrennen können, nach Removal wieder aufbauen und die fähigkeitslosen Token als Druckmittel nutzen.

- **100 Karten** inklusive Commander; **35 reine Länder** (28 Snow-Covered Forest + 7 andere Länder) und **1 modale Land-/Zauberkarte** (Bala Ged Recovery // Bala Ged Sanctuary, effektiv 36 spielbare Landkarten).
- **18 Kreaturen inkl. Ruxa**, davon **3 gedruckt fähigkeitslose Kreaturen**: Leatherback Baloth, Terrian, World Tyrant, Gigantosaurus.
- Weiterhin genau **3 bekannte Game Changer**: Ancient Tomb, Gaea's Cradle, Natural Order (Wizards-Listenstand Oktober 2025 und Update Februar 2026). Keine frühen zweikartenbasierenden Infinite-Kombos angestrebt, keine Extrazüge und keine Mass-Landverweigerung.
- **Historischer v5-Verifikationsstand (2026-11-19):** Der damalige v5-Commit `b533657eb1a91bc0b2d281e6c98a8cc1fa7880f7` wurde über die Scryfall Cards Collection API mit **73 eindeutigen Kartennamen/100 Gesamtkarten** vollständig geprüft. 73/73 Kartennamen gefunden, 0 Commander-illegale Karten, 0 Farbidentitätsfehler und genau 3 als Game Changer markierte Karten: Ancient Tomb, Gaea's Cradle, Natural Order. Bei der modalen Karte wurde für die Scryfall-Abfrage der Vorderseitenname `Bala Ged Recovery` verwendet; die API lieferte `Bala Ged Recovery // Bala Ged Sanctuary` (Sorcery // Land) zurück. Der GitHub-CI-Check `validate-decks` für diesen Commit war erfolgreich. **Nicht** nachgewiesen waren damit tatsächliche Vier-Spieler-Partien und Manabrew-Import/Spielbarkeit; der getrennte v5-Deckgenerator-Test steht unmittelbar darunter. Ein grüner CI-Check und korrekte Kartendaten beweisen keine reale Gewinnstärke.

### Isolierter Manabrew-Deckimport (2026-11-19)

Der echte Generator `apps/manabrew/scripts/generate-ipad-personal-decks.py` wurde mit der **exakten `current.txt` aus PR-Head `9f7f924490e1383b0b296318748c0d46f014f7fa`** (Datei-SHA-256 `2be84d802774936f8dd3796c21be3255cf7d8936af164a858e55e67350034051`) in einem vollständig isolierten temporären Git-Checkout und mit leerem temporärem Scryfall-Cache ausgeführt. Ergebnis: Exitcode 0; **ein importierbarer Ruxa-Deckdatensatz, 99 Hauptdeckkarten + 1 Commander, 73 eindeutige Kartennamen, keine doppelten Karten-IDs, `Bala Ged Recovery` inklusive erkannter Land-Rückseite**. Das generierte persönliche Deckpaket umfasste 89.703 Bytes. Beleg: Grabowski-Job `grabowski-job-18b3f796b781`, terminal `succeeded`; der erste fehlerhafte Testanlauf scheiterte lediglich daran, dass die temporäre Quellenbasis noch kein Git-Repository war, woraufhin der Test in einem eigens initialisierten temporären Git-Checkout erfolgreich wiederholt wurde. Sämtliche Testverzeichnisse wurden nach dem Lauf automatisch entfernt; keine vorhandenen Nutzerdecks, Spielstände, Produktivpakete oder Browserprofile wurden verändert.

**Geltungsgrenze:** Das beweist den **Manabrew-Deckgenerator-Import**, nicht den Start einer Forge-Partie mit dieser Liste, nicht die Browser- oder iPad-Oberfläche und keine Vier-Spieler-Gewinnrate.

## Änderungen v5 → v6 (2 gleichzahlige Ersetzungen)

**Korrektur der früheren Kreaturenzählung:** v5 hatte tatsächlich 20 Kreaturen, nicht die damals in der README angegebenen 19. Nach Entfernung von Verdant Force und Regal Force enthält v6 18 Kreaturen einschließlich Ruxa. Die neue Zählung ergibt sich aus den Kartentypen des vollständigen Scryfall-Abgleichs (73/73 Namen, keine Farb- oder Legalitätsfehler).


| Entfernt | Neu | Warum für vier Spieler? |
| --- | --- | --- |
| Verdant Force (8 Mana) | **Nature's Will** (4 Mana) | Mit Ruxas an Blockern vorbeigeleitetem Kampfschaden Länder enttappen; einmal pro geschädigtem Spieler, nicht pro Angreifer. Mehrere Gegner können getrennte Auslöser erzeugen. Verdant Force war langsam und teuer; Tendershoot Dryad erzeugt weiterhin in jedem Upkeep Tokens. |
| Regal Force (7 Mana) | **Elemental Bond** (3 Mana) | Früh einsetzbarer, wiederholbarer Kartenvorteil durch große oder statisch verstärkte Tokens; Regal Force zog sofort viele Karten, war aber ein einzelner teurer Kreaturen-ETB. |

**Regel- und Tempogrenzen:** Elemental Bond prüft Stärke beim Eintritt; später hinzugefügte Marken lösen nichts rückwirkend aus. Nature's Will kann in einem Kampfschadensegment mehrmals Länder enttappen, doch weiteres Mana muss zwischen Auslösern vor Segmentende sinnvoll ausgegeben werden, sonst verpufft zusätzlich erzeugtes Mana. Nature's Will verleiht den Angreifern keine Fähigkeit; im Vier-Spieler-Tisch kann das vorübergehende Tappen gegnerischer Länder politisch stark wirken. Weder Karte ist ein Game Changer. Kein neuer Infinite-Plan.

### Historische Änderungen v4 → v5 (11 gleichzahlige Ersetzungen)

| Entfernt | Neu | Ziel in Vier-Spieler-Partien |
| --- | --- | --- |
| Quakestrider Ceratops | Elder Gargaroth | Wiederholbare 3/3-Vanilla-Bestien, Kartenziehen bzw. Leben sowie Reichweite zur Verteidigung statt mittelgroßem Vanilla-Slot |
| Ghalta, Primal Hunger | Rampaging Baloths | Wiederkehrende 4/4-Vanilla-Bestien durch Landfall statt alleinstehendem großen Angreifer |
| Fungal Sprouting | Garruk, Primal Hunter | Wiederholt 3/3-Vanilla-Token oder großen Kartenzug statt einmaliger situativer Tokenwelle |
| Nature's Will | Verdant Force | Token in **jedem** Upkeep (vier pro vollständiger Runde) statt gegnerisches Mana zu tappen/selbst Länder zu enttappen |
| Life's Legacy | Greater Good | Reaktive, wiederholbare Kartenauswahl und Opferoption bei Removal statt einmaliger Hexerei |
| Up the Beanstalk | Mask of Memory | Wiederholbarer Kartenvorteil bei Ruxa-Kampfschaden; Equipment verleiht keine Fähigkeit |
| Emerald Medallion | Idol of Oblivion | Einmal pro Runde Karten nach Tokenproduktion; optionale 10/10-Vanilla-Eldrazi |
| Hard-Hitting Question | Ezuri's Predation | Mehrspieler-Sweeper mit vielen 4/4-Vanilla-Bestien gegen gegnerische Kreaturen |
| Tamiyo's Safekeeping | Fresh Meat | Nach gegnerischem Massen-Zerstören sofort viele 3/3-Vanilla-Bestien statt einzelner Schutzaktion |
| Regrowth | Sword of the Animist | Wiederholbares Grundland-Ramp durch Angriffe; die einmalige Kartenrückholung wird durch Bala Ged Recovery ersetzt |
| 1 Snow-Covered Forest | Bala Ged Recovery // Bala Ged Sanctuary | Als Land spielbar oder wichtige Karte aus Friedhof zurückholen, ohne die effektive Anzahl spielbarer Länder zu reduzieren |

## Kernmechanik und Mehrspieler-Taktik

1. **Tischbreite erzeugen.** Tendershoot Dryad arbeitet mit vier Upkeeps pro Runde; Rampaging Baloths und Scute Swarm mit Landfall, Deep Forest Hermit und Avenger of Zendikar füllen das Feld einmalig. Parallel Lives/Doubling Season verdoppeln Tokens; Garruk, Primal Hunter erzeugt 3/3-Bestien ohne Fähigkeiten.
2. **Ruxa lohnt sich mit Vanilla-Tokens.** Der eigene +1/+1-Bonus und die Wahl, bei geblockten Vanilla-Angreifern Schaden dem verteidigenden Spieler zuzuweisen, bleiben verfügbar. Beastmaster Ascension und Muraganda Petroglyphs erhöhen nur Stärke/Widerstandskraft, ohne Fähigkeiten zu verleihen. **Garruk's Uprising bleibt ausgeschlossen**, weil dauerhaft verliehener Trampelschaden beide Ruxa-Vorteile bei betroffenen Kreaturen abschaltet.
3. **Karten nachziehen.** Elemental Bond zieht für eigene eintretende Kreaturen mit Stärke 3 oder mehr, auch 2/2-Katzen mit Ruxa oder 1/1-Saprolinge mit Ruxa plus Muraganda Petroglyphs. Toski nutzt durchgeschlagenen Schaden bei mehreren Gegnern; Mask of Memory löst auch bei geblockten Angreifern aus, wenn deren Ruxa-Schaden einem Spieler zugewiesen wird. Idol of Oblivion zieht nach Token-Erzeugung einmal pro eigenem Tap. Greater Good dient mit großen Kreaturen und Ruxa-Rekursion als Schutz vor gezieltem Removal und als Filter.
4. **Mana durch Kampfschaden.** Nature's Will enttappt alle eigenen Länder für jeden Spieler, dem mindestens eine unserer Kreaturen in einem Kampfschadensegment Schaden zufügt; Ruxa macht Vanilla-Tokens auch bei Block dafür geeignet. Mana zwischen mehreren Auslösern nur mit passenden Fähigkeiten/Instants nutzen, sonst mindestens die letzte Enttappung für die nächste Hauptphase erhalten.
5. **Massenremoval überstehen.** Heroic Intervention schützt viele Kreaturen vor Zerstörung, aber nicht vor -X/-X oder Exil. **Fresh Meat nach der vollständigen Abwicklung** einer Zerstörungs- oder -X/-X-Massenentfernung verwandelt eigene im selben Zug gestorbene Kreaturen (inklusive Token) in neue 3/3-Bestien: Diese waren beim einmalig verrechneten -X/-X-Effekt (z. B. Toxic Deluge) noch nicht im Spiel und bleiben deshalb unbeeinflusst. **Gegen Exil und Bounce hilft Fresh Meat nicht**, denn dabei landen die Kreaturen nicht im Friedhof. Bala Ged Recovery als Regrowth-Ersatz holt eine Schlüsselkarte aus dem Friedhof zurück.
6. **Drei Gegner abschließen.** Ein großes Tokenboard mit Craterhoof Behemoth, Finale of Devastation oder Triumph of the Hordes kann mehreren Gegnern zugleich gefährlich werden. Ezuri's Predation wirkt besonders stark, wenn mehrere Gegner Kreaturen angesammelt haben. Mit Ruxa über blockende Gegner hindurch Schaden verteilen, aber bei durch Craterhoof/Finale/Triumph verliehenem Trampelschaden/anderen Fähigkeiten den Ruxa-Bonus nicht mitrechnen.

## Risiko, Alternativen, offene Gegenproben

- Der Wegfall von Verdant Force senkt die Acht-Mana-Dichte (Ezuri's Predation bleibt teuer). Der Wegfall von Regal Force kostet einen tutorbaren sofortigen Massenzieher; Elemental Bond braucht nachfolgende Kreatureneintritte und kann ohne Token-Engine wenig leisten. Nature's Will ist kampfabhängig und kann in offenen Vier-Spieler-Partien zusätzliche Gegenreaktionen auslösen. Die Beschleunigung durch Earthcraft, Gaea's Cradle, Growing Rites of Itlimoc und Circle of Dreams Druid bleibt unangetastet.
- Weniger gedruckte Vanilla-Kreaturen reduzieren die Ziele für Ruxas Friedhofsrückholung auf drei; diese bleiben bewusst groß. Die meisten Tokens selbst werden nicht von Ruxa aus dem Friedhof zurückgebracht.
- Fresh Meat zählt alle Kreaturen, die in diesem Zug vom Spielfeld in den eigenen Friedhof gelangt sind (inkl. Token, auch durch -X/-X). Gegen Exil und Bounce hilft es nicht.
- **Kein** Moldervine Reclamation: enthält ein schwarzes Manasymbol (Golgari-Farbidentität) und ist daher in Ruxa unzulässig. **Kein** Garruk's Uprising wegen Antisynergie. **Kein** Worldly Tutor oder Seedborn Muse, weil die vorhandenen drei Game-Changer-Slots belegt sind.
- **Ausstehend:** isolierter Manabrew-Import für **v6** und reproduzierbare echte Vier-Spieler-Testspiele inklusive Gegenproben gegen frühe Boardwipes, Flying-Decks und Removal-lastige Gruppen. Der v5-Importgenerator-Test ist oben belegt; ein nachfolgender älterer Node-Forge-Vier-Spieler-Test erreichte innerhalb des Timeouts keine nachgewiesene Spielentscheidung, was keine Diagnose der Kartenliste erlaubt. Ein zusätzlicher Abgleich gegen Wizards Gatherer kann bei strittigen Einzelfällen sinnvoll sein; die komplette Scryfall-Legalitäts-/Farbidentitätsprüfung wurde bereits durchgeführt. Erfolgsbewertung: mehrere echte Partien mit stabilem Nachzug und Gewinnwegen gegen drei Gegner.

## Belege für Neueinbauten und Brackets

- Elemental Bond – Eintrittsschwelle und statische Boni: https://mtg.wtf/card/c17/148/Elemental-Bond
- Nature's Will – Kampfschadensauslöser: https://mtg.wtf/card/chk/230/Natures-Will
- Scryfall Cards Collection API (historischer v5-Snapshot am 2026-11-19 abgefragt): https://scryfall.com/docs/api/cards/collection
- Wizards Commander-Format und Brackets: https://magic.wizards.com/en/formats/commander
- Offizielle Game Changers, Oktober 2025: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- Bracket-Update Februar 2026: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- Oracle-/Legalitätsbeispiele: https://mtg.wtf/card/m21/179/Elder-Gargaroth ; https://mtg.wtf/card/40k/243/Mask-of-Memory ; https://mtg.wtf/card/c19/55/Idol-of-Oblivion ; https://mtg.wtf/card/nph/109/Fresh-Meat ; https://mtg.wtf/card/c15/207/Verdant-Force
