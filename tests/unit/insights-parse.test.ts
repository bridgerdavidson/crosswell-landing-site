import { describe, expect, it } from "vitest";
import { parsePost } from "@/lib/insights/parse";
import { makePost, problemsOf, TEST_CONTEXT, TEST_PEOPLE } from "../helpers/post";

const F = "content/insights/a-test-post.md";

describe("a post", () => {
  it("parses a valid post", () => {
    const post = makePost();
    expect(post).toMatchObject({
      slug: "a-test-post",
      file: F,
      title: "A test post",
      description: "A line for the card.",
      author: TEST_PEOPLE[0],
      published: "2026-09-20",
      takeaways: [],
      related: [],
      charts: [],
      faq: [],
      outline: [{ id: "a-section", text: "A section" }],
    });
    expect(post.updated).toBeUndefined();
    expect(post.cover).toBeUndefined();
  });

  it("curls the frontmatter text", () => {
    const post = makePost({
      title: `It's a "test"`,
      description: "A post's line.",
      takeaways: `["It's one", "Two"]`,
      cover: "cover.jpg",
      coverAlt: "The team's desk",
    });
    expect(post.title).toBe("It’s a “test”");
    expect(post.description).toBe("A post’s line.");
    expect(post.takeaways).toEqual(["It’s one", "Two"]);
    expect(post.cover).toEqual({ file: "cover.jpg", src: "/media/insights/a-test-post/cover.jpg", alt: "The team’s desk" });
  });

  it("keeps updated, related, and an upper-case cover extension", () => {
    const post = makePost({ updated: "2026-09-25", related: "[other-post]", cover: "Cover.JPG", coverAlt: "A desk" });
    expect(post.updated).toBe("2026-09-25");
    expect(post.related).toEqual(["other-post"]);
    expect(post.cover?.src).toBe("/media/insights/a-test-post/Cover.JPG");
  });
});

describe("a post's problems", () => {
  const problems = (fields: Record<string, string>, body?: string, ctx = {}) =>
    problemsOf(() => makePost(fields, body, ctx));

  it("names a missing field", () => {
    expect(problems({ title: "" })).toEqual([`${F}: title: is missing.`]);
  });

  it("names an unknown field", () => {
    expect(problems({ publised: "2026-09-20" })).toEqual([
      `${F}: publised: is not a post field. Post fields: title, description, author, published, updated, takeaways, cover, coverAlt, related.`,
    ]);
  });

  it("names an unknown author and lists the known ones", () => {
    expect(problems({ author: "nobody" })).toEqual([
      `${F}: author: "nobody" is not in src/lib/people.ts. Known ids: max, sam.`,
    ]);
  });

  it("keeps the description to 160 characters", () => {
    expect(problems({ description: "x".repeat(161) })).toEqual([
      `${F}: description: is 161 characters. Keep it to 160 or fewer.`,
    ]);
  });

  it("checks the dates", () => {
    expect(problems({ published: "2026-02-30" })).toEqual([`${F}: published: "2026-02-30" is not a date. Use YYYY-MM-DD.`]);
    expect(problems({ published: "2026-13-01" })).toEqual([`${F}: published: "2026-13-01" is not a date. Use YYYY-MM-DD.`]);
    expect(problems({ published: "2026-10-01" })).toEqual([
      `${F}: published: 2026-10-01 is after today (2026-09-29). The site only rebuilds on merge, so a future date does not schedule anything; use today's date.`,
    ]);
    expect(problems({ updated: "2026-09-01" })).toEqual([`${F}: updated: 2026-09-01 is before published (2026-09-20).`]);
  });

  it("checks the cover", () => {
    expect(problems({ cover: "cover.jpg" })).toEqual([
      `${F}: coverAlt: is required when there is a cover. Describe what the image shows.`,
    ]);
    expect(problems({ cover: "cover.webp", coverAlt: "x" })).toEqual([
      `${F}: cover: "cover.webp" must be a .jpg or .png (share cards cannot read other formats).`,
    ]);
    expect(problems({ cover: "cover.jpg", coverAlt: "x" }, undefined, { mediaExists: () => false })).toEqual([
      `${F}: cover: "cover.jpg" is not in public/media/insights/a-test-post/.`,
    ]);
    expect(problems({ coverAlt: "x" })).toEqual([`${F}: coverAlt: is set but there is no cover.`]);
  });

  it("checks takeaways and related", () => {
    expect(problems({ takeaways: "[Only one]" })).toEqual([`${F}: takeaways: has 1 item. Use 2 to 5, or leave takeaways out.`]);
    expect(problems({ related: "[a-test-post]" })).toEqual([`${F}: related: lists this post itself.`]);
    expect(problems({ related: "[a, b, c, d]" })).toEqual([`${F}: related: lists 4 posts. Use at most 3.`]);
  });

  it("names a filename that is not a slug", () => {
    expect(
      problemsOf(() => parsePost("content/insights/Bad_Slug.md", "---\ntitle: x\ndescription: x\nauthor: max\npublished: 2026-09-20\n---\n\nText.", TEST_CONTEXT))
    ).toEqual([
      `content/insights/Bad_Slug.md: filename: "Bad_Slug" is not a valid slug. Use lowercase words joined by hyphens, at most 80 characters, like what-firms-keep.md.`,
    ]);
  });

  it("prefixes the body's problems with the file", () => {
    expect(problems({}, "# Title")).toEqual([
      `${F}: body: "# Title" is a top-level heading. The title comes from frontmatter; use ## for sections.`,
    ]);
  });

  it("lists every problem in the file at once", () => {
    expect(problems({ title: "", author: "nobody" })).toHaveLength(2);
  });

  it("names frontmatter it cannot read", () => {
    expect(problemsOf(() => parsePost(F, "---\ntitle: [unclosed\n---\n\nText.", TEST_CONTEXT))[0]).toMatch(
      new RegExp(`^${F}: frontmatter: is not valid YAML`)
    );
  });

  describe("frontmatter YAML hints", () => {
    const REST = "description: x\nauthor: max\npublished: 2026-09-20";
    const problem = (fm: string) => problemsOf(() => parsePost(F, `---\n${fm}\n---\n\nText.`, TEST_CONTEXT))[0];
    /** the sentence after the parser's own words */
    const hint = (fm: string) => problem(fm).replace(/^.*\)\. /, "");

    it("tells the author to quote a value with a colon in it, showing the quoted line", () => {
      expect(problem(`title: AI: what it keeps\n${REST}`)).toBe(
        `${F}: frontmatter: is not valid YAML (Nested mappings are not allowed in compact mappings at line 2, column 8). A value with ": " in it needs quotes, like title: "AI: what it keeps".`
      );
      expect(hint(`title: x\n${REST}\ncoverAlt: A photo: the team\ncover: cover.jpg`)).toBe('A value with ": " in it needs quotes, like coverAlt: "A photo: the team".');
    });

    it("catches a takeaway with a colon in it, which YAML reads as a field rather than a line", () => {
      expect(problem(`title: x\n${REST}\ntakeaways:\n  - One: two\n  - Three`)).toBe(
        `${F}: takeaways: a line with ": " in it needs quotes, like - "One: two".`
      );
    });

    it("matches the hint to the cause: an apostrophe in single quotes, a repeated field, tabs, a missing quote, a missing ]", () => {
      expect(hint(`title: 'It's here'\n${REST}`)).toBe(`A value in single quotes cannot hold an apostrophe. Use double quotes, like title: "It's here".`);
      expect(hint(`title: x\ntitle: y\n${REST}`)).toBe("A field is repeated. Each field appears once.");
      expect(hint(`title: x\n${REST}\ntakeaways:\n\t- one\n\t- two`)).toBe("Indent with spaces, not tabs.");
      expect(hint(`title: "unclosed\n${REST}`)).toBe("A quoted value is missing its closing quote.");
      expect(hint(`title: x\n${REST}\ntakeaways:\n  - %one\n  - two`)).toBe('A value starting with % or # needs quotes, like - "%one".');
      expect(hint(`title: x\n${REST}\nrelated: [unclosed`)).toBe("A list in brackets needs its closing ], like related: [a-post, b-post].");
    });

    it("falls back to the general hint when the cause is something else", () => {
      expect(hint(`title\n${REST}`)).toBe("Check the lines between the --- markers: each one is a field, a colon, and its value.");
    });
  });
});
