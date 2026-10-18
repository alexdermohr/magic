# Analyse — Obeka, Splitter of Seconds (Bracket 3), V4

**Stand:** 18.10.2026. [Aktive Liste](current.txt) / [Spielanleitung](README.md) / [Prüfskript](tests/verify_deck.py). Es gibt vier **tatsächlich geschriebene** Listen in versions/, keine erfundenen Partietests.

## 1. Oracle, Regelmechanik und Bracket

**Obeka — verifizierter Oracle-Text:** „Menace. Whenever Obeka deals combat damage to a player, you get that many additional upkeep steps after this phase.“ Basispower 2; Kampfschaden 3/5/7 bedeutet genau 3/5/7 eigene zusätzliche Upkeeps. Mit Double Strike können zwei Schadensereignisse je einmal separat auslösen. **Nach der Kampfphase**, vor der zweiten Hauptphase; kein Enttappen, keine automatische Landspielberechtigung, kein reguläres Kartenziehen und keine neuen Combat Steps.

- **„At the beginning of your upkeep“:** Alle sechs Courts, Ring of Valkas, Creeping Bloodsucker, Phyrexian Arena, Bonehoard Dracosaur, Plargg and Nassari, Dragonmaster Outcast, Replicating Ring, Chronozoa, Mechanized Production usw. lösen in jedem Obeka-Upkeep erneut aus.
- **„At the beginning of each upkeep“:** Midnight Clock bekommt auch auf gegnerischen Upkeeps Counter, auf allen zusätzlichen eigenen ebenso. Das ist anders als ein rein eigener Upkeep.
- **„At the beginning of each opponent's upkeep“:** Solche Trigger skalieren mit Obeka **nicht**; deshalb Sheoldred, Whispering One als nur bedingt geeignet gestrichen (zusätzlich sieben Mana und Graveyard-Vorbedingung).
- **Zusätzliche Bedingungen:** Twilight Prophet braucht *city's blessing* (≥10 kontrollierte Permanents); Dragonmaster Outcast ≥6 Länder; die sechs Courts belohnen besonders den Monarchenstatus; Mechanized Production braucht ein verzaubertes eigenes Artefakt und acht Artefakte desselben Namens; Chronozoa stirbt zu zwei Kopien nur, wenn zuletzt *ohne* Time-Counter; Replicating Ring braucht acht Night-Counter.
- **Roaming Throne:** Als Kreaturentyp **Warlock** wählen. Obeka ist Ogre **Warlock**. Der Thron verdoppelt deren Kampfschaden-Trigger, also die gewährten Upkeeps. Er verdoppelt **nicht** die Trigger der Verzauberungs-Courts oder andere Kreaturentypen ohne Warlock-Übereinstimmung.

**Offizielle Bracket-3-Vorgaben:** Maximal drei Game Changer, starke Synergien und Interaktion zulässig; keine absichtlich sehr frühen konsistenten Zwei-Karten-Endloskombos. Aktuell live bei Scryfall verifiziert: **Ancient Tomb, Demonic Tutor, Fierce Guardianship** = exakt drei; Commander legal, alle 100 Karten mit ausschließlich U/B/R-Farbidentität, keine gebannten Karten.

Quellen:
- https://magic.wizards.com/en/formats/commander
- https://magic.wizards.com/en/news/announcements/introducing-commander-brackets-beta
- https://scryfall.com/card/otj/222/obeka-splitter-of-seconds
- https://scryfall.com/docs/api

## 2. Systematische Upkeep-Auswahl und konkrete Skalierung

Die Scryfall-Oracle-Suche nach Grixis-legalen Karten mit „at the beginning of your upkeep“ oder „at the beginning of each upkeep“ lieferte am 18.10.2026 **559 Kandidaten**. Ranglisten- und Oracle-Texte wurden geprüft; auch seltene Alternativen (Tombstone Stairwell, Chronozoa, Dauthi Embrace, Mechanized Production, Court of Vantress und Court of Locthwain) waren im Abgleich. Die Suchmenge umfasst auch negative bzw. nur bedingt passende Karten und ist **keine** Behauptung, alle 559 von Hand vollumfänglich gespielt zu haben.

| Permanent | 3 zusätzliche Upkeeps | 5 zusätzliche Upkeeps | Einschränkung |
|---|---|---|---|
| Court of Embereth | Bei Start mit Obeka als einziger Kreatur: 2+3+4 = **9 Schaden an jedem Gegner** | 2+3+4+5+6 = **20 je Gegner** | Monarch muss bei den Triggerauflösungen gehalten werden |
| Court of Ire | **21** gezielter Schaden | **35** gezielter Schaden | Monarch für 7 statt 2 pro Trigger |
| Court of Cunning | **30 Mill-Karten pro gewähltem Spieler** | **50 Karten pro gewähltem Spieler** | Monarch; Spieler können auch ohne Königsmacht für 2 gemillt werden |
| Creeping Bloodsucker | **3 Schaden je Gegner + bis zu 9 Leben** bei 3 Gegnern | **5 je Gegner + bis zu 15 Leben** | tatsächliche Gegnerzahl; keine Kreatur außerhalb seiner Fähigkeit nötig |
| Ring of Valkas | **3 +1/+1-Counter auf Obeka** | **5 Counter** | vorher ausgerüstete rote Obeka |
| Replicating Ring | +3 Night-Counter | +5 Night-Counter | bei acht Countern erzeugt der Ring 8 *Replicated Rings* und setzt zurück |
| Struggle for Project Purity | bis zu **9 eigene Draws**, plus je 3 Draws bei allen Gegnern | bis zu **15 eigene Draws**, plus je 5 bei allen Gegnern | Modus Brotherhood, drei lebende Gegner; extrem riskant, wenn man danach nicht dominiert |
| Chronozoa | 1 Exemplar läuft aus und produziert **2 Kopien** | 2 Kopien je noch 1 Counter vor dem zweiten Auslaufen | muss mit drei Counter starten und natürlich auslaufen, Removal verhindert Ertrag |
| Court of Locthwain | drei gegnerische Karten exiliert, bei Monarch drei freie Spell-Erlaubnisse | fünf Karten/Erlaubnisse | tatsächliches Wirken nach normalen Timing-Regeln; erlaubt wird je ein Spell aus dort exilierten Karten |
| Court of Vantress | bis zu drei Kopien von Artefakten/Verzauberungen | bis zu fünf Kopien | Monarch; andere geeignete Zielpermanents nötig |

**Embereth-Hinweis:** Für N extra Upkeeps und genau eine bereits vorhandene Kreatur startet die Schadensreihe bei 2. Bei mehr eigenen Kreaturen, mehreren Court-Kopien und Bloodletter of Aclazotz steigt der Schaden erheblich stärker. Angriffsbedingter Monarchenverlust ist eine wesentliche Schwachstelle.

**Mechanized Production + Replicating Ring:** Erreicht der Ring acht Night-Counter in deinem Upkeep, erzeugt er acht *Replicated Ring*-Token. Ist auch Mechanized Production bereits auf einem eigenen Artefakt aktiv, kannst du beide eigenen Upkeep-Trigger so auf den Stapel legen, dass **zuerst** der Ring auflöst und **danach** Production seinen Token erzeugt und acht gleichnamige Artefakte prüft. Der Name „Replicated Ring“ unterscheidet sich ausdrücklich von „Replicating Ring“; das ist für den Karten-Check unerheblich, weil *irgendeine* gemeinsame Gruppe von acht Artefakten genügt.

## 3. Jedes Kartenpaket und seine Schwachstellen

**21 Kern-Engine-Karten:**
- **Courts (6):** Embereth (skalierender Tisch-Schaden; Top-Priorität), Ambition (Discard oder bis zu 6 Lebensverlust), Cunning (Mill-Finish und Graveyard-Setup), Ire (gezielte Removal-/Finisher-Schüsse), Locthwain (exilierte gegnerische Karten; freie Spells bei Monarch), Vantress (schwer begrenzbare Kopier-Engine; bevorzugt auf Embereth, Locthwain, Arena, Crawler, Ring).
- **Wert/Druck (8):** Bonehoard Dracosaur (2 Exil-Karten und Token), Plargg and Nassari (kostenlose Zauber während Triggerauflösung), Twilight Prophet (großer Lebensschwung, aber bedingt), Dragonmaster Outcast (ein Mana, ab sechs Ländern 5/5er), Creeping Bloodsucker (früher Drain/Lifegain), Smaug the Magnificent (Treasures und Angriffsburn), Phyrexian Arena (zuverlässiger Upkeep-Draw, kostet Leben), Struggle for Project Purity (maximaler Draw-Output, zugleich gefährliche Opponent-Draws).
- **Skalierer/Finish (7):** Psychosis Crawler (Draw in Tisch-Schaden), Mechanized Production (Artefakt-Alternate-Win), Virtue of Persistence (teure wiederholte gegnerische Reanimation, Adventure früher Removal), Roaming Throne (verdoppelt Obeka-Trigger), Bloodletter of Aclazotz (verdoppelt gegnerischen Lebensverlust im eigenen Zug), Chronozoa (Vanishing-Token-Sequenz), Sheoldred, the Apocalypse (Life-Drain durch gegnerischen Draw, Lifegain durch eigenen).

**10 Beschleuniger:** Sol Ring (Ausnahmeleistung), Arcane Signet, Fellwar Stone, Talismans von Dominance/Indulgence/Creativity, Dimir Signet, Izzet Signet (acht günstige Rocks), Replicating Ring (3 Mana, auch Alternate-Win), Midnight Clock (3 Mana; holt auf dem 12. Counter sieben neue Karten, kann bei voller Hand auch stören). Sword of the Animist wurde gestrichen, weil hier nur drei Basics existieren und der Ramp spät entsteht. Ancient Tomb ist zusätzliche Land-Beschleunigung.

**17 Evasion/Schutz/Kampf-Upgrades:** Brotherhood Regalia (unblockbar + Ward2, Equip Commander1), Aqueous Form (unblockbar + Scry), Thassa, God of the Sea (wiederholbar unblockbar), Key to the City (Discard gegen unblockbar, Card-Advantage im Untap), Prowler's Helm (außer Walls praktisch unblockbar), Swiftfoot Boots (Haste + Hexproof), Lavaspur Boots (+1/+0 + Haste + Ward1), Ring of Valkas (Haste + jedes Upkeep Power-Counter), Blackblade Reforged (Lands in Power), Fireshrieker/Lizard Blades (Double Strike), The Reaver Cleaver (Treasure pro Kampfschaden, löst weitere Siege aus), Robe of the Archmagi (Warlock Equip1 für enormen Draw), Mithril Coat (Flash-Indestructible, schützt Commander), Shadowspear (Trample/Lifelink und Hexproof/Indestructible-Antwort), Deflecting Swat (Target-Rewrite), Fierce Guardianship (schützt gegen Nichtkreaturenzauber, Game Changer). **Keine** dieser Karten ersetzt alle anderen Schutztypen.

**12 Interaktions- und Flexkarten:** Counterspell, Arcane Denial, Swan Song, An Offer You Can't Refuse, Mana Drain (Counter-Matrix); Deadly Rollick (bei Commander frei gegen Kreaturen), Chaos Warp (universell, auch Enchantments), Feed the Swarm (wichtige schwarze Enchantment-Antwort), Toxic Deluge (resettet Boards, kann eigene Obeka treffen), Vandalblast (Artefaktboards), Rakdos Charm (Graveyard/Artefakt/Token-Gegner), Malakir Rebirth (Obeka gegen Removal bzw. getapptes schwarzes MDFC-Land). **2 Tutor:** Demonic Tutor (Game Changer, universell), Diabolic Intent (Kreaturen-Opferkosten; unter Umständen schmerzhaft).

**37 reguläre Länder:** Command Tower/Exotic Orchard/Xander's Lounge, echte und Shock-Grixis-Duals (Underground Sea, Volcanic Island, Badlands; Steam Vents/Watery Grave/Blood Crypt), Battlebond-Duals (Morphic Pool/Training Center/Luxury Suite), 9 Fetchlands + Prismatic Vista, universelle Quellen (Mana Confluence/City of Brass/Reflecting Pool), drei Checklands, Evasion-/Value-Länder (Shizo, Rogue's Passage, Otawara, Takenuma, Arena of Glory), Ancient Tomb, je ein Island/Swamp/Mountain. Hohe Farbkonsistenz, aber die Simulation berücksichtigt nicht die gelegentlich getappten Länder, Life-Payment oder Fetch-Sequenz. **Malakir Mire** ist zusätzlich die Landrückseite eines Spells, kein 38. eigenständiger Slot.

## 4. Vollzogene Versionierung — tatsächliche Änderungen

| Version | Änderungen | Motiv |
|---|---|---|
| V1 | 100 initiale Singleton-Karten; Oracle PASS | Baseline mit viel Payoff, zu viel reaktivem Equipment und sieben Mana schwerer Reanimation |
| V2 | Lightning Greaves → **Lavaspur Boots**; Sword of the Animist → **Ring of Valkas**; Theater of Horrors → **Robe of the Archmagi**; Psychosis Crawler → **Chronozoa** | +Power/Haste, Upkeep-Marken, frühes Damage-Draw, originelle Token-Folge |
| V3 | Sheoldred, Whispering One → **Prowler's Helm** | Entfernt die teure Graveyard-Voraussetzung, verbessert sichere Obeka-Treffer |
| V4 (aktuell) | Stolen Strategy → **Court of Locthwain**; Extravagant Replication → **Court of Vantress**; The Scarab God → **Psychosis Crawler** | Beide Courts günstiger und Monarch-abhängig explosiver; Scarab God braucht 4 Mana/Kreatur für Zombies, Psychosis ist mit mehreren Draw-Engines das bessere Finish |

**Bewusst nicht enthalten:** One Ring (Burden-Schaden pro zusätzlichem Upkeep und zusätzlicher Game Changer), Dark Confidant/Dark Tutelage (multiplikativer Lebensverlust bei hohen Mana Values), Mystic Remora und Tombstone Stairwell (Cumulative Upkeep verschlingt während mehrerer eigener Upkeeps Ressourcen), Descent into Avernus (massiver symmetrischer Schaden und Geschenke an Gegner), Pact of Negation (Zahlung im direkt folgenden zusätzlichen Upkeep), Braid of Fire (Mana leert sich zwischen Upkeep-Schritten), Staff of Nin (6 Mana für 1 Karte/Upkeep), Ophiomancer (nur ein Snake-Token bei keinem Snake), Knuckles the Echidna (30 Artefakte Sieg sehr speziell), Triskaidekaphile (genau 13 Karten unzuverlässig), Stolen Strategy (zauberbare Karten nur bis Turn-Ende, unzuverlässig mit wenig Postcombat-Mana), Sheoldred, Whispering One (nur gegnerische Upkeep-Opfer werden *nicht* dupliziert). Panoptic Mirror und absichtlich schnelle Endloskombos aus Bracket-3-Gründen vermieden.

## 5. Simulation: 100.000 reproduzierbare Starthände pro Version

Lokal ausgeführt, Python-Standardbibliothek, deterministischer Seed **20261018**, je Version 100.000 zufällige Kartenanordnungen; Commander ist außerhalb des 99-Karten-Stapels. Kein Mulligan. Gezählt werden die 7 Opening-Cards plus reguläre Draws bis Zug 4/5. **Das ist Kartenverfügbarkeit, keine Magic-Partie.**

| Messgröße | V1 | V2 | V3 | V4 |
|---|---:|---:|---:|---:|
| Opening-Hand mit 2–4 Landquellen | 75,53 % | 75,53 % | 75,53 % | **75,53 %** |
| Mindestens vier Landquellen bis Zug 4 | 67,82 % | 67,82 % | 67,82 % | **67,82 %** |
| Rechnerisch genug Mana für Commander bis Zug 4¹ | 79,19 % | 79,19 % | 79,19 % | **79,19 %** |
| Frühe Evasion bis Zug 5 im gesehenen Kartenpool | 48,26 % | 48,26 % | 54,88 % | **54,88 %** |
| Hastequelle bis Zug 4 gesehen | 29,70 % | 37,88 % | 37,88 % | **37,88 %** |
| Upkeep-Payoff bis Zug 5 gesehen | 95,15 % | 95,21 % | 94,33 % | **93,33 %** |
| Commander-Mana + Evasion + Payoff bis Zug 5 im Pool¹ | 34,45 % | 34,46 % | 38,58 % | **38,06 %** |

¹ **Optimistische Proxy-Messgröße**: „T4-Mana“ ist entweder vier Landquellen in den ersten elf Karten oder mindestens drei mit zwei Ländern und 1–2-Mana-Rock bis Zug 2. Farben, getappte Landquellen, Rock-Kosten, echte Cast-Sequenz, Equip-Kosten und Gegnerinteraktion **nicht** berücksichtigt. „Im Pool“ belegt **keinen** ausspielbaren T5-Engine-Zustand; 38,06 % ist **keine** tatsächliche T5-Combo- oder Gewinnchance. Die 93,33 % geben lediglich an, ob mindestens ein geeignetes Upkeep-Permanent gezogen wurde, nicht ob es aktiviert/bezahlt wurde. V4 reduziert einzelne bedingte Payoffs zugunsten wesentlich stärkerer Zaubereffekte; reine Trefferquote darf deshalb nicht mit Spielstärke verwechselt werden.

**Reproduzierbarer Befehl:** Aus Repo-Root:
    python3 decks/obeka-splitter-of-seconds/tests/verify_deck.py --oracle

Das Skript prüft V1–V4 auf Singleton/100, Gleichheit von current/V4, Monte Carlo und mit --oracle aktuelle Scryfall-Daten. Letzter Live-Lauf: **ORACLE_PASS 100/100**, 100 legale Grixis-Karten und **drei Game Changer**. Nonland-CMC-Histogramm **{1:8, 2:22, 3:13, 4:14, 5:4, 7:1}**, 62 Nicht-Länder inkl. Commander, 37 feste Länder und ein MDFC.

## 6. Stärkste Gegenargumente, Restunsicherheit, Bewertung

1. **Monarch-Abhängigkeit**: Trotz sechs Courts können aggressive Gegner Monarch über Angriffe übernehmen. Dann sind Locthwain, Vantress und Embereth deutlich schwächer. Gegenmaßnahme: Regalia/Helm ermöglichen Rückeroberung; alle sechs Courts machen bereits beim Eintritt Monarch. Nicht vollständig eliminiert.
2. **Obeka als Single Point of Acceleration**: Sie kostet vier Mana und wird aktiv bekämpft. Ohne sie sind sechs Courts plus Arena/Plargg weiter spielbar, aber der Geschwindigkeitssprung fehlt. 8 günstige Rocks und mehrere Schutzklassen verringern, nicht beseitigen das Risiko.
3. **Mana ohne zusätzliches Enttappen**: Fünf extra Upkeeps liefern kein Mana aus schon getappten Länder/Rocks. Plargg und Locthwain lösen das mit kostenlos wirkbaren Spells teilweise; ansonsten sind Treasure-Engines wichtig. Mit 37 + MDFC Landquellen und zehn Rocks ist der normale Aufbau konsistent, aber keine perfekte Manakurve garantiert.
4. **Symmetrischer Kartenvorteil**: Struggle for Project Purity schenkt drei Gegnern pro Upkeep jeweils Karten. Nur legen, wenn der eigene Tempo-/Lebensverlustvorteil die geschenkten Antworten aufwiegt; Psychosis/Sheoldred können diese Draws bestrafen.
5. **Keine realen Spielpartien verifiziert**: Oracle-/Decklisten-Prüfung und vereinfachte Monte Carlo sind reproduzierbar. Die behauptete relative Spielstärke bleibt qualitative Deckbau-Einschätzung. Ein 4-Spieler-Matchup-/Pilotentest steht offen.

**Einschätzung:** Hohe, für Bracket 3 passende Synergiedichte und mehrere nachprüfbare Siege ohne deterministische T3-Endlosschleife. Weniger robust als ein dediziertes Control-Deck gegen wiederholtes Commander-Removal, dafür sehr explosiv ab erfolgreichem Obeka-Kampfschaden. Die leistungsstärksten Permanents sind **Court of Embereth, Court of Vantress, Court of Locthwain, Plargg and Nassari, Ring of Valkas** und **Mechanized Production**.
