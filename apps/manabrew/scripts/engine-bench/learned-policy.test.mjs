import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { FEATURE_NAMES, castChoices, scoreCastChoices } from "./learned-policy.mjs";
import { TEACHER_PREFIX, parseForgeTeacherEvent } from "./forge-teacher-trace.mjs";

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
    assert.equal(model.training.validation.agreementWithTeacher, 1);
    assert.equal(scoreCastChoices(castChoices(prompt, view), model).id, "cast-1");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("trace directory holds out whole games without mixing training rows", () => {
  const root = mkdtempSync(join(tmpdir(), "manabrew-pop-training-"));
  try {
    const { prompt, view } = fixture();
    for (let seed = 22001; seed <= 22005; seed++) {
      const actionId = seed <= 22003 ? "cast-1" : "cast-2";
      const record = JSON.stringify({
        prompt, view, decision: { type: "act", actionId },
      }) + "\n";
      writeFileSync(join(root, "game-" + seed + ".trace.jsonl"),
        record.repeat(seed <= 22003 ? 1 : 2));
      writeFileSync(join(root, "game-" + seed + ".json"),
        JSON.stringify({ outcome: { reason: "game:over" } }));
    }
    writeFileSync(join(root, "game-invalid.trace.jsonl"), "{not a game}");
    writeFileSync(join(root, "game-22006.trace.jsonl"),
      JSON.stringify({ prompt, view, decision: { type: "act", actionId: "cast-2" } }));
    writeFileSync(join(root, "game-22006.json"),
      JSON.stringify({ outcome: { reason: "timeout" } }));
    const out = join(root, "policy.json");
    const call = spawnSync(process.execPath, [
      new URL("./train-learned-policy.mjs", import.meta.url).pathname,
      "--trace-dir", root, "--holdout-games", "2", "--out", out,
      "--epochs", "4",
    ], { encoding: "utf8" });
    assert.equal(call.status, 0, call.stderr);
    const model = JSON.parse(readFileSync(out, "utf8"));
    assert.equal(model.training.traces, 5);
    assert.equal(model.training.skippedUnfinished, 1);
    assert.equal(model.training.trainGames, 3);
    assert.equal(model.training.validationGames, 2);
    assert.equal(model.training.train.decisions, 3);
    assert.equal(model.training.validation.decisions, 4);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("population summary restores seed and seat rotation from saved plan", () => {
  const root = mkdtempSync(join(tmpdir(), "manabrew-pop-summary-"));
  try {
    writeFileSync(join(root, "population-plan.json"), JSON.stringify({
      schemaVersion: 1, seedBase: 23011, games: 2, seatCount: 2,
      learnedModel: "/tmp/example-model.json",
      forgeTeacherTrace: true,
    }));
    for (let i = 0; i < 2; i++) {
      writeFileSync(join(root, "game-" + (23011 + i) + ".json"),
        JSON.stringify({
          seed: 23011 + i,
          outcome: { reason: "game:over" },
          winnerId: "player-" + i,
          decks: ["personal:anowon-rogues", "personal:helga-skittish-seer"],
          turn: 12, durationMs: 1800,
          seats: [{ prompts: 2 }, { prompts: 2 }],
          learned: { seatStats: [{ eligible: 2, overrides: 1, fallback: 1 }] },
          forgeTeacher: { samples: 3, rejected: 1 },
        }));
    }
    const call = spawnSync(process.execPath, [
      new URL("./manabot-pop.mjs", import.meta.url).pathname,
      "--summarise", root,
    ], { encoding: "utf8" });
    assert.equal(call.status, 0, call.stderr);
    const summary = JSON.parse(readFileSync(join(root, "summary.json"), "utf8"));
    assert.equal(summary.decided, 2);
    assert.equal(summary.A, 2);
    assert.equal(summary.B, 0);
    assert.deepEqual(summary.learned, { eligible: 4, overrides: 2, fallback: 2 });
    assert.deepEqual(summary.forgeTeacher, { samples: 6, rejected: 2 });
    assert.deepEqual(summary.bySeat, [{ A: 1, B: 0 }, { A: 1, B: 0 }]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Forge teacher event requires visible legal cast alternatives and chosen action", () => {
  const { prompt, view } = fixture();
  const example = {
    teacher: "forge-ai",
    seat: 0,
    prompt,
    view,
    decision: { type: "act", actionId: "cast-1" },
  };
  const source = { text: TEACHER_PREFIX + JSON.stringify(example) };
  const captured = parseForgeTeacherEvent("forge:log", source);
  assert.equal(captured.sample.teacher, "forge-ai");
  assert.deepEqual(captured.sample.decision, example.decision);
  assert.equal(parseForgeTeacherEvent("other", source), null);
  assert.equal(parseForgeTeacherEvent("forge:log", { text: TEACHER_PREFIX + "{" }).error,
    "malformed_json");
  assert.equal(parseForgeTeacherEvent("forge:log", {
    text: TEACHER_PREFIX + JSON.stringify({ ...example, decision: { type: "act", actionId: "hidden" } }),
  }).error, "no_visible_teacher_choice");
  assert.equal(parseForgeTeacherEvent("forge:log", {
    text: TEACHER_PREFIX + JSON.stringify({ ...example, seat: 1 }),
  }).error, "invalid_teacher_sample");
});

test("Forge teacher model provenance rejects mixed games", () => {
  const root = mkdtempSync(join(tmpdir(), "forge-teacher-trainer-"));
  try {
    const { prompt, view } = fixture();
    for (const [name, teacher] of [["forge.jsonl", "forge-ai"], ["manabot.jsonl", null]]) {
      writeFileSync(join(root, name), JSON.stringify({
        prompt, view, decision: { type: "act", actionId: "cast-1" },
        ...(teacher ? { teacher } : {}),
      }) + "\n");
    }
    const executable = new URL("./train-learned-policy.mjs", import.meta.url).pathname;
    const forgeOut = join(root, "forge-model.json");
    const forge = spawnSync(process.execPath, [
      executable, "--traces", join(root, "forge.jsonl"), "--out", forgeOut,
    ], { encoding: "utf8" });
    assert.equal(forge.status, 0, forge.stderr);
    assert.equal(JSON.parse(readFileSync(forgeOut, "utf8")).training.teacher, "Forge AI");

    const mixed = spawnSync(process.execPath, [
      executable, "--traces", join(root, "forge.jsonl") + "," + join(root, "manabot.jsonl"),
      "--out", join(root, "mixed-model.json"),
    ], { encoding: "utf8" });
    assert.notEqual(mixed.status, 0);
    assert.match(mixed.stderr, /no mixed or empty/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("cast retry tracking uses card identity, not reused Forge prompt positions", () => {
  const { view, prompt } = fixture();
  const attemptedCards = new Set([castChoices(prompt, view)[0].cardId]);
  const shifted = {
    ...prompt,
    input: {
      ...prompt.input,
      actions: [
        { id: "cast-1", type: "cast", cardId: "instant", label: "Cast Test Instant" },
        { id: "cast-2", type: "cast", cardId: "creature", label: "Cast Test Creature" },
      ],
    },
  };
  const candidates = castChoices(shifted, view);
  assert.deepEqual(candidates.map((c) => c.id), ["cast-1", "cast-2"]);
  assert.deepEqual(candidates.filter((c) => !attemptedCards.has(c.cardId)).map((c) => c.id), ["cast-1"]);
});
