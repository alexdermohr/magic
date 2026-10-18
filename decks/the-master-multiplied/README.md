# The Master, Multiplied — Rakdos-Myriad, dauerhafte Tokens, Kampfmathematik

**Stand:** 18. Oktober 2026 · **aktives Deck:** Bracket 3 (Upgraded), V4 · **Commander:** The Master, Multiplied (Rakdos).

| Datei | Zweck |
|---|---|
| [current.txt](current.txt) | **Aktuelle 100 Karten inkl. Commander**, importierbar als `1 CARD NAME`. |
| [analysis.md](analysis.md) | Alle 100 Slots kritisch bewertet, fünf V4-Wechsel, acht V3-Wechsel, Alternativen und Risiken. |
| [versions/2026-10-18-b3-v1.txt](versions/2026-10-18-b3-v1.txt) | Erste tatsächlich erstellte Entwurfsfassung (historisch). |
| [versions/2026-10-18-b3-v2.txt](versions/2026-10-18-b3-v2.txt) | Tatsächlich erstellte Zwischenfassung vor V3. |
| [versions/2026-10-18-b3-v3.txt](versions/2026-10-18-b3-v3.txt) | Unveränderte V3 aus dem bisherigen GitHub-PR, vor den jetzigen fünf Wechseln. |
| [validate.py](validate.py) | Reproduzierbarer Struktur-, Bracket- und Oracle-Validator. |

**Mana:** 36 Landkarten plus `Malakir Rebirth` als optionale, getappt eintretende Rückseite `Malakir Mire`, sieben Mana-Artefakte, Ancient Tomb und weitere Beschleunigung. **Game Changer (genau drei):** Ancient Tomb, Demonic Tutor, Jeska's Will. **Wheel of Fortune ist aktuell kein Game Changer**, zählt also nicht als vierter Platz. Kein Kiki-Jiki/Combat-Celebrant-Zwei-Karten-Infiniteloop. Bracket ist eine Deckbaueinordnung, keine empirisch belegte Winrate.

## Spielkonzept

The Master kostet **{4}{B}{R}**, hat **Myriad** und zwei statische Fähigkeiten: 1. Die Legendenregel gilt nicht für Kreaturentokens, die wir kontrollieren. 2. Unsere ausgelösten Fähigkeiten können uns nicht zum Opfern oder Exilieren eigener Kreaturentokens veranlassen.

Dadurch bleiben die zusätzlichen, angreifend ins Spiel kommenden Kopien aus Myriad erhalten. **Die Master-Tokens selbst sind auch Kopien mit seinen statischen Fähigkeiten und Myriad.** Sie behalten die Schutzwirkung bei, selbst wenn nur die ursprüngliche Commanderkarte entfernt wird.

Besonders wertvoll sind nicht nur viele Körper auf dem Tisch, sondern dauerhafte Kopien von **Gray Merchant of Asphodel**, **Massacre Wurm**, **Mishra, Claimed by Gix**, **Terror of the Peaks** und **The Master** selbst.

### Die sechs zentralen Engines

1. **Master + Myriad:** In einer Viererrunde erzeugt ein deklarierter Master-Angriff zwei Tokens; ein nächster Angriff mit drei Masters erzeugt sechs weitere. Im Zweispielermodus erzeugt Myriad keine Tokens.
2. **Redoubled Stormsinger:** Beide Kreaturen zum Angriff deklarieren. Auf dem Stapel zuerst **Myriad** verrechnen lassen, danach den Stormsinger-Trigger; dieser kopiert dann die beiden gerade erzeugten Master-Tokens noch einmal. Fünf Masters inklusive Original schon aus dem ersten Angriff.
3. **Rionya, Fire Dancer:** Zu Beginn des Combats vor der Angriffsdeklaration eine oder nach zuvor gewirkten Instants/Sorceries mehrere haste-Kopien einer *anderen* eigenen Kreatur machen. Mit Master bleiben sie dauerhaft. Rionya kann so sogar einen Master kopieren, den man gerade ohne Eile gewirkt hat: Der **Token** kann angreifen.
4. **Blade of Selves / Goldlust Triad / Dalek Squadron / Elturel Survivors:** Myriad auf anderen Karten erzwingt weitere dauerhafte Kopien, Goldlust erzeugt beim Treffer Treasures. Elturel Survivors erhält während des Angriffs Stärke in Höhe der Länder des jeweiligen verteidigenden Spielers.
5. **Molten Duplication, Twinflame, Electroduplicate, Jaxis, Feldon, Orthion, Determined Iteration, Flameshadow Conjuring, Splinter Twin:** Erzeugen Kreaturentokens, deren spätere Opfer-/Exil-**Trigger** durch Master verhindert werden. **Molten Duplication** schützt dagegen reine Nicht-Kreatur-Artefakttokens nicht. Splinter Twin ist ein Aura-Risiko (2-für-1 bei Removal), bietet aber wiederholbare, sofort angreifende Kopien der verzauberten Kreatur, sofern diese tappen darf.
6. **Hall of Echoes:** Ein ungetapptes Land, das für **{5}** selbst bis Zugende eine Kopie einer unserer Kreaturen sein kann. Als Master-Kopie besitzt es Myriad. Der zusätzliche Legendenregel-Ausschluss der Hall gilt für alle unsere Permanents in diesem Zug; er ist nicht auf Tokens begrenzt.

## V4: Weniger tote Karten, bessere Ressourcen

- **Shredder, Shadow Master** erzeugt schon ohne Master weitere angreifende Shredder-Token, **wenn Shredder zum Angriff auf einen Spieler deklariert wird** (gegen die anderen Gegner). Beim Angriff auf einen Planeswalker oder eine Battle wird seine Kopierfähigkeit **nicht** ausgelöst. Sein Kampfschaden halbiert die verbleibenden Lebenspunkte des getroffenen Spielers (aufgerundet verlorenes Leben). Mit Master bleiben die von seinem Trigger erzeugten Kreaturentokens dauerhaft, statt am Kampfende geopfert zu werden. Die Kopien selbst wurden nicht als Angreifer deklariert und haben deshalb in diesem Combat keinen eigenen Angriffstrigger.
- **Wheel of Fortune** füllt eine nach Ramp, Kopierzaubern und Removal geleerte Hand für drei Mana mit sieben Karten. Gegenargument: Auch Gegner erhalten sieben Karten; möglichst nach eigenem Mana-/Boardvorsprung einsetzen.
- **Brotherhood Regalia** gibt dem ausgerüsteten Wesen Ward {2} und Unblockbarkeit; das Anlegen an eine **legendäre Kreatur** kostet nur {1}. Damit schützen wir Master oder Shredder gezielt vor Blockern. Myriad-Kopien übernehmen Ausrüstungen und dadurch verliehene Fähigkeiten **nicht**.
- **War Room** ist ein farbloses Land und zieht auch in langen Spielen *ohne Master* für {3}, {T} und zwei Leben eine Karte.
- **Splinter Twin** ist die wiederholbare eigene Kreaturenkopie: Solange ein Master-Objekt seine statische Fähigkeit besitzt, bleibt der mithilfe der aktivierten Fähigkeit erzeugte Kreaturentoken nach der Endstep-Auslösung erhalten. Die verliehene Tap-Fähigkeit wird **nicht** mitkopiert. Auch **Orthion, Hero of Lavabrink** darf jede *andere* Kreatur, also gerade auch den legendären Master, kopieren (ein Token für {1}{R} oder fünf für {6}{R}{R}{R}, jeweils zusätzlich {T}); nur die erzeugten Kreaturentokens sind durch Master gegen den späteren Opfertrigger geschützt.

**V4-Tauschliste und kritische Gegenabwägung:** [analysis.md](analysis.md). Keine zusätzlichen Game Changer; keine neue schnelle Zwei-Karten-Endlosschleife ist absichtlich eingebaut.

## Spielen nach Phasen

**Früh (Züge 1–3).** Halte bevorzugt 3 Länder bzw. 2 Länder mit frühem Manastein. Sol Ring, Arcane Signet, Rakdos Signet, Talisman, Fellwar, Mind Stone und Cursed Mirror ermöglichen einen früheren Master. Bitter Reunion, Night's Whisper, Fable und Black Market Connections verbessern die Hand. Samut und Lightning Greaves/Swiftfoot Boots bereiten den Sofortangriff vor; Arena of Glory kann dem ursprünglichen Master beim Wirken Eile geben. Brotherhood Regalia sichert das Durchkommen.

**Mitte (Züge 4–6).** Idealerweise The Master mit Eile oder unmittelbarer Tokenkopie und verfügbarem Schutz legen. Alternativ eine selbstständige Engine vorlegen: Goldlust Triad, Shredder, Delina, Rionya, Jaxis, Feldon oder Orthion. Nach ausgegebenen Karten mit Wheel of Fortune nachfüllen. Nutze Imperial Recruiter für Kleinwesen-Engines wie Jaxis, Feldon, Grenzo, Agate Instigator, Samut und Professional Face-Breaker, nicht für Redoubled Stormsinger mit Stärke 3.

**Explosion (Züge 6–8+).** Mit Master/Stormsinger/Tremors/Bats/Purphoros mehrere Gegner zugleich unter Druck setzen. Aggravated Assault und Great Train Heist enttappen **alle** eigenen Kreaturen für den nächsten Kampf, Karlach enttappt angreifende Kreaturen im ersten Combat. Mishra, Claimed by Gix zieht beim Deklarieren sehr vieler Angreifer massiv Lebenspunkte ab. Shredder halbiert beim Durchkommen die Lebenspunkte; Brotherhood Regalia kann dafür das Original unblockbar machen. Gray Merchant und Massacre Wurm gewinnen über ETB statt allein durch Angriffsschaden.

**Nach einem Wipe.** Plumb the Forbidden setzt bedrohte Token in Karten um (Opferungen sind **zusätzliche Kosten und werden durch Master nicht verhindert**). Goblin Bombardment kann sie in Schaden umwandeln. Aus Friedhöfen helfen Reanimate, Takenuma und Feldon; Wheel of Fortune kann die Hand wieder auffüllen.

## Regeln, die leicht falsch gespielt werden

- **Nur getriggertes Opfer/Exil verhindert:** nicht die Legendenregel für Nicht-Kreaturentokens, nicht Zerstören, ein Opfer als Zauber-/Aktivierungskosten, Ersatzeffekte, gegnerische Triggers oder die Regeln für zustandsbasierte Aktionen.
- **Mirkwood Bats:** Verursacht je einen Lebensverlust pro **erzeugtem oder geopfertem** Token (für jeden Gegner); das bloße Sterben eines Tokens durch Kampfschaden, Zerstörung oder Widerstandskraft 0 löst es **nicht** aus.
- **Wegfall des Originals:** Ein verbleibender Master-Token besitzt dieselben statischen Fähigkeiten. Erst wenn kein permanenter Master mit diesen Fähigkeiten mehr kontrolliert wird, entfällt dieser Schutz. Bereits ohne Wirkung verrechnete einmalige Cleanup-Trigger werden später nicht nachgeholt.
- **Kopien „angreifend ins Spiel“:** Haben nicht angegriffen im Sinne von `whenever ... attacks`; keine eigene Angriffsauslösung in diesem Combat. ETB- und Kampfschaden-Auslöser funktionieren regulär. Myriad gibt exakt einen Token pro anderem Gegner, nicht pro Blocker.
- **Free Spells/Commander-Schaden:** Master-Tokenkopien sind keine Commander. Deadly Rollick und Deflecting Swat verlangen für die kostenlose Variante die *echte Commanderkarte* unter unserer Kontrolle. Nur ihr persönlicher Kampfschaden zählt für 21 Commander-Schaden.
- **Purphoros und Legendenregel:** Unter roter Hingabe fünf ist Purphoros keine Kreatur. Token-Kopien wären dann ggf. legendäre **Nicht-Kreaturentokens** und erhalten keinen Schutz vor der Legendenregel des Masters.
- **Extrakämpfe:** Great Train Heist mit seinem Extra-Combat-Spree-Modus kostet insgesamt **{2}{R}{R}** (Grundkosten {R} plus Spree-Aufpreis {2}{R}), enttappt alle eigenen Kreaturen und erzeugt **nur beim Wirken während unserer Kampfphase** eine zusätzliche Kampfphase nach der aktuellen. Der Modus erzeugt **keine** zusätzliche Hauptphase. Karlach enttappt bei der ersten Kampfphase und schafft eine weitere, nicht bei jedem späteren Combat erneut.
- **Schutzlücken:** Dolmen Gate verhindert ausschließlich Kampfschaden an eigenen angreifenden Kreaturen, kein Spot- oder Mass-Removal. Shizo gibt Fear statt echter Unblockbarkeit; Brotherhood Regalia macht nur das **ausgerüstete** Wesen unblockbar und gibt Ward {2} (kein Hexproof).

## Typischer Sieg ohne The Master

Goldlust Triad erzeugt weiter Myriad plus Treasures, Shredder halbiert getroffene Gegner, Rionya/Delina/Feldon/Jaxis kopieren ETB-Kreaturen zunächst für einen Zug, Gray Merchant/Massacre Wurm bleiben als ETB-Bedrohungen stark, und Wheel of Fortune bzw. War Room helfen beim Wiederaufbau. Burn-Engines funktionieren auch mit nicht-permanenten Tokens. Die Liste gewinnt allerdings **deutlich konsistenter mit einem aktiven Master-Objekt**; ein Deck, das vollkommen gleich stark ohne Commander wäre, wäre strategisch kaum noch ein Master-Deck.

## Reproduzierbare Prüfungen

```sh
python3 decks/the-master-multiplied/validate.py
python3 decks/the-master-multiplied/validate.py --oracle
```

Der zweite Test fragt **live** bei Scryfall exakte Namen, Farbidentität, Commander-Legalität, Landzahl und Game-Changer-Flags ab. Weder der Parser noch die Oracle-Abfrage beweisen korrektes Spielverhalten der Karten in einer digitalen Simulation. Echte Mehrspielerpartien und unabhängige vollständige Trigger-Tests stehen nicht als durchgeführt da.

**Primärquellen:** [Offizielle Doctor-Who-Release-Notes](https://magic.wizards.com/en/news/feature/magic-the-gathering-doctor-who-release-notes) · [Commander-Format und Brackets](https://magic.wizards.com/en/formats/commander) · [Commander-Bracket-Aktualisierung 2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026) · [Scryfall](https://scryfall.com/).
