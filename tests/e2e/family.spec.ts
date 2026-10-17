import { test, expect, useEnglish, tagClient } from "./fixtures";

const STATUS_HI: Record<string, string> = {
  in: "उपलब्ध",
  low: "कम",
  out: "नहीं है",
  stale: "पुरानी जानकारी",
  sent: "भेजी गई",
};

const STATUS_EN: Record<string, string> = {
  in: "In stock",
  low: "Low",
  out: "Out",
  stale: "Stale",
  sent: "Sent",
};

async function expectChipLabels(page: import("@playwright/test").Page, labels: Record<string, string>) {
  const chips = page.locator("[data-status]");
  const count = await chips.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const chip = chips.nth(i);
    const status = await chip.getAttribute("data-status");
    expect(status && labels[status], `unexpected status ${status}`).toBeTruthy();
    await expect(chip).toContainText(labels[status!]);
    await expect(chip.locator("span[aria-hidden]")).toBeVisible();
  }
}

test.describe("family · Hindi", () => {
  test("home offers both needs, labelled chips, directions, and 108", async ({ page }) => {
    await page.goto("/live");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await expect(page.getByRole("heading", { level: 1, name: "जल्द लाइव" })).toBeVisible();
    await expect(page.getByRole("link", { name: /साँप ने काटा/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Snakebite/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /कुत्ते ने काटा/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dog bite/ })).toBeVisible();

    await expectChipLabels(page, STATUS_HI);

    const directions = page.getByRole("link", { name: /रास्ता देखें/ }).first();
    await expect(directions).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/);
    await expect(directions).toHaveAttribute("target", "_blank");
    await expect(directions).toHaveAttribute("rel", /noopener/);
    await expect(page.locator('a[href="tel:108"]').first()).toBeVisible();
  });

  test("unknown centre shows the not-found copy", async ({ page }) => {
    await page.goto("/centre/NO-SUCH-CENTRE");
    await expect(page.getByRole("heading", { name: "यह पेज नहीं मिला" })).toBeVisible();
  });

  test("unknown centre responds with HTTP 404", async ({ page }) => {
    const response = await page.goto("/centre/NO-SUCH-CENTRE");
    expect(response?.status()).toBe(404);
  });
});

test.describe("family · English", () => {
  test.beforeEach(async ({ context }) => {
    await useEnglish(context);
  });

  test("a matched PHC shows the CGMSCL issue as sent, not in stock", async ({ page }) => {
    await page.goto("/live?need=ASV");
    await expect(page.getByRole("heading", { level: 1, name: "Where is anti-venom?" })).toBeVisible();

    const section = page.getByRole("region", { name: "Centres" });
    const card = section.getByRole("listitem").filter({ hasText: "PHC Chikhlakasa" });
    await expect(card).toBeVisible();
    await expect(card.getByText("Sent", { exact: true })).toBeVisible();
    await expect(card.getByText("Unknown", { exact: true })).toBeVisible();
    await expect(card.getByText("In stock")).toHaveCount(0);
    const names = (await section.getByRole("heading", { level: 3 }).allTextContents()).map((text) => text.trim());
    const recent = names.findIndex((name) => name.includes("Mangchuwa"));
    const older = names.findIndex((name) => name.includes("Chikhlakasa"));
    expect(recent, names.slice(0, 8).join(" | ")).toBeGreaterThanOrEqual(0);
    expect(older).toBeGreaterThan(recent);
    await expect(card.getByText(/CGMSCL last issued 100 vials on 4 Jun 2026/)).toBeVisible();
    await expect(card.getByText(/This is not the shelf count/)).toBeVisible();
    await expect(section.getByRole("heading", { name: "Demo PHC Rampur-1" })).toHaveCount(0);

    await expectChipLabels(page, STATUS_EN);

    const directions = section.getByRole("link", { name: /Directions/ }).first();
    await expect(directions).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/);
    await expect(directions).toHaveAttribute("target", "_blank");
    await expect(directions).toHaveAttribute("rel", /noopener/);
    await expect(page.locator('a[href="tel:108"]').first()).toBeVisible();
  });

  test("centre detail shows both drugs", async ({ page }) => {
    await page.goto("/centre/DEMO-KALAPUR-2");
    await expect(page.getByRole("heading", { level: 1, name: "Demo PHC Kalapur-2" })).toBeVisible();
    for (const name of ["Anti-snake venom (ASV)", "Anti-rabies vaccine (ARV)"]) {
      const region = page.getByRole("region", { name });
      await expect(region).toBeVisible();
      await expect(region.locator("[data-status]")).toHaveText(/In stock|Low|Out|Stale/);
      await expect(region).toContainText(/\d+ vials|Unknown/);
    }
  });

  test("submitting a report without a reason shows the error summary", async ({ page }) => {
    await page.goto("/centre/DEMO-SONPUR-CHC/report?drug=ASV");
    await expect(page.getByRole("radio", { name: /Anti-snake venom \(ASV\)/ })).toBeChecked();
    await page.getByRole("button", { name: "Send report" }).click();
    const alert = page.getByRole("alert");
    await expect(alert.getByRole("heading", { name: "There is a problem" })).toBeVisible();
    await expect(alert.getByRole("link", { name: "Choose what happened." })).toBeVisible();
    await expect(page).toHaveURL(/\/report/);
  });

  test("report flow ends at a trusted proof", async ({ page }) => {
    await tagClient(page, "family-report");
    await page.goto("/centre/DEMO-SONPUR-CHC/report?drug=ASV");
    await page.getByRole("radio", { name: "Out of stock" }).check();
    await page.getByRole("button", { name: "Send report" }).click();

    await expect(page).toHaveURL(/\/receipt\/0x[0-9a-fA-F]+/);
    await expect(page.getByRole("heading", { name: "Report received" })).toBeVisible();
    await expect(page.getByText("Reference number")).toBeVisible();
    const reference = (await page.locator("main code").first().innerText()).trim();
    expect(reference).toMatch(/^0x[0-9a-fA-F]+…[0-9a-fA-F]+$/);
    expect(page.url()).toContain("c=DEMO-SONPUR-CHC");
    expect(page.url()).toContain("tx=0x");

    await page.getByRole("link", { name: "View proof" }).click();
    await expect(page).toHaveURL(/\/verify\/0x[0-9a-fA-F]+/);
    await expect(page.getByRole("status")).toContainText("Verified: filed by the public reporter wallet");
  });

  test("tampered receipt params show the not-found copy", async ({ page }) => {
    const tx = `0x${"ab".repeat(32)}`;
    const key = `0x${"cd".repeat(32)}`;
    await page.goto(`/receipt/not-a-key?c=DEMO-RAMPUR-1&tx=${tx}`);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await page.goto(`/receipt/${key}?c=DEMO-GHOST-9&tx=${tx}`);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("tampered receipt params respond with HTTP 404", async ({ page }) => {
    const tx = `0x${"ab".repeat(32)}`;
    const key = `0x${"cd".repeat(32)}`;
    const badKey = await page.goto(`/receipt/not-a-key?c=DEMO-RAMPUR-1&tx=${tx}`);
    expect(badKey?.status()).toBe(404);
    const unknown = await page.goto(`/receipt/${key}?c=DEMO-GHOST-9&tx=${tx}`);
    expect(unknown?.status()).toBe(404);
  });
});

test.describe("family · geolocation stays on the device", () => {
  test("distances appear and no request carries the coordinates", async ({ page, context }) => {
    const lat = 23.4567;
    const lon = 79.8765;
    await useEnglish(context);
    await context.grantPermissions(["geolocation"], { origin: "http://127.0.0.1:3200" });
    await context.setGeolocation({ latitude: lat, longitude: lon });

    const leaks: string[] = [];
    const needle = /23\.4567|79\.8765|latitude|longitude/i;
    page.on("request", (req) => {
      const body = req.postData() ?? "";
      if (needle.test(req.url()) || needle.test(body)) leaks.push(`${req.method()} ${req.url()} ${body.slice(0, 180)}`);
    });

    await page.goto("/demo?need=ASV");
    await page.getByRole("button", { name: "Show distance from me" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Distance is showing." })).toBeVisible();
    await expect(page.getByText(/\d+(\.\d)? km/)).toHaveCount(3);
    expect(leaks, leaks.join("\n")).toEqual([]);
  });
});
