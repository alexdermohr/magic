# Ruxa – gültige Designprinzipien (2026-10-11, v4)

## Ziel

**Maximale reale Gewinnstärke innerhalb von Commander Bracket 3**, vorrangig im 1v1. Die frühere harte Vorgabe einer einfachen Bedienung und eines Komplexitätswerts von 3/10 ist **aufgehoben**. Anspruchsvolle Zugfolgen, wiederkehrende Trigger, Boardzustände, Card-Draw-Engines und Tutorentscheidungen sind zulässig, wenn sie die Deckleistung steigern.

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
5. Über Craterhoof, Triumph oder Finale zuverlässig und interagierbar gewinnen.
6. Einige außergewöhnlich große Vanilla-Kreaturen als Ruxa-Rekursionsziele erhalten; Ruxa muss nicht durchgehend liegen.
7. Auf gegnerische Bedrohungen reagieren, ohne den Kernplan zu verwässern.

## Wichtige Regelgrenzen

- Ruxas statischer +1/+1-Bonus und Schadenszuweisung durch Blocker gelten nur für Kreaturen **ohne Fähigkeiten auf dem Spielfeld**.
- Bei Scute Swarm sind die Insektentoken vor sechs Ländern Vanilla; spätere Scute-Kopien **haben Landfall** und erhalten Ruxas Bonus nicht.
- Earthcraft verleiht Kreaturen **keine** Fähigkeiten; es kann auch frisch erzeugte Kreaturen zum Enttappen eines **Standardlandes** tappen. Yavimaya macht andere Länder zu Forests, nicht zu Basic Lands.
- Skullclamp tötet einen 1/1-Token bei aktivem Ruxa nicht automatisch; Evolutionary Leap kann den ausgerüsteten Token opfern.
- Triumph, Craterhoof oder Finale bei X≥10 verleihen Fähigkeiten; die betroffenen Kreaturen verlieren in diesem Abschlusszug den Ruxa-Bonus. Beastmaster Ascension / Muraganda Petroglyphs hingegen verändern nur Werte.
- Chord of Calling tappt beim Convoke Kreaturen, die dann ohne gesondertes Enttappen nicht mehr im selben Zug angreifen können.
- **Nicht** Earthcraft + Squirrel Nest oder bekannte frühe Zwei-Karten-Endlosschleifen einbauen; ein konstanter Vor-Zug-6-Kill wäre nicht im beabsichtigten Bracket.

## Verifikation

Vor jedem Update frisch: Repository-Head/Änderungen, aktuelle offizielle Commander-Brackets und Bannliste, Scryfall-Oracle/Legalität/Farbidentität, Gesamtzahl, Landzahl, Mana-Kurve, Spielplan, Game-Changer-Zählung, mögliche frühe Infinite-Kombos. Statische Korrektheit nicht mit echten Testspielen oder manabrew.app-Kompatibilität verwechseln.

Primärquellen:
- https://magic.wizards.com/en/formats/commander
- https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- https://magic.wizards.com/en/banned-restricted-list
