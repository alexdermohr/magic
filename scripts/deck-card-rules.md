# Offline-Ausnahmen für Deck-Kopien

Stand der gezielten Datenprüfung: 2026-10-20. Der Validator bleibt offline und prüft
keine vollständige Oracle-Legalität, Farbidentität, Bannliste oder Bracket-Einstufung.
Die Tabellen sind ein begrenzter Snapshot, keine automatisch vollständige Kartendatenbank.
Neue Ausnahmen benötigen einen konkreten Kartenbeleg und Regressionstests.

## Austauschbare Namen

[CR 201.3b und 903.5b](https://magic.wizards.com/en/rules) behandeln austauschbare
Namen bei der Deckkonstruktion als denselben englischen Namen. Die offiziellen
[Walking-Dead-Reprints](https://magic.wizards.com/en/news/announcements/whats-new-on-the-list-for-wilds-of-eldraine)
und [Street-Fighter-Reprints](https://magic.wizards.com/en/news/announcements/whats-new-on-the-list-for-phyrexia-all-will-be-one)
tragen den Gleichheitsindikator. Die folgende begrenzte Tabelle deckt diese Drops
sowie Stranger Things ab. Die verlinkten Originaldrucke wurden über Scryfalls
`name`/`printed_name` (bei DFCs je Kartenseite) abgeglichen. Reine funktionale
Reprints werden nicht gleichgesetzt. Bei der enthaltenen DFC zählen vollständiger
Importname und Vorderseitenname zusammen.

| Gedruckter Name | Austauschbarer Name | Originaldruck-Beleg |
| --- | --- | --- |
| Blanka, Ferocious Friend | The Howling Abomination | [Scryfall](https://scryfall.com/card/sld/431) |
| Chief Jim Hopper | Sophina, Spearsage Deserter | [Scryfall](https://scryfall.com/card/sld/341) |
| Chun-Li, Countless Kicks | Zethi, Arcane Blademaster | [Scryfall](https://scryfall.com/card/sld/432) |
| Daryl, Hunter of Walkers | Hansk, Slayer Zealot | [Scryfall](https://scryfall.com/card/sld/144) |
| Dhalsim, Pliable Pacifist | Tadeas, Juniper Ascendant | [Scryfall](https://scryfall.com/card/sld/433) |
| Dustin, Gadget Genius | Hargilde, Kindly Runechanter | [Scryfall](https://scryfall.com/card/sld/342) |
| E. Honda, Sumo Champion | Baldin, Century Herdmaster | [Scryfall](https://scryfall.com/card/sld/428) |
| Eleven, the Mage | Cecily, Haunted Mage | [Scryfall](https://scryfall.com/card/sld/343) |
| Glenn, the Voice of Calm | Gregor, Shrewd Magistrate | [Scryfall](https://scryfall.com/card/sld/145) |
| Guile, Sonic Soldier | Immard, the Stormcleaver | [Scryfall](https://scryfall.com/card/sld/434) |
| Hawkins National Laboratory // The Upside Down | Havengul Laboratory // Havengul Mystery | [Scryfall](https://scryfall.com/card/sld/609) |
| Ken, Burning Brawler | Aisha of Sparks and Smoke | [Scryfall](https://scryfall.com/card/sld/430) |
| Lucas, the Sharpshooter | Bjorna, Nightfall Alchemist | [Scryfall](https://scryfall.com/card/sld/344) |
| Lucille | Gisa's Favorite Shovel | [Scryfall](https://scryfall.com/card/sld/581) |
| Max, the Daredevil | Elmar, Ulvenwald Informant | [Scryfall](https://scryfall.com/card/sld/345) |
| Michonne, Ruthless Survivor | Enkira, Hostile Scavenger | [Scryfall](https://scryfall.com/card/sld/146) |
| Mike, the Dungeon Master | Othelm, Sigardian Outcast | [Scryfall](https://scryfall.com/card/sld/346) |
| Mind Flayer, the Shadow | Arvinox, the Mind Flail | [Scryfall](https://scryfall.com/card/sld/340) |
| Negan, the Cold-Blooded | Malik, Grim Manipulator | [Scryfall](https://scryfall.com/card/sld/147) |
| Rick, Steadfast Leader | Greymond, Avacyn's Stalwart | [Scryfall](https://scryfall.com/card/sld/143) |
| Ryu, World Warrior | Vikya, Scorching Stalwart | [Scryfall](https://scryfall.com/card/sld/429) |
| Will the Wise | Wernog, Rider's Chaplain | [Scryfall](https://scryfall.com/card/sld/347) |
| Zangief, the Red Cyclone | Maarika, Brutal Gladiator | [Scryfall](https://scryfall.com/card/sld/435) |

## Explizite Kopierausnahmen

Die 13 Ausnahmen des früheren PR26-Workflows wurden gegen den aktuellen Oracle-Text
von Scryfall geprüft und in `validate_decks.py` übernommen. Die Obergrenzen gelten
für die Summe aller Zeilen nach NFC-/Großkleinschreibungs-Normalisierung. Eine
Ausnahme setzt weder die 100-Karten-Grenze noch die Commander-Anzahl außer Kraft.

| Name | Kopien im Deck | Oracle-Beleg |
| --- | --- | --- |
| Cid, Timeless Artificer | beliebig | [Scryfall](https://scryfall.com/card/fin/216) |
| Dragon's Approach | beliebig | [Scryfall](https://scryfall.com/card/stx/97) |
| Hare Apparent | beliebig | [Scryfall](https://scryfall.com/card/fdn/15) |
| Nazgûl | 9 | [Scryfall](https://scryfall.com/card/ltr/100) |
| Persistent Petitioners | beliebig | [Scryfall](https://scryfall.com/card/rvr/53) |
| Rat Colony | beliebig | [Scryfall](https://scryfall.com/card/dom/101) |
| Relentless Rats | beliebig | [Scryfall](https://scryfall.com/card/a25/105) |
| Seven Dwarves | 7 | [Scryfall](https://scryfall.com/card/eld/141) |
| Shadowborn Apostle | beliebig | [Scryfall](https://scryfall.com/card/2x2/89) |
| Slime Against Humanity | beliebig | [Scryfall](https://scryfall.com/card/mkm/177) |
| Sphinx's Approach | beliebig | [Scryfall](https://scryfall.com/card/fra/41) |
| Tempest Hawk | beliebig | [Scryfall](https://scryfall.com/card/tdm/31) |
| Templar Knight | beliebig | [Scryfall](https://scryfall.com/card/acr/10) |
