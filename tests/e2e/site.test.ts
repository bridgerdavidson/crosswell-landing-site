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
