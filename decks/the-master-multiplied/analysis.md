# Analyse: The Master, Multiplied — Bracket 3, V5 (18. Oktober 2026)

## Ziel, Faktenlage, Scope

Die zuletzt publizierte V4 wurde gezielt auf **Commander Bracket 3 (Upgraded)** optimiert. V1–V4 sind als tatsächlich existierende Listen archiviert. Liste und Versionen sind im selben Ordner. Drei Game Changer: **Ancient Tomb, Demonic Tutor, Jeska's Will**. Keine angezielte, schnelle deterministische Zwei-Karten-Endloskombination, kein Mass-Land-Denial, keine Extra-Turn-Kette. Stärke gegen typische Vierergruppen, keine unbewiesenen Winraten.

**Regelanker:** Offizielle Doctor-Who-Release-Notes https://magic.wizards.com/en/news/feature/magic-the-gathering-doctor-who-release-notes · Commander-Brackets-Original https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta · offizielle Bracket-Aktualisierungen https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026 · Live-Scryfall-Daten über validate.py.

## Vier Änderungen V4 → V5 (aktuelle Entscheidung)

| Heraus | Hinein | Begründung und stärkstes Gegenargument |
|---|---|---|
| **Grenzo, Havoc Raiser** | **Ingris Stingerquill** | Ingris (Manakosten **{B}{R}{R}**) verursacht bei **jedem deklarierten eigenen Angreifer** durch diesen Angreifer je **1 Schaden an jedem Gegner**. Das braucht keinen Treffer und skaliert bei späteren Master-Angriffen extrem stark; der Commander kann aus 3 Mana eine eigenständige Gruppenangriffs-Engine machen, besonders mit **Ob Nixilis, Captive Kingpin**. Ingris ist legendär und hat Stärke 1 (Imperial Recruiter findet sie). **Gegenargument:** Grenzo kostet zwei statt drei Mana, kann wiederholt fremde Karten zugänglich machen und Goad-Politik erzeugen; die höhere doppelt-rote Farbanforderung kann in Starthänden bremsen. |
| **Feldon of the Third Path** | **Saw in Half** | Feldon braucht Kreaturen im **eigenen Friedhof**, Aktivierung für {2}{R} und sofortiges Tappen. **Saw in Half ({2}{B}, Spontanzauber)** verdoppelt jetzt jede *eigene* geopferte/zuvor zerstörbare Kreaturen-ETB-Wirkung (z. B. Gray Merchant, Massacre Wurm) auch ohne Master: Nur wenn das Ziel tatsächlich stirbt, entstehen zwei permanent bestehende Tokenkopien mit halbierter Stärke und Widerstandskraft, jeweils aufgerundet. Zwei Master-Tokens behalten untereinander ihre statischen Fähigkeiten. **Gegenargument:** Das Original wird zerstört (auch ggf. der echte Commander), Saw scheitert als Doppelung an Unzerstörbarkeit und ist nur einmal nutzbar. Feldon hätte über mehrere Züge wiederholt Kreaturen zurückholen können. |
| **Dolmen Gate** | **Liquimetal Torque** | Acht statt sieben tatsächliche Mana-Artefakte und die zusätzliche Zweimana-Rampe beschleunigen das Erreichen bzw. erneute Wirken des **Sechs-Mana-Commanders**. Torque produziert farbloses Mana, kann aber alternativ ein gegnerisches **Nichtland-Permanent** zu einem Artefakt machen, das danach Vandalblast entfernt. **Gegenargument:** Dolmen Gate verhindert beim Angriff Kampfschaden an eigenen Angreifern; dieser Schutz für das *Original* geht verloren. Die bereits durch Myriad erhaltenen Master-Tokens schützen einander jedoch vor ausgelösten Exil-/Opfertriggers, wenn das Original im Kampf stirbt; vor Exil-Wipes schützt das nicht. |
| **Feed the Swarm** | **Withering Torment** | Gegen Kreaturen und Verzauberungen gleiche Zielklassen, aber für **{2}{B} als Spontanzauber** statt Hexerei. Der Lebensverlust ist fix 2 statt abhängig vom Manawert; erlaubt auch Antworten im gegnerischen Zug. **Gegenargument:** Ein Mana teurer, schlechter beim Entfernen sehr günstiger Verzauberungen bei bereits gefährlich niedrigem Leben. |

Die gezielten Verbesserungen ersetzen Karten mit eher situativem Wert durch eine neue Angriffsschadens-Engine, einen flexiblen Instant-Klon, eine weitere frühe Manaquelle und Instant-Interaktion. **36 Landkarten, drei Game Changer und die Bracket-3-Kombobeschränkung bleiben unverändert.** Die ersten drei Historienversionen und jetzt auch V4 sind archiviert.

## Weitere geprüfte Karten für V5 (nicht übernommen)

- **Devastating Onslaught (2026):** Starke permanente Kreaturenkopien mit Master, aber exakte Kosten **{X}{X}{R}** — bei X=3 also sieben Mana. Kein vermeintlicher Ein-Mana-Massendoppler. Electroduplicate bleibt für drei Mana plus späteres Flashback für vier Mana als flexible Engine erhalten.
- **Foggy Swamp Visions:** Kann aus mehreren Friedhöfen massenhaft Kopien erzeugen (mit Master dauerhaft), benötigt aber zuvor passende Kreaturenkarten in Friedhöfen und Waterbend-{X}; Saw in Half ist als Sofort-ETB auf der eigenen Hand zuverlässiger.
- **Weftstalker Ardent:** Jede andere eigene Kreatur oder jedes Artefakt beim Eintritt verursacht Gruppenschaden. Herausragende Alternative gegen viele Treasure-/Artefaktdecks, aber vorhandene Burn-Payoffs (Agate Instigator, Impact Tremors, Mirkwood Bats, Purphoros, Terror of the Peaks) bleiben stärker in ihren jeweiligen Rollen; ohne Kandidatenklarheit nicht zusätzlich den Kreaturenslot überfrachten.
- **Dark Ritual, Seething Song:** Einmalige Explosionsmanaquellen können The Master früher wirken, kosten aber eine Karte ohne wiederholbaren Wert und lassen nach Removal höhere Commander-Steuer zurück. Der achte permanente Mana-Stein ist die robuste Vorzugslösung.
- **Chrome Mox / Mox Diamond / Mana Vault:** Stand heutiger Scryfall-Game-Changer-Flags allesamt Game Changer. Ohne Austausch eines der drei etablierten Plätze überschreitet der Einbau die Bracket-3-Grenze.
- **Grim Hireling:** Treasury-Beschleunigung bei mehreren Kampftreffern ist stark, braucht aber echte Treffer und kann mit Aggravated Assault schnell fast deterministische Kampfschleifen auslösen.
- **Curse-Marred Demon:** ETB-Tutor mit zufälligem Discard ist interessant, kann aber das gesuchte Stück zufällig wieder abwerfen und braucht {2}{R}{R}; kein zwingender Ersatz für vorhandenen Demonic Tutor.

## Historisch: fünf Änderungen V3 → V4

| Heraus | Hinein | Entscheidung und stärkstes Gegenargument |
|---|---|---|
| **Shared Animosity** | **Shredder, Shadow Master** | Shredder erzeugt selbst ohne Commander beim **Angriff auf einen Spieler** Kopien gegen die anderen Gegner und halbiert bei Kampfschaden deren Lebenspunkte; gegen Planeswalker oder Battles löst er keinen Kopiertrigger aus. Mit Master bleiben diese Tokens liegen. Animosity kann nach mehreren Master-Angriffen mehr direkten Schaden erzeugen, ist aber vorher oft eine tote Karte und hilft ohne Tokenarmee kaum. Shredder kostet zwei Mana mehr und braucht zum Halbieren Kampfschaden, daher insbesondere mit Regalia einsetzen. |
| **Mimic Vat** | **Splinter Twin** | Splinter Twin kopiert **eigene** vorhandene Schlüsselwesen dauerhaft über Master und bietet die Fähigkeit jeden Zug. Mimic Vat ist erst nach einem Nichttoken-Kreaturentod plus drei Mana aktiv; es kann jedoch gegnerische Kreaturen kopieren und überlebt Removal des zu kopierenden Originals, während Twin als Aura ein mögliches 2-für-1 ist. |
| **Heat Shimmer** | **Wheel of Fortune** | Zusätzlicher Einmal-Klon für drei Mana raus; stattdessen dringend benötigter Hand-Reset auf sieben Karten für drei Mana, unabhängig von Master und Angriffsgelegenheit. Wheel ist laut Live-Scryfall **kein Game Changer**. Großes Risiko: Alle Gegner ziehen ebenfalls sieben; bei gegnerischem Mana-/Counter-Vorteil bewusst zurückhalten. |
| **Rising of the Day** | **Brotherhood Regalia** | Billige gezielte Unblockbarkeit mit Ward {2}, nur {1} zum Ausrüsten einer legendären Kreatur. Relevanter als das sechste Haste-Signal, da Greaves, Boots, Samut, Bitter Reunion und Arena of Glory erhalten bleiben. Verlust: Rising verleiht allen Kreaturen dauerhaft Eile und bufft legendäre Angreifer; Regalia nur einer Kreatur und **nicht** ihren Myriad-Kopien. |
| **Rogue's Passage** | **War Room** | Gleiche Anzahl (36) physischer Landkarten und weiterhin farbloses Mana, aber wiederholbarer Kartenzieher ohne Commander, Board oder Treffer. Regalia übernimmt die billigere Unblockbarkeit. Risiko: War Room kostet beim Ziehen {3}, {T} und in Rakdos **2 Leben**, also kein schneller Ramp. |

**Warum keine weiteren spektakulären Karten:** Bei 36 Ländern, sieben Artefakt-Rampquellen und mehreren echten Burn-Finishern ist zusätzliche Wiederherstellung des Kartennachschubs wichtiger als ein weiteres teures Token-Gewinnstück. Shredder und Splinter Twin sind die zwei zusätzlichen, voneinander unabhängigen Synergiepfade. Keine Änderung an den drei Game Changers und kein früher günstiger Zwei-Karten-Infiniteloop als Ziel.

## Historisch: acht Änderungen V2→V3

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

## Prüfung von drei vorhandenen PR-Reviewhinweisen (Oracle-Stand 18.10.2026)

- **Great Train Heist:** Exakter Gesamtpreis des Extra-Combat-Modus: **{2}{R}{R}**, nicht {3}{R}; der Spree-Zusatzpreis {2}{R} kommt zu den Grundkosten {R}. Nur während *unserer Kampfphase* gibt es eine weitere Kampfphase, keine Mainphase.
- **Orthion, Hero of Lavabrink:** Kopierziel ist jede *andere* eigene Kreatur, auch eine **legendäre**. Die fünf Master-Kopien des zweiten Modus bleiben als Tokens bestehen, sofern The Masters statische Fähigkeit bei Verrechnung des verzögerten Opfertriggers aktiv ist. Die Auswahl „Nichtlegendäre“ war falsch.
- **Mirkwood Bats:** Auslösung nur bei Token-**Erzeugung** und Token-**Opferung**, nicht bei beliebigem Sterben eines Tokens durch Schaden, Zerstörung oder Null-Widerstandskraft. Ein Tokenopfer zählt, auch wenn es als Zauber-/Aktivierungskosten bezahlt wurde.

Diese drei Aussagen wurden gegen die derzeitigen Scryfall-Oracle-Texte verglichen. Die Kartenliste selbst muss dafür nicht geändert werden.

## Geprüfte weitere Kandidaten ohne Einbau

| Karte | Ergebnis |
|---|---|
| **Grim Hireling** | Bis zu sechs Treasures je Kampfrunde im Viererspiel; enorm mit Aggravated Assault, benötigt aber echten Kampfschaden zu möglichst mehreren Spielern. Vorläufig hinter Shredder und Wheel priorisiert. Bei zu schwacher Manaentwicklung gegen einen nachweislich unterperformenden Midrange-Slot testen. |
| **Banshee of the Dread Choir** | Eigenes Myriad plus Discard bei Treffern. Fünf Mana ohne Evasion und ohne sofortigen Schaden ist gegen Shredders halbierende Treffer schlechter. |
| **Genasi Enforcers** | Echtes günstiges 2-Mana-Myriad, aber nur kleine Körper und Mana sink für +1/+0. Die bestehenden Dalek Squadron und Elturel Survivors liefern mehr selbstständigen Druck. |
| **Flamerush Rider** | Kopiert beim Angreifen ein anderes angreifendes Wesen (auch ETB-Payoffs), aber fünf Mana und Angriffsbedingung. Delina und günstigere Splinter-Twin-Engine bleiben im direkten Vergleich. |
| **Mana Echoes** | Riesige farblose Manaausgabe aus vielen Master-Tokens, jedoch erst nach bereits gelungener Tokeneskalation und ohne Farbfestlegung für weitere Combats. Kein verlässlicher früher Beschleuniger. |
| **Neheb, the Eternal** | Starker Postcombat-Manaausbruch nach Gruppenschaden, aber auf der Fünf-Mana-Stufe bereits mehr als genug Payoffs; kann mit Assault ab einem großen Board zur Schleife führen. |
| **Helm of the Host** | Starker eigenständiger Tokenkopierer, aber vier Mana plus fünf Equip vor dem ersten Kopieren; für oberen B3-Tempoanspruch deutlich langsamer als Twin. |
| **Enduring Courage** | Wiederkehrende Haste-Unterstützung und +2/+0 für ETB-Wesen; vier Mana und kein sofortiger Kartenvorteil. Regalia löst die derzeit knappere Blocker-/Schutzfrage. |
| **Wheel vs. The One Ring** | Wheel zählt aktuell nicht zu den Game Changern; Ring ist einer. Ring würde eine Neuallokation eines der drei aktiven GC-Plätze und einen Last-/Lebensverlustplan erfordern. |

## Risikoanalyse und Gegenmaßnahmen

1. **Tempo und Farbkosten:** Ein Sechs-Mana-Commander plus mehrfach 5–6-Mana-Kreaturen bleibt anspruchsvoll. 36 Länder, jetzt **acht Mana-Artefakte**, Ancient Tomb/Arena of Glory, Jeska's Will und Treasure-Synergien tragen die Beschleunigung. Triple Black für Massacre Wurm und {B}{R}{R} für Ingris erfordern bewusstes Farbmanagement; Liquimetal Torque liefert **farbloses**, kein Rakdos-Mana.
2. **Boardwipes und Exil:** Nach Wegfall von Dolmen Gate ist das geblockte **Original** anfälliger; Master-Tokens können sich durch ihre eigene statische Fähigkeit weiterhin halten. Lightning Greaves, Swiftfoot Boots, Deflecting Swat und Malakir Rebirth helfen gegen einzelne Antworten. Plumb the Forbidden verwandelt ein verloren gehendes Board in Karten; Goblin Bombardment wandelt bedrohte Tokens in Schaden um. Saw in Half kann ein **einzelnes zerstörbares Zielwesen** in zwei Tokens umwandeln, schützt aber nicht gegen einen anschließend resolvierenden Mass-Wipe. Exilierende Boardwipes bleiben gefährlich.
3. **Kartennachschub:** Black Market Connections, Idol of Oblivion, Professional Face-Breaker, Ob Nixilis, Night's Whisper, Jeska's Will, Plumb, Fable, **Wheel of Fortune** und War Room. Ingris ersetzt Grenzo und liefert **Schaden, keinen Kartenzugriff**. Wenn in wirklichen Partien Karten fehlen, wäre **Phyrexian Arena statt Splinter Twin** eine klare Alternative (wenn Twin häufig durch Removal einen 2-für-1-Nachteil produziert), oder **Valakut Awakening statt Command Beacon**, falls Commander-Recasts kaum nötig sind; im zweiten Fall sinkt die Zahl der Land-Vorderseiten auf 35. Diese Swaps wurden **nicht** umgesetzt.
4. **Angriffsgelegenheiten:** Myriad löst beim Deklarieren, *vor* Blockern aus; Shizo und die günstige **Brotherhood Regalia** sichern Treffer, Samut/Bitter/Greaves/Boots/Arena bieten Eile. Entscheidend ist das Überleben von mindestens einem Master bis zum Aufräumen, nicht zwingend das erste Durchkommen.
5. **Meta-Abhängigkeit:** Splinter Twin ist eine Aura mit 2-für-1-Risiko; Reanimate benötigt passende Friedhöfe. Gegen removalstarkes Meta kann Twin zu langsam werden, während Wheel dem Gegner neue Antworten liefert. Hate/Removal und Game-Changer-Begrenzungen gelten weiter.
6. **Spielgeschwindigkeit:** Keine dokumentierten Partietests, keine Behauptung über genaue Siegrunde oder Winrate. Beobachte in einer Serie von Viererpartien Anteil Spiele mit farblich rechtzeitigem Master, erster nützlicher Kopie bis Zug 6, Draw-Versorgung bis Zug 8, durchschnittlich durch Wheel an Gegner vergebene Karten und durch Wipes verlorene Boards.

## Einzelkarten-Revision der aktiven V5

Alle 100 aktuellen V5-Kartenslots, inklusive mehrfacher Basisländer, sind berücksichtigt. „Risiko“ nennt jeweils den stärksten Grund, warum ein Slot trotz seines Nutzens noch ersetzbar sein könnte.

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
| 9 | Mirkwood Bats | Jede Tokenerzeugung oder Tokenopferung lässt jeden Gegner 1 Leben verlieren; auch für geopferte Treasure | **Nicht** bei bloßem Tod durch Kampf, Zerstören oder Widerstandskraft 0; vier Mana |
| 10 | Agate Instigator | Günstiger schadensbasierter ETB-Payoff, multiplizierbar | Gegen ETB-Stopp- und Schutz-Effekte schwächer |
| 11 | Professional Face-Breaker | Treasures und zusätzliche gespielte Karten aus Kampfschaden | Benötigt erfolgreiche Treffer |
| 12 | Ingris Stingerquill | BRR: Jeder **deklarierte** eigene Angriff löst 1 Gruppenschaden je Gegner durch diese Kreatur aus; Ob Nixilis kann pro separatem Ereignis Karten exilieren; Imperial Recruiter kann Ingris mit Stärke 1 finden | Zwei rote Mana nötig; Token, die angreifend **eintreten**, haben nicht selbst angegriffen und erzeugen hier keinen neuen Trigger |
| 13 | Mishra, Claimed by Gix | Jede eigene Angriffserklärung führt zu gegnerischem Lebensverlust; legendär kopierbar | Angriffsbedürftig; Vereinigung mit anderem Halbteil nicht geplant |
| 14 | Wheel of Fortune | Füllt unabhängig von Master für drei Mana eine leere Hand auf sieben Karten auf; laut Live-Oracle kein Game Changer | Jeder Gegner erhält ebenfalls sieben neue Karten; kann Gegner vor uns stärken |
| 15 | Ob Nixilis, Captive Kingpin | Wiederholbare Karten-Exileffekte bei exakt einem Lebenspunkt Verlust; gut mit Mirkwood Bats | Trigger nicht bei jeder beliebigen Schadensmenge |
| 16 | Orthion, Hero of Lavabrink | Kopiert jede **andere eigene Kreatur**, ausdrücklich auch den legendären Master; mit {6}{R}{R}{R} entstehen fünf dauerhafte Kreaturentokens, sofern ein Master schützt | Tap-Fähigkeit als Hexerei; zweiter Modus kostet neun Mana plus Tappen |
| 17 | Jaxis, the Troublemaker | Günstige wiederholbare Kopien; eigene Tokens bleiben und Draw beim Sterben möglich | Verbraucht Karten beim Aktivieren, nur andere Kreatur als Ziel |
| 18 | Saw in Half | Sofort zwei Kreaturentokens mit ETB-Auslösern durch Zerstören einer **eigenen** zerstörbaren Kreatur, auch ohne Master | Original stirbt; bei Indestructible entstehen keine Kopien; halbierte P/T mit Aufrundung beachten |
| 19 | Redoubled Stormsinger | Verdoppelt im selben Angriff frisch erzeugte Myriad-Tokens, wenn Trigger passend gestapelt | Mit dem Commander anzugreifen ist nötig, anfällig vor Combat |
| 20 | Delina, Wild Mage | Jeder eigene Angriff kann mehrere dauerhafte Kreaturenkopien erzeugen | Würfelabhängig, muss angreifen |
| 21 | Splinter Twin | Wiederholbare Tap-Kopien eigener ETB-/Myriad-Kreaturen; Master bewahrt Token trotz verzögertem Exiltrigger | Vier Mana für Aura; Removal kann verzaubertes Wesen samt Aura zerstören |
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
| 37 | Liquimetal Torque | Achter günstiger Mana-Stein für 6-Mana-Commander; macht auch ein störendes Nichtland-Permanent bis EOT zum Artefakt für Vandalblast | Erzeugt nur farbloses Mana, und sein Tap kann nicht in demselben Zug Mana und Typänderung liefern |
| 38 | Samut, Hazoret's Champion | Für nur zwei Mana allen eigenen Kreaturen Eile geben | Legendenkörper leicht zu entfernen, kein Card Draw |
| 39 | Idol of Oblivion | Zieht wiederholt Karten nach beliebiger Token-Erzeugung | Ohne regelmäßige Token-Produktion tot |
| 40 | Flameshadow Conjuring | Kopiert jede nichttokenhafte Kreatur bei Eintritt für R; Master bewahrt Tokens | Zusätzliche rote Manareserven nötig |
| 41 | Determined Iteration | Populate im Combat kopiert bestehenden Token erneut und lässt ihn mit Master behalten | Ohne Ausgangstoken unbrauchbar |
| 42 | Fable of the Mirror-Breaker | Goblin-Treasure, Handfilter und dauerhafte Kopier-Engine | Sagenkapitel verzögert den Wert |
| 43 | Impact Tremors | Früher und schwer angreifbarer Token-ETB-Schadensverstärker | Kein Body, ohne Tokens wirkungslos |
| 44 | Purphoros, God of the Forge | Zwei Schaden an jeden Gegner pro eintretender Kreatur, oft unzerstörbar | Unter fünf roter Hingabe keine Kreatur; legendäre Nichtkreaturentokens nicht geschützt |
| 45 | Shredder, Shadow Master | **Beim Angriff auf einen Spieler** erzeugt er Kopien gegen die anderen Gegner; Treffer halbieren deren verbleibende Lebenspunkte; Master hält Tokens | Kein Kopiertrigger beim Angriff auf Planeswalker/Battles; fünf Mana und Kampfschaden nötig |
| 46 | Black Market Connections | Treasure, Karten oder Shapeshifter flexibel jede Runde | Lebenspunkte-Tax kann gefährlich eskalieren |
| 47 | Goblin Bombardment | Antwort auf Exil/Wipe und punktgenauer Abschluss durch Tokenopfer | Opferkosten werden vom Master nicht verhindert |
| 48 | Aggravated Assault | Unbegrenzt oft aktivierbares 5-Mana-Kampfplus bei genügend Ressourcen, enttappt alle Kreaturen | Manaintensiv; gefährliche Kombinationen mit speziellen Manaquellen daher gemieden |
| 49 | Brotherhood Regalia | Legendärer Master oder Shredder kann für 1 Equip Ward 2 und Unblockbarkeit bekommen; frühe Absicherung | Keine Eile und keine Wirkung auf ungerüstete Myriad-Tokens |
| 50 | Demonic Tutor | Flexibler Tutor findet die benötigte Engine oder Antwort | Einer der drei offiziellen Game Changer |
| 51 | Jeska's Will | Großer roter Mana- und Kartenburst für Commander oder Finisher | Einer der drei Game Changer; schwankt mit gegnerischer Hand |
| 52 | Twinflame | Zwei-Mana-Eile-Kopie eigener Kreatur, spätere zusätzlichen Ziele möglich | Nur eigene Kreaturen und Kopien ohne Master vergänglich |
| 53 | Electroduplicate | Kopiert Kreatur mit Eile und kann aus Friedhof erneut wirken | Drei-Mana-Einzelkopie beim ersten Mal |
| 54 | Great Train Heist | Spree-Extra-Combat für **{2}{R}{R}** (Grundkosten {R} plus {2}{R}); enttappt alle eigenen Kreaturen, zusätzlicher Combat nur beim Wirken während eigener Kampfphase | Zwei rote Quellen erforderlich; zusätzliche Kampfphase, aber keine neue Mainphase |
| 55 | Reanimate | Extrem effiziente Wiederherstellung eines Payoff aus jedem Friedhof | Lebensverlust nach Manawert und anfällig für Graveyard-Hate |
| 56 | Deadly Rollick | Exilt störende Kreatur im kritischen Angriff | Nur mit tatsächlichem Commander kostenlos, nicht bloß Master-Token |
| 57 | Chaos Warp | Entfernt grundsätzlich jede Art gegnerischer Permanents | Kann dem Gegner zufällig eine relevante Karte geben |
| 58 | Withering Torment | Spontanzauber für {2}{B} zerstört Kreatur oder Verzauberung und kostet fix 2 Leben, flexibel in fremden Zügen | Kostet ein Mana mehr als Feed the Swarm; keine Planeswalker-Antwort |
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
| 84 | War Room | Zieht unabhängig von Master Karten als Farblos-Land, ohne zusätzlichen Spellslot | Aktivierung kostet 3 Mana, Tappen und 2 Leben |
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

Diese Tests validieren importierbare Listen, V1/V2/V3/V4-Archivierung und aktuelle Oracle-Namen, Commander-Legalität, Farbidentität, Landzählung, Game-Changer-Flags und Manakurve. Sie simulieren weder einen vollständigen Magic-Priority-/State-Based-Action-Stack noch echte Multiplayer-Partien. Ohne solche Partietests werden keine Kampfabläufe als end-to-end „getestet“ bezeichnet.
