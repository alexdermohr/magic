# Sauron — Optimierung und Einzelprüfung

Stand 2026-10-18. v1, v2 und v3 sind tatsaechlich entstandene, unveraendert archivierte 100-Karten-Listen unter versions/. current.txt ist die optimierte v4. Die 100 Einzelpositionen wurden hinsichtlich Regeltext, Tempo, Synergie, Schwachpunkt und möglichem Ersatz überprüft. Bewertung rein theoretisch.

## Acht v1 → v2 Wechsel

| Heraus | Hinein | Begründung |
|---|---|---|
| Nightscape Familiar | Rakdos Signet | Früher echter Grixis-Ramp statt Kostenreduktion, die farbige Sauron-Pips nicht bezahlt. |
| Dreadhorde Invasion | Cool but Rude | Auf Stufe 2 jeder Discard zwei Schaden an jeden Gegner, sehr starker Tempt-/Wheel-Abschluss. |
| Widespread Brutality | Monument to Endurance | Wiederholbare Schatz-, Karten- und gegnerische Lebensverlust-Effekte statt selbstzerstörendem Kreaturen-Wipe. |
| Trailblazer's Boots | Key to the Side-Door | Für zwei Aktivierungsmana sichere Army-Unblockbarkeit statt abhängigem Nonbasic-Landwalk. |
| Living Death | Sauron's Ransom | Instant-Cardflow plus Ring-Tempt statt symmetrischer Fünfmana-Reanimation. |
| Psychosis Crawler | Phial of Galadriel | Mana-Fixing und im Ring-Wheel aus leerer Hand insgesamt fünf Karten statt vier. |
| Rogue's Passage | Cavern of Souls | Horror benennt Sauron; Commander wird gegen Counterspell nicht konterbar. |
| Fabled Passage | Prismatic Vista | Basic bereits vor dem vierten Land enttappt, bessere frühe Manakurve. |

**Gegenargument:** Living Death oder Psychosis Crawler können im langen Spiel explosiver sein; Trailblazer's Boots braucht nach Equipment-Anlegen kein weiteres Mana, Rogue's Passage funktionierte ohne Kreaturen auf dem Board als Land. Die v2 investiert stattdessen in Turn-2-Farbfixing, sichere Army-Evasion, Ring-Tempt und niedrigere Wincon-Kurve.

## V2 -> V3: fuenf gepruefte Tauschentscheidungen

| Heraus (v2) | Hinein (v3) | Zugewinn | Wichtigstes Gegenargument |
|---|---|---|---|
| All Will Be One | Teferi's Ageless Insight | Saurons Ring-Refill wird von 4 auf 8 Karten vergroessert; laeuft auch mit Remora und Wheels | Verliert direkten Amass-Counter-Schaden; braucht Doppelblau |
| Goblin Plate Mail | My Precious | Army dauerhaft unblockbar und hexproof statt nur Menace, optional Adventure | Mehr Mana und Lebenspunkte, kein sofortiges Amass |
| Fall of Cair Andros | Birthday Escape | Fuer {U} Draw plus Ring-Tempt, auch ohne ungebremsten Army-Angriff | Explosiver Blasphemous-Act-Amass-Sonderfall entfaellt |
| Lazotep Plating | March of Swirling Mist | Phasing rettet Sauron und Army gegen viele globale Wraths | Verliert Amass und billigen Board-Hexproof; X kostet Mana |
| Baleful Strix | Dauthi Voidwalker | Shadow-Ringtraeger, Friedhofs-Hate und exilierter gegnerischer Gratiszauber | Kein ETB-Draw oder Deathtouch; Gegner-Graveyard-Reanimate wird erschwert |

Alle fuenf Neuzugaenge sind im Scryfall-Kandidatenabgleich als Commander-legal und nicht als Game Changer markiert. Manabasis und die drei Game-Changer-Plaetze bleiben unveraendert. Ziel: weniger Abhaengigkeit von ungebremstem Kampfschaden und besserer Widerstand gegen Boardwipes.

## V3 nach V4: Zwei gezielte Kartentausche

| Heraus (v3) | Hinein (v4) | Nachvollziehbare Verbesserung | Starkes Gegenargument |
| --- | --- | --- | --- |
| Echo of Eons | **Windfall** | 2U statt sechs Mana; echtes Abwerfen statt Mischen. Discard-Payoffs und Dauthi Voidwalker profitieren. | Echo konnte fuer 2U aus dem Friedhof geflashbackt werden und war auch fuer Bowmasters nuetzlich. Windfall fuellt gegnerische Haende. |
| Key to the Side-Door | **Whispering Madness** | Der erste Wheel erzeugt sofort viele Abwurf-Trigger; mit Cipher auf einer unblockbaren Army oder Shadow-Dauthi entsteht ein wiederholbarer Angriffsmotor. | Key lieferte fuer {2} und Tappen jederzeit garantierte Unblockbarkeit. Cipher braucht nach dem teureren Erstcast weiteren Kampfschaden. |

**Gegenprobe zur Evasion:** Der Verlust von Key koennte die Ring-Engine verlangsamen. Er ist hier durch **My Precious, Brotherhood Regalia, Herald of Secret Streams, The Black Gate** sowie **Shadowspear, Orcish Siegemaster und Great Goblin, Foul-Hearted** als Trample-Unterstuetzung vertretbar. Dauthi Voidwalker mit Shadow ist ein weiterer geeigneter Cipher-Traeger. Gegen extrem removalstarke Pods bleibt die Rueckkehr zu Key eine begruendete Metagame-Alternative.

**Besondere v4-Synergie:** Wenn die encodierte Army trifft, gehen Saurons Army-Kampfschaden-Tempt-Trigger und Cipher auf den Stapel; ihre Reihenfolge wird vom eigenen Controller gewaehlt. Der kostenfrei durch Cipher gewirkte Nichtkreaturenzauber Whispering Madness loest **Saruman, the White Hand** fuer **amass Orcs 4** aus. Das Abwerfen erzeugt Schaden durch Cool but Rude und Glint-Horn Buccaneer, Ressourcen durch Bone Miser und Monument und gegnerweite -1/-1-Marken durch Archfiend of Ifnir. Dauthi Voidwalker ersetzt das Ablegen gegnerischer Karten im Friedhof durch Exilieren mit Void-Marken. Dieser Motor braucht einen erfolgreichen Kampftreffer und ist keine deterministische fruehe Zweikarten-Endlosschleife.

## Beruecksichtigte PR-Reviewpunkte

1. **Echo of Eons war kein Discard.** Es mischt Haende und Friedhoefe in die Bibliotheken. Der alte README-Satz, es loese Discard-Payoffs aus, war sachlich falsch. v4 ersetzt es durch Windfall und dokumentiert den Unterschied.
2. **Birthday Escape ist einmalig.** Der billige Sorcery-Cantrip bietet genau eine Tempt-Ausloesung pro erfolgreichem Wirken, keine eingebaute Wiederholung.
3. **Phial of Galadriel und Teferi's Ageless Insight:** Eine ansonsten leere Sauron-Hand ergibt bei vier Draws durch Phial allein fuenf, durch Teferi allein acht und mit beiden Replacement-Effekten je nach Reihenfolge **neun oder zehn** Karten.


## Karte für Karte

| Karte | MV | Funktion und Wert | Wichtige Grenze / Ersatzprüfung |
|---|---:|---|---|
| Sauron, the Dark Lord | 6.0 | Ward—Sacrifice a legendary artifact or legendary creature. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Command Tower | 0.0 | {T}: Add one mana of any color in your commander's color identity. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Exotic Orchard | 0.0 | {T}: Add one mana of any color that a land an opponent controls could produce. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Reflecting Pool | 0.0 | {T}: Add one mana of any type that a land you control could produce. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| City of Brass | 0.0 | Whenever this land becomes tapped, it deals 1 damage to you. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Mana Confluence | 0.0 | {T}, Pay 1 life: Add one mana of any color. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Xander's Lounge | 0.0 | ({T}: Add {U}, {B}, or {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Underground Sea | 0.0 | ({T}: Add {U} or {B}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Volcanic Island | 0.0 | ({T}: Add {U} or {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Badlands | 0.0 | ({T}: Add {B} or {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Watery Grave | 0.0 | ({T}: Add {U} or {B}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Steam Vents | 0.0 | ({T}: Add {U} or {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Blood Crypt | 0.0 | ({T}: Add {B} or {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Morphic Pool | 0.0 | This land enters tapped unless you have two or more opponents. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Luxury Suite | 0.0 | This land enters tapped unless you have two or more opponents. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Training Center | 0.0 | This land enters tapped unless you have two or more opponents. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Shipwreck Marsh | 0.0 | This land enters tapped unless you control two or more other lands. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Haunted Ridge | 0.0 | This land enters tapped unless you control two or more other lands. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Stormcarved Coast | 0.0 | This land enters tapped unless you control two or more other lands. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Polluted Delta | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for an Island or Swamp card, put it onto the battlefield, then shuf | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Scalding Tarn | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for an Island or Mountain card, put it onto the battlefield, then s | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Bloodstained Mire | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Swamp or Mountain card, put it onto the battlefield, then shu | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Marsh Flats | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Plains or Swamp card, put it onto the battlefield, then shuff | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Misty Rainforest | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Forest or Island card, put it onto the battlefield, then shuf | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Flooded Strand | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Plains or Island card, put it onto the battlefield, then shuf | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Verdant Catacombs | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Swamp or Forest card, put it onto the battlefield, then shuff | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Wooded Foothills | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a Mountain or Forest card, put it onto the battlefield, then sh | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Barad-dûr | 0.0 | Schwarze Manaquelle und großes X-Amass nur wenn eine Kreatur gestorben ist. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| The Black Gate | 0.0 | Evasion nur gegenüber gegnerischem Lebenspunktführer und B-Quelle. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Mount Doom | 0.0 | {T}, Pay 1 life: Add {B} or {R}. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Cavern of Souls | 0.0 | Horror wählen: Sauron erhält passenden colored mana und uncounterbar. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Otawara, Soaring City | 0.0 | {T}: Add {U}. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Takenuma, Abandoned Mire | 0.0 | {T}: Add {B}. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Sokenzan, Crucible of Defiance | 0.0 | {T}: Add {R}. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Island | 0.0 | ({T}: Add {U}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Swamp | 0.0 | ({T}: Add {B}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Mountain | 0.0 | ({T}: Add {R}.) | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Prismatic Vista | 0.0 | {T}, Pay 1 life, Sacrifice this land: Search your library for a basic land card, put it onto the battlefield, then shuffle. | Landplatz konkurriert mit Farb- und Tempoanforderungen; gegen getappte Eintritte prüfen |
| Sol Ring | 1.0 | {T}: Add {C}{C}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Arcane Signet | 2.0 | {T}: Add one mana of any color in your commander's color identity. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Fellwar Stone | 2.0 | {T}: Add one mana of any color that a land an opponent controls could produce. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Talisman of Dominance | 2.0 | {T}: Add {C}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Talisman of Indulgence | 2.0 | {T}: Add {C}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Talisman of Creativity | 2.0 | {T}: Add {C}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Dimir Signet | 2.0 | {1}, {T}: Add {U}{B}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Izzet Signet | 2.0 | {1}, {T}: Add {U}{R}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Relic of Sauron | 4.0 | {T}: Add two mana in any combination of {U}, {B}, and/or {R}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Mind Stone | 2.0 | {T}: Add {C}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Rakdos Signet | 2.0 | {1}, {T}: Add {B}{R}. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Mauhúr, Uruk-hai Captain | 2.0 | Ein zusätzlicher Counter bei jeder Army/Orc/Goblin-Counter-Verteilung. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| The Great Goblin | 3.0 | Counter-Aufträge verursachen je zwei Schaden an genau einem Gegner; jede andere Orc-Death exiliert eine Karte. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Saruman, the White Hand | 4.0 | Eigene Nichtkreaturenspells werden zusätzliche Amass-Engine; Ward2 für Orcs. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Orcish Siegemaster | 3.0 | Gibt anderen Orcs (Army) Trample, selbst hoher Power-Angreifer. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Witch-king of Angmar | 5.0 | Flying | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| The Locust God | 6.0 | Sauron-unabhängiger Draw-Finisher mit Haste-Flying-Insekten. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Phial of Galadriel | 3.0 | Dreimana-Manarock und erster leere-Hand-Kartenzieheffekt wird verdoppelt. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Glint-Horn Buccaneer | 3.0 | Eine Schaden an jeden Gegner pro abgeworfene Karte. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Archfiend of Ifnir | 5.0 | Jeder von Sauron abgeworfene Karteneintrag gibt jedem gegnerischen Creature eine -1/-1-Marke. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Bone Miser | 5.0 | Abgeworfene Landkarten liefern BB, Kreaturen Zombies, andere Karten Draw. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Rielle, the Everwise | 3.0 | Erster Discard-Vorgang jedes Zugs zieht X Karten zusätzlich. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Roaming Throne | 4.0 | Als Horror bestimmt, verdoppelt es sämtliche ausgelösten Sauron-Fähigkeiten. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Herald of Secret Streams | 4.0 | Alle +1/+1-Counter-Kreaturen können nicht geblockt werden. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Dauthi Voidwalker | 2.0 | Shadow-Ringtraeger; ersetzt nur künftige gegnerische Friedhofseinträge durch Exilieren, nicht bereits liegende Karten; kann einen exilierten gegnerischen Spell kostenlos wirken | Verliert Baleful-Strix-ETB-Karte; stoert Reanimate auf gegnerische Ziele |
| Orcish Bowmasters | 2.0 | GC-ETB und Extra-Draw-Amass, wächst Army und pings. | Anfällig für Kreaturenwipes; nur bei wiederholtem Nutzen behalten |
| Great Goblin, Foul-Hearted | 5.0 | Amass Goblins 3 bei ETB oder Attack, allen Army-Kreaturen Trample. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Call of the Ring | 2.0 | Regelmäßiges Tempt jeder Upkeep auch ohne kampfbereite Army. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| March from the Black Gate | 2.0 | When this enchantment enters and whenever an Army you control attacks, amass Orcs 1. (Put a +1/+1 counter on an Army you cont | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Cool but Rude | 2.0 | Für 1R Level 2 kaufen: JEDE abgeworfene Karte verursacht jedem Gegner zwei Schaden. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Birthday Escape | 1.0 | Einmana-Cantrip mit anschliessender Ring-Versuchung; wiederholbare Draw-Engine mit Sauron | Ohne Sauron nur ein Cantrip, nicht wiederholbar |
| The Ozolith | 1.0 | Konserviert +1/+1-Marken aus einer Army, Neuübertragung erst nächster Combat. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| My Precious | 3.0 | Hobbit-Equipment: Hexproof und unblockbar, Equip {2} plus 2 Leben; Adventure kann Draw liefern | Teurer als Goblin Plate Mail, kein Amass-ETB |
| Brotherhood Regalia | 2.0 | Unblockbar und Ward2, Equip an legendärem Ringbearer kostet 1. | Braucht zusätzliche Equip-Aktionen und eine geeignete Army |
| Whispering Madness | 4.0 | Echter Vier-Mana-Discard-Wheel mit Cipher: auf Army oder Dauthi verschluesselt, nach weiteren Kampftreffern kostenlose Kopien; triggert Sarumans Amass 4 je gecasteter Kopie. | Kein garantierter Treffer ohne Evasion, mehr Mana als Key; nach Kreaturenentfernung keine weiteren Cipher-Casts. |
| Shadowspear | 1.0 | Equipped creature gets +1/+1 and has trample and lifelink. | Braucht zusätzliche Equip-Aktionen und eine geeignete Army |
| Rhystic Study | 3.0 | GC-Kartenziehen zu jedem Gegnerzauber ohne Zahlung 1. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Teferi's Ageless Insight | 4.0 | Replacement: Sauron zieht ausserhalb des Ziehsegments acht statt vier; verdoppelt auch andere echte Draws | Vier Mana und Doppelblau; ersetzt nicht den frueheren Counter-Schadensfinisher |
| Mystic Remora | 1.0 | Cumulative upkeep {1} (At the beginning of your upkeep, put an age counter on this permanent, then sacrifice it unless you pa | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Black Market Connections | 3.0 | Treasure, Draw und Changeling, der selbst der Kreaturentyp Army ist. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Demonic Tutor | 2.0 | GC-Universalsuche nach fehlender Engine/Antwort. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Ringsight | 3.0 | Tutort nach Tempt jede Karte, die mit einer kontrollierten Legende eine Farbe teilt. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Faithless Looting | 1.0 | Draw two cards, then discard two cards. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Frantic Search | 3.0 | Draw two cards, then discard two cards. Untap up to three lands. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Wheel of Fortune | 3.0 | Sieben Karten für alle: starker Discard-Payoff, aber gegnerischer Refill. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Windfall | 3.0 | Echter Drei-Mana-Wheel: Alle Spieler werfen ihre Hand ab und ziehen so viele Karten wie der groesste zuvor abgeworfene Stapel. Aktiviert Cool but Rude, Bone Miser, Archfiend, Rielle, Monument und Dauthi. | Auch Gegner werden aufgefuellt; nicht aus dem Friedhof flashbackbar wie Echo of Eons. |
| Chandra's Ignition | 5.0 | Ganze Army-Stärke schädigt jeden Gegner und alle anderen Kreaturen. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Sauron's Ransom | 3.0 | Instant-Dig aus vier Karten, beliebige Verteilung in zwei Piles, Tempt. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Reanimate | 1.0 | Ein Mana für bedrohte oder abgeworfene Engines aus jedem Graveyard. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Toxic Deluge | 3.0 | Flexible -X/-X gegen ganze Kreaturenfront; kostet Leben und eigene Army. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Blasphemous Act | 9.0 | Multipler großer Creature-Wipe, kostet dank Gegnerkreaturen oft nur {R} und raeumt das Board. | Hohe Manakosten und anfällig für Removal; gegen günstigere Engine abwägen |
| Monument to Endurance | 3.0 | Bei bis zu drei Discards je Zug unterschiedliche Modi: eine Karte ziehen, einen Schatz erzeugen oder jeden Gegner 3 Leben verlieren lassen (ohne eigenen Lebensgewinn). | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Mana Drain | 2.0 | Counter target spell. At the beginning of your next main phase, add an amount of {C} equal to that spell's mana value. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Arcane Denial | 2.0 | Counter target spell. Its controller may draw up to two cards at the beginning of the next turn's upkeep. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Swan Song | 1.0 | Counter target enchantment, instant, or sorcery spell. Its controller creates a 2/2 blue Bird creature token with flying. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| An Offer You Can't Refuse | 1.0 | Counter target noncreature spell. Its controller creates two Treasure tokens. (They're artifacts with "{T}, Sacrifice this to | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Chaos Warp | 3.0 | The owner of target permanent shuffles it into their library, then reveals the top card of their library. If it's a permanent | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Feed the Swarm | 2.0 | Destroy target creature or enchantment an opponent controls. You lose life equal to that permanent's mana value. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Deadly Rollick | 4.0 | If you control a commander, you may cast this spell without paying its mana cost. | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| Slip Out the Back | 1.0 | Put a +1/+1 counter on target creature. It phases out. (Treat it and anything attached to it as though they don't exist until | Slot gegen günstigere flexible Interaktion bzw. direkten Ring-Support prüfen |
| March of Swirling Mist | 1.0 | Phase X Kreaturen fuer {X}{U}; schuetzt Army und Sauron gegen globale Antworten | Bei X=2 sind 3 Mana noetig; keine neue Amass-Marke |
| Swiftfoot Boots | 2.0 | Ein Equip für Hexproof/Haste, aber kein nichtzielender Wrath-Schutz. | Braucht zusätzliche Equip-Aktionen und eine geeignete Army |

## Live-Daten und exakte Ziehungswahrscheinlichkeiten (v4)

- Frisch per Scryfall /cards/collection: 115 unterschiedliche Karten in den vier tatsaechlich erstellten Versionen, alle mit legalities.commander=legal, Grixis-Farbidentitaet und existierendem Papierdruck (bei Underground Sea, Volcanic Island, Badlands und Wheel of Fortune wurde eine eigene Papierausgabe nachgeschlagen).
- **100 verschiedene Karten: 1 Commander, 37 Laender und 62 Nichtlaender, darunter 12 Manaartefakte.** Exakt drei aktuelle Game Changer: Demonic Tutor, Orcish Bowmasters, Rhystic Study.
- Mittelwert der 62 Nichtlaender ohne Commander: **2,726** (v3 ebenfalls 2,726). Manawert-Kurve: 1:11, 2:21, 3:16, 4:7, 5:5, 6+:2. Echo (6) und Key (1) wurden durch Windfall (3) und Whispering (4) ersetzt: Mana-Summe gleich, weniger 6+-Karten.
- Exakte Hypergeometrie fuer das 99er-Deck ohne Mulligans: in den ersten 7 Karten mindestens 2 Laender **81,42 %**; in den ersten 10 Karten mindestens 3 Laender **80,04 %**; in 7 Karten mindestens 2 Laender und mindestens ein Manaartefakt **46,79 %**. Beispiel: P(>=2 Laender in 7) = 1 - [C(62,7) + 37*C(62,6)]/C(99,7). Laender und Ramp sind seit v3 identisch.
- Die v3-Snapshot-Datei ist bytegenau mit dem vor v4 auf GitHub veroeffentlichten current.txt-Blob verglichen worden. **Keine simulierten Multiplayer-Partien, keine gemessene Winrate.**

## Bewusst ausgeschlossene Optionen

- Ancient Tomb/Mana Vault: wären Ramp-GC, aber die drei Plätze sind schon sinnvoll belegt.
- The One Ring: leistungsstarker Game Changer, keine Ring-Versuchung; Lebenspunktkosten und kein direkter Amass-Support.
- Notion Thief: alternative GC-Wheel-Ausrichtung, aber Orcish Bowmasters amässt und passt besser zu Mordor.
- Sam's Desperate Rescue: starke billige Tempt-Recursion, benötigt Creature in Graveyard; hier erhält Sauron's Ransom als immer live Instant Vorrang.
- Nazgûl, Lord of the Nazgûl, Sauron Lord of the Rings: thematisch, aber ohne breite Wraith-Engine bzw. mit 8 Mana weniger effizient.
- Rakdos Charm und Vandalblast: Metagame-Antworten, die bei vielen Graveyard- oder Artifact-Decks einen Value-Slot ersetzen sollten.
- Glamdring, Foe-hammer: interessante Army-Power-Kostenreduktion, aber zusätzliche Equip-Vorleistung und niedrigere Instant-/Sorcery-Dichte als ein Spellslinger-Deck.
- Impact Tremors: Amass erzeugt bei bestehender Army keinen neuen Token; deshalb als Plan ungeeignet.

## Zusaetzlich bewertete Kandidaten

- The Reaver Cleaver: hoher Treasure-Ertrag nach Army-Kampfschaden, aber 3 Mana plus Equip 3 und bereits erfolgreiche Evasion noetig.
- Kazuul's Fury: Instant-Fling auf einer getappt ins Spiel kommenden roten Landrueckseite; Board-Opfer und Tempoverlust sind relevante Nachteile.
- Library of Leng: konserviert wichtige Discard-Karten oben auf der Bibliothek, kann aber die Netto-Kartenauswahl verlangsamen.
- Containment Construct: macht abgeworfene Karten im selben Zug spielbar; oft fehlt nach Saurons Turn jedoch Mana zum Ausspielen.
- Talion, the Kindly Lord: generisch starker Draw- und Life-Drain-Motor, aber weniger Mordor-Identitaet als die gewaehlteten Synergien.
- Ledger Shredder: effizienter Connive-Engine- und Ringtraeger, aber keine Friedhofskontrolle; Dauthi ist der groessere Lueckenschluss.

## Grenzen

Es gibt weiterhin keine real gespielten Viererpartien und keinen vollstaendigen Combo-Datenbank-Abgleich. Die angenommene Staerkesteigerung der v4 folgt aus Kartentext, Kosten und Synergie, nicht aus einer Messung.

Keine gespielten Partien, keine gemessene Siegquote, kein vollständiger Combo-Datenbankvergleich. Oracle und Game-Changer-Flags sind ein zeitpunktbezogener Live-Check; spätere Regelupdates erfordern Nachprüfung.
