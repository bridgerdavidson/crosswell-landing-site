# General-Market Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the plumbing and the finished-state (no-JS) build of the general-market redesign, so the design loop can then judge and animate visuals on a page whose words and structure are already right.

**Architecture:** A static Next.js App Router site. This plan swaps every section's copy to Max's Gen 6 handoff, removes the Security section and the GSAP dashboard tour, and adds a product run of six dashboard chapters, each rendered from one fictional dataset (`src/lib/saguaro.ts`) as a server-rendered finished state inside a shared masked frame. Choreography, scroll-driving, and interaction are deliberately NOT in this plan; the design loop (spec section 11) builds those piece by piece on top of the finished states this plan ships.

**Tech Stack:** Next 15 (static export), React 19, Tailwind v4, TypeScript, next/font (Instrument Sans + Newsreader). Tests: vitest (unit) and Playwright via vitest (e2e against the built `out/`).

**Spec:** `docs/superpowers/specs/2026-09-12-general-market-redesign-design.md`

## Global Constraints

Copied from the spec. Every task's requirements include these.

- No em dashes anywhere in `src/` (copy, comments, data).
- "agentic AI" is defined in plain words on first use per page: "AI that does the work, not just answers questions".
- Write "the Core", never bare "Core", except inside "Crosswell Core".
- No "brain" or "mind" in body copy.
- No uppercase text anywhere: no `uppercase` utility, no `text-transform: uppercase`.
- No pricing, no client, advisor, or competitor names, no ship dates, no "beta", no number without its printed source, no logos (tool names in plain text).
- No security, compliance, or hosting claims of any kind.
- Inside a product frame, text is only what the product would show its own user. Nothing inside a frame addresses the website visitor. Captions and claims live outside the frame.
- Fragments use only the Fern palette tokens already in `globals.css`; chapter 06's alternate brand colors are CSS variables scoped to that fragment's root.
- No shadows in or around fragments.
- Mask gradients are always written with double stops (`#000 0%, #000 74%`), never a single stop.
- Fragments render at real product scale and are cut by the frame; nothing is scaled down. Below 768px a frame crops to a single column.
- Conventional commits; every commit ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Work on `redesign/general-market`; never push to `main`.
- Verify at 1440, 1728, and 390 before calling a visual task done.

## What this plan does not do

Chapter choreography (count-ups, streaming, the agenda scrub, the pipeline deal-in, the agents ticker, the brand cycle), the Replay control, the Instrument Sans vs Geist side-by-side, and visual polish all belong to the design-loop runs in spec section 11. This plan ships every chapter's finished state so those runs have something real to judge.

---

## File structure

**Created**

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner config, `@/` alias |
| `tests/helpers/serve.ts` | Serves `out/` on an ephemeral port for e2e |
| `tests/helpers/browser.ts` | One-call Playwright page helper |
| `tests/unit/copy-guard.test.ts` | Proves the copy guard catches violations |
| `tests/unit/saguaro.test.ts` | Cross-chapter consistency of the dataset |
| `tests/e2e/site.test.ts` | DOM assertions against the built site (grows per task) |
| `tests/fixtures/copy-bad/bad.tsx`, `tests/fixtures/copy-good/good.tsx` | Guard fixtures |
| `scripts/check-copy.mjs` | The copy guard (em dash, brain, mind, uppercase) |
| `scripts/og-image.mjs` | Renders `public/og-image.jpg` at 1200 by 630 |
| `src/lib/saguaro.ts` | The one fictional dataset every chapter reads |
| `src/components/product/shared/Frame.tsx` | The masked, cropping frame and the product shell |
| `src/components/product/shared/Rail.tsx` | The icon rail |
| `src/components/product/shared/TopBar.tsx` | Company name and user initials bar |
| `src/components/product/shared/Tile.tsx` | Number tile with optional sparkline |
| `src/components/product/shared/Chip.tsx` | `Chip`, `Receipt`, `Dot` |
| `src/components/product/shared/SendButton.tsx` | The round send control |
| `src/components/product/shared/Chapter.tsx` | Label, claim, body, frame slot, demo caption |
| `src/components/product/shared/index.ts` | Barrel |
| `src/components/product/today/Today.tsx` | Chapter 01 |
| `src/components/product/agenda/Agenda.tsx` | Chapter 02 |
| `src/components/product/chat/Chat.tsx` | Chapter 03 (full-bleed dark section) |
| `src/components/product/pipeline/Pipeline.tsx` | Chapter 04 |
| `src/components/product/agents/Agents.tsx` | Chapter 05 |
| `src/components/product/brand/Brand.tsx` | Chapter 06 |
| `src/components/product/ProductRun.tsx` | Assembles the run, the intro, the fictional line, the bridge line |
| `src/components/Stats.tsx` | The two-chip stats band (replaces ProblemBand) |
| `src/components/Values.tsx` | Vision line and the three values |
| `src/components/Insights.tsx` | The held Insights slot |
| `src/app/robots.ts`, `src/app/sitemap.ts` | Crawl hygiene |
| `public/og-image.jpg` | Social card |
| `docs/design-system.md` | The design loop's system-critic reference |

**Modified**

| File | Change |
|---|---|
| `package.json` | vitest, playwright dev deps; `test`, `test:e2e`, `check:copy`, `og` scripts |
| `src/app/layout.tsx` | Instrument Sans, metadata, JSON-LD |
| `src/app/globals.css` | font var, `type-label`, product CSS, dead blocks removed |
| `src/app/page.tsx` | New section order |
| `src/components/Nav.tsx` | Links and link styling |
| `src/components/Hero.tsx` | Headline, static subline, no fund line |
| `src/components/WhoItsFor.tsx` | Static industries row, Gen 6 copy |
| `src/components/Edge.tsx`, `TimeBack.tsx`, `HowWeStart.tsx`, `BeyondCore.tsx`, `Team.tsx`, `Footer.tsx` | Copy |
| `src/components/brain/BrainSection.tsx` | Label class, sentence-case "Illustrative" |
| `README.md`, `CLAUDE.md` | Page order, fonts, GSAP note |

**Deleted**

`src/components/Trust.tsx`, `src/components/TrustDiagram.tsx`, `src/components/HowItWorks.tsx`, `src/components/ProblemBand.tsx`, `src/components/core-dashboard/` (six files).

---

### Task 1: Test tooling and the copy guard

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `tests/helpers/serve.ts`, `tests/helpers/browser.ts`, `tests/e2e/site.test.ts`, `scripts/check-copy.mjs`, `tests/unit/copy-guard.test.ts`, `tests/fixtures/copy-bad/bad.tsx`, `tests/fixtures/copy-good/good.tsx`

**Interfaces:**
- Produces: `serveOut(dir?: string): Promise<{ url: string; close(): void }>`; `withPage<T>(fn: (page: Page) => Promise<T>, opts?: { width?: number; reducedMotion?: boolean; js?: boolean }): Promise<T>`; `node scripts/check-copy.mjs <dir>` exits 1 on any violation and prints `file:line: rule`.

- [ ] **Step 1: Install dev dependencies and add scripts**

```bash
npm install -D vitest@^3 playwright@^1.50
```

Edit `package.json` `scripts` to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run tests/unit",
  "test:e2e": "next build && vitest run tests/e2e",
  "check:copy": "node scripts/check-copy.mjs src",
  "og": "node scripts/og-image.mjs"
}
```

- [ ] **Step 2: Write the vitest config**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    testTimeout: 90_000,
    hookTimeout: 90_000,
  },
});
```

- [ ] **Step 3: Write the e2e helpers**

`tests/helpers/serve.ts`:

```ts
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

/** Serve a static export directory the way Vercel serves it (cleanUrls). */
export async function serveOut(dir = "out") {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    let file = join(dir, decodeURIComponent(url.pathname));
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    } catch {
      if (!extname(file)) file += ".html";
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  return { url: `http://127.0.0.1:${port}`, close: () => server.close() };
}
```

`tests/helpers/browser.ts`:

```ts
import { chromium, type Page } from "playwright";

type Opts = { width?: number; reducedMotion?: boolean; js?: boolean };

/** Open one page in a fresh Chromium, run fn, always close. */
export async function withPage<T>(fn: (page: Page) => Promise<T>, opts: Opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: opts.width ?? 1440, height: 900 },
    javaScriptEnabled: opts.js ?? true,
    reducedMotion: opts.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}
```

- [ ] **Step 4: Write the e2e smoke test**

`tests/e2e/site.test.ts`:

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveOut } from "../helpers/serve";
import { withPage } from "../helpers/browser";

let site: Awaited<ReturnType<typeof serveOut>>;

beforeAll(async () => {
  site = await serveOut();
});
afterAll(() => site.close());

describe("smoke", () => {
  it("serves the home page", async () => {
    const title = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.title();
    });
    expect(title).toContain("Crosswell");
  });
});
```

- [ ] **Step 5: Run the e2e smoke test (needs a build)**

Run: `npm run test:e2e`
Expected: 1 passed. If Chromium fails to launch because the installed playwright version wants a newer browser build, run `npx playwright install chromium` once and retry.

- [ ] **Step 6: Write the failing copy-guard test and fixtures**

`tests/fixtures/copy-bad/bad.tsx`:

```tsx
export default function Bad() {
  return (
    <p className="uppercase">
      Your firm&apos;s brain {"\u2014"} the mind of the business.
    </p>
  );
}
```

`tests/fixtures/copy-good/good.tsx`:

```tsx
export default function Good() {
  return <p className="text-sm">The Core remembers. Every meeting, decision, and deal.</p>;
}
```

`tests/unit/copy-guard.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

function guard(dir: string) {
  return spawnSync("node", ["scripts/check-copy.mjs", dir], { encoding: "utf8" });
}

describe("copy guard", () => {
  it("fails on an em dash, brain, mind, and uppercase", () => {
    const r = guard("tests/fixtures/copy-bad");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/em dash/);
    expect(r.stderr).toMatch(/brain/);
    expect(r.stderr).toMatch(/mind/);
    expect(r.stderr).toMatch(/uppercase/);
  });

  it("passes clean copy", () => {
    const r = guard("tests/fixtures/copy-good");
    expect(r.status).toBe(0);
  });
});
```

- [ ] **Step 7: Run the unit test to verify it fails**

Run: `npm test`
Expected: FAIL, `scripts/check-copy.mjs` not found (status null or non-1).

- [ ] **Step 8: Write the copy guard**

`scripts/check-copy.mjs`:

```js
// Copy guard: the site's standing copy rules, enforced on a directory.
// Usage: node scripts/check-copy.mjs <dir>
// Rules: no em dash anywhere; no "brain" or "mind" in .tsx copy lines
// (className, import, and comment lines are skipped, and the brain map's
// own component folder is skipped because its files are named for it);
// no uppercase utility or text-transform anywhere.
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
const NOT_COPY = /className=|^\s*import\s|\bfrom\s+"|^\s*\/\/|^\s*\/\*|^\s*\*/;

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
    for (const rule of rules) {
      if (rule.scope === "copy" && (!isTsx || skipCopy || NOT_COPY.test(line))) continue;
      if (rule.re.test(line)) hits.push(`${rel}:${i + 1}: ${rule.name}`);
    }
  });
}

if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log(`copy guard: clean (${root})`);
```

- [ ] **Step 9: Run the unit tests to verify they pass**

Run: `npm test`
Expected: 2 passed.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests scripts/check-copy.mjs
git commit -m "chore: add vitest, an e2e harness against the static export, and the copy guard

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Remove the Security section, the dashboard tour, and their CSS

**Files:**
- Delete: `src/components/Trust.tsx`, `src/components/TrustDiagram.tsx`, `src/components/HowItWorks.tsx`, `src/components/core-dashboard/` (all six files)
- Modify: `src/app/globals.css`, `src/app/page.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces: a page with no `#security` section and no `.cwd-frame`; `page.tsx` temporarily has no "How it works" section (Task 13 restores it).

- [ ] **Step 1: Append the failing e2e test**

Append to `tests/e2e/site.test.ts`:

```ts
describe("removals", () => {
  it("has no Security section and no dashboard tour", async () => {
    const counts = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        security: await page.locator("#security").count(),
        tour: await page.locator(".cwd-frame").count(),
        diagram: await page.locator(".trust-diagram").count(),
      };
    });
    expect(counts).toEqual({ security: 0, tour: 0, diagram: 0 });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL on `security: 1`.

- [ ] **Step 3: Delete the files**

```bash
git rm src/components/Trust.tsx src/components/TrustDiagram.tsx src/components/HowItWorks.tsx
git rm -r src/components/core-dashboard
```

- [ ] **Step 4: Remove the dead CSS blocks**

Run this once; it deletes four blocks by their comment markers and leaves everything else byte-identical:

```bash
python3 - <<'PY'
p = "src/app/globals.css"
s = open(p).read()

def cut(s, start, end):
    a = s.index(start)
    b = s.index(end, a)
    return s[:a] + s[b:]

# 1. the tour frame pre-hide + its reduced-motion block, and the chat demo
s = cut(s, "/* Core dashboard frame: hide before paint", "/* ---------- Hero: the rotating woven core ---------- */")
# 2. the secured-route diagram
s = cut(s, "/* ---------- Trust section: the secured route ----------", "/* ---------- Marquee of audiences ---------- */")
# 3. the marquee
s = cut(s, "/* ---------- Marquee of audiences ---------- */", "/* Behind the chat: the brain map (v3 soft drop) */")
# 4. the tour's mobile Replay hit box
s = cut(s, "/* phones: pad the dashboard Replay hit box", "/* the two-line burger that morphs into an X */")
open(p, "w").write(s)
print("ok")
PY
grep -nE 'cwd-|td-|chat-caret|chat-dot|drift-slow|trust-diagram' src/app/globals.css || echo "no dead CSS left"
```

- [ ] **Step 5: Update page.tsx**

Replace `src/app/page.tsx` with:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemBand from "@/components/ProblemBand";
import HowWeStart from "@/components/HowWeStart";
import BrainSection from "@/components/brain/BrainSection";
import Edge from "@/components/Edge";
import BeyondCore from "@/components/BeyondCore";
import WhoItsFor from "@/components/WhoItsFor";
import TimeBack from "@/components/TimeBack";
import Team from "@/components/Team";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProblemBand />
      <BrainSection />
      <Edge />
      <TimeBack />
      <HowWeStart />
      <BeyondCore />
      <WhoItsFor />
      <Team />
      <FinalCta />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 6: Build and run e2e**

Run: `npm run test:e2e`
Expected: build succeeds; `removals` passes. (The `WhoItsFor` marquee still renders until Task 13 rewrites that section; its `.drift-slow` class is gone from the CSS, so it sits still. That is expected here.)

- [ ] **Step 7: Commit**

```bash
git add -A src/app/globals.css src/app/page.tsx src/components tests/e2e/site.test.ts
git commit -m "feat: remove the Security section, the dashboard tour, and their CSS

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Instrument Sans and the sentence-case label

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, every component using `type-kicker` (`Hero.tsx`, `Edge.tsx`, `TimeBack.tsx`, `BeyondCore.tsx`, `HowWeStart.tsx`, `Team.tsx`, `brain/BrainSection.tsx`), `ProblemBand.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces: CSS classes `type-label` (sentence-case section label) and `type-label-index` (tabular two-digit prefix); body font resolves to Instrument Sans; the `type-kicker` class no longer exists.

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("type", () => {
  it("uses Instrument Sans and no uppercase text", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(() => ({
        font: getComputedStyle(document.body).fontFamily,
        uppercase: [...document.querySelectorAll("header *, main *, footer *")].filter(
          (el) => getComputedStyle(el).textTransform === "uppercase"
        ).length,
        kicker: document.querySelectorAll(".type-kicker").length,
      }));
    });
    expect(r.font).toMatch(/Instrument Sans/);
    expect(r.uppercase).toBe(0);
    expect(r.kicker).toBe(0);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, font is Schibsted, uppercase count > 0.

- [ ] **Step 3: Swap the font in layout.tsx**

In `src/app/layout.tsx` replace the import and the font const:

```tsx
import { Newsreader, Instrument_Sans } from "next/font/google";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
```

and the `<html>` className:

```tsx
className={`${instrument.variable} ${newsreader.variable}`}
```

- [ ] **Step 4: Update globals.css**

Change the theme font line:

```css
--font-sans: var(--font-instrument), system-ui, sans-serif;
```

Replace the whole `.type-kicker { ... }` block with:

```css
.type-label {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

/* the two-digit chapter prefix in the product run */
.type-label-index {
  font-variant-numeric: tabular-nums;
  margin-right: 0.5em;
  color: var(--color-warmgray);
}
```

- [ ] **Step 5: Rename every usage and fix the two stray uppercase labels**

```bash
grep -rl 'type-kicker' src | xargs sed -i '' 's/type-kicker/type-label/g'
grep -rn 'uppercase' src
```

Then edit the two hits by hand:

`src/components/ProblemBand.tsx`, the source line: replace `text-[11px] uppercase tracking-[0.14em] text-warmgray` with `text-xs text-warmgray`.

`src/components/brain/BrainSection.tsx`, the Illustrative line: replace `mt-6 text-[11px] uppercase tracking-[0.14em] text-warmgray` with `mt-6 text-xs text-warmgray`.

`src/components/Nav.tsx` still carries `uppercase tracking-[0.15em]` on its links; leave it for Task 4, but the e2e test in this task will not pass until Task 4 lands. Run the type test after Task 4 (Step 6 below is "build passes").

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: succeeds. `grep -rn 'type-kicker' src` prints nothing.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/components tests/e2e/site.test.ts
git commit -m "feat: Instrument Sans and a sentence-case section label replace the tracked kicker

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Nav links and link styling

**Files:**
- Modify: `src/components/Nav.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces: nav links in order How it works, Why Crosswell, How we start, Team, Insights, targeting `#how-it-works`, `#why-crosswell`, `#how-we-start`, `#team`, `#insights`.

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("nav", () => {
  it("lists the five links, sentence case", async () => {
    const labels = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.locator("header nav a").allTextContents();
    });
    expect(labels).toEqual(["How it works", "Why Crosswell", "How we start", "Team", "Insights"]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, labels include "Security".

- [ ] **Step 3: Edit Nav.tsx**

Replace the `links` array:

```tsx
const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-crosswell", label: "Why Crosswell" },
  { href: "#how-we-start", label: "How we start" },
  { href: "#team", label: "Team" },
  { href: "#insights", label: "Insights" },
];
```

Replace the desktop link className (the long string beginning `relative text-xs font-medium uppercase tracking-[0.15em]`) with:

```tsx
className="relative text-[15px] font-medium text-ink/75 transition-colors duration-200 hover:text-ink after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-fern after:transition-transform after:duration-300 hover:after:scale-x-100"
```

- [ ] **Step 4: Run e2e**

Run: `npm run test:e2e`
Expected: `nav` and `type` both pass (the `type` test from Task 3 goes green here).

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx tests/e2e/site.test.ts
git commit -m "feat: nav links for the new page, sentence case

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: The Saguaro dataset

**Files:**
- Create: `src/lib/saguaro.ts`
- Test: `tests/unit/saguaro.test.ts`

**Interfaces:**
- Produces (all named exports, read by every chapter):
  - `company: { name: string; user: { name: string; initials: string; role: string } }`
  - `today: { greeting; subline; tiles: Tile[]; needsYou: NeedsYou[]; filedOvernight: number; calendar: { time; title }[] }`
  - `agenda: { yourDay: AgendaItem[]; team: TeamRow[]; rocks: Rock[]; syncedTo: string }`
  - `chat: { placeholder: string; exchanges: Exchange[] }`
  - `pipeline: { stages: Stage[]; selected: string; details: Record<string, Detail> }`
  - `agents: { roster: Agent[]; handoff: { placeholder; task; button } }`
  - `brand: { swatches: Swatch[] }`
  - Types: `Tile`, `NeedsYou`, `AgendaItem`, `TeamRow`, `Rock`, `Exchange`, `Card`, `Stage`, `Prompt`, `Detail`, `Agent`, `AgentStatus`, `Swatch`

- [ ] **Step 1: Write the failing test**

`tests/unit/saguaro.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { agenda, agents, brand, chat, company, pipeline, today } from "@/lib/saguaro";

const all = JSON.stringify({ agenda, agents, brand, chat, company, pipeline, today });

describe("saguaro dataset", () => {
  it("shares Draw 4 across Today, Agenda, and Pipeline", () => {
    expect(today.needsYou[0].id).toBe("draw-4");
    expect(agenda.yourDay.find((i) => i.ref === "draw-4")?.done).toBe(true);
    expect(agenda.team.flatMap((r) => r.items).find((i) => i.ref === "draw-4")?.done).toBe(true);
    const funded = pipeline.stages.find((s) => s.name === "Funded");
    expect(funded?.cards.some((c) => c.ref === "draw-4")).toBe(true);
  });

  it("has three chat exchanges, each with a receipt and working lines", () => {
    expect(chat.exchanges).toHaveLength(3);
    for (const e of chat.exchanges) {
      expect(e.receipts.length).toBeGreaterThan(0);
      expect(e.working.length).toBeGreaterThan(0);
    }
  });

  it("has five stages and a selected card with three prompts", () => {
    expect(pipeline.stages.map((s) => s.name)).toEqual([
      "Screened", "Term sheet", "Underwriting", "Docs out", "Funded",
    ]);
    expect(pipeline.details[pipeline.selected].prompts).toHaveLength(3);
    expect(pipeline.stages.flatMap((s) => s.cards).some((c) => c.id === pipeline.selected)).toBe(true);
  });

  it("has five agents with known statuses", () => {
    expect(agents.roster).toHaveLength(5);
    for (const a of agents.roster) {
      expect(["running", "waiting", "done", "scheduled"]).toContain(a.status.kind);
      expect(a.log.length).toBe(3);
    }
  });

  it("has four brand swatches, Saguaro first, all hex", () => {
    expect(brand.swatches).toHaveLength(4);
    expect(brand.swatches[0].company).toBe(company.name);
    for (const s of brand.swatches) {
      for (const k of ["accent", "accentDeep", "accentSoft", "accentWash"] as const) {
        expect(s[k]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("follows the copy rules", () => {
    expect(all).not.toMatch(/\u2014/);
    expect(all).not.toMatch(/\bbrain\b|\bmind\b/i);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/saguaro`.

- [ ] **Step 3: Write the dataset**

`src/lib/saguaro.ts`:

```ts
/**
 * The one fictional world every product chapter reads from.
 *
 * Saguaro Capital is invented. Every person, company, number, and place is
 * invented and rounded. Nothing here derives from a real client, even
 * renamed. When the demo content changes (Max's pipeline reference, a new
 * exchange), change this file, never a chapter.
 */

export type Tile = { label: string; value: string; note: string; spark?: number[] };
export type NeedsYou = { id: string; title: string; body: string; receipts: string[]; action?: string };
export type AgendaItem = { time: string; title: string; ref?: string; done?: boolean };
export type TeamRow = { name: string; initials: string; items: { title: string; ref?: string; done?: boolean }[] };
export type Rock = { title: string; pct: number; note?: string };
export type Exchange = { id: string; question: string; working: string[]; answer: string; receipts: string[] };
export type Card = { id: string; name: string; place: string; kind: string; amount: string; rate: string; note?: string; ref?: string };
export type Stage = { name: string; cards: Card[] };
export type Prompt = { label: string; answer: string; receipts: string[] };
export type Detail = { since: string; lastTouch: string; numbers: { label: string; value: string }[]; prompts: Prompt[] };
export type AgentStatus = { kind: "running" | "waiting" | "done" | "scheduled"; text: string };
export type Agent = { id: string; name: string; job: string; status: AgentStatus; lastResult: string; log: string[] };
export type Swatch = { id: string; company: string; accent: string; accentDeep: string; accentSoft: string; accentWash: string };

export const company = {
  name: "Saguaro Capital",
  user: { name: "Morgan Gray", initials: "MG", role: "Managing Partner" },
};

export const today = {
  greeting: "Good morning, Morgan.",
  subline: "Thursday, 9:40 am. Three things need you today, everything else is filed.",
  tiles: [
    { label: "Cash to deploy", value: "$4M", note: "bank feed, 6:00 am", spark: [3.2, 3.4, 3.1, 3.6, 3.8, 3.7, 4.0] },
    { label: "Assets under management", value: "$85M", note: "fund accounting" },
    { label: "Active loans", value: "60", note: "servicing" },
    { label: "Committed, undrawn", value: "$9M", note: "draw schedules" },
  ] satisfies Tile[],
  needsYou: [
    {
      id: "draw-4",
      title: "Draw approval",
      body: "Draw 4, the Palo Verde build. Computed and checked against budget: $130K, balance after $1.3M, LTC 79%. Inspection report attached. Ready for your yes.",
      receipts: ["draw sheet", "inspection report"],
      action: "Approve",
    },
    {
      id: "cactus-wren",
      title: "New deal",
      body: "The Cactus Wren flip screened overnight. Passes borrower exposure at 4% of book, concentration inside limits. Full screen filed to the deal record.",
      receipts: ["exposure model", "deal screen"],
    },
    {
      id: "maturities",
      title: "Maturities",
      body: "Two loans mature inside 30 days. Payoff letters drafted for both. One borrower wants an extension, and the fee decision from August 12 is attached so nobody has to remember it.",
      receipts: ["servicing", "partner meeting, Aug 12"],
    },
  ] satisfies NeedsYou[],
  filedOvernight: 14,
  calendar: [
    { time: "8:30", title: "Approve Draw 4, Palo Verde" },
    { time: "9:00", title: "Partner standup" },
    { time: "11:00", title: "Call the borrower about the extension" },
    { time: "1:00", title: "Review the September report draft" },
    { time: "3:00", title: "Investor call, brief attached" },
  ],
};

export const agenda = {
  yourDay: [
    { time: "8:30", title: "Approve Draw 4, Palo Verde", ref: "draw-4", done: true },
    { time: "9:00", title: "Partner standup, notes filed as they happen" },
    { time: "11:00", title: "Call the borrower about the extension" },
    { time: "1:00", title: "Review the September report draft" },
    { time: "3:00", title: "Investor call, brief already attached" },
  ] satisfies AgendaItem[],
  team: [
    {
      name: "Dana Whitfield",
      initials: "DW",
      items: [
        { title: "Draw 4 site walk, Palo Verde", ref: "draw-4", done: true },
        { title: "Two borrower calls, Tempe" },
      ],
    },
    {
      name: "Marcus Lee",
      initials: "ML",
      items: [{ title: "Term sheet review, Redrock Flips" }, { title: "Broker intro, Canyon State" }],
    },
    {
      name: "Priya Shah",
      initials: "PS",
      items: [{ title: "Underwriting call, Mesa Verde" }, { title: "Servicing handoff, week two" }],
    },
  ] satisfies TeamRow[],
  rocks: [
    { title: "Deploy $6M into new loans", pct: 70, note: "on pace" },
    { title: "Move servicing knowledge into the Core", pct: 80 },
    { title: "Fund report drafting itself by October", pct: 60 },
    { title: "Onboard the new loan ops hire", pct: 90 },
  ] satisfies Rock[],
  syncedTo: "Asana",
};

export const chat = {
  placeholder: "Message the Core",
  exchanges: [
    {
      id: "risk",
      question: "What's at risk this week?",
      working: ["Checking the borrower queue", "Cross-referencing draws and profiles"],
      answer:
        "Four flags. The one that matters: Cholla Creek matures inside 45 days with no payoff plan on file. The other three are a draw request overdue nine days, a borrower dormant at term sheet, and a builder's risk policy expiring October 2.",
      receipts: ["servicing", "exposure model"],
    },
    {
      id: "maturing",
      question: "Which loans mature inside 60 days?",
      working: ["Reading the servicing ledger"],
      answer:
        "Two. Payoff letters are drafted for both, and one borrower has already asked about an extension, brief attached.",
      receipts: ["servicing"],
    },
    {
      id: "fees",
      question: "What did we decide about extension fees?",
      working: ["Searching partner meeting notes", "Checking the servicing policy"],
      answer:
        "One point for a 90 day extension, set at the August 12 partner meeting. Second extensions go to committee, and the wider pricing review is queued for Q4.",
      receipts: ["partner meeting, Aug 12", "servicing policy"],
    },
  ] satisfies Exchange[],
};

export const pipeline = {
  stages: [
    {
      name: "Screened",
      cards: [
        { id: "agave", name: "Agave Trail Homes", place: "Phoenix", kind: "Fix and flip", amount: "$445K", rate: "12.00%", note: "New" },
        { id: "two-palms", name: "Two Palms Development", place: "Chandler", kind: "Bridge", amount: "$520K", rate: "11.90%" },
        { id: "palo-brea", name: "Palo Brea Homes", place: "Phoenix", kind: "Fix and flip", amount: "$515K", rate: "11.85%" },
      ],
    },
    {
      name: "Term sheet",
      cards: [
        { id: "redrock", name: "Redrock Flips", place: "Tempe", kind: "Fix and flip", amount: "$385K", rate: "12.25%", note: "Dormant 21 days" },
        { id: "peoria", name: "North Peoria Duplexes", place: "Peoria", kind: "Ground-up", amount: "$1.35M", rate: "11.10%" },
      ],
    },
    {
      name: "Underwriting",
      cards: [
        { id: "mesa-verde", name: "Mesa Verde Devco", place: "Scottsdale", kind: "Horizontal development", amount: "$2.4M", rate: "10.50%" },
        { id: "gila-bend", name: "Gila Bend Storage", place: "Buckeye", kind: "Bridge", amount: "$890K", rate: "11.40%" },
      ],
    },
    {
      name: "Docs out",
      cards: [
        { id: "sonoran", name: "Sonoran Urban Infill", place: "Phoenix", kind: "Bridge", amount: "$975K", rate: "10.95%" },
      ],
    },
    {
      name: "Funded",
      cards: [
        { id: "ironline", name: "Ironline Builds", place: "Phoenix", kind: "Ground-up", amount: "$1.6M", rate: "11.25%", note: "Draw 4 pending", ref: "draw-4" },
        { id: "copper-sky", name: "Copper Sky Homes", place: "Mesa", kind: "Fix and flip", amount: "$640K", rate: "11.75%", note: "2 of 4 draws" },
        { id: "cholla", name: "Cholla Creek Partners", place: "Gilbert", kind: "Ground-up", amount: "$1.22M", rate: "11.50%", note: "6 of 8 draws" },
      ],
    },
  ] satisfies Stage[],
  selected: "ironline",
  details: {
    ironline: {
      since: "Repeat borrower since 2024",
      lastTouch: "Draw 4 inspection, Tuesday",
      numbers: [
        { label: "Loan amount", value: "$1.6M" },
        { label: "Loan to cost", value: "80%" },
        { label: "Borrower exposure", value: "3%" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer:
            "Ironline Builds, a repeat borrower since 2024. Three loans with us, all current. The principal is Sam Ortega, and the last touch was Tuesday's Draw 4 inspection.",
          receipts: ["borrower history", "inspection report"],
        },
        {
          label: "What's outstanding?",
          answer: "Draw 4 is computed and waiting on your approval. Nothing else is open.",
          receipts: ["draw sheet"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a two-paragraph update on Draw 4 timing in the fund's voice. It is in your drafts, not sent.",
          receipts: ["drafts"],
        },
      ],
    },
    redrock: {
      since: "First-time borrower, term sheet out August 20",
      lastTouch: "Email from the borrower, 21 days ago",
      numbers: [
        { label: "Loan amount", value: "$385K" },
        { label: "Rate", value: "12.25%" },
        { label: "Days at stage", value: "21" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer: "Redrock Flips, a first-time borrower introduced by Canyon State Brokers. The term sheet went out August 20 and has not been countersigned.",
          receipts: ["broker intro", "term sheet"],
        },
        {
          label: "What's outstanding?",
          answer: "The signed term sheet and the entity documents. The follow-up agent has a nudge drafted and waiting for your yes.",
          receipts: ["follow-up draft"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a short check-in that references the August 20 terms and asks for a decision by Friday. In your drafts.",
          receipts: ["drafts"],
        },
      ],
    },
    "mesa-verde": {
      since: "In underwriting since August 28",
      lastTouch: "Underwriting call scheduled Tuesday",
      numbers: [
        { label: "Loan amount", value: "$2.4M" },
        { label: "Loan to cost", value: "72%" },
        { label: "Concentration after", value: "41%" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer: "Mesa Verde Devco, a horizontal development in Scottsdale. Second deal with this sponsor; the first paid off on schedule in 2025.",
          receipts: ["sponsor history", "payoff record"],
        },
        {
          label: "What's outstanding?",
          answer: "The appraisal and the updated budget. Construction concentration would land at 41% after funding, inside the 50% limit.",
          receipts: ["exposure model", "appraisal request"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a note to the sponsor listing the two open items ahead of Tuesday's call. In your drafts.",
          receipts: ["drafts"],
        },
      ],
    },
  } satisfies Record<string, Detail>,
};

export const agents = {
  roster: [
    {
      id: "inbox",
      name: "Inbox agent",
      job: "Reads the shared inbox, files the routine, drafts replies for approval",
      status: { kind: "done", text: "3 drafts ready for your yes" },
      lastResult: "14 messages read, 11 filed, 3 drafted",
      log: ["6:02 am  Read 14 new messages", "6:05 am  Filed 11 to their loans", "6:09 am  Drafted 3 replies, waiting"],
    },
    {
      id: "follow-up",
      name: "Follow-up agent",
      job: "Watches deals for silence and drafts the nudge",
      status: { kind: "waiting", text: "1 draft waiting" },
      lastResult: "Redrock Flips, dormant 21 days at term sheet",
      log: ["6:10 am  Checked 11 open deals", "6:10 am  One past the 14 day mark", "6:12 am  Drafted a check-in, waiting"],
    },
    {
      id: "report",
      name: "Report agent",
      job: "Assembles the monthly report overnight, every line sourced",
      status: { kind: "scheduled", text: "Runs tonight, 11:00 pm" },
      lastResult: "August report, 41 lines, 41 sources",
      log: ["Aug 31  Pulled servicing and accounting", "Aug 31  Drafted 41 lines with sources", "Sep 1  Delivered for review"],
    },
    {
      id: "screening",
      name: "Screening agent",
      job: "Runs every new deal against the limits before anyone is in",
      status: { kind: "done", text: "Cactus Wren screened, 6:12 am" },
      lastResult: "Passes exposure at 4% of book",
      log: ["6:11 am  New application received", "6:11 am  Ran exposure and concentration", "6:12 am  Filed the screen to the deal"],
    },
    {
      id: "filing",
      name: "Filing agent",
      job: "Sweeps chat decisions and call notes into the Core nightly",
      status: { kind: "running", text: "Filing 9 decisions" },
      lastResult: "Last night: 12 decisions, 4 call notes",
      log: ["11:00 pm  Read the loan channels", "11:04 pm  Found 9 decisions", "11:05 pm  Filing to their loans"],
    },
  ] satisfies Agent[],
  handoff: {
    placeholder: "Give an agent a task",
    task: "Research Two Palms Development's track record",
    button: "Hand it off",
  },
};

export const brand = {
  swatches: [
    { id: "saguaro", company: "Saguaro Capital", accent: "#4e7a4e", accentDeep: "#3d633d", accentSoft: "#93b393", accentWash: "#e4ead8" },
    { id: "bellwether", company: "Bellwether Logistics", accent: "#4f6d8a", accentDeep: "#3e5770", accentSoft: "#9db2c4", accentWash: "#dfe6ec" },
    { id: "northline", company: "Northline Health", accent: "#3f7a78", accentDeep: "#325f5e", accentSoft: "#8fb8b6", accentWash: "#dbe8e7" },
    { id: "copperfield", company: "Copperfield Construction", accent: "#9c5a3c", accentDeep: "#7e4630", accentSoft: "#c9a08d", accentWash: "#efe0d6" },
  ] satisfies Swatch[],
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: all unit tests pass (copy guard 2, saguaro 6).

- [ ] **Step 5: Commit**

```bash
git add src/lib/saguaro.ts tests/unit/saguaro.test.ts
git commit -m "feat: the fictional Saguaro dataset every product chapter reads from

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Product CSS and the shared parts

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/product/shared/Frame.tsx`, `Rail.tsx`, `TopBar.tsx`, `Tile.tsx`, `Chip.tsx`, `SendButton.tsx`, `Chapter.tsx`, `index.ts`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces:
  - `Frame({ children, fade?: "corner" | "right" | "bottom", dark?: boolean, height?: string, style?: CSSProperties, className?: string })`
  - `Rail({ active?: "home" | "list" | "chat" | "folder" | "calendar" | "settings" })`
  - `TopBar({ name?: string, initials?: string })`
  - `Tile(props: TileData)` where `TileData` is the dataset's `Tile`
  - `Chip({ children, accent?: boolean })`, `Receipt({ children })`, `Dot({ tone?: "accent" | "watch" | "ink", className?: string })`
  - `SendButton({ label?: string })`
  - `Chapter({ index, label, claim, body, layout?: "wide" | "split", dark?: boolean, children })`
  - CSS classes: `product-frame`, `product-frame-corner|right|bottom`, `product-shell`, `product-shell-dark`, `product-greeting`, `product-title`, `product-num`, `product-tile`, `product-chip`, `product-chip-accent`, `product-dot(-accent|-watch|-ink)`, `product-button`, `product-button-quiet`, `product-send`, `product-rule`, `product-bar`, `product-track`, `product-rail`, `product-rail-active`, `product-topbar`, `product-avatar`, `product-card`, `product-input`

- [ ] **Step 1: Append the failing built-CSS test**

Add these imports at the top of `tests/e2e/site.test.ts`:

```ts
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
```

Append:

```ts
describe("built css", () => {
  it("keeps the double stops in the product masks", () => {
    const dir = join("out", "_next", "static", "css");
    const css = readdirSync(dir).map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
    expect(css).toMatch(/product-frame-corner\{[^}]*#000 74%/);
    expect(css).toMatch(/product-frame-corner\{[^}]*#000 72%/);
    expect(css).toMatch(/product-frame-right\{[^}]*#000 74%/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, no `product-frame-corner` in the CSS.

- [ ] **Step 3: Append the product CSS to globals.css**

Append at the end of `src/app/globals.css`:

```css
/* ---------- Product run: the fragments ----------
   Six chapters of the Core, each a real component cut by a frame. The
   product is parchment on ivory, one accent (--accent, so chapter 06 can
   retint a scoped copy), and never a shadow. Cut edges dissolve into the
   page with masks; the content edge stays crisp. Double stops in every
   mask on purpose: the production minifier collapses a single stop to 0
   and fades the whole frame (see the hero mask above). */

.product-frame {
  position: relative;
  overflow: hidden;
}

.product-frame-corner {
  -webkit-mask-image:
    linear-gradient(to right, #000 0%, #000 74%, transparent 100%),
    linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
  mask-image:
    linear-gradient(to right, #000 0%, #000 74%, transparent 100%),
    linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

.product-frame-right {
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 74%, transparent 100%);
  mask-image: linear-gradient(to right, #000 0%, #000 74%, transparent 100%);
}

.product-frame-bottom {
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
}

/* the product itself: always wider than the frame so the crop does the work */
.product-shell {
  --accent: var(--color-fern);
  --accent-deep: var(--color-fern-deep);
  --accent-soft: var(--color-fern-soft);
  --accent-wash: var(--color-fern-wash);
  --line: rgba(184, 178, 167, 0.3);
  --accent-dim: rgba(78, 122, 78, 0.28);
  display: flex;
  min-width: 960px;
  min-height: 100%;
  background: var(--color-parchment);
  border: 1px solid var(--line);
  border-radius: 1rem;
  color: var(--color-ink);
  font-size: 13px;
  line-height: 1.45;
  font-variant-numeric: tabular-nums;
}

.product-shell-dark {
  --line: rgba(241, 238, 230, 0.1);
  background: var(--color-charcoal);
  color: var(--color-ivory);
}

/* phones crop to a single column at real scale */
@media (max-width: 767px) {
  .product-shell {
    min-width: 640px;
  }
}

.product-greeting {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.product-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.3;
}

.product-num {
  font-size: 1.625rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-weight: 500;
}

.product-rail {
  border-right: 1px solid var(--line);
}

.product-rail-active {
  background: var(--accent-wash);
  color: var(--accent-deep);
}

.product-shell-dark .product-rail-active {
  background: var(--accent-dim);
  color: var(--color-fern-soft);
}

.product-topbar {
  border-bottom: 1px solid var(--line);
}

.product-avatar {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent-wash);
  color: var(--accent-deep);
  font-size: 11px;
  font-weight: 600;
}

.product-shell-dark .product-avatar {
  background: var(--accent-dim);
  color: var(--color-fern-soft);
}

.product-tile {
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  padding: 1rem;
  background: rgba(241, 238, 230, 0.6);
}

.product-shell-dark .product-tile {
  background: rgba(241, 238, 230, 0.04);
}

.product-card {
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  padding: 0.75rem 0.85rem;
  background: rgba(241, 238, 230, 0.6);
}

.product-card-active {
  border-color: var(--accent);
}

.product-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 12px;
  line-height: 1.3;
  border: 1px solid var(--line);
  white-space: nowrap;
}

.product-chip-accent {
  border-color: transparent;
  background: var(--accent-wash);
  color: var(--accent-deep);
}

.product-shell-dark .product-chip-accent {
  background: var(--accent-dim);
  color: var(--color-fern-soft);
}

.product-dot {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.product-dot-accent {
  background: var(--accent);
}

.product-dot-watch {
  background: var(--color-warmgray);
}

.product-dot-ink {
  background: currentColor;
}

.product-button {
  border-radius: 0.5rem;
  background: var(--accent);
  color: var(--color-ivory);
  font-size: 13px;
  font-weight: 600;
  padding: 0.45rem 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
}

.product-button-quiet {
  background: transparent;
  border: 1px solid var(--line);
  color: inherit;
  font-weight: 500;
}

.product-send {
  display: flex;
  flex: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: var(--color-ivory);
}

.product-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;
}

.product-rule > * + * {
  border-top: 1px solid var(--line);
}

.product-bar {
  height: 4px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}

.product-bar > span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
}

/* the agenda's horizontal track: three panels wider than the frame on
   desktop; stacked on phones (no pinning, no scrub below 768px) */
.product-track {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 767px) {
  .product-track {
    flex-direction: column;
  }
}
```

- [ ] **Step 4: Write the shared parts**

`src/components/product/shared/Frame.tsx`:

```tsx
import type { CSSProperties, ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
  /** which edges are cut and dissolve into the page */
  fade?: "corner" | "right" | "bottom";
  dark?: boolean;
  /** Tailwind height class for the frame box */
  height?: string;
  /** scoped variable overrides, e.g. chapter 06's accent */
  style?: CSSProperties;
  className?: string;
};

/**
 * The cropping frame: a fixed-height box that cuts a full-size product shell
 * and dissolves the cut edges into the page. The shell is always wider than
 * the frame, so the product reads as a corner of something larger, never as
 * a screenshot scaled to fit.
 */
export function Frame({
  children,
  fade = "corner",
  dark = false,
  height = "h-[480px]",
  style,
  className = "",
}: FrameProps) {
  return (
    <div className={`product-frame product-frame-${fade} ${height} ${className}`}>
      <div className={`product-shell ${dark ? "product-shell-dark" : ""}`} style={style}>
        {children}
      </div>
    </div>
  );
}
```

`src/components/product/shared/Rail.tsx`:

```tsx
const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  list: "M4 6h16M4 12h16M4 18h10",
  chat: "M4 5h16v11H9l-5 4z",
  folder: "M3 6h6l2 2h10v11H3z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3",
} as const;

export type RailIcon = keyof typeof ICONS;

/** The product's left rail: icons only, no labels, one active. */
export function Rail({ active = "home" }: { active?: RailIcon }) {
  return (
    <aside aria-hidden className="product-rail flex w-12 flex-none flex-col items-center gap-3 py-4">
      {(Object.keys(ICONS) as RailIcon[]).map((key) => (
        <span
          key={key}
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            key === active ? "product-rail-active" : "opacity-50"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICONS[key]} />
          </svg>
        </span>
      ))}
    </aside>
  );
}
```

`src/components/product/shared/TopBar.tsx`:

```tsx
import { company } from "@/lib/saguaro";

export function TopBar({
  name = company.name,
  initials = company.user.initials,
}: {
  name?: string;
  initials?: string;
}) {
  return (
    <header className="product-topbar flex h-12 flex-none items-center justify-between px-5">
      <span className="font-medium">{name}</span>
      <span className="product-avatar">{initials}</span>
    </header>
  );
}
```

`src/components/product/shared/Tile.tsx`:

```tsx
import type { Tile as TileData } from "@/lib/saguaro";

export function Tile({ label, value, note, spark }: TileData) {
  return (
    <div className="product-tile">
      <p className="text-[12px] opacity-60">{label}</p>
      <p className="product-num mt-2">{value}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-[12px] opacity-55">{note}</p>
        {spark && <Sparkline points={spark} />}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 72;
  const h = 22;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((p, i) => {
      const x = ((i / (points.length - 1)) * w).toFixed(1);
      const y = (h - 1 - ((p - min) / (max - min || 1)) * (h - 2)).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="flex-none">
      <polyline
        points={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

`src/components/product/shared/Chip.tsx`:

```tsx
import type { ReactNode } from "react";

export function Chip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <span className={`product-chip ${accent ? "product-chip-accent" : ""}`}>{children}</span>;
}

/** A source the product attaches to an answer or an item. */
export function Receipt({ children }: { children: ReactNode }) {
  return (
    <span className="product-chip product-chip-accent">
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M1 1h5l3 3v7H1z M6 1v3h3" />
      </svg>
      {children}
    </span>
  );
}

export function Dot({
  tone = "accent",
  className = "",
}: {
  tone?: "accent" | "watch" | "ink";
  className?: string;
}) {
  return <span aria-hidden className={`product-dot product-dot-${tone} ${className}`} />;
}
```

`src/components/product/shared/SendButton.tsx`:

```tsx
export function SendButton({ label = "Send" }: { label?: string }) {
  return (
    <button type="button" aria-label={label} className="product-send">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
```

`src/components/product/shared/Chapter.tsx`:

```tsx
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type ChapterProps = {
  index: string;
  label: string;
  claim: ReactNode;
  body: string;
  layout?: "wide" | "split";
  dark?: boolean;
  children: ReactNode;
};

/**
 * One chapter of the product run: the label, the claim, one or two
 * sentences, then the frame. Everything that describes the product lives
 * here, outside the frame; the frame only ever shows the product. The demo
 * caption sits under the frame, outside it, per the demo rules.
 */
export function Chapter({
  index,
  label,
  claim,
  body,
  layout = "wide",
  dark = false,
  children,
}: ChapterProps) {
  const ink = dark ? "text-ivory" : "text-ink";
  const muted = dark ? "text-ivory/70" : "text-ink/70";
  const text = (
    <Reveal>
      <p className={`type-label ${dark ? "text-fern-soft" : "text-fern-deep"}`}>
        <span className="type-label-index">{index}</span>
        {label}
      </p>
      <h3 className={`type-h2 mt-3 max-w-2xl ${ink}`}>{claim}</h3>
      <p className={`type-body mt-4 max-w-xl ${muted}`}>{body}</p>
    </Reveal>
  );
  const frame = (
    <Reveal delay={120}>
      {children}
      <p className={`mt-3 text-xs ${dark ? "text-ivory/50" : "text-ink/50"}`}>
        Interactive demo · Sample data
      </p>
    </Reveal>
  );
  if (layout === "split") {
    return (
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        {text}
        {frame}
      </div>
    );
  }
  return (
    <div>
      {text}
      <div className="mt-10">{frame}</div>
    </div>
  );
}
```

`src/components/product/shared/index.ts`:

```ts
export { Frame } from "./Frame";
export { Rail } from "./Rail";
export { TopBar } from "./TopBar";
export { Tile } from "./Tile";
export { Chip, Receipt, Dot } from "./Chip";
export { SendButton } from "./SendButton";
export { Chapter } from "./Chapter";
```

- [ ] **Step 5: Build and run the built-CSS test**

Run: `npm run test:e2e`
Expected: `built css` passes. `npx tsc --noEmit` prints nothing.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/product/shared tests/e2e/site.test.ts
git commit -m "feat: product frame, shell, and shared parts for the dashboard chapters

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: The product run scaffold and chapter 01, Today

**Files:**
- Create: `src/components/product/today/Today.tsx`, `src/components/product/ProductRun.tsx`
- Modify: `src/app/globals.css` (one class), `src/app/page.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `today` from `@/lib/saguaro`; `Chapter`, `Frame`, `Rail`, `TopBar`, `Tile`, `Receipt`, `Dot` from `../shared`.
- Produces: `ProductRun` (default export) rendering `#how-it-works` with the run intro, the chapters, the fictional line, and the bridge line. Tasks 8 to 12 each add one chapter to it. CSS class `product-aside`.

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("product run", () => {
  it("renders chapter 01 with the finished morning", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("#how-it-works");
      return {
        intro: await run.locator("h2").first().textContent(),
        label: await run.locator(".type-label").nth(1).textContent(),
        greeting: await run.getByText("Good morning, Morgan.").count(),
        filed: await run.getByText("14 filed overnight").count(),
        captions: await page.getByText("Interactive demo · Sample data").count(),
      };
    });
    expect(r.intro).toContain("talking to your firm");
    expect(r.label).toContain("Today");
    expect(r.greeting).toBe(1);
    expect(r.filed).toBe(1);
    expect(r.captions).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `#how-it-works` not found.

- [ ] **Step 3: Add the aside rule to globals.css**

Append after `.product-topbar { ... }`:

```css
.product-aside {
  border-left: 1px solid var(--line);
}
```

- [ ] **Step 4: Write Today.tsx**

`src/components/product/today/Today.tsx`:

```tsx
import { today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar } from "../shared";

/**
 * Chapter 01. The top-left of the dashboard in its finished state: the
 * greeting, the numbers, the three things that need a person, and the
 * calendar column fading out at the right edge. Motion comes later, from
 * the design loop; this is the state every visitor without JS sees.
 */
export default function Today() {
  return (
    <Chapter
      index="01"
      label="Today"
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <Frame fade="corner" height="h-[540px]">
        <Rail active="home" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_240px] gap-8 p-6">
            <div className="min-w-0">
              <p className="product-greeting">{today.greeting}</p>
              <p className="mt-1.5 opacity-60">{today.subline}</p>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {today.tiles.map((tile) => (
                  <Tile key={tile.label} {...tile} />
                ))}
              </div>
              <p className="product-title mt-8">Needs you today</p>
              <ul className="product-rule mt-3">
                {today.needsYou.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <Dot tone="ink" className="mt-2" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 leading-relaxed opacity-75">{item.body}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.receipts.map((r) => (
                          <Receipt key={r}>{r}</Receipt>
                        ))}
                      </div>
                    </div>
                    {item.action && (
                      <button type="button" className="product-button self-start">
                        {item.action}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] opacity-55">{today.filedOvernight} filed overnight</p>
            </div>
            <aside className="product-aside pl-6">
              <p className="text-[12px] font-medium opacity-60">Today</p>
              <ul className="mt-3 space-y-3">
                {today.calendar.map((slot) => (
                  <li key={slot.time} className="flex gap-3">
                    <span className="w-10 flex-none opacity-55">{slot.time}</span>
                    <span className="min-w-0">{slot.title}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </Frame>
    </Chapter>
  );
}
```

- [ ] **Step 5: Write ProductRun.tsx**

`src/components/product/ProductRun.tsx`:

```tsx
import Reveal from "@/components/Reveal";
import Today from "./today/Today";

/**
 * The product run: six chapters of the Core, each a claim plus a fragment.
 * Chapters 01 and 02 sit in the first container, chapter 03 is its own
 * full-bleed dark band, and 04 to 06 close the run before the fictional
 * line and the bridge into the brain section.
 */
export default function ProductRun() {
  return (
    <>
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-32"
      >
        <Reveal>
          <p className="type-label text-fern-deep">How it works</p>
          <h2 className="type-h2 mt-3 max-w-3xl text-ink">
            You&apos;re not talking to a chatbot. You&apos;re talking to your
            firm&apos;s memory.
          </h2>
        </Reveal>
        <div className="mt-16 space-y-24 sm:space-y-32">
          <Today />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
        <div className="space-y-24 sm:space-y-32">{/* chapters 04 to 06 land here */}</div>
        <p className="mt-12 text-xs text-ink/50">
          Saguaro Capital is fictional. Every number is invented, rounded demo data.
        </p>
        <Reveal>
          {/* mirrors the brain section's top padding below it, so the line
              sits centered in the whitespace between the two sections */}
          <p className="mt-24 text-center type-accent text-charcoal sm:mt-32">
            Behind the chat is the{" "}
            <span className="font-semibold text-fern-deep">Core</span>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
```

- [ ] **Step 6: Mount the run in page.tsx**

Add the import and place `<ProductRun />` directly after `<Hero />`, before `<ProblemBand />`:

```tsx
import ProductRun from "@/components/product/ProductRun";
```

```tsx
      <Hero />
      <ProductRun />
      <ProblemBand />
```

- [ ] **Step 7: Build, run e2e, look at it**

Run: `npm run test:e2e`
Expected: `product run` passes.

Run: `npm run dev` in the background (read its log for the real port; another app often holds 3000), then:

```bash
node scripts/shot.mjs http://localhost:3000 1440 screenshots/run-01-1440.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/run-01-390.png --full
```

Open both. The frame must show a parchment product cut at the right and bottom, dissolving into ivory, no shadow, and no text inside the frame that addresses the visitor. On the phone shot the frame shows the greeting, tiles, and the list in one column with the calendar cut off.

- [ ] **Step 8: Commit**

```bash
git add src/components/product src/app/globals.css src/app/page.tsx tests/e2e/site.test.ts
git commit -m "feat: product run scaffold and chapter 01, the assembled morning

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Chapter 02, Agenda

**Files:**
- Create: `src/components/product/agenda/Agenda.tsx`
- Modify: `src/components/product/shared/Chip.tsx`, `src/components/product/shared/index.ts`, `src/components/product/ProductRun.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `agenda` from `@/lib/saguaro`; shared parts.
- Produces: `Check()` in `shared/Chip.tsx` (a 14px check mark in the accent color), exported from the barrel; `Agenda` (default export).

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("chapter 02", () => {
  it("renders the agenda with Draw 4 checked and synced", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("#how-it-works");
      return {
        panels: await run.locator(".product-track > section").count(),
        synced: await run.getByText("synced to Asana").count(),
        rocks: await run.getByText("Deploy $6M into new loans").count(),
      };
    });
    expect(r.panels).toBe(3);
    expect(r.synced).toBe(1);
    expect(r.rocks).toBe(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `panels` is 0.

- [ ] **Step 3: Add Check to the shared parts**

Append to `src/components/product/shared/Chip.tsx`:

```tsx
/** A done mark in the accent color. */
export function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="flex-none"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
```

In `src/components/product/shared/index.ts` change the Chip line to:

```ts
export { Chip, Receipt, Dot, Check } from "./Chip";
```

- [ ] **Step 4: Write Agenda.tsx**

`src/components/product/agenda/Agenda.tsx`:

```tsx
import type { ReactNode } from "react";
import { agenda } from "@/lib/saguaro";
import { Chapter, Check, Chip, Dot, Frame, Rail, TopBar } from "../shared";

/**
 * Chapter 02, finished state. Three panels on one horizontal track: your
 * day, the team's week, the quarter's rocks. Draw 4 is already checked in
 * your day and on Dana's row, and the deployment rock already reads 70,
 * which is where the scroll-driven propagation (design loop) ends up. The
 * track is wider than the frame on desktop and fades at the right; on
 * phones it stacks.
 */
export default function Agenda() {
  return (
    <Chapter
      index="02"
      label="Agenda"
      claim="One list, and the whole team is on it."
      body="Your day, the team's week, and the quarter's rocks, kept in one place and synced with the task tool the team already uses. Finish something anywhere and it checks off everywhere."
    >
      <Frame fade="right" height="h-[520px]">
        <Rail active="list" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="product-track flex-1 p-6">
            <Panel title="Your day">
              <ul className="product-rule">
                {agenda.yourDay.map((item) => (
                  <li key={item.time} className="flex items-center gap-3 py-3">
                    <span className="w-10 flex-none opacity-55">{item.time}</span>
                    <span className={`flex-1 ${item.done ? "opacity-55" : ""}`}>{item.title}</span>
                    {item.done ? <Check /> : <Dot tone="watch" />}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Chip accent>synced to {agenda.syncedTo}</Chip>
              </div>
            </Panel>

            <Panel title="The team this week">
              <ul className="product-rule">
                {agenda.team.map((row) => (
                  <li key={row.name} className="flex gap-3 py-3">
                    <span className="product-avatar flex-none">{row.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{row.name}</p>
                      <ul className="mt-1 space-y-1">
                        {row.items.map((it) => (
                          <li key={it.title} className="flex items-center gap-2">
                            {it.done ? <Check /> : <Dot tone="watch" />}
                            <span className={it.done ? "opacity-55" : "opacity-80"}>{it.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Quarterly rocks">
              <ul className="space-y-4">
                {agenda.rocks.map((rock) => (
                  <li key={rock.title}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span>{rock.title}</span>
                      <span className="flex-none opacity-55">
                        {rock.pct}%{rock.note ? `, ${rock.note}` : ""}
                      </span>
                    </div>
                    <div className="product-bar mt-2">
                      <span style={{ width: `${rock.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </Frame>
    </Chapter>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="w-[380px] flex-none">
      <p className="product-title">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}
```

- [ ] **Step 5: Mount it in ProductRun.tsx**

Add the import and place `<Agenda />` after `<Today />` in the first container:

```tsx
import Agenda from "./agenda/Agenda";
```

```tsx
        <div className="mt-16 space-y-24 sm:space-y-32">
          <Today />
          <Agenda />
        </div>
```

- [ ] **Step 6: Build, run e2e, screenshot**

Run: `npm run test:e2e`
Expected: `chapter 02` passes.

Screenshot at 1440 and 390 as in Task 7 (files `run-02-*.png`). Desktop: the third panel is cut by the right fade. Phone: the three panels stack.

- [ ] **Step 7: Commit**

```bash
git add src/components/product tests/e2e/site.test.ts
git commit -m "feat: chapter 02, the agenda on one track

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Chapter 03, the Core chat (dark)

**Files:**
- Create: `src/components/product/chat/Chat.tsx`
- Modify: `src/app/globals.css` (two classes), `src/components/product/ProductRun.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `chat`, `today` from `@/lib/saguaro`; shared parts including `Check`, `SendButton`.
- Produces: `Chat` (default export) which renders its own full-bleed `<section>` on charcoal-deep; CSS classes `product-bubble`, `product-hr`.

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("chapter 03", () => {
  it("renders the dark chat with the first exchange answered", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const dark = page.locator("section.bg-charcoal-deep").first();
      return {
        exists: await dark.count(),
        question: await dark.getByText("What's at risk this week?").count(),
        followUps: await dark.locator("button.product-chip").count(),
        send: await dark.locator("button.product-send").count(),
        receipts: await dark.locator(".product-chip-accent").count(),
      };
    });
    expect(r.exists).toBe(1);
    expect(r.question).toBe(1);
    expect(r.followUps).toBe(2);
    expect(r.send).toBe(1);
    expect(r.receipts).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `exists` is 0.

- [ ] **Step 3: Add the bubble and rule classes to globals.css**

Append after `.product-input { ... }`:

```css
/* the user's own message in a thread */
.product-bubble {
  width: fit-content;
  max-width: 85%;
  margin-left: auto;
  border-radius: 1rem;
  border-bottom-right-radius: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: var(--accent-wash);
  color: var(--accent-deep);
}

.product-shell-dark .product-bubble {
  background: var(--accent-dim);
  color: var(--color-ivory);
}

.product-hr {
  border-top: 1px solid var(--line);
}
```

- [ ] **Step 4: Write Chat.tsx**

`src/components/product/chat/Chat.tsx`:

```tsx
import { chat, today } from "@/lib/saguaro";
import { Chapter, Check, Dot, Frame, Rail, Receipt, SendButton, Tile, TopBar } from "../shared";

/**
 * Chapter 03, the one dark chapter, in its finished state: the first
 * exchange answered with receipts, the two follow-up chips waiting, the
 * input empty. The dashboard sits dimmed at the left edge so the panel
 * reads as docked over the product, not floating. The send mechanic
 * (pre-composed message, click to send, streamed answer) is design-loop
 * work; nothing here accepts typing.
 */
export default function Chat() {
  const [first, ...followUps] = chat.exchanges;
  return (
    <section className="bg-charcoal-deep text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Chapter
          index="03"
          label="The Core"
          dark
          claim="Ask it anything the business has written down. It answers with receipts."
          body="Decisions, meetings, files, and six years of loans. Every answer shows its work: ask where a number came from and the Core cites the meeting, the email, or the file it lives in."
        >
          <Frame dark fade="bottom" height="h-[580px]">
            <Rail active="chat" />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div className="flex min-h-0 flex-1">
                <div className="min-w-0 flex-1 p-6 opacity-40" aria-hidden>
                  <p className="product-greeting">{today.greeting}</p>
                  <p className="mt-1.5 opacity-60">{today.subline}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {today.tiles.slice(0, 2).map((tile) => (
                      <Tile key={tile.label} {...tile} />
                    ))}
                  </div>
                </div>

                <div className="product-aside flex w-[440px] flex-none flex-col">
                  <div className="product-topbar flex h-11 flex-none items-center gap-2 px-5">
                    <Dot tone="accent" />
                    <span className="font-medium">Core</span>
                    <span className="opacity-50">answers from this fund&apos;s files</span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-hidden px-5 py-4">
                    <p className="product-bubble">{first.question}</p>
                    <ul className="space-y-1 opacity-60">
                      {first.working.map((line) => (
                        <li key={line} className="flex items-center gap-2">
                          <Check />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="leading-relaxed">{first.answer}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {first.receipts.map((r) => (
                        <Receipt key={r}>{r}</Receipt>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {followUps.map((e) => (
                        <button key={e.id} type="button" className="product-chip">
                          {e.question}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-none px-4 pb-4">
                    <div className="product-input">
                      <span className="flex-1 opacity-45">{chat.placeholder}</span>
                      <SendButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Frame>
        </Chapter>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Mount it in ProductRun.tsx**

Add the import and place `<Chat />` between the two containers:

```tsx
import Chat from "./chat/Chat";
```

```tsx
      </section>

      <Chat />

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
```

Then change that second container's className to `mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-32` so it has top padding after the dark band.

- [ ] **Step 6: Build, run e2e, screenshot, check the phone theme band**

Run: `npm run test:e2e`
Expected: `chapter 03` passes.

Screenshot at 1440 and 390 (`run-03-*.png`). On the phone, scroll the dark band to the top of the viewport and confirm `SafeAreaTheme` repaints the status bar to charcoal, the same as it does for the closing CTA (it watches every dark section; nothing to change unless the band does not register, in which case give the section the same class the closing CTA uses).

- [ ] **Step 7: Commit**

```bash
git add src/components/product src/app/globals.css tests/e2e/site.test.ts
git commit -m "feat: chapter 03, the Core chat on the dark band

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Chapter 04, Pipeline

**Files:**
- Create: `src/components/product/pipeline/Pipeline.tsx`
- Modify: `src/components/product/ProductRun.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `pipeline` from `@/lib/saguaro`; shared parts.
- Produces: `Pipeline` (default export).

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("chapter 04", () => {
  it("renders the board with the selected card's detail open", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='04']");
      return {
        stages: await run.locator("[data-stage]").count(),
        active: await run.locator(".product-card-active").count(),
        who: await run.getByText("Who is this?").count(),
        answer: await run.getByText("Ironline Builds, a repeat borrower since 2024").count(),
      };
    });
    expect(r.stages).toBe(5);
    expect(r.active).toBe(1);
    expect(r.who).toBe(2);
    expect(r.answer).toBe(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `stages` is 0.

- [ ] **Step 3: Write Pipeline.tsx**

`src/components/product/pipeline/Pipeline.tsx`:

```tsx
import { pipeline } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Receipt, TopBar } from "../shared";

/**
 * Chapter 04, finished state: the board with every stage, one card
 * highlighted, and its detail panel open at the right with "Who is this?"
 * already asked and answered. The deal-in, the click-to-open, and the
 * other prompts firing are design-loop work. The board area carries its
 * own right fade so the columns dissolve under the panel instead of
 * hitting a hard edge; the frame itself fades at the bottom only, so the
 * panel stays fully readable.
 */
export default function Pipeline() {
  const selected = pipeline.stages
    .flatMap((s) => s.cards)
    .find((c) => c.id === pipeline.selected);
  const detail = pipeline.details[pipeline.selected];
  if (!selected || !detail) return null;
  const [who, ...rest] = detail.prompts;

  return (
    <div data-chapter="04">
      <Chapter
        index="04"
        label="Pipeline"
        claim="Every client, every stage, and the whole history one click away."
        body="Every deal the team is working, in the stage it is actually in, synced from the tool they already track it in. Open one and ask the Core about it in a click."
      >
        <Frame fade="bottom" height="h-[600px]">
          <Rail active="folder" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <div className="product-frame-right flex min-w-0 flex-1 gap-4 overflow-hidden p-6">
                {pipeline.stages.map((stage) => (
                  <section key={stage.name} data-stage={stage.name} className="w-[200px] flex-none">
                    <div className="flex items-baseline justify-between">
                      <p className="font-semibold">{stage.name}</p>
                      <span className="opacity-50">{stage.cards.length}</span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {stage.cards.map((card) => (
                        <li
                          key={card.id}
                          className={`product-card ${
                            card.id === pipeline.selected ? "product-card-active" : ""
                          }`}
                        >
                          <p className="font-medium">{card.name}</p>
                          <p className="text-[12px] opacity-55">
                            {card.place} · {card.kind}
                          </p>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span>{card.amount}</span>
                            <span className="opacity-55">{card.rate}</span>
                          </div>
                          {card.note && <p className="mt-1 text-[12px] opacity-70">{card.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="product-aside flex w-[360px] flex-none flex-col p-6">
                <p className="product-title">{selected.name}</p>
                <p className="mt-1 opacity-60">{detail.since}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {detail.numbers.map((n) => (
                    <div key={n.label} className="product-tile p-3">
                      <p className="text-[12px] opacity-60">{n.label}</p>
                      <p className="mt-1 text-[18px] font-medium">{n.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[12px] opacity-55">Last touch: {detail.lastTouch}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="product-button">
                    {who.label}
                  </button>
                  {rest.map((p) => (
                    <button key={p.label} type="button" className="product-button product-button-quiet">
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="product-hr mt-5 pt-4">
                  <p className="product-bubble">{who.label}</p>
                  <p className="mt-3 leading-relaxed">{who.answer}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {who.receipts.map((r) => (
                      <Receipt key={r}>{r}</Receipt>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
```

- [ ] **Step 4: Mount it in ProductRun.tsx**

Add the import and place `<Pipeline />` inside the second container's `space-y` div, replacing the placeholder comment:

```tsx
import Pipeline from "./pipeline/Pipeline";
```

```tsx
        <div className="space-y-24 sm:space-y-32">
          <Pipeline />
        </div>
```

- [ ] **Step 5: Build, run e2e, screenshot**

Run: `npm run test:e2e`
Expected: `chapter 04` passes.

Screenshot at 1440 and 390 (`run-04-*.png`). Desktop: five columns, the last one or two dissolving under the panel, the panel fully readable, the frame fading at the bottom only.

- [ ] **Step 6: Commit**

```bash
git add src/components/product tests/e2e/site.test.ts
git commit -m "feat: chapter 04, the pipeline with one client open

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Chapter 05, Agents

**Files:**
- Create: `src/components/product/agents/Agents.tsx`
- Modify: `src/components/product/ProductRun.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `agents` from `@/lib/saguaro`; shared parts.
- Produces: `Agents` (default export).

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("chapter 05", () => {
  it("renders five agents and the hand-off", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='05']");
      return {
        rows: await run.locator("[data-agent]").count(),
        running: await run.getByText("1 running").count(),
        handoff: await run.getByText("Hand it off").count(),
      };
    });
    expect(r.rows).toBe(5);
    expect(r.running).toBe(1);
    expect(r.handoff).toBe(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `rows` is 0.

- [ ] **Step 3: Write Agents.tsx**

`src/components/product/agents/Agents.tsx`:

```tsx
import { agents, type AgentStatus } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, TopBar } from "../shared";

const TONE: Record<AgentStatus["kind"], "accent" | "watch" | "ink"> = {
  running: "accent",
  waiting: "ink",
  done: "accent",
  scheduled: "watch",
};

/**
 * Chapter 05, finished state: the roster after the six-second live
 * sequence has played (the inbox agent done, the follow-up agent waiting,
 * the filing agent still running), and the hand-off composer with its
 * task ready. The ticking statuses, the row expand, and the hand-off
 * adding a row are design-loop work.
 */
export default function Agents() {
  const running = agents.roster.filter((a) => a.status.kind === "running").length;
  return (
    <div data-chapter="05">
      <Chapter
        index="05"
        label="Agents"
        layout="split"
        claim="Each one has a single job. They run while you don't."
        body="Custom agents built for the work your team names: reading the inbox, chasing the silent deal, drafting the report. Each one reports what it did and waits for your yes before anything leaves the building."
      >
        <Frame fade="corner" height="h-[520px]">
          <Rail active="settings" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline gap-3">
                <p className="product-title">Agents</p>
                <span className="opacity-55">{running} running</span>
              </div>
              <ul className="product-rule mt-3">
                {agents.roster.map((agent) => (
                  <li key={agent.id} data-agent={agent.id} className="grid grid-cols-[1fr_210px] gap-6 py-3.5">
                    <div className="min-w-0">
                      <p className="font-semibold">{agent.name}</p>
                      <p className="mt-0.5 text-[12px] opacity-60">{agent.job}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2">
                        <Dot tone={TONE[agent.status.kind]} />
                        <span className="truncate">{agent.status.text}</span>
                      </p>
                      <p className="mt-0.5 truncate text-[12px] opacity-55">{agent.lastResult}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="product-input mt-auto">
                <span className="min-w-0 flex-1 truncate">{agents.handoff.task}</span>
                <button type="button" className="product-button">
                  {agents.handoff.button}
                </button>
              </div>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
```

- [ ] **Step 4: Mount it in ProductRun.tsx**

```tsx
import Agents from "./agents/Agents";
```

```tsx
        <div className="space-y-24 sm:space-y-32">
          <Pipeline />
          <Agents />
        </div>
```

- [ ] **Step 5: Build, run e2e, screenshot**

Run: `npm run test:e2e`
Expected: `chapter 05` passes.

Screenshot at 1440 and 390 (`run-05-*.png`). Desktop: claim left, frame right, the roster cut at the right and bottom.

- [ ] **Step 6: Commit**

```bash
git add src/components/product tests/e2e/site.test.ts
git commit -m "feat: chapter 05, the agents roster and the hand-off

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Chapter 06, Your brand, and the finished run

**Files:**
- Create: `src/components/product/brand/Brand.tsx`
- Modify: `src/components/product/ProductRun.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Consumes: `brand`, `today` from `@/lib/saguaro`; shared parts; `Frame`'s `style` prop for the scoped accent variables.
- Produces: `Brand` (default export); the complete `ProductRun`.

- [ ] **Step 1: Append the failing e2e tests**

```ts
describe("chapter 06 and the whole run", () => {
  it("renders four swatches with Saguaro pressed and the accent scoped", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='06']");
      return {
        swatches: await run.locator("button[aria-pressed]").count(),
        pressed: await run.locator("button[aria-pressed='true']").textContent(),
        accent: await run.locator(".product-shell").evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--accent").trim()
        ),
        pageAccent: await page.locator("body").evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--accent").trim()
        ),
      };
    });
    expect(r.swatches).toBe(4);
    expect(r.pressed).toContain("Saguaro Capital");
    expect(r.accent).toBe("#4e7a4e");
    expect(r.pageAccent).toBe("");
  });

  it("carries six captions and the fictional line once", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        captions: await page.getByText("Interactive demo · Sample data").count(),
        fictional: await page.getByText("Saguaro Capital is fictional").count(),
        bridge: await page.getByText("Behind the chat is the").count(),
        labels: await page.locator(".type-label-index").allTextContents(),
      };
    });
    expect(r.captions).toBe(6);
    expect(r.fictional).toBe(1);
    expect(r.bridge).toBe(1);
    expect(r.labels).toEqual(["01", "02", "03", "04", "05", "06"]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `swatches` is 0 and `captions` is 5.

- [ ] **Step 3: Write Brand.tsx**

`src/components/product/brand/Brand.tsx`:

```tsx
import type { CSSProperties } from "react";
import { brand, today } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Tile, TopBar } from "../shared";

/**
 * Chapter 06, finished state: a small copy of the morning dashboard in the
 * first swatch's colors, with the swatch picker above the frame. The
 * picker is a site control, so it lives outside the frame; the product
 * inside only ever shows one brand. The accent variables are set inline on
 * the shell, so they override the shell's defaults and can never leak into
 * the page. Cycling and retinting on click are design-loop work.
 */
export default function Brand() {
  const active = brand.swatches[0];
  const vars = {
    "--accent": active.accent,
    "--accent-deep": active.accentDeep,
    "--accent-soft": active.accentSoft,
    "--accent-wash": active.accentWash,
  } as CSSProperties;

  return (
    <div data-chapter="06">
      <Chapter
        index="06"
        label="Your brand"
        layout="split"
        claim="It looks like your company, not ours."
        body="Your name, your colors, every screen. The Core is set up to look like it was always yours, because to your team it was."
      >
        <div>
          <ul className="mb-4 flex flex-wrap gap-2">
            {brand.swatches.map((s) => {
              const pressed = s.id === active.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      pressed ? "border-ink/30 text-ink" : "border-ink/10 text-ink/60 hover:text-ink"
                    }`}
                  >
                    <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: s.accent }} />
                    {s.company}
                  </button>
                </li>
              );
            })}
          </ul>

          <Frame fade="corner" height="h-[420px]" style={vars}>
            <Rail active="home" />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar name={active.company} />
              <div className="p-6">
                <p className="product-greeting">{today.greeting}</p>
                <p className="mt-1.5 opacity-60">{today.subline}</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {today.tiles.slice(0, 3).map((tile) => (
                    <Tile key={tile.label} {...tile} />
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button type="button" className="product-button">
                    New deal
                  </button>
                  <button type="button" className="product-button product-button-quiet">
                    Ask the Core
                  </button>
                </div>
                <div className="product-bar mt-6">
                  <span style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </Frame>
        </div>
      </Chapter>
    </div>
  );
}
```

- [ ] **Step 4: Finish ProductRun.tsx**

Replace the whole file with the final version:

```tsx
import Reveal from "@/components/Reveal";
import Today from "./today/Today";
import Agenda from "./agenda/Agenda";
import Chat from "./chat/Chat";
import Pipeline from "./pipeline/Pipeline";
import Agents from "./agents/Agents";
import Brand from "./brand/Brand";

/**
 * The product run: six chapters of the Core, each a claim plus a fragment.
 * Chapters 01 and 02 sit in the first container, chapter 03 is its own
 * full-bleed dark band, and 04 to 06 close the run before the fictional
 * line and the bridge into the brain section.
 */
export default function ProductRun() {
  return (
    <>
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-32"
      >
        <Reveal>
          <p className="type-label text-fern-deep">How it works</p>
          <h2 className="type-h2 mt-3 max-w-3xl text-ink">
            You&apos;re not talking to a chatbot. You&apos;re talking to your
            firm&apos;s memory.
          </h2>
        </Reveal>
        <div className="mt-16 space-y-24 sm:space-y-32">
          <Today />
          <Agenda />
        </div>
      </section>

      <Chat />

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-32">
        <div className="space-y-24 sm:space-y-32">
          <Pipeline />
          <Agents />
          <Brand />
        </div>
        <p className="mt-12 text-xs text-ink/50">
          Saguaro Capital is fictional. Every number is invented, rounded demo data.
        </p>
        <Reveal>
          {/* mirrors the brain section's top padding below it, so the line
              sits centered in the whitespace between the two sections */}
          <p className="mt-24 text-center type-accent text-charcoal sm:mt-32">
            Behind the chat is the{" "}
            <span className="font-semibold text-fern-deep">Core</span>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Build, run everything, screenshot the whole run**

Run: `npm run test:e2e && npm test`
Expected: all green.

```bash
node scripts/shot.mjs http://localhost:3000 1440 screenshots/run-full-1440.png --full
node scripts/shot.mjs http://localhost:3000 1728 screenshots/run-full-1728.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/run-full-390.png --full
```

Walk the six frames in each: parchment on ivory, one dark band, no shadows, every cut edge dissolving, no visitor-facing text inside any frame, the caption under every frame, the fictional line once.

- [ ] **Step 6: Commit**

```bash
git add src/components/product tests/e2e/site.test.ts
git commit -m "feat: chapter 06, your brand, and the finished product run

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Hero, the run intro, Stats, Who it's for, and the page order

**Files:**
- Modify: `src/components/Hero.tsx`, `src/components/product/ProductRun.tsx`, `src/components/WhoItsFor.tsx`, `src/app/page.tsx`
- Create: `src/components/Stats.tsx`
- Delete: `src/components/ProblemBand.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces: `Stats` (default export); `WhoItsFor` rewritten as a static section; the page in its final order minus `Values` and `Insights` (Task 15 inserts those).

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("hero and the top of the company half", () => {
  it("carries the new headline, static subline, industries, and stats", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const body = await page.locator("main").textContent();
      return {
        h1: await page.locator("h1").textContent(),
        rotator: await page.locator(".swap-row").count(),
        marquee: await page.locator(".drift-slow").count(),
        stewards: body?.includes("financial stewards"),
        funds: body?.includes("worked inside funds"),
        industries: await page.locator("#who-its-for li").allTextContents(),
        stats: await page.locator("#stats .type-h2").allTextContents(),
        order: await page.evaluate(() =>
          [...document.querySelectorAll("main section[id]")].map((s) => s.id)
        ),
      };
    });
    expect(r.h1).toBe("The operating layer your business actually runs on.");
    expect(r.rotator).toBe(0);
    expect(r.marquee).toBe(0);
    expect(r.stewards).toBe(false);
    expect(r.funds).toBe(false);
    expect(r.industries).toEqual([
      "Manufacturing", "Healthcare", "Logistics", "Professional services", "Construction", "Private credit",
    ]);
    expect(r.stats).toEqual(["75%", "78%"]);
    expect(r.order.slice(0, 6)).toEqual([
      "top", "how-it-works", "the-brain", "who-its-for", "stats", "why-crosswell",
    ]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL on the h1.

- [ ] **Step 3: Rewrite Hero.tsx**

Replace the inner copy block (everything inside `<div className="relative mx-auto max-w-4xl px-6 py-20 text-center">`) with:

```tsx
        <p
          className="hero-enter type-label mb-5 text-fern-deep"
          style={{ "--enter-delay": "0.2s" } as CSSProperties}
        >
          Crosswell Core
        </p>
        <h1
          className="hero-enter type-display text-ink"
          style={{ "--enter-delay": "0.45s", "--enter-dur": "0.95s" } as CSSProperties}
        >
          The operating layer your business actually runs on.
        </h1>
        <p
          className="hero-enter type-body mx-auto mt-6 max-w-2xl text-ink/70"
          style={{ "--enter-delay": "0.75s" } as CSSProperties}
        >
          We build the{" "}
          <span className="font-serif italic text-fern-deep">
            workflows, automations, sales systems, financial models, and agents
          </span>{" "}
          that run on it.
        </p>
        <div
          className="hero-enter mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ "--enter-delay": "1s" } as CSSProperties}
        >
          <a
            href={AUDIT_MAILTO}
            className="rounded-lg bg-fern px-6 py-3.5 text-sm font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
          >
            Start with the audit
          </a>
          <a
            href={CALL_MAILTO}
            className="rounded-lg border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-fern hover:text-fern-deep"
          >
            Set up a call
          </a>
        </div>
```

The "Built by people who have worked inside funds." paragraph is gone. Everything above that div (the `HeroCore`, veil, and edge fades) is untouched.

- [ ] **Step 4: Add the run intro sentence to ProductRun.tsx**

Directly after the run's `<h2>` inside the first `<Reveal>`, add:

```tsx
          <p className="type-body mt-5 max-w-2xl text-ink/70">
            The Core is built on agentic AI (AI that does the work, not just
            answers questions) and managed for you. Six things it does on a
            Thursday morning.
          </p>
```

This is the page's first use of "agentic AI", so it carries the definition.

- [ ] **Step 5: Write Stats.tsx and delete ProblemBand.tsx**

`src/components/Stats.tsx`:

```tsx
import Reveal from "./Reveal";

/* Both figures come from Max's fact-check ledger. The second citation is
   pending his reconciliation (his handoff note names Gallup; the source
   file names Microsoft and LinkedIn). A number without its printed source
   does not ship: if the ledger disagrees, pull the chip, never guess. */
const stats = [
  {
    figure: "75%",
    body: "of companies plan to deploy agentic AI within two years. Only 21% have mature governance for it.",
    source: "Deloitte, State of AI in the Enterprise, January 2026",
  },
  {
    figure: "78%",
    body: "of AI users bring their own tools to work, higher at small and mid-sized companies.",
    source: "Microsoft and LinkedIn, Work Trend Index, 2024",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="border-y border-ink/8">
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-2 sm:gap-14 sm:py-16">
        {stats.map((stat, i) => (
          <Reveal key={stat.figure} delay={i * 120}>
            <div>
              <p className="type-h2 text-fern-deep">{stat.figure}</p>
              <p className="mt-2 max-w-[40ch] leading-relaxed text-ink/75">{stat.body}</p>
              <p className="mt-3 text-xs text-warmgray">{stat.source}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

```bash
git rm src/components/ProblemBand.tsx
```

- [ ] **Step 6: Rewrite WhoItsFor.tsx**

```tsx
import Reveal from "./Reveal";

const industries = [
  "Manufacturing",
  "Healthcare",
  "Logistics",
  "Professional services",
  "Construction",
  "Private credit",
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-label text-fern-deep">Who it&apos;s for</p>
        <h2 className="type-h2 mt-3 max-w-3xl text-ink">
          Built for businesses that run on what they know.
        </h2>
        <p className="type-body mt-5 max-w-2xl text-ink/70">
          Arizona first. If your business runs on knowledge and judgment, the
          Core fits.
        </p>
        <p className="type-body mt-4 max-w-2xl text-ink/70">
          The platforms built for this sell multi-year enterprise contracts with
          no published price, no self-serve, and an implementation model that
          assumes an internal IT function you do not have. That gap is where we
          work.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <ul className="type-accent mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/8 pt-8 text-ink/80">
          {industries.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: Set the page order**

Replace `src/app/page.tsx` with:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProductRun from "@/components/product/ProductRun";
import BrainSection from "@/components/brain/BrainSection";
import WhoItsFor from "@/components/WhoItsFor";
import Stats from "@/components/Stats";
import Edge from "@/components/Edge";
import TimeBack from "@/components/TimeBack";
import HowWeStart from "@/components/HowWeStart";
import BeyondCore from "@/components/BeyondCore";
import Team from "@/components/Team";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProductRun />
      <BrainSection />
      <WhoItsFor />
      <Stats />
      <Edge />
      <TimeBack />
      <HowWeStart />
      <BeyondCore />
      <Team />
      <FinalCta />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 8: Build, run e2e, screenshot the hero at three widths**

Run: `npm run test:e2e`
Expected: all green.

```bash
node scripts/shot.mjs http://localhost:3000 1440 screenshots/hero-1440.png
node scripts/shot.mjs http://localhost:3000 1728 screenshots/hero-1728.png
node scripts/shot.mjs http://localhost:3000 390 screenshots/hero-390.png
```

The headline must fit in two lines at 1440 and three at 390 with the serif italic list readable against the veil at every width (the hero overlay contrast is viewport-dependent).

- [ ] **Step 9: Commit**

```bash
git add -A src/components src/app/page.tsx tests/e2e/site.test.ts
git commit -m "feat: new hero copy, the stats band, a static audience section, and the page order

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Why Crosswell, What a business actually loses, How we start, Beyond Core

**Files:**
- Modify: `src/components/Edge.tsx`, `src/components/TimeBack.tsx`, `src/components/HowWeStart.tsx`, `src/components/BeyondCore.tsx`
- Test: `tests/e2e/site.test.ts`

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("company half, middle", () => {
  it("carries the Gen 6 copy in the right order", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        why: await page.locator("#why-crosswell h2").textContent(),
        cards: await page.locator("#why-crosswell h3").allTextContents(),
        loses: await page.locator("#what-you-lose h2").textContent(),
        firstSink: await page.locator("#what-you-lose .type-accent").first().textContent(),
        worthMore: await page.getByText("And a firm that keeps its memory is worth more").count(),
        audit: await page.getByText("Where every firm starts").count(),
        beyond: await page.locator("#beyond-core h3").allTextContents(),
      };
    });
    expect(r.why).toContain("Off the shelf fits nobody");
    expect(r.cards).toEqual(["Built around your work", "We sell trust", "You work directly with us"]);
    expect(r.loses).toContain("What a business actually loses");
    expect(r.firstSink).toContain("departing employee");
    expect(r.worthMore).toBe(1);
    expect(r.audit).toBe(1);
    expect(r.beyond).toEqual(["Custom tools and automations", "The support layer"]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL on `why`.

- [ ] **Step 3: Edge.tsx**

Replace the `points` array and the h2:

```tsx
const points = [
  {
    title: "Built around your work",
    body: "We start by learning how your team actually operates, then build the Core and the tools around that. No forcing your business through someone else's template, and no features nobody asked for.",
  },
  {
    title: "We sell trust",
    body: "Time saved is the easy part; any AI tool can promise it. What gets scarcer as agentic AI spreads is trust, and we built the company around protecting it. We put that in writing.",
  },
  {
    title: "You work directly with us",
    body: "No account managers, no ticket queues. The people who designed your Core are the people who answer when something needs attention.",
  },
];
```

```tsx
          <h2 className="type-h2 max-w-3xl text-ink">
            Off the shelf fits nobody. So we do not sell it.
          </h2>
```

The label, the blockquote ("When someone leaves, their knowledge does not. Every meeting, decision, and deal, remembered."), and the layout stay.

- [ ] **Step 4: TimeBack.tsx**

Replace the file's data and copy (layout unchanged, add the section id):

```tsx
import Reveal from "./Reveal";

/* Retention leads, hours land last (Website Direction v6, section 7). */
const sinks = [
  {
    pain: "The context a departing employee walks out with",
    fix: "stays in the firm forever.",
  },
  {
    pain: "The new hire's six months of catching up",
    fix: "becomes day one with the whole firm's memory.",
  },
  {
    pain: "The answer buried in a March email thread",
    fix: "comes back in seconds, with the thread attached.",
  },
  {
    pain: "The weekly report that eats four hours",
    fix: "runs itself. You get the four hours back.",
  },
];

export default function TimeBack() {
  return (
    <section id="what-you-lose" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="type-label mb-4 text-fern-deep">The value</p>
          <h2 className="type-h2 text-ink">What a business actually loses.</h2>
          <p className="type-body mt-5 text-ink/70">
            Almost everything your business knows never gets written down. It
            is scattered across inboxes, call recordings, files nobody opens
            again, and a few people&apos;s heads. You paid for all of it once.
            Most of it you never use twice. We take that whole pile, connect
            it, and put it back to work.
          </p>
        </Reveal>

        <div className="flex flex-col divide-y divide-ink/8">
          {sinks.map((sink, i) => (
            <Reveal key={sink.pain} delay={i * 110}>
              <div className="py-6 first:pt-0 last:pb-0">
                <p className="type-accent text-ink">
                  {sink.pain}{" "}
                  <span className="italic text-fern-deep">{sink.fix}</span>
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={480}>
            <p className="pt-6 leading-relaxed text-ink/70">
              The hours aren&apos;t the point. They go back where trust gets
              built: your people, in front of your customers.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              And a firm that keeps its memory is worth more. When an acquirer,
              investor, or auditor looks in, everything is in one place: every
              project, every decision, every reason why.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: HowWeStart.tsx**

Add a `note` to the audit card and render it. The `engagements` array becomes:

```tsx
const engagements = [
  {
    title: "The knowledge audit",
    body: "Two weeks, fixed scope. We map where your firm's information gets dropped and what it costs you. You keep the map either way.",
    note: "Where every firm starts",
  },
  {
    title: "The Core install",
    body: "Your firm's memory, provisioned, secured, and handed over running, your team onboarded.",
  },
  {
    title: "Core plus the custom layer",
    body: "We design, build, and run the agentic tools your firm names, on top of the Core.",
  },
];
```

and inside the card, after the body paragraph:

```tsx
                {engagement.note && (
                  <p className="mt-4 text-xs font-medium text-fern-deep">{engagement.note}</p>
                )}
```

Everything else in the file stays (the section already has `id="how-we-start"`).

- [ ] **Step 6: BeyondCore.tsx**

Add `id="beyond-core"` to the section and replace the intro paragraph and the `offerings` array:

```tsx
const offerings = [
  {
    title: "Custom tools and automations",
    body: "Instant answers, document review, report drafting, dashboards. Whatever painful workflow your team names, we build it on top of the Core so it runs with full firm context.",
  },
  {
    title: "The support layer",
    body: "A hands-on retainer. If something breaks, we fix it. As new needs surface, we keep automating. Your technology keeps improving without a hire.",
  },
];
```

```tsx
          <p className="type-body mt-5 text-ink/70">
            Lean firms stay lean on purpose. You will never hire an in-house
            engineering team, and you should not have to.
          </p>
```

- [ ] **Step 7: Build and run e2e**

Run: `npm run test:e2e`
Expected: `company half, middle` passes.

- [ ] **Step 8: Commit**

```bash
git add src/components tests/e2e/site.test.ts
git commit -m "feat: general-market copy for Why Crosswell, the value, how we start, and beyond Core

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: Values, Team, Insights, Footer

**Files:**
- Create: `src/components/Values.tsx`, `src/components/Insights.tsx`
- Modify: `src/components/Team.tsx`, `src/components/Footer.tsx`, `src/app/page.tsx`
- Test: `tests/e2e/site.test.ts`

**Interfaces:**
- Produces: `Values`, `Insights` (default exports); the final page order.

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("company half, bottom", () => {
  it("carries the values, the new bios, the Insights slot, and the footer line", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        vision: await page.getByText("To become the most sought after name in agentic AI").count(),
        values: await page.locator("#values h3").allTextContents(),
        costs: await page.locator("#values").getByText("What it costs").count(),
        headings: await page.locator("#values h2").count(),
        stewardship: await page.getByText("leaves with you in open files on the day you go").count(),
        roles: await page.locator("#team .text-fern-deep.text-sm").allTextContents(),
        insights: await page.locator("#insights h2").textContent(),
        posts: await page.locator("#insights article").count(),
        footer: await page.locator("footer").textContent(),
        order: await page.evaluate(() =>
          [...document.querySelectorAll("main section[id]")].map((s) => s.id)
        ),
      };
    });
    expect(r.vision).toBe(1);
    expect(r.values).toEqual(["Trust", "Stewardship", "Continuity"]);
    expect(r.costs).toBe(3);
    expect(r.headings).toBe(0);
    expect(r.stewardship).toBe(1);
    expect(r.roles).toEqual(["Business & Strategy", "Software & Engineering", "Finance & Operations"]);
    expect(r.insights).toBe("Insights");
    expect(r.posts).toBe(0);
    expect(r.footer).toContain("Custom agentic AI, built around how your team actually works. Arizona.");
    expect(r.order).toEqual([
      "top", "how-it-works", "the-brain", "who-its-for", "stats", "why-crosswell",
      "what-you-lose", "how-we-start", "beyond-core", "values", "team", "insights",
    ]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, `vision` is 0.

- [ ] **Step 3: Write Values.tsx**

```tsx
import Reveal from "./Reveal";

/* The locked foundation, in business language, without a "Mission" or
   "Vision" heading. Each value names what it costs; that line is the
   whole reason it reads as true rather than as marketing. */
const values = [
  {
    name: "Trust",
    line: "It is what we actually sell, and it is earned in the moments that cost us.",
    cost: "The best answer for a client is sometimes a tool they can buy for a fraction of our fee, and sometimes it is nothing at all. We say so, and we lose the work.",
  },
  {
    name: "Stewardship",
    line: "What we hold is never ours.",
    cost: "What your business knows leaves with you in open files on the day you go. That forfeits the switching costs most software firms are built on. We forfeit them deliberately.",
  },
  {
    name: "Continuity",
    line: "The people who build it are the people who answer.",
    cost: "No account managers, no handoffs. This limits how quickly we can grow, and we accept the limit.",
  },
];

export default function Values() {
  return (
    <section id="values" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-accent max-w-3xl text-ink">
          To become the most sought after name in agentic AI by setting the
          standard for what a partner should be.
        </p>
        <p className="type-body mt-5 max-w-2xl text-ink/70">
          That is what we are building toward. What we do every day is simpler:
          we help businesses become AI native.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        {values.map((value, i) => (
          <Reveal key={value.name} delay={i * 120}>
            <div>
              <div className="mb-4 h-px w-10 bg-fern" />
              <h3 className="type-h3 text-ink">{value.name}</h3>
              <p className="mt-2.5 leading-relaxed text-ink/80">{value.line}</p>
              <p className="mt-4 text-xs font-medium text-fern-deep">What it costs</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{value.cost}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write Insights.tsx**

```tsx
import Reveal from "./Reveal";

/* A held slot. The blog and its post cards are a separate brief; nothing
   here links anywhere yet. */
export default function Insights() {
  return (
    <section id="insights" className="border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="type-label text-fern-deep">From the desk</p>
          <h2 className="type-h2 mt-3 text-ink">Insights</h2>
          <p className="type-body mt-5 max-w-2xl text-ink/70">
            What we are learning building company memory for teams that run on
            what they know. First pieces in editing now, publishing this fall.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Team.tsx copy**

Replace the `team` array entries' `role` and `line` fields and the two intro paragraphs:

```tsx
const team = [
  {
    name: "Max Marohn",
    role: "Business & Strategy",
    photo: "/team-max.jpg",
    altPhoto: "/team-max-alt.jpg",
    line: "Finds the problem, owns the relationship, and makes sure what we build actually solves it. Your first call and your last one.",
  },
  {
    name: "Bridger Davidson",
    role: "Software & Engineering",
    photo: "/team-bridger.jpg",
    altPhoto: "/team-bridger-alt.jpg",
    line: "Builds the Core and everything that runs on it: the tools, the integrations, the automations. The engineering arm of the operation.",
  },
  {
    name: "Michael Zamora",
    role: "Finance & Operations",
    photo: "/team-michael.jpg",
    altPhoto: "/team-michael-alt.jpg",
    line: "Runs the numbers and the operations behind Crosswell, and keeps every build honest about what it costs and what it returns.",
  },
];
```

```tsx
          <h2 className="type-h2 max-w-2xl text-ink">Three people. One team.</h2>
          <p className="type-body mt-5 max-w-2xl text-ink/70">
            Small is deliberate. You work directly with the three people who
            build and run your Core, not an account manager standing between
            you and the work.
          </p>
```

(The second live paragraph is removed. The easter-egg code, the flip markup, and the card chrome are untouched.)

- [ ] **Step 6: Footer.tsx line**

```tsx
          <p className="max-w-xs text-xs text-ivory/50">
            Custom agentic AI, built around how your team actually works. Arizona.
          </p>
```

- [ ] **Step 7: Insert Values and Insights in page.tsx**

Add the imports and place `<Values />` after `<BeyondCore />` and `<Insights />` after `<Team />`:

```tsx
import Values from "@/components/Values";
import Insights from "@/components/Insights";
```

```tsx
      <BeyondCore />
      <Values />
      <Team />
      <Insights />
      <FinalCta />
```

- [ ] **Step 8: Build, run e2e, screenshot the company half**

Run: `npm run test:e2e`
Expected: `company half, bottom` passes.

Full-page screenshots at 1440 and 390 (`company-*.png`). Check the Values section reads as three columns with the cost lines aligned, Team unchanged apart from copy, Insights a quiet slot, and no section heading that says Mission or Vision.

- [ ] **Step 9: Commit**

```bash
git add src/components src/app/page.tsx tests/e2e/site.test.ts
git commit -m "feat: values with their cost lines, Crosswell-role bios, the Insights slot, footer line

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 16: Site metadata, structured data, robots, sitemap, and the social image

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `scripts/og-image.mjs`, `public/og-image.jpg`
- Test: `tests/e2e/site.test.ts`

- [ ] **Step 1: Append the failing e2e test**

```ts
describe("metadata", () => {
  it("ships canonical, Open Graph, Twitter, JSON-LD, robots, and sitemap", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const head = await page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
        twitter: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
        ld: document.querySelector('script[type="application/ld+json"]')?.textContent,
      }));
      const robots = await (await page.request.get(`${site.url}/robots.txt`)).text();
      const sitemap = await (await page.request.get(`${site.url}/sitemap.xml`)).text();
      const og = await page.request.get(`${site.url}/og-image.jpg`);
      return { ...head, robots, sitemap, ogStatus: og.status() };
    });
    expect(r.canonical).toBe("https://crosswellconsulting.com/");
    expect(r.ogTitle).toContain("The operating layer your business actually runs on");
    expect(r.ogImage).toContain("/og-image.jpg");
    expect(r.twitter).toBe("summary_large_image");
    expect(JSON.parse(r.ld ?? "{}")["@type"]).toBe("Organization");
    expect(r.robots).toMatch(/Allow: \//);
    expect(r.robots).toContain("sitemap.xml");
    expect(r.sitemap).toContain("https://crosswellconsulting.com");
    expect(r.ogStatus).toBe(200);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL, canonical is undefined.

- [ ] **Step 3: Metadata and JSON-LD in layout.tsx**

Replace the `metadata` export with:

```tsx
const SITE = "https://crosswellconsulting.com";
const TITLE = "Crosswell | The operating layer your business actually runs on";
/* New copy, pending Max (spec section 12, item 7). */
const DESCRIPTION =
  "Crosswell builds custom agentic AI around how your team actually works. The Core is the memory and operating layer your business runs on, and the workflows, automations, and agents we build run on it. Arizona.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Crosswell Consulting",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Crosswell" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Crosswell Consulting",
  url: SITE,
  logo: `${SITE}/xw-h-lockup-dark.svg`,
  description: DESCRIPTION,
  areaServed: "US",
};
```

and inside `<head>`, after the `.js` script:

```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
```

- [ ] **Step 4: robots.ts and sitemap.ts**

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://crosswellconsulting.com/sitemap.xml",
  };
}
```

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://crosswellconsulting.com/", changeFrequency: "monthly", priority: 1 },
  ];
}
```

- [ ] **Step 5: The social image script**

`scripts/og-image.mjs`:

```js
// Renders public/og-image.jpg (1200 by 630) from the brand kit with cleared
// language only. Usage: npm run og
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const lockup = readFileSync("public/xw-h-lockup-dark.svg", "utf8");
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400&family=Instrument+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;
    background:#f1eee6;color:#1a1915;font-family:'Instrument Sans',system-ui,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between}
  .lockup svg{height:40px;width:auto}
  h1{font-family:Newsreader,Georgia,serif;font-weight:400;font-size:66px;line-height:1.05;
    letter-spacing:-.02em;margin:0;max-width:960px}
  p{margin:0;font-size:22px;color:rgba(26,25,21,.6)}
</style></head><body>
<div class="lockup">${lockup}</div>
<h1>The operating layer your business actually runs on.</h1>
<p>Custom agentic AI, built around how your team actually works. Arizona.</p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og-image.jpg", type: "jpeg", quality: 90 });
await browser.close();
console.log("wrote public/og-image.jpg");
```

Run: `npm run og`
Expected: `wrote public/og-image.jpg`. Open it: ivory ground, the lockup top-left, the headline in Newsreader, the footer line under it.

- [ ] **Step 6: Build and run e2e**

Run: `npm run test:e2e`
Expected: `metadata` passes.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/robots.ts src/app/sitemap.ts scripts/og-image.mjs public/og-image.jpg tests/e2e/site.test.ts
git commit -m "chore: canonical, Open Graph, Twitter card, Organization schema, robots, sitemap, social image

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 17: The design-system doc, repo docs, the copy guard on src, and final verification

**Files:**
- Create: `docs/design-system.md`
- Modify: `README.md`, `CLAUDE.md`
- Test: `tests/e2e/site.test.ts`, `npm run check:copy`

- [ ] **Step 1: Append the failing no-JS, reduced-motion, and overflow tests**

```ts
describe("resilience", () => {
  it("shows every chapter finished without JavaScript", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return {
          greeting: await page.getByText("Good morning, Morgan.").first().isVisible(),
          captions: await page.getByText("Interactive demo · Sample data").count(),
          answer: await page.getByText("Four flags. The one that matters").isVisible(),
        };
      },
      { js: false }
    );
    expect(r.greeting).toBe(true);
    expect(r.captions).toBe(6);
    expect(r.answer).toBe(true);
  });

  it("shows reveals immediately under reduced motion", async () => {
    const opacity = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.locator(".reveal").last().evaluate((el) => getComputedStyle(el).opacity);
      },
      { reducedMotion: true }
    );
    expect(opacity).toBe("1");
  });

  it("never scrolls horizontally on a phone", async () => {
    const overflow = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(
          () => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth
        );
      },
      { width: 390 }
    );
    expect(overflow).toBe(0);
  });
});
```

- [ ] **Step 2: Run the whole suite and the copy guard**

Run: `npm run test:e2e && npm test && npm run check:copy`
Expected: everything passes and the guard prints `copy guard: clean (src)`. If the guard reports a hit, fix the line it names (the rules are in the Global Constraints), never the guard.

- [ ] **Step 3: Write docs/design-system.md**

```markdown
# Crosswell landing site: design system

The reference the design loop's system critic judges against. Every line is
checkable by looking at rendered output. Source of truth for tokens is
`src/app/globals.css`; source of truth for intent is
`docs/superpowers/specs/2026-09-12-general-market-redesign-design.md`.

## Palette (locked, Fern)

| Token | Hex | Use |
|---|---|---|
| ivory | #f1eee6 | the page |
| parchment | #faf8f2 | bands and product panels |
| fern | #4e7a4e | the one accent: buttons, marks, sparklines |
| fern-deep | #3d633d | accent text on light ground |
| fern-soft | #93b393 | accent on dark ground |
| fern-wash | #e4ead8 | soft accent fill, chips |
| warm gray | #b8b2a7 | hairlines at 30% alpha, muted text |
| charcoal | #3d3a34 | dark panels |
| charcoal-deep | #34312c | dark bands |
| ink | #1a1915 | text |

No other hue on the page, ever. Chapter 06's alternate brand colors are
variables scoped to that fragment's root. No amber, no red, no blue.

## Type

- Serif: Newsreader. Display, h2, accent lines, the closing bookend, and
  inside the product for the greeting and panel titles only.
- Sans: Instrument Sans. Everything else, page and product. Tabular
  numerals on inside the product.
- Section label: 14px, medium, sentence case, fern-deep, optional two-digit
  index in the product run. No uppercase anywhere on the page.
- Scale: type-display, type-h2, type-h3, type-accent, type-body as defined
  in globals.css. Inside the product: numbers 26px, UI 13px, labels 12px,
  panel titles 20px serif. Nothing below 12px.

## Materials

- Content cards: rounded-2xl, border warm gray 40%, shadow-whisper, hover
  shadow-lifted. These are the only shadows on the page.
- Product fragments: parchment shell on ivory, hairline warm gray 30%,
  radius 1rem, no shadow inside or around, one accent per panel. The dark
  chapter: charcoal shell on charcoal-deep, ivory text, fern-soft accent.
- Fragments are cut by a fixed-height frame; cut edges dissolve into the
  page with a mask gradient (double stops). The content edge stays crisp.
  Fragments render at real scale; nothing is scaled down. Below 768px a
  frame crops to a single column.
- Inside a frame the only text is what the product would show its own
  user. No informational pills, headers, captions, or feature labels
  inside a frame. Every description sits outside: the claim, the body, the
  caption "Interactive demo · Sample data".

## Motion

- Curve: cubic-bezier(0.22, 1, 0.36, 1). Entrances 0.6 to 0.9s. Staggers
  60 to 90ms. Nothing under 300ms except hover (150 to 200ms).
- Scroll reveals trigger with the block's top at about 70% of the viewport,
  once. Sequences play once and offer a small "Replay" outside the frame.
- Reduced motion and no-JS both get the finished state of everything.
- Nothing loops except the hero rotation and a running agent's progress.

## Layout

- Content width max-w-6xl (1152px), gutters px-6. Split sections use the
  0.9fr / 1.1fr grid. Section rhythm py-24 (sm: py-32).
- Two dark moments only: the chat chapter and the closing CTA.
- Verify at 1440, 1728, and 390 before calling a piece done.

## Copy rules the critic can see

No em dashes. No uppercase. "the Core", never bare "Core". No "brain" or
"mind". No logos; tool names in plain text. Every stat carries a printed
source. No security, hosting, or compliance claims.
```

- [ ] **Step 4: Update README.md and CLAUDE.md**

In `README.md`, replace the `## Page order` block with:

```markdown
## Page order (2026-09-12 general-market redesign)

Nav, Hero, the product run (six chapters: Today, Agenda, the Core chat on the dark band, Pipeline, Agents, Your brand), Behind the chat (brain map), Who it's for, Stats, Why Crosswell, What a business actually loses, How we start, Beyond Core, Values, Team, Insights (held slot), Final CTA (dark), Footer.

Spec: `docs/superpowers/specs/2026-09-12-general-market-redesign-design.md`. Plan: `docs/superpowers/plans/2026-09-12-general-market-redesign.md`. The Security section, the GSAP dashboard tour, and the audience marquee were removed in this pass; the fictional Saguaro dataset every chapter reads from is `src/lib/saguaro.ts`. Chapter choreography lands through the design loop, not this plan.
```

In the `## Locked design decisions` list, change the type bullet to read "Newsreader (editorial serif, headlines) + Instrument Sans (sans, body, UI, and inside the product; replaced Schibsted Grotesk 2026-09-12, which read too default in the nav). Section labels are sentence case; nothing on the page is uppercase."

In `CLAUDE.md`:
- Replace the `## Current focus: the hero` section with:

```markdown
## Current focus: the general-market redesign

The site moved off funds to a general market in September 2026 and became product-led: a run of six dashboard chapters in Linear's model, restyled to this site's editorial materials. The spec is `docs/superpowers/specs/2026-09-12-general-market-redesign-design.md` and the design-system reference is `docs/design-system.md`. The plumbing plan ships every chapter's finished state; choreography and polish run through the user-level `design-loop` skill piece by piece. GSAP is installed and is the one motion library.

Inside a product frame, the only text allowed is what the product would show its own user. Everything descriptive lives outside the frame.
```

- In `## Voice & content rules`, add: "No uppercase text anywhere. Section labels are sentence case." and "No security, compliance, or hosting claims."
- In `## Stack & run`, add `npm test`, `npm run test:e2e`, and `npm run check:copy` lines to the code block.

- [ ] **Step 5: Final screenshots at three widths, and the phone check**

```bash
node scripts/shot.mjs http://localhost:3000 1440 screenshots/final-1440.png --full
node scripts/shot.mjs http://localhost:3000 1728 screenshots/final-1728.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/final-390.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/final-390-rm.png --full --reduced-motion
```

Open all four. Then open the dev URL on a real phone and scroll the whole page: the status bar goes dark over the chat band and the closing CTA and returns to ivory elsewhere; no frame causes sideways scroll.

- [ ] **Step 6: Commit and open the PR**

```bash
git add docs/design-system.md README.md CLAUDE.md tests/e2e/site.test.ts
git commit -m "docs: design-system reference, page order, and the redesign focus

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push -u origin redesign/general-market
```

Open a PR against `main` titled "General-market redesign: plumbing and finished states" whose body lists the spec, the removals, the six chapters, the clearance ledger below, and the note that choreography follows through the design loop. End the body with:

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Do not merge. The design-loop runs happen on this branch before it lands.

---

## Appendix: clearance ledger

Tags per spec section 3. Max's single checklist is every Gen 6 and New line.

| Where | Line | Tag |
|---|---|---|
| Nav | Link labels | Cleared |
| Hero | "The operating layer your business actually runs on." | Gen 6 |
| Hero | "We build the workflows, automations, sales systems, financial models, and agents that run on it." | Gen 6, made static |
| Hero | "Crosswell Core" label, both CTAs | Cleared |
| Run intro | "You're not talking to a chatbot. You're talking to your firm's memory." | Cleared |
| Run intro | "The Core is built on agentic AI (AI that does the work, not just answers questions) and managed for you. Six things it does on a Thursday morning." | New |
| Chapter 01 | "Your morning, already assembled." and body | New |
| Chapter 02 | "One list, and the whole team is on it." and body | New |
| Chapter 03 | "Ask it anything the business has written down. It answers with receipts." | New (first clause Gen 6) |
| Chapter 03 | "Every answer shows its work..." | Cleared, gate lifted in session |
| Chapter 04 | "Every client, every stage, and the whole history one click away." and body | New |
| Chapter 05 | "Each one has a single job. They run while you don't." and body | New |
| Chapter 06 | "It looks like your company, not ours." | New |
| Chapter 06 | "Your name, your colors, every screen." | Cleared, gate lifted in session |
| Chapters | Everything inside the frames | Demo |
| Run | "Interactive demo · Sample data", the fictional line | Cleared (demo rules) |
| Brain | All copy | Cleared |
| Who it's for | Heading, Arizona line, platforms-gap paragraph, industries | Gen 6 |
| Stats | Both chips | Gen 6, citations pending the ledger |
| Why Crosswell | "Off the shelf fits nobody. So we do not sell it." | Gen 6 |
| Why Crosswell | "Built around your work" card | Gen 6 |
| Why Crosswell | "We sell trust", "You work directly with us", blockquote | Cleared |
| The value | "What a business actually loses." and intro paragraph | Gen 6 |
| The value | Four sinks, hours close, worth-more sentence | Cleared (employee for analyst: Gen 6) |
| How we start | All copy | Cleared; "Where every firm starts" Gen 6 |
| Beyond Core | Heading, intro, two cards | Cleared; "Instant answers, document review, report drafting, dashboards" Gen 6 |
| Values | Vision line, three values, Trust and Continuity cost lines | Gen 6 (locked wording) |
| Values | Stewardship cost line | New |
| Values | "That is what we are building toward..." | Gen 6 |
| Team | "Three people. One team." and intro | Gen 6 |
| Team | Max and Michael bios, Michael's role | Gen 6 |
| Team | Bridger bio | Cleared |
| Insights | Heading and intro | Gen 6 |
| Closing | All copy | Cleared |
| Footer | "Custom agentic AI, built around how your team actually works. Arizona." | Gen 6 |
| Metadata | Title | Gen 6 (headline) |
| Metadata | Description | New |
