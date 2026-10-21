# Jon Irenicus, Shattered One — Kartenanalyse und Optimierung (Bracket 3)

**Stand: 20.10.2026, V7.** Hauptziel: dauerhaft nachteilige, erzwungen angreifende Geschenke; mehrfacher Jon-Kartenvorteil; eigene Siegbedingungen, auch wenn nur noch zwei Spieler übrig sind. Die Karten sind nach konkreter Synergie bewertet, nicht nach Seltenheit oder Preis. **Keine echten Multiplayer-Spiele oder empirischen Winraten belegt.**

## 1. Messbare Struktur / rechtlicher Deckrahmen

- **100 Karten:** 1 Commander, **27 weitere Kreaturen**, **35 sonstige Nichtlandkarten** (einschließlich MDFC Malakir Rebirth), **37 Landkarten**, darunter 36 zumindest zeitweise manaerzeugende Länder und Maze of Ith (ohne eigenständige Manaaktivierung). **95 eindeutige Namen**, übrige Mehrfachkarten ausschließlich 4 Island und 3 Swamp.
- **Drei Game Changer:** Rhystic Study, Demonic Tutor, Cyclonic Rift — gemäß frischer Scryfall-Prüfung. Keine absichtliche frühe unendliche Zweikarten-Siegkombination, keine Extra-Turn-Kette und keine Massenlandzerstörung. Bracket 3 nach Wizards; keine reale Stärke- oder Winrate-Messung.
- **Abgrenzung Deadly Rollick:** Das im Deck enthaltene **Deadly Rollick** gehört **nicht** zur offiziellen Game-Changer-Liste (Scryfall-Flag `game_changer: false`). Eine kostenlose Zauberoption, solange wir einen Commander kontrollieren, macht die Karte nicht automatisch zum Game Changer. Die Liste wird **individuell** gepflegt, nicht für den gesamten kostenlosen Commander-2020-Zauberzyklus zusammen. **Fierce Guardianship** und **Deflecting Swat** sind Game Changers, Deadly Rollick und Flawless Maneuver dagegen nicht. Grundlage: [Wizards – aktuelle Commander-Brackets](https://magic.wizards.com/en/formats/commander), [Wizards – komplette aktualisierte Game-Changers-Liste vom 21.10.2025](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025), [Wizards – Nachträge vom 09.02.2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) und [Deadly Rollick mit Game Changer: No](https://manaplane.com/cards/488/). Ein Brawl-Verbot oder eine Centurion-Sperre ist **keine** Commander-Game-Changer-Einordnung.
- **V7-Manakurve** ohne Länder/Commander (62 Karten): **9×MV1, 24×MV2, 15×MV3, 13×MV4, 1×MV5**, Durchschnitt **2,565**, **identisch zu V5 und V6**. Von 37 Landkarten haben 35 eine langfristig verfügbare Manafähigkeit; **Urza's Saga** liefert vorübergehend {C} und opfert sich nach III; **Maze of Ith** liefert ohne Urborg kein Mana. Keine realen Mulligan-/Partie-Simulationen.
- **Legalitätsbasis:** Die archivierte V6 wurde am 18.10.2026 vollständig gegen Scryfall Cards/Collection abgeglichen (95/95, legal in Commander/U/B mit Papierdruck). Die beiden neuen schwarzen Kreaturen Wretched Anurid und Ebon Drake haben bestätigte Commander-legale Papierdrucke; der aktuelle V7-Gesamtcheck erfolgt zusätzlich über den Repository-Validator und den Decklistenvergleich. Das V6-Archiv ist byteidentisch mit der Vorgänger-Liste.
- **Restschwächen:** sechs Zwei-Mana-Rocks + Sol Ring für viermanaigen Jon, weiterhin Risiko durch gezieltes Removal; ohne Jon belastet Thought Eater zunächst unsere eigene maximale Handgröße. Wretched Anurid bestraft schon vor der Übergabe unsere Kreaturenzugänge, Ebon Drake jeden von irgendwem gewirkten Spell. Der Wegfall von Vampire Hexmage nimmt dem Archfiend seine abrupt beschleunigte Oil-Counter-Linie, der Wegfall von Windfall reduziert Hand-Neustarts und Burst-Kills. Keine engine-simulierten Partien.

## 2. Regeln und Synergien auf Basis des aktuellen Oracle-Texts

1. **Jon & Gegnerkontrolle.** „Own“ heißt Eigentümer, nicht aktueller Controller. Deshalb ziehen wir beim Angriff unserer geschenkten Kreatur mit Jon pro vorhandenem Jon einmal. Angriffe zählen bei Deklaration, ohne Kampfschaden. Tokens gehören dem Spieler, der sie erstellt hat. Kein ETB beim Kontrollwechsel; +1/+1-Marken und Goad bleiben.
2. **Goad im Duell.** Bei nur einem Gegner müssen legal angreifende, goadete Körper uns angreifen. Zahlungen für Propaganda sind nie verpflichtend. **Maze of Ith** wird nach der Angriffsdeklaration aktiviert: seine Schadensverhinderung bewahrt uns, ohne Jons bereits ausgelösten Kartenzug zu verlieren. Bloßes Enttappen entfernt gemäß Regeln 506.4b die Kreatur nicht aus dem Kampf. Gegen mehrere Angreifer oder kampffremde Trigger allein nicht ausreichend; Maze produziert normalerweise kein Mana.
3. **Nicht opferbar heißt nicht unzerstörbar.** Despotic Scepter kann unsere an Gegner verschenkten Permanents mit seiner Tap-Fähigkeit zerstören, obwohl der Empfänger sie nicht opfern darf. Indestructible, Exil und Bounce sind separate Fälle. Homeward Path kontrolliert Geschenke wieder selbst und überträgt damit deren „you“-Nachteile auf uns.
4. **Mehrfache Jon-Trigger.** Roaming Throne wählt bei ETB **Wizard** und verdoppelt ausgelöste Fähigkeiten jedes anderen eigenen Wizards, also die beiden Fähigkeiten Jons. Spark Double kann Jon als nichtlegendäre Kreatur kopieren; Sakashima kopiert ihn samt Legendenregel-Ausnahme. Diese Jons lösen selbst zusätzlich aus. **Irenicus's Vile Duplication** erstellt eine dauerhafte, nichtlegendäre fliegende **Jon-Tokenkopie**. Im Unterschied zu den beiden ETB-Kopierkreaturen zielt der 4-Mana-Spruch und scheitert an **Lightning Greaves/Shroud**, solange Greaves noch an Jon liegen. Greaves gegebenenfalls für Equip {0} umlegen. Jeder Geschenk-Trigger benötigt beim Auf-den-Stapel-Legen bereits ein passendes von uns kontrolliertes Kreaturenziel; Doppeltrigger garantieren keine zusätzlichen Körper.
5. **Equipment-Falle, Review #30 P2:** Ein vor Jon ausgerüstetes Sword of Fire and Ice (pro Blau) bzw. Sword of Feast and Famine (pro Schwarz) macht Jons blau-schwarzes Ziel illegal. Nach dem Verschenken kann Equip wiederum nicht auf fremdkontrollierte Kreatur zielen. Beide sind deshalb **aus der aktuellen Liste entfernt**, frühere V3-Wertaussagen waren falsch. **Bitterthorn** gibt keinen Schutz und bleibt bei Jons Kontrollwechsel angelegt; sein eigener Auslöser sucht auf Angriffsdeklaration des geschenkten Germs ein Standardland für uns als Equipment-Beherrscher, nicht für den Kreaturenbeherrscher. Mask of Memory wurde in V5 durch Windfall ersetzt; seit V7 nimmt stattdessen Ebon Drake den Slot ein.
6. **Bitterthorn:** Beim ETB eigener 0/0-Germ mit ausgerüstet +1/+1; vor Ende des Zuges kann Jon ihn mit 2 Marken als 3/3 an Gegner geben. Die Ausrüstung bleibt unsere; der Land-Auslöser ist ihre eigene Fähigkeit (nicht der Kreatur verliehen). Wir kontrollieren ihn und durchsuchen unsere Bibliothek, auch wenn der Gegner den Germ kontrolliert. Nach Verbrauch der sieben Basics gibt es kein weiteres Land. Kein Schaden erforderlich.
7. **Spellseeker:** Der Manawert XBB beider Finisher **Torment of Hailfire/Exsanguinate ist in der Bibliothek 2**. Deshalb kann Spellseeker sie direkt suchen. Alternativ findet sie Demonic Tutor, Diabolic Intent, Cyclonic Rift, Mana Drain und zahlreiche weitere ≤2-Spells. Diabolic Intent bezahlt man mit einem **noch unter unserer Kontrolle stehenden** zulässig opferbaren Token.
8. **Sheoldred-Falle:** Jon-Draws sind unser Kartenziehen; **Sheoldred heilt uns**, verursacht dabei keinen Schaden. Sie bestraft **gegnerische** Zieheffekte; Faerie Mastermind kann diese auch ohne Windfall auslösen. **Psychosis Crawler** lässt für jeden unserer Kartenzüge jeden Gegner **1 Leben verlieren**. Das ist kein Schaden und kann nicht durch reine Schadensverhinderung gestoppt werden. Die bisherige Windfall-Burstlinie mit Sheoldred, Crawler und aktivierter Bloodchief Ascension ist in V7 bewusst entfallen. Wretched Anurid und Ebon Drake erzeugen stattdessen eigenständigen, häufig wiederkehrenden Lebensverlust.
9. **Archfiend:** Ölmarken gehen beim Übergeben nicht verloren. Nach vier Upkeeps mit reduzierten Ölmarken verliert der jeweilige Beherrscher die Partie. Wird die Kreatur nach Ausscheiden ihres Empfängers wieder von uns kontrolliert, kann die nächste Ölreduzierung uns treffen. Despotic Scepter, Pongify, Reality Shift, Deadly Rollick oder Rift als Rettung behalten.
10. **Fehlkandidaten:** Master of Cruelties hat rote Farbidentität und ist in U/B **illegal** (Review #30 P2). Bronze Bombshell kann nach Jon-Übergabe wegen „can't be sacrificed“ ihre Opfer-Schadensfähigkeit nicht erfüllen; keine stabile Engine. Plague Reaver löst bereits beim eigenen Endstep Opferdruck auf uns aus, ehe Jon die Kreatur übergeben kann.
11. **Lord Skitter & Token:** Ratentoken entsteht zu Beginn **unseres** Kampfsegments und kann später desselben Zuges verschenkt werden. Ophiomancer produziert auch im fremden Upkeep, sofern wir keine Schlange kontrollieren. Geschenk-Tokens werden danach ohne weitere ETB-Fähigkeiten zu eigenen Jon-Draw-Trägern.
12. **Crypt Ghast:** Extort-Hybridpips in Reminder-Text machen die Identität nicht weiß; die Oracle-Farbidentität ist rein Schwarz. Es erzeugt extra B für jeden für Mana getappten Swamp, mit Urborg auch auf fast sämtlichen anderen Ländern; Cabal Coffers kann zusätzlich viel schwarzes Mana liefern.
13. **Braids/Ascension – überprüfter P2-Regelfix:** Beide nutzen unsere Token und nicht opferbare Jon-Geschenke als Druckmittel, aber **Braids' Lebensverlust im eigenen Endsegment kann keine Quest-Marke auf Bloodchief Ascension für eben dieses Endsegment erzeugen**. Ascension hat eine **intervening-if**-Bedingung: Ein Gegner muss schon **bei Beginn des Endsegments** mindestens 2 Leben verloren haben, andernfalls triggert sie überhaupt nicht. Bei **bereits drei Quest-Marken** löst dagegen jede echte nontoken Karte, die ein Gegner durch Braids opfert und in den Friedhof legt, die Lebensverlustfähigkeit aus. Opferte Tokens sind keine Karten. Braids darf unsere bereits verschenkten, fremdkontrollierten Kreaturen nicht selbst opfern.
14. **Maze/Metamorph:** Maze verhindert Kampf-Schaden und lässt Angriffstrigger bestehen (Wizards Regel 506.4b), aber die +2/+2-Marken machen mehrere Geschenke immer noch gefährlich. Metamorph kann beliebige Artefakte oder Kreaturen als Artefaktkopie übernehmen, einschließlich unserer negativen Geschenke; als Kopie eines legendären Jons ohne besondere Legendenregel-Ausnahme kann es nicht zusätzlich zu Jon bleiben.
15. **V7-Geschenke – Wretched Anurid und Ebon Drake:** Bei Wretched Anurid ({1}{B}) bedeutet **jede andere eintretende Kreatur** einen Lebensverlust 1 für dessen jeweiligen Beherrscher, auch beim Eintritt unserer Ophiomancer-/Lord-Skitter-Tokens, während der Gegner den Anurid kontrolliert. Ebon Drake ({2}{B}) verursacht Lebensverlust 1 für seinen jeweiligen Beherrscher, **wenn irgendein Spieler einen Spell wirkt**; nicht nur Gegner. Der Kontrollwechsel durch Jon löst keinen Eintrittseffekt aus. Vor einer Übergabe treffen diese Pflichten uns; danach den Empfänger. Bei nur zwei Spielern drohen die mit +2/+2 versehenen Körper wieder uns anzugreifen – Scepter, Maze und Spot-Removal einplanen. Der frühere Hexmage/Archfiend-Soforttimer fehlt nun.
16. **Skullclamp / Urza's Saga:** Skullclamp an einer eigenen 1/1-Tokencard lässt diese unmittelbar sterben und zieht uns 2; dies **verbraucht** den Jon-Geschenkträger. An robusten geschenkten Kreaturen kann es verbleiben, da der Auslöser der **von uns kontrollierten Ausrüstung** auch bei gegnerischer Kreaturenkontrolle uns ziehen lässt. Saga sucht beim letzten Kapitel direkt {0}/{1}-Artefakte, hier Skullclamp, Scepter, Sol Ring und Expedition Map; danach geht das Mana-Land verloren.

## 3. Einzelkartenwertung der tatsächlich enthaltenen V7-Karten

A = strategisch tragend, A− = stark bei passendem Board, B+ = situativ nützlich und B = metagameabhängig. **Jeder der 95 aktuellen, unterschiedlichen Kartennamen einschließlich Basics ist einzeln bewertet; ältere Karten gehören nur in die Versions-/Austauschanalyse.**

| Karte | Wertung | Konkreter Beitrag / relevante Grenze |
|---|:---:|---|
| Jon Irenicus, Shattered One | A | Gibt per Endstep dauerhafte nicht opferbare Goad-Geschenke; Angriffe unserer fremdkontrollierten Kreaturen erzeugen pro Jon Karte; vier Mana und removal-anfällig. |
| Lord Skitter, Sewer King | A- | Jeden eigenen Kampfbeginn 1/1-Rat ohne Menace mit „kann nicht blocken“ zum Verschenken; nur ein anderer neu eintretender eigener Rat löst Skitters Friedhofsexil aus. Kein sofortiger Angriff des neuen Tokens. |
| Braids, Arisen Nightmare | A | Wiederkehrender Endstep: selbst kontrollierten Snake/Rat/Faerie opfern, jeder Gegner opfert gleichartigen Permanenttyp oder verliert 2 Leben und wir ziehen je eine Karte. Geschenkte unsacbare Körper können nicht als Kosten der Gegner dienen. |
| Archfiend of the Dross | A-/risk | Öl-Uhr versenkt Spieler nach vier Empfänger-Versorgungssegmenten; bei Rückfall an uns lebensgefährlich, instant-speed Removal zurückhalten. |
| Baleful Strix | A | 2 Mana Karte und Deathtouch-Blocker, im Notfall als harmloser Attack-Draw-Träger verschenkbar. |
| Spellseeker | A | Findet u. a. beide X-Finisher (Bibliotheks-MV 2), Demonic Tutor, Diabolic Intent, Cyclonic Rift, Mana Drain oder billige Antworten; nach ETB notfalls Geschenkkörper. |
| Desecration Elemental | A- | Zwingt zu Kreaturenopfer bei JEDEM Spruch; wegen Jon nicht selbst opferbar, hohe Unterdrückung. Ohne andere Kreaturen und bei Angriffen gegen uns gefährlich. |
| Ebonblade Reaper | A-/risk | Angriff halbiert Lebenspunkte des jeweiligen Beherrschers; Morph und Kampfgegner-Halbierung, in Heads-up sofort kontrollieren. |
| Thought Eater | A- | Für nur 1U fliegender Geschenk-Körper, reduziert maximale Handkartenzahl des Empfängers dauerhaft um 3; vor Übergabe gilt Nachteil uns. |
| Wretched Anurid | A-/risk | {1}{B}, 3/3: Bei **jeder anderen Kreatur**, die ins Spiel kommt, verliert sein jeweiliger Beherrscher 1 Leben; Tokenmotoren und gegnerische Boards skalieren. Vor Jon-Übergabe trifft es uns; mit Jon 5/5 im Duell gefährlich. |
| Ebon Drake | A-/risk | {2}{B}, 3/3 fliegend: Bei **jedem von irgendeinem Spieler gewirkten Zauber** verliert sein jeweiliger Beherrscher 1 Leben. Gut gegen Spell-/Control-Decks, unter unserer Kontrolle ebenso schädlich; nach Jon 5/5-Flieger als Duell-Risiko. |
| Flesh Reaver | B+ | 4/4 für 2 Mana; bei Schaden gegen Spieler/Kreatur erleidet Empfänger gleich viel, aber 6/6 durch Jon-Marken droht uns. |
| Grid Monitor | A- | Sperrt Kreaturensprüche des Empfängers, 4/6-Druckkörper. Gegen viele Spells weniger effektiv. |
| Faerie Mastermind | A | Wiederholbarer unabhängiger Draw-Engine gegen zweite Karten anderer; Flash, aktiviert gemeinsamen Draw für Sheoldred/Crawler. |
| Nadir Kraken | A- | Bei beliebigem eigenem Kartenziehen und Zahlung 1 wachsende Tentakel-Token; Synergie mit mehreren Jon-Kopien, früh manahungrig. |
| Ophiomancer | A | Erzeugt bei kontrollierter Schlangenlosigkeit in jedem Upkeep neues Token, nach Schenkung stetig nachproduzierbar. |
| Phyrexian Negator | B+ | Nach erlittenem Schaden verliert Empfänger andere Permanents; Jon verhindert Selbstopfer, Schutz vor Damage-basierter Selbstgefährdung nötig. |
| Phyrexian Metamorph | A- | Kopiert für {3} und 2 Lebenspunkte oder {3}{U} einen passenden Geschenk-Golem/Archfiend oder ein Mana-Artefakt. Als Jon-Kopie ohne legendäre Ausnahme wegen Legendenregel nur einer; flexibel, aber vom Board abhängig. |
| Psychosis Crawler | A- | Jeder eigene Kartenzug lässt jeden Gegner 1 Leben verlieren (kein Schaden), maximiert Jon-Engine ohne Kampferfolg; fragil gegen Removal. |
| Rotting Regisaur | A- | Erzwungener Kartenabwurf bei jedem gegnerischen Upkeep; 7/6 minus Jons Marken 9/8 kann uns rasch töten. |
| Sygg, River Cutthroat | A- | Zieht am Ende jedes Zugs mit mindestens 3 Lebensverlust eines Gegners optional eine Karte; von großen goaded Angriffen unabhängig von Jon nutzbar. |
| Sheoldred, the Apocalypse | A | Eigene Jon-Draws HEILEN uns um 2, gegnerische Draws verursachen deren 2 Lebensverlust; eigenständiger Kill mit Faerie Mastermind, nicht Jon-Psychosis-Verwechslung. |
| Roaming Throne | A | Wähle Wizard für Jon: doppelte Endstep-Geschenke und doppelte Draw-Trigger; verlangt verfügbare eigene Kreaturen/Token zum tatsächlichen Verschenken. |
| Steel Golem | A- | Dreimanalock verhindert Kreaturensprüche; ein starkes Early-Geschenk ohne Treasures, aber 3/4 später Druck auf uns. |
| Talion, the Kindly Lord | A | Unabhängiger Kartenzug/Life-Loss bei gewähltem Manawert oder Power/Toughness von gegnerisch gewirkten Spells; sollte unter unserer Kontrolle bleiben. |
| Crypt Ghast | A- | Verdoppelt Mana beim Tappen von Swamps, extort als Lebenspunkt-Finisher; mit Urborg/Coffers explodieren X-Zauber, ohne Swamps eingeschränkt. |
| Spark Double | A | Nichtlegendäre Kopie von Jon oder anderem eigenen Kernstück, erzeugt zusätzliche Schenkungs- und Draw-Trigger; braucht bereits gutes Kopierziel. |
| Sakashima of a Thousand Faces | A | Kopiert Jon ohne Legendenregel-Konflikt, verdoppelt bei Vorhandensein beider Jons Schenkungen und Kartenziehen; kostet vier Mana. |
| Sol Ring | A | Effizienter farbloser Früh-Ramp zu Jon, Ausrüstung, großen Finishern. |
| Arcane Signet | A | Zwei-Mana-Farbfixing für UU und BB. |
| Dimir Signet | A | Zwei-Mana-Beschleunigung U/B, benötigt weiteres Mana zum Aktivieren. |
| Talisman of Dominance | A | Zwei-Mana-Farbfixing, gelegentlich 1 eigener Lebenspunkt. |
| Fellwar Stone | A- | Früher fixer Ramp, U/B abhängig von Gegnerländern. |
| Mind Stone | A- | Zwei-Mana-Ramp, später zyklisch Karte ziehen. |
| Thought Vessel | B+ | Zwei-Mana-Ramp, unbegrenzte Hand schützt Jon-Draw-Überschuss. |
| Expedition Map | A | Sucht je nach Bedarf Homeward Path, Cabal Coffers oder Urborg für Mana-/Sicherheitspläne. |
| Rhystic Study | A | Game Changer 1: massiver Kartenvorteil; erzeugt politisch zusätzliche Steuern. |
| Mystic Remora | A- | Effizientes Noncreature-Draw gegen schnelle Spells; kumulativer Upkeep steigt. |
| Bloodchief Ascension | A | B-Kosten, lädt über 2+ gegnerischen Lebensverlust in jeweiligen Zügen bis drei Quest-Marken. Danach echter gegnerischer Karten-Friedhofseintrag: 2 Lebensverlust/2 eigener Lebensgewinn; Tokens zählen nicht. Nicht von Jon abhängig. |
| Bitterblossom | A- | Je Zug Flug-Token als Blocker, Schwertträger oder Geschenke; eigener Lebensverlust bleibt. |
| Black Market Connections | A | Flexible Auswahl Treasure, Karten und Shapeshifter; kostet eigene Lebenspunkte. |
| Bitterthorn, Nissa's Animus | A | Erzeugt eigenes Germ-Token; mit Jon direkt als 3/3-Geschenk. Bleibt als unser Equipment angelegt; sein eigener Angriffsauslöser sucht für uns ein Basic getappt (7 Basics). Nur Equipment-Kontrollwechsel verlagert künftige Auslöser; Equip {3} zielt nur auf eigene Kreaturen. |
| Irenicus's Vile Duplication | A | 4-Mana-Sorcery auf eigenen Jon schafft nichtlegendäre fliegende Tokenkopie mit allen Geschenk-/Ziehtriggern dauerhaft. **Gezielter** Spruch: Jon mit angelegten Lightning Greaves (Shroud) ist nicht zulässig, zuvor Greaves umlegen; kann durch Removal auf das Ziel vereitelt werden. |
| Despotic Scepter | A | Nur ein Mana **beim Ausspielen**, aktivierte Fähigkeit kostet **allein Tappen** (kein Mana); zerstört Permanent in unserem Eigentum selbst unter Gegnerkontrolle. Not-Aus im Heads-up auch ohne freie Länder. |
| Diabolic Intent | A | Nur 1B sucht exakt ein beliebiges Ziel, bezahlt durch vorher noch selbst kontrollierten Token; nie mit nicht opferbarer geschenkter Kreatur finanzieren. |
| Lightning Greaves | A- | Haste und Shroud für Jon, lässt sich günstig auf andere Kreaturen umlegen; Shroud blockiert eigene Zielspells/Ausrüsten bis umgerüstet. |
| Torment of Hailfire | A | Eigenständiger skalierbarer X-Finisher, Gegner wählen Discard/Sac/Lebensverlust; kein Coop-Bedarf. |
| Exsanguinate | A | Eigenständiger globaler Drain, stabilisiert eigenes Leben; mit Coffers in großen Endspielen. |
| Propaganda | A- | Gegner müssen 2 pro Kreatur bezahlen, um uns anzugreifen; Goad erzwingt keinen Kosteneinsatz und kann den Angreifer stoppen. |
| Swiftfoot Boots | A- | Hexproof und Haste für Jon, Equip 1; schützt zentrale Schenkungsengine vor gezieltem Removal, nicht vor Sweepern. |
| Demonic Tutor | A | Game Changer 2: exakter Tutor für Schutz/Finisher/Emergency Removal. |
| Cyclonic Rift | A | Game Changer 3: einseitiger Overload-Bounce gegen gegnerische Boards; gegen Geschenk-Plan widersprüchlich, im Finale stark. |
| Toxic Deluge | A- | Vielseitige Boardkontrolle gegen Aggro und Gifts, bezahlt eigenes Leben. |
| Aetherize | A- | Duel/aggro Verteidigung; verschenkte Angreifer kehren als unsere Eigentums-Karten zurück auf Hand. |
| Skullclamp | A | {1} mit Equip {1}, macht eigene 1/1-Faerie-, Rat- und Snake-Token durch −1 Widerstand sofort tot und zieht uns zwei Karten. An stärkeren geschenkten Körpern bleibt Ausrüstung angelegt und zieht bei deren Tod uns zwei Karten. Verbraucht aber Token, die Jon/Braids ebenfalls benötigen. |
| Feed the Swarm | A- | Schwarzes Kreaturen- und Verzauberungsremoval, eigene Lebenspunkte kosten. |
| Deadly Rollick | A | Spot-Exil unabhängig von Schadensresistenz, häufig kostenlos mit Jon. |
| Mana Drain | A | UU-Counter universal und potenzieller farbloser Manaschub in der nächsten eigenen Hauptphase; funktional stärker als Counterspell. |
| Arcane Denial | A- | Zuverlässiger 1U-Counter, zieht Gegnern Karten; mit Sheoldred ein Vorteil. |
| Swan Song | A | Einmanaiger U-Konter nur gegen Enchantment-, Instant- oder Sorcery-Spells (nicht gegen Kreaturen/Artefakte/Planeswalker); hinterlässt gegnerischen 2/2-Flieger. |
| Pongify | A | Ein-Mana Instant Remove ohne Farbenbeschränkung, gibt 3/3-Affe. |
| Reality Shift | A | Exilt auch indestructible Geschenke, hinterlässt Manifest. |
| Malakir Rebirth | B+ | Schützt eigene Kreatur vor Destroy, MDFC als getapptes schwarzes Land möglich; bei geschenktem Ziel nicht ideal. |
| Command Tower | A | Perfektes Commandersland, beide Farben. |
| Exotic Orchard | A- | Mehrfarbig meist U/B am Tisch, nicht garantiert. |
| Underground Sea | A | Ungetappte U/B-Dualquelle, fetchbar und papiergedruckt. |
| Watery Grave | A | U/B-Schockdual, fetchbar, gelegentlich 2 Leben. |
| Morphic Pool | A | In Multiplayer häufig ungetapptes U/B. |
| Undercity Sewers | B+ | Fetchbares U/B-Surveilland, kommt getappt. |
| Drowned Catacomb | A- | Checkland, meist ab zweitem Zug ungetappt. |
| Shipwreck Marsh | A- | Slowland, spätes ungetapptes U/B. |
| Sunken Hollow | A- | Fetchbares Land, mit 2 Basics ungetappt. |
| Underground River | A | U/B-Painland für frühe Countermana. |
| Polluted Delta | A | Sucht U/B-Island-/Swamp-Duals und Basics. |
| Flooded Strand | A- | Kann unter anderem Watery Grave oder Underground Sea als Island suchen. |
| Marsh Flats | A- | Sucht U/B-Swamps und Basics. |
| Scalding Tarn | A- | Sucht Island-Duals und Island. |
| Verdant Catacombs | A- | Sucht Swamp-Duals und Swamp. |
| Misty Rainforest | A- | Sucht Island-Duals und Island. |
| Prismatic Vista | A- | Sucht Basic und verbessert Fixing, keine Doppelländer. |
| Fabled Passage | B+ | Sucht Basics, vor vier Ländern getappt. |
| Clearwater Pathway | A- | Entscheidung U oder B beim Ausspielen, zwei Länderfaces in einer Karte. |
| Swamp | A | Drei B-Basics (statt zwei) zur Stärkung von Coffers/Crypt Ghast und Bitterthorn-Landtriggern. |
| Sunken Ruins | A- | Filtert bereits bestehende Manaquelle in U/B, kann aus farblosem allein nicht beide Farben erzeugen. |
| Island | A | Vier U-Basics (statt drei) für frühen Draw-/Counter-Mana und Bitterthorn-Landtrigger; durch Fetchländer suchbar. |
| Choked Estuary | B+ | U/B often ungetappt mit passendem Land zur Offenlegung, sonst getappt. |
| Otawara, Soaring City | A | Ungetapptes U, als Kanal-Fähigkeit vielseitiger Bounce auch unserer Geschenk-Gefahren. |
| Takenuma, Abandoned Mire | A- | Schwarze Quelle mit Graveyard-Recursion per Channel. |
| Maze of Ith | A | Nach Deklaration eines gegnerischen Angriffs enttappen und dessen Kampfschaden verhindern, ohne Jon-Draw oder Angriffsauslöser rückgängig zu machen. Produziert ohne Urborg kein Mana; Expedition Map findet es. |
| Homeward Path | A | Schlüssel-Sicherheitsland zum Zurückholen aller eigenbesessenen Kreaturen; nicht unkritisch bei Negativträgern. |
| Urza's Saga | A- | Saga-Land: temporäres farbloses Mana, optional Construct als Geschenkträger und bei Kapitel III Tutor direkt aufs Feld für Skullclamp, Despotic Scepter, Expedition Map oder Sol Ring ({1}). Geht dann verpflichtend verloren; kein Farbfixing und Command Beacon entfällt. |
| Bojuka Bog | A- | Friedhofsexil eines Spielers beim ETB; getapptes schwarzes Land. |
| Urborg, Tomb of Yawgmoth | A | Macht alle Länder zu Swamps; zusammen mit Coffers größere X-Finisher. |
| Cabal Coffers | A | Ab ausreichend Sümpfen gewaltiger schwarzer Ramp, frühe Hand verlangsamend. |
| Castle Locthwain | B+ | Kartenziehen im Midgame, kostenabhängiger eigener Lebensverlust. |

## 4. V3 → V4: 17 tatsächliche Eins-zu-eins-Tausche

| Heraus | Hinein | Warum ist das Deck danach besser? |
|---|---|---|
| Abyssal Persecutor | Lord Skitter, Sewer King | Kein eigener X-Spell-Lock mehr; preiswerter eigener Rat-Token-Strom und Graveyard-Hate; weniger politisches Spielverbot. |
| Demonic Taskmaster | Spellseeker | Situativer Opferzwang gegen flexible Suche nach X-Finisher/Counter/Removal. |
| Evil Eye of Orms-by-Gore | Thought Eater | Fünf-Mana-Nicht-Eye-Angriffsstop blockiert eigene Jon-Draws; günstiger Handlimit-Lock. |
| Evil Eye of Urborg | Thought Nibbler | Zweiter schädlicher Angriffsstop durch einmanaiges fliegendes Geschenk mit Handlimit-Reduktion ersetzt. |
| Ebon Drake | Sygg, River Cutthroat | Kleiner Lifedrain für Empfänger gegen mehrfachen eigenen Kartenvorteil über gegnerische Lebensverluste. |
| Sower of Discord | Roaming Throne | Sechs Mana politischer Schaden vs vier Mana Multiplikator von Jon und anderen Wizard-Triggern. |
| Bloodthirsty Blade | Crypt Ghast | Separater Goad auf nicht-eigene Kreaturen gestrichen, dafür schwarze Manaexplosion für X-Finisher und Extort; Politikverlust bewusst. |
| Teferi's Ageless Insight | Spark Double | Verdoppelung nur eigener Extra-Draws vs zusätzlicher nichtlegendärer Jon mit Endstep-Gabe und Draw. |
| Sword of Fire and Ice | Bitterthorn, Nissa's Animus | Blau-Protection verhindert Jon-Ziel; Bitterthorn bringt eigenen Germ und Land-Angriffstrigger für uns. |
| Sword of Feast and Famine | Strionic Resonator | Schwarz-Protection verhindert Jon-Ziel; Resonator kopiert Jońs Endstep-/Ziehtrigger. |
| Quietus Spike | Despotic Scepter | Schaden-Halbierung erfordert Treffen und Equip 3; Scepter entfernt unsere gefährlichen Geschenke zuverlässig auch in Heads-up. |
| Court of Ambition | Diabolic Intent | Monarch-/Discard-Wert gegen schnelle gezielte Suche, finanziert durch eigene tokenbasierte Engines. |
| No Mercy | Swiftfoot Boots | Reactive Strafe nach Schadenseingang gegen präventiven Commander-Schutz und Haste; Schutz gegen Aggro leicht geschwächt. |
| Wrong Turn | Sakashima of a Thousand Faces | Fremde Kreatur umverteilen ohne Jon-Draw vs zusätzliche Jon-Gabe/Draw und Legendenregel-Abschirmung. |
| Counterspell | Mana Drain | Gleiche UU-Universalantwort, zusätzlich Mana für künftige Züge; kein Game Changer nach aktuellem Scryfall-Flag. |
| River of Tears | Swamp | Unplanbare Farbe vs verlässliches Basic, mehr Ziele für Bitterthorn sowie Coffers/Crypt Ghast. |
| Darkwater Catacombs | Island | Muss anderes Mana filtern; Basic als direktes U und weiteres Bitterthorn-Ziel. |

**Wichtigste Gegenargumente:** Der Wegfall von **No Mercy** verschlechtert eine sichere, aber nur *nach* Schaden reagierende Abschreckung gegen Aggro. Ohne die zwei Evil Eyes fehlt eine spezielle globale Angriffssperre, die jedoch auch unsere eigenen verschenkten Kreaturen am Draw-Trigger hinderte. Ohne Court of Ambition entfällt die Monarch-Karte und zusätzliche Handzerstörung, dafür ist zielgenaue Suche billiger. Weniger gesondertes Goad gegenüber nicht-eigenen Kreaturen nach Bloodthirsty Blade; Jon goadet eigene Geschenke ohnehin dauerhaft. Mehr Jon-Kopien sind ohne Tokenversorgung und gegen Boardwipes keine unabhängige Siegstrategie.

### V4 → V5: genau fünf zusätzliche, überprüfte Ein-zu-eins-Wechsel

| Heraus | Hinein | Entscheidung und bewusst aufgegebener Nutzen |
|---|---|---|
| Assault Suit | Maze of Ith | Maze wird erst nach Angreiferdeklaration eingesetzt und erhält so Jons Attack-Draw bei präventivem Kampfschadenschutz; über Expedition Map suchbar. Es schützt nur vor genau einem Angriff und produziert ohne Urborg kein Mana. Assault Suit verbot den Angriff auf uns bereits bei der Deklaration und beendete damit im Duell unsere Draw-Engine. |
| Greater Harvester | Phyrexian Metamorph | Keine sperrige 5-Mana/BBB-Upkeep-Opferwaffe mehr: Metamorph ist flexibler Geschenk-Duplikator oder Kopie eines Ramp-Artefakts für effektiv drei Mana plus zwei Leben. Konkreter Verlust: direkter permanenter Opferzwang beim Gegner. |
| Thought Devourer | Bloodchief Ascension | Vierter Mana-Slot mit doppeltem Blau für redundant verkleinerte Hand gegen Einmana-Attrition-Engine; weiterhin Handlimit −2/−3 über Nibbler/Eater. Ascension benötigt drei separate Endstep-Bedingungen und echte Karten im gegnerischen Friedhof. |
| Mask of Memory | Windfall | Zusätzliche Kampfschadensbedingung für Draw entfällt; Windfall erzeugt unabhängig von Combat eine neue Hand und kann mit Sheoldred, Psychosis Crawler oder aktiver Ascension direkt Lebenspunkte kosten. **Gegenargument:** Auch Combo-Gegner ziehen neue Karten, wenn der Einsatz zu früh erfolgt. |
| Reins of Power | Braids, Arisen Nightmare | Der einmalige, vier Mana teure Kampftausch entfällt zugunsten wiederholter Opfer-/Draw-Entscheidungen über eigene Token im Endsegment. Braids und Jon erfordern **unterschiedliche** noch selbstkontrollierte Kreaturen, wenn beide Trigger genutzt werden sollen. |

**Weitere bewusste Nichtaufnahmen:** Blasphemous Edict (globale Opferung kann unseren Jon und unsere Engine treffen, während geschenkte Nichtopfer-Kreaturen überleben); Phyrexian Soulgorger (geschenkt scheitert sein Selbstopfer und gibt dem Gegner oft bloß einen 10/10-Body); Coveted Falcon (massengeschenkte Körper ohne Jon-Goad bleiben frei opferbar und müssen nicht angreifen); Parasitic Impetus (nützlich, aber langsamerer Einzelkreaturen-Lebensdrain als Ascension/Windfall); Consecrated Sphinx und The One Ring (beide aktuell zusätzliche Game Changer, kein Slot frei). Keiner dieser Punkte ist ein pauschales Bannurteil: das ist die konkrete V5-Deckpriorisierung.

### V5 → V6: vier echte 1:1-Tausche ohne Veränderung der Mana-Kurve

| Heraus | Hinein | Größter Nutzen / stärkstes Gegenargument |
|---|---|---|
| Illusionist's Gambit | Skullclamp | Wiederholbare 2-Karten-Engine aus 1/1-Spielsteinen von Ophiomancer, Bitterblossom und Lord Skitter. Anders als der entfernte einmalige Kampftrick ist Clamp **dauerhaft** und über Urza's Saga suchbar. Gegenargument: Verbrauchte Tokens stehen Jon/Braids nicht mehr als Geschenke/Opfer zur Verfügung; Aetherize bleibt der Notfall-Massenkampftrick. |
| Strionic Resonator | Irenicus's Vile Duplication | Nichtlegendäre Jon-Kopie triggert **jede Runde** selbst Gifts und Draw, statt nur einen Trigger gegen {2} und Tappen zu kopieren. Gegenargument: 4 Mana Sorcery mit Kreaturenziel; Lightning-Greaves-Shroud und Instant-Removal können es verhindern, während Resonator außerhalb von Jon vielseitig war. |
| Thought Nibbler | Vampire Hexmage | Ein redundanter 1-Mana-Handlimit-Lock entfällt zugunsten einer **sofortigen Ölmarken-Entfernung** am bereits verschenkten Archfiend of the Dross und gegen fremde Planeswalker. Gegenargument: BB statt U, keine eigenständig gute schädliche Jon-Geschenk-Kreatur, benötigt ein sinnvolles Markenziel. |
| Command Beacon | Urza's Saga | Ein Land wird zum Tutor für vier Kernartefakte ({1}), kann Construct-Token zur Jon-Übergabe liefern und bietet temporäres {C}. Gegenargument: **nach III geopfert**, keine Farbquelle, Command Beacon als Schutz vor wiederholter Commander-Tax entfällt. |

**Bestes Gegenargument gegen V6 insgesamt:** Jon-Kopien sind ohne funktionierenden Jon, ausreichende Tokenerzeugung oder gegen häufige Boardwipes nicht sofort spielstärker. Mit Saga verlieren wir nach Kapitel III eine Manaquelle, was zweifarbige Antworten erschweren kann. Gegen Spell-Combo ist eine weitere freie Konterkarte wie Force of Negation denkbar, doch gegenüber Skullclamp/Hexmage/Kopiermotor ist in dieser Version der Zusatznutzen nicht groß genug, um einen weiteren bewährten Slot zu opfern. **Kein praxisbasierter Beleg eines höheren Winrates**.

### V6 → V7: zwei Slotwechsel für höhere dauerhafte Geschenkqualität

| Heraus | Hinein | Entscheidung / Gegenargument |
|---|---|---|
| Vampire Hexmage | Wretched Anurid | Eine nur mit Archfiend bzw. Marken-Zielen starke Utility-Kreatur wird zu einem frühen eigenständig unangenehmen Geschenk, das selbst unsere laufende Tokenproduktion in gegnerischen Lebensverlust umwandelt. Verloren: Hexmage/Archfiend-Timerabkürzung und Marken-Removal; Wretched verursacht Lebensverlust bei uns vor Übergabe. |
| Windfall | Ebon Drake | Ein riskanter symmetrischer Wheel ohne garantierten Payoff wird zu einem fliegenden, bei jedem Spell auslösenden Geschenk. Verloren: starke Sheoldred-/Crawler-/Ascension-Burstspitzen und Handauffüllung; ein 5/5-Flieger wird im Heads-up gefährlich. |

**Nicht gestrichen:** Psychosis Crawler, Irenicus's Vile Duplication, Roaming Throne, Spark Double, Sakashima, die fünf Tokenmotoren, alle sieben Ramp-Artefakte und die unabhängigen X-Finisher. Zusätzliche Jon-Trigger sind nur dann wertvoll, wenn ausreichend gute Geschenke oder Tokens vorhanden sind. **Geschenkqualität steigt um zwei schädliche Triggerkörper; Kreaturenzahl netto von 26 auf 27.** Mana-Kurve unverändert, drei Game Changer unverändert. Kein Nachweis eines höheren Winrates.

## 5. Historische echte Deckstände (nicht nachträglich konstruiert)

- **V1**: erste 100-Karten-Liste, enthielt unpassende teure Geschenke und illegalen roten The Reaver Cleaver.
- **V2**: sechs Kartenwechsel inklusive Legalitätskorrektur; Faerie Mastermind, Thought Devourer und Fellwar Stone statt situativerer Alternativen.
- **V3**: Plague Reaver wegen vor der Schenkung ausgelöster eigener Opferfähigkeit durch Greater Harvester ersetzt; Scryfall-legal bestätigt, aber mit nun behobenen drei Codex-P2-Hinweisen.
- **V4**: 17 gezielte Tausche, effizientere Manakurve, mehrfache Jon-Trigger, Commander-Schutz und Notfallzerstörung gegen geschenkte Permanents. Auf GitHub tatsächlich veröffentlicht und **byteidentisch unter versions/2026-10-18-b3-v4.txt** archiviert.
- **V5**: fünf zusätzliche reale Tausche für kontrolliertes Duell, unabhängiges Attrition-Finish, Braids und flexible Kopien; **byteidentisch zum veröffentlichten V5-Git-Commit unter versions/2026-10-18-b3-v5.txt** archiviert.
- **V6 (archiviert)**: vier zusätzliche tatsächliche Tausche für Skullclamp-Kartennachschub, eine zusätzliche nichtlegendäre Jon-Tokenkopie, Hexmage-Archfiend und Saga-Artefaktsuche. Die reale V6-Liste liegt byteidentisch unter `versions/2026-10-18-b3-v6.txt`; ihre Slotentscheidungen und Gegenargumente bleiben als Historie nachvollziehbar.
- **V7 (aktuell)**: Wretched Anurid und Ebon Drake statt Vampire Hexmage und Windfall; mehr dauerhafte Nachteile für Empfänger bei unveränderter Mana-Kurve und bewahrten Kartenzieh-/Token-Engines.

## 6. Gegenproben gegen Aggro, Kontrolle, Combo und Duell

| Gegner | Vorteile der V7 | Stärkster Gegenbeweis / Handlung |
|---|---|---|
| Aggro / Tokens | Ophiomancer-Snakes, Aetherize, Propaganda, Toxic Deluge, gezieltes Exil, wiederholte Rat-/Faerie-Träger | No Mercy gestrichen; ein 9/8 verschenkter Rotting Regisaur tötet uns im Duell schnell. Scepter und Removal vor dem Ausscheiden des vorletzten Gegners reservieren. |
| Control | Thought Eater, Wretched Anurid, Ebon Drake, Rotting Regisaur, Rhystic/Remora, Bloodchief Ascension, dritte Jon-Kopie, niedrige Kurve | Wiederholter Jon-Removal und Wraths nehmen mehreren Kopien gleichzeitig die Draw-Engine. Boots, Countermana und Kartenziehen unabhängig von Jon priorisieren. |
| Kreaturen-Combo | Steel Golem/Grid Monitor verhindern neue Kreaturensprüche; Desecration Elemental bestraft weitere Zauber, günstiges Removal + Mana Drain | Bereits liegende ETB-Combo oder Nichtkreaturenschleife wird nicht durch goad gestoppt; für Schlüsselzug Mana offenhalten. |
| Spell-Combo | Günstigere Suchkarten (Spellseeker, Intent), Swan Song, Arcane Denial, Mana Drain, Rhystic/Remora | Ohne Opposition Agent/Fierce Guardianship/Force of Will gibt es keinen explosiven kostenlosen Combo-Stopp. Bracket/Slots erfordern verantwortbare Zurückhaltung bei allzu vielen Game Changern. |
| Heads-up | Maze of Ith und Despotic Scepter kontrollieren Geschenkkörper, Boots schützt Jon, Aetherize fängt größere Combats; Torment/Exsanguinate, Clamp-Kartennachschub und Ascension bleiben selbständig | Goad zwingt auch 5/5 Wretched Anurid und fliegenden 5/5 Ebon Drake gegen uns, Jon-Kartenziehen fällt nach Zerstörung/Return der Geschenke weg. Vor dem letzten gegnerischen Zug unabhängigen Win-Plan vorbereiten. |

## 7. Messungen, Grenzen und überprüfbarer GitHub-Ablauf

**V3 vorher:** Scryfall 97/97 unterschiedliche Namen, alle farb- und Commander-legal. 100 Karten; 36 Länder; 23 Nicht-Commander-Kreaturen; 40 andere Spells; MV 2,889 (1:6, 2:21, 3:16, 4:15, 5:4, 6:1). 10.000 einfache Seed-20261018-Stichproben von 11 Karten ergaben 31,87 % mindestens 4 Länder und einen ausgewählten Mana-Rock; dies war **keine reale Simulation** von Mulligans, Turns oder Siegen.

**V4 – archivierter historischer Teststand, 18.10.2026:** 100 Karten, **95 verschiedene Kartennamen**, 36 Länder (4 Island + 3 Swamp), 26 weitere Kreaturen, 37 andere Nichtländer. Live-Scryfall Cards/Collection **95/95 getroffen**, alle Commander-legal, alle U/B/neutral. Genau die drei erlaubten Game Changer. Manakurve 8/25/13/15/2, Ø MV 2,651. Historische V3-Datei bytegetreu archiviert; historischer Stand V4 ist jetzt ebenfalls bytegenau abgelegt.


**V5 – frischer Live-Test (18.10.2026):** 100 Karten: Jon, 26 weitere Kreaturen, 36 andere Nichtland-Spells, 37 Landkarten inklusive Maze of Ith (nur 36 ohne Zusatzkarten manaerzeugend). 95 unterschiedliche Oracle-Namen, alle auf Scryfall Commander-legal und innerhalb U/B, ergänzender Papierdruck-Abgleich, genau **drei Game Changer** (Cyclonic Rift, Demonic Tutor, Rhystic Study). Durchschnittlicher Manawert der 62 Nichtland-Nichtcommander-Karten **2,565**, Verteilung 9×MV1, 24×MV2, 15×MV3, 13×MV4 und 1×MV5. Kartenformat und Typsortierung geprüft, nur 4 Island und 3 Swamp mehrfach. 100-Karten-V4-Archiv wurde vom vorherigen Git-Commit übernommen. Keine gemessene Winrate.

**Nachprüfbare kritische Interaktion:** Wizards Comprehensive Rules (Ausgabe 19.06.2026), **506.4b**: Ein bereits deklarierter Angreifer verlässt durch Enttappen nicht den Kampf. **Maze of Ith** verhindert jedoch explizit allen von/zu ihm verursachten Kampfschaden, sodass unser Jon-Draw bereits vor dieser Rettung auslösen durfte. Ohne diese explizite Schadensverhinderung würde bloßes Enttappen nicht reichen.


**V6 – Live-Oracle-/Scryfalltest vom 18.10.2026:** Exakt 100 Karten, **95 unterschiedliche Namen**, 26 Kreaturen neben Jon, 36 sonstige Nichtländer und 37 Länder (Maze ohne Mana, Saga nur vor Kapitel III), alle legal in Commander und Dimir, Papierdrucke verfügbar. **Exakt drei Game Changer**: Cyclonic Rift, Demonic Tutor und Rhystic Study. 62 Nichtland-Nichtcommander-Karten; Verteilung **9×MV1, 24×MV2, 15×MV3, 13×MV4, 1×MV5**, unveränderter Durchschnitt **2,565**. Das V5-Archiv wurde aus dem vorigen Git-Commit unverändert übernommen. Vier bewusste 1:1-Tausche, keinerlei externe Multiplayer-Simulation. Review der aktuellen PR-Revision ist getrennt notwendig.

**V7 – strukturelle und Oracle-basierte Prüfung (20.10.2026):** 100 Karten; 95 eindeutige Namen; **27 weitere Kreaturen**, **35 andere Nichtlandkarten**, **37 Länder**. Nur zwei Änderungen zur archivierten, Scryfall-verifizierten V6; beide Zugänge schwarz, papiergedruckt und Commander-legal. Keine neuen Game Changer: **Cyclonic Rift, Demonic Tutor, Rhystic Study**. Mana-Verteilung **9×MV1, 24×MV2, 15×MV3, 13×MV4, 1×MV5**, **Ø 2,565**. Das V6-Archiv wurde byteidentisch mit dem Vorgänger-Commit verglichen; der Offline-Repo-Validator und alle 35 Regressionstests liefen am 20.10.2026 erfolgreich auf dem PR-Arbeitszweig, zudem `git diff --check`. Keine vollständige neue Scryfall-Collection-Abfrage und kein empirischer Siegquoten-Nachweis. Die vollständige V7-Collection-API-Abfrage ist nicht durch diese Dokumentation allein belegt.

**Regel-Primärbeleg zum achten P2-Gegenargument:** [Wizards, Commander Masters Release Notes – Bloodchief Ascension](https://magic.wizards.com/en/news/feature/commander-masters-release-notes) stellt fest, dass die Voraussetzung **bereits zu Beginn des Endsegments** erfüllt sein muss; Braids' eigener Endstep-Lebensverlust kann sie danach nicht rückwirkend einschalten.

**Ohne empirischen Nachweis:** keine realen Manabrew-Partien, keine gemessene Gewinnrate, keine vollständige Prüfung aller theoretischen Zwei-Karten-Combos. Die Kartenwahl ist eine nachvollziehbare regel- und kurvenbasierte Hypothese. Ein geplanter fairer Praxistest: gegen drei Gegnerprofile je mindestens 10 Partien protokollieren Jon-Einsatz, Anzahl geschenkter Angreifer, Karten per Jon, Siegpfad und die letzte Zweiersituation. Nach künftigem Review ausschließlich neue Commit-Revisionsprüfungen als aktuell anerkennen.

**Quellen:** [Wizards Commander/Brackets](https://magic.wizards.com/en/formats/commander) · [Wizards Jon Irenicus Release Notes](https://magic.wizards.com/en/news/feature/commander-legends-battle-baldurs-gate-release-notes-2022-06-01) · [Scryfall Cards/Collection](https://scryfall.com/docs/api/cards/collection) · [PR #30 inkl. drei P2-Hinweise](https://github.com/alexdermohr/magic/pull/30)

## 8. Review-Nachprüfung vom 20.10.2026

- **Bitterthorn:** Der offene Kommentar verwechselt einen eigenen Equipment-Auslöser
  mit einer verliehenen Kreaturenfähigkeit. Der tatsächliche Text enthält keine
  Formulierung „Equipped creature has …“. Nach CR 301.5d und 603.3a bleiben
  Ausrüstung und Kreatur getrennte Quellen; wir kontrollieren Bitterthorns eigenen
  Auslöser auch nach dem Verschenken der Kreatur. README und Einzelwertung stellen
  Quelle, Suchbibliothek und die Grenze eines Equipment-Kontrollwechsels klar.
  [Offizieller Originaldruck](https://media.wizards.com/2023/mom/en_7d91afa7f2.png),
  [Oracle-Text](https://scryfall.com/card/moc/45/bitterthorn-nissas-animus),
  [Comprehensive Rules](https://magic.wizards.com/en/rules).
- **Thought Nibbler:** Seit V6 entfernt; aktuelle V7-Spielsequenz nennt Thought
  Eater, Anurid und Drake. Nibbler bleibt nur als ausdrücklich historischer Wechsel
  dokumentiert. Kein Archiv wird umgeschrieben.
- **Anurid/Drake:** Jeweiliger Beherrscher verliert Leben, kein Schaden. Die letzte
  unpräzise Schaden-Formulierung in der README ist korrigiert; Schadensverhinderung
  verhindert diese Verluste nicht.
  [Wretched Anurid](https://scryfall.com/card/dmr/109/wretched-anurid),
  [Ebon Drake](https://scryfall.com/card/5dn/48/ebon-drake).

Die 100-Karten-V7 und sämtliche V1–V6-Snapshots bleiben unverändert. Keine zusätzlichen
Game Changer, Infinite- oder Extrazug-Linien wurden eingeführt. Die unabhängige
Nachprüfung beurteilt den belegten Bitterthorn-Widerspruch gesondert.
