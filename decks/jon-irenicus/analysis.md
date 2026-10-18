# Jon Irenicus B3 — Analyse, Gegenproben und Versionsentwicklung

**Stand: 18.10.2026 · aktuelle V3.** Diese Analyse bewertet die enthaltenen Karten *in diesem Deck*, nicht isoliert nach EDH-Nutzungsrate. Wertungen: A = tragend, B = nützlich/situativ, „risk“ = hoher Eigengefahren- oder politischer Rückschlag. Die Bewertung beruht auf Regeltext, Kurve und strategischer Beurteilung; **keine echten Partien, Winraten oder vollständigen Gegner-Simulationen wurden durchgeführt**.

## Anforderungsprüfung / messbare Grenzen

- **100 Karten** einschließlich Jon, 23 andere Kreaturen, 40 weitere Nichtlandkarten (dabei 1 MDFC als Ersatzland nutzbar), **36 fest eingetragene Länder** (3 Island, 2 Swamp). 97 verschiedene Namen, übrige Duplikate ausschließlich Standardländer.
- Bracket 3 / Upgraded; **Rhystic Study, Demonic Tutor, Cyclonic Rift = genau drei Game Changer**. Kein bewusst eingebauter Turn-≤5-Zwei-Karten-Loop, keine Massenlandzerstörung, keine Zusatzturn-Kette. Ein zufälliger Game-Changer-Statuswechsel bei Wizards/Scryfall erfordert Neuprüfung.
- **97/97 unterschiedliche Einträge** wurden in V2 mit Scryfall Cards/Collection erkannt, Commander-legal und innerhalb U/B. Zwei bei der Collection gewählte Digitaldrucke (**Underground Sea**, **Desecration Elemental**) haben zusätzlich separat belegte Paper-Printings. V3 tauscht exakt eine einzelne Kreatur gegen den separat Scryfall-legal geprüften **Greater Harvester** aus. Dies ist keine externe Bestätigung der Spielstärke.
- V2-Mana-Kurve ohne Commander/Länder: 6×MV1, 21×MV2, 17×MV3, 15×MV4, 3×MV5, 1×MV6, durchschnittlich 2,86. Der Austausch des 3-Mana-Plague-Reaver gegen 5-Mana-Greater-Harvester verschiebt V3 zu **6/21/16/15/4/1**, 63 Nichtland-Nichtcommander, erwartete durchschnittliche MV **2,89** (frisch gegen Scryfall nachprüfen). Mindestens sechs dedizierte Zwei-Mana-Ramp-Artefakte plus Sol Ring; Cabal Coffers ist keine frühe Rampquelle.
- Tempo-Limit: Jon kostet vier Mana, erste Gabe erst Endsegment und erster natürlicher Angriff typischerweise erst im folgenden Empfängerzug. Removal auf Jon kann diese Zeitinvestition bestrafen. Das Deck **ist kein cEDH/Bracket 4**, sondern versucht, in B3 den ungewöhnlichen Commander maximal belastbar zu nutzen.

## 1. Regelinteraktionen, die den Entwurf bestimmen

1. **Eigentum vs. Kontrolle:** Geschenke bleiben unser Eigentum, aber die unter Kontrolle des Empfängers geschriebenen „you“, „your upkeep“, „you lose“ gelten für ihn. Seine eigenen ETB-Fähigkeiten werden beim Kontrollwechsel nicht neu ausgelöst. Ein Gegner kann die Geschenke nicht opfern, aber regulär zerstören, exilieren oder zurück auf unsere Hand schicken.
2. **Goad:** Es begründet sowohl „angreifen, wenn möglich“ als auch „nicht den Goad-Spieler angreifen, wenn anderer Gegner möglich“. Restriktionen wie Angriffskosten, „can't attack“ und legaler Verteidiger haben Vorrang; Goad bezahlt keine Propaganda. **Heads-up attackiert ein ungehindertes Geschenk uns.** Assault Suit verhindert das bei angelegter Ausrüstung, aber dadurch fällt dessen Angriff und damit Jon-Draw weg.
3. **Angriffsdaten:** Jons Draw triggert beim *Angriffsdeklarieren*, nicht bei Kampfschaden. Feindliches Blocken nimmt den bereits getriggerten Draw nicht weg. Mehrere geschenkte Angreifer sind mehrere Einzeltrigger; Töten Jons vor dem Angreifen verhindert dessen Kartenziehen. Ein fremd kontrolliertes Token in unserem Eigentum ist ebenfalls zulässig.
4. **Ausrüstungen:** Sword of Fire and Ice und Sword of Feast and Famine werden nicht selbst verschenkt. Ihre Auslöser gehören zur Ausrüstung unter unserer Kontrolle. Mask of Memory gehört ebenfalls uns und erzeugt somit Kartennachschub nach Schaden, falls sie angelegt bleibt. **Quietus Spike** ist anders: Ausgerüstete Kreatur hat Deathtouch; der Trigger des Equipment beim Schaden verursacht Lebensverlust der verteidigenden Person, unabhängig vom Geschenk-Konzept.
5. **Archfiend:** Geschenk vor erster Ölmarkenreduktion, sonst verkürzt eigene Zeit; Öl wird durch Kontrollwechsel nicht aufgefüllt. Wenn der Empfänger ausscheidet und Jon's Controlchange-Effekt endet, kann der Archfiend unter unserer Kontrolle und mit null Marken zurückkehren. Reserve für Exil, Bounce oder Wrath einplanen.
6. **Abyssal Persecutor:** Blockiert Sieg-/Niederlagemöglichkeiten unter dem jeweiligen Beherrscher. Für finale Torment-/Exsanguinate-Kills vorher entfernen, sonst verhinderter Spielverlust. Der Schutz kann politisch einen ausgeschlossenen Spieler künstlich am Tisch halten.
7. **Plague Reaver-Falle aus V2:** Unser eigenes Endsegment löst zunächst dessen Opferfähigkeit aus, während wir ihn noch kontrollieren. Anschließende Übergabe durch Jon „löscht“ den früheren Auslöser nicht, der uns nun unseren anderen Kreaturenbestand (auch Jon) opfern lassen kann. V3 entfernt diese Karte vollständig.
8. **Jons Tap und +2/+2-Marken:** Die Kreatur kommt NICHT erneut ins Spiel, wird aber getappt. Erst nach dem Enttappsegment des Empfängers kann sie regulär angreifen. Marken machen schädliche Geschenke im Heads-up erheblich gefährlicher.
9. **Aetherize/Homeward Path:** Aetherize schickt angreifende geschenkte Kreaturen in unsere Hand als Eigentümer; Homeward Path gibt sie uns als kontrollierende Person zurück und beseitigt nicht die ursprüngliche Goad-Festlegung. Das kann kritische Selbstnachteil-Kreaturen auf uns übertragen. Removal nicht ausschließlich auf Homeward Path verlassen.

## 2. Einzelbewertung aller verwendeten Karten

Wertung / Kernbeitrag / Abhängigkeit im Jon-Kontext:

| Karte | Wertung | Konkreter Beitrag und Grenzfall |
|---|:---:|---|
| Jon Irenicus, Shattered One | A | Kern: dauerhaft nicht opferbare Geschenke, gegnerische Attacken unserer Karten ziehen Karten; braucht frühes Geschenk und Schutz. |
| Abyssal Persecutor | B | 4-Mana-Druckkörper; verschenkt kann Empfänger nicht gewinnen und dessen Gegner nicht verlieren. Vor eigenem Finale entfernen; zweischneidig. |
| Archfiend of the Dross | A-/risk | Öl-Uhr versenkt Spieler nach vier Empfänger-Versorgungssegmenten; bei Rückfall an uns lebensgefährlich, instant-speed Removal zurückhalten. |
| Baleful Strix | A | 2 Mana Karte und Deathtouch-Blocker, im Notfall als harmloser Attack-Draw-Träger verschenkbar. |
| Demonic Taskmaster | B | Empfänger muss im Upkeep andere Kreatur opfern; bei leeren Boards bleibt nur 4/3 evasiver Angreifer als Risiko. |
| Desecration Elemental | A- | Zwingt zu Kreaturenopfer bei JEDEM Spruch; wegen Jon nicht selbst opferbar, hohe Unterdrückung. Ohne andere Kreaturen und bei Angriffen gegen uns gefährlich. |
| Ebonblade Reaper | A-/risk | Angriff halbiert Lebenspunkte des jeweiligen Beherrschers; Morph und Kampfgegner-Halbierung, in Heads-up sofort kontrollieren. |
| Evil Eye of Orms-by-Gore | B- | Unterbindet Nicht-Eye-Angriffe, verlangt Wall als Blocker; kann zugleich unsere Jon-Ziehquellen beim Empfänger stilllegen, isoliert verschenken. |
| Evil Eye of Urborg | B- | Zweiter Nicht-Eye-Angriffslock, besser blockbar als Orms-by-Gore; nur strategisch begründet einsetzen, im Duell unpraktisch. |
| Flesh Reaver | B+ | 4/4 für 2 Mana; bei Schaden gegen Spieler/Kreatur erleidet Empfänger gleich viel, aber 6/6 durch Jon-Marken droht uns. |
| Grid Monitor | A- | Sperrt Kreaturensprüche des Empfängers, 4/6-Druckkörper. Gegen viele Spells weniger effektiv. |
| Thought Devourer | A- | Handmaximum des Empfängers minus vier dauerhaft; Flugkörper, gegen Control besonders stark; bei leerer Hand weniger. |
| Faerie Mastermind | A | Wiederholbarer unabhängiger Draw-Engine gegen zweite Karten anderer; Flash, aktiviert gemeinsamen Draw für Sheoldred/Crawler. |
| Nadir Kraken | B | Aus eigenem Ziehen bei Zahlung 1 entstehen verteilbare Tentakel-Token und wachsender Threat; manaintensiv. |
| Ophiomancer | A- | Wiederkehrende Snake-Token auf Versorgungssegmenten; geschenkte Schlangen ermöglichen Jon-Nachziehen ohne eigene Kernkreaturen zu riskieren. |
| Phyrexian Negator | B+ | Nach erlittenem Schaden verliert Empfänger andere Permanents; Jon verhindert Selbstopfer, Schutz vor Damage-basierter Selbstgefährdung nötig. |
| Greater Harvester | A- | Gesicherter Opfer-Effekt auf Empfänger-Upkeep, Schaden verlangt zwei weitere Permanents; 5 Mana und 5/6 Bedrohung. |
| Psychosis Crawler | A- | Jeder eigene Kartenzug trifft alle Gegner, maximiert Jon-Engine ohne Kampferfolg; fragil gegen Removal. |
| Rotting Regisaur | A- | Erzwungener Kartenabwurf bei jedem gegnerischen Upkeep; 7/6 minus Jons Marken 9/8 kann uns rasch töten. |
| Ebon Drake | B | Beim gegnerischen Wirken jedes Spruchs 1 Leben Verlust an Empfänger, früher 3-Mana-Flieger; Schaden moderat. |
| Sheoldred, the Apocalypse | A | Passiver Massendraw-/Lifegain-Lebensverlust, stabilisiert uns und bietet eigenen Kill; muss bei uns bleiben. |
| Sower of Discord | B | Zwei Gegner paarweise Lebensverlust koppeln, nicht uns auswählen; politisch stark, bei nur zwei Spielern nicht verlässlich. |
| Steel Golem | A- | Dreimanalock verhindert Kreaturensprüche; ein starkes Early-Geschenk ohne Treasures, aber 3/4 später Druck auf uns. |
| Talion, the Kindly Lord | A | Wiederholbares Ziehen plus Lebensverlust passend zur gewählten Zahl; unabhängige Engine und 3/4 Flieger. |
| Bloodthirsty Blade | B | Goad gegen fremde nicht von uns besessene Kreaturen; liefert keinen Jon-Draw, lenkt aber Gegner-Bedrohungen ab. |
| Sol Ring | A | Effizienter farbloser Früh-Ramp zu Jon, Ausrüstung, großen Finishern. |
| Arcane Signet | A | Zwei-Mana-Farbfixing für UU und BB. |
| Dimir Signet | A | Zwei-Mana-Beschleunigung U/B, benötigt weiteres Mana zum Aktivieren. |
| Talisman of Dominance | A | Zwei-Mana-Farbfixing, gelegentlich 1 eigener Lebenspunkt. |
| Fellwar Stone | A- | Früher fixer Ramp, U/B abhängig von Gegnerländern. |
| Mind Stone | A- | Zwei-Mana-Ramp, später zyklisch Karte ziehen. |
| Thought Vessel | B+ | Zwei-Mana-Ramp, unbegrenzte Hand schützt Jon-Draw-Überschuss. |
| Expedition Map | A- | Findet Homeward Path oder Coffers/Urborg, effektiv aber 3 Mana gesamt zum Suchen. |
| Rhystic Study | A | Game Changer 1: massiver Kartenvorteil; erzeugt politisch zusätzliche Steuern. |
| Mystic Remora | A- | Effizientes Noncreature-Draw gegen schnelle Spells; kumulativer Upkeep steigt. |
| Bitterblossom | A- | Je Zug Flug-Token als Blocker, Schwertträger oder Geschenke; eigener Lebensverlust bleibt. |
| Black Market Connections | A | Flexible Auswahl Treasure, Karten und Shapeshifter; kostet eigene Lebenspunkte. |
| Teferi's Ageless Insight | B+ | Verdoppelt Jon- und anderen Nicht-Drawstep-Draw; vier Mana ohne eigenen Soforteffekt. |
| Mask of Memory | B+ | Bei erfolgreichem Kampfschaden zwei ziehen und eine abwerfen, gegen unsere Gegnergeschenke unpraktisch nach Donation, da Auslöser der Equipment-Kontrolle zugutekommt; Equip 1. |
| Sword of Fire and Ice | A | Ausrüstung bleibt unsere: Treffer durch Geschenk löst uns 2 Schaden plus Kartenzug aus; Schutzfarben können Blocks verhindern. |
| Sword of Feast and Famine | A | Ausrüstung bleibt unsere: gegnerischer Treffer lässt Spieler abwerfen und enttappt unsere Länder für X-Finisher. |
| Quietus Spike | B+ | Halbiert bei Kampftreffer gegnerische Leben; Deathtouch, Equip 3 teuer, kann uns in Duo stark bedrohen. |
| Assault Suit | A- | Eigener Ausrüstungsbeherrscher verhindert Attacken gegen uns, ermöglicht weitere Leihen; im Zweier-Endspiel stoppt Angriff und Jon-Draw. |
| Court of Ambition | B+ | Monarch-Karten und wiederholter Lebensverlust/Discard; Monarch kann bei gegnerischen Angriffen wechseln. |
| Lightning Greaves | A- | Haste und Shroud für Jon, lässt sich günstig auf andere Kreaturen umlegen; Shroud blockiert eigene Zielspells/Ausrüsten bis umgerüstet. |
| Torment of Hailfire | A | Eigenständiger skalierbarer X-Finisher, Gegner wählen Discard/Sac/Lebensverlust; kein Coop-Bedarf. |
| Exsanguinate | A | Eigenständiger globaler Drain, stabilisiert eigenes Leben; mit Coffers in großen Endspielen. |
| Propaganda | A- | Attack-tax gegen uns, Gegner kann Zahlung ablehnen; Goad ändert Zahlungsfreudigkeit nicht. |
| No Mercy | B+ | Vernichtet Trefferverursacher nach Schaden; lethal damage nicht verhindert. |
| Demonic Tutor | A | Game Changer 2: exakter Tutor für Schutz/Finisher/Emergency Removal. |
| Cyclonic Rift | A | Game Changer 3: einseitiger Overload-Bounce gegen gegnerische Boards; gegen Geschenk-Plan widersprüchlich, im Finale stark. |
| Toxic Deluge | A- | Vielseitige Boardkontrolle gegen Aggro und Gifts, bezahlt eigenes Leben. |
| Aetherize | A- | Duel/aggro Verteidigung; verschenkte Angreifer kehren als unsere Eigentums-Karten zurück auf Hand. |
| Illusionist's Gambit | B+ | Combat-Umleitung/zweite Combat-Phase ohne uns; im Duo nur die gerade drohenden Schäden verhindern, nicht automatisch Win. |
| Reins of Power | B+ | Instant-Speed Kontrolltausch aller Kreaturen, überraschender Combat Swing; nur bis EOT und gefährliches Rücktauschen. |
| Wrong Turn | B | Dauerhafte Umverteilung gegnerischer Kreatur; nicht uns gehörende Kreatur erzeugt keinen Jon-Angriffs-Draw. |
| Feed the Swarm | A- | Schwarzes Kreaturen- und Verzauberungsremoval, eigene Lebenspunkte kosten. |
| Deadly Rollick | A | Spot-Exil unabhängig von Schadensresistenz, häufig kostenlos mit Jon. |
| Counterspell | A | Universale UU-Abwehr von Combo- und Sweeper-Turns. |
| Arcane Denial | A- | Zuverlässiger 1U-Counter, zieht Gegnern Karten; mit Sheoldred ein Vorteil. |
| Swan Song | A | Effizienter 1U-Stop gegen Combo/Removal, hinterlässt 2/2-Flieger. |
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
| River of Tears | B | U ohne Landdrop, B nach Landdrop; eingeschränkt planbare Farbmana. |
| Sunken Ruins | A- | Filtert bereits bestehende Manaquelle in U/B, kann aus farblosem allein nicht beide Farben erzeugen. |
| Darkwater Catacombs | B+ | Filterland, U/B für farbloses Mana aus anderer Quelle. |
| Choked Estuary | B+ | U/B often ungetappt mit passendem Land zur Offenlegung, sonst getappt. |
| Otawara, Soaring City | A | Ungetapptes U, als Kanal-Fähigkeit vielseitiger Bounce auch unserer Geschenk-Gefahren. |
| Takenuma, Abandoned Mire | A- | Schwarze Quelle mit Graveyard-Recursion per Channel. |
| Homeward Path | A | Schlüssel-Sicherheitsland zum Zurückholen aller eigenbesessenen Kreaturen; nicht unkritisch bei Negativträgern. |
| Command Beacon | B+ | Holt Jon trotz Commander-Tax einmal auf Hand, farbloses Land. |
| Bojuka Bog | A- | Friedhofsexil eines Spielers beim ETB; getapptes schwarzes Land. |
| Urborg, Tomb of Yawgmoth | A | Macht alle Länder zu Swamps; zusammen mit Coffers größere X-Finisher. |
| Cabal Coffers | A | Ab ausreichend Sümpfen gewaltiger schwarzer Ramp, frühe Hand verlangsamend. |
| Castle Locthwain | B+ | Kartenziehen im Midgame, kostenabhängiger eigener Lebensverlust. |
| Island | A | Drei Basics stabilisieren U, gegen Blood Moon, fetchbar. |
| Swamp | A | Zwei Basics stabilisieren B, Coffers und fetchbar. |

## 3. Dokumentierte tatsächliche Iterationen

**V1 → V2:** Lord of the Pit → Thought Devourer (4 statt 7 Mana und Handgrößen-Lock); Master of the Feast → Faerie Mastermind (echter eigener Draw statt Karten für Empfänger); Rust Elemental → Ebon Drake (kontinuierlicher Zauberschaden statt erzwungenem Tappen); Wretched Anurid → Bloodthirsty Blade (politische Kontrolle statt kleinem punktuellen Lebensverlust); Thran Dynamo → Fellwar Stone (frühere Ramp-Stufe); The Reaver Cleaver → Quietus Spike (**rot und in Dimir illegal**, Quietus Spike legal). Die MDFC-Einträge mit getrennten //-Gesichtern wurden für den Scryfall-/Import-Abgleich auf ihren Hauptkartennamen verkürzt.

**V2 → V3:** Plague Reaver → Greater Harvester. Der vermeintliche Endsegment-Opferlock triggert bereits *vor* unserer Übergabe und kann unsere eigene Armee gefährden; Harvester verschiebt seinen Nachteil eindeutig auf den Empfänger-Upkeep (kostet dafür zwei Mana mehr). V1 und V2 sind unverändert historisch abgelegt. Kein dritter künstlicher Snapshot ohne reale Änderungen.

## 4. Gezielt untersuchte, verworfene Alternativen

- **Master of the Feast**: Empfänger ist nicht bestraft, sondern gibt allen anderen Karten, wodurch unser Gegner im Finale einen 7/7-Flyer hat; Faerie Mastermind ist eigenständige Draw-Quelle.
- **Plague Reaver**: Endsegment-Bedrohung gegen uns vor Übergabe, untergräbt wichtigsten Commander. Nur geeignet mit zusätzlich geplanter Stifle- oder Timing-Engine, die hier zu viele Slots kosten würde.
- **Rust Elemental**: Kann ohne anderes Artefakt nicht angreifen und erzeugt keine Jon-Karten, nur 4 Lebensverlust; gegen Treasure-Decks schwach.
- **Lord of the Pit**: Sieben Mana, hoher eigener Upkeep-Nachteil bis Jon; Thought Devourer trifft kontrolllastige Gegner früher.
- **The Reaver Cleaver**: Farbindentität **R** (offizielle Scryfall-Oracle-Metadaten), mit Jon U/B illegal.
- **Master of Cruelties**: Nicht in Dimir verboten, aber ohne unterstützenden Combat oft eine reine „lustige“ Win-more-Karte und mit Goader-Restriktionen schwer zu steuern.
- **Bronze Bombshell**: Beim Kontrollwechsel erleidet Empfänger sofort Schaden und Bombshell wird geopfert; dieses Opfer ist wegen Jons eingebauter Nicht-opferbar-Fähigkeit kritisch im Timing, nicht als wiederholbarer Geschenkmotor eingeplant. Bei unklarer Auflösungskombination keine verlässliche Stärkeannahme.
- **Hunted Horror / Hunted Phantasm**: ETB erzeugt gegnerische Token, die Jon nicht als unsere Eigentums-Kreaturen erkennt. Starke Körper, aber nicht automatisch die gewünschte nachteilige Gabe.
- **Leveler / Eater of Days**: ETB-Nachteil trifft vor Übergabe **uns**, keine automatische Umlenkung auf Empfänger. Keine effiziente Jon-Strategie.
- **Sundial of the Infinite**: Endet unsere Züge, unterdrückt aber nicht automatisch gegnerische Upkeep-Auslöser und kostet Decktempo.
- **Tergrid, God of Fright**: Stark mit Discard- oder Opferzwang, aber 5 Mana und zusätzliche Attrition-Maschine; eigener Fußabdruck erhöht Fokusfeuer und Gegnerdruck, in diesem B3-Build zugunsten direkter Interaktion ausgelassen.
- **Opposition Agent / Notion Thief**: Starke asynchrone Kontrolle, aber Bracket-3-Game-Changer-Konflikt/Metawarp respektive Kartendiebstahl statt Hauptplan; vor Ergänzung Bracket neu prüfen.
- **Doomsday/Thassa's Oracle-Plan**: Hohes Siegtempo, aber entfernt sich vom Geschenk-/Politikauftrag und könnte als frühe Zwei-Karten-Siegeskombination B3-Grenzen verletzen.

## 5. Matchup- und Endspiel-Gegenproben

| Gegnerstrategie | Unsere Stärken | Primäres Gegenargument | Anpassung |
|---|---|---|---|
| Breites Aggro | Propaganda, Aetherize, Toxic Deluge, 1/1-Deathtouch von Ophiomancer, Goad | Geschenke werden mit +1/+1-Marken gerade gegen uns im Duell zur Gefahr; anfangs sind Jon/Board langsam | Nie alles an denselben Aggro-Spieler geben; frühe Interaktion/Strix priorisieren |
| Kreaturen-Combo / Tribal | Steel Golem, Grid Monitor, Desecration Elemental, Counterspells | ETB-Combos können schon vor erstem Geschenk gewinnen; Board-Locks lassen sich gezielt entfernen | Frühe Counter und Tutoren sparen, vor Turn 4 nicht gierig werden |
| Spell-Combo | Rhystic Study, Mystic Remora, Talion, Ebon Drake, Swan Song, Counterspell | Unsere Schenkung hindert Instant-/Sorcery-Combos kaum, Kills können kampfunabhängig passieren | Interaktion behalten, spätes Torment statt Lebensverlust-Plan priorisieren |
| Control | Rotting Regisaur, Thought Devourer, Courtof Ambition, mehrere Engine-Quellen | Jon kann wiederholt gecountert werden und ein 5-Mana-Geschenk ist Tempoverlust | Black Market Connections/Faerie Mastermind früh einsetzen, Command Beacon gegen Commander-Tax |
| Heads-up nach 2 Eliminierungen | Coffers, Exsanguinate, Torment, Sheoldred/Crawler, Removal/Bounce, Equipment-Sicherheit | Goad zwingt geschenkte Angreifer **gegen uns**. Aetherize beseitigt unsere Draw-Engine, Assault Suit verhindert neue Attacktrigger | Geschenke gezielt zurückholen oder exilieren, Finisher unabhängig von deren Angriff vorbereiten |

**Echte Unabhängigkeit:** Torment of Hailfire / Exsanguinate benötigen nur Mana; Psychosis Crawler und Sheoldred, the Apocalypse verwerten eigene Kartenzüge; Goad ist dagegen hauptsächlich ein Multiplayer-Mittel zur Kontrolle und Attrition, kein verlässlicher Duell-Finisher.

## 6. Belastbarkeit und noch offene empirische Prüfungen

- **Positiv:** Der Kern besteht nicht aus einer einzelnen Combo: ungünstige permanents halten Gegner klein; unabhängige Draw-Quellen und Massendrain funktionieren auch ohne Jon. Achtung, Jon ist nötig, um Schrottkreaturen sicher zu verschenken; ohne ihn können diese Karten dead draws sein.
- **Kostspielig:** Neun der potenziellen Geschenk-Körper haben MV 4+ und brauchen weitere Zeit zum Schaden. Removal auf Jon kurz vor Endsegment bremst stark. Zu viele permanente Karten im gleichen Zug ohne offene Interaktion ist spielentscheidend gefährlich.
- **Ungeprüft:** Keine Manabrew-Partien, keine beobachteten Siege, kein vollständiger Abgleich aller denkbaren Infinite-Combos und kein Beleg einer tatsächlichen B3-Winrate. Ein zufälliger Goldfish-Draw misst *nur* Mana- oder Handverteilung, keine Multiplayer-Politik.
- **Nächstes reproduzierbares Experiment:** Vier-Spieler-Tisch, drei Matchups aus obiger Tabelle jeweils 10+ Partien; protokollieren: Jon-Turn, erster Geschenk-Turn, Draw-Karten von Jon, geschenkte Kreaturen im letzten Duell, Removal-Nutzen, Gewinner, Bracket-Ziel. Gezielt zweimal Archfiend-Ausscheiden und zweimal Persecutor-Lock mit den offiziellen Regeln in Papier oder Rules-Engine testen.

**Primärquellen:** [Commander legal & Brackets](https://magic.wizards.com/en/formats/commander) · [Brackets Okt. 2025](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025) · [Brackets Feb. 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Jon Irenicus Release Notes](https://magic.wizards.com/en/news/feature/commander-legends-battle-baldurs-gate-release-notes-2022-06-01) · [Scryfall Cards/Collection API](https://scryfall.com/docs/api/cards/collection).

## 7. Frische V3-Prüfung am 18.10.2026

**PASS:** Komplettabgleich nach dem Austausch gegen Greater Harvester über Scryfall Cards/Collection (zwei Batches, Accept- und User-Agent-Header): **97/97 verschiedene Oracle-Kartennamen erkannt**, **100 Listeneinträge**, **36 Länder**, **23 weitere Kreaturen**, **40 andere Karten**; keine Commander-Illegalität, keine Fremdfarbe. Die beiden zunächst digital gematchten Karten **Desecration Elemental** und **Underground Sea** wurden separat auf mindestens einen Papierdruck geprüft. **Exakt drei Game Changer**: Cyclonic Rift, Demonic Tutor und Rhystic Study.

**Tatsächliche V3-Manakurve:** 6×MV1, 21×MV2, 16×MV3, 15×MV4, 4×MV5, 1×MV6; Mittelwert **2,889** (63 Nichtland-Nichtcommander). Beide historischen Versionen enthalten jeweils 100 Einträge. README-Indizes enthalten Links auf den neuen Deckordner.

**Separater begrenzter Seed-Test:** 10.000 zufällige 11-Karten-Stichproben aus den 100 Karten mit RNG-Seed 20261018 (Python Random; ohne Mulligans, Zugreihenfolge, Kosten oder gegnerische Interaktion): in **31,87 %** der Stichproben gleichzeitig mindestens vier der 36 regulären Länder und mindestens ein Artefakt aus Sol Ring, Arcane Signet, Dimir Signet, Talisman of Dominance, Fellwar Stone, Mind Stone, Thought Vessel. Diese grobe Hand-Zusammensetzung ist **kein** Beweis für Jon an Turn 4 oder Siegchance; sie beschreibt allein die Stichproben. Früher Ramp bleibt somit relevant, Mulligans sind in realen Partien entscheidend.

**Testgrenzen:** Kein Simulationsmodell eines Regel-Engines, keine vollständig protokollierten Mehrspielerpartien und keine empirische Winrate. Regelinteraktionen basieren auf offiziellem Oracle-/Regeltext und dokumentierter Ableitung; situative Stapel- und Kontrollwechsel-Fälle verdienen weitere Partietests.
