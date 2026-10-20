# Baba Lysaga, Night Witch — Die Hexenküche (Bracket 3, V3)

**Stand:** 2026-10-20 · **Format:** Commander / Bracket-3-Ziel (Upgraded) · **Farben:** Schwarz/Grün · **Budget:** unbegrenzt. Dies ist eine **gezielte Weiterentwicklung** der ursprünglichen Version aus PR #35, kein neues Deckkonzept.

## Kartenanzahl, Regelkonformität und Bracket

- **100 Karten inklusive Commander:** 1 Commander, 25 andere Kreaturen, 9 Artefakte, 12 Verzauberungen, 8 Spontanzauber, 7 Hexereien, 1 Planeswalker, **37 Länder** (3 Forest, 3 Swamp).
- **Genau drei Game Changers:** **Seedborn Muse, Crop Rotation, Demonic Tutor**. Es wurden keine weiteren aufgenommen.
- Keine bewusst eingebauten frühen Zwei-Karten-Endlosschleifen, Extrazugketten oder Massenlandzerstörung. Das Spieltempo und die tatsächliche Gewinnquote wurden **nicht** durch Partien nachgewiesen.
- Die importierbare Liste `current.txt` enthält je Zeile Anzahl und englischen Oracle-Namen; sie wird vor Veröffentlichung gegen die aktuelle Kartendatenbank geprüft.

## Was sich von V2 zu V3 ändert (7 Austausche)

| Heraus (V2) | Hinein (V3) | Begründung |
| --- | --- | --- |
| Sakura-Tribe Elder | **Spelunking** | Beim ETB Karte ziehen und bei Bedarf ein Land direkt ins Spiel bringen; danach kommen unsere Länder ungetappt ins Spiel, besonders nützlich für zurückkehrende geearthbenderte Länder und World Shaper. Dafür geht garantierte 2-Mana-Ramp aus der Bibliothek verloren. |
| Azusa, Lost but Seeking | **Burgeoning** | Für nur {G} lassen sich Länder während der gegnerischen Züge ins Spiel bringen und Landfall auslösen. Abhängig davon, dass Gegner tatsächlich Länder **spielen** und wir Länder auf der Hand haben. |
| Eternal Witness | **Six** | Land beim Angriff aus den obersten drei Karten zurücknehmen; während unseres Zuges wiederholt nichtlandige Permanents mit Retrace aus dem Friedhof wirken, indem wir Länder abwerfen. Der Rückkauf von Spontanzaubern/Hexereien durch Witness entfällt. |
| Mirkwood Bats | **Psychosis Crawler** | Jede Baba-Aktivierung zieht drei Karten, die Crawler in **weitere drei Lebenspunkteverlust für jeden Gegner** umsetzt. Fünf statt vier Mana, dafür Kreatur **und** Artefakt. |
| Agent of the Iron Throne | **Eusocial Engineering** | Jeder Landfall erschafft eine **2/2-Artefaktkreatur** mit zwei Kartentypen; zusammen mit einem geopferten Land erfüllt der Token die Baba-Bedingung. Als Warp-Zauber schon für {1}{G} vorübergehend einsetzbar, später regulär für {3}{G}{G}. Verloren geht ein passiver Aristocrats-Trigger. |
| Magewright's Stone | **Sting, the Glinting Dagger** | Enttappt die ausgerüstete Baba **zu Beginn jeder Kampfphase**, auch bei Gegnern und ohne Angriffsdeklaration. Verleiht Eile. Mehrmaliges Aktivieren setzt genügend Opfermaterial voraus. |
| Lightning Greaves | **Swiftfoot Boots** | Eile und Schutz bleiben, aber **Fluchsicherheit statt Verhüllung**: Unsere eigenen Untapper wie Thousand-Year Elixir, Quirion Ranger und Scryb Ranger können Baba weiterhin anzielen. Nachteil: Ausrüsten kostet {1} statt {0}. |

**V1 → V2 (12 frühere Tausche):** schnellere Manaelfen und Wild Growth; zusätzliche Landspiele/Rezirkulation; Springheart Nantuko und Blossoming Tortoise; Llanowar Loamspeaker; Finale of Devastation; Inkmoth Nexus und Valgavoth's Lair. Für das Kartenregel-Puzzle wichtig: **Liquimetal Torque wurde durch Liquimetal Coating ersetzt**, weil nur Coating auch Länder zu Artefakten machen kann. V1 bleibt über die ursprüngliche Git-Revision zugänglich; V2 wurde vor der Veröffentlichung weiter zur V3 verbessert.

## Kernregel: 1 Permanent kann alle drei Kartentypen liefern

**Baba Lysaga:** `{T}, Sacrifice up to three permanents`. Bei insgesamt **drei oder mehr verschiedenen Kartentypen unter den geopferten Permanents** verlieren alle Gegner jeweils 3 Leben, wir erhalten 3 und ziehen 3 Karten. **Legendary** ist ein Supertyp, **Food** und **Forest** sind Untertypen, **Token** bezeichnet keinen zusätzlichen Kartentyp.

**Einzelopfer mit drei Typen:**

1. **Mishra's Factory, Inkmoth Nexus und Blinkmoth Nexus** sind Länder. Ihre Eigenanimation gibt ihnen **Artefakt + Kreatur**, sodass sie als einzelnes Objekt drei Typen tragen. Animieren kostet jeweils {1}; Blossoming Tortoise reduziert diese Kosten um {1}, sodass sie bei vorhandenem Tortoise kostenlos werden.
2. **Artefaktländer + Earthbend** (Tree of Tales, Vault of Whispers, Darksteel Citadel, Darkmoss Bridge): Das Land wird Kreatur und ist nun Artefakt/Land/Kreatur. Wird eine durch Earthbend animierte **Landkarte** zerstört oder geopfert, kehrt sie getappt als Land zurück. Dabei löst sie wieder Landfall aus; die Earthbend-Animation wird nach dem Zonenwechsel nicht beibehalten.
3. **Valgavoth's Lair oder Urza's Saga + Liquimetal Coating:** Diese Permanents sind bereits **Verzauberung/Land**. Coating gibt zusätzlich den Kartentyp **Artefakt**. Das ist genau ein Opfer für drei Typen; Coating selber bleibt zum weiteren Verwenden im Spiel.
4. **Dryad Arbor + Liquimetal Coating:** Dryad Arbor ist **Kreatur/Land**; Coating macht daraus zusätzlich ein Artefakt.
5. **Ygra, Eater of All + Springheart Nantuko/Dryad of the Ilysian Grove:** Ygra macht die **anderen Kreaturen** zusätzlich zu Nahrungsartefakten. Eine Verzauberungskreatur ist dann Artefakt/Verzauberung/Kreatur. Bei Overlord of the Hauntwoods zählt die Kreatureneigenschaft nur, wenn der Overlord tatsächlich eine Kreatur ist (nicht während seiner Impending-Phase).

**Zwei Opfer statt eines:** Artefaktland (Artefakt+Land) **plus** beliebige Kreatur; Artefaktkreatur-Token von Eusocial Engineering (Artefakt+Kreatur) **plus** Land; Verzauberungskreatur (Verzauberung+Kreatur) **plus** Artefakt oder Land. Ein Land, das durch Baba geopfert wird, kann nicht gleichzeitig zur Bezahlung einer anderen Opferfähigkeit verwendet werden. Das Opfern ist Teil der Aktivierungskosten, kein Effekt, auf den der Gegner nachträglich mit Removal reagieren kann.

**Auren:** Rancor ist billiges, sich wieder auf die Hand zurückholendes Verzauberungsopfer. Ordeal of Nylea sucht beim Opfern bis zu zwei Standardländer aus der Bibliothek. Beide zählen nur für Baba, **wenn die Aura tatsächlich unter den von Baba geopferten Permanents war** — nicht, wenn sie bloß wegen des Todes ihrer verzauberten Kreatur abfällt.

## Spielplan und Musterzüge

### Frühspiel, Zug 1–3
Auf zwei bis drei Länder mit Grün und Schwarz, frühe Beschleunigung und mindestens eine nutzbare Drei-Typen-Quelle mulliganen. **Delighted Halfling, Birds of Paradise, Elves of Deep Shadow und Wild Growth** erlauben Baba unter passenden Farben/Ländern schon im zweiten Zug. Sol Ring, Arcane Signet, Talisman of Resilience, Nature's Lore und Three Visits sichern weitere Starts.

**Burgeoning** ist besonders gut auf Zug 1, wenn Gegner in ihren ersten Zügen Länder spielen und wir weitere Länder auf der Hand haben. Der Effekt wird **nicht** durch ein Land ausgelöst, das Gegner nur per Zauber/Fähigkeit ins Spiel legen. **Spelunking** zieht sofort eine Karte, bringt bei Bedarf ein Land aus der Hand ins Spiel und macht spätere Landrückführungen wesentlich produktiver.

### Mittelspiel, Zug 3–6
Die erste volle Baba-Aktivierung möglichst über eine bereits animierte Artefaktland-Kreatur mit bereitstehender Rekursion oder zwei billige mehrtypige Permanents vorbereiten, statt die eigene Manabasis blind zu opfern. Mit zusätzlichem Material gewinnt jede weitere Aktivierung drei Karten und Lebenspunkte.

- **Sting, the Glinting Dagger** enttappt Baba zu Beginn **jeder** Kampfphase – auch wenn niemand angreift. Baba kann vorher und nachher aktiviert werden. Bei vier Spielern gibt es normalerweise vier reguläre Kampfphasen je Tischrunde.
- **Seedborn Muse** enttappt alle unsere Permanents während der gegnerischen Enttappsegmente. Mit Sting werden auf gegnerischen Zügen zusätzliche Aktivierungsfenster möglich, **ohne** dass sich dadurch automatisch Opfernachschub generiert.
- **Thousand-Year Elixir, Tyvar, Quirion Ranger, Scryb Ranger und Instill Energy** liefern weitere Eile-/Enttappoptionen. Instill Energy erlaubt einmal **während unseres Zuges** kostenloses Enttappen; seine Formulierung „kann angreifen, als hätte es Eile“ macht Babas Tappfähigkeit **nicht** unmittelbar nach dem Wirken allein aktivierbar.
- **Swiftfoot Boots** lässt unsere eigenen gezielten Untapper weiterhin auf Baba wirken. Das verhindert die früheren Konflikte mit der Verhüllung von Lightning Greaves.
- **Burgeoning** kann während gegnerischer Landplays sofort eigenen Landfall erzeugen: Springheart Nantuko liefert einen Insekt-Kreaturenspielstein, Tireless Provisioner Food/Schatz, Eusocial Engineering eine Artefaktkreatur. Dieser Materialnachschub hilft besonders bei Sting-Aktivierungen zwischen den eigenen Zügen.

### Rekursion und Mana
**Life from the Loam, Crucible of Worlds und Ramunap Excavator** nutzen geopferte und abgeworfene Länder erneut. **Undergrowth Recon** bringt in jedem unserer Upkeeps ein Land getappt zurück. **Blossoming Tortoise** millt je ETB/Angriff drei Karten, bringt ein Land getappt zurück und macht aktivierte Landfähigkeiten günstiger. **World Shaper** bringt beim Sterben alle Landkarten aus dem Friedhof getappt zurück. **The Gitrog Monster** erlaubt einen zusätzlichen Landdrop und zieht bei Landkarten, die in unseren Friedhof gelegt werden. Diese Redundanz bleibt bewusst bestehen, weil die Zahl echter Opferländer der zentrale Flaschenhals ist.

**Spelunking: offizielle Interaktion.** Wenn der Effekt bereits auf dem Schlachtfeld liegt, können unsere Länder **ungetappt** ins Spiel kommen, auch wenn sie durch World Shaper oder Earthbend ausdrücklich getappt zurückgelegt werden. Hat das einzelne Land eine eigene „kommt getappt ins Spiel“-Ersatzwirkung, dürfen wir die Reihenfolge wählen. Spelunking, das **gleichzeitig** mit den Ländern ins Spiel kommt, hilft dagegen nicht. Quelle: [The Lost Caverns of Ixalan Release Notes](https://magic.wizards.com/en/news/feature/the-lost-caverns-of-ixalan-release-notes).

**Six** erweitert den Friedhof zur Hand für Nichtland-Permanents **nur während unseres Zuges**. Die benötigte Landkarte wird als zusätzlicher Retrace-Preis abgeworfen und kann anschließend über Loam/Crucible wiederverwendet werden. Six ersetzt **nicht** Eternal Witness für Spontanzauber/Hexereien; das ist der wichtigste Recursion-Kompromiss.

## Siegbedingungen

1. **Baba + Psychosis Crawler**: Eine volle Baba-Aktivierung lässt jeden Gegner 3 Leben verlieren und zieht drei Karten. Crawler löst **dreimal** aus und lässt jeden Gegner **weitere 3 Leben** verlieren — in Summe **6 Lebenspunkte pro Gegner** pro Aktivierung (ohne andere Trigger). Crawler ist zugleich Artefaktkreatur und damit flexibles Zweitypenopfer, falls nötig.
2. **Token-Schwarm / Finale of Devastation**: Springheart Nantuko, Eusocial Engineering, Titania und Ophiomancer erzeugen Kreaturen. Finale sucht bei kleinem X wichtige Kreaturen; ab X ≥ 10 wird die gesamte Kreaturenarmee zu einem gefährlichen Haste-Finisher mit +X/+X.
3. **Aristocrats-Restengine**: Marionette Apprentice löst bei eigenen Artefakten/Kreaturen aus, die tatsächlich in den Friedhof gehen. Artefaktland-Kreaturen zählen für diese Fähigkeit auch dann **nur einmal je Permanent**, nicht einmal für jeden Kartentyp. Token von Eusocial Engineering und Tireless Provisioner liefern zusätzliches Opfermaterial.

## Risiken, Gegenprobe, Erweiterter Kreis

- **Top-End:** Psychosis Crawler und Eusocial Engineering kosten jeweils fünf Mana; sie spielen sich deutlich schlechter als frühe Ramp-Karten, wenn Baba nicht zuverlässig aktivierbar ist. Darum wurden keine weiteren teuren Payoffs aufgenommen.
- **Langsamerer Start ohne Sakura-Tribe Elder:** Spelunking beschleunigt nur dann direkt, wenn ein Land auf der Hand liegt. Burgeoning kann frühe Landplays ausnutzen, ist aber vom Gegner abhängig. Die Startkonsistenz ist **nicht** goldfish-getestet.
- **Weniger generische Wiederverwertung:** Eternal Witness konnte auch Sorceries/Instants zurückholen, Six ausschließlich nichtlandige Permanents mit Retrace und nur im eigenen Zug.
- **Exile-/Graveyard-Hate:** Ist Life from the Loam/Crucible/Ramunap blockiert, verschleißen Baba-Landopfer die Manabasis. In solchen Partien bevorzugt mehrtypige Robot-/Kreaturenspielsteine sowie Rancor/Ordeal in den Opferkosten verwenden.
- **Erweiterter Kreis:** Walking Atlas (Artefaktkreatur und zusätzliche Landdrops per Tapp auf gegnerischen Zügen, aber langsam und summoning-sickness-abhängig), Aftermath Analyst (Explosions-Rekursion für 4 Mana Aktivierung), Animate Dead (günstigerer einmaliger Reanimate-Effekt), Sanctum Weaver (Enchantress-Ramp), Skullclamp (bei höherer 1/1-Dichte), Sting-Alternative Thornbite Staff (bei vielen Kreaturentoden, teurer auszurüsten).
- **Nicht spielbar:** Hearthhull, the Worldseed besitzt **Rot** in der Farbidentität und ist deshalb in Baba-Lysaga-Golgari nicht Commander-legal, auch wenn sein Landopfer-Effekt thematisch perfekt wäre.

## Prüfung und Quellen

- [Wizards: Commander-Format, Brackets & Game Changers](https://magic.wizards.com/en/formats/commander)
- [Wizards: Commander-Brackets-Update (Februar 2026)](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026)
- [Wizards: The Lost Caverns of Ixalan Release Notes – Spelunking](https://magic.wizards.com/en/news/feature/the-lost-caverns-of-ixalan-release-notes)
- [Wizards: Modern Horizons 3 Release Notes – Six](https://magic.wizards.com/en/news/feature/modern-horizons-3-release-notes)
- [Scryfall Karten-Datenbank](https://scryfall.com) für exakte Namen, Oracle-Texte, Commander-Legalität, Farbidentität und Game-Changer-Markierung.

**Grenze:** Statische Kartenlegalitäts- und Regelsynergieprüfung plus Commit-/PR-Abgleich. Kein Simulator- oder Realpartientest; besonders das Verhältnis von frühem Mana zu dauerhaftem Opfermaterial sollte praktisch erprobt werden.
