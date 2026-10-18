# Analyse: The Master, Multiplied — Bracket 3, V3 (18. Oktober 2026)

## Ziel, Faktenlage, Scope

Optimiert wird die tatsächlich angelegte V2 auf den oberen Bereich von **Commander Bracket 3 (Upgraded)**. Liste und Versionen sind im selben Ordner. Drei Game Changer: **Ancient Tomb, Demonic Tutor, Jeska's Will**. Keine angezielte, schnelle deterministische Zwei-Karten-Endloskombination, kein Mass-Land-Denial, keine Extra-Turn-Kette. Stärke gegen typische Vierergruppen, keine unbewiesenen Winraten.

**Regelanker:** Offizielle Doctor-Who-Release-Notes https://magic.wizards.com/en/news/feature/magic-the-gathering-doctor-who-release-notes · Commander-Brackets-Original https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta · offizielle Bracket-Aktualisierungen https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026 · Live-Scryfall-Daten über validate.py.

## Die acht V2→V3-Änderungen

| Heraus | Hinein | Abwägung |
|---|---|---|
| Mirage Phalanx | **Redoubled Stormsinger** | Erst 6 Mana plus Soulbond/Angriff versus 3 Mana und sofortige Verdoppelung der frisch durch Master-Myriad entstandenen Tokens bei richtiger Trigger-Reihenfolge. |
| Warchief Giant | **Goldlust Triad** | Beide mit Myriad; für gleiches Mana bietet Goldlust Flying und wiederholbare Treasures bei Treffern, statt Haste und zwei zusätzlichen Grundstärkepunkten. |
| Mirror Box | **Samut, Hazoret's Champion** | Legendärer Master-Token hat selbst die statische Legendenregel-Ausnahme. Mirror Box ist daher meist redundant; universelle Eile für zwei Mana löst das größere Tempoproblem. |
| Etali, Primal Storm | **Rionya, Fire Dancer** | Etali fordert Angriffserklärung nach sechs Mana; kopierte, angreifend eintretende Etalis lösen den Angriffstrigger **nicht** aus. Rionya erzeugt bereits zu Combat-Beginn mit Eile eigene Tokens, auch von Master und Gary. |
| Kardur, Doomscourge | **Heat Shimmer** | Goad ist starke Politik, räumt aber vor dem ersten Master-Angriff keine Blocker. Heat Shimmer für 3 Mana kopiert jedes Kreaturenziel, auch gegnerische und legendäre. |
| Firbolg Flutist | **Molten Duplication** | Firbolg ist sechs Mana und hängt an gegnerischem Board; Molten kopiert für zwei Mana die eigene gewinnbringende Kreatur und bleibt dank Master permanent. Reine Artefakttoken sind nicht geschützt. |
| Sauron, the Necromancer | **Mimic Vat** | Sauron kostet 5 Mana, fordert Angriff und eine Kreaturenkarte im eigenen Friedhof. Vat kann wiederholt *beliebige* sterbende Nichttoken-Kreaturen aus allen Friedhöfen nutzbar machen. |
| Gemstone Caverns | **Hall of Echoes** | Caverns beschleunigt nur in bestimmten Starthänden mit Kartennachteil; Hall ist als ungetapptes farbloses Land im Spätspiel für fünf Mana ein zusätzlicher Master mit Myriad und unterdrückt Legendenregel für den Zug. |

### Warum Kiki-Jiki und Combat Celebrant nicht wieder eingeführt wurden

Die V2 enthielt bereits **weder Kiki-Jiki, Mirror Breaker noch Combat Celebrant**. Ihr gemeinsames Paket erlaubt bei Angriff und Exert eine wiederholbare Kampf- und Kopierschleife; auch **Rionya + Combat Celebrant** bildet eine frühe Zwei-Karten-Schleife. Das widerspricht dem angestrebten Bracket-3-Erlebnis. Dagegen bleiben **Karlach**, **Great Train Heist** und **Aggravated Assault** als endliche bzw. ressourcenabhängige zusätzliche Kämpfe.

## Mechanik und Multiplayer-Mathematik

In einer Viererrunde erzeugt ein tatsächlich deklarierter **Master-Angriff** zwei Myriad-Tokens (gegen die zwei *anderen* Gegner). Die beiden angreifend eintretenden Tokens gelten nicht als selbst „angreifend deklariert“ und erzeugen daher keine eigenen Myriad- oder sonstigen Angriffstrigger in dieser Kampfphase. Nach einem erfolgreichen ersten Angriff liegen insgesamt drei Master-Permanents; sofern alle nächsten Zug tatsächlich angreifen, erzeugen sie sechs zusätzliche Tokens: neun Masters. **Mit Redoubled Stormsinger im ersten Angriff:** Master-Myriad zuerst auflösen (zwei neue Tokens), danach Stormsinger (zwei Kopien dieser beiden frisch eingetretenen Tokens): bereits fünf Masters nach dem ersten Combat, wenn alles bleibt. Weitere Token-Engines können diese Zahl steigern.

Jeder dieser Master-Tokens hat selbst die legendäre Ausnahme und das Präventions-Textfeld. Wird nur das ursprüngliche Commander-Objekt entfernt, schützen verbleibende Master-Tokens einander weiter. **Free-cast durch Deadly Rollick/Deflecting Swat benötigt aber das wirkliche Commander-Permanent**, nicht seine Tokenkopien. Wenn der letzte Master verschwindet, gelten die Legendenregel und später noch nicht verrechnete verzögerte Cleanup-Trigger wieder uneingeschränkt; bereits erfolglos verrechnete Einmal-Cleanup-Trigger werden nicht nachgeholt. Opferkosten, Ersatz- oder statische Effekte werden generell nicht verhindert.

**Grenzen für Copy-Ziele:** Sobald Purphoros wegen zu geringer roter Hingabe keine Kreatur ist, gilt die Master-Ausnahme nicht für seine legendären Nicht-Kreaturentokens; solche Purphoros-Kopien werden von der Legendenregel betroffen. Copy-Tokens erhalten keine Commander-Eigenschaft, nicht einmal wenn sie The Master kopieren. Der 21-Schaden-Zähler gilt nur für den tatsächlichen Commander.

**Warum die Alternativen schwächer waren:**

- **Hate Mirage:** Die Live-Oracle-Fassung wählt ausschließlich *bis zu zwei Kreaturen, die wir nicht kontrollieren*. Als flexible Kopie für eigene Schlüsselwesen ungeeignet; Heat Shimmer ist dafür effizienter.
- **Face Yourself (2026):** Kopiert für sieben Mana alle Kreaturen eines Spielers; großer Deckhöhepunkt, aber auf unseren relevanten Boardstate bzw. einen starken Gegner angewiesen und auf der Mana-Kurve redundant.
- **Venser, Fervent Forger:** Flash/Modalität gut, doch sechs Mana und opponent-only permanenter Kopiermodus machen die Karte gegen den günstigeren Werkzeugkasten weniger zuverlässig.
- **Archon of Cruelty:** Acht Mana für ETB + Angriff ist grandios, doch beim sechsmanaintensiven Commander zu häufig schwer spielbar.
- **Bloodthirster:** Kampfschadensabhängige Extraphasen sind mächtig, aber eine weitere Sechs-Mana-Bedrohung mit zusätzlichem Setup; mit Rionya wurde bewusst keine triviale Angriffskette gebaut.
- **Eldrazi Monument:** Unzerstörbarkeit und Flying wären stark; der Upkeep-Opfertrigger lässt uns jedoch unter dem Master **keine Kreaturentoken** opfern und kann gerade das ursprüngliche (nontokenhafte) Master-Objekt erzwingen.
- **Cybermen Squadron:** Sieben Mana, verteilt Myriad nur an **nichtlegendäre Artefaktkreaturen**. Die meisten gewählten Angriffsträger sind keine solche Kreaturen.
- **The One Ring / Mana Vault / Necropotence:** Starke Game Changer, würden aber die drei fest belegten GC-Plätze neu aufteilen; Ancient Tomb beschleunigt wiederholt, Demonic Tutor findet Schutz und Kombo-Payoff, Jeska's Will gibt Burst-Mana und Optionen.

## Risikoanalyse und Gegenmaßnahmen

1. **Tempo und Farbkosten:** Sechs-Mana-Commander plus mehrfach 5–6-Mana-Kreaturen sind riskant. V3 senkt Spitzenlast durch vier billigere Engines und zwei kostengünstige Haste-/Myriad-Karten. 36 Länder, sieben Mana-Artefakte, Ancient Tomb/Arena of Glory, Jeska's Will und Treasure-Synergien. Triple Black bei Massacre Wurm bleibt eine echte Kostenhürde.
2. **Boardwipes und Exil:** Dolmen Gate schützt nur vor Kampfschaden. Lightning Greaves, Swiftfoot Boots, Deflecting Swat und Malakir Rebirth helfen gegen einzelne Antworten. Plumb the Forbidden verwandelt ein verloren gehendes Board in Karten; Goblin Bombardment verwandelt bedrohte Tokens in Schaden. Exilierende Boardwipes bleiben gefährlich.
3. **Kartennachschub:** Black Market Connections, Grenzo, Idol of Oblivion, Professional Face-Breaker, Ob Nixilis, Night's Whisper, Jeska's Will, Plumb und Fable. Mangelt es im Praxistest trotzdem an Karten, sind **Phyrexian Arena**, **Wheel of Fortune** oder **Valakut Awakening** primäre Nachrücker (gegen Shared Animosity, eine hochpreisige Kreatur oder einen Utility-Land-Slot).
4. **Angriffsgelegenheiten:** Myriad löst beim Deklarieren, *vor* Blockern aus; Shizo und Rogue's Passage sichern Treffer, Samut/Rising/Bitter/Greaves/Boots/Arena Eile. Entscheidend ist das Überleben von mindestens einem Master bis zum Aufräumen, nicht zwingend das erste Durchkommen.
5. **Meta-Abhängigkeit:** Mimic Vat braucht einen nontoken Kreaturentod; Reanimate benötigt passende Friedhöfe. Gegen graveyardloses Combo-Meta sinkt deren Wert. Hate/Removal und Game-Changer-Begrenzungen gelten weiter.
6. **Spielgeschwindigkeit:** Keine dokumentierten Partietests, keine Behauptung über genaue Siegrunde oder Winrate. Beobachte in einer Serie von Viererpartien Anteil Spiele mit farblich rechtzeitigem Master, erster nützlicher Kopie bis Zug 6, Draw-Versorgung bis Zug 8 und durch Wipe verlorene Boards.

## Einzelkarten-Revision der aktiven V3

Alle 100 Kartenslots, inklusive mehrfacher Basisländer, sind berücksichtigt. „Risiko“ nennt jeweils den stärksten Grund, warum ein Slot trotz seines Nutzens noch ersetzbar sein könnte.

| # | Karte | Konkreter Nutzen | Wichtigster Einwand |
|---:|---|---|---|
| 1 | The Master, Multiplied | Kern: statische Token-Erhaltung und eigener Myriad-Start | Sechs Mana; ohne Eile oft ein voller Zug Zeitverlust |
| 2 | Dalek Squadron | Myriad-Quelle und Menace für durchkommenden Schaden | Fünf Mana ohne ETB-Gewinn |
| 3 | Elturel Survivors | Früher Myriad-Druck mit eigenem Schadens-Trigger | Braucht Angriffsphase |
| 4 | Goldlust Triad | Fliegendes Myriad erzeugt zusätzlich Treasures bei Treffern | Fünf Mana und anfällig für fliegende Blocker |
| 5 | Molten Duplication | Für zwei Mana eigene Schlüssel-Kreatur mit Eile permanent kopieren | Kopierte Nichtkreatur-Artefakte sind bei Aufräumtrigger nicht geschützt |
| 6 | Gray Merchant of Asphodel | Schwarze Hingabe skaliert mit legendären Gary-Kopien und Blade of Selves | Fünf Mana; schwarze Hingabe nötig |
| 7 | Massacre Wurm | ETB schwächt Gegnerboards; mehrere Kopien bestrafen Todesfälle massiv | BBB und sechs Mana, auch gegen große Kreaturen nicht immer ausreichend |
| 8 | Terror of the Peaks | Kopier- und ETB-Engine kann sofort zum Sieg schießen | Fünf Mana, Zielvorgaben und Schaden pro Einzeltrigger |
| 9 | Mirkwood Bats | Jede Token-Erzeugung oder jeder Tokentod belastet alle Gegner | Vier Mana ohne eigene Angriffspräsenz |
| 10 | Agate Instigator | Günstiger schadensbasierter ETB-Payoff, multiplizierbar | Gegen ETB-Stopp- und Schutz-Effekte schwächer |
| 11 | Professional Face-Breaker | Treasures und zusätzliche gespielte Karten aus Kampfschaden | Benötigt erfolgreiche Treffer |
| 12 | Grenzo, Havoc Raiser | Jeder Treffer kann Goad oder Zugriff auf gegnerische Karten bewirken | Schwach, wenn Angreifer dauerhaft geblockt werden |
| 13 | Mishra, Claimed by Gix | Jede eigene Angriffserklärung führt zu gegnerischem Lebensverlust; legendär kopierbar | Angriffsbedürftig; Vereinigung mit anderem Halbteil nicht geplant |
| 14 | Heat Shimmer | Flexibel eigenen oder gegnerischen Kreaturentext günstig kopieren | Nur eine Kopie; ohne Master vergänglich |
| 15 | Ob Nixilis, Captive Kingpin | Wiederholbare Karten-Exileffekte bei exakt einem Lebenspunkt Verlust; gut mit Mirkwood Bats | Trigger nicht bei jeder beliebigen Schadensmenge |
| 16 | Orthion, Hero of Lavabrink | Wiederholbar eigene Nichtlegendäre kopieren; Aktivierung für fünf Kopien als Spätspiel-Plan | Tap-Fähigkeit braucht aktiven Zug und Mana |
| 17 | Jaxis, the Troublemaker | Günstige wiederholbare Kopien; eigene Tokens bleiben und Draw beim Sterben möglich | Verbraucht Karten beim Aktivieren, nur andere Kreatur als Ziel |
| 18 | Feldon of the Third Path | Holt ETB-Wesen als Artefakt-Kreaturentoken aus dem eigenen Friedhof | Braucht zuvor verlorene Kreaturen und einen Zug/haste |
| 19 | Redoubled Stormsinger | Verdoppelt im selben Angriff frisch erzeugte Myriad-Tokens, wenn Trigger passend gestapelt | Mit dem Commander anzugreifen ist nötig, anfällig vor Combat |
| 20 | Delina, Wild Mage | Jeder eigene Angriff kann mehrere dauerhafte Kreaturenkopien erzeugen | Würfelabhängig, muss angreifen |
| 21 | Mimic Vat | Speichert sterbende Nontokens und erzeugt wiederholbare ETB-Kopien aus jedem Friedhof | Benötigt einen Kreaturentod plus drei Mana pro Aktivierung |
| 22 | Karlach, Fury of Avernus | Zusätzlicher Kampf samt Enttappen beim ersten Combat; legendär kopierbar | Funktioniert nicht mehrfach pro Runde allein durch Kopien im späteren Combat |
| 23 | Bitter Reunion | Zwei Karten nach Abwurf und optional Eile für alle Kreaturen | Einmalige Eile-Aktivierung mit Opferkosten |
| 24 | Roaming Throne | Verdoppelt mit Wahl 'Time Lord' die Master-Myriad-Angriffsauslösung | Vier Mana, Typwahl unterstützt nicht automatisch restliche Kreaturen |
| 25 | Imperial Recruiter | Sucht billig kopierbare Utility-Kreaturen mit Stärke höchstens zwei | Sucht keine großen Payoffs und keinen 3/3 Stormsinger |
| 26 | Rionya, Fire Dancer | Bereits vor der Angriffsdeklaration haste-Kopien eigener Kreaturen erzeugen | Fünf Mana; braucht andere Kreatur; Combat-Celebrant-Endlosschleife bewusst ausgeschlossen |
| 27 | Sol Ring | Zweimana-Ramp für den teuren Commander | Erzeugt kein farbiges Mana |
| 28 | Arcane Signet | Saubere Rakdos-Fixierung plus Ramp | Unauffälliger Kartenwert im sehr späten Spiel |
| 29 | Rakdos Signet | Konvertiert beliebiges Mana in beide Farben | Braucht verfügbares Mana zum Aktivieren |
| 30 | Talisman of Indulgence | Früher Ramp, farbige Quellen mit kleiner Lebenszahlung | Farbige Nutzung verursacht Schaden |
| 31 | Fellwar Stone | Zweimana-Ramp, in Mehrspieler häufig Rakdos-Farben | Farbfixierung hängt gegnerischen Ländern ab |
| 32 | Mind Stone | Früh Ramp, spät durch Kartenopfer austauschbar | Farblose Quelle |
| 33 | Cursed Mirror | Dreimana-Ramp, kopiert bei ETB situationsweise eine Kreatur | Nichttoken-Kopie einer Legende kollidiert mit Legendenregel |
| 34 | Blade of Selves | Myriad für Gray Merchant/Massacre Wurm und andere ETB-Payoffs | Ausrüstung insgesamt sechs Mana; angreifende Kopien haben keine Angriffstrigger |
| 35 | Lightning Greaves | Null-Mana-Anlegen, Eile und Shroud für Commander | Shroud behindert eigenes weiteres Zielen |
| 36 | Swiftfoot Boots | Eile und Hexproof ohne eigenes Zielen abzuschalten | Zusätzliches Equip-Mana erforderlich |
| 37 | Dolmen Gate | Kampfschaden an eigenen Angreifern verhindert | Kein Schutz vor Removal/Boardwipes |
| 38 | Samut, Hazoret's Champion | Für nur zwei Mana allen eigenen Kreaturen Eile geben | Legendenkörper leicht zu entfernen, kein Card Draw |
| 39 | Idol of Oblivion | Zieht wiederholt Karten nach beliebiger Token-Erzeugung | Ohne regelmäßige Token-Produktion tot |
| 40 | Flameshadow Conjuring | Kopiert jede nichttokenhafte Kreatur bei Eintritt für R; Master bewahrt Tokens | Zusätzliche rote Manareserven nötig |
| 41 | Determined Iteration | Populate im Combat kopiert bestehenden Token erneut und lässt ihn mit Master behalten | Ohne Ausgangstoken unbrauchbar |
| 42 | Fable of the Mirror-Breaker | Goblin-Treasure, Handfilter und dauerhafte Kopier-Engine | Sagenkapitel verzögert den Wert |
| 43 | Impact Tremors | Früher und schwer angreifbarer Token-ETB-Schadensverstärker | Kein Body, ohne Tokens wirkungslos |
| 44 | Purphoros, God of the Forge | Zwei Schaden an jeden Gegner pro eintretender Kreatur, oft unzerstörbar | Unter fünf roter Hingabe keine Kreatur; legendäre Nichtkreaturentokens nicht geschützt |
| 45 | Shared Animosity | Massive Schadensskalierung beim zweiten Master-Angriff | Wenig Nutzen bei blockierter Armee ohne Trample |
| 46 | Black Market Connections | Treasure, Karten oder Shapeshifter flexibel jede Runde | Lebenspunkte-Tax kann gefährlich eskalieren |
| 47 | Goblin Bombardment | Antwort auf Exil/Wipe und punktgenauer Abschluss durch Tokenopfer | Opferkosten werden vom Master nicht verhindert |
| 48 | Aggravated Assault | Unbegrenzt oft aktivierbares 5-Mana-Kampfplus bei genügend Ressourcen, enttappt alle Kreaturen | Manaintensiv; gefährliche Kombinationen mit speziellen Manaquellen daher gemieden |
| 49 | Rising of the Day | Dauerhafte Eile und Legenden-Angriffskraft durch Enchantment | Redundant mit Samut, bei langer Partie aber sinnvoll |
| 50 | Demonic Tutor | Flexibler Tutor findet die benötigte Engine oder Antwort | Einer der drei offiziellen Game Changer |
| 51 | Jeska's Will | Großer roter Mana- und Kartenburst für Commander oder Finisher | Einer der drei Game Changer; schwankt mit gegnerischer Hand |
| 52 | Twinflame | Zwei-Mana-Eile-Kopie eigener Kreatur, spätere zusätzlichen Ziele möglich | Nur eigene Kreaturen und Kopien ohne Master vergänglich |
| 53 | Electroduplicate | Kopiert Kreatur mit Eile und kann aus Friedhof erneut wirken | Drei-Mana-Einzelkopie beim ersten Mal |
| 54 | Great Train Heist | Sofort-Angriffsenttappen plus zusätzlicher Combat, weitere flexible Modi | Combat-Modus kostet tatsächlich vier Mana und erzeugt keine Mainphase |
| 55 | Reanimate | Extrem effiziente Wiederherstellung eines Payoff aus jedem Friedhof | Lebensverlust nach Manawert und anfällig für Graveyard-Hate |
| 56 | Deadly Rollick | Exilt störende Kreatur im kritischen Angriff | Nur mit tatsächlichem Commander kostenlos, nicht bloß Master-Token |
| 57 | Chaos Warp | Entfernt grundsätzlich jede Art gegnerischer Permanents | Kann dem Gegner zufällig eine relevante Karte geben |
| 58 | Feed the Swarm | Rakdos-Antwort auf Enchantments und Kreaturen | Sorcery-Speed und Lebensverlust |
| 59 | Vandalblast | Effizienter Artefakthate; Overload räumt gegnerische Artefakte asymmetrisch | Keine Kreaturen- oder Enchantment-Antwort |
| 60 | Toxic Deluge | Flexibler Notfallwipe gegen Blocker und Gegner-Armeen | Kann eigene Tokens töten und benötigt Leben |
| 61 | Deflecting Swat | Schützt kritische Zauber/Ziele situativ ohne Mana | Ohne tatsächlichen Commander kostet es Mana |
| 62 | Malakir Rebirth | Schützt eine echte Kreatur gegen Töten und ist als Land spielbar | Keine Rettung gegen Exil; Land kommt getappt |
| 63 | Plumb the Forbidden | Im Wipe-Fall bedrohte Kreaturen in Karten umwandeln | Opfern als zusätzliche Kosten; verbraucht eigene Token |
| 64 | Night's Whisper | Zwei frühe Karten für zwei Mana unabhängig vom Commander | Zwei Lebenspunkte Verlust |
| 65 | Command Tower | Perfekte doppelfarbige Commander-Landquelle | Kein eigener Zusatznutzen |
| 66 | Badlands | Fetchbare ungetappte Rakdos-Doppelfarbe | Nonbasic-Hate kann treffen |
| 67 | Blood Crypt | Fetchbares zweites Schock-Dual | Zwei Leben oder getapptes Land |
| 68 | Luxury Suite | In regulären Viererrunden praktisch ungetapptes Dual | Bei Zweispieler-Partien langsamer |
| 69 | Sulfurous Springs | Ungetappte Doppelfarben, bei Bedarf nur farblos schmerzfrei | Farbmana kostet Leben |
| 70 | Haunted Ridge | Doppelfarben ab mittlerem Zug ungetappt | In den ersten zwei Zügen getappt |
| 71 | Blackcleave Cliffs | Frühe ungetappte Rakdos-Quelle | Spät gelegentlich getappt |
| 72 | Blightstep Pathway | Flexible frühe Farbquelle ohne Lebensverlust | Gewählte Seite kann Farbe nicht mehr wechseln |
| 73 | Graven Cairns | Filtert für BBB bei Massacre Wurm und RR | Braucht Mana zum Filtern, isoliert farblos |
| 74 | Dragonskull Summit | In typischer Manabasis ungetapptes Dual | Erste Landlegung ohne Swamp/Mountain oft getappt |
| 75 | Reflecting Pool | Starke Mehrfarbigkeit mit weiteren Fixern | Allein ineffizient |
| 76 | City of Brass | Jede Farbe ungetappt | Manaausgabe kostet Leben |
| 77 | Mana Confluence | Jede Farbe ungetappt | Lebensverlust bei Farbe |
| 78 | Exotic Orchard | Je nach Gegnern meist beide Rakdos-Farben | Gegnerabhängigkeit |
| 79 | Ancient Tomb | Commander ein bis zwei Züge früher casten | Game Changer und Leben gegen farblosen Ramp |
| 80 | Hall of Echoes | Im Spätspiel für fünf Mana selbst zur Master-Kopie werden und Legendenregel aussetzen | Farblos; fünf Mana und eigene Kreatur erforderlich |
| 81 | Command Beacon | Umgeht spätere Commander-Steuer einmalig über Hand | Farblos bis zur Aktivierung |
| 82 | Arena of Glory | Beschleunigt rote Kreatur und kann ihr Eile geben | Exert verhindert Enttappen im nächsten Untap-Step |
| 83 | Shizo, Death's Storehouse | Schwarzes Land mit Fear-Evasion für legendäre Master-Karten und Tokens | Fear kann von Schwarz/Artefakt geblockt werden |
| 84 | Rogue's Passage | Sichert das Durchkommen eines essenziellen Angreifers | Vier Mana plus Tap ist kostspielig |
| 85 | Phyrexian Tower | Opferungsressource zu zwei schwarzen Mana, mit Token-Überschuss brauchbar | Opferkosten bleiben auch bei Master Pflicht |
| 86 | Takenuma, Abandoned Mire | MDFC-ähnlicher Channel-Wiedergewinn von Kreaturen | Aktivierungswert situativ |
| 87 | Sokenzan, Crucible of Defiance | Rotes Land, im Spätspiel Token über Channel | Token alleine klein |
| 88 | Bojuka Bog | Graveyard-Hate ohne Spellslot | Land kommt getappt |
| 89 | Bloodstained Mire | Sucht Badlands/Blood Crypt/Swamp/Mountain, Farbfixierung | Opferung kostet ein Leben |
| 90 | Polluted Delta | Sucht Badlands/Blood Crypt oder Swamp | Opferung kostet ein Leben |
| 91 | Marsh Flats | Sucht Badlands/Blood Crypt oder Swamp | Opferung kostet ein Leben |
| 92 | Scalding Tarn | Sucht Badlands/Blood Crypt oder Mountain | Opferung kostet ein Leben |
| 93 | Urborg, Tomb of Yawgmoth | Macht farblose Utility-Länder zu schwarzen Quellen und erleichtert BBB | Hilft Gegnern gelegentlich ebenfalls |
| 94 | Cavern of Souls | Setzt Master bei Wahl Time Lord gegen Counterspells durch | Andere Zauber erhalten oft nur farbloses Mana |
| 95 | Swamp | Drei Basisländer für Schwarz und Fetches, widerstandsfähig gegen Nonbasic-Hate | Schwarz allein deckt rote Kosten nicht |
| 96 | Swamp | Drei Basisländer für Schwarz und Fetches, widerstandsfähig gegen Nonbasic-Hate | Schwarz allein deckt rote Kosten nicht |
| 97 | Swamp | Drei Basisländer für Schwarz und Fetches, widerstandsfähig gegen Nonbasic-Hate | Schwarz allein deckt rote Kosten nicht |
| 98 | Mountain | Drei Basisländer für Rot und Fetches, widerstandsfähig gegen Nonbasic-Hate | Rot allein deckt schwarze Kosten nicht |
| 99 | Mountain | Drei Basisländer für Rot und Fetches, widerstandsfähig gegen Nonbasic-Hate | Rot allein deckt schwarze Kosten nicht |
| 100 | Mountain | Drei Basisländer für Rot und Fetches, widerstandsfähig gegen Nonbasic-Hate | Rot allein deckt schwarze Kosten nicht |

## Verifikation, Evidenzgrenzen und offener Test

```sh
python3 decks/the-master-multiplied/validate.py
python3 decks/the-master-multiplied/validate.py --oracle
```

Diese Tests validieren importierbare Listen, V1/V2-Abgrenzung und aktuelle Oracle-Namen, Commander-Legalität, Farbidentität, Landzählung, Game-Changer-Flags und Manakurve. Sie simulieren weder einen vollständigen Magic-Priority-/State-Based-Action-Stack noch echte Multiplayer-Partien. Ohne solche Partietests werden keine Kampfabläufe als end-to-end „getestet“ bezeichnet.
