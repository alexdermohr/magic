# Obeka, Splitter of Seconds — Zeit als Ressource (Bracket 3)

**Status:** Bracket 3 / Upgraded. Aktuelle optimierte **V4 (2026-10-18)**, 100 unterschiedliche Karten inkl. Commander, Grixis, ohne Budgetlimit.

- [Importierbare Liste](current.txt)
- [Kartenbewertung, Regelprüfung und Simulation](analysis.md)
- [Echte Versionen V1–V4](versions/)
- [Reproduzierbare Tests](tests/verify_deck.py)

## Kernstrategie

Obeka kostet {1}{U}{B}{R}, ist eine **2/5-Kreatur mit Menace**. Für jeden Punkt Kampfschaden an einem Spieler erhältst du **einen zusätzlichen eigenen Upkeep nach der Kampfphase**. Es sind **keine** weiteren Enttapp-, Zieh-, Kampf- oder Hauptphasen. Die meisten Engines sagen ausdrücklich „at the beginning of your upkeep“ und werden durch diese Upkeeps erneut ausgelöst.

Die Deckidee besteht aus **früh bezahlbarem Mana, Obeka-Evasion und mehreren voneinander unabhängigen Upkeep-Permanents**. Schutz ist wichtiger als noch ein weiteres teures Payoff. Die Courts und Draw-Engines funktionieren auch bei hoher Commander-Tax in normalen Upkeeps weiter.

## Spielanleitung

1. **Mulligan:** Meist 2–4 Landquellen und möglichst ein Sol Ring/Signet/Talisman. Dazu vorzugsweise Brotherhood Regalia, Aqueous Form, Thassa, God of the Sea, Prowler's Helm oder Key to the City. Kein Keep nur aus teuren Courts.
2. **Züge 1–3:** Farbfixierung, Manasteine, Haste/Evasion vorlegen. Ring of Valkas, Lavaspur Boots und Swiftfoot Boots ermöglichen frühe, größere Angriffe.
3. **Ab Zug 4:** Obeka ausspielen. Gegen offensichtliches Removal Schutz bereithalten. Robe of the Archmagi lässt sich an Obeka als **Warlock für {1}** anlegen.
4. **Kampfschaden:** Ohne Pump 2 Trefferpunkte = **2 neue Upkeeps**. Mit Lavaspur Boots 3 Schaden = **3 neue Upkeeps**. Blackblade Reforged und Ring of Valkas vergrößern Obeka. Double Strike über Fireshrieker/Lizard Blades kann **zwei separate Kampfschaden-Trigger** erzeugen.
5. **Zusätzliche Upkeeps:** Trigger sinnvoll stapeln. Ring of Valkas wächst für den nächsten Angriff; Replicating Ring sammelt Counter; Courts und andere Permanents erzeugen Material und Schaden. **Danach** folgt die reguläre zweite Hauptphase zum Wirken von Zaubern, soweit die jeweilige Erlaubnis andauert.

## Die stärksten Engines

**Sechs Courts:** Court of Embereth produziert jede Upkeep einen Knight und fügt bei vorhandenem Monarchenstatus **allen Gegnern Schaden entsprechend der eigenen Kreaturenzahl** zu. Court of Locthwain exiliert Gegnerkarten und ermöglicht unter Monarch pro Upkeep einen kostenlosen Zauber von dort. Court of Vantress kopiert unter Monarch **pro Upkeep ein Artefakt oder eine Verzauberung** — besonders weitere Courts, Psychosis Crawler (eine Artefaktkreatur), Replicating Ring und Phyrexian Arena. Court of Ambition drückt Handkarten/Leben, Court of Ire schießt bei Monarch 7 Schaden und Court of Cunning millt bis zu 10 Karten pro gewähltem Spieler. Alle sechs machen dich beim Eintritt zum Monarchen.

**Direkter Kartenvorteil:** Phyrexian Arena, Struggle for Project Purity (Modus Brotherhood: mit drei Gegnern typischerweise drei eigene Draws pro Upkeep, dafür je ein Draw beim Gegner!), Bonehoard Dracosaur (zwei exilierte Karten/weitere Token), Plargg and Nassari (bis zu zwei kostenlose Zauber pro Upkeep) sowie Robe of the Archmagi. Psychosis Crawler übersetzt **wirkliche Draws** in Lebensverlust aller Gegner.

**Upkeep-Counter:** Ring of Valkas legt pro eigenem Upkeep eine +1/+1-Marke auf die rote Obeka. Replicating Ring erzeugt nach acht Night-Countern **acht gleichnamige Replicated Rings**; Mechanized Production kann dadurch sofort in einem späteren bzw. bei geschickter Triggerreihenfolge sogar demselben Upkeep gewinnen. Chronozoa mit Vanishing 3 erzeugt nach Ablauf der Counter zwei Kopien, nach drei weiteren Upkeeps vier.

## Siegbedingungen

- **Court of Embereth**: bei nur einem Court quadratisch wachsende Schadenssumme aus Knights; weitere Court-Kopien verstärken dies, besonders mit Bloodletter of Aclazotz.
- **Court of Ambition / Court of Ire / Creeping Bloodsucker**: wiederholte Lebensverluste und Schaden, teils unabhängig von Angriffsflächen.
- **Psychosis Crawler**: starkes Draw-Finish mit Struggle, Robe, Arena und möglichen Kopien durch Court of Vantress.
- **Mechanized Production**: acht gleichnamige Artefakte, vor allem über Replicating Ring oder Treasure-Token von The Reaver Cleaver, Smaug und Bonehoard Dracosaur.
- **Court of Cunning / Obeka-Kommanderschaden**: Library-Mill oder unblockbare 21 Kampfschaden über mehrere Angriffe.

## Schutz und Grenzen

Obeka schützen u. a. **Mithril Coat**, **Swiftfoot Boots**, **Brotherhood Regalia**, **Deflecting Swat**, **Fierce Guardianship**, günstige Counter und **Malakir Rebirth**. Lavaspur Boots geben nur **Ward {1}**, kein Hexproof. Gegen viele Kreaturen: Regalia, Prowler's Helm, Aqueous Form, Thassa, Key to the City oder notfalls Rogue's Passage.

Das Deck enthält **37 feste Länder, Malakir Rebirth/Malakir Mire als mögliche 38. Landquelle und 10 Manasteine** (8 mit Mana Value 1–2, zwei mit Mana Value 3); hinzu kommt Ancient Tomb. Die aktuellen **drei Game Changer sind Ancient Tomb, Demonic Tutor und Fierce Guardianship**.

## Reproduzierbare Überprüfung

Im Repository-Verzeichnis ausführen:

    python3 decks/obeka-splitter-of-seconds/tests/verify_deck.py --oracle

Ohne --oracle ist die Prüfung offline reproduzierbar. Mit --oracle werden 100 Kartennamen, aktuelle Scryfall-Commander-Legalität, Grixis-Farbidentität, Game-Changer-Zahl und Kurve live validiert. **Monte-Carlo-Zahlen sind keine simulierten Magic-Partien**; Vereinfachungen und Ergebnisse stehen in [analysis.md](analysis.md).

**Quellen (18.10.2026):** [Wizards Commander](https://magic.wizards.com/en/formats/commander), [Obeka Oracle](https://scryfall.com/card/otj/222/obeka-splitter-of-seconds), [Scryfall API](https://scryfall.com/docs/api).
