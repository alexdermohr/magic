# Magar of the Magic Strings — Puppentheater der unmöglichen Zauber

**Aktueller Stand:** 20. Oktober 2026 · **V6** · Rakdos Commander · **Bracket 3 / Upgraded** · kein Budgetlimit.

- [current.txt](current.txt) — einzige aktuelle, direkt importierbare 100-Karten-Liste.
- [analysis.md](analysis.md) — V6-Kartenentscheidungen, Spielplan und Gegenargumente.
- **Echte Snapshots:** [V1](versions/2026-10-19-b3-v1.txt), [V2](versions/2026-10-19-b3-v2.txt), [V3](versions/2026-10-19-b3-v3.txt), [V4](versions/2026-10-19-b3-v4.txt), [V5](versions/2026-10-19-b3-v5.txt).

## Grundprinzip

Magars Fähigkeit kostet {1}{B}{R}, aber kein Tappen und ist nicht auf Hexerei-Geschwindigkeit beschränkt. **Aktiviere Magar möglichst im gegnerischen Endsegment unmittelbar vor deinem Zug.** Die so aus dem Friedhof verdeckt aufs Feld gebrachte Instant-/Sorcery-Karte ist eine echte **3/3-Kreatur**, kein Token. Sie darf im nächsten eigenen Zug ohne Eile angreifen.

Verursacht sie **Kampfschaden an einem Spieler**, kannst du eine Kopie der notierten Karte kostenlos **wirken** – auch eine Hexerei mitten im Kampf. **Zusätzliche Kosten** gelten weiterhin, und ein alternatives Wirken wie Overload lässt sich nicht gleichzeitig mit dem kostenlosen Wirken wählen. Eine Magar-Puppe ist farblos, namenlos, typelos und Manawert 0. Die notierte Information ist **nicht kopierbar**; die Reflection of Kiki-Jiki soll deshalb eher `Vile Entomber` als eine Magar-Puppe kopieren. Die Puppe geht beim Verlassen des Spielfelds ins Exil.

## Ablauf V6

1. **Mana und Friedhof:** 36 feste Länder, Sol Ring und sechs weitere frühe Mana-Artefakte. `Faithless Looting`, `Anje Falkenrath`, `Dark Deal`, `Ransack the Lab`, `Ripples of Undeath`, `Stinkweed Imp` und `Fable of the Mirror-Breaker` füllen den Friedhof. `Entomb`, `Unmarked Grave`, `Vile Entomber` und `Final Parting` legen gezielt den benötigten Spruch dort ab.
2. **Puppe aufbauen:** End-Step-Aktivierung {1}{B}{R} auf `Blood for the Blood God!`, `Brass's Bounty`, `Breach the Multiverse`, `Rise of the Dark Realms`, `In Garruk's Wake`, `Call Forth the Tempest`, `Peer into the Abyss`, `Increasing Ambition` oder `Disrupt Decorum`. `Bitter Reunion` und beide Boots ermöglichen bei Bedarf Angriffe mit einer erst im eigenen Zug entstandenen Puppe.
3. **Ersten Treffer absichern:** `Key to the City`, `Whispersilk Cloak`, `Prowler's Helm`, `Thieves' Tools`, `Silver Shroud Costume`, `Dauthi Embrace`, `Access Tunnel`, `Rogue's Passage` oder bedingt `The Black Gate`. **Neu:** `Traitor's Clutch` kann im Friedhof für nur **{1}{B} Flashback** erhalten und verleiht **Shadow** für diesen Zug – fast unblockbar gegen gewöhnliche Blocker. Aus der Hand kostet es dagegen {4}{B}; bevorzugt abwerfen oder millen. Flashback schickt die Karte anschließend ins Exil.
4. **Magar schützen:** `Lightning Greaves`, `Swiftfoot Boots`, `Deflecting Swat`, `Plaza of Heroes` und `Malakir Rebirth` auf den **echten Commander**. **Neu:** `Conqueror's Flail` für {2} + Equip {2} am besten an **Magar selbst**: Solange befestigt, können Gegner **während unseres eigenen Zuges keine Zauber wirken**. In gegnerischen Zügen und gegen gegnerische **aktivierte Fähigkeiten** schützt es nicht. Der +1/+1-Bonus je kontrollierter Farbe erhöht die Stärke der ausgerüsteten Puppe über 3 und würde damit `Thieves' Tools` und `Access Tunnel` sabotieren; deshalb besser nicht an die Puppe ausrüsten.
5. **Mehrfach-Treffer:** `Embercleave` verleiht mit Flash und direktem Anlegen Doppelschlag und Trampelschaden. Zwei erfolgreiche Kampfschaden-Segmente ermöglichen zwei Kopien desselben notierten Zaubers. Nach dem Blocken angelegte Embercleave macht eine zuvor durch `Thieves' Tools` ungeblockte 3/3 nicht rückwirkend blockbar.
6. **Abschluss:** `Mirkwood Bats` löst pro eigenem erzeugten oder geopferten Token aus. `Brass's Bounty` bei sechs Ländern = sechs Treasure-ETBs und bei späterem Opfern derselben sechs Schätze nochmals sechs Auslöser, insgesamt **12 Lebensverlust je Gegner**. Wiederholtes `Blood for the Blood God!` bringt jeweils acht Schaden für alle Gegner und neue Karten. `Breach the Multiverse`, `Rise of the Dark Realms` und `In Garruk's Wake` entscheiden über Kreaturen.

## Disrupt Decorum: ausdrücklich behalten

`Disrupt Decorum` ist ein **Kernelement der defensiven Politik** und bleibt unverändert. Alle gegnerischen Kreaturen werden goaded und müssen soweit möglich andere Gegner angreifen. Als Magar-Puppe immer wieder ausgelöst hält der Zauber die Gegner beschäftigt, damit wir Ressourcen und sichere Angriffe vorbereiten können. Das ersetzt weder Unblockbarkeit für unseren unmittelbaren Angriff noch verhindert Goad bereits deklarierte Blocker.

## Increasing Ambition: ungewöhnlicher Magar-Doppeltutor

`Increasing Ambition` ist eine Hexerei für {4}{B}, die aus der Hand **eine** beliebige Karte sucht. **Wenn sie aus dem Friedhof gewirkt wurde**, sucht sie **zwei beliebige Karten**. Die per Magar beim Treffer **gewirkte Kartenkopie** erfüllt laut den Kartenkopie-Regeln für die Erstellung aus dem letzten bekannten Friedhofs-Ursprung diese Bedingung. Wiederholte Puppentreffer liefern deshalb wiederholt zwei gezielte Karten auf die Hand, z. B. `Mirkwood Bats` plus `Brass's Bounty`, oder Schutz und Evasion. `Increasing Ambition` besitzt außerdem Flashback {7}{B}, falls sie normal im Friedhof liegt. Das ist eine ungewöhnliche Regelinteraktion: Eine digitale Plattform muss die Kopie als aus dem Friedhof gewirkt behandeln; bei Abweichungen Plattform-Regelumsetzung gesondert prüfen.

## Risiken und Grenzen

- `Traitor's Clutch` mit Shadow ist **nicht vollständig unblockbar**: Kreaturen mit Shadow können blocken; aus der Hand sind fünf Mana teuer und nach Flashback wird es exiliert.
- `Conqueror's Flail` verhindert weder Interaktionen in fremden Zügen noch Fähigkeiten oder bereits auf dem Stapel liegende Sprüche. Der Effekt setzt eine ausgerüstete eigene Kreatur voraus und kann als Antwort auf Equip vor dem Anlegen unterbrochen werden.
- **Drei Karten aus V5 entfernt:** `Filth` (globales Swampwalk, aber bedingt), `Berserkers' Onslaught` (globaler Doppelschlag, aber fünf Mana und neben Embercleave redundant), `Sorin's Vengeance` (10 Schaden plus 10 Leben, gegen nur ein Ziel).
- Friedhofshass, ein früh entfernter Magar und nicht zugeteilte Kampftreffer bleiben zentrale Engpässe. Ohne echte Multiplayer-Partien ist eine höhere Winrate nicht belegt.

**Bracket 3:** Genau drei Game Changers: `Demonic Tutor`, `Gamble`, `Jeska's Will`. Keine beabsichtigten frühen Zwei-Karten-Infinite-Kombos, Extrazugketten oder Massenlandvernichtung.

**Quellen:** [Wizards Commander/Brackets](https://magic.wizards.com/en/formats/commander), [Magar und Rulings](https://mtg.wtf/card/unf/514/Magar-of-the-Magic-Strings), [Traitor's Clutch](https://mtg.wtf/card/tsp/137/Traitors-Clutch), [Conqueror's Flail](https://mtg.wtf/card/c16/53/Conquerors-Flail), [Increasing Ambition](https://mtg.wtf/card/dka/69/Increasing-Ambition), [Kartencopy-Regeldiskussion](https://www.reddit.com/r/mtgrules/comments/14sbe6w/).
