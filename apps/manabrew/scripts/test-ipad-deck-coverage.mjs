import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const option = (key, fallback) => {
  const index = process.argv.indexOf("--" + key);
  return index === -1 ? fallback : process.argv[index + 1];
};
const appRoot = fileURLToPath(new URL("..", import.meta.url));
const root = resolve(option("dist", join(appRoot, "dist")));
const packageRoot = resolve(option("engine", join(appRoot, "packages/forge-wasm")));
const archive = option("archive", null) ?? join(
  root, "wasm",
  JSON.parse(readFileSync(join(root, "wasm/cardset.manifest.json"), "utf8")).archive,
);
const startIndex = Number(option("from", 0));
const limit = Number(option("limit", Infinity));
const timeoutMs = Number(option("timeout", 40000));
const data = JSON.parse(readFileSync(join(root, "personal-decks.json"), "utf8"));
const decks = data.decks;
const { createForgeEngine } = await import(pathToFileURL(resolve(packageRoot, "node.js")).href);
let failures = 0;

for (let i = startIndex; i < Math.min(startIndex + limit, decks.length); i += 1) {
  const entry = decks[i];
  const opponent = decks[(i + 1) % decks.length];
  const prompts = [];
  const problems = [];
  let engine;
  let complete;
  let completed = false;
  const result = new Promise((resolveResult) => {
    complete = (reason, ok = false) => {
      if (completed) return;
      completed = true;
      resolveResult({ ok, reason });
    };
  });
  const timeout = setTimeout(() => complete("timeout"), timeoutMs);
  try {
    engine = await createForgeEngine({
      cardsetUrl: archive,
      onEvent(event, payload) {
        if (event === "game:forced_end") complete("forced end");
        if (event === "forge:log" && /missing card|not found|unsupported|removed from/i.test(payload?.text ?? "")) {
          problems.push(String(payload.text).slice(0, 240));
        }
      },
      onError(error) {
        problems.push(String(error).slice(0, 240));
      },
      onPrompt(prompt, slot) {
        const input = prompt?.input ?? {};
        const title = input.presentation?.title ?? "";
        prompts.push({ type: input.type, title: title.slice(0, 200) });
        if (/removed from your deck/i.test(title)) {
          complete("engine removed cards");
          return;
        }
        let output;
        switch (input.type) {
          case "revealCards":
            output = { type: "revealCardsAcknowledged" };
            break;
          case "diceRolled":
            output = { type: "diceRolledAcknowledged" };
            break;
          case "mulligan":
            output = { type: "mulliganDecision", keep: true };
            break;
          case "chooseFromSelection": {
            // Some commanders ask for a legal choice before the first turn.
            // This is normal pregame interaction, not an invalid deck.
            const chosenIndices = [];
            let weight = 0;
            for (const [index, choice] of (input.options ?? []).entries()) {
              if (weight >= (input.minTotal ?? 0)) break;
              chosenIndices.push(index);
              weight += choice.weight ?? 1;
            }
            output = { type: "selectionDecision", chosenIndices };
            break;
          }
          case "chooseAction":
            complete("first game action", prompts.some((p) => p.type === "mulligan"));
            return;
          default:
            complete("unexpected prompt " + input.type);
            return;
        }
        try {
          engine.respond(prompt.promptId, { type: input.type, output }, slot);
        } catch (error) {
          complete(String(error));
        }
      },
    });
    await engine.startGame({
      deck: entry.deck,
      opponentDecks: [opponent.deck],
      startingLife: 40,
    });
    const verdict = await result;
    failures += Number(!verdict.ok);
    console.log(JSON.stringify({
      deck: entry.slug,
      opponent: opponent.slug,
      ...verdict,
      prompts: prompts.map((p) => p.type),
      warnings: prompts.filter((p) => p.title).map((p) => p.title).slice(0, 3),
      problems,
    }));
  } catch (error) {
    failures += 1;
    console.log(JSON.stringify({ deck: entry.slug, ok: false, error: String(error).slice(0, 500) }));
  } finally {
    clearTimeout(timeout);
    engine?.dispose();
  }
}
console.log(JSON.stringify({ tested: Math.min(startIndex + limit, decks.length) - startIndex, failures }));
if (failures > 0) process.exitCode = 1;