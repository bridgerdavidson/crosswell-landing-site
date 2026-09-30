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
/* the long read: the hard cases (a long title, twelve-point charts,
   footnotes, a portrait and a landscape image, a wide table, code, and
   fourteen sections) */
const LONG = "/insights/fixture-long-read";
const LONG_TITLE =
  "Why the sample businesses that keep the most notes are also the ones that keep asking the same questions about what they wrote down";
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
    expect(r.related).toEqual(["/insights/fixture-field-notes", "/insights/fixture-bar-chart", LONG]);
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
          // the label's link back to the index is a thumb's target
          label: document.querySelector("#insight .type-label a")!.getBoundingClientRect().height >= 24,
        }));
      },
      { width: 390 }
    );
    expect(r).toEqual({ overflow: 0, byline: "flex", rail: "none", label: true });
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
      return [await read(FULL), await read(PLAIN), await read("/insights/fixture-bar-chart"), await read(LONG)];
    });
    expect(r).toEqual([
      { dash: false, uppercase: 0 },
      { dash: false, uppercase: 0 },
      { dash: false, uppercase: 0 },
      { dash: false, uppercase: 0 },
    ]);
  });

  it("shows keyboard focus as the accent ring, not the browser's blue", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
        const rings: Record<string, string> = {};
        for (let i = 0; i < 60 && Object.keys(rings).length < 3; i++) {
          await page.keyboard.press("Tab");
          // past the links' 150ms colour transition, which eases the ring in
          await page.waitForTimeout(250);
          const hit = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            if (!el || !el.matches(":focus-visible")) return null;
            const which = el.closest("nav[aria-label='On this page']")
              ? "outline"
              : el.closest(".article-body")
                ? "body"
                : el.matches("a[href^='mailto:']") && !el.closest("header")
                  ? "call"
                  : null;
            const s = getComputedStyle(el);
            return which ? [which, `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`] : null;
          });
          if (hit && !(hit[0] in rings)) rings[hit[0]] = hit[1];
        }
        return rings;
      },
      { reducedMotion: true }
    );
    const fern = "solid 2px rgb(61, 99, 61)";
    expect(r).toEqual({ outline: fern, body: fern, call: fern });
  });

  it("moves focus to the section an outline link opens", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${FULL}`, { waitUntil: "networkidle" });
        await page.locator("nav[aria-label='On this page'] a", { hasText: "What changed by the end of the month?" }).click();
        await page.waitForTimeout(800);
        return page.evaluate(() => ({
          focused: document.activeElement?.id,
          tag: document.activeElement?.tagName,
        }));
      },
      { reducedMotion: true }
    );
    expect(r).toEqual({ focused: "what-changed-by-the-end-of-the-month", tag: "H2" });
  });

  it("follows a footnote and comes back without writing a hash, landing clear of the nav", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${LONG}`, { waitUntil: "networkidle" });
        const at = (sel: string) => page.locator(sel).evaluate((el) => Math.round(el.getBoundingClientRect().top));
        const state = async () => ({
          hash: await page.evaluate(() => location.hash),
          focused: await page.evaluate(() => document.activeElement?.id),
        });
        await page.locator("[data-footnote-ref]").first().click();
        await page.waitForTimeout(1200);
        const there = { ...(await state()), top: await at("#user-content-fn-1") };
        await page.locator("#user-content-fn-1 [data-footnote-backref]").click();
        await page.waitForTimeout(1200);
        const back = { ...(await state()), top: await at("#user-content-fnref-1") };
        return { there, back };
      },
      { reducedMotion: true }
    );
    expect(r.there).toMatchObject({ hash: "", focused: "user-content-fn-1" });
    expect(r.there.top).toBeGreaterThanOrEqual(80);
    expect(r.there.top).toBeLessThanOrEqual(100);
    expect(r.back).toMatchObject({ hash: "", focused: "user-content-fnref-1" });
    expect(r.back.top).toBeGreaterThanOrEqual(80);
    expect(r.back.top).toBeLessThanOrEqual(100);
  });

  it("keeps a long word, a long address, code, and a wide table inside the text column", async () => {
    const probe = (width: number) =>
      withPage(
        async (page) => {
          await page.goto(`${site.url}${LONG}`, { waitUntil: "networkidle" });
          return page.evaluate(() => {
            const body = document.querySelector(".article-body")!;
            const edge = Math.round(body.getBoundingClientRect().right);
            // a wide table's rows may run past the edge inside its own
            // scroll box; the box itself must not
            const past = [...body.querySelectorAll("*")]
              .filter((el) => !el.closest(".table-scroll") || el.classList.contains("table-scroll"))
              .filter((el) => Math.round(el.getBoundingClientRect().right) > edge + 1)
              .map((el) => el.tagName.toLowerCase());
            const box = body.querySelector(".table-scroll")!;
            return {
              overflow: document.documentElement.scrollWidth - innerWidth,
              past: [...new Set(past)],
              tableScrolls: getComputedStyle(box).overflowX === "auto" && box.scrollWidth > box.clientWidth,
            };
          });
        },
        { width }
      );
    expect(await probe(390)).toEqual({ overflow: 0, past: [], tableScrolls: true });
    expect(await probe(1024)).toEqual({ overflow: 0, past: [], tableScrolls: true });
  });

  it("reserves a body image's space before it loads, portrait and landscape", async () => {
    const r = await withPage(async (page) => {
      // the images never arrive: the space must already be there
      await page.route(/\/media\/insights\/.*\.(png|jpg)$/, (route) => route.abort());
      await page.goto(`${site.url}${LONG}`, { waitUntil: "networkidle" });
      return page.locator(".article-body figure img").evaluateAll((imgs) =>
        imgs.map((img) => {
          const { width, height } = img.getBoundingClientRect();
          return { attrs: [img.getAttribute("width"), img.getAttribute("height")], ratio: Number((width / height).toFixed(2)) };
        })
      );
    });
    expect(r).toEqual([
      { attrs: ["600", "800"], ratio: 0.75 },
      { attrs: ["900", "450"], ratio: 2 },
    ]);
  });

  it("scrolls a long outline inside the rail on a short screen and keeps the current section in view", async () => {
    const r = await withPage(async (page) => {
      await page.setViewportSize({ width: 1440, height: 700 });
      await page.goto(`${site.url}${LONG}`, { waitUntil: "networkidle" });
      // mid-article, where the rail is still pinned (at the end it lifts with the page)
      await page.locator("#the-tenth-section").evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 88));
      await page.waitForTimeout(600);
      return page.evaluate(() => {
        const rail = document.querySelector("[data-rail]")!;
        const current = document.querySelector("nav[aria-label='On this page'] a[aria-current='location']")!;
        const box = current.getBoundingClientRect();
        return {
          current: current.textContent,
          railFits: Math.round(rail.getBoundingClientRect().bottom) <= innerHeight,
          currentInView: box.top >= 0 && box.bottom <= innerHeight,
        };
      });
    });
    expect(r).toEqual({ current: "The tenth section", railFits: true, currentInView: true });
  });
});

describe("the insights index", () => {
  it("features the newest post, then lists the rest newest first", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}/insights`, { waitUntil: "networkidle" });
      const section = page.locator("#insights");
      return {
        title: await page.title(),
        h1: await page.locator("h1").allTextContents(),
        posts: await section.locator("article").count(),
        featured: await section.locator("[data-featured] h2").textContent(),
        cover: await section.locator("[data-featured] img.insight-cover").count(),
        rows: await section.locator("[data-row] h2").allTextContents(),
        links: await section.locator("article h2 a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
        portraits: await section.locator("[data-portrait]").count(),
        order: await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id)),
      };
    });
    expect(r.title).toBe("Insights | Crosswell");
    expect(r.h1).toEqual(["Insights"]);
    expect(r.posts).toBe(4);
    expect(r.featured).toBe("What a sample team learned from its first month of notes");
    expect(r.cover).toBe(1);
    expect(r.rows).toEqual(["How a sample team spends its week", LONG_TITLE, "A plain research note"]);
    expect(r.links).toEqual(["/insights/fixture-field-notes", "/insights/fixture-bar-chart", LONG, "/insights/fixture-plain-note"]);
    expect(r.portraits).toBe(4);
    expect(r.order).toEqual(["insights"]);
  });

  it("fits a phone", async () => {
    const overflow = await withPage(
      async (page) => {
        await page.goto(`${site.url}/insights`, { waitUntil: "networkidle" });
        return page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      },
      { width: 390 }
    );
    expect(overflow).toBe(0);
  });
});

describe("without JavaScript", () => {
  it("shows the whole post, and an outline link still lands its heading clear of the nav", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(`${site.url}${LONG}`, { waitUntil: "networkidle" });
        const visible = (sel: string) => page.locator(sel).first().evaluate((el) => getComputedStyle(el).opacity === "1");
        const end = await visible("#insight [data-portrait]");
        const related = await visible("[aria-labelledby='keep-reading'] a");
        await page.locator("nav[aria-label='On this page'] a", { hasText: "The tenth section" }).click();
        await page.waitForTimeout(400);
        const top = await page.locator("#the-tenth-section").evaluate((el) => Math.round(el.getBoundingClientRect().top));
        await page.locator("[data-footnote-ref]").first().click();
        await page.waitForTimeout(400);
        const note = await page.locator("#user-content-fn-1").evaluate((el) => Math.round(el.getBoundingClientRect().top));
        return { end, related, top, note, current: await page.locator("nav[aria-label='On this page'] a[aria-current]").count() };
      },
      // reduced motion: the page's own smooth scroll keeps a hash jump
      // gliding while the driver looks for a still target
      { js: false, reducedMotion: true }
    );
    expect(r).toMatchObject({ end: true, related: true, current: 0 });
    expect(r.top).toBeGreaterThanOrEqual(80);
    expect(r.top).toBeLessThanOrEqual(100);
    expect(r.note).toBeGreaterThanOrEqual(80);
    expect(r.note).toBeLessThanOrEqual(100);
  });
});

describe("the not-found page", () => {
  it("is the site's own, with the two ways on", async () => {
    // the static export's 404.html is what Vercel serves for any address
    // that is not a page, the insights route's _none placeholder included
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}/404`, { waitUntil: "networkidle" });
      return {
        h1: await page.locator("h1").textContent(),
        ways: await page.locator("#not-found a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
        nav: await page.locator("header nav a").count(),
        footer: await page.locator("footer").count(),
        dash: await page.evaluate(() => document.body.innerText.includes("—")),
      };
    });
    expect(r).toEqual({ h1: "There’s nothing at this address.", ways: ["/insights", "/"], nav: 5, footer: 1, dash: false });
  });
});

describe("search", () => {
  it("lists every post in the sitemap and lets the AI crawlers in", () => {
    const sitemap = readFileSync(join("out", "sitemap.xml"), "utf8");
    const robots = readFileSync(join("out", "robots.txt"), "utf8");
    for (const slug of ["fixture-field-notes", "fixture-bar-chart", "fixture-long-read", "fixture-plain-note"]) {
      expect(sitemap).toContain(`<loc>${SITE}/insights/${slug}</loc>`);
    }
    expect(sitemap).toMatch(/fixture-field-notes<\/loc>\s*<lastmod>2026-09-27/);
    expect(sitemap).toMatch(/fixture-plain-note<\/loc>\s*<lastmod>2026-09-10/);
    expect(sitemap).not.toContain("_none");
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot"]) {
      expect(robots).toMatch(new RegExp(`User-Agent: ${bot}\\nAllow: /`, "i"));
    }
    expect(robots).toMatch(/User-Agent: \*\nAllow: \//i);
  });
});
