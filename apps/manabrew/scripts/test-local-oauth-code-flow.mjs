import assert from "node:assert/strict";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:8140";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : { channel: "chrome" }),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
let client = null;
let mode = null;
let startCount = 0;
const errors = [];

page.on("pageerror", (error) => errors.push(error.message));
await page.route("**/api/auth/providers", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ github: true, discord: true, email: true }),
  }),
);
await page.route("**/api/auth/oauth/github/start", async (route) => {
  const payload = route.request().postDataJSON();
  client = payload.client;
  mode = payload.mode;
  startCount++;
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      authorizeUrl:
        "https://github.com/login/oauth/authorize?state=local-test-only&client_id=nonexistent",
    }),
  });
});
await page.route("**/api/auth/exchange", (route) =>
  route.fulfill({ status: 401, contentType: "text/plain", body: "Invalid or expired code" }),
);

async function openSignIn() {
  await page.goto(base + "/settings", { waitUntil: "domcontentloaded" });
  const account = page.getByRole("button", { name: "Account", exact: true }).first();
  await account.waitFor({ timeout: 60000 });
  await account.click();
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
}

try {
  await openSignIn();
  await page.getByRole("button", { name: "Continue with GitHub" }).click();
  const link = page.getByRole("link", { name: "Open sign-in page" });
  await link.waitFor({ timeout: 15000 });
  assert.equal(client, "desktop");
  assert.equal(mode, "signin");
  assert.match(
    await link.getAttribute("href"),
    /^https:\/\/github\.com\/login\/oauth\/authorize\?/,
  );
  assert.equal(await link.getAttribute("target"), "_blank");
  assert.equal(new URL(page.url()).origin, base);
  await page.locator("#desktop-code").waitFor();
  assert.deepEqual(errors, []);
  console.log("LOCAL_OAUTH_CODE_PATH_PASS", JSON.stringify({ startCount, client, mode, errors }));

  await openSignIn();
  await page.getByRole("button", { name: "Enter an existing sign-in code" }).click();
  await page.locator("#desktop-code").fill("DEADBEEF");
  await page.getByRole("button", { name: "Continue", exact: true }).last().click();
  await page
    .getByText("Invalid or expired code", { exact: false })
    .first()
    .waitFor({ timeout: 12000 });
  assert.equal(await page.locator("#desktop-code").inputValue(), "DEADBEEF");
  assert.equal(new URL(page.url()).origin, base);
  assert.deepEqual(errors, []);
  console.log("LOCAL_OAUTH_REOPEN_INVALID_CODE_PASS", JSON.stringify({ errors }));
} finally {
  await browser.close();
}
