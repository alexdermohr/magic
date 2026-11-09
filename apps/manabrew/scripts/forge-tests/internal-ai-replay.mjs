import assert from "node:assert/strict";
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdtempSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { harness } from "./journal-harness.mjs";
import { scriptedAnswer } from "./journal-fixture.mjs";

const { values } = parseArgs({
  options: {
    java: { type: "string", default: "java" },
    jar: {
      type: "string",
      default: "forge-harness/target/forge-harness-jar-with-dependencies.jar",
    },
    "forge-home": { type: "string", default: "forge/forge-gui" },
    "personal-decks": { type: "string", default: "" },
    "seed-count": { type: "string", default: "1" },
    "seed-start": { type: "string", default: "0" },
  },
});

if (values["personal-decks"] && !existsSync(values["personal-decks"])) {
  throw new Error(
    `Requested Commander decks file does not exist: ${values["personal-decks"]}`,
  );
}

function forestFixture() {
  const cards = [
    ...Array.from({ length: 20 }, () => ({ name: "Forest" })),
    ...Array.from({ length: 20 }, () => ({ name: "Memnite" })),
    ...Array.from({ length: 20 }, () => ({ name: "Sprout" })),
  ];
  return {
    gameId: "internal-ai-replay-simple",
    variant: "Constructed",
    startingLife: 20,
    seed: 424242,
    snapshotRecording: false,
    players: [
      { name: "You", ai: false, deck: cards },
      { name: "Forge AI", ai: true, deck: cards },
    ],
  };
}

function commanderFixture(file) {
  const list = JSON.parse(readFileSync(file, "utf8")).decks;
  const find = (name) => list.find((entry) => entry.deck?.name.startsWith(name))?.deck;
  const player = find("Anowon");
  const opponent = find("Gahiji");
  assert(player && opponent, "personal Commander fixture requires Anowon and Gahiji");
  const flatten = (deck) =>
    [
      ...deck.cards.map((card) => ({ card, commander: false })),
      ...(deck.commanders ?? []).map((card) => ({ card, commander: true })),
    ].map(({ card, commander }) => ({
      name: card.identity.name,
      setCode: card.identity.setCode,
      collectorNumber: card.identity.cardNumber,
      foil: Boolean(card.identity.foil),
      commander,
    }));
  return {
    gameId: "internal-ai-replay-commander",
    variant: "Commander",
    startingLife: 40,
    seed: 27011,
    snapshotRecording: false,
    players: [
      {
        name: "You",
        ai: false,
        deck: flatten(player),
        commanderNames: player.commanders.map((card) => card.identity.name),
      },
      {
        name: "Forge AI",
        ai: true,
        deck: flatten(opponent),
        commanderNames: opponent.commanders.map((card) => card.identity.name),
      },
    ],
  };
}

const common = {
  jar: values.jar,
  java: values.java,
  forgeHome: values["forge-home"],
  // Matches the Forge WebImage boot: WasmMain sets this property before
  // loading ThreadUtil, so AI evaluation runs on the seeded game thread.
  javaOptions: ["-Dforge.synchronous=true", "-Dmanabrew.replay.debugWitness=true"],
};

function normalized(view) {
  const { checkpoints, decisionHistory, restoreVote, snapshotRecording, ...game } = view;
  return game;
}

async function roundTrip(request, atDecision, continuation) {
  const sessionId = request.gameId;
  let source = harness({ ...common, sessionId });
  let restored;
  const directory = mkdtempSync(join(tmpdir(), "manabrew-ai-journal-roundtrip-"));
  try {
    // The product remains safe-by-default. No new API client silently opts
    // internal Forge AI into a journal/replay path that has limited coverage.
    const base = { ...request, decisionJournal: true, journalRewind: false };
    await assert.rejects(
      source.call("startGame", { payload: JSON.stringify(base) }),
      /decision journal requires external decisions/,
    );
    const optIn = { ...base, experimentalInternalAiReplay: true };
    await source.call("startGame", { payload: JSON.stringify(optIn) });

    let lastId;
    let startRequest = null;
    const entries = [];
    let boundaryPrompt;
    let snapshot;
    for (let index = 0; index <= atDecision; index++) {
      const prompt = await source.prompt(lastId);
      const batch = await source.drain();
      if (batch?.unavailableReason)
        throw new Error("Journal invalidated: " + batch.unavailableReason);
      if (batch?.startRequest) startRequest = batch.startRequest;
      if (batch?.entries) entries.push(...batch.entries);
      if (index === atDecision) {
        assert.equal(entries.length, index, "complete recorded decision prefix");
        assert(startRequest, "journal start request must be durable");
        boundaryPrompt = prompt;
        snapshot = JSON.parse(
          await source.call("exportReplaySnapshot", {
            payload: JSON.stringify({ version: 2, startRequest, entries }),
          }),
        );
        assert.equal(snapshot.version, 1);
        assert.equal(snapshot.nextSequence, index + 1);
        assert(snapshot.verification?.state && snapshot.verification?.rng);
        const before = JSON.parse(await source.call("getSnapshot", { viewer: 0 }));
        console.log(
          "INTERNAL_FORGE_AI_CHECKPOINT",
          JSON.stringify({
            fixture: sessionId,
            turn: before.turn,
            decisions: index,
          }),
        );
        break;
      }
      await source.call("submitAction", {
        payload: JSON.stringify(scriptedAnswer({ prompt })),
      });
      lastId = prompt.promptId;
    }

    // Capture a golden continuation in the original engine. Then terminate it
    // and restore the checkpoint from disk in another JVM, not alongside it.
    // The test driver holds only expected results and user actions.
    const expected = [];
    let previousSource = boundaryPrompt.promptId;
    for (let index = 0; index < continuation; index++) {
      const prompt = index === 0 ? boundaryPrompt : await source.prompt(previousSource);
      const view = normalized(JSON.parse(await source.call("getSnapshot", { viewer: 0 })));
      expected.push({ prompt, view });
      await source.call("submitAction", {
        payload: JSON.stringify(scriptedAnswer({ prompt })),
      });
      previousSource = prompt.promptId;
    }
    // Model a saved state, not just another in-memory JavaScript object.
    // Write privately, sync, atomically publish, then kill the original JVM.
    const stagedPath = join(directory, "checkpoint.partial");
    const checkpointPath = join(directory, "checkpoint.json");
    writeFileSync(stagedPath, JSON.stringify(snapshot), { mode: 0o600, flag: "wx" });
    const dataHandle = openSync(stagedPath, "r");
    try {
      fsyncSync(dataHandle);
    } finally {
      closeSync(dataHandle);
    }
    renameSync(stagedPath, checkpointPath);
    const dirHandle = openSync(directory, "r");
    try {
      fsyncSync(dirHandle);
    } finally {
      closeSync(dirHandle);
    }
    source.close();
    source = null;
    console.log("INTERNAL_FORGE_AI_SOURCE_KILLED", sessionId);
    const stored = JSON.parse(readFileSync(checkpointPath, "utf8"));

    restored = harness({ ...common, sessionId });
    await restored.call("restoreReplaySnapshot", { payload: JSON.stringify(stored) });
    let previousRestore;
    for (let index = 0; index < expected.length; index++) {
      const prompt = await restored.prompt(previousRestore);
      assert.deepEqual(
        prompt,
        expected[index].prompt,
        "prompt divergence after disk restore: " + index,
      );
      const view = normalized(JSON.parse(await restored.call("getSnapshot", { viewer: 0 })));
      assert.deepEqual(
        view,
        expected[index].view,
        "game-state divergence after disk restore: " + index,
      );
      await restored.call("submitAction", {
        payload: JSON.stringify(scriptedAnswer({ prompt })),
      });
      previousRestore = prompt.promptId;
    }
    console.log(
      "INTERNAL_FORGE_AI_DISK_RESTORE_CONTINUED",
      JSON.stringify({ fixture: sessionId, atDecision, furtherDecisions: continuation }),
    );
    // A corrupt witness must never become an apparently valid resumed game.
    const invalid = harness({ ...common, sessionId });
    try {
      const tampered = structuredClone(stored);
      tampered.verification.state = "deliberately-invalid";
      await assert.rejects(
        invalid.call("restoreReplaySnapshot", { payload: JSON.stringify(tampered) }),
        /terminal state.RNG divergence/,
      );
      console.log("INTERNAL_FORGE_AI_CORRUPT_SNAPSHOT_REJECTED", sessionId);
    } finally {
      invalid.close();
    }
  } finally {
    source?.close();
    restored?.close();
    rmSync(directory, { recursive: true, force: true });
  }
}

// Prove that the opt-in cannot bypass the known non-deterministic default
// JVM AI thread path. This check runs in a separate JVM before any game.
const unsafe = harness({
  ...common,
  sessionId: "internal-ai-replay-unsafe-guard",
  javaOptions: ["-Dforge.synchronous=false"],
});
try {
  const request = {
    ...forestFixture(),
    gameId: "internal-ai-replay-unsafe-guard",
    decisionJournal: true,
    experimentalInternalAiReplay: true,
  };
  await assert.rejects(
    unsafe.call("startGame", { payload: JSON.stringify(request) }),
    /requires synchronous Forge/,
  );
  console.log("INTERNAL_FORGE_AI_ASYNC_JVM_REJECTED");
} finally {
  unsafe.close();
}

const seedCount = Number(values["seed-count"]);
const seedStart = Number(values["seed-start"]);
assert(Number.isInteger(seedCount) && seedCount >= 1 && seedCount <= 5);
assert(Number.isInteger(seedStart) && seedStart >= 0 && seedStart <= 10000);
for (let offset = seedStart; offset < seedStart + seedCount; offset++) {
  const simple = forestFixture();
  simple.seed += offset;
  simple.gameId += "-seed-" + offset;
  await roundTrip(simple, 35, 8);
  if (values["personal-decks"]) {
    const commander = commanderFixture(values["personal-decks"]);
    commander.seed += offset;
    commander.gameId += "-seed-" + offset;
    await roundTrip(commander, 55, 20);
  }
}
