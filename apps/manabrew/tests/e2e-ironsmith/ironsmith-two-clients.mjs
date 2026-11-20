// Two-human end-to-end test for the Ironsmith trusted runtime — exercises the
// encrypted room-relay path (ECDH hello + per-seat AES-GCM state/prompt), which
// the host+bot smoke test does NOT cover (bot seats are local to the host).
//
// Host creates an Ironsmith room + picks a deck; a second browser context joins
// as a real guest seat and picks a deck; host starts. Asserts BOTH clients reach
// a live board — the guest's board can only appear via decrypted relay overlays.
//
// Usage: node tests/e2e-ironsmith/ironsmith-two-clients.mjs
//        DECK="Mono Red Prison" FORMAT=Vintage SHOT=/tmp/shots node .../ironsmith-two-clients.mjs

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import {
  launchOpts,
  uniqueName,
  onboard,
  connectLocal,
  createRoom,
  pickPreset,
  deckButton,
} from "./lib.mjs";

const ENGINE = process.env.ENGINE || "Ironsmith";
const DECK = process.env.DECK || (ENGINE === "Forge" ? "Ashling, the Limitless" : "Mono Red Prison");
const FORMAT = process.env.FORMAT || (ENGINE === "Forge" ? "Commander" : "Vintage");
const SHOT = process.env.SHOT || null;
const ROOM = "IronsmithPair" + Date.now().toString(36).slice(-4);

const browser = await chromium.launch(launchOpts());
const mkPage = async () =>
  (await browser.newContext({ viewport: { width: 1300, height: 850 } })).newPage();

const onBoard = async (page) =>
  /\/play|\/game/.test(page.url()) && (await page.locator("canvas").count()) > 0;

try {
  const host = await mkPage();
  const guest = await mkPage();

  const hostName = uniqueName("Host");
  const guestName = uniqueName("Guest");

  await onboard(host, hostName);
  await connectLocal(host, hostName);
  await createRoom(host, { name: ROOM, engine: ENGINE, format: ENGINE === "Forge" && FORMAT === "Commander" ? undefined : FORMAT });
  await pickPreset(host, () => deckButton(host).click(), DECK);

  // Guest joins the room from the lobby.
  await onboard(guest, guestName);
  await connectLocal(guest, guestName);
  await guest.goto((process.env.BASE || "http://localhost:1420") + "/lobby", {
    waitUntil: "networkidle",
  });
  await guest.waitForTimeout(1500);
  const row = guest.locator(`text=${ROOM}`).first();
  await row.waitFor({ timeout: 10000 });
  await guest
    .getByRole("button", { name: /^Join$/ })
    .first()
    .click();
  await guest.waitForTimeout(2000);
  await pickPreset(guest, () => deckButton(guest).click(), DECK);

  // Guest marks ready — the host's Start button is gated on it.
  const ready = guest.getByRole("button", { name: /^Ready(?: up)?$/i });
  if (await ready.count()) await ready.click();
  await guest.waitForTimeout(1000);

  // Host starts once both seats are decked and the guest is ready.
  await host.waitForTimeout(1000);
  await host.getByRole("button", { name: /^Start\b/i }).first().click();
  await Promise.all([
    host.waitForFunction(() => document.body.innerText.includes("Game board controls"), null, { timeout: 180000 }),
    guest.waitForFunction(() => document.body.innerText.includes("Game board controls"), null, { timeout: 180000 }),
  ]);

  if (SHOT) {
    await host.screenshot({ path: `${SHOT}/two-host.png`, fullPage: true });
    await guest.screenshot({ path: `${SHOT}/two-guest.png`, fullPage: true });
  }

  const hostOk = await onBoard(host);
  const guestOk = await onBoard(guest);
  if (hostOk && guestOk) {
    console.log(
      `PASS: both host and guest reached a live ${ENGINE} board (encrypted relay path OK)`,
    );
  } else {
    console.error(`FAIL: host board=${hostOk} guest board=${guestOk} (guest url=${guest.url()})`);
    process.exitCode = 1;
  }
} catch (e) {
  console.error("FAIL:", String(e?.stack || e).slice(0, 400));
  process.exitCode = 1;
} finally {
  await browser.close();
}
