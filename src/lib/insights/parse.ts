import { basename } from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import type { Person } from "@/lib/people";
import { parseBody } from "./markdown";
import { mediaPath } from "./paths";
import { smart } from "./smart";
import { InsightError, type Post } from "./types";
import { yamlHint, yamlWhat } from "./yaml";

export type ParseContext = {
  people: Person[];
  /** whether a file exists in a post's media folder */
  mediaExists: (slug: string, file: string) => boolean;
  /** today in UTC, YYYY-MM-DD */
  today: string;
};

const FIELDS = ["title", "description", "author", "published", "updated", "takeaways", "cover", "coverAlt", "related"];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
/* a real calendar day: a month of 13 is an invalid Date, and February 30
   rolls over into March, so both fail the round trip */
const isDate = (s: string) => {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

/**
 * One post file, parsed and checked against spec section 3. Throws one
 * InsightError listing every problem in the file, so an author fixes them
 * in one pass. YAML parses with the yaml package's core schema, which keeps
 * dates as the strings the author typed.
 */
export function parsePost(file: string, source: string, ctx: ParseContext): Post {
  const slug = basename(file, ".md");
  const problems: string[] = [];
  const say = (field: string, problem: string) => problems.push(`${file}: ${field}: ${problem}`);

  if (!SLUG.test(slug) || slug.length > 80) {
    say("filename", `"${slug}" is not a valid slug. Use lowercase words joined by hyphens, at most 80 characters, like what-firms-keep.md.`);
  }

  // without the --- markers gray-matter reads the whole file as the body
  // and every field is "missing"; name the real cause instead
  const src = source.replace(/^﻿/, "");
  if (!/^---[ \t]*\r?\n/.test(src)) {
    say("frontmatter", "none found. The file must start with --- on its first line, then the fields, then --- on its own line.");
    throw new InsightError(problems);
  }
  if (!/\r?\n---[ \t]*(\r?\n|$)/.test(src.slice(3))) {
    say("frontmatter", "the opening --- has no closing ---. End the fields with --- on its own line.");
    throw new InsightError(problems);
  }

  let fm: Record<string, unknown>;
  let content: string;
  try {
    const parsed = matter(src, { engines: { yaml: (s: string) => YAML.parse(s) ?? {} } });
    if (typeof parsed.data !== "object" || Array.isArray(parsed.data)) throw new Error("the frontmatter is not a list of fields");
    fm = parsed.data as Record<string, unknown>;
    content = parsed.content;
  } catch (e) {
    // the YAML's line numbers are the file's: gray-matter hands the parser
    // everything after the opening ---, starting with its line break
    throw new InsightError([`${file}: frontmatter: is not valid YAML (${yamlWhat(e)}). ${yamlHint(e, "frontmatter", source.split("\n"))}`]);
  }

  for (const key of Object.keys(fm)) {
    if (!FIELDS.includes(key)) say(key, `is not a post field. Post fields: ${FIELDS.join(", ")}.`);
  }
  const text = (key: string): string | undefined => {
    const v = fm[key];
    if (v === undefined || v === null || v === "") return undefined;
    if (typeof v !== "string") {
      say(key, "must be text.");
      return undefined;
    }
    return v.trim();
  };

  const title = text("title");
  if (!title) say("title", "is missing.");

  const description = text("description");
  if (!description) say("description", "is missing. Write one line for the index card and the share preview.");
  else if (description.length > 160) say("description", `is ${description.length} characters. Keep it to 160 or fewer.`);

  const authorId = text("author");
  const author = authorId ? ctx.people.find((p) => p.id === authorId) : undefined;
  if (!authorId) say("author", "is missing.");
  else if (!author) {
    say("author", `"${authorId}" is not in src/lib/people.ts. Known ids: ${ctx.people.map((p) => p.id).join(", ")}.`);
  }

  const published = text("published");
  if (!published) say("published", "is missing. Use today's date, YYYY-MM-DD.");
  else if (!isDate(published)) say("published", `"${published}" is not a date. Use YYYY-MM-DD.`);
  else if (published > ctx.today) {
    say(
      "published",
      `${published} is after today (${ctx.today}). The site only rebuilds on merge, so a future date does not schedule anything; use today's date.`
    );
  }

  const updated = text("updated");
  if (updated !== undefined) {
    if (!isDate(updated)) say("updated", `"${updated}" is not a date. Use YYYY-MM-DD.`);
    else if (published && isDate(published) && updated < published) say("updated", `${updated} is before published (${published}).`);
    else if (updated > ctx.today) say("updated", `${updated} is after today (${ctx.today}).`);
  }

  let takeaways: string[] = [];
  const t = fm.takeaways;
  if (t !== undefined && t !== null) {
    // "- One: two" is valid YAML, a list item holding a field, so it never
    // reaches the YAML hint; name the quote fix here
    const field = Array.isArray(t) ? t.find((x) => x && typeof x === "object" && !Array.isArray(x)) : undefined;
    if (field) {
      const [k, v] = Object.entries(field as Record<string, unknown>)[0] ?? ["", ""];
      say("takeaways", `a line with ": " in it needs quotes, like - "${k}: ${String(v ?? "")}".`);
    } else if (!Array.isArray(t) || t.some((x) => typeof x !== "string" || !x.trim())) {
      say("takeaways", "must be a list of lines, each starting with '- '.");
    } else if (t.length < 2 || t.length > 5) {
      say("takeaways", `has ${t.length} item${t.length === 1 ? "" : "s"}. Use 2 to 5, or leave takeaways out.`);
    } else {
      takeaways = t.map((x: string) => smart(x.trim()));
    }
  }

  const coverFile = text("cover");
  const coverAlt = text("coverAlt");
  let cover: Post["cover"];
  if (coverFile) {
    if (!/\.(jpe?g|png)$/i.test(coverFile)) {
      say("cover", `"${coverFile}" must be a .jpg or .png (share cards cannot read other formats).`);
    } else if (!ctx.mediaExists(slug, coverFile)) {
      say("cover", `"${coverFile}" is not in public/media/insights/${slug}/.`);
    }
    if (!coverAlt) say("coverAlt", "is required when there is a cover. Describe what the image shows.");
    cover = { file: coverFile, src: mediaPath(slug, coverFile), alt: smart(coverAlt ?? "") };
  } else if (coverAlt) {
    say("coverAlt", "is set but there is no cover.");
  }

  let related: string[] = [];
  const rel = fm.related;
  if (rel !== undefined && rel !== null) {
    if (!Array.isArray(rel) || rel.some((x) => typeof x !== "string")) {
      say("related", "must be a list of slugs, like [another-post, a-third-post].");
    } else if (rel.length > 3) {
      say("related", `lists ${rel.length} posts. Use at most 3.`);
    } else if (rel.includes(slug)) {
      say("related", "lists this post itself.");
    } else {
      related = rel as string[];
    }
  }

  const body = parseBody(content, { slug, mediaExists: (f) => ctx.mediaExists(slug, f) });
  for (const p of body.problems) problems.push(`${file}: ${p}`);

  if (problems.length || !body.value || !title || !description || !author || !published) {
    throw new InsightError(problems);
  }
  return {
    slug,
    file,
    title: smart(title),
    description: smart(description),
    author,
    published,
    updated,
    takeaways,
    cover,
    related,
    ...body.value,
  };
}
