# Manabrew-Funktionsprüfung – Mishra, Eminent One (Bracket 3)

**Stand:** 11.10.2026 · **Eingangsrevision:** [`52899aa`](https://github.com/alexdermohr/magic/commit/52899aa979e11b8365fff0a90af5e297a0061f31) · **aktive Liste:** [current.txt](current.txt).

## Evidenzstatus – ausdrücklich keine bestandenen Kartentests

| Ebene | Status | Beobachtung / Grenze |
|---|---|---|
| GitHub-Liste und Dokumentenkonsistenz | **Geprüft** | `current.txt`: 100 verschiedene Namen; `replaceability.md`: dieselben 100; `erweiterter-kreis.md`: 132 andere Namen, keine Überschneidung (11.10.2026). |
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
5. Testvariante B3: Arcum ohne Eile im selben Zug wirken. Erwartung: Tap-Fähigkeit wegen Einsatzverzögerung nicht aktivierbar; **Thousand-Year Elixir** wäre ein eigener späterer Test dafür.
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

## Entscheidung bis zum Engine-Nachweis

Die zwei bereits aktiven Karten **Nautiloid Ship** und **Arcum Dagsson** bleiben im Deck. Fehlende Testbelege werden **nicht** als Funktionsnachweis behandelt. Kein zusätzlicher Slot wird auf bloßer Synergievermutung ersetzt. Höchste Priorität haben A1/A2 und B1/B2, danach C4/C6/C9 – sie können die Deckentscheidung tatsächlich ändern.

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
- [Manabrew – Deckimport und Unsupported-Hinweise](https://docs.manabrew.app/playing/)