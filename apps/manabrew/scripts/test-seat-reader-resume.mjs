// Node-only transport regression: real worker threads and SharedArrayBuffer,
// without compiling the full (86 MB) Forge WebImage.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { Worker } from "node:worker_threads";
import { test } from "node:test";
import {
  SAB_SIZE,
  SIGNAL_IDLE,
  SIGNAL_PROMPT_READY,
  SIGNAL_PROMPT_ACKNOWLEDGED,
  acknowledgeSeatMessage,
  createSeat,
} from "../packages/forge-wasm/seat.js";

const HEARTBEAT = "__manabrew_seat_reader_alive__";
const script = stripTypeScriptTypes(
  readFileSync(new URL("../src/workers/seat-reader.worker.ts", import.meta.url), "utf8"),
  { mode: "strip" },
).replace(/^import .*;$/gm, "");
assert.ok(!script.includes("MessageEvent<"), "reader TypeScript types were not stripped");

function startReader(buffer, deliveryControl = new SharedArrayBuffer(4)) {
  // Execute the checked-in browser worker loop unchanged, with only its Vite
  // imports and one type annotation replaced by their compiled constants.
  const shim = [
    'const { parentPort } = require("node:worker_threads");',
    "const SAB_SIZE = 256 * 1024;",
    "const SIGNAL_PROMPT_READY = 1;",
    'const SEAT_READER_HEARTBEAT = "__manabrew_seat_reader_alive__";',
    "const self = { postMessage: (message) => parentPort.postMessage(message), onmessage: null };",
    "parentPort.on('message', (data) => self.onmessage({ data }));",
  ].join("\n");
  const worker = new Worker(shim + "\n" + script, { eval: true });
  worker.postMessage({ buffer, deliveryControl });
  return { worker, delivery: new Int32Array(deliveryControl) };
}

function writeFrame(seat, value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  seat.data.set(bytes);
  Atomics.store(seat.signal, 1, bytes.length);
  Atomics.store(seat.signal, 0, SIGNAL_PROMPT_READY);
  Atomics.notify(seat.signal, 0);
}

async function nextFrame(worker) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("no Forge seat frame was delivered"));
    }, 6000);
    function cleanup() {
      clearTimeout(timeout);
      worker.off("message", onMessage);
      worker.off("error", onError);
      worker.off("exit", onExit);
    }
    function onMessage(message) {
      if (message === HEARTBEAT) return;
      cleanup();
      resolve(JSON.parse(message));
    }
    function onError(error) {
      cleanup();
      reject(error);
    }
    function onExit(code) {
      cleanup();
      reject(new Error("reader exited: " + code));
    }
    worker.on("message", onMessage);
    worker.on("error", onError);
    worker.on("exit", onExit);
  });
}

function acknowledge(seat, delivery) {
  assert.equal(acknowledgeSeatMessage(seat), true);
  Atomics.add(delivery, 0, 1);
  Atomics.notify(delivery, 0);
}

test("a worker killed after decoding does not consume the unread Forge prompt", async () => {
  const seat = createSeat(new SharedArrayBuffer(SAB_SIZE));
  writeFrame(seat, { kind: "prompt", promptId: 41 });
  const first = startReader(seat.buffer);
  try {
    assert.deepEqual(await nextFrame(first.worker), { kind: "prompt", promptId: 41 });
    // Simulate page suspension before main thread processes the queued frame.
    assert.equal(Atomics.load(seat.signal, 0), SIGNAL_PROMPT_READY);
    await first.worker.terminate();
    const replacement = startReader(seat.buffer);
    try {
      assert.deepEqual(await nextFrame(replacement.worker), { kind: "prompt", promptId: 41 });
      acknowledge(seat, replacement.delivery);
      assert.equal(Atomics.load(seat.signal, 0), SIGNAL_PROMPT_ACKNOWLEDGED);
    } finally {
      await replacement.worker.terminate();
    }
  } finally {
    await first.worker.terminate();
  }
});

test("ACK->READY in the same event turn cannot eat the next frame", async () => {
  const seat = createSeat(new SharedArrayBuffer(SAB_SIZE));
  const reader = startReader(seat.buffer);
  try {
    const first = nextFrame(reader.worker);
    writeFrame(seat, { kind: "prompt", promptId: 51 });
    assert.deepEqual(await first, { kind: "prompt", promptId: 51 });
    // Forge can publish its next frame before the seat reader is scheduled.
    // The separate delivery sequence must still make it read prompt 52.
    const second = nextFrame(reader.worker);
    assert.equal(acknowledgeSeatMessage(seat), true);
    writeFrame(seat, { kind: "prompt", promptId: 52 });
    Atomics.add(reader.delivery, 0, 1);
    Atomics.notify(reader.delivery, 0);
    assert.deepEqual(await second, { kind: "prompt", promptId: 52 });
    acknowledge(seat, reader.delivery);
  } finally {
    await reader.worker.terminate();
  }
});

test("idle reader announces a liveness heartbeat after its wait timeout", async () => {
  const seat = createSeat(new SharedArrayBuffer(SAB_SIZE));
  const reader = startReader(seat.buffer);
  try {
    const message = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("seat heartbeat missing")), 5_000);
      reader.worker.on("message", (value) => {
        if (value !== HEARTBEAT) return;
        clearTimeout(timeout);
        resolve(value);
      });
      reader.worker.on("error", reject);
    });
    assert.equal(message, HEARTBEAT);
    assert.equal(Atomics.load(seat.signal, 0), SIGNAL_IDLE);
  } finally {
    await reader.worker.terminate();
  }
});
