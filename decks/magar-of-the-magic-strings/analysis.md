# Magar of the Magic Strings – Optimierung V2

**Stand:** 2026-10-19. **Commander:** Magar of the Magic Strings. **Bracket:** 3 / Upgraded. **Mission:** Eine echte Magar-Puppe möglichst früh sicher zum Gegner bringen und mit wiederholbaren Großzaubern gewinnen.

## Exakt acht V1 → V2 Änderungen

| Raus | Rein | Warum und Gegenargument |
|---|---|---|
| Bone Miser | **Monument to Endurance** | Drei statt fünf Mana; Discard produziert eine Karte, Schatz oder 3 Lebensverlust pro Gegner. Begrenzung: jede Option nur einmal pro Zug, daher bei riesigen Wheels weniger explosiv als Bone Miser. |
| Guttersnipe | **Illusionist's Bracers** | Für Equip {3} an Magar vervielfacht die Ausrüstung seine aktivierte Fähigkeit; aus einer Aktivierung entstehen **zwei verschiedene** Spruch-Puppen. Guttersnipe war günstiger und lieferte direkt 2 Schaden pro gewirktem Spruch an alle Gegner, ist ohne wiederholte Casts aber unterdurchschnittlich. |
| Strionic Resonator | **Glaring Spotlight** | {3} + Opfer macht alle eigenen Kreaturen für einen Zug unblockbar und verleiht bestehenden Kreaturen Hexproof. Die alte Karte kopierte einen gelungenen Schadens-Trigger für {2}, war aber nutzlos, falls keine Puppe überhaupt durchkam. Spotlight ist einmalig, nicht wiederholbar. |
| Brotherhood Regalia | **Silver Shroud Costume** | Neues Equipment kostet {2}, **Flash**, sofortiges Anlegen beim ETB, temporäres Shroud, dauerhafte Unblockbarkeit. Regalia hatte dauerhaft Ward {2}, aber bei einer nichtlegendären Puppe Equip {3}; späteres Umrüsten kostet auch beim Costume {3}. |
| Explosive Singularity | **Sorin's Vengeance** | Gleiche relevante Menge Direktschaden an Spieler/Planeswalker (**10**) und zusätzlich **10 Lebenspunkte** für uns; sieben statt zehn Mana falls einmal normal zu wirken. Verlust: kann nicht mehr auf Kreaturen zielen. |
| Shizo, Death's Storehouse | **Flamekin Village** | Shizo kann nur dem legendären **Magar**, nicht seinen namenlosen Puppen, Fear geben. Flamekin Village gibt jeder Puppe gegen {R}, Tap Eile und liefert selbst {R}. Risiko: ohne Elemental-Karte fast immer getappt. |
| Buried Alive | **Final Parting** | Sucht **beliebige** zwei Karten: beispielsweise Breach the Multiverse direkt in den Friedhof und Silver Shroud Costume oder Key to the City auf die Hand. Anders als Buried Alive ist es auch als Magar-Ziel für wiederholtes Suchen brauchbar. Nachteil: {3}{B}{B} statt {2}{B}; Anger+Filth auf einen Schlag in den Friedhof zu legen geht nicht mehr. |
| Fevered Suspicion | **Vandalblast** | Von der Hand einmal für {R} gezielte Artefaktantwort oder für {4}{R} alle gegnerischen Artefakte räumen. Der alte Achtmana-Zufallszauber war als Puppe spannend (bis drei fremde Karten) aber ohne Rebound bei kostenloser Magar-Kopie, und in der Hand schwer zu wirken. Wichtige Grenze: Magar kann Vandalblast nur **ohne Overload** kostenlos wirken. |

**Echte historische V1:** [versions/2026-10-19-b3-v1.txt](versions/2026-10-19-b3-v1.txt). Nur die bestehende `current.txt` wird als V2 aktiv gepflegt.

## Formale Struktur, aktuelle Liste

| Kategorie | Anzahl |
|---|---:|
| Commander | 1 |
| Kreaturen außer Commander | 10 |
| Artefakte | 18 |
| Verzauberungen | 6 |
| Magar-Haymaker mit hohem Impact | 9 |
| Setup, Discard und Tutoren | 12 |
| Flexible Interaktion einschließlich Vandalblast und Malakir Rebirth | 8 |
| Echte Länder | 36 |
| **Gesamt** | **100** |

`Malakir Rebirth` hat die `Malakir Mire` Landrückseite und ist **kein** 37. dediziertes Land. `Flamekin Village` ist ein Land und ersetzt genau ein Land. Die Kategorien sind Deckbaurollen, keine automatisch ermittelten Oracle-Typen: `Vandalblast` ist beispielsweise auch eine Sorcery, wird hier als Interaktion eingeordnet.

## Die neun Haymaker

- `Brass's Bounty`: wiederholbare Schatzskalierung mit eigener Länderzahl, Treasures kommen **ungetappt**.
- `Breach the Multiverse`: je Spieler 10 Karten millen und aus jedem Friedhof einen Planeswalker oder eine Kreatur holen.
- `Rise of the Dark Realms`: gewinnt Kreaturen aus sämtlichen Friedhöfen unter unserer Kontrolle.
- `In Garruk's Wake`: zerstört nur gegnerische Kreaturen und Planeswalker, schützt somit die eigenen 3/3.
- `Blood for the Blood God!`: Hand abwerfen, 8 ziehen, **jedem Gegner 8 Schaden**, danach wird die **gewirkte Kopie** exiliert, nicht die ursprüngliche Puppe.
- `Hit the Mother Lode`: Discover 10; restliche Mana-Wert-Differenz als **getappte** Treasures für Folgerunden.
- `Sorin's Vengeance`: 10 an Spieler/Planeswalker und 10 Lebenspunkte für uns. Mit `Berserkers' Onslaught` wird bei zwei ungeblockten Kampfschadensschritten dieselbe kopierte Sorcery zweimal gewirkt.
- `Peer into the Abyss`: sehr viele Karten auf Kosten der Hälfte der Lebenspunkte; Lebensmanagement wichtig.
- `Disrupt Decorum`: Goad aller gegnerischen Kreaturen. **Beim Treffer in unserem Kampf** ändert Goad den bereits abgeschlossenen Blocker-Schritt nicht und hilft erst in den folgenden Angriffen; primär Politik und Absicherung gegen Gegenschläge.

**Rollen-Abgrenzung:** `Final Parting` und `Vandalblast` sind zusätzliche sinnvolle Magar-Ziele, aber ihre Aufgabe ist Suchen bzw. Interaktion, nicht der direkte Sieg. `Final Parting` kostet ohne Kopie fünf Mana, um zwei Karten zu tutorieren. `Vandalblast` kann kostenlos nur eine gegnerische Artefakt-Permanente zerstören, nicht überladen werden.

## Wichtigste Engpass-Funktionen

**Friedhof vorbereiten:** Faithless Looting, Cathartic Reunion, Thrill of Possibility, Demand Answers, Big Score, Anje Falkenrath, Key to the City, Ripples of Undeath, Doom Whisperer, Geier Reach Sanitarium und Wheel of Fortune. `Entomb`, `Unmarked Grave`, `Final Parting` suchen gezielt, `Gamble` kann zufällig auch das gewünschte Ziel abwerfen. `Monument to Endurance` macht bewusstes Abwerfen zum direkten Vorteil.

**Eile:** `Anger` im Friedhof **und** eigenes Mountain, `Chainer, Nightmare Adept`, `Bitter Reunion`, `Flamekin Village`. Magar selbst braucht zum Aktivieren keine Eile, aber frisch durch Magar erzeugte 3/3 brauchen sie zum sofortigen Angriff.

**Evasion:** `Key to the City`, `Whispersilk Cloak`, `Silver Shroud Costume`, `Thieves' Tools`, `Dauthi Embrace`, `Glaring Spotlight`, `Bedlam`, `Access Tunnel`, `Rogue's Passage`, `The Black Gate` (nur Spieler mit den meisten bzw. gleich vielen Lebenspunkten), `Filth` + ein Swamp (ideal mit `Urborg, Tomb of Yawgmoth`). Beachte: Brotherhood Regalia ist seit V2 **nicht mehr** enthalten.

**Schutz:** `Lightning Greaves`, `Swiftfoot Boots`, `Mithril Coat`, `Deflecting Swat`, `Malakir Rebirth` auf den ursprünglichen Magar, `Plaza of Heroes`, temporäres Shroud von `Silver Shroud Costume` und `Glaring Spotlight`. Magar-Puppen selbst haben beim Verlassen des Spielfelds eine **Exil-statt-anderen-Zielort**-Ersatzwirkung: Wiederbelebung derselben Puppe durch Malakir Rebirth funktioniert nicht.

**Ressourcen:** 36 Lands (+ Malakir Mire optional), sieben effiziente Mana-Artefakte einschließlich Sol Ring, dazu Storm-Kiln Artist, Professional Face-Breaker, Big Score, Jeska's Will und Brass's Bounty. Magar benötigt für **jede Aktivierung {1}{B}{R}**. Mehr Puppen kosten entsprechend mehr Mana und brauchen separat Evasion — genau deshalb sind Bracers und Spotlight als Paar stärker als einzeln.

## Grenzen und stärkstes Gegenargument

Das Deck verliert durch V2 **zwei unterstützende Kreaturen** und eine zuverlässige eigenständige direkte Schadensquelle (`Guttersnipe`). `Illusionist's Bracers` kann auf einer leeren Friedhofslage keine zwei unterschiedlichen Puppen erzeugen; der Ausrüstungsaufwand ist hoch. `Silver Shroud Costume` hat nur am ETB einmal gratis Attach, danach Equip {3}, während `Brotherhood Regalia` auch später Ward gab. `Flamekin Village` ist im Gegensatz zum entfernten Shizo praktisch sicher getappt. Dieser Trade lohnt nur, wenn der Druck der ersten ein bis zwei Magar-Treffer entscheidender ist als langfristige Einzelkarteneffizienz.

**Nicht als Optimierung enthalten:** `Savage Beating` und wiederholbare Extra-Combat-/Extra-Turn-Loops, `Torment of Hailfire`/andere X-Zauber (bei kostenloser Kopie X=0), `Roaming Throne` für typelose Puppen, `Insurrection` als Magar-Ziel (wird **erst nach Kampfschaden** gewirkt, für die bereits erfolgte Angriffsdeklaration zu spät), `Necropotence` (verbannt abgeworfene Karten statt sie in den Friedhof zu legen und ist Game Changer). `Volcanic Vision` wäre ein möglicher Ersatz für einen weiteren Haymaker, braucht jedoch zusätzliche **andere** hochwertige Spell-Karten im Friedhof als Ziele — diese sind durch Magars Aktivierung oft bereits zu Puppen geworden.

**Weiter zu beobachten:** Eine Hand ohne schwarzen + roten Manaquellen; nur ein Haymaker im Friedhof, sodass Bracers effektiv nur einen Token schafft; Massenremoval, Graveyard-Hate und Enchantment-Hate. Verbesserungen sollten nach echten 4-Spieler-Partien an diesen Problemen priorisiert werden, nicht anhand der bloßen Zahl „explosiver“ Karten.

**Offizielle Referenz:** https://magic.wizards.com/en/formats/commander — Commander/Brackets; https://magic.wizards.com/en/news/announcements/commander-brackets-beta-update-february-9-2026 — Game Changers. Bracket 3 erlaubt maximal drei Game Changers. V2 verwendet weiterhin **Demonic Tutor, Gamble und Jeska's Will**.

**Prüfumfang:** Kartenänderungen und neue Einzelkartentexte manuell abgeglichen; 100 Karten/36 Länder/Singleton direkt an den Branch-Daten zählbar. Weder eine vollständige Oracle-Prüfung aller 100 Karten noch reale Partietests oder eine belegte Winrate sind mit diesem Text behauptet.
