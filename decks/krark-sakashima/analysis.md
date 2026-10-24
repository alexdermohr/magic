# Krark + Sakashima – Bracket 3, V2 (24.10.2026)

## Ziel und Status

**Commander:** Krark, the Thumbless + Sakashima of a Thousand Faces (Izzet, Partner).
**Deck:** exakt 100 Karten einschließlich der beiden Commander; 98 Karten im Deck, davon 14 weitere Kreaturen, 9 Artefakte, 3 Verzauberungen, 39 Instants/Sorceries und 33 funktionale Länder (inklusive Valakut Awakening, Silundi Vision und Sink into Stupor als MDFCs). 5 Island, 4 Mountain.

**Drei aktuelle Game Changers:** Jeska's Will, Mystical Tutor, Cyclonic Rift. Am 24.10.2026 ergab die direkte Scryfall-Collection-Prüfung 93/93 eindeutig aufgelöste Oracle-Identitäten, Commander-Legalität für alle 93 und Farbidentität ausschließlich U/R/farblos; die drei genannten Karten waren die einzigen mit `game_changer: true`. Auch nach einem grünen Strukturtest ersetzt dies **keine** Partietests.

**Bracket-3-Leitbild:** Synergie und starke Einzelkarten; bis zu drei Game Changers; keine gezielten frühen Zweikarten-Endloskombinationen, keine Massen-Landverweigerung oder Extra-Turn-Ketten. Als Erwartung sollte jeder in der Regel mindestens sechs Züge spielen können (Wizards, 21.10.2025). Die theoretische Möglichkeit, dass ein sehr guter Draw früher explodiert, bleibt; das tatsächliche Turn-to-Win-Profil ist unbekannt.

## V1 → V2: dreizehn gezielte Tausche

| Entfernt | Neu | Hauptgrund und Gegenargument |
| --- | --- | --- |
| Narset's Reversal | **Resculpt** | Twinning Staff + Narset's Reversal war eine **absichtswidrig vorhandene deterministische unendliche Magecraft-Schleife** bei 7 Mana Staff-Aktivierung und weiterem Spruch auf dem Stapel. Resculpt exiliert Artefakte/Kreaturen dauerhaft für 1U; schenkt dafür einen 4/4-Token. |
| Mirror Box | **Ruby Medallion** | Legend-Redundanz ist durch Sakashima, Spark Double, Irenicus und Vesuvan Duplimancy abgedeckt; Medallion reduziert rote Rituale und andere rote Spells. Konsequenz: Legend-Rule-Schutz durch Mirror Box geht verloren. |
| Orvar, the All-Form | **Phantasmal Image** | Viel schnellerer Klon für 1U. Ohne Sakashima darf er einen legendären Krark nicht dauerhaft duplizieren; bei Zielwahl wird die Image geopfert. |
| Sakashima the Impostor | **Copy Artifact** | Statt des langsamen zweiten 4-Mana-legendären Klons für 1U ein zweites Thumb, einen zweiten Twinning Staff oder ein Mana-Artefakt erhalten; bei Krark's Thumb gilt die Legendenregel ohne Sakashimas Statik. |
| Zndrsplt, Eye of Wisdom | **Ashling, Flame Dancer** | 4 statt 5 Mana. Magecraft profitiert von Kopien; wiederholtes Filtern, 2 Schaden an Gegner und deren Kreaturen beim zweiten, vier rote Mana beim dritten Auslösen je Zug. Dafür weniger unabhängiges Münzwurf-Kartenziehen. |
| Guttersnipe | **Vivi Ornitier** | 3 Mana bleiben. Jeder echte Noncreature-Cast erhöht Vivi und fügt jedem Gegner 1 zu; die einmalige 0-Mana-Aktivierung erzeugt Mana entsprechend Vivis Stärke. Weniger unmittelbarer Schaden je Cast als Guttersnipe, aber deutlich mehr Ressourcen. |
| Goblin Electromancer | **Slip Out the Back** | Neue defensive Ein-Mana-Karte mit sehr starker Duplimancy-Synergie; Verzicht auf einen der vier Kostenreduzierer, dafür Ruby Medallion als dauerhafter Ersatz. |
| Ominous Seas | **Muddle the Mixture** | Das 8/8-Token braucht acht Ziehereignisse; Transmute sucht für 1UU gezielt Krark's Thumb, Harmonic Prodigy, Ruby Medallion, Copy Artifact oder Phantasmal Image und kann als UU-Counter gegen Instants/Sorceries fungieren. Die Transmute-Aktivierung wird nicht gewirkt. |
| Thousand-Year Storm | **Mind's Desire** | Bei sechs Mana unmittelbare Storm-Ausbeute statt eines 6-Mana-Enchantments ohne Wirkung bei der Auflösung. Storm-Kopien sind nicht gewirkt, die aus Desire-Exil tatsächlich gewirkten Karten sehr wohl. Ähnliches High-End-Kostenrisiko. |
| Galvanic Relay | **Wheel of Fortune** | Sofort sieben neue Karten statt bis zum nächsten Zug nutzbare Exilkarten. **Risiko:** Gegner ziehen ebenfalls sieben; ein durch Krark zurückgegebener Wheel wird bei Auflösung einer Wheel-Kopie aus der Hand abgeworfen. |
| Fateful Showdown | **Flame of Anor** | 3 statt 4 Mana. Mit Wizard beim Wirken zwei Modi: z. B. zwei Karten ziehen und ein Artefakt zerstören oder fünf Kreaturenschaden; weniger direkter Finisher-Burst als Showdown. |
| Strike It Rich | **Twiddle** | Ungewöhnlicher Mehrfachnutzen: Land/Rock enttappen, mit Krark kopieren und zugleich mit Vesuvan Duplimancy für U **Krark's Thumb oder Krark als nichtlegendäre Kopie** erzeugen. Ohne Synergie meist nur ein schwacher Untapper. |
| Glasspool Mimic | **Sink into Stupor** | Statt bedingtem Clone/getapptem blauem Land ein flexibler Instant, der einen gegnerischen Spell oder gegnerischen Nichtland-Permanent zurückgibt; Landseite kann für 3 Leben ungetappt kommen. Kein Schutz eigener Permanents durch Sink. |

Alle neuen Karten sind Commander-legal und haben keinen zusätzlichen Game-Changer-Platz benötigt. Historische V1-Liste bleibt unter `versions/2026-10-24-b3-v1.txt`, aktive V2 und Snapshot sind identisch.

## Der besondere Krark-Trick: gezielte Münzwurfverteilung

**Krark** triggert auf das **Wirken** von Spontanzaubern/Hexereien, nicht auf bloße Spell-Kopien. Im Gegensatz dazu lösen Storm-Kiln Artist, Archmage Emeritus und Ashling (Magecraft) auf Wirken **oder Kopieren** aus. Bei mehreren Krark-Triggern bleiben schon erzeugte Kopien bestehen, wenn das Original auf die Hand zurückgeht; spätere Krark-Trigger kopieren mithilfe letzter bekannter Informationen auch dann noch.

**Twiddle + Vesuvan Duplimancy + Krark's Thumb:**
1. Wirke `Twiddle` auf den eigenen `Krark's Thumb`. Das targetet ausschließlich ein eigenes Artefakt und triggert Duplimancy. Krark(s) triggern separat durch Cast.
2. Ordne die gleichzeitig von dir kontrollierten Trigger so auf dem Stack, dass **Vesuvan Duplimancy zuerst** auflöst. Die dadurch erzeugte Thumb-Kopie ist ausdrücklich **nicht legendär**; sie funktioniert selbst ohne Sakashima.
3. Erst danach löst Krark seinen Münzwurf aus. Beide Thumbs gelten bereits für diesen Wurf: vier statt einer Münze, aus denen ein Ergebnis gewählt wird; die übrigen Ergebnisse sind ignoriert.
4. Twiddle selbst kann bei Gewinn weitere Spruchkopien erzeugen oder auf die Hand zurückkehren. Ziel und Duplimancy-Trigger wurden beim Cast festgelegt – ein später verändertes Ziel ändert die erste Duplimancy-Kopie nicht.

`Copy Artifact` kann dieselbe legendäre Thumb kopieren, solange Sakashimas statischer Text die Legendenregel ausschaltet; alternativ kopiert es `Sol Ring`, `Ruby Medallion`, `Twinning Staff` usw. Anders als Duplimancys Token bleibt die von Copy Artifact kopierte Thumb **legendär**. Das ist ein echter Schutz-/Abhängigkeitsnachteil.

### Wahrscheinlichkeiten, ohne Kenntnis künftiger Münzwürfe

Bei n Krark-Triggern ist das Ziel **mindestens eine Kopie und mindestens eine Rückgabe**. Über jeden Thumb-Ersatzwurf wird adaptiv versucht, das bislang fehlende Ergebnis zu wählen. Die erste Wurfentscheidung ist beliebig; mit m Thumbs sind die nächsten `2^m` Münzen so wählbar, dass nur das Extremereignis »alle Münzen zeigen das unerwünschte Ergebnis« scheitert. Somit:

`P(Kopie UND Verlust mit n Triggern, m Thumbs) = 1 - (1 / 2^(2^m))^(n-1)` für n >= 2.

| Krark-Trigger | Kein Thumb | Ein Thumb | Zwei Thumbs |
| --- | ---: | ---: | ---: |
| 2 | 50 % | 75 % | 93,75 % |
| 3 | 75 % | 93,75 % | 99,609375 % |
| 4 | 87,5 % | 98,4375 % | 99,975586 % |

**Wichtig:** Pro Krark-Trigger ist weiterhin nur **ein** Münzwurf gewonnen oder verloren, auch wenn mehrere Münzen durch Thumb geworfen und ignoriert wurden. `Tavern Scoundrel`/Chance Encounter zählen nicht die ignorierten Münzen. Bei mehreren Krarks sind die Trigger unabhängig; du entscheidest Thumb-Ergebnisse separat beim Abwickeln. Die Zahlen sind keine empirischen Spielquoten und ignorieren Interaktion.

## Spielplan, Schutz und Siegbedingungen

- **Frühe Züge:** 33 funktionale Land-Slots, 5 Mana-Steine sowie mehrere 1- und 2-Mana-Cantrips. Typisch Krark zuerst, dann Baral/Ruby/Thumb/Schutz und Sakashima oder Harmonic Prodigy. `Muddle the Mixture` ist unabhängiger Thumb-Finder oder Stack-Interaktion.
- **Motor:** Gemischte Krark-Ausgänge machen Kopien und geben die Karte zurück. `Rite of Flame`, `Desperate Ritual`, `Pyretic Ritual`, `Seething Song`, `Mana Geyser`, `Frantic Search` und `Snap` liefern Mana, Karten oder Interaktion; `Storm-Kiln Artist`, `Vivi`, `Birgi` und `Tavern Scoundrel` erhöhen den Ertrag.
- **Klon-/Schutzketten:** `Sakashima` unterbindet die Legendenregel; `Spark Double` und `Irenicus's Vile Duplication` erzeugen nichtlegendäre Kopien, `Phantasmal Image` billig aber anfällig; `Vesuvan Duplimancy` kopiert durch `Crimson Wisps`, `Cerulean Wisps`, `Slip Out the Back` und `Twiddle` eigene Engines. `Slip Out the Back`, `March of Swirling Mist`, `Deflecting Swat`, Counters und `Riptide Laboratory` schützen – Krark kann eigene Schutzspells allerdings auch zurückgeben, weshalb sie nicht zuverlässig sind.
- **Finisher A:** `Grapeshot` nach tatsächlich vielen Casts + Krark-/Storm-Kopien; Storm wird nur beim Wirken ausgelöst.
- **Finisher B:** `Jaya's Immolating Inferno` als X-Schaden gegen bis zu drei Ziele bei kontrollierter legendärer Kreatur.
- **Finisher C:** `Aetherflux Reservoir` (50 Leben pro Schuss) und `Vivi Ornitier` (1 Schadenspunkt pro *gewirktem* Noncreature-Spell je Gegner; Kopien alleine triggern das nicht).
- **Finisher D:** `Chance Encounter` gewinnt beim eigenen Upkeep mit mindestens zehn Luck Counters, sofern es dann noch auf dem Feld liegt.
- **Explosiver Plan B:** `Mind's Desire` und `Mizzix's Mastery` können eine reiche, aber begrenzte Spellkette aufbauen; sie erzeugen keine endlose Rückkopplung allein.

**Funktion ohne Sakashima:** Harmonic Prodigy/Veyran/Roaming Throne erhöhen vorhandene Trigger; Spark Double, Irenicus und Duplimancy sind nichtlegendäre Klone. `Phantasmal Image` muss ohne Legendenregel-Aussetzung ein nichtlegendäres Ziel kopieren. Mana-Steine, Vivi, Ashling, Flammen, Wheel und Interaktion funktionieren unabhängig. Ohne Krark bleibt der Cantrip-Control-Kern und Mind's-Desire-Storm als schlechterer, aber echter Plan B.

## Risiken und Tischorganisation

1. **Keine ideale Bracket-3-Selbsteinstufung allein aus der Game-Changer-Zahl.** Das Deck kann ungewöhnlich hohe Ressourcen in Runde 4/5 erzeugen und damit Bracket-4-ähnliche Spiele liefern. Erst tatsächliche Goldfish-/Pod-Daten können zeigen, ob die Rate im üblichen B3-Rahmen bleibt.
2. **Langsame realweltliche Auflösung bei vielen Triggern.** Vor jedem Cast Krark-Anzahl und Trigger festhalten, nacheinander Münzwürfe/Thumb-Auswahl auflösen, Magecraft-Kopien und echte Casts getrennt zählen. Nicht rückwirkend nach späteren Resultaten entscheiden.
3. **Wenig Landslots in absoluten Manaquellen:** 33 einschließlich MDFCs, daher oft 30 eigentliche Landkarten. Cantrips und Rocks sollen das ausgleichen. Bei wiederholtem Mulligan wegen Mana die Zahl auf 34–35 erhöhen statt blind mehr kostenintensive Payoffs zu spielen.
4. **Wheel of Fortune speist Gegnerhände.** Gegen offene Manaquellen und viele Interaktionsdecks nur spielen, wenn die Ressourcen unmittelbar verwertet werden können.
5. **Combo-Gegenprüfung:** Die absichtswidrige, dokumentierte Twinning Staff + Narset's Reversal-Endlosschleife ist durch Entfernung der Reversal aufgelöst. Kein beabsichtigtes frühes Zwei-Karten-Infinite, aber nicht alle möglichen situativen Kombos können ausgeschlossen werden.
6. **Keine beobachteten Spiele oder Siegquoten.** Statistik oben ist aus unabhängigen Münzwürfen berechnet, kein empirischer Benchmark.

## Primärquellen und Oracle

- Wizards Commander und aktuelle Game Changers: https://magic.wizards.com/en/formats/commander
- Wizards Bracket-3-Tempo und Absicht, 21.10.2025: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- Wizards Update 09.02.2026: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- Wizards Vesuvan-Duplimancy-Regeln (Release Notes): https://magic.wizards.com/en/news/feature/dominaria-united-release-notes-2022-08-26
- Scryfall Card Collection API, am 24.10.2026 aktuell: https://scryfall.com/docs/api/cards/collection
- Krark Oracle/Rulings: https://mtg.wtf/card/cmr/189/Krark-the-Thumbless
- Bekannte versehentliche Zweikarten-Schleife: https://commanderspellbook.com/combo/11-2539/

Hinweis: Offizielle Bracket- und Oracle-Aussagen werden möglichst an Primärquellen gespiegelt. Nicht dokumentierte Regelannahmen oder Spielstärke-Metriken sind keine geprüfte Evidenz.
