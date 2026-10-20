# Magar of the Magic Strings – Bracket 3, V9

**Stand:** 20. Oktober 2026 · **Aktive Liste:** [current.txt](current.txt) · **Commander:** Magar of the Magic Strings · **Rakdos** · **Bracket 3**, ohne Budgetgrenze.

Die historisch letzte gemergte V8-Liste wurde vor den Änderungen **byteidentisch** archiviert: [versions/2026-10-20-b3-v8.txt](versions/2026-10-20-b3-v8.txt). Die vollständige Einzelbewertung der **32 ursprünglichen Instants/Sorceries** ist in der [V8-Analyse auf GitHub](https://github.com/alexdermohr/magic/blob/cec24c621e1157cdd3ea33cb803ec34a82dab761/decks/magar-of-the-magic-strings/analysis.md) nachlesbar.

## Zwei nachgeprüfte Kartentausche

| Heraus (V8) | Hinein (V9) | Mehrwert | Wichtigster Verlust |
|---|---|---|---|
| **Cathartic Reunion** – {1}{R} Sorcery | **Liliana's Caress** – {1}{B} Enchantment | Gegner verlieren **für jede einzelne abgeworfene Karte zwei Leben**. Mit `Wheel of Fortune`, `Dark Deal` und neu `Incendiary Command` eine zweite, billige Lebensverlust-Engine; die Auslöser können die drei Bloodchief-Quest-Marken erleichtern. | `Cathartic Reunion` konnte **zwei** beliebige Großzauber aus der Hand auf einmal in den Friedhof befördern und drei Karten nachziehen. Die V9 besitzt immer noch Faithless Looting, Bitter Reunion, Demand Answers, Big Score, Fable, Anje, Ransack, Wheel und Dark Deal als Setup. |
| **Rise of the Dark Realms** – {7}{B}{B} Sorcery | **Incendiary Command** – {3}{R}{R} Sorcery | Wähle **zwei** Modi. Beste Magar-Linie: **4 Schaden an einem Spieler/Planeswalker** plus alle Hände abwerfen und jeweils gleich viele Karten nachziehen. Drei Vorteile: bis zum eigenen Endsegment den Quest-Trigger sicherstellen, Gegnerhände ausräumen und selbst neue Friedhofsziele abwerfen. Dank Magar **kostenlos und wiederholbar** nach erfolgreichen Treffern. | `Rise of the Dark Realms` war eine mächtige **globale** Kreaturen-Reanimation, die bei gefüllten Friedhöfen sofort Partien entscheiden kann. `Breach the Multiverse` bleibt als große Reanimationslinie erhalten, bringt aber nicht alle Kreaturen gleichzeitig zurück. |

**Nur Sortierkorrektur:** `Traitor's Clutch` wurde vom bisherigen, fälschlich zwischen Kreaturen geführten Slot in die Spell-Gruppe verschoben. Es bleibt **im Deck**, keine dritte Kartenänderung.

## So funktioniert das neue Paket

### Früh: Liliana's Caress lädt Bloodchief Ascension

`Liliana's Caress` kostet {1}{B} und lautet „Whenever an opponent discards a card, that player loses 2 life.“ Bei mehreren gleichzeitig abgeworfenen Karten löst sie **für jede** separat aus. Schon eine abgeworfene gegnerische Karte erzeugt also mindestens zwei Lebensverlust und genügt an einem späteren Endsegment als Voraussetzung für **eine** Bloodchief-Quest-Marke. Auch wiederholtes Goad über **Disrupt Decorum** sorgt dafür, dass gegnerische Kämpfe in verschiedenen Zügen Quest-Fortschritt liefern.

**Wichtig:** Liliana's Caress verursacht **Lebensverlust, keinen Schaden**. Das zählt für Ascension trotzdem. `Bloodchief Ascension` erhält **maximal eine Marke pro Endsegment** (ein einzelner Gegner muss im selben Zug wenigstens 2 Lebenspunkte verloren haben), keine Marke pro Discard.

### Nach drei Marken: Wheels werden zu Schadens- und Lebensgewinn-Zaubern

Wird eine gegnerische Karte **in den Friedhof** abgeworfen, während beide Verzauberungen liegen und Ascension drei Quest-Marken hat, lösen **beide** aus: Liliana's Caress lässt diesen Gegner 2 verlieren; Bloodchief Ascension lässt ihn **weitere 2** verlieren und uns **2 Leben gewinnen**, sofern wir die optionale Fähigkeit nutzen.

In einer Viererrunde mit drei Gegnern, die jeweils **fünf** Karten abwerfen, ergeben 15 tatsächliche Discard-Ereignisse bei beiden aktiven Verzauberungen **60 gegnerischen Lebensverlust in Summe** (20 je Gegner) und **30 Lebenspunkte Gewinn für uns**. Das ist **keine Infinite Combo**, sondern skaliert mit den real abgelegten Karten. Wenn Karten wegen eines Ersatzeffekts nicht in den gegnerischen Friedhof gelangen, kann Bloodchief für diese Karten nicht auslösen; Liliana's Caress triggert durch den Discard dennoch.

### Incendiary Command: Magars neuer Fünf-Mana-Megazauber

Vier mögliche Modi (man wählt bei jeder erfolgreichen Magar-Kopie zwei):

- 4 Schaden an Zielspieler oder Planeswalker – typischerweise **einen gegnerischen Spieler**, sodass er im aktuellen Zug mindestens 2 Leben verliert.
- 2 Schaden an **allen** Kreaturen – im Normalfall vermeiden, weil es beschädigte Magar-Puppen treffen kann.
- **Ein** Nichtstandardland zerstören – kein Massenlandzerstörungsplan; nur situative Antwort auf ein gefährliches Utility-Land.
- Jeder Spieler **wirft seine Hand ab** und zieht danach so viele Karten, wie er abgeworfen hat – bestes Zusammenspiel mit Ascension, Caress und Stinkweed Imp.

Mit `Stinkweed Imp` im Friedhof kann eines der tatsächlichen Kartenziehen durch **Dredge 5** ersetzt werden. Anders als `Cathartic Reunion` benötigt `Incendiary Command` **keine zusätzlichen Abwurfkosten beim Wirken**, eignet sich also viel besser für eine kostenlose Magar-Zauberkopie. Es kann regulär bereits für fünf Mana gespielt werden statt der neun von Rise.

**Timing:** Der Magar-Kampfschaden ist schon verteilt, wenn die Command-Kopie gewirkt wird. Deren 4 Schaden oder das Wheel helfen daher **nicht nachträglich gegen den Block**, wohl aber beim nächsten Angriff und bei Bloodchiefs Quest-Marken.

## Was ausdrücklich erhalten bleibt

- **`Disrupt Decorum`: unverhandelbar.** Goad hält fremde Kreaturen beschäftigt, verhindert viele Gegenangriffe und kann die Quest-Marken auch in gegnerischen Zügen aufbauen.
- **`Mirkwood Bats` ist weiterhin ausgeschlossen.** Keine neue teure Token-Drain-Nebenlinie.
- **`Mask of Memory`, `Key to the City`, `Key to the Side-Door`, `Prowler's Helm`, `Thieves' Tools`, `Whispersilk Cloak`, `Silver Shroud Costume`, `Dauthi Embrace`, `Traitor's Clutch`, `Embercleave`, `Conqueror's Flail`** und die Evasion-Länder bleiben.
- **`Breach the Multiverse`** millt in der Viererrunde zehn Karten pro Gegner und bringt je einen Kreaturen-/Planeswalker-Körper zurück. Mit aktiver Ascension und je zehn tatsächlich in gegnerischen Friedhöfen ankommenden Karten bis zu **60 Lebensgewinn** für uns.
- **`Blood for the Blood God!`, `Call Forth the Tempest`, `Brass's Bounty`, `In Garruk's Wake`, `Peer into the Abyss` und `Increasing Ambition`** bleiben erhalten.

## Alternative Kandidaten – bewusst nicht gleichzeitig geändert

| Karte | Grund | Zurückhaltung |
|---|---|---|
| [Waste Not](https://mtg.wtf/card/c16/117/Waste-Not) | {1}{B}: Verwandelt fremde Discards je nach Kartentyp in Zombies, Mana oder Kartenziehen. **Sehr starker nächster Value-Kandidat**, besonders mit nun drei Wheels. | Ohne Wheel oder gegnerischen Discard zunächst völlig wirkungslos; würde weitere Non-Engine-Slots beanspruchen. |
| [Syphon Mind](https://mtg.wtf/card/ons/172/Syphon-Mind) | Jeder Gegner wirft eine Karte ab, wir ziehen pro Discard eine Karte; mit beiden Verzauberungen zwei Lebensverlust-/Lifegain-Auslöser je echter gegnerischer Karte. | Vier Mana und nur **eine** gegnerische Karte pro Spieler; als Magar-Puppe eher moderater Effekt. |
| [Kederekt Parasite](https://mtg.wtf/card/con/48/Kederekt-Parasite) | {B} Kreatur, mit eigenem rotem Permanent verliert jeder Gegner bei jedem eigenen Kartenziehen 1 Leben; Wheels werden noch gefährlicher. | Verletzliche 1/1; nur zwei gesicherte Mass-Draw-Spells plus Command. |
| [Delirium Skeins](https://mtg.wtf/card/dis/41/Delirium-Skeins) | {2}{B}, jeder wirft 3 Karten ab; sehr großer Ascension-Caress-Effekt. | Ohne Bloodchief-/Caress-Engine auch eigener Kartennachteil und sehr oppressives Hand-Management. |
| [Syphon Soul](https://mtg.wtf/card/cns/127/Syphon-Soul) | {2}{B}: Zwei Schaden an jedem Gegner und Lebensgewinn entsprechend – direktes Quest-Setup, auch als Magar-Ziel. | Als Magar-Haymaker weniger wirkungsvoll als die neuen Engine-Zauber. |

## Formale Prüfung und Bracket

**100 Karten:** 1 Commander, 7 weitere Kreaturen, 19 Artefakte, **7 Verzauberungen**, **30 Spontanzauber/Hexereien**, 36 feste Länder. `Malakir Rebirth` ist als Instant gezählt, hat aber zusätzlich eine Landrückseite. `Traitor's Clutch` ist bei den Instants/Sorceries einsortiert.

**Drei unveränderte Game Changers:** `Demonic Tutor`, `Gamble`, `Jeska's Will`. `Liliana's Caress` und `Incendiary Command` sind Commander-legal und keine Game Changers. **Kein Mindcrank**: Mit aktivierter Ascension wäre das eine frühe Zweikarten-Infinite Combo, die nicht zum Bracket-3-Ziel passt. Keine beabsichtigten Extra-Combat-/Extra-Turn-Endlosschleifen oder Massenlandvernichtung.

**Offizielle Formatquelle:** [Commander und Game Changers](https://magic.wizards.com/en/formats/commander). **Kartentexte:** [Liliana's Caress](https://mtg.wtf/card/m11/103/Lilianas-Caress), [Incendiary Command](https://mtg.wtf/card/lrw/179/Incendiary-Command), [Bloodchief Ascension](https://mtg.wtf/card/zen/82/Bloodchief-Ascension).

Die GitHub-CI überprüft Struktur und Index-Links, **nicht** die komplette Oracle-Legalität aller 100 Karten oder reale Mehrspielersiege. Es werden keine Playtests/Winrates behauptet.
