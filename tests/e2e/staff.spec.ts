import type { Page } from "@playwright/test";
import { test, expect, useEnglish, tagClient, signIn, acknowledgedCount, isolatedPage } from "./fixtures";

async function signInHi(page: Page, centreId: string, pin: string) {
  await page.goto("/staff");
  await page.getByLabel("केंद्र", { exact: true }).selectOption(centreId);
  await page.getByRole("textbox", { name: "पिन", exact: true }).fill(pin);
  await page.getByRole("button", { name: "लॉगिन करें", exact: true }).click();
}

test.describe("staff · Hindi", () => {
  test("a wrong PIN shows a generic error", async ({ page }) => {
    await tagClient(page, "wrong-pin-hi");
    await signInHi(page, "DEMO-RAMPUR-1", "0000");
    await expect(page).toHaveURL(/\/staff$/);
    const alert = page.locator("#form-error");
    await expect(alert).toContainText("केंद्र या पिन गलत है");
    await expect(alert).not.toContainText("1111");
    await expect(page.getByRole("heading", { name: "स्टॉक दर्ज करें" })).toHaveCount(0);
  });
});

test.describe("staff · English", () => {
  test.beforeEach(async ({ context }) => {
    await useEnglish(context);
  });

  test("the correct PIN opens that centre's dashboard", async ({ page }) => {
    await signIn(page, "DEMO-RAMPUR-1", "1111");
    await expect(page).toHaveURL(/\/staff\/DEMO-RAMPUR-1$/);
    await expect(page.getByRole("heading", { level: 1, name: "Post stock" })).toBeVisible();
    await expect(page.getByText("Demo PHC Rampur-1")).toBeVisible();
  });

  test("a signed-in centre cannot open another centre's staff page", async ({ page }) => {
    await signIn(page, "DEMO-RAMPUR-1", "1111");
    await page.goto("/staff/DEMO-SONPUR-CHC");
    await expect(page).toHaveURL(/\/staff$/);
    await expect(page.getByRole("heading", { name: "Staff sign in" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Post stock" })).toHaveCount(0);
  });

  test("posting ASV 7 shows 7 vials in stock on the public page", async ({ page }) => {
    await signIn(page, "DEMO-RAMPUR-1", "1111");
    await page.locator("#asv").fill("7");
    await expect(page.locator("#asv")).toHaveValue("7");
    await page.getByRole("button", { name: "Post stock" }).click();
    await expect(page.getByRole("heading", { name: "Stock posted" })).toBeVisible();
    await expect(page.getByText("The board saved one drug only")).toHaveCount(0);

    await page.goto("/centre/DEMO-RAMPUR-1");
    const asv = page.getByRole("region", { name: "Anti-snake venom (ASV)" });
    await expect(asv.getByText("7 vials", { exact: true })).toBeVisible();
    await expect(asv.getByText("In stock", { exact: true })).toBeVisible();
  });

  test("the stepper cannot go below zero", async ({ page }) => {
    await signIn(page, "DEMO-RAMPUR-1", "1111");
    const input = page.locator("#asv");
    const decrease = page.getByRole("button", { name: "Decrease ASV" });
    await input.fill("0");
    await expect(input).toHaveValue("0");
    await expect(decrease).toBeDisabled();
    await input.press("ArrowDown");
    await expect(input).toHaveValue("0");
    await input.fill("");
    await input.press("ArrowDown");
    await expect(input).toHaveValue("0");
  });

  test("typing 1000, -1, or 2.5 is rejected with an error", async ({ page }) => {
    await signIn(page, "DEMO-KALAPUR-2", "3333");
    const input = page.locator("#asv");
    for (const bad of ["1000", "-1", "2.5"]) {
      await input.fill("");
      await input.pressSequentially(bad);
      await page.getByRole("button", { name: "Post stock" }).click();
      await expect(page.locator("#form-error"), `typed ${bad}, field is "${await input.inputValue()}"`).toContainText(
        "Enter a whole number of vials from 0 to 999.",
        { timeout: 3_000 },
      );
    }
  });

  test("a forged out-of-range count is rejected by the server", async ({ page }) => {
    await signIn(page, "DEMO-SONPUR-CHC", "2222");
    for (const bad of ["1000", "-1", "2.5"]) {
      await page.locator("#asv").evaluate((el, value) => {
        const input = el as HTMLInputElement;
        input.value = value;
        input.form?.requestSubmit();
      }, bad);
      await expect(page.locator("#form-error")).toContainText("Enter a whole number of vials from 0 to 999.");
      await page.reload();
    }
  });

  test("confirming a family report moves it to acknowledged and increments the board", async ({ page }) => {
    const before = await acknowledgedCount(page);

    await tagClient(page, "staff-report");
    await page.goto("/centre/DEMO-RAMPUR-1/report?drug=ARV");
    await page.getByRole("radio", { name: "Centre closed" }).check();
    await page.getByRole("button", { name: "Send report" }).click();
    await expect(page.getByRole("heading", { name: "Report received" })).toBeVisible();

    await signIn(page, "DEMO-RAMPUR-1", "1111");
    const card = page.locator("#inbox li").filter({ hasText: "Centre closed" }).first();
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: "Confirm ARV" }).click();
    await expect(card).toContainText(/This centre confirmed this report/);
    await expect(card.getByRole("button", { name: /Confirm/ })).toHaveCount(0);

    const after = await acknowledgedCount(page);
    expect(after).toBe(before + 1);
  });

  test("signing out sends the centre page back to the login", async ({ page }) => {
    await signIn(page, "DEMO-RAMPUR-1", "1111");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/staff$/);
    await expect(page.getByRole("heading", { name: "Staff sign in" })).toBeVisible();
    await page.goto("/staff/DEMO-RAMPUR-1");
    await expect(page).toHaveURL(/\/staff$/);
    await expect(page.getByRole("heading", { name: "Post stock" })).toHaveCount(0);
  });
});

test("six wrong PINs from one client are rate limited", async ({ browser }, testInfo) => {
  const iso = await isolatedPage(browser, testInfo, "brute");
  const { page } = iso;
  try {
    await useEnglish(page.context());
    for (let i = 0; i < 5; i++) {
      await page.goto("/staff");
      await page.getByLabel("Centre", { exact: true }).selectOption("DEMO-KALAPUR-2");
      await page.getByRole("textbox", { name: "PIN", exact: true }).fill("9999");
      await page.getByRole("button", { name: "Sign in", exact: true }).click();
      await expect(page.locator("#form-error"), `attempt ${i + 1}`).toContainText("Wrong centre or PIN");
    }
    await page.getByLabel("Centre", { exact: true }).selectOption("DEMO-KALAPUR-2");
    await page.getByRole("textbox", { name: "PIN", exact: true }).fill("9999");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.locator("#form-error")).toContainText(/Too many attempts\. Try again in \d+ seconds\./);
    await expect(page).toHaveURL(/\/staff$/);
  } finally {
    await iso.close();
  }
});
