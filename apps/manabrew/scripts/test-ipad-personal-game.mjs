const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");

const origin = process.argv[2] ?? "http://127.0.0.1:8092";
const profile = process.env.MANABREW_TEST_PROFILE ?? "/tmp/manabrew-ipad-personal-game";
const player = process.argv[3] ?? "Ardenn, Intrepid Archaeologist";
const opponent = process.argv[4] ?? "Malcolm, Keen-Eyed Navigator";
const ctx = await chromium.launchPersistentContext(profile, {
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  viewport: { width: 1180, height: 820 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
  args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      ...(process.env.MANABREW_TEST_HOST_RESOLVER_RULES
        ? ["--host-resolver-rules=" + process.env.MANABREW_TEST_HOST_RESOLVER_RULES]
        : []),
    ],
  serviceWorkers: "allow",
});
const page = ctx.pages()[0] ?? await ctx.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const state = async (step) => {
  const result = await page.evaluate(() => ({
    offline: navigator.onLine === false,
    text: document.body.innerText.slice(-1050),
    decisions: (window.__engineDecisions ?? []).slice(-10),
    forge: (window.__forgeLog ?? []).slice(-8),
  }));
  console.log(step, JSON.stringify(result).slice(0, 5100));
  return result;
};

try {
  await ctx.setOffline(true);
  await page.goto(origin + "/play/offline/constructed", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  const own = await page.evaluate(() => {
    const raw = localStorage.getItem("manabrew-deck-storage");
    const saved = JSON.parse(raw ?? "{}")?.state?.savedDecks ?? [];
    return {
      count: saved.filter((s) => s.id.startsWith("github:alexdermohr/magic:")).length,
      partners: saved.filter((s) => s.id.startsWith("github:alexdermohr/magic:") && s.deck.commanders?.length === 2).length,
      valid: saved.filter((s) => s.id.startsWith("github:alexdermohr/magic:"))
        .every((s) => s.deck.cards?.length + (s.deck.commanders?.length ?? 0) === 100),
      sampleImage: saved[0]?.deck.cards?.[0]?.uris?.normal,
      sampleCrop: saved[0]?.deck.cards?.[0]?.uris?.art_crop,
    };
  });
  console.log("PERSONAL_DECK_STORAGE:", JSON.stringify(own));
  if (own.count !== 35 || own.partners !== 4 || !own.valid)
    throw new Error("Saved GitHub decks incomplete or malformed");

  const imageCheck = await page.evaluate(async (url) => {
    const r = await fetch(url);
    const b = await r.blob();
    return { status: r.status, type: b.type, bytes: b.size };
  }, own.sampleImage);
  console.log("OFFLINE_ARTWORK:", JSON.stringify(imageCheck));
  if (imageCheck.status !== 200 || !imageCheck.type.startsWith("image/") || imageCheck.bytes < 1000)
    throw new Error("Artwork not available offline");
  if (!own.sampleCrop?.startsWith("/a/") || own.sampleCrop === own.sampleImage)
    throw new Error("Art crop must have its own locally bundled URL");
  const cropCheck = await page.evaluate(async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return { status: response.status, type: blob.type, bytes: blob.size, ...dimensions };
  }, own.sampleCrop);
  console.log("OFFLINE_ART_CROP:", JSON.stringify(cropCheck));
  if (cropCheck.status !== 200 || cropCheck.type !== "image/jpeg" ||
      cropCheck.bytes < 1500 || cropCheck.width < 100 || cropCheck.height < 100)
    throw new Error("Distinct offline artwork crop is missing or undecodable");

  await page.getByRole("button", { name: new RegExp("^" + player) }).first().waitFor({ timeout: 45000 });
  await state("PICKER:");
  await page.getByRole("button", { name: new RegExp("^" + player) }).first().click();
  await page.getByRole("button", { name: new RegExp("^" + opponent) }).first().click();
  const fight = page.getByRole("button", { name: /^Fight!?$/ }).first();
  await fight.waitFor({ timeout: 15000 });
  if (!(await fight.isEnabled())) throw new Error("Personal matchup cannot start");
  await fight.click();
  await page.getByRole("dialog").getByRole("button", { name: /^Fight!?$/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: /1v1/ }).click();
  await page.getByRole("button", { name: /^KEEP$/i }).waitFor({ timeout: 150000 });
  const mulligan = await state("PERSONAL_MULLIGAN:");
  if (!mulligan.text.includes("Your hand, 7 cards")) throw new Error("No personal deck 7-card hand");
  await page.getByRole("button", { name: /^KEEP$/i }).click({ timeout: 20000 });
  await page.waitForFunction(() => /current step (Main|Begin Combat|Draw)/.test(document.body.innerText), null, { timeout: 90000 });
  const progressed = await state("PERSONAL_AFTER_KEEP:");
  if (/Reconnecting…/.test(progressed.text)) throw new Error("Relay reconnect banner blocks local gameplay");
  if (!progressed.text.includes("Your hand, ")) throw new Error("Hand lost after Mulligan");
  console.log("PERSONAL_GAME_PROGRESSED:", JSON.stringify({ player, opponent, errors }));
} finally {
  await ctx.close();
}