// Compatibility worker for the last published, pre-embedded-assets Forge WASM
// engine (@manabrew/forge-wasm 0.2.0). This worker presents the normal
// Manabrew WorkerBridge protocol; no server is involved.
let leaf = null;
let startPending = false;
let bundlePromise = null;
let ackTimer = null;

const response = (requestId, payload, error) =>
  self.postMessage({ type: "response", requestId, ...(error ? { error: String(error) } : { payload }) });
const note = (text, level = "log") =>
  self.postMessage({ type: "event", event: "forge:log", payload: { level, text } });

async function loadAssets(decks) {
  if (!bundlePromise) {
    bundlePromise = Promise.all([
      import("/legacy/forge-assets.js"),
      import("/legacy/deckCards.js"),
      fetch("/legacy/forge-assets_bg.wasm").then(async (r) => {
        if (!r.ok) throw new Error("Forge assets builder unavailable (HTTP " + r.status + ")");
        return r.arrayBuffer();
      }),
      fetch("/wasm/cardset.ba5f500f819f5838.rkyv").then(async (r) => {
        if (!r.ok) throw new Error("Forge 2026 cardset unavailable (HTTP " + r.status + ")");
        return new Uint8Array(await r.arrayBuffer());
      }),
      fetch("/legacy/forge-aliases.json").then(async (r) => {
        if (!r.ok) throw new Error("Forge Universes Within aliases unavailable (HTTP " + r.status + ")");
        return r.json();
      }),
    ]).then(async ([assetBuilder, cardTools, wasm, archive, aliases]) => {
      await assetBuilder.default({ module_or_path: wasm });
      return { assetBuilder, cardTools, archive, aliases };
    });
  }
  const { assetBuilder, cardTools, archive, aliases } = await bundlePromise;
  const wanted = cardTools.deckCardNames(decks);
  const selected = new Set(wanted);
  for (const name of wanted) {
    if (aliases[name]) selected.add(aliases[name]);
  }
  note("[legacy bridge] bundling rules for " + wanted.length + " distinct deck cards");
  let bundle = assetBuilder.forge_asset_bundle(archive, [...selected]);
  for (let attempt = 0; attempt < 4; attempt++) {
    const missing = [...bundle.matchAll(/(?:^|\n)MeldPair:([^\r\n\0]+)/g)]
      .map((match) => match[1].trim())
      .filter((name) => name && !selected.has(name));
    if (!missing.length) break;
    for (const name of missing) selected.add(name);
    bundle = assetBuilder.forge_asset_bundle(archive, [...selected]);
  }
  const flavorNames = wanted.filter((name) => aliases[name]);
  if (flavorNames.length) {
    const entries = bundle.split("\0");
    for (const flavor of flavorNames) {
      if (entries.some((item, index) => index % 2 === 1 && item.startsWith("Name:" + flavor + "\n"))) {
        continue;
      }
      const source = aliases[flavor];
      const header = "Name:" + source + "\n";
      const variant = "Variant:UniversesWithin:FlavorName:" + flavor + "\n";
      const index = entries.findIndex((path, i) =>
        i % 2 === 0 && path.startsWith("res/cardsfolder/") &&
        entries[i + 1]?.startsWith(header) && entries[i + 1].includes(variant));
      if (index < 0) throw new Error("Missing Universes Within rules for " + flavor);
      const script = entries[index + 1].replace(header, "Name:" + flavor + "\n")
        .replace(variant, "");
      const filename = flavor.toLowerCase().normalize("NFKD").replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      bundle += "res/cardsfolder/" + filename[0] + "/" + filename + ".txt\0" + script + "\0";
    }
    note("[legacy bridge] restored " + flavorNames.length + " Universes Within rule aliases");
  }
  return bundle;
}

async function start(command) {
  const args = command.args ?? {};
  const multiplayer = command.command === "start_multiplayer_game";
  const decks = multiplayer
    ? args.decks ?? []
    : [args.deck, ...(args.opponentDecks?.length ? args.opponentDecks : [args.deck])];
  if (decks.some((deck) => !deck) || !decks.length) throw new Error("Missing Forge deck.");
  const forgeAssets = await loadAssets(decks);

  // This child uses its own Worker, its own Java/WASM game and SABs. It never
  // contacts the network; all executable files and card scripts are cached.
  leaf = new Worker("/legacy/forge-engine.worker.js");
  leaf.onerror = (err) => {
    note("[legacy bridge] game worker failed: " + err.message, "error");
    response(command.requestId, null, "Legacy Forge worker failed: " + err.message);
    self.postMessage({
      type: "event",
      event: "game:forced_end",
      payload: { reason: "worker_error", message: String(err.message) },
    });
    if (ackTimer !== null) clearInterval(ackTimer);
    ackTimer = null;
    leaf?.terminate();
    leaf = null;
  };
  leaf.onmessage = ({ data }) => {
    if (data?.type === "event" && data.event === "worker:init") {
      leaf.postMessage({
        ...command,
        args: {
          ...args,
          forgeAssets,
          forgeLauncherUrl: "/legacy/forgeharness.js",
          forgeWasmUrl: "/legacy/forgeharness.js.wasm",
          // Old engine ships internal Forge AI; it does not use Manabot seats.
          forgeAi: true,
        },
      });
    } else {
      if (data?.type === "event" && data.event === "game:sab") {
        const sig = new Int32Array(data.payload.buffer, 0, 2);
        const bytes = new Uint8Array(data.payload.buffer, 8);
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        if (ackTimer !== null) clearInterval(ackTimer);
        ackTimer = setInterval(() => {
          const state = Atomics.load(sig, 0);
          if (state !== 3) return;
          const length = Atomics.load(sig, 1);
          if (length <= 0 || length > bytes.length) return;
          let prompt;
          try {
            prompt = JSON.parse(decoder.decode(bytes.slice(0, length)));
          } catch {
            return;
          }
          if (prompt?.kind !== "prompt") return;
          const input = prompt.prompt?.input;
          const isAiWarning = input?.type === "revealCards" &&
            input.cards?.length === 0 &&
            String(input.presentation?.title ?? "").startsWith("AI can't play these cards well");
          const isDiceNotification = input?.type === "diceRolled";
          if (!isAiWarning && !isDiceNotification) return;
          const output = isAiWarning
            ? { type: "revealCardsAcknowledged" }
            : { type: "diceRolledAcknowledged" };
          const answer = encoder.encode(JSON.stringify({
            kind: "response",
            promptId: prompt.prompt.promptId,
            action: { type: input.type, output },
          }));
          if (answer.length > bytes.length) return;
          bytes.set(answer);
          Atomics.store(sig, 1, answer.length);
          Atomics.store(sig, 0, 2);
          Atomics.notify(sig, 0);
          note("[legacy bridge] acknowledged " + input.type + " informational prompt " + prompt.prompt.promptId, "warn");
        }, 50);
      }
      self.postMessage(data);
      if (data?.type === "event" && (data.event === "game:over" || data.event === "game:forced_end")) {
        if (ackTimer !== null) clearInterval(ackTimer);
        ackTimer = null;
        leaf?.terminate();
        leaf = null;
      }
    }
  };
}

self.onmessage = ({ data }) => {
  if (!data || data.type !== "command") return;
  if (data.command === "start_game" || data.command === "start_multiplayer_game") {
    if (startPending || leaf) return response(data.requestId, null, "Game already running.");
    startPending = true;
    start(data).catch((err) => {
      note("[legacy bridge] start failed: " + (err?.stack ?? err), "error");
      response(data.requestId, null, err?.message ?? String(err));
    }).finally(() => {
      startPending = false;
    });
  } else if (leaf) {
    leaf.postMessage(data);
  } else if (data.command === "end_game") {
    response(data.requestId, null);
  } else if (data.command === "wasm_init" || data.command === "ensure_card_data") {
    // The legacy engine initializes when a game starts; do not download its
    // large cardset just to answer an optional capability probe.
    response(data.requestId, "ok");
  } else {
    response(data.requestId, null, "No game running: " + data.command);
  }
};
self.postMessage({ type: "event", event: "worker:init", payload: { stage: "ready" } });