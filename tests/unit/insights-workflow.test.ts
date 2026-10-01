import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import YAML from "yaml";

const FILE = ".github/workflows/insights-check.yml";

describe("the insights pull request check", () => {
  it("exists", () => {
    expect(existsSync(FILE)).toBe(true);
  });

  it("runs on pull requests that touch a post or its media, and nothing else", () => {
    const wf = YAML.parse(readFileSync(FILE, "utf8"));
    expect(Object.keys(wf.on)).toEqual(["pull_request"]);
    expect(wf.on.pull_request.paths).toEqual(["content/insights/**", "public/media/insights/**"]);
  });

  it("reads the repo only, on Node 24, and runs the site's own checks", () => {
    const wf = YAML.parse(readFileSync(FILE, "utf8"));
    expect(wf.permissions).toEqual({ contents: "read" });
    const job = wf.jobs.check;
    expect(job.name).toBe("insights check");
    const setup = job.steps.find((s: { uses?: string }) => s.uses?.startsWith("actions/setup-node"));
    expect(setup.with["node-version"]).toBe(24);
    const runs = job.steps.map((s: { run?: string }) => s.run).filter(Boolean);
    expect(runs).toEqual(["npm ci", "npm run check:insights", "npm run check:copy"]);
  });
});
