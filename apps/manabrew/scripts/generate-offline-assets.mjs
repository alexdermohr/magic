import { createHash } from "node:crypto";
import { readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { resolve, join, relative, sep } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const excluded = new Set(["/offline-assets.json", "/.offline-assets.json.tmp", "/offline-ready.json", "/local-account.html", "/legacy/cardset.rkyv"]);
const entries = [];

async function visit(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, item.name);
    if (item.isDirectory()) {
      await visit(abs);
    } else if (item.isFile()) {
      const url = "/" + relative(root, abs).split(sep).join("/");
      if (excluded.has(url)) continue;
      const bytes = await readFile(abs);
      entries.push({
        url,
        bytes: (await stat(abs)).size,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
    }
  }
}

await visit(root);
entries.sort((a, b) => a.url.localeCompare(b.url, "en"));
for (const required of ["/index.html", "/config.js", "/offline-sw.js", "/offline-setup.html", "/manifest.webmanifest"]) {
  if (!entries.some((entry) => entry.url === required)) throw new Error("Offline asset missing: " + required);
}
const version = createHash("sha256").update(JSON.stringify(entries)).digest("hex").slice(0, 20);
const manifest = {
  version,
  generatedAt: new Date().toISOString(),
  totalBytes: entries.reduce((total, file) => total + file.bytes, 0),
  files: entries,
};
const pending = join(root, ".offline-assets.json.tmp");
await writeFile(pending, JSON.stringify(manifest, null, 2) + "\n");
await rename(pending, join(root, "offline-assets.json"));
console.log(JSON.stringify({version, files: entries.length, totalBytes: manifest.totalBytes}));
