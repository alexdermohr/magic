# Magar of the Magic Strings – V4-Optimierung

**Datum:** 19. Oktober 2026 · **Bracket:** 3 · **Aktiv:** [current.txt](current.txt) · **Historie:** [V1](versions/2026-10-19-b3-v1.txt), [V2](versions/2026-10-19-b3-v2.txt), [V3](versions/2026-10-19-b3-v3.txt).

## Die wichtigste verifizierte Regelerkenntnis

Magars Fähigkeit ({1}{B}{R}) hat **keine Tap-Kosten und keine Sorcery-Timing-Beschränkung**. Die bisherige Eile-Fokussierung war deswegen überdimensioniert: Aktivierung **im gegnerischen Endsegment direkt vor deinem Zug** erzeugt eine Puppe, die im folgenden eigenen Zug ohne Eile angreifen darf. Dafür muss die Puppe bis zu unserem Angriff im Spiel bleiben. Früh erzeugte Puppen sind trotzdem durch Removal verwundbar; Haste von Anger, Chainer, Greaves, Boots und Bitter Reunion bleibt als Alternative sinnvoll. Referenz: [Oracle Magar](https://mtg.wtf/card/unf/514/Magar-of-the-Magic-Strings).

## Fünf gezielte V3 → V4-Wechsel

| V3 heraus | V4 hinein | Verbesserungsgrund | Stärkstes Gegenargument |
|---|---|---|---|
| Oriq Loremage | **Vile Entomber** | Beides vier Mana; Entomber entombt eine beliebige Karte **sofort beim ETB** und hat Deathtouch. | Loremage kann langfristig mehrfach tappen und ist als 3/3 größer; Vile hat nur einmaligen ETB ohne Kopien. |
| Fervor | **Buried Alive** | Mit EOT-Magar-Aktivierung weniger Haste nötig; Buried Alive sucht für drei Mana bis zu drei Kreaturen direkt in den Friedhof, meist Anger und Filth. | Wer schnell eigene Züge mit frisch erzeugten Puppen angreifen will, verliert die globale Haste-Enchantment. |
| Glaring Spotlight | **Fable of the Mirror-Breaker** | Für drei Mana Goblin/Treasure, anschließend **gezieltes Discard und Draw** und schließlich Reflection für echte ETB-Kreaturen (besonders Vile Entomber). | Spotlight bot einen einmaligen unblockbaren Teamangriff und Hexproof, die Fable nicht bieten kann. |
| Fireshrieker | **Embercleave** | Flash, kostenloses ETB-Anlegen und +1/+1/Trample bei Doppelschlag; kann **nach der Blockerdeklaration** einem ungeblockten Magar-Spell-Körper Doppeltrigger ermöglichen. | Bei nur einem Angreifer kostet das erste Anlegen insgesamt fünf Mana mit **{R}{R}**; spätere Re-Equip-Aktionen kosten drei statt zwei. |
| Flamekin Village | **Blazemire Verge** | Ohne Elemental war Village zuverlässig getappt; Verge kommt ungetappt und liefert Schwarz sicher, Rot bei Swamp/Mountain. | Village konnte als wiederholbare Haste-Quelle dienen, Verge nicht; Verge besitzt selbst keine Landtypen. |

**Zusätzliche Strukturkorrektur:** `Ransack the Lab` war in der bisherigen Importliste irreführend zwischen Kreaturen notiert, ist aber eine **Sorcery** und steht nun bei den Setup-Spells. Die Sortierung ändert keinen weiteren Kartenbestand.

## Aktuelle V4-Slotstruktur

| Position | Karten |
|---|---:|
| Commander | 1 |
| Sonstige Kreaturen | 9 |
| Artefakte | 17 |
| Verzauberungen | 6 |
| Großzauber für Magar | 9 |
| Setup/Discard/Tutoren | 14 |
| Removal und Schutzspells inkl. Malakir Rebirth | 8 |
| Echte Länder | 36 |
| **Insgesamt** | **100** |

Die tatsächlich im Deck enthaltenen Instants/Sorceries sind die neun Großzauber, 14 Setup-Karten und acht Interaktionskarten = **31**; sonstige Kategorien ergeben 69. `Malakir Rebirth` ist als Instant mit Landrückseite unter Interaktion gezählt, nicht unter den 36 festen Ländern.

## Kritische Interaktionen

- **Fable**: Die Saga transformiert zur `Reflection of Kiki-Jiki`. Sie darf nichtlegendäre **Kreaturen** kopieren, etwa `Vile Entomber` für einen weiteren echten ETB-Friedhofstutor. Die notierten Namen von **Magars 3/3** sind keine kopierbaren Werte; solche Puppentoken können bei Kampfschaden **keinen** notierten Zauber wirken.
- **Buried Alive** legt Anger und Filth in den Friedhof, gibt **aber keinen** Magar-zielbaren Instant/Sorcery-Zauber ab. Dafür sind Entomb/Unmarked Grave/Ransack/Faithless Looting oder ein schon im Friedhof liegender Spell nötig.
- **Anger** erfordert ein eigenes Mountain; **Filth** erfordert ein eigenes Swamp und gegnerische Swamps für Swampwalk. `Urborg, Tomb of Yawgmoth` macht alle Länder zu Swamps. `Blazemire Verge` selbst ist weder Swamp noch Mountain.
- **Embercleave**: Der Kostenrabatt zählt angreifende Kreaturen und reduziert nur generisches Mana. Das ETB-Ausrüsten zielt auf eine eigene Kreatur (nicht auf eine Kreatur mit Shroud). Doppelschlag ermöglicht zwei Magar-Treffer, wenn die Puppe beide Kampfschadensschritte schädigen kann; die Erstschlagkopie des Spells löst vor dem regulären Kampfschaden auf.
- **Zusatzkosten** gelten auch für Magar-Kopien (z. B. Big Score), und Overload ist nicht als alternative Kostenoption bei kostenlosem Magar-Cast auswählbar (Vandalblast).
- **Friedhofshass/Removal** bleibt stärkstes Meta-Risiko. `Fable` liefert wertvolle normale Spielfiguren, ersetzt aber kein nachweislich gewonnenes Match.
- **Weitere Kandidaten ohne Änderung:** `Solphim, Mayhem Dominus` verdoppelt vor allem Blood for the Blood God!, Sorin's Vengeance und Schaden von Call Forth the Tempest, benötigt aber eine passende Schadensquelle und hat kaum Nutzen bei Brass's Bounty / Breach the Multiverse. `Army of the Damned` bringt viele Zombies, aber getappt und erst nach dem bereits erfolgreichen Angriff. `Overwhelming Forces` zieht viele Karten, trifft allerdings nur Kreaturen eines Gegners, während In Garruk's Wake alle gegnerischen Kreaturen und Planeswalker entfernt.

## Prüfstand und Quellen

Aktuelle Bannlistenlage: [Wizards Commander](https://magic.wizards.com/en/formats/commander), [B&R 12. Oktober 2026](https://magic.wizards.com/en/news/announcements/banned-and-restricted-october-12-2026); Bracket 3 erlaubt maximal drei Game Changers. **Aktiv unverändert:** `Demonic Tutor`, `Gamble`, `Jeska's Will`. Neue Karten (Embercleave, Fable, Vile Entomber, Blazemire Verge) und erneut aufgenommene Buried Alive sind Commander-legal und anhand veröffentlichter Kartentexte beurteilt. Der tatsächliche Remote-100-Kartenstand und der unveränderte V3-Snapshot werden nach der Veröffentlichung nochmals gelesen.

**Keine gemessene Winrate oder echte Playtests.** Reviews und GitHub-Pflichtchecks gelten jeweils nur für den geprüften Head; keine geschützten Regeln umgehen und ohne Checks nicht mergen.

---

## Historische V3- und frühere Analysen (nicht aktueller Kartenstand)

**Stand:** 2026-10-19. **Commander:** Magar of the Magic Strings. **Bracket:** 3 / Upgraded. **Mission:** Eine echte Magar-Puppe möglichst früh sicher zum Gegner bringen und mit wiederholbaren Großzaubern gewinnen.

## V3: sechs gezielte, gegenüber V2 abgewogene Wechsel

| Heraus (V2) | Hinein (V3) | Tatsächlicher Mehrwert und wichtigster Nachteil |
|---|---|---|
| Illusionist's Bracers | **Fireshrieker** | Manakosten {3} + Equip {2} statt Bracers {2} + Equip {3}; **keine zwei Friedhofsziele nötig**. Bei Doppelschlag wird derselbe Magar-Spell zweimal gewirkt, sofern die Puppe beide Kampfschadensschritte einen Spieler trifft. Verliert die Fähigkeit, zwei Puppen pro Magar-Aktivierung zu erzeugen. |
| Mithril Coat | **Prowler's Helm** | {2} + Equip {2}: dauerhaft fast unblockbar, nur Walls können blocken. Stärkerer Zugriff auf den **ersten** Magar-Trigger. Verliert Flash-Indestructible gegen Removal auf Magar oder Puppen. |
| Bedlam | **Fervor** | {2}{R} statt {2}{R}{R}; eigene neue Puppen erhalten **sofort Eile**, ohne dass gegnerische Kreaturen zugleich nicht mehr blocken können. Nachteil: kein universeller Unblockbar-Effekt für alle Puppen mehr. `Glaring Spotlight` bleibt als Mehrfachangriffs-Finisher. |
| Glint-Horn Buccaneer | **Ransack the Lab** | {1}{B} statt {1}{R}{R}. Betrachtet drei Karten, nimmt eine auf die Hand, legt die anderen zwei in den Friedhof. Funktioniert als Magar-Spells-Kopie, verursacht dabei keine Zusatzkosten. Verliert Haste-Angreifer mit wiederholbarem Rummage und kleinem Discard-Schaden. |
| Hit the Mother Lode | **Call Forth the Tempest** | {5}{R}{R}{R}, **Cascade, cascade**. Beim Cast der Magar-Kopie lösen beide Kaskaden aus; anschließend Schaden nur an gegnerischen Kreaturen nach gesamtem Manawert der anderen **in diesem Zug gewirkten** Sprüche. Kein garantierter Kartenwert, anders als die bisherige Discover-10-Linie; entfallen sind ihre getappten Treasure-Tokens. |
| Tainted Peak | **Raucous Theater** | Fetchbares Swamp/Mountain, immer getappt, Surveil 1: kann Sorceries früh in den Friedhof befördern, gibt immer {B}/{R} ab Folgeturn und stützt Anger/Filth. Gegenargument: Tainted Peak konnte bei Swamp ungetappt kommen. |

Die Veränderungen reduzieren die erforderlichen Engine-Teile vor dem ersten Magar-Treffer und erhalten mit `Berserkers' Onslaught` und `Glaring Spotlight` zwei Wege für explosive Mehrfachtreffer. Keine zusätzlichen Game Changers, keine frühe Zweikarten-Endlosschleife beabsichtigt.

**Aktuelle V3-Struktur:** 1 Commander · 9 weitere Kreaturen · 18 Artefakte · 6 Enchantments · 9 große Sorceries · 13 Setup-/Tutor-Spells · 8 Interaktionskarten · 36 echte Länder = **100**. `Malakir Rebirth` besitzt zusätzlich eine Landrückseite, zählt nicht unter den 36 fixen Ländern.

**Historie:** [V1](versions/2026-10-19-b3-v1.txt) · [V2](versions/2026-10-19-b3-v2.txt) · [aktuelle V3](current.txt). Die ursprünglichen acht V1-zu-V2-Wechsel bleiben nachstehend dokumentiert, sind aber **keine Aussage über den aktiven V3-Kartenbestand**.

### V3-Pilotierung und Regelfallen

1. Bevor Magar aktiviert wird, wenn möglich `Fervor` oder `Anger` im Friedhof + kontrolliertes Mountain bereithalten; das 3/3 aus Magars Fähigkeit bekommt damit Haste. Magar selbst braucht zum Aktivieren kein Haste/Tap.
2. `Prowler's Helm`, `Silver Shroud Costume`, `Whispersilk Cloak`, `Key to the City` oder `Dauthi Embrace` sichern den Durchgang. `Prowler's Helm` scheitert gegen einen Block durch **Wall**; `The Black Gate` bleibt auf den Spieler mit den meisten/gleich vielen Lebenspunkten beschränkt.
3. `Fireshrieker` gibt **double strike**. Bei erfolgreichem Erstschlag-Schaden wird Magars Spruchkopie im first-strike damage step gewirkt, bevor regulärer Kampfschaden verteilt wird. Beschädigt/verlässt die Puppe oder verlässt der betroffene Gegner das Spiel, kann der zweite Treffer ausbleiben. Zwei Doppelschlag-Quellen ergeben keinen Vierfachschlag.
4. `Call Forth the Tempest` besitzt zwei separate Cascade-Trigger: Magars Kopie wird **gewirkt**, daher cascaded sie. Cascade-Spells werden zuvor gewirkt und erhöhen normalerweise den Schaden des Hauptspruchs; Kopieren ohne *Cast* würde hingegen kein Cascade auslösen. Nur die Kreaturen der Gegner werden getroffen. Der Effekt exiliert beim Cascade Karten, was zufällig besonders wertvolle andere Ziele überspringen kann. 
5. `Raucous Theater` hat Landtypen Swamp und Mountain; `Bloodstained Mire`, `Polluted Delta`, `Scalding Tarn`, `Marsh Flats` und weitere Fetches können es suchen, aber nicht als ungetapptes Land. Es erfüllt die Bedingung von `Anger` und `Filth` **bei uns**; Filths Swampwalk funktioniert nur gegen gegnerische Swamps, besonders zusammen mit `Urborg, Tomb of Yawgmoth`.

**Stärkstes Gegenargument:** Der Verlust von `Bedlam` und `Illusionist's Bracers` mindert den maximalen einmaligen Mehrfachpuppen-Ausbruch. `Mithril Coat` bot dauerhafte Indestructible-Absicherung. Diese V3 priorisiert bewusst zuverlässige erste Treffer und Manaeffizienz. Ob diese Variante im eigenen Meta tatsächlich häufiger gewinnt, muss durch Multiplayer-Partien verglichen werden; ohne solche Tests wird nur die mechanische Verbesserung behauptet.

### Quellen zur Prüfung der neuen Karten

- Prowler's Helm: https://mtg.wtf/card/ths/219/Prowlers-Helm
- Fireshrieker: https://mtg.wtf/card/mrd/171/Fireshrieker
- Fervor: https://mtg.wtf/card/wth/99/Fervor
- Ransack the Lab: https://mtg.wtf/card/mh1/103/Ransack-the-Lab
- Call Forth the Tempest: https://mtg.wtf/card/ltc/509/Call-Forth-the-Tempest
- Raucous Theater: https://mtg.wtf/card/mkm/266/Raucous-Theater
- Aktuelle Bracket-Einordnung: https://magic.wizards.com/en/formats/commander

---

## Historisch: exakt acht V1 → V2 Änderungen

| Raus | Rein | Warum und Gegenargument |
|---|---|---|
| Bone Miser | **Monument to Endurance** | Drei statt fünf Mana; Discard produziert eine Karte, Schatz oder 3 Lebensverlust pro Gegner. Begrenzung: jede Option nur einmal pro Zug, daher bei riesigen Wheels weniger explosiv als Bone Miser. |
| Guttersnipe | **Illusionist's Bracers** | Für Equip {3} an Magar vervielfacht die Ausrüstung seine aktivierte Fähigkeit; aus einer Aktivierung entstehen **zwei verschiedene** Spruch-Puppen. Guttersnipe war günstiger und lieferte direkt 2 Schaden pro gewirktem Spruch an alle Gegner, ist ohne wiederholte Casts aber unterdurchschnittlich. |
| Strionic Resonator | **Glaring Spotlight** | {3} + Opfer macht alle eigenen Kreaturen für einen Zug unblockbar und verleiht bestehenden Kreaturen Hexproof. Die alte Karte kopierte einen gelungenen Schadens-Trigger für {2}, war aber nutzlos, falls keine Puppe überhaupt durchkam. Spotlight ist einmalig, nicht wiederholbar. |
| Brotherhood Regalia | **Silver Shroud Costume** | Neues Equipment kostet {2}, **Flash**, sofortiges Anlegen beim ETB, temporäres Shroud, dauerhafte Unblockbarkeit. Regalia hatte dauerhaft Ward {2}, aber bei einer nichtlegendären Puppe Equip {3}; späteres Umrüsten kostet auch beim Costume {3}. |
| Explosive Singularity | **Sorin's Vengeance** | Gleiche relevante Menge Direktschaden an Spieler/Planeswalker (**10**) und zusätzlich **10 Lebenspunkte** für uns; sieben statt zehn Mana falls einmal normal zu wirken. Verlust: kann nicht mehr auf Kreaturen zielen. |
| Shizo, Death's Storehouse | **Flamekin Village** | Shizo kann nur dem legendären **Magar**, nicht seinen namenlosen Puppen, Fear geben. Flamekin Village gibt jeder Puppe gegen {R}, Tap Eile und liefert selbst {R}. Risiko: ohne Elemental-Karte fast immer getappt. |
| Buried Alive | **Final Parting** | Sucht **beliebige** zwei Karten: beispielsweise Breach the Multiverse direkt in den Friedhof und Silver Shroud Costume oder Key to the City auf die Hand. Anders als Buried Alive ist es auch als Magar-Ziel für wiederholtes Suchen brauchbar. Nachteil: {3}{B}{B} statt {2}{B}; Anger+Filth auf einen Schlag in den Friedhof zu legen geht nicht mehr. |
| Fevered Suspicion | **Vandalblast** | Von der Hand einmal für {R} gezielte Artefaktantwort oder für {4}{R} alle gegnerischen Artefakte räumen. Der alte Achtmana-Zufallszauber war als Puppe spannend (bis drei fremde Karten) aber ohne Rebound bei kostenloser Magar-Kopie, und in der Hand schwer zu wirken. Wichtige Grenze: Magar kann Vandalblast nur **ohne Overload** kostenlos wirken. |

**Echte historische V1:** [versions/2026-10-19-b3-v1.txt](versions/2026-10-19-b3-v1.txt). V2 liegt jetzt ebenfalls historisch im Versionsordner; `current.txt` enthält ausschließlich V3.

## Historische V2-Struktur (nicht aktuelle V3)

| Kategorie | Anzahl |
|---|---:|
| Commander | 1 |
| Kreaturen außer Commander | 10 |
| Artefakte | 18 |
| Verzauberungen | 6 |
| Magar-Haymaker mit hohem Impact | 9 |
| Setup, Discard und Tutoren | 12 |
| Flexible Interaktion einschließlich Vandalblast und Malakir Rebirth | 8 |
| Echte Länder | 36 |
| **Gesamt** | **100** |

`Malakir Rebirth` hat die `Malakir Mire` Landrückseite und ist **kein** 37. dediziertes Land. `Flamekin Village` ist ein Land und ersetzt genau ein Land. Die Kategorien sind Deckbaurollen, keine automatisch ermittelten Oracle-Typen: `Vandalblast` ist beispielsweise auch eine Sorcery, wird hier als Interaktion eingeordnet.

## Die neun damaligen Haymaker (V2)

- `Brass's Bounty`: wiederholbare Schatzskalierung mit eigener Länderzahl, Treasures kommen **ungetappt**.
- `Breach the Multiverse`: je Spieler 10 Karten millen und aus jedem Friedhof einen Planeswalker oder eine Kreatur holen.
- `Rise of the Dark Realms`: gewinnt Kreaturen aus sämtlichen Friedhöfen unter unserer Kontrolle.
- `In Garruk's Wake`: zerstört nur gegnerische Kreaturen und Planeswalker, schützt somit die eigenen 3/3.
- `Blood for the Blood God!`: Hand abwerfen, 8 ziehen, **jedem Gegner 8 Schaden**, danach wird die **gewirkte Kopie** exiliert, nicht die ursprüngliche Puppe.
- `Hit the Mother Lode`: Discover 10; restliche Mana-Wert-Differenz als **getappte** Treasures für Folgerunden.
- `Sorin's Vengeance`: 10 an Spieler/Planeswalker und 10 Lebenspunkte für uns. Mit `Berserkers' Onslaught` wird bei zwei ungeblockten Kampfschadensschritten dieselbe kopierte Sorcery zweimal gewirkt.
- `Peer into the Abyss`: sehr viele Karten auf Kosten der Hälfte der Lebenspunkte; Lebensmanagement wichtig.
- `Disrupt Decorum`: Goad aller gegnerischen Kreaturen. **Beim Treffer in unserem Kampf** ändert Goad den bereits abgeschlossenen Blocker-Schritt nicht und hilft erst in den folgenden Angriffen; primär Politik und Absicherung gegen Gegenschläge.

**Rollen-Abgrenzung:** `Final Parting` und `Vandalblast` sind zusätzliche sinnvolle Magar-Ziele, aber ihre Aufgabe ist Suchen bzw. Interaktion, nicht der direkte Sieg. `Final Parting` kostet ohne Kopie fünf Mana, um zwei Karten zu tutorieren. `Vandalblast` kann kostenlos nur eine gegnerische Artefakt-Permanente zerstören, nicht überladen werden.

## Historische V2-Engpassanalyse

**Friedhof vorbereiten:** Faithless Looting, Cathartic Reunion, Thrill of Possibility, Demand Answers, Big Score, Anje Falkenrath, Key to the City, Ripples of Undeath, Doom Whisperer, Geier Reach Sanitarium und Wheel of Fortune. `Entomb`, `Unmarked Grave`, `Final Parting` suchen gezielt, `Gamble` kann zufällig auch das gewünschte Ziel abwerfen. `Monument to Endurance` macht bewusstes Abwerfen zum direkten Vorteil.

**Eile:** `Anger` im Friedhof **und** eigenes Mountain, `Chainer, Nightmare Adept`, `Bitter Reunion`, `Flamekin Village`. Magar selbst braucht zum Aktivieren keine Eile, aber frisch durch Magar erzeugte 3/3 brauchen sie zum sofortigen Angriff.

**Evasion:** `Key to the City`, `Whispersilk Cloak`, `Silver Shroud Costume`, `Thieves' Tools`, `Dauthi Embrace`, `Glaring Spotlight`, `Bedlam`, `Access Tunnel`, `Rogue's Passage`, `The Black Gate` (nur Spieler mit den meisten bzw. gleich vielen Lebenspunkten), `Filth` + ein Swamp (ideal mit `Urborg, Tomb of Yawgmoth`). Beachte: Brotherhood Regalia ist seit V2 **nicht mehr** enthalten.

**Schutz:** `Lightning Greaves`, `Swiftfoot Boots`, `Mithril Coat`, `Deflecting Swat`, `Malakir Rebirth` auf den ursprünglichen Magar, `Plaza of Heroes`, temporäres Shroud von `Silver Shroud Costume` und `Glaring Spotlight`. Magar-Puppen selbst haben beim Verlassen des Spielfelds eine **Exil-statt-anderen-Zielort**-Ersatzwirkung: Wiederbelebung derselben Puppe durch Malakir Rebirth funktioniert nicht.

**Ressourcen:** 36 Lands (+ Malakir Mire optional), sieben effiziente Mana-Artefakte einschließlich Sol Ring, dazu Storm-Kiln Artist, Professional Face-Breaker, Big Score, Jeska's Will und Brass's Bounty. Magar benötigt für **jede Aktivierung {1}{B}{R}**. Mehr Puppen kosten entsprechend mehr Mana und brauchen separat Evasion — genau deshalb sind Bracers und Spotlight als Paar stärker als einzeln.

## Historische V2-Grenzen und Gegenargument

Das Deck verliert durch V2 **zwei unterstützende Kreaturen** und eine zuverlässige eigenständige direkte Schadensquelle (`Guttersnipe`). `Illusionist's Bracers` kann auf einer leeren Friedhofslage keine zwei unterschiedlichen Puppen erzeugen; der Ausrüstungsaufwand ist hoch. `Silver Shroud Costume` hat nur am ETB einmal gratis Attach, danach Equip {3}, während `Brotherhood Regalia` auch später Ward gab. `Flamekin Village` ist im Gegensatz zum entfernten Shizo praktisch sicher getappt. Dieser Trade lohnt nur, wenn der Druck der ersten ein bis zwei Magar-Treffer entscheidender ist als langfristige Einzelkarteneffizienz.

**Nicht als Optimierung enthalten:** `Savage Beating` und wiederholbare Extra-Combat-/Extra-Turn-Loops, `Torment of Hailfire`/andere X-Zauber (bei kostenloser Kopie X=0), `Roaming Throne` für typelose Puppen, `Insurrection` als Magar-Ziel (wird **erst nach Kampfschaden** gewirkt, für die bereits erfolgte Angriffsdeklaration zu spät), `Necropotence` (verbannt abgeworfene Karten statt sie in den Friedhof zu legen und ist Game Changer). `Volcanic Vision` wäre ein möglicher Ersatz für einen weiteren Haymaker, braucht jedoch zusätzliche **andere** hochwertige Spell-Karten im Friedhof als Ziele — diese sind durch Magars Aktivierung oft bereits zu Puppen geworden.

**Weiter zu beobachten:** Eine Hand ohne schwarzen + roten Manaquellen; nur ein Haymaker im Friedhof, sodass Bracers effektiv nur einen Token schafft; Massenremoval, Graveyard-Hate und Enchantment-Hate. Verbesserungen sollten nach echten 4-Spieler-Partien an diesen Problemen priorisiert werden, nicht anhand der bloßen Zahl „explosiver“ Karten.

**Offizielle Referenz:** https://magic.wizards.com/en/formats/commander — Commander/Brackets; https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026 — Game Changers. Bracket 3 erlaubt maximal drei Game Changers. Die aktuelle V3 verwendet weiterhin **Demonic Tutor, Gamble und Jeska's Will**.

**Prüfumfang:** Neue Einzelkartentexte wurden gegen öffentliche Kartendaten abgeglichen; 100 Karten/36 Länder/Singleton werden nach dem Remote-Write frisch überprüft. Weder eine vollständige Oracle-Prüfung aller 100 Karten noch reale Partietests oder eine belegte Winrate sind mit diesem Text behauptet.
