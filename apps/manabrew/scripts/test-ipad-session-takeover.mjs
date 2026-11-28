import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = new URL(process.argv[2] ?? "http://127.0.0.1:8088").origin;
const timing = process.argv[3] ?? "during";
assert.ok(["before", "during"].includes(timing), "Expected before or during");
const kind = process.argv[4] ?? "takeover";
assert.ok(["takeover", "not-in-room"].includes(kind), "Expected takeover or not-in-room");
const relayError = kind === "not-in-room";
const event = relayError
  ? { type: "Error", code: "not_in_room", message: "You are not in a room" }
  : { type: "SessionTakenOver" };
const manifestResponse = await fetch(origin + "/offline-assets.json", { cache: "no-store" });
assert.ok(manifestResponse.ok, "Expected a built offline PWA");
const manifest = await manifestResponse.json();
const assets = new Set(manifest.files.map((file) => new URL(file.url, origin).pathname));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--liftoff-only"],
});
try {
  // Fresh, ephemeral storage. Do not connect to the real relay or hub and do
  // not touch the user's installed offline cache or recovery checkpoints.
  const context = await browser.newContext({
    viewport: { width: 1180, height: 820 },
    isMobile: true,
    hasTouch: true,
    serviceWorkers: "block",
  });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const localNavigation =
      route.request().isNavigationRequest() &&
      ["/play", "/play/offline/constructed", "/"].includes(url.pathname);
    return url.origin === origin &&
      (assets.has(url.pathname) || localNavigation || url.pathname === "/offline-assets.json")
      ? route.continue()
      : route.abort();
  });
  let relay = null;
  let sockets = 0;
  let closedSockets = 0;
  let roomLists = 0;
  await context.routeWebSocket(/.*/, (socket) => {
    sockets += 1;
    socket.onClose(() => {
      closedSockets += 1;
    });
    socket.onMessage((message) => {
      const msg = JSON.parse(message.toString());
      const send = (payload) => socket.send(JSON.stringify(payload));
      if (msg.type === "Authenticate") {
        relay = socket;
        send({
          type: "AuthResult",
          success: true,
          username: msg.username,
          player_id: "isolated-test-player",
          reconnected: false,
          features: [],
        });
      } else if (msg.type === "Ping") send({ type: "Pong" });
      else if (msg.type === "ListRooms") {
        roomLists++;
        send({ type: "RoomList", rooms: [] });
      }
      else if (msg.type === "ListPlayers") send({ type: "PlayerList", players: [] });
    });
  });
  const sendRelayEvent = async () => {
    const before = roomLists;
    const beforeErrors = receivedRoomErrors;
    relay.send(JSON.stringify(event));
    // NotInRoom must still reconcile the lobby. Observe the actual outgoing
    // ListRooms request, rather than passing if the error was never delivered.
    if (relayError) {
      for (let i = 0; i < 80 && (roomLists === before || receivedRoomErrors === beforeErrors); i++) {
        await new Promise((resolve) => setTimeout(resolve, 125));
      }
      assert.ok(receivedRoomErrors > beforeErrors, "Actual server error must have been delivered");
      assert.ok(roomLists > before, "Relay error must still reconcile lobby membership");
      assert.equal(closedSockets, 0, "Room error must not disconnect the socket");
    }
  };
  const page = await context.newPage();
  const errors = [];
  let receivedRoomErrors = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.text().includes("[server] error: not_in_room")) receivedRoomErrors++;
  });
  await page.addInitScript(() => {
    const Native = window.Worker;
    window.__offlineStartWorkers = [];
    window.Worker = class extends Native {
      constructor(url, options) {
        super(url, options);
        const trace = { starts: 0, terminated: false };
        const send = this.postMessage.bind(this);
        const terminate = this.terminate.bind(this);
        this.postMessage = (data, ...rest) => {
          if (data?.command === "start_game") {
            if (trace.starts++ === 0) window.__offlineStartWorkers.push(trace);
          }
          return send(data, ...rest);
        };
        this.terminate = () => {
          trace.terminated = true;
          return terminate();
        };
      }
    };
  });
  const snapshot = () =>
    page.evaluate(() => ({
      board: document.body.innerText.includes("Game board controls"),
      hand: Number((document.body.innerText.match(/Your hand, (\d+) cards?/) ?? [])[1] ?? 0),
      decisions: (window.__engineDecisions ?? []).map((entry) => entry.type).slice(-10),
      tail: document.body.innerText.slice(-1200),
    }));
  try {
    await page.goto(origin + "/play", { waitUntil: "domcontentloaded", timeout: 30000 });
    const singleplayer = page
      .locator('a[href="/play/offline/constructed"]')
      .filter({ hasText: "Singleplayer" })
      .first();
    await singleplayer.waitFor({ timeout: 30000 });
    for (let i = 0; i < 40 && !relay; i++) await page.waitForTimeout(250);
    assert.ok(relay, "The simulated relay must have authenticated first");
    await singleplayer.click();
    await page
      .getByRole("button", { name: /^Kaalia of the Vast/ })
      .first()
      .click();
    await page
      .getByRole("button", { name: /^Hearthhull, the Worldseed/ })
      .first()
      .click();
    await page
      .getByRole("button", { name: /^Fight!?$/ })
      .first()
      .click();
    if (timing === "before") {
      await sendRelayEvent();
      if (!relayError) {
        for (let i = 0; i < 40 && !closedSockets; i++) await page.waitForTimeout(250);
        assert.ok(closedSockets >= 1, "The online socket must be displaced before the game starts");
      }
    }
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /^Fight!?$/ })
      .click();
    // The active engine is starting now, or the optional seat picker is open.
    if (timing === "during" && !relayError) await sendRelayEvent();
    const seats = page.getByRole("dialog").getByRole("button", { name: /1v1/ });
    if (await seats.count()) await seats.click();
    if (timing === "during" && relayError) {
      await page.getByText("Game starting…", { exact: true }).waitFor({ timeout: 30000 });
      await page.waitForFunction(() => window.__offlineStartWorkers.length === 1, null, { timeout: 30000 });
      await sendRelayEvent();
      const afterError = await snapshot();
      assert.ok(afterError.board || afterError.tail.includes("Game starting"), "Relay NotInRoom displaced offline startup");
    }
    await page.waitForFunction(
      () =>
        document.body.innerText.includes("Game board controls") &&
        /Your hand, 7 cards/.test(document.body.innerText) &&
        (window.__engineDecisions ?? []).some((entry) => entry.type === "mulligan"),
      null,
      { timeout: 150000 },
    );
    const initial = await snapshot();
    assert.equal(initial.hand, 7);
    if (relayError) {
      // A late error must not terminate an already active local board either.
      await sendRelayEvent();
      assert.ok((await snapshot()).board, "Relay NotInRoom closed the active offline board");
    } else {
      assert.ok(closedSockets >= 1, "The displaced online socket must actually close");
    }
    // Pixi's touch layout exposes the prompt through the canvas. Space is
    // the same keep-hand action used by the existing full-game UI smoke test.
    await page.keyboard.press("Space");
    await page.waitForFunction(
      () => (window.__engineDecisions ?? []).some((entry) => entry.type === "chooseAction"),
      null,
      { timeout: 110000 },
    );
    const progressed = await snapshot();
    assert.ok(progressed.board);
    assert.equal(sockets, 1, "The relay must not replace its session");
    if (relayError) {
      assert.equal(closedSockets, 0);
      assert.deepEqual(await page.evaluate(() => window.__offlineStartWorkers), [
        { starts: 1, terminated: false },
      ], "The original Forge start worker must survive both errors");
      assert.equal(receivedRoomErrors, 2);
    }
    assert.deepEqual(errors, []);
    console.log(
      relayError ? "LOCAL_GAME_SURVIVES_RELAY_NOT_IN_ROOM" : "LOCAL_GAME_SURVIVES_RELAY_TAKEOVER",
      JSON.stringify({
        release: manifest.version,
        timing,
        kind,
        roomLists,
        initial,
        progressed,
        closedSockets,
        sockets,
        errors,
      }),
    );
  } catch (error) {
    console.log(
      "FAILED_STATE",
      JSON.stringify(await snapshot().catch(() => null)),
      JSON.stringify({ sockets, closedSockets, errors }),
    );
    throw error;
  }
} finally {
  await browser.close();
}
