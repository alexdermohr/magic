# Gev, Scaled Scorch — Echsen-Schwarm (Bracket 3 / v2)

**Stand:** 17.10.2026 · **Farben:** Rakdos (Schwarz/Rot) · **Commander:** Gev, Scaled Scorch · **Budget:** offen · **Datei:** [current.txt](current.txt).

## Deckziel

Ein starkes, konsequent thematisches Echsen-Commander-Deck innerhalb **Bracket 3**. Frühe Lizard-Kreaturen erzeugen mit Gev Schaden und wachsen durch +1/+1-Marken; wiederholte Quellen lassen **alle Gegner im selben Zug** Leben verlieren. Redundante Kartenvorteils- und Schadensmotoren sollen auch ohne Gev weiter funktionieren. Keine bewusst gebaute frühe Zwei-Karten-Endlosschleife, keine Extra-Turn-Kette, keine Massenlandzerstörung.

**Gev-Regel:** Für jeden gewirkten Lizard-Zauber verursacht Gev einem Zielgegner 1 Schaden. *Andere* eigene Kreaturen kommen mit einer zusätzlichen +1/+1-Marke **pro Gegner, der im laufenden Zug Leben verloren hat**, ins Spiel. In einer Viererpartie sind das maximal drei zusätzliche Marken pro Kreatur. Die Schadensfähigkeit wird beim Wirken ausgelöst und in der Regel vor dem beschworenen Lizard verrechnet; daher zählt dieser Gegner für dessen ETB-Marken. Gev selbst erhält durch seine statische Fähigkeit keine zusätzliche Marke.

## Optimierung v1 → v2: zehn gezielte Tausche

| Heraus | Hinein | Begründung und Preis |
| --- | --- | --- |
| Frilled Sparkshooter | **Viashino Heretic** | Aus bloßen Kampfwerten wird eine echte Echse mit wiederholbarer Artefaktzerstörung und Schaden. Heretic braucht ein Zugfenster zum Tappen. |
| Reptilian Recruiter | **Ob Nixilis, Captive Kingpin** | Weg von teurem, einmaligem Kreaturendiebstahl hin zu Kartenimpulsen bei exakt einem verlorenen Lebenspunkt. Ob ist selbst keine Echse und profitiert nicht von Lizard-Tribal-Boni. |
| Scorch Spitter | **Spear Spewer** | Schon vor dem Ausspielen weiterer Kreaturen zuverlässig alle Gegner je 1 Schaden zufügen, statt beim Angriff nur einen Gegner. Spear ist keine Echse und benötigt für seine Tapfähigkeit ein Zugfenster. |
| Hissing Iguanar | **Molten Gatekeeper** | Bei neuen eigenen Kreaturen jedes Mal Schaden an **alle** Gegner, statt auf sterbende Kreaturen angewiesene Einzelschadensauslöser. Gatekeeper ist kein Lizard und löst Gevs Cast-Fähigkeit nicht aus. |
| Party Thrasher | **Professional Face-Breaker** | Treasures und aus Treasures bezahlbarer Impulskartenvorteil bei durchkommendem Kampfschaden. Benötigt erfolgreiche Angriffe, ist kein Lizard und verliert die einmalige Mainphase-Filterung von Party Thrasher. |
| Wheel of Misfortune | **Diabolic Intent** | Fehlende Schlüsselkarte gezielt suchen, wenn eine eigene Kreatur geopfert werden kann. Verliert den größeren einmaligen Karten-Refill und erzeugt Kartennachteil ohne Opferwert. |
| Plumb the Forbidden | **Scales of Shale** | Thematischer und dank Affinity for Lizards oft günstiger Schutz einer Schlüsselkreatur durch Unzerstörbarkeit; zusätzlich Lifelink. Schwächt das Ziehen nach Massremoval und schützt nur ein Ziel. |
| Feed the Swarm | **Rakdos Charm** | Friedhofshass, Artefaktzerstörung oder gegen große gegnerische Kreaturenmengen tödlicher Schaden auf Instant-Speed. Entfernt **keine Verzauberung**; dafür bleiben Withering Torment und Chaos Warp. |
| Shizo, Death's Storehouse | **Mount Doom** | Wiederholbarer Schaden an allen Gegnern im Land-Slot und Farbfixing, ermöglicht häufig drei Gev-Marken. Lebenspunkte und Aktivierungskosten sind ein realer Preis. |
| Den of the Bugbear | **Three Tree City** | Hohe Manaausbeute bei breitem Echsenfeld und günstige Stammesunterstützung. Zunächst farbloses Land; verschlechtert Farbstabilität in sehr frühen Zügen. |

**Vier Themen der Version:** Mehr Quellen, die vor dem Nachspielen einer Echse alle Gegner treffen; weniger langsame Einzelkarten; zusätzliche Tutoren und Impuls-Kartenvorteil; an Echsen angepasste Mana- und Schutzunterstützung.

## Die stärksten Interaktionen

- **Bontu's Monument:** Jeder eigene Kreaturenzauber löst aus, dass jeder Gegner 1 Leben verliert. Da der Auslöser vor dem Kreaturenzauber verrechnet wird, bekommt die danach kommende eigene Kreatur durch Gev typischerweise drei Marken. Das Monument reduziert außerdem die generischen Kosten schwarzer Kreaturen und verschafft Leben.
- **Spear Spewer / Mount Doom / Molten Gatekeeper / Ingris Stingerquill / Impact Tremors:** Treffen mehrere oder alle Gegner. Ein einziger solcher Vorgang genügt, damit Gev in einer Viererpartie bis zu drei Marken auf *jede weitere* eintreffende eigene Kreatur legt. **Wichtig bei Ingris:** Für **jede angreifende eigene Kreatur** entsteht ein Angriffsauslöser, durch den **die jeweils angreifende Kreatur selbst** 1 Nichtkampfschaden an jeden Gegner verursacht — **nicht Ingris**. Greift eine eigene **Echse** an, erhöht Valley Flamecaller daher deren Schaden von 1 auf 2. Ist die angreifende Kreatur **rot**, kann Ojer Axonil den Schaden auf seine Stärke anheben; bei mehreren anwendbaren Ersatzeffekten wählt der betroffene Gegner die Reihenfolge. Eine **nichtrote Nicht-Echse** profitiert nicht automatisch von Valley Flamecaller oder Ojer Axonil. Diese Veränderungen können die Ob-Nixilis-Auslösung für exakt 1 Lebensverlust verhindern.
- **Ob Nixilis, Captive Kingpin:** Beim Verlust von **exakt 1 Leben** durch ein einzelnes Ereignis bei einem oder mehreren Gegnern triggert Ob nur **einmal** für dieses Ereignis — nicht einmal pro Gegner. Gevs einzelne Pings können eigenständige Ereignisse bilden. Achtung: Schadensverstärker wie Ojer Axonil oder Solphim können aus 1 Schaden mehr als 1 machen, was Ob **nicht** triggert. Lebensverlust durch Bontu's Monument wird von Schadenserhöhungen nicht beeinflusst.
- **Roaming Throne** wählt beim Eintritt „Lizard“ und verdoppelt ausgelöste Fähigkeiten eigener Echsen, darunter Gevs **Cast-Schadenstrigger**. Nicht verdoppelt wird Gevs **statische** Ersatzeffekt-/ETB-Markenregel.
- **Valley Flamecaller / Ojer Axonil, Deepest Might / Solphim, Mayhem Dominus** verstärken Schadensauslöser und bilden Siegpfade ohne eigene Komboschleife. Die genaue Menge und der betroffene Gegnertyp hängen von der jeweiligen Schadensquelle und den Ersatzeffekten ab.
- **Shared Animosity / Cover of Darkness** geben einer breiten Lizard-Armee eine direkte Kampfschaden-Perspektive; **Molten Echoes / Purphoros, God of the Forge / Impact Tremors** bestrafen Gegner auch ohne erfolgreiche Angriffe.
- **Viashino Heretic / Rakdos Charm / Withering Torment / Chaos Warp / Deadly Rollick / Vandalblast** sorgen für unterschiedliche Antworttypen. Massremoval mit **Blasphemous Act** ist möglich, **Patriarch's Bidding** bringt später eigene Echsen zurück, kann aber auch gegnerische Tribes stärken.

## Game Changer und bewusste Bracket-Grenzen

**Drei Game Changer:** Demonic Tutor, Jeska's Will und Necropotence. Es sind die einzigen für diese Liste vorgesehenen Game Changer; die 2026er Erweiterung der offiziellen Game-Changer-Liste (u. a. Farewell und Biorhythm) betrifft diese Liste nicht.

**Nicht aufnehmen:** Murderous Redcap bildet mit Gev eine frühe deterministische Endlosschleife, sobald der Redcap durch Gevs Marken ein +1/+1-Counter-Persist-Gegenstück erhält und mit seinem ETB-Schaden sich selbst töten kann. Dabei werden +1/+1- und -1/-1-Marken nach den zustandsbasierten Aktionen aufgehoben, sodass Persist erneut wirken kann. Auch Ob Nixilis + All Will Be One wäre als frühe Zweikarten-Endlosschleife kein Ziel für dieses Bracket.

## Pilotieren und Schwächen

1. **Mulligan:** 2–3 farblich passende Länder, mindestens ein frühes Spielstück (Echse, Sol Ring, Arcane Signet, Talisman, Fellwar Stone). Ein nur farbloses Startland ist riskant.
2. **Frühspiel:** Gev für {B}{R} wirken und sichere, günstige Echsen nachlegen. Wo möglich erst alle drei Gegner Leben verlieren lassen: Spear Spewer, Bontu's Monument, später Mount Doom/Molten Gatekeeper. Nicht unnötig über einen gegnerischen Boardwipe hinaus auslegen.
3. **Mittelspiel:** Kartenvorteil über Fireglass Mentor, Necropotence, Black Market Connections, Ob Nixilis und Face-Breaker; Mana über Urza's Incubator, Herald's Horn, Artefakte und im breiten Board Three Tree City.
4. **Endspiel:** Marken-/Evasion-Kampf über Shared Animosity und Cover of Darkness, oder schadenbasierte Finisher über Valley Flamecaller, Purphoros, Impact Tremors und die wiederholten Pings.
5. **Gegenmaßnahmen:** Exil/Spotremoval auf Gev verlangsamen den +1/+1-Plan. Brettabräumer besiegen die Kreaturenschwemme; Patriarch's Bidding stellt wieder her, Scales of Shale schützt nur einen einzelnen wichtigen Körper. Three Tree City ist ohne Kreaturen nur farbloses Mana. Die Lebenspunktekosten von Necropotence, Mount Doom und Spear Spewer muss man gegeneinander abwägen (Spear trifft auch den eigenen Spieler).

## Struktur und Prüfnachweis

- **100 Karten** mit **97 unterschiedlichen Kartennamen**, 36 Länder, 36 Kreaturen inklusive Gev, 28 weitere Zauber. Nur die Basics Swamp (3) und Mountain (2) kommen mehrfach vor.
- Die Version wurde im GitHub-Branch `deck/gev-lizards-b3-20261017` abgelegt und durch erneutes Auslesen strukturell überprüft.
- Zur Beurteilung wurden Oracle-Texte der gezielt getauschten Karten sowie die offizielle Commander-/Bracket-Einordnung herangezogen. **Nicht nachgewiesen:** umfassende automatisierte Live-Scryfall-Prüfung aller 97 Namen und Farbidentitäten, vollständiger Combo-Audit, echte Mehrspielerpartien oder gemessene Siegquote. „Optimiert“ meint eine aus Kartenfunktionen hergeleitete Verbesserung, kein empirisch bewiesenes Optimum.

## Referenzen

- [Offizielles Commander-Format und Bannliste](https://magic.wizards.com/en/formats/commander)
- [Offizielle Bracket-/Game-Changer-Anpassungen (Oktober 2025)](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-october-21-2025)
- [Offizielle Bracket-/Game-Changer-Anpassungen (Februar 2026)](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026)
- [Aktuelle importierbare Liste](current.txt)
