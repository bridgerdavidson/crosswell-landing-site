import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const skill = readFileSync(".claude/skills/publish-insight/SKILL.md", "utf8");
const setup = readFileSync("docs/publishing-insights.md", "utf8");

describe("the publishing command", () => {
  it("is a skill named publish-insight", () => {
    expect(skill).toMatch(/^---\nname: publish-insight\ndescription: .+\n---\n/);
  });

  it("refuses to run without the never-publish list, and runs the checks", () => {
    expect(skill).toContain(".claude/never-publish.local.txt");
    expect(skill).toContain("stop");
    for (const step of ["npm run check:insights", "npm run check:copy", "npm run cards", "ship it", "gh pr create"]) {
      expect(skill).toContain(step);
    }
  });

  it("never merges, never touches main, never invents a data point", () => {
    expect(skill).toMatch(/Never merge/);
    expect(skill).toMatch(/Never push to `main`/);
    expect(skill).toMatch(/Never invent, round, or fill in a data point/);
  });

  it("names no private paths and carries no em dash", () => {
    for (const text of [skill, setup]) {
      expect(text).not.toMatch(/\/Users\/|Documents\/|ai-os/);
      expect(text).not.toContain("—");
    }
  });

  it("keeps the never-publish list out of git", () => {
    expect(readFileSync(".gitignore", "utf8")).toContain("*.local.*");
  });
});
