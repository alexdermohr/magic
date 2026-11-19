# Linux-Client, Relay und Kontoanmeldung

Dies sind die **bereinigten Vorlagen** der am 3. November 2026 auf dem Heim-PC
laufenden lokalen Web- und Relay-Container, des Caddy-Proxys und des gemeinsamen
Desktopstarters. Ihre Funktionsweise ist derzeit nachweislich mit HTTP 200
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
    install -m 644 manabrew.desktop ~/.local/share/applications/

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


## Gemeinsamer Manabrew-Client für Linux

Der aus alexdermohr/magic gebaute und über manabrew-ipad-pwa.service
ausgelieferte Client auf http://127.0.0.1:8088 enthält beide Spielwege:
**Singleplayer** gegen Forge-KI/ManaBot und **Multiplayer** über einen Relay.
Ein einziger Desktopstarter manabrew.desktop öffnet zunächst
/offline-setup.html?desktop=1&entry=play und zeigt nach der vollständigen,
automatischen Offline-Vorbereitung die bestehende Spielmoduswahl unter /play.
Ein gespeichertes Forge-Spiel wird beim Start vorrangig wieder aufgenommen.

    install -m 644 manabrew.desktop ~/.local/share/applications/
    rm -f ~/.local/share/applications/manabrew-magic-offline.desktop
    rm -f ~/.local/share/applications/manabrew-local.desktop
    rm -f ~/.local/share/applications/manabrew-account-login.desktop

**Nur nach** erfolgreichem neuen Desktop-/Offline- und Online-Test ausführen.
Bestehende Browserprofile, Offline-Caches, IndexedDB-Saves, Decks,
Accountdaten und Relay-Schlüssel bleiben unverändert. Der alte Webclient auf
Port 8087 und der Relay auf 9443/9444 können als Rückfall zunächst weiterlaufen;
sie sind **keine weiteren Desktopstarter**. Die laufende PWA auf 8088 bietet
den vorhandenen same-origin-Hub-API-Proxy (/api/*); Onlinepartien benötigen
Netzwerk und eine erreichbare Relay-Instanz. Ein echter Forge-Zweiclient-Test
bis zum Spielbrett wurde auf der aktiven PWA mit getrenntem Testrelay bestätigt;
OAuth-Anmeldung und vollständiges Spielende bleiben gesondert zu verifizieren.

Der vorhandene direkte Pfad ?desktop=1 ohne entry=play bleibt
für ältere Links und Tests erhalten und führt weiter direkt zu
/play/offline/constructed; iPad-Home-Screen-Auto-Resume bleibt unverändert.
Ein nativer Tauri-Build wird dadurch nicht behauptet.

**Login-DNS-Reparatur, 4. November 2026:** Die Authentifizierungsanbieter ließen
sich im Offline-PWA-Dienst auf Port 8088 nicht laden (HTTP 502). Das Caddy-Journal
wies `dial tcp: lookup api.manabrew.app: i/o timeout` aus: Die alte
Container-Resolverliste enthielt statt des erreichbaren LAN-Routers nur
öffentliche Ausweich-DNS-Server. Der bisherige Webclient auf Port 8087
verwendete den Router `192.168.178.1` und lieferte
`GET /api/auth/providers` mit HTTP 200. Für den iPad-PWA-Dienst wurde deshalb
nur der Podman-Start um `--dns 192.168.178.1` ergänzt; außerdem setzt der
Offline-Build jetzt `hubApiUrl: "/"` für den bereits vorhandenen
same-origin-`/api/*`-Proxy. Beim isolierten Kandidatentest antwortete
die Provider-API mit HTTP 200 und aktivem GitHub-, Discord- und E-Mail-Login.
Den aktuellen Router-DNS bei Netzumbau erneut prüfen; lokale Offline-Partien
funktionieren auch unabhängig von dieser DNS-Auflösung. Ein vollständig
abgeschlossener OAuth-Login oder eine Decksynchronisierung ist damit noch
nicht nachgewiesen.

Ein nativer Tauri-Build wird dadurch nicht behauptet.