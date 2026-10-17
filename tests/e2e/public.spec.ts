import { test, expect, useEnglish } from "./fixtures";

test.describe("public board · English", () => {
  test.beforeEach(async ({ context }) => {
    await useEnglish(context);
  });

  test("dashboard has tiles, the centre grid, and verify-yourself", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1, name: "Public board" })).toBeVisible();
    const demoStats = page.getByRole("group", { name: "Demo summary" });
    await expect(demoStats.getByRole("heading", { name: "Anti-snake venom (ASV)" })).toBeVisible();
    await expect(demoStats.getByRole("heading", { name: "Anti-rabies vaccine (ARV)" })).toBeVisible();
    await expect(demoStats.getByText("Open reports", { exact: true })).toBeVisible();
    await expect(demoStats.getByText("Confirmed reports", { exact: true })).toBeVisible();
    const liveStats = page.getByRole("group", { name: "Summary", exact: true });
    await expect(liveStats.getByRole("heading", { name: "Anti-snake venom (ASV)" })).toBeVisible();
    await expect(liveStats.getByText("Open reports", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Reports", exact: true })).toBeVisible();
    await expect(page.getByText("In stock", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Low", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Out", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Stale", { exact: true }).first()).toBeVisible();

    const demo = page.getByRole("region", { name: "Demo centres, live on Arkiv" });
    await expect(demo.getByRole("heading", { name: "Demo PHC Rampur-1" })).toBeVisible();
    await expect(demo.getByRole("heading", { name: "PHC Chikhlakasa" })).toHaveCount(0);

    const live = page.getByRole("region", { name: "Coming live: Durg and Balod" });
    await expect(live.getByRole("heading", { name: "PHC Chikhlakasa" })).toBeVisible();
    await expect(live.getByRole("heading", { name: "Demo PHC Rampur-1" })).toHaveCount(0);
    await expect(live.getByText(/no anti-venom sent to \d+ of \d+ rural PHCs/)).toBeVisible();
    await expect(page.getByText(/the Durg warehouse had .* ready to issue/)).toBeVisible();

    const verify = page.getByRole("region", { name: /Verify it yourself/ });
    await expect(verify).toBeVisible();
    await expect(verify.getByText("Offline demo data")).toBeVisible();
    await expect(verify.getByText("Admin wallet", { exact: true })).toBeVisible();
    await expect(verify.getByText("Reporter wallet", { exact: true })).toBeVisible();
    await expect(verify.getByText("Centre wallets", { exact: true })).toBeVisible();
  });

  test("an unknown proof key shows the not-found copy", async ({ page }) => {
    await page.goto("/verify/0xdeadbeef");
    await expect(page.getByRole("heading", { name: "This proof is not on the board" })).toBeVisible();
    await expect(page.getByText("404", { exact: true })).toBeVisible();
  });

  test("an unknown proof key responds with HTTP 404", async ({ page }) => {
    const response = await page.goto("/verify/0xdeadbeef");
    expect(response?.status()).toBe(404);
  });

  test("about links to the source reports", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("anti-venom");
    const hosts = ["timesofindia.indiatimes.com", "newindianexpress.com", "news.abplive.com", "heraldgoa.in"];
    for (const host of hosts) {
      const link = page.locator(`a[href*="${host}"]`).first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute("href");
      expect(href, host).toMatch(new RegExp(`^https://([a-z0-9-]+\\.)*${host.replace(/\./g, "\\.")}(/|$)`));
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
    await expect(page.locator('a[href*="timesofindia.indiatimes.com"]')).toHaveCount(3);
  });

  test("the Rampur poster has a QR code and 108", async ({ page }) => {
    await page.goto("/poster/DEMO-RAMPUR-1");
    await expect(page.locator("svg").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "108", exact: true })).toHaveAttribute("href", "tel:108");
    await expect(page.getByText("Demo PHC Rampur-1")).toBeVisible();
  });

  test("security headers are set and X-Powered-By is absent", async ({ page }) => {
    for (const path of ["/", "/dashboard", "/about"]) {
      const response = await page.goto(path);
      expect(response, path).toBeTruthy();
      const headers = response!.headers();
      expect(headers["x-frame-options"], path).toBe("DENY");
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["referrer-policy"], path).toBe("no-referrer");
      expect(headers["x-powered-by"], path).toBeUndefined();
    }
  });
});

test("language toggle switches copy and survives navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("अभी कहाँ मिलेगा?");

  await page.getByRole("button", { name: "A English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where can you get it now?");
  await expect(page.getByRole("button", { name: "अ हिन्दी" })).toBeVisible();

  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Does the nearest centre have anti-venom");

  await page.getByRole("link", { name: "Find medicine" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where can you get it now?");
});
