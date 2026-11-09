# Rin and Seri, Inseparable – Katzen-Engine / Bracket 3

Stand: 9. November 2026. **Aktive importierbare Liste:** [current.txt](current.txt); **weitere erwogene Karten:** [card-pool.md](card-pool.md). Budget: unbegrenzt. Ziel: oberer Rand des sozialen Commander-Brackets 3, nicht cEDH.

## Konzeptentscheidung

| Variante | Stärke | Schwäche | Urteil |
| --- | --- | --- | --- |
| A – Katzen-Tribal mit Hundeunterstützung | Solider Angriffsplan, viele Cast-Trigger | Lords skalieren Hunde kaum, wenig Nachschub | Unterlegen |
| B – reine Token-Multiplikation | Hohe Obergrenze für Purphoros/Rin | Zu viele teure Verdoppler, anfällig für Wipes | Unterlegen |
| C – Rekursions-/Kombodeck | Viele wiederholte Katzenzauber | Aluren + Whitemane Lion bietet sehr frühe Endlosschleife, damit am B3-Ziel vorbei | Nur bezahlte Rekursion übernehmen |
| **D – Hybrid-Aggro-Engine** | Früher Commander, Cat-Cast-Trigger, Tokens, Schaden ohne Angriff, vier Kampffinisher und Schutz | Benötigt korrekte Farben und mindestens einen Kreaturennachschub | **Gewählt** |

Das Deck setzt auf die **drei unterschiedlichen Ressourcen** (Kreaturenanzahl, Kartennachschub, Wiederholungsaktivierungen) statt einfach mehr Katzen-Lords anzuhäufen. Katzen sind gegenüber Hunden klar in der Mehrheit. Nicht-Cat/Dog-Kreaturen sind gezielte Mana-, Verdoppler-, Draw- und Schadensmaschinen.

## Aufbau

- **100 Karten:** 1 Commander, 34 weitere Kreaturen, 29 Nichtkreaturenzauber, 36 Länder.
- **Kreaturen einschließlich Commander:** 16 Katzen (Rin und Seri sind zugleich ein Hund), 5 reine Hunde, 4 Changelings, 10 weitere Synergiekreaturen.
- **Drei Token-Verdoppler:** Anointed Procession, Parallel Lives, Mondrak, Glory Dominus. Doubling Season ist als vierter teurer Verdoppler weniger effizient als die im Deck enthaltenen Interaktions- und Card-Advantage-Slots.
- **Genau drei Game Changer (Scryfall/Bracket-Liste):** Gaea's Cradle, Enlightened Tutor, Seedborn Muse. Insbesondere Teferi's Protection, Ancient Tomb, Worldly Tutor, Aura Shards, Jeska's Will oder Smothering Tithe würden dieses Limit überschreiten, solange nicht gezielt ausgetauscht.
- **Keine absichtliche schnelle Zweikarten-Endlosschleife**, keine Extrazugschleifen, keine Massenlandzerstörung.

## Regeltechnik – unbedingt beachten

1. Rin und Seri erzeugen Token nur durch **Wirken** von Katzen- und Hundezaubern, nicht durch ins Spiel gelegte oder kopierte Spielsteine. Die zwei Auslöser von Changeling-Zaubern sind unabhängig; Rin und Seri lösen nicht durch das eigene Wirken aus. Die Cast-Trigger erzeugen ihre Token **vor** dem Eintreten des auslösenden Kreaturenzaubers.
2. **Maskwood Nexus** verleiht eigenen Kreaturenzaubern bereits auf dem Stack *beide* Typen. Jeder eigene Kreaturenzauber erzeugt dadurch mit Rin und Seri einen Cat- und einen Dog-Token; auf dem Feld zählen alle eigenen Kreaturen gleichzeitig als Cats und Dogs. Deshalb berechnet Rin und Seri beim Aktivieren den Hundeschaden anhand der **gesamten** Kreaturenzahl. Für Fähigkeiten mit „nontoken Cat enters“ zählt das Betreten des Spielfelds, nicht das Wirken.
3. **Roaming Throne** (Typ Cat wählen) lässt ausgelöste Fähigkeiten von Rin und Seri und Arahbo zusätzlich auslösen. Er verdoppelt **nicht** die aktivierte {R}{G}{W}, {T}-Fähigkeit. Hierzu dient **Illusionist's Bracers**; deren Kopie darf ein neues Ziel wählen.
4. **Jinnie Fay** ersetzt Tokenarten, nicht deren Anzahl; Anointed Procession, Parallel Lives und Mondrak erhöhen zunächst per Ersatzeffekt die Anzahl. 3/1-Hunde erhöhen Rin und Seris Schaden **nicht stärker** als 1/1-Hunde: Für die Fähigkeit zählt nur die Anzahl! Jinnie verbessert hingegen Kampfdruck und Eile/Vigilanz.
5. **Arahbo, the First Fang** erzeugt nur bei **nontoken** Cats zusätzliche Cats, die wiederum Eintrittsfähigkeiten (Purphoros, Warleader's Call) auslösen. Der Token selbst löst Arahbo nicht erneut aus.
6. **Ocelot Pride** braucht Lebensgewinn **in diesem Zug** (z. B. per Rin-Aktivierung auf unserem Zug). Erst mit City's Blessing werden zusätzlich in diesem Zug erzeugte Token kopiert. Auch der zunächst von Ocelot erzeugte Cat-Token zählt als dieser Zug eingetreten.
7. **Cloudstone Curio** ist ausdrücklich eine **bezahlte** Rekursionsengine: Ein von Rin erzeugter Dog-Token kann eine bestehende nichtartefaktische Katze zurück auf die Hand nehmen. **Whitemane Lion** kann sich für {1}{W} selbst zurücknehmen, bleibt ohne zusätzliche kostenlose Casting-/Mana-Kombination aber endlich.
8. **Phelia** und **Felidar Guardian**-artige Blinks erzeugen keine Cat-/Dog-**Cast**-Trigger. Phelia kann allerdings ETB-Fähigkeiten von Regal Caracal oder Helpful Hunter erneut auslösen.
9. Seedborn Muse enttappt die eigenen bleibenden Karten während **jeder gegnerischen Enttapp-Phase**. Je Gegnerzug sind nach Bezahlung von {R}{G}{W} weitere Rin-Aktivierungen möglich; Illusionist's Bracers verdoppelt die Schadens-/Lebenseffekte. Keine dieser Interaktionen ist von sich aus unendlich.
10. Sind alle Ziele der Rin-und-Seri-Aktivierung bei Verrechnung illegal, wird die Fähigkeit neutralisiert; **auch der Lebensgewinn entfällt**.

## Win Conditions

- **Direkter Flächenschaden:** Purphoros, God of the Forge (2 pro eigenem Kreatureneintritt und Gegner), Warleader's Call und Impact Tremors. Token aus Katzen-Casts lösen diese Effekte aus, und die tatsächliche Katze beim Eintreten ebenfalls. Token-Verdoppler bzw. Maskwood Nexus steigern die Anzahl.
- **Wiederholte Kommanderaktivierung:** Tokenproduktion, Maskwood Nexus und Gaea's Cradle bauen Hundeanzahl und Mana auf; Seedborn Muse enttappt Rin und Seri in gegnerischen Zügen und Illusionist's Bracers kopiert die Fähigkeit. Ziele können auf verschiedene Gegner verteilt werden. Das aus der Liste entfernte Thousand-Year Elixir bleibt in [card-pool.md](card-pool.md) als mögliche Verstärkung notiert.
- **Breiter Kampfschaden:** Beastmaster Ascension belohnt einen Angriff von sieben Kreaturen sofort mit +5/+5 für alle eigenen Kreaturen; Jetmir, Nexus of Revels gibt bei neun Kreaturen Trampelschaden und Doppelschlag; Mirror Entity verwandelt überschüssiges Mana in ein tödliches Team; Akroma's Will kann Fliegen/Doppelschlag und Schutz geben; Finale of Devastation findet Jetmir und/oder ist bei X ≥ 10 ein globaler Abschluss.
- **Opfer als letzte Reichweite:** Goblin Bombardment wandelt Token in Direktschaden um, insbesondere als Reaktion auf Zerstörungs- oder Exil-Massenentfernung.

## Engine, Schutz und Interaktion

- **Tutor:** Enlightened Tutor sucht für {W} ein Artefakt oder eine Verzauberung und legt die Karte oben auf die Bibliothek (nicht auf die Hand). Ziele: Skullclamp, Maskwood Nexus, Beastmaster Ascension, Cloudstone Curio, Purphoros, God of the Forge oder Anointed Procession, abhängig vom Spielstand. Optimal am Ende des gegnerischen Zuges vor dem eigenen Kartenziehen. Er erhöht die Zuverlässigkeit, aber erzeugt für sich genommen keinen Kartenvorteil.
- **Nachschub:** Skullclamp (1/1-Tokens), Realmwalker (von oben spielen), Guardian Project (nontoken-ETB), Rite of Harmony (Tokens als Kartenzieher), Bennie Bracks (end-step-Draw), Toski (Kampftreffer), Helpful Hunter und Spirited Companion (ETB). **Caretaker's Talent** zieht bei Spielsteineintritten einmal pro Zug eine Karte, kann auf Stufe 2 einen eigenen Spielstein kopieren und verstärkt auf Stufe 3 alle Kreaturenspielsteine um +2/+2.
- **Bezahlte Rückführung:** Whitemane Lion, Fleetfoot Panther, Temur Sabertooth und Cloudstone Curio. Sie erhalten die Cast-Trigger am Laufen; Cloudstone lässt Token-Eintritte zu neuen Kreaturenzaubern werden.
- **Beschleunigung:** Birds of Paradise, Delighted Halfling, Bloom Tender, Utopia Sprawl, Sol Ring, Arcane Signet, Nature's Lore, Three Visits, Growing Rites of Itlimoc sowie Gaea's Cradle. Die fast ausschließlich ungetappten, gefetchten drei Farben sichern {R}{G}{W} sowohl beim Cast als auch beim Aktivieren.
- **Schutz:** Selfless Savior, Flawless Maneuver, Heroic Intervention, Clever Concealment und bedarfsweise Temur Sabertooth. Clever Concealment kann auch Kreaturenspielsteine phasen lassen und damit Exil-Boardwipes vermeiden.
- **Interaktion:** Swords to Plowshares, Path to Exile, Chaos Warp, Feline Sovereign, Qasali Slingers, Masked Vandal und Boseiju, Who Endures. **Qasali Slingers bleibt ausdrücklich wegen Reichweite (blockt Flieger) und wiederholbarer Artefakt-/Verzauberungsentfernung bei Katzen-Eintritten.** Auch Rin-und-Seri-Schaden trifft Kreaturen und Planeswalker.

## Wesentliche Ausschlüsse

- **Aluren** und die dadurch mit Whitemane Lion/Impact Tremors besonders frühe freie Rekursionsschleife: B3-unpassende schnelle Infinite-Option.
- **Doubling Season / Ojer Taq, Deepest Foundation:** weitere 5–6-Mana-Tokenverstärker würden die Kurve belasten und bringen weniger als Draw, Schutz und Interaktion.
- **Isamaru, Hound of Konda / reine Vanilla-Katzen:** reine Tribal-Masse ohne ETB, Draw, Schutz oder echte Manaeffizienz verdrängt stärkere Multifunktionskarten.
- **Felidar Sovereign:** eigener, leicht zu umgehender Upkeep-Sieg, aber keine Unterstützung für Cast-Engine oder direkten Board-Schaden.
- **Teferi's Protection** und weitere Spitzenmana-Artefakte: Game-Changer-Plätze sind anders belegt.

## Starthand- und Geschwindigkeitsanalyse

100.000 pseudozufällige Stichproben ohne Mulligans aus 99 Karten (ohne Commander), gezogen als sieben Startkarten plus Ziehschritte bis Zug 4:

| Kennzahl | Anteil |
| --- | ---: |
| Starthand mit 2–4 Ländern | 74,02 % |
| Starthand mit 0–1 Land (Mulligan-Kandidaten) | 20,12 % |
| Bis Zug 3 mindestens 3 Länder **und** eine günstige Ramp-Karte gesehen | 43,07 % |
| Bis Zug 4 mindestens 4 Länder oder mindestens 3 mit früher Ramp gesehen | 77,06 % |
| Bis Zug 4 mindestens einen Cat-/Dog-/Changeling-Spruch gesehen | 97,20 % |

**Wichtig:** Die beiden Zugkennzahlen sind **Obergrenzen/Proxys für verfügbares Rohmana**, keine tatsächlichen Quoten für einen farblich legalen Commander-Cast. Farbverfügbarkeit, Sequenz, getappte Länder, Mulligans, gegnerische Interaktion und Draw-Engines wurden nicht als ganze Magic-Partie simuliert. Beste Hand: 2–3 ungetappte farbige Länder, frühe Ramp, mindestens ein typisierter Kreaturenzauber und entweder Card Draw, Schutz oder ein Token-Payoff. Eine 1-Land-Hand nicht ohne gewichtigen Grund behalten. Üblicher Ablauf: Turn 1 Ramp oder Ocelot Pride, Turn 2 Farbfixierung, Turn 3–4 Rin und Seri, ab Turn 4–5 mehrere Synergiezauber, Turn 6+ Kampf- oder Direktschadensabschluss bei anhaltendem Aufbau.

## Risikoprofil und Endprüfung

- **Commander-Abhängigkeit:** Ohne Rin sinkt die Tokenproduktion, bleibt aber durch Ocelot Pride, Arahbo, Regal Caracal sowie andere Tokenmacher möglich; nicht alle Verdoppler blind vor Schutz/Draw priorisieren.
- **Mass Removal/Exil:** Schutzmana offenhalten und Clever Concealment gezielt einsetzen; nach einem Wipe zuerst Draw-Engine statt aller Verdoppler wiederlegen.
- **Zu wenig rote/weiße Manaquellen für Aktivierung:** Cavern of Souls färbt nur Kreaturenzauber; Secluded Courtyard kann dagegen die aktivierte Fähigkeit einer Cat bezahlen. Gaea's Cradle gibt nur Grün. Farbquellen sind bei der Mulliganwahl wichtiger als maximales Rohmana.
- **Token-Overcommitment:** Nicht über 9 Kreaturen hinausgehen, wenn Jetmir bereits tödlichen Schaden liefert und ein Boardwipe möglich ist.
- **B3-Spielabsprache:** Kein vorgezogener Sieg vor dem siebten Zug als Ziel, insbesondere keine frühe deterministische Zwei-Karten-Infinite.

**Erstprüfung des Decks am 5.11.2026 (vor dem Kartentausch):** 100 Karten, 99 verschiedene Kartenbezeichnungen (2× Forest), 36 Länder; **99/99 eindeutige Kartennamen durch Scryfall-Live-Oracle gefunden**, alle Commander-legal und innerhalb Rot/Grün/Weiß, exakt drei Scryfall-Game-Changer. Doppelseitige Ajani, Nacatl Pariah und Growing Rites of Itlimoc anhand der Vorderseiten überprüft. Repository-`scripts/validate_decks.py`: OK; Repository-Unittests: 70/70 OK. Der Strukturvalidator ersetzt keinen vollständigen regelbasierten Forge-Spieltest; für diese Version wurde **kein Forge-Ende-zu-Ende-Spiel** durchgeführt.

**Quellen:**
- [Wizards – Commander, Brackets und Game Changers](https://magic.wizards.com/en/formats/commander)
- [Wizards – Commander Brackets Beta Update, 21.10.2025](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025)
- [Wizards – Rin and Seri release notes](https://magic.wizards.com/en/news/feature/core-set-2021-and-jumpstart-release-notes-2020-06-20)
- [Scryfall – aktuell veröffentlichte Oracle-/Legalitätsdaten](https://scryfall.com)

**Änderung am 6.11.2026:** Thousand-Year Elixir → Caretaker's Talent. Elixir als spätere Option in [card-pool.md](card-pool.md) archiviert, Toski und Qasali Slingers unverändert. Die neue 100-Karten-Liste wurde am 6.11.2026 erneut mit Scryfall geprüft: 99/99 verschiedene Namen gefunden (einschließlich Doppelseiten), alle Commander-legal und Naya-farbidentitätskonform, weiterhin drei Game Changer (Seedborn Muse, Aura Shards und Gaea's Cradle). Der Strukturvalidator sowie 70/70 Repository-Unittests liefen erfolgreich; kein Forge-Partietest wurde durchgeführt.

**Änderung am 8.11.2026:** Qasali Pridemage wurde durch **Beastmaster Ascension** ersetzt. Artefakt-/Verzauberungsinteraktion bleibt mit Aura Shards, Qasali Slingers, Feline Sovereign, Masked Vandal, Boseiju und weiteren Antworten ausreichend vertreten. Der neue 3-Mana-Finisher wandelt eine breite Katzen-/Hunde-Spielsteinbasis bereits beim Angriff mit sieben Kreaturen in +5/+5 für die ganze Armee um; er benötigt weder eine Endlosschleife noch einen weiteren Game-Changer-Platz. Damit: unverändert drei Game Changer, weiterhin Bracket-3-Ziel. Qasali Pridemage bleibt als Wiedereinbau-Kandidat in [card-pool.md](card-pool.md) dokumentiert.

**Änderung am 9.11.2026:** **Aura Shards → Enlightened Tutor.** Ein Game Changer wird funktionsübergreifend ersetzt: Statt wiederholter Artefakt-/Verzauberungszerstörung bei jedem Kreatureneintritt erhält das Deck Zugriff auf die stärksten Artefakt- und Verzauberungs-Engines sowie Finisher. Gegen problematische Artefakte/Verzauberungen verbleiben Qasali Slingers, Feline Sovereign, Masked Vandal, Boseiju, Who Endures und Chaos Warp. Die **drei Game Changer** sind jetzt Gaea's Cradle, Seedborn Muse und Enlightened Tutor. Weiterhin 100 Karten und Bracket-3-Ziel. Aura Shards bleibt im [Kartenpool](card-pool.md) als Wiedereinbaukandidat für interaktionslastige Metas. Enlightened Tutor legt die gesuchte Karte nur oben auf die Bibliothek.
