# Magar of the Magic Strings — Puppentheater der unmöglichen Zauber

**Aktuell:** Bracket 3 / Upgraded · **Version:** V2, 19. Oktober 2026 · **Farbidentität:** Rakdos · **Commander:** Magar of the Magic Strings.

- [current.txt](current.txt): einzige aktuelle, importierbare 100-Karten-Liste.
- [versions/2026-10-19-b3-v1.txt](versions/2026-10-19-b3-v1.txt): unveränderte echte V1 vor acht gezielten V2-Wechseln.
- [analysis.md](analysis.md): Slot-Tausche, Alternativen, Risiken, konkrete Karten- und Regelgrenzen.

**Ziel:** Möglichst hohe Spielstärke innerhalb Bracket 3 ohne beabsichtigte frühe Zweikarten-Endloskombos, Extra-Turn-Ketten oder Massenlandvernichtung. Kein Budgetlimit.

## Was Magar wirklich macht

Magar kostet {1}{B}{R}. Seine aktivierte Fähigkeit kostet {1}{B}{R}, **nicht Tap**: Nimm eine angezielte Instant-/Sorcery-Karte aus **deinem Friedhof**, notiere ihren Namen und lege die **echte Karte** verdeckt als 3/3-Kreatur aufs Feld. Die Karte ist **kein Token** und hat verdeckt keinen Namen, keine Farbe, keinen Kreaturentyp und Manawert 0.

Nach Kampfschaden an **einem Spieler** darf diese Kreatur eine Kopie der **notierten Karte** kostenlos wirken. Auch Hexereien dürfen dabei während des Kampfschadensegments gewirkt werden. Verlässt die 3/3 das Spielfeld, wird sie statt eines anderen Zielorts ins Exil geschickt. Der notierte Name ist **kein kopierbarer Wert**: Clone-/Token-Kopien dieser Puppe kennen ihn nicht, erhalten also keinen brauchbaren Zauberbezug.

**Zusatzkosten werden beim kostenlosen Wirken nicht erlassen**: Ein auf diese Weise gewirktes `Big Score` benötigt weiterhin den verlangten Discard. `Vandalblast` kann beim kostenlosen Wirken **nicht überladen** werden, weil Overload ein alternatives Wirken ist.

## Spielplan und Prioritäten

1. **Mana + Auswahl:** Bis Zug 3 Magar, ein 2-Mana-Manaartefakt und Discard/Entomb vorbereiten. `Faithless Looting`, `Cathartic Reunion`, `Thrill of Possibility`, `Anje Falkenrath`, `Key to the City` oder `Ripples of Undeath` legen teure Ziele in den Friedhof.
2. **Ziel suchen:** `Entomb` und `Unmarked Grave` legen sofort passende Karten ab; `Final Parting` sucht gleichzeitig den Magar-Zauber für den Friedhof und eine Evasion-/Schutzkarte auf die Hand. `Gamble` und `Demonic Tutor` bleiben flexibel.
3. **Sichere Puppe erzeugen:** Magar aktivieren. `Anger` im Friedhof **und** ein eigenes Mountain oder `Chainer, Nightmare Adept` geben Eile. Alternativ gibt `Flamekin Village` für {R} plus Tappen einem Ziel Eile; das Land kommt in dieser Liste fast immer getappt ins Spiel (keine Elementals zum Vorzeigen).
4. **Treffer garantieren:** `Key to the City`, `Dauthi Embrace`, `Whispersilk Cloak`, `Thieves' Tools`, `Silver Shroud Costume`, `Access Tunnel`, `Rogue's Passage` oder `Bedlam`. `Glaring Spotlight`: {3} + opfern macht alle eigenen bestehenden Kreaturen für den Zug unblockbar und gibt ihnen Hexproof — einmaliger Zug zum Durchbruch.
5. **Zauberkopien ausnutzen:** `Blood for the Blood God!` = 8 Schaden an jedem Gegner, Karten nachziehen; `Sorin's Vengeance` = 10 Schaden an einem Spieler/Planeswalker und 10 Leben; `Brass's Bounty` = Länderanzahl Schätze; `Breach the Multiverse` oder `Rise of the Dark Realms` = breite Kreaturenübernahme. `In Garruk's Wake` schont unsere Puppen.
6. **Mehr aus einer Puppe:** `Berserkers' Onslaught` lässt ungeblockte Puppen zweimal Kampfschaden zufügen (zwei Magar-Trigger). `Illusionist's Bracers` statt der alten Resonator-Linie: Wird es an **Magar selbst** ausgerüstet (Equip {3}), erhält man bei jeder Magar-Aktivierung eine Kopie der **aktivierten** Fähigkeit, ggf. mit neuem Ziel: So entstehen zwei verschiedene Puppen für eine Aktivierung, wenn **zwei unterschiedliche zulässige Karten im Friedhof** liegen. Bei nur einer legalen Zielkarte verpufft nach der ersten Abwicklung die zweite Instanz.

## Was V2 verändert

Die frühe Motorisierung ist robuster: `Monument to Endurance` kostet nur drei statt fünf Mana für `Bone Miser` und macht aus dem Abwerfen Karten, Schätze oder Gegner-Lebensverlust (jede der drei Optionen nur einmal pro Zug). `Silver Shroud Costume` kann als Flash-Ausrüstung beim ETB direkt an eine Kreatur angelegt werden, gibt ihr in diesem Zug Shroud und dauerhaft Unblockbarkeit; spätere Neuausrüstung kostet {3}. `Glaring Spotlight` sichert einen Mehrfachtreffer und kann auf gegnerische Zielremoval-Spells reagieren.

`Vandalblast` ersetzt den teuren Zufallszauber `Fevered Suspicion`: von Hand überladen ({4}{R}) entfernt es sämtliche gegnerischen Artefakte; eine kostenlose Magar-Kopie zerstört dagegen nur **ein angezieltes** gegnerisches Artefakt. `Sorin's Vengeance` gewinnt zusätzlich Leben, wo `Explosive Singularity` nur Schaden zufügte.

## Karten, die man nicht falsch spielen sollte

- Die neue `Flamekin Village` ist kein verlässliches ungetapptes Erstland, aber eine zusätzliche Eile-Quelle.
- `The Black Gate` kann nur einen gewählten Spieler mit den meisten oder gleich vielen Lebenspunkten von Blocks ausschließen. Es macht nicht gegen **jeden** Gegner unblockbar.
- `Filth` benötigt den eigenen Friedhof **und** ein eigenes Swamp. `Urborg, Tomb of Yawgmoth` verwandelt alle Länder in Swamps und ermöglicht dann Swampwalk gegen jeden Gegner mit Land.
- `Hit the Mother Lode` erzeugt getappte Schätze. Sie finanzieren keine Aktivierung im gleichen Zug, falls man sie nicht zusätzlich enttappt.
- `Malakir Rebirth` eignet sich als Absicherung des echten Magar, rettet aber eine bereits verdeckte Magar-Puppe wegen deren eigener Exil-Ersatzwirkung nicht.
- `Whispersilk Cloak` verleiht Shroud; nach dem Anlegen kann man die Puppe nicht ohne Weiteres mit eigenen Ziel-Fähigkeiten weiter ausrüsten.
- `Berserkers' Onslaught` hilft nur bei Kampfschaden — jede erfolgreiche Puppe löst ihren Schadenstrigger selbst aus. Eine beliebig erzeugte Kopie einer verdeckten Puppe hat nicht deren notierten Kartennamen.
- `Glaring Spotlight` verleiht Hexproof nur Kreaturen, die beim Verrechnen schon da sind; die Unblockbarkeit gilt auch für danach erscheinende eigene Kreaturen in diesem Zug.

## Bracket und Nachweise

**Game Changers (3):** `Demonic Tutor`, `Gamble`, `Jeska's Will`. `Deflecting Swat` zählt seit der Oktober-2025-Aktualisierung nicht mehr dazu. Keine beabsichtigten wiederholbaren Extrakämpfe/Extrazüge oder Massenlandvernichtung. 36 richtige Länder, ein optionales Land auf `Malakir Rebirth`.

Aktuelle Regelquellen: [Commander-Format](https://magic.wizards.com/en/formats/commander), [Bracket-Update 09.02.2026](https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026).

Das ist eine **Kartentext-/Deckbauoptimierung**, keine durch gespielte Commander-Partien bewiesene Winrate. CI und vollständige Oracle-Prüfung sind unabhängig von der hier kontrollierten 100-Karten-/Singleton-Struktur.
