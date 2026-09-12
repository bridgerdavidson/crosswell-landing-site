// Copy guard: the site's standing copy rules, enforced on a directory.
// Usage: node scripts/check-copy.mjs <dir>
// Rules: no em dash anywhere; no "brain" or "mind" in .tsx copy lines
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
];
const NOT_COPY = /^\s*import\s|\bfrom\s+"|^\s*\/\/|^\s*\/\*|^\s*\*/;
const CLASS_NAME_ATTR = /className=(?:"[^"]*"|\{[^{}]*\})/g;

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
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    const copyLine = line.replace(CLASS_NAME_ATTR, "");
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
