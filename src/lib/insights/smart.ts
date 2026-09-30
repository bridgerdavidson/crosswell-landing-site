import { retext } from "retext";
import retextSmartypants from "retext-smartypants";

/* dashes off: a typed "--" stays two hyphens and never becomes an em dash */
const prose = retext().use(retextSmartypants, { dashes: false });

/**
 * Curl the quotes and apostrophes in a line of plain text: frontmatter
 * fields, alt text, captions, chart titles. The body gets the same curling
 * from remark-smartypants.
 */
export function smart(text: string): string {
  return String(prose.processSync(text));
}
