import { chromium } from "playwright";

const URL = "http://localhost:3000";
const meta = (page) =>
  page.evaluate(() => document.querySelector('meta[name="theme-color"]')?.content ?? null);
// the top status-bar band follows the page background, not theme-color, so
// menu states must flip these too; values are always written explicitly now
const bands = (page) =>
  page.evaluate(() => ({
    html: document.documentElement.style.backgroundColor || "unset",
    body: document.body.style.backgroundColor || "unset",
  }));
const settle = (page) => page.waitForTimeout(700);

const browser = await chromium.launch();
const out = {};

// ---- mobile 390x844 ----
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await m.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

out.mobileTop = await meta(page);

// scroll so the charcoal Trust (#security) section covers the bottom edge
await page.evaluate(() => {
  const el = document.getElementById("security");
  const r = el.getBoundingClientRect();
  window.scrollTo({ top: window.scrollY + r.top - window.innerHeight / 2, behavior: "instant" });
});
await settle(page);
out.mobileTrust = await meta(page);

// absolute bottom: footer (charcoal-deep) touches the bottom edge
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
await settle(page);
out.mobileBottom = await meta(page);

// back to a light region (hero)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(page);
out.mobileBackTop = await meta(page);

// menu open -> ink, close -> restore
await page.click('button[aria-controls="mobile-menu"]');
await settle(page);
out.mobileMenuOpen = await meta(page);
out.menuOpenBands = await bands(page);
await page.click('button[aria-controls="mobile-menu"]');
// mid-fade: the body hands back to ivory at once, the root holds ink until
// the overlay fade finishes so Safari re-samples against ivory pixels
await page.waitForTimeout(100);
out.menuClosingBands = await bands(page);
await settle(page);
out.mobileMenuClosed = await meta(page);
out.menuClosedBands = await bands(page);

// menu open while scrolled to footer, then close: restore should be the
// footer surface, not ivory
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
await settle(page);
await page.click('button[aria-controls="mobile-menu"]');
await settle(page);
out.menuOpenAtFooter = await meta(page);
await page.click('button[aria-controls="mobile-menu"]');
await settle(page);
out.menuClosedAtFooter = await meta(page);

// no horizontal overflow regressions
out.overflow390 = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
await m.close();

// ---- narrow 320 ----
const n = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });
const np = await n.newPage();
await np.goto(URL, { waitUntil: "networkidle" });
await np.waitForTimeout(1500);
out.overflow320 = await np.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
await n.close();

// ---- desktop 1440: static ivory regardless of scroll ----
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto(URL, { waitUntil: "networkidle" });
await dp.waitForTimeout(2000);
out.desktopTop = await meta(dp);
await dp.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
await settle(dp);
out.desktopBottom = await meta(dp);
await d.close();

await browser.close();
console.log(JSON.stringify(out, null, 2));
