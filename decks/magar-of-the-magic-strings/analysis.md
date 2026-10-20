# Magar of the Magic Strings — Bracket 3, V6

**20. Oktober 2026.** Aktuelle Deckliste: [current.txt](current.txt). [V1](versions/2026-10-19-b3-v1.txt), [V2](versions/2026-10-19-b3-v2.txt), [V3](versions/2026-10-19-b3-v3.txt), [V4](versions/2026-10-19-b3-v4.txt) und [V5](versions/2026-10-19-b3-v5.txt) sind echte historische Snapshots. Dies ist die **V6**-Analyse; frühere Analysen bleiben über Git verfügbar.

## Drei V5 → V6 Änderungen: belegter Mechanismus gegen Gegenargument

| Heraus | Hinein | Warum | Was verloren geht |
|---|---|---|---|
| **Filth** | **Traitor's Clutch** | {1}{B} Flashback aus unserem durch Rummage/Dredge gefüllten Friedhof gibt einer 3/3 **Shadow** bis Zugende. Funktioniert ohne Swamp beim Gegner, solange dieser keinen Shadow-Blocker hat. | Filth gewährte aus dem Friedhof bei eigenem Swamp unseren **allen** Kreaturen Swampwalk gegen Spieler mit Swamps; besonders stark mit Urborg. Traitor's Clutch ist einmalig und kostet aus der Hand {4}{B}. |
| **Berserkers' Onslaught** | **Conqueror's Flail** | {2} + Equip {2} statt {3}{R}{R}: Das Equipment verbietet **gegnerische Zauber während unseres eigenen Zuges**, solange es an einer Kreatur befestigt ist. Wichtiger Schutz in der Angriffsphase; `Embercleave` liefert weiter Doppelschlag. | Onslaught gab dauerhaft **allen** Angreifern Doppelschlag, ohne ausgerüstete Kreatur. Flail stoppt keine Fähigkeiten, reagierende Gegner können vor dem Anlegen oder in ihren eigenen Zügen handeln. |
| **Sorin's Vengeance** | **Increasing Ambition** | Normale {4}{B}-Hexerei sucht eine Karte. Durch Magars Kampfschadensfähigkeit **aus dem Friedhof gewirkte Kopie** erfüllt die Bedingung für zwei Karten. Ein wiederholter Tutor ist in langen Partien vielseitiger als wiederholte 10 Schaden an einem Ziel. | Sorin's Vengeance brachte jedes Mal 10 Lebenspunkte und konnte einen Spieler direkt beenden. Increasing Ambition alleine verursacht keinen Schaden; braucht weitere Karten zum tatsächlichen Sieg. |

**Disrupt Decorum ist unverhandelbarer Kern:** Wiederholtes Goad sorgt dafür, dass gegnerische Kreaturen, soweit möglich, andere Spieler angreifen und unsere Aufbauphase entlasten. Der Zauber ist außerdem ein wirksames Ziel für Magars Puppen. `Cosmotronic Wave` kann diesen fortlaufenden politischen Effekt nicht ersetzen.

## V6: Struktur und Legality-Rahmen

- 100 Karten, darunter **1 Commander, 8 weitere Kreaturen, 18 Artefakte, 5 Verzauberungen, 32 Spontanzauber/Hexereien und 36 echte Länder**. `Malakir Rebirth` zählt hier als Instant mit optionaler Landrückseite.
- Drei geplante Game Changers: **Demonic Tutor, Gamble, Jeska's Will**. Keine absichtliche frühe Zweikarten-Endlosschleife, keine Extrazugkette oder Massenlandvernichtung.
- Neue Karten `Traitor's Clutch` (schwarz), `Conqueror's Flail` (farblos) und `Increasing Ambition` (schwarz) sind Commander-legal. Keine ungewöhnlichen Farbsymbole außerhalb Rakdos.
- Ursprüngliche Kopierverbote beachten: Der notierte Name einer Magar-3/3 wird von Kreaturenkopien nicht übernommen. `Fable of the Mirror-Breaker` kopiert vorzugsweise `Vile Entomber`.

## Schlüsselinteraktionen und Grenzen

**Traitor's Clutch** muss für den Durchbruch **vor der Blockerdeklaration** aus dem Friedhof via Flashback für {1}{B} gewirkt werden. Das Spruchziel erhält Shadow (nur Shadow-Kreaturen können es blocken). Anders als `Outmaneuver` funktioniert die Karte schon im Friedhof nach Selbstmill, während dessen X in kostenlos gewirkten Magar-Kopien gleich 0 wäre. Traitor's Clutch hilft bei der Vorbereitung des Treffers; als von Magar nach einem bereits erfolgreichen Treffer gewirkte Kopie wäre ihre Evasion für diesen Treffer zu spät.

**Conqueror's Flail** ist am echten `Magar` meist am besten aufgehoben: Das +1/+1 für jede Farbe unter unseren Permanents macht aus einer 3/3-Puppe schnell eine 5/5, wodurch `Thieves' Tools` oder `Access Tunnel` wegen ihrer Stärke-3-Grenzen nicht mehr helfen. Sobald das Flail befestigt ist, können Gegner in unserem Zug keine Zauber wirken; bereits auf dem Stapel liegende Sprüche, aktivierte Fähigkeiten und Effekte in gegnerischen Zügen bleiben möglich. Das verhindert auch gegnerische spontane Antworten auf `Increasing Ambition`-Kopien, sofern das Equipment weiterhin befestigt ist.

**Increasing Ambition** lautet: „If this spell was cast from a graveyard, instead search ... for two cards.“ Bei Magar wird eine **Kopie einer notierten Karte** erzeugt und aus deren letztem bekanntem Kartenursprung (Friedhof) gewirkt; die ungewöhnliche Interaktion ist mit CR 707.12/707.14 und einer [konkreten Regeldiskussion](https://www.reddit.com/r/mtgrules/comments/14sbe6w/) abgeglichen. Bei digitalen Simulatoren die Implementation explizit kontrollieren. Von der Hand kostet die Karte {4}{B} für nur **eine** Karte, alternativ Flashback {7}{B} aus dem Friedhof für zwei. Sie ist daher kein kostenloser Tutor ohne erfolgreiche Magar-Engine.

**Mirkwood Bats + Brass's Bounty** bleiben eine Siegroute. Die Bats lösen **für jeden** erzeugten oder geopferten Treasure aus. Sechs erzeugte Schätze und sechs spätere Opfer sind bis zu zwölf Lebensverlust pro Gegner. `Storm-Kiln Artist` und `Professional Face-Breaker` erzeugen ebenfalls Treasures. `Blood for the Blood God!`, `Breach the Multiverse`, `Rise of the Dark Realms`, `In Garruk's Wake`, `Call Forth the Tempest` und `Peer into the Abyss` bleiben erhalten.

**Nicht geändert:** `Key to the City`, `Dauthi Embrace`, `Whispersilk Cloak`, `Silver Shroud Costume`, `Prowler's Helm`, `Thieves' Tools`, `Access Tunnel`, `Rogue's Passage`, `The Black Gate`; die ersten vier sind besonders gute Grundbausteine für Evasion. `Disrupt Decorum` bleibt Teil der Kontrolle, `Embercleave` der Doppelschlag-Finisher.

## Gegenprobe: Warum nicht Outmaneuver, Cosmotronic Wave oder War Cadence?

`Outmaneuver` (X R) kann mit X=1 für {1}{R} **eine bereits geblockte** Puppe Spieler-Kampfschaden zufügen lassen. Als Magar-Kopie mit kostenloser X-Wahl ist X jedoch 0, außerdem hat die Karte kein Flashback: Selbstmill verliert dort einen echten Hand-Kampftrick. `Traitor's Clutch` nutzt die bestehende Selfmill/Discard-Engine besser. `Cosmotronic Wave` verschafft vorübergehend einen global ungehinderten Angriff, aber nicht Disrupt Decorums wiederholtes Goad. `War Cadence` ist wiederholbare Blocksteuer, kostet jedoch viel Mana, während vorhandene Ausstattung bereits zahlreiche alternative Durchbruchwege bietet.

**Hauptrisiko nach V6:** Ohne Schutz/Timing verliert Magar immer noch gegen schnellen Friedhofshass und Removal; Flail schützt nicht am gegnerischen Zugende. Der Verlust der beiden V5-Stärken (globales Swampwalk und globaler Doppelschlag) ist in manchen Tischen ein Rückschritt. Höhere tatsächliche Siegquoten sind nicht gemessen. **Keine vollständige automatische 100-Karten-Oracle-Prüfung oder Partietests behauptet.**

**Quellen:** [Magar](https://mtg.wtf/card/unf/514/Magar-of-the-Magic-Strings), [Traitor's Clutch](https://mtg.wtf/card/tsp/137/Traitors-Clutch), [Conqueror's Flail](https://mtg.wtf/card/c16/53/Conquerors-Flail), [Increasing Ambition](https://mtg.wtf/card/dka/69/Increasing-Ambition), [WotC Commander](https://magic.wizards.com/en/formats/commander).
