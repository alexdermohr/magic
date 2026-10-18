# Obeka, Splitter of Seconds — Karten- und Spielanalyse V6 (Bracket 3)

**Aktuelle Liste:** [current.txt](current.txt), identisch mit [versions/2026-10-18-b3-v6.txt](versions/2026-10-18-b3-v6.txt). Historische Listen V1–V5 wurden tatsächlich erstellt und bleiben unter [versions/](versions/) erhalten. Stand: 18.10.2026.

## 1. Mechanik und Regelprüfung

Der verifizierte Oracle-Text von Obeka lautet: „Menace. Whenever Obeka deals combat damage to a player, you get that many additional upkeep steps after this phase.“ 2 Schadenspunkte ergeben 2 zusätzliche eigene Upkeeps nach der Kampfphase, 5 Schadenspunkte ergeben 5. Das sind **keine** weiteren normalen Untap-, Draw-, Main- oder Combat-Steps. Durch Double Strike sind zwei separate Schadensereignisse und Upkeep-Trigger möglich.

- „At the beginning of your upkeep“ funktioniert in jedem Obeka-Upkeep. Beispiele aus V5: sechs Courts, Bitterblossom, Phyrexian Arena, Replicating Ring, Dragonmaster Outcast, Creeping Bloodsucker, Plargg and Nassari, Ring of Valkas und Ring of Evos Isle.
- „At the beginning of each upkeep“ schließt auch fremde Upkeeps ein, wird durch Obeka aber nur während ihrer **eigenen** künstlichen Upkeeps beschleunigt. Midnight Clock wurde aus V5 zugunsten schnelleren Manas entfernt.
- **Initiative:** Ravenloft Adventurer nimmt beim Eintritt die Initiative. Dadurch wagt man sich einmal in die Unterstadt; anschließend geschieht das zu **Beginn jedes eigenen Upkeeps**, solange man die Initiative behält. Vier zusätzliche Upkeeps nach der Übernahme können einen vollständigen Durchgang bis zum letzten Raum ermöglichen: Dort wird eine Kreatur aus den obersten zehn Karten mit drei +1/+1-Marken und temporärem Hexproof ins Spiel gebracht. Ravenlofts Ersatzeffekt exiliert sterbende Gegnerkreaturen und kann damit zukünftige Reanimationsziele für die eigene Virtue of Persistence entfernen.
- **The Black Gate:** Für {1}{B} und Tappen macht es eine Kreatur gegen einen der Spieler mit den aktuell meisten Lebenspunkten unblockbar, **nicht** automatisch gegen einen beliebigen Gegner. Um ungetappt ins Spiel zu kommen, kann man beim Eintritt 3 Leben bezahlen. **Plaza of Heroes** macht legendäre Kreaturen für {3}, Tappen und Exilieren bis zum Zugende hexproof/indestructible und liefert farbiges Mana insbesondere für Obeka.
- **Aether Tunnel:** Die verzauberte Kreatur erhält +1/+0 und kann nicht geblockt werden; die Aura geht bei Removal der Kreatur verloren.
- **Super Intelligence** zieht Karten nur für den Controller der verzauberten Kreatur. An eine **eigene** Kreatur angelegt, zieht es pro Obeka-Upkeep genau eine Karte; an eine fremde Kreatur wäre es kontraproduktiv.
- **Rousing Refrain** wird für {1}{R} mit drei Zeitmarken ausgesetzt. Zu Beginn der eigenen Upkeeps verschwindet je eine Marke; beim Verrechnen nach der letzten Marke erzeugt es rotes Mana entsprechend einer gegnerischen Handgröße, das bis zum Ende des Zuges bestehen bleibt. Danach wird es erneut mit drei Marken ausgesetzt und kann bei ausreichend vielen Upkeeps **im selben Zug** ein weiteres Mal wirken.
- **Profane Tutor** wird für {1}{B} mit zwei Marken ausgesetzt und kann nach zwei eigenen Upkeeps kostenlos wirken. Anders als Diabolic Intent braucht es kein Kreaturenopfer, ist aber nicht in derselben Hauptphase sofort verfügbar.
- **Roaming Throne** muss beim Eintritt *Warlock* wählen (Obeka ist Ogre Warlock), damit Obekas Kampfschaden-Auslöser ein weiteres Mal auslöst. Courts sind Verzauberungen und werden vom Throne nicht selbst dupliziert.
- **Monarch:** Die sechs Courts machen dich beim Eintritt zum Monarchen. Bei Court of Embereth, Locthwain, Vantress und Ire entscheidet der aktuell gehaltene Monarchenstatus über die Stärke der jeweiligen ausgelösten Fähigkeit.
- **Sword of Feast and Famine** enttappt nach Obekas Kampfschaden alle eigenen Länder *vor* den Extra-Upkeeps. Die schwarz/grüne Schutzfähigkeit verhindert zugleich, dass die **schwarze** Malakir Rebirth die ausgerüstete Obeka legal als Ziel wählt. Super Intelligence ist blau und bleibt davon unberührt.
- **Mechanized Production + Replicating Ring:** Bei acht Night-Countern erzeugt der Ring acht Token mit dem Namen *Replicated Ring*. Mit passenden gleichzeitig auslösenden Upkeep-Triggern lässt sich die Reihenfolge so wählen, dass der Ring zuerst die acht Token erzeugt und anschließend Production acht gleichnamige Artefakte feststellt: alternativer Sieg.

**Bracket:** Wizards klassifiziert Bracket 3 als Upgraded und erlaubt maximal drei Game Changer. Live-Scryfall-Abfrage vom 18.10.2026: Alle 100 Karten sind Commander-legal und Grixis-farbkonform; genau **Ancient Tomb, Demonic Tutor, Fierce Guardianship** sind als Game Changer markiert. Die Karte Gamble wurde deshalb *nicht* aufgenommen (wäre ein vierter Game Changer). Aggravated Assault wurde wegen der zusammen mit Sword of Feast and Famine möglichen wiederholbaren Kampfschleifen ebenfalls bewusst vermieden.

Primärquellen: [Wizards Commander](https://magic.wizards.com/en/formats/commander), [Commander Brackets Update, Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026), [Obeka Oracle](https://scryfall.com/card/otj/222/obeka-splitter-of-seconds), [Scryfall API](https://scryfall.com/docs/api).

## 2. Wie viel entsteht aus 3 oder 5 Upkeeps?

| Upkeep-Permanent | 3 Extra-Upkeeps | 5 Extra-Upkeeps | Voraussetzungen |
|---|---|---|---|
| Court of Embereth | **9** Schaden pro Gegner (2+3+4) | **20** Schaden pro Gegner (2+3+4+5+6) | Anfänglich nur Obeka als Kreatur, Court aktiv und Monarch |
| Court of Embereth **+ Bitterblossom** | **15** Schaden pro Gegner (3+5+7) | **35** Schaden pro Gegner (3+5+7+9+11) | Faerie-Trigger zuerst, beide im Spiel, Monarch, anfänglich nur Obeka |
| Court of Ire | **21** gezielter Schaden | **35** gezielter Schaden | Monarch, für 7 statt 2 pro Auslöser |
| Court of Cunning | **30** Karten millen pro gewähltem Spieler | **50** pro gewähltem Spieler | Monarch, im Standardfall sonst 2 Karten |
| Creeping Bloodsucker | Jeder Gegner 3 Schaden, du bis zu 9 Leben bei drei Gegnern | Jeder Gegner 5 Schaden, du bis zu 15 Leben | drei lebende Gegner |
| Ring of Valkas **+ Ring of Evos Isle** | **+6 +1/+1-Marken** | **+10 +1/+1-Marken** | beide korrekt an Obeka ausgerüstet |
| Super Intelligence | **3 Karten** | **5 Karten** | eigene Kreatur dauerhaft verzaubert |
| Replicating Ring | +3 Zeitmarken | +5 Zeitmarken | nach insgesamt acht Night-Countern entstehen acht Replicated Rings |
| Court of Locthwain | drei gegnerische Karten exiliert, bis zu drei kostenlose Cast-Erlaubnisse | fünf Karten/Erlaubnisse | Monarch und legal wirkbare Zauber |
| Court of Vantress | bis zu drei Permanent-Kopien | bis zu fünf Kopien | Monarch und anderes Artefakt oder Enchantment als Ziel |
| Plargg and Nassari | bis zu sechs kostenlos gewirkte Zauber | bis zu zehn | Angebot der exilierten Karten und gegnerische Wahl |
| Rousing Refrain | ein möglicher Gratis-Cast je drei entfernten Zeitmarken | wiederholbar nach je drei Marken | muss vorher suspendiert sein, gegnerische Hand nicht leer |

Embereth/Bitterblossom: Bei denselben Upkeeps jeweils Bitterblossom **vor** Court of Embereth auflösen. Dann wird zuerst eine Faerie, danach ein Knight erstellt und *anschließend* Schaden entsprechend allen eigenen Kreaturen verursacht. Die Kombination kostet aber **ein Leben pro Upkeep**. Das Leben kommt idealerweise aus Creeping Bloodsucker, Sheoldred oder Shadowspear zurück.

## 3. Vollzogene V4→V5-Kartenwechsel

| Heraus | Herein | Entscheidendes Argument / Nachteil |
|---|---|---|
| Midnight Clock | **Rakdos Signet** | Frühere zweifarbige Beschleunigung (2 statt 3 Mana), verliert spätere Handauffüllung |
| Diabolic Intent | **Profane Tutor** | Zwei Obeka-Upkeeps statt Kreaturenopfer, braucht Wartezeit |
| Smaug the Magnificent | **Rousing Refrain** | Wiederkehrendes postcombat-taugliches rotes Mana, benötigt Suspend und gegnerische Hand |
| Chronozoa | **Bitterblossom** | Ein früherer Flying-Token **pro Upkeep**, Monarch-Defense und Embereth-Schaden; kostet eigenes Leben, Kopien sind nur 1/1 |
| Twilight Prophet | **Super Intelligence** | Nur {U}, Draw ohne City’s Blessing, setzt eigene Kreatur voraus |
| Struggle for Project Purity | **Sword of Feast and Famine** | Keine geschenkten Handkarten; Combat-Pump, Schutz und Land-Enttappen. Verliert das frühere sehr explosive Draw-/Sheoldred-Finish |
| Fireshrieker | **Trailblazer's Boots** | Zweites günstiges Evasion-Teil; Lizard Blades bleibt der Double-Strike-Weg. Weniger Maximal-Upkeeps durch Doppelstrike |
| Arcane Denial | **Ring of Evos Isle** | Pro Upkeep Power und aktivierter Hexproof; ein weniger Counterspell |
| Drowned Catacomb | **Underground River** | Ab Zug 1 ungetappt statt abhängig von Standardlandtypen; farbige Aktivierung kostet 1 Leben |
| Dragonskull Summit | **Sulfurous Springs** | Gleiches Argument für B/R |
| Sulfur Falls | **Shivan Reef** | Gleiches Argument für U/R |

**Unverändert:** alle sechs Courts, Virtue of Persistence als später Reanimationsmotor, Mechanized Production als Alternate-Win, Psychosis Crawler als Draw-Finisher, The Reaver Cleaver für Treasures, Roaming Throne zur Verdopplung von Obeka, Blackblade Reforged zur drastischen Powererhöhung sowie die drei Game Changer.

**Abgewogene, nicht übernommene Kandidaten:** As Foretold skaliert seine Time-Counter, erlaubt aber nur **einmal je Zug** einen Gratiszauber; Inspiring Refrain zieht über Suspend alle drei Upkeeps zwei Karten, Super Intelligence ist bei sicherer eigener Kreatur effizienter; Scrawling Crawler und Struggle schenken allen Gegnern Antworten; Paradox Haze erhöht normalerweise nur die Zahl früher Upkeeps; Whispersilk Cloak gibt Shroud und verhindert neue zielende Ausrüstungen/Auren; Doom's Time Platform benötigt bereits einen Nonland-Spell im Friedhof und einen Angriff. Sword plus Aggravated Assault ist wegen der Bracket-3-Kombo-Grenze ausgeschlossen. Gamble wäre der vierte Game Changer.

## 4. Kurve, Konsistenz, Interaktion

- **37 reguläre Länder** und Malakir Rebirth/Malakir Mire als optionales MDFC-Land. Drei Checklands wurden durch sofort ungetappte Painlands ersetzt; zusätzliche Lebenspunkte-Kosten bewusst akzeptiert.
- **10 Rocks**, davon **9 für höchstens zwei Mana**: Sol Ring, Arcane Signet, Fellwar Stone, drei Talismane, drei Signets sowie Replicating Ring mit MV3. Ancient Tomb beschleunigt zusätzlich.
- **62 Nichtländer einschließlich Commander:** aktuelle Oracle-Mana-Value-Verteilung **MV0:1, MV1:9, MV2:24, MV3:12, MV4:11, MV5:4, MV7:1**. MV0 ist *Profane Tutor* und **keine** ohne Suspend sofort kostenlose Handkarte.
- **Interaktion:** vier Counterspell-Varianten (Counterspell, Mana Drain, Swan Song, An Offer You Can't Refuse), dazu Fierce Guardianship und Deflecting Swat; Deadly Rollick, Chaos Warp, Feed the Swarm, Toxic Deluge, Vandalblast, Rakdos Charm und Malakir Rebirth decken unterschiedliche Situationen ab. Ring of Evos Isle, Mithril Coat und Swiftfoot Boots liefern bleibenden Schutz.
- **Evasion:** Brotherhood Regalia, Aqueous Form, Thassa, Key to the City, Aether Tunnel, Trailblazer's Boots und Shizo/The Black Gate als aktivierbare Landoptionen. Shizo/Fear ist gegen schwarze oder Artefaktkreaturen nicht sicher; Trailblazer's Boots benötigt gegnerisches Nichtstandardland.
- **Siegpfade:** Embereth und andere Courts, Psychosis Crawler-Draw-Drain, Mechanized Production/Ring, Court of Cunning-Mill, 21 Kommanderschaden. Obeka ist Haupt-Beschleuniger, die Engines geben teilweise auch ohne sie normalen Value.

## 5. Reproduzierbare Simulation und Korrektur des Reviews

**Befehl aus Repo-Root:** python3 decks/obeka-splitter-of-seconds/tests/verify_deck.py --oracle

Python-Standardbibliothek, festgelegter Seed **20261018**, **100.000 zufällige Starthandsamples pro tatsächlich angelegter V1–V6**. Alle 99 Karten ohne Commander werden gemischt; ausgewertet werden Starthand (7) und regulär gezogene Karten bis Zug 4/5. Die beiden Codex-P2-Funde sind berücksichtigt: **Ring of Valkas** ist Upkeep-Payoff, und **Rogue's Passage** wird in historischen Listen als gezogene Evasionkarte gezählt. Die sehr hohen Aktivierungskosten von Rogue's Passage bleiben ein Grund für seinen Austausch.

| Nur Kartenverfügbarkeit | V1 | V2 | V3 | V4 | V5 | V6 |
|---|---:|---:|---:|---:|---:|---:|
| Starthand mit 2–4 Länder-/MDFC-Karten | 75,53 % | 75,53 % | 75,53 % | 75,53 % | 75,53 % | **75,53 %** |
| Vier Landquellen bis Zug 4 gesehen | 67,82 % | 67,82 % | 67,82 % | 67,82 % | 67,82 % | **67,82 %** |
| Nominelles Obeka-Mana bis Zug 4¹ | 79,19 % | 79,19 % | 79,19 % | 79,19 % | 80,06 % | **80,06 %** |
| Evasion-Karte bis Zug 5 gezogen² | 54,92 % | 54,92 % | 60,78 % | 60,78 % | 65,95 % | **65,95 %** |
| **Günstige Evasion-Karte bis Zug 5 gezogen²** | 40,83 % | 40,83 % | 40,83 % | 40,83 % | 40,83 % | **54,97 %** |
| Hastequelle bis Zug 4 gezogen | 29,70 % | 37,88 % | 37,88 % | 37,88 % | 37,88 % | **37,88 %** |
| Upkeep-Payoff bis Zug 5 gezogen³ | 95,15 % | 95,96 % | 95,19 % | 94,33 % | 94,31 % | **94,31 %** |
| Nominelles Mana + Evasion + Payoff zusammen¹²³ | 40,13 % | 40,59 % | 44,16 % | 43,63 % | 47,80 % | **47,80 %** |

¹ **Keine echte Cast-Mana-Simulation:** „4 Landquellen bis Turn 4“ oder „3 Landquellen + bis Turn 2 gesehenen frühen Rock“ gelten optimistisch als genügend Mana. Manafarben, getappte Länder, tatsächliche Cast-/Equip-Kosten, regelmäßige Landdrops, Mulligans und gegnerische Antworten fehlen.
² Zählt das **Sehen** einer Evasionkarte, auch wenn diese Vorbedingungen oder noch nicht verfügbare Manakosten benötigt. Insbesondere Rogue's Passage (vier Mana plus Tap), The Black Gate (nur gegen Gegner mit höchstem Lebensstand), Trailblazer's Boots (gegnerisches Nichtstandardland), Shizo (Fear-Blocker) und Key to the City (Discard). Die separate günstige Teilmenge umfasst nur Quellen mit höchstens drei Mana für Cast/Equip/Aktivierung, ohne Commander-Cast oder Timing. Es sind **keine** garantierten Angriffe bis Zug 5.
³ Payoffkarte gezogen, **nicht** zwingend bereits gewirkt oder suspendiert. Insbesondere Rousing Refrain/Profane Tutor brauchen vorherige Suspend-Aktion. Diese Raten sind **keine Spiel- oder Gewinnwahrscheinlichkeit**.

Die direkte Scryfall-API-Prüfung im selben Lauf bestätigte **100/100 legal, Grixis und drei Game Changer**. Zusätzlich stimmen current.txt und V6 zeilenweise überein. Es liegen keine echten Vier-Spieler-Partietests vor.

## 6. Stärkstes Gegenargument und Restunsicherheit

Ein zurückgehaltener V4-Plan mit **Struggle for Project Purity + Sheoldred, the Apocalypse / Psychosis Crawler** hat bei fünf zusätzlichen Upkeeps eine höhere unmittelbare Schadensobergrenze als V5 und kann die gesamte Runde in einem Zug gewinnen. Dafür verschenkt Struggle je Gegner fünf zusätzliche Handkarten: Gegen aufmerksame blau spielende Gegner kann Obeka entfernt werden, bevor die Trigger einen Sieg sichern. V5 priorisiert darum ein früher erreichbares, robusteres Setup und eigene statt symmetrische Ressourcen. Das ist ein **begründeter Deckbauentscheid, keine gemessene Partiensiegquote**.

Die größten Risiken bleiben Obeka-Removal, Verlust des Monarchenstatus, Lebensverlust durch Bitterblossom/Arena/Painlands, eine zu hohe Zahl an Equipment ohne Kreatur sowie Farbengpässe, die von der einfachen Simulation nicht erfasst werden. Die neue V6 sollte die **obere Bracket-3-Stärke** besser ausschöpfen; ein behaupteter sicherer Sieg oder echte Meta-Dominanz ist nicht belegt.
## 7. Neue Optimierung: V5 → V6 (18.10.2026)

| Heraus | Herein | Konkreter Gewinn | Stärkstes Gegenargument |
|---|---|---|---|
| Bonehoard Dracosaur (MV5) | **Ravenloft Adventurer (MV4)** | Initiative erschließt pro zusätzlichem Upkeep einen weiteren Unterstadt-Raum; der letzte erlaubt es, eine Kreatur aus den obersten zehn Karten kostenlos ins Spiel zu bringen. Außerdem werden gegnerische sterbende Kreaturen exiliert. | Der Dracosaur bietet verlässliche Exil-Kartenauswahl und gelegentliche Treasures ohne Initiative und ist eine stärkere fliegende Kreatur. Ravenloft kann mit Virtue of Persistence bei gegnerischen Reanimationszielen kollidieren. |
| Prowler's Helm | **Aether Tunnel** | Unblockbar plus **+1/+0** für nur zwei Mana, ohne zusätzliche Equip-Aktivierung. Ein zusätzlicher Schadenspunkt bedeutet bei Obeka einen zusätzlichen Upkeep. | Aura geht bei Commander-Removal mit verloren; Helm bleibt liegen und ist wiederverwendbar. |
| Reflecting Pool | **Plaza of Heroes** | Farbige Manaquelle speziell für Obeka und später legendären Support; einmaliger Schutz gegen Ziel-Removal und Zerstörungseffekte. | Reflecting Pool bietet nach Fixing mehr freie Farben für sämtliche Nichtlegendären. Plaza benötigt drei andere Mana und opfert den Land-Slot für Schutz. |
| Rogue's Passage | **The Black Gate** | Schwarze statt farblose Manaquelle, deutlich günstigere Aktivierung zum Durchbringen Obekas. | Nur ein Spieler mit den meisten Lebenspunkten ist als „unblockbar gegen“-Spieler wählbar; gelegentlich 3 Leben nötig, um ungetappt ins Spiel zu kommen. |

**Initiative-Regel (Primärquelle):** [Wizards, Battle for Baldur's Gate Release Notes](https://magic.wizards.com/en/news/feature/commander-legends-battle-baldurs-gate-release-notes-2022-06-01). Die Initiative zu übernehmen löst bereits das erste Raumabenteuer aus; jeder weitere eigene Upkeep setzt bei gehaltener Initiative fort. Der Abschlussweg benötigt insgesamt fünf betretene Räume und lässt sich deshalb mit Obekas Extra-Upkeeps in einem Zug vollenden. Gegner können die Initiative über Kampfschaden zurückerobern.

**Prüfinterpretation:** Die Gesamtrate gezogener Evasionkarten steigt von V5 auf V6 **nicht**, weil zwei Evasion-Slots jeweils ausgetauscht wurden. Der Anteil **günstiger** Evasionkarten steigt in der deterministischen 100.000-Hand-Simulation von **40,83 % auf 54,97 %**. Eine tatsächliche T5-Kampfschadenswahrscheinlichkeit ist das nicht. Die neue Initiative ist in der Upkeep-Payoff-Kategorie nur als **bedingter** Kandidat enthalten: Man muss Ravenloft zuvor wirken und die Initiative besitzen; die Simulation wertet das nicht als garantiert aus.

Alle sechs Versionen sind importierbare historische Listen und das aktuelle Deck wurde erneut gegen die Live-Oracle-/Commander-Legalitätsdaten geprüft. **V6: 100/100 legal, Grixis, exakt drei Game Changer** (Ancient Tomb, Demonic Tutor, Fierce Guardianship); Verteilung MV0:1, MV1:9, MV2:24, MV3:12, MV4:11, MV5:4, MV7:1. Reale Mehrspielerpartien und kontrollierte Win-Rate-Tests liegen weiterhin nicht vor.
