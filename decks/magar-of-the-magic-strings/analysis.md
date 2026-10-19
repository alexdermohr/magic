# Magar of the Magic Strings — V5-Optimierungsanalyse

**Stand:** 19. Oktober 2026 · **Aktiv:** [current.txt](current.txt) · **Format:** Commander Bracket 3, Rakdos · **Ziel:** deutlich mehr erfolgreiche und gewinnbringende Magar-Treffer, keine beabsichtigten frühen Zweikarten-Infinite-Loops.

## Drei gezielte Änderungen V4 → V5

| Heraus | Hinein | Bewertung | Stärkstes Gegenargument |
|---|---|---|---|
| **Anger** | **Stinkweed Imp** | Statt einer nur im Friedhof mit Mountain wirksamen Eilequelle erhalten wir **Dredge 5** für wiederholte echte Friedhofsfüllung und einen fliegenden defensiven Körper. Magar kann bereits im Endsegment vor unserem Zug aktivieren, deshalb ist Eile weniger zwingend. | Wenn eine Puppe **noch im eigenen Zug** ohne Eile erzeugt werden muss, fehlt Anger. Außerdem ersetzt Dredge das Ziehen einer unbekannten Handkarte und kann wertvolle Nichtzauber millen. |
| **Chainer, Nightmare Adept** | **Mirkwood Bats** | Kosten beide vier Mana. Chainer bot Haste und situative Kreaturen-Reanimation; Bats verwandelt `Brass's Bounty` + Schatzopfer in große **wiederholbare Lebensverlust-Ereignisse für sämtliche Gegner**. Außerdem unterstützen `Big Score`, `Black Market Connections`, `Professional Face-Breaker` und `Fable of the Mirror-Breaker` die Fledermäuse. | Chainer war nützlich, wenn Magar spät im eigenen Zug aktiviert werden sollte und für erneut gewirkte `Vile Entomber`; Bats ist ohne Token-Engine nur eine mäßige 2/3-Fliegerkreatur. |
| **Buried Alive** | **Dark Deal** | Beide kosten drei Mana. `Buried Alive` findet **nur Kreaturen**, nicht die Instants/Sorceries für Magar. `Dark Deal` wirft unsere gesamte Hand ab, füllt sie mit einer Karte weniger wieder auf und aktiviert `Monument to Endurance`. Damit entstehen in der Praxis häufiger zauberfähige Magar-Friedhofsziele. | Die Suche nach `Anger`/`Filth` entfällt; durch das Wheel werden auch gegnerische Hände neu gefüllt, und eigene Schutzkarten können verloren gehen. |

**Wichtige Priorität:** `Thieves' Tools` blieb bewusst **im Deck**. Sein Unblockbar-Effekt für Stärke höchstens 3 wird nur in der Blockerdeklaration geprüft. Danach angelegtes `Embercleave` (+1/+1, Double Strike, Trample) macht eine zuvor ungeblockte Puppe nicht nachträglich blockbar. Deshalb wäre ein Wechsel zu `Mask of Memory` zwar besseres Draw nach einem Treffer, aber zunächst eine Verschlechterung bei der Sicherheit des ersten Treffers.

## Neue Kombinationen, exakt abgegrenzt

### Stinkweed Imp + Anje / Key to the City

`Anje Falkenrath` discards den Imp als Kosten und würde danach eine Karte ziehen. Da der Imp **bereits im Friedhof liegt**, kann dieses Ziehen durch Dredge 5 ersetzt werden: Die obersten fünf Bibliothekskarten gehen in den Friedhof, der Imp auf unsere Hand zurück. Der Effekt verbraucht **ein Tap von Anje** und ersetzt Karten-Nachziehen, ist also kein unbeschränkter Loop. Weitere Discard-Outlets wie `Key to the City` können den Imp in späteren Zügen erneut abwerfen. `Monument to Endurance` belohnt das Abwerfen unabhängig von seiner Rolle im Dredge-Plan.

### Mirkwood Bats + Brass's Bounty / Treasures

`Mirkwood Bats` ({3}{B}) sorgt für **einen Lebensverlust pro erstelltem oder geopfertem Token und Gegner**. `Brass's Bounty` erzeugt pro Land ein eigenes Treasure. Mit **sechs Ländern** und einem erfolgreich gewirkten Bounty ergeben sich **sechs Lebensverlust pro Gegner** beim Erzeugen der Tokens; werden anschließend alle sechs Schätze geopfert, kommen **sechs weitere** hinzu. Das sind **12 pro Gegner**, noch ohne sonstigen Schaden durch Kampftreffer, andere Schätze oder `Blood for the Blood God!`. Die Tokens liefern zugleich Mana für weitere {1}{B}{R}-Aktivierungen. `Professional Face-Breaker` ermöglicht außerdem Value durch das Opfern der Treasures.

### Dark Deal + Monument to Endurance

`Dark Deal` ({2}{B}) wirft jede Spielerhand ab und lässt jeden anschließend entsprechend viele Karten **minus eine** nachziehen. Das ist ein echter Friedhofs-Setup-Zauber, der von Magar nach einem erfolgreichen Kampftreffer ebenfalls kopiert und gewirkt werden kann (wobei auch die Gegner neue Hände bekommen). `Monument to Endurance` triggert beim Discard jeder Karte; jede seiner drei Optionen darf aber nur **einmal pro Zug** gewählt werden. `Dark Deal` mit fünf Discards erzeugt deswegen **maximal drei unterschiedliche wirksame Monument-Modi in diesem Zug**, keinen unbegrenzten Schaden.

## Aktuelle Struktur: 100 Karten

| Abschnitt | Karten |
|---|---:|
| Commander | 1 |
| Sonstige Kreaturen | 9 |
| Artefakte | 17 |
| Verzauberungen | 6 |
| Haymaker-Instants/Sorceries | 9 |
| Discard-/Setup-/Tutor-Instants/Sorceries | 14 |
| Interaktion (einschließlich Malakir Rebirth als MDFC) | 8 |
| Länder (nur Landkarten) | 36 |
| **Summe** | **100** |

36 feste Länder + `Malakir Rebirth` als optionales getapptes `Malakir Mire`. Im aktiven Deck sind genau drei Game Changers: **Demonic Tutor, Gamble, Jeska's Will**. Die neuen Karten sind Rakdos-kompatibel und Commander-legal. Keine Bracket-Veränderung oder unerwünschte Massenlandzerstörung.

## Belastbarer Gegencheck

**Größtes Risiko der V5:** Drei Veränderungen opfern einen Teil der explosiven Haste-/Reanimationslinie. Schlägt ein Gegner die direkt vor dem eigenen Zug erzeugte Puppe nach Magars Aktivierung mit Removal, können wir nicht ohne Weiteres im eigenen Zug eine neue ohne Eile angreifen lassen. Außerdem benötigt `Mirkwood Bats` Tokenproduzenten im Spiel; ein einzelnes `Bats` gewinnt nicht unabhängig. Ein langsames Reanimator-Meta könnte die frühere Chainer-Variante bevorzugen.

**Warum dennoch diese Richtung:** V1–V4 besitzen bereits zahlreiche Wege zu unblockbaren Treffern, Eile via drei verbleibende Karten, elf? Nein: die genaue Zahl der Evasion-Quellen hängt davon ab, ob bedingte Länder/Filth mitgezählt werden. V5 verbessert die andere Hälfte des Problems: in der **richtigen Zone tatsächlich einen wichtigen Spruch bereitzustellen** und nach einem Bounty-Treffer schneller die ganze Viererrunde zu besiegen. Zahlen zu Turn-5-Quoten sind ohne reproduzierbare Partietests nicht belegt.

**Bewusst nicht geändert:** `Whispersilk Cloak`, `Silver Shroud Costume`, `Prowler's Helm`, `Thieves' Tools`, `Key to the City` und `Dauthi Embrace` sichern weiterhin Durchkommen; `Embercleave` und `Berserkers' Onslaught` geben Doppelschlag. `Final Parting` und `Vile Entomber` legen gewünschten Magar-Zielzauber direkt in den Friedhof. `Doom Whisperer` bleibt ein zuverlässiger Surveil-Motor trotz fünf Mana.

## Historische Versionen (fest archiviert)

**Jede Verlinkung auf eine frühere Liste verweist ausdrücklich auf deren Snapshot – nicht auf `current.txt`.** Die früheren Änderungsanalysen sind in der Git-Historie des PR nachlesbar; hier folgt der knappe Änderungsverlauf:

- [**V1**](versions/2026-10-19-b3-v1.txt): Ausgangsliste, Magar-Big-Spells und grundlegende Evasion.
- [**V2**](versions/2026-10-19-b3-v2.txt): 8 Änderungen: Bone Miser → Monument to Endurance, Guttersnipe → Illusionist's Bracers, Strionic Resonator → Glaring Spotlight, Brotherhood Regalia → Silver Shroud Costume, Explosive Singularity → Sorin's Vengeance, Shizo → Flamekin Village, Buried Alive → Final Parting, Fevered Suspicion → Vandalblast.
- [**V3**](versions/2026-10-19-b3-v3.txt): 6 Änderungen: Glint-Horn Buccaneer → Ransack the Lab, Illusionist's Bracers → Fireshrieker, Mithril Coat → Prowler's Helm, Bedlam → Fervor, Hit the Mother Lode → Call Forth the Tempest, Tainted Peak → Raucous Theater.
- [**V4**](versions/2026-10-19-b3-v4.txt): 5 Änderungen: Oriq Loremage → Vile Entomber, Fervor → Buried Alive, Glaring Spotlight → Fable of the Mirror-Breaker, Fireshrieker → Embercleave, Flamekin Village → Blazemire Verge. `Ransack the Lab` wurde als Sorcery in den Setup-Abschnitt einsortiert.
- **V5** ist ausschließlich die aktuelle [current.txt](current.txt), mit den oben aufgeführten drei Kartenwechseln.

Der vorherige automatische PR-Reviewhinweis, dass die historische V3-Analyse fälschlich auf `current.txt` zeigte, ist durch die spezifischen Snapshot-Links und das Entfernen veralteter „aktuelle V3“-Aussagen behoben.

## Prüfung und offener Nachweis

- Die vollständige 100-Karten-Liste, Commander-Position, Singleton-Ausnahmen, Landzahl und die **drei beabsichtigten** Game Changers sind direkt aus dem veröffentlichten PR-Head reproduzierbar. Die Identität aller historischen Snapshots wird über ihre Git-Blob-SHAs abgeglichen.
- **Neuer Karten-Oracle:** [Stinkweed Imp](https://mtg.wtf/card?q=%21Stinkweed+Imp), [Mirkwood Bats](https://mtg.wtf/card?q=%21Mirkwood+Bats), [Dark Deal](https://mtg.wtf/card/frf/66/Dark-Deal); [Magar](https://mtg.wtf/card/unf/514/Magar-of-the-Magic-Strings); [Thieves' Tools – offizielle Rulings](https://magic.wizards.com/en/news/feature/adventures-forgotten-realms-release-notes-2021-07-09).
- **Format:** [WotC Commander-Format](https://magic.wizards.com/en/formats/commander), [Bracket-Update Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026), [B&R 12. Oktober 2026](https://www.magic.wizards.com/en/news/announcements/banned-and-restricted-october-12-2026).
- **Kein vollständiger unabhängiger Oracle-Batchscan aller 100 Karten, keine Partietests und keine gemessene Winrate** behauptet. GitHub-Pflicht-CI und Review-Gates dürfen nicht umgangen werden.
