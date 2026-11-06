# Mirri, Weatherlight Duelist — Cats Aggro-Control (Bracket 3, V1)

**Aktiv:** [current.txt](current.txt). **Unveränderlicher Erststand:** [versions/2026-11-05-b3-v1.txt](versions/2026-11-05-b3-v1.txt). Stand 05.11.2026. Andere Decks werden nicht verändert.

## Bauentscheidung

Hybrid aus aggressivem Katzen-Tribal, punktueller Kampfsperre, Token-Motoren und schlanker Interaktion. Der Commander *öffnet* Angriffe, statt alleine die Schadensquelle sein zu müssen. Gegenüber reinem Katzen-Tribal erhöht dieser Bau die Entscheidungsfreiheit im Kampf; gegenüber reiner Token-Strategie besitzt er unabhängige hochwertige Angreifer, Schutz und Kartenmotoren. Ein reiner Mirri-Stax-/Defensiv-Bau verliert dagegen Angriffs- und Wiederaufbaugeschwindigkeit.

### Verifizierte Zusammensetzung

- **100 Karten**: 1 Commander, 32 weitere Kreaturen, 32 Nichtkreaturenzauber, 35 Länder (einschließlich 6 Forest, 4 Plains); 92 verschiedene Kartennamen.
- **24 Katzen einschließlich Mirri** unter 33 Kreaturen (~73 % der Kreaturen). Realmwalker zählt als Changeling zu den Katzen.
- Scryfall-Oracle-Mana-Werte aller 65 Nichtländer einschließlich Commander: MV 1: 16; MV 2: 17; MV 3: 17; MV 4: 7; MV 5: 5; MV 6: 1; MV 8: 1; MV 9: 1. `The Great Henge` hat gedruckt MV 9, wird aber gewöhnlich vergünstigt.
- **Genau drei Game Changers laut Scryfall:** `Aura Shards`, `Gaea's Cradle` und `Teferi's Protection`. Alle Karten Commander-legal, alle Farbidentitäten Teilmenge von {G, W}; am 05.11.2026 live über Scryfalls Sammlungsschnittstelle geprüft. Null unbekannte Karten.
- Keine absichtlich eingebaute Zweikarten-Endlosschleife, keine Massenlandzerstörung. Die Bracket-Einstufung ist zusätzlich zur Kartenlegalität ein Gespräch über Spieltempo und Erwartungen.

## Mirris Regelmechanik – strikt auseinanderhalten

1. **Angriff:** Sobald Mirri als Angreiferin deklariert wird, löst sie aus. Nach Verrechnung darf *jeder Gegner* insgesamt höchstens eine Kreatur in diesem Kampf als Blocker deklarieren. Mirri muss den Kampfschaden nicht überleben oder überhaupt selbst treffen. Verlässt sie nach dem Trigger durch Reconnaissance den Kampf, bleibt die Auflage für diesen Kampf bestehen. Wird sie schon vor dem Angreiferdeklarieren entfernt, gibt es diesen Trigger nicht.
2. **Verteidigung:** Nur **solange Mirri getappt ist**, darf jeder Gegner **dich** in einem Kampf mit höchstens einer Kreatur angreifen. Nicht automatisch geschützt sind deine Planeswalker, und Mirris Einschränkung verbietet keine Angriffe auf andere Spieler. Vor dem Deklarieren der Angreifer tappen: danach ist es für diesen Angriff zu spät. Die Fähigkeit verhindert nur das Deklarieren mehrerer Angreifer gegen dich, nicht das spätere Erzeugen von Kreaturen, die ausdrücklich „tapped and attacking“ ins Spiel kommen.
3. **Vigilance und Enttappen:** Wachsamkeit verhindert beim Angriff das Tappen von Mirri und damit ohne weitere Tap-Quelle die defensive Wirkung. `Reconnaissance` entfernt Mirri aus dem Kampf und enttappt sie – gut zum Überleben, aber anschließend fällt die defensive Sperre weg, bis sie mit einer anderen Quelle wieder getappt wird. Zusätzliche Wachsamkeit aus `Akroma's Will` darf daher gezielt erst **nach** dem Deklarieren der Angreifer verliehen werden.
4. **Schutzkorrektheit:** `Dolmen Gate` verhindert Kampfschaden an **angreifenden** eigenen Kreaturen, keine Zerstörungszauber oder Blocksperren. `Lightning Greaves` gibt Shroud, deshalb können spätere **eigene** zielende Effekte auf den Träger nicht angewendet werden; `Swiftfoot Boots` gibt dagegen Hexproof. `Teferi's Protection` schützt auch gegen viele Massen-Exile- und -Zerstörungseffekte; `Heroic Intervention` bzw. `Flawless Maneuver` retten nicht gegen alle Exile-/Bounce-Wipes.

## Thematische Synergiepakete

**Tappen ohne Angriff (fünf Wege):** `Earthcraft` tappt Mirri ohne das Tappsymbol und enttappt ein **Standardland**, sogar bei Einsatzverzögerung; `Glare of Subdual` tappt Mirri gegen einen gegnerischen Blocker oder Angreifer; `Relic of Legends` erzeugt über eine getappte legendäre Kreatur Mana; `Springleaf Drum` tappt Mirri als Zusatzkosten für Mana; `Survivors' Encampment` bietet denselben Tap-Vorteil auf einem Land-Slot. `Unlicensed Hearse` ist mit Crew 2 eine sechste situative Möglichkeit, zugleich Friedhofsinteraktion: vor dem Crewen Karten exilieren, damit es nicht als 0/0-Kreatur stirbt. Die Schutzfunktion benötigt kein zusätzliches defensives Stax-Paket.

**Katzen, die freie Angriffe in Karten und Schaden übersetzen:** `Adorned Pouncer` und `Skyhunter Skirmisher` verursachen durch Doppelschlag erhöhten Schaden, `Kutzil, Malamet Exemplar` und `Keeper of Fables` belohnen Kampfschaden mit Kartennachschub. `Toski, Bearer of Secrets` liefert denselben Ansatz nach einem Boardwipe wieder. `Skyhunter Strike Force` gibt anderen Kreaturen *Melee*: auf drei Gegner verteilte Angriffe erhöhen die Stärke jedes dieser Angreifer. `Mask of Memory`, `Skullclamp`, `Realmwalker` und `The Great Henge` sorgen für weiteren Nachschub.

**Katzenproduktion und kontrollierte Eskalation:** `Ocelot Pride` verwertet frühe Lebenspunktegewinne und verdoppelt ab dem City’s Blessing neue Token; `Brimaz, King of Oreskos`, `Leonin Warleader`, `Pride Sovereign`, `Regal Caracal` und `Felidar Retreat` erzeugen zusätzliche Katzen. `King of the Pride`, `Feline Sovereign` und `Regal Caracal` verstärken die Armee. `Aura Shards` und `Qasali Slingers` nutzen die entstehenden Katzen für wiederholbares Entfernen gegnerischer Artefakte/Verzauberungen. `Gaea's Cradle` und `Three Tree City` verwandeln Kreaturenbreite in ein großes Finale.

**Arahbo richtig einsetzen:** `Arahbo, Roar of the World` ist in dieser Liste **nicht der Commander**. Seine Eminenz-Fähigkeit arbeitet daher **nicht aus der Kommandozone**, sondern erst, wenn Arahbo als Kreatur im Spiel ist. Er bleibt dennoch ein effizienter Kampfverstärker unter Mirris Blockbegrenzung.

**Schutz und Interaktion:** `Mother of Runes`, `Giver of Runes`, Greaves/Boots, `Plaza of Heroes`, `Heroic Intervention`, `Flawless Maneuver` und `Teferi's Protection` sichern Mirri bzw. den Angriffskern. `Deafening Silence` beschränkt schnelle Noncreature-Combos, `Ranger-Captain of Eos` kann den relevanten Zug blockieren; `Prowling Serpopard` und `Kutzil` wirken gegnerischen Reaktionen entgegen. `Swords to Plowshares`, `Path to Exile`, `Beast Within`, `Qasali Pridemage`, `Boseiju, Who Endures`, `Lion Sash` und Hearse ergänzen die Interaktion.

## Vier unabhängige Siegwege

1. **Frühe Katzen:** Angriff mit Mirri auf höchstens einen Blocker je Gegner, dann Doppelschlag, Katzen-Anthems und `Akroma's Will` für tödliche Schadensfenster.
2. **Token-Überzahl:** Mirri + Warleader/Brimaz/Ocelot/Felidar; nach sieben Angreifer-Triggern `Beastmaster Ascension` mit +5/+5 für die ganze Armee. Neu *angreifend* ins Spiel kommende Token zählen selbst nicht als „hat angegriffen“-Auslöser.
3. **Massiver Finisher:** `Craterhoof Behemoth`, alternativ `Finale of Devastation` mit X >= 10 über Cradle/Three Tree City, macht selbst gegen gegnerische Einzelblocker häufig Schluss. `Jazal Goldmane` verstärkt eine bereits breite Angriffslinie.
4. **Langspiel:** `The Great Henge`, `Realmwalker`, `Toski`, `Kutzil` und `Skullclamp` erhalten den Kartenfluss; Mirri wird bei wiederholtem Removal nicht zum einzigen Gewinnplan.

## Mulligan, Tempoplan und typische Gegner

- **Start:** Idealerweise zwei bis vier Länder plus ein Mana- oder Kartenvorteil-Stück, früh `Ocelot Pride`/`Leonin Vanguard`/`Skullclamp` oder `Earthcraft`/`Wild Growth`/`Nature's Lore`. Mirri kostet 1GW und soll häufig im zweiten oder dritten eigenen Zug kommen, danach sofort Kampfdruck.
- **Aggro:** Mirri über `Earthcraft`, `Relic of Legends`, `Glare of Subdual`, Drum oder Encampment in gegnerischen Zügen getappt halten; den größten Angreifer mit gezieltem Removal entschärfen. Eine gegnerische Kreatur pro Kampf bleibt erlaubt, und fremde Planeswalkerangriffe werden nicht beschränkt.
- **Kreaturenmassen:** `Glare of Subdual`, wiederholte Katzenproduktion und Mirris offensive Blockbegrenzung hebeln die gegnerische Überzahl in der Verteidigung aus; auf nicht-angriffsbasierten Schaden und Opferkombos achten.
- **Control:** `Prowling Serpopard`, `Kutzil`, Schutzpaket und wiederauffüllende Engines lassen mehrere Bedrohungswellen zu; Mirri nicht ohne Schutz in alle Sweeper spielen. `Whitemane Lion` kann wichtige eigene Kreaturen als Flash-Rettung auf die Hand nehmen.
- **Combo:** Die Angriffsbegrenzung allein ist kein Comboschutz. `Deafening Silence`, `Ranger-Captain of Eos`, `Swords`/`Path`/`Beast Within`, `Boseiju`, Hearse und `Lion Sash` bewusst offenhalten. Eine reine Zauber-Combo ohne Kreaturen wird nicht durch Mirri gebremst.

## Getesteter Umfang und Grenzen

1. **Oracle-/Farb-/Bracket-Prüfung:** 92 verschiedene Namen mit zwei aktuellen Scryfall-Collection-API-Abfragen geprüft: 0 Fehler, 0 unbekannte Karten, 100 Commander-legale Karten in G/W/neutraler Farbidentität, exakt 3 Game Changers.
2. **Repository-Strukturvalidator:** `python3 scripts/validate_decks.py` bestanden, inklusive 100-Karten-/Singleton-/Indexprüfung; er prüft keine Oracle-/Bracket-Legalität.
3. **Regressionstests:** `python3 -m unittest discover -s tests -p 'test_*.py'`: 70 Tests erfolgreich.
4. **Starthand-Simulation:** 30.000 deterministisch reproduzierbare 7-Karten-Stichproben mit den ersten 10 Karten, Start-Seed 20261105. 72,47 % der Anfangshände enthielten 2–4 Länder; 74,88 % der ersten 10 Karten mindestens 3 Länder; 4,92 % der Anfangshände mindestens 5 Länder. Dies ist **kein vollständiger Goldfish**: Ramp, Mulligan, farbiges Mana und gegnerische Interaktion sind nicht berücksichtigt.
5. **Nicht behauptet:** Es wurden keine vollständigen Magic-Partien mit Forge oder echten Gegnern simuliert; die Leistung gegen echte Metas bleibt empirisch offen.

## Bewusst nicht enthalten

- `Dueling Grounds`, `Silent Arbiter` und zusätzliche Kissenfestungen schränken die **eigene** breite Offensive zu stark ein.
- `Duelist's Heritage` wurde als zusätzliche Doppelschlagquelle verglichen; im V1 überwiegen Katzenkörper mit Doppelstrike und breitenwirksame Finisher. Wenn in realen Spielen einzelne Angreifer zu selten durchkommen, ist diese Verzauberung ein guter Nachrücker.
- `Squirrel Nest` wird nicht gespielt: Mit `Earthcraft` könnte es die für Bracket 3 unerwünschte frühe Zweikarten-Endlosschleife ermöglichen.
- `Ancient Tomb`, `Crop Rotation`, `Enlightened Tutor`, `Smothering Tithe` und weitere potentielle Game Changers wurden nicht zusätzlich aufgenommen, um die Grenze von 3 einzuhalten. Kartenklassifizierung bei Scryfall ist maßgeblich, nicht bloß Kartenstärke.
- `Lightning Greaves` und `Reconnaissance` sind im Deck, aber die Shroud-/Enttappwechselwirkung ist eine bewusste Timingentscheidung und keine automatische Schutzkombination.

## Regel- und Datenquellen

- [Wizards Commander-Format und Bracket-Leitlinien](https://magic.wizards.com/en/formats/commander)
- [Offizielles Commander-Bracket-Update Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026)
- [Scryfall API, Karten-/Game-Changer-Daten](https://scryfall.com/docs/api)
- [Mirri bei Scryfall](https://scryfall.com/search?q=%21%22Mirri%2C+Weatherlight+Duelist%22)
