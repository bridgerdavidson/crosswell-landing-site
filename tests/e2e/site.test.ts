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
