# Manabrew für iPad/iOS und Linux

## Bestand und Quellen (3. November 2026)

Die Anwendung wird unter [apps/manabrew](../../apps/manabrew/) im Magic-Repository gepflegt. Der iPad-Client ist eine **installierbare Web-App (PWA)**, keine signierte native iOS-App. Linux nutzt bisher einen lokalen Chrome-Webclient und einen Relay; der mitgelieferte Tauri-Quellcode ermöglicht zusätzlich einen nativen Desktop-Build, der hier noch nicht nachgewiesen wurde.

| Komponente | Belegter Heim-PC-Zustand |
| --- | --- |
| iPad-PWA | Dienst manabrew-ipad-pwa.service auf 127.0.0.1:8088; seit 3. November aus magic gebauter Release a6e3d3cf866fcf4a9e52; alter Release als Rückfallstand erhalten |
| Linux-Web | Aktiver manabrew-local-web.service auf 127.0.0.1:8087 und Chrome-Desktopstarter manabrew-local.desktop |
| Linux-Relay | Aktiver manabrew-local-relay.service auf den Loopback-Ports 9443/9444 |
| Neue Quellen | React/TypeScript, PixiJS, Rust-WASM, Forge-WebImage, Tauri, PWA-Skripte, bereinigte Linux-Betriebsvorlagen |

Die Quellübernahme basiert auf Manabrew v3.69.0, Upstream-Commit 4f4ed9e784a054f076bd933ba2412c63590e0d3a, einschließlich der neun lokalen Änderungen und achtzehn ergänzten iPad-Dateien des früheren Arbeitsbaums. Es wurden ursprünglich 2.923 Dateien übernommen; persönliche Profile, Secrets, alte Dist-Archive, temporäre Screenshots und Git-Metadaten wurden nicht importiert.

Der nicht als Gitlink importierte Forge-Unterbaum wird vom Skript scripts/bootstrap-forge.sh mit dem exakten Upstream-Commit be9e0c8a5b561ae3e909c2f9a8bdac0a7fa2b097 nachgeladen. Die Java/GraalVM-Forge-WebAssembly-Laufzeit wird **nicht** aus Java-Quellen neu kompiliert, sondern mit scripts/bootstrap-webimage.sh aus dem veröffentlichten Manabrew-Webimage v3.69.0 bezogen, auf einen unveränderlichen OCI-Digest fixiert und per SHA-256 für beide Artefakte geprüft. Die eigene Rust-WASM-Bibliothek und das Frontend werden hingegen aus den hier versionierten Quellen erstellt.

Manabrew ist unter AGPL-3.0-or-later lizenziert. Lizenz und Drittanbieterhinweise wurden unter apps/manabrew beibehalten.

## Reproduzierbarer Offline-Build

Vom Stamm des Magic-Repositories:

    cd apps/manabrew
    yarn build:ipad-offline

Der Befehl ruft scripts/build-ipad-offline.sh auf.

Auf dem bereits eingerichteten Heim-PC lässt sich vorhandene Kartenbildkunst für den ersten Build wiederverwenden:

    MANABREW_ART_SOURCE="$HOME/.local/share/manabrew-ipad-personal-v2-20261102" ./scripts/build-ipad-offline.sh

Bereits heruntergeladene Kartenbilder werden unter ~/.cache/manabrew-ipad-art gespeichert und beim folgenden Vite-Rebuild wiederverwendet. Dadurch erzwingt eine Änderung an React/Pixi nicht erneut 3.070 Scryfall-Bilddownloads.

Voraussetzungen: Node.js ab 24 mit Corepack/Yarn, Rust/Cargo inklusive wasm32-unknown-unknown, Podman, Git, Python 3 und entweder Nix oder wasm-pack samt WebAssembly-Linker. Das Skript stellt über Nix bei Bedarf wasm-pack, Binaryen und lld bereit. Python Pillow wird nur beim **Neudownload** bislang fehlender Kartenbilder benötigt. Beim ersten Build werden Forge, das veröffentlichte WebImage und noch nicht gecachte Scryfall-Daten über das Internet geholt.

Das Skript führt in einer Reihenfolge aus:

1. Gepinnte Forge-Quellen und veröffentlichte Forge-WASM-Laufzeit beziehen und verifizieren.
2. Eingefrorene Yarn-Abhängigkeiten installieren, Rust-Protokolltypen und Rust-WASM mit dem Kartenarchiv bauen, TypeScript prüfen und Vite bauen.
3. Den neuen Forge-Worker erhalten, Offline-Setup und Service Worker einbauen und die eigenen aktuellen Magic-Commander-Decks einlesen.
4. Kartenbilder, Mana-Symbole und Kartenrücken aufbereiten; abschließend das inhaltsadressierte Offline-Manifest erzeugen.

Das Ergebnis liegt in apps/manabrew/dist. Der am 3. November 2026 ausgelieferte Build a6e3d3cf866fcf4a9e52 enthält **3.338 Offline-Dateien mit 393.290.788 Bytes**, 35 persönliche Commander-Decks, 1.535 vollständige Kartenbilder, 1.535 separat lokal gespeicherte Artwork-Crops und ein Forge/Rust-Kartenarchiv mit 33.977 Karten. Deckdaten stammen aus decks/*/current.txt im Magic-Repository und verwenden den Metadatencache ~/.cache/manabrew-ipad-scryfall-cards.json. Beim Quellbuild wird VITE_SCRYFALL_ASSET_BASE=/ gesetzt, damit Mana-Symbole und der Kartenrücken über die bereits heruntergeladenen lokalen Dateien geladen werden.

Der frühere Legacy-Patcher scripts/patch-ipad-offline-bundle.mjs bleibt zur Wiederherstellung älterer Release-Bundles erhalten. Er erwartet konkrete Minifizierungssignaturen und ist **nicht** der Quellbuild-Pfad. Das Skript scripts/prepare-ipad-dist.mjs unterstützt dagegen die neue und die ältere Build-Variante.

### Lokal unter Linux starten

Nach dem Build kann der Client auf dem Heim-PC ohne zusätzliche Container auf Loopback gestartet werden:

    node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8095

In Chrome http://127.0.0.1:8095/offline-setup.html öffnen. Der Preview-Server setzt die für Forge-WASM nötigen Cross-Origin-Opener-/Embedder-Header. Für einen dauerhaften Linux-Webdienst Caddy bzw. die vorhandenen Quadlets verwenden, nicht den Vite-Preview-Server zum öffentlichen Server erklären. Die bereinigten Laufzeitvorlagen und die bisherige lokale Kontoanmeldung stehen unter [ops/local-linux](../../apps/manabrew/ops/local-linux/).

Die Laufzeit-Relay-Schlüssel sind **nicht** im Repository. Die vorhandenen Linux-Web-/Relay-Dienste und Desktopstarter werden durch den Build nicht ausgetauscht.

### Installation der iPad-PWA

Die bereitgestellte HTTPS-Seite /offline-setup.html in Safari öffnen und zum Home-Bildschirm hinzufügen. Den Download aller Offline-Dateien **in der installierten Home-Screen-App** ausführen. Safari und die installierte PWA können getrennte Speicherbereiche haben. Danach WLAN/Mobilfunk ausschalten, die PWA vollständig schließen, wieder öffnen und ein eigenes Commander-Deck gegen die lokale Forge-KI starten.

Das Offline-Solospiel darf nach Installation weder den Heim-PC noch einen öffentlichen Relay benötigen. Online-Multiplayer und Account-Synchronisierung brauchen weiterhin eine Internetverbindung. iPadOS kann den PWA-Cache bei Speicherdruck löschen; bei einem Paket von rund 393 MB bleibt eine echte Speicher-/WebKit-Prüfung auf dem iPad notwendig.

## Tests und nachgewiesene Ergebnisse

Beim Testen des gebauten Webclients sind Cross-Origin-Isolation (COOP/COEP) sowie ein zuvor installierter vollständiger Offline-Cache nötig. Die Playwright-Skripte verwenden PLAYWRIGHT_MODULE, PLAYWRIGHT_CHROMIUM_EXECUTABLE und MANABREW_TEST_PROFILE, wenn diese Umgebungsvariablen gesetzt sind.

    node node_modules/vitest/vitest.mjs run
    node scripts/test-ipad-service-worker-cache.mjs
    node scripts/test-ipad-standard-web-navigation.mjs
    python3 scripts/test-ipad-art-crop.py
    node scripts/test-ipad-offline.mjs http://127.0.0.1:8095
    node scripts/test-ipad-fast-relaunch.mjs http://127.0.0.1:8095
    node scripts/test-ipad-personal-game.mjs http://127.0.0.1:8095
    node scripts/test-ipad-full-game-ui.mjs http://127.0.0.1:8095
    node scripts/test-ipad-zoom-reset.mjs http://127.0.0.1:8095

**Frisch aus Magic gebauter und geprüfter Stand, 3. November 2026:** Alle 212 Vitest-Tests erfolgreich. Nach vollständig offline vorbereitetem Cache startete der Chromium-Browser ohne Verbindung und fand 35 GitHub-Decks. Drei wiederholte PWA-Starts verwendeten jeweils sechs Cache-Lookups; die manuelle Vollprüfung untersuchte weiterhin alle 3.338 Dateien. Ein Partner-Duell Ardenn/Rograkh gegen Malcolm/Breeches erreichte Starthand, Mulligan, Spielbrett und weitere Aktionen. Im isolierten Caddy-/Podman-Kandidaten erreichte ein vollständiges Solo-Duell Anowon gegen Gahiji nach **105 Spielaktionen** die reguläre Eliminierung; die Ergebnisansicht blieb fünf Sekunden stehen und die Rückkehr ins Menü funktionierte. Der Pinch-Zoom-Test bestätigte den thematisierten Resetknopf, stabile Zoomstellung trotz ResizeObserver-Updates, Touch-Action und die lokal verfügbare Kartenrückseite (HTTP 200). Alle sechs Caddy-E2E-Szenarien (Kaltinstallation, Warmstart, Wiederholung, eigene Partie mit Artwork-Crop, Zoom und vollständiges KI-Spiel) bestanden ohne JavaScript-Seitenfehler. Zusätzlich wurde die echte Tailnet-HTTPS-Origin auf Port 8443 in Chromium neu installiert, bei deaktivierter Verbindung neu geöffnet und ein eigenes Partner-Commander-Duell über Mulligan bis Main 1 erfolgreich gestartet.

Die zwei anfangs blockierenden Forge-Informationsprompts (KI-Kartenwarnung und Würfelereignis) werden nur **beim Spielstart** automatisch quittiert. Spätere informative Spielentscheidungen werden weiterhin der Oberfläche übergeben. Der Offline-Vorladevorgang blockiert den Spielfeldstart nicht mehr bis sämtliche Decktexturen fertig sind. Der manuelle Cache-Gesamttest bleibt verfügbar.

### Laufender Release und Rückfall

Der iPad-HTTPS-Livedienst (Tailnet-Port 8443, Weiterleitung auf Loopback-Port 8088) verwendet jetzt die statische, bei der Bereitstellung unverändert kopierte Distribution unter ~/.local/share/manabrew-ipad-magic-a6e3d3cf866fcf4a9e52/dist. Die Caddy-Konfiguration wurde aus dem versionierten apps/manabrew/ops/manabrew-ipad.Caddyfile in diesen Release kopiert. Der bestehende systemd-Benutzerdienst wird ausschließlich durch ~/.config/systemd/user/manabrew-ipad-pwa.service.d/10-magic-release.conf übersteuert. Seine ursprüngliche Unit, der ältere 269-MB-PWA-Release und der Linux-Web-/Relay-Betrieb bleiben erhalten.

Rückfall auf den unveränderten Altstand:

    mv ~/.config/systemd/user/manabrew-ipad-pwa.service.d/10-magic-release.conf ~/.config/systemd/user/manabrew-ipad-pwa.service.d/10-magic-release.conf.disabled
    systemctl --user daemon-reload
    systemctl --user restart manabrew-ipad-pwa.service

**Prüfgrenzen:** Die Tests, einschließlich des erfolgreichen echten HTTPS-Origins, wurden unter Chromium auf Linux mit emulierten Touch-Gesten durchgeführt, **nicht** auf physischem iPadOS/Safari WebKit. Die lokale Offlinefähigkeit ist nachgewiesen, die tatsächliche langfristige Speicherpersistenz im installierten iPad-Home-Screen-WebKit und dessen Touch-Rendering dagegen noch nicht. Die native Tauri-Linux-Verpackung und die Online-Account-/Multiplayer-Wege des neuen Builds wurden nicht Ende-zu-Ende getestet.
