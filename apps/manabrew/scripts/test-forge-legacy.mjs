import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Use the checked-in Forge binding by default; a legacy package can still be
// supplied for historical regressions, without baking in a developer's home.
const legacyNode = process.env.MANABREW_LEGACY_FORGE_NODE;
const nodeModule = legacyNode
  ? pathToFileURL(resolve(legacyNode))
  : new URL("../packages/forge-wasm/node.js", import.meta.url);
const { createForgeEngine } = await import(nodeModule.href);

// The Node binding expects a launcher and WASM file beside its package.
// In a source checkout these are generated into the offline dist instead.
const assetsDir = fileURLToPath(new URL("../dist/assets/", import.meta.url));
const buildAssets = () => {
  if (!existsSync(assetsDir)) {
    throw new Error("Forge assets missing; run yarn build:ipad-offline first");
  }
  const assets = readdirSync(assetsDir);
  const findAsset = (pattern) => {
    const matches = assets.filter((name) => pattern.test(name));
    if (matches.length !== 1) {
      throw new Error("Expected exactly one built Forge runtime asset; run yarn build:ipad-offline");
    }
    return resolve(assetsDir, matches[0]);
  };
  return {
    launcherUrl: findAsset(/^forgeharness-[A-Za-z0-9_-]+\.js$/),
    wasmUrl: findAsset(/^forgeharness\.js-[A-Za-z0-9_-]+\.wasm$/),
  };
};
const runtimeAssets = legacyNode ? {} : buildAssets();
function fromPreset(filename) {
  const raw = JSON.parse(readFileSync(new URL("../public/preset_decks/" + filename, import.meta.url), "utf8"));
  return {
    name: raw.label, format: raw.format,
    commanders: [{name: raw.commander, count: 1}],
    cards: raw.cards.filter((card) => card.name !== raw.commander)
      .map((card) => ({name: card.name, count: card.count ?? 1})),
  };
}

const kaalia = {
  format: "commander",
  name: "Kaalia mono-lands engine boot test",
  commanders: [{ name: "Kaalia of the Vast", count: 1 }],
  cards: [{ name: "Plains", count: 99 }],
};
const animar = {
  format: "commander",
  name: "Animar mono-lands engine boot test",
  commanders: [{ name: "Animar, Soul of Elements", count: 1 }],
  cards: [{ name: "Forest", count: 99 }],
};
let engine;
let started = false;
const startAt = Date.now();
const log = (x, msg) => console.log(x, Date.now() - startAt, JSON.stringify(msg).slice(0, 600));
try {
  engine = await createForgeEngine({
    ...runtimeAssets,
    onEvent(event, data) {
      if (event === "forge:log") log("FORGE-LOG", { level: data?.level, text: data?.text });
      else log("FORGE-EVENT", event);
    },
    onState(data) {
      log("FORGE-STATE", { turn: data?.gameView?.turn, players: data?.gameView?.players?.length, hasGameView: !!data?.gameView });
    },
    onPrompt(data) {
      log("FORGE-PROMPT", { promptId: data?.promptId, type: data?.input?.type });
      started = true;
      process.exitCode = 0;
    },
    onError(err) { log("FORGE-ERROR", String(err)); },
  });
  log("BOOTED", "Forge API worker initialized");
  log("START-REQUEST", "Commander test");
  await engine.startGame(process.argv.includes("complex")
    ? {deck: fromPreset("kaalia_regression_commander.json"),opponentDecks:[fromPreset("hearthhull_world_shaper_commander.json")]}
    : {deck:kaalia,opponentDecks:[animar]});
  log("START-RESPONSE", "Game request accepted");
  await new Promise((resolve) => setTimeout(resolve, 60000));
  if (!started) {
    log("FAILED", "No Mulligan/Prompt after 60s");
    process.exitCode = 1;
  }
} catch (e) {
  log("ERROR", String(e?.stack ?? e));
  process.exitCode = 1;
} finally {
  engine?.dispose();
}