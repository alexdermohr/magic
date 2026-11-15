# Rendmaw, Creaking Nest — Vier-Spieler-Engine (Bracket 3)

Stand: **2026-11-15**. Fokus: reguläre Commander-Viererrunden (1 gegen 3), **oberer Bracket 3** ohne Budgetlimit. Nur [current.txt](current.txt) ist die aktive, importierbare Liste. Die Vorversion liegt unter [versions/2026-11-15-before-four-player.txt](versions/2026-11-15-before-four-player.txt). Ausgeschiedene Karten und Alternativen stehen im [card-pool.md](card-pool.md).

## Konstruktionsentscheidung und Prüfstand

Die 13 Eins-zu-eins-Tausche priorisieren **tatsächlich verwertbare Rendmaw-Auslöser** statt maximaler nomineller Auslöserzahl. Gegnerische Goad-Vögel schlagen bevorzugt auf die anderen Gegner ein; unsere eigenen erhalten asymmetrische Boni und werden zu Karten, Mana oder Lebensverlust gegen alle Gegner.

- **100 Karten** inklusive Rendmaw: **37 Länder** und **62 weitere Nichtlandkarten**.
- **43 direkte Mehrfachtyp-Auslöser** unter den übrigen 99 Karten (vorher 47): 11 Artefaktkreaturen, 16 Verzauberungskreaturen, 5 Kindred-Karten mit weiterem Typ, 1 Artefakt-Verzauberung, Grist als Kreaturen-Planeswalker außerhalb des Spielfelds und 9 Länder mit mindestens zwei Kartentypen.
- Zusätzlich **Biotransference**: macht *Kreaturenzauber* zu Artefaktkreaturen und vergrößert die Menge möglicher Rendmaw-Auslöser, solange es liegt. Die eigene Biotransference selbst löst Rendmaw nicht aus. Jeder Artefaktzauber kostet damit 1 Leben und erzeugt einen eigenen 2/2-Necron.
- **Genau drei Game Changers:** Ancient Tomb, Demonic Tutor, Survival of the Fittest (Wizards-Liste, Stand 2026-11-15). Craterhoof Behemoth, Diabolic Intent und die übrigen Neuzugänge sind keine zusätzlichen Game Changers.
- Keine absichtlich eingeplante frühe Zweikarten-Endlosschleife, Extrazugkette oder Massen-Landverweigerung. Ein formaler Zähltest ist kein Partienachweis und keine vollständige automatische Oracle-Prüfung.

## Warum Rendmaw im Multiplayer besonders wirkt

Rendmaw ist eine **5-Mana-Artefaktkreatur**. Bei ihrem Eintritt und beim **Spielen** einer Karte mit mindestens zwei Kartentypen erhält **jeder** der vier Spieler einen **getappten** 2/2-schwarzen Vogel mit Flugfähigkeit. Diese Vögel sind für den Rest der Partie angestachelt. Bei mindestens zwei anderen möglichen Gegnern müssen die gegnerischen Vögel nach Möglichkeit jemand anderen als den Rendmaw-Spieler angreifen. Bei nur einem verbliebenen Gegner ist diese Schutzwirkung fort: Dann dürfen dessen Vögel uns angreifen.

**Auslöserverteilung:**

| Kategorie | Karten |
| --- | ---: |
| Artifact Creature (u. a. Metallic Mimic, Adaptive Automaton, The Warring Triad, Roaming Throne, Myr) | 11 |
| Enchantment Creature (u. a. Summon: Fenrir, Springheart Nantuko, Enduring Vitality, Shigeki, Eidolon) | 16 |
| Kindred + zweiter Kartentyp (Bitterblossom, Lignify, Nameless Inversion, Eyeblight's Ending, Firdoch Core) | 5 |
| Artifact Enchantment (Whip of Erebos) | 1 |
| Grist, the Hunger Tide (auch Kreatur auf dem Stapel) | 1 |
| Zweifachtyp-Länder (Urza's Saga, Valgavoth's Lair, Darkmoss Bridge, Darksteel Citadel, Vault of Whispers, Tree of Tales, Treasure Vault, Dryad Arbor, Scene of the Crime) | 9 |
| **Summe** | **43** |

*Rendmaw reagiert auf gespielte Karten, nicht auf bloß ins Spiel gebrachte Permanents*. Normale Wälder oder Sümpfe lösen es nicht aus; "Legendary" ist kein Kartentyp. **Springheart Nantuko** löst beim Wirken als Verzauberungskreatur aus, **nicht** als per Bestow gewirkte Aura. **Metallic Mimic** verstärkt erst die *späteren* Vögel: der beim Wirken des Mimic ausgelöste Vogel liegt bereits vor dessen Verrechnung. **Firdoch Core** ist Kindred Artifact, obwohl es normalerweise keine Kreatur ist. **The Warring Triad** ist auf dem Stapel Artefaktkreatur und löst aus, auch wenn sie im Spiel mangels acht Friedhofskarten keine Kreatur ist.

## Drei ineinandergreifende Gewinnwege

1. **Tischschaden aus jedem Vogelschub:** Blood Seeker lässt *jeden* der drei Gegner beim Erzeugen seines Vogels 1 Leben verlieren. Mirkwood Bats lässt *jeden Gegner* 1 Leben verlieren, wenn **wir** einen Token erzeugen oder opfern. **Throne of the God-Pharaoh** zählt am Beginn unseres Endsegments die zu diesem Zeitpunkt **noch getappten eigenen Kreaturen** und lässt jeden Gegner entsprechend Leben verlieren. Die Vögel kommen schon getappt; sie müssen also keinen Kampfschaden verursachen. Throne zählt nicht die zuvor verstorbenen Vögel.
2. **Gegnerische Vögel als Ressourcen:** Mit **Species Specialist** (Bird) ziehen wir optional eine Karte für **jeden Vogel eines beliebigen Spielers**, der stirbt. **Poison-Tip Archer** lässt alle Gegner bei *jedem anderen Kreaturentod* Leben verlieren. **Massacre Wurm** gibt gegnerischen Kreaturen beim Eintritt -2/-2 und lässt deren Besitzer für jede verstorbene eigene Kreatur zwei Leben verlieren. **Culling Ritual** räumt Vögel (Mana Value 0) ab und liefert Mana; das kann auch eigene kleine Permanents zerstören.
3. **Asymmetrische Luftoffensive:** **Metallic Mimic** (Bird) gibt späteren eigenen Vögeln +1/+1-Marken; **Adaptive Automaton** (Bird) verstärkt alle eigenen Vögel um +1/+1; **Renata** gibt weiteren eigenen Kreaturen Marken, **Parallel Lives** verdoppelt nur unsere erzeugten Tokens, **Chatterfang** erzeugt zusätzliche eigene Eichhörnchen. **Beastmaster Ascension** und der über **Survival of the Fittest** auffindbare **Craterhoof Behemoth** können so das Spiel über Kampfschaden schließen. Goad garantiert nicht, dass ein Angriff ungeblockt bleibt.

## Mana, Karten und Schutz

- **Frühphase:** Sol Ring, Arcane Signet, Nature's Lore, Three Visits, Ornithopter of Paradise, Myr, Twitching Doll, Bloom Tender, Sanctum Weaver. Summon: Fenrir sucht ein Standardland getappt; es darf bewusst *vor* Rendmaw gewirkt werden, auch wenn dann kein Bird-Trigger entsteht. Ziel: Rendmaw um Zug 4–5, ideal mit Anschlusskarten.
- **Mehrfachtyp-Mana:** **Firdoch Core** kostet drei und tappt sich für beliebiges Mana; **The Warring Triad** ist bei weniger als acht Friedhofskarten ein Nichtkreatur-Artefakt und kann Mana erzeugen. Triads aktivierte Fähigkeit **ist keine Manafähigkeit, benutzt den Stapel und kann beantwortet werden**. Es ist also kein garantiert sofort verfügbarer, unkonterbarer Manafels.
- **Kartennachschub:** Eidolon of Blossoms, Nessian Wanderer, Shigeki, Dockside Chef, Yawgmoth, Species Specialist und Pygmy Kavu. **Pygmy Kavu** zieht zwingend Karten entsprechend schwarzer gegnerischer Kreaturen; sehr große Vogelschwärme können zum Überziehen führen. Auf Handkarten und Bibliotheksgröße achten.
- **Auswahl / Wiederverwertung:** Demonic Tutor und Diabolic Intent finden situative Finisher; Survival of the Fittest findet Craterhoof oder Massacre Wurm. Gloomshrieker und Shigeki liefern begrenzte Rekursion.
- **Interaktion:** Haywire Mite, Assassin's Trophy, Beast Within, Deadly Rollick, Nameless Inversion, Eyeblight's Ending, Lignify, Grist, Doomwake Giant und Culling Ritual.
- **Schutz:** Lightning Greaves, Heroic Intervention, **Plaza of Heroes** (das Land wird für gezielten Schutz geopfert). Die Zahl der Absicherungen ist bewusst schlank, kein Lock-Deck.
- **Manabasis:** 37 Länder. **Wooded Foothills** statt des getappten Woodland Chasm; **Plaza of Heroes** statt des eingeschränkten Power Depot. Damit geht ein direkt auslösendes Artefaktland verloren, aber Mana und Commander-Schutz werden vielseitiger.

## Warum diese 13 Änderungen und nicht alles zugleich?

Neue Karten **Throne, Blood Seeker und Species Specialist** monetarisieren gegnerische und eigene Vögel. **Metallic Mimic, Adaptive Automaton und Springheart Nantuko** erzeugen einen eigenen Vorteil; **Summon: Fenrir, Firdoch Core und The Warring Triad** kombinieren Mehrfachtyp mit Ressourcennutzen. **Diabolic Intent** verbessert den Zugriff auf Abschlüsse und **Craterhoof** macht eine bereits aufgebaute Armee zu einer über Survival auffindbaren Bedrohung. Die beiden Landtausche stärken die Funktionssicherheit.

**Glissa, the Traitor, Reap, Doubling Season, Delighted Halfling, Triumph of the Hordes, Toski** sind bewusste Reservekandidaten, keine vergessenen Optionen. Zusätzliche Nicht-Auslöser verdrängen den Kernplan; erst nach Gegenproben nachrüsten.

## Risiken und erforderliche Gegenproben

- **Vier-Spieler-Goad ist nicht absolute Sicherheit.** Gegner können entscheiden, wen sie mit Vögeln angreifen, und die letzten Vögel können uns im Duell treffen. Wir wollen möglichst **vor** einer langen Zweispielerphase gewinnen.
- **Symmetrie:** Ein Rendmaw-Auslöser schenkt jedem Gegner einen 2/2-Flieger. Unsere Verstärker / Drains müssen schneller greifen als der gegnerische Kampfnutzen. **Roaming Throne** verdoppelt auch die gegnerischen Vögel.
- **Boardwipes:** Der Commander kostet beim Wiederwirken mehr; Karten mit zwei Typen sind ohne ihn immer noch nutzbar, erzeugen dann aber nicht automatisch Vögel.
- **Mana:** Craterhoof verlangt 8 Mana und {G}{G}{G}; Massacre Wurm 6 Mana und {B}{B}{B}. Land- und Manakreaturen-Vielfalt ist wichtiger als nur Rohzahl der Auslöser.
- **Frühe Manaentwicklung vs. späte Trigger:** Artefakt-/Verzauberungskreaturen als Ramp kommen manchmal bereits vor Rendmaw. Die **43** sind deshalb kein Anspruch, in jeder Partie 43 zusätzliche Vögel zu erzeugen.
- **Testprotokoll:** Eröffnungshände, Zeit bis Rendmaw, Zahl der nachfolgenden spielbaren Mehrfachtypen, Kartenversorgung, eigene vs. fremde Vogelzahl, Schaden durch Throne/Blood Seeker, Wiederaufbau nach Removal und Abschluss mit Craterhoof gegen drei echte Gegner. Die Listenumstellung wurde noch **nicht** in einer realen Viererpartie validiert.

## Quellen

- [Rendmaw: Oracle, Goad und Regelfragen](https://www.mtg.wtf/card/dsc/5/Rendmaw-Creaking-Nest)
- [Wizards: Commander-Brackets, Game Changers und Legalität](https://magic.wizards.com/en/formats/commander)
- [Wizards: Biotransference-Regeln](https://magic.wizards.com/en/news/feature/warhammer-40000-commander-release-notes-2022-09-19)
- [The Warring Triad: Oracle und Rulings](https://mtg.wtf/card/fic/193/The-Warring-Triad)
- [Firdoch Core: Oracle](https://mtg.wtf/card/ecl/255/Firdoch-Core)
- [Summon: Fenrir: Oracle](https://mtg.wtf/card/fin/372/Summon-Fenrir)
- [Springheart Nantuko: Oracle](https://www.mtg.wtf/card/pmh3/171p/Springheart-Nantuko)
- [Species Specialist: Oracle](https://mtg.wtf/card/c20/47/Species-Specialist)
