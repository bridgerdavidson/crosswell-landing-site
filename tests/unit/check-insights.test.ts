import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const run = (env: Record<string, string>) =>
  spawnSync("npx", ["tsx", "scripts/check-insights.ts"], { encoding: "utf8", env: { ...process.env, ...env } });

describe("npm run check:insights", () => {
  it("passes the fixture posts", () => {
    const r = run({ INSIGHTS_DIR: "tests/fixtures/insights", INSIGHTS_MEDIA_DIR: "tests/fixtures/insights/media" });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("insights: 4 posts checked, all valid (tests/fixtures/insights)");
  });

  it("passes the real content folder, however many posts it holds", () => {
    const r = run({ INSIGHTS_DIR: "content/insights" });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/insights: \d+ posts? checked, all valid \(content\/insights\)/);
  });

  it("lists every problem in a broken post and fails", () => {
    const r = run({ INSIGHTS_DIR: "tests/fixtures/insights-bad" });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("broken-post.md: description: is missing.");
    expect(r.stderr).toContain('broken-post.md: author: "nobody" is not in src/lib/people.ts.');
    expect(r.stderr).toContain('broken-post.md: published: "2026-13-01" is not a date. Use YYYY-MM-DD.');
    expect(r.stderr).toContain('broken-post.md: body: "# A heading that should not be here" is a top-level heading.');
    expect(r.stderr).toContain("insights: 4 problems to fix");
  });
});
