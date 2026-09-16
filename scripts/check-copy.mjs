// Copy guard: the site's standing copy rules, enforced on a directory.
// Usage: node scripts/check-copy.mjs <dir>
// Rules: no em dash anywhere; no "brain" or "mind" in .tsx copy lines; the
// site’s apostrophe is typographic (’), so a straight one between letters
// in copy is a hit, as is an &apos; entity
// (import and comment lines are skipped whole; className attribute regions
// are stripped out of a line before the copy-scope rules run against it,
// rather than skipping the whole line, so a live `<p className="...">Copy</p>`
// one-liner is still checked; the brain map's own component folder is
// skipped because its files are named for it); no uppercase utility or
// text-transform anywhere.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2] ?? "src";
const SKIP_COPY_DIRS = [join("src", "components", "brain") + sep];
const rules = [
  { name: "em dash", re: /\u2014/, scope: "all" },
  { name: "the word brain", re: /\bbrain\b/i, scope: "copy" },
  { name: "the word mind", re: /\bmind\b/i, scope: "copy" },
  { name: "uppercase", re: /\buppercase\b|text-transform:\s*uppercase/, scope: "all" },
  { name: "straight apostrophe", re: /(?<=[A-Za-z])'(?=[A-Za-z])|&apos;|&#39;/, scope: "copy" },
];
const NOT_COPY = /^\s*import\s|\bfrom\s+"|^\s*\/\/|^\s*\/\*|^\s*\*/;

// A single-level regex (`\{[^{}]*\}`) can't find the matching close brace
// when the className expression itself contains braces (template-literal
// `${...}` interpolation, object literals), so walk brace depth instead.
function stripClassNameAttrs(line) {
  let out = "";
  let i = 0;
  while (i < line.length) {
    const at = line.indexOf("className=", i);
    if (at === -1) {
      out += line.slice(i);
      break;
    }
    out += line.slice(i, at);
    let j = at + "className=".length;
    if (line[j] === '"') {
      const end = line.indexOf('"', j + 1);
      j = end === -1 ? line.length : end + 1;
    } else if (line[j] === "{") {
      let depth = 0;
      for (; j < line.length; j++) {
        if (line[j] === "{") depth++;
        else if (line[j] === "}" && --depth === 0) {
          j++;
          break;
        }
      }
    }
    i = j;
  }
  return out;
}

// Comments are not copy, wherever they sit: a `//` to the end of the line,
// and a `/* ... */` region, which in markup ({/* ... */}) can share a line
// with copy and can run over several lines without a `*` down its margin.
// Strip those regions from the copy line and report whether the line leaves
// a block open.
function stripComments(line, open) {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (open) {
      const close = line.indexOf("*/", i);
      if (close === -1) return { line: out, open: true };
      i = close + 2;
      open = false;
      continue;
    }
    if (line.startsWith("/*", i)) {
      open = true;
      i += 2;
      continue;
    }
    // a line comment, but not the // of a URL
    if (line.startsWith("//", i) && line[i - 1] !== ":") return { line: out, open: false };
    out += line[i];
    i += 1;
  }
  return { line: out, open };
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css|mjs)$/.test(name)) acc.push(p);
  }
  return acc;
}

const hits = [];
for (const file of walk(root)) {
  const rel = relative(process.cwd(), file);
  const isTsx = file.endsWith(".tsx");
  const skipCopy = SKIP_COPY_DIRS.some((d) => rel.startsWith(d));
  let open = false;
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    const stripped = stripComments(stripClassNameAttrs(line), open);
    const copyLine = stripped.line;
    open = stripped.open;
    for (const rule of rules) {
      if (rule.scope === "copy") {
        if (!isTsx || skipCopy || NOT_COPY.test(line)) continue;
        if (rule.re.test(copyLine)) hits.push(`${rel}:${i + 1}: ${rule.name}`);
      } else if (rule.re.test(line)) {
        hits.push(`${rel}:${i + 1}: ${rule.name}`);
      }
    }
  });
}

if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log(`copy guard: clean (${root})`);
