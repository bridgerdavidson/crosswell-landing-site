# Behind the chat brain-map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new ivory landing-page section, "Behind the chat," where the dashboard tour's wire-approval note drops into a free-form floating knowledge graph and connects to what it touches, making the firm's institutional memory legible.

**Architecture:** A deterministic graph model (`graph-data.ts`) feeds two renderers: a server-rendered static SVG (`BrainStill`, the no-JS / reduced-motion fallback) and an HTML5 canvas engine (`BrainField`, the animated floating physics). A GSAP-driven DOM card (`NoteCard`) plays the readable capture/sort/inject beats over the canvas. The tour and this section share one note via `src/lib/core-note.ts`.

**Tech Stack:** Next.js 15 (App Router, `output: "export"`), React 19, TypeScript, Tailwind v4 (CSS-first, tokens in `globals.css`), GSAP + `@gsap/react` (already installed), HTML5 canvas. No new dependencies. Verification via Playwright (already in `node_modules`) + `npm run build`.

## Global Constraints

Copied verbatim from the spec; every task inherits these.

- **No em dashes. Ever.** Use middots (`·`), commas, periods.
- **Palette only.** No hex outside the Fern tokens (`--color-ivory #f1eee6`, `--color-parchment #faf8f2`, `--color-fern #4e7a4e`, `--color-fern-deep #3d633d`, `--color-fern-soft #93b393`, `--color-fern-mist #e4e9e0`, `--color-warmgray #b8b2a7`, `--color-charcoal #3d3a34`, `--color-ink #1a1915`) plus the raised-card tone `#24221c` already used by the tour. Node RGBs are these tokens in RGB form.
- **No box, no vault, no lock, no security copy** in this section. Security storytelling stays in the `Trust` section.
- **No client names, no usage metrics, no fabricated numbers.** The `Illustrative.` caption renders near the graph.
- **The note text is byte-identical to the tour's**, enforced by importing from `src/lib/core-note.ts`. The tour must render exactly as before after the refactor.
- **Static export intact.** Do NOT edit `vercel.json`, `next.config`, or add `installCommand`/`buildCommand`/`outputDirectory`. The canvas is client-only and degrades to the SSR SVG.
- **Reduced-motion and no-JS must show the settled static SVG brain** (note connected), no Replay, no card.
- **Type roles:** headline uses `type-h2` (serif), kicker/body use the existing `type-*` / sans classes. `type-display` stays reserved for the hero and final CTA.
- **Deterministic layout:** fixed PRNG seed; no `Math.random` for layout at runtime.

## Verification harness (used by every task)

There is no unit-test runner in this repo; the tour was verified with Playwright + build, and this plan follows that. Save this script once to the scratchpad and reuse it, editing `URL`, waits, and assertions per task.

Save as `/private/tmp/brain-verify.mjs`:

```js
import pw from '/Users/bridgerdavidson/Builds/crosswell-landing-site/node_modules/playwright/index.js';
const { chromium } = pw;
const URL = process.env.URL || 'http://localhost:3000';
const OUT = process.env.OUT || '/private/tmp';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
async function run(name, { width=1440, height=900, reduce=false } = {}, fn) {
  const ctx = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:2, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m)=>{ if(m.type()==='error') errs.push(m.text()); });
  page.on('pageerror', (e)=>errs.push('PAGEERROR: '+e.message));
  await page.goto(URL, { waitUntil:'networkidle' });
  await wait(800);
  if (fn) await fn(page);
  console.log(name, 'errors:', JSON.stringify(errs));
  await ctx.close();
}
export { run, wait };
```

Then per task, a tiny driver imports `run` and does scrolling/screenshots/DOM assertions. Dev server: `npm run dev` (usually port 3000, but another Next app sometimes holds it; read the printed "Local:" line and set `URL` to the real port). `npm run build` must pass (it type-checks and statically exports).

---

### Task 1: Shared note module + tour refactor

Centralize the wire-approval note so this section and the tour cannot drift. The tour must render identically after.

**Files:**
- Create: `src/lib/core-note.ts`
- Modify: `src/components/core-dashboard/AddView.tsx`
- Modify: `src/components/core-dashboard/LibraryView.tsx`
- Verify: Playwright screenshot of the tour + `npm run build`

**Interfaces:**
- Produces: `CORE_NOTE` object with fields `sourceLabel: string`, `noteLabel: string`, `summary: string`, `context: string`, `tags: string[]`, `filedLinked: string`, `linkedTo: string`, `raw: string[]`. Consumed by Task 5's `NoteCard` and by the tour views here.

- [ ] **Step 1: Create the shared module**

Create `src/lib/core-note.ts`:

```ts
// The one wire-approval note, shared by the dashboard tour and the brain-map
// section so the "same note" is enforced in code. No em dashes; middots only.
export const CORE_NOTE = {
  sourceLabel: "Meeting transcript · Wire approval policy",
  noteLabel: "Policy note · Wire approvals",
  summary:
    "Any wire over $250k requires sign-off from both a managing partner and operations.",
  context: "Context: a near miss in March with a mistyped account number.",
  tags: ["Operations", "Policy", "April"] as const,
  filedLinked: "Filed in Operations · Linked to Ops meeting · Mar 28",
  linkedTo: "Ops meeting · Mar 28",
  // Raw transcript excerpt, only used by the brain-map capture card.
  raw: [
    "...so on wires, anything over 250 we said two sign offs, a managing partner and ops, no exceptions...",
    "...right, after the March thing with the mistyped account number. document the reasoning so it sticks.",
  ],
} as const;
```

- [ ] **Step 2: Refactor `AddView.tsx` to use it**

Replace the hard-coded source label and tags. Change the import line and the two spots:

Import (add under the existing import on line 1):
```tsx
import { IconCheck, TagChip } from "./shared";
import { CORE_NOTE } from "@/lib/core-note";
```

Replace the feed title (lines 33-35):
```tsx
          <p className="text-xs font-semibold text-ivory/90">
            {CORE_NOTE.sourceLabel}
          </p>
```

Replace the three tag chips (lines 44-46) with a map:
```tsx
          {CORE_NOTE.tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
```

- [ ] **Step 3: Refactor `LibraryView.tsx` to use it**

Import:
```tsx
import { TagChip } from "./shared";
import { CORE_NOTE } from "@/lib/core-note";
```

Replace both `Policy note · Wire approvals` literals (lines 16, 31) with `{CORE_NOTE.noteLabel}`. Replace the summary span (line 39) with `{CORE_NOTE.summary}`, the context line (line 43) with `{CORE_NOTE.context}`, the filed/linked line (line 46) with `{CORE_NOTE.filedLinked}`, and the three tag chips (lines 49-51) with:
```tsx
          {CORE_NOTE.tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
```

- [ ] **Step 4: Build to type-check**

Run: `npm run build`
Expected: build completes, `out/` written, no TypeScript errors. (`@/` maps to `src/`, already configured.)

- [ ] **Step 5: Verify the tour is visually unchanged**

Start dev (`npm run dev`, note the port). Save this driver to `/private/tmp/t1.mjs` and run `node /private/tmp/t1.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
await run('tour', {}, async (page) => {
  await page.evaluate(() => document.querySelector('#how-it-works')?.scrollIntoView());
  await wait(9000); // let the tour reach the library beat
  await page.screenshot({ path: '/private/tmp/t1-tour.png' });
});
process.exit(0);
```
Expected: console `tour errors: []`; open `/private/tmp/t1-tour.png` and confirm the Library view still shows "Policy note · Wire approvals", the summary, context, "Filed in Operations · Linked to Ops meeting · Mar 28", and the three tags, exactly as before.

- [ ] **Step 6: Commit**

```bash
git add src/lib/core-note.ts src/components/core-dashboard/AddView.tsx src/components/core-dashboard/LibraryView.tsx
git commit -m "refactor: extract the shared wire-approval note into core-note.ts"
```

---

### Task 2: Deterministic graph model + static SVG still

The pure graph model and the server-rendered fallback. Delivers a visible, static brain even before any animation.

**Files:**
- Create: `src/components/brain/graph-data.ts`
- Create: `src/components/brain/BrainStill.tsx`
- Verify: Playwright DOM assertions + screenshot + `npm run build`

**Interfaces:**
- Produces from `graph-data.ts`: `type Density`, `interface GNode`, `interface GEdge`, `interface Graph`, `buildGraph(density: Density): Graph`, `clusterCenter(ci, W, H, t, motion)`, `nodeHome(n, W, H, t, motion)`, `settled(n, W, H)`, `curveControl(ax, ay, bx, by)`, `nodeSize(n)`, `nodeAlpha(n)`, and constants `CLUSTERS`, `CALM`, `STILL_W`, `STILL_H`. Consumed by `BrainStill` (this task) and `BrainField` (Tasks 4-5).

- [ ] **Step 1: Write the graph model**

Create `src/components/brain/graph-data.ts`:

```ts
export type RGB = [number, number, number];
export type Density = "sparse" | "medium" | "dense";

export interface ClusterCfg {
  key: string; label: string; color: RGB;
  fx: number; fy: number; n: number; spread: number;
  dx: number; dy: number; ph: number;
}

// Locked in the look lab: five area-clusters pulled toward the middle.
export const CLUSTERS: ClusterCfg[] = [
  { key: "deals",      label: "Deals",      color: [61, 99, 61],    fx: 0.365, fy: 0.395, n: 10, spread: 0.108, dx: 0.11, dy: 0.14, ph: 0.3 },
  { key: "investors",  label: "Investors",  color: [61, 58, 52],    fx: 0.665, fy: 0.375, n: 9,  spread: 0.096, dx: 0.13, dy: 0.10, ph: 1.7 },
  { key: "people",     label: "People",     color: [184, 178, 167], fx: 0.360, fy: 0.640, n: 10, spread: 0.108, dx: 0.10, dy: 0.13, ph: 2.9 },
  { key: "meetings",   label: "Meetings",   color: [147, 179, 147], fx: 0.510, fy: 0.520, n: 13, spread: 0.120, dx: 0.14, dy: 0.11, ph: 4.1 },
  { key: "operations", label: "Operations", color: [78, 122, 78],   fx: 0.650, fy: 0.615, n: 10, spread: 0.108, dx: 0.12, dy: 0.15, ph: 5.2 },
];

const DENS: Record<Density, number> = { sparse: 0.7, medium: 1.1, dense: 1.85 };
export const CALM = 0.5;        // locked motion factor
export const DEPTH = 0.30;      // locked "minimal" depth
export const SEED = 424242;
export const STILL_W = 1000;
export const STILL_H = 560;

export interface GNode {
  id: number; ci: number; color: RGB; hub: boolean; note: boolean;
  offA: number; offR: number; z: number; r: number; ph: number; dir: number;
}
export interface GEdge { a: number; b: number; inter: boolean; }
export interface Graph { nodes: GNode[]; edges: GEdge[]; lit: GEdge[]; noteIndex: number; }

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildGraph(density: Density): Graph {
  const rnd = mulberry32(SEED);
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const lit: GEdge[] = [];
  const ids: number[][] = CLUSTERS.map(() => []);
  CLUSTERS.forEach((c, ci) => {
    const count = Math.max(6, Math.round(c.n * DENS[density]));
    const hubId = nodes.length;
    nodes.push({ id: hubId, ci, color: c.color, hub: true, note: false, offA: 0, offR: 0, z: 0.78, r: 9.5, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
    ids[ci].push(hubId);
    for (let i = 0; i < count; i++) {
      const id = nodes.length;
      nodes.push({ id, ci, color: c.color, hub: false, note: false, offA: rnd() * 6.28, offR: 0.4 + rnd() * 0.55, z: rnd(), r: 2.8 + rnd() * 2.6, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
      ids[ci].push(id);
    }
    const cl = ids[ci];
    for (let j = 1; j < cl.length; j++) {
      if (j <= 2 || rnd() < 0.5) edges.push({ a: cl[j], b: hubId, inter: false });
      else edges.push({ a: cl[j], b: cl[1 + Math.floor(rnd() * (j - 1))], inter: false });
    }
    for (let m = 0; m < 2 && cl.length > 5; m++) {
      const a = cl[1 + Math.floor(rnd() * (cl.length - 1))], b = cl[1 + Math.floor(rnd() * (cl.length - 1))];
      if (a !== b) edges.push({ a, b, inter: false });
    }
  });
  const byKey: Record<string, number> = {};
  CLUSTERS.forEach((c, ci) => (byKey[c.key] = ci));
  ([["deals", "meetings"], ["meetings", "operations"], ["people", "meetings"], ["investors", "operations"], ["deals", "people"], ["meetings", "investors"]] as const).forEach((p) => {
    const A = ids[byKey[p[0]]], B = ids[byKey[p[1]]];
    edges.push({ a: A[1 + Math.floor(rnd() * (A.length - 1))], b: B[1 + Math.floor(rnd() * (B.length - 1))], inter: true });
  });
  const opsCi = byKey["operations"];
  const noteIndex = nodes.length;
  nodes.push({ id: noteIndex, ci: opsCi, color: [78, 122, 78], hub: false, note: true, offA: -1.15, offR: 0.52, z: 0.97, r: 7.5, ph: 0, dir: 1 });
  const meet = ids[byKey["meetings"]], people = ids[byKey["people"]];
  lit.push({ a: noteIndex, b: ids[opsCi][0], inter: false });
  lit.push({ a: noteIndex, b: meet[Math.min(4, meet.length - 1)], inter: false });
  lit.push({ a: noteIndex, b: people[Math.min(3, people.length - 1)], inter: false });
  return { nodes, edges, lit, noteIndex };
}

export function clusterCenter(ci: number, W: number, H: number, t: number, motion: number) {
  const c = CLUSTERS[ci];
  const amp = Math.min(W, H) * 0.028 * motion;
  return { x: c.fx * W + Math.sin(t * c.dx + c.ph) * amp, y: c.fy * H + Math.cos(t * c.dy + c.ph * 1.3) * amp };
}
export function nodeHome(n: GNode, W: number, H: number, t: number, motion: number) {
  const c = CLUSTERS[n.ci];
  const MIN = Math.min(W, H);
  const cc = clusterCenter(n.ci, W, H, t, motion);
  const ang = n.offA + t * 0.03 * motion * n.dir;
  const rad = n.offR * c.spread * MIN;
  const wob = MIN * 0.02 * motion;
  return { x: cc.x + Math.cos(ang) * rad + Math.sin(t * 0.5 + n.ph) * wob, y: cc.y + Math.sin(ang) * rad + Math.cos(t * 0.42 + n.ph) * wob };
}
// Settled (t=0) position; used by the still and as the canvas spring home base.
export function settled(n: GNode, W: number, H: number) { return nodeHome(n, W, H, 0, CALM); }

export function curveControl(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  const off = Math.min(24, len * 0.09), nx = -dy / len, ny = dx / len;
  return { mx: (ax + bx) / 2 + nx * off, my: (ay + by) / 2 + ny * off };
}
export function nodeSize(n: GNode) { return n.r * (1 - DEPTH * 0.5 + DEPTH * n.z); }
export function nodeAlpha(n: GNode) { return n.hub ? 0.95 : 0.5 + 0.5 * n.z; }
```

- [ ] **Step 2: Write the static SVG still (server component)**

Create `src/components/brain/BrainStill.tsx`:

```tsx
import {
  buildGraph, CLUSTERS, settled, curveControl, nodeSize, nodeAlpha,
  STILL_W, STILL_H, type GNode,
} from "./graph-data";

function rgb([r, g, b]: [number, number, number]) { return `rgb(${r},${g},${b})`; }

// Settled brain with the note already connected. This is the no-JS /
// reduced-motion fallback and the base layer the canvas hides when it runs.
export default function BrainStill() {
  const g = buildGraph("dense");
  const pos = new Map<number, { x: number; y: number }>();
  g.nodes.forEach((n) => pos.set(n.id, settled(n, STILL_W, STILL_H)));
  const p = (id: number) => pos.get(id)!;
  const note = g.nodes[g.noteIndex];
  const np = p(note.id);

  return (
    <svg
      className="brain-still"
      viewBox={`0 0 ${STILL_W} ${STILL_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Illustrative: the firm's knowledge as a connected graph across deals, people, meetings, operations, and investors, with a newly filed note linked in."
    >
      {/* edges */}
      {g.edges.map((e, i) => {
        const a = p(e.a), b = p(e.b);
        const { mx, my } = curveControl(a.x, a.y, b.x, b.y);
        const col = e.inter ? "184,178,167" : g.nodes[e.a].color.join(",");
        return <path key={`e${i}`} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke={`rgba(${col},${e.inter ? 0.24 : 0.22})`} strokeWidth={e.inter ? 0.7 : 0.8} />;
      })}
      {/* lit threads from the note */}
      {g.lit.map((e, i) => {
        const b = p(e.b);
        return <line key={`l${i}`} x1={np.x} y1={np.y} x2={b.x} y2={b.y} stroke="rgba(78,122,78,0.85)" strokeWidth={1.7} />;
      })}
      {/* ordinary nodes (skip the note; drawn last) */}
      {g.nodes.filter((n) => !n.note).map((n: GNode) => {
        const c = p(n.id), s = nodeSize(n);
        return (
          <g key={n.id}>
            {n.hub && <circle cx={c.x} cy={c.y} r={s + 5} fill="none" stroke={`rgba(${n.color.join(",")},0.34)`} strokeWidth={1.3} />}
            <circle cx={c.x} cy={c.y} r={s} fill={rgb(n.color)} fillOpacity={nodeAlpha(n)} />
          </g>
        );
      })}
      {/* the just-added note */}
      <circle cx={np.x} cy={np.y} r={13} fill="none" stroke="rgba(78,122,78,0.55)" strokeWidth={1.4} />
      <circle cx={np.x} cy={np.y} r={9.5} fill="#f1eee6" />
      <circle cx={np.x} cy={np.y} r={7.5} fill="rgb(78,122,78)" />
    </svg>
  );
}
```

- [ ] **Step 3: Temporarily mount the still to verify it**

Temporarily add to `src/app/page.tsx` after `<HowItWorks />` (will be replaced by `BrainSection` in Task 3):
```tsx
import BrainStill from "@/components/brain/BrainStill";
// ...
      <HowItWorks />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 40 }}><BrainStill /></div>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: passes, no TS errors.

- [ ] **Step 5: Verify determinism and composition**

Dev running. Save `/private/tmp/t2.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
await run('still', {}, async (page) => {
  await page.evaluate(() => document.querySelector('.brain-still')?.scrollIntoView());
  await wait(400);
  const counts = await page.evaluate(() => {
    const svg = document.querySelector('.brain-still');
    return { circles: svg.querySelectorAll('circle').length, paths: svg.querySelectorAll('path').length, lines: svg.querySelectorAll('line').length };
  });
  console.log('counts', JSON.stringify(counts));
  await page.locator('.brain-still').screenshot({ path: '/private/tmp/t2-still.png' });
});
process.exit(0);
```
Run `node /private/tmp/t2.mjs`. Expected: `still errors: []`; `counts` shows a stable, nonzero number of circles/paths/lines (dense graph is ~90+ circles, ~90+ paths, 3 lines). Reload and re-run: identical counts (determinism). Open `/private/tmp/t2-still.png`: five colored clusters knit together on transparent/ivory, the fern note ringed near the Operations cluster with three brighter threads. No box.

- [ ] **Step 6: Commit**

```bash
git add src/components/brain/graph-data.ts src/components/brain/BrainStill.tsx src/app/page.tsx
git commit -m "feat: deterministic brain graph model and static SVG still"
```

---

### Task 3: Section shell + copy, wired into the page

The real `<section>` with copy, the still, caption, and an sr-only description. Replaces the temporary mount. Ships a complete static section (canvas comes next).

**Files:**
- Create: `src/components/brain/BrainSection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Verify: Playwright + `npm run build`

**Interfaces:**
- Produces: `BrainSection` default export rendering `<section id="the-brain">` with a `.brain-stage` element (id `brain-stage`) wrapping `BrainStill`. Task 4 mounts the canvas island inside this section.

- [ ] **Step 1: Write the section**

Create `src/components/brain/BrainSection.tsx`:

```tsx
import BrainStill from "./BrainStill";

export default function BrainSection() {
  return (
    <section id="the-brain" className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:gap-16">
        <div>
          <p className="type-kicker text-fern-deep">Behind the chat</p>
          <h2 className="type-h2 mt-3">Nothing your firm knows sits alone.</h2>
          <p className="type-body mt-5 max-w-[46ch] text-charcoal/80">
            Every meeting, email, and file becomes a connected memory, linked
            to the people, deals, and decisions it touches. Your firm&apos;s
            knowledge stops living in inboxes and in people&apos;s heads, and
            starts compounding.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-warmgray">
            Illustrative
          </p>
        </div>
        <div id="brain-stage" className="brain-stage" data-mode="still">
          <p className="sr-only">
            Illustrative: a meeting transcript is captured, sorted into a tagged
            note, and connected into the firm&apos;s knowledge graph across
            deals, people, meetings, operations, and investors.
          </p>
          <BrainStill />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add the stage styles to `globals.css`**

Append to `src/app/globals.css`:

```css
/* Behind the chat: the brain map */
.brain-stage {
  position: relative;
  width: 100%;
  height: clamp(430px, 52vw, 600px);
}
.brain-stage .brain-still,
.brain-stage .brain-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* canvas is hidden until the client island activates; no-JS shows the still */
.brain-stage .brain-field { opacity: 0; }
.brain-stage[data-mode="live"] .brain-field { opacity: 1; }
.brain-stage[data-mode="live"] .brain-still { visibility: hidden; }
```

- [ ] **Step 3: Wire into the page, remove the temp mount**

Edit `src/app/page.tsx`: remove the temporary `BrainStill` import and the temp `<div>` from Task 2; add the section import and element:
```tsx
import BrainSection from "@/components/brain/BrainSection";
// ...
      <HowItWorks />
      <BrainSection />
      <Edge />
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: passes.

- [ ] **Step 5: Verify placement, copy, no-JS**

Save `/private/tmp/t3.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
await run('section', {}, async (page) => {
  const order = await page.evaluate(() => Array.from(document.querySelectorAll('main > *, main section')).map(e => e.id).filter(Boolean));
  console.log('ids', JSON.stringify(order));
  await page.locator('#the-brain').scrollIntoViewIfNeeded();
  await wait(400);
  await page.locator('#the-brain').screenshot({ path: '/private/tmp/t3-section.png' });
});
// no-JS check
import pw from '/Users/bridgerdavidson/Builds/crosswell-landing-site/node_modules/playwright/index.js';
const b = await pw.chromium.launch();
const ctx = await b.newContext({ javaScriptEnabled: false });
const pg = await ctx.newPage();
await pg.goto(process.env.URL || 'http://localhost:3000');
const hasStill = await pg.locator('#the-brain .brain-still').count();
console.log('no-js still present:', hasStill);
await b.close();
process.exit(0);
```
Run it. Expected: `ids` contains `the-brain` positioned after `how-it-works` and before `why-crosswell`; screenshot shows the kicker "Behind the chat", the serif headline, the support paragraph, "Illustrative", and the still brain; `no-js still present: 1`.

- [ ] **Step 6: Commit**

```bash
git add src/components/brain/BrainSection.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: add the Behind the chat section shell with the static brain"
```

---

### Task 4: Canvas field, ambient floating physics

Mount the animated canvas over the still. Minimal / calm / dense / threads on, edge-faded, reduced-motion aware, offscreen-paused. No card yet; the note renders in its connected resting state so the canvas matches the still.

**Files:**
- Create: `src/components/brain/BrainField.tsx`
- Modify: `src/components/brain/BrainSection.tsx` (mount the island)
- Modify: `src/app/globals.css` (canvas mask)
- Verify: Playwright + `npm run build`

**Interfaces:**
- Consumes: everything from `graph-data.ts`.
- Produces: `BrainField` default export (`"use client"`) rendering `<canvas className="brain-field">`. On mount, if motion is allowed and JS present, sets `#brain-stage` `data-mode="live"` and runs the ambient loop. Task 5 extends this file with the card + inject timeline; the `chor` object and `injectRef` it introduces live here.

- [ ] **Step 1: Add the canvas mask to `globals.css`**

Append:
```css
.brain-stage .brain-field {
  -webkit-mask-image: radial-gradient(120% 118% at 50% 48%, #000 62%, transparent 99%);
          mask-image: radial-gradient(120% 118% at 50% 48%, #000 62%, transparent 99%);
}
```

- [ ] **Step 2: Write the canvas field**

Create `src/components/brain/BrainField.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";
import { buildGraph, nodeHome, nodeSize, nodeAlpha, CALM, type GNode } from "./graph-data";

export default function BrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // leave the SSR still in place

    const stage = document.getElementById("brain-stage");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    stage?.setAttribute("data-mode", "live");

    const g = buildGraph("dense");
    const pos = g.nodes.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, init: false }));
    let W = 0, H = 0, DPR = 1, raf = 0, start = 0, visible = true;

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function col(c: number[], a: number) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

    function step(t: number) {
      const k = 0.02, damp = 0.9;
      g.nodes.forEach((n, i) => {
        const h = nodeHome(n, W, H, t, CALM);
        const s = pos[i];
        if (!s.init) { s.x = h.x; s.y = h.y; s.init = true; }
        s.vx = (s.vx + (h.x - s.x) * k) * damp;
        s.vy = (s.vy + (h.y - s.y) * k) * damp;
        s.x += s.vx; s.y += s.vy;
      });
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      // threads
      g.edges.forEach((e) => {
        const a = pos[e.a], b = pos[e.b];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const off = Math.min(24, len * 0.09), nx = -dy / len, ny = dx / len;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.quadraticCurveTo((a.x + b.x) / 2 + nx * off, (a.y + b.y) / 2 + ny * off, b.x, b.y);
        const za = (g.nodes[e.a].z + g.nodes[e.b].z) / 2;
        ctx!.lineWidth = e.inter ? 0.7 : 0.8;
        ctx!.strokeStyle = e.inter ? col([184, 178, 167], 0.24) : col(g.nodes[e.a].color, 0.1 + za * 0.22);
        ctx!.stroke();
      });
      // lit threads (note is in its connected resting state for now)
      g.lit.forEach((e, i) => {
        const a = pos[e.a], b = pos[e.b];
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
        ctx!.lineWidth = 1.7; ctx!.strokeStyle = col([78, 122, 78], 0.85); ctx!.stroke();
        const f = (t * 0.4 + i * 0.33) % 1;
        ctx!.beginPath(); ctx!.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 2.2, 0, 6.2832);
        ctx!.fillStyle = col([147, 179, 147], 0.9); ctx!.fill();
      });
      // nodes back-to-front by depth
      const order = g.nodes.map((_, i) => i).sort((p, q) => g.nodes[p].z - g.nodes[q].z);
      order.forEach((i) => {
        const n: GNode = g.nodes[i], s = pos[i];
        if (!isFinite(s.x) || !isFinite(s.y)) return;
        if (n.note) {
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 38);
          grad.addColorStop(0, col([78, 122, 78], 0.34)); grad.addColorStop(1, col([78, 122, 78], 0));
          ctx!.fillStyle = grad; ctx!.beginPath(); ctx!.arc(s.x, s.y, 38, 0, 6.2832); ctx!.fill();
          const pulse = (t * 0.6) % 1;
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 10 + pulse * 22, 0, 6.2832);
          ctx!.strokeStyle = col([78, 122, 78], 0.5 * (1 - pulse)); ctx!.lineWidth = 1.6; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 13, 0, 6.2832); ctx!.strokeStyle = col([78, 122, 78], 0.55); ctx!.lineWidth = 1.4; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 9.5, 0, 6.2832); ctx!.fillStyle = "#f1eee6"; ctx!.fill();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 7.5, 0, 6.2832); ctx!.fillStyle = col([78, 122, 78], 1); ctx!.fill();
          return;
        }
        const sz = nodeSize(n);
        if (n.hub) { ctx!.beginPath(); ctx!.arc(s.x, s.y, sz + 5, 0, 6.2832); ctx!.strokeStyle = col(n.color, 0.34); ctx!.lineWidth = 1.3; ctx!.stroke(); }
        ctx!.beginPath(); ctx!.arc(s.x, s.y, sz, 0, 6.2832); ctx!.fillStyle = col(n.color, nodeAlpha(n)); ctx!.fill();
      });
    }

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      step(t); draw(t);
    }

    resize();
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.01 });
    io.observe(canvas);
    let rt: number | undefined;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { pos.forEach((s) => (s.init = false)); resize(); }, 150); };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      stage?.setAttribute("data-mode", "still");
    };
  }, []);

  return <canvas ref={canvasRef} className="brain-field" aria-hidden="true" />;
}
```

- [ ] **Step 3: Mount the island in the section**

Edit `src/components/brain/BrainSection.tsx`: add a dynamic import so the canvas is client-only and the still is the SSR content. Add near the top:
```tsx
import dynamic from "next/dynamic";
const BrainField = dynamic(() => import("./BrainField"), { ssr: false });
```
Inside `.brain-stage`, after `<BrainStill />`:
```tsx
          <BrainStill />
          <BrainField />
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: passes. (`ssr: false` dynamic import keeps the canvas out of the static HTML; the still is the SSR content.)

- [ ] **Step 5: Verify ambient animation, reduced motion, offscreen pause**

Save `/private/tmp/t4.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
// animated
await run('field', {}, async (page) => {
  await page.locator('#the-brain').scrollIntoViewIfNeeded();
  await wait(1500);
  const mode = await page.getAttribute('#brain-stage', 'data-mode');
  console.log('mode', mode);
  await page.locator('#the-brain').screenshot({ path: '/private/tmp/t4-field.png' });
});
// reduced motion shows the still
await run('field-reduced', { reduce: true }, async (page) => {
  await page.locator('#the-brain').scrollIntoViewIfNeeded();
  await wait(800);
  const mode = await page.getAttribute('#brain-stage', 'data-mode');
  const stillVisible = await page.locator('#the-brain .brain-still').isVisible();
  console.log('reduced mode', mode, 'still visible', stillVisible);
});
process.exit(0);
```
Run it. Expected: animated run `mode live`, no console errors, `t4-field.png` shows the floating brain (looks like the look lab: minimal, dense, tight); reduced run `reduced mode still`, `still visible true`. Take two screenshots ~500ms apart in the animated run if you want to confirm drift (positions differ).

- [ ] **Step 6: Commit**

```bash
git add src/components/brain/BrainField.tsx src/components/brain/BrainSection.tsx src/app/globals.css
git commit -m "feat: canvas brain field with ambient floating physics"
```

---

### Task 5: The note card and the inject choreography

The readable capture/sort/inject beats: a DOM card rises, sorts, then flies into the Operations cluster and hands off to the canvas note. Plays once on scroll; Replay re-runs it.

**Files:**
- Create: `src/components/brain/NoteCard.tsx`
- Modify: `src/components/brain/BrainField.tsx` (timeline, inject state, Replay, hide note until injected)
- Modify: `src/app/globals.css` (card + replay styles, raw/sorted crossfade)
- Verify: Playwright + `npm run build`

**Interfaces:**
- Consumes: `CORE_NOTE` from `@/lib/core-note`; `settled`, `buildGraph` from `graph-data`.
- Produces: `NoteCard` (presentational, `forwardRef` to its root element). `BrainField` gains a module-scoped `chor = { inject: 0 }` read by `draw`, a `cardRef`, and a `runInject()` used by ScrollTrigger and Replay.

- [ ] **Step 1: Write the card**

Create `src/components/brain/NoteCard.tsx`:

```tsx
import { forwardRef } from "react";
import { CORE_NOTE } from "@/lib/core-note";

// The one note, big and readable. `raw` and `sorted` layers crossfade via CSS
// (.is-sorted on the card root). Driven by the timeline in BrainField.
const NoteCard = forwardRef<HTMLDivElement>(function NoteCard(_, ref) {
  return (
    <div ref={ref} className="brain-card" aria-hidden="true">
      <div className="brain-card-raw">
        <div className="brain-card-head">
          <span className="brain-card-dot" /> {CORE_NOTE.sourceLabel}
          <span className="brain-card-badge">Capturing</span>
        </div>
        {CORE_NOTE.raw.map((line, i) => (
          <p key={i} className="brain-card-line">{line}</p>
        ))}
      </div>
      <div className="brain-card-sorted">
        <div className="brain-card-head">
          {CORE_NOTE.noteLabel}
          <span className="brain-card-badge">Sorted</span>
        </div>
        <p className="brain-card-summary">{CORE_NOTE.summary}</p>
        <p className="brain-card-context">{CORE_NOTE.context}</p>
        <div className="brain-card-tags">
          {CORE_NOTE.tags.map((t) => (
            <span key={t} className="brain-card-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
});
export default NoteCard;
```

- [ ] **Step 2: Add card + replay styles to `globals.css`**

Append (uses only palette + the tour's `#24221c` card tone):
```css
.brain-card {
  position: absolute; left: 50%; top: 46%;
  width: min(360px, 80%); transform: translate(-50%, -50%);
  background: #211f1a; color: var(--color-ivory);
  border: 1px solid rgba(241, 238, 230, 0.08);
  border-radius: 14px; padding: 16px 16px 18px;
  box-shadow: 0 24px 50px -30px rgba(26, 25, 21, 0.8);
  opacity: 0; pointer-events: none;
}
.brain-card-raw, .brain-card-sorted { transition: opacity 0.5s ease; }
.brain-card-sorted { position: absolute; inset: 16px 16px 18px; opacity: 0; }
.brain-card.is-sorted .brain-card-raw { opacity: 0; }
.brain-card.is-sorted .brain-card-sorted { opacity: 1; }
.brain-card-head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
.brain-card-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-fern-soft); }
.brain-card-badge { margin-left: auto; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-fern-soft); background: rgba(78, 122, 78, 0.22); padding: 3px 8px; border-radius: 6px; }
.brain-card-line { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11.5px; line-height: 1.6; color: rgba(241, 238, 230, 0.6); margin: 0 0 6px; }
.brain-card-summary { font-size: 14px; line-height: 1.5; color: rgba(241, 238, 230, 0.95); margin: 0; }
.brain-card-context { font-size: 12.5px; color: rgba(241, 238, 230, 0.6); margin: 8px 0 0; }
.brain-card-tags { display: flex; gap: 6px; margin-top: 12px; }
.brain-card-tag { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 6px; background: rgba(78, 122, 78, 0.28); color: #cfe0cf; }
.brain-replay {
  position: absolute; right: 8px; bottom: 8px;
  font-size: 12px; font-weight: 600; color: var(--color-fern-soft);
  background: transparent; border: 0; cursor: pointer; padding: 6px 8px; opacity: 0;
  transition: opacity 0.4s ease;
}
.brain-stage[data-mode="live"] .brain-replay { opacity: 1; }
.brain-replay:focus-visible { outline: 2px solid var(--color-fern-deep); outline-offset: 2px; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) { .brain-card, .brain-replay { display: none; } }
```

- [ ] **Step 3: Extend `BrainField.tsx` with the card, timeline, and Replay**

Add imports at the top:
```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoteCard from "./NoteCard";
import { buildGraph, nodeHome, nodeSize, nodeAlpha, settled, CALM, type GNode } from "./graph-data";
gsap.registerPlugin(ScrollTrigger);
```

Inside the component, add refs and render them:
```tsx
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
```
Return:
```tsx
  return (
    <>
      <canvas ref={canvasRef} className="brain-field" aria-hidden="true" />
      <NoteCard ref={cardRef} />
      <button ref={replayRef} className="brain-replay" type="button">Replay</button>
    </>
  );
```

Inside the effect, after `stage?.setAttribute("data-mode", "live");`, add the shared inject value and hide the note until injected. Change the note-drawing branch in `draw` to respect `chor.inject`:
```tsx
    const chor = { inject: 0 };
```
In `draw`, wrap the lit-thread loop and the note node so they only render (and fade in) with `chor.inject`:
- Lit threads: multiply their stroke alpha by `chor.inject` and skip the traveling dot until `chor.inject > 0.99`.
- Note node: multiply halo/ring/core alphas by `chor.inject`, and only show the expanding pulse when `chor.inject > 0.99`.

Concretely, replace the lit loop with:
```tsx
      g.lit.forEach((e, i) => {
        if (chor.inject <= 0) return;
        const a = pos[e.a], b = pos[e.b];
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
        ctx!.lineWidth = 1.7; ctx!.strokeStyle = col([78, 122, 78], 0.85 * chor.inject); ctx!.stroke();
        if (chor.inject > 0.99) {
          const f = (t * 0.4 + i * 0.33) % 1;
          ctx!.beginPath(); ctx!.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 2.2, 0, 6.2832);
          ctx!.fillStyle = col([147, 179, 147], 0.9); ctx!.fill();
        }
      });
```
And in the node branch, replace the `if (n.note) { ... }` block's fixed alphas with `* chor.inject` on the halo (`0.34`), the steady ring (`0.55`), and gate the pulse behind `chor.inject > 0.99`; keep the ivory disc and core drawn at `chor.inject` alpha (skip entirely if `chor.inject <= 0`):
```tsx
        if (n.note) {
          if (chor.inject <= 0) return;
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 38);
          grad.addColorStop(0, col([78, 122, 78], 0.34 * chor.inject)); grad.addColorStop(1, col([78, 122, 78], 0));
          ctx!.fillStyle = grad; ctx!.beginPath(); ctx!.arc(s.x, s.y, 38, 0, 6.2832); ctx!.fill();
          if (chor.inject > 0.99) {
            const pulse = (t * 0.6) % 1;
            ctx!.beginPath(); ctx!.arc(s.x, s.y, 10 + pulse * 22, 0, 6.2832);
            ctx!.strokeStyle = col([78, 122, 78], 0.5 * (1 - pulse)); ctx!.lineWidth = 1.6; ctx!.stroke();
          }
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 13, 0, 6.2832); ctx!.strokeStyle = col([78, 122, 78], 0.55 * chor.inject); ctx!.lineWidth = 1.4; ctx!.stroke();
          ctx!.globalAlpha = chor.inject;
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 9.5, 0, 6.2832); ctx!.fillStyle = "#f1eee6"; ctx!.fill();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 7.5, 0, 6.2832); ctx!.fillStyle = col([78, 122, 78], 1); ctx!.fill();
          ctx!.globalAlpha = 1;
          return;
        }
```

After `resize()` and before the IntersectionObserver, build the choreography:
```tsx
    const card = cardRef.current;
    const replay = replayRef.current;
    const noteNode = g.nodes[g.noteIndex];

    function runInject() {
      if (!card) return;
      gsap.killTweensOf([card, chor]);
      chor.inject = 0;
      card.classList.remove("is-sorted");
      gsap.set(card, { clearProps: "transform,opacity" });
      gsap.set(card, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0, y: 24 });
      if (replay) gsap.set(replay, { opacity: 0 });
      const tl = gsap.timeline();
      tl.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.2);       // rise
      tl.add(() => card.classList.add("is-sorted"), 2.6);                                // sort
      tl.addLabel("inject", 4.6);
      tl.add(() => {
        // compute the fly target: card center -> note screen position
        const cr = canvas.getBoundingClientRect();
        const dr = card.getBoundingClientRect();
        const nHome = settled(noteNode, W, H);
        const tx = cr.left + nHome.x - (dr.left + dr.width / 2);
        const ty = cr.top + nHome.y - (dr.top + dr.height / 2);
        gsap.to(card, { x: `+=${tx}`, y: `+=${ty}`, scale: 0.12, opacity: 0, duration: 1.1, ease: "power2.inOut" });
      }, "inject");
      tl.to(chor, { inject: 1, duration: 1.1, ease: "power2.out" }, "inject");           // reveal note + threads
      tl.add(() => { if (replay) gsap.to(replay, { opacity: 1, duration: 0.4 }); }, "inject+=1.4");
    }

    const st = ScrollTrigger.create({ trigger: stage!, start: "top 70%", once: true, onEnter: runInject });
    replay?.addEventListener("click", runInject);
```

Update the cleanup to also kill these:
```tsx
      st.kill();
      replay?.removeEventListener("click", runInject);
      gsap.killTweensOf([card, chor].filter(Boolean) as object[]);
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: passes. (`gsap`/`@gsap/react` already deps; `gsap/ScrollTrigger` import is used the same way as the tour.)

- [ ] **Step 5: Verify the sequence, replay, and reduced-motion**

Save `/private/tmp/t5.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
await run('inject', {}, async (page) => {
  await page.locator('#the-brain').scrollIntoViewIfNeeded();
  await wait(1400); await page.locator('#the-brain').screenshot({ path: '/private/tmp/t5-card.png' });   // reading
  await wait(1600); await page.locator('#the-brain').screenshot({ path: '/private/tmp/t5-sorted.png' }); // sorted
  await wait(2200); await page.locator('#the-brain').screenshot({ path: '/private/tmp/t5-inject.png' });  // injecting
  await wait(2200); await page.locator('#the-brain').screenshot({ path: '/private/tmp/t5-settled.png' }); // settled + note pulsing
  const replayVisible = await page.locator('#the-brain .brain-replay').isVisible();
  console.log('replay visible', replayVisible);
  await page.locator('#the-brain .brain-replay').click();
  await wait(1400); await page.locator('#the-brain').screenshot({ path: '/private/tmp/t5-replay.png' });   // card back
});
process.exit(0);
```
Run it. Expected: no console errors; `t5-card.png` shows the readable raw transcript card; `t5-sorted.png` shows the sorted note (summary + tags); `t5-inject.png` shows the card small/moving toward Operations; `t5-settled.png` shows the connected note pulsing in the brain with the card gone; `replay visible true`; `t5-replay.png` shows the raw card again (replay re-ran). Also run reduced-motion (`{ reduce: true }`) and confirm no card renders and the still shows.

- [ ] **Step 6: Commit**

```bash
git add src/components/brain/NoteCard.tsx src/components/brain/BrainField.tsx src/app/globals.css
git commit -m "feat: note card capture-sort-inject choreography over the brain"
```

---

### Task 6: Acceptance sweep and polish

Cross-viewport verification, honesty and palette checks, and any spacing/pacing tuning against the spec's acceptance criteria.

**Files:**
- Modify (as needed from findings): `src/components/brain/BrainSection.tsx`, `src/app/globals.css`, `src/components/brain/BrainField.tsx`
- Verify: Playwright at 1440 / 1728 / 390 + reduced-motion + `npm run build`

**Interfaces:** none new.

- [ ] **Step 1: Full-build and multi-viewport sweep**

Run `npm run build`, then dev, then save `/private/tmp/t6.mjs`:
```js
import { run, wait } from '/private/tmp/brain-verify.mjs';
for (const [w, h] of [[1440, 900], [1728, 1080], [390, 844]]) {
  await run(`v${w}`, { width: w, height: h }, async (page) => {
    await page.locator('#the-brain').scrollIntoViewIfNeeded();
    await wait(1400); await page.locator('#the-brain').screenshot({ path: `/private/tmp/t6-${w}-card.png` });
    await wait(4600); await page.locator('#the-brain').screenshot({ path: `/private/tmp/t6-${w}-settled.png` });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    console.log(`v${w} horizontal overflow`, overflow);
  });
}
await run('v390-reduced', { width: 390, height: 844, reduce: true }, async (page) => {
  await page.locator('#the-brain').scrollIntoViewIfNeeded(); await wait(700);
  await page.locator('#the-brain').screenshot({ path: '/private/tmp/t6-390-reduced.png' });
});
process.exit(0);
```
Run it. Expected: every run `errors: []`; every `horizontal overflow false`; at 390 the copy stacks above the brain and the card fits within the stage; reduced shot shows the settled still. Inspect each screenshot: brain edges fade into ivory with no visible container; card readable; note connects.

- [ ] **Step 2: Honesty and palette checks**

Run these greps and confirm the section source is clean:
```bash
# no em dashes in the new files
grep -R "—" src/components/brain src/lib/core-note.ts && echo "FOUND EM DASH (fix)" || echo "no em dashes"
# no stray hex outside the allowed set in the brain components (spot-check output by eye)
grep -RoE "#[0-9a-fA-F]{6}" src/components/brain | sort -u
```
Expected: "no em dashes". The hex list contains only `#f1eee6` and `#211f1a` (the ivory disc and the card tone `#211f1a`, matching the tour's dark card family; `#24221c` may also appear if used). Confirm no blues, no off-palette colors. If `#211f1a` bothers review, it is the same near-ink card tone the tour uses; acceptable.

- [ ] **Step 3: Tune if needed**

If review flags pacing (card lingers too long/short), spacing (section padding), or density, adjust: card beat times in `runInject` (the `0.2 / 2.6 / 4.6` offsets), `.brain-stage` height clamp, or `py-24 sm:py-32` on the section. Re-run Step 1 after any change. Keep within the locked look values (do not change style/motion/density/cluster params without going back to the spec).

- [ ] **Step 4: Final build**

Run: `npm run build`
Expected: passes; `out/` written.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/brain src/app/globals.css src/components/brain/BrainSection.tsx
git commit -m "chore: cross-viewport polish for the brain-map section"
```

---

## Notes for the implementer

- **Dev server port:** another Next app sometimes holds 3000. Read the "Local:" line printed by `npm run dev` and point `URL` at the real port. Kill stray servers by PID, not by port name.
- **`out/` on static export:** `npm run build` writes `out/`. Do not add `outputDirectory` to `vercel.json`; it breaks the build (`NEXT_NO_ROUTES_MANIFEST`).
- **Why canvas here:** the hero is CSS, the tour is GSAP, the trust diagram is CSS/SVG. Continuous free-form physics over ~90 nodes is the reason this one section uses canvas; the timeline beats are still GSAP, layered on top. The SSR SVG still is the complete no-JS / reduced-motion experience.
- **Determinism:** never introduce `Math.random` into layout. The fixed `SEED` keeps the SSR still and the canvas identical and keeps hydration stable.

## Self-review (done while writing)

- **Spec coverage:** placement (Task 3), ivory canvas + no box (Tasks 3-4), free-form floating physics minimal/calm/dense/threads/labels-off (Task 4, values from `graph-data`), five clusters + palette color mapping (Task 2 `CLUSTERS`), one shared note (Task 1), capture/sort/link beats + no vault (Task 5), reduced-motion + no-JS still (Tasks 2-4), distinctness/out-of-scope honored (no security copy, no counters, no labels), acceptance criteria (Task 6). Covered.
- **Placeholder scan:** no TBD/TODO; all code is complete and copy is final.
- **Type consistency:** `buildGraph`, `nodeHome`, `settled`, `nodeSize`, `nodeAlpha`, `curveControl`, `CALM`, `CLUSTERS`, `STILL_W/H`, `GNode`, `chor.inject`, `CORE_NOTE.{sourceLabel,noteLabel,summary,context,tags,filedLinked,linkedTo,raw}` are used identically across tasks.
