import { test as base, expect, type Browser, type BrowserContext, type Page, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const BASE_URL = "http://127.0.0.1:3200";

/** Resource 404s are expected when a spec opens a missing page. Everything else is a failure. */
const EXPECTED_CONSOLE = /favicon\.ico|status of 404|net::ERR_ABORTED|Failed to load resource/i;

type Problems = { pageErrors: string[]; consoleErrors: string[] };

function track(page: Page): Problems {
  const problems: Problems = { pageErrors: [], consoleErrors: [] };
  page.on("pageerror", (err) => problems.pageErrors.push(err.stack || err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.consoleErrors.push(msg.text());
  });
  return problems;
}

function assertClean(problems: Problems) {
  expect(problems.pageErrors, `uncaught page errors:\n${problems.pageErrors.join("\n")}`).toEqual([]);
  const unexpected = problems.consoleErrors.filter((line) => !EXPECTED_CONSOLE.test(line));
  expect(unexpected, `console errors:\n${unexpected.join("\n")}`).toEqual([]);
}

export const test = base.extend({
  page: async ({ page }, use) => {
    const problems = track(page);
    await use(page);
    assertClean(problems);
  },
});

export { expect };

let hopSeq = 0;

/** Fresh limiter bucket. The memory rate limiter is process-wide and survives across tests. */
export function uniqueForwardedFor(label: string): string {
  hopSeq += 1;
  return `e2e-${label}-${hopSeq}-${Date.now()}`;
}

export async function useEnglish(context: BrowserContext) {
  await context.addCookies([{ name: "lang", value: "en", url: BASE_URL }]);
}

/** Stamp a distinct X-Forwarded-For on every later request from this page. */
export async function tagClient(page: Page, label: string): Promise<string> {
  const hop = uniqueForwardedFor(label);
  await page.setExtraHTTPHeaders({ "X-Forwarded-For": hop });
  return hop;
}

export async function signIn(page: Page, centreId: string, pin: string) {
  await page.goto("/staff");
  await page.getByLabel("Centre", { exact: true }).selectOption(centreId);
  await page.getByRole("textbox", { name: "PIN", exact: true }).fill(pin);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

export async function acknowledgedCount(page: Page): Promise<number> {
  await page.goto("/dashboard");
  const label = page.getByRole("group", { name: "Demo summary" }).getByText("Confirmed reports", { exact: true });
  const raw = (await label.locator("xpath=following-sibling::p[1]").innerText()).trim();
  const n = Number(raw);
  expect(Number.isFinite(n), `acknowledged count was ${JSON.stringify(raw)}`).toBe(true);
  return n;
}

export async function expectNoSeriousAxe(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const summary = bad
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 8)
        .map((n) => `  - ${n.target.join(" ")} — ${n.failureSummary ?? ""}`)
        .join("\n");
      return `${v.id} (${v.impact}) ${v.help}\n${nodes}`;
    })
    .join("\n\n");
  expect(bad, summary).toEqual([]);
}

export async function expectNoHorizontalOverflow(page: Page) {
  const scrollWidth = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.scrollingElement?.scrollWidth ?? 0;
  });
  expect(scrollWidth, `scrollWidth ${scrollWidth}`).toBeLessThanOrEqual(390);
}

/**
 * A project-shaped context with its own forwarded-for hop.
 * The built-in page stays unused; callers must assert this page's console themselves.
 */
export async function isolatedPage(browser: Browser, info: TestInfo, label: string) {
  const use = info.project.use;
  const context = await browser.newContext({
    baseURL: use.baseURL,
    viewport: use.viewport,
    isMobile: use.isMobile,
    hasTouch: use.hasTouch,
    userAgent: use.userAgent,
    deviceScaleFactor: use.deviceScaleFactor,
    extraHTTPHeaders: { "X-Forwarded-For": uniqueForwardedFor(label) },
  });
  await useEnglish(context);
  const page = await context.newPage();
  const problems = track(page);
  return {
    page,
    async close() {
      assertClean(problems);
      await context.close();
    },
  };
}
