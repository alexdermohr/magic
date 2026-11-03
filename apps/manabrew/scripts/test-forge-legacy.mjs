import { createForgeEngine } from "file:///home/alex/.local/share/manabrew-forge020/package/node.js";

import { readFileSync } from "node:fs";
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