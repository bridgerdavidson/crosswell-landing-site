import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveOut } from "../helpers/serve";
import { withPage } from "../helpers/browser";

let site: Awaited<ReturnType<typeof serveOut>>;
beforeAll(async () => {
  site = await serveOut();
});
afterAll(() => site.close());

const FULL = "/insights/fixture-field-notes";
const PLAIN = "/insights/fixture-plain-note";
const SITE = "https://crosswellconsulting.com";

/** a PNG's width and height, from its header */
const pngSize = (file: string) => {
  const b = readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

describe("an insight", () => {
  it("renders the whole post", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
      const article = page.locator("#insight");
      return {
        title: await page.title(),
        h1: await page.locator("h1").allTextContents(),
        takeaways: await article.locator("aside[aria-label='Key takeaways'] li").allTextContents(),
        charts: await article.locator(".article-body figure.chart svg").count(),
        faq: await article.locator(".faq .faq-item h3").allTextContents(),
        cover: await article.locator("img.insight-cover").getAttribute("alt"),
        writtenBy: await article.getByText("Written by").count(),
        call: await article.locator("a[href^='mailto:']", { hasText: "Set up a call" }).count(),
        related: await article.locator("[aria-labelledby='keep-reading'] a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
        outline: await article.locator("nav[aria-label='On this page'] a").allTextContents(),
        current: await page.locator("header nav a[aria-current='page']").textContent(),
      };
    });
    expect(r.title).toBe("What a sample team learned from its first month of notes | Crosswell");
    expect(r.h1).toEqual(["What a sample team learned from its first month of notes"]);
    expect(r.takeaways[0]).toContain("that’s curled");
    expect(r.charts).toBe(2);
    expect(r.faq).toEqual(["Is this post real?", "Does the FAQ become structured data?"]);
    expect(r.cover).toBe("A soft green gradient standing in for a cover photo.");
    expect(r.writtenBy).toBe(1);
    expect(r.call).toBe(1);
    expect(r.related).toEqual(["/insights/fixture-plain-note"]);
    expect(r.outline).toEqual([
      "How many notes did the team keep?",
      "What changed by the end of the month?",
      "Frequently asked questions",
    ]);
    expect(r.current).toBe("Insights");
  });

  it("describes itself to search engines and share previews", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
      const content = (sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getAttribute("content")));
      return {
        og: await content('meta[property="og:image"]'),
        twitter: await content('meta[name="twitter:image"]'),
        type: await page.locator('meta[property="og:type"]').getAttribute("content"),
        canonical: await page.locator('link[rel="canonical"]').getAttribute("href"),
        ld: await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
          els.flatMap((e) => {
            const d = JSON.parse(e.textContent ?? "null");
            return (Array.isArray(d) ? d : [d]).map((x) => x["@type"]);
          })
        ),
        head: await page.locator("head").innerHTML(),
      };
    });
    const card = `${SITE}/media/insights/fixture-field-notes/card.png`;
    expect(r.og).toEqual([card]);
    expect(r.twitter).toEqual([card]);
    expect(r.type).toBe("article");
    expect(r.canonical).toBe(`${SITE}${FULL}`);
    expect(r.ld).toEqual(["Organization", "Article", "FAQPage"]);
    expect(r.head).not.toContain("og-image.jpg");
    expect(pngSize(join("out", "media", "insights", "fixture-field-notes", "card.png"))).toEqual({ width: 1200, height: 630 });
  });

  it("builds a plain post without the optional pieces", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}${PLAIN}`, { waitUntil: "networkidle" });
      const article = page.locator("#insight");
      return {
        takeaways: await article.locator("aside[aria-label='Key takeaways']").count(),
        charts: await article.locator("figure.chart").count(),
        faq: await article.locator(".faq").count(),
        cover: await article.locator("img.insight-cover").count(),
        outline: await article.locator("nav[aria-label='On this page']").count(),
        related: await article.locator("[aria-labelledby='keep-reading'] a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
        ld: await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
          els.flatMap((e) => {
            const d = JSON.parse(e.textContent ?? "null");
            return (Array.isArray(d) ? d : [d]).map((x) => x["@type"]);
          })
        ),
      };
    });
    expect(r).toMatchObject({ takeaways: 0, charts: 0, faq: 0, cover: 0, outline: 0 });
    expect(r.related).toEqual(["/insights/fixture-field-notes", "/insights/fixture-bar-chart"]);
    expect(r.ld).toEqual(["Organization", "Article"]);
    expect(pngSize(join("out", "media", "insights", "fixture-plain-note", "card.png"))).toEqual({ width: 1200, height: 630 });
  });

  it("keeps the rail beside the text on a wide screen", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, 1400));
      await page.waitForTimeout(300);
      return page.evaluate(() => {
        const rail = document.querySelector("[data-rail]")!;
        return {
          rail: getComputedStyle(rail).position,
          railTop: Math.round(rail.getBoundingClientRect().top),
          byline: getComputedStyle(document.querySelector("[data-byline]")!).display,
        };
      });
    });
    expect(r).toEqual({ rail: "sticky", railTop: 96, byline: "none" });
  });

  it("folds the rail into a byline on a phone, with no sideways scroll", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
        return page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          byline: getComputedStyle(document.querySelector("[data-byline]")!).display,
          rail: getComputedStyle(document.querySelector("[data-rail]")!).display,
        }));
      },
      { width: 390 }
    );
    expect(r).toEqual({ overflow: 0, byline: "flex", rail: "none" });
  });

  it("scrolls to a section from the outline without writing a hash", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
        await page.locator("nav[aria-label='On this page'] a", { hasText: "What changed by the end of the month?" }).click();
        await page.waitForTimeout(1500);
        return {
          hash: await page.evaluate(() => location.hash),
          current: await page.locator("nav[aria-label='On this page'] a[aria-current='location']").textContent(),
          top: await page.locator("#what-changed-by-the-end-of-the-month").evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        };
      },
      { reducedMotion: true }
    );
    expect(r.hash).toBe("");
    expect(r.current).toBe("What changed by the end of the month?");
    expect(r.top).toBeGreaterThanOrEqual(80);
    expect(r.top).toBeLessThanOrEqual(100);
  });

  it("never shows an em dash or uppercase text", async () => {
    const r = await withPage(async (page) => {
      const read = async (path: string) => {
        await page.goto(`${site.url}${path}`, { waitUntil: "networkidle" });
        return page.evaluate(() => ({
          dash: document.body.innerText.includes("—"),
          uppercase: [...document.querySelectorAll("main *")].filter((el) => getComputedStyle(el).textTransform === "uppercase").length,
        }));
      };
      return [await read(FULL), await read(PLAIN), await read("/insights/fixture-bar-chart")];
    });
    expect(r).toEqual([
      { dash: false, uppercase: 0 },
      { dash: false, uppercase: 0 },
      { dash: false, uppercase: 0 },
    ]);
  });
});
