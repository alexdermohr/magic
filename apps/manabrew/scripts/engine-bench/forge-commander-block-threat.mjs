#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const forge = resolve(process.argv[2] ?? join(root, "forge"));
const jar = resolve(process.argv[3] ?? join(root, "forge-harness", "target", "forge-harness-jar-with-dependencies.jar"));
const patch = join(root, "patches", "forge-ai-commander-block-threat.patch");
const probe = join(root, "forge-harness", "src", "test", "java", "forge", "harness", "common", "CommanderBlockThreatProbe.java");
const rel = join("forge-ai", "src", "main", "java", "forge", "ai", "ComputerUtilCombat.java");
const pin = "be9e0c8a5b561ae3e909c2f9a8bdac0a7fa2b097";
const java = name => process.env.JAVA_HOME ? join(process.env.JAVA_HOME, "bin", name) : name;

function run(binary, args, cwd = root) {
  const result = spawnSync(binary, args, { cwd, encoding: "utf8", timeout: 120000 });
  if (result.error || result.status !== 0) {
    throw new Error(`${binary} ${args.join(" ")}: ${result.stderr || result.stdout || result.error}`);
  }
  return result.stdout.trim();
}

if (!existsSync(join(forge, rel)) || !existsSync(jar)) {
  throw new Error("Pinned Forge source and built forge-harness jar required. Optional args: <forge-path> <harness-jar>.");
}
assert.equal(run("git", ["-C", forge, "rev-parse", "HEAD"]), pin);
assert.equal(run("git", ["-C", forge, "status", "--porcelain"]), "");

const scratch = mkdtempSync(join(tmpdir(), "forge-commander-block-"));
try {
  const patchedFile = join(scratch, rel);
  mkdirSync(dirname(patchedFile), { recursive: true });
  copyFileSync(join(forge, rel), patchedFile);
  run("git", ["init", "-q"], scratch);
  run("git", ["apply", "--check", patch], scratch);
  run("git", ["apply", patch], scratch);
  const compiledProbe = join(scratch, "probe");
  const compiledOverlay = join(scratch, "overlay");
  mkdirSync(compiledProbe);
  mkdirSync(compiledOverlay);
  run(java("javac"), ["-cp", jar, "-d", compiledProbe, probe]);
  const className = "forge.harness.common.CommanderBlockThreatProbe";
  const pattern = /COMMANDER_BLOCK_THREAT unblocked=(\d+) assigned=(\d+) blocked=(\d+) danger=(\d+) serious=(\d+) trample=(\d+)/;
  const measure = extra => {
    const output = run(java("java"), ["-cp", [...extra, compiledProbe, jar].join(":"), className], dirname(forge));
    const match = output.match(pattern);
    if (!match) throw new Error("No threat measurement in " + output);
    return match.slice(1).map(Number);
  };
  const baseline = measure([]);
  assert.deepEqual(baseline, [1, 1, 1, 1, 1, 1], "Unpatched Forge must reproduce false lethal threat after blocking");
  run(java("javac"), ["-cp", jar, "-d", compiledOverlay, patchedFile]);
  const patched = measure([compiledOverlay]);
  assert.deepEqual(patched, [1, 0, 0, 0, 0, 1], "Patch must preserve unblocked/trample threats and clear blocked-only threat");
  console.log("FORGE_COMMANDER_BLOCK RED=" + baseline.join(",") +
    " GREEN=" + patched.join(",") + " pin=" + pin);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}