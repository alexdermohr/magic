#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const forge = join(root, "forge");
const patch = join(root, "patches", "forge-ai-commander-pressure.patch");
const jar = join(root, "forge-harness", "target", "forge-harness-jar-with-dependencies.jar");
const probe = join(root, "forge-harness", "src", "test", "java", "forge", "harness", "common", "CommanderDamageDefenderProbe.java");
const rel = join("forge-ai", "src", "main", "java", "forge", "ai", "AiAttackController.java");
const java = (name) => process.env.JAVA_HOME ? join(process.env.JAVA_HOME, "bin", name) : name;

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", timeout: 120000 });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.error || result.stdout}`);
  }
  return result.stdout.trim();
}

if (!existsSync(join(forge, rel)) || !existsSync(jar)) {
  throw new Error("Run yarn build:harness after preparing the pinned Forge source before testing.");
}
const pin = run("bash", [join(root, "scripts", "bootstrap-forge.sh"), "--print-pin"]);
if (run("git", ["-C", forge, "rev-parse", "HEAD"]) !== pin
    || run("git", ["-C", forge, "status", "--porcelain"])) {
  throw new Error("Forge must be a clean checkout at the pin; do not patch the source tree.");
}

const scratch = mkdtempSync(join(tmpdir(), "manabrew-forge-pressure-"));
try {
  const patchedFile = join(scratch, rel);
  mkdirSync(dirname(patchedFile), { recursive: true });
  copyFileSync(join(forge, rel), patchedFile);
  run("git", ["init", "-q"], scratch);
  run("git", ["apply", "--check", patch], scratch);
  run("git", ["apply", patch], scratch);

  const probeDir = join(scratch, "probe");
  const overlayDir = join(scratch, "overlay");
  mkdirSync(probeDir);
  mkdirSync(overlayDir);
  run(java("javac"), ["-cp", jar, "-d", probeDir, probe]);
  const command = [java("java"), "-cp", probeDir + ":" + jar,
    "forge.harness.common.CommanderDamageDefenderProbe"];
  const baseline = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: "utf8", timeout: 120000,
  });
  const baselineCount = baseline.stdout?.match(/COMMANDER_TARGETING wounded=(\d+) intact=(\d+)/);
  if (!baselineCount || baseline.status === 0 || Number(baselineCount[2]) < 1) {
    throw new Error(`Expected unpatched Forge to ignore near-lethal commander damage: ${baseline.stdout} ${baseline.stderr}`);
  }

  run(java("javac"), ["-cp", jar, "-d", overlayDir, patchedFile]);
  const corrected = run(java("java"), ["-cp", overlayDir + ":" + probeDir + ":" + jar,
    "forge.harness.common.CommanderDamageDefenderProbe"]);
  if (!corrected.includes("COMMANDER_TARGETING wounded=30 intact=0")) {
    throw new Error("Patched controller did not prefer the commander-lethal target");
  }
  console.log(`FORGE_COMMANDER_PRESSURE RED ${baselineCount[1]}/30, GREEN 30/30, pin ${pin}`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}