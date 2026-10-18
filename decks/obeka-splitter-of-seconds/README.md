# Obeka, Splitter of Seconds — Zeit als Ressource (Commander Bracket 3)

**Aktuell:** V7 vom 18.10.2026, 100 Singleton-Karten einschließlich Commander, Grixis, ohne Budgetbegrenzung.

- [Aktuelle, importierbare 100-Karten-Liste](current.txt)
- [Analysen, genaue Oracle-Interaktionen und V6→V7-Vergleich](analysis.md)
- [Tatsächlich erstellte Versionen V1–V7](versions/)
- [Reproduzierbares Prüfskript](tests/verify_deck.py)

## Spielplan

**Obeka ist eine 2/5-Kreatur mit Menace und kostet {1}{U}{B}{R}.** Für jeden Schadenspunkt, den sie einem Spieler im Kampf zufügt, erhältst du einen zusätzlichen Upkeep nach dieser Kampfphase. Ihre Fähigkeit erzeugt keine zusätzlichen Zieh-, Enttapp- oder Hauptphasen.

Die V7 priorisiert **frühe Evasion, Obeka-Schutz, skalierende Upkeep-Permanents und nutzbare Postcombat-Ressourcen**. Unbedingt vermeiden, nur teure Payoffs zu ziehen, bevor Obeka durch die gegnerischen Boards angreifen kann.

### Mulligan und typische Züge

1. **Starthand:** Bevorzugt 2–4 Landquellen, einen Manastein für zwei oder weniger Mana und möglichst Brotherhood Regalia, Aqueous Form, Trailblazer's Boots, Aether Tunnel, Thassa, God of the Sea oder Key to the City. Kein Keep, das nur 4-/5-Mana-Engines enthält.
2. **Züge 1–3:** Farben sichern, günstige Rocks spielen, Evasion und Schutz bereitstellen. Bitterblossom kann frühe Flieger zum Schutz des Monarchen erzeugen. Super Intelligence kann an eine früh gespielte eigene Kreatur angelegt werden.
3. **Ab Zug 4:** Obeka spielen, nach Möglichkeit mithilfe von Ring of Valkas, Lavaspur Boots, Swiftfoot Boots oder Arena of Glory sofort kampfbereit machen. Regalia macht sie unblockbar und erschwert gezieltes Removal.
4. **Beim Kampfschaden:** Basisschaden 2 bringt zwei Upkeeps. +2/+2 von Sword of Feast and Famine macht daraus vier. Blackblade Reforged, Lavaspur Boots und die beiden Ringe vergrößern die Upkeep-Zahl weiter. Bei einem Double-Strike-Treffer von Lizard Blades löst Obeka für beide Kampfschadensereignisse separat aus.
5. **Nach dem Kampf:** Die zusätzlichen Upkeeps nacheinander abwickeln. Sword of Feast and Famine hat nach Kampfschaden bereits alle eigenen Länder enttappt. Rousing Refrain erzeugt rotes Mana, das **bis zum Ende des Zuges** bestehen bleibt. Danach in der normalen zweiten Hauptphase gewonnene Karten und erlaubte Zauber spielen.

### Die entscheidenden Synergien

**Sechs Courts:** Court of Embereth erzeugt jede Upkeep einen Knight und fügt bei Monarchenstatus jedem Gegner Schaden entsprechend der Zahl deiner Kreaturen zu. Court of Vantress kann als Monarch jedes Upkeep ein anderes eigenes Artefakt oder eine Verzauberung kopieren, z. B. Embereth, Locthwain, Phyrexian Arena oder Psychosis Crawler (Artefaktkreatur). Court of Locthwain liefert gegnerische Zauber, die bei Monarchenstatus kostenlos gewirkt werden können. Court of Ire verursacht als Monarch sieben Schaden an einem Ziel, Court of Ambition drückt Lebenspunkte oder Hände und Court of Cunning ist eine alternative Mill-Siegbedingung. Alle Courts machen dich beim Eintritt zum Monarchen.

**Mirkwood Bats + Generous Plunderer:** Plunderer erzeugt nach Wahl **in jedem eigenen Upkeep einen ungetappten Treasure**, den wir sofort opfern oder in der zweiten Hauptphase verwenden können. Ein ausgewählter Gegner erhält zugleich einen **getappten** Treasure; diese Gegenleistung ist gefährlich, liefert ihm aber nicht sofort nutzbares Mana. Mirkwood Bats lässt jeden Gegner **für jeden eigenen erzeugten oder geopferten Token** 1 Leben verlieren; die vom Gegner erzeugten Tokens zählen dabei nicht. Die Engine skaliert auch mit Knights von Court of Embereth, Faeries von Bitterblossom, Reaver-Cleaver-Treasures, kopierten Artefakten von Court of Vantress / Mechanized Production und den acht Replicated Rings. Bloodletter of Aclazotz verdoppelt den dadurch verursachten Lebensverlust im eigenen Zug.

**Konkrete Fünf-Upkeep-Rechnung:** Liegen außer Obeka nur **Generous Plunderer** und **Mirkwood Bats** als Kreaturen sowie **Court of Embereth** und die Monarchie, erzeugt jeder zusätzliche Upkeep einen Knight und einen eigenen Treasure. Die Court-Schadenswerte sind 4+5+6+7+8 = **30 pro Gegner**; Bats verursachen für die insgesamt zehn erzeugten Tokens **weitere 10 Lebensverlust pro Gegner**. Das sind 40 pro Gegner, bevor Obekas eigener Kampfschaden eingerechnet wird. Ohne ausreichende Monarchie, Treasures oder alle vier Karten gilt diese Rechnung nicht.

**Bitterblossom + Court of Embereth:** Bei anfangs nur Obeka als Kreatur, beiden Permanents im Spiel und erhaltenem Monarchenstatus können **drei** zusätzliche Upkeeps bei passender Triggerreihenfolge **15** Schaden an **jedem** Gegner erzeugen (3+5+7). **Fünf** zusätzliche Upkeeps ergeben **35** pro Gegner (3+5+7+9+11). Achtung: Bitterblossom kostet zugleich ein Leben pro Upkeep.

**Ring of Valkas + Ring of Evos Isle:** Obeka ist sowohl rot als auch blau. Beide Ringe legen in jedem eigenen Upkeep eine +1/+1-Marke auf Obeka; Valkas gibt Eile und Evos Isle erlaubt für {2} Hexproof. Je fünf zusätzliche Upkeeps sind **bis zu zehn neue +1/+1-Marken**, wenn beide Ringe angelegt bleiben. Die größere Obeka kann im nächsten Angriff noch mehr zusätzliche Upkeeps erzeugen.

**Rousing Refrain:** Für {1}{R} aussetzen; nach drei beginnenden Upkeeps den Zauber gratis wirken und rotes Mana entsprechend der Hand eines Gegners erzeugen, das bis zum Ende des Zuges nicht verloren geht. Nach dem Wirken wird Rousing Refrain wieder mit drei Zeitmarken ausgesetzt und kann bei genügend Upkeeps im selben Zug erneut auslösen. Dies ersetzt das riskante symmetrische Kartenziehen durch verlässlicher nutzbare Postcombat-Ressourcen.

**Profane Tutor:** Für {1}{B} aussetzen. Mit zwei zusätzlichen Upkeeps lässt sich anschließend eine beliebige Karte suchen, ohne eine Kreatur wie bei Diabolic Intent opfern zu müssen. Das ersetzt keinen sofortigen Demonic Tutor; die Karte ist jedoch exakt auf Obeka abgestimmt.

**Card-Draw und Treasure:** Super Intelligence ({U}) zieht im Upkeep des Beherrschers der verzauberten Kreatur eine Karte, wenn sie an einer eigenen Kreatur liegt. Phyrexian Arena zieht ebenfalls bei jedem eigenen Upkeep (für ein Leben). Robe of the Archmagi lässt sich an den Warlock Obeka für {1} anlegen und zieht beim Kampfschaden entsprechend viele Karten; Psychosis Crawler fügt dann allen Gegnern für jeden eigenen Draw ein Leben Verlust zu. Plargg and Nassari liefern wiederholt kostenlos gewirkte Zauber. The Reaver Cleaver und Generous Plunderer erzeugen Treasure, während Replicating Ring später acht weitere Manasteine liefert; mit Mirkwood Bats wird sowohl das Erzeugen als auch das Opfern eigener Treasure-Token zu direktem Schaden.

**Artefakt-Finish:** Replicating Ring legt in jedem eigenen Upkeep einen Night-Counter auf sich und erzeugt nach acht Countern acht *Replicated Ring*-Artefakte. Mechanized Production gewinnt, wenn beim Verrechnen des eigenen Upkeep-Triggers **irgendeine** Gruppe von acht gleichnamigen Artefakten kontrolliert wird — der Name muss nicht dem Namen des verzauberten Artefakts entsprechen. Löst der Ring-Trigger zuerst auf, genügen bereits acht *Replicated Rings*. Dies ist ausdrücklich durch die [offiziellen Mechanized-Production-Regelerläuterungen von 2026](https://magic.wizards.com/en/news/feature/marvel-super-heroes-release-notes) bestätigt. Ebenso kann das Deck acht gleichnamige Treasures zusammenbekommen.

**Initiative als versteckte Upkeep-Engine:** Ravenloft Adventurer bringt beim Eintritt die Initiative. Solange du sie behältst, schreitest du zu Beginn **jedes** zusätzlichen Obeka-Upkeeps in der Unterstadt voran. Einmal Initiative übernehmen und anschließend vier weitere Upkeeps reichen für den vollständigen Dungeon; dessen letzter Raum kann eine Kreatur aus den obersten zehn Bibliothekskarten kostenlos ins Spiel bringen, sofern dort eine liegt. Der Adventurer exiliert gegnerische sterbende Kreaturen; der frühere Konflikt mit Virtue of Persistence entfällt in V7, da stattdessen Mirkwood Bats enthalten ist. Token-Belohnungen aus der Unterstadt lösen Mirkwood Bats aus. [Offizielle Initiative-Regeln](https://magic.wizards.com/en/news/feature/commander-legends-battle-baldurs-gate-release-notes-2022-06-01).

**Schnellerer Kampftreffer:** Aether Tunnel kostet nur {1}{U}, verleiht Obeka +1/+0 und macht sie ohne weitere Aktivierung unblockbar; als Aura geht es mit Obeka verloren. The Black Gate produziert {B} und macht die eigene Kreatur für {1}{B} gegen **einen Spieler mit den aktuell meisten Lebenspunkten** unblockbar; es kann beim Eintritt drei Leben kosten, um ungetappt ins Spiel zu kommen. Plaza of Heroes unterstützt die drei Commander-Farben beim Ausspielen und bietet notfalls für {3}, Tappen und Exilieren Hexproof plus Unzerstörbarkeit für die legendäre Obeka.

### Siegbedingungen

- Court of Embereth, Court of Ambition, Court of Ire und Bloodletter of Aclazotz: direkter und skalierender Tisch-Schaden/Lebensverlust.
- Psychosis Crawler + Super Intelligence/Phyrexian Arena/Robe: wiederholtes Kartenziehen wird zum Tisch-Finish.
- Mechanized Production + Replicating Ring beziehungsweise gleichnamige Treasure-Token: alternativer Spielsieg.
- Court of Cunning: starker Mill-Angriff gegen mehrere Bibliotheken gleichzeitig.
- Obeka-Kommanderschaden: Power-Uprades, Evasion und Sword of Feast and Famine ermöglichen wiederholte Treffer bis 21 Schaden bei demselben Gegner.

### Schutz, Fallen und Bracket

**Schutz:** Brotherhood Regalia (Ward {2}), Swiftfoot Boots, Mithril Coat, Plaza of Heroes, Ring of Evos Isle ({2}: Hexproof), Deflecting Swat, Fierce Guardianship, günstige Counter und Malakir Rebirth. **Achtung:** Sword of Feast and Famine gewährt Obeka Schutz vor Schwarz und Grün — damit darf die **schwarze** Malakir Rebirth die ausgerüstete Obeka nicht als Ziel wählen. Schutz vor einem Zauber ist nicht dasselbe wie Unzerstörbarkeit.

**Monarch und Auren:** Die Courts sind ohne gehaltenen Monarchen teils erheblich schwächer. Super Intelligence fällt beim Tod der verzauberten Kreatur ab. Court of Vantress sollte keine Aura-Kopie erzeugen, die ohne angelegtes Ziel auf das Spielfeld käme.

**Mana:** 37 feste Länder und Malakir Rebirth/Malakir Mire als optionale 38. Landquelle, zehn Manasteine (davon neun mit Mana Value ≤2), Ancient Tomb. Die drei ungetappten Painlands ersetzen die früheren Checklands und kosten beim Erzeugen farbigen Manas jeweils ein Leben. V6 tauscht Reflecting Pool gegen Plaza of Heroes und Rogue's Passage gegen The Black Gate; das reduziert die universelle Farbfreiheit von Reflecting Pool, erhöht aber Commander-Schutz und die Effizienz des Evasion-Lands.

**Bracket 3:** Genau drei Game Changer: **Ancient Tomb, Demonic Tutor, Fierce Guardianship**. Keine gezielt eingebaute frühe Zwei-Karten-Endloskombo. [Aktuelle Commander-Regeln von Wizards](https://magic.wizards.com/en/formats/commander).

## Reproduzierbare Tests

Aus dem Repository-Root:

    python3 decks/obeka-splitter-of-seconds/tests/verify_deck.py --oracle

Das Skript vergleicht die sieben tatsächlichen Versionen, prüft 100 Karten/Singleton und die aktuelle Scryfall-Commander-Legalität samt Farbidentität, Game-Changer-Zahl und Manakurve. Insbesondere wird die Vorderseite von Malakir Rebirth korrekt als nichtlandiger Spruch mit Mana Value 1 erfasst und die Replicated-Ring-Namensinteraktion gegen den Oracle-Text geprüft. Die 100.000 deterministischen Stichproben pro Version modellieren nur *Kartenverfügbarkeit*, **keine** echten Magic-Partien oder Mana-/Equipment-Timing. Zahlen und Einschränkungen: [analysis.md](analysis.md).
