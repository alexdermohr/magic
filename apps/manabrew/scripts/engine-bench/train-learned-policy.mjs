#!/usr/bin/env node
/**
 * Learn cast-action preferences from ManaBot's existing --trace chooseAction
 * output. Pure Node.js (no model download, Python, PyTorch or GPU required).
 * Trace files stay local; only fixed-size feature weights are written.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { FEATURE_NAMES, castChoices, scoreCastChoices } from "./learned-policy.mjs";

function option(name, fallback) {
  const index = process.argv.indexOf("--" + name);
  return index < 0 ? fallback : process.argv[index + 1];
}
const files = (option("traces", "") ?? "").split(",").filter(Boolean).map((path) => resolve(path));
const output = option("out", null);
const epochs = Number(option("epochs", "30"));
const rate = Number(option("rate", "0.06"));
if (!files.length || !output || !Number.isInteger(epochs) || epochs < 1 || epochs > 1000 ||
    !(rate > 0 && rate <= 1)) {
  console.error("usage: node train-learned-policy.mjs --traces game1.log,game2.log --out policy.json [--epochs 30 --rate 0.06]");
  process.exit(2);
}

function readTrace(path) {
  const examples = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line.startsWith("{")) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const { prompt, decision, view } = entry;
    if (decision?.type !== "act") continue;
    const choices = castChoices(prompt, view);
    const chosen = choices.findIndex((choice) => choice.id === decision.actionId);
    if (choices.length < 2 || chosen < 0) continue;
    examples.push({ choices, chosen });
  }
  return examples;
}
const byGame = files.map((path) => ({ path, rows: readTrace(path) }));
// Hold out complete games, never random decisions from the same game.
const validation = byGame.length >= 2 ? byGame.at(-1).rows : [];
const train = byGame.slice(0, byGame.length >= 2 ? -1 : undefined).flatMap((game) => game.rows);
if (train.length === 0) {
  console.error("No trainable cast-versus-cast decisions. Collect longer traces with --trace chooseAction.");
  process.exit(1);
}

let weights = FEATURE_NAMES.map(() => 0);
const dot = (features) => features.reduce((sum, x, j) => sum + x * weights[j], 0);
let seed = 0x12345678;
function random() {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return (seed >>> 0) / 0x100000000;
}
for (let epoch = 0; epoch < epochs; epoch++) {
  // Deterministic Fisher-Yates shuffle.
  const order = train.map((_, i) => i);
  for (let j = order.length - 1; j > 0; j--) {
    const k = Math.floor(random() * (j + 1));
    [order[j], order[k]] = [order[k], order[j]];
  }
  for (const index of order) {
    const row = train[index];
    const scores = row.choices.map((choice) => dot(choice.features));
    const max = Math.max(...scores);
    const exp = scores.map((score) => Math.exp(score - max));
    const total = exp.reduce((a, b) => a + b, 0);
    const gradient = FEATURE_NAMES.map(() => 0);
    for (let j = 0; j < row.choices.length; j++) {
      const delta = exp[j] / total - Number(row.chosen === j);
      for (let k = 0; k < gradient.length; k++) {
        gradient[k] += delta * row.choices[j].features[k];
      }
    }
    for (let k = 0; k < weights.length; k++) {
      weights[k] -= rate * (gradient[k] + 0.0005 * weights[k]);
    }
  }
}

const model = { schemaVersion: 1, features: [...FEATURE_NAMES], weights };
function metrics(rows) {
  let learnedCorrect = 0;
  let firstCorrect = 0;
  for (const row of rows) {
    const predicted = scoreCastChoices(row.choices, model);
    if (predicted?.id === row.choices[row.chosen].id) learnedCorrect++;
    if (row.chosen === 0) firstCorrect++;
  }
  return {
    decisions: rows.length,
    agreementWithManaBot: rows.length ? +(learnedCorrect / rows.length).toFixed(4) : null,
    firstCastBaseline: rows.length ? +(firstCorrect / rows.length).toFixed(4) : null,
  };
}
model.training = {
  teacher: "ManaBot SimpleAi",
  scope: "chooseAction with >=2 visible cast choices and teacher choosing cast",
  traces: files.length,
  train: metrics(train),
  validation: metrics(validation),
  validationUnit: "whole trace/game; absent if only one game",
  epochs,
  caveat: "Imitation agreement is not game strength; run blinded seat-rotated win-rate matches.",
};
writeFileSync(resolve(output), JSON.stringify(model, null, 2) + "\n");
process.stdout.write(JSON.stringify({ output: resolve(output), ...model.training }, null, 2) + "\n");