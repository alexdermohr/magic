# Manabrew-KI: Forge zuerst, ManaBot gezielt verbessern, Lernen an Ergebnissen messen

Stand: 6. November 2026 · Status: **Umsetzungsplan, kein produktiver KI-Wechsel**

## 1. Ziel und Architekturentscheidung

**Ziel:** Manabrew soll auf Linux und iPad vollständig offline gegen einen spielstarken, schnellen und zuverlässigen Commander-Gegner laufen. Der Bot soll auch mit synergistischen Decks am oberen Rand von Commander Bracket 3 sinnvoll umgehen. Onlinekonten, Relay und Cloudmodelle sind für Solospiele nicht erforderlich.

**Entscheidung:** Forge bleibt Standardgegner und Regelinstanz. Zuerst beheben wir nachgewiesene Schwächen von **Forges bestehender KI**. ManaBot wird **nicht** als vollständige Rust-Kopie von Forges Java-KI entwickelt, sondern als eigenständiger, leichtgewichtiger strategischer Herausforderer: robuste vorhandene ManaBot-Mechanik, gezielt übertragene Forge-Prinzipien und eine optional trainierte Bewertung legaler Aktionen. Welche Lösung besser spielt, entscheidet ein Vergleich an echten Spielen, nicht das Etikett „KI“.

Die Anwendung muss zwischen den verfügbaren Gegnern wählen können, ohne die Spielregeln zu duplizieren. Jede Entscheidung wird erst durch die Forge-Engine auf Legalität geprüft. Das gelernte Modell erhält nur Informationen, die dem jeweiligen Spieler zugänglich sind.

**Nichtziel:** Sprachmodell im Echtzeit-Zugloop, ein zweiter Regelengine-Fork, ungeprüfter Standardwechsel auf ManaBot, vollständiges Kopieren der Forge-AI oder neue Infrastruktur ohne konkreten Spielnutzen.

## 2. Verifizierter Ausgangspunkt

| Komponente | Ist-Zustand | Grenze |
| --- | --- | --- |
| Forge | Java-AI mit direktem Zugriff auf die Forge-Spielengine; aktueller Standardgegner | Umfangreiche, teilweise eng gekoppelte Heuristik; Browser-WebImage-Neubau aufwendig |
| ManaBot | Rust/WASM-SimpleAi für Mana, Priorität, Kampf, Ziele und andere Prompts | Weniger umfassende Karten-/Commander-Strategie als Forge |
| Learned Policy in PR #77 | Lineares Softmax-Modell mit 22 Merkmalen; bewertet nur mindestens zwei sichtbare Cast-Optionen, wenn ManaBot casten will | Kein langfristiger Plan, keine allgemeine Kombinations- oder Kampftaktik, kein Lernen während einer Partie |
| Forge-Lehrer | Opt-in-Instrumentierung von echten Forge-Cast-Entscheidungen in der Java-JVM; eigene Spielersicht, legales Aktionsmenü | Java-Aufzeichnung bewiesen, Capture im **neu gebauten Browser-WebImage** noch nicht E2E bewiesen |
| Offline-Client | Lokale PWA und Linux-Chrome-App mit Forge-WASM sowie persönlichen Commander-Decks | Browser-/Chromium-E2E belegt, physisches iPadOS/Home-Screen-WebKit nicht vollständig nachgewiesen |

**Bisherige Evidenz, nicht als Siegversprechen zu interpretieren:** 81 reale Forge-Lehrbeispiele aus acht JVM-Läufen. Bei einem explorativen Holdout traf das Modell 10 von 20 Entscheidungen (50 %) gegenüber 30 % First-Cast-Baseline. In acht ungesehenen Duellen gegen interne Forge-AI stand es insgesamt 4:4, und vier kleine Vergleichsspiele gegen ManaBot endeten 3:1. Diese Stichproben beweisen technische Funktion, **keine höhere Spielstärke**; Sitz- und Deckvorteile dominierten einzelne Vergleiche.

**Offene Integration:** Die gestapelten PRs [#74](https://github.com/alexdermohr/magic/pull/74) (Offline-Client), [#76](https://github.com/alexdermohr/magic/pull/76) (ManaBot-Korrekturen) und [#77](https://github.com/alexdermohr/magic/pull/77) (Lernexperiment) sind noch nicht als Kette in main integriert. Ein erfolgreicher Build oder PR-Merge ist nicht gleichbedeutend mit einem neuen installierten Release. Forge bleibt bis zum nachgewiesenen Ersatz unverändert als Standard aktiviert.

## 3. Arbeitspakete, strikt in Nutzwert-Reihenfolge

### P0 — Solospiel und reproduzierbare Ausgangsbasis absichern

**Vorgehen**

1. Vor Arbeiten die tatsächlich ausgelieferte iPad-/Linux-Version, den Git-Branch, Dirty-State und den gerade laufenden Offline-Spielweg prüfen. Bereits laufende Releases nur für einen konkret behobenen Fehler austauschen; alte Version als Rückfall behalten.
2. Die zwei bekannten X-Mana-Probleme in PR #76 prüfen und bei bestätigter Reproduktion ursächlich beheben: Aktivierungen, die weitere nicht verfügbare Tap-Ressourcen benötigen (z. B. Springleaf Drum ohne untappte Kreatur), und Mana mit Verwendungsbeschränkung (z. B. Eldrazi Temple für einen Nicht-Eldrazi-Zauber). Die Korrektur gehört in den Zahlbarkeits-/Manaquellenmechanismus, nicht in Karten-Sonderregeln.
3. PR #74 → #76 → #77 in dieser Reihenfolge nach frischem Branch-, Diff-, Review- und relevanten Testnachweis integrieren. Kein unbesehenes Zusammenmergen eines experimentellen Bots in den produktiven Standardpfad.
4. Den unveränderten Forge-Standardgegner in einer vollständigen offline gespielten Commander-Partie im **tatsächlich ausgelieferten** Browserclient prüfen: persönliche Decks, Mulligan, Aktionen, reguläre Eliminierung, Ergebnisanzeige und Menürückkehr; für iPad nach Möglichkeit zusätzlich echtes Home-Screen-WebKit, WLAN aus, Kaltstart.
5. Einen fixierten Baseline-Datensatz erfassen: Forge-Engine-Version und WASM-Hash, Deckliste/Version, Seed, Sitz, Spielerzahl, Partiedauer, Timeout/Enginefehler, Sieger, Latenz sowie auffällige Fehlentscheidungen.

**Fertig, wenn:** Der gewählte Release bleibt ohne Server im realen Client spielbar, eine vollständige Partie endet regulär, ein funktionierender Rückfallstand existiert und Baseline-Builds/Ergebnisse sind reproduzierbar. Nicht durch zusätzliche Freigabeschleifen blockieren, wenn Live-Nachweise bereits reichen.

### P1 — Den vorhandenen ForgeBot dort verbessern, wo er nachweislich schlecht spielt

**Vorgehen**

1. Mit der unveränderten Forge-AI konkrete Fehlzüge in Commander-Partien sammeln und zu kleinen reproduzierbaren Situationen verdichten; zuerst Fehler mit hoher Sieg-/Tempoauswirkung. Zwischen Regelbug, Zahlbarkeitsbug und Strategiefehler unterscheiden.
2. Priorität nach Wirkung:
   - **Kampf:** tödlichen Schaden, Commander-Schaden, sinnvolles Blocken, Value-Angriffe und gegnerische Gegenangriffe richtig bewerten.
   - **Interaktion:** tatsächliche Bedrohungen erkennen, Removal/Counter nicht an irrelevante Ziele verschwenden, Schutz und Mana für kritische Fenster zurückhalten.
   - **Sequenzierung und Ressourcen:** Länder, Manaquellen, Ramp, Kartenvorteil und Tempo sinnvoll ordnen; nicht für einzelne KI-Heuristiken die Regelengine nachbauen.
   - **Commander-Synergien:** Token-/Triggerketten, Wiederbelebung, Equipment, Partner-Commander, Opfer-Engines und einfache Kombinationslinien erkennen; **nur** anhand bereits legaler Informationen und Aktionen.
3. In Forges bestehender Java-KI zunächst einen engen, reversiblen Bewertungs-/Prioritäts-Hook suchen; vorhandene Hilfslogik wiederverwenden. Eine konkrete Änderung statt eines neuen „Universal-Strategieframeworks“.
4. Den Forge-Quellstand reproduzierbar im Magic-Repository referenzieren. **Wichtig:** Der von scripts/bootstrap-forge.sh geholte, gepinnte Forge-Unterbaum ist nicht als veränderter Quellbaum committed und der Bootstrap verweigert einen schmutzigen Checkout. Deshalb keine dauerhafte Handarbeit nur im lokalen forge/-Verzeichnis. Falls ein Forge-Upstream-Patch notwendig ist, diesen als **versionierten, idempotent angewendeten Patch gegen einen exakten Pin** speichern oder einen explizit versionierten Fork-Pin verwenden. Erst die kleinste funktionierende Variante implementieren.
5. Zuerst Java/JVM-Harness und gezielte Regression, dann den **neu gebauten** Forge-WebImage-Artefaktpfad überprüfen. Ein aktualisiertes Java-JAR aktualisiert nicht das Browser-WASM. Der produktive PWA-Builder übernimmt derzeit ein unverändertes, hashgeprüftes Forge-WebImage aus einem gepinnten OCI-Image; für neue Java-AI-Logik braucht es einen separaten, reproduzierbaren WebImage-Build. Keine ungeprüfte Binärdatei ins Release kopieren.

**Fertig, wenn:** Ein vorher reproduzierter Forge-Fehlzug im geänderten Engine-Build beseitigt ist, die bisherigen Regeln funktionieren und sich die Verbesserung in mehreren echten vollständigen Partien zeigt. Falls nur der Java-Harness verbessert wurde, bleibt der Befund ausdrücklich „JVM-only“.

**Erster P1-Nachweis (6. November 2026):** Forges `AiAttackController.choosePreferredDefenderPlayer(ai, true)` ignoriert bereits erlittenen Commander-Schaden bei der *offensiven* Gegnerwahl.

- **RED:** In einem echten Forge-JVM-Game mit drei Spielern, 40 Startlebenspunkten, einem eigenen Commander auf dem Battlefield, einem Gegner bei 20/21 Commander-Schaden und einem unbeschädigten Gegner bevorzugte Forge den beinahe besiegten Gegner **nicht zuverlässig** (z. B. 14/30 Auswahlvorgänge).
- **GREEN:** Ein minimaler, optionaler Patch gewichtet den von eigenen Commandern verursachten Schaden und bevorzugte den verwundbaren Gegner in derselben Probe **30/30-mal**. Unveränderte Spielregeln, ein abweichender AI-Score.
- **Reproduzierbarkeit:** `apps/manabrew/patches/forge-ai-commander-pressure.patch` gegen den exakten Forge-Pin, `forge-harness/src/test/java/forge/harness/common/CommanderDamageDefenderProbe.java` und `yarn test:forge-commander-pressure`. Das Skript kompiliert ein isoliertes Java-Classpath-Overlay, lässt den gepinnten Forge-Quellbaum sauber und verlangt den erwarteten RED/GREEN-Unterschied.
- **Grenzen:** Bislang **JVM-only**, kein aktualisiertes WebImage, keine iPad-/Linux-Auslieferung und kein statistischer Nachweis besserer Siegquoten.


### P2 — ManaBot zu einem schlanken strategischen Gegner ausbauen

**Vorgehen**

1. **Nicht** Forges gesamte KI nach Rust portieren. Pro Problem untersuchen: Kann dieselbe nützliche Heuristik aus Forges AI-Entscheidung abgeleitet werden, ohne versteckte Daten, Regelduplikation oder umfangreiche Karten-Sonderlogik?
2. Die bereits vorhandenen Rust-Mana-/Prioritäts-/Combat- und Targeting-Funktionen behalten. Einmalige Umsetzung sinnvoller, nachweislich fehlender Bewertungen: Gefahrenlage, Commander-Schaden, Decksynergien, Zugreihenfolge, Wert von offenen Manas und gegnerischen Boardwipes.
3. Über die existierende GameView/AgentPrompt-Schnittstelle arbeiten. Forge liefert legale Aktionen; ManaBot priorisiert sie. Keine direkte Java-Objekt-Abhängigkeit im Rust-WASM-Bot.
4. Das Cast-Override muss den **tatsächlich ausgeführten** Zauber in ManaBots Versuchsspeicher markieren (PR #77: reconcile_cast_attempt), nicht nur die zuerst vorgeschlagene Aktion; Fehler führen zur bisherigen sicheren ManaBot-Entscheidung zurück.
5. Gegen **unveränderten ManaBot und unveränderten Forge** testen; keine Fortschrittserklärung allein, weil weniger Zahlungsabbrüche auftreten oder eine Beispielkarte richtig gespielt wird.

**Fertig, wenn:** Ein konkret vorher nachgewiesener Strategiefehler dauerhaft behoben ist, echte Spiele nicht hängenbleiben und die Änderung einen erkennbaren Mehrwert gegenüber der unveränderten ManaBot-Variante liefert. Bleibt Forge stärker, wird ManaBot lediglich als alternativer Gegner angeboten.

### P3 — Lernen über Forge-Imitation hinausführen

**Vorgehen**

1. Bestehenden Forge-Lehrer (ManaBrewAiLobbyPlayer / forgeTeacherTrace) zur **korrekten Erfassung** von Spielerzustand, angebotenen Aktionen und finaler KI-Entscheidung ausbauen. Zuerst die neue Java→WebImage-Trace-Strecke isoliert E2E nachweisen; keine Umgehung der bestehenden Decision-Journal-Sperre für interne Forge-AI.
2. Nur die eigene sichtbare Hand und öffentlich zugängliche Informationen exportieren; gegnerische verdeckte Karten und Bibliotheksreihenfolge bleiben verborgen. Pro Beispiel eine eindeutige Lehrerquelle („Forge“, „ManaBot“ oder „Self-play“) dokumentieren. Modelle dürfen nicht heimlich auf ihre eigenen nachträglich geänderten Entscheidungen als Forge-Labels trainieren.
3. Vom aktuellen 22-Merkmale-Ranker schrittweise zu **zustandsbezogenen** Merkmalen erweitern: tatsächliche verfügbare Ressourcen, Bedrohungen, Gegner-Board, kritische Interaktion, Commander-Trigger, Synergieketten, Zugphase und ausgespielte/relevante Karten. Zunächst einfache und nachvollziehbare Modelle; erst bei belegtem Zusatznutzen zu einem kleinen neuronalen Netz wechseln.
4. **Imitation ist nur Vortraining.** Danach eigenes Spiel gegen Forge und frühere Modelle auswerten und mit Belohnungen wie Gewinnen, verhinderten Verlusten oder messbarem Ressourcen-/Boardvorteil optimieren; dafür können Self-play, Outcome-Ranking oder Offline-Policy-Improvement verwendet werden. Zuerst einen kleinen reproduzierbaren Versuchsaufbau, kein verteiltes RL-System.
5. Trainieren ausschließlich offline; das iPad benötigt nur die kompakten finalen Gewichte und eine schnelle, deterministische Inferenz. Kein Modell-Download im Spiel, keine Cloudabhängigkeit.

**Fertig, wenn:** Modelle auf **zurückgehaltenen ganzen Spielen und zuvor nicht verwendeten Commander-Archetypen** besser abschneiden als einfache Baselines; es liegen außerdem echte Spielresultate statt nur Lehrer-Übereinstimmung vor. Schlechtere/gleichwertige Modelle bleiben lokal und opt-in.

### P4 — Kontrollierter Stärkenvergleich und Freigabe

Ein Benchmark ist nur aussagekräftig, wenn der Code der **tatsächlich getesteten Version** feststeht:

- Vergleichsgegner: **Forge unverändert**, **Forge gezielt verbessert**, **ManaBot unverändert**, **ManaBot verbessert**, **ManaBot mit gelerntem Modell**. Nicht mehr Varianten parallel pflegen als für eine echte Entscheidung erforderlich.
- Persönliche Commander-Decks aus dem Repo nach Möglichkeit in mehreren Archetypen: beispielsweise Anowon, Helga, Malcolm/Breeches, Ardenn/Rograkh, Magar, Teysa, Mirri und Rin/Seri; nur gültige und tatsächlich vorhandene Listen verwenden. Mindestens ein Aggro-, Value-/Token-, Control-/Interaktions- und Synergie-/Combo-Matchup. Commander Bracket 3 soweit anwendbar.
- 1v1 für reproduzierbare Fehler; 4-Spieler-Pods für die tatsächlich gewünschte Commander-Spielstärke. Seat-/Deckrotation und ungeübte Seeds verwenden. Kein Schluss aus vier Siegen oder wenigen nachträglich ausgesuchten Duellen.
- Primärmetriken: Anteil regulär beendeter Partien, Siege nach Deck/Sitz/Gegner, ungeeignete/abgebrochene Zahlungen, echte illegale Aktionen, durchschnittliche und hohe Entscheidungs-Latenzen, CPU-/Speicherbedarf im Browser. Lehrer-Imitation nur als Nebengröße.
- Erst eine kleine Screening-Serie; bei positivem Signal die Anzahl unabhängiger vollendeter Partien so weit erhöhen, dass der Vorteil auch nach Aufteilung nach Deck/Sitz und mit Unsicherheitsintervallen glaubhaft bleibt. Keine willkürliche 51-%-Siegquote als Freigabe.
- Prüfung auf echten Nutzereingaben: ausgewählte KI-Version installieren, Partie ohne Netz vollständig spielen, Neustart/Cache-Upgrade und Game-over-/Menü-Rückkehr testen; Linux-Chrome und bei iPad-Releases reales Safari-/WebKit-Home-Screen-Verhalten separat belegen.

**Freigaberegel:** Forge bleibt Standard, bis ein neuer Gegner auf unterschiedlichen Decks robust mindestens gleichwertig funktioniert und entweder **klar messbar stärker** ist oder als bewusst anders spielender, stabiler alternativer Modus einen echten Nutzen bietet. Den derzeitigen experimentellen Learned-Policy-Schalter nicht automatisch produktiv aktivieren.

## 4. Konkreter Einstieg für den nächsten Arbeitslauf

Der nächste Operator arbeitet ohne neue Architekturdebatte diese Reihenfolge ab:

1. **P0 klären:** Aktuelle PR- und Release-Kette sowie die zwei offenen X-Mana-Fälle aus #76 frisch prüfen; nur bestätigte Ursachen beheben; echtes Offline-Commander-Spiel auf aktiver Version belegen.
2. **Fehlzug auswählen:** Eine relevante, reproduzierbare Forge-Fehlentscheidung aus einem vorhandenen persönlichen Commander-Matchup isolieren. Aktionsangebot, sichtbaren Zustand, Forges Auswahl und tatsächlich bessere legale Alternative festhalten.
3. **Mini-Änderung:** In der bereits vorhandenen Forge-AI-/Harness-Struktur die kleinste Änderung anbringen, die diesen Fehlzug korrigiert. Eine Regression und vollständige Partie gegen die unveränderte Version ausführen; WebImage-Build erst, wenn JVM-Beleg trägt.
4. **Transferentscheidung:** Prüfen, ob derselbe strategische Vorteil bei ManaBot mit einer kleinen GameView-Heuristik oder einem neuen Trainingsmerkmal besser/leichter erreichbar ist. Nur bei belegtem Zusatznutzen doppelt implementieren.
5. **Ergebnis dokumentieren:** Commit/PR-Head, Build-/WASM-Hash, konkrete vorher/nachher-Spielbelege, Messwerte, Rückfallstand und verbleibende Grenzen in diesem Plan oder der bestehenden Benchmark-Dokumentation aktualisieren. Kein neues Ticket als Ersatz für ausführbaren Code.

## 5. Technische Einstiegspunkte und Quellen

- Forge-AI: Forge-Quellen unter apps/manabrew/forge/forge-ai/ (lokal bootstrapped, **nicht** direkt als geänderter Magic-Inhalt versioniert); insbesondere forge.ai.AiController und forge.ai.PlayerControllerAi.
- Forge-Host für KI-Sitzplätze und Lehrertrace: apps/manabrew/forge-harness/src/main/java/forge/harness/host/ManaBrewAiLobbyPlayer.java.
- ManaBot: apps/manabrew/manabrew-rs/crates/manabot/src/agent/simple_ai.rs; WASM-Eintritt unter manabrew-rs/crates/wasm/src/bot_api.rs.
- Gelernter Ranker, Trainer, Ergebnis-Messung: apps/manabrew/scripts/engine-bench/learned-policy.mjs, train-learned-policy.mjs, manabot-game.mjs, manabot-pop.mjs, forge-jvm-game.py und [LEARNED_POLICY.md](../../apps/manabrew/scripts/engine-bench/LEARNED_POLICY.md).
- Reproduzierbarer Browser-Build: apps/manabrew/scripts/bootstrap-forge.sh, bootstrap-webimage.sh, build-forge-wasm.sh, build-ipad-offline.sh. **Java-Harness, Forge-WebImage und Rust-WASM sind unterschiedliche Artefakte.**
- Produktiver Nutzerweg und Rückfallstände: [Manabrew-Betriebsdokumentation](README.md).

## 6. Arbeitsprinzipien und Grenzen

- **Funktionierendes Solospiel vor Forschung.** Änderungen nur bei nachgewiesenem Nutzwert, Forge-Standard und produktive Offline-App bleiben bis zum erfolgreichen echten Clienttest erhalten.
- Ein verantwortlicher Writer für Repo-/Runtimeänderungen; konkurrierende belegte Branches nicht überarbeiten. Reversible kleine Änderungen eigenständig durchführen; erhebliche irreversible Eingriffe nur mit notwendiger Autorisierung.
- Bei Tests echte Engineentscheidungen und Regelgrenzen prüfen, keine Manipulation durch verborgene Informationen. Eigene Deckdaten und rohe Spieltraces bleiben lokal, keine persönlichen Daten im Git-Commit.
- Upstream- und Lizenzbedingungen (AGPL) beachten. Keine Neuimplementierung der Regeln für „strategische“ Abkürzungen.
- Dieser Plan wird an **belegten Ergebnissen** angepasst; nicht jede vorgeschlagene Phase ist automatisch ein Bauauftrag. Weniger komplex ist besser, sofern mindestens gleich gut spielbar.