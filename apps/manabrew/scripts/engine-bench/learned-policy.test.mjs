import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { FEATURE_NAMES, castChoices, scoreCastChoices } from "./learned-policy.mjs";

function fixture() {
  const view = {
    turn: 4,
    zones: [
      { zone: "battlefield", ownerId: "player-0", cards: [1, 2, 3].map((n) => ({
        id: "land" + n, identity: { name: "Forest" },
        types: ["Land"], controllerId: "player-0",
      })) },
      { zone: "hand", ownerId: "player-0", cards: [
        { id: "creature", identity: { name: "Test Creature" }, types: ["Creature"],
          cmc: 3, power: "3", toughness: "2", text: "Flying" },
        { id: "instant", identity: { name: "Test Instant" }, types: ["Instant"],
          cmc: 1, text: "Draw a card." },
      ] },
      { zone: "hand", ownerId: "player-1", cards: [
        { id: "hidden", count: 3 },
      ] },
    ],
  };
  const prompt = { decidingPlayerId: "player-0", input: {
    type: "chooseAction",
    actions: [
      { id: "cast-1", type: "cast", cardId: "creature", label: "Cast Test Creature" },
      { id: "cast-2", type: "cast", cardId: "instant", label: "Cast Test Instant" },
      { id: "mana", type: "activateAbility", cardId: "land1", isManaAbility: true },
    ],
  } };
  return { view, prompt };
}

test("only Forge-offered visible cast cards become candidates", () => {
  const { view, prompt } = fixture();
  const choices = castChoices(prompt, view);
  assert.equal(choices.length, 2);
  assert.deepEqual(choices.map((x) => x.id), ["cast-1", "cast-2"]);
  assert.equal(choices[0].features.length, FEATURE_NAMES.length);
  assert.equal(choices[0].features[FEATURE_NAMES.indexOf("creature")], 1);
  assert.equal(choices[1].features[FEATURE_NAMES.indexOf("draw")], 1);
  assert.deepEqual(castChoices(prompt, null), []);
  prompt.input.actions[1].cardId = "hidden";
  assert.equal(castChoices(prompt, view).length, 1);
});

test("fixed weights rank only available actions and reject incompatible models", () => {
  const { view, prompt } = fixture();
  const weights = FEATURE_NAMES.map((name) => Number(name === "creature"));
  const model = { schemaVersion: 1, features: [...FEATURE_NAMES], weights };
  const choices = castChoices(prompt, view);
  assert.equal(scoreCastChoices(choices, model).id, "cast-1");
  assert.equal(scoreCastChoices([...choices].reverse(), model).id, "cast-1");
  assert.equal(scoreCastChoices(choices, { ...model, weights: [1] }), null);
  assert.equal(scoreCastChoices(choices, { ...model, schemaVersion: 2 }), null);
});


test("bundled experimental policy has compatible dimensions and gives a legal cast id", () => {
  const { prompt, view } = fixture();
  const model = JSON.parse(readFileSync(
    new URL("./experimental-cast-v1.model.json", import.meta.url), "utf8",
  ));
  const choices = castChoices(prompt, view);
  assert.ok(choices.some((choice) => choice.id === scoreCastChoices(choices, model)?.id));
});

test("offline trainer produces usable weights and holds out a whole trace", () => {
  const root = mkdtempSync(join(tmpdir(), "manabrew-policy-test-"));
  try {
    const { prompt, view } = fixture();
    const a = join(root, "game-1.log");
    const b = join(root, "game-2.log");
    const result = join(root, "model.json");
    const line = JSON.stringify({
      prompt, view, decision: { type: "act", actionId: "cast-1" },
    }) + "\n";
    writeFileSync(a, line.repeat(12));
    writeFileSync(b, line.repeat(4));
    const command = spawnSync(process.execPath, [
      new URL("./train-learned-policy.mjs", import.meta.url).pathname,
      "--traces", [a, b].join(","), "--out", result, "--epochs", "20",
    ], { encoding: "utf8" });
    assert.equal(command.status, 0, command.stderr);
    const model = JSON.parse(readFileSync(result, "utf8"));
    assert.equal(model.training.train.decisions, 12);
    assert.equal(model.training.validation.decisions, 4);
    assert.equal(model.training.validation.agreementWithManaBot, 1);
    assert.equal(scoreCastChoices(castChoices(prompt, view), model).id, "cast-1");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});