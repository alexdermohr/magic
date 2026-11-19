# Ruxa – gültige Designprinzipien (2026-11-19: Vier-Spieler-Ziel, v5)

## Ziel

**Maximale reale Gewinnstärke innerhalb von Commander Bracket 3 in Vier-Spieler-Partien (Multiplayer Commander)**. 1v1 ist nicht mehr der Optimierungsmaßstab. Die frühere harte Vorgabe einer einfachen Bedienung und eines Komplexitätswerts von 3/10 ist **aufgehoben**. Anspruchsvolle Zugfolgen, wiederkehrende Trigger, Boardzustände, Card-Draw-Engines und Tutorentscheidungen sind zulässig, wenn sie die Deckleistung steigern.

Die aktuelle v5-Kartenliste wurde nach diesem Mehrspielermaßstab überarbeitet, aber **nicht durch tatsächliche Vier-Spieler-Partien empirisch abgenommen**. Aussagen zu 1v1 in historischen Analysen sind keine aktuelle Zielvorgabe.

## Prioritäten für vier Spieler

- **Ausdauer statt einmaliger Explosivität:** regelmäßige Token- und Kartenproduktion (Tendershoot Dryad, Verdant Force, Rampaging Baloths), belastbare Manaentwicklung und Wiederaufbau nach Interaktionen bzw. Boardwipes (Fresh Meat, Bala Ged Recovery, Greater Good).
- **Mehrere Gegner statt ein Duell:** ausreichende Verteidigung, gutes Ressourcenmanagement über längere Runden sowie Abschlüsse, die nicht nur einen einzelnen Spieler ausschalten.
- **Ruxa-Synergie erhalten:** dauerhafte Effekte, die unseren fähigkeitslosen Kreaturen Fähigkeiten verleihen, kritisch bis ablehnend bewerten. Insbesondere **Garruk's Uprising / Garruks Aufstand nicht aufnehmen**: Das globale Trampelschaden-Verleihen gibt allen eigenen Kreaturen eine Fähigkeit und deaktiviert damit sowohl Ruxas +1/+1-Bonus als auch seine besondere Kampfschadenszuweisung für diese Kreaturen. Der Kartenzieheffekt wiegt das in diesem Deck typischerweise nicht auf.
- **Bewertungsmaßstab:** neue Karten nach tatsächlichem Nutzen in einem Vier-Spieler-Spiel prüfen, nicht nur nach maximalem Schadenspotenzial in 1v1.

## Grenzen

- Genau 100 Commander-legale Karten in mono-grüner Farbidentität; nur Standardland-Ausnahmen von Singleton.
- **Bracket 3 / Upgraded**: bis zu drei Game Changer; keine Mass-Land-Denial-Strategie, keine frühen oder regelmäßig zu früh endenden Zwei-Karten-Infinite-Kombos, keine Extra-Turn-Ketten. Typischerweise mindestens sechs Züge Spielzeit (Wizards-Orientierung).
- Keine generelle Anzahlbeschränkung für Nicht-Game-Changer-Tutoren seit Wizards' Bracket-Update vom 21.10.2025.
- Bei tatsächlichen Bracket-4-ähnlichen Spielresultaten den Aufbau überdenken, auch wenn Einzelkarten formal erlaubt sind.

## Prioritäten

1. Frühes farbzuverlässiges Mana; ausreichend Startaktionen und Schutz vor Manascrew.
2. Fähigkeitslose Kreaturen **effizient pro Karte** erzeugen: Token-Erzeuger statt schwacher Einzel-Vanillas.
3. Token-Anzahl und -Kampfstärke mit Tribute, Muraganda, Beastmaster Ascension, Parallel Lives und Doubling Season skalieren.
4. Den Token-Überschuss in Mana und Karten verwandeln: Cradle, Earthcraft, Itlimoc, Toski, Regal Force, Skullclamp.
5. Über Craterhoof, Triumph oder Finale zuverlässig und interagierbar gewinnen; Ezuri's Predation kann im Mehrspieler-Spiel gegnerische Kreaturenbestände gleichzeitig dezimieren und fähigkeitslose 4/4-Bestien hinterlassen.
6. Einige außergewöhnlich große Vanilla-Kreaturen als Ruxa-Rekursionsziele erhalten; Ruxa muss nicht durchgehend liegen.
7. Auf gegnerische Bedrohungen reagieren, ohne den Kernplan zu verwässern.

## Wichtige Regelgrenzen

- Ruxas statischer +1/+1-Bonus und Schadenszuweisung durch Blocker gelten nur für Kreaturen **ohne Fähigkeiten auf dem Spielfeld**.
- Bei Scute Swarm sind die Insektentoken vor sechs Ländern Vanilla; spätere Scute-Kopien **haben Landfall** und erhalten Ruxas Bonus nicht.
- Earthcraft verleiht Kreaturen **keine** Fähigkeiten; es kann auch frisch erzeugte Kreaturen zum Enttappen eines **Standardlandes** tappen. Yavimaya macht andere Länder zu Forests, nicht zu Basic Lands.
- Skullclamp tötet einen 1/1-Token bei aktivem Ruxa nicht automatisch; Evolutionary Leap kann den ausgerüsteten Token opfern.
- **Mask of Memory und Sword of the Animist verleihen der ausgerüsteten Kreatur keine Fähigkeit**: Die ausgelösten Fähigkeiten gehören den Ausrüstungen. Mask of Memory kann durch Ruxas Schadenszuweisung auch bei einer geblockten Vanilla-Kreatur ausgelöst werden; Sword of the Animist beim Angriff unabhängig vom Kampfschaden.
- Fresh Meat muss **nach** einer Zerstörungsaktion im selben Zug gewirkt werden, um auch gestorbene eigene Spielsteine zu ersetzen; Exil/Zurückschicken zählen nicht. Verdant Force erzeugt in einer Runde mit vier Spielern einen Saproling in jedem der vier Upkeeps.
- Triumph, Craterhoof oder Finale bei X≥10 verleihen Fähigkeiten; die betroffenen Kreaturen verlieren in diesem Abschlusszug den Ruxa-Bonus. Beastmaster Ascension / Muraganda Petroglyphs hingegen verändern nur Werte.
- Chord of Calling tappt beim Convoke Kreaturen, die dann ohne gesondertes Enttappen nicht mehr im selben Zug angreifen können.
- **Nicht** Earthcraft + Squirrel Nest oder bekannte frühe Zwei-Karten-Endlosschleifen einbauen; ein konstanter Vor-Zug-6-Kill wäre nicht im beabsichtigten Bracket.

## Verifikation

Vor jedem Update frisch: Repository-Head/Änderungen, aktuelle offizielle Commander-Brackets und Bannliste, Oracle/Legalität/Farbidentität, Gesamtzahl, Landzahl inklusive modaler Landkarten, Mana-Kurve, Spielplan, Game-Changer-Zählung, mögliche frühe Infinite-Kombos. CI prüft nur Struktur; strategische Wirksamkeit bleibt bis zu echten Vier-Spieler-Tests eine Hypothese. Statische Korrektheit nicht mit echten Testspielen oder manabrew.app-Kompatibilität verwechseln.

Primärquellen:
- https://magic.wizards.com/en/formats/commander
- https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- https://magic.wizards.com/en/banned-restricted-list
