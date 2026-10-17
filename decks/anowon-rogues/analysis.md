# Anowon, the Ruin Thief — Die Gilde der Schatten (Bracket 3, V3)

**Stand:** 17. Oktober 2026 · **Format:** Commander · **Ziel:** maximal wirksames, thematisch geschlossenes Bracket 3 / Upgraded · **Farben:** Dimir (Blau/Schwarz).

**Commander:** `Anowon, the Ruin Thief`. **Aktuelle importierbare Liste:** [current.txt](current.txt). Die 100 Karten bleiben im selben Commander-Ordner; V3 ersetzt V2 in `current.txt`. Frühere Fassungen sind in der Git-Historie des [Pull Requests #29](https://github.com/alexdermohr/magic/pull/29) nachvollziehbar.

## Zusammenfassung und nachprüfbare Struktur

- **100 Karten, 96 verschiedene Einträge** inklusive Commander; keine unerlaubten Duplikate.
- **36 landfähige Karten**, darunter 3 `Island`, 3 `Swamp` und das neue doppelseitige `Glasspool Mimic // Glasspool Shore`. Davon 35 reine Landkarten; Glasspool kann als Land **oder** als Kreatur gespielt werden und kommt als Land getappt.
- **34 Kreaturen-Vorderseiten inklusive Commander und Glasspool**, darunter **32 mit gedrucktem Rogue-Typ**. `Changeling Outcast` ist dank Changeling trotzdem ein Schurke; `Roaming Throne` zählt im Spiel nach Wahl von Rogue ebenfalls als Schurke. Wird Glasspool als Land gespielt, bestehen die übrigen 33 Kreaturenkarten weiterhin als reguläre Kreaturenoptionen.
- **31 Nichtkreaturen-Nichtlandkarten**, sieben Mana-Artefakte (Sol Ring, Arcane Signet, Dimir Signet, Talisman of Dominance, Fellwar Stone, Mind Stone, Patchwork Banner). `Frogtosser Banneret` reduziert Rogue-Kosten; `Grim Hireling` und `Rev, Tithe Extractor` erzeugen Schätze bei erfolgreichen Angriffen.
- **Genau drei Game Changer, unverändert:** `Opposition Agent`, `Notion Thief`, `Rhystic Study`. Bei den übrigen 93 unterschiedlichen Karten liegt kein aktuelles Scryfall-`game_changer`-Kennzeichen vor.
- **Nominaler durchschnittlicher Manawert der 64 nichtlandfähigen Karten: 2,594** (rund 2,59). `Glasspool Mimic` zählt dabei als Landoption und ist nicht im Mittel der 64 enthalten; variable X-Kosten, alternative Prowl-Kosten und kostenloses `Deadly Rollick` verändern die tatsächlich benötigte Manamenge.
- Kein eingebauter früher Zwei-Karten-Endlos-Kombosieg, keine Massenlandzerstörung und keine geplante Extrazug-Kette. `Notorious Throng` ist der einzelne Prowl-Extrazug; `Double Down` und `Mindcrank` bleiben bewusst draußen.

## Optimierung V2 → V3: sieben Tausche

| Heraus | Hinein | Warum stärker; relevante Gegenposition |
| --- | --- | --- |
| `Gonti, Lord of Luxury` | **`Gonti, Night Minister`** | Aus einmaligem ETB-Diebstahl wird wiederholter Diebstahl **pro Kreatur**, die einem unserer Gegner Kampfschaden zufügt. Gonti erlaubt für diese Exilkarten Mana beliebigen Typs und liefert beim Wirken fremder Zauber Schätze. **Nachteil:** Auch Angriffe anderer Spieler gegen unsere Gegner lösen Gonti zugunsten dieser Spieler aus; außerdem entfällt Gontis bisheriger sofortiger ETB-Effekt. |
| `Rankle, Master of Pranks` | **`Rev, Tithe Extractor`** | Wiederholbare Exilkarten **und** Schatz-Spielsteine für jeden Spieler, dem eigene Kreaturen Kampfschaden zufügen, statt symmetrischen Discard-/Opferentscheidungen. **Nachteil:** Rev ist ohne Ausweichfähigkeit und ohne Hast; bei exilierten Ländern gibt es keinen ausspielbaren Zauber, und fremde Farben müssen mit verfügbaren Manaquellen bezahlt werden. |
| `Krydle of Baldur's Gate` | **`The Destined Thief`** | Selbst nicht blockbarer Rogue mit Kartenfilter einmal pro Kampf, sobald eigene Kreaturen Kampfschaden an Spieler machen; kann für {U} und Tappen einem weiteren Wesen Unblockbarkeit geben. **Nachteil:** 3 statt 2 Mana; die Tapfähigkeit verhindert normalerweise den eigenen gleichzeitigen Angriff. |
| `Herald's Horn` | **`Sakashima of a Thousand Faces`** | Als Kopie Anowons verdoppelt Sakashima den Lord-Bonus und stellt eine zweite Anowon-Mill-/Draw-Fähigkeit bereit. Die Legendenregel gilt für eigene Permanents dann nicht; alternativ lassen sich `Rev`, `Gonti` oder `Grim Hireling` kopieren. **Nachteil:** 4 statt 3 Mana, keine allgemeine Rogue-Kostenreduktion und ohne Kreaturenfeld weniger hilfreich. |
| `Drown in the Loch` | **`March of Swirling Mist`** | Schützt bis zu X wichtige Rogues durch Phasing vor vielen Boardwipes/Removal-Effekten oder entfernt Blocker zeitweise. Ohne volle gegnerische Friedhöfe bleibt March nutzbar; `Drown` war bei aktivem `Dauthi Voidwalker` oft eingeschränkt. **Nachteil:** Kein gezielter Counterspell/Creature-Destroy-Effekt mehr und zum Schutz vieler Kreaturen unter Umständen viel Mana oder dafür exilierte blaue Handkarten nötig. |
| `Resculpt` | **`Reanimate`** | Für {B} eine beliebige Kreaturenkarte aus **jedem** Friedhof direkt unter eigene Kontrolle bringen; starke Synergie mit Anowons Mill und thematisch besserer Diebstahl. **Nachteil:** Verliert die günstige Artefakt-/Kreatur-Exilantwort; `Reanimate` kostet eigene Lebenspunkte in Höhe des Manawerts des Ziels und kollidiert bei Dauthis Exilersatzeffekt mit frisch gemillten Zielen. |
| `1 Island` | **`Glasspool Mimic // Glasspool Shore`** | Zusätzliche Option, `Rev`, `Gonti`, `Roaming Throne` oder andere wertvolle eigene Kreaturen zu kopieren, ohne einen effektiven Landslot aufzugeben. **Nachteil:** Als Land kommt Glasspool getappt; weniger sofort verfügbares blaues Mana in frühen Zügen. |

**Wichtigste Entscheidung:** `Dauthi Voidwalker` bleibt trotz der offengelegten Antisynergien im Deck: Er ist selbst ein schwer blockbarer Rogue und ermöglicht das kostenlose Spielen gestohlener, mit Void-Marken exilierter Zauber. Durch rechtzeitiges Opfern für eine solche Karte werden gegnerische Friedhöfe anschließend wieder für `Reanimate`, `Zareth San`, `Drown` (letzteres inzwischen entfernt) und `Bloodchief Ascension` nutzbar. Der Verzicht auf Dauthi zugunsten von `Ghostly Pilferer` ist eine mögliche spätere Feinabstimmung, jedoch kein nachgewiesener Nettogewinn.

## Spielablauf und Synergie

**Züge 1–3:** Eröffnen mit `Changeling Outcast`, `Slither Blade`, `Triton Shorestalker`, `Merfolk Windrobber`, `Tinybones, the Pickpocket` oder `Bilbo, Luckwearer`. `Shoreline Looter` und `Invisible Stalker` lassen sich anschließend sicher zum Kartenziehen und als Angreifer nutzen. Zwei bis drei Länder, eine blaue Quelle und wenigstens ein früher Rogue oder `Mystic Remora` sind ein gutes Mulligan-Ziel. `Bloodchief Ascension` früh zu legen ist besonders stark, wenn andere Spieler wiederholt mindestens 2 Leben pro Zug verlieren.

**Mittleres Spiel:** Anowon verstärkt alle **anderen** Rogues um +1/+1. Treffen mehrere Rogues denselben Spieler, wird Anowons Fähigkeit **einmal je getroffenem Spieler** ausgelöst. Pro Trigger wird in Höhe des zugefügten Rogue-Kampfschadens gemillt, und es gibt höchstens eine Karte, falls darunter wenigstens eine Kreaturenkarte war. `Roaming Throne` mit Rogue als Typ verdoppelt diese Trigger. `Sakashima` als Kopie von Anowon erzeugt eine weitere unabhängige Fähigkeit und einen zusätzlichen +1/+1-Bonus; es gibt keine Endlosschleife.

**Wiederholbarer Diebstahl:** `Gonti, Night Minister` ist bei vier ungeblockten eigenen Kreaturen nicht auf einen einzigen Trigger begrenzt: **jede** trifft einzeln und kann eine Karte vom Bibliotheksoberteil des getroffenen Gegners exilieren. `Rev, Tithe Extractor` dagegen löst **einmal je getroffenem Spieler** aus und produziert dazu jeweils ein Treasure. Mit `Roaming Throne` werden ihre Rogue-Fähigkeiten kopiert, sodass mehr fremde Karten und Schätze entstehen. `Thada Adel, Acquisitor`, `Praetor's Grasp`, `Bribery`, `Knowledge Exploitation`, `Zareth San, the Trickster` und `Reanimate` ergänzen den Diebstahl über Bibliotheken und Friedhöfe.

**Kartenvorteil:** `Rhystic Study`, `Mystic Remora`, `Kindred Discovery` (Rogue wählen), `Black Market Connections`, `Faerie Mastermind`, `Sygg, River Cutthroat`, `Mask of Memory`, `Bilbo, Luckwearer` und `The Destined Thief` verringern die Abhängigkeit vom Commander. Der Destined-Thief-Kartenfilter löst **nur einmal pro Kampf** aus, selbst wenn mehrere Spieler getroffen wurden. Bilbo, Thief in the Night erlaubt beim Angriff das erneute Wirken geeigneter Zauber aus dem eigenen Friedhof; solche Instant-/Sorcery-Zauber werden danach exiliert.

**Abschluss:** `Banner of Kinship` verstärkt alle eigenen Rogues um +X/+X, wobei X von den **beim Eintritt** vorhandenen Rogues abhängt. `Stinkdrinker Bandit`, `Oona's Blackguard` und `Patchwork Banner` erhöhen weiteren Kampfdruck. `Notorious Throng` erstellt fliegende Faerie-Rogue-Token und ermöglicht bei Zahlung der Prowl-Kosten einen zusätzlichen Zug. Mit drei Questmarken auf `Bloodchief Ascension` wird echtes Mill in den Friedhof zu wiederholtem Lebensverlust und eigenem Lebensgewinn.

**Schutz:** `Counterspell`, `Mana Drain`, `Swan Song`, `An Offer You Can't Refuse` halten gegnerische Schlüsselsprüche auf; `Deadly Rollick`, `Feed the Swarm`, `Withering Torment` und die `Petty Theft`-Seite von `Brazen Borrower` beantworten häufige Probleme. `March of Swirling Mist` bewahrt die wertvollsten Rogues vor Zerstörungs- oder Exil-Wipes durch Phasing. `Raise the Palisade` kann Nicht-Rogues einseitig zurück auf die Hand bringen.

## Kritische Regelhinweise und Grenzen

- **Dauthi/Bloodchief/Zareth/Reanimate:** Bei Dauthis Ersatzeffekt werden Karten **statt** auf gegnerische Friedhöfe offen ins Exil gelegt. Sie lösen dadurch **nicht** `Bloodchief Ascension` aus und stehen nicht für `Zareth San` oder `Reanimate` als frisch gemillte Zielkarten bereit. Eine zuvor gemillte Karte kann weiterhin im Friedhof liegen. Durch Ersatzeffekt offen exilierte Karten können weiterhin als gemillt gelten; Anowons Draw-Bedingung kann deshalb weiterhin erfüllt werden.
- **Gonti ist symmetrisch:** `Gonti, Night Minister` belohnt auch andere Spieler für ihre Kreaturen, wenn diese einem **unserer Gegner** Kampfschaden zufügen. Ihre fremden Zauber können ebenfalls Treasure erzeugen. Das kann politisch günstig sein, im falschen Metagame aber anderen Spielern zu viele Ressourcen geben.
- **Rev ist keine allgemeine Mana-Fixierung:** Sein Treasure gibt eine beliebige Farbe, aber anders als bei `Gonti, Night Minister` gibt es keinen pauschalen Satz „Mana beliebigen Typs kann ausgegeben werden“. Exilierte Länder kann man mit Rev nicht spielen; Rev sagt ausdrücklich **cast**.
- **Glasspool, Sakashima und Legenden:** `Glasspool Mimic` kann Anowon kopieren, aber zwei identische legendäre Anowons würden ohne Sakashimas Fähigkeit die Legendenregel auslösen. Wenn Sakashima auf dem Feld bleibt, kann Glasspool ebenfalls die vorhandenen Kopiereffekte nutzen. Glasspool kommt als Land immer getappt.
- **Notorious Throng:** Prowl {5}{U} verlangt bereits in diesem Zug verursachten Rogue-Kampfschaden; normal für {3}{U} gewirkt erzeugt es nur Token, nicht den Extrazug. `Double Down` bleibt aus dem Deck, weil das Kopieren eines für Prowl gewirkten Throng zu zwei aufeinanderfolgenden Extrazügen führen würde.
- **Keine Bloodchief-Mindcrank-Endlosschleife:** `Mindcrank` bleibt gestrichen. Sobald Bloodchief aktiv ist, würde die Kombination mit Mindcrank eine frühe Zwei-Karten-Endlosschleife bilden und unser Bracket-3-Ziel verletzen.
- **Verbleibende Schwächen:** Schnell wiederholte Boardwipes, `Gonti`-Symmetrie, die Verlustpunkte durch `Reanimate`, `Bitterblossom` und `Black Market Connections`, eine weniger redundante Artefakt-Entfernung und einzelne getappte Landoptionen. Bei zu wenig eigenen Kreaturen sind `Banner of Kinship`, `Sakashima` und `Roaming Throne` schwächere Topdecks. Bei hoher gegnerischer Interaktion früh Mana für Schutz offenhalten.

## Erweiterter Kreis und bewusste Alternativen

- **`Ghostly Pilferer`** statt `Dauthi Voidwalker`: zwei Mana, freiwerdender gegnerischer Friedhof und mehr Kartenvorteil durch gegnerische Commander-Zauber oder weiteres Spielen aus dem Exil; verzichtet auf Shadow-Angriffe und kostenlose gestohlene Karten.
- **`Fallen Shinobi`**: durch Ninjutsu nach ungeblocktem Rogue-Angriff zwei gegnerische oberste Karten kostenlos casten; sehr hohe Einzelschlag-Stärke, aber kein Rogue und fünf Mana (Ninjutsu vier). Für ein reines Rogue-Tribal vorläufig zurückgestellt.
- **`Enigma Thief`**: Prowl {3}{U}, ETB jede gegnerische Nichtland-Permanente bis zu einmal bouncen. Starker Schutz-/Finisher-Backup, jedoch wieder ein teurerer Kartentyp und weniger Diebstahl.
- **`Gonti, Canny Acquisitor`**: mächtiger Diebstahl-Commander, hier **illegal wegen grüner Farbidentität**; die aktuelle Anowon-Liste bleibt Dimir.
- **`Boss Uramon, Shadow's Reach`**: als neuer Rogue-Schattenspieler passend, aktuell jedoch laut Scryfall **nicht Commander-legal**, deshalb ausgeschlossen.
- **`Tetsuko Umezawa, Fugitive`**: verleiht Stärke- oder Widerstandskraft-1-Kreaturen Unblockbarkeit; Anowons +1/+1-Lordeffekt kann diesen Vorteil gerade bei unseren 1/1-Rogues verhindern.
- **`Double Down`, `Mindcrank`**: wegen geplanter Extra-Turn-Kette bzw. Bloodchief-Zwei-Karten-Endlosschleife nicht aufnehmen.
- **`Cyclonic Rift`, `Demonic Tutor`, `Vampiric Tutor`, `Fierce Guardianship`**: als weitere Game Changer nicht zusätzlich zu den bereits drei erlaubten Plätzen.
- **Entfernte V2-Karten:** `Gonti, Lord of Luxury`, `Rankle, Master of Pranks`, `Krydle of Baldur's Gate`, `Herald's Horn`, `Drown in the Loch`, `Resculpt`, `Island` (vierte Kopie). Die Vorteile sind dokumentiert; sie werden nicht als objektiv schlecht bezeichnet.
- **V1 → V2 Historie:** Acht Tausche verbesserten die ersten Rogues, brachten `Bloodchief Ascension`, `Banner of Kinship`, `Mystic Remora` und `Deadly Rollick` und ersetzten `Rogue's Passage` durch eine blaue Basisquelle. V3 hält diese Entscheidungen außer dem beschriebenen flexiblen Rückbau einer Basis-`Island`-Kopie aufrecht.

## Prüfstatus (17.10.2026, V3)

Frische Scryfall-`/cards/collection`-Prüfung **nach** den sieben Tauschen: **96/96 Einträge erkannt, 100 Karten, 36 landfähige Karten (einschließlich Glasspool), 34 Kreaturen-Vorderseiten, 32 gedruckte Rogue-Kreaturen, keine Commander-illegalen Karten und keine falsche Farbidentität, exakt drei `game_changer`-Flags**. Reine Nichtlandkarten: 64, mittlerer aufgedruckter Manawert 2,594.

Der Scryfall-`/cards/collection`-Datensatz wählt für `Underground Sea` mitunter einen digitalen Druck, aber **Revised (3ED #290)** und andere echte Papierdrucke sind separat per `game:paper` bestätigt. Nur offizielle, im Papierformat zulässige Druckversionen verwenden.

**Die Deckstärke ist eine begründete Erwartung, keine gemessene Siegrate.** Es wurden keine echten Partien durchgeführt. Die Bracket-Einstufung bezieht sich auf die aktuellen offiziellen Commander-Bracket-Empfehlungen und die Scryfall-Kartenflags, nicht auf eine Spielstärken-Garantie.

**Primärquellen:** [Wizards Commander & Brackets](https://magic.wizards.com/en/formats/commander) · [Scryfall Oracle & Legalities](https://scryfall.com) · [Aktuelle Deckliste](current.txt).