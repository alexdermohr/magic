# Obeka, Splitter of Seconds — Zeit als Ressource (Commander Bracket 3)

**Aktuell:** V5 vom 18.10.2026, 100 Singleton-Karten einschließlich Commander, Grixis, ohne Budgetbegrenzung.

- [Aktuelle, importierbare 100-Karten-Liste](current.txt)
- [Analysen, genaue Oracle-Interaktionen und V4→V5-Vergleich](analysis.md)
- [Tatsächlich erstellte Versionen V1–V5](versions/)
- [Reproduzierbares Prüfskript](tests/verify_deck.py)

## Spielplan

**Obeka ist eine 2/5-Kreatur mit Menace und kostet {1}{U}{B}{R}.** Für jeden Schadenspunkt, den sie einem Spieler im Kampf zufügt, erhältst du einen zusätzlichen Upkeep nach dieser Kampfphase. Ihre Fähigkeit erzeugt keine zusätzlichen Zieh-, Enttapp- oder Hauptphasen.

Die V5 priorisiert **frühe Evasion, Obeka-Schutz, skalierende Upkeep-Permanents und nutzbare Postcombat-Ressourcen**. Unbedingt vermeiden, nur teure Payoffs zu ziehen, bevor Obeka durch die gegnerischen Boards angreifen kann.

### Mulligan und typische Züge

1. **Starthand:** Bevorzugt 2–4 Landquellen, einen Manastein für zwei oder weniger Mana und möglichst Brotherhood Regalia, Aqueous Form, Trailblazer's Boots, Prowler's Helm, Thassa, God of the Sea oder Key to the City. Kein Keep, das nur 4-/5-Mana-Engines enthält.
2. **Züge 1–3:** Farben sichern, günstige Rocks spielen, Evasion und Schutz bereitstellen. Bitterblossom kann frühe Flieger zum Schutz des Monarchen erzeugen. Super Intelligence kann an eine früh gespielte eigene Kreatur angelegt werden.
3. **Ab Zug 4:** Obeka spielen, nach Möglichkeit mithilfe von Ring of Valkas, Lavaspur Boots, Swiftfoot Boots oder Arena of Glory sofort kampfbereit machen. Regalia macht sie unblockbar und erschwert gezieltes Removal.
4. **Beim Kampfschaden:** Basisschaden 2 bringt zwei Upkeeps. +2/+2 von Sword of Feast and Famine macht daraus vier. Blackblade Reforged, Lavaspur Boots und die beiden Ringe vergrößern die Upkeep-Zahl weiter. Bei einem Double-Strike-Treffer von Lizard Blades löst Obeka für beide Kampfschadensereignisse separat aus.
5. **Nach dem Kampf:** Die zusätzlichen Upkeeps nacheinander abwickeln. Sword of Feast and Famine hat nach Kampfschaden bereits alle eigenen Länder enttappt. Rousing Refrain erzeugt rotes Mana, das **bis zum Ende des Zuges** bestehen bleibt. Danach in der normalen zweiten Hauptphase gewonnene Karten und erlaubte Zauber spielen.

### Die entscheidenden Synergien

**Sechs Courts:** Court of Embereth erzeugt jede Upkeep einen Knight und fügt bei Monarchenstatus jedem Gegner Schaden entsprechend der Zahl deiner Kreaturen zu. Court of Vantress kann als Monarch jedes Upkeep ein anderes eigenes Artefakt oder eine Verzauberung kopieren, z. B. Embereth, Locthwain, Phyrexian Arena oder Psychosis Crawler (Artefaktkreatur). Court of Locthwain liefert gegnerische Zauber, die bei Monarchenstatus kostenlos gewirkt werden können. Court of Ire verursacht als Monarch sieben Schaden an einem Ziel, Court of Ambition drückt Lebenspunkte oder Hände und Court of Cunning ist eine alternative Mill-Siegbedingung. Alle Courts machen dich beim Eintritt zum Monarchen.

**Bitterblossom + Court of Embereth:** Bei anfangs nur Obeka als Kreatur, beiden Permanents im Spiel und erhaltenem Monarchenstatus können **drei** zusätzliche Upkeeps bei passender Triggerreihenfolge **15** Schaden an **jedem** Gegner erzeugen (3+5+7). **Fünf** zusätzliche Upkeeps ergeben **35** pro Gegner (3+5+7+9+11). Achtung: Bitterblossom kostet zugleich ein Leben pro Upkeep.

**Ring of Valkas + Ring of Evos Isle:** Obeka ist sowohl rot als auch blau. Beide Ringe legen in jedem eigenen Upkeep eine +1/+1-Marke auf Obeka; Valkas gibt Eile und Evos Isle erlaubt für {2} Hexproof. Je fünf zusätzliche Upkeeps sind **bis zu zehn neue +1/+1-Marken**, wenn beide Ringe angelegt bleiben. Die größere Obeka kann im nächsten Angriff noch mehr zusätzliche Upkeeps erzeugen.

**Rousing Refrain:** Für {1}{R} aussetzen; nach drei beginnenden Upkeeps den Zauber gratis wirken und rotes Mana entsprechend der Hand eines Gegners erzeugen, das bis zum Ende des Zuges nicht verloren geht. Nach dem Wirken wird Rousing Refrain wieder mit drei Zeitmarken ausgesetzt und kann bei genügend Upkeeps im selben Zug erneut auslösen. Dies ersetzt das riskante symmetrische Kartenziehen durch verlässlicher nutzbare Postcombat-Ressourcen.

**Profane Tutor:** Für {1}{B} aussetzen. Mit zwei zusätzlichen Upkeeps lässt sich anschließend eine beliebige Karte suchen, ohne eine Kreatur wie bei Diabolic Intent opfern zu müssen. Das ersetzt keinen sofortigen Demonic Tutor; die Karte ist jedoch exakt auf Obeka abgestimmt.

**Card-Draw und Treasure:** Super Intelligence ({U}) zieht im Upkeep des Beherrschers der verzauberten Kreatur eine Karte, wenn sie an einer eigenen Kreatur liegt. Phyrexian Arena zieht ebenfalls bei jedem eigenen Upkeep (für ein Leben). Robe of the Archmagi lässt sich an den Warlock Obeka für {1} anlegen und zieht beim Kampfschaden entsprechend viele Karten; Psychosis Crawler fügt dann allen Gegnern für jeden eigenen Draw ein Leben Verlust zu. Plargg and Nassari liefern wiederholt kostenlos gewirkte Zauber. The Reaver Cleaver und Bonehoard Dracosaur sichern Treasure.

**Artefakt-Finish:** Replicating Ring legt in jedem eigenen Upkeep einen Night-Counter auf sich und erzeugt nach acht Countern acht *Replicated Ring*-Artefakte. Mechanized Production gewinnt bei mindestens acht gleichnamigen Artefakten, wenn der Trigger nach der Ring-Erzeugung auflöst. Die Triggerreihenfolge ist entscheidend.

### Siegbedingungen

- Court of Embereth, Court of Ambition, Court of Ire und Bloodletter of Aclazotz: direkter und skalierender Tisch-Schaden/Lebensverlust.
- Psychosis Crawler + Super Intelligence/Phyrexian Arena/Robe: wiederholtes Kartenziehen wird zum Tisch-Finish.
- Mechanized Production + Replicating Ring beziehungsweise gleichnamige Treasure-Token: alternativer Spielsieg.
- Court of Cunning: starker Mill-Angriff gegen mehrere Bibliotheken gleichzeitig.
- Obeka-Kommanderschaden: Power-Uprades, Evasion und Sword of Feast and Famine ermöglichen wiederholte Treffer bis 21 Schaden bei demselben Gegner.

### Schutz, Fallen und Bracket

**Schutz:** Brotherhood Regalia (Ward {2}), Swiftfoot Boots, Mithril Coat, Ring of Evos Isle ({2}: Hexproof), Deflecting Swat, Fierce Guardianship, günstige Counter und Malakir Rebirth. **Achtung:** Sword of Feast and Famine gewährt Obeka Schutz vor Schwarz und Grün — damit darf die **schwarze** Malakir Rebirth die ausgerüstete Obeka nicht als Ziel wählen. Schutz vor einem Zauber ist nicht dasselbe wie Unzerstörbarkeit.

**Monarch und Auren:** Die Courts sind ohne gehaltenen Monarchen teils erheblich schwächer. Super Intelligence fällt beim Tod der verzauberten Kreatur ab. Court of Vantress sollte keine Aura-Kopie erzeugen, die ohne angelegtes Ziel auf das Spielfeld käme.

**Mana:** 37 feste Länder und Malakir Rebirth/Malakir Mire als optionale 38. Landquelle, zehn Manasteine (davon neun mit Mana Value ≤2), Ancient Tomb. Die drei ungetappten Painlands ersetzen die bisherigen Checklands und kosten beim Erzeugen farbigen Manas jeweils ein Leben.

**Bracket 3:** Genau drei Game Changer: **Ancient Tomb, Demonic Tutor, Fierce Guardianship**. Keine gezielt eingebaute frühe Zwei-Karten-Endloskombo. [Aktuelle Commander-Regeln von Wizards](https://magic.wizards.com/en/formats/commander).

## Reproduzierbare Tests

Aus dem Repository-Root:

    python3 decks/obeka-splitter-of-seconds/tests/verify_deck.py --oracle

Das Skript vergleicht die fünf tatsächlichen Versionen, prüft 100 Karten/Singleton und die aktuelle Scryfall-Commander-Legalität samt Farbidentität, Game-Changer-Zahl und Manakurve. Die 100.000 deterministischen Stichproben pro Version modellieren nur *Kartenverfügbarkeit*, **keine** echten Magic-Partien oder Mana-/Equipment-Timing. Zahlen und Einschränkungen: [analysis.md](analysis.md).
