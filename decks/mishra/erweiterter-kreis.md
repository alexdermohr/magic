
# Erweiterter Kreis – Mishra, Eminent One (Bracket 3)

**Stand:** 11. Oktober 2026 · **Verbindliche aktive Liste:** [current.txt](current.txt) · **Deck-Revision:** [`4f12397`](https://github.com/alexdermohr/magic/commit/4f12397b262d3d7b0fcd32dc6d05de5d41d340b9) · [Analyse](analysis.md) · [Ersetzbarkeitsmatrix](replaceability.md).

## Neubewertung vom 11.10.2026

Der zuletzt veröffentlichte Deckstand [`52899aa`](https://github.com/alexdermohr/magic/commit/52899aa979e11b8365fff0a90af5e297a0061f31) enthält bereits Nautiloid Ship und Arcum Dagsson. **Keine Karte wurde bei dieser Prüfung aus `current.txt` entfernt und keine hier geführte Karte aufgenommen.** Die untenstehenden **36 historischen Cuts + 96 extern geprüften Alternativen = 132 einzigartige ausgeschlossene Karten** bleiben gültig. Die sieben Kandidaten mit der höchsten nächsten Prüfpriorität haben unten ausdrücklich **Gegenargumente und Rückkehrbedingungen** erhalten. Testergebnisse und Timingfallen: [manabrew-tests.md](manabrew-tests.md).

**Neue Bewertung ist kein tatsächlicher Gewinnraten-Nachweis.** Die laufende Priorität gilt: Thousand-Year Elixir / The Master, Multiplied vor Soul-Guide Lantern (metagameabhängig), The Mycosynth Gardens, Repurposing Bay, Fateful Discovery und Shuri. Ein Kartentausch wird erst bei positiver **Nettonutzen- und Engine-Gegenprobe** vorgenommen.

## Zweck und feste Pflege-Regel

Der **Erweiterte Kreis** ist die zentrale Warteliste/Archiv für Mishra-B3-Karten, die **früher im Deck waren und gestrichen wurden** oder **konkret geprüft, aber aktuell nicht aufgenommen** wurden. Er ist **keine zweite Deckliste** und zählt nicht zu den 100 aktiven Karten. Die aktive B3-Version liegt weiterhin ausschließlich in `current.txt`; Bracket 4 bleibt separat.

**Verbindlicher Ablauf für künftige Optimierungen:**
1. Bei jedem neuen Tausch die entfernte Karte **hier eintragen** (mit Anlass, Gegenargument und Rückkehrbedingung). Jeder nicht aufgenommene, ernsthaft geprüfte Kandidat kommt ebenfalls hierher.
2. Sobald eine Karte **in die aktive Liste aufgenommen** wird, sie **aus der Tabelle der derzeit Ausgeschlossenen entfernen** und den Schritt in `analysis.md` dokumentieren. Nie gleichzeitig als derzeit ausgeschlossen und aktiv führen.
3. `replaceability.md` betrifft nur die 100 **aktuellen** Karten; der Erweiterte Kreis verwaltet die Alternativen. Bei neuen Reviews beide Dateien auf die neue aktive `current.txt` synchronisieren.
4. Historische Ausschlüsse sind **keine ewigen Verbote**, außer wenn sie wie Sundial (Manabrew-Probleme), Coveted Jewel (Kontrollverlust) oder Kreaturenwipes ausdrücklich unerwünscht sind. Auch sie bleiben hier dokumentiert, falls sich Rahmenbedingungen ändern.

**Vollständigkeit der historisch gespielten Karten:** Alle **22 GitHub-Revisionen** von `decks/mishra/current.txt` vom ersten B3-Track bis zum aktuellen Deck wurden gegen die aktive Liste verglichen. **136 verschiedene Karten** kamen insgesamt in diesen B3-Revisionen vor: **100 aktuell**, **36 historische, derzeit ausgeschlossene Karten**. Zusätzlich folgen **96 namentlich geprüfte, niemals in einer der erfassten B3-Versionen gespielte Alternativen** (Scryfall-Namen am 11.10.2026 bestätigt). Insgesamt enthält dieser Kreis **132 eindeutige, nicht im aktuellen Deck enthaltene Karten**. Das ist eine nachprüfbare Liste der bisher bekannten und geprüften Optionen, **kein Katalog aller existierenden MTG-Karten**.

Legende: **Rückkehr möglich** = sinnvoller künftiger Test; **historisch gestrichen** = bisher kein überzeugender Mehrwert; **metagameabhängig** = nur bei passendem Umfeld; **bewusst draußen** = scheidet unter heutigen Bedingungen aus. Bei Alternativen: **hoher Testwert**, **weiterer Kandidat**, **niedrige Priorität**, **bewusst draußen**.

## A. Früher in Mishra B3, jetzt gestrichen (36)

| Karte | Aktuelle Einstufung | Grund für Streichung / mögliche Neubewertung |
|---|---|---|
| **Abrade** | historisch gestrichen | Situativer Artefakt-/Kreaturenschaden, gegenüber vorhandener Interaktion weniger entscheidend. |
| **Aether Spellbomb** | Rückkehr möglich | Günstiger Saga-Suchtreffer für Bounce oder Draw, aber im bisherigen Verlauf zugunsten stärkerer Engines gestrichen. |
| **Ancient Tomb** | Rückkehr möglich | Beschleunigt farblos um zwei Mana, deckt U/B/R-Anforderungen aber nicht ab und kostet Leben. |
| **Baleful Strix** | historisch gestrichen | Kleiner Artefaktkreatur-ETB mit Draw/Deathtouch, kein direktes Nichtkreatur-Mishra-Kopierziel. |
| **Basalt Monolith** | historisch gestrichen | Einmaliger Schub von drei farblosen Mana, ohne Untap-Engine langfristig kein zusätzlicher Ertrag. |
| **Bedevil** | historisch gestrichen | Solides gezieltes Removal, Platz zugunsten wiederholbarer Artefakt-Interaktion verloren. |
| **Blackcleave Cliffs** | historisch gestrichen | Frühes B/R-Dual, später getappt; vorhandene Fetch-/Dualbasis ist flexibler. |
| **Blasphemous Act** | bewusst draußen | Kreaturenwipe ausdrücklich unerwünscht; eigenes Mishra-Board wird getroffen. |
| **Counterspell** | historisch gestrichen | UU-Konter ohne den Manavorteil von Mana Drain oder die Ein-Mana-Effizienz anderer Counter. |
| **Coveted Jewel** | bewusst draußen | Hoher ETB-Draw und Mana, aber Angriff kann die Kontrolle an den Gegner geben; ausdrücklich ausgeschlossen. |
| **Cyberdrive Awakener** | Rückkehr möglich | Starker fliegender Alpha-Schlag; kann vor dem Kampf Mishras nichtkreaturische Kopierziele zu Kreaturen machen. |
| **Darkslick Shores** | historisch gestrichen | Frühes U/B-Dual, später getappt; gegenüber vorhandener farbiger Basis weniger flexibel. |
| **Exotic Orchard** | Rückkehr möglich | Oft guter Mehrfarben-Fix, benötigt jedoch passende gegnerische Länder. |
| **Fabricate** | Rückkehr möglich | Sicherer Artefakttutor auf die Hand für Master Transmuter; wich Arcum Dagsson mit wiederholbarem Feldzugang. |
| **Glimmervoid** | historisch gestrichen | Alle Farben mit Artefakt, aber Opferrisiko bei Artefaktverlust. |
| **Lithoform Engine** | Rückkehr möglich | Kopiert Trigger und Zauber flexibel, ist jedoch kostenintensiver als Resonator/Throne. |
| **Marionette Master** | Rückkehr möglich | Hoher Schaden an einzelne Gegner bei Artefakttod; sechs Mana, nicht selbst ein Artefakt. |
| **Mephitic Draught** | Rückkehr möglich | Günstiger ETB-/Tod-Kartennachschub gegen Lebenspunkte; wurde durch Esoteric Duplicator verdrängt. |
| **Mycosynth Wellspring** | historisch gestrichen | Sucht Basics, davon gibt es nur wenige; gegenüber Prized Statue/Wellspring zu wenig Tempo. |
| **Nihil Spellbomb** | metagameabhängig | Ehemaliger Einzelfriedhofshass und optionaler Draw; Nautiloid Ship erfüllt jetzt anderen Friedhofsschutz. |
| **Padeem, Consul of Innovation** | Rückkehr möglich | Schützt Artefakte per Hexproof und kann ziehen, schützt Mishra selbst nicht. |
| **Scrap Mastery** | bewusst draußen | Massen-Reanimation bewusst gestrichen; bereitet Friedhof und eigene Opferung aufwendig vor. |
| **Sensei's Divining Top** | metagameabhängig | Gute Topdeck-Manipulation, erfordert zusätzliche Aktivierungen und kann Kombopfade eröffnen. |
| **Servo Schematic** | bewusst draußen | Niedriger ETB-/Tod-Tokenwert, ausdrücklich gegenüber stärkeren Warform-Zielen zurückgestellt. |
| **Skullclamp** | bewusst draußen | Sehr hoher Draw mit 1/1, aber zu wenige konsistente Ausrüstungsziele; ausdrücklich gestrichen. |
| **Skysovereign, Consul Flagship** | bewusst draußen | Wiederholbarer Schaden gegen Kreaturen/Planeswalker, inzwischen durch passenderen Artefakt-Finisher verdrängt. |
| **Spine of Ish Sah** | Rückkehr möglich | Kopierbare Zerstörung beliebiger Permanents; sieben Mana und Fokus nun auf Nautiloid Ship. |
| **Spirebluff Canal** | historisch gestrichen | Frühes U/R-Dual, später getappt; vorhandene Fetch-/Dualbasis ist konstanter. |
| **Sundial of the Infinite** | bewusst draußen | Warform-Persistenz nach Papierregeln stark, funktioniert laut Nutzertests in manabrew.app nicht zuverlässig. |
| **The Meathook Massacre** | bewusst draußen | Boardwipe unerwünscht; Oni-Cult Anvil liefert bessere direkte Artefakt-/Opfer-Synergie. |
| **The One Ring** | Rückkehr möglich | Hoher Kartennachschub, aber wachsender Lebensverlust und permanenter Schutz-/Zeitaufwand. |
| **Thirst for Knowledge** | historisch gestrichen | Kartenziehen und Abwurf, aber historisch zugunsten direkter Artefakt-Engines gestrichen. |
| **Thoughtcast** | Rückkehr möglich | Mit Affinity günstig zwei Karten; Mystic Remora bietet oft wiederholten Multiplayer-Draw. |
| **Thran Dynamo** | historisch gestrichen | Vier Mana für farblosen Ramp, für die Drei-Farben-Konsistenz nicht optimal. |
| **Trash for Treasure** | Rückkehr möglich | Reanimiert teure Artefakte für 2R samt Opfer, hat Konkurrenz durch Welder/Transmuter/Tamer. |
| **Treasure Vault** | Rückkehr möglich | Artefaktland mit spätem Treasure-Mana-Sink, produziert früh nur farblos. |

## B. Konkret geprüft, aber nie in der aktiven B3-Liste (96)

| Karte | Priorität | Grund für Nichtaufnahme / mögliche Rückkehr |
|---|---|---|
| **Fateful Discovery** | hoher Testwert | Zieht bei jedem Artefakt-ETB inklusive Warforms/Maps. **Gegenargument für Aufnahme:** UU und fünf Mana, starke Überschneidung mit Jhoira/Rhystic Study/Remora. **Rückkehr:** wenn viele gleichzeitige Artefakt-ETBs regelmäßig verfügbar sind und Jhoiras Cast-Draw nachweisbar schwächer ist. |
| **Repurposing Bay** | hoher Testwert | Wiederholbarer Feld-Tutor: benötigt Opfer, Sorcery-Timing und **genau einen um 1 höheren Manawert** (kein beliebiges Ziel). **Gegenargument für Aufnahme:** Arcum, Whir, Demonic Tutor und Engineer decken Tutoring bereits ab. **Rückkehr:** nur bei dokumentierter brauchbarer MV-Kurve und gewinnenden Tutor-Sequenzen. |
| **Shuri, Wakandan Inventor** | hoher Testwert | Zweimana-Artefaktkostenreduktion und **nur bis Zugende** wirksames Umkopieren eines liegenden Artefakts für {1}, Tap **nur als Hexerei**; das Umkopieren ist **kein ETB**. **Gegenargument:** Shuri ist selbst kein Artefakt, Etherium Sculptor stärkt Metalcraft/Affinity. **Rückkehr:** wenn ein konkreter permanenter Kopiernutzen einen bestehenden Reducer ersetzt. |
| **Soul-Guide Lantern** | hoher Testwert | Einmana-Urza's-Saga-Ziel mit gegnerweitem Friedhofsexil oder Draw. **Gegenargument für Aufnahme:** Nautiloid Ship exiliert bereits einen Friedhof und jeder Slot kostet wiederholbaren Wert; Lantern ist nicht dieselbe Warform-Reanimation. **Rückkehr:** graveyardlastiges Umfeld oder Manabrew-Fehler beim Ship. |
| **The Master, Multiplied** | hoher Testwert | Nach Papierregeln bleiben Mishra-Kreaturenspielsteine trotz eigener verzögerter Opfer-Trigger liegen und legendäre Tokens kollidieren nicht. **Gegenargument für Aufnahme:** sechs Mana, kein Artefakt, statt Brudiclads unmittelbarer Token-Offensive nur Schutz. **Rückkehr:** wenn Manabrew-Test C9 PASS und dauerhafte Warforms Spiele spürbar verbessern. |
| **The Mycosynth Gardens** | hoher Testwert | Land wird gegen dessen Manawert **selbst** zur Kopie eines eigenen **Nichttoken**-Artefakts, verliert dabei typischerweise die Land-Eigenschaft und löst **keinen neuen ETB** aus; bietet farbiges Mana nur mit Zusatzkosten. **Gegenargument:** im Austausch gegen Darksteel Citadel geht ein frühes unzerstörbares Artefaktland für Metalcraft/Affinity verloren. **Rückkehr:** wenn die Kopierfunktion für wiederkehrende Gewinne den Verlust an Artefaktdichte überwiegt. |
| **Thousand-Year Elixir** | hoher Testwert | Drei-Mana-Artefakt: Arcum, Goblin Welder und Master Transmuter können schon im Ausspielzug tappen; {1},{T} enttappt eine Kreatur. **Gegenargument für Aufnahme:** ersetzt Jhoiras Karten oder Resonators zusätzlichen Mishra-Trigger durch Tap-Setup, das ohne geeignete Kreatur nichts leistet. **Rückkehr:** Manabrew-Tap-Tests bestehen und eine aussagekräftige Vergleichssequenz übertrifft den verlorenen Slot. |
| **Arcbound Ravager** | weiterer Kandidat | Opfert beliebige Artefakte kostenlos, aber ist eine Artefaktkreatur und kein eigenes Mishra-Ziel. |
| **Artificer Class** | weiterer Kandidat | Reduziert Artefaktkosten und macht später Kopien; Level-Up braucht spürbares Mana. |
| **Braids, Arisen Nightmare** | weiterer Kandidat | Zieht durch Endsegment-Opfer Karten und zwingt Gegner zur Wahl; legt weitere Opferprozesse auf den Stapel. |
| **Brass's Tunnel-Grinder** | weiterer Kandidat | ETB-Looting und spätere Verwandlung; legendär und Transformation benötigt Descend. |
| **Clock of Omens** | weiterer Kandidat | Enttappt Artefakte durch Tappen zweier anderer, aber zusätzlicher Aufbau und Kombogefahr. |
| **Cursed Mirror** | weiterer Kandidat | Rot erzeugender Rock, im ETB vorübergehende Kreaturkopie; weniger Farbfixing als Lantern. |
| **Daretti, Rocketeer Engineer** | weiterer Kandidat | ETB und Angriff tauschen Artefakte mit dem Friedhof; fünf Mana, Nichtartefakt. |
| **Daretti, Scrap Savant** | weiterer Kandidat | Handfilter und Reanimation gegen Artefaktopfer; Planeswalker anfällig für Angriffe. |
| **Displacer Kitten** | weiterer Kandidat | Wiederholter Blink bei Nichtkreatur-Casts; braucht Cast-Ketten, erhöht Kombokomplexität. |
| **Forensic Gadgeteer** | weiterer Kandidat | Erzeugt Clues beim Artefakt-Cast und senkt Aktivierungskosten, nicht bei bloßer Warform-Erzeugung. |
| **Fountainport** | weiterer Kandidat | Land für Token-Opfer-Kartenziehen, bringt aber nur farbloses Mana und kein Artefaktland. |
| **Fountainport Bell** | weiterer Kandidat | Ein-Mana-Saga-Ziel und Karte beim Opfer, doch sucht nur wenige verfügbare Basics. |
| **Imposter Mech** | weiterer Kandidat | Zweimana-Fahrzeug kopiert gegnerische Kreatur, hat aber keinen sicheren eigenen ETB-Ertrag. |
| **Iron Man, Titan of Innovation** | weiterer Kandidat | Attack-Trigger mit Treasure und Artefakt-Tutor nach Opfer, fünf Mana und Kampfrisiko. |
| **Krark-Clan Ironworks** | weiterer Kandidat | Opfert jedes Artefakt für CC, mächtig, aber vier Mana und zusätzliche Combo-Linien. |
| **Machine God's Effigy** | weiterer Kandidat | Kopiert Kreatur als nichtkreaturisches Artefakt mit blauem Mana, braucht passende Vorlage. |
| **Memory Jar** | weiterer Kandidat | Kann als Artefakt gezielt sieben neue Handkarten ermöglichen, gibt Gegnern aber ebenfalls Karten. |
| **Midnight Clock** | weiterer Kandidat | Blauer Manarock mit spätem Siebenkarten-Refill, teurer als Zweimana-Rocks. |
| **Mirkwood Bats** | weiterer Kandidat | Schaden bei Token-Erzeugung und Token-Opfer, vier Mana und kein Artefakt. |
| **Phyrexian Altar** | weiterer Kandidat | Opfert eigene Kreaturen für farbiges Mana; zusätzliche Opferquelle zu Ashnod und Anvil. |
| **Phyrexian Tower** | weiterer Kandidat | Land kann Warforms für BB opfern, verliert Artefaktland/Metalcraft beim Austausch. |
| **Reshape** | weiterer Kandidat | Feldtutor XUU plus Artefaktopfer, konkurriert mit Whir und Arcum. |
| **Saheeli, Sublime Artificer** | weiterer Kandidat | Servo-Tokens aus Nichtkreatur-Casts und Artefaktkopien, kostet einen Nichtartefakt-Slot. |
| **Saheeli, the Sun's Brilliance** | weiterer Kandidat | Kopiert Artefakt oder Kreatur temporär, benötigt Tappen/Mana und verzögertes Opfer. |
| **Scour for Scrap** | weiterer Kandidat | Instant-Tutor auf Hand plus Artefakt aus Friedhof, vier Mana gegen Arcum/Whir. |
| **Scrap Welder** | weiterer Kandidat | Tauscht höherwertiges Opferartefakt gegen kleinere Friedhofskarte, redundante Rekursion. |
| **Shimmer Dragon** | weiterer Kandidat | Hexproof bei vier Artefakten und Draw durch Tappen zweier Artefakte, sechs Mana. |
| **Skyclave Relic** | weiterer Kandidat | Unzerstörbarer Mana-Rock, gekickt entstehen zwei zusätzliche Rocks, drei bis sechs Mana. |
| **Smelting Vat** | weiterer Kandidat | Opfert Artefakte für potenziell zwei Feldartefakte aus Top 8, nicht gezielt. |
| **Swan Song** | weiterer Kandidat | Effizienter Einmana-Schutz gegen Instants/Sorceries/Enchants, gewährt Gegner einen 2/2-Flieger. |
| **Tezzeret, Betrayer of Flesh** | weiterer Kandidat | Senkt erste Artefakt-Aktivierung je Zug und filtert Hand, verlangt UU und Planeswalker-Schutz. |
| **Tezzeret, Master of the Bridge** | weiterer Kandidat | Skalierender Gruppenschaden/Lebensgewinn mit vielen Artefakten, kostet sechs und ist kein Artefakt. |
| **The Reality Chip** | weiterer Kandidat | Topdeck-Cast bei Reconfigure auf eine Kreatur, braucht Equipment-Setup. |
| **The Stasis Coffin** | weiterer Kandidat | Kurzzeitiger Schutz vor allem für den Spieler, kostet drei plus zwei und Exil. |
| **Thopter Spy Network** | weiterer Kandidat | Langsame, wiederholbare Thopter und Combat-Draw, vier Mana. |
| **Trading Post** | weiterer Kandidat | Vielfältiges Opfer, Rückholen und Kartenziehen, aber vier Mana und Tap-Aktivierungen. |
| **Transmute Artifact** | weiterer Kandidat | Sucht beliebiges Artefakt aus dem Deck unter Opfern und möglicher Manadifferenzzahlung, UU. |
| **Unlicensed Hearse** | weiterer Kandidat | Wiederholter Graveyard-Hass und großes Fahrzeug; Nautiloid exiliert gleich einen ganzen Friedhof. |
| **Unwinding Clock** | weiterer Kandidat | Enttappt eigene Artefakte in gegnerischen Untaps, vier Mana und kein eigener ETB. |
| **Uthros Research Craft** | weiterer Kandidat | Ab Station 3 zieht bei Artefakt-Casts, Station-Mechanik und Manabrew prüfen. |
| **Aetherize** | niedrige Priorität | Vier Mana defensiver Combat-Bounce, keine Verbesserung des Artefakt-Spielplans. |
| **Astral Dragon** | niedrige Priorität | Kopiert Noncreature-Permanents als 3/3-Drachen, acht Mana und nicht direkt Mishra-kopierbar. |
| **Clown Car** | niedrige Priorität | Würfelabhängige X-ETB-Tokens, als nicht gewirkte Warform-Kopie ist X gleich null. |
| **Coldsteel Heart** | niedrige Priorität | Zweimana-Farbfix nach Wahl, kommt getappt und verlangsamt frühe Züge. |
| **Command Beacon** | niedrige Priorität | Umgeht Commander Tax einmalig, kostet eine Farbland-/Utilityquelle. |
| **Conjurer's Closet** | niedrige Priorität | Blinkt echte Kreaturen; kein sinnvoller Weg, Warform-Tokens dauerhaft zu retten. |
| **Damocles Base, Sword of Kang** | niedrige Priorität | Fliegendes Fahrzeug mit Gegnerwahl nach Kampfschaden, nicht so planbar wie Knight/Nautiloid. |
| **Darksteel Forge** | niedrige Priorität | Artefakte werden unzerstörbar, neun Mana ohne unmittelbaren ETB-Ertrag. |
| **Echo Storm** | niedrige Priorität | Kopiert ein Artefakt basierend auf Commander-Casts, kostet fünf Mana und einen Sorcery-Slot. |
| **Echocasting Symposium** | niedrige Priorität | Wiederkehrende Spell-Kopie einer eigenen Kreatur, sechs Mana und Paradigm-Regelhandling. |
| **Getaway Barrel** | niedrige Priorität | Sterben ermöglicht zufällige Kreatur unter obersten 13 Karten; nicht planbar als Combo-Baustein. |
| **Glint Raker** | niedrige Priorität | Fliegender Kartenauswahlangreifer mit großer Power, benötigt Kampfschaden. |
| **Hall of Echoes** | niedrige Priorität | Farbloses Land kopiert gelegentlich Kreaturen für fünf Mana, kein zuverlässiges frühes Farbfix. |
| **Hammer of Purphoros** | niedrige Priorität | Globale Eile für Kreaturen, Mishras Warforms besitzen bereits Eile. |
| **High Market** | niedrige Priorität | Land-Opferwerkzeug für einen Lebenspunkt, aber Ashnod/Anvil opfern schon. |
| **Identity Echo** | niedrige Priorität | Zufälliger Creature-/Planeswalker-Cheat nach Exil eigener Kreatur, kaum steuerbar. |
| **Junk Diver** | niedrige Priorität | Dreimana-Flieger bringt Artefaktkarte beim Tod zurück, weniger skalierend als Scrap Trawler. |
| **Karn, Legacy Reforged** | niedrige Priorität | Artifaktanzahl als farbloses Upkeep-Mana, fünf Mana und nicht Mishra-kopierbar. |
| **Lurking Automaton** | niedrige Priorität | Draftbasierter Construct, ohne Draft-Umgebung wenig sinnvoll. |
| **Mechanized Production** | niedrige Priorität | Kopiert Artefakt im Upkeep und bietet Achtgleiche-Namen-Sieg, verlangt langsames Setup. |
| **Mirrorworks** | niedrige Priorität | Kopiert eintretende Nichttoken-Artefakte gegen zwei Mana, reagiert nicht auf Mishras Warforms. |
| **Myr Battlesphere** | niedrige Priorität | Viele Kreaturentokens und Schadensangriff, sieben Mana, Artefaktkreatur kein direktes Kopierziel. |
| **Myr Retriever** | niedrige Priorität | Billige Einzel-Rekursion bei Tod, weniger nützlich als die skalierende Scrap-Trawler-Engine. |
| **N'Yami-Class Mother Ship** | niedrige Priorität | Großes Fahrzeug mit Value nach Kampfschaden, sechs Mana und Setup. |
| **Nexus of Becoming** | niedrige Priorität | Kampf-Tokenkopie aus Handkarte, kostet Setup und ersetzt kein direktes Mishra-ETB-Ziel. |
| **Pia and Kiran Nalaar** | niedrige Priorität | ETB-Thopter und Artefakt-Opfer für Schaden, Nichtartefakt und vier Mana. |
| **Pia's Revolution** | niedrige Priorität | Reagiert auf Nichttoken-Artefakte im Friedhof, nicht auf sterbende Warforms. |
| **Prismatic Lens** | niedrige Priorität | Zweimana-Rock mit Filter gegen Zusatzmana, Mind Stone ersetzt besser spät eine Karte. |
| **Reaver Titan** | niedrige Priorität | Sieben-Mana-Fahrzeug mit fünf Schaden an allen Gegnern beim Angriff, Knight liefert ETB für fünf. |
| **Reverberating Summons** | niedrige Priorität | Spezielle Zweizauber-Combat-Verzauberung, umständlicher als vorhandene Wincons. |
| **Sewer-veillance Cam** | niedrige Priorität | Günstiger Flash-ETB-Tap/Untap-Effekt und später Draw, weniger reiner Wert als Wellspring. |
| **Snuff Out** | niedrige Priorität | Kostenloses Kreaturenremoval gegen vier Leben unter Swamp-Bedingung, Rollick deckt größere Zielmenge. |
| **The Immortal Sun** | niedrige Priorität | Sechsmana-Value-Artefakt und Plane-Lock, aber kein sofortiger Warform-ETB. |
| **The Irencrag** | niedrige Priorität | Legendärer Zweimana-Rock kann zum Equipment werden und seine Rampfunktion verlieren. |
| **The Ozolith** | niedrige Priorität | Konserviert Marken von Kreaturen, Token-/Counter-Plan ist nicht primär. |
| **Thopter Assembly** | niedrige Priorität | Ab Upkeep fünf fliegende 1/1 nur ohne andere Thopter, sechs Mana. |
| **Thopter Engineer** | niedrige Priorität | Artefaktkreatur-Eile schon bei Warforms vorhanden, ETB nur ein Thopter. |
| **Wondrous Crucible** | niedrige Priorität | Ward 2 für Permanents und zufällige kostenlose GY-Kopie, sieben Mana. |
| **Chrome Mox** | bewusst draußen | Weitere Game-Changer-Karte, würde ohne GC-Tausch Bracket 3 verlassen; kostet Imprint-Handkarte. |
| **Dance of the Manse** | bewusst draußen | Weiße Farbidentität außerhalb von Mishras Grixis, nicht Commander-legal in dieser Liste. |
| **Fierce Guardianship** | bewusst draußen | Starker kostenloser Counter, als zusätzlicher Game Changer würde 3er-Grenze überschreiten. |
| **Gonti's Aether Heart** | bewusst draußen | Kann mit Warform-ETBs Extraschritte/Züge ermöglichen; Extra-Turn-Loops unerwünscht in B3. |
| **Karn's Sylex** | bewusst draußen | Globaler Boardwipe; widerspricht dem gewünschten Deck ohne Kreaturenwipes. |
| **Mox Diamond** | bewusst draußen | Weitere Game-Changer-Karte, würde ohne GC-Tausch Bracket 3 verlassen; braucht Landabwurf. |
| **Nevinyrral's Disk** | bewusst draußen | Zerstört eigene Artefakte und Kreaturen mit, klar entgegen gewünschter Spielweise. |
| **Rings of Brighthearth** | bewusst draußen | Kann zusammen mit Basalt Monolith früh Endlosmana eröffnen; B3-Kombo-Pfad unerwünscht. |
| **Time Sieve** | bewusst draußen | Opfert fünf Artefakte für Extrazug; potenzielle Extra-Turn-Schleife außerhalb gewollten B3-Profils. |
| **Toxic Deluge** | bewusst draußen | Kreaturenwipe ausdrücklich nicht gewünscht, trotz effizienter -X/-X-Wirkung. |
| **Wishclaw Talisman** | bewusst draußen | Tutor zu günstigen Kosten, Übergabe der Kontrolle an Gegner ähnlich Jewel-Risiko. |

## Gegenwärtige Testreihenfolge (nicht automatisch eingebaut)

Aus dem erweiterten Kreis verdienen **The Master, Multiplied**, **Thousand-Year Elixir**, **Repurposing Bay**, **Soul-Guide Lantern**, **Fateful Discovery**, **Shuri, Wakandan Inventor** und **The Mycosynth Gardens** eine spätere gezielte Gegenprobe.

Dabei weiterhin beachten: keine zusätzlichen Kreaturenwipes; Sundial erst bei funktionierender Manabrew-Implementierung; keine riskanten Kontrollübergaben wie Coveted Jewel/Wishclaw; die drei Game-Changer-Plätze sind derzeit Rhystic Study, Cyclonic Rift und Demonic Tutor. Karten mit Game-Changer-Einstufung dürfen nicht einfach als vierter Slot übernommen werden. Nicht-Grixis-Karten wie Dance of the Manse bleiben für Mishra unzulässig.

## Quellen und Nachvollziehbarkeit

- **Historischer Abgleich:** [GitHub-Commitverlauf der aktiven B3-Kartenliste](https://github.com/alexdermohr/magic/commits/main/decks/mishra/current.txt), 22 ausgewertete Dateifassungen einschließlich [ursprünglichem Track](https://github.com/alexdermohr/magic/commit/0b6094cf09566f3c10bb1d78129e3ac3dca4337e).
- **Weitere Kandidaten:** [Scryfall Cards Collection](https://scryfall.com/docs/api/cards/collection) – 97 geprüfte Alternativnamen einschließlich einer aktiven Karte; die **96 hier aufgeführten** kommen nicht in `current.txt` vor. Commander-Legalität und Farbidentität sind **vor jedem tatsächlichen Einbau** erneut zu prüfen.
- **Bracket:** [Wizards Commander Brackets](https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta) – keine frühe absichtliche Zweikarten-Endloskombo und maximal drei Game Changer in Bracket 3.
- **Spielumgebung:** Ein Papierregel-Synergiepotenzial beweist noch keine vollständige Unterstützung in manabrew.app; insbesondere ungewöhnliche statische Effekte separat testen.