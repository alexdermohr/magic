# Magar of the Magic Strings — Puppentheater der unmöglichen Zauber

**Aktueller Stand:** 20. Oktober 2026 · **V7** · Rakdos Commander · **Bracket 3 / Upgraded** · kein Budgetlimit.

- [current.txt](current.txt) — einzige aktuelle, direkt importierbare 100-Karten-Liste.
- [analysis.md](analysis.md) — aktive V7-Entscheidungen, Regeln und Gegenargumente.
- **Echte Snapshots:** [V1](versions/2026-10-19-b3-v1.txt), [V2](versions/2026-10-19-b3-v2.txt), [V3](versions/2026-10-19-b3-v3.txt), [V4](versions/2026-10-19-b3-v4.txt), [V5](versions/2026-10-19-b3-v5.txt), [V6](versions/2026-10-20-b3-v6.txt).

## V7 – Zwei überprüfte Anpassungen

| V6 heraus | V7 hinein | Strategischer Grund |
|---|---|---|
| **Expedition Map** | **Key to the Side-Door** | Artefakt für {1}, dann **{2}, {T}: Eine beliebige Kreatur kann in diesem Zug nicht geblockt werden.** Wir benötigen keinen Landtutor und keine kostspielige Aktivierung von Rogue's Passage, um **einen** Magar-Treffer wiederholt zu erzwingen. |
| **Geier Reach Sanitarium** | **Cavern of Souls** | Benenne beim Eintritt **Minotaur**. Das daraus stammende Farb-Mana kann zum Wirken von Magar verwendet werden; dieser Kreaturenzauber kann dann nicht neutralisiert werden. Der neutrale Mana-Modus bezahlt auch das generische {1} seiner aktivierten Fähigkeit. Die tatsächliche Länderzahl bleibt 36. |

**Regelgrenzen:** Das Key muss **vor der Blockerdeklaration** aktiviert werden. Die zweite Fähigkeit (eine zusätzliche gleichnamige legendäre Karte abwerfen, um zwei zu ziehen) lässt sich mit nur einem Magar im Singleton-Deck normalerweise nicht nutzen; **das Key ist hier Evasion, keine Draw-Engine**. Cavern schützt **nur das Wirken eines Minotaur-Kreaturenzaubers**, für den sein Spezialmana ausgegeben wurde. Es schützt nicht Magars aktivierte Fähigkeit, die Puppen oder deren kostenlose Zauberkopien vor Counterspells; für die Aktivierung liefert Cavern nur {C}, kein rotes oder schwarzes Mana.

**Bewusste Kosten:** Expedition Map konnte außerdem besondere Länder suchen (z. B. Access Tunnel oder The Black Gate). Geier Reach Sanitarium bot wiederholbares gemeinsames Ziehen und Abwerfen ({2}, {T}); das entfällt. Das Deck hat jedoch schon zahlreiche billigere Discard-Möglichkeiten und priorisiert im Bracket-3-Spiel den **sicheren ersten Magar-Treffer** sowie den erfolgreichen Commander-Cast.

**Unverändert:** `Disrupt Decorum` bleibt als Goad-/Politik-Kern; `Mask of Memory`, `Traitor's Clutch`, `Conqueror's Flail`, alle weiteren Evasion-Ausrüstungen und alle übrigen Karten bleiben. `Mirkwood Bats` wird nicht wieder eingeführt.


## Grundprinzip

Magars Fähigkeit kostet {1}{B}{R}, aber kein Tappen und ist nicht auf Hexerei-Geschwindigkeit beschränkt. **Aktiviere Magar möglichst im gegnerischen Endsegment unmittelbar vor deinem Zug.** Die so aus dem Friedhof verdeckt aufs Feld gebrachte Instant-/Sorcery-Karte ist eine echte **3/3-Kreatur**, kein Token. Sie darf im nächsten eigenen Zug ohne Eile angreifen.

Verursacht sie **Kampfschaden an einem Spieler**, kannst du eine Kopie der notierten Karte kostenlos **wirken** – auch eine Hexerei mitten im Kampf. **Zusätzliche Kosten** gelten weiterhin, und ein alternatives Wirken wie Overload lässt sich nicht gleichzeitig mit dem kostenlosen Wirken wählen. Eine Magar-Puppe ist farblos, namenlos, typelos und Manawert 0. Die notierte Information ist **nicht kopierbar**; die Reflection of Kiki-Jiki soll deshalb eher `Vile Entomber` als eine Magar-Puppe kopieren. Die Puppe geht beim Verlassen des Spielfelds ins Exil.

## Ablauf V7

1. **Mana und Friedhof:** 36 feste Länder, Sol Ring und sechs weitere frühe Mana-Artefakte. `Faithless Looting`, `Anje Falkenrath`, `Dark Deal`, `Ransack the Lab`, `Ripples of Undeath`, `Stinkweed Imp` und `Fable of the Mirror-Breaker` füllen den Friedhof. `Entomb`, `Unmarked Grave`, `Vile Entomber` und `Final Parting` legen gezielt den benötigten Spruch dort ab.
2. **Puppe aufbauen:** End-Step-Aktivierung {1}{B}{R} auf `Blood for the Blood God!`, `Brass's Bounty`, `Breach the Multiverse`, `Rise of the Dark Realms`, `In Garruk's Wake`, `Call Forth the Tempest`, `Peer into the Abyss`, `Increasing Ambition` oder `Disrupt Decorum`. `Bitter Reunion` und beide Boots ermöglichen bei Bedarf Angriffe mit einer erst im eigenen Zug entstandenen Puppe.
3. **Ersten Treffer absichern:** `Key to the City`, `Whispersilk Cloak`, `Prowler's Helm`, `Thieves' Tools`, `Silver Shroud Costume`, **`Key to the Side-Door`**, `Dauthi Embrace`, `Access Tunnel`, `Rogue's Passage` oder bedingt `The Black Gate`. **Neu:** `Traitor's Clutch` kann im Friedhof für nur **{1}{B} Flashback** erhalten und verleiht **Shadow** für diesen Zug – fast unblockbar gegen gewöhnliche Blocker. Aus der Hand kostet es dagegen {4}{B}; bevorzugt abwerfen oder millen. Flashback schickt die Karte anschließend ins Exil.
4. **Magar schützen:** `Lightning Greaves`, `Swiftfoot Boots`, `Deflecting Swat`, `Plaza of Heroes` und `Malakir Rebirth` auf den **echten Commander**. **Neu:** `Conqueror's Flail` für {2} + Equip {2} am besten an **Magar selbst**: Solange befestigt, können Gegner **während unseres eigenen Zuges keine Zauber wirken**. In gegnerischen Zügen und gegen gegnerische **aktivierte Fähigkeiten** schützt es nicht. Der +1/+1-Bonus je kontrollierter Farbe erhöht die Stärke der ausgerüsteten Puppe über 3 und würde damit `Thieves' Tools` und `Access Tunnel` sabotieren; deshalb besser nicht an die Puppe ausrüsten.
5. **Mehrfach-Treffer und Kartenwahl:** `Embercleave` verleiht mit Flash und direktem Anlegen Doppelschlag und Trampelschaden. Zwei erfolgreiche Kampfschaden-Segmente ermöglichen zwei Kopien desselben notierten Zaubers. **Neu: `Mask of Memory`** ({2}, Ausrüsten {1}) zieht bei Kampfschaden an einem Spieler zwei Karten und lässt eine Karte abwerfen; bei zwei erfolgreichen Kampfschadensschritten kann sie insgesamt vier ziehen und zwei abwerfen, wodurch neue große Magar-Zauber in den Friedhof gelangen. Nach dem Blocken angelegte Embercleave macht eine zuvor durch `Thieves' Tools` ungeblockte 3/3 nicht rückwirkend blockbar.
6. **Abschluss:** `Brass's Bounty` produziert weiterhin große Mengen Schätze als Mana für zusätzliche Magar-Aktivierungen, **ohne dass ein Token-Drain-Payoff nötig wäre**. Wiederholtes `Blood for the Blood God!` verursacht jeweils acht Schaden an allen Gegnern und zieht neue Karten. `Breach the Multiverse`, `Rise of the Dark Realms` und `In Garruk's Wake` dominieren Kreaturenpartien. Die **Mask of Memory** hält während erfolgreicher Angriffe die Hand voller Optionen, statt eine separate `Mirkwood Bats`-Engine zu benötigen.

## Disrupt Decorum: ausdrücklich behalten

`Disrupt Decorum` ist ein **Kernelement der defensiven Politik** und bleibt unverändert. Alle gegnerischen Kreaturen werden goaded und müssen soweit möglich andere Gegner angreifen. Als Magar-Puppe immer wieder ausgelöst hält der Zauber die Gegner beschäftigt, damit wir Ressourcen und sichere Angriffe vorbereiten können. Das ersetzt weder Unblockbarkeit für unseren unmittelbaren Angriff noch verhindert Goad bereits deklarierte Blocker.

## Increasing Ambition: ungewöhnlicher Magar-Doppeltutor

`Increasing Ambition` ist eine Hexerei für {4}{B}, die aus der Hand **eine** beliebige Karte sucht. **Wenn sie aus dem Friedhof gewirkt wurde**, sucht sie **zwei beliebige Karten**. Die per Magar beim Treffer **gewirkte Kartenkopie** erfüllt laut den Kartenkopie-Regeln für die Erstellung aus dem letzten bekannten Friedhofs-Ursprung diese Bedingung. Wiederholte Puppentreffer liefern deshalb wiederholt zwei gezielte Karten auf die Hand, z. B. `Key to the City` plus `Embercleave` oder geeignete Schutz- und Evasion-Karten. `Increasing Ambition` besitzt außerdem Flashback {7}{B}, falls sie normal im Friedhof liegt. Das ist eine ungewöhnliche Regelinteraktion: Eine digitale Plattform muss die Kopie als aus dem Friedhof gewirkt behandeln; bei Abweichungen Plattform-Regelumsetzung gesondert prüfen.

## Risiken und Grenzen

- `Traitor's Clutch` mit Shadow ist **nicht vollständig unblockbar**: Kreaturen mit Shadow können blocken; aus der Hand sind fünf Mana teuer und nach Flashback wird es exiliert.
- `Conqueror's Flail` verhindert weder Interaktionen in fremden Zügen noch Fähigkeiten oder bereits auf dem Stapel liegende Sprüche. Der Effekt setzt eine ausgerüstete eigene Kreatur voraus und kann als Antwort auf Equip vor dem Anlegen unterbrochen werden.
- **Vier Karten aus V5 entfernt:** `Filth` (bedingtes globales Swampwalk), `Berserkers' Onslaught` (redundanter Fünf-Mana-Doppelschlag), `Sorin's Vengeance` (zehn Schaden an einem Ziel) und **`Mirkwood Bats`** (vier Mana teurer, vom Kampfschaden-Plan ablenkender Token-Drain). Die Bats wurden durch **`Mask of Memory`** ersetzt; alle anderen drei Änderungen aus V6 bleiben unverändert.
- Friedhofshass, ein früh entfernter Magar und nicht zugeteilte Kampftreffer bleiben zentrale Engpässe. Ohne echte Multiplayer-Partien ist eine höhere Winrate nicht belegt.

**Bracket 3:** Genau drei Game Changers: `Demonic Tutor`, `Gamble`, `Jeska's Will`. Keine beabsichtigten frühen Zwei-Karten-Infinite-Kombos, Extrazugketten oder Massenlandvernichtung.

**Quellen:** [Wizards Commander/Brackets](https://magic.wizards.com/en/formats/commander), [Magar und Rulings](https://mtg.wtf/card/unf/514/Magar-of-the-Magic-Strings), [Traitor's Clutch](https://mtg.wtf/card/tsp/137/Traitors-Clutch), [Conqueror's Flail](https://mtg.wtf/card/c16/53/Conquerors-Flail), [Increasing Ambition](https://mtg.wtf/card/dka/69/Increasing-Ambition), [Kartencopy-Regeldiskussion](https://www.reddit.com/r/mtgrules/comments/14sbe6w/).
