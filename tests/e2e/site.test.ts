import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveOut } from "../helpers/serve";
import { withPage } from "../helpers/browser";

let site: Awaited<ReturnType<typeof serveOut>>;

beforeAll(async () => {
  site = await serveOut();
});
afterAll(() => site.close());

describe("smoke", () => {
  it("serves the home page", async () => {
    const title = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.title();
    });
    expect(title).toContain("Crosswell");
  });
});

describe("removals", () => {
  it("has no Security section and no dashboard tour", async () => {
    const counts = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        security: await page.locator("#security").count(),
        tour: await page.locator(".cwd-frame").count(),
        diagram: await page.locator(".trust-diagram").count(),
      };
    });
    expect(counts).toEqual({ security: 0, tour: 0, diagram: 0 });
  });
});

describe("type", () => {
  it("uses Instrument Sans and no uppercase text", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(() => ({
        font: getComputedStyle(document.body).fontFamily,
        uppercase: [...document.querySelectorAll("header *, main *, footer *")].filter(
          (el) => getComputedStyle(el).textTransform === "uppercase"
        ).length,
        kicker: document.querySelectorAll(".type-kicker").length,
      }));
    });
    expect(r.font).toMatch(/Instrument Sans/);
    expect(r.uppercase).toBe(0);
    expect(r.kicker).toBe(0);
  });
});

describe("nav", () => {
  it("lists the five links, sentence case", async () => {
    const labels = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.locator("header nav a").allTextContents();
    });
    expect(labels).toEqual(["How it works", "Why Crosswell", "How we start", "Team", "Insights"]);
  });
});

describe("built css", () => {
  it("keeps the double stops in the product masks", () => {
    const dir = join("out", "_next", "static", "css");
    const css = readdirSync(dir).map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
    // the minifier writes the double stop as the two-position shorthand #000 0 74%
    // (same as the hero mask's #000 0 55% in production); a lone "#000 0" with no
    // second position would mean the stop collapsed.
    expect(css).toMatch(/product-frame-corner\{[^}]*#000 0 74%/);
    expect(css).toMatch(/product-frame-corner\{[^}]*#000 0 72%/);
    expect(css).toMatch(/product-frame-right\{[^}]*#000 0 74%/);
  });
});

describe("product run", () => {
  it("renders chapter 01 with the finished morning", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("#how-it-works");
      return {
        intro: await run.locator("h2").first().textContent(),
        label: await run.locator(".type-label").nth(1).textContent(),
        greeting: await run.getByText("Good morning, Morgan.").count(),
        filed: await run.getByText("14 filed overnight").count(),
        captions: await page.getByText("Interactive demo · Sample data").count(),
      };
    });
    expect(r.intro).toContain("talking to your firm");
    expect(r.label).toContain("Today");
    expect(r.greeting).toBe(1);
    expect(r.filed).toBe(1);
    expect(r.captions).toBeGreaterThanOrEqual(1);
  });
});

describe("chapter 02", () => {
  it("renders the agenda with Draw 4 checked and synced", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("#how-it-works");
      return {
        panels: await run.locator(".product-track > section").count(),
        synced: await run.getByText("synced to Asana").count(),
        rocks: await run.getByText("Deploy $6M into new loans").count(),
      };
    });
    expect(r.panels).toBe(3);
    expect(r.synced).toBe(1);
    expect(r.rocks).toBe(1);
  });
});

describe("chapter 03", () => {
  it("renders the dark chat with the first exchange answered", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const dark = page.locator("section.bg-charcoal-deep").first();
      return {
        exists: await dark.count(),
        question: await dark.getByText("What's at risk this week?").count(),
        followUps: await dark.locator("button.product-chip").count(),
        send: await dark.locator("button.product-send").count(),
        receipts: await dark.locator(".product-chip-accent").count(),
      };
    });
    expect(r.exists).toBe(1);
    expect(r.question).toBe(1);
    expect(r.followUps).toBe(2);
    expect(r.send).toBe(1);
    expect(r.receipts).toBeGreaterThanOrEqual(2);
  });
});

describe("chapter 04", () => {
  it("renders the board with the selected card's detail open", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='04']");
      return {
        stages: await run.locator("[data-stage]").count(),
        active: await run.locator(".product-card-active").count(),
        who: await run.getByText("Who is this?").count(),
        answer: await run.getByText("Redrock Flips, a first-time borrower introduced by Canyon State Brokers").count(),
      };
    });
    expect(r.stages).toBe(5);
    expect(r.active).toBe(1);
    expect(r.who).toBe(2);
    expect(r.answer).toBe(1);
  });
});
