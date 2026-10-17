import { test, expect, expectNoSeriousAxe, expectNoHorizontalOverflow } from "./fixtures";

const AXE_ROUTES: Array<[string, string]> = [
  ["home", "/"],
  ["demo", "/demo"],
  ["live ASV", "/live?need=ASV"],
  ["Rampur", "/centre/DEMO-RAMPUR-1"],
  ["report", "/centre/DEMO-RAMPUR-1/report?drug=ASV"],
  ["staff", "/staff"],
  ["dashboard", "/dashboard"],
];

for (const [name, path] of AXE_ROUTES) {
  test(`no serious or critical axe violations on ${name}`, async ({ page }) => {
    await page.goto(path);
    await expectNoSeriousAxe(page);
  });
}

test("no serious or critical axe violations on a real proof", async ({ page }) => {
  await page.goto("/centre/DEMO-RAMPUR-1");
  const href = await page.getByRole("link", { name: /सबूत/ }).first().getAttribute("href");
  expect(href, "seeded stock should expose a proof link").toMatch(/^\/verify\/0x[0-9a-fA-F]+$/);
  await page.goto(href!);
  await expectNoSeriousAxe(page);
});

const OVERFLOW_ROUTES = [
  "/",
  "/?need=ASV",
  "/?need=ARV",
  "/centre/DEMO-RAMPUR-1",
  "/centre/DEMO-SONPUR-CHC",
  "/centre/DEMO-KALAPUR-2",
  "/centre/DEMO-RAMPUR-1/report",
  "/centre/DEMO-RAMPUR-1/report?drug=ASV",
  "/centre/NO-SUCH-CENTRE",
  "/staff",
  "/dashboard",
  "/about",
  "/poster",
  "/poster/DEMO-RAMPUR-1",
  "/poster/DEMO-SONPUR-CHC",
  "/poster/DEMO-KALAPUR-2",
  "/verify/0xdeadbeef",
];

test.describe("no horizontal overflow at 390px", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "overflow is asserted at the 390px viewport");
  });

  for (const path of OVERFLOW_ROUTES) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("real proof", async ({ page }) => {
    await page.goto("/centre/DEMO-SONPUR-CHC");
    const href = await page.getByRole("link", { name: /सबूत/ }).first().getAttribute("href");
    await page.goto(href!);
    await expectNoHorizontalOverflow(page);
  });

  test("staff dashboard", async ({ page }) => {
    await page.goto("/staff");
    await page.getByLabel("केंद्र", { exact: true }).selectOption("DEMO-RAMPUR-1");
    await page.getByRole("textbox", { name: "पिन", exact: true }).fill("1111");
    await page.getByRole("button", { name: "लॉगिन करें", exact: true }).click();
    await page.waitForURL(/\/staff\/DEMO-RAMPUR-1$/);
    await expectNoHorizontalOverflow(page);
  });
});
