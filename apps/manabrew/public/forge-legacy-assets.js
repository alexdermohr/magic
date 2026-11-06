const equivalents = new Map([
  ["Wernog, Rider's Chaplain", "Will the Wise"],
  ["Greymond, Avacyn's Stalwart", "Rick, Steadfast Leader"],
]);

export function compatibleForgeAssets(cardset, deckNames, build) {
  const requested = new Set(deckNames);
  for (const [name, original] of equivalents) {
    if (requested.has(name)) requested.add(original);
  }

  const bundle = build(cardset, [...requested]);
  const parts = bundle.split("\0");
  const scripts = new Map();

  for (let index = 0; index + 1 < parts.length; index += 2) {
    if (!parts[index].startsWith("res/cardsfolder/")) continue;
    const name = parts[index + 1].match(/^Name:([^\n]+)/m)?.[1];
    if (name) scripts.set(name, parts[index + 1]);
  }

  let changed = false;
  const copies = [];
  for (const [alias, original] of equivalents) {
    if (!deckNames.includes(alias) || scripts.has(alias)) continue;
    const script = scripts.get(original);
    if (!script || !script.includes(`Variant:UniversesWithin:FlavorName:${alias}`)) {
      throw new Error("Forge rule script missing for " + alias);
    }
    const filename = alias.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/_$/, "");
    const path = `res/cardsfolder/${filename[0]}/${filename}.txt`;
    const adapted = script.replace(/^Variant:UniversesWithin:FlavorName:[^\n]*\n/m, "")
      .replaceAll(original, alias)
      .replaceAll(original.split(",")[0], alias.split(",")[0])
      .replace(/^Name:[^\n]+/m, "Name:" + alias);
    copies.push(path, adapted);
    changed = true;
  }

  for (let index = 0; index + 1 < parts.length; index += 2) {
    if (!parts[index].startsWith("res/cardsfolder/")) continue;
    const meldPair = parts[index + 1].match(/^MeldPair:([^\n]+)/m)?.[1]?.trim();
    if (!meldPair || deckNames.includes(meldPair)) continue;
    parts[index + 1] = parts[index + 1].replace(/^MeldPair:[^\n]*\n/m, "");
    changed = true;
  }

  if (!changed) return bundle;
  if (parts[parts.length - 1] === "") parts.pop();
  parts.push(...copies, "");
  return parts.join("\0");
}
