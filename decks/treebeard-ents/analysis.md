# Baumbart — Der Aufstand der Ents (Bracket 3)

**Version:** V3, optimiert am 2026-10-14 · **Format:** Commander · **Ziel:** Bracket 3 / Upgraded · **Farben:** Abzan (Weiß/Schwarz/Grün)

## Identität und überprüfbarer Rahmen

**Commander:** `Doran, the Siege Tower`, erhältlich als offiziell gedruckter **Treebeard, Eldest of Ents** (LTC #517). Die importierbare Liste verwendet den regulären Oracle-Namen, die Baumbart-Kartengestaltung ist offiziell und optional. Es sind ausschließlich reale, in Papierform veröffentlichte und Commander-legale Magic-Karten enthalten. Einige starke Unterstützer sind nicht aus Mittelerde; die Ents und Baumwesen bleiben jedoch das Kampfthema.

Die importierbare Deckliste `current.txt` enthält **100 Karten = 1 Commander + 30 weitere Kreaturen + 32 sonstige Nichtlandkarten + 37 Länder**. **20 Kreaturen besitzen gedruckt den Typ Treefolk**, dazu ist `Realmwalker` durch Changeling überall ein Baumwesen. Das ergibt 21 Baumwesen unter 31 Kreaturen einschließlich Commander. `Assemble the Entmoot` und `Sapling Nursery` erzeugen weitere Baumwesen-Spielsteine. Die V3 opfert zwei weitere Baumwesen-Karten zugunsten stärkerer eigenständiger Fähigkeiten; diese Einschränkung für `Leaf-Crowned Elder` und `Herald's Horn` wird bewusst in Kauf genommen.

**Frisch validiert am 2026-10-14:** Scryfall-Oracle-Abgleich von V3 und V2: 100 Einträge, 94 unterschiedliche Kartennamen, 37 Länder, keine verbotenen Duplikate, alle Commander-legal, Farbidentität vollständig W/B/G; genau drei Game Changer **Aura Shards**, **Teferi's Protection** und **Natural Order**. Felothar, Radagast und Stoneskin sind als Papierkarten verfügbar. Die von Scryfall `/cards/collection` ausgewählten Datensätze für Bayou, Savannah und Scrubland waren digitale Druckversionen (`games` ohne `paper`); die **echten, Commander-legalen Revised-Edition-Drucke (3ED)** aller drei wurden separat über die Setdaten verifiziert. Keine absichtliche frühe Zwei-Karten-Endlosschleife, Massenlandzerstörung oder Extrazug-Kette. Die Bracket-3-Einordnung ist regelbasiert, **keine per Partien gemessene Spielstärke**.

## V3 – gezielte Änderungen gegenüber V2 (aktuelle Version)

Sechs **1:1-Tausche**, keine zusätzlichen Farben und keine neuen Game Changer:

| Heraus | Hinein | Begründung und Nachteil |
| --- | --- | --- |
| Sapling of Colfenor | **Felothar the Steadfast** | Nur vier statt fünf Mana, einseitiger Widerstandskraft-Kampfschaden und wiederholbarer Kartenvorteil beim Opfern. Nachteil: Nicht-Baumwesen, man muss Kreaturen opfern und {3} sowie Tappen bezahlen. |
| Orchard Warden | **Radagast of Rhosgobel** | Vier statt sechs Mana; erster Kreaturenzauber **jedes Zuges** kostet {2} weniger (nur generische Kosten) und kann mit Aufblitzen gewirkt werden. Der nächste eigene Kreaturenzauber im Radagast-Zug erhält keinen Rabatt, wenn Radagast selbst der erste war. Nachteil: weniger Baumwesen und weniger Lebensgewinn-Redundanz zu Trostani. |
| Tend the Sprigs | **Stoneskin** | Dauerhafte Aura mit Aufblitzen, +0/+10. Sehr hoher Kommanderschaden mit Doran oder riesiger Kartenmotor bei Felothars Opferfähigkeit; verliert den Landramp-/späten 3/4-Spielstein-Effekt. Enchantment/Removal-Risiko beachten. |
| Woodland Cemetery | **Bayou** | Immer ungetappt; Swamp/Forest, gezielt mit passenden Fetch- und Wald-Suchkarten zu finden. |
| Sunpetal Grove | **Savannah** | Immer ungetappt; Forest/Plains, zusätzliche sichere Waldquelle für `Utopia Sprawl`, `Nature's Lore` und `Three Visits`. |
| Isolated Chapel | **Scrubland** | Immer ungetappt; Plains/Swamp, mit passenden Fetch-Ländern und `Farseek` auffindbar. |

**Gemessene strukturelle Unterschiede:** nominale Nichtland-Manawerte von 6 oder mehr **9 → 8**, Länder weiterhin **37**, Karten insgesamt **100**, Baumwesen einschließlich `Realmwalker` **23 → 21**. Länder mit dem Typ **Forest: 11 → 13**. Die berechnete Wahrscheinlichkeit in sieben zufälligen Karten aus den übrigen 99, mindestens einen solchen Wald **oder eines von vier passenden Fetchländern** zu erhalten, steigt von **69,6 % auf 74,5 %** (rein kombinatorisch; kein Goldfish-/Mulligan-/Spiele-Test).

**Entscheidender Gegenpunkt:** Orchard Warden war mit `Treebeard, Gracious Host` und `Assemble the Entmoot` wertvoll. `Trostani, Selesnya's Voice` bleibt als derselbe Lebensgewinn-Auslöser für *alle* eigenen anderen Kreaturen im Deck. Die zusätzliche Baumwesen-Dichte und der V2-Wald-Ramp wurden gegen schnellere Kreaturen, strategischen Kartenvorteil und eine relevante eigene Siegoption eingetauscht. Ein preisbewusstes Deck kann die drei ursprünglichen Checklands problemlos behalten; die alten Doppelländer sind teuer und kein notwendiger Bestandteil der Funktion.

### Schlüssel-Interaktionen von V3

- **Felothar:** `Indomitable Ancients` (2/10) für **{3}, Tappen und Opfern** ziehen zehn Karten, danach zwei abwerfen. Das Opfer gehört zu den *Kosten* und kann nicht durch anschließendes Phasing gerettet werden. `Stoneskin` auf den Ancients macht daraus 2/20 und damit 20 Karten ziehen, zwei abwerfen; die Aura wird beim Opfern mit abgelegt. Doran ändert dabei **nicht** die tatsächliche Stärke von Kreaturen.
- **Stoneskin + Commander:** Doran ist regulär 0/5 und mit der Aura 0/15. Weil Doran Kampfschaden anhand der Widerstandskraft zuweist, braucht er ungeblockt normalerweise zwei Treffer für die 21 Commander-Schadenspunkte. Mit dem vorhandenen `Akroma's Will` und aktiver Commander-Bedingung kann er dank Doppelschlag ungeblockt 30 Commander-Schaden in einem Angriff verursachen. Doran hat selbst **kein Trampelschaden**; der Weg durch Blocker muss etwa über `Cover of Darkness`, `Behind the Scenes` oder `Akroma's Will` geöffnet werden. Feindliches Removal kann die Aura zum Kartennachteil machen.
- **Radagast:** Der erste gewirkte Kreaturenzauber auf **jedem Spielerzug** kostet bis zu {2} weniger generisches Mana und darf zu Instant-Geschwindigkeit gewirkt werden. Das macht Fangorn oder Quickbeam flexibler, ist jedoch abhängig von verfügbarem Kreaturennachschub und ungenutztem Mana. Der Rabatt greift nicht bei einem zweiten Kreaturenzauber im selben Zug.
- **Duale Papierkarten:** `Bayou`, `Savannah`, `Scrubland` besitzen je zwei Standardlandtypen, sind **nicht** Standardländer und zählen nicht als Basisland für `Tend the Sprigs` (die ohnehin nicht mehr im Deck ist). Für ein offiziell legales Papierdeck echte reguläre Drucke wie **Revised Edition** wählen, nicht nicht-turnierlegale Collector's-/30th-Anniversary-Ausgaben.

## Vorgängerversion V2 – historische Änderungen gegenüber V1

**V2** enthielt 13 Nichtland-Tausche und 1 Land-Tausch; damals fiel die Zahl der Nichtlandkarten mit Manawert 6 oder mehr von **12 auf 9** (V3 reduziert weiter auf 8). `Sapling Nursery` ist nominal 8 Mana, kostet dank Wald-Affinität aber oft deutlich weniger. Mit einem zusätzlichen Wald-spezifischen Manaeffekt und einem Einmana-Ramp-Spruch ist der Einstieg zuverlässiger.

| Heraus | Hinein | Grund |
| --- | --- | --- |
| Black Poplar Shaman | Sinister Gnarlbark | Wiederholbarer Kartenzieher auf einem 0/4-Baumwesen statt teurer Einzelregeneration |
| Enraged Huorn | Behind the Scenes | Günstige Ausweichmöglichkeit mit Skulk für Kreaturen mit niedriger Stärke |
| Ulvenwald Observer | Fecund Greenshell | Frühere, aktivere Karten- und Land-Engine beim Eintritt widerstandsstarker Kreaturen |
| Ezzaroot Channeler | Arbor Adherent | Vier statt sechs Mana; wiederholbar viel Mana entsprechend höchster **anderer** Widerstandskraft |
| Orchard Strider | Trostani, Selesnya's Voice | Vier Mana für wiederholten Lebensgewinn bei Kreaturen-ETBs und Population von Ent-Spielsteinen |
| Seedguide Ash | Wild Growth | Beschleunigung ab Zug 1 statt eines fünf Mana teuren Todestriggers |
| Nemata, Primeval Warden | Bedrock Tortoise | Widerstandskraft-Schaden als Backup und Fluchsicherheit der Kreaturen **nur während eigener Züge** |
| Great Oak Guardian | Realmwalker | Drei Mana und vom Deckoberteil weitere Baumwesen ausspielen; Changeling ist selbst ein Baumwesen |
| Unstoppable Ash | Cover of Darkness | Günstige, stammweite Ausweichmöglichkeit (Angst/Fear) statt umständlichem Champion |
| Ent's Fury | Utopia Sprawl | Farbfixierung und ein zusätzlicher Manapunkt auf einem Wald; Kampftrick prüfte irreführend Stärke |
| Crib Swap | Path to Exile | Zielgerichtetes Kreaturenexil für ein statt drei Mana |
| Lifecrafter's Bestiary | Sapling Nursery | Echte Wald-/Baumwesen-Engine; Landfall-Spielsteine und bei Bedarf Schutz des Baumwesen-Boards |
| Entish Restoration | Tend the Sprigs | Landramp ohne eigene Landopferung, später mit einem 3/4-Baumwesen-Spielstein |
| 1 Swamp | Bojuka Bog | Ein Friedhof lässt sich weiter gezielt exilieren, nachdem Nemata das Deck verlassen hat; Nachteil: kommt getappt |

**In V3 bewusst behalten:** Fangorn, Tree Shepherd; Quickbeam, Upstart Ent; Treebeard, Gracious Host; Generous Ent (Waldcycling); Old Man Willow; Doran, Besieged by Time; Timber Protector; Leaf-Crowned Elder; Trostani, Selesnya's Voice; Fecund Greenshell; Sapling Nursery; Last March of the Ents; Tower Defense; Assault Formation; Wave of Reckoning; Kindred Dominance sowie alle drei Game Changer.

## Spielablauf und Prioritäten

**Früh (Züge 1–3):** Eine Starthand mit grünem Zugang, zwei bis drei Ländern und früher Beschleunigung ist deutlich wertvoller als mehrere sechs Mana teure Baumwesen. `Wild Growth` kann jedes Land verzaubern; `Utopia Sprawl` benötigt ein **Wald**-Land (dazu zählen auch die passenden Duals/Triome). Birds of Paradise, Delighted Halfling, Great Forest Druid, Nature's Lore, Three Visits, Farseek und Arcane Signet stabilisieren die Farben. Treefolk Harbinger sucht ein Baumwesen **oder einen Wald oben auf die Bibliothek** (nicht auf die Hand); bei Mana-Not ist Murmuring Bosk ein gutes Ziel. Doran ab Zug 2–3 oder unmittelbar davor aufbauen.

**Mitte (Züge 3–6):** `Sinister Gnarlbark` zieht im Endsegment eine Karte, verlangt dafür aber `blight 1`: Ein eigenes Wesen erhält eine -1/-1-Marke; Marken geschickt auf widerstandsfähige Körper verteilen. `Realmwalker` erlaubt Baumwesen-Zauber vom Bibliotheksoberteil und gilt selbst wegen Changeling als Baumwesen. `Fecund Greenshell` liefert bei passenden Kreaturen-Eintrittseffekten das oberste Land getappt ins Spiel oder nimmt eine Nichtlandkarte auf die Hand. `Arbor Adherent` kann mit Doran schon fünf Mana einer Farbe erzeugen, mit Indomitable Ancients oder Fangorn sogar zehn – allerdings erst, nachdem er tappen darf. `Bosk Banneret`, `Urza's Incubator` und `Herald's Horn` verbilligen Stammessprüche.

**Durchbruch:** Doran, Ancient Lumberknot, Assault Formation und Bedrock Tortoise wandeln Widerstandskraft in Kampfschaden um (beim Tortoise nur für Kreaturen mit Widerstandskraft größer Stärke). `Cover of Darkness` gewährt den gewählten Baumwesen Fear: nur **schwarze und/oder Artefaktkreaturen** können sie blocken. `Behind the Scenes` gewährt Skulk: Blocker mit **größerer Stärke** dürfen die angreifende Kreatur nicht blocken. Wichtige Nuance: **Doran, Besieged by Time** verstärkt beim Angriff Stärke und Widerstandskraft; sein Trigger wird **vor** der Blockerdeklaration verrechnet. Dadurch kann Skulk für diese bereits verstärkten Angreifer schlechter werden. `Tower Defense` ergibt mit Widerstandskraft-Schadensquelle +5 Kampfschaden pro eigener Kreatur; `Akroma's Will` ist ein zweiter Abschluss. `Last March of the Ents` ist der unneutralisierbare große Nachfüll-/Board-Swing.

**Lebensgewinn und Baumwesen-Spielsteine:** `Treebeard, Gracious Host` erzeugt Food und setzt Lebensgewinn in +1/+1-Marken um. `Trostani, Selesnya's Voice` gewinnt Lebenspunkte bei **anderen** eigenen Kreaturen, die ins Spiel kommen, entsprechend deren Widerstandskraft; mit Populieren kopiert sie die Spielsteine von `Assemble the Entmoot`. Entmoot selbst erzeugt beim Opfern drei **getappte** X/X-Baumwesen; X ist der bereits **in diesem Zug** gewonnene Lebensbetrag. Ohne vorherigen Lebensgewinn sind dies 0/0-Spielsteine, die sofort sterben. Der erst durch Trostanis ausgelöste Lebensgewinn beim Eintritt dieser Spielsteine ändert X nicht rückwirkend.

**Wald-/Spielstein-Engine:** `Sapling Nursery` kostet wegen Wald-Affinität pro kontrolliertem Wald {1} weniger an generischen Kosten. Länder mit Wald-Typ und durch Yavimaya zu Wäldern gewordene Länder zählen. Jeder Land-ETB produziert einen 3/4-Baumwesen-Spielstein mit Reichweite. Der Spielstein hat Widerstandskraft 4 und Stärke 3, sodass `Fecund Greenshell` erneut auslöst: Wird dabei ein Land oben aufgedeckt, landet es getappt auf dem Spielfeld, macht einen weiteren Baumwesen-Token und kann noch einmal Greenshell auslösen; bei Nichtland geht die Karte auf die Hand und die Kette stoppt. Das ist eine starke, aber **nicht unendliche** Value-Kette. `Sapling Nursery` kann außerdem für {1}{G} exiliert werden, um eigenen Baumwesen und Wäldern bis Zugende Unzerstörbarkeit zu geben.

**Störung und Wiederaufbau:** `Swords to Plowshares` und `Path to Exile` exilieren gezielt; `Assassin's Trophy`, `Beast Within` und `Song of the Dryads` treffen viele unterschiedliche Problemkarten. `Aura Shards` räumt bei Kreaturen-ETBs Artefakte und Verzauberungen ab. `Wave of Reckoning` lässt jede Kreatur sich selbst Schaden nach ihrer **Stärke**, nicht Widerstandskraft, zufügen – oft einseitig zugunsten der Ents. `Kindred Dominance` wählt Treefolk und zerstört alle anderen Kreaturen. `Bojuka Bog` exiliert einen Friedhof, kommt aber getappt. `Heroic Intervention` und `Teferi's Protection` schützen vor vielem, aber nicht jeder Form von Exil oder -X/-X.

## Nachteile, bewusst verworfene Alternativen und offene Prüfungen

- **Doran wirkt symmetrisch:** Auch gegnerische Kreaturen weisen nach Widerstandskraft Kampfschaden zu; nicht automatisch jede eigene Kreatur wird dadurch besser. Doran selbst verändert keine Stärke bei Kämpfen oder Stärkeprüfungen.
- **Die typale Trefferquote ist geringer als vorher:** V3 enthält 20 gedruckte Treefolk plus Realmwalker (Changeling), V2 noch 22 plus Realmwalker und V1 30 gedruckte Baumwesen. Leaf-Crowned Elder und Herald's Horn treffen dadurch seltener; als Gegenwert gewinnt die Liste Karten- und Manaeffizienz, die wichtigsten Treefolk und ihre Tokens bleiben. Treefolk-Spielsteine von Sapling Nursery und Assemble the Entmoot sorgen zusätzlich für Stammseffekte auf dem Spielfeld.
- **Verwundbarkeiten:** Deck benötigt Kreaturen auf dem Feld, ist anfällig für wiederholte Massenentfernung, und der Lebensgewinn-Teil (Trostani) kostet {G}{G}{W}{W}. `Utopia Sprawl` benötigt ein Land mit Forest-Typ, wofür die neuen Duals helfen. `Bojuka Bog` bleibt eine weitere getappte Landquelle; Stoneskin ist eine Aura mit Zwei-für-eins-Risiko bei Removal. Bei `Kindred Dominance` mit Wahl Treefolk gehen die neuen Felothar und Radagast als Nichtbaumwesen ebenfalls verloren.
- **Ghalta the Immovable** und **Huatli, the Sun's Heart** wären zusätzliche Widerstandskraft-Schadensredundanz, verdrängen aber weitere Baumwesen oder Manaslots. Stoneskin ist seit V3 enthalten, bleibt ohne Schutz/Evasion aber anfällig für Kartennachteil. **Wickerbough Elder** und **Blighted Blackthorn** sind mögliche Rückwege zu höherer Baumwesen-Dichte. Diese Karten wurden nicht unbesehen aufgenommen.
- **Kein behaupteter Praxistest:** Oracle-/Legalitätsprüfung und Manakurvenvergleich ersetzen keine Goldfish-Hände oder echte Partien. Bei weiteren Änderungen ist besonders zu prüfen, ob Decks mit frühem Druck vor unseren Boardengines angreifen können.

**Referenzen:** [Commander-Brackets und aktuelle Game Changer](https://magic.wizards.com/en/formats/commander), [Scryfall-Kartendaten](https://scryfall.com) und [aktuelle Deckliste](current.txt).