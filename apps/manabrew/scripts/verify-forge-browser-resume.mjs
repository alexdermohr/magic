import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const filename = resolve(process.argv[2] ?? "packages/forge-wasm/forgeharness.js.wasm");
const binary = readFileSync(filename);
const required = [
  "experimentalInternalAiReplay",
  "forge:recovery_checkpoint",
  "browserRecoveryBoundary",
];
const missing = required.filter((marker) => !binary.includes(Buffer.from(marker)));
if (missing.length) {
  throw new Error(
    "Forge WebImage cannot resume local AI games: missing " + missing.join(", ") +
    ". Build the current Java harness with build-forge-wasm.sh or provide MANABREW_FORGE_WEBIMAGE_DIR.",
  );
}
console.log("FORGE_BROWSER_RESUME_CAPABILITIES_PASS", JSON.stringify({
  bytes: binary.length,
  sha256: createHash("sha256").update(binary).digest("hex"),
}));
