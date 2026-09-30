import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getAllPosts, loadPosts, postFiles } from "@/lib/insights/load";
import { relatedPosts } from "@/lib/insights/related";
import { formatDate, formatMonth } from "@/lib/insights/dates";
import { problemsOf, source, TEST_PEOPLE } from "../helpers/post";

const FIXTURES = "tests/fixtures/insights";
const fixtureMedia = (slug: string, file: string) => existsSync(join(FIXTURES, "media", slug, file));
const load = () => loadPosts(FIXTURES, { mediaExists: fixtureMedia, today: "2026-09-29" });

const dirs: string[] = [];
const tmp = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), "insights-"));
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
  dirs.push(dir);
  return dir;
};
afterEach(() => {
  vi.unstubAllEnvs();
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe("the loader", () => {
  it("loads the fixture posts newest first", () => {
    expect(load().map((p) => p.slug)).toEqual(["fixture-field-notes", "fixture-bar-chart", "fixture-plain-note"]);
  });

  it("breaks a tie on the date by slug", () => {
    const dir = tmp({ "b-post.md": source({ published: "2026-09-20" }), "a-post.md": source({ published: "2026-09-20" }) });
    expect(loadPosts(dir, { people: TEST_PEOPLE, today: "2026-09-29" }).map((p) => p.slug)).toEqual(["a-post", "b-post"]);
  });

  it("skips README.md, files starting with _, and anything not Markdown", () => {
    const dir = tmp({ "README.md": "# not a post", "_draft.md": "nope", "notes.txt": "nope", "real-post.md": source() });
    expect(postFiles(dir)).toEqual(["real-post.md"]);
  });

  it("returns nothing for an empty or missing folder", () => {
    expect(loadPosts(tmp({}))).toEqual([]);
    expect(loadPosts(join(tmpdir(), "no-such-insights-folder"))).toEqual([]);
  });

  it("checks a media file's name by exact case, so a build on Linux cannot miss what macOS forgave", () => {
    const dir = tmp({ "a-post.md": source({ cover: "cover.jpg", coverAlt: "x" }) });
    const media = tmp({});
    mkdirSync(join(media, "a-post"));
    writeFileSync(join(media, "a-post", "Cover.jpg"), "x");
    vi.stubEnv("INSIGHTS_MEDIA_DIR", media);
    const load = () => loadPosts(dir, { people: TEST_PEOPLE, today: "2026-09-29" });
    expect(problemsOf(load)).toEqual([`${join(dir, "a-post.md")}: cover: "cover.jpg" is not in public/media/insights/a-post/.`]);
    renameSync(join(media, "a-post", "Cover.jpg"), join(media, "a-post", "cover.jpg"));
    expect(problemsOf(load)).toEqual([]);
  });

  it("names a related slug that is not a post", () => {
    const dir = tmp({ "one-post.md": source({ related: "[ghost-post]" }) });
    expect(problemsOf(() => loadPosts(dir, { people: TEST_PEOPLE, today: "2026-09-29" }))).toEqual([
      `${join(dir, "one-post.md")}: related: "ghost-post" is not a published post.`,
    ]);
  });

  it("collects the problems from every file", () => {
    const dir = tmp({ "one-post.md": source({ title: "" }), "two-post.md": source({ author: "nobody" }) });
    expect(problemsOf(() => loadPosts(dir, { people: TEST_PEOPLE, today: "2026-09-29" }))).toHaveLength(2);
  });

  it("caches the posts for a build", () => {
    const dir = tmp({ "a-post.md": source({ title: "Before" }) });
    vi.stubEnv("INSIGHTS_DIR", dir);
    expect(getAllPosts()[0].title).toBe("Before");
    writeFileSync(join(dir, "a-post.md"), source({ title: "After" }));
    expect(getAllPosts()[0].title).toBe("Before");
  });

  it("reads posts fresh in development", () => {
    const dir = tmp({ "a-post.md": source({ title: "Before" }) });
    vi.stubEnv("INSIGHTS_DIR", dir);
    vi.stubEnv("NODE_ENV", "development");
    expect(getAllPosts()[0].title).toBe("Before");
    writeFileSync(join(dir, "a-post.md"), source({ title: "After" }));
    expect(getAllPosts()[0].title).toBe("After");
  });
});

describe("related posts", () => {
  it("uses the post's own list when it has one", () => {
    const [notes, , plain] = load();
    expect(relatedPosts(notes, load()).map((p) => p.slug)).toEqual([plain.slug]);
  });

  it("otherwise fills in the newest other posts, never the post itself, at most three", () => {
    const posts = load();
    expect(relatedPosts(posts[2], posts).map((p) => p.slug)).toEqual(["fixture-field-notes", "fixture-bar-chart"]);
    const many = Array.from({ length: 5 }, (_, i) => ({ ...posts[2], slug: `p${i}`, related: [] }));
    expect(relatedPosts(many[0], many).map((p) => p.slug)).toEqual(["p1", "p2", "p3"]);
  });
});

describe("dates", () => {
  it("reads a date the same way in any time zone", () => {
    expect(formatDate("2026-10-06")).toBe("October 6, 2026");
    expect(formatMonth("2026-10-01")).toBe("October 2026");
  });
});
