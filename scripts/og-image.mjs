// Renders public/og-image.jpg (1200 by 630) from the brand kit with cleared
// language only. Usage: npm run og
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const lockup = readFileSync("public/xw-h-lockup-dark.svg", "utf8");
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;
    background:#f1eee6;color:#1a1915;font-family:'Instrument Sans',system-ui,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between}
  .lockup svg{height:40px;width:auto}
  h1{font-family:Newsreader,Georgia,serif;font-weight:400;font-size:66px;line-height:1.05;
    letter-spacing:-.02em;margin:0;max-width:960px}
  p{margin:0;font-size:22px;color:rgba(26,25,21,.6)}
</style></head><body>
<div class="lockup">${lockup}</div>
<h1>The operating layer your business actually runs on.</h1>
<p>Custom agentic AI, built around how your team actually works. Arizona.</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og-image.jpg", type: "jpeg", quality: 90 });
await browser.close();
console.log("wrote public/og-image.jpg");
