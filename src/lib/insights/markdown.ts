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
import { mediaPath } from "./paths";
import { smart } from "./smart";
import type { ChartSpec, FaqItem, OutlineItem } from "./types";

/* dashes off: a typed "--" stays two hyphens and never becomes an em dash */
const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkSmartypants, { dashes: false });
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
    if (node.depth === 1) {
      problems.push(`body: "# ${text}" is a top-level heading. The title comes from frontmatter; use ## for sections.`);
    }
    if (node.depth > 3) {
      problems.push(`body: "${"#".repeat(node.depth)} ${text}" is deeper than ###. Use ## for sections and ### inside them.`);
    }
    const id = slugger.slug(text);
    props(node, { id });
    if (node.depth === 2) outline.push({ id, text });
  });

  // raw HTML is never rendered, so it fails rather than vanishing
  visit(tree, "html", (node) => {
    problems.push(`body: raw HTML (${node.value.trim().slice(0, 40)}) is not allowed. Write it in Markdown.`);
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
  // a figure, its Markdown title the caption
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
    props(node, { loading: "lazy" });
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
  const start = tree.children.findIndex((n) => n.type === "heading" && n.depth === 2 && FAQ.test(toString(n).trim()));
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
        answer: answer.map((n) => toString(n)).join("\n\n").trim(),
      });
    }
    const rows = items.map(({ question, answer }) => custom("faqItem", "div", [question, ...answer], { className: ["faq-item"] }));
    tree.children.splice(start + 1, end - start - 1, custom("faq", "x-faq", [...lead, ...rows]));
  }

  if (problems.length) return { problems };
  return { value: { body: toHast.runSync(tree) as HastRoot, charts, faq, outline }, problems };
}
