import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:8110";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
const release = "a".repeat(20);
try {
  // Keep a real same-origin IndexedDB, without launching the actual app's
  // auto-resume effect during the persistence transaction test.
  await page.route("**/recovery-idb-fixture.html", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>IDB recovery test</title>" }));
  await page.goto(origin + "/recovery-idb-fixture.html", { waitUntil: "domcontentloaded" });
  const first = await page.evaluate(async (releaseId) => {
    const mod = await import("/src/lib/forgeAutoResumeStore.ts");
    await mod.clearForgeRecoverySave();
    const gameId = "forge-browser-idb-test-1";
    const startRequest = JSON.stringify({
      gameId, decisionJournal: true, journalRewind: true,
      experimentalInternalAiReplay: true,
      players: [{ ai: false }, { ai: true }],
    });
    const launch = {
      deck: { name: "Recovery fixture", format: "commander", cards: [], commanders: [] },
      opponentDecks: null, formatId: "commander", commanderName: null,
      engine: "Forge", aiController: "forge",
    };
    const prompt = { decidingPlayerId: "player-0", input: { type: "chooseAction" } };
    const verification = { state: "b".repeat(64), rng: "0:cbf29ce484222325" };
    const initial = {
      version: 1, gameId, nextSequence: 1, startRequest,
      prompt, verification, entries: [],
    };
    await mod.commitForgeRecoveryDelta(initial, releaseId, launch);
    return {
      gameId,
      initial: (await mod.readForgeRecoverySave(releaseId))?.replaySnapshot.nextSequence,
      prompt, verification, launch,
    };
  }, release);
  assert.equal(first.initial, 1);
  await page.reload({ waitUntil: "domcontentloaded" });
  const after = await page.evaluate(async ({ release, first }) => {
    const mod = await import("/src/lib/forgeAutoResumeStore.ts");
    const previous = await mod.readForgeRecoverySave(release);
    if (!previous) throw Error("Lost committed IndexedDB save on full page reload");
    console.log("SAVED_BOUNDARY", JSON.stringify({
      storedGame: previous.gameId,
      incomingGame: first.gameId,
      nextSequence: previous.replaySnapshot.nextSequence,
      hasJournal: Boolean(previous.replaySnapshot.journal.startRequest),
      release,
    }));
    const consumed = {
      sequence: 1, playerIndex: 0, prompt: first.prompt,
      action: { type: "chooseAction", output: { type: "pass" } },
      verification: first.verification,
    };
    await mod.commitForgeRecoveryDelta({
      version: 1, gameId: first.gameId, nextSequence: 2,
      prompt: first.prompt, verification: { ...first.verification, rng: "1:deadbeef" },
      entries: [consumed],
    }, release, first.launch);
    const saved = await mod.readForgeRecoverySave(release);
    try {
      await mod.commitForgeRecoveryDelta({
        version: 1, gameId: first.gameId, nextSequence: 4,
        prompt: first.prompt, verification: first.verification,
        entries: [{ ...consumed, sequence: 3 }],
      }, release, first.launch);
      throw Error("Corrupted/partial journal was incorrectly accepted");
    } catch (error) {
      if (String(error).includes("incorrectly accepted")) throw error;
    }
    const stillValid = await mod.readForgeRecoverySave(release);
    return {
      count: saved?.replaySnapshot.journal.entries.length,
      gameId: saved?.gameId,
      stillValid: stillValid?.replaySnapshot.nextSequence,
      wrongRelease: await mod.readForgeRecoverySave("c".repeat(20)),
    };
  }, { release, first });
  assert.deepEqual(after, {
    count: 1, gameId: first.gameId, stillValid: 2, wrongRelease: null,
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  const final = await page.evaluate(async (releaseId) => {
    const mod = await import("/src/lib/forgeAutoResumeStore.ts");
    const saved = await mod.readForgeRecoverySave(releaseId);
    const preserved = saved?.replaySnapshot.nextSequence === 2 &&
      saved.replaySnapshot.journal.entries.length === 1;
    await mod.clearForgeRecoverySave();
    return { preserved, cleared: (await mod.readForgeRecoverySave(releaseId)) === null };
  }, release);
  assert.deepEqual(final, { preserved: true, cleared: true });
  console.log("FORGE_RECOVERY_INDEXEDDB_REAL_CHROME", JSON.stringify({
    firstCommitted: 1, afterReplayInput: after.stillValid,
    reloadVerified: final.preserved, corruptDeltaRejected: true,
    wrongVersionExcluded: true, userLeaveCleared: final.cleared,
  }));
} finally {
  await browser.close();
}
