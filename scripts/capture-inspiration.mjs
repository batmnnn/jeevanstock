// Captures high-fidelity UI references into inspiration/. Replaces government design-system shots.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const ROOT = new URL("../inspiration/", import.meta.url).pathname;
const M = 390;
const D = 1440;

/** [folder, name, url, width] */
// originui.com now redirects every path to the Coss UI homepage, so component
// shots come from coss.com/ui/docs and the gallery from coss.com/ui.
const list = [
  ["01-family-home-nearest-stock", "cal-booking", "https://cal.com", M],
  ["01-family-home-nearest-stock", "shadcn-dashboard", "https://ui.shadcn.com", M],
  ["01-family-home-nearest-stock", "shadcn-badge", "https://ui.shadcn.com/docs/components/badge", D],

  ["02-centre-detail", "resend", "https://resend.com", M],
  ["02-centre-detail", "clerk", "https://clerk.com", M],

  ["03-report-no-stock", "cal-booking-question", "https://cal.com/peer", M],
  ["03-report-no-stock", "coss-radio", "https://coss.com/ui/docs/components/radio-group", D],
  ["03-report-no-stock", "shadcn-radio-group", "https://ui.shadcn.com/docs/components/radio-group", D],
  ["03-report-no-stock", "typeform", "https://www.typeform.com", M],

  ["04-receipt-confirmation", "shadcn-alert", "https://ui.shadcn.com/docs/components/alert", D],
  ["04-receipt-confirmation", "shadcn-sonner", "https://ui.shadcn.com/docs/components/sonner", D],
  ["04-receipt-confirmation", "dub", "https://dub.co", M],

  ["05-centre-staff-post-stock", "shadcn-input", "https://ui.shadcn.com/docs/components/input", D],
  ["05-centre-staff-post-stock", "shadcn-button", "https://ui.shadcn.com/docs/components/button", D],

  ["06-public-dashboard", "shadcn-dashboard", "https://ui.shadcn.com", D],

  ["08-empty-error-offline-loading", "shadcn-form", "https://ui.shadcn.com/docs/components/form", D],
  ["08-empty-error-offline-loading", "shadcn-empty", "https://ui.shadcn.com/docs/components/empty", D],
  ["08-empty-error-offline-loading", "cal-404", "https://cal.com/this-page-does-not-exist", D],

  ["09-language-toggle", "apple-india", "https://www.apple.com/in/", M],
  ["09-language-toggle", "notion", "https://www.notion.com", M],

  ["10-landing-about", "magicui", "https://magicui.design", D],
  ["10-landing-about", "aceternity", "https://ui.aceternity.com", D],
  ["10-landing-about", "21st", "https://21st.dev", D],
  ["10-landing-about", "framer", "https://www.framer.com", D],
  ["10-landing-about", "coss-ui", "https://coss.com/ui", D],

  ["11-qr-poster-share-card", "dub", "https://dub.co", D],
];

const browser = await chromium.launch();
for (const [dir, name, url, width] of list) {
  const mobile = width < 400;
  const page = await browser.newPage({
    viewport: { width, height: mobile ? 844 : 900 },
    deviceScaleFactor: 2,
    isMobile: mobile,
    hasTouch: mobile,
    userAgent: mobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  });
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 35000 });
    await page.waitForTimeout(3500);
    const clicked = await page
      .locator("button, a")
      .filter({ hasText: /^(Accept all|Accept|Allow all|Got it|Agree|I agree)$/i })
      .first()
      .click({ timeout: 1500 })
      .then(() => true)
      .catch(() => false);
    if (clicked) await page.waitForTimeout(600);
    const preview = page.locator('[class*="preview" i], iframe[title*="preview" i]').first();
    if ((await preview.count()) > 0) await preview.scrollIntoViewIfNeeded().catch(() => {});
    mkdirSync(`${ROOT}${dir}`, { recursive: true });
    const file = `${ROOT}${dir}/${name}-${width}.png`;
    await page.screenshot({ path: file });
    console.log("OK", res?.status(), dir, name, width, JSON.stringify(await page.title()));
  } catch (e) {
    console.log("FAIL", dir, name, width, e.message.slice(0, 140));
  }
  await page.close();
}
await browser.close();
