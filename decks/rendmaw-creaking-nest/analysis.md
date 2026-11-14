# Rendmaw, Creaking Nest — Der Krieg der fremden Vögel

Stand: 2026-11-14 · **Commander, Bracket 3** (oberer Leistungsbereich) · unbegrenztes Budget.

Die einzig aktive und importierbare Liste ist [current.txt](current.txt). Diese Analyse ist keine zweite Deckliste.

## Deckbau und Prüfstand

- **100 Karten:** 1 Commander, 62 Nichtlandkarten, 37 Länder.
- **3/3 Game Changers:** Ancient Tomb, Demonic Tutor, Survival of the Fittest. Grundlage: Commander-Liste mit Stand Februar 2026, nochmals im November 2026 abgeglichen.
- Keine absichtlich enthaltene Zweikarten-Endlosschleife, Extrazüge oder Massen-Landverweigerung. Grave Pact kann jedoch Kreaturen stark einschränken und gehört in die Spielabsprache.
- Eine lokale Zählung prüfte 100 Karten und Singleton-Ausnahmen für genau 2 Forest und 2 Swamp. Eine vollständige Oracle-/Bannlisten-/Farbidentitätsprüfung und reale Partietests stehen aus. Die Repository-CI prüft nur Struktur, nicht alle Kartenregeln.

## Mechanik, die das Deck zusammenhält

Rendmaw erzeugt beim Eintritt und **beim Spielen einer Karte mit mindestens zwei Kartentypen** für jeden Spieler einen getappten 2/2-Vogel mit Flugfähigkeit; die Vögel bleiben für den Rest der Partie angestachelt. Eine Karte lediglich ohne Spielen ins Spiel zu bringen genügt nicht.

Auslöser im Deck:
- **Artefaktkreaturen:** Ornithopter of Paradise, Twitching Doll, Leaden Myr, Haywire Mite, Roaming Throne, Solemn Simulacrum, Noxious Gearhulk.
- **Verzauberungskreaturen:** Sanctum Weaver, Enduring Vitality, Dryad of the Ilysian Grove, Destiny Spinner, Courser of Kruphix, Eidolon of Blossoms, Doomwake Giant, Overlord of the Hauntwoods, Overlord of the Balemurk, Nyx Weaver, Gloomshrieker, Enduring Tenacity.
- **Länder mit zweitem Kartentyp:** Urza's Saga und Valgavoth's Lair (Enchantment Land); Darkmoss Bridge, Darksteel Citadel, Vault of Whispers, Tree of Tales, Treasure Vault und Scene of the Crime (Artifact Land); Dryad Arbor (Creature Land).
- **Kindred-Zauber:** Bitterblossom und Lignify (Kindred Enchantment), Nameless Inversion (Kindred Instant). *Kindred ist selbst ein Kartentyp.*

## Spielplan

**Eröffnung:** In den Zügen 1–3 Mana beschleunigen, nötigenfalls mit Ancient Tomb. Rendmaw möglichst früh ausspielen. Lightning Greaves oder Heroic Intervention schützen ihn; der erste ETB-Vogel entsteht auch ohne weiteres Mana.

**Aufbauen:** Mehrfachtyp-Karten spielen; mit Roaming Throne die Art **Scarecrow** wählen, um spätere Rendmaw-Auslöser zu verdoppeln. Bitterblossom, Dryad of the Ilysian Grove und die Mehrfachtyp-Länder liefern weiter Auslöser bzw. Ressourcen. Idol of Oblivion und Deathreap Ritual liefern dauerhaften Kartenvorteil.

**Vogeltod profitabel machen:** Ashnod's Altar, Yawgmoth, Evolutionary Leap, Phyrexian Tower, Victimize und Plumb the Forbidden opfern eigene Vögel. Poison-Tip Archer, Syr Konrad, Blood Artist und Grismold reagieren auf sterbende Kreaturen bzw. Spielsteine, auch bei Gegnern. Marionette Apprentice, Zulaport Cutthroat und Grave Pact profitieren von unseren Opfern. Species Specialist wählt **Bird**, um an Vogel-Todesfällen Karten zu ziehen. Skullclamp ist für die 1/1-Faeries, Eichhörnchen und Servos besser als für 2/2-Vögel.

**Abschließen:**
- **Massacre Wurm**: Bestehende gegnerische Vögel sterben durch -2/-2; jeder gegnerische Vogel verursacht durch den Wurm zwei weitere Lebenspunkte Verlust für dessen Besitzer.
- **Virulent Plague**: Alle 2/2-Vögel und 1/1-Pflanzen sterben sofort; vorhandene Sterbe-Payoffs nutzen dies. **Mirkwood Bats triggert dabei nur durch Erzeugung eigener Token, nicht durch deren bloßes Sterben**; zusätzliches Auslösen ist durch tatsächlich geopferte Token möglich.
- **Culling Ritual**: Vernichtet auch Token (Mana Value 0) und erzeugt Mana, kann aber eigene billige Nichtlandpermanents treffen.
- **Ezuri's Predation**: 4/4-Bestien kämpfen mit gegnerischen 2/2-Vögeln und hinterlassen bei günstigem Board eine große eigene Armee.
- **Revel in Riches**: Gegnerische Todesfälle produzieren Schätze; bei zehn Schätzen zu Beginn des eigenen Versorgungssegments ein alternativer Sieg.
- **Grismold + Virulent Plague + Primal Vigor**: Erzeugte Pflanzen sterben, Grismold wächst durch ihre Todesfälle, Primal Vigor verdoppelt Tokens und Zählmarken.

## Schwächen, Gegenproben und Spielsituationen

- **Goad im Duell:** Gibt es keinen anderen legalen Gegner mehr, können gegnerische angestachelte Vögel uns angreifen. Revenge of Ravens, Virulent Plague und die Wipes sind deshalb kein Beiwerk.
- **Die eigenen Vögel sind ebenfalls angestachelt** und müssen angreifen, falls möglich. Vor dem Angriffssegment ist Opferung oder gegebenenfalls Tappen mit Enduring Vitality möglich.
- **Primal Vigor wirkt symmetrisch.** Gegnerische Token-Decks profitieren ebenso. Nur ausspielen, wenn wir die vervielfachte Produktion sofort besser verwerten können.
- **Virulent Plague verhindert auch unsere eigene klassische Vogel-Offensive** und schwächt manches Token-Payoff. Nicht parallel zu Ezuri's Predation auf eine intakte Vogelschar hoffen.
- **Culling Ritual trifft auch eigene frühe Steine.** Netto-Mana und Verluste abwägen.
- **Commander-Abhängigkeit:** Rendmaw kostet fünf Mana und kann teuer erneut gewirkt werden. Schutz und Meren/Victimize sind bewusst enthalten. Ohne ihn verliert die Liste merklich an Tempo.
- **Testziele:** Commander in Zug 3–5; danach genügend weitere Mehrfachtypen; belastbare Kartenversorgung; Massensterben ohne eigenes Aus; realistische Gewinnwege im Vierpersonenspiel und im Duell.

## Referenzen

- [Wizards: Commander-Regeln und Brackets](https://magic.wizards.com/en/formats/commander)
- [Wizards: Rendmaw-Regeltext und Goad (Duskmourn Release Notes)](https://magic.wizards.com/en/news/feature/duskmourn-house-of-horror-release-notes)
- [Wizards: Kindred als Kartentyp (Modern Horizons 3)](https://magic.wizards.com/en/news/feature/modern-horizons-3-release-notes)
- [Game Changers: 53 Karten, geprüft November 2026](https://themanagrove.com/articles/commander-game-changers)
