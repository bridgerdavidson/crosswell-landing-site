import { chromium, type Page } from "playwright";

type Opts = { width?: number; reducedMotion?: boolean; js?: boolean };

/** Open one page in a fresh Chromium, run fn, always close. */
export async function withPage<T>(fn: (page: Page) => Promise<T>, opts: Opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: opts.width ?? 1440, height: 900 },
    javaScriptEnabled: opts.js ?? true,
    reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}
