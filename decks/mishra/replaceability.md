# Mishra, Eminent One – aktuelle Ersetzbarkeitsprüfung (optimiertes Bracket 3)

**Aktive Version:** 11. Oktober 2026 · [Deck-Commit `4f12397`](https://github.com/alexdermohr/magic/commit/4f12397b262d3d7b0fcd32dc6d05de5d41d340b) · [current.txt](current.txt) · [Erweiterter Kreis – 132 aktuell nicht enthaltene Karten](erweiterter-kreis.md) · [Gesamtanalyse](analysis.md).

**Struktur nach den zwei bestätigten Tauschen:** 100 unterschiedliche Karten einschließlich Commander, **35 Länder**, **45 Artefaktkarten**, **13 reguläre Mana-Artefakte**, **drei Game Changer** (Rhystic Study, Cyclonic Rift, Demonic Tutor). Keine klassischen Kreaturenwipes. **The Mightstone and Weakstone** und **Demonic Junker** bleiben.

| Raus | Rein | Erwarteter Mehrwert | Risiko |
|---|---|---|---|
| Spine of Ish Sah | **Nautiloid Ship** | Vier statt sieben Mana; Friedhof eines Spielers beim ETB exilieren, fliegende Warform angreifen lassen, bei Kampfschaden eine dadurch exilierte Kreatur übernehmen | Verliert universelle Permanent-Zerstörung; Schiffs-Exil ist objektgebunden |
| Fabricate | **Arcum Dagsson** | Opfert Warforms, um beliebige Nichtkreatur-Artefakte, insbesondere Portal to Phyrexia, wiederholt direkt aus Bibliothek ins Spiel zu holen | Vier statt drei Mana; Tap-Kreatur und Opferziel erforderlich, kein sofortiger Tutor auf die Hand |

**Bewertungskriterien:** Nur die 100 aktuell enthaltenen Karten erhalten unten eine Stufe; **alle historischen Cuts und nicht aufgenommenen Kandidaten** sind im [Erweiterten Kreis](erweiterter-kreis.md). Alte Vorlieben sind kein Ausschluss von Neubewertungen; bei tatsächlichen Änderungen bleiben alle Kartenlisten und Dokumentationen synchron.

| Stufe | Bedeutung | Karten |
|:---:|---|---:|
| 1 | Zentrale, schwer ersetzbare Rolle | 21 |
| 2 | Hoher Deckbeitrag | 49 |
| 3 | Vergleichsslot, alternative Funktion denkbar | 28 |
| 4 | Theoretisch zuerst auf dem Prüfstand | 2 |
| 5 | Kein eindeutig funktionsloser Platz | 0 |
| **Gesamt** | **100 aktuelle Einzelbewertungen** | **100** |

**Spielhinweis:** Nautiloid Ship löst seine Friedhofsexil-Fähigkeit beim Eintritt der Warform aus; die Kampfschaden-Fähigkeit kann nur eine Kreatur zurückbringen, die **das jeweilige Ship-Objekt** exiliert hat. Arcum benötigt ein legales **Artefaktkreatur-Ziel** und opfert diese bei Auflösung; die Bibliothekssuche ist nicht auf einen bestimmten Manawert begrenzt. Andere Artefaktkreaturen wie Kappa sind nicht direkt mit Mishras Commander-Auslöser kopierbar. Die tatsächliche Manabrew-Funktion ist nicht durch eigenständige Testpartien belegt.

## Nachprüfung 11.10.2026: kein unbewiesener Slotwechsel

**Ergebnis:** Alle **100** einzeln bewerteten Namen entsprechen exakt [current.txt](current.txt); die **132** ausgeschlossenen Karten in [erweiterter-kreis.md](erweiterter-kreis.md) überlappen nicht. Die neu ausgeführte Live-Scryfall-Abfrage in [validate.py](validate.py) **bestand für alle 100 Karten**: Commander-legal, Grixis-Farbidentität, 35 Länder, 45 Artefakte, 13 definierte Mana-Artefakte, genau **Demonic Tutor / Rhystic Study / Cyclonic Rift** als Game Changer. Bracket-4-Blob unverändert. Die Matrizenstufen bleiben vorerst **21 × 1, 49 × 2, 28 × 3, 2 × 4**; keine Karte wurde ohne gesicherten Nettogewinn ausgetauscht.

**Vergleich der realistischen Wechsel:** `Jhoira → Thousand-Year Elixir` tauscht Historic-Cast-Draw gegen schnelleres Arcum/Welder/Transmuter-Tappen; `Strionic Resonator → Thousand-Year Elixir` opfert einen unabhängigen Zusatz-Mishra-Trigger für Aktivierungstempo. Beide bleiben **Hypothesen**, solange die tatsächlichen Manabrew-Interaktionen und eine gewinnende Sequenz nicht geprüft sind. Ebenso setzt `Brudiclad → The Master, Multiplied` den Manabrew-Test der statischen Token-Ausnahme voraus. **Demonic Junker, Whir of Invention und The Mightstone and Weakstone bleiben bewusst aktiv.** Einzelheiten und genaue Prüfschritte: [Analyse](analysis.md) und [Manabrew-Testprotokoll](manabrew-tests.md).

## Jede einzelne aktuelle Karte

### Kommandeur und Kreaturen

| # | Karte | Ersetzbarkeit | Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 1 | Mishra, Eminent One | **1** | Kommandeur und einziger garantierter Warform-Erzeuger. Ohne seine Kampfauslösung fehlt der primäre Spielplan. |
| 2 | Emry, Lurker of the Loch | **2** | Günstige wiederholbare Artefaktzauber aus dem Friedhof; benötigt Friedhof, Überleben und legales Timing. |
| 3 | Jhoira, Weatherlight Captain | **3** | Historic-CAST zieht Karten, nicht Warform-/Map-ETB. Für vier Mana früher als Fateful Discovery, dafür stärker vom Handkarten-Casten abhängig. |
| 4 | Etherium Sculptor | **2** | Beschleunigt fast alle ausgespielten Artefakte; ein fragiler Körper, kein eigener Warform-ETB-Effekt. |
| 5 | Enthusiastic Mechanaut | **2** | Zweite günstige Artefakt-Kostenreduktion plus Flugfähigkeit; Doppel-Farbanforderung im frühen Spiel. |
| 6 | Knight Paladin | **1** | Nichtkreatur-Fahrzeug: ETB verursacht vier Schaden bei jedem Gegner, beliebig per Mishra erneut kopierbar. |
| 7 | Marionette Apprentice | **3** | Bereits für zwei Mana Drain bei Todesfällen eigener Kreaturen/Artefakte. Vergleich mit Fireweaver: Tod/Opfer gegen unmittelbare ETBs. |
| 8 | Sai, Master Thopterist | **2** | Token beim Wirken von Artefaktzaubern und Opfer-Draw; Token entstehen nicht schon durch jeden Mishra-Auslöser. |
| 9 | Goblin Welder | **2** | Tauscht kleine Artefakte gegen schwere Friedhofsziele inklusive Portal; summoning-sick, removal-anfällig und zielabhängig. |
| 10 | Goblin Engineer | **2** | Legt beliebiges Artefakt in den Friedhof; Rückholung direkt ins Feld nur bei Mana Value bis 3. |
| 11 | Brudiclad, Telchor Engineer | **3** | Mit nach Mishra verrechnetem Kampfauslöser wandelt es bereits vorhandene Tokens in bleibende Warform-Kopien; keine neuen ETB-Auslöser, sechs Mana und Setup. |
| 12 | Master Transmuter | **2** | Vier Mana als Artefaktkreatur: für {U}, Tap und Rückgabe eines eigenen Artefakts ins eigene Handfeld bringt sie ein Artefakt aus der Hand sofort ins Spiel. Portal/Blade-ETB wird wiederholbar; braucht Tap-Fenster und Handkarte. |
| 13 | Thought Monitor | **3** | Mit Affinity oft günstig plus zwei echte Karten beim Eintritt; selbst Artefaktkreatur und deshalb kein direktes Mishra-Kopierziel. |
| 14 | Roaming Throne | **1** | Human/Artificer verdoppelt Mishras Kampfbeginn-Trigger und skaliert alle Kopierziele; kein direkter Mishra-Zieltyp. |
| 15 | Kappa Cannoneer | **2** | Wachsender, durch Ward {4} geschützter und bei Artefakt-ETB unblockbarer Einzel-Finisher; kein Mishra-Kopierziel, aber eigener unabhängiger Siegweg. |
| 16 | Urza, Lord High Artificer | **1** | Macht vorhandene Artefakte zu blauen Manaquellen, erzeugt Construct und nutzt Überschussmana; seit Oktober 2025 kein Game Changer mehr. |

### Ramp, Artefakte und Synergie-Enabler

| # | Karte | Ersetzbarkeit | Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 17 | Sol Ring | **1** | Ein-Mana-Ramp mit zwei farblosen Mana; eines der stärksten Tempoelemente. |
| 18 | Arcane Signet | **1** | Zuverlässige U/B/R-Versorgung für den Dreifarben-Kommandeur bei zwei Mana. |
| 19 | Fellwar Stone | **3** | Günstige Farbenbeschleunigung; verfügbare Farben hängen von gegnerischen Ländern ab. |
| 20 | Dimir Signet | **2** | Günstiger U/B-Fix für Mishra und Whir; braucht anderes Mana zum Aktivieren. |
| 21 | Izzet Signet | **2** | Günstiger U/R-Fix; braucht ein vorgelagertes Mana zur Aktivierung. |
| 22 | Rakdos Signet | **3** | Günstiger B/R-Fix; braucht ein vorgelagertes Mana zur Aktivierung. |
| 23 | Talisman of Dominance | **2** | U/B sofort verfügbar und unterstützt blaue Doppel-/Dreifach-Anforderungen; farbige Nutzung kostet Leben. |
| 24 | Talisman of Creativity | **2** | U/R sofort verfügbar; farbige Nutzung kostet Leben. |
| 25 | Talisman of Indulgence | **3** | B/R sofort verfügbar; farbige Nutzung kostet Leben. |
| 26 | Mind Stone | **3** | Zweimana-Rock mit spätem einmaligem Draw; dauerhaft nur farblos. Gegen einen echten U/B/R-Rock offen vergleichbar. |
| 27 | Liquimetal Torque | **3** | Ramp plus Möglichkeit, ein eigenes Nichtland-Permanent für Mishra zum Artefakt zu machen; farblos und Tap-Konflikt. |
| 28 | Ichor Wellspring | **1** | Eines der effizientesten Warform-Ziele: ETB-Draw und beim Opfer erneut Draw; leichter Artefaktaufbau. |
| 29 | Cryogen Relic | **2** | Zeichnet beim Ein- und Verlassen des Spielfelds unabhängig vom Friedhof; niedrige Kosten, aber relativ wenig Board-Interaktion. |
| 30 | Esoteric Duplicator | **1** | Macht aus geopferten Warforms gegen zwei Mana bleibende Kopien im nächsten Endsegment; zentrale Altar-Synergie. |
| 31 | Worldwalker Helm | **2** | Map bei Artefakt-Token-Produktion und später gezielte Kopie eines Artefakt-Tokens; benötigt aktiviertes Mana und Tappen. |
| 32 | Prized Statue | **2** | Treasure bei Eintritt und Tod, dadurch extrem gutes frühes Mishra-Ziel und Farbfix; geringere Endspielwirkung. |
| 33 | Reckless Fireweaver | **2** | Für {1}{R} eine günstige Wincon: JEDES eintretende eigene Artefakt – Warform, Map, Treasure, Construct – verursacht 1 Schaden an jedem Gegner. Kein Artefakt, aber wiederholt sofortiger Ertrag. |
| 34 | Mishra, Tamer of Mak Fawa | **2** | Fünfmana-Nichtartefakt: Ward—Sacrifice a permanent für alle eigenen Permanents inklusive Mishra. Artefaktkarten im eigenen Friedhof bekommen Unearth {1}{B}{R}, inklusive Portal; Exil bei Endsegment/Verlassen. |
| 35 | Ashnod's Altar | **2** | Kostenlose Opfermöglichkeit für Warforms und Kreaturen; finanziert Duplicator und Todesauslöser, aber nur farbloses Mana. |
| 36 | Idol of Oblivion | **2** | Mishra erzeugt regelmäßig Tokens, dadurch günstige wiederkehrende Karte; braucht überlebendes Artefakt und Tap-Fenster. |
| 37 | Strionic Resonator | **3** | Wiederholbare zusätzliche Mishra-Trigger für {2}, Tap. Repurposing Bay konkurriert als direkter Feld-Tutor. |
| 38 | Mox Opal | **2** | Kostenloser Artefakt-Rock und mit Metalcraft farbiges Mana, vor zwei weiteren Artefakten im Frühspiel noch funktionslos. |
| 39 | Chromatic Lantern | **3** | Dreimana-Rock, der beliebige Farben produziert und allen eigenen Ländern dieselbe Fähigkeit gibt. Bessere Farbkonstanz als Basalts Einzelburst; kein eigener Warform-ETB. |
| 40 | Panharmonicon | **2** | Verdoppelt ETB-Effekte von Wellspring, Blade, Paladin und anderen; ohne ETB-Ziele vier Mana ohne unmittelbaren Effekt. |
| 41 | Scrap Trawler | **3** | Artefakt-Tode bringen jeweils eine kleinere Artefaktkarte aus dem Friedhof auf die Hand zurück. Starker Boardwipe-Rückgriff, setzt echte Artefaktkarten im GY voraus. |
| 42 | Rhystic Study | **1** | Game Changer für kontinuierlichen Kartennachschub; beansprucht einen der drei erlaubten Plätze. |
| 43 | The Mightstone and Weakstone | **2** | Fünf Mana für starkes kopierbares, legendäres Artefakt: ETB zieht zwei Karten oder gibt einer Kreatur −5/−5, Original produziert CC für Artefaktzauber/-fähigkeiten. Legendäre Warform-Duplikate gleichen Namens kollidieren. |
| 44 | Sculpting Steel | **2** | Flexibler zusätzlicher Blade-, Wellspring-, Paladin- oder Portal-Effekt je nach Spielfeld; ohne hochwertige Vorlage schwach. |
| 45 | Nautiloid Ship | **2** | Vier-Mana-Flugfahrzeug als Mishra-Ziel: Die 4/4-Warform exiliert beim ETB einen Spielerfriedhof und kann mit Flugfähigkeit/Eile direkt angreifen. Nach Kampfschaden bringt sie eine Kreatur zurück, die **dieses Exemplar** exiliert hat. Der ursprüngliche Friedhofshass war zuvor nicht vorhanden; gegen Blocker keine garantierte Reanimation. |
| 46 | Portal to Phyrexia | **2** | Extrem hoher ETB- und Upkeep-Ertrag, gewinnt Kreaturenspiele; neun Mana ohne Welder/Transmuter ein Starthand-Risiko. |
| 47 | Simulacrum Synthesizer | **1** | Mishras eintretende Artefakte mit Mana Value ab 3 erzeugen massiv skalierende Constructs; zentrale Boardengine. |
| 48 | Lich's Relic | **3** | Ein-Mana-Kopierziel mit optionalem Removal bei jedem ETB gegen weitere zwei Mana; im Manamangel schwächer. |
| 49 | Demonic Junker | **4** | Affinity-Artefaktfahrzeug mit ETB-Kreaturenzerstörung je Spieler. Sieben Mana ohne Artefaktdichte; stark, aber mit Blade/Relic/Portal funktional redundant. |
| 50 | Lightning Greaves | **2** | Früher Schutz und Haste für Mishra oder Welder; Shroud kann auch eigene Ziel-Effekte blockieren. |

### Interaktion, Tutor und Schutz

| # | Karte | Ersetzbarkeit | Nutzen und Opportunitätskosten |
|---:|---|:---:|---|
| 51 | Determined Iteration | **3** | Mit richtiger Combat-Trigger-Reihenfolge populiert es gerade erzeugte Warforms; ebenfalls verzögertes Opfer, kein Artefakt. |
| 52 | Cyclonic Rift | **1** | Asymmetrischer Reset und hervorragender Siegzugs-Öffner; Game Changer 2/3. |
| 53 | Mana Drain | **2** | Sehr billiger Schutz mit späterem Mana-Burst; verlangt früh doppeltes Blau. |
| 54 | An Offer You Can't Refuse | **3** | Effizienter Schutz vor Nichtkreatur-Zaubern, schenkt aber zwei gegnerische Treasures und ist gegen Kreaturen unbrauchbar. |
| 55 | Chaos Warp | **2** | Sehr flexible Antwort auch auf störende Verzauberungen; zufälliges neues gegnerisches Permanent bleibt Risiko. |
| 56 | Deflecting Swat | **3** | Mit Commander oft kostenlose Umlenkung, schützt situationsbedingt; kein Game Changer seit Oktober 2025. |
| 57 | Deadly Rollick | **2** | Mit Commander kostenloses Kreaturen-Exil; ohne Mishra vier Mana und kein Zugriff auf Nichtkreaturen. |
| 58 | Feed the Swarm | **3** | Wichtige Antwort auf Verzauberungen in Grixis, aber Sorcery und Lebenspunktverlust; bei genügend anderem Removal prüfbar. |
| 59 | Vandalblast | **3** | Einseitiger Massen-Artefakthass, lässt die eigenen Artefakte stehen; metagameabhängig, aber einzigartig im Slot. |
| 60 | Oni-Cult Anvil | **2** | {B}{R}-Nichtkreatur-Artefakt und Mishra-Kopierziel: Beim ersten eigenen Artefakt-Verlassen je Zug erzeugt es einen 1/1-Artefakt-Construct; für Tappen und Opfer eines Artefakts verursacht es 1 Schaden an allen Gegnern und gewinnt 1 Leben. Liefert Opfer-/Token-/Fireweaver-/Duplicator-Synergien, benötigt aber Artefakte. |
| 61 | Mystic Remora | **2** | Früher Multiplayer-Kartennachschub; kumulative Unterhaltskosten und kreaturenlastige Gegner schränken ein. |
| 62 | Arcum Dagsson | **2** | {3}{U}-Artificer und wiederholbarer Feld-Tutor: Tap, eigene Artefaktkreatur (bevorzugt eine Warform) als Ziel opfern und ein beliebiges Nichtkreatur-Artefakt ohne Manawertgrenze direkt aus der Bibliothek holen. Muss normalerweise erst eine Runde überleben; weniger sofort zuverlässig als Fabricate. |
| 63 | Whir of Invention | **4** | Spielt Artefakte als Instant direkt aus Bibliothek, Improvise reduziert X, niemals die harten UUU. Besonders teuer für große Zielkarten. |
| 64 | Demonic Tutor | **1** | Sehr günstiger universeller Zugriff auf das jeweils fehlende Teil; Game Changer 3/3. |
| 65 | Tithing Blade | **1** | Zweimana-Artefakt; jede Mishra-Kopie lässt JEDEN Gegner eine Kreatur opfern, ohne zu zielen. Gegen Token-Armeen schwächer. |

### Länder

| # | Karte | Ersetzbarkeit | Nutzen und Opportunitätskosten |
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
| 75 | Darksteel Citadel | **3** | Unzerstörbares Artefaktland sichert früh Metalcraft/Mox Opal und unterstützt Affinity nach zwei entfernten Artefakten; produziert nur {C}. Tower/Gardens bieten Utility, senken Artefaktanzahl weiter. |
| 76 | Flooded Strand | **2** | Findet Insel-Duals trotz fehlender Plains; fetchbare Farbwahl gegen einen Lebenspunkt. |
| 77 | Marsh Flats | **2** | Findet Swamp-Duals trotz fehlender Plains; fetchbare Farbwahl gegen einen Lebenspunkt. |
| 78 | Academy Ruins | **2** | Regelmäßige Friedhofsrekursion für Artefaktkarten auf Bibliotheksoberseite; kostet Tempo und farbiges Mana. |
| 79 | Buried Ruin | **3** | Einmalige Artefakt-Rekursion auf die Hand durch Landopfer; farbloses Land, teilweise durch Trawler/Academy abgedeckt. |
| 80 | Inventors' Fair | **3** | Tutor für beliebiges Artefakt bei Metalcraft und gelegentlich Lebensgewinn; farbloses Land und teure Aktivierung. |
| 81 | Urza's Saga | **1** | Sucht in der aktuellen Liste **Sol Ring** (Manakosten {1}) oder **Mox Opal** ({0}); Skullclamp und die Spellbomb sind nicht mehr enthalten, `{B}` von Lich's Relic ist kein gültiges Suchziel. Produziert auch Constructs und opfert sich planmäßig als Land. |
| 82 | Otawara, Soaring City | **2** | Ungetappte blaue Quelle oder schwer konterbares Channel-Bounce; nahezu ohne Deckbaupreis. |
| 83 | Takenuma, Abandoned Mire | **2** | Ungetappte schwarze Quelle mit möglicher Kreaturen-Rekursion; passt zu Friedhofsplan. |
| 84 | Sokenzan, Crucible of Defiance | **3** | Rote Quelle mit spätem Token-Futter für Ashnod's Altar/Marionette Apprentice; sonst gewöhnliches Farbland. |
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
| 96 | Sulfurous Springs | **3** | Ungetappter B/R-Fix; Leben für farbiges Mana. |
| 97 | Mana Confluence | **2** | Jede benötigte Farbe jederzeit gegen einen Lebenspunkt; lebensintensiver als Duals. |
| 98 | Island | **3** | Wichtiges fetchbares Basic und resilient gegen Nichtstandardländer-Hass; Stückzahl darf im 35-Land-Gerüst angepasst werden. |
| 99 | Swamp | **3** | Fetchbares schwarzes Basic, unterstützt Frühspiel und Schutz vor Nonbasic-Hate; nicht ersatzlos streichen. |
| 100 | Mountain | **3** | Fetchbares rotes Basic für verlässlichen Grundzugang trotz Nonbasic-Hate; nicht ersatzlos streichen. |


## Jetzt noch ernsthafte Tauschoptionen

**Theoretische Stufe-4-Slots:** Demonic Junker und Whir of Invention. **Demonic Junker bleibt nach aktueller Nutzerentscheidung gesetzt**; seine Konkurrenz ist nicht als sofortiger Tauschplan zu verstehen. Whir kostet UUU plus X und darf erneut geprüft werden. Alle neuen, noch nicht enthaltenen Kandidaten stehen im [Erweiterten Kreis](erweiterter-kreis.md).

| Priorität | Möglicher Cut | Potenziell rein | Nutzen | Stärkstes Gegenargument | Struktur |
|:---:|---|---|---|---|---|
| A | **Brudiclad, Telchor Engineer** | **The Master, Multiplied** | Mishras kontrollierter Warform-Opfertrigger kann Kreaturenspielsteine nicht opfern; keine Legendenregel für eigene Kreaturentokens. | Sechs Mana, kein Artefakt; Brudiclad kann aus vorhandenen Tokens selbst permanente Warforms machen. Funktionsprüfung in Manabrew offen. | Artefakte 45→44, Land/Ramp unverändert |
| A | **Strionic Resonator** | **Repurposing Bay** | Für {2}, Tap und Artefaktopfer gezieltes Nichtkreatur-/Kreatur-Artefakt mit MV um exakt eins höher direkt suchen; verwertet Warforms nach Kampf. | Resonator verdoppelt Mishras Kampfauslöser ohne Opfer; Bay braucht Sorcery-Timing, Tap und passende MV-Stufe. | Artefakte 45, Länder/Ramp unverändert |
| B | **Jhoira, Weatherlight Captain** | **Fateful Discovery** | Zieht bei jedem Artefakt-ETB inklusive Warform und Worldwalker-Helm-Map; Set *The Hobbit*, 14.08.2026. | Jhoira zieht früher bei Historic-Casts, auch ohne Mishra; Discovery hat MV 5 und UU und ist kein Artefakt. | Kein Artefaktunterschied, schwerere Kurve |
| B | **Darksteel Citadel** | **Phyrexian Tower** | Opfert Warforms für BB und kann Duplicator/Trawler auslösen. | Entfernt einen der verbliebenen Artefaktland-/Metalcraft-Bausteine; Ashnod's Altar übernimmt Opfer bereits. | Länder 35, Artefakte 45→44 |
| C | **Mishra, Tamer of Mak Fawa** | **Padeem, Consul of Innovation** | Schützt Artefakte mit Hexproof und kann Karten ziehen, billiger. | Schützt Mishra selbst nicht und verliert Unearth für teure Artefakte. | Nichtartefakt gegen Nichtartefakt |

## Operative Regeln und Nachprüfbarkeit

- **Reckless Fireweaver** triggert bei eigenen Artefakt-Eintritten (Warforms, Helm-Maps und Oni-Constructs). **Marionette Apprentice** löst beim Sterben eigener anderer Kreaturen/Artefakte aus. Ein regulär geopferter Warform-Token zählt als Tod; er bleibt danach nicht im Friedhof.
- **Mishra, Tamer of Mak Fawa** gewährt Ward—Sacrifice a permanent für alle eigenen Permanents; Unearth {1}{B}{R} funktioniert für Artefaktkarten im Friedhof, nicht für verschwundene Warform-Tokens. Das reanimierte Artefakt wird im nächsten Endsegment oder beim Verlassen exiliert. Ward stoppt keine globalen Boardwipes.
- **Oni-Cult Anvil** ist ein Nichtkreatur-Artefakt und kann von Mishra kopiert werden. Die Warform besitzt Haste und kann seine Tap-Opferfähigkeit im eigenen Zug nutzen, sofern ungetappt. Das ursprüngliche Anvil kann durch das Opfer einer Warform einen 1/1-Construct erzeugen, einmal im eigenen Zug; dessen Artefakt-ETB löst wiederum Reckless Fireweaver aus.
- **Ohne Nihil Spellbomb** kann ein graveyardbasiertes Metagame einen neuen Hate-Slot erfordern; Soul-Guide Lantern wäre dann der naheliegende günstige Artefakt-Kandidat, aber kein automatischer Ersatz ohne Gegnermeta.
- **Manabrew-Grenze:** Sundial und Coveted Jewel bleiben wie verlangt draußen. Die Funktionsfähigkeit der neuen Synergien wurde anhand der Oracle-Texte, nicht in nachgespielten Manabrew-Partien, überprüft.
- **Bracket 3:** Maximal drei Game Changer, keine beabsichtigte frühe Zweikarten-Endloskombo. Die drei neuen Karten sind keine Game Changer und legal in Grixis.

### Primärquellen

[Wizards: Commander](https://magic.wizards.com/en/formats/commander) · [Wizards: Commander-Brackets 09.02.2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Scryfall-Collection-API](https://scryfall.com/docs/api/cards/collection) · [Reckless Fireweaver](https://scryfall.com/card/kld/126/reckless-fireweaver) · [Mishra, Tamer of Mak Fawa](https://scryfall.com/card/bro/217/mishra-tamer-of-mak-fawa) · [Oni-Cult Anvil](https://scryfall.com/card/neo/230/oni-cult-anvil).

**Evidenzgrenze:** Spielstärke, Meta und Manabrew-Implementierung wurden nicht durch kontrollierte Partien nachgewiesen; die Bewertung ist ein nachvollziehbares aktuelles Struktururteil.