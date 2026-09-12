import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

function guard(dir: string) {
  return spawnSync("node", ["scripts/check-copy.mjs", dir], { encoding: "utf8" });
}

describe("copy guard", () => {
  it("fails on an em dash, brain, mind, and uppercase", () => {
    const r = guard("tests/fixtures/copy-bad");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/em dash/);
    expect(r.stderr).toMatch(/brain/);
    expect(r.stderr).toMatch(/mind/);
    expect(r.stderr).toMatch(/uppercase/);
  });

  it("catches a banned word that shares a line with className", () => {
    const r = guard("tests/fixtures/copy-bad");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/bad\.tsx:7: the word mind/);
  });

  it("passes clean copy", () => {
    const r = guard("tests/fixtures/copy-good");
    expect(r.status).toBe(0);
  });
});
