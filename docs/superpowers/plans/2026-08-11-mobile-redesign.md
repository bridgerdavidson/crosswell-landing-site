# Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make crosswellconsulting.com properly mobile-responsive: tame the hero sphere, replace the dropdown menu with an animated ink takeover, and fix every section that degrades at 320 to 430px, per the approved spec at `docs/superpowers/specs/2026-08-11-mobile-redesign-design.md`.

**Architecture:** All mobile changes are gated behind `max-width: 767px` media queries (or Tailwind `max-sm` / `min-[N]` / `sm:` variants that leave 768px+ untouched). Desktop must render pixel-identical to today. Component CSS lives in `src/app/globals.css` following the repo's existing pattern; components use Tailwind utilities. Verification is screenshot-driven via Playwright (already present in node_modules) against the local dev server.

**Tech Stack:** Next.js 15 (App Router, `output: "export"`), React 19, Tailwind v4, TypeScript, Playwright 1.61 (verification only), GSAP (already installed; do not add libraries).

## Global Constraints

- Mobile-only gating: every change is inert at 768px and above. Verify desktop against baseline screenshots after each visual task.
- No em dashes anywhere: code comments, copy, commit messages, docs.
- Conventional commits (`feat:`, `fix:`, `chore:`) with trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- NEVER `git push`. Pushing `main` auto-deploys production on Vercel. Commit locally only; the user pushes when ready.
- No new npm dependencies. No changes to `vercel.json` or `next.config.ts`.
- Gradient masks in CSS need explicit double color stops (`black 0%, black 55%` not `black 55%`); the production minifier rewrites single-stop positions to 0 and washes out the artwork (documented in `globals.css` and prior memory).
- `npm run build` must pass at the end of every task (static export).
- Dev server: `npm run dev` at `http://localhost:3000`. Start it once in the background; all shot commands assume it is running.
- Every new animation needs a `prefers-reduced-motion: reduce` variant.
- Repo root for all paths and commands: `/Users/bridgerdavidson/Builds/crosswell-landing-site`.

---

### Task 1: Screenshot tooling and desktop baselines

**Files:**
- Create: `scripts/shot.mjs`
- Modify: `.gitignore` (add `screenshots/`)

**Interfaces:**
- Produces: `node scripts/shot.mjs <url> <width> <outfile> [--full] [--open-menu] [--reduced-motion] [--height N]`. Prints `horizontal overflow = Npx` (must be 0) and the hero `<img>` `currentSrc`. Every later task's verify steps call this.

- [ ] **Step 1: Write the screenshot script**

Create `scripts/shot.mjs`:

```js
// Screenshot + overflow probe for manual mobile verification.
// Usage: node scripts/shot.mjs <url> <width> <outfile> [--full] [--open-menu] [--reduced-motion] [--height N]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const [url, width, out] = args;
const flag = (f) => args.includes(f);
const height = flag("--height") ? Number(args[args.indexOf("--height") + 1]) : 844;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height },
  deviceScaleFactor: 2,
});
if (flag("--reduced-motion")) await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(url, { waitUntil: "networkidle" });
if (flag("--open-menu")) {
  await page.click('button[aria-label="Open menu"]');
  await page.waitForTimeout(1400);
}
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: flag("--full") });
const overflow = await page.evaluate(
  () => document.scrollingElement.scrollWidth - document.documentElement.clientWidth
);
console.log(`${out}: horizontal overflow = ${overflow}px${overflow > 0 ? "  <-- FAIL" : ""}`);
const src = await page.evaluate(
  () => document.querySelector(".hero-core img")?.currentSrc ?? "no hero img"
);
console.log(`hero img currentSrc: ${src}`);
await browser.close();
```

- [ ] **Step 2: Ignore the screenshots directory**

Append to `.gitignore`:

```
screenshots/
```

- [ ] **Step 3: Start the dev server (leave running for all tasks)**

Run: `npm run dev` (background). Wait for `Ready`.

- [ ] **Step 4: Capture baselines**

```bash
mkdir -p screenshots
node scripts/shot.mjs http://localhost:3000 1440 screenshots/base-desktop-1440.png --full --height 900
node scripts/shot.mjs http://localhost:3000 390 screenshots/base-mobile-390.png --full
```

Expected: both PNGs exist; overflow = 0px on both; hero currentSrc ends in `/hero-core.jpg`. View both images to confirm they match production's current look. These are the comparison baselines for every later task.

- [ ] **Step 5: Commit**

```bash
git add scripts/shot.mjs .gitignore
git commit -m "chore: add Playwright screenshot verification script"
```

---

### Task 2: Lighter hero asset on phones

**Files:**
- Create: `public/hero-core-mobile.jpg` (generated)
- Modify: `src/components/HeroCore.tsx` (img at lines 30-39)
- Modify: `src/app/layout.tsx` (preload at lines 36-41)

**Interfaces:**
- Consumes: `scripts/shot.mjs` from Task 1.
- Produces: `<picture>` in HeroCore with `.hero-core img` still matching the existing CSS selector; media-split preloads. Task 3's CSS relies on the img keeping class behavior (`is-loaded` crossfade) unchanged.

- [ ] **Step 1: Generate the mobile asset**

```bash
sips -Z 1600 -s formatOptions 78 public/hero-core.jpg --out public/hero-core-mobile.jpg
ls -lh public/hero-core-mobile.jpg
```

Expected: ~548KB (must be at or under 600KB), 1600x1600. This exact recipe produced the asset used in the approved brainstorm mockups.

- [ ] **Step 2: Swap the img for a picture in HeroCore.tsx**

Replace the current `<img ...>` block (inside the `.hero-core` div) with:

```tsx
<picture className="contents">
  <source media="(max-width: 767px)" srcSet="/hero-core-mobile.jpg" />
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    ref={imgRef}
    src="/hero-core.jpg"
    alt=""
    fetchPriority="high"
    decoding="async"
    onLoad={() => setLoaded(true)}
    className={loaded ? "is-loaded" : undefined}
  />
</picture>
```

The `load` event and `complete` flag live on the `img` regardless of which source the browser picks, so the decode-gated crossfade keeps working. The CSS selector `.hero-core img` still matches (descendant selector), and `display: contents` on the picture removes it from layout so the img's percentage sizing keeps resolving against `.hero-core` exactly as before.

- [ ] **Step 3: Media-split the preload in layout.tsx**

Without this, phones would download BOTH JPEGs (the preload fetches the desktop file unconditionally). Replace the single `<link rel="preload" ...>` with:

```tsx
<link
  rel="preload"
  as="image"
  href="/hero-core.jpg"
  media="(min-width: 768px)"
  fetchPriority="high"
/>
<link
  rel="preload"
  as="image"
  href="/hero-core-mobile.jpg"
  media="(max-width: 767px)"
  fetchPriority="high"
/>
```

- [ ] **Step 4: Verify both widths pick the right asset**

```bash
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t2-desktop.png --height 900
node scripts/shot.mjs http://localhost:3000 390 screenshots/t2-mobile.png
```

Expected: desktop currentSrc ends `/hero-core.jpg`, mobile currentSrc ends `/hero-core-mobile.jpg`. Compare `t2-desktop.png` against `base-desktop-1440.png`: identical.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add public/hero-core-mobile.jpg src/components/HeroCore.tsx src/app/layout.tsx
git commit -m "feat: serve a 1600px hero asset on phones instead of the 2.2MB original"
```

---

### Task 3: Hero sphere scale and veil on mobile

**Files:**
- Modify: `src/app/globals.css` (after the `.hero-core-veil` rule, ~line 281)
- Modify: `src/components/Hero.tsx:9` (`min-h-dvh` to `min-h-svh`)

**Interfaces:**
- Consumes: Task 2's picture element (unchanged selectors).
- Produces: final mobile hero composition (spec section 1, decision A2).

- [ ] **Step 1: Add the mobile hero overrides to globals.css**

Insert directly after the existing `.hero-core-veil` rule block:

```css
/* Mobile: 100vmax resolves to the viewport HEIGHT on a phone, which fits the
   sphere's full top and bottom arcs into frame (the desktop composition shows
   it wide, never fully). 119vmax pushes the arcs just off-frame under the edge
   fades (spec 2026-08-11, decision A2). The veil override covers mobile's tall
   text column; the double ivory stop is load-bearing (minifier trap above). */
@media (max-width: 767px) {
  .hero-core {
    width: 119vmax;
    height: 119vmax;
  }
  .hero-core-veil {
    background: radial-gradient(
      ellipse 100% 54% at 50% 52%,
      var(--color-ivory) 0%,
      var(--color-ivory) 36%,
      rgba(241, 238, 230, 0) 86%
    );
  }
}
```

- [ ] **Step 2: Stop the hero re-centering during iOS toolbar collapse**

In `src/components/Hero.tsx` line 9, change `min-h-dvh` to `min-h-svh`. (`dvh` reflows continuously as the mobile browser toolbar shows and hides; `svh` holds still. Desktop has no dynamic toolbar, so it renders identically.)

- [ ] **Step 3: Verify against the approved mockup**

```bash
node scripts/shot.mjs http://localhost:3000 390 screenshots/t3-mobile-390.png
node scripts/shot.mjs http://localhost:3000 320 screenshots/t3-mobile-320.png
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t3-desktop.png --height 900
```

View the mobile shots. Expected, matching mockup A2 (`.superpowers/brainstorm/2556-1786504936/content/hero-composition-v2.html`, middle option): no sphere curvature visible at top or bottom; all hero copy on clean ivory; weave full strength at the left and right edges; overflow 0px. Desktop shot identical to baseline. Tune the veil's `54%` / `36%` / `86%` values only if text still collides with threads.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/Hero.tsx
git commit -m "feat: tame the hero sphere and veil on mobile (spec A2)"
```

---

### Task 4: Ink takeover menu, structure and behavior

**Files:**
- Modify: `src/components/Nav.tsx` (full mobile-menu rework; desktop nav untouched)
- Modify: `src/app/globals.css` (menu styles, appended at the end of the file)

**Interfaces:**
- Consumes: existing `goToSection`, `links`, `CALL_MAILTO`; adds `CONTACT_EMAIL` import from `@/lib/site`.
- Produces: class contract for Task 5's motion: `.menu-overlay`, `.menu-overlay-open`, `.menu-link`, `.menu-bottom`, each link/bottom carrying `--i` (0 through 4); `.nav-burger` / `.nav-burger-open` spans.

- [ ] **Step 1: Update imports and add open-state effects in Nav.tsx**

Change the react import and site import:

```tsx
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { CALL_MAILTO, CONTACT_EMAIL } from "@/lib/site";
```

Add below the existing effects:

```tsx
// While the ink takeover is open: lock page scroll and close on Escape.
useEffect(() => {
  if (!open) return;
  const root = document.documentElement;
  const prev = root.style.overflow;
  root.style.overflow = "hidden";
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  window.addEventListener("keydown", onKey);
  return () => {
    root.style.overflow = prev;
    window.removeEventListener("keydown", onKey);
  };
}, [open]);
```

- [ ] **Step 2: Rework the header chrome for the open state**

Replace `const solid = scrolled || open;` and the header className with:

```tsx
const headerChrome = open
  ? "border-transparent bg-transparent"
  : scrolled
    ? "border-ink/10 bg-ivory/85 backdrop-blur-md"
    : "border-transparent bg-transparent";
```

```tsx
<header
  className={`nav-enter fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${headerChrome}`}
>
```

Swap the logo to the light lockup while open, and shrink it slightly on phones (at 320px the 229px lockup leaves 6px of slack and Tailwind preflight squashes it on overflow):

```tsx
<Image
  src={open ? "/xw-h-lockup-light.svg" : "/xw-h-lockup-dark.svg"}
  alt="Crosswell"
  width={295}
  height={36}
  priority
  className="h-6 w-auto md:h-7"
/>
```

- [ ] **Step 3: Replace the hamburger SVG with a morphing two-line burger**

Replace the `<svg>...</svg>` inside the toggle button with:

```tsx
<span className={`nav-burger ${open ? "nav-burger-open" : ""}`} aria-hidden>
  <span />
  <span />
</span>
```

Update the button's color for the ink background and point it at the dialog:

```tsx
className={`-mr-2 flex h-11 w-11 items-center justify-center md:hidden ${
  open ? "text-ivory" : "text-ink"
}`}
aria-controls="mobile-menu"
```

(Keep the existing `aria-expanded` and `aria-label` props.)

- [ ] **Step 4: Replace the dropdown with the always-mounted overlay**

CRITICAL: the overlay must be a SIBLING of `<header>`, not a child. The header's `nav-enter` entrance animation holds a `transform: translateY(0)` via `fill-mode: both` forever after it finishes, and any transform makes the header a containing block for `position: fixed` descendants; a fixed overlay inside `<header>` would size itself to the 80px header instead of the viewport. Wrap the component's return in a fragment:

```tsx
return (
  <>
    <header className={`nav-enter fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${headerChrome}`}>
      {/* existing inner div, unchanged apart from Steps 2-3 */}
    </header>
    {/* overlay goes here, after </header> */}
  </>
);
```

Delete the entire `{open && (<nav className="border-t ...">...</nav>)}` block and render this as the fragment's second child:

```tsx
<div
  id="mobile-menu"
  role="dialog"
  aria-modal="true"
  aria-label="Menu"
  inert={!open}
  className={`menu-overlay md:hidden ${open ? "menu-overlay-open" : ""}`}
>
  <nav className="menu-links">
    {links.map((link, i) => (
      <a
        key={link.href}
        href={link.href}
        onClick={(e) => goToSection(e, link.href)}
        className="menu-link"
        style={{ "--i": i } as CSSProperties}
      >
        <span className="menu-idx">{String(i + 1).padStart(2, "0")}</span>
        <span className="menu-txt">{link.label}</span>
      </a>
    ))}
  </nav>
  <div className="menu-bottom" style={{ "--i": links.length } as CSSProperties}>
    <a
      href={CALL_MAILTO}
      onClick={() => setOpen(false)}
      className="block rounded-[10px] bg-fern px-4 py-4 text-center text-[15px] font-semibold text-ivory"
    >
      Set up a call
    </a>
    <p className="menu-mail">{CONTACT_EMAIL}</p>
  </div>
</div>
```

Notes: `inert` (React 19 boolean prop) removes the closed overlay from tab order and assistive tech. The toggle button doubles as the close control, so focus never needs to move; it is already in the header above the overlay.

- [ ] **Step 5: Add the menu styles to globals.css**

Append at the end of the file:

```css
/* ---------- Mobile menu: the ink takeover ----------
   Full-screen inversion into ink with indexed serif links (spec 2026-08-11,
   section 2). Always mounted; .menu-overlay-open toggles it so open and close
   can animate (Task: motion). z-40 sits under the z-50 header, whose logo and
   burger swap to light while open. */

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: var(--color-ink);
  padding: 96px 32px 36px;
  overflow-y: auto;
  visibility: hidden;
  opacity: 0;
}

.menu-overlay-open {
  visibility: visible;
  opacity: 1;
}

.menu-links {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
}

.menu-link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 17px 0;
  border-bottom: 1px solid rgba(241, 238, 230, 0.12);
}

.menu-idx {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--color-fern-soft);
}

.menu-txt {
  font-family: var(--font-serif);
  font-size: 32px;
  letter-spacing: -0.01em;
  color: var(--color-ivory);
}

.menu-bottom {
  flex: none;
  padding-top: 40px;
}

.menu-mail {
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
  color: rgba(241, 238, 230, 0.5);
}

/* the two-line burger that morphs into an X */
.nav-burger {
  position: relative;
  display: block;
  width: 20px;
  height: 16px;
}

.nav-burger span {
  position: absolute;
  left: 0;
  display: block;
  width: 20px;
  height: 1.5px;
  border-radius: 1px;
  background: currentColor;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-burger span:first-child { top: 4px; }
.nav-burger span:last-child { top: 10.5px; }

.nav-burger-open span:first-child { transform: translateY(3.25px) rotate(45deg); }
.nav-burger-open span:last-child { transform: translateY(-3.25px) rotate(-45deg); }
```

- [ ] **Step 6: Verify open state, close paths, and landscape**

```bash
node scripts/shot.mjs http://localhost:3000 390 screenshots/t4-menu-open.png --open-menu
node scripts/shot.mjs http://localhost:3000 844 screenshots/t4-menu-landscape.png --open-menu --height 390
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t4-desktop.png --height 900
```

Expected: `t4-menu-open.png` matches the approved layout-A mockup (`menu-layout.html`, first option): ink background, light lockup, X burger, 01-04 fern indexes, serif ivory links with hairline dividers, fern CTA and email at the bottom. Landscape at 390px tall: the CTA is reachable (overlay scrolls). Desktop identical to baseline. Manually confirm in a browser: link tap closes and scrolls; Escape closes; page behind does not scroll while open.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: succeeds (watch for TypeScript errors on the `inert` prop; React 19 types accept a boolean).

- [ ] **Step 8: Commit**

```bash
git add src/components/Nav.tsx src/app/globals.css
git commit -m "feat: replace mobile dropdown with ink takeover menu"
```

---

### Task 5: Menu motion

**Files:**
- Modify: `src/app/globals.css` (extend the menu block from Task 4)

**Interfaces:**
- Consumes: `.menu-overlay`, `.menu-overlay-open`, `.menu-link`, `.menu-bottom`, `--i` from Task 4.
- Produces: finished menu (spec section 2 motion spec).

- [ ] **Step 1: Add transitions, stagger, and reduced-motion rules**

In the menu block added in Task 4, replace the bare `.menu-overlay` / `.menu-overlay-open` visibility rules with transitioned versions, and add the item animation:

```css
.menu-overlay {
  /* close: quick fade; visibility flips only after the fade finishes */
  transition:
    opacity 0.25s ease,
    visibility 0s linear 0.25s;
}

.menu-overlay-open {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    visibility 0s;
}

/* items hold hidden until the overlay opens, then rise in a 90ms stagger;
   the class toggle restarts the animation on every open */
.menu-overlay .menu-link,
.menu-overlay .menu-bottom {
  opacity: 0;
}

.menu-overlay-open .menu-link,
.menu-overlay-open .menu-bottom {
  animation: menu-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 90ms + 150ms);
}

@keyframes menu-rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-overlay,
  .menu-overlay-open {
    transition: none;
  }
  .menu-overlay-open .menu-link,
  .menu-overlay-open .menu-bottom {
    animation: none;
    opacity: 1;
  }
}
```

(Keep the `visibility: hidden; opacity: 0;` base and `visibility: visible; opacity: 1;` open declarations from Task 4; this step only adds the `transition`, item, keyframe, and reduced-motion rules.)

- [ ] **Step 2: Verify motion and reduced motion**

```bash
node scripts/shot.mjs http://localhost:3000 390 screenshots/t5-menu-settled.png --open-menu
node scripts/shot.mjs http://localhost:3000 390 screenshots/t5-menu-reduced.png --open-menu --reduced-motion
```

Expected: both show the fully settled open menu (the script waits 1400ms, past the last 690ms stagger). Manually in a browser: open shows the staggered rise; close is a clean quick fade; reopening replays the stagger. With OS reduce-motion (or devtools emulation): instant.

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add src/app/globals.css
git commit -m "feat: stagger the mobile menu open in the site's motion language"
```

---

### Task 6: Type scale that actually scales on phones

**Files:**
- Modify: `src/app/globals.css` (after the `.type-body` rule, ~line 86)

**Interfaces:**
- Produces: mobile-only `font-size` overrides for `.type-display`, `.type-h2`, `.type-accent`. No component changes; every consumer inherits.

Background: all three clamps have lower bounds that only engage at ~473px+ viewports, so a 320px phone renders the identical 48px display type as a 473px one (audit finding 5). Each override is continuous at 768px: the formula exceeds the cap there, so the cap (which equals the desktop floor) wins on both sides of the breakpoint.

- [ ] **Step 1: Add the overrides**

```css
/* Mobile: the desktop clamps bottom out around a 473px viewport, so nothing
   in the type scale adapts across 320-430px phones. These overrides scale
   within that range and meet the desktop floor exactly at 768px. */
@media (max-width: 767px) {
  .type-display {
    font-size: clamp(2.375rem, 1rem + 6.8vw, 3rem);
  }
  .type-h2 {
    font-size: clamp(1.75rem, 1rem + 3.8vw, 2.25rem);
  }
  .type-accent {
    font-size: clamp(1.25rem, 0.9rem + 1.8vw, 1.5rem);
  }
}
```

Resulting display sizes: 38px at 320, ~42.5px at 390, 48px (unchanged) at 768+.

- [ ] **Step 2: Verify**

```bash
node scripts/shot.mjs http://localhost:3000 320 screenshots/t6-320.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/t6-390.png --full
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t6-desktop.png --height 900
```

Expected: at 320 the hero H1 sits at 4 lines or fewer (was ~5) and the FinalCta headline visibly tightens; at 390 the hero H1 is 3 lines; desktop identical to baseline.

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add src/app/globals.css
git commit -m "fix: scale display type inside the 320-430px range"
```

---

### Task 7: Core dashboard demo mobile fixes

**Files:**
- Modify: `src/components/core-dashboard/CoreDashboard.tsx` (NavItems ~line 34-62, strip ~line 434, replay ~line 484, caption ~line 491)
- Modify: `src/components/core-dashboard/ChatView.tsx:32`
- Modify: `src/components/core-dashboard/AddView.tsx` (lines 17-29, 33-40)
- Modify: `src/components/core-dashboard/AnalyticsView.tsx` (lines 21, 50)
- Modify: `src/app/globals.css` (one `.cwd-replay` mobile rule)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: self-contained; the GSAP tour keeps working because the pill and cursor positions are measured from the live DOM (`offsetLeft`, `getBoundingClientRect`), which reflect these fixes automatically.

- [ ] **Step 1: Fix the tab strip overflow (audit finding 1)**

The strip needs ~339px but a 390px phone gives it 342px and a 320px phone 272px; icons are `flex-none` so flex-shrink cannot help, and the frame's `overflow-hidden` silently clips "Analytics". Hide the icons below `sm` (saves ~80px; labels alone need ~259px, which fits 272px) and add a scroll escape hatch.

In `NavItems` (CoreDashboard.tsx), wrap the icon for the strip variant:

```tsx
{variant === "side" ? (
  <Icon />
) : (
  <span className="hidden flex-none sm:block">
    <Icon />
  </span>
)}
```

On the strip container (line 434), add `overflow-x-auto`:

```tsx
<div className="cwd-nav relative flex gap-1 overflow-x-auto px-3 pt-3 lg:hidden">
```

- [ ] **Step 2: Reserve two caption lines on phones (audit: caption reflow)**

Line 491: `min-h-[2.75rem]` to `min-h-[4.25rem] sm:min-h-[2.75rem]` (the longest caption wraps to 3 lines at 320px; 4.25rem = 68px holds it without the paragraphs below jumping between beats).

- [ ] **Step 3: Let the typed question wrap instead of truncating (audit finding 8)**

ChatView.tsx line 32: remove `truncate`:

```tsx
<span className="min-w-0 flex-1 text-ivory/40">
```

Desktop is unaffected (the question fits one line at 500px of composer width); on phones the typing wraps to a second line and the caret stays visible.

- [ ] **Step 4: Fix the AddView chip and title row (audit finding 10)**

Give each source chip a truncating label span (the pill otherwise wraps internally inside its own border radius at 320px):

```tsx
<span
  key={s.label}
  className="flex max-w-full items-center gap-1.5 rounded-full bg-[#24221c] px-3 py-1.5 text-[11px] font-medium text-ivory/70"
>
  <span
    className={`h-1.5 w-1.5 flex-none rounded-full ${
      s.live ? "cwd-live-dot bg-fern-soft" : "bg-ivory/25"
    }`}
  />
  <span className="truncate">{s.label}</span>
</span>
```

Stack the transcript title above its badge below 480px (the `flex-none` badge otherwise crushes the title to ~12 characters per line):

```tsx
<div className="flex flex-col items-start gap-1 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between min-[480px]:gap-2">
```

- [ ] **Step 5: Stack the Analytics stat tiles and pin the chart labels (audit finding 4)**

AnalyticsView.tsx line 21:

```tsx
<div className="mt-4 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
```

Line 50 (bar labels shatter at narrow widths):

```tsx
<p className="whitespace-nowrap text-[9px] text-ivory/50 min-[400px]:text-[10px]">
```

- [ ] **Step 6: Make the Replay button tappable (audit finding 7)**

The button is ~38x16px. Add a mobile-only rule to globals.css (unlayered rules beat Tailwind utilities, the repo already relies on this):

```css
/* phones: pad the dashboard Replay hit box to 44px without moving its text
   (top -2px + 14px padding puts the label back at the original 12px offset;
   right 4px + 12px padding restores the original 16px) */
@media (max-width: 767px) {
  .cwd-replay {
    top: -2px;
    right: 4px;
    padding: 14px 12px;
  }
}
```

- [ ] **Step 7: Verify**

```bash
node scripts/shot.mjs http://localhost:3000 320 screenshots/t7-320.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/t7-390.png --full
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t7-desktop.png --full --height 900
```

Expected: in the dashboard section at 320 and 390, all four tab labels are visible (no clipping); stat tiles stacked at 320, three-across at 430+ (spot check 430 if unsure); desktop full-page identical to `base-desktop-1440.png`. Manually watch the tour once at 390: pill and cursor land on the Analytics tab (they measure the live DOM), the typed question wraps without losing the caret, captions do not shift the paragraphs below.

- [ ] **Step 8: Build and commit**

```bash
npm run build
git add src/components/core-dashboard src/app/globals.css
git commit -m "fix: dashboard demo layout and tap targets on phones"
```

---

### Task 8: Brain section mobile fixes

**Files:**
- Modify: `src/app/globals.css` (brain rules, ~lines 600-660)
- Modify: `src/components/brain/BrainField.tsx` (reduced-motion branch ~line 24, resize handler ~line 377)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: self-contained.

- [ ] **Step 1: Right-size the stage on phones (audit finding 2, part 1)**

`clamp(500px, 54vw, 660px)` pins every phone to a 500px-tall stage that the 342px-wide graph disc fills less than half of. Add after the existing `.brain-stage` rule:

```css
/* phones: the 500px floor leaves ~215px of dead space above a width-driven
   graph; near-square tracks the disc instead */
@media (max-width: 767px) {
  .brain-stage {
    height: min(440px, 112vw);
  }
}
```

- [ ] **Step 2: Fix the reduced-motion still on phones (audit finding 2, part 2)**

`BrainStill`'s fixed 1000x640 landscape viewBox letterboxes to a 219px-tall strip at 0.34 scale inside the portrait stage; nodes render as sub-2px dust. In `BrainField.tsx`, the reduced-motion branch returns early and leaves the still visible; before that early return, switch the still to `slice` on phones so it fills the portrait box (about 0.68 scale, cropping the empty side margins instead of shrinking the graph):

```tsx
// portrait phones: the still's landscape viewBox letterboxes to a dust-scale
// strip under "meet"; "slice" fills the box and crops the empty margins
const still = stageEl.querySelector(".brain-still");
if (still && window.matchMedia("(max-width: 767px)").matches) {
  still.setAttribute("preserveAspectRatio", "xMidYMid slice");
}
```

Place this so it runs in the reduced-motion path (adapt `stageEl` to the actual variable holding the stage element in that scope; the file resolves it before the early return). No-JS users keep `meet`; live-animation users never see the still.

- [ ] **Step 3: Gate the resize reseed on a real dimension change (audit finding 6)**

iOS fires `resize` on every address-bar collapse; dimensions come back identical (the stage is width-driven), but the handler still teleports all ~95 nodes home. In the `onResize` handler (~line 377), capture the stage dimensions before `resize()` and only reseed when they changed:

```tsx
const onResize = () => {
  window.clearTimeout(rt);
  rt = window.setTimeout(() => {
    const prevW = W;
    const prevH = H;
    resize();
    if (W !== prevW || H !== prevH) {
      P.forEach((s) => (s.init = false));
    }
  }, 150);
};
```

(`W`, `H`, `P`, `rt`, and `resize` are the existing closure bindings in that file; keep their real names.)

- [ ] **Step 4: Legible transcript and clear tag row on phones**

The note card's monospace transcript is 11.5px, and at 320px its two paragraphs reflow to ~5 lines each, growing past the 176px body into the absolutely positioned tag row. Add:

```css
/* phones: readable transcript, and the raw/sorted layers stop above the
   absolutely positioned tag row instead of colliding with it */
@media (max-width: 767px) {
  .brain-card-line {
    font-size: 12.5px;
  }
  .brain-card-raw,
  .brain-card-sorted {
    inset: 0 0 32px;
  }
}
```

- [ ] **Step 5: Make the brain Replay tappable (audit finding 7)**

```css
@media (max-width: 767px) {
  .brain-replay {
    right: 2px;
    bottom: 0;
    padding: 15px 14px;
  }
}
```

(15px + 15px padding + the ~14px line box = 44px tall; the label lands within ~3px of its original spot.)

- [ ] **Step 6: Verify**

```bash
node scripts/shot.mjs http://localhost:3000 390 screenshots/t8-390.png --full
node scripts/shot.mjs http://localhost:3000 390 screenshots/t8-390-reduced.png --full --reduced-motion
node scripts/shot.mjs http://localhost:3000 320 screenshots/t8-320.png --full
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t8-desktop.png --full --height 900
node scripts/shot.mjs http://localhost:3000 1440 screenshots/t8-desktop-reduced.png --full --height 900 --reduced-motion
```

Expected: brain section at 390 has visibly less dead vertical space; the reduced-motion shot shows the graph filling the stage (not a letterboxed strip); transcript readable at 320 with tags clear of the last line; both desktop shots identical to their baseline equivalents (capture a reduced-motion desktop baseline first if comparing strictly; the only intended reduced-motion desktop change is none).

- [ ] **Step 7: Build and commit**

```bash
npm run build
git add src/app/globals.css src/components/brain/BrainField.tsx
git commit -m "fix: brain section stage, still, and touch targets on phones"
```

---

### Task 9: Remaining tap targets and the full-page sweep

**Files:**
- Modify: `src/components/Footer.tsx` (email link, ~line 21)
- Possibly small fixes surfaced by the sweep

**Interfaces:**
- Consumes: everything above.
- Produces: the spec's success criteria, verified.

- [ ] **Step 1: Pad the footer email tap target**

The mailto link is ~20px tall. Expand its hit box on phones without moving anything visually (negative margins cancel the padding in layout):

```tsx
<a
  href={`mailto:${CONTACT_EMAIL}`}
  className="text-ivory/80 transition-colors hover:text-fern-soft max-md:-m-3 max-md:inline-block max-md:p-3"
>
```

- [ ] **Step 2: Full sweep at every target width**

```bash
for w in 320 360 390 430; do
  node scripts/shot.mjs http://localhost:3000 $w screenshots/final-$w.png --full
done
node scripts/shot.mjs http://localhost:3000 1440 screenshots/final-desktop.png --full --height 900
```

Expected: overflow = 0px at every width. View all four mobile full-page shots end to end against the spec's fix criteria: every section readable, nothing clipped, nothing squeezed, tap targets comfortable. `final-desktop.png` identical to `base-desktop-1440.png`.

- [ ] **Step 3: Fix anything the sweep surfaces**

Small, targeted, mobile-gated fixes only; re-run the sweep after each. If something needs structural change, stop and surface it instead of improvising.

- [ ] **Step 4: Final build and lint**

```bash
npm run build
npm run lint
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: footer tap target and final mobile sweep fixes"
```

Do NOT push. The user reviews on the dev server (and on a real phone via the LAN URL if desired) and pushes to deploy when satisfied.

---

## Deliberately out of scope (noted, not silently dropped)

- Team headshots are served at 760px to a 342px slot (~290KB); resizing them is a follow-up, the spec's payload criterion covers only the hero.
- The WhoItsFor marquee builds a 48-chip DOM row sized for large displays; mobile perf nicety, not a breakage.
- `NAV_H = 64` vs the resting 80px header makes anchor scrolls land 16px high; pre-existing, unchanged by this work.
- The `CLAUDE.md` "Current focus: the hero" section is stale; docs follow-up.
- Landscape-phone hero veils (`h-36`/`h-44` fades covering most of a 390px-tall viewport) and the 640-767px tablet band are outside the 320-430px portrait scope.
