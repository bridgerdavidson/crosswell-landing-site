import { parsePost, type ParseContext } from "@/lib/insights/parse";
import { InsightError } from "@/lib/insights/types";
import type { Person } from "@/lib/people";

export const TEST_PEOPLE: Person[] = [
  { id: "max", name: "Max Marohn", role: "Role goes here" },
  {
    id: "sam",
    name: "Sam Tester",
    role: "Tester",
    line: "Writes the tests.",
    linkedin: "https://www.linkedin.com/in/example",
    portrait: "/team/sam.jpg",
  },
];

export const TEST_CONTEXT: ParseContext = { people: TEST_PEOPLE, mediaExists: () => true, today: "2026-09-29" };

const BASE: Record<string, string> = {
  title: "A test post",
  description: "A line for the card.",
  author: "max",
  published: "2026-09-20",
};

/** a post file: frontmatter from BASE plus fields ("" leaves a field empty), then the body */
export function source(fields: Record<string, string> = {}, body = "Body text.\n\n## A section\n\nMore text.") {
  const lines = Object.entries({ ...BASE, ...fields }).map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n${body}\n`;
}

export function makePost(
  fields: Record<string, string> = {},
  body?: string,
  ctx: Partial<ParseContext> = {},
  file = "content/insights/a-test-post.md"
) {
  return parsePost(file, source(fields, body), { ...TEST_CONTEXT, ...ctx });
}

/** the problems an InsightError carries, or [] if fn does not throw one */
export function problemsOf(fn: () => unknown): string[] {
  try {
    fn();
  } catch (e) {
    if (e instanceof InsightError) return e.problems;
    throw e;
  }
  return [];
}
