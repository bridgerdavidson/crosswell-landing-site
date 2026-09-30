import { YAMLParseError } from "yaml";

/** where the YAML came from: the hints name the markers around it */
export type YamlPlace = "frontmatter" | "chart";

/** the parser's own words: the first line of its message, without the trailing colon */
export const yamlWhat = (e: unknown) => (e as Error).message.split("\n")[0].replace(/:$/, "");

/** the line, quoted the way YAML needs it: `- "One: two"` or `title: "AI: what"` */
function quoted(line: string): string | undefined {
  if (line.includes('"')) return undefined;
  const item = line.match(/^\s*-\s+(\S.*?)\s*$/);
  if (item) return `- "${item[1]}"`;
  const field = line.match(/^\s*([A-Za-z]\w*):\s+(\S.*?)\s*$/);
  if (field) return `${field[1]}: "${field[2]}"`;
  return undefined;
}

const general = (place: YamlPlace) =>
  place === "chart"
    ? "Check the lines of the block: each one is a name, a colon, and its value."
    : "Check the lines between the --- markers: each one is a field, a colon, and its value.";

/**
 * How to fix a YAML error, read from the parser's error code rather than
 * guessed: a colon or a % in an unquoted value, an apostrophe inside single
 * quotes, a repeated name, tabs, a missing quote, and indentation only when
 * the parser says it is indentation. `lines` is the text the parser read,
 * so the hint can show the author's own line quoted.
 */
export function yamlHint(e: unknown, place: YamlPlace, lines: string[] = []): string {
  if (!(e instanceof YAMLParseError)) return general(place);
  const at = e.linePos?.[0]?.line;
  const line = at ? (lines[at - 1] ?? "") : "";
  switch (e.code) {
    case "BLOCK_AS_IMPLICIT_KEY":
      return `A value with ": " in it needs quotes, like ${quoted(line) ?? 'title: "AI: what it keeps"'}.`;
    case "BAD_SCALAR_START":
      return `A value starting with % or # needs quotes, like ${quoted(line) ?? 'unit: "%"'}.`;
    case "UNEXPECTED_TOKEN":
      if (/:\s*'/.test(line)) return `A value in single quotes cannot hold an apostrophe. Use double quotes, like title: "It's here".`;
      return general(place);
    case "DUPLICATE_KEY":
      return place === "chart" ? "A label is repeated. Each label under data appears once." : "A field is repeated. Each field appears once.";
    case "TAB_AS_INDENT":
      return "Indent with spaces, not tabs.";
    case "MISSING_CHAR":
      return /quote/.test(e.message) ? "A quoted value is missing its closing quote." : general(place);
    case "BAD_INDENT":
      if (/\]/.test(e.message)) return "A list in brackets needs its closing ], like related: [a-post, b-post].";
      return place === "chart" ? "Check the indentation: every line under data: is indented the same amount." : "Check the indentation of the lines between the --- markers.";
    default:
      return general(place);
  }
}
