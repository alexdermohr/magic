# Ishai + Jeska — Jeskai Tempo-Control / Commander-Damage V2 (Bracket 3)

**Stand:** 24.10.2026 · **Aktive Liste:** [current.txt](current.txt) · **V1:** [GitHub-PR #66](https://github.com/alexdermohr/magic/pull/66). Unbegrenztes Budget, Fokus auf die obere Bracket-3-Grenze ohne Endlosschleifen.

## Strategisches Urteil

Ishai wächst ohne eigene Manaausgaben durch jeden von Gegnern gewirkten Zauber. Deshalb ist der effizienteste Plan **früher Ishai + flexible, günstige Reaktion + Jeska als Finisher**. Die ursprüngliche V1 hatte mehrere teure, vorab offenliegende Equipment-/Counter-Beschleuniger, aber zu wenige Möglichkeiten, Ishai zuverlässig am Blocken zu hindern. V2 optimiert **tatsächlich zugefügten Commander-Schaden**, nicht nur die theoretische höchste Stärke.

Drei geprüfte Modelle:
- **Klassischer Equipment-Voltron:** Wiederholbare Buffs, aber erst Cast- *und* Equip-Mana, hohe Setup-Kosten, sorcery-speed exponiert. V2 behält nur die vier besonderen Equipments: Brotherhood Regalia (nicht blockbar/ward), Swiftfoot Boots (haste/hexproof), Mithril Coat (flash/indestructible) und Shadowspear (trample/lifelink/Hexproof-Removal).
- **Markenvervielfachung:** Lae'zel wirkt nach Ishai erst auf nachfolgende gegnerische Casts, The Ozolith gewinnt bereits angesammelte Marken nach echtem Verlassen des Spielfelds zurück. **Lae'zel entfernt, The Ozolith als Removal-Versicherung behalten.** Generische Proliferate-Motoren binden zu viel Mana bzw. zusätzliche Slots.
- **Tempo-Control/kompakter Voltron-Finisher:** **Gewählt.** Kurze Schutz-/Evasion-/Schadenslinie mit hoher Redundanz, ohne viele voneinander abhängige Setup-Karten.

## V1 → V2: zehn konkrete Kartentausche

| Heraus | Herein | Konsequenz |
| --- | --- | --- |
| Monastery Mentor | **Spellseeker** | Statt langsamer Token-Nebenstrategie ein Tutor für die richtigen MV≤2-Evasion-, Pump-, Schutz- oder Counterspells |
| Selfless Spirit | **Ranger-Captain of Eos** | Tutort Mother of Runes/Giver of Runes/Skrelv/Esper Sentinel und kann gegnerische Noncreature-Spells im Finishzug sperren; verliert einen kostenlosen Indestructible-Opfereffekt |
| Lae'zel, Vlaakith's Champion | **Voice of Victory** | 2 statt 3 Mana, Gegner können während unserer Züge keine Zauber wirken, solange Voice liegt; Ishai-Wachstumsdopplung entfällt |
| Blackblade Reforged | **Security Bypass** | Zwei Mana und Soloangriff sorgen für „can't be blocked“, bei Schaden zusätzlicher Connive-Filter/+1/+1-Markenchance, statt fünf Mana Cast+Legend-Equip |
| Inquisitor's Flail | **Monstrous Rage** | Ein rotes Mana für effektiv +3 Power bei Resolven und Trample durch verbleibende Monster-Role, statt 4 Mana Equipment und verdoppelten eingehenden Kampfschadens |
| Lizard Blades | **Akroma's Will** | Einmaliger, aber flexibler Double-Strike-Finisher mit Indestructible und Farbschutz bei Commander-Kontrolle; kein dauerhafter Reconfigure-Wert mehr |
| Curiosity | **Slip Through Space** | Ein Mana, sicher unblockbar für den Zug und Kartenersatz, statt wiederholbarer Draw-Aura ohne eigene Evasion |
| Shore Up | **Giver of Runes** | Permanenter günstiger Schutz und Evasion gegen eine gewählte Farbe bzw. farblose Quellen; benötigt Tap-Aktivierung und kann erst ab nachfolgendem Zug eingesetzt werden |
| Pongify | **Shadow Rift** | Ein blaues Mana als instant-speed Cantrip, praktisch unaufhaltsam für den fliegenden Ishai; dafür eine gezielte Kreaturenentfernung weniger |
| Twinferno | **Spark Double** | Kopiert Jeska als nichtlegendären Planeswalker für ein zweites ×3, oder andere eigene Kreaturen wie Spellseeker/Ranger-Captain; teuer und auf eigene Boardpräsenz angewiesen |

**Explizit behalten:** The Ozolith, Duelist's Heritage, Psychotic Fury, Temur Battle Rage, Boros Charm, Unleash Fury, Kediss, Mystic Remora, alle sieben Ramp-Artefakte, 36 landspielbare Karten und das flexible Removal-Paket. *Duelist's Heritage* bleibt die wiederverwendbare Double-Strike-Quelle, auch für Politik bei Angriffen der Gegner untereinander.

## Verlässliche Commander-Damage-Linien

1. **Ishai Power 7 + Jeska 0:** 7 × 3 = **21 Commander-Schaden**, falls der gesamte Kampfschaden dem Spieler zugefügt wird. Ein Flugblocker kann das verhindern. *Security Bypass* funktioniert, wenn Ishai **allein** angreift; *Brotherhood Regalia*, *Aqueous Form* und *Slip Through Space* bieten weitere Möglichkeiten.
2. **Ishai Power 4 + Jeska + Double Strike:** 4 × 3 × 2 = **24** bei zwei ungeblockten Schadensschritten. Quellen sind *Psychotic Fury*, *Boros Charm*, *Temur Battle Rage*, *Duelist's Heritage*, *Akroma's Will* (und *Spellseeker* kann die günstigen Instants finden).
3. **Ishai Power 4 + Jeska + Monstrous Rage:** Der Sofortzauber gibt +2/+0; die Monster-Role gibt zusätzlich dauerhaft +1/+1 und Trample. Für den Zug ist Ishai effektiv 7/5, verursacht **21 Commander-Schaden, sofern ungeblockt**. Bei Block mit Trample zählt nur der Schaden, der **tatsächlich dem gegnerischen Spieler** zugewiesen und zugefügt wird, nicht der gesamte Powerwert.
4. **Ishai Power 4 + Jeska + Unleash Fury:** verdoppelte Stärke 8, daraus **24** bei ungeblocktem Schaden.
5. **Ishai Power 3 + zwei Jeska-0-Effekte:** Wenn *Spark Double* als nichtlegendäre Kopie der originalen Jeska ins Spiel kommt, haben wir zwei separate Planeswalker mit derselben 0-Fähigkeit. Beide auf Ishai anwenden: **3 × 3 × 3 = 27 Commander-Schaden** bei einem ungeblockten Angriff. Diese ×9-Linie benötigt Original-Jeska, Spark Double, Ishai und zwei aktivierte 0-Fähigkeiten, ist **keine Zweikarten-Endlosschleife**. Die zusätzlichen Loyalitätsmarken beim Kopieren der Jeska folgen aus der eigenen Enter-With-Counters-Fähigkeit plus Spark-Double-Effekt. Der Kopie fehlt der legendäre Supertyp; sie ist selbst **kein dritter Commander**.
6. **Ishai + Jeska + Kediss:** Der eigentliche Ishai-Treffer wird vervielfacht; *Kediss* verteilt die Höhe des bereits zugefügten Schadens zusätzlich an jeden anderen Gegner. Dieser Folgeschaden ist **Nichtkampfschaden und kein Commander-Schaden**, wird daher nicht nochmals von Jeska verdreifacht. Er ist ein starker Mehrspieler-Finisher über die Lebenspunkte.

**Spellseeker-Paket:** Für Mana Value 2 oder weniger findet Spellseeker je nach Situation *Slip Through Space*, *Shadow Rift*, *Monstrous Rage*, *Unleash Fury*, *Psychotic Fury*, *Temur Battle Rage*, *Boros Charm*, *Silence*, *Swan Song*, *An Offer You Can't Refuse*, *Swords to Plowshares* oder passende Counterspells. *Wear // Tear* hat als Splitkarte insgesamt Mana Value 3 und wird **nicht** von Spellseeker gefunden. *Recruiter of the Guard* sucht Spellseeker, Stoneforge Mystic, Grand Abolisher oder mehrere Schutzkreaturen.

## Evasion: messbarer Verfügbarkeitsgewinn, kein erfundener Win-Rate-Wert

V1 hatte zwei eindeutige/unabhängig vom konkreten gegnerischen Kreaturentyp wirkende Hauptoptionen für Ishai: *Aqueous Form* und *Brotherhood Regalia*. V2 hat zusätzlich *Slip Through Space* und beim Soloangriff *Security Bypass*; *Shadow Rift* gibt dem ohnehin fliegenden Ishai Shadow und ist daher gegen fast alle üblichen Blocker effektiv (nur Shadow-Kreaturen mit Flying/Reach können ihn dann blocken).

**Reine Zieh-Verfügbarkeit unter offen gelegten Annahmen:** Wenn in der 98-Karten-Bibliothek bis einschließlich Zug 6 **13 zufällige Karten** gesehen werden, ohne Mulligan, Zusatzziehungen, Tutorsuche, Manakosten oder Gegnerinteraktion, steigt die Chance, wenigstens eine dieser fünf *praktischen* Evasion-Optionen zu sehen, von **24,9 % (2 Stück in V1) auf 51,7 % (5 Stück in V2)**. Das ist **keine Gewinnquote**: Security Bypass benötigt Soloangriff; Shadow Rift ist nicht technisch gegen alle Kreaturen unblockbar; nicht jedes gesehene Mittel kann rechtzeitig benutzt werden. Hinzu kommen qualitative Verbesserungen durch Spellseeker-Tutoring, Giver/Mother/Skrelv-Schutz und bereits vorhandene Flughilfe.

**Regel-Timing:** *Shadow Rift* vor dem Blocker-Deklarieren wirken; erst danach Shadow zu erhalten macht bereits blockende Kreaturen nicht ungültig. *Slip Through Space* ist wegen Devoid **farblos**, obwohl es {U} kostet. Giver/Mother/Sejiri Shelter/Skrelv können Ishai vor roten Quellen schützen — dann ist die **rote** Jeska-0-Fähigkeit kein legales neues Ziel auf Ishai. Daher zuerst Jeskas 0 auflösen lassen, **danach** gegebenenfalls Schutz vor Rot geben. *Akroma's Will* mit Kontrolle eines Commanders erlaubt beide Modi, schützt Ishai dann vor **allen Farben**, verhindert dadurch aber ebenfalls nachträgliches Jeska-Zielen und lässt farblose Blocker als mögliches Hindernis übrig. **Wichtig:** Schutz vor Blau lässt bereits an Ishai angelegte blaue Auren wie *Aqueous Form*, *Combat Research* und *Security Bypass* abfallen (in den Friedhof). Das gilt auch für durch Giver/Mother gewährten Blauschutz. Deshalb zuerst die Auswirkungen auf Evasion und Kartenvorteil abwägen, bevor Akroma's Will oder Blauschutz eingesetzt wird. *Security Bypass* setzt zudem voraus, dass Ishai als einziger Angreifer deklariert wird; mitangreifende Kreaturen und die Mobilize-Token von *Voice of Victory* verhindern diese Bedingung.

## Schutz, Interaktion und Commander-Tax

- **Früher Schutz:** Mother of Runes, Skrelv, Giver of Runes, Swiftfoot Boots, Slip Out the Back, Loran's Escape, Deflecting Swat, Fierce Guardianship und niedrige Stack-Counter.
- **Eigener Finishzug:** Grand Abolisher und Voice of Victory blockieren gegnerische Spells im eigenen Zug (Voice ist ein permanent-basierter Effekt, kein Counterspell); Silence und Ranger-Captain of Eos können nach erfolgreicher Verrechnung gegnerische Noncreature-Interaktion ausschließen. Gegner dürfen auf die jeweilige Aktivierung oder den Spell selbst noch reagieren; Gegner dürfen weiterhin aktivierte Fähigkeiten ihrer Permanents verwenden.
- **Boardwipes:** Teferi's Protection und March of Swirling Mist gegen Exil/Destroy; Boros Charm und Flawless Maneuver gegen Destroy; Mithril Coat und Loran's Escape gegen einzelnes Destroy. Indestructible hilft **nicht** gegen Exil, Opfer, Bounce oder -X/-X. Beim Phasing verlässt Ishai das Spielfeld nicht, daher erhält The Ozolith dadurch keine Marken.
- **Antworten auf gegnerische Bedrohungen:** Swords to Plowshares, Path to Exile, Resculpt, Winds of Abandon, Chaos Warp, Wear // Tear und die Counterspells. Gegenüber V1 entfällt Pongify; dafür ist die Evasion-Kurve niedriger und Jesska kann problematische Kreaturen/Planeswalker mit **−X** treffen.
- **Commander-Tax:** Jeska und Ishai zählen ihre Tax getrennt. The Ozolith bietet eine Erholungslinie nach Removal: Ishai verlässt mit Marken das Spielfeld, Ozolith nimmt dieselbe Markenzahl auf und kann sie zu Beginn eines späteren eigenen Combat auf die neu gewirkte Kreatur bewegen. Das gibt der Kreatur **keine Haste**; Arena of Glory oder Swiftfoot Boots können gesondert relevant sein. Spark Double ist keine Möglichkeit, Commander-Tax direkt zu umgehen.

## Mana, Mulligan, Draw und sekundäre Pläne

**36 landspielbare Slots:** 35 aufgedruckte Länder plus das MDFC *Sejiri Shelter // Sejiri Glacier*. **Sieben Ramp-Artefakte:** Sol Ring, Arcane Signet, Fellwar Stone, Talisman of Progress, Talisman of Conviction, Talisman of Creativity und Azorius Signet. Kein Budgetlimit; Manafarben W/U für Ishai und R für Jeska sind wichtiger als zusätzlicher farbloser Ramp. *Ancient Tomb* beschleunigt, kann aber keine farbigen Pips ersetzen.

**Kurve der 62 nichtlandigen Bibliothekskarten ohne Commander:** Mana Value **1: 23, 2: 25, 3: 12, 4: 2**, Durchschnitt **1,89**. Die zwei MV4-Karten sind *Spark Double* und *Akroma's Will*. Die zwei Commander sind separate Karten in der Kommandozone; das getappte MDFC-Land ist als landspielbar gezählt. Der durchschnittliche Mana Value bildet nicht Flashback, Equip, Reconfigure, Tutorkosten oder Protection-Kosten ab.

**Mulligan:** 2–4 echte manaerzeugende Länder/Spells, Weiß und Blau bis Ishai und mindestens ein früher Draw-, Ramp- oder Schutzschritt; keine Haufen aus ausschließlich Finish-Zaubern. Früh Ishai legen und **nicht** unnötig alle Finisher offenlegen. Vor dem Kill Schutzfenster absichern und genügend blaues Mana für Interaktion offen halten. Draw-Quellen: Mystic Remora, Esper Sentinel, Archivist of Oghma, Ledger Shredder, Combat Research, Cantrips, Expressive Iteration und Windfall. Security Bypass **connives (Draw + Discard)**, ist keine dauerhafte zusätzliche Netto-Karte pro Treffer; Curiosity als potentiell wiederholbare Draw-Aura ist dafür weggefallen.

**Alternativspiel:** Ein kopierter Jeska-Planeswalker kann zusätzliche −X-Removal/Burn-Optionen eröffnen. *Spark Double* kann stattdessen Spellseeker/Ranger-Captain kopieren und relevante ETB-Tutor-Effekte wiederholen oder als zusätzliche Ishai-Kopie passiv wachsen. Die nichtlegendäre Kopie Ishais ist **kein Commander**, ihr Kampfschaden deshalb kein Commander-Schaden. Kediss' verteilt gezielter Burn zusätzlich die Lebenspunkte der restlichen Gegner. **Ehrliche Einschränkung:** Nach wiederholter Exilierung Ishais ist das Deck weiter schwächer als ein unabhängiges breites Token-/Combo-Deck. Monastery Mentor als Token-Ausweichplan wurde zugunsten zuverlässigerer Ishai-Linien bewusst gestrichen.

## Bracket- und Faktenprüfung, verbleibende Unsicherheit

**Game Changers (Scryfall Liveabfrage 24.10.2026): genau Ancient Tomb, Fierce Guardianship, Teferi's Protection.** Keine weiteren markierten Karten; alle 100 Kartennamen legal im Commander, Farbidentität Teilmenge Weiß/Blau/Rot. Scryfall-Collection löst die Splitkarte *Wear // Tear* nicht immer direkt auf; sie wurde gesondert per `cards/named` verifiziert. Es sind keine absichtlichen Zweikarten-Endlosschleifen, Extra-Turn-Ketten oder Massenlandzerstörungen enthalten. Einzelne explosive Ishai-One-Shots sind Teil des offen anzusprechenden oberen Bracket-3-Profils.

**Verifikation:** Repository-Validator prüft nur 100 Karten, Singleton, Deckscope und dokumentierte Pfade; Scryfall bestätigt Namen/Color/Legality/Game-Changer-Status; Wizards ist die Primärquelle für Commander-/Bracket-Leitlinien und Spark-Double-Regeln. Weder Simulation echter Partien noch empirisch gemessene Siegquote liegen vor. Kartenpakete, Antworten der Gegner und tatsächliche Matchups benötigen Spielerfahrung.

**Quellen:** [Wizards Commander-Regeln & Brackets](https://magic.wizards.com/en/formats/commander) · [Bracket-Update Februar 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Wizards Ravnica Remastered: Spark Double](https://magic.wizards.com/en/news/feature/ravnica-remastered-release-notes) · [Scryfall API](https://scryfall.com/docs/api).