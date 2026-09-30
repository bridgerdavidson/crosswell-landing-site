import { retext } from "retext";
import retextSmartypants from "retext-smartypants";

/* dashes off: a typed "--" stays two hyphens and never becomes an em dash */
const prose = retext().use(retextSmartypants, { dashes: false });

/*
 * smartypants reads the apostrophe that opens 'em, 'n', 'til, 'cause, 'tis,
 * 'twas, and a decade like '90s as an opening quote (‘em). It stands for
 * missing letters, so it curls the other way (’em). 'n' is matched with
 * its own closing mark, since no word boundary follows it.
 */
const CONTRACTION = /‘(?=(?:em|til|cause|tis|twas|\d0s)\b|n’)/gi;

/** the leading apostrophe of a common contraction, curled toward the missing letters */
export const curlContractions = (text: string) => text.replace(CONTRACTION, "’");

/**
 * Curl the quotes and apostrophes in a line of plain text: frontmatter
 * fields, alt text, captions, chart titles. The body gets the same curling
 * from remark-smartypants and the same contraction pass.
 */
export function smart(text: string): string {
  return curlContractions(String(prose.processSync(text)));
}
