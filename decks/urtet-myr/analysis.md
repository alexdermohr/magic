# Urtet, Remnant of Memnarch – Myr-Maschinenheer (Commander Bracket 3, v2)

Stand: 13.11.2026. Aktive Deckliste: [current.txt](current.txt). Budget unbegrenzt. Grundlage: die bereits in `main` integrierte Erstfassung aus PR #95. **Optimierung v2, ohne behauptete Testpartien.** Konkrete Alternativen und die Rückkehrmöglichkeiten für entfernte Karten stehen in [card-pool.md](card-pool.md).

## Grundidee und Zusammensetzung

Das Deck bleibt eine **Myr-Artefaktmaschine**, keine generische Fünffarben-Goodstuff-Liste. Für Myr-Zauber produziert Urtet zusätzliche Myr-Spielsteine. Mana-Myr, Tokens, kontrolliertes Enttappen und zuverlässiger Kartennachschub finanzieren seine WUBRG-Aktivierung. Der Sieg kommt über Angriffe, +1/+1-Marken oder die wenigen bewusst beibehaltenen mehrteiligen Artefaktkombinationen.

**100 Karten:** 1 Commander, **33 andere Kreaturen**, **14 weitere Artefakte**, **7 Verzauberungen**, **9 Spontanzauber/Hexereien** und **36 Länder**. In den 33 Kreaturen sind **19 gedruckte Myr**, dazu **zwei Changeling-Zauber** (`Mirror Entity` und `Universal Automaton`), die beim Wirken als Myr zählen. Zusammen **21 Myr-Zauber im Hauptdeck**. `Metallic Mimic` ist erst **auf dem Spielfeld** ein Myr, falls Myr gewählt wird; sein Wirken löst Urtet noch nicht aus.

## Warum die Maschine funktioniert

- **Urtet**: Manakosten {3}, **Farbidentität WUBRG** durch den Kartentext. Nur **gewirkte** Myr-Zauber erzeugen durch Urtet einen zusätzlichen 1/1-Myr-Spielstein; ein von Myr Turbine oder anderen Effekten ins Spiel gelegter Myr tut das nicht. Zu Beginn des Kampfes im eigenen Zug enttappt Urtet alle eigenen Myr. Für {W}{U}{B}{R}{G} plus Tappen legt Urtet je drei +1/+1-Marken auf **jeden** eigenen Myr; nur im eigenen Zug aktivierbar.
- **Tempo und Farbversorgung**: Die sechs farbgebenden Mana-Myr, Myr Convert, Alloy Myr und Palladium Myr beschleunigen das frühe Spiel. `Springleaf Drum` kann auch einen **gerade erzeugten Myr-Spielstein** für eine beliebige Farbe tappen: Die Tappkosten gehören der Drum, nicht dem summoning-sick Token. `Cryptolith Rite` erlaubt eigene Tapp-Fähigkeiten erst mit nicht einsatzverzögerten Kreaturen. `Smothering Tithe` liefert bei ausbleibender Gegnerzahlung Schätze in allen Farben, von Doubling Season verdoppelt; die Schätze zählen zugleich als Artefakte für Affinity/Metalcraft/Clock.
- **Urtet sofort und mehrfach einsetzen**: `Thousand-Year Elixir` erlaubt, Urtets aktivierte Fähigkeit trotz Einsatzverzögerung zu nutzen. Für {1} und Tappen enttappt es eine Kreatur zusätzlich. Unabhängig davon enttappt Urtet die Myr am Beginn des Kampfes. Jede weitere Markenaktivierung benötigt **erneut WUBRG**. Elixir ist keine kostenlose Aktivierung und gibt den Myr keine Eile zum Angreifen.
- **Kosten reduzieren / Artefakte ausschöpfen**: `Urza's Incubator`, `Foundry Inspector` und `Etherium Sculptor` senken Myr-/Artefaktkosten. `Urza, Lord High Artificer` lässt beliebige ungetappte Artefakte für {U} tappen; dafür dürfen sogar frische Myr-Tokens dienen, weil die Fähigkeit zu Urza gehört. `Mox Opal` benötigt Metalcraft, `Urza's Saga` kann unter anderem `Springleaf Drum`, `Sol Ring`, `Skullclamp`, `Mox Opal` und `Universal Automaton` finden.
- **Bessere Spielsteine und Zähler**: `Metallic Mimic` auf Myr wählen; **andere** Myr kommen dann mit einer +1/+1-Marke ins Spiel – auch Urtets Spielsteine. `Cathars' Crusade` legt bei jedem Kreatureneintritt eine Marke auf jede eigene Kreatur: Ein gewirkter Myr löst mit Urtet typischerweise **zwei getrennte Eintritte** aus. `Doubling Season` verdoppelt sowohl eigene Tokens als auch gelegte Marken; `Steel Overseer` legt weitere Marken auf Artefaktkreaturen. `Roaming Throne` auf Myr verdoppelt Urtets **Cast-Trigger**; Roaming Throne ist beim eigenen Wirken noch kein Myr-Zauber.
- **Kartennachschub**: `Idol of Oblivion` zieht gegen {T} eine Karte, wenn im jeweiligen Zug ein Token erzeugt wurde; also normalerweise bei Urtets Myr-Cast-Engine. `Kindred Discovery` (Myr), `Jhoira, Weatherlight Captain`, `Thought Monitor`, `Mystic Forge`, `Esper Sentinel` und `Emry` ergänzen dies. `Skullclamp` zieht durch 1/1-Tokens schnell Karten, **aber** Tokens mit Marken oder +1/+1-Anthems sterben durch Anlegen nicht mehr automatisch. Erst klemmen, danach aufblasen.
- **Myr-Suche und Wiederaufbau**: `Myr Kinsmith` findet Myr-Karten auf die Hand; `Myr Turbine` legt unter ihren Voraussetzungen ein Myr direkt ins Spiel, ohne Urtets Cast-Trigger. `Myr Retriever`, `Emry` und `Academy Ruins` holen Artefakte zurück. `Unwinding Clock` enttappt Artefakte bei gegnerischen Enttappsegmenten, aber Urtets Markenaktivierung darf trotzdem nur **im eigenen Zug** benutzt werden.

## Siegbedingungen

1. **Myr-Angriff** (erste Wahl): Mit `Shared Animosity` erhalten gleichzeitig angreifende Myr pro **anderem angreifenden Myr** +1/+0; ein Angriff mit acht Myr bedeutet für jeden davon typischerweise +7/+0. `Akroma's Will` gibt bei kontrolliertem Commander u. a. Flugfähigkeit, Wachsamkeit und Doppelschlag für den Abschluss. Urtets Marken und `Cathars' Crusade` machen denselben Kampfplan ohne Animosity gefährlich. `Myr Battlesphere` liefert zusätzlichen Schaden und vier Myr-Tokens beim Eintritt.
2. **Simic Ascendancy**: Legt Urtet je drei +1/+1-Marken auf mindestens sieben Myr, entstehen durch die separaten Auslöser der Ascendancy insgesamt mindestens 21 Wachstumsmarken (ohne gegnerische Eingriffe). Die Siegbedingung wird **erst zu Beginn des eigenen Versorgungssegments** geprüft; Gegner können vorher reagieren. `Metallic Mimic` und `Cathars' Crusade` beschleunigen den Markenaufbau, `Doubling Season` die Verteilung.
3. **Myr-Engines mit großer Reichweite**: `Clock of Omens` zusammen mit `Myr Galvanizer`, `Palladium Myr` und weiteren tappbaren Myr-Artefakten erlaubt Schleifen mit beliebig viel farblosem Mana; je nach vorhandenem Mana-Myr auch farbiges. Zusammen mit `Myr Turbine` und `Mondrak, Glory Dominus` oder `Doubling Season` erzeugt Clock unter den passenden Startbedingungen beliebig viele Myr-Tokens. Diese können **nicht allein dadurch im selben Zug angreifen**, sondern brauchen noch einen weiteren Abschluss oder einen späteren Angriff.
4. **Ausweichweg gegen blockierte Bodenangriffe**: `Plague Myr` kann mit den Urtet-Marken durch Infizieren individuell bedrohlich werden. Das ist eine Nebenoption, nicht der Hauptplan; sie verlangt Angriffsfenster und ist keine automatische Poison-Kombination.

`Mechanized Production` (seltener Upkeep-Alternativsieg), `Mirrodin Besieged` (langsame Token-/Friedhofsachse) und `Lux Artillery` (erst nach genügend Marken, dann zehn Schaden pro Endsegment) wurden zugunsten schnellerer, weniger voneinander isolierter Engines entfernt.

### Vorhandene Mehrkarten-Endlosschleifen und Bracket-Absicht

- **Clock of Omens + Myr Galvanizer + Palladium Myr** mit weiteren geeigneten Myr-Artefakten: Mana-/Enttapp-Schleife. Die Hilfs-Artefakte und der bereits nutzbare Tapzustand zählen mit; das ist nicht allein mit exakt drei Karten auf leerem Feld garantiert.
- **Clock of Omens + Myr Turbine + Mondrak/Doubling Season**: neue Token bezahlen als zwei Artefakte das Enttappen der Turbine durch Clock. Die Tokenanzahl lässt sich wiederholt verdoppeln/vergrößern. Urtet selbst wird für diese Turbine-Schleife nicht benötigt.

Die Liste enthält **keine bewusst eingebauten frühen Zweikarten-Endloskombinationen**, keine Extrazug- und keine Massenlandzerstörungs-Engine. Diese Mehrkartenkombinationen sind ausdrücklich vor Partiebeginn zu erwähnen. Falls sie regelmäßig in den ersten sechs Zügen gewinnen, wäre die Bracket-3-Spielabsicht zu überprüfen. Drei Game Changers garantieren **nicht** von selbst ein Bracket 3.

## Optimierungsentscheidung v1 → v2: 10 Tausche

| Entfernt | Neu | Warum |
| --- | --- | --- |
| Hovermyr | **Myr Moonvessel** | 1-Mana-Myr statt rein defensivem 2-Mana-Körper, früherer Cast-Trigger und Skullclamp-Material |
| Myr Superion | **Universal Automaton** | Uneingeschränkt wirkbarer 1-Mana-Changeling statt 5/6 mit einschränkender Manaquelle; Myr-Cast-Trigger und Saga-Tutorziel |
| Myr Propagator | **Metallic Mimic** | Günstigere, sofort relevante Myr-Markenmaschine statt langsamer {3}+Tap-Kopien |
| Myr Welder | **Dispatch** | Ein-Mana-Kreaturenantwort mit Metalcraft statt situativer Friedhof-Imprint-Myr |
| Myr Matrix | **Thousand-Year Elixir** | Urtet-Aktivierung am Eintrittstag und zusätzliches Enttappen statt teurem {5}-Tokenmotor |
| Timeless Lotus | **Smothering Tithe** | Dritter Game Changer: mehrfarbige Treasure-Ressourcen, Artefaktsynergie, bereits ab vier Mana |
| Mirrodin Besieged | **Cathars' Crusade** | Verstärkt die tatsächliche Myr-Token-Engine drastisch statt langsamer Nebenstrategie |
| Lux Artillery | **Shared Animosity** | Dreimana-Kampffinish statt bedingtem und langsamem Zehn-Schaden-Trigger |
| Mechanized Production | **Idol of Oblivion** | Frühzeitiger, wiederholbarer Kartennachschub statt fragiler alternativer Upkeep-Siegbedingung |
| Herald's Horn | **Springleaf Drum** | Sofortige günstige WUBRG-Fixierung und Saga-Tutorziel statt langsamer Tribal-Rabatte/Topdeck-Chance |

**Konkrete Trade-offs:** Die 21 Myr-Zauber sind etwas weniger als vorher; dafür kosten die schwachen Myr-Körper weniger und die Payoffs treffen häufiger. `Cathars' Crusade` erzeugt bei großen Tokenmengen viele Einzeltrigger und ist in Manabrew/iPad gesondert auf Bedienbarkeit zu testen. `Skullclamp` wird mit `Metallic Mimic` und Crusade situativer. Gegner können `Smothering Tithe` mit {2} pro Karte begrenzen. Zusätzliche direkte Antworten bleiben ein möglicher nächster Schritt bei Removal-starkem Metagame.

## Spielplan

- **Züge 1–3:** Zwei bis drei Länder, günstige Mana-Myr, Sol Ring/Arcane Signet/Mox Opal oder Springleaf Drum. Urtet möglichst früh legen und danach Myr wirken, damit Cast-Trigger entstehen. Ein 1-Mana-Myr ist nach Urtet praktisch oft zwei Körper für ein Mana.
- **Züge 3–5:** Über Urtet, Myr-Galvanizer, Metallic Mimic, Roaming Throne und Kartennachschub eine breite Armee etablieren. Elixir ermöglicht Urtets Markenaktivierung schon im Eintrittszug, wenn WUBRG vorhanden ist. `Idol of Oblivion` und `Skullclamp` gegen früh leere Hände nutzen. `Smothering Tithe` nur so früh einsetzen, wie sie die Myr-Entwicklung nicht gefährlich verzögert.
- **Züge 5–7:** Urtets Marken plus Shared Animosity oder Akroma's Will abschließen. Alternativ Simic Ascendancy mit Marken in die nächste eigene Upkeep bringen. Gegen einen starken gegnerischen Tisch `Organic Extinction` mit Improvisieren selektiv einsetzen; eigene **nichtartefaktische** Kreaturen wie Mondrak sind dabei nicht geschützt.
- **Langspiel:** Emry/Myr Retriever/Academy Ruins rekurrieren Artefakte, Kindred Discovery/Jhoira/Forge ziehen Karten, Clock of Omens und Unwinding Clock verwerten viele Artefakte. Nicht blind mehrere ungeschützte Engines in offenen Massen-Artefakthass legen.

## Bracket, Rechts- und Teststand

**Genau drei Game Changers:** `Enlightened Tutor`, `Teferi's Protection`, **`Smothering Tithe`**. `Urza, Lord High Artificer` zählt seit der Wizards-Änderung vom **21.10.2025** nicht dazu; `Mox Opal` ebenfalls nicht. Die zuvor freie dritte Position ist nun belegt. Die neuen Karten sind im Commander-Format legal und liegen innerhalb von Urtets WUBRG-Farbidentität.

Der 100er-Zähl-, Singleton- und lokale Repo-Check ist gesondert dokumentiert und wird im PR durch `validate-decks` kontrolliert. Das ist **kein Beweis** für Oracle-/Farbidentitäts-Komplettprüfung oder bewährte Spielstärke. Noch **keine** echten Multiplayer-Partien und keine Manabrew-iPad-End-to-End-Probe. Die stärkere Token-/Triggerlast ist bis zum echten Test ein explizites Risiko.

### Quellen

- Offizielle Commander-Regeln, Brackets und Game Changers: https://magic.wizards.com/en/formats/commander
- Entfernung von Urza aus Game Changers: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- Urtet-Oracle und Legalität: https://mtg.wtf/card/onc/42/Urtet-Remnant-of-Memnarch
- Springleaf Drum / neue Token als Tap-Kosten: https://mtg.wtf/card/ecl/260/Springleaf-Drum
- Metallic Mimic: https://www.mtg.wtf/card/fdc/269/Metallic-Mimic
- Cathars' Crusade: https://www.mtg.wtf/card/c16/61/Cathars-Crusade
- Smothering Tithe: https://mtg.wtf/card/cmm/57/Smothering-Tithe
- Shared Animosity: https://mtg.wtf/card/lcc/231/Shared-Animosity
- Idol of Oblivion: https://mtg.wtf/card/tdc/319/Idol-of-Oblivion
- Myr-Engine-Vergleich und Kombinationsbelege: https://edhrec.com/commanders/urtet-remnant-of-memnarch/optimized/control/combos
- Deck-Konventionen: [../README.md](../README.md)
