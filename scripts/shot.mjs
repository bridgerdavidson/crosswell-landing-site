// Screenshot + overflow probe for manual mobile verification.
// Usage: node scripts/shot.mjs <url> <width> <outfile> [--full] [--open-menu] [--reduced-motion] [--height N]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const [url, width, out] = args;
const flag = (f) => args.includes(f);
const height = flag("--height") ? Number(args[args.indexOf("--height") + 1]) : 844;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height },
  deviceScaleFactor: 2,
});
if (flag("--reduced-motion")) await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(url, { waitUntil: "networkidle" });
if (flag("--open-menu")) {
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(1400);
}
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: flag("--full") });
const overflow = await page.evaluate(
  () => document.scrollingElement.scrollWidth - document.documentElement.clientWidth
);
console.log(`${out}: horizontal overflow = ${overflow}px${overflow > 0 ? "  <-- FAIL" : ""}`);
const src = await page.evaluate(
  () => document.querySelector(".hero-core img")?.currentSrc ?? "no hero img"
);
console.log(`hero img currentSrc: ${src}`);
await browser.close();
