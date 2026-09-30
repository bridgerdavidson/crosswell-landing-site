import { readFileSync } from "node:fs";
import { join } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Heading, Root, RootContent } from "mdast";
import type { Root as HastRoot } from "hast";
import { SITE } from "@/lib/site";
import { parseChart } from "./chart";
import { mediaPath, webName } from "./paths";
import { curlContractions, smart } from "./smart";
import type { ChartSpec, FaqItem, OutlineItem } from "./types";

/* after smartypants, the apostrophe that opens a contraction ('em, 'til)
   curls toward its missing letters; text nodes only, so code is untouched */
const contractions = () => (tree: Root) => {
  visit(tree, "text", (node) => {
    node.value = curlContractions(node.value);
  });
};

/* dashes off: a typed "--" stays two hyphens and never becomes an em dash */
const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkSmartypants, { dashes: false }).use(contractions);
const toHast = unified().use(remarkRehype);

export type BodyContext = {
  slug: string;
  /** whether a file exists in the post's media folder */
  mediaExists: (file: string) => boolean;
};

export type Body = { body: HastRoot; charts: ChartSpec[]; faq: FaqItem[]; outline: OutlineItem[] };

type HData = { hName?: string; hProperties?: Record<string, unknown> };

/** add properties to the element remark-rehype makes from an mdast node */
function props(node: { data?: unknown }, add: Record<string, unknown>) {
  const data = (node.data ?? {}) as HData;
  node.data = { ...data, hProperties: { ...(data.hProperties ?? {}), ...add } } as never;
}

/** a node remark-rehype turns into the element named by hName */
const custom = (type: string, hName: string, children: unknown[], hProperties: Record<string, unknown> = {}) =>
  ({ type, data: { hName, hProperties }, children }) as unknown as RootContent;

const FAQ = /^frequently asked questions$/i;
/** the FAQ heading with decoration: "FAQ", "FAQs", a trailing colon, "(FAQ)" after it */
const faqLike = (text: string) =>
  /^(faqs?|frequently asked questions?)$/.test(
    text.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z]+/g, " ").trim()
  );

/** a node's text for the FAQPage answer: list items on their own lines */
const plain = (n: RootContent): string => (n.type === "list" ? n.children.map((li) => toString(li)).join("\n") : toString(n));

/* --- images --- */

/** where posts' images live: the same rule as load.ts's mediaRoot, which
    cannot be imported here without a cycle (load imports parse imports this) */
const mediaRoot = () => process.env.INSIGHTS_MEDIA_DIR ?? join("public", "media", "insights");

/**
 * An image file's pixel size from its header: a PNG's IHDR, or a JPEG's
 * first frame marker (SOF0 to SOF15, skipping the tables and the segments
 * that are not frames). Undefined when the file is missing or is neither,
 * so a post never fails over its picture's size; it just ships without one.
 */
export function imageSize(path: string): { width: number; height: number } | undefined {
  let b: Buffer;
  try {
    b = readFileSync(path);
  } catch {
    return undefined;
  }
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47 && b.toString("ascii", 12, 16) === "IHDR") {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.length >= 4 && b.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return undefined;
      const marker = b[i + 1];
      if (marker === 0xff) {
        i += 1;
        continue;
      }
      const frame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (frame) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      if (marker === 0xd9 || marker === 0xda) return undefined;
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return undefined;
}

/**
 * A post's Markdown body, transformed and checked (spec section 4): curled
 * text, an id on every heading from one slugger (so a repeated heading gets
 * its own and the outline cannot disagree with the page), chart blocks as
 * chart elements, the FAQ's questions wrapped as rows, images resolved into
 * the post's media folder, outside links opening in a new tab. Returns the
 * hast tree and what the page needs beside it, or every problem.
 */
export function parseBody(source: string, ctx: BodyContext): { value?: Body; problems: string[] } {
  const problems: string[] = [];
  const tree = markdown.runSync(markdown.parse(source)) as Root;

  const slugger = new GithubSlugger();
  const outline: OutlineItem[] = [];
  visit(tree, "heading", (node) => {
    const text = toString(node);
    // a stray "## " would publish an empty heading and an empty outline link
    if (!text.trim()) {
      problems.push("body: a heading has no text. Write the heading or remove its # marks.");
      return;
    }
    if (node.depth === 1) {
      problems.push(`body: "# ${text}" is a top-level heading. The title comes from frontmatter; use ## for sections.`);
    }
    if (node.depth > 3) {
      problems.push(`body: "${"#".repeat(node.depth)} ${text}" is deeper than ###. Use ## for sections and ### inside them.`);
    }
    // "## FAQ" or a trailing colon would quietly leave the questions as
    // plain headings, with no rows and no FAQPage
    if (node.depth === 2 && !FAQ.test(text.trim()) && faqLike(text)) {
      problems.push(
        `body: "## ${text}" looks like the FAQ heading but is not exactly "Frequently asked questions". Rename it so the questions show as FAQ rows and reach search engines.`
      );
    }
    const id = slugger.slug(text);
    if (!id) {
      problems.push(`body: the heading "${text}" has no letters or digits, so it cannot get an id for the outline. Add a word to it.`);
      return;
    }
    props(node, { id });
    if (node.depth === 2) outline.push({ id, text });
  });

  // raw HTML is never rendered, so it fails rather than vanishing
  visit(tree, "html", (node) => {
    problems.push(`body: raw HTML (${node.value.trim().slice(0, 40)}) is not allowed. Write it in Markdown.`);
  });

  // Obsidian's own syntax is plain text to Markdown, so a callout, wiki
  // link, embed, comment, or highlight left in a note would print as typed
  const vault: [RegExp, string, string][] = [
    [/!\[\[[^\]]*\]\]/, "embed", `Write ![what the image shows](<file>) with the file in public/media/insights/${ctx.slug}/.`],
    [/\[\[[^\]]*\]\]/, "wiki link", "Write plain text, or a Markdown link to a page on the site."],
    [/^\[!\w+\]/, "callout", "Remove it, or make it a paragraph."],
    [/%%[\s\S]*?%%/, "comment", "Remove it."],
    [/==[^=\n]+==/, "highlight", "Use *emphasis* or plain text."],
  ];
  visit(tree, "text", (node) => {
    for (const [re, thing, fix] of vault) {
      const found = node.value.match(re)?.[0];
      if (!found) continue;
      problems.push(`body: "${found}" is an Obsidian ${thing}, which the site would print as typed. ${fix.replace("<file>", found.slice(3, -2))}`);
      return;
    }
    // an image whose file name has spaces (every macOS screenshot) never
    // parses as an image, so it too would print as typed
    const spaced = node.value.match(/!\[([^\]]*)\]\(([^)<>]*\s[^)<>]*)\)/);
    if (spaced) {
      const name = webName(spaced[2]);
      problems.push(
        `body: image "${spaced[2]}" has spaces in its file name, so Markdown reads the line as text. Rename the file ${name} and write ![${spaced[1]}](${name}).`
      );
    }
  });

  // a hard break (two trailing spaces, or a backslash) is nearly always
  // pasted by accident, and breaks the paragraph mid-sentence on the page
  visit(tree, "break", (_node, _index, parent) => {
    const where = (parent?.children ?? []).map((c) => (c.type === "break" ? " " : toString(c))).join("").trim().slice(0, 40);
    problems.push(`body: a line ends with two spaces or a backslash, which forces a line break inside "${where}". Remove them, or start a new paragraph.`);
  });

  // a checklist from a note would show disabled checkboxes on the page;
  // one problem per list, quoting its first checkbox item
  visit(tree, "list", (node) => {
    const item = node.children.find((li) => li.checked !== null && li.checked !== undefined);
    if (!item) return;
    problems.push(`body: "- [${item.checked ? "x" : " "}] ${toString(item).slice(0, 40)}" is a task list, which would show a checkbox on the page. Write a plain list.`);
  });

  // a chart block becomes an element the renderer draws; dataChart is its
  // place in charts
  const charts: ChartSpec[] = [];
  let seen = 0;
  visit(tree, "code", (node, index, parent) => {
    if (node.lang !== "chart" || !parent || index === undefined) return;
    seen += 1;
    const title = node.value.match(/^title:\s*(.+)$/m)?.[1]?.trim();
    const label = `chart ${seen}${title ? ` ("${title}")` : ""}`;
    const { chart, problems: found } = parseChart(node.value);
    for (const p of found) problems.push(`${label}: ${p}`);
    if (chart) charts.push(chart);
    parent.children[index] = custom("chart", "x-chart", [], { dataChart: charts.length - 1 }) as never;
  });

  // images come from the post's media folder; one alone in a paragraph is
  // a figure, its Markdown title the caption. Each carries its width and
  // height, read from the file at build, so the page reserves its space and
  // the text does not jump as it lazy-loads.
  visit(tree, "image", (node) => {
    const file = node.url;
    if (/^([a-z]+:)?\/\//i.test(file) || file.startsWith("/")) {
      problems.push(`body: image "${file}" must be a file in public/media/insights/${ctx.slug}/, written as just its name.`);
      return;
    }
    if (!node.alt?.trim()) {
      problems.push(`body: image "${file}" has no alt text. Write it as ![what the image shows](${file}).`);
    }
    if (!ctx.mediaExists(file)) problems.push(`body: image "${file}" is not in public/media/insights/${ctx.slug}/.`);
    node.url = mediaPath(ctx.slug, file);
    if (node.alt) node.alt = smart(node.alt);
    props(node, { loading: "lazy", ...imageSize(join(mediaRoot(), ctx.slug, file)) });
  });
  visit(tree, "paragraph", (node, index, parent) => {
    const only = node.children[0];
    if (!parent || index === undefined || node.children.length !== 1 || only.type !== "image") return;
    const caption = only.title ? [custom("caption", "figcaption", [{ type: "text", value: smart(only.title) }])] : [];
    only.title = null;
    parent.children[index] = custom("figure", "figure", [only, ...caption]) as never;
  });

  // links out of the site open in a new tab
  visit(tree, "link", (node) => {
    if (/^https?:\/\//.test(node.url) && !node.url.startsWith(SITE)) {
      props(node, { target: "_blank", rel: ["noopener", "noreferrer"] });
    }
  });

  // the FAQ: every ### under "## Frequently asked questions" is a question,
  // up to the next ## section
  const faq: FaqItem[] = [];
  const isFaq = (n: RootContent) => n.type === "heading" && n.depth === 2 && FAQ.test(toString(n).trim());
  const sections = tree.children.filter(isFaq).length;
  if (sections > 1) problems.push(`body: there are ${sections} "Frequently asked questions" sections. Merge them into one.`);
  const start = tree.children.findIndex(isFaq);
  if (start !== -1) {
    const next = tree.children.findIndex((n, i) => i > start && n.type === "heading" && n.depth <= 2);
    const end = next === -1 ? tree.children.length : next;
    const lead: RootContent[] = [];
    const items: { question: Heading; answer: RootContent[] }[] = [];
    for (const n of tree.children.slice(start + 1, end)) {
      if (n.type === "heading" && n.depth === 3) items.push({ question: n, answer: [] });
      else if (items.length) items[items.length - 1].answer.push(n);
      else lead.push(n);
    }
    if (!items.length) {
      problems.push('body: "Frequently asked questions" has no questions. Write each question as a ### heading with its answer under it.');
    }
    for (const { question, answer } of items) {
      if (!answer.length) problems.push(`body: the FAQ question "${toString(question)}" has no answer under it.`);
      faq.push({
        id: String((question.data as HData | undefined)?.hProperties?.id ?? ""),
        question: toString(question),
        answer: answer.map(plain).join("\n\n").trim(),
      });
    }
    const rows = items.map(({ question, answer }) => custom("faqItem", "div", [question, ...answer], { className: ["faq-item"] }));
    tree.children.splice(start + 1, end - start - 1, custom("faq", "x-faq", [...lead, ...rows]));
  }

  if (problems.length) return { problems };
  return { value: { body: toHast.runSync(tree) as HastRoot, charts, faq, outline }, problems };
}
