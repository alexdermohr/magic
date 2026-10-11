# Manabrew-Funktionsprüfung – Mishra, Eminent One (Bracket 3)

**Stand:** 11.10.2026 · **Eingangsrevision früherer A–C-Tests:** [`52899aa`](https://github.com/alexdermohr/magic/commit/52899aa979e11b8365fff0a90af5e297a0061f31) · **jetzt maßgebliche aktive Liste:** [current.txt](current.txt). Aktive neue Karten: Thousand-Year Elixir, Mephitic Draught, Tezzeret, Master of the Bridge sowie Game Changer Mana Vault und Bolas's Citadel. Nicht aktive frühere Karten: Thought Monitor, Chromatic Lantern, Reckless Fireweaver, Rhystic Study und Cyclonic Rift.

## Evidenzstatus – ausdrücklich keine bestandenen Kartentests

| Ebene | Status | Beobachtung / Grenze |
|---|---|---|
| GitHub-Liste und Dokumentenkonsistenz | **Geprüft** | `current.txt`: 100 verschiedene Namen; `replaceability.md`: dieselben 100; `erweiterter-kreis.md`: 135 andere Namen, keine Überschneidung (11.10.2026). |
| Manabrew-Webclient | **Oberfläche erreichbar** | `https://play.manabrew.app` wurde in einer isolierten Chrome-Sitzung geladen; Startseite bot `Build / Import` und `Play Offline` an. |
| Import des konkreten Decks | **Nicht durchgeführt** | Der eingesetzte semantische Browserzugriff gestattete keinen belastbaren Eingabe-/Import- und Spielablauf. Navigations-/Aktivierungsversuche an dynamischen Elementen scheiterten an Snapshot-/Element-Vertragsgrenzen. |
| Nautiloid Ship, Arcum Dagsson, Crossover-Karten | **Keine erfolgreiche Spielsitzung; ungetestet** | Kein konkreter Boardstate wurde in Manabrew erzeugt. Insbesondere keine Exil-Objektzuordnung und keine Tutor-Auflösung praktisch verifiziert. |
| Kartentexte und Papierregeln | **Regelbasiert beurteilt, nicht engine-getestet** | Primärregeln siehe Quellen unten. Erwartetes Verhalten ist eine Test-Oracle, kein Nachweis der Implementierung. |

**Achtung:** Ein grünes/fehlendes `unsupported`-Abzeichen im Manabrew-Editor allein belegt keine korrekte Interaktion. Beide verfügbaren Engines (soweit in der Installation angeboten) gesondert protokollieren.

## Testvorbereitung

1. In Manabrew **Build / Import** öffnen und [current.txt](current.txt) unverändert als Commander-Deck importieren. Anzahl 100, Kommandeur und mögliche `unsupported`-/Bracket-Hinweise protokollieren. Nur eine lokale Testkopie verwenden.
2. **Play Offline** öffnen, Commander auswählen, Engine/Version ausdrücklich notieren (Manabrew-eigene Engine und gegebenenfalls Forge separat); gegnerisches Testdeck mit Kreaturen im Friedhof und möglichst wenig Störeffekten benutzen.
3. Für jeden folgenden Fall den **benötigten Boardstate** herbeiführen. Falls die Oberfläche keinen Zustandseditor bietet, normal spielen und die erforderlichen Karten auf regulärem Weg ziehen/ausspielen; dann Auslöser, Ziele, Stack, Exilzonen und Spiel-Log erfassen. Eine bloß gedachte Sequenz als `nicht ausgeführt` markieren.
4. Testbogen je Fall: **Build/Engine | Testdeck | Vorzustand | genaue Klickfolge | Stack/Log | Nachzustand | PASS/FAIL/BLOCKED | Beleg**. `PASS` nur nach tatsächlicher Beobachtung vergeben.

## A – Nautiloid Ship: gebundene Exilkarten und Kampf

**Vorzustand:** Mishra, Eminent One auf eigener Seite; **Nautiloid Ship** als eigenes **Nichtkreatur-Artefakt**; im Friedhof von Gegner A mindestens eine bekannte Kreaturenkarte; kein verhinderter Kampfschaden; eigene Hauptphase vor Kampfbeginn. (Das Originalschiff darf nicht als Kreatur animiert sein, sonst ist es kein legales Mishra-Ziel.)

1. Kampf beginnen und mit Mishra **Nautiloid Ship** anzielen. Erwartung: ein **4/4 fliegender Construct-Artefaktkreatur-Spielstein namens Mishra's Warform mit Eile**, ohne notwendiges Crew.
2. ETB des neuen Warform-Exemplars auf den Friedhof von Gegner A zielen lassen. Erwartung: alle Karten dieses Friedhofs exiliert; Exilgruppe dieser *konkreten* Warform zugeordnet.
3. Mit **dieser Warform** Gegner A angreifen und Kampfschaden an einem Spieler verursachen. Erwartung: genau bei Schaden an **einem Spieler** eine Kreaturenkarte auswählen, die **dieses Exemplar** exiliert hat, und sie unter eigener Kontrolle ins Spiel bringen. Blockschaden gegen eine Kreatur genügt nicht.
4. Im zweiten Hauptsegment oder Endsegment prüfen, ob die reanimierte Kreatur bleibt; sie ist kein Warform-Token und wird nicht von Mishras Opfer-Trigger erfasst.
5. **Negativfall A2:** Zwei verschiedene Ship-Warforms sollen verschiedene Friedhöfe exilieren. Schaden durch Warform #2 darf keine Kreaturen übernehmen, die nur Warform #1 exiliert hat.
6. **Negativfall A3:** Mit Brudiclad bereits liegende Tokens zu Kopien einer Ship-Warform machen. Diese Tokens **treten nicht erneut ein**, exilieren also selbst nichts; ohne eigene Exilgruppe dürfen sie keine fremden Exilkarten übernehmen. Die ursprüngliche Warform bleibt ein eigenständiges Objekt.
7. **Optional Panharmonicon:** Beide ETB-Trigger derselben Warform können zwei Spielerfriedhöfe exilieren; die durch *dieselbe* Warform exilierten Kreaturen sind bei ihrem Kampfschaden auswählbar.

**Ergebnis:** **BLOCKED / nicht ausgeführt** (keine beobachtete In-Game-Sequenz).

## B – Arcum Dagsson: Tutor und zweite Hauptphase

**Vorzustand:** eigener Arcum Dagsson seit Zugbeginn unter Kontrolle **oder** mit einem regelkonformen Effekt, der seine Tap-Aktivierung ohne Einsatzverzögerung erlaubt; Mishra und ein legales Nichtkreatur-Artefakt als Kopiervorlage; **Portal to Phyrexia** noch in der Bibliothek. Beim Test ohne Tausendjähriges Elixier darf Arcum nicht gerade erst ohne Eile ausgespielt worden sein.

1. Zu Kampfbeginn Warform aus einem eigenen Nichtkreatur-Artefakt erzeugen; Arcum ist selbst ungetappt.
2. Arcum **aktivieren**, eigene Warform als **Artefaktkreatur-Ziel** wählen. Erwartung bei Auflösung: der Beherrscher der gezielten Warform opfert sie, sucht ein **Nichtkreatur-Artefakt ohne Manawertgrenze** in seiner Bibliothek und legt es direkt ins Spiel.
3. **Portal to Phyrexia** auswählen: das Portal tritt ins Spiel und sein ETB lässt die gegnerischen Spieler jeweils drei Kreaturen opfern (soweit vorhanden). Ein Artefakt-**Kreatur**-Ziel darf Arcum nicht holen.
4. Testvariante B2: Warform vorher **angreifen und die Schadensphase überleben lassen**, Arcum erst **in der zweiten Hauptphase** einsetzen. Auch eine vom Angriff **getappte** Warform ist legales Ziel: **Arcum** muss tappen, **nicht** das Ziel. Ohne überlebende Warform ist diese Variante nicht durchführbar.
5. Testvariante B3: Arcum ohne Eile und **ohne Thousand-Year Elixir** im selben Zug wirken. Erwartung: Tap-Fähigkeit wegen Einsatzverzögerung nicht aktivierbar. Mit dem inzwischen aktiven Elixier den separaten **Test D** ausführen.
6. Negativfall B4: Arcum zielt eine **gegnerische** Artefaktkreatur. Dann sucht **deren Beherrscher** aus seiner Bibliothek, nicht der Arcum-Spieler – kein sinnvoller Standard-Tutorzug.

**Ergebnis:** **BLOCKED / nicht ausgeführt**. Papierregel: Arcums Fähigkeit verlangt keinen maximalen Manawert.

## C – Token- und Trigger-Kreuzprüfung

| Test | Vorzustand / Aktion | Erwartung nach Papierregeln | Engine-Ergebnis |
|---|---|---|---|
| C1: Panharmonicon | Mishra-Warform kopiert Knight Paladin, Ichor Wellspring oder Nautiloid Ship | **ETB**-Trigger verdoppelt; bereits liegende Kopien lösen nichts neu aus | **Offen** |
| C2: Roaming Throne (Artificer) | Als Typ Artificer wählen; Mishra-Kampftrigger auslösen | Mishras **getriggerte Fähigkeit** löst zweimal aus, mit gegebenenfalls zwei getrennten legalen Zielen; Arcums *aktivierte* Tap-Fähigkeit nicht | **Offen** |
| C3: Roaming Throne (Construct) | Als Typ Construct wählen; Nautiloid-Warform erzeugen | Warform-ETB-/Kampfschaden-Auslöser zusätzlich; **Mishras** Trigger wird nicht allein durch Construct-Wahl verdoppelt | **Offen** |
| C4: Worldwalker Helm | Warform erzeugen, Helm liegt bereits; später dessen {1}{U},{T}-Kopierfähigkeit nutzen | Bei Artefakttoken-Erzeugung zusätzlicher **Map-Token** durch Ersatzwirkung; die aktivierte Fähigkeit kann einen **dauerhaften** neuen Warform-Kopietoken erzeugen. Nur neu eintretende Tokens lösen ETBs aus; der neue Token erbt **keinen separat erzeugten Mishra-Opfer-Trigger**, auch keine nur bis Zugende verliehene Eile. | **Offen** |
| **C4b: Helm-Map bei Mishra** | Worldwalker Helm liegt vor Mishras Kampfauslöser: genau eine Warform **plus** eine zusätzliche Map durch Helms Ersatzeffekt erzeugen; im nächsten Endsegment den Opfer-Stack kontrollieren | **Wichtige neue Oracle-Prüfung:** Nach Wizards' offiziellen *Outlaws of Thunder Junction* Release Notes gelten Anweisungen des ursprünglichen Token-Effekts (etwa späteres Opfern/Exilieren) **auch für die zusätzliche Map**. Folglich wird die zusammen mit Mishras Warform erzeugte Map ebenfalls beim nächsten Endsegment geopfert. Map-Spielsteine, die andere Token-Erzeuger oder Helms **eigene Kopieraktivierung** hervorbringen, haben nur deren jeweilige Anweisungen. Gegenprobe mit **The Master, Multiplied:** Er verhindert Opfer von **Kreaturenspielsteinen**, nicht der **nichtkreaturischen Map**. **Vorherige Annahme dauerhaft bleibender Mishra-Maps wäre falsch.** | **Offen – besonders hoch priorisiert** |
| C5: Brudiclad | Mishra-Trigger vor Brudiclads Kampftrigger verrechnen, anschließend vorhandene Tokens in Warform-Kopie umwandeln | Brudiclad erzeugt zunächst einen Myr, dann wird die **Identität bestehender** Tokens verändert: keine neuen ETBs und keine zusätzlichen „exiled with it“-Gruppen | **Offen** |
| C6: Esoteric Duplicator | Warform **im zweiten Hauptsegment** über Arcum oder Ashnod's Altar opfern, {2} bezahlen | Zu Beginn des **nächsten Endsegments** entsteht eine neu eintretende Tokenkopie mit ETB, aber **ohne** den separat an der ersten Warform hängenden Opfer-Trigger | **Offen** |
| C7: Duplicator-Timing | Erste Warform wird **erst beim eigenen Endsegment-Opfer-Trigger** geopfert; {2} bezahlen | Der so erzeugte Duplicator-Trigger legt die Kopie **erst im nächsten Endsegment** an, typischerweise im Endsegment des nächsten Spielers, **nicht rückwirkend** im gerade begonnenen eigenen | **Offen** |
| C8: Legendäre Vorbilder | Zwei Warforms von **The Mightstone and Weakstone** erzeugen | Die Kopien sind weiter legendär und haben beide den Namen `Mishra's Warform`; Legendenregel ist relevant. **The Master, Multiplied** verhindert sie für kontrollierte Kreaturenspielsteine | **Offen** |
| C9: The Master, Multiplied | Master liegt bis zum Mishra-Opferauslöser auf dem Feld | Solange dessen statische Fähigkeit wirkt, kann der von dir kontrollierte Trigger deine Kreaturenspielsteine **nicht** opfern/exilieren lassen; in Manabrew separat zu bestätigen | **Offen** |

**Wichtig:** Transformieren von bestehenden Tokens durch Brudiclad ist **kein Eintritt**. Der von Mishra beim Erzeugen einer Warform festgelegte verzögerte Opfer-Trigger ist **keine kopierbare Karteneigenschaft**; auch die Helm- oder Duplicator-Kopie übernimmt ihn nicht. Im Gegenzug verschwindet er von einer originalen Warform **nicht**, nur weil deren Charakteristika später durch Brudiclad verändert werden.

## D – Thousand-Year Elixir: sofortige Tap-Fähigkeiten (neu im aktiven B3-Deck)

**Vorzustand D0:** Aktive [current.txt](current.txt) mit **Thousand-Year Elixir statt Thought Monitor** importieren; die fünf relevanten Kreaturen (**Arcum Dagsson, Goblin Welder, Goblin Engineer, Emry, Master Transmuter**) einzeln prüfen. Ohne ausreichend Mana, legales Ziel, Friedhofskarte oder Artefakt in der Hand ist eine ausbleibende Aktivierung **kein** Enginefehler.

1. **D1 – Negativkontrolle:** Arcum in deiner Hauptphase **ohne** Elixier neu ausspielen. Solange Arcum nicht auf andere Weise Eile hat und nicht seit Zugbeginn kontrolliert wird, ist seine {T}-Fähigkeit noch nicht legal.
2. **D2 – Elixier ermöglicht das Tappen:** Das Elixier vorher im Spiel behalten; Arcum nun in derselben Hauptphase neu wirken, und eine bereits eigene Artefaktkreatur als legal verfügbares Opferziel kontrollieren. Arcum unmittelbar tappen und auflösen: die eigene Artefaktkreatur wird geopfert, du suchst ein Nichtkreatur-Artefakt ohne MV-Grenze ins Spielfeld. **Erwartung: möglich auch ohne Eile des Arcum**; das Elixier gibt keine Angriffseile.
3. **D3 – Zweite Arcum-Aktivierung:** Nach erfolgreicher D2-Auflösung {1} bezahlen, Elixier tappen, Arcum enttappen. Eine **zweite** eigene Artefaktkreatur muss vor der erneuten Aktivierung bereitstehen. Anschließend Arcums {T}-Fähigkeit erneut verwenden; zweimaliges Suchen ist nur bei ausreichenden Zielen und Mana legal. Reihenfolge der Auslöser loggen.
4. **D4 – Die vier anderen Tap-Kreaturen:** Goblin Welder braucht je ein legales eigenes Artefakt auf dem Spielfeld und im Friedhof, Goblin Engineer eine zu seiner Mana-Value-Grenze passende Artefaktkarte, Emry ein legales Artefaktkarten-Ziel im Friedhof und Master Transmuter {U}, Rückgabe eines Artefakts sowie eine Artefaktkarte auf der Hand. Für jede frisch gespielte Kreatur erst **ohne**, dann **mit** Elixier die Tap-Aktivierung im Ausspielzug versuchen. Nicht über einen Fehler urteilen, wenn andere Kosten oder Ziele fehlen.
5. **D5 – Mishra kopiert Elixir:** Eigenes ursprüngliches Elixier als **Nichtkreatur-Artefakt** liegen haben und bei Mishras Kampfauslöser eine 4/4-Warform davon erzeugen. Sie besitzt Mishras Eile; mit noch mindestens {1} und einer anderen relevanten Kreatur sollte die Warform-Kopie selbst {1},{T} zum Enttappen anbieten. Die **originale** Elixier-Karte bleibt ungetappt und unabhängig. Beachten: Eine getappte Warform kann danach nicht ohne weitere Hilfe angreifen; ihr Opfertrigger bleibt bestehen.
6. **D6 – Keine garantierte Synergie:** Wenn Elixier liegt, aber weder eine passende Kreatur noch ausreichend Mana/Ziele vorhanden sind, entsteht **kein** automatischer ETB-Draw, keine zusätzliche Manaquelle und kein unabhängiger Tutor.

**Ergebnis:** **NICHT GETESTET** (Oracle-Rollout erwartet, keine bestätigte Manabrew-Spielsequenz). Video, Stack-Log und verwendete Engine-Version für D1–D5 sind als PASS/FAIL/BLOCKED zu notieren.

## E – Neue Karten: Mephitic Draught und Tezzeret, Master of the Bridge

**Vorzustand:** Aktuelle 100-Karten-Liste mit Mephitic Draught und Tezzeret statt Chromatic Lantern und Reckless Fireweaver; **diese beiden ehemaligen Karten dürfen in der Testliste nicht mehr vorkommen**. Deck-Engine/Version dokumentieren.

1. **E1 – Original-Draught:** Mephitic Draught für {1}{B} ausspielen. Erwartung: genau eine gezogene Karte und Verlust von 1 eigenem Leben bei ETB. Durch freiwilliges Opfern über einen legalen Opfereffekt (z. B. Oni-Cult Anvil) muss beim Übergang vom Feld **in den Friedhof** genau eine weitere Karte gezogen und ein weiteres Leben verloren werden.
2. **E2 – Mishras Warform-Draught:** Mephitic Draught als **Nichtkreatur-Artefakt** im Spielfeld behalten. Mishra erzeugt zu Beginn des eigenen Kampfes eine 4/4-Warform davon. Deren ETB zieht sofort 1 Karte und verliert 1 Leben. Wird dieselbe Warform am Ende des Zuges geopfert und kurz in den Friedhof gelegt, löst der weitere Draw/Life-Loss-Trigger aus, obwohl ein Token danach aufhört zu existieren. Gesamt pro Warform: **zwei Karten, zwei Leben**; das Original liegt weiterhin.
3. **E3 – Panharmonicon-Kontrolle:** Zusätzlich Panharmonicon kontrollieren und erneut eine Draught-Warform erzeugen. ETB löst **zweimal** aus, Tod/Opfer **einmal**. Erwartung bei regulärer Opferung: **drei Karten und drei Leben Verlust** für die Warform. Kein zweiter Tod-/Opfer-Trigger durch Panharmonicon.
4. **E4 – Tezzeret unmittelbar:** Mindestens sechs Mana einschließlich {U}{B} haben und z. B. exakt **acht eigene Artefakte** einschließlich Artefaktkreaturen, Länder und Tokens kontrollieren. Tezzeret, Master of the Bridge für {4}{U}{B} wirken und seine **+2-Loyalitätsfähigkeit** in der Hauptphase aktivieren. Bei Auflösung erwartete Wirkung (sofern Artefaktanzahl unverändert): **8 Schaden an JEDEM Gegner, genau 8 Leben Gewinn für dich insgesamt**, nicht 8 pro Gegner. Tezzerets Loyalitätswert steigt dabei von 5 auf 7. Er ist kein Artefakt für Arcum oder reguläres Mishra-Kopieren.
5. **E5 – Artefaktanzahl/−3:** Alternativen Boardstate mit anderer Artefaktzahl (z. B. Warform und Worldwalker-Map zusätzlich auf dem Feld) ausprobieren. Die +2-Fähigkeit zählt eigene Artefakte **bei Auflösung**; entfernte Artefakte als Reaktion ändern X. In eigenem nächsten Zug −3 mit legaler Artefaktkarte im eigenen Friedhof aktivieren und prüfen, dass sie **auf die Hand**, nicht direkt ins Spiel, zurückkommt. Tezzeret verschafft eigenen Kreaturen- und Planeswalkerzaubern Affinity, **nicht sich selbst rückwirkend**.
6. **E6 – Negativfälle:** Mephitic Draught verursacht Lebensverlust (kein Nullkosten-Draw); sein Sterbe-Trigger verlangt einen tatsächlichen Übergang in den Friedhof. Tezzeret stellt kein für Mishra normales Nichtkreatur-Artefakt-Kopierziel und keine einzelne Manaquelle bereit. Ein PLANESWALKER-Symbol ohne funktionierende Aktivierung ist **kein** positiver Test.

**Ergebnis:** **NICHT GETESTET** (Papierregeln/Oracle als erwartetes Verhalten, kein bestätigter manabrew.app-Boardstate). Nach Durchführung zu jedem Fall PASS/FAIL/BLOCKED mit Screenshot/Log und Engine notieren. Erst nach E1–E5 sind Aussagen zur praktischen Spielbarkeit der beiden Neuzugänge gedeckt.

## F – Zwei neue Game Changer: Mana Vault und Bolas's Citadel

**Vorzustand F0:** Die [100-Karten-Liste](current.txt) enthält exakt **Demonic Tutor, Mana Vault und Bolas's Citadel** als Game Changer (nicht mehr Rhystic Study/Cyclonic Rift). Testaufbau auf Manabrew mit beobachtbarem Mana, Bibliotheksoberseite, Friedhof und Spiel-Log; keine alten Deckimporte verwenden.

1. **F1 – Mana Vault als Original:** Mana Vault für {1} in eigener Hauptphase ausspielen, anschließend tappen. Erwartung: **{C}{C}{C}**, nicht drei farbige Mana. Der originale Mana Vault **enttappt nicht im eigenen Enttappsegment**, kann aber für {4} wieder enttappt werden. Bleibt er beim eigenen Ziehsegment getappt, verursacht er dort **1 Schaden am Beherrscher**.
2. **F2 – Mana-Vault-Warform:** Mana Vault liegt als eigenes Nichtkreatur-Artefakt im Spielfeld; Mishra erzeugt zu Kampfbeginn eine **4/4 Construct-Artefaktkreaturen-Warform**. Sie hat Eile und kann sofort drei farblose Mana produzieren. Original und Spielstein haben unabhängige Tap-Zustände. Das Endsegment-Opfer betrifft die Warform, nicht das Original.
3. **F3 – Elixir-Rampe:** Zusätzlich ein ungetapptes Thousand-Year Elixir und mindestens {1} zur Aktivierung bereithalten. F2-Warform zunächst für {C}{C}{C} tappen, dann für {1},{T} mit Elixir enttappen und erneut für {C}{C}{C} tappen. Erwartung: **sechs farblose Mana aus der Warform**, abzüglich {1} für die Elixir-Aktivierung. Dies ist **kein unendlicher Kreislauf**.
4. **F4 – Urza's Saga:** III. Kapitel der Urza's Saga auslösen und Mana Vault ({1}) aus der Bibliothek suchen. Erwartung: direkt ins Spiel, weil die aufgedruckten Manakosten {1} die Bedingung erfüllen. Weitere legale Saga-Ziele im Deck: Sol Ring ({1}) und Mox Opal ({0}); eine Karte mit {B} wie Lich's Relic ist kein Saga-Suchziel.
5. **F5 – Citadel über Arcum:** Bei legal verfügbarem Artefaktkreatur-Token und tappen könnendem Arcum Dagsson eine Warform opfern und **Bolas's Citadel aus der Bibliothek direkt ins Feld** bringen. Arcum ignoriert den Mana Value; reguläres Wirken kostet {3}{B}{B}{B}. Citadel darf die Bibliotheksoberseite ansehen, unter den üblichen Timing-/Landdrop-Regeln von dort Länder spielen und Zauber gegen **Lebenspunkte in Höhe ihres Mana Value** wirken. Teste, ob mehrere Länder oben die Kette abbrechen.
6. **F6 – Opferabschluss / Legendäres:** Bei **zehn eigenen Nichtland-Permanents** und ungetappter Citadel die Fähigkeit aktivieren ({T}, opfere zehn Nichtland-Permanents). Erwartung: jeder Gegner **verliert je 10 Leben**, kein Schaden und keine Verteilung. Eine Citadel-Warform hat ebenfalls die Tap-Fähigkeit und Mishras Eile, benötigt dieselben Opferressourcen. Die originale Bolas's Citadel und eine legendäre Kopie namens Mishra's Warform kollidieren nicht unter der Legendenregel; zwei gleichnamige legendäre Warforms können kollidieren. Die eingesetzten Permanents und Trigger protokollieren.

**Strategie und Evidenzgrenze:** Mana Vault ist Ramp, nicht Kartenziehen; Citadel ein Artefakt-Topdeckmotor, nicht Cyclonic Rifts asymmetrische Sofortantwort. Mit Mephitic Draught kann der Lebensverlust kumulieren; Tezzerets +2 hilft nur bei erfolgreicher Aktivierung. **F1–F6: NICHT GETESTET** – regelbasiertes Sollprotokoll, keine bestandene Manabrew-Sequenz. Für jede Engine nur nach Beobachtung PASS/FAIL/BLOCKED protokollieren.

## Entscheidung bis zum Engine-Nachweis

Die bislang aktiven Karten **Nautiloid Ship, Arcum Dagsson, Thousand-Year Elixir, Mephitic Draught und Tezzeret, Master of the Bridge** bleiben. Als neue Game Changer sind **Mana Vault und Bolas's Citadel** enthalten, während **Rhystic Study und Cyclonic Rift** zusätzlich zu den früheren Cuts draußen sind. Vorrang haben **F1–F6**, danach E1–E5, D1–D5, A1/A2, B1/B2 sowie C4/C6/C9. Keine Sequenz gilt ohne tatsächliche Manabrew-Ausführung als bestanden.

## Quellen (Regelreferenz; keine Manabrew-Spielbelege)

- [Mishra – offizielle The Brothers' War Release Notes](https://magic.wizards.com/en/news/feature/the-brothers-war-release-notes)
- [Arcum Dagsson – Oracle und Rulings](https://scryfall.com/card/2xm/41/arcum-dagsson)
- [Nautiloid Ship – Oracle](https://scryfall.com/card/clb/328/nautiloid-ship)
- [Worldwalker Helm](https://scryfall.com/card/big/7/worldwalker-helm) · [Wizards' offizielle Helm-Map-Ersatzregel](https://magic.wizards.com/en/news/feature/outlaws-of-thunder-junction-release-notes)
- [Esoteric Duplicator](https://scryfall.com/card/big/5/esoteric-duplicator)
- [Roaming Throne](https://scryfall.com/card/lci/258/roaming-throne)
- [Brudiclad, Telchor Engineer](https://scryfall.com/card/soc/299/brudiclad-telchor-engineer)
- [Panharmonicon](https://scryfall.com/card/2x2/310/panharmonicon)
- [The Master, Multiplied](https://scryfall.com/card/who/146/the-master-multiplied)
- [Thousand-Year Elixir](https://scryfall.com/search?q=%21%22Thousand-Year+Elixir%22)
- [Mephitic Draught – Oracle](https://mtg.wtf/card/lci/112/Mephitic-Draught)
- [Tezzeret, Master of the Bridge – Oracle](https://mtg.wtf/card/war/275/Tezzeret-Master-of-the-Bridge)
- [Mana Vault – Oracle](https://scryfall.com/card/2x2/308/mana-vault)
- [Bolas's Citadel – Oracle](https://scryfall.com/card/war/79/bolass-citadel)
- [Manabrew – Deckimport und Unsupported-Hinweise](https://docs.manabrew.app/playing/)