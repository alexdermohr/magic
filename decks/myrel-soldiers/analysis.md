# Myrel, Shield of Argive — Die Armee von Argivia (Bracket 3)

**Stand:** 2026-10-17 · **Format:** Commander (100 Karten) · **Ziel:** Bracket 3 / Upgraded · **Farbidentität:** Weiß · **Archetyp:** Soldier-Typal / Token-Aggro.

## Deckaufbau und Datenprüfung

`current.txt` ist eine direkt importierbare Liste mit **100 Karten**:

- 1 Commander: Myrel, Shield of Argive
- 30 weitere Kreaturen
- 12 Artefakte, 9 Verzauberungen, 10 Spontanzauber, 1 Hexerei, 1 Planeswalker
- 36 Länder, davon 22 Standard-Ebenen (`Plains`)

**Live-Prüfung am 2026-10-17:** Alle 79 verschiedenen Kartennamen mit der Scryfall-Collection-API anhand ihres aktuellen Oracle-Datensatzes abgeglichen. Ergebnis: 79/79 gefunden, 79/79 Commander-legal, kein Farbidentitätsverstoß; genau drei als Game Changer markierte Karten. Die Anzahl aller physischen Deckkarten beträgt inklusive der 22 Ebenen genau 100. Der Deckinhalt wurde als GitHub-Datei zusätzlich zurückgelesen.

**Game Changer (genau 3):** `Smothering Tithe`, `Teferi's Protection`, `Enlightened Tutor`. Keine absichtlich eingebaute frühe Zweikarten-Endloskombination, keine Massenlandverwehrung und keine Extrazug-Schleife. Damit entspricht die Konstruktion den Bracket-3-Bauvorgaben; die tatsächliche Spielstärke und Siegrate wurden nicht in Partien gemessen.

## Warum Myrel?

Myrel ist selbst ein Soldat und gewinnt durch Angreifen immer mehr 1/1-Soldaten-Artefaktkreaturen. Der Auslöser zählt die beim Verrechnen **bereits kontrollierten Soldaten**, einschließlich Myrel. Die Spielsteine kommen dabei **nicht angreifend** ins Spiel und können erst in einer späteren Kampfphase selbst angreifen.

Im eigenen Zug verhindert Myrels statische Fähigkeit das Wirken gegnerischer Zaubersprüche sowie das Aktivieren gegnerischer Artefakt-, Kreaturen- und Verzauberungsfähigkeiten **auf dem Spielfeld**. Sie sperrt keine aktivierten Fähigkeiten von Ländern oder aus anderen Zonen; insbesondere ist sie im gegnerischen Zug ungeschützt.

Gegenüber Harbin, Vanguard Aviator (weiß-blau) priorisiert diese Liste den eingebauten Tokenmotor und die unmittelbare Soldaten-Identität. Gegenüber Caesar, Legion's Emperor (Mardu) verzichtet sie bewusst auf zusätzliche Farben und Aristocrats-Nebenthemen.

## Primäre Kartenpakete

| Paket | Schlüsselkarte und Funktion |
| --- | --- |
| Frühe Soldaten | `Recruitment Officer`, `Ballyrush Banneret`, `Valiant Veteran`, `Preeminent Captain`, `Brimaz, King of Oreskos` |
| Stamm-Boni | `Field Marshal`, `Daru Warchief`, `Captain of the Watch`, `Patchwork Banner`, `Herald's Horn` |
| Token-Multiplikation | `Anointed Procession`, `Mondrak, Glory Dominus`, `Ojer Taq, Deepest Foundation`, `Elspeth, Storm Slayer` |
| Angriffsdurchbruch | `Goldnight Commander`, `Cathars' Crusade`, `Mirror Entity`, `Odric, Master Tactician`, `Akroma's Will` |
| Ziehen | `Esper Sentinel`, `Mentor of the Meek`, `Skullclamp`, `Caretaker's Talent`, `Bennie Bracks, Zoologist`, `Tocasia's Welcome`, `Idol of Oblivion`, `Folk Hero` |
| Schutz | `Lightning Greaves`, `Swiftfoot Boots`, `Dolmen Gate`, `Reconnaissance`, `Flawless Maneuver`, `Clever Concealment`, `Teferi's Protection` |
| Mana | `Sol Ring`, `Arcane Signet`, `Mind Stone`, `Pearl Medallion`, `Archaeomancer's Map`, `Land Tax`, `Smothering Tithe`, `Nykthos, Shrine to Nyx`, `Three Tree City` |
| Interaktion | `Swords to Plowshares`, `Path to Exile`, `Stroke of Midnight`, `Generous Gift`, `Cathar Commando`, `Winds of Abandon` |

## Explosive, aber endliche Synergien

- **Myrel + Roaming Throne:** `Roaming Throne` bei Eintritt auf Soldier einstellen. Myrels Angriffs-Fähigkeit löst dann zweimal aus. Ohne Verluste und weitere Effekte wird aus N Soldaten nach der ersten Verrechnung 2N, nach der zweiten 4N. Die Zahl wird für jeden Auslöser separat bei dessen Verrechnung bestimmt.
- **Tokenverdoppler:** `Anointed Procession`, `Mondrak` und Elspeth verdoppeln die von Myrel erzeugte Menge; `Ojer Taq` verdreifacht sie. Mehrere Ersatzeffekte verstärken sich multiplikativ, aber erzeugen **keine Endlosschleife**.
- **Goldnight Commander:** Jeder ins Spiel kommende Spielstein löst einen weiteren +1/+1-Effekt für das gesamte Team aus, auch für die bereits deklarierten Angreifer.
- **Odric + viele Soldaten:** Mit Odric und mindestens drei weiteren deklarierten Angreifern bestimmst du gegnerische Blocks; die von Myrel erst danach erzeugten Spielsteine helfen beim Erreichen dieser vier Angreifer nicht rückwirkend.
- **Skullclamp:** Unverstärkte 1/1-Soldaten sterben durch -1 Widerstandskraft beim Ausrüsten und ziehen zwei Karten. Nach einem +1/+1-Lord bleiben sie häufig am Leben: `Skullclamp` ist in dieser Liste daher in frühen Spielphasen oder nach passendem Opfer effektiver.
- **Urza's Saga:** Sucht insbesondere `Skullclamp` oder `Sol Ring`; das Land wird nach Kapitel III geopfert. Bei knapper Starthand also nicht als dauerhaftes viertes Mana einplanen.

## Spielablauf

**Zug 1–3:** Mit 2–4 Länderquellen und frühem Mana bzw. Soldaten beginnen. `Land Tax` sichert Handkarten/Landdrops, spielt aber keine Länder direkt ins Spiel. `Stoneforge Mystic` findet `Skullclamp` oder eines der zwei schützenden Stiefel-Ausrüstungen. `Enlightened Tutor` sucht früh bei Bedarf `Sol Ring`, `Skullclamp`, `Anointed Procession` oder andere Artefakte/Verzauberungen.

**Zug 3–5:** Myrel möglichst mit Haste-Schutz ausrüsten und angreifen. `Reconnaissance` erlaubt Myrel nach dem Angriffs-Auslöser aus einem ungünstigen Kampf zu entfernen. Ohne Eile muss Myrel einen vollständigen Zugzyklus überstehen.

**Zug 5+:** Mit Token-Multiplikatoren, Lords und dem Kampfdurchbruch durch `Odric` oder `Akroma's Will` abschließen. `Clever Concealment` und `Teferi's Protection` schützen das aufgebaute Board auch gegen Exil-Bereinigung; `Flawless Maneuver` schützt dagegen nur vor Zerstörung.

## Reale Schwachstellen und spätere Prüfpunkte

- **Abhängigkeit von Myrel und Kampfschritten:** Wiederholtes Commander-Removal im gegnerischen Zug, Propaganda-Effekte und fehlendes Haste verzögern den Motor. Die Liste hat mit `Call the Coppercoats`, `Elspeth`, `Brimaz` und `Hero of Bladehold` zusätzliche Tokenquellen.
- **Breiter Spieltisch:** Gegen Massenvernichtung helfen Schutzzauber; nicht alle sind gegen Exil oder -X/-X wirksam. Mono-Weiß hat weniger Flexibilität bei Kartenziehen und Mana als Mehrfarben-Decks.
- **Manabasis:** 36 Länder sind defensiv gewählt, da Myrel auf vier Mana zuverlässig ins Spiel kommen soll. `Emeria, the Sky Ruin`, `Mistveil Plains` und `Windbrisk Heights` können getappt ins Spiel kommen. `Nykthos`, `Three Tree City`, `War Room`, `Urza's Saga` und `Hall of Heliod's Generosity` produzieren nicht ohne zusätzliche Bedingungen weißes Mana.
- **Keine automatische Ausweichfähigkeit:** Myrel erzeugt beim Angriff Soldaten, kann dabei aber gegen größere Blocker sterben. `Dolmen Gate` und `Reconnaissance` wurden bewusst statt zusätzlicher großer Pumpzauber gewählt.
- **Friedhöfe:** Gezielte Friedhofsinteraktion fehlt. Falls die Spielgruppe viel Reanimation spielt, ist `Soul-Guide Lantern` ein sinnvoller Austausch gegen eine langsamere Value-Karte.
- **Kein behaupteter Praxistest:** Zähl-, Oracle-, Farb- und Bracket-Prüfungen sind erfolgt; Mulligan- und Spielsituationen sowie Manakurve unter realen Gegnern sind bislang nicht getestet.

**Referenzen:** [Offizielle Commander-Regeln/Brackets](https://magic.wizards.com/en/formats/commander), [Wizards-Update Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026), [Scryfall](https://scryfall.com) und [importierbare Deckliste](current.txt).
