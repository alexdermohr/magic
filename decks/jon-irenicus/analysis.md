# Jon Irenicus, Shattered One — Kartenanalyse und Optimierung (Bracket 3)

**Stand: 18.10.2026, V4.** Hauptziel: dauerhaft nachteilige, erzwungen angreifende Geschenke; mehrfacher Jon-Kartenvorteil; eigene Siegbedingungen, auch wenn nur noch zwei Spieler übrig sind. Die Karten sind nach konkreter Synergie bewertet, nicht nach Seltenheit oder Preis. **Keine echten Multiplayer-Spiele oder empirischen Winraten belegt.**

## 1. Messbare Struktur / rechtlicher Deckrahmen

- **100 Karten:** 1 Commander, **26 weitere Kreaturen**, **37 sonstige Nichtlandkarten** (einschließlich MDFC Malakir Rebirth), **36 reguläre Länder**. **95 eindeutige Namen**, übrige Mehrfachkarten ausschließlich 4 Island und 3 Swamp.
- **Drei Game Changer:** Rhystic Study, Demonic Tutor, Cyclonic Rift — gemäß frischer Scryfall-Prüfung. Keine absichtliche frühe unendliche Zweikarten-Siegkombination, keine Extra-Turn-Kette und keine Massenlandzerstörung. Bracket 3 nach Wizards; keine reale Stärke- oder Winrate-Messung.
- **V4-Manakurve** ohne Länder/Commander (63 Karten): **8×MV1, 25×MV2, 13×MV3, 15×MV4, 2×MV5**; Durchschnitt **2,651**. V3 lag bei 2,889 und 27 Karten MV1–2; V4 hat 33. Das verkürzt die frühen Geschenk- und Antwortfenster. Einzelfall-Mulligans nicht simuliert.
- **Aktuelle Live-Validierung:** Scryfall Cards/Collection erkannte alle **95/95 unterschiedlichen Namen**, Commander-Legalität und Farbidentität ausschließlich U/B; zusätzliche Papier-Printings für bei der API digital repräsentierte Karten geprüft. Jede ältere Version bleibt im Archiv (v1, v2 und die tatsächlich zuvor veröffentlichte v3).
- **Restschwächen:** sechs Zwei-Mana-Rocks + Sol Ring für viermanaigen Jon, weiterhin Risiko durch gezieltes Removal und langsames Hauptpaket der 4–5-Mana-Geschenke. Reale Gegnerwahl und tatsächliche Angriffsentscheidungen wurden nicht engine-simuliert.

## 2. Regeln und Synergien auf Basis des aktuellen Oracle-Texts

1. **Jon & Gegnerkontrolle.** „Own“ heißt Eigentümer, nicht aktueller Controller. Deshalb ziehen wir beim Angriff unserer geschenkten Kreatur mit Jon pro vorhandenem Jon einmal. Angriffe zählen bei Deklaration, ohne Kampfschaden. Tokens gehören dem Spieler, der sie erstellt hat. Kein ETB beim Kontrollwechsel; +1/+1-Marken und Goad bleiben.
2. **Goad im Duell.** Bei nur einem Gegner müssen legal angreifende, goadete Körper uns angreifen. Zahlungen für Propaganda sind nie verpflichtend. Angriffssperre durch Assault Suit verhindert dann den Angriff **und unseren Jon-Draw**.
3. **Nicht opferbar heißt nicht unzerstörbar.** Despotic Scepter kann unsere an Gegner verschenkten Permanents mit seiner Tap-Fähigkeit zerstören, obwohl der Empfänger sie nicht opfern darf. Indestructible, Exil und Bounce sind separate Fälle. Homeward Path kontrolliert Geschenke wieder selbst und überträgt damit deren „you“-Nachteile auf uns.
4. **Mehrfache Jon-Trigger.** Roaming Throne wählt bei ETB **Wizard** und verdoppelt ausgelöste Fähigkeiten jedes anderen eigenen Wizards, also die beiden Fähigkeiten Jons. Spark Double kann Jon als nichtlegendäre Kreatur kopieren; Sakashima kopiert ihn samt Legendenregel-Ausnahme. Diese Jons lösen selbst zusätzlich aus. Strionic Resonator kann einzelne auf dem Stapel liegende Jon-Endstep-/Draw-Trigger kopieren. Jeder Geschenk-Trigger benötigt beim Auf-den-Stapel-Legen bereits ein passendes von uns kontrolliertes Kreaturenziel; Doppeltrigger garantieren keine zusätzlichen Körper.
5. **Equipment-Falle, Review #30 P2:** Ein vor Jon ausgerüstetes Sword of Fire and Ice (pro Blau) bzw. Sword of Feast and Famine (pro Schwarz) macht Jons blau-schwarzes Ziel illegal. Nach dem Verschenken kann Equip wiederum nicht auf fremdkontrollierte Kreatur zielen. Beide sind deshalb **aus der aktuellen Liste entfernt**, frühere V3-Wertaussagen waren falsch. Bitterthorn und Mask of Memory geben keinen Schutz und bleiben nach Kontrollwechsel angelegt. Ihr jeweiliger Angriff/Kampfschaden löst ihre unter **unserer** Kontrolle stehende Equipment-Fähigkeit aus (Land bzw. Draw).
6. **Bitterthorn:** Beim ETB eigener 0/0-Germ mit ausgerüstet +1/+1; vor Ende des Zuges kann Jon ihn mit 2 Marken als 3/3 an Gegner geben. Die Ausrüstung bleibt unsere und sucht bei jedem Angriff ein Basic. Nach Verbrauch der sieben Basics gibt es kein weiteres Land. Kein Schaden erforderlich.
7. **Spellseeker:** Der Manawert XBB beider Finisher **Torment of Hailfire/Exsanguinate ist in der Bibliothek 2**. Deshalb kann Spellseeker sie direkt suchen. Alternativ findet sie Demonic Tutor, Diabolic Intent, Cyclonic Rift, Mana Drain und zahlreiche weitere ≤2-Spells. Diabolic Intent bezahlt man mit einem **noch unter unserer Kontrolle stehenden** zulässig opferbaren Token.
8. **Sheoldred-Falle, Review #30 P2:** Jon-Draws sind unser Kartenziehen; **Sheoldred heilt uns**, verursacht dabei keinen Schaden. Sie bestraft **gegnerische** Zieheffekte. **Psychosis Crawler** verursacht bei unseren Draws Schaden an jedem Gegner. Faerie Mastermind kann in Kombination mit Sheoldred beide Seiten auslösen.
9. **Archfiend:** Ölmarken gehen beim Übergeben nicht verloren. Nach vier Upkeeps mit reduzierten Ölmarken verliert der jeweilige Beherrscher die Partie. Wird die Kreatur nach Ausscheiden ihres Empfängers wieder von uns kontrolliert, kann die nächste Ölreduzierung uns treffen. Despotic Scepter, Pongify, Reality Shift, Deadly Rollick oder Rift als Rettung behalten.
10. **Fehlkandidaten:** Master of Cruelties hat rote Farbidentität und ist in U/B **illegal** (Review #30 P2). Bronze Bombshell kann nach Jon-Übergabe wegen „can't be sacrificed“ ihre Opfer-Schadensfähigkeit nicht erfüllen; keine stabile Engine. Plague Reaver löst bereits beim eigenen Endstep Opferdruck auf uns aus, ehe Jon die Kreatur übergeben kann.
11. **Lord Skitter & Token:** Ratentoken entsteht zu Beginn **unseres** Kampfsegments und kann später desselben Zuges verschenkt werden. Ophiomancer produziert auch im fremden Upkeep, sofern wir keine Schlange kontrollieren. Geschenk-Tokens werden danach ohne weitere ETB-Fähigkeiten zu eigenen Jon-Draw-Trägern.
12. **Crypt Ghast:** Extort-Hybridpips in Reminder-Text machen die Identität nicht weiß; die Oracle-Farbidentität ist rein Schwarz. Es erzeugt extra B für jeden für Mana getappten Swamp, mit Urborg auch auf fast sämtlichen anderen Ländern; Cabal Coffers kann zusätzlich viel schwarzes Mana liefern.

## 3. Einzelkartenwertung der tatsächlich enthaltenen V4-Karten

A = tragend, A− = stark mit Voraussetzung, B+ = situativer Nutzen, B = am ehesten metaabhängig. Auch Länder einzeln nach konkreter Funktion bewertet; mehrfach vorhandene Basics je einmal bewertet.

| Karte | Wertung | Konkreter Beitrag / relevante Grenze |
|---|:---:|---|
| Jon Irenicus, Shattered One | A | Gibt per Endstep dauerhafte nicht opferbare Goad-Geschenke; Angriffe unserer fremdkontrollierten Kreaturen erzeugen pro Jon Karte; vier Mana und removal-anfällig. |
| Lord Skitter, Sewer King | A- | Jeden eigenen Kampfbeginn 1/1-Rat ohne Menace mit „kann nicht blocken“ zum Verschenken; nur ein anderer neu eintretender eigener Rat löst Skitters Friedhofsexil aus. Kein sofortiger Angriff des neuen Tokens. |
| Archfiend of the Dross | A-/risk | Öl-Uhr versenkt Spieler nach vier Empfänger-Versorgungssegmenten; bei Rückfall an uns lebensgefährlich, instant-speed Removal zurückhalten. |
| Baleful Strix | A | 2 Mana Karte und Deathtouch-Blocker, im Notfall als harmloser Attack-Draw-Träger verschenkbar. |
| Spellseeker | A | Findet u. a. beide X-Finisher (Bibliotheks-MV 2), Demonic Tutor, Diabolic Intent, Cyclonic Rift, Mana Drain oder billige Antworten; nach ETB notfalls Geschenkkörper. |
| Desecration Elemental | A- | Zwingt zu Kreaturenopfer bei JEDEM Spruch; wegen Jon nicht selbst opferbar, hohe Unterdrückung. Ohne andere Kreaturen und bei Angriffen gegen uns gefährlich. |
| Ebonblade Reaper | A-/risk | Angriff halbiert Lebenspunkte des jeweiligen Beherrschers; Morph und Kampfgegner-Halbierung, in Heads-up sofort kontrollieren. |
| Thought Eater | A- | Für nur 1U fliegender Geschenk-Körper, reduziert maximale Handkartenzahl des Empfängers dauerhaft um 3; vor Übergabe gilt Nachteil uns. |
| Thought Nibbler | A- | Für U günstiges Geschenk mit Handmaximum −2 und Flugfähigkeit; macht früh Jon-Kartenziehen verfügbar, anfänglich eigener Handgrößen-Nachteil. |
| Flesh Reaver | B+ | 4/4 für 2 Mana; bei Schaden gegen Spieler/Kreatur erleidet Empfänger gleich viel, aber 6/6 durch Jon-Marken droht uns. |
| Grid Monitor | A- | Sperrt Kreaturensprüche des Empfängers, 4/6-Druckkörper. Gegen viele Spells weniger effektiv. |
| Thought Devourer | A- | Handmaximum des Empfängers minus vier dauerhaft; Flugkörper, gegen Control besonders stark; bei leerer Hand weniger. |
| Faerie Mastermind | A | Wiederholbarer unabhängiger Draw-Engine gegen zweite Karten anderer; Flash, aktiviert gemeinsamen Draw für Sheoldred/Crawler. |
| Nadir Kraken | A- | Bei beliebigem eigenem Kartenziehen und Zahlung 1 wachsende Tentakel-Token; Synergie mit mehreren Jon-Kopien, früh manahungrig. |
| Ophiomancer | A | Erzeugt bei kontrollierter Schlangenlosigkeit in jedem Upkeep neues Token, nach Schenkung stetig nachproduzierbar. |
| Phyrexian Negator | B+ | Nach erlittenem Schaden verliert Empfänger andere Permanents; Jon verhindert Selbstopfer, Schutz vor Damage-basierter Selbstgefährdung nötig. |
| Greater Harvester | A- | Gesicherter Opfer-Effekt auf Empfänger-Upkeep, Schaden verlangt zwei weitere Permanents; 5 Mana und 5/6 Bedrohung. |
| Psychosis Crawler | A- | Jeder eigene Kartenzug trifft alle Gegner, maximiert Jon-Engine ohne Kampferfolg; fragil gegen Removal. |
| Rotting Regisaur | A- | Erzwungener Kartenabwurf bei jedem gegnerischen Upkeep; 7/6 minus Jons Marken 9/8 kann uns rasch töten. |
| Sygg, River Cutthroat | A- | Zieht am Ende jedes Zugs mit mindestens 3 Lebensverlust eines Gegners optional eine Karte; von großen goaded Angriffen unabhängig von Jon nutzbar. |
| Sheoldred, the Apocalypse | A | Eigene Jon-Draws HEILEN uns um 2, gegnerische Draws verursachen deren 2 Lebensverlust; eigenständiger Kill mit Faerie Mastermind, nicht Jon-Psychosis-Verwechslung. |
| Roaming Throne | A | Wähle Wizard für Jon: doppelte Endstep-Geschenke und doppelte Draw-Trigger; verlangt verfügbare eigene Kreaturen/Token zum tatsächlichen Verschenken. |
| Steel Golem | A- | Dreimanalock verhindert Kreaturensprüche; ein starkes Early-Geschenk ohne Treasures, aber 3/4 später Druck auf uns. |
| Talion, the Kindly Lord | A | Unabhängiger Kartenzug/Life-Loss bei gewähltem Manawert oder Power/Toughness von gegnerisch gewirkten Spells; sollte unter unserer Kontrolle bleiben. |
| Crypt Ghast | A- | Verdoppelt Mana beim Tappen von Swamps, extort als Lebenspunkt-Finisher; mit Urborg/Coffers explodieren X-Zauber, ohne Swamps eingeschränkt. |
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
| Bitterblossom | A- | Je Zug Flug-Token als Blocker, Schwertträger oder Geschenke; eigener Lebensverlust bleibt. |
| Black Market Connections | A | Flexible Auswahl Treasure, Karten und Shapeshifter; kostet eigene Lebenspunkte. |
| Spark Double | A | Nichtlegendäre Kopie von Jon oder anderem eigenen Kernstück, erzeugt zusätzliche Schenkungs- und Draw-Trigger; braucht bereits gutes Kopierziel. |
| Mask of Memory | A- | Vor Jon-Geschenk ausrüsten; nach erfolgreichem Kampfschaden löst die von uns kontrollierte Ausrüstung Kartenziehen 2 / Abwerfen 1 aus; nicht ohne Treffer. |
| Bitterthorn, Nissa's Animus | A | Erzeugt eigenes Germ-Token; mit Jon direkt als 3/3-Geschenk. Bleibt als unser Equipment angelegt und sucht bei dessen Angriff Basic-Land getappt, insgesamt 7 Basics. |
| Strionic Resonator | A | Für 2/T kopiert Jon-Trigger auf dem Stack, bei Bedarf andere Ziele; kann auch andere wertvolle eigene ausgelöste Fähigkeiten kopieren. |
| Despotic Scepter | A | Nur ein Mana **beim Ausspielen**, aktivierte Fähigkeit kostet **allein Tappen** (kein Mana); zerstört Permanent in unserem Eigentum selbst unter Gegnerkontrolle. Not-Aus im Heads-up auch ohne freie Länder. |
| Assault Suit | B+ | Vor Gabe angelegt schützt es uns vor Angriff des ausgestatteten Geschenks, aber verhindert damit auch Jon-Draw in einem Zweierspiel; Equip 3 teuer. |
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
| Illusionist's Gambit | B+ | Combat-Umleitung/zweite Combat-Phase ohne uns; im Duo nur die gerade drohenden Schäden verhindern, nicht automatisch Win. |
| Reins of Power | B+ | Instant-Speed Kontrolltausch aller Kreaturen, überraschender Combat Swing; nur bis EOT und gefährliches Rücktauschen. |
| Sakashima of a Thousand Faces | A | Kopiert Jon ohne Legendenregel-Konflikt, verdoppelt bei Vorhandensein beider Jons Schenkungen und Kartenziehen; kostet vier Mana. |
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
| Homeward Path | A | Schlüssel-Sicherheitsland zum Zurückholen aller eigenbesessenen Kreaturen; nicht unkritisch bei Negativträgern. |
| Command Beacon | B+ | Holt Jon trotz Commander-Tax einmal auf Hand, farbloses Land. |
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

## 5. Historische echte Deckstände (nicht nachträglich konstruiert)

- **V1**: erste 100-Karten-Liste, enthielt unpassende teure Geschenke und illegalen roten The Reaver Cleaver.
- **V2**: sechs Kartenwechsel inklusive Legalitätskorrektur; Faerie Mastermind, Thought Devourer und Fellwar Stone statt situativerer Alternativen.
- **V3**: Plague Reaver wegen vor der Schenkung ausgelöster eigener Opferfähigkeit durch Greater Harvester ersetzt; Scryfall-legal bestätigt, aber mit nun behobenen drei Codex-P2-Hinweisen.
- **V4**: aktuelle 17 austarierte 1:1-Tausche, effizientere Manakurve, neue Trigger-/Tokenmotoren, mehr eigener Commander-Schutz und Notfallzerstörung gegen geschenkte Permanents. V3 separat unter versions/ archiviert. Kein künstlich erstellter weiterer Snapshot.

## 6. Gegenproben gegen Aggro, Kontrolle, Combo und Duell

| Gegner | Vorteile der V4 | Stärkster Gegenbeweis / Handlung |
|---|---|---|
| Aggro / Tokens | Ophiomancer-Snakes, Aetherize, Propaganda, Toxic Deluge, gezieltes Exil, wiederholte Rat-/Faerie-Träger | No Mercy gestrichen; ein 9/8 verschenkter Rotting Regisaur tötet uns im Duell schnell. Scepter und Removal vor dem Ausscheiden des vorletzten Gegners reservieren. |
| Control | Thought Nibbler/Eater/Devourer, Rotting Regisaur, Rhystic/Remora, zusätzliche Jon-Draws, niedrige Kurve | Wiederholter Jon-Removal und Wraths nehmen mehreren Kopien gleichzeitig die Draw-Engine. Boots, Countermana und Kartenziehen unabhängig von Jon priorisieren. |
| Kreaturen-Combo | Steel Golem/Grid Monitor verhindern neue Kreaturensprüche; Desecration Elemental bestraft weitere Zauber, günstiges Removal + Mana Drain | Bereits liegende ETB-Combo oder Nichtkreaturenschleife wird nicht durch goad gestoppt; für Schlüsselzug Mana offenhalten. |
| Spell-Combo | Günstigere Suchkarten (Spellseeker, Intent), Swan Song, Arcane Denial, Mana Drain, Rhystic/Remora | Ohne Opposition Agent/Fierce Guardianship/Force of Will gibt es keinen explosiven kostenlosen Combo-Stopp. Bracket/Slots erfordern verantwortbare Zurückhaltung bei allzu vielen Game Changern. |
| Heads-up | Despotic Scepter beseitigt Geschenkgefahren, Boots schützt Jon, Reins/Aetherize/Illusionist decken Combat; Torment und Exsanguinate selbständig | Goad zwingt Attacken gegen uns, Jon-Kartenziehen fällt nach Zerstörung/Return der Geschenke weg. Vor dem letzten gegnerischen Zug unabhängigen Win-Plan vorbereiten. |

## 7. Messungen, Grenzen und überprüfbarer GitHub-Ablauf

**V3 vorher:** Scryfall 97/97 unterschiedliche Namen, alle farb- und Commander-legal. 100 Karten; 36 Länder; 23 Nicht-Commander-Kreaturen; 40 andere Spells; MV 2,889 (1:6, 2:21, 3:16, 4:15, 5:4, 6:1). 10.000 einfache Seed-20261018-Stichproben von 11 Karten ergaben 31,87 % mindestens 4 Länder und einen ausgewählten Mana-Rock; dies war **keine reale Simulation** von Mulligans, Turns oder Siegen.

**V4 aktuelle lokale Prüfung, 18.10.2026:** 100 Karten, **95 verschiedene Kartennamen**, 36 Länder (4 Island + 3 Swamp), 26 weitere Kreaturen, 37 andere Nichtländer. Live-Scryfall Cards/Collection **95/95 getroffen**, alle Commander-legal, alle U/B/neutral. Genau die drei erlaubten Game Changer. Manakurve 8/25/13/15/2, Ø MV 2,651. Historische V3-Datei bytegetreu archiviert; nun Versionshistorie V1–V3 und aktuelle V4.

**Ohne empirischen Nachweis:** keine realen Manabrew-Partien, keine gemessene Gewinnrate, keine vollständige Prüfung aller theoretischen Zwei-Karten-Combos. Die Kartenwahl ist eine nachvollziehbare regel- und kurvenbasierte Hypothese. Ein geplanter fairer Praxistest: gegen drei Gegnerprofile je mindestens 10 Partien protokollieren Jon-Einsatz, Anzahl geschenkter Angreifer, Karten per Jon, Siegpfad und die letzte Zweiersituation. Nach künftigem Review ausschließlich neue Commit-Revisionsprüfungen als aktuell anerkennen.

**Quellen:** [Wizards Commander/Brackets](https://magic.wizards.com/en/formats/commander) · [Wizards Jon Irenicus Release Notes](https://magic.wizards.com/en/news/feature/commander-legends-battle-baldurs-gate-release-notes-2022-06-01) · [Scryfall Cards/Collection](https://scryfall.com/docs/api/cards/collection) · [PR #30 inkl. drei P2-Hinweise](https://github.com/alexdermohr/magic/pull/30)
