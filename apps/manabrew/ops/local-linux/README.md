# Linux-Client, Relay und Kontoanmeldung

Dies sind die **bereinigten Vorlagen** der am 3. November 2026 auf dem Heim-PC
laufenden lokalen Web- und Relay-Container, des Caddy-Proxys und der beiden
Desktopstarter. Ihre Funktionsweise ist derzeit nachweislich mit HTTP 200
auf dem Webclient-Port 8087 erreichbar.

Die tatsächlich verwendeten Relay-Schlüssel bleiben ausschließlich außerhalb
des Repositories unter ~/.config/manabrew/relay.env. Die hier enthaltene
relay.env.example ist **keine** echte Zugangsinformation.

## Installation auf dem Heim-PC

Die folgenden Schritte sind als dokumentierter Weg gedacht, **nicht**
bereits auf dem System ausgeführt. Nur nach Prüfung des konkreten Ist-Zustands
und mit Backup der bisherigen User-Quadlets übernehmen:

    mkdir -p ~/.config/containers/systemd ~/.config/manabrew ~/.local/share/applications
    install -m 644 manabrew-local-web.container ~/.config/containers/systemd/
    install -m 644 manabrew-local-relay.container ~/.config/containers/systemd/
    install -m 644 Caddyfile ~/.config/manabrew/Caddyfile
    install -m 644 local-account.html ~/.config/manabrew/local-account.html
    install -m 644 manabrew-local.desktop ~/.local/share/applications/
    install -m 644 manabrew-account-login.desktop ~/.local/share/applications/

Vor dem Start unter ~/.config/manabrew/relay.env die Variablen
RELAY_PASSWORD und MANABREW_SERVER_KEY auf **denselben eigenen Schlüssel**
setzen. Dateirechte 0600 verwenden. Bereits vorhandene Schlüssel und
bestehende Account-/Deckdaten bei Aktualisierungen erhalten, nicht
durch die Platzhalter der Beispiel-Datei ersetzen.

    systemctl --user daemon-reload
    systemctl --user enable --now manabrew-local-relay.service manabrew-local-web.service

Die Web-App läuft auf 127.0.0.1:8087, der Relay auf 9443/9444 (nur Loopback).
Der Launcher nutzt den vorhandenen Nix-Profil-Chrome-Pfad des Heim-PCs.
Die Kontoanmeldung verwendet den gleichen lokalen Client, proxyt API-Anfragen
zur offiziellen Manabrew-API und benötigt beim Login Internet; sie legt
keine lokale Accountdatenbank an.

Diese Live-Container verwenden upstream Container-Images mit dem Tag latest.
Das ist ein dokumentierter Altzustand, **keine** reproducibly pinned
Version. Für eine spätere Umstellung auf aus magic gebaute Images sind
Build-ID/Digest, Updatepfad, E2E und Rückfallstand vorher nachzuweisen.


## Magic-Offlineclient parallel zum bisherigen Linux-Client

Der auf dem Heim-PC bereits laufende `manabrew-ipad-pwa.service` stellt **denselben
aus alexdermohr/magic gebauten Offline-Client** auch für Linux bereit:
`http://127.0.0.1:8088/play/offline/constructed`. Dieser Browser-Client
braucht während einer Partie kein Internet und keinen externen Relay.
Auf diesem Linux-Rechner läuft weiterhin der lokale Webserver auf Port 8088;
auf anderen Rechnern ist diese Loopback-Adresse nicht erreichbar.

Der zusätzliche Menüeintrag lässt sich ohne Austausch des bisherigen Clients
und ohne Änderungen an Relay-Schlüsseln installieren:

    install -m 644 manabrew-magic-offline.desktop ~/.local/share/applications/

Der Eintrag **Manabrew (Magic offline)** öffnet die Offline-Vorbereitung
im Chrome-Appfenster. Beim ersten Start die Offline-Dateien herunterladen,
danach **Spielen** wählen. Bei erneutem Aufruf prüft die App den fertigen
Cache schnell und bietet die Spielschaltfläche direkt an. Der bisherige Eintrag **Manabrew
(lokal)** auf Port 8087 bleibt für den bisherigen Web-/Account-/Relay-Betrieb
unverändert. Der zusätzliche Eintrag verwendet den bereits installierten Chrome
aus dem Nix-Profil und setzt einen laufenden PWA-Dienst auf Port 8088 voraus.
Ein nativer Tauri-Build wird dadurch nicht behauptet.