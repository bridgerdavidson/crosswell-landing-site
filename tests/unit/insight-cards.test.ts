import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const out = mkdtempSync(join(tmpdir(), "cards-"));
afterAll(() => rmSync(out, { recursive: true, force: true }));

/** a PNG's width and height, from its header */
const pngSize = (file: string) => {
  const b = readFileSync(file);
  return { png: b.subarray(1, 4).toString() === "PNG", width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

describe("share cards", () => {
  it("writes a 1200 by 630 PNG for every post, cover or not", () => {
    const r = spawnSync("npx", ["tsx", "scripts/insight-cards.ts"], {
      encoding: "utf8",
      env: {
        ...process.env,
        INSIGHTS_DIR: "tests/fixtures/insights",
        INSIGHTS_MEDIA_DIR: "tests/fixtures/insights/media",
        CARDS_OUT: out,
      },
    });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(`cards: 4 written to ${out}`);
    for (const slug of ["fixture-field-notes", "fixture-bar-chart", "fixture-long-read", "fixture-plain-note"]) {
      expect(pngSize(join(out, slug, "card.png"))).toEqual({ png: true, width: 1200, height: 630 });
    }
  });

  it("fails with the loader's message on a broken post", () => {
    const r = spawnSync("npx", ["tsx", "scripts/insight-cards.ts"], {
      encoding: "utf8",
      env: { ...process.env, INSIGHTS_DIR: "tests/fixtures/insights-bad", CARDS_OUT: out },
    });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("broken-post.md: description: is missing.");
  });
});
