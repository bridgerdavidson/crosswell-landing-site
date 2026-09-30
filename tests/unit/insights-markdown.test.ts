import { describe, expect, it } from "vitest";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import { parseBody } from "@/lib/insights/markdown";
import { staticParams } from "@/lib/insights/paths";

const ctx = { slug: "a-test-post", mediaExists: () => true };
const parse = (md: string, mediaExists = () => true) => parseBody(md, { ...ctx, mediaExists });
const ok = (md: string) => {
  const r = parse(md);
  expect(r.problems).toEqual([]);
  return r.value!;
};

/** every element with this tag name */
const elements = (tree: Root, tag: string) => {
  const found: Element[] = [];
  visit(tree, "element", (node: Element) => {
    if (node.tagName === tag) found.push(node);
  });
  return found;
};
/** a node's text */
const text = (node: { type: string; value?: string; children?: unknown[] }): string =>
  node.type === "text" ? node.value ?? "" : (node.children ?? []).map((c) => text(c as never)).join("");

describe("the body", () => {
  it("curls apostrophes and quotes", () => {
    const { body } = ok(`It's "quoted".`);
    expect(text(elements(body, "p")[0])).toBe("It’s “quoted”.");
  });

  it("never turns hyphens into dashes", () => {
    const { body } = ok("a -- b --- c");
    const t = text(elements(body, "p")[0]);
    expect(t).toBe("a -- b --- c");
    expect(t).not.toMatch(/[–—]/);
  });

  it("gives every heading an id and outlines the ## sections", () => {
    const { body, outline } = ok("## First\n\ntext\n\n### Inside\n\ntext\n\n## What's second?\n\ntext");
    expect(outline).toEqual([
      { id: "first", text: "First" },
      { id: "whats-second", text: "What’s second?" },
    ]);
    expect(elements(body, "h3")[0].properties.id).toBe("inside");
  });

  it("gives a repeated heading its own id", () => {
    const { body, outline } = ok("## Why\n\none\n\n## Why\n\ntwo");
    expect(outline.map((o) => o.id)).toEqual(["why", "why-1"]);
    expect(elements(body, "h2").map((h) => h.properties.id)).toEqual(["why", "why-1"]);
  });

  it("rejects a top-level heading and one deeper than ###", () => {
    expect(parse("# Title\n\n#### Deep").problems).toEqual([
      'body: "# Title" is a top-level heading. The title comes from frontmatter; use ## for sections.',
      'body: "#### Deep" is deeper than ###. Use ## for sections and ### inside them.',
    ]);
  });

  it("rejects a heading with no text, which would leave an empty link in the outline", () => {
    expect(parse("Text.\n\n## \n\nMore text.").problems).toEqual([
      "body: a heading has no text. Write the heading or remove its # marks.",
    ]);
  });

  it("rejects a heading with no letters or digits, which could not get an id", () => {
    expect(parse("## ???\n\ntext").problems).toEqual([
      'body: the heading "???" has no letters or digits, so it cannot get an id for the outline. Add a word to it.',
    ]);
    expect(ok("## Über uns\n\ntext").outline).toEqual([{ id: "über-uns", text: "Über uns" }]);
  });

  it("rejects raw HTML", () => {
    expect(parse('<div class="x">hi</div>').problems[0]).toMatch(/^body: raw HTML \(<div class="x">hi<\/div>\) is not allowed/);
  });
});

describe("charts in the body", () => {
  const chart = "```chart\ntype: bar\ntitle: Hours\nsource: Test\nsourceUrl: https://example.com\ndata:\n  A: 1\n  B: 2\n```";

  it("turns a chart block into a chart element and a parsed chart", () => {
    const { body, charts } = ok(`Intro.\n\n${chart}`);
    expect(charts).toHaveLength(1);
    expect(charts[0].data).toEqual([
      { label: "A", value: 1 },
      { label: "B", value: 2 },
    ]);
    const [el] = elements(body, "x-chart");
    expect(el.properties.dataChart).toBe(0);
    expect(elements(body, "pre")).toHaveLength(0);
  });

  it("names the chart and its title in a problem", () => {
    expect(parse(chart.replace("B: 2", "B: two")).problems).toEqual([
      'chart 1 ("Hours"): data value "two" for "B" is not a number.',
    ]);
  });
});

describe("the FAQ", () => {
  const faq = [
    "## Frequently asked questions",
    "### Is this real?",
    "No. It's a test.",
    "### Does it count?",
    "Yes.",
    "More of the answer.",
    "## After the FAQ",
    "Not an answer.",
  ].join("\n\n");

  it("collects each question and its answer", () => {
    const { faq: items } = ok(faq);
    expect(items).toEqual([
      { id: "is-this-real", question: "Is this real?", answer: "No. It’s a test." },
      { id: "does-it-count", question: "Does it count?", answer: "Yes.\n\nMore of the answer." },
    ]);
  });

  it("wraps the questions as rows and ends the FAQ at the next section", () => {
    const { body, outline } = ok(faq);
    const [wrapper] = elements(body, "x-faq");
    const rows = (wrapper.children as Element[]).filter((c) => c.type === "element");
    expect(rows.map((r) => r.properties.className)).toEqual([["faq-item"], ["faq-item"]]);
    expect(text(wrapper)).not.toContain("Not an answer.");
    expect(outline.map((o) => o.text)).toEqual(["Frequently asked questions", "After the FAQ"]);
  });

  it("flags a heading that looks like the FAQ heading but is not exactly it, which would lose the FAQ silently", () => {
    for (const h of ["Frequently asked questions:", "FAQ", "Frequently asked questions (FAQ)", "FAQs"]) {
      expect(parse(`## ${h}\n\n### Q?\n\nA.`).problems).toEqual([
        `body: "## ${h}" looks like the FAQ heading but is not exactly "Frequently asked questions". Rename it so the questions show as FAQ rows and reach search engines.`,
      ]);
    }
    expect(ok("## What the FAQ taught us is simple\n\ntext").faq).toEqual([]);
  });

  it("flags a second FAQ section, whose questions would otherwise be plain headings", () => {
    expect(parse(`${faq}\n\n## Frequently asked questions\n\n### Again?\n\nYes.`).problems).toEqual([
      'body: there are 2 "Frequently asked questions" sections. Merge them into one.',
    ]);
  });

  it("keeps the items of a list answer apart in the FAQ text", () => {
    const { faq: items } = ok("## Frequently asked questions\n\n### Q?\n\n- one\n- two\n\nAfter.");
    expect(items[0].answer).toBe("one\ntwo\n\nAfter.");
  });

  it("rejects an FAQ with no questions, and a question with no answer", () => {
    expect(parse("## Frequently asked questions\n\nJust text.").problems).toEqual([
      'body: "Frequently asked questions" has no questions. Write each question as a ### heading with its answer under it.',
    ]);
    expect(parse("## Frequently asked questions\n\n### Alone?").problems).toEqual([
      'body: the FAQ question "Alone?" has no answer under it.',
    ]);
  });
});

describe("images and links", () => {
  it("serves an image from the post's media folder, as a captioned figure", () => {
    const { body } = ok('![A chart of notes](notes.png "Notes per week")');
    const [figure] = elements(body, "figure");
    const [img] = elements(figure as unknown as Root, "img");
    expect(img.properties).toMatchObject({ src: "/media/insights/a-test-post/notes.png", alt: "A chart of notes", loading: "lazy" });
    expect(text(elements(figure as unknown as Root, "figcaption")[0])).toBe("Notes per week");
  });

  it("rejects an image with no alt text, a missing file, and an outside URL", () => {
    expect(parse("![](gone.png)", () => false).problems).toEqual([
      'body: image "gone.png" has no alt text. Write it as ![what the image shows](gone.png).',
      'body: image "gone.png" is not in public/media/insights/a-test-post/.',
    ]);
    expect(parse("![x](https://example.com/a.png)").problems).toEqual([
      'body: image "https://example.com/a.png" must be a file in public/media/insights/a-test-post/, written as just its name.',
    ]);
  });

  it("opens outside links in a new tab and leaves the site's own alone", () => {
    const { body } = ok("[out](https://example.com) and [in](/team) and [home](https://crosswellconsulting.com/team)");
    const [out, inside, home] = elements(body, "a");
    expect(out.properties).toMatchObject({ target: "_blank", rel: ["noopener", "noreferrer"] });
    expect(inside.properties.target).toBeUndefined();
    expect(home.properties.target).toBeUndefined();
  });
});

describe("static params", () => {
  it("builds one page per post, or the placeholder when there are none", () => {
    expect(staticParams(["a", "b"])).toEqual([{ slug: "a" }, { slug: "b" }]);
    expect(staticParams([])).toEqual([{ slug: "_none" }]);
  });
});
