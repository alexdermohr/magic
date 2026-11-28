#!/usr/bin/env node
/**
 * A population of `manabot-game.mjs` games, one process per game, and one
 * summary: wins per policy, per deck and per seat, play counts per seat-game,
 * response latency, and a two-sided sign test on the win split.
 *
 *   # Manabot (this checkout) against Forge's internal AI, seats rotated
 *   node scripts/engine-bench/manabot-pop.mjs --engine target/engines/prod \
 *     --games 40 --out /tmp/pop-main
 *
 *   # candidate policy against a baseline build on the same seeds
 *   node scripts/engine-bench/manabot-pop.mjs --engine target/engines/prod \
 *     --wasms src/wasm,../main/src/wasm --games 24 --out /tmp/ab
 *
 *   # re-read a finished population
 *   node scripts/engine-bench/manabot-pop.mjs --summarise /tmp/pop-main
 *
 * Two labelled sides, A and B. In Forge mode A is Manabot and B is Forge's
 * AI; with `--wasms a,b` A and B are the two builds. Each seed puts A on a
 * different pair of seats, so over four games every deck is played twice by
 * each side.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const defaultDecks = "kaalia_regression_commander,starter_deck_animar,real_teval_commander,neheb_minotaur_commander";
const defaultWasm = join(root, "src", "wasm");

function option(name, fallback) {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? fallback : process.argv[at + 1];
}

const summariseDir = option("summarise", null);
const out = resolve(summariseDir ?? option("out", "target/manabot-pop"));
const existingPlanPath = join(out, "population-plan.json");
const storedPlan = summariseDir && existsSync(existingPlanPath)
  ? JSON.parse(readFileSync(existingPlanPath, "utf8")) : null;
const games = Number(option("games", storedPlan?.games ?? 40));
const seedBase = Number(option("seed-base", storedPlan?.seedBase ?? 7000));
const jobs = Number(option("jobs", Math.max(1, Math.floor(cpus().length / 2))));
const engine = option("engine", storedPlan?.engine ?? "packages/forge-wasm");
const wasms = option("wasms", storedPlan?.wasms?.join(",") ?? "").split(",").filter(Boolean);
const decks = option("decks", storedPlan?.decks ?? null);
const personalDecks = option("personal-decks", storedPlan?.personalDecks ?? null);
const timeout = option("timeout", "420");
const extra = option("extra", "").split(" ").filter(Boolean);
const learnedModel = option("learned-model", storedPlan?.learnedModel ?? null);
const tracePrompts = option("trace", null);
const forgeTeacherTrace = option("forge-teacher-trace", String(storedPlan?.forgeTeacherTrace ?? false)) === "true";
if (wasms.length > 2) {
  throw new Error("--wasms accepts at most two builds (A and B)");
}
if (forgeTeacherTrace && (wasms.length === 2 || tracePrompts)) {
  throw new Error("--forge-teacher-trace true requires Forge AI seats and cannot combine with --trace");
}
if (tracePrompts && !["chooseAction"].includes(tracePrompts)) {
  throw new Error("--trace currently supports chooseAction only");
}
const seatCount = Number(option("seats", storedPlan?.seatCount ?? (decks ? decks.split(",").length : 4)));

const PAIRS =
  seatCount === 2
    ? [[0], [1]]
    : [
        [0, 2],
        [1, 3],
        [0, 3],
        [1, 2],
      ];
const SEATS = Array.from({ length: seatCount }, (_, seat) => seat);

function plan(index) {
  const seed = seedBase + index;
  const a = PAIRS[index % PAIRS.length];
  const b = SEATS.filter((seat) => !a.includes(seat));
  const args = ["--engine", engine, "--seed", String(seed), "--timeout", timeout, ...extra];
  args.push("--decks", decks ?? defaultDecks);
  if (personalDecks) args.push("--personal-decks", personalDecks);
  if (wasms.length === 2) {
    const perSeat = SEATS.map((seat) => (a.includes(seat) ? wasms[0] : wasms[1]));
    args.push("--wasms", perSeat.join(","));
  } else {
    args.push("--wasm", wasms[0] ?? defaultWasm);
    args.push("--forge-ai-seats", b.join(","));
  }
  if (learnedModel) args.push("--learned-model", learnedModel, "--learned-seats", a.join(","));
  if (tracePrompts) {
    args.push("--trace", tracePrompts, "--trace-file", join(out, `game-${seed}.trace.jsonl`));
  }
  if (forgeTeacherTrace) {
    args.push("--forge-teacher-trace-file", join(out, `game-${seed}.trace.jsonl`));
  }
  return { seed, a, b, args, file: join(out, `game-${seed}.json`) };
}

function runOne(game) {
  return new Promise((done) => {
    const child = spawn(
      process.execPath,
      [join(here, "manabot-game.mjs"), ...game.args, "--out", game.file],
      {
        stdio: ["ignore", "ignore", "pipe"],
      },
    );
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (err) writeFileSync(game.file.replace(/\.json$/, ".stderr"), err.slice(-20000));
      if (!existsSync(game.file)) {
        writeFileSync(
          game.file,
          JSON.stringify({
            seed: game.seed,
            outcome: { reason: "crash", code, err: err.slice(-2000) },
          }),
        );
      }
      done();
    });
  });
}

function artifactHashes() {
  const args = plan(0).args;
  const argument = (name, fallback) => {
    const at = args.indexOf(`--${name}`);
    return at === -1 ? fallback : args[at + 1];
  };
  const forgeDir = resolve(argument("engine", engine));
  const wasmDirs = argument("wasms", argument("wasm", null))
    .split(",").map((path) => resolve(path));
  const selectedDecks = argument("decks", null).split(",");
  const paths = [
    ...["manabot-pop.mjs", "manabot-game.mjs", "learned-policy.mjs", "forge-teacher-trace.mjs"]
      .map((name) => join(here, name)),
    ...readdirSync(forgeDir)
      .filter((name) => /\.(?:[cm]?js|wasm)$/.test(name) || name === "package.json")
      .map((name) => join(forgeDir, name)),
    ...wasmDirs.flatMap((dir) => ["wasm.js", "wasm_bg.wasm"].map((name) => join(dir, name))),
    ...selectedDecks.map((name) => name.startsWith("personal:")
      ? resolve(argument("personal-decks", join(root, "dist", "personal-decks.json")))
      : name.endsWith(".json") ? resolve(name) : join(root, "public", "preset_decks", `${name}.json`)),
  ];
  if (!paths.includes(join(forgeDir, "forgeharness.js.wasm"))) {
    throw new Error(`${forgeDir} has no Forge WASM engine`);
  }
  const model = argument("learned-model", null);
  if (model) paths.push(resolve(model));
  return Object.fromEntries([...new Set(paths)].sort().map((path) => [
    path, createHash("sha256").update(readFileSync(path)).digest("hex"),
  ]));
}

async function runAll() {
  mkdirSync(out, { recursive: true });
  const manifestPath = join(out, "population-plan.json");
  const manifest = {
    schemaVersion: 2, seedBase, games, seatCount, engine: resolve(engine),
    nodeVersion: process.version, jobs, artifacts: artifactHashes(),
    wasms: wasms.map((path) => resolve(path)),
    decks, personalDecks: personalDecks ? resolve(personalDecks) : null,
    timeout, extra, learnedModel: learnedModel ? resolve(learnedModel) : null,
    learnedModelContent: learnedModel ? readFileSync(resolve(learnedModel), "utf8") : null,
    tracePrompts, forgeTeacherTrace,
  };
  if (existsSync(manifestPath) &&
      JSON.stringify(JSON.parse(readFileSync(manifestPath, "utf8"))) !== JSON.stringify(manifest)) {
    throw new Error(`population configuration changed; use a fresh --out directory: ${out}`);
  }
  if (!existsSync(manifestPath) &&
      readdirSync(out).some((name) => /^game-\d+\.json$/.test(name))) {
    throw new Error(`existing games without a population manifest; use a fresh --out directory: ${out}`);
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  const queue = Array.from({ length: games }, (_, index) => plan(index)).filter(
    (game) => !existsSync(game.file),
  );
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      const game = queue[next++];
      const started = Date.now();
      await runOne(game);
      const result = JSON.parse(readFileSync(game.file, "utf8"));
      process.stderr.write(
        `seed ${game.seed} ${result.outcome?.reason ?? "?"} winner ${result.winnerId ?? "-"} turn ${result.turn ?? "-"} ${Math.round((Date.now() - started) / 1000)}s\n`,
      );
    }
  };
  await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, worker));
}

function signTest(wins, losses) {
  const n = wins + losses;
  if (n === 0) return 1;
  const k = Math.min(wins, losses);
  let tail = 0;
  let coefficient = 1;
  for (let i = 0; i <= k; i += 1) {
    tail += coefficient;
    coefficient = (coefficient * (n - i)) / (i + 1);
  }
  return Math.min(1, (2 * tail) / 2 ** n);
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).toSorted((l, r) => l - r);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
}

function summarise() {
  const files = readdirSync(out).filter(
    (name) => name.startsWith("game-") && name.endsWith(".json"),
  );
  const results = files.map((name) => JSON.parse(readFileSync(join(out, name), "utf8")));
  const sides = { A: { wins: 0, seats: [] }, B: { wins: 0, seats: [] } };
  const byDeck = {};
  const bySeat = SEATS.map(() => ({ A: 0, B: 0 }));
  let nonResults = 0;
  let legacyActionDataGames = 0;
  const nonResultReasons = {};
  const partialLatency = { games: 0, samples: 0, p50: [], p90: [], p99: [], max: 0, over1s: 0 };
  const latency = { p50: [], p90: [], p99: [], over1s: 0 };
  const bot = { p50: [], p99: [], totalMs: [], observeMs: [] };
  const turns = [];
  const durations = [];
  const learned = { eligible: 0, overrides: 0, fallback: 0 };
  const teacher = { samples: 0, rejected: 0 };
  for (const result of results) {
    if (result.outcome?.reason !== "game:over" || !result.winnerId) {
      nonResults += 1;
      const reason = result.outcome?.reason === "game:over" ? "no_winner" : result.outcome?.reason ?? "unknown";
      nonResultReasons[reason] = (nonResultReasons[reason] ?? 0) + 1;
      if (result.latency?.samples > 0) {
        partialLatency.games += 1;
        partialLatency.samples += result.latency.samples;
        partialLatency.p50.push(result.latency.p50);
        partialLatency.p90.push(result.latency.p90);
        partialLatency.p99.push(result.latency.p99);
        partialLatency.max = Math.max(partialLatency.max, result.latency.max ?? 0);
        partialLatency.over1s += result.latency.over1s ?? 0;
      }
      continue;
    }
    const index = result.seed - seedBase;
    const a = PAIRS[((index % PAIRS.length) + PAIRS.length) % PAIRS.length];
    const winnerSeat = Number(result.winnerId.slice("player-".length));
    const winner = a.includes(winnerSeat) ? "A" : "B";
    sides[winner].wins += 1;
    bySeat[winnerSeat][winner] += 1;
    const deck = result.decks?.[winnerSeat] ?? `seat-${winnerSeat}`;
    byDeck[deck] ??= { A: 0, B: 0 };
    byDeck[deck][winner] += 1;
    turns.push(result.turn);
    durations.push(result.durationMs / 1000);
    teacher.samples += result.forgeTeacher?.samples ?? 0;
    teacher.rejected += result.forgeTeacher?.rejected ?? 0;
    for (const seat of result.learned?.seatStats ?? []) {
      learned.eligible += seat.eligible ?? 0;
      learned.overrides += seat.overrides ?? 0;
      learned.fallback += seat.fallback ?? 0;
    }
    latency.p50.push(result.latency?.p50);
    latency.p90.push(result.latency?.p90);
    latency.p99.push(result.latency?.p99);
    latency.over1s += result.latency?.over1s ?? 0;
    bot.p50.push(result.bot?.p50);
    bot.p99.push(result.bot?.p99);
    bot.totalMs.push(result.bot?.totalMs);
    bot.observeMs.push(result.bot?.observeMs);
    if (!Array.isArray(result.agents)) legacyActionDataGames += 1;
    (result.seats ?? []).forEach((seat, at) => {
      if (!seat.prompts || !result.agents?.[at] || result.agents[at] === "forge-ai") return;
      sides[a.includes(at) ? "A" : "B"].seats.push(seat);
    });
  }
  const perSeat = (seats) => {
    const mean = (key) =>
      seats.length
        ? (seats.reduce((sum, seat) => sum + (seat[key] ?? 0), 0) / seats.length).toFixed(1)
        : "-";
    return {
      games: seats.length,
      casts: mean("casts"),
      lands: mean("landPlays"),
      abilities: mean("abilities"),
      attackers: mean("attackers"),
      blocks: mean("blocks"),
      mulligans: mean("mulligans"),
      cancels: mean("paymentCancels"),
      prompts: mean("prompts"),
    };
  };
  const summary = {
    dir: out,
    games: results.length,
    decided: sides.A.wins + sides.B.wins,
    nonResults,
    nonResultReasons,
    legacyActionDataGames,
    partialLatency: {
      ...partialLatency,
      p50: median(partialLatency.p50),
      p90: median(partialLatency.p90),
      p99: median(partialLatency.p99),
    },
    A: sides.A.wins,
    B: sides.B.wins,
    p: signTest(sides.A.wins, sides.B.wins).toFixed(3),
    byDeck,
    bySeat,
    medianTurn: median(turns),
    medianDurationS: Math.round(median(durations)),
    latency: {
      p50: median(latency.p50),
      p90: median(latency.p90),
      p99: median(latency.p99),
      over1s: latency.over1s,
    },
    bot: {
      p50: median(bot.p50),
      p99: median(bot.p99),
      totalMs: median(bot.totalMs),
      observeMs: median(bot.observeMs),
    },
    perSeatGame: { A: perSeat(sides.A.seats), B: perSeat(sides.B.seats) },
    ...(learnedModel ? { learned } : {}),
    ...(forgeTeacherTrace ? { forgeTeacher: teacher } : {}),
  };
  writeFileSync(join(out, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

if (!summariseDir) await runAll();
const summary = summarise();
const line = (side) => {
  const seat = summary.perSeatGame[side];
  return `${side}: ${summary[side]} wins | ${seat.games} measured external seats | casts ${seat.casts} lands ${seat.lands} abilities ${seat.abilities} attackers ${seat.attackers} blocks ${seat.blocks} mulligans ${seat.mulligans} cancels ${seat.cancels}`;
};
console.log(
  [
    `${summary.dir}: ${summary.games} games, ${summary.decided} decided, ${summary.nonResults} non-results`,
    `A ${summary.A} - B ${summary.B} (p=${summary.p}); median turn ${summary.medianTurn}, ${summary.medianDurationS}s; latency p50/p90/p99 ${summary.latency.p50}/${summary.latency.p90}/${summary.latency.p99} ms, ${summary.latency.over1s} over 1 s; bot decide p50/p99 ${summary.bot.p50}/${summary.bot.p99} ms, ${summary.bot.totalMs} ms decide + ${summary.bot.observeMs} ms observe per game`,
    ...(summary.nonResults ? [
      `  non-results: ${Object.entries(summary.nonResultReasons).map(([reason, count]) => `${reason}=${count}`).join(", ")}`,
    ] : []),
    ...(summary.partialLatency.games ? [
      `  partial games: ${summary.partialLatency.games} measured, ${summary.partialLatency.samples} samples, p50/p90/p99 ${summary.partialLatency.p50}/${summary.partialLatency.p90}/${summary.partialLatency.p99} ms, max ${summary.partialLatency.max} ms, ${summary.partialLatency.over1s} over 1 s`,
    ] : []),
    ...(summary.legacyActionDataGames ? [
      `  legacy games without agent metadata: ${summary.legacyActionDataGames}; action counts unavailable for those games`,
    ] : []),
    line("A"),
    line("B"),
    ...(summary.learned ? [`  learned eligible ${summary.learned.eligible}, overrides ${summary.learned.overrides}, fallback ${summary.learned.fallback}`] : []),
    ...(summary.forgeTeacher ? [`  forge teacher samples ${summary.forgeTeacher.samples}, rejected ${summary.forgeTeacher.rejected}`] : []),
    ...Object.entries(summary.byDeck).map(([deck, wins]) => `  ${deck}: A ${wins.A} - B ${wins.B}`),
    `  by winning seat: ${summary.bySeat.map((seat, at) => `s${at} A${seat.A}/B${seat.B}`).join(" ")}`,
  ].join("\n"),
);
