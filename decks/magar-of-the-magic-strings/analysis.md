# Magar of the Magic Strings — Bracket 3, V7

**Stand:** 20. Oktober 2026 · **Aktive Liste:** [current.txt](current.txt) · **Commander:** Magar of the Magic Strings (Rakdos) · **Bracket 3, kein Budgetlimit.**

## Die zwei V6-zu-V7-Wechsel

| Heraus | Hinein | Warum das voraussichtlich besser passt | Stärkstes Gegenargument |
|---|---|---|---|
| Expedition Map | **Key to the Side-Door** | Kostet {1}, gibt für {2} und Tappen **wiederholt** einer Magar-Puppe Unblockbarkeit. Anders als eine einmalige Landsuche bleibt die Fähigkeit dauerhaft auf dem Feld und benötigt keinen Landdrop. | Expedition Map war flexibler: Es konnte Manaquellen, Bojuka Bog oder ein Evasion-Land suchen. Key trifft jeweils nur **eine** Kreatur und braucht Mana sowie Enttappen. |
| Geier Reach Sanitarium | **Cavern of Souls** | Land kommt ungetappt, für Minotaur gewählt kann sein Spezialmana Magar beim Wirken vor Counterspells schützen; alternativ {C} für Magars generische Aktivierungskosten. | Sanitarium war eine wiederholbare Discard-/Draw-Quelle direkt auf einem Land. Cavern verbessert nicht die rote/schwarze Manaausgabe für Magars Fähigkeit, und seine Uncounterbarkeit schützt **weder Puppen noch gewirkte Zauberkopien**. |

Die **36 Landkarten**, sieben übrigen Mana-Artefakte, frühere Evasion-/Schutzpakete und die wichtigsten Magar-Ziele bleiben in ihrem Bestand unverändert. Der Gewinn liegt in höherer Zuverlässigkeit, **nicht** in mehr spektakulären, teuren Zaubern.

## Wie Key to the Side-Door korrekt eingesetzt wird

`Key to the Side-Door` ist ein farbloses Artefakt aus **The Hobbit**, weltweit veröffentlicht am **14. August 2026**, Commander-legal. Erste Fähigkeit: **{2}, {T}: Target creature can't be blocked this turn**. Benutze sie spätestens im Angreifer-deklarieren-Segment, bevor Blocker deklariert werden. Wird eine Puppe bereits geblockt, macht die nachträgliche Aktivierung sie **nicht** rückwirkend ungeblockt. Der Effekt lässt die unveränderte 3/3 unabhängig von gegnerischen Kreaturen Spieler-Kampfschaden zufügen; danach kann die Kopie der notierten Karte kostenlos **gewirkt** werden.

Die zweite Fähigkeit (legendäre Karte mit gleichem Namen wie ein kontrolliertes legendäres Permanent abwerfen) ist bei nur einem regulären Magar in einem Commander-Singleton-Deck normalerweise nicht nutzbar. **Kein unnötiger Kartenziehwert in die Bewertung hineinerfinden.**

Die bisherigen Evasion-Karten bleiben: `Key to the City`, `Mask of Memory` (Kartenvorteil **nach** Treffer, nicht Unblockbarkeit), `Prowler's Helm`, `Thieves' Tools`, `Whispersilk Cloak`, `Silver Shroud Costume`, `Dauthi Embrace`, `Traitor's Clutch` sowie `Access Tunnel`, `Rogue's Passage` und `The Black Gate`.

## Cavern of Souls korrekt einsetzen

Beim Eintritt **Minotaur** benennen, damit das Farbmana zum Wirken von `Magar of the Magic Strings` verwendet werden kann. Magar ist ein legendärer **Minotaur Performer**. Die Kreatur kann dann nicht neutralisiert werden. Das Spezialmana kann **nicht** benutzt werden, um Magars aktivierte Fähigkeit {1}{B}{R} mit {B} oder {R} zu bezahlen; sein {C}-Modus kann lediglich das generische {1} der Aktivierung decken. Andere Kreaturenarten sind im Deck vorhanden, die gewählte Form bevorzugt ausschließlich den Commander.

Wenn Gegner nicht über Gegenzauber verfügen oder häufiges looting wichtig ist, war `Geier Reach Sanitarium` besser. Dieser Meta-Nachteil ist bewusst akzeptiert; Cavern ist hier **Commander-Schutz im Manaslot** und keine universelle Anti-Interaktionskarte.

## Deck-Struktur und Bracket-Grenze

Die aktive [current.txt](current.txt) enthält **100 Karten**: 1 Commander, 7 weitere Kreaturen, 19 Artefakte, 5 Verzauberungen, 32 Instants/Sorceries einschließlich `Malakir Rebirth`, und 36 echte Länder. Die beiden Änderungen ersetzen exakt 1 Artefakt durch 1 Artefakt und 1 Land durch 1 Land.

**Game Changers unverändert (3):** `Demonic Tutor`, `Gamble`, `Jeska's Will`. Die neuen Karten zählen nicht dazu. Keine beabsichtigte frühe Zweikarten-Endlosschleife, keine Extra-Turn-Kette, keine Massenlandvernichtung.

**Ausdrücklich beibehalten:** `Disrupt Decorum` als wiederholt gewirkter Goad-Zauber und defensive politische Kontrolle. `Mirkwood Bats` bleibt **ausgeschlossen**. `Increasing Ambition`, `Call Forth the Tempest`, `Brass's Bounty`, `Blood for the Blood God!`, `Breach the Multiverse` und `Rise of the Dark Realms` bleiben Magars zentrale Großzauber. Alle Evasion-, Discard- und Schutzkarten außer Expedition Map/Geier Reach sind unverändert.

## Historie und Nachweise

- [V1](versions/2026-10-19-b3-v1.txt), [V2](versions/2026-10-19-b3-v2.txt), [V3](versions/2026-10-19-b3-v3.txt), [V4](versions/2026-10-19-b3-v4.txt) und [V5](versions/2026-10-19-b3-v5.txt) sind unverändert.
- [V6](versions/2026-10-20-b3-v6.txt) ist die byteidentische gemergte Vorversion; ihre ausführliche Optimierungsanalyse bleibt in der Git-Historie und ihrem Merge-Commit nachvollziehbar.
- Oracle-/Legalitätsnachweise: [Key to the Side-Door](https://mtg.wtf/card/hob/175/Key-to-the-Side-Door), [Cavern of Souls](https://mtg.wtf/card/lci/269/Cavern-of-Souls), [Magar](https://mtg.wtf/card/unf/263/Magar-of-the-Magic-Strings), [Wizards Commander](https://magic.wizards.com/en/formats/commander).

**Prüfgrenze:** Die CI prüft Dateistruktur und dokumentierte Pfade, **nicht** die Commander-Oracle-Legalität aller 100 Karten und keine reale Multiplayer-Winrate. Ohne Spieltests ist V7 eine begründete Verbesserung der Zuverlässigkeit, keine gemessene Siegratensteigerung.
