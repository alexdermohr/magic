# Mishra, Eminent One — Ersetzbarkeitsprüfung aller 100 Karten

**Stand:** 10. Oktober 2026 · **Bewertete Deckrevision:** [main `41e71e7`](https://github.com/alexdermohr/magic/commit/41e71e7abaa523e8fba75878592fd9009e73b7e1) · **Aktive Liste:** [current.txt](current.txt) · [Grundlegende Deckanalyse](analysis.md)

**Zweck:** Wartbare, **kartenweise** Rangfolge nach **Ersetzbarkeit im konkreten Mishra-Bracket-3-Deck**, nicht nach Preis, Seltenheit oder isolierter Kartenspielstärke. Die Bewertungsmatrix bezieht sich exakt auf die 100 Karten der oben verlinkten Revision. Bei Änderungen an `current.txt` die Matrix erneut mit der neuen Liste abgleichen. Die Bracket-4-Version und die einzige aktive Bracket-3-Datei werden durch dieses Dokument **nicht** geändert.

## Skala und Zählung

| Stufe | Bedeutung | Anzahl |
|:---:|---|---:|
| **1** | Kern / nahezu unersetzbar für diesen Spielplan, Mana oder Bracket-Konstanz | 21 |
| **2** | Sehr hoher Nutzen, Tausch nur mit belastbarem Mehrwert | 54 |
| **3** | Situations- oder Meta-abhängig, ernsthafte Konkurrenz vorhanden | 19 |
| **4** | Gut austauschbar, offen benannter Trade-off oder Funktionsüberschneidung | 5 |
| **5** | **Erster testbarer Cut**, strukturelles Problem in diesem Deck | 1 |
| **Gesamt** | **Genau 100 individuelle Bewertungen** | **100** |

**† = vom Nutzer ausdrücklich gesetzte Karte:** Die Stufe beschreibt ehrlich die theoretische Ersetzbarkeit; sie ist **keine Austauschfreigabe**. Geschützt sind Jhoira, Kappa Cannoneer, Demonic Junker, Fabricate, Whir of Invention, Mind Stone, Mox Opal, Basalt Monolith und Tithing Blade. Ebenso **nicht zurückholen:** Scrap Mastery, Servo Schematic, Skysovereign, Sundial of the Infinite (Problem in manabrew.app) und Coveted Jewel (Kontrollverlust-Risiko).

**Strukturelle Ausgangsbasis:** 100 Commander-Karten als Singleton; **35 Länder**, **46 Artefaktkarten** inklusive Kreaturen und Artefaktländer, **13 vereinbarte Mana-Artefakte im Ramp-Kern**; **3 Game Changer:** Rhystic Study, Cyclonic Rift, Demonic Tutor. Aktuelle Scryfall-Abfrage: alle 100 Namen vorhanden, Commander-legal und Grixis-konform. **Urza, Lord High Artificer** und **Deflecting Swat** wurden am 21.10.2025 aus der Game-Changer-Liste entfernt. Bracket 3 erlaubt bis zu drei Game Changer und keine absichtlichen frühen Zwei-Karten-Endloskombos. Die Zahl der vorhandenen Artefakte ist ein sinnvolles, aber nicht allein entscheidendes Qualitätskriterium.

## Jede Karte auf dem Prüfstand

### Commander, Kreaturen und zentrale Synergien

| # | Karte | Stufe | Konkreter Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 1 | Mishra, Eminent One | **1** | Kommandeur und einziger garantierter Warform-Erzeuger. Ohne seine Kampfauslösung fehlt der primäre Spielplan. |
| 2 | Emry, Lurker of the Loch | **2** | Günstige wiederholbare Artefaktzauber aus dem Friedhof; benötigt Friedhof, Überleben und legales Timing. |
| 3 | Jhoira, Weatherlight Captain | **3†** | Starker Kartennachschub beim Wirken historischer Zauber, aber Warform-Tokens werden nicht gewirkt. Ausdrücklich behalten. |
| 4 | Etherium Sculptor | **2** | Beschleunigt fast alle ausgespielten Artefakte; ein fragiler Körper, kein eigener Warform-ETB-Effekt. |
| 5 | Enthusiastic Mechanaut | **2** | Zweite günstige Artefakt-Kostenreduktion plus Flugfähigkeit; Doppel-Farbanforderung im frühen Spiel. |
| 6 | Knight Paladin | **1** | Nichtkreatur-Fahrzeug und erstklassiges Ziel: jede Warform erzeugt 4 ETB-Schaden an jedem Gegner; auch als reguläres Artefakt brauchbar. |
| 7 | Marionette Apprentice | **2** | Effizienter Gruppenschaden bei eigenen Kreaturen-/Artefakt-Toden, ergänzt Altar und Warform-Opfer; kein Artefakt. |
| 8 | Sai, Master Thopterist | **2** | Token beim Wirken von Artefaktzaubern und Opfer-Draw; Token entstehen nicht schon durch jeden Mishra-Auslöser. |
| 9 | Goblin Welder | **2** | Tauscht kleine Artefakte gegen schwere Friedhofsziele inklusive Portal; summoning-sick, removal-anfällig und zielabhängig. |
| 10 | Goblin Engineer | **2** | Legt beliebiges Artefakt in den Friedhof; Rückholung direkt ins Feld nur bei Mana Value bis 3. |
| 11 | Brudiclad, Telchor Engineer | **3** | Einzigartiger Token-Multiplikator: richtig gestapelte Kampf-Trigger machen andere Tokens zu dauerhaften Warform-Kopien; sechs Mana und Token-Vorbereitung erforderlich, keine neuen ETBs durch Umwandlung. |
| 12 | Cyberdrive Awakener | **5** | Explosiver fliegender Alpha-Schlag, aber sechs Mana; sein ETB macht Nichtkreatur-Artefakte im selben Kampf zu ungültigen Mishra-Zielen. Erster Test-Cut. |
| 13 | Thought Monitor | **2** | Mit Affinity oft günstig plus zwei echte Karten beim Eintritt; selbst Artefaktkreatur und deshalb kein direktes Mishra-Kopierziel. |
| 14 | Roaming Throne | **1** | Human/Artificer verdoppelt Mishras Kampfbeginn-Trigger und skaliert alle Kopierziele; kein direkter Mishra-Zieltyp. |
| 15 | Kappa Cannoneer | **2†** | Geschützter, durch Artefakt-Eintritte wachsender unblockbarer Abschluss; kein Warform-Vorbild. Ausdrücklich behalten. |
| 16 | Urza, Lord High Artificer | **1** | Macht vorhandene Artefakte zu blauen Manaquellen, erzeugt Construct und nutzt Überschussmana; seit Oktober 2025 kein Game Changer mehr. |

### Mana-Artefakte, Kopierziele und Artefakt-Engines

| # | Karte | Stufe | Konkreter Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 17 | Sol Ring | **1** | Ein-Mana-Ramp mit zwei farblosen Mana; eines der stärksten Tempoelemente. |
| 18 | Arcane Signet | **1** | Zuverlässige U/B/R-Versorgung für den Dreifarben-Kommandeur bei zwei Mana. |
| 19 | Fellwar Stone | **2** | Günstige Farbenbeschleunigung; verfügbare Farben hängen von gegnerischen Ländern ab. |
| 20 | Dimir Signet | **2** | Günstiger U/B-Fix für Mishra und Whir; braucht anderes Mana zum Aktivieren. |
| 21 | Izzet Signet | **2** | Günstiger U/R-Fix; braucht ein vorgelagertes Mana zur Aktivierung. |
| 22 | Rakdos Signet | **2** | Günstiger B/R-Fix; braucht ein vorgelagertes Mana zur Aktivierung. |
| 23 | Talisman of Dominance | **2** | U/B sofort verfügbar und unterstützt blaue Doppel-/Dreifach-Anforderungen; farbige Nutzung kostet Leben. |
| 24 | Talisman of Creativity | **2** | U/R sofort verfügbar; farbige Nutzung kostet Leben. |
| 25 | Talisman of Indulgence | **2** | B/R sofort verfügbar; farbige Nutzung kostet Leben. |
| 26 | Mind Stone | **3†** | Solides farbloses Ramp mit späterem Kartenziehen, aber kein Farbfix. Ausdrücklich behalten, nicht als freier Cut führen. |
| 27 | Liquimetal Torque | **3** | Ramp plus Möglichkeit, ein eigenes Nichtland-Permanent für Mishra zum Artefakt zu machen; farblos und Tap-Konflikt. |
| 28 | Ichor Wellspring | **1** | Eines der effizientesten Warform-Ziele: ETB-Draw und beim Opfer erneut Draw; leichter Artefaktaufbau. |
| 29 | Cryogen Relic | **2** | Zeichnet beim Ein- und Verlassen des Spielfelds unabhängig vom Friedhof; niedrige Kosten, aber relativ wenig Board-Interaktion. |
| 30 | Esoteric Duplicator | **1** | Macht aus geopferten Warforms gegen zwei Mana bleibende Kopien im nächsten Endsegment; zentrale Altar-Synergie. |
| 31 | Worldwalker Helm | **2** | Map bei Artefakt-Token-Produktion und später gezielte Kopie eines Artefakt-Tokens; benötigt aktiviertes Mana und Tappen. |
| 32 | Prized Statue | **2** | Treasure bei Eintritt und Tod, dadurch extrem gutes frühes Mishra-Ziel und Farbfix; geringere Endspielwirkung. |
| 33 | Skullclamp | **4** | Überragend mit 1/1-Futter, aber zuverlässige kleine Kreatur-Tokens sind begrenzt und oft bereits für andere Engines verplant. |
| 34 | Nihil Spellbomb | **4** | Günstiger spezifischer Friedhofshass plus B-abhängiger Draw; gegen mehrere Friedhofsdecks ist Soul-Guide Lantern flexibler. |
| 35 | Ashnod's Altar | **2** | Kostenlose Opfermöglichkeit für Warforms und Kreaturen; finanziert Duplicator und Todesauslöser, aber nur farbloses Mana. |
| 36 | Idol of Oblivion | **2** | Mishra erzeugt regelmäßig Tokens, dadurch günstige wiederkehrende Karte; braucht überlebendes Artefakt und Tap-Fenster. |
| 37 | Strionic Resonator | **3** | Verdoppelt Mishras Trigger für zwei Mana und Tap; stark bei Payoffs, aber zusätzlicher Setup- und Mana-Aufwand. |
| 38 | Mox Opal | **2†** | Null-Mana-Artefakt und später beliebige Farbe mit Metalcraft; vor zwei weiteren Artefakten inaktiv. Ausdrücklich behalten. |
| 39 | Basalt Monolith | **4†** | Einmaliger farbloser Schub, enttappt nicht normal und fixt keine Farbe; im Vakuum austauschbar, aber ausdrücklich gesetzt. |
| 40 | Panharmonicon | **2** | Verdoppelt ETB-Effekte von Wellspring, Blade, Paladin und anderen; ohne ETB-Ziele vier Mana ohne unmittelbaren Effekt. |
| 41 | Scrap Trawler | **2** | Artefakt-Rekursion über Warform-Tode und zerstörende Boardwipes; bringt Karten nur auf die Hand und nicht nach Exil. |
| 42 | Rhystic Study | **1** | Game Changer für kontinuierlichen Kartennachschub; beansprucht einen der drei erlaubten Plätze. |
| 43 | The Mightstone and Weakstone | **3** | Doppelte Karte oder Kreaturen-Schwächung beim ETB, dazu eingeschränktes Artefaktmana; kostet fünf und ist legendär. |
| 44 | Sculpting Steel | **2** | Flexibler zusätzlicher Blade-, Wellspring-, Paladin- oder Portal-Effekt je nach Spielfeld; ohne hochwertige Vorlage schwach. |
| 45 | Spine of Ish Sah | **3** | Kopierbarer ETB-Zugriff auf nahezu jedes Permanent plus Rückkehr aus dem Friedhof; sieben Mana auf der Hand schwerfällig. |
| 46 | Portal to Phyrexia | **3** | Extrem hoher ETB- und Upkeep-Ertrag, gewinnt Kreaturenspiele; neun Mana ohne Welder/Transmuter ein Starthand-Risiko. |
| 47 | Simulacrum Synthesizer | **1** | Mishras eintretende Artefakte mit Mana Value ab 3 erzeugen massiv skalierende Constructs; zentrale Boardengine. |
| 48 | Lich's Relic | **2** | Ein-Mana-Kopierziel mit optionalem Removal bei jedem ETB gegen weitere zwei Mana; im Manamangel schwächer. |
| 49 | Demonic Junker | **2†** | Artefaktfahrzeug mit Affinity und Kreaturenentfernung pro Spieler bei ETB; teuer ohne Artefakte. Ausdrücklich behalten. |
| 50 | Lightning Greaves | **2** | Früher Schutz und Haste für Mishra oder Welder; Shroud kann auch eigene Ziel-Effekte blockieren. |

### Interaktion, Schutz, Tutor und Nichtartefakt-Zauber

| # | Karte | Stufe | Konkreter Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 51 | Determined Iteration | **2** | Mit richtiger Combat-Trigger-Reihenfolge populiert es gerade erzeugte Warforms; ebenfalls verzögertes Opfer, kein Artefakt. |
| 52 | Cyclonic Rift | **1** | Asymmetrischer Reset und hervorragender Siegzugs-Öffner; Game Changer 2/3. |
| 53 | Mana Drain | **2** | Sehr billiger Schutz mit späterem Mana-Burst; verlangt früh doppeltes Blau. |
| 54 | An Offer You Can't Refuse | **3** | Effizienter Schutz vor Nichtkreatur-Zaubern, schenkt aber zwei gegnerische Treasures und ist gegen Kreaturen unbrauchbar. |
| 55 | Chaos Warp | **2** | Sehr flexible Antwort auch auf störende Verzauberungen; zufälliges neues gegnerisches Permanent bleibt Risiko. |
| 56 | Deflecting Swat | **2** | Mit Commander oft kostenlose Umlenkung, schützt situationsbedingt; kein Game Changer seit Oktober 2025. |
| 57 | Deadly Rollick | **2** | Mit Commander kostenloses Kreaturen-Exil; ohne Mishra vier Mana und kein Zugriff auf Nichtkreaturen. |
| 58 | Feed the Swarm | **3** | Wichtige Antwort auf Verzauberungen in Grixis, aber Sorcery und Lebenspunktverlust; bei genügend anderem Removal prüfbar. |
| 59 | Vandalblast | **2** | Einseitiger Massen-Artefakthass, lässt die eigenen Artefakte stehen; metagameabhängig, aber einzigartig im Slot. |
| 60 | Blasphemous Act | **4** | Günstiger Kreaturenwipe bei vollem Board, tötet aber Mishra, Token und eigene Engines; Deluge ist flexibler, kostet Leben. |
| 61 | Mystic Remora | **2** | Früher Multiplayer-Kartennachschub; kumulative Unterhaltskosten und kreaturenlastige Gegner schränken ein. |
| 62 | Fabricate | **2†** | Beliebiges Artefakt für drei Mana auf die Hand, auch teure Ziele; ausdrücklich zusammen mit Whir behalten. |
| 63 | Whir of Invention | **3†** | Instant-Tutor direkt ins Spiel, durch Improvise unterstützt; UUU bleibt hart und X teuer. Ausdrücklich behalten. |
| 64 | Demonic Tutor | **1** | Sehr günstiger universeller Zugriff auf das jeweils fehlende Teil; Game Changer 3/3. |
| 65 | Tithing Blade | **1†** | Vorbildlicher Zwei-Mana-Warform-ETB: jeder Gegner opfert eine Kreatur ohne Zielen oder Zusatzkosten; ausdrücklich behalten. |

### Länder und Farbversorgung

| # | Karte | Stufe | Konkreter Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 66 | Command Tower | **1** | Perfekter U/B/R-Fix ohne Tempoverlust oder Lebensverlust. |
| 67 | Xander's Lounge | **3** | Fetchbare drei Landtypen und alle drei Farben; getappter Eintritt kostet einen Zug Tempo. |
| 68 | Misty Rainforest | **2** | Findet Insel-Duals wie Watery Grave und Steam Vents, verbessert Farbwahl gegen einen Lebenspunkt. |
| 69 | Reflecting Pool | **3** | Hervorragend mit bestehendem farbigem Land, in isolierten Starthänden aber keine eigene Farbe. |
| 70 | Spire of Industry | **2** | Bei 46 Artefakten meist jede Grixis-Farbe für einen Lebenspunkt; ohne Artefakt nur farblos. |
| 71 | City of Brass | **2** | Sofort alle drei Farben; jedes Tappen kostet ein Leben auch außerhalb der Mananutzung. |
| 72 | Seat of the Synod | **2** | Blaues Artefaktland für Affinity, Metalcraft und Urza; gleichzeitig anfällig gegen Artefakt-Hass. |
| 73 | Vault of Whispers | **2** | Schwarzes Artefaktland für Metalcraft und Opfer-/Artefakt-Synergien; anfällig gegen Artefakt-Hass. |
| 74 | Great Furnace | **2** | Rotes Artefaktland für Metalcraft und Opfer-/Artefakt-Synergien; anfällig gegen Artefakt-Hass. |
| 75 | Darksteel Citadel | **4** | Unzerstörbares Artefaktland sichert Metalcraft, produziert aber nur farblos; Opferland-Alternativen sind prüfbar. |
| 76 | Flooded Strand | **2** | Findet Insel-Duals trotz fehlender Plains; fetchbare Farbwahl gegen einen Lebenspunkt. |
| 77 | Marsh Flats | **2** | Findet Swamp-Duals trotz fehlender Plains; fetchbare Farbwahl gegen einen Lebenspunkt. |
| 78 | Academy Ruins | **2** | Regelmäßige Friedhofsrekursion für Artefaktkarten auf Bibliotheksoberseite; kostet Tempo und farbiges Mana. |
| 79 | Buried Ruin | **3** | Einmalige Artefakt-Rekursion auf die Hand durch Landopfer; farbloses Land, teilweise durch Trawler/Academy abgedeckt. |
| 80 | Inventors' Fair | **3** | Tutor für beliebiges Artefakt bei Metalcraft und gelegentlich Lebensgewinn; farbloses Land und teure Aktivierung. |
| 81 | Urza's Saga | **1** | Sucht Sol Ring, Opal, Clamp oder Spellbomb und stellt Construct-Tokens; trotz planmäßigem Landsacrifice starker Slot. |
| 82 | Otawara, Soaring City | **2** | Ungetappte blaue Quelle oder schwer konterbares Channel-Bounce; nahezu ohne Deckbaupreis. |
| 83 | Takenuma, Abandoned Mire | **2** | Ungetappte schwarze Quelle mit möglicher Kreaturen-Rekursion; passt zu Friedhofsplan. |
| 84 | Sokenzan, Crucible of Defiance | **3** | Rote Quelle mit spätem Token-Futter für Skullclamp oder Opfermechanismen; sonst gewöhnliches Farbland. |
| 85 | Polluted Delta | **1** | Findet schwarze oder blaue Duals und damit alle Grixis-Farben über vorhandene Landtypen. |
| 86 | Scalding Tarn | **1** | Findet Island-/Mountain-Duals für sehr flexible frühe Farbwahl. |
| 87 | Bloodstained Mire | **1** | Findet Swamp-/Mountain-Duals für flexible frühe Schwarz/Rot-Versorgung. |
| 88 | Watery Grave | **2** | Fetchbarer ungetappter U/B-Fix gegen zwei Leben, alternativ getappt. |
| 89 | Steam Vents | **2** | Fetchbarer ungetappter U/R-Fix gegen zwei Leben, alternativ getappt. |
| 90 | Blood Crypt | **2** | Fetchbarer ungetappter B/R-Fix gegen zwei Leben, alternativ getappt. |
| 91 | Underground Sea | **1** | Fetchbarer U/B-Fix ohne ETB-Nachteil. |
| 92 | Volcanic Island | **1** | Fetchbarer U/R-Fix ohne ETB-Nachteil. |
| 93 | Badlands | **1** | Fetchbarer B/R-Fix ohne ETB-Nachteil. |
| 94 | Underground River | **2** | Ungetappter U/B-Fix; Leben für farbiges Mana. |
| 95 | Shivan Reef | **2** | Ungetappter U/R-Fix; Leben für farbiges Mana. |
| 96 | Sulfurous Springs | **2** | Ungetappter B/R-Fix; Leben für farbiges Mana. |
| 97 | Mana Confluence | **2** | Jede benötigte Farbe jederzeit gegen einen Lebenspunkt; lebensintensiver als Duals. |
| 98 | Island | **3** | Wichtiges fetchbares Basic und resilient gegen Nichtstandardländer-Hass; Stückzahl darf im 35-Land-Gerüst angepasst werden. |
| 99 | Swamp | **3** | Fetchbares schwarzes Basic, unterstützt Frühspiel und Schutz vor Nonbasic-Hate; nicht ersatzlos streichen. |
| 100 | Mountain | **3** | Fetchbares rotes Basic für verlässlichen Grundzugang trotz Nonbasic-Hate; nicht ersatzlos streichen. |

## Bestehende Slots zuerst hinterfragen

**Primäre Prüfreihenfolge ohne feste Nutzerbindung:** **Cyberdrive Awakener** (Stufe 5) → **Skullclamp** (Stufe 4) → **Nihil Spellbomb** (Stufe 4) → **Blasphemous Act** (Stufe 4) → **Darksteel Citadel** (Stufe 4). Eine Stufe 4 oder 5 bedeutet **nicht automatisch**, dass ein unverstandener Synergieverlust akzeptabel wäre.

- **Cyberdrive Awakener (Stufe 5):** Sein ETB wandelt vor dem Kampf die eigenen Nichtkreatur-Artefakte in Kreaturen um. Gerade dann fehlen Mishra gültige Ziele für denselben Kampfbeginn. Als Sofort-Finisher dennoch stark: nicht wertlos, sondern besonders **schlecht mit einem anderen Kernmechanismus getaktet**.
- **Brudiclad (Stufe 3, ausdrücklich nicht pauschal schneiden):** Im Beginn des Kampfes die beiden eigenen Trigger so stapeln, dass **zuerst Mishras Warform entsteht und danach Brudiclad** andere Tokens in Kopien dieser Warform verwandelt. Diese anderen Tokens übernehmen **keinen separat erzeugten verzögerten Opfer-Trigger**; die Umwandlung verursacht aber **keine neuen ETBs**. Bei Kopien eines legendären Artefakts gilt die Legendenregel für gleichnamige legendäre Warforms. Das ist ein seltenes, mächtiges Alleinstellungsmerkmal, das seine sechs Mana relativiert.
- **Skullclamp:** Prüfen, wie oft tatsächlich ein 1/1 (Sai, Apprentice, Sokenzan) verfügbar ist. Ein Treasure oder Map allein lässt sich nicht ausrüsten; große Constructs sind keine kostenlosen Zwei-Karten-Ziele.
- **Nihil Spellbomb:** Metagame bestimmt die Qualität; wenn häufig mehrere gegnerische Friedhöfe gleichzeitig bekämpft werden müssen, ist Soul-Guide Lantern interessanter.
- **Basalt Monolith (Stufe 4†):** Ohne weitere Combo-Bauteile keine Endlosschleife, wenig Farbfixing; bleibt wegen expliziter Nutzervorgabe. Zusätzliche Rings of Brighthearth wären wegen möglicher früher Zweikarten-Endlosmana-Kombo **nicht** unser B3-Pfad.
- **Blasphemous Act:** Die einzige hier gespielte weitreichende rote Kreaturen-Sweeper-Funktion nicht ohne gleichwertige Antwort verlieren; die Karte ist in breiten Kreaturenspielen oft außerordentlich effizient.
- **Farblose Utility-Länder:** Nicht mehrere auf einmal tauschen, bevor die Anzahl echter U-, B- und R-Quellen, die Whir-UUU-Kosten sowie Artefaktland-/Metalcraft-Effekte neu berechnet sind.

## Konkrete Ersatzkandidaten (alle Vorschläge; keine Deckänderung)

**Priorität 1** = beste nächste Testhypothesen, **2** = stark aber mit strukturellem Trade-off, **3** = meta- oder situativ. **Gleiche Raus-Karte in mehreren Zeilen bezeichnet Alternativen, keine gleichzeitig durchführbaren Tausche.** Strukturangaben sind Delta zur heutigen Liste, **jeweils bei genau einem Einzeltausch**.

| Priorität | Derzeit raus (nur Vorschlag) | Potenziell rein | Erwarteter Nutzen | Stärkstes Gegenargument | Struktur | Entscheidungslage |
|:---:|---|---|---|---|---|---|
| **1** | Cyberdrive Awakener | Master Transmuter | Vier statt sechs Mana; legt teure Artefakte wie Portal aus der Hand direkt ins Feld und kann Blade für erneute ETBs zurücknehmen. | Braucht einsatzbereite Tap-Kreatur und Artefaktkarte auf der Hand; kein sofortiger Flieger-Alpha-Schlag. | Artefakte 46→46; Manaquellen/Länder unverändert. | Hoher Testwert |
| **1** | Nihil Spellbomb | Soul-Guide Lantern | Für gleiches Artefakt-Mana: ETB entfernt eine Friedhofskarte, später alle gegnerischen Friedhöfe; Kartenziehen ohne schwarzes Mana möglich. | Spellbomb zieht beim Tod auch durch fremde Opfer-/Zerstörungseffekte gegen B; Lantern verlangt die eigene Aktivierung. | Artefakte 46→46; Länder/Ramp unverändert. | Hoher Testwert |
| **1** | Cyberdrive Awakener | Mishra, Tamer of Mak Fawa | Ward—Opfer eines Permanents für alle eigenen Permanents schützt auch Mishra; Artefakte im Friedhof erhalten Unearth für 1BR. | Fünf Mana, Nichtartefakt, Unearth nur einmalig und mit Exil; Verlust des sofortigen Flieger-Finishers. | Artefakte 46→45; Länder/Ramp unverändert. | Hoher Testwert |
| **1** | Darksteel Citadel | Phyrexian Tower | Landslot wird zum Opfer-Outlet für Warforms, erzeugt situativ BB und unterstützt Marionette/Trawler. | Verlust eines unzerstörbaren Artefaktlands schwächt Metalcraft, Affinity und die Artefaktzahl. | Artefakte 46→45; Länder 35; Rampkern 13. | Hoher Testwert |
| **2** | Blasphemous Act | Toxic Deluge | Flexibler -X/-X-Reset kann auch unzerstörbare Kreaturen entfernen und benötigt fest drei Mana plus Leben. | Schmerzhafte Lebenszahlung, schädigt eigene Kreaturen weiter; Act kostet bei vielen Kreaturen häufig nur R. | Artefakte/Länder/Ramp unverändert. | Metaabhängig |
| **2** | Brudiclad, Telchor Engineer | Arcum Dagsson | Opfert eine Warform als Artefaktkreatur und sucht ein beliebiges Nichtkreatur-Artefakt direkt ins Spiel, auch Portal. | Brudiclad erzeugt bei richtiger Reihenfolge dauerhaft bleibende Warform-Kopien aus anderen Tokens; Arcum braucht Tap und ein überlebendes Ziel. | Artefakte 46→45; Länder/Ramp unverändert. | Nur bei wenig Token-Masse |
| **2** | Cyberdrive Awakener | The Master, Multiplied | Mishras eigene verzögerte Opfer-Trigger können Kreaturenspielsteine nicht mehr opfern; keine Legendenregel für eigene Kreatur-Tokens. | Sechs Mana und kein Artefakt; besondere Regel-Unterstützung in manabrew.app ungetestet; weiterhin anfällig für Entfernung. | Artefakte 46→45; Länder/Ramp unverändert. | Manabrew-Test zuerst |
| **2** | Skullclamp | Arcbound Ravager | Beliebige Artefakte kostenlos opfern, ohne den Kreaturentyp vorauszusetzen; nutzt Trawler, Marionette und Duplicator. | Verlust der besonders effizienten Zwei-Karten-Ziehoption bei 1/1-Token; Ravager selbst ist kein Mishra-Ziel. | Artefakte 46→46; Länder/Ramp unverändert. | Nur bei zu wenig Clamp-Zielen |
| **2** | Strionic Resonator | Repurposing Bay | Warform mit Mana Value X opfern und Artefakt mit X+1 gezielt direkt aus der Bibliothek holen; gutes Upgrade für kleine Targets. | Verliert die günstige Möglichkeit, Mishras Kampfauslöser zu duplizieren; Aktivierung nur als Sorcery und gegen weitere Kosten. | Artefakte 46→46; Länder/Ramp unverändert. | Tutor-Dichte beachten |
| **2** | Cyberdrive Awakener | Padeem, Consul of Innovation | Alle Artefakte erhalten Hexproof; potenziell Zusatzkarte im Upkeep bei höchstem Artefakt-Mana-Value. | Schützt Mishra selbst nicht, sofern er kein Artefakt ist; Nichtartefakt-Slot und Verlust des Flieger-Finishers. | Artefakte 46→45; Länder/Ramp unverändert. | Bei häufigem Ziel-Removal |
| **2** | Strionic Resonator | Mystic Forge | Liefert in artefaktlastiger Liste wiederholt Zauber vom Bibliotheksoberteil statt eines zusätzlichen Kampfauslösers. | Vier Mana und Farben für viele Artefaktzauber; verliert spezifische Verdopplung der Warform-Erzeugung. | Artefakte 46→46; Länder/Ramp unverändert. | Bei Kartenmangel |
| **2** | Ashnod's Altar | Krark-Clan Ironworks | Kann jedes Artefakt opfern, nicht nur Kreaturen, und erzeugt je Opfer CC; flexibler für Duplicator und Trawler. | Kostet vier statt drei Mana und öffnet mehr Combo-Linien; für Bracket 3 keine absichtlich frühe Endlosschleife ergänzen. | Artefakte 46→46; Länder/Ramp unverändert. | Vor Combo-Prüfung |
| **2** | Brudiclad, Telchor Engineer | Reckless Fireweaver | Zwei-Mana-Gruppenschaden bei jedem Artefakt-Eintritt, auch Warform und Helm-Map; schneller als sechs-Mana-Token-Umbau. | Verliert Brudiclads einzigartige dauerhafte Kopien und Token-Alpha-Schläge; keine Artefaktkarte. | Artefakte 46→45; Länder/Ramp unverändert. | Bei zu langsamen Abschlüssen |
| **3** | Buried Ruin | Command Beacon | Hilft bei wiederholt entferntem Mishra, indem Commander Tax aus der Command Zone umgangen werden kann. | Opfert ein Land und ersetzt Rekursion für Artefaktkarten; beide Länder erzeugen nur farbloses Mana. | Artefakte 46→46; Länder 35; Rampkern 13. | Nur bei Commander-Tax-Problemen |
| **3** | Inventors' Fair | The Mycosynth Gardens | Land kann bei entsprechender X-Zahlung ein eigenes Nichttoken-Artefakt kopieren, statt allein später zu tutoren. | Verliert universellen Artefakt-Tutor; Gardens kopiert nur eigenes Nichttoken-Artefakt und benötigt X-Mana plus Tap. | Artefakte 46→46; Länder 35; Rampkern 13. | Bei Board- statt Tutorbedarf |
| **3** | Strionic Resonator | Smelting Vat | Opfert Warforms und sucht aus acht Karten bis zu zwei Nichtkreatur-Artefakte mit zusammen passendem Mana Value direkt ins Spiel. | Zufällige Bibliotheksoberseite, vier Mana plus Aktivierung, keine gezielte Planbarkeit oder Triggerverdopplung. | Artefakte 46→46; Länder/Ramp unverändert. | Abhängig von Trefferquote |
| **3** | Brudiclad, Telchor Engineer | Fateful Discovery | Jedes Artefakt-ETB zieht eine Karte, auch Warforms, Treasures und Maps; neuerer 2026-Engine-Kandidat. | Fünf Mana plus UU, Nichtartefakt und keine eigenen ETBs oder Tokenkopien; Manabrew-Verhalten unbestätigt. | Artefakte 46→45; Länder/Ramp unverändert. | Manabrew-Test zuerst |
| **3** | Spine of Ish Sah | Wondrous Crucible | Verleiht allen Permanents Ward 2 und kann im Endsegment kostenlose Spruchkopien generieren. | Sieben Mana und zufällige Friedhofsauswahl; dafür entfällt Spines garantierte Entfernung eines beliebigen Permanents. | Artefakte 46→46; Länder/Ramp unverändert. | Bei hohem Schutzbedarf |
| **3** | Skullclamp | Trading Post | Flexibler Draw, kontrolliertes Opfern und Artefakt-Rückholung statt nur 1/1-basierter Kartenziehstrategie. | Kostet vier Mana und erfordert pro Aktivierung Mana/Tappen/Opferkosten; hoher Tempoverlust. | Artefakte 46→46; Länder/Ramp unverändert. | Bei mangelndem Clamp-Futter |
| **3** | Nihil Spellbomb | Unlicensed Hearse | Wiederverwendbarer Friedhofshass als Fahrzeug, langfristig zusätzliche Druckquelle. | Kein ETB-Hate, ohne Crew-/Exil-Setup kaum Kampfschaden und es entfällt Spellbombs Kartenziehen. | Artefakte 46→46; Länder/Ramp unverändert. | Bei Friedhofs-Metagame |
| **3** | Cyberdrive Awakener | Foundry Inspector | Dritter früher Kostenreduzierer für Artefakte und geringere durchschnittliche Manakurve bei gleicher Artefaktzahl. | Bereits Sculptor und Mechanaut vorhanden; reduziert Redundanzkosten nicht genug, wenn stattdessen ein Finisher verloren geht. | Artefakte 46→46; Länder/Ramp unverändert. | Bei Händen mit vielen Artefaktzaubern |
| **3** | Brudiclad, Telchor Engineer | Mirkwood Bats | Schaden an alle Gegner bei Erzeugen oder Opfern von Tokens; Warforms und Treasure-/Map-Ketten profitieren. | Nichtartefakt, vier Mana und geringerer Abschlussdruck ohne großen Tokenbestand; ausdrücklich nur optional. | Artefakte 46→45; Länder/Ramp unverändert. | Niedrige Priorität |

## Kandidaten, die auf dem Papier täuschen können

- **Mirrorworks:** triggert beim Eintritt von **Nichttoken-Artefakten**. Mishras Warforms sind Tokens; deshalb keine direkte Warform-ETB-Maschine.
- **Pia's Revolution:** reagiert auf **Nichttoken-Artefakte**, die in den Friedhof gelangen. Das planmäßige Sterben einer Warform löst diese Fähigkeit nicht aus.
- **Mehr reine Kopierer:** Sculpting Steel, Worldwalker Helm, Roaming Throne, Resonator, Panharmonicon und Determined Iteration sind bereits vorhanden. Ein weiterer Kopierer ohne eigenen Wert ist nicht automatisch besser als Schutz, Draw oder ein direkter ETB-Finisher.
- **Sundial of the Infinite:** Papierregel-Synergie legitim, aber aufgrund der Nutzererfahrung mit manabrew.app ausdrücklich vorerst **kein Wiedereinbau**.
- **Coveted Jewel:** hoher Draw/Mana-Wert, aber vom Nutzer wegen Kontrollverlust ausdrücklich ausgeschlossen.
- **Rings of Brighthearth:** zusammen mit dem bewusst behaltenen Basalt Monolith entsteht Endlos-Farblosmana. Das widerspricht dem angestrebten nicht-frühkombobasierten Bracket-3-Spielplan; daher **kein Kandidat**.

## Testkriterien vor jedem späteren Austausch

1. **Gleiches Budget:** Genau 100 Karten, Singleton, Grixis-Farbidentität, Bannliste, maximal drei Game Changer, keine absichtliche frühe Zweikarten-Endloskombo.
2. **Rollenparität:** Bei Manaquellen bzw. Artefaktländern den verlorenen Farben-/Artefaktbeitrag prüfen. Mind Stone, Mox Opal, Basalt Monolith, Fabricate, Whir, Jhoira, Kappa, Demonic Junker und Tithing Blade bleiben gesetzt.
3. **Spielpraxis:** Dokumentiere zehn oder mehr vergleichbare Starthände und echte Manabrew-Partien pro Testpaar: effektiver Einsatz vor Turn 6, farbige Manaengpässe, Zahl sinnvoller Warform-Kopien, Kartenüberschuss, Siege/Verluste und App-Fehler. **Die genannten Effizienzgewinne sind Hypothesen, keine gemessenen Winrate-Differenzen.**
4. **Nachweis:** Nach jedem späteren tatsächlichen Kartentausch `current.txt` und die zugehörige Ersetzbarkeitsbewertung am **frisch veröffentlichten GitHub-Commit** neu prüfen. Bracket 4 bleibt separat unangetastet.

## Prüfquellen

- **Kartentexte, Farbidentität, Legalität, Game-Changer-Metadaten:** [Scryfall Cards Collection API](https://scryfall.com/docs/api/cards/collection), live abgefragt für die gepinnten 100 Karten und 50 Alternativen am 10.10.2026. Aktuelle tatsächliche Manabrew-Laufzeitunterstützung **nicht** empirisch getestet.
- **Wizards offizielle Commander-Regeln und Brackets:** https://magic.wizards.com/en/formats/commander
- **Wizards, Änderungen der Game-Changer-Liste am 21.10.2025 (Entfernung Urza/Deflecting Swat, Aufhebung pauschaler Tutor-Beschränkungen):** https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- **Wizards, Update 09.02.2026:** https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- **Wizards aktuelle Bannliste:** https://magic.wizards.com/en/banned-restricted-list
- **Wizards Mishra-Regelgrundlage:** https://magic.wizards.com/en/news/feature/the-brothers-war-release-notes

**Abgrenzung:** Das Rating ist eine nachvollziehbare strukturelle Deckbau-Analyse auf Basis vollständiger aktueller Kartendaten, keine simulierte oder gemessene Spielergebnis-Analyse. Neue Sets können spätere relative Stufen verändern.
