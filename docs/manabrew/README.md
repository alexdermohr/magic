# Manabrew iPad/iOS und Linux

## Inventar (Stand: 3. November 2026)

Der maßgebliche Quellstand liegt ab dieser Arbeitsfassung unter
[apps/manabrew](../../apps/manabrew/). Die iPad-Version ist eine **Home-Screen-Web-App
(PWA)** und keine native, signierte iOS-App. Die Linux-Variante ist derzeit eine
lokale Chrome-App mit Webclient und Relay; daneben liegt Tauri-Desktop-Quellcode
im importierten Projekt.

| Variante | Ausgangslage auf dem Heim-PC |
| --- | --- |
| iPad-PWA | Aktiver Dienst manabrew-ipad-pwa.service, lokaler Port 127.0.0.1:8088, Dist unter ~/.local/share/manabrew-ipad-personal-v2-20261102 |
| Linux-Web | Aktiver Dienst manabrew-local-web.service; Chrome-Desktopstarter ~/.local/share/applications/manabrew-local.desktop mit http://127.0.0.1:8087/ |
| Linux-Relay | Aktiver Dienst manabrew-local-relay.service |
| Entwicklungsquellen | React/TypeScript + PixiJS, Rust-Engine, Forge-WASM, Tauri, Caddy-/Containerbeispiele |

Die Quellübernahme basiert auf Upstream-Manabrew v3.69.0, Commit
4f4ed9e784a054f076bd933ba2412c63590e0d3a, einschließlich neun
lokaler Codeänderungen und achtzehn hinzugefügter iPad-Dateien aus dem
ursprünglichen Arbeitsbaum /home/alex/repos/manabrew. Insgesamt wurden
2.923 Quelldateien übernommen. Weggelassen wurden alte Buildpakete
(je etwa 269 MiB), browserseitige Testprofile, Benutzerdaten, Git-Metadaten
und fünf temporäre Screenshots unter tmp/.

Nicht übernommene Gitlinks: forge und die Editor-Skills unter .claude/skills.
Die beigefügte .gitmodules-Datei dokumentiert das Upstream-Forge-Submodul,
initialisiert es aber **nicht** in diesem verschachtelten Magic-Projekt.
Falls ein Java-Forge-Build verlangt wird, muss die Upstream-Forge-Quelle
separat bereitgestellt werden. Die Rust-Engine hat laut Upstream selbst
noch fehlende Regeln. Für die KI-Kompatibilität daher reale Spieltests
und nicht allein einen erfolgreichen Build verwenden.

**Lizenz:** Manabrew wird unter AGPL-3.0-or-later bereitgestellt. Lizenztexte
und THIRD-PARTY-NOTICES.md sind unter apps/manabrew erhalten. Die eigene
Übernahme befreit nicht von diesen Pflichten.

## Quellcode pflegen und bauen

Alle Änderungen an der App erfolgen nun im Magic-Repository unter
apps/manabrew; der ältere Klon bleibt unangetastete Provenienz-/Rückfallquelle.
Vom Magic-Repository-Stamm aus:

    cd apps/manabrew
    # Node.js >= 24, Yarn sowie Rust, WebAssembly-Target und Forge-Abhängigkeiten
    yarn install --frozen-lockfile
    yarn typecheck
    yarn test

Ein vollständiger Webbuild erfolgt bei vorhandenen WASM- und Forge-Abhängigkeiten
durch yarn build:web. Für einen Desktop-Client dient src-tauri/ beziehungsweise
yarn build. Dies baut **nicht automatisch** den tatsächlich eingerichteten
Linux-Chrome-Starter. Die lokale Hosted-Engine-Umgebung wird in
compose.local.yml erklärt; Server-/Caddydateien stehen unter ops/.

### Persönliche Commander-Decks für den Offline-Build

    cd apps/manabrew
    python3 scripts/generate-ipad-personal-decks.py

Der Generator liest standardmäßig decks/*/current.txt im übergeordneten
Magic-Stamm und schreibt dist/personal-decks.json. Die Cachedatei liegt
unter ~/.cache/manabrew-ipad-scryfall-cards.json. Source, Ziel und Cache
können wie bisher als die drei Positionsargumente übergeben werden.
Für noch nicht bekannte Karten ist beim Erstellen ein Internetzugang
zu Scryfall notwendig. Kartenbilder/Kartensymbole werden mit
prepare-ipad-card-art.py und prepare-ipad-card-symbols.py erzeugt.

Für eine lokale PWA-Distribution existieren prepare-ipad-dist.mjs,
patch-ipad-offline-bundle.mjs und generate-offline-assets.mjs.
Die ersten beiden Skripte unterstützen insbesondere den bereits
bekannten Legacy-Release-Bundle. Der Legacy-Patcher prüft exakte
Minifizierungssignaturen und bricht bei einem anderen Upstream-Bundle
bewusst ab. Ein frischer Source-Build ist langfristig vorzuziehen;
eine vorhandene Archivkopie des alten Distribution-Builds ist kein
reproduzierbarer Buildbeweis.

### PWA-Installation

Die HTTPS-Seite /offline-setup.html in Safari öffnen, zum Home-Bildschirm
hinzufügen und dann den gesamten Offline-Download **in der installierten
Web-App** ausführen. Der Safari-Tab und eine installierte Web-App können
unterschiedliche Webspeicher besitzen. Danach Netzwerkverbindungen
deaktivieren, die Web-App vollständig schließen und über das Home-Screen-
Symbol neu starten; Commander-Duell gegen die lokale Forge-KI starten.
Der erste Download erfordert Internet, danach muss lokales Solospiel ohne
Heim-PC/öffentlichen Relay funktionieren. iPadOS kann die Daten bei
Speicherdruck löschen. Das ist im Offlinebereitstellungszustand zu beachten.

Im Quellcode sind ein Reset-zoom-Knopf und die Unterdrückung von nativen
Touch-Gesten für das Spielbrett vorgesehen. Das Offline-Reconnect-Overlay
wird für Nicht-Multiplayer-Partien ausgeblendet. Diese Änderungen wirken
erst nach **Build und Auslieferung** des geänderten Quellstands. Der
laufende Dienst zeigt derzeit weiter auf die ältere PWA-Distribution.

## Prüfumfang und Deployment

    cd apps/manabrew
    node --check scripts/prepare-ipad-dist.mjs
    node --check scripts/patch-ipad-offline-bundle.mjs
    node scripts/test-ipad-offline.mjs http://127.0.0.1:8088
    node scripts/test-ipad-full-game-ui.mjs http://127.0.0.1:8088

Die letzten zwei Befehle verlangen eine vollständig vorbereitete PWA
mit lokal installiertem Playwright. Offline-Setup testet allein Cache,
Service Worker und Kaltstart. Der Full-Game-UI-Test startet ein echtes
Commander-Duell gegen die Forge-KI, wählt Decks, akzeptiert Mulligan,
führt Spielaktionen aus und prüft das Verbleiben der Game-Over-Ansicht.

Der bestehende iPad-Dienst verwendet noch die Caddydatei im früheren
Quellklon und ein älteres Dist-Verzeichnis. Die Quellmigration stellt
den Produktionsdienst **nicht** stillschweigend um. Vor Umschalten sind
frischer Source-/WASM-Build, Browser-E2E mit offline Mulligan und Aktionen,
eine Prüfung am realen iPad samt Speicherisolation sowie ein Rückfall-Build
erforderlich. Linux-Chromium-Tests beweisen nicht das Verhalten von iPad
WebKit, der installierten PWA oder des Betriebssystem-Touchsystems.
