import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
for (const file of ["offline-sw.js", "offline-setup.html", "manifest.webmanifest", "forge-legacy-bridge.worker.js"]) {
  await copyFile(join("public", file), join(root, file));
}
// Standard web builds must open the app; only this prepared offline PWA opens
// the installer from the Home-Screen icon until the local cache is ready.
const manifestPath = join(root, "manifest.webmanifest");
const offlineManifest = JSON.parse(await readFile(manifestPath, "utf8"));
offlineManifest.start_url = "/offline-setup.html";
await writeFile(manifestPath, JSON.stringify(offlineManifest, null, 2) + "\n");

// This published release loads the hashed worker, while the iPad setup
// self-test loads the un-hashed copy. They must execute exactly the same bridge.
const workerAssets = (await readdir(join(root, "assets"))).filter((name) =>
  /^forge-engine\.worker-[A-Za-z0-9_-]+\.js$/.test(name),
);
if (workerAssets.length !== 1) {
  throw new Error("Expected exactly one versioned Forge worker in the built release");
}
const gameWorker = join(root, "assets", workerAssets[0]);
const existingWorker = await readFile(gameWorker, "utf8");
if (existingWorker.startsWith("// Compatibility worker for the last published")) {
  await copyFile(join("public", "forge-legacy-bridge.worker.js"), gameWorker);
} else {
  console.log("Fresh source-built Forge worker retained");
}

const cardsetManifest = JSON.parse(await readFile(join(root, "wasm/cardset.manifest.json"), "utf8"));
const cardset = await readFile(join(root, "wasm", cardsetManifest.archive));
const aliases = Object.fromEntries(
  [...cardset.toString("utf8").matchAll(/Name:([^\r\n]+)\nVariant:UniversesWithin:FlavorName:([^\r\n]+)/g)]
    .map((match) => [match[2], match[1]]),
);
if (aliases["Wernog, Rider's Chaplain"] !== "Will the Wise" ||
    aliases["Greymond, Avacyn's Stalwart"] !== "Rick, Steadfast Leader") {
  throw new Error("Forge Universes Within aliases missing from the selected cardset");
}
await mkdir(join(root, "legacy"), { recursive: true });
await writeFile(join(root, "legacy/forge-aliases.json"), JSON.stringify(aliases) + "\n");

const indexPath = join(root, "index.html");
const oldIndex = await readFile(indexPath, "utf8");
const scripts = [
  '<script>if (location.pathname === "/" || location.pathname === "/play") location.replace("/offline-setup.html");</script>',
  '<script>if ("serviceWorker" in navigator && !("__TAURI_INTERNALS__" in window)) navigator.serviceWorker.register("/offline-sw.js", { scope: "/" }).catch(console.error);</script>',
];
let newIndex = oldIndex;
for (const script of scripts) {
  if (script.includes('serviceWorker.register("/offline-sw.js"') &&
      newIndex.includes('serviceWorker.register("/offline-sw.js"')) continue;
  if (!newIndex.includes(script)) {
    if (!newIndex.includes("</body>")) throw new Error("Expected closing body tag in built index");
    newIndex = newIndex.replace("</body>", "    " + script + "\n  </body>");
  }
}
if (newIndex !== oldIndex) await writeFile(indexPath, newIndex);

const configPath = join(root, "config.js");
let config = await readFile(configPath, "utf8");
// localhost here means the iPad itself, never the NixOS host.
// The official relay built into Manabrew is used when the custom relay is absent.
if (/relay:\s*\{\s*host:\s*["']localhost["']/.test(config)) {
  config = config.replace(/relay:\s*\{[^}]*\},\s*/, "");
}
const enableForge = '\nwindow.__MANABREW_RUNTIME__.featureFlags = { ...window.__MANABREW_RUNTIME__.featureFlags, forgeWasm: true };\n';
if (!config.includes("forgeWasm: true")) config += enableForge;
await writeFile(configPath, config);

console.log("Offline assets staged. Run: node scripts/generate-offline-assets.mjs " + root);