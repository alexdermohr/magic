# Die Liga der Superhelden — Captain America, Team Leader (Bracket 3, v3)

**Stand:** 17.10.2026. **Format:** Commander, Jeskai (W/U/R). **Aktuelles Deck:** [current.txt](current.txt).
**Konvention:** genau eine aktive Bracket-3-Liste in `current.txt`. V1 und V2 bleiben im Git-Verlauf erhalten (v2-Commit: `82dba8b`).

## Konzept und nachgeprüfte Struktur

**Captain America, Team Leader** löst für *jeden anderen Hero*, der unter unserer Kontrolle ins Spiel kommt, aus: Der eintretende Hero erhält +1/+1-Marke sowie Eile und Wachsamkeit bis Zugende; Captain America erhält ebenfalls eine +1/+1-Marke. Das Deck setzt diesen schnellen Markenaufbau in Karten, Mana und tödlichen Kampfschaden um.

- **100 Karten, 99 verschiedene Namen**; einziges Mehrfachexemplar: **2 Plains**.
- **38 Kreaturen einschließlich Commander:** **33 gedruckte Hero-Kreaturen**. Fünf absichtliche Nicht-Hero-Kreaturen: Jarvis, Metallic Mimic, Roaming Throne, Danny Pink und Herald of Secret Streams. Metallic Mimic und Roaming Throne bekommen beim gewählten Typ `Hero` selbst den Typ Hero.
- **26 Nichtkreaturzauber, 36 Länder**, davon 32 Nichtstandardländer, 2 Plains, 1 Island, 1 Mountain.
- **Nichtland-Mana-Durchschnitt: 3,109** (v2: 3,125); **10 Zauber mit Manawert ab 5**; **8 Heroes für 1 oder 2 Mana**.
- **Genau 3 Game Changer**, frisch anhand Scryfall `game_changer` geprüft: **Rhystic Study**, **Smothering Tithe**, **Teferi's Protection**.

## Wichtigste Synergien und Spielplan

1. **Turn 1–3:** Quicksilver, Brash Blur und Kid Loki ermöglichen frühe Hero-Präsenz. Sol Ring, Arcane Signet und die drei Talismane unterstützen den Jeskai-Commander ab Zug 3. Bei schlechten Farben nicht automatisch eine starke Hand behalten; Commander braucht **{U}{R}{W}**.
2. **Hero-Schwarm:** Agent Phil Coulson verteilt +1/+1-Marken an andere Heroes; Metallic Mimic erhöht die Marken auf eintretenden Heroes. Director Nick Fury reduziert Hero-Zauberkosten und findet bei Angriffen weitere Heroes; Urza's Incubator reduziert deren generische Kosten um zwei.
3. **Karten und Mana:** Jarvis zieht bei **gewirkten** Hero-Zaubern. Danny Pink kann jede Kreatur, auf die erstmals im Zug Marken gelegt werden, je eine Karte ziehen lassen (also Captain America trotz mehrfacher Marken maximal einmal je Zug). King T'Challa zieht eine Karte, wenn ein Spieler seine zweite Karte **dieses Zuges** zieht. Relic of Legends erlaubt es, ungetappte legendäre Kreaturen für Mana zu tappen, selbst wenn sie gerade erst eingetreten sind. Captain America, Living Legend kann eine Kreatur beim **ersten Tappen pro Zug** wieder enttappen; das ist kein unendlicher Loop.
4. **Trigger-Kopien:** Echo, Perceptive Prodigy kann für {1} und Tappen eine eigene Nichtmana-Fähigkeit einer **Kreaturenquelle** auf dem Stapel kopieren — z. B. Captain Americas ETB-Auslöser, Hawkeyes Hero-Schaden oder Captain America, Skybounds Angriffs-Fähigkeit. **Cathars' Crusade** ist eine Verzauberung und keine gültige Kreaturenquelle für Echo. Roaming Throne verdoppelt ausgelöste Fähigkeiten entsprechend gewählter Heroes, nicht pauschal die der Verzauberungen.
5. **Markenexplosion:** Cathars' Crusade legt bei **jedem Kreatureneintritt** auf alle eigenen Kreaturen +1/+1-Marken. Mit mehreren Hero-Token aus Champions from Beyond entstehen mehrere Crusade-Auslöser; gleichzeitig lösen die echten Hero-Eintritte Captain America und Hawkeye, Trick Shot aus. Die Vorgänge sind endlich, aber potenziell sehr aufwendig nachzuhalten. Kid Loki gibt frisch markierten Kreaturen bis Zugende Hexproof.
6. **Kampfende:** Herald of Secret Streams macht Kreaturen mit +1/+1-Marken unblockbar; Wraith, Vicious Vigilante besitzt zusätzlich selbst Unblockbarkeit und Doppelschlag. Captain America, Skybound verteilt im Dreier-Angriff an **alle Angreifer** Marken und Indestructible, einschließlich Nicht-Hero-Angreifer. War Machine gibt anderen modifizierten Angreifern Doppelschlag; Shared Animosity und Akroma's Will ermöglichen die großen Team-Angriffe. Wraith kann als modifizierter Doppelschläger die Kampfschaden-Auslöser von Araña und SP//dr jeweils in beiden Schadenssegmenten auslösen.

## V2 → V3: sieben geprüfte Kartentausche

| Heraus | Hinein | Besserer Einsatzzweck / bewusster Verlust |
| --- | --- | --- |
| Falcon and Redwing | **King T'Challa** | Flash-Hero für wiederkehrenden Kartennachschub bei zweiter Karte eines Spielers; Bird-Token-Produktion entfällt (Birds waren selbst keine Heroes). |
| Jocasta, Automaton Avenger | **Captain America, Skybound** | Jeder breite Angriff legt Marken auf das gesamte angreifende Team und schützt es vor Zerstörung; dafür zwei Mana teurer und keine Friedhof-Selbstrückkehr. |
| She-Hulk, Wallbreaker | **Echo, Perceptive Prodigy** | 6 → 3 Mana, kopiert Schlüssel-Fähigkeiten von Creatures und kann mit Living Legend wiederholt tappen; Team-Trampelschaden entfällt. |
| Photon, Mighty Marvel | **Wraith, Vicious Vigilante** | 4 → 3 Mana, unblockbarer Doppelschlag setzt Captain-Marken sofort in Schaden um; zusätzliche Mana-Erzeugung durch Photons Kampfschaden entfällt. |
| Damning Verdict | **Cathars' Crusade** | Gleiches Mana, massiver Markenaufbau und zusätzliche Danny-/Kid-Loki-Synergien; ein **selektiver Kreaturen-Wrath entfällt**. Raise the Palisade bleibt der breite Bounce-Effekt. |
| Fellwar Stone | **Relic of Legends** | 2 → 3 Mana, höhere Mana-Produktion mit vielen legendären Heroes und Living Legend; der Mana-Rock kann nicht mehr schon in Zug 2 gespielt werden. |
| Arcane Denial | **Mana Drain** | Gegenzauber ohne geschenkte zwei Karten für den Gegner, Mana im **nächsten eigenen Hauptsegment**; benötigt **{U}{U}** statt {1}{U}, und unsere potenziellen Black-Widow-/King-T'Challa-Trigger durch gegnerische Zieheffekte entfallen. |

**Entscheidung bei den drei Game Changern:** Rhystic Study und Smothering Tithe bleiben als starke Quellen für Karten und Mana, Teferi's Protection als Schutz des entwickelten Spielfelds. Andere Game Changer wie Cyclonic Rift oder Fierce Guardianship wären nur **im Austausch**, nicht zusätzlich, vertretbar. Es gibt keinen zwingend stärkeren Ersatz für diese Rollen innerhalb des festgelegten Hero-Plans.

## Regelhinweise und Gegenargumente

- **King T'Challa** wird im Import als Vorderseitenname geführt: Scryfall erkennt `King T'Challa` und gibt die Oracle-Karte `King T'Challa // Black Panther, Hope Enduring` zurück. Sein Transformieren ist für den Hauptplan nicht erforderlich.
- **Echo** kann eine ausgelöste Fähigkeit nur kopieren, solange sie auf dem Stapel liegt, und kopiert keine Verzauberungs-/Artefakt-Fähigkeit. Ihre eigene Eile stammt bei Hero-Eintritt vom verrechneten Captain-America-Trigger, nicht automatisch bereits vor dessen Verrechnung.
- **Cathars' Crusade** ist fünf Mana und zweifach weiß, erzeugt keine sofortigen Karten und kann bei mehreren simultanen Token-ETBs sehr viel Markennachhalten verursachen. Gegen Boardwipes ist der Verlust von Damning Verdict besonders relevant.
- **Relic of Legends** kann legendäre Kreaturen für Mana tappen, nicht beliebige Heroes. Relics Nutzen ist im entwickelten Spielfeld groß, aber schlechter als Fellwar Stone beim frühen Farbfixing. Eine gehaltvolle Gegenposition wäre, bei häufigem Color Screw **Fellwar Stone** zurückzunehmen.
- **Captain America, Skybound** kostet {3}{W}{W}, also kein Turn-3-Schutz. Sein Battalion-Auslöser erfordert den Angriff mit ihm selbst und mindestens zwei weiteren Kreaturen. Ohne Angreifer oder unmittelbar gegen Wraths außerhalb der Kampfphase leistet Unbowed beziehungsweise Teferi's Protection mehr.
- **Raise the Palisade** kann mit `Hero` als gewähltem Typ auch Jarvis, Danny Pink und Herald of Secret Streams zurück auf die Hand schicken, wenn sie durch kein anderes Mittel den Typ Hero haben. Das eröffnet gelegentlich weitere ETB-Triggers, kostet aber Tempo.
- **Keine bekannten beabsichtigten Zwei-Karten-Endlosschleifen in den ersten sechs Zügen**, kein Extra-Turn-Loop und keine Mass-Landzerstörung. Ein vollständiger externer Kombodatenbank-Audit wurde **nicht** durchgeführt.

## Erweiterter Kreis — bewusst nicht aufgenommen

- **The Ozolith:** schützt angesammelte Marken nach Verlust einzelner Kreaturen, aber liefert ohne vorhandene Marken und Kreaturen wenig Tempo; als Meta-Wechsel gegen viele Wipes interessant.
- **Lae'zel, Vlaakith's Champion:** beschleunigt Marken um eins pro Ereignis; dafür Nicht-Hero-Kreatur ohne eigene Karten- oder Angriffsressource. Cathars' Crusade skaliert in diesem breiten Deck stärker, braucht aber mehr Mana.
- **Cosmic Cube:** kann nach Angriff aus sechs obersten Karten einen passend teuren Zauber umsonst spielen. Avengers Quinjet macht dagegen beim eigenen ETB **unmittelbar** eine Hero-Kreatur aus der Hand spielbereit und hält die Hero-/Lore-Rolle; Quinjet bleibt.
- **Three Tree City:** erzeugt später Mana nach Zahl der Heroes, ist anfangs eine farblose Quelle und senkt die Sicherheit eines pünktlichen Jeskai-Commanders.
- **Damning Verdict / Fellwar Stone / Arcane Denial:** sind keine schlechten Karten; gezielt zurücktauschen, wenn die Spielumgebung mehr Massremoval, Turn-2-Mana oder verlässlichere einfach-blaue Interaktion verlangt.

## Nachprüfung (17.10.2026)

Live-Abgleich gegen **Scryfall `/cards/collection`** für alle Karten aus v2 und v3: **75 + 31 = 106 gefundene Oracle-Karten** in zwei API-Chargen, keine nicht gefundenen Namen nach Normalisierung der Vorderseite von King T'Challa, keine Commander-Bans, keine Farbidentitäten außerhalb W/U/R. Die volle v3-Liste enthält **100 Karten, 99 eindeutige Namen, 38 Kreaturen, 33 Heroes, 26 weitere Zauber, 36 Länder**, genau **drei Game Changer**. Der Nichtland-Mana-Durchschnitt wurde aus aktuellen Oracle-Manawerten berechnet: **3,109375** (v2: **3,125**).

**Nicht verifiziert:** verbesserte Siegquote, Mulligan-/Matchup-Werte oder echte Manabrew-Partien. Die behauptete höhere Spielstärke ist eine begründete Synergie- und Tempobewertung, kein statistischer Messwert.

## Quellen

- [Wizards – Commander-Format und Brackets](https://magic.wizards.com/en/formats/commander)
- [Wizards – Game-Changer-Update Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026)
- [Scryfall – Kartentexte und Legalität](https://scryfall.com/)
- [EDHREC – Captain America, Team Leader / Upgraded Heroes](https://edhrec.com/commanders/captain-america-team-leader/upgraded/heroes) (niedrige Stichprobe; Anregung, kein Spielstärkenbeweis)
