# Ruxa – Bracket 3 Multiplayer Token-Value v5

**Stand:** 2026-11-19
**Aktive Liste:** [current.txt](current.txt)
**Snapshot:** [versions/2026-11-19-upper-b3-four-player-v5.txt](versions/2026-11-19-upper-b3-four-player-v5.txt)
**Vorige Liste:** [versions/2026-10-11-upper-b3-v4.txt](versions/2026-10-11-upper-b3-v4.txt)

## Ziel und Verifikationsgrenze

Ruxa wird auf **vier Spieler**, nicht mehr auf 1v1 ausgerichtet. Ziel ist der obere Rand des regulären **Commander Bracket 3**: längere Partien überstehen, drei Gegner kontrollieren bzw. überrennen können, nach Removal wieder aufbauen und die fähigkeitslosen Token als Druckmittel nutzen.

- **100 Karten** inklusive Commander; **35 reine Länder** (28 Snow-Covered Forest + 7 andere Länder) und **1 modale Land-/Zauberkarte** (Bala Ged Recovery // Bala Ged Sanctuary, effektiv 36 spielbare Landkarten).
- **19 Kreaturen inkl. Ruxa**, davon **3 gedruckt fähigkeitslose Kreaturen**: Leatherback Baloth, Terrian, World Tyrant, Gigantosaurus.
- Weiterhin genau **3 bekannte Game Changer**: Ancient Tomb, Gaea's Cradle, Natural Order (Wizards-Listenstand Oktober 2025 und Update Februar 2026). Keine frühen zweikartenbasierenden Infinite-Kombos angestrebt, keine Extrazüge und keine Mass-Landverweigerung.
- **Validierungsstatus:** Deckstruktur und Kartenzahl lokal bei der Änderung vorab geprüft; der bestehende CI-Check `validate-decks` ist zusätzlich erforderlich. Neue Karten wurden gegen öffentlich verfügbare Oracle-/Legalitätsinformationen recherchiert; ein vollständiger erneuter Scryfall-Collection-Abgleich aller 100 Kartennamen und tatsächliche Vier-Spieler-Testpartien sind **nicht** durchgeführt. Kein Spielstärke- oder Manabrew-Nachweis aus einem grünen CI-Check ableiten.

## Änderungen v4 → v5 (11 gleichzahlige Ersetzungen)

| Entfernt | Neu | Ziel in Vier-Spieler-Partien |
| --- | --- | --- |
| Quakestrider Ceratops | Elder Gargaroth | Wiederholbare 3/3-Vanilla-Bestien, Kartenziehen bzw. Leben sowie Reichweite zur Verteidigung statt mittelgroßem Vanilla-Slot |
| Ghalta, Primal Hunger | Rampaging Baloths | Wiederkehrende 4/4-Vanilla-Bestien durch Landfall statt alleinstehendem großen Angreifer |
| Fungal Sprouting | Garruk, Primal Hunter | Wiederholt 3/3-Vanilla-Token oder großen Kartenzug statt einmaliger situativer Tokenwelle |
| Nature's Will | Verdant Force | Token in **jedem** Upkeep (vier pro vollständiger Runde) statt gegnerisches Mana zu tappen/selbst Länder zu enttappen |
| Life's Legacy | Greater Good | Reaktive, wiederholbare Kartenauswahl und Opferoption bei Removal statt einmaliger Hexerei |
| Up the Beanstalk | Mask of Memory | Wiederholbarer Kartenvorteil bei Ruxa-Kampfschaden; Equipment verleiht keine Fähigkeit |
| Emerald Medallion | Idol of Oblivion | Einmal pro Runde Karten nach Tokenproduktion; optionale 10/10-Vanilla-Eldrazi |
| Hard-Hitting Question | Ezuri's Predation | Mehrspieler-Sweeper mit vielen 4/4-Vanilla-Bestien gegen gegnerische Kreaturen |
| Tamiyo's Safekeeping | Fresh Meat | Nach gegnerischem Massen-Zerstören sofort viele 3/3-Vanilla-Bestien statt einzelner Schutzaktion |
| Regrowth | Sword of the Animist | Wiederholbares Grundland-Ramp durch Angriffe; die einmalige Kartenrückholung wird durch Bala Ged Recovery ersetzt |
| 1 Snow-Covered Forest | Bala Ged Recovery // Bala Ged Sanctuary | Als Land spielbar oder wichtige Karte aus Friedhof zurückholen, ohne die effektive Anzahl spielbarer Länder zu reduzieren |

## Kernmechanik und Mehrspieler-Taktik

1. **Tischbreite erzeugen.** Tendershoot Dryad und Verdant Force arbeiten mit vier Upkeeps pro Runde; Rampaging Baloths und Scute Swarm mit Landfall, Deep Forest Hermit und Avenger of Zendikar füllen das Feld einmalig. Parallel Lives/Doubling Season verdoppeln Tokens; Garruk, Primal Hunter erzeugt 3/3-Bestien ohne Fähigkeiten.
2. **Ruxa lohnt sich mit Vanilla-Tokens.** Der eigene +1/+1-Bonus und die Wahl, bei geblockten Vanilla-Angreifern Schaden dem verteidigenden Spieler zuzuweisen, bleiben verfügbar. Beastmaster Ascension und Muraganda Petroglyphs erhöhen nur Stärke/Widerstandskraft, ohne Fähigkeiten zu verleihen. **Garruk's Uprising bleibt ausgeschlossen**, weil dauerhaft verliehener Trampelschaden beide Ruxa-Vorteile bei betroffenen Kreaturen abschaltet.
3. **Karten nachziehen.** Toski, Bearer of Secrets nutzt durchgeschlagenen Schaden bei mehreren Gegnern; Mask of Memory löst auch bei geblockten Angreifern aus, wenn deren Ruxa-Schaden einem Spieler zugewiesen wird. Idol of Oblivion zieht nach Token-Erzeugung einmal pro eigenem Tap, nicht viermal pro Runde. Greater Good dient mit großen Kreaturen und Ruxa-Rekursion als Schutz vor gezieltem Removal und als Filter.
4. **Massenremoval überstehen.** Heroic Intervention schützt viele Kreaturen vor Zerstörung, aber nicht vor -X/-X oder Exil. **Fresh Meat nach der vollständigen Abwicklung** einer Zerstörungs- oder -X/-X-Massenentfernung verwandelt eigene im selben Zug gestorbene Kreaturen (inklusive Token) in neue 3/3-Bestien: Diese waren beim einmalig verrechneten -X/-X-Effekt (z. B. Toxic Deluge) noch nicht im Spiel und bleiben deshalb unbeeinflusst. **Gegen Exil und Bounce hilft Fresh Meat nicht**, denn dabei landen die Kreaturen nicht im Friedhof. Bala Ged Recovery als Regrowth-Ersatz holt eine Schlüsselkarte aus dem Friedhof zurück.
5. **Drei Gegner abschließen.** Ein großes Tokenboard mit Craterhoof Behemoth, Finale of Devastation oder Triumph of the Hordes kann mehreren Gegnern zugleich gefährlich werden. Ezuri's Predation wirkt besonders stark, wenn mehrere Gegner Kreaturen angesammelt haben. Mit Ruxa über blockende Gegner hindurch Schaden verteilen, aber bei durch Craterhoof/Finale/Triumph verliehenem Trampelschaden/anderen Fähigkeiten den Ruxa-Bonus nicht mitrechnen.

## Risiko, Alternativen, offene Gegenproben

- Höhere Top-End-Dichte (Verdant Force und Ezuri's Predation kosten je acht Mana) bringt mehr Reichweite, kann aber einzelne Starthände verlangsamen. Die Beschleunigung durch Earthcraft, Gaea's Cradle, Growing Rites of Itlimoc, Circle of Dreams Druid und die günstigen Landramp-Sprüche bleibt daher unangetastet.
- Weniger gedruckte Vanilla-Kreaturen reduzieren die Ziele für Ruxas Friedhofsrückholung auf drei; diese bleiben bewusst groß. Die meisten Tokens selbst werden nicht von Ruxa aus dem Friedhof zurückgebracht.
- Fresh Meat zählt alle Kreaturen, die in diesem Zug vom Spielfeld in den eigenen Friedhof gelangt sind (inkl. Token, auch durch -X/-X). Gegen Exil und Bounce hilft es nicht. Verdant Force kostet acht Mana und ist besonders anfällig, wenn die Runde unmittelbar danach einen Boardwipe auslöst.
- **Kein** Moldervine Reclamation: enthält ein schwarzes Manasymbol (Golgari-Farbidentität) und ist daher in Ruxa unzulässig. **Kein** Garruk's Uprising wegen Antisynergie. **Kein** Worldly Tutor oder Seedborn Muse, weil die vorhandenen drei Game-Changer-Slots belegt sind.
- **Ausstehend:** offizieller voller Oracle-/Farblisten-Abgleich auf alle 100 Karten, tatsächlicher Manabrew-Import und reproduzierbare Vier-Spieler-Testspiele inklusive Gegenproben gegen frühe Boardwipes, Flying-Decks und Removal-lastige Gruppen. Erfolgsbewertung: mehrere echte Partien mit stabilem Nachzug und Gewinnwegen gegen drei Gegner.

## Belege für Neueinbauten und Brackets

- Wizards Commander-Format und Brackets: https://magic.wizards.com/en/formats/commander
- Offizielle Game Changers, Oktober 2025: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025
- Bracket-Update Februar 2026: https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026
- Oracle-/Legalitätsbeispiele: https://mtg.wtf/card/m21/179/Elder-Gargaroth ; https://mtg.wtf/card/40k/243/Mask-of-Memory ; https://mtg.wtf/card/c19/55/Idol-of-Oblivion ; https://mtg.wtf/card/nph/109/Fresh-Meat ; https://mtg.wtf/card/c15/207/Verdant-Force
