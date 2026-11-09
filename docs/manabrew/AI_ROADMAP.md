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
| Forge-Lehrer | Echte Forge-Cast-Auswahl in Java sowie im *kompilierten* produktiven Forge-WebImage `7198ebf` über headless Node-Engine bestätigt; nur eigene sichtbare Hand und legale Aktionsauswahl | 57 Samples aus 4 beendeten Commander-Partien geprüft; kein iPadOS-/Safari-Home-Screen-E2E, keine nachgewiesene höhere Siegquote |
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

**P0-Live-Nachweis (6. November 2026):** Der neue Forge-Commander-Schaden-Browser-Build (PR #77, Commit `7198ebf`, Manifest `5ecaf9e6446438062c0d`) läuft auf Port 8088 und der produktiven HTTPS-Origin. 3.346 Dateien wurden SHA-256-geprüft, 35 GitHub-Commander-Decks installiert, Offline-Kaltstarts bestanden. Ein produktives Anowon/Gahiji-Spiel endete offline nach **109 UI-Aktionen** mit stabiler Ergebnisansicht, Menürückkehr und **0 JavaScript-Seitenfehlern**. Ein Upgrade-Regressionstest bewahrte lokale Deckänderungen und ein altes Kartenbild. Der vorherige Release `b9eb3af` und das genaue Rückfall-Dropin bleiben erhalten. **Noch offen:** physisches iPadOS-Home-Screen-WebKit, statistisch belegte höhere Forge-Siegquote und Merges nach `main`. Der Forge-WebImage-Lehrertrace wurde anschließend separat im tatsächlich kompilierten Release-Artefakt nachgewiesen (siehe P3).

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
- **Grenzen zum Zeitpunkt des ersten P1-Nachweises:** Bis dahin nur JVM, noch kein neu gebautes Browser-WebImage, keine Auslieferung und kein statistischer Nachweis einer höheren Siegquote.

**P1-Fortsetzung, 6. November 2026 (isolierter PR-#77-Releasekandidat):**

- Das aus der bestehenden Upstream-CI gepinnte **Oracle GraalVM 25i3** (`jdk-25i3-25.0.4.1-ea.03`, Archiv-SHA-256 `d361eed2fd883c623c58e62acb2fd7ff2268a804efb3d4f8e7af571b17dcfdf0`) konnte auf NixOS mit GCC/Binaryen ein echtes **Forge-WebImage aus veränderten Java-Quellen** erzeugen. Der `build-forge-wasm.sh`-Build ermöglicht den vorhandenen `commander-pressure`-Patch opt-in über `MANABREW_FORGE_AI_PATCH=commander-pressure`, bestätigt den Forge-Pin und einen sauberen Quellcheckout, kopiert ausschließlich den betroffenen Java-Controller in einen temporären Buildbereich, kompiliert ihn dort und bettet die Klasse in eine **separate Kopie** der Harness-JAR ein. Die gepinnte Forge-Quelle bleibt dabei zu jedem Zeitpunkt unverändert. Java-Quelle, kompiliertes Forge-WebImage und ManaBot-Rust-WASM bleiben getrennte Artefakte.
- Frisch kompilierte Browser-Engine: `forgeharness.js.wasm`, **86.206.076 Bytes**, SHA-256 `412fe56c89068e45d83ab4c36a18ebf8e5357ef1af9f9aed9839e679b2e6ce75`. `build-ipad-offline.sh` akzeptiert dafür ausschließlich opt-in einen vorgebauten Verzeichnispfad über `MANABREW_FORGE_WEBIMAGE_DIR`; ohne diese Angabe bleibt der bisherige hashgeprüfte WebImage-Pin erhalten.
- Mit einem zuvor aus der PR-#76-Korrektur gebauten ManaBot und dem neuen Forge-WebImage endeten **4/4 Zweispieler-Commander-Partien** regulär. Eine explorative Serie mit vier persönlichen Decks und vier Spielern endete **3/4** regulär; die letzte Partie erreichte **300 Sekunden Timeout**. Beides belegt technische Funktion, weder eine allgemeine Siegquotensteigerung noch behobene Mehrspieler-Latenzen.
- Aus dem gemeinsamen Entwicklungsstand `9df58feb` (PR #77 enthält aktualisierten PR #76 einschließlich `d609dc9`) wurde ein vollständiger **Offline-PWA-Kandidat** erstellt: Manifest `5ecaf9e6446438062c0d`, **3.346 Dateien**, **393.985.028 Bytes**, **35 persönliche Commander-Decks**. Getrennte frische Chromium-156-Profile bestanden die iPad-artige Offline-Cacheinstallation samt Offline-Kaltstart, den Linux-Desktop-Erststart mit 35 Decks und dessen Kaltstart sowie den Forge-Offline-Selbsttest bis zum echten Mulligan. Anschließend endete das echte Offline-Browser-Spiel **Anowon gegen Gahiji nach 145 UI-Aktionen** durch Eliminierung, mit fünf Sekunden Ergebnisanzeige, Menürückkehr und **0 JavaScript-Seitenfehlern**.
- **Noch offen:** Kein physisches iPadOS-/Safari-Home-Screen-Spiel, keine unabhängige Bestätigung einer höheren Forge-Siegquote, kein produktives Deployment des neuen Kandidaten. Die gestapelten PRs sind noch offen; der bisherige Release `b9eb3af` bleibt auf Port 8088 aktiv und `32da4ed` samt Rückfall-Dropin erhalten.


**P1-Buildpfad-Nachtrag (6. November 2026):** Ein Review von PR #77 fand, dass der optionale Forge-Strategiepatch während des WebImage-Builds das als read-only vorgegebene `forge/` veränderte und erst per EXIT-Trap zurücksetzte. Die korrigierte Variante patcht nur eine temporäre Kopie von `AiAttackController.java`, kompiliert diese in eine Kopie des Harness-JAR und übergibt sie an GraalVM über `HARNESS_JAR`. **JVM-RED 19/30 versus GREEN 30/30**, originaler Forge-Pin und Harness-JAR unverändert. Die isolierte Compilerstrecke erzeugte ein frisches Browser-WASM (SHA-256 `31d3a0987f96a19e37a0f95bc2e6ba493ede8dc3e04a67a58850713bccf80607`), mit dem eine vollständige Anowon-/Helga-Partie regulär endete und **22/22 Forge-Lehrentscheidungen** exportiert wurden. Das beweist die neue WebImage-JAR-Kopplung und Browser-Engine, nicht den kompletten äußeren Builder, nicht das Produktivdeployment oder ein iPadOS-Home-Screen-Spiel. Details im technischen README.

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

**P3-Fortsetzung, 6. November 2026 – Forge-WebImage-Lehrer echt ausgeführt:** Das bereits produktiv ausgelieferte Forge-WASM aus `7198ebf` (SHA-256 `412fe56c89068e45d83ab4c36a18ebf8e5357ef1af9f9aed9839e679b2e6ce75`) exportierte über den vorhandenen Node/Forge-WebImage-Laufweg **57 tatsächlich angebotene, von Forge gewählte Cast-Aktionen** in **4/4 regulär beendeten** Zweispielerpartien. Persönliche Decks: Magar/Malcolm-Breeches, Teysa/Ardenn-Rograkh, Anowon/Helga, Ishai-Jeska/Krark-Sakashima; neue Seeds 25012–25015 und wechselnde Forge-Sitzposition. Die Zeilenprüfung ergab **0 unzulässige Lehrerentscheidungen**, **0 fehlende gewählte Aktions-IDs** und **0 sichtbare gegnerische Hand-/Bibliotheksidentitäten**. Traces und Deckexports verbleiben außerhalb von Git.

**Modell- und Ergebnisvergleich:** Leave-one-whole-game-out lieferte insgesamt **40/57 (70,2 %) Forge-Imitation**; das bisherige Modell erreichte auf denselben vier Spielen **32/57 (56,1 %)** und First-Cast **15/57 (26,3 %)**. Das ist ein Imitations-, kein Spielstärkenachweis. Auf acht neuen Seeds 26021–26028 gegen exakt dasselbe Forge-WebImage endeten je **8/8** Sitzrotationspartien sowohl mit unverändertem ManaBot als auch mit dem alten und dem Forge-trainierten Modell; alle drei Varianten erzielten **2:6 Siege gegen Forge**, ohne Timeouts. Damit **kein strategischer Mehrwert nachgewiesen**: Modell bleibt experimentell, Forge Standard. Es wurde weder ein Modell produktiv aktiviert noch ein neuer Release ausgerollt. Die Details einschließlich Nachvollziehbarkeit und Grenzen stehen in [LEARNED_POLICY.md](../../apps/manabrew/scripts/engine-bench/LEARNED_POLICY.md).

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

## 7. Frischer P0/P1-Produktionsstand (6. November 2026)

**Echte ausgelieferte Version:** Aus PR-#77-Head `2d44fef38e04351b62545f3fd2d112d18d170e9b` ist die neue Offline-PWA mit **38 persönlichen Decks** auf dem produktiven Port 8088 und der HTTPS-Origin aktiv. Manifest `cd95a53f1fc82ac9258a`, **3.476 Dateien, 402.413.113 Bytes**, sämtliche Dateien nach der Releasekopie per Größe und SHA-256 validiert; neues Forge-WebImage `31d3a0987f96a19e37a0f95bc2e6ba493ede8dc3e04a67a58850713bccf80607` stammt aus dem read-only respektierenden separaten Build-Overlay.

**Echte Nutzerwege:** Das isolierte 38-Deck-Release bestand Chromium-Offlinepartie (98 Aktionen), Linux-Autoersteinrichtung/Neustart, Zoom-Reset und Migrationsschutz für lokal geänderte Decks und altes Kartenbild. Nach produktiver Umschaltung bestand die echte Tailnet-HTTPS-Origin eine vollständige **offline gespielte Anowon/Gahiji-Partie nach 131 Eingaben** mit regulärer Eliminierung, fünf Sekunden Ergebnisanzeige, Menürückkehr und 0 JS-Fehlern. Auch ein neuer Linux-Chrome-Desktopstart installierte auf dem tatsächlich laufenden Dienst automatisch **38/38 Decks**, überstand den Offline-Kaltstart und ein weiteres netzloses Öffnen. Das exakte vorherige Dienst-Dropin liegt unter `~/.local/state/manabrew-release-backup/20261106-2d44fef-before.conf`; sämtliche älteren Releases bleiben unberührt.

**P0-Ende-zu-Ende-Fortsetzung, 7. November:** Auf der tatsächlich produktiven HTTPS-Origin wurde zusätzlich ein vollständiges **Vier-Spieler-Commander-Spiel** in Chromium **366 Aktionen/333 Sekunden** ohne Netzwerk bis zu drei Eliminierungen, fünf Sekunden Ergebnisanzeige und der erfolgreichen Menürückkehr beendet, **0 JavaScript-Fehler**. Das native Pixi-Game-over-Enter-Kommando ersetzt in den UI-Regressionsskripten den größenabhängigen Pixelklick. Vom **physischen iPadOS-Gerät** aus wurden echte HTTPS-Verbindung, Zertifikatsprüfung, Installer-HTTP-200 und das genaue Manifest `cd95a53f1fc82ac9258a` mit 3.476 Assets/402.413.113 Bytes erfolgreich gelesen. Nur **Safari-/Home-Screen-WebKit-Installation und Offlinepartie auf diesem Gerät** bleiben als separate Geräteabnahme offen. Bei der GitHub-Integration ist ein Captain-Preflight für PR #74 weiterhin mangels frischer, diff-gebundener Review-/Autorisierungsnachweise blockiert; nicht durch einen direkten Merge umgehen. Die Testbelege stehen im [README](README.md).

**Nicht als erledigt markieren:** Kein echtes Safari/Home-Screen-Spiel auf dem physischen iPad, keine bewiesene allgemeine KI-Siegquotensteigerung und noch keine Integration der offenen PRs #74/#76/#77 in `main`. Die gelernte Policy bleibt opt-in/experimentell; die neue nachweislich gebaute Forge-KI bleibt Standard. Details und Belege: [Betriebsdokumentation](README.md).

**Zusätzliche native iPadOS-WebKit-Prüfung, 7. November:** Auf dem physischen iPad wurde die echte produktive PWA außer per HTTPS auch in einem eigenen unsichtbaren `WKWebView` geladen. Die React-Deckauswahl funktionierte, `crossOriginIsolated`, `SharedArrayBuffer`, `Atomics` und `Worker` waren vorhanden; Starter-Commander ließen sich über die UI bis `Game starting…` auswählen. Ein realer Forge-Mulligan wurde im eingebetteten WKWebView **nicht** erreicht. Zudem fehlte dort `navigator.serviceWorker`, was wegen der separaten Juno-App-Berechtigung **kein Safari-/Home-Screen-Fehlernachweis** ist. Das native Gerät bestätigte damit Rendering und UI, nicht die dauerhafte Offline-Spielbarkeit. Ein Quellfix gibt bei fehlender Service-Worker-/Cache-API die direkte Safari-/Home-Screen-Anleitung aus; Browserregression bestanden. Der veröffentlichte 38-Deck-Release und dessen Rückfallstand bleiben unverändert. Details: [README](README.md).

## 8. Tatsächlich produktiver P0-Fortschritt nach iPad-Installer-Fix (7. November 2026)

Die ältere in Abschnitt 7 genannte Manifestversion `cd95a53f1fc82ac9258a` ist seit der erfolgreichen produktiven Umschaltung **nicht mehr der aktive Stand**. Der jetzt ausgelieferte, vollständig geprüfte HTML-only-Release `e55f0631bfad4b55a8005c08b1b56f78f86d4081` verwendet Manifest **`c002aa657d6a7685b3f6`**: 3.476 Offline-Dateien/402.413.326 Bytes, nur die Installer-HTML-Datei im Vergleich zum Vorgänger verändert. Forge-WASM und alle 38 Commander-Decks sind unverändert. Das exakte vorherige systemd-Dropin wurde unter `~/.local/state/manabrew-release-backup/20261107-e55f063-before.conf` gesichert; produktiver Dienst aktiv, kein Neustartzähleranstieg.

Frischer Nutzwert-Nachweis: **Produktives Tailnet-HTTPS** mit neu installiertem 38-Deck-Offline-Browserprofil, anschließendem Offline-Kaltstart und einer regulär abgeschlossenen Anowon/Gahiji-Partie (**104 Eingaben**, Ergebnis fünf Sekunden, Rückkehr ins Menü, **0 JS-Fehler**). Produktiver Linux-Client: neues 38-Deck-Profil und Offline-Kaltstart; anschließend vollständiger echter Vier-Spieler-Pod (**259 Aktionen**, drei Eliminierungen, Ergebnis fünf Sekunden, Menürückkehr, **0 JS-Fehler**). Reales Update eines alten `cd95`-Cacheprofils auf `c002` erfolgreich, lokal angepasste Commander-Decks und älteres Artwork im erneuten Installationslauf bewahrt. Neue Accessibility-Eingabe im Vier-Spieler-Browserharness erlaubt reguläre Kartenauswahl-Prompts ohne direkten Engineeingriff. **Noch offen:** Safari-Home-Screen-Installation/400-MB-Persistenz/echte Offlinepartie auf dem physischen iPad, statistisch bewiesene KI-Siegquotensteigerung sowie autorisierte Integration von PR #74/#76/#77 in `main`. Details: [Betriebsdokumentation](README.md).

## 9. P2: ManaBot-Commander-Zielwahl gegen echte Vier-Spieler-Baseline (7. November 2026)

**Reproduzierbarer taktischer Fehler:** In einer öffentlichen Drei-Spieler-`GameViewDto`-Entscheidung steht ein eigener Commander mit Stärke 2 vor einem Gegner mit bereits **20/21 Schadenspunkten genau dieses Commanders**, während ein anderer Gegner weniger Lebenspunkte besitzt. Die frühere ManaBot-`attack_target_score`-Logik berücksichtigte nur gegnerisches Board und Lebenspunkte und bevorzugte deshalb den anderen Gegner. Die schmale Änderung an `apps/manabrew/manabrew-rs/crates/manabot/src/agent/simple_ai.rs` wertet für den tatsächlich angreifenden Commander den **öffentlich sichtbaren, für dessen eigene Karten-ID aufgezeichneten** Schaden. Ein Schlag, der 21 Commander-Schaden erreicht, erhält eine hohe Priorität; Doppelschlag wird berücksichtigt. Der Wert wird **nicht zwischen Partner-Commandern übertragen**. Daneben wird vor der Angriffszielwahl die vorhandene `should_attack`-Bewertung des konkreten Angreifers geprüft: Ein Spieler mit einem überlegenen untappten Blocker darf keine sichere Alternativattacke verhindern. Karten- und Kampfregeln bleiben bei Forge, keine versteckten Informationen oder zusätzliche Sonderkarten.

**Reelle Regressionsnachweise:** `cargo test -p manabot --lib --no-default-features` ergab **34/34 bestanden**, einschließlich neuer Fixtures für Commander-Schaden 20/21 gegen niedrigeren Lebensstand, Partner-IDs, Doppelschlag und den tödlichen Blocker. `cargo fmt -p manabot -- --check` unter Nix-Rustfmt: bestanden. Die Varianten wurden als **isolierte Rust-WASM-Artefakte** kompiliert; der bisherige PWA-Release `c002aa657d6a7685b3f6` und sein Defaultgegner **Forge** wurden nicht verändert. Baseline-`src/wasm/wasm_bg.wasm` SHA-256 `1e9916f2be32f329b14bc9ad62e314b9063033016178095bc186677ede1b080d`; erste Commander-Variante (ohne sichere Zielauswahl) SHA-256 `34aa988bd0c901cf6ff3fefe3337507d5d65a04df961e331373f52393970ecd6`; Variante **mit Blocker-Gegenprobe** SHA-256 `cc0e5991d3aaed8d0d39bb39b6a15afc719baf9b1c73712ff9980c3a3bed658a`. Alle Kandidaten liegen ausschließlich lokal unter `~/.local/state/manabrew-ai-commander-pressure*-wasm-20261107/` und werden weder als produktiv noch als standardmäßig aktiviert bezeichnet.

**Gegenproben mit echter, unveränderter Forge-WASM-Regelengine und vier ManaBot-Sitzen** (`manabot-pop.mjs --wasms <candidate>,src/wasm --seats 4`, identische Sitzverteilung, pro Seed vier verschiedene Commander-Decks, Kandidat als A):

| Kandidat und Decksatz | Seeds | Entschieden | A : B | Nicht entschieden |
| --- | --- | ---: | ---: | ---: |
| Nur Commander-Schaden; Arahbo/Rin and Seri/Ishai-Jeska/Ardenn-Rograkh | 38011–38018 | 7 | **2 : 5** | 1 Timeout |
| Commander-Schaden + sichere Angriffsziele; dieselben Decks, neue Seeds | 38111–38122 | 10 | **5 : 5** | 2 Timeouts |
| Zweite Variante; Anowon/Helga/Malcolm-Breeches/Magar | 38221–38226 | 2 | **keine belastbare Wertung** | 4 Zeitlimits |

Die letzte, ursprünglich zwölf Partien umfassende Serie wurde nach **4/6 mit dem 180-Sekundenlimit nicht abgeschlossenen Partien** begründet beendet, anstatt Kosten für einen nicht auswertbaren weiteren Siegquotenvergleich zu verursachen. Die beobachteten, vor dem Zeitlimit noch laufenden Partien erreichten teils Zug 30–40 mit Kartenaktionen; **Timeout ist nicht automatisch Engineabsturz**, aber ein offenes Vier-Spieler-Performance-/Spielstärke-Problem. Unveränderte Rohbelege liegen lokal unter `~/.local/state/manabrew-commander-pressure-ab-20261107-38011/`, `~/.local/state/manabrew-commander-pressure-guard-ab-20261107-38111/` und `~/.local/state/manabrew-commander-pressure-guard-heldout-20261107-38221/`. Die erste und zweite Variante verwenden **unterschiedliche Seeds**, weshalb der Unterschied 2:5 vs. 5:5 **keine ursächliche Verbesserung durch die Blocker-Korrektur beweist**.

**Entscheidung:** Das konkrete Angriffszielproblem ist durch öffentliches DTO und echte Unit-Regression **funktional korrigiert**. Die begrenzten A/B-Daten zeigen **keine signifikant bessere allgemeine Siegquote**; die neue Heuristik bleibt ein überprüfbares P2-Experiment und darf **nicht** als Grund für einen Wechsel des produktiven Forge-Standards verwendet werden. Für eine belastbare Promotion müssten mehr vollständige, ungesehene und nach Sitz/Deck rotierte Partien mit passender Laufzeitgrenze vorliegen. Physische iPadOS-/Safari-Offline-Persistenz bleibt unabhängig davon offen. Der neue Produktivrelease `c002` wurde auch **direkt auf dem echten iPad** als TLS-Manifest und als Safari-Hinweis in einer separaten Juno-`WKWebView` nachgewiesen, nicht als vollständige Safari-Home-Screen-Partie.

**Zusätzliche Nachweise zu P2 und iPad-WebKit-Vordergrund**, 7. November 2026: Die vier gezielten Commander-/Partner-/Blocker-Fixtures prüfen jetzt nicht mehr nur `attack_target_score_for_attacker`: In den drei Spielsituationen wird der tatsächliche öffentliche `ChooseAttackers`-Prompt an `SimpleAi.decide` übergeben, die Antwort am bestehenden `PromptInput.validate_response` überprüft und die konkreten Karten-/Spieler-Zuordnungen getestet. **34/34** Rust-Unit-Tests bestanden frisch; `cargo fmt -p manabot -- --check` ebenfalls. Das beweist die getesteten legalen Entscheidungswege, **keine höhere Siegquote**.

Der vermeintlich lang dauernde Forge-Start im nativen iPad-Juno-`WKWebView` wurde weiter eingegrenzt: `UIApplication.applicationState=2` zeigt **Hintergrundbetrieb**; WebKit meldete `document.visibilityState="hidden"` und nur **einen Animationsframe in drei Sekunden**. Die WebView-Probe ist somit kein fairer Vordergrund-Benchmark und kein Beleg für ein Safari-WASM-Problem. Safari-Home-Screen-Offlinebetrieb bleibt als echtes Gerätetestergebnis offen. Die PR-Integration bleibt ebenfalls offen: der Basis-PR #74 umfasst **2.945 Dateien** mit großen Quellimporten (1.096 Rust-/1.038 Frontend-Dateien), weshalb der erforderliche revisionsgebundene Review nicht durch einen CI- oder Deploymentstatus ersetzt werden darf.

### ManaBot-Lethal-Gruppenangriff vom 7. November 2026 – PR-Review P2 korrigiert

Ein reproduzierter **echter `SimpleAi.decide`-Fehlzug** aus PR #77: vier 2/2-Angreifer und ein Gegner mit 4 Lebenspunkten und genau einem 3/3-Blocker (ein Angriff mit allen vier Angreifern ist auch nach einem Block tödlich). Trotzdem leitete die neue individuelle `should_attack`-Sicherheitsstrafe **alle vier** Angreifer auf einen ungebockten Gegner bei 40 Leben um. Ursache: Die Einzelkarten-Zielbewertung verdrängte das bereits vorhandene `lethal_target`-Override, **bevor** dieses beim finalen Erklären der Angreifer greifen konnte.

Die kleine Korrektur wählt den bereits ermittelten gemeinsamen tödlichen Standardgegner zuerst, **nur wenn** dieser für die jeweilige Kreatur legal ist und nicht als gescheiterter Angriffszielversuch markiert wurde. In anderen Fällen bleiben individuelle Commander-Schadenswertung, Sicherheitsfilter und bestehendes Verhalten unverändert.

**Reproduzierbarer RED/GREEN-Test:** `manabrew-rs/crates/manabot/src/agent/simple_ai.rs`, Test `lethal_group_attack_survives_one_profitable_opponent_block`, über echte `PromptInput::ChooseAttackers`-, `BotAgent::decide`- und `PromptInput::validate_response`-Wege. Original: `Some("player-2")` statt `Some("player-1")` (Test FAIL). Gepatcht: vier legale Angriffe auf `player-1` (PASS). **35/35 Rust-Tests grün**, `rustfmt --check` mit Rustfmt 1.95.0 erfolgreich.

**Grenze:** Das ist eine nachgewiesene taktische Korrektur, **noch keine statistisch belegte Verbesserung der Siegquote**. Die produktive Forge-WASM, ManaBot-Baseline, persönlichen Decks und der iPad-Release wurden nicht geändert.

## iPad-P0/P1-Wiederaufnahme: Stand 8. November 2026

Die bestätigte Nutzerbeobachtung (Partie nach Appwechsel auf dem
echten iPad verloren) bleibt offen. Auf PR-#85-Quellstand wurde
die bisher ungeschützte Übergabe des Forge-Sitzlese-Workers
repariert: SAB-Quittung nach Hauptthread-Zustellung,
ein eigener Zustellzähler gegen READY/ACK-Rennen und gezielter
Neustart eines ausgefallenen Sitzlesers nach Vordergrund-Rückkehr.
Ein lokales Diagnoseprotokoll unterscheidet Dokumentschließung
von Workerfehlern. Vollständiger Offline-Releasekandidat,
240 Vitest- und 3 echte SAB-Worker-Tests sind grün;
Chromium-Offline-Partie mit BFCache/WebGL/Frozen-Resume wurde
weitergespielt, aber ein echtes physisches Safari-PWA-E2E fehlt.
Details und Belege: README.md.

**P1 ist nicht durch diesen Fix erfüllt:** Ein vollständiger
iPadOS-Prozessabbruch vernichtet den Forge-WASM-Spielzustand.
GameCheckpoint-/DecisionJournal-Replay ist vorhanden, aber die
standardmäßige interne Forge-AI von Journal/Replay ausgeschlossen.
Die nächste ursächliche Arbeit ist, zunächst einen reproduzierbaren
Rekonstruktions-Roundtrip einer tatsächlichen Forge-AI-Partie zu
ermöglichen: Lauf starten, Entscheidungen und Engine-Identität
aufnehmen, Prozess beenden, mit geprüftem Zufallszustand,
Spielzonen, Stack und Hidden-Information rekonstruieren, danach
eine weitere gültige Entscheidung ausführen. Erst dann eine
atomare IndexedDB-Persistenz und Resume-Bedienung in den
produktiven Offline-Client integrieren. Kein Schein-Resume nur
durch Wiedergabe des letzten gerenderten Boards.


**Finaler Kandidat:** Manifest 375316ebdefeca4c7e67 mit 38 Decks;
Chromium-Offline-Spiel bis zum echten Ende (105 Aktionen),
BFCache-/WebGL-Wiederherstellung und Diagnose-UI unter
Settings/Preferences erfolgreich. Echte iPad-Safari-Abnahme und
dauerhafte Engine-Rekonstruktion bleiben offen.


## P1: Isolierter Forge-AI-Replay-PoC nach Engine-Prozessverlust (9. November 2026)

Der Sitzleser-Fix aus PR #85 (Produktiv-Manifest
375316ebdefeca4c7e67) ist nicht mit vollständiger Engine-Rettung
gleichzusetzen. PR #85 ist nach der isolierten Basisintegration
konfliktfrei, 35 von 35 ManaBot-Tests und GitHub-Deckvalidierung
bestanden. Die Hauptbranch-Integration und echte iPad-Safari-Abnahme
sind weiterhin offen.

Die Forge-AI-Journalfunktion ist nur über den expliziten experimentellen
Startparameter experimentalInternalAiReplay aktiviert; im normalen
Programm bleibt die Sperre aktiv. Die isolierte JVM-Probe erfasst
ein vollständiges Journal mit Zustand-/RNG-Zeugen, speichert einen
privaten Replay-Snapshot atomar, beendet die laufende Java-Engine
und rekonstruiert den Zustand in einem frischen Prozess.
Die weitere Partie wird gegen eine zuvor in der ursprünglichen
Engine aufgezeichnete Folge von Prompts und Spielersichten geprüft.
Beschädigte Snapshots werden abgewiesen.

**Frische Gegenproben:** Zwei unabhängige Seeds des einfachen
1v1-Fixtures mit jeweils 35+8 Entscheidungen sowie zwei Seeds
der persönlichen Anowon/Gahiji-Partie mit 55+20 Entscheidungen
wurden erfolgreich rekonstruiert. Eine zusätzliche echte
Disk-Restore-Gegenprobe für Seed 424244 scheiterte bei Entscheidung 26
mit **unterschiedlichem Spielzustand bei gleichem ReplayRandom-Stand**.
Eine unmittelbare Wiederholung desselben Seeds bestand. Damit ist
eine sporadische, nicht durch diesen RNG-Strom erklärte
Nichtdeterministik nachgewiesen; die konkrete Ursache bleibt offen. Deshalb bleibt der Pfad
experimentell und ist produktiv deaktiviert.

**Gegenprobe zur Ursache (9. November):** Die Standard-JVM
startet für Forge-KI-Abwägungen einen separaten Evaluations-Thread,
dessen ThreadLocal-MyRandom ohne Initialisierung einen SecureRandom
erhält. Zusätzlich beeinflussen reale Uhrzeitbudgets die Aktionswahl.
Das erklärt eine mögliche Nichtdeterministik trotz unverändertem
ReplayRandom-Zähler. Das bereits vorhandene Forge-WebImage setzt
forge.synchronous=true beim Boot vor dem ersten ThreadUtil-Zugriff.
Drei Seeds jeweils der einfachen und persönlichen Commander-
JVM-Replayprobe bestanden im synchronen Modus. Dasselbe galt für
getrennte Kandidaten mit explizit weitergereichtem AI-RNG
beziehungsweise synchronem KI-Eval ohne Uhrzeit-Abbruch.
Die konkrete Ursache der früheren Einzelabweichung bleibt
nicht abschließend bewiesen. Der Opt-in-Replay-Adapter verweigert
deshalb jetzt unsynchrone JVM-Sitzungen; eine eigene Negativprobe
bestätigt die Ablehnung, drei vollständige positive Seedreihen
bestanden danach.

**Offene Produktarbeit:** Eine vollständige, versionsgebundene
Forge-WebImage-Kompilierung, sequenz- und checksumgebundene
IndexedDB-Journale, Durable-ACK erst nach Commit,
Persistenz bei Browserneustart, verifizierte Wiederherstellung
nach gezieltem Worker-Ende und nach echtem Safari-Prozessabbruch,
sowie Resume-UI. Keine Wiederaufnahme behaupten, solange der
vollständige Zustands-/RNG-Abgleich nicht erfolgreich ist.
Details: apps/manabrew/docs/DECISION_REPLAY.md.
