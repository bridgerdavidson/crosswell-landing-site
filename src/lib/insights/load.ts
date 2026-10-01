import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PEOPLE } from "@/lib/people";
import { parsePost, type ParseContext } from "./parse";
import { InsightError, type Post } from "./types";

/** where posts live; the e2e build points it at the test fixtures */
export const contentDir = () => process.env.INSIGHTS_DIR ?? join("content", "insights");

/** where posts' images live; the script tests point it at the fixtures' media */
export const mediaRoot = () => process.env.INSIGHTS_MEDIA_DIR ?? join("public", "media", "insights");

/** a folder's post files: top-level .md files, except README.md and anything starting with _ */
export function postFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".md") && e.name !== "README.md" && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort();
}

/**
 * Whether a media file exists under the name the post uses, letter for
 * letter: existsSync forgives case on macOS, and a cover.jpg that passed
 * here as Cover.jpg is missing on the Linux build.
 */
export function mediaFileExists(slug: string, file: string): boolean {
  const folder = join(mediaRoot(), slug);
  if (!existsSync(folder)) return false;
  return readdirSync(folder).includes(file);
}

/**
 * Every post in a folder, parsed and checked, newest first (ties by slug).
 * Throws one InsightError listing every problem in every file. Filenames are
 * the slugs, so the file system already rules out duplicates.
 */
export function loadPosts(dir = contentDir(), ctx: Partial<ParseContext> = {}): Post[] {
  const context: ParseContext = {
    people: ctx.people ?? PEOPLE,
    mediaExists: ctx.mediaExists ?? mediaFileExists,
    today: ctx.today ?? new Date().toISOString().slice(0, 10),
  };
  const problems: string[] = [];
  const posts: Post[] = [];
  for (const name of postFiles(dir)) {
    const file = join(dir, name);
    try {
      posts.push(parsePost(file, readFileSync(file, "utf8"), context));
    } catch (e) {
      if (e instanceof InsightError) problems.push(...e.problems);
      else throw e;
    }
  }
  const slugs = new Set(posts.map((p) => p.slug));
  for (const post of posts) {
    for (const r of post.related) if (!slugs.has(r)) problems.push(`${post.file}: related: "${r}" is not a published post.`);
  }
  if (problems.length) throw new InsightError(problems);
  return posts.sort((a, b) =>
    a.published === b.published ? a.slug.localeCompare(b.slug) : a.published < b.published ? 1 : -1
  );
}

let cache: { dir: string; posts: Post[] } | undefined;

/**
 * Every post, newest first. Cached for a build, which asks many times; never
 * cached in development, so a post edited during a local preview shows on
 * the next refresh.
 */
export function getAllPosts(): Post[] {
  const dir = contentDir();
  if (process.env.NODE_ENV === "development") return loadPosts(dir);
  if (!cache || cache.dir !== dir) cache = { dir, posts: loadPosts(dir) };
  return cache.posts;
}

export const getPost = (slug: string): Post | undefined => getAllPosts().find((p) => p.slug === slug);
