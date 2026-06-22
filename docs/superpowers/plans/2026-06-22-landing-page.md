# Crosswell Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single Crosswell Consulting landing page (11 parts, nav through footer) on the existing design foundation, with the locked copy and a tasteful motion layer.

**Architecture:** A Next.js 16 App Router page. The page and its content sections are React Server Components composing the existing UI primitives; all motion lives in small client islands (`SmoothScroll`, `Reveal`/`RevealGroup`/`RevealItem`, `CountUp`, the nav menu, the hero entrance, the ambient background, and the flagship agent flow), so the page renders and reads server-side and the motion code is split out. Smooth scroll is Lenis; reveals, the agent flow, and the count-ups are Motion (Framer Motion). Everything degrades to a fully visible, static page under `prefers-reduced-motion` and without JavaScript.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript (strict), Tailwind CSS v4 (CSS-first tokens in `src/app/globals.css`), `motion` (Framer Motion, imported from `motion/react`), `lenis` (imported from `lenis/react`), `lucide-react`. Tests: Vitest + @testing-library/react + jest-axe.

## Global Constraints

These apply to every task. Values are copied verbatim from `docs/superpowers/specs/2026-06-22-landing-page-design.md`.

- **Next.js 16, not older.** Before writing page, layout, or route code, read the relevant guide in `node_modules/next/dist/docs/` per `AGENTS.md`. Do not assume APIs from older versions.
- **No em dashes anywhere**, in copy or in repo files. Ranges use "to" (`6 to 10 hours`, `$25M to $500M+`, `10 to 20+`). Asides use commas.
- **Positioning:** horizontal AI consulting for any business, investment funds as the proven niche / flagship proof. Do not re-narrow the broad hero to funds-only, and do not invent a non-fund case study (there is none yet).
- **CTA:** the label is exactly `Book a call`. Every Book a call action targets `mailto:hello@crosswellconsulting.com`, except the footer "Book a call" link (an in-page anchor to `#final-cta`) and the footer contact line (which shows the email address).
- **Never name the active fund client.** Only "a private credit fund we work with" / "an active investment fund" / "a live private credit fund".
- **No fabricated metrics.** Only the numbers in the spec: ~80% less screening time; 3 days to a 20-minute diligence review; 6 to 10 hours per memo; a quarterly week to an afternoon for LP reporting; a day of data-pulling to real-time; 10 to 20+ hours a week; $25M to $500M+ AUM. No price, client count, or call length.
- **Jargon expanded on first page-wide use only:** AUM in the tools framing line; CRM, IC, and LP first in the tools cards (`Investment Committee (IC)`, `Limited Partners (LPs)`, `CRM (Customer Relationship Management)`); "agentic systems" defined in the flagship subheading. Plain after.
- **Motion discipline:** animate `transform` and `opacity` only (no width/height/top/left), keep CLS under 0.1, one to two focal animations per view, durations 150 to 300ms for micro-interactions and within 400ms per element for reveals. Ease-out on enter. Everything renders in its final visible state under `prefers-reduced-motion` and without JS.
- **Surfaces:** two charcoal sections, the flagship (`#flagship`) and the final CTA (`#final-cta`) plus the footer. Charcoal is set with `data-section="dark"` (the `<Section dark>` prop), which remaps the tokens; never hardcode charcoal colors in components.
- **Conventions:** path alias `@/* -> ./src/*`; `cn` from `@/lib/cn`; primitives from `@/components/ui`; section components in `src/components/sections/`; motion islands in `src/components/motion/`; tests colocated as `<name>.test.tsx`; run one test file with `npx vitest run <path>` and the whole suite with `npm run test:run`.
- **Accessibility:** one `<h1>` (hero), section headings are `<h2>`, no skipped levels; visible focus rings; decorative icons are `aria-hidden` (the `Icon` component handles this when no `label` is passed); the logo and headshots have alt text; 44px minimum interactive targets (the primitives already meet this).

---

## File Structure

**Created:**
- `src/components/ui/button-styles.ts`: shared Button/ButtonLink class strings and `buttonClass()` helper (DRY source of truth for button styling).
- `src/components/ui/button-link.tsx`: `ButtonLink`, an `<a>` styled exactly like `Button`, for `mailto:` CTAs and button-styled links.
- `src/components/motion/smooth-scroll.tsx`: `SmoothScroll`, the Lenis root provider (client). Disables under reduced motion.
- `src/components/motion/reveal.tsx`: `Reveal`, `RevealGroup`, `RevealItem` scroll-reveal islands (client). Hydration-safe, reduced-motion aware.
- `src/components/motion/count-up.tsx`: `CountUp`, an in-view number animation (client).
- `src/components/sections/nav.tsx`: sticky nav with mobile menu and condense-on-scroll (client).
- `src/components/sections/hero.tsx`: hero with composed on-load entrance (client) and the ambient background.
- `src/components/sections/ambient-background.tsx`: the subtle drifting hero background (client).
- `src/components/sections/problem.tsx`, `tools.tsx`, `flagship.tsx`, `agent-flow.tsx`, `why-us.tsx`, `value.tsx`, `how-we-work.tsx`, `team.tsx`, `final-cta.tsx`, `footer.tsx`: the content sections (server, except `agent-flow.tsx` which is a client island used by `flagship.tsx`).
- Colocated `<name>.test.tsx` for each of the above.
- `public/xw_logo_dark.svg`, `public/xw_logo_light.svg`: copied logo assets.

**Modified:**
- `src/app/layout.tsx`: real metadata (title, description, `metadataBase`, canonical) and the `SmoothScroll` wrapper.
- `src/app/page.tsx`: replace the starter with the assembled page.
- `src/components/ui/button.tsx`: use the shared `buttonClass()` helper.
- `src/components/ui/index.ts`: export `ButtonLink`.
- `src/test/setup.ts`: add `matchMedia`, `IntersectionObserver`, and `ResizeObserver` stubs so motion and Lenis components render in jsdom.
- `eslint.config.mjs`: turn off `react/no-unescaped-entities` and `@next/next/no-img-element` for the copy-heavy page and the SVG wordmarks.

---

## Task 1: Dependencies, assets, and test environment

**Files:**
- Modify: `package.json` (via `npm install`)
- Create: `public/xw_logo_dark.svg`, `public/xw_logo_light.svg`
- Modify: `src/test/setup.ts`
- Modify: `eslint.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: the `motion` and `lenis` packages on disk; the two logo files under `public/`; jsdom stubs for `window.matchMedia`, `IntersectionObserver` (reports intersecting immediately), and `ResizeObserver`, which every later motion test relies on.

- [ ] **Step 1: Install the motion libraries**

Run:
```bash
npm install motion lenis
```
Expected: `package.json` gains `motion` and `lenis` under dependencies; install completes without peer-dependency errors against React 19.

- [ ] **Step 2: Copy the logo assets into `public/`**

Run (Git Bash):
```bash
cp "docs/brain/05 Brand & Assets/xw_logo_dark.svg" public/xw_logo_dark.svg
cp "docs/brain/05 Brand & Assets/xw_logo_light.svg" public/xw_logo_light.svg
```
Expected: both files exist under `public/`. (On PowerShell use `Copy-Item "docs/brain/05 Brand & Assets/xw_logo_dark.svg" public/`.)

- [ ] **Step 3: Add the jsdom stubs to the test setup**

Replace the entire contents of `src/test/setup.ts` with:
```ts
import "@testing-library/jest-dom/vitest";
import { expect, beforeAll } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom does not implement these. Motion (useReducedMotion, whileInView, useInView)
// and Lenis need them. The IntersectionObserver stub reports "intersecting"
// immediately so reveal and in-view logic resolves deterministically in tests.
beforeAll(() => {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  class MockIntersectionObserver {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(target: Element) {
      this.cb(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  globalThis.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
  window.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
});
```

- [ ] **Step 4: Relax two ESLint rules for the marketing copy**

The page copy uses apostrophes throughout (`don't`, `fund's`, `team's`) and the wordmark is an inline SVG via `<img>`. Replace the entire contents of `eslint.config.mjs` with:
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Marketing copy uses apostrophes throughout; readable source beats escaped entities.
      "react/no-unescaped-entities": "off",
      // The brand wordmark is an inline SVG via <img>; next/image adds nothing for it.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 5: Verify the existing suite still passes**

Run:
```bash
npm run test:run
```
Expected: PASS. The existing foundation tests (button, card, section, container, eyebrow, icon, input, text-link, layout) are still green with the new setup.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json public/xw_logo_dark.svg public/xw_logo_light.svg src/test/setup.ts eslint.config.mjs
git commit -m "chore: add motion and lenis, logo assets, jsdom stubs, eslint tweaks"
```

---

## Task 2: Shared button styles and ButtonLink

**Files:**
- Create: `src/components/ui/button-styles.ts`
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/button-link.tsx`
- Modify: `src/components/ui/index.ts`
- Test: `src/components/ui/button-link.test.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/cn`.
- Produces: `export type ButtonVariant = "primary" | "secondary" | "link"`; `export function buttonClass(variant?: ButtonVariant, className?: string): string`; `export function ButtonLink(props: { variant?: ButtonVariant } & React.ComponentProps<"a">): JSX.Element` (exported from `@/components/ui`). Every section's `Book a call` uses `ButtonLink`.

- [ ] **Step 1: Write the failing test for `ButtonLink`**

Create `src/components/ui/button-link.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ButtonLink } from "./button-link";

describe("ButtonLink", () => {
  it("renders an anchor with the fern primary styling by default", () => {
    render(<ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>);
    const link = screen.getByRole("link", { name: "Book a call" });
    expect(link).toHaveAttribute("href", "mailto:hello@crosswellconsulting.com");
    expect(link).toHaveClass("bg-primary", "text-primary-foreground", "min-h-11");
  });

  it("applies the secondary outline variant", () => {
    render(
      <ButtonLink variant="secondary" href="#team">
        See the team
      </ButtonLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("border", "border-control-border", "text-foreground");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ButtonLink href="#x">Book a call</ButtonLink>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run:
```bash
npx vitest run src/components/ui/button-link.test.tsx
```
Expected: FAIL with "Cannot find module './button-link'".

- [ ] **Step 3: Create the shared styles module**

Create `src/components/ui/button-styles.ts`:
```ts
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans text-[0.9375rem] font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-foreground disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "min-h-11 px-5 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99]",
  secondary:
    "min-h-11 px-5 border border-control-border text-foreground hover:bg-primary/5 active:scale-[0.99]",
  link: "min-h-11 px-1 text-link underline-offset-4 hover:underline",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}
```

- [ ] **Step 4: Point `Button` at the shared helper**

Replace the entire contents of `src/components/ui/button.tsx` with:
```tsx
import { buttonClass, type ButtonVariant } from "./button-styles";

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: { variant?: ButtonVariant } & React.ComponentProps<"button">) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
```

- [ ] **Step 5: Create `ButtonLink`**

Create `src/components/ui/button-link.tsx`:
```tsx
import { buttonClass, type ButtonVariant } from "./button-styles";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: { variant?: ButtonVariant } & React.ComponentProps<"a">) {
  return <a className={buttonClass(variant, className)} {...props} />;
}
```

- [ ] **Step 6: Export `ButtonLink` from the kit**

Add this line to `src/components/ui/index.ts` (after the `Button` export):
```ts
export { ButtonLink } from "./button-link";
```

- [ ] **Step 7: Run the button tests, expect pass**

Run:
```bash
npx vitest run src/components/ui/button-link.test.tsx src/components/ui/button.test.tsx
```
Expected: PASS. `ButtonLink` passes, and the existing `button.test.tsx` still passes because the classes are unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/button-styles.ts src/components/ui/button.tsx src/components/ui/button-link.tsx src/components/ui/button-link.test.tsx src/components/ui/index.ts
git commit -m "feat: add ButtonLink sharing Button styles via buttonClass"
```

---

## Task 3: Reveal scroll-reveal islands

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Test: `src/components/motion/reveal.test.tsx`

**Interfaces:**
- Consumes: `motion`, `useReducedMotion` from `motion/react`.
- Produces:
  - `export function Reveal(props: { children: React.ReactNode; className?: string; delay?: number; y?: number }): JSX.Element`: fades and rises the wrapped block once in view.
  - `export function RevealGroup(props: { children: React.ReactNode; className?: string; stagger?: number }): JSX.Element`: staggers its `RevealItem` children.
  - `export function RevealItem(props: { children: React.ReactNode; className?: string; y?: number }): JSX.Element`: one staggered child.
  All three render children visible (static) under reduced motion and before hydration, so content never depends on JS to be readable.

- [ ] **Step 1: Write the failing test**

Create `src/components/motion/reveal.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

describe("Reveal", () => {
  it("renders the wrapped content", () => {
    render(
      <Reveal>
        <p>Revealed copy</p>
      </Reveal>,
    );
    expect(screen.getByText("Revealed copy")).toBeInTheDocument();
  });

  it("renders all grouped items", () => {
    render(
      <RevealGroup>
        <RevealItem>
          <span>One</span>
        </RevealItem>
        <RevealItem>
          <span>Two</span>
        </RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Reveal>
        <p>Accessible content</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run:
```bash
npx vitest run src/components/motion/reveal.test.tsx
```
Expected: FAIL with "Cannot find module './reveal'".

- [ ] **Step 3: Implement the reveal islands**

Create `src/components/motion/reveal.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DURATION = 0.4;

// Only apply the hidden initial state after hydration, so server-rendered
// content (and no-JS / crawler views) is always visible.
function useReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ready = useReady();
  const reduce = useReducedMotion();
  const animate = ready && !reduce;
  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ready = useReady();
  const reduce = useReducedMotion();
  const animate = ready && !reduce;
  return (
    <motion.div
      className={className}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "show" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run:
```bash
npx vitest run src/components/motion/reveal.test.tsx
```
Expected: PASS (content renders; no axe violations).

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/reveal.tsx src/components/motion/reveal.test.tsx
git commit -m "feat: add Reveal/RevealGroup/RevealItem scroll-reveal islands"
```

---

## Task 4: CountUp in-view number animation

**Files:**
- Create: `src/components/motion/count-up.tsx`
- Test: `src/components/motion/count-up.test.tsx`

**Interfaces:**
- Consumes: `animate`, `useInView`, `useReducedMotion` from `motion/react`.
- Produces: `export function CountUp(props: { to: number; from?: number; duration?: number; format?: (value: number) => string; prefix?: string; suffix?: string; className?: string }): JSX.Element`. Animates from `from` to `to` when scrolled into view; shows the final value immediately under reduced motion. Used by the Value section.

- [ ] **Step 1: Write the failing test**

Create `src/components/motion/count-up.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { CountUp } from "./count-up";

function setReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("CountUp", () => {
  it("renders a number with its suffix", () => {
    setReducedMotion(false);
    render(<CountUp to={80} suffix="%" />);
    expect(screen.getByText(/%$/)).toBeInTheDocument();
  });

  it("shows the final value immediately under reduced motion", async () => {
    setReducedMotion(true);
    render(<CountUp to={80} suffix="%" />);
    expect(await screen.findByText("80%")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    setReducedMotion(false);
    const { container } = render(<CountUp to={20} suffix=" min" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run:
```bash
npx vitest run src/components/motion/count-up.test.tsx
```
Expected: FAIL with "Cannot find module './count-up'".

- [ ] **Step 3: Implement `CountUp`**

Create `src/components/motion/count-up.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CountUp({
  to,
  from = 0,
  duration = 1.2,
  format,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  format?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const renderValue = (v: number) => (format ? format(v) : String(Math.round(v)));
  const [text, setText] = useState(() => renderValue(from));

  useEffect(() => {
    if (reduce) {
      setText(renderValue(to));
      return;
    }
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setText(renderValue(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${text}${suffix}`}
    </span>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run:
```bash
npx vitest run src/components/motion/count-up.test.tsx
```
Expected: PASS (renders a numeric span; reduced-motion shows the final value; no axe violations).

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/count-up.tsx src/components/motion/count-up.test.tsx
git commit -m "feat: add CountUp in-view number animation"
```

---

## Task 5: SmoothScroll provider and layout wiring

**Files:**
- Create: `src/components/motion/smooth-scroll.tsx`
- Test: `src/components/motion/smooth-scroll.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `ReactLenis` from `lenis/react`; `useReducedMotion` from `motion/react`.
- Produces: `export function SmoothScroll(props: { children: React.ReactNode }): JSX.Element`, mounted once in the root layout. Provides Lenis momentum scroll with working anchor links; renders children directly (native scroll) under reduced motion.

- [ ] **Step 1: Write the failing test**

Create `src/components/motion/smooth-scroll.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmoothScroll } from "./smooth-scroll";

function setReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("SmoothScroll", () => {
  it("renders children with momentum scroll enabled", () => {
    setReducedMotion(false);
    render(
      <SmoothScroll>
        <p>Page content</p>
      </SmoothScroll>,
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders children directly under reduced motion", () => {
    setReducedMotion(true);
    render(
      <SmoothScroll>
        <p>Reduced content</p>
      </SmoothScroll>,
    );
    expect(screen.getByText("Reduced content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run:
```bash
npx vitest run src/components/motion/smooth-scroll.test.tsx
```
Expected: FAIL with "Cannot find module './smooth-scroll'".

- [ ] **Step 3: Implement `SmoothScroll`**

Create `src/components/motion/smooth-scroll.tsx`:
```tsx
"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        // Anchors smooth-scroll to in-page ids; sections carry scroll-mt-24 for the
        // nav offset. If the sticky nav still overlaps a target after install, switch
        // to anchors: { offset: -88 } (the installed lenis supports the object form).
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run:
```bash
npx vitest run src/components/motion/smooth-scroll.test.tsx
```
Expected: PASS (children render in both modes; the `ResizeObserver` stub from Task 1 lets Lenis mount).

- [ ] **Step 5: Update the root layout (metadata + provider)**

Replace the entire contents of `src/app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crosswellconsulting.com"),
  title: "Crosswell Consulting | Custom AI tools and automations for your business",
  description:
    "Crosswell builds custom AI tools, software, and automations that take manual work off your team so your business runs leaner and saves money. Our deepest proof is in investment funds. Book a call.",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify the suite and the build**

Run:
```bash
npm run test:run
```
Expected: PASS (all tests so far green).

- [ ] **Step 7: Commit**

```bash
git add src/components/motion/smooth-scroll.tsx src/components/motion/smooth-scroll.test.tsx src/app/layout.tsx
git commit -m "feat: add Lenis SmoothScroll provider and real page metadata"
```

---

## Task 6: Sticky navigation

**Files:**
- Create: `src/components/sections/nav.tsx`
- Test: `src/components/sections/nav.test.tsx`

**Interfaces:**
- Consumes: `Container`, `ButtonLink`, `Icon` from `@/components/ui`; `Menu`, `X` from `lucide-react`.
- Produces: `export function Nav(): JSX.Element` (client). Rendered first by the page assembly task.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders the wordmark and the primary links", () => {
    render(<Nav />);
    expect(screen.getByAltText("Crosswell Consulting")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "What we do" })).toHaveAttribute("href", "#what-we-do");
  });

  it("links Book a call to the mailto address", () => {
    render(<Nav />);
    const ctas = screen.getAllByRole("link", { name: /book a call/i });
    expect(ctas[0]).toHaveAttribute("href", "mailto:hello@crosswellconsulting.com");
  });

  it("toggles the mobile menu", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Nav />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/nav.test.tsx`
Expected: FAIL (Cannot find module './nav').

- [ ] **Step 3: Implement the component**
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container, ButtonLink, Icon } from "@/components/ui";

const NAV_LINKS = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Why us", href: "#why-us" },
  { label: "How we work", href: "#how-we-work" },
  { label: "Team", href: "#team" },
];

const MAILTO = "mailto:hello@crosswellconsulting.com";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When the mobile menu opens, move focus into it and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-10 bg-bg transition ${
        condensed ? "border-b border-border shadow-md" : ""
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-[4.5rem]">
        <a href="#hero" aria-label="Crosswell Consulting, back to top">
          <img src="/xw_logo_dark.svg" alt="Crosswell Consulting" className="h-7 w-auto" />
        </a>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground transition hover:text-accent-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={MAILTO} className="hidden sm:inline-flex">
            Book a call
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon icon={open ? X : Menu} />
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" ref={panelRef} className="border-t border-border bg-bg md:hidden">
          <Container className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 text-base text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href={MAILTO} className="mt-2" onClick={() => setOpen(false)}>
              Book a call
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/nav.test.tsx`
Expected: PASS (wordmark, links, mobile toggle, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/nav.tsx src/components/sections/nav.test.tsx
git commit -m "feat: add sticky nav with mobile menu"
```

---

## Task 7: Hero and ambient background

**Files:**
- Create: `src/components/sections/ambient-background.tsx`
- Create: `src/components/sections/hero.tsx`
- Test: `src/components/sections/ambient-background.test.tsx`
- Test: `src/components/sections/hero.test.tsx`

**Interfaces:**
- Consumes: `motion`, `useReducedMotion` from `motion/react`; `Section`, `Container`, `Eyebrow`, `ButtonLink`, `Icon` from `@/components/ui`; `ArrowRight` from `lucide-react`.
- Produces: `export function AmbientBackground(): JSX.Element` (client, decorative) and `export function Hero(): JSX.Element` (client). Hero carries the single `<h1>` and the `#hero` anchor.

- [ ] **Step 1: Write the failing tests**

Create `src/components/sections/ambient-background.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AmbientBackground } from "./ambient-background";

describe("AmbientBackground", () => {
  it("renders a decorative, aria-hidden layer", () => {
    const { container } = render(<AmbientBackground />);
    const layer = container.firstChild as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden");
  });
});
```

Create `src/components/sections/hero.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the single H1", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /holding your business back/i }),
    ).toBeInTheDocument();
  });

  it("renders the primary and secondary actions", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
    expect(screen.getByRole("link", { name: /see what we build/i })).toHaveAttribute(
      "href",
      "#what-we-do",
    );
  });

  it("renders the unnamed fund proof line", () => {
    render(<Hero />);
    expect(screen.getByText(/live private credit fund/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Hero />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the tests, expect failure**

Run: `npx vitest run src/components/sections/hero.test.tsx src/components/sections/ambient-background.test.tsx`
Expected: FAIL (Cannot find module './hero' / './ambient-background').

- [ ] **Step 3: Implement the ambient background**

Create `src/components/sections/ambient-background.tsx`:
```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

// A single, barely-perceptible fern blob that drifts slowly behind the hero.
// Atmosphere, not decoration. Frozen under reduced motion.
export function AmbientBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-1/3 left-1/4 h-[40rem] w-[40rem] rounded-full bg-primary/[0.06] blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={
          reduce ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }
        }
      />
    </div>
  );
}
```

- [ ] **Step 4: Implement the hero**

Create `src/components/sections/hero.tsx`:
```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Section, Container, Eyebrow, ButtonLink, Icon } from "@/components/ui";
import { AmbientBackground } from "./ambient-background";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  return (
    <Section id="hero" className="relative overflow-hidden scroll-mt-24">
      <AmbientBackground />
      <Container className="relative">
        <motion.div
          className="max-w-[48rem]"
          variants={animate ? containerVariants : undefined}
          initial={animate ? "hidden" : false}
          animate={animate ? "show" : undefined}
        >
          <motion.div variants={animate ? itemVariants : undefined}>
            <Eyebrow>Custom AI for any business</Eyebrow>
          </motion.div>
          <motion.h1
            variants={animate ? itemVariants : undefined}
            className="mt-4 font-serif text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
          >
            We find what's holding your business back and build the AI that moves it forward.
          </motion.h1>
          <motion.p
            variants={animate ? itemVariants : undefined}
            className="mt-6 max-w-[40rem] text-[1.1875rem] leading-[1.55] text-muted"
          >
            Crosswell builds custom AI tools, software, and automations that take the manual work
            off your team, so their time and your money go toward results instead of busywork. The
            same approach works for any business that wants to run leaner.
          </motion.p>
          <motion.div
            variants={animate ? itemVariants : undefined}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>
            <ButtonLink variant="link" href="#what-we-do">
              See what we build
              <Icon icon={ArrowRight} size="sm" />
            </ButtonLink>
          </motion.div>
          <motion.p
            variants={animate ? itemVariants : undefined}
            className="mt-8 text-sm text-muted"
          >
            Our deepest proof is in investment funds, where we are building the full AI operating
            layer for a live private credit fund.
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 5: Run the tests, expect pass**

Run: `npx vitest run src/components/sections/hero.test.tsx src/components/sections/ambient-background.test.tsx`
Expected: PASS (H1, both actions, proof line, no axe violations).

- [ ] **Step 6: Commit**
```bash
git add src/components/sections/hero.tsx src/components/sections/hero.test.tsx src/components/sections/ambient-background.tsx src/components/sections/ambient-background.test.tsx
git commit -m "feat: add hero with composed entrance and ambient background"
```

---

## Task 8: Problem section

**Files:**
- Create: `src/components/sections/problem.tsx`
- Test: `src/components/sections/problem.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `Icon` from `@/components/ui`; `Reveal`, `RevealGroup`, `RevealItem` from `@/components/motion/reveal`; lucide icons `Repeat2`, `FileSearch`, `LineChart`, `Hourglass`.
- Produces: `export function Problem(): JSX.Element` rendered by the page assembly task.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Problem } from "./problem";

describe("Problem", () => {
  it("renders the section heading", () => {
    render(<Problem />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /your sharpest people are buried in work a system should be doing/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and pain card copy", () => {
    render(<Problem />);
    expect(screen.getByText("The cost of busywork")).toBeInTheDocument();
    expect(screen.getByText("Data moved by hand")).toBeInTheDocument();
    expect(screen.getByText("Work that stalls on a person")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Problem />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/problem.test.tsx`
Expected: FAIL (Cannot find module './problem').

- [ ] **Step 3: Implement the component**
```tsx
import { Repeat2, FileSearch, LineChart, Hourglass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Pain = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

const PAINS: Pain[] = [
  {
    title: "Data moved by hand",
    detail:
      "The same numbers get rekeyed from one tool to another, and the hours and the errors pile up.",
    icon: Repeat2,
  },
  {
    title: "Documents read line by line",
    detail:
      "Contracts, reports, and filings get read manually and slowly, with real risk of missing what matters.",
    icon: FileSearch,
  },
  {
    title: "The same reports, rebuilt every time",
    detail:
      "Recurring updates and dashboards get assembled from scratch instead of generated on demand.",
    icon: LineChart,
  },
  {
    title: "Work that stalls on a person",
    detail:
      "Multi-step processes wait on someone to push them forward, so everything moves at the speed of the busiest person.",
    icon: Hourglass,
  },
];

export function Problem() {
  return (
    <Section id="problem" className="scroll-mt-24">
      <Container>
        <Reveal>
          <Eyebrow>The cost of busywork</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Your sharpest people are buried in work a system should be doing.
          </h2>
          <p className="mt-6 max-w-[68ch] text-[1.1875rem] leading-[1.55] text-muted">
            Most teams run leaner than they would like. The people who cost the most and decide the
            most lose hours every week to manual work: rekeying the same data between systems,
            chasing documents, rebuilding the same reports, and assembling updates by hand.
          </p>
          <p className="mt-4 max-w-[68ch] text-[1.1875rem] leading-[1.55] text-muted">
            The cost is not only hours. It is slower decisions, missed opportunities, and your
            team's real edge, their judgment, spent on tasks that never needed a person in the first
            place.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((pain) => (
            <RevealItem key={pain.title}>
              <Card className="p-5">
                <Icon icon={pain.icon} size="md" className="text-accent-text" />
                <h3 className="mt-4 font-sans text-base font-semibold">{pain.title}</h3>
                <p className="mt-2 text-sm text-muted">{pain.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/problem.test.tsx`
Expected: PASS (all assertions, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/problem.tsx src/components/sections/problem.test.tsx
git commit -m "feat: add problem landing section"
```

---

## Task 9: Tools section (five tools)

**Files:**
- Create: `src/components/sections/tools.tsx`
- Test: `src/components/sections/tools.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `Icon`, `ButtonLink` from `@/components/ui`; `Reveal`, `RevealGroup`, `RevealItem` from `@/components/motion/reveal`; lucide icons `Inbox`, `FileSearch`, `FilePen`, `BarChart3`, `LayoutDashboard`.
- Produces: `export function Tools(): JSX.Element` rendered by the page assembly task. Renders the `#what-we-do` anchor.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Tools } from "./tools";

describe("Tools", () => {
  it("renders the section heading", () => {
    render(<Tools />);
    expect(
      screen.getByRole("heading", { level: 2, name: /five tools we built for funds/i }),
    ).toBeInTheDocument();
  });

  it("renders the five tool names", () => {
    render(<Tools />);
    expect(screen.getByText("Deal Screening Engine")).toBeInTheDocument();
    expect(screen.getByText("Diligence Document Agent")).toBeInTheDocument();
    expect(screen.getByText("Portfolio & Pipeline Dashboard")).toBeInTheDocument();
  });

  it("renders the source caption", () => {
    render(<Tools />);
    expect(
      screen.getByText(/numbers drawn from a private credit fund we work with/i),
    ).toBeInTheDocument();
  });

  it("renders the Book a call link with the mailto href", () => {
    render(<Tools />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tools />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/tools.test.tsx`
Expected: FAIL (Cannot find module './tools').

- [ ] **Step 3: Implement the component**
```tsx
import { Inbox, FileSearch, FilePen, BarChart3, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Tool = {
  name: string;
  description: string;
  beforeAfter: { before: string; figure: string; after: string };
  icon: LucideIcon;
};

const TOOLS: Tool[] = [
  {
    name: "Deal Screening Engine",
    description:
      "Ingests inbound deals from email and CRM (Customer Relationship Management), scores them against the fund's criteria, and surfaces only the ones worth a partner's time.",
    beforeAfter: {
      before: "Before: hundreds of inbounds reviewed by hand. After: a ranked short list, roughly ",
      figure: "80%",
      after: " less screening time.",
    },
    icon: Inbox,
  },
  {
    name: "Diligence Document Agent",
    description:
      "Point it at a data room or a stack of PDFs and it extracts key terms, covenants, risks, and financials into a structured summary you can actually read.",
    beforeAfter: { before: "Before: a 3-day read. After: a ", figure: "20-minute", after: " review." },
    icon: FileSearch,
  },
  {
    name: "Memo & IC Deck Drafter",
    description:
      "Drafts first-pass investment memos and Investment Committee (IC) decks straight from the fund's data and its own template.",
    beforeAfter: {
      before: "Before: 6 to 10 hours per deal. After: a drafted first pass in ",
      figure: "minutes",
      after: ".",
    },
    icon: FilePen,
  },
  {
    name: "LP Reporting Automation",
    description:
      "Pulls portfolio numbers and auto-builds consistent, branded investor updates for the fund's Limited Partners (LPs).",
    beforeAfter: {
      before: "Before: a quarterly week of formatting. After: an ",
      figure: "afternoon",
      after: " of review.",
    },
    icon: BarChart3,
  },
  {
    name: "Portfolio & Pipeline Dashboard",
    description:
      "One live view across deals and holdings, replacing the scattered spreadsheets a team rebuilds by hand.",
    beforeAfter: { before: "Before: a day of data-pulling. After: ", figure: "real-time", after: " answers." },
    icon: LayoutDashboard,
  },
];

export function Tools() {
  return (
    <Section id="what-we-do" className="scroll-mt-24">
      <Container>
        <Reveal>
          <Eyebrow>What we build</Eyebrow>
          <h2 className="mt-3 max-w-[20ch] font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Five tools we built for funds, each aimed at one workflow a team dreads
          </h2>
          <p className="mt-4 max-w-[68ch] text-[1.1875rem] leading-[1.55]">
            Point solutions that drop into how a business already works. Every one replaces a
            specific manual job, and the before-and-after time is the proof.
          </p>
          <p className="mt-4 max-w-[68ch] text-base leading-[1.65] text-muted">
            Investment funds, the private equity, private credit, and family offices that run lean
            on roughly $25M to $500M+ in AUM (Assets Under Management), are where we go deepest. This
            is what that looks like there. The same approach fits whatever manual workflow is costing
            your team the most.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <RevealItem key={tool.name}>
              <Card className="flex h-full flex-col p-6">
                <Icon icon={tool.icon} size="md" className="text-accent-text" />
                <h3 className="mt-4 font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
                  {tool.name}
                </h3>
                <p className="mt-2 text-base leading-[1.65] text-muted">{tool.description}</p>
                <p className="mt-auto border-t border-border pt-4 text-sm text-muted">
                  {tool.beforeAfter.before}
                  <span className="font-medium text-accent-text">{tool.beforeAfter.figure}</span>
                  {tool.beforeAfter.after}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-6 text-sm text-muted">
          Numbers drawn from a private credit fund we work with.
        </p>
        <div className="mt-4">
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/tools.test.tsx`
Expected: PASS (heading, five tools, caption, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/tools.tsx src/components/sections/tools.test.tsx
git commit -m "feat: add tools landing section"
```

---

## Task 10: Flagship section and the animated agent flow

**Files:**
- Create: `src/components/sections/agent-flow.tsx`
- Create: `src/components/sections/flagship.tsx`
- Test: `src/components/sections/agent-flow.test.tsx`
- Test: `src/components/sections/flagship.test.tsx`

**Interfaces:**
- Consumes: `motion`, `useReducedMotion` from `motion/react`; `Section`, `Container`, `Eyebrow`, `Card`, `ButtonLink`, `Icon` from `@/components/ui`; `Reveal` from `@/components/motion/reveal`; lucide icons `Inbox`, `Filter`, `FileSearch`, `FilePen`, `CheckCircle2`, `ChevronRight`.
- Produces: `export function AgentFlow(): JSX.Element` (client; the five-step deal sequence) and `export function Flagship(): JSX.Element` (server; the charcoal `#flagship` anchor). The agent flow plays once on scroll into view and renders fully under reduced motion.

- [ ] **Step 1: Write the failing tests**

Create `src/components/sections/agent-flow.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { AgentFlow } from "./agent-flow";

describe("AgentFlow", () => {
  it("renders the five steps as list items", () => {
    render(<AgentFlow />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("A deal lands")).toBeInTheDocument();
    expect(screen.getByText("The team decides")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<AgentFlow />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

Create `src/components/sections/flagship.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Flagship } from "./flagship";

describe("Flagship", () => {
  it("renders the section heading", () => {
    render(<Flagship />);
    expect(
      screen.getByRole("heading", { level: 2, name: /one system that runs the deal/i }),
    ).toBeInTheDocument();
  });

  it("renders the custom agents block and the Book a call action", () => {
    render(<Flagship />);
    expect(screen.getByText(/Custom Agents & Integrations/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Flagship />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the tests, expect failure**

Run: `npx vitest run src/components/sections/flagship.test.tsx src/components/sections/agent-flow.test.tsx`
Expected: FAIL (Cannot find module './flagship' / './agent-flow').

- [ ] **Step 3: Implement the agent flow**

Create `src/components/sections/agent-flow.tsx`:
```tsx
"use client";

import {
  Inbox,
  Filter,
  FileSearch,
  FilePen,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui";

type Step = { label: string; title: string; detail: string; icon: LucideIcon };

const STEPS: Step[] = [
  {
    label: "Inbound",
    title: "A deal lands",
    detail: "A new opportunity arrives by email or CRM and enters the system automatically.",
    icon: Inbox,
  },
  {
    label: "Screening agent",
    title: "It gets scored",
    detail:
      "The screening agent scores the deal against the fund's criteria and surfaces whether it is worth a partner's time.",
    icon: Filter,
  },
  {
    label: "Diligence agent",
    title: "Risks get flagged",
    detail:
      "The diligence agent reads the data room, extracts key terms and covenants, and flags the risks that matter.",
    icon: FileSearch,
  },
  {
    label: "Memo agent",
    title: "The memo gets drafted",
    detail: "The memo agent drafts the first-pass write-up from the fund's own data and template.",
    icon: FilePen,
  },
  {
    label: "Decision-ready",
    title: "The team decides",
    detail:
      "A decision-ready package lands in front of the team. They do the one thing only people can do: decide.",
    icon: CheckCircle2,
  },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.18 } } };
const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};
// The final step lands with a subtle one-time pulse as the payoff.
const lastStepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, scale: [1, 1.04, 1], transition: { duration: 0.6, ease: EASE_OUT } },
};
// Connectors draw left to right in sequence with the stagger.
const connectorVariants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

export function AgentFlow() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  return (
    <motion.ol
      className="mt-12 grid gap-4 md:grid-cols-5"
      variants={animate ? listVariants : undefined}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "show" : undefined}
      viewport={{ once: true, amount: 0.4 }}
    >
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        return (
          <motion.li
            key={step.title}
            variants={animate ? (isLast ? lastStepVariants : stepVariants) : undefined}
            className="relative"
          >
            <div
              className={`flex h-full flex-col rounded-md border p-5 ${
                isLast ? "border-accent-text bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <Icon icon={step.icon} className="text-accent-text" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
                {step.label}
              </p>
              <p className="mt-1 font-sans text-base font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.detail}</p>
            </div>
            {!isLast && (
              <motion.span
                aria-hidden
                variants={animate ? connectorVariants : undefined}
                style={{ transformOrigin: "left" }}
                className="pointer-events-none absolute right-[-0.5rem] top-1/2 hidden h-px w-4 bg-border-strong md:block"
              />
            )}
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
```

- [ ] **Step 4: Implement the flagship section**

Create `src/components/sections/flagship.tsx`:
```tsx
import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
import { AgentFlow } from "./agent-flow";

export function Flagship() {
  return (
    <Section dark id="flagship" className="scroll-mt-24">
      <Container>
        <Reveal className="mx-auto max-w-[48rem] text-center">
          <Eyebrow>The Fund Operating System</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            One system that runs the deal, not five tools that each do a piece of it
          </h2>
          <p className="mt-5 text-[1.1875rem] leading-[1.55] text-muted">
            The tools above each fix one job. The Fund Operating System connects them into agentic
            systems, software that runs multi-step work on its own, so a deal hits the inbox and the
            team gets a decision-ready package back without lifting a finger.
          </p>
        </Reveal>

        <AgentFlow />

        <Reveal className="mx-auto mt-12 max-w-[48rem] text-center">
          <p className="font-serif text-[1.375rem] leading-[1.4]">
            It collapses a multi-day, multi-person workflow into hours, and frees the team to do the
            one thing only people can: decide.
          </p>
        </Reveal>

        <div className="mt-12">
          <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
                Custom Agents & Integrations
              </h3>
              <p className="mt-2 max-w-[60ch] text-muted">
                When the workflow eating your week is specific to your business, we build bespoke
                agents wired into your existing stack: CRM, email, data providers, and accounting. We
                start with whatever costs the most time.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 5: Run the tests, expect pass**

Run: `npx vitest run src/components/sections/flagship.test.tsx src/components/sections/agent-flow.test.tsx`
Expected: PASS (five steps, heading, custom agents block, Book a call, no axe violations).

- [ ] **Step 6: Commit**
```bash
git add src/components/sections/agent-flow.tsx src/components/sections/agent-flow.test.tsx src/components/sections/flagship.tsx src/components/sections/flagship.test.tsx
git commit -m "feat: add flagship section with animated agent flow"
```

---

## Task 11: Why us section

**Files:**
- Create: `src/components/sections/why-us.tsx`
- Test: `src/components/sections/why-us.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `Icon`, `ButtonLink` from `@/components/ui`; `Reveal`, `RevealGroup`, `RevealItem` from `@/components/motion/reveal`; lucide icons `ClipboardList`, `Terminal`, `FileCheck`.
- Produces: `export function WhyUs(): JSX.Element` rendered by the page assembly task. Renders the `#why-us` anchor.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { WhyUs } from "./why-us";

describe("WhyUs", () => {
  it("renders the section heading", () => {
    render(<WhyUs />);
    expect(
      screen.getByRole("heading", { level: 2, name: /we have sat on your side of the table/i }),
    ).toBeInTheDocument();
  });

  it("renders the differentiator and card copy", () => {
    render(<WhyUs />);
    expect(
      screen.getByText(/we don't translate between finance and tech\. we live in both\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/We know the workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/Production systems, not slideware/i)).toBeInTheDocument();
  });

  it("renders the Book a call action as a mailto link", () => {
    render(<WhyUs />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<WhyUs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/why-us.test.tsx`
Expected: FAIL (Cannot find module './why-us').

- [ ] **Step 3: Implement the component**
```tsx
import { ClipboardList, Terminal, FileCheck } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const cards = [
  {
    title: "We know the workflow",
    detail:
      "Screening inbound deals, reading a data room line by line, building the IC memo, assembling the quarterly LP update. We have done these jobs, so we build for how they really run, not how a generic tool assumes they do.",
    icon: ClipboardList,
  },
  {
    title: "Production systems, not slideware",
    detail:
      "We ship working software your team uses on Monday, not a roadmap and a strategy deck. The proof is real: we are building the full AI operating layer for a private credit fund we work with.",
    icon: Terminal,
  },
  {
    title: "Fixed scope, fixed price",
    detail:
      "We start with one painful, visible workflow, agree the scope and the price up front, and deliver a tool that earns its keep. No open-ended retainer, no surprise invoice.",
    icon: FileCheck,
  },
] as const;

export function WhyUs() {
  return (
    <Section id="why-us" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>Why Crosswell</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              We have sat on your side of the table.
            </h2>
            <p className="mt-5 text-[1.1875rem] leading-[1.55]">
              One of our partners spent years as a fund analyst. We understand deal flow, diligence,
              the IC memo, and LP reporting from the inside, not from a deck about an industry. We
              learn a workflow before we automate it.
            </p>
            <p className="mt-6 border-l-2 border-accent-text pl-4 text-[1.1875rem] leading-[1.55]">
              We don't translate between finance and tech. We live in both. Most AI consultants can't
              say that.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <RevealItem key={card.title}>
              <Card className="p-6">
                <Icon icon={card.icon} size="md" />
                <h3 className="mt-4 font-sans text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 max-w-[68ch] text-muted">
          We learn a workflow from the inside before we build for it. That is what makes the work fit
          a fund, and what makes it fit any business we take on.
        </p>
        <div className="mt-6">
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/why-us.test.tsx`
Expected: PASS (heading, differentiator, cards, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/why-us.tsx src/components/sections/why-us.test.tsx
git commit -m "feat: add why-us landing section"
```

---

## Task 12: Value section with count-ups

**Files:**
- Create: `src/components/sections/value.tsx`
- Test: `src/components/sections/value.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `ButtonLink` from `@/components/ui`; `Reveal` from `@/components/motion/reveal`; `CountUp` from `@/components/motion/count-up`.
- Produces: `export function Value(): JSX.Element` rendered by the page assembly task. Renders the `#value` anchor and a before/after table whose figures count up in view.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Value } from "./value";

describe("Value", () => {
  it("renders the section heading", () => {
    render(<Value />);
    expect(
      screen.getByRole("heading", { level: 2, name: /their judgment is what you pay for/i }),
    ).toBeInTheDocument();
  });

  it("renders the four workflow rows", () => {
    render(<Value />);
    expect(screen.getByText("Deal screening")).toBeInTheDocument();
    expect(screen.getByText("Diligence")).toBeInTheDocument();
    expect(screen.getByText("LP reporting")).toBeInTheDocument();
  });

  it("labels the table as fund-measured and links Book a call", () => {
    render(<Value />);
    expect(
      screen.getByText(/measured inside a private credit fund we work with/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Value />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/value.test.tsx`
Expected: FAIL (Cannot find module './value').

- [ ] **Step 3: Implement the component**
```tsx
import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

type Row = { workflow: string; before: string; after: React.ReactNode };

const FIGURE = "tabular-nums font-medium text-accent-text";

const ROWS: Row[] = [
  {
    workflow: "Deal screening",
    before: "Hundreds of inbounds reviewed by hand.",
    after: (
      <>
        A ranked short list, about <CountUp to={80} suffix="%" className={FIGURE} /> less time.
      </>
    ),
  },
  {
    workflow: "Diligence",
    before: "Three days reading a data room.",
    after: (
      <>
        A <CountUp to={20} suffix="-minute" className={FIGURE} /> structured review.
      </>
    ),
  },
  {
    workflow: "Memos",
    before: "Six to ten hours per deal writing.",
    after: "A drafted first pass in minutes.",
  },
  {
    workflow: "LP reporting",
    before: "A week of quarterly formatting.",
    after: "An afternoon of review.",
  },
];

export function Value() {
  return (
    <Section id="value" className="scroll-mt-24">
      <Container>
        <Reveal className="max-w-[68ch]">
          <Eyebrow>The math</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Your people are expensive, and their judgment is what you pay for. We stop it going to
            manual work.
          </h2>
          <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
            A lean team does not have hours to spare on formatting and first drafts. Here is what
            changes when expert time stops going to the work a system should do.
          </p>
        </Reveal>

        <Reveal>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
            Measured inside a private credit fund we work with:
          </p>
          <Card className="mt-4 p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    <th scope="col" className="p-4">Workflow</th>
                    <th scope="col" className="p-4">Before</th>
                    <th scope="col" className="p-4">After</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.workflow} className="border-b border-border align-top last:border-0">
                      <th scope="row" className="p-4 font-sans font-semibold">{row.workflow}</th>
                      <td className="p-4 text-muted">{row.before}</td>
                      <td className="p-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>

        <Reveal>
          <p className="mt-8 rounded-md bg-primary/10 p-5 text-[1.1875rem] leading-[1.55]">
            A system that gives a lean team back{" "}
            <CountUp to={20} prefix="10 to " suffix="+ hours a week" className={FIGURE} /> pays for
            itself in the first month, and lets them do more without hiring.
          </p>
        </Reveal>

        <div className="mt-8">
          <ButtonLink variant="secondary" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/value.test.tsx`
Expected: PASS (heading, four rows, fund label, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/value.tsx src/components/sections/value.test.tsx
git commit -m "feat: add value section with count-ups"
```

---

## Task 13: How we work section

**Files:**
- Create: `src/components/sections/how-we-work.tsx`
- Test: `src/components/sections/how-we-work.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `ButtonLink`, `Icon` from `@/components/ui`; `Reveal`, `RevealGroup`, `RevealItem` from `@/components/motion/reveal`; lucide icons `Search`, `Wrench`, `TrendingUp`.
- Produces: `export function HowWeWork(): JSX.Element` rendered by the page assembly task. Renders the `#how-we-work` anchor.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { HowWeWork } from "./how-we-work";

describe("HowWeWork", () => {
  it("renders the section heading", () => {
    render(<HowWeWork />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /we start with one workflow, not a year-long contract/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the three step titles and the fixed-scope detail", () => {
    render(<HowWeWork />);
    expect(screen.getByText("Find the pain")).toBeInTheDocument();
    expect(screen.getByText("Build and prove it")).toBeInTheDocument();
    expect(screen.getByText("Expand")).toBeInTheDocument();
    expect(screen.getByText("Fixed scope, fixed price")).toBeInTheDocument();
  });

  it("exposes a Book a call mailto action", () => {
    render(<HowWeWork />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<HowWeWork />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/how-we-work.test.tsx`
Expected: FAIL (Cannot find module './how-we-work').

- [ ] **Step 3: Implement the component**
```tsx
import { Search, Wrench, TrendingUp, type LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, ButtonLink, Icon } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Step = {
  numeral: string;
  title: string;
  detail: React.ReactNode;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    numeral: "01",
    title: "Find the pain",
    detail:
      "We start by identifying one painful, visible workflow, the task quietly costing your team the most hours.",
    icon: Search,
  },
  {
    numeral: "02",
    title: "Build and prove it",
    detail: (
      <>
        <span className="font-medium text-accent-text">Fixed scope, fixed price</span>. We deliver a
        working tool that handles the workflow, so you can measure the time saved against exactly
        what you paid.
      </>
    ),
    icon: Wrench,
  },
  {
    numeral: "03",
    title: "Expand",
    detail:
      "Once your team sees the time saved, we build out from there, one proven workflow at a time.",
    icon: TrendingUp,
  },
];

export function HowWeWork() {
  return (
    <Section id="how-we-work" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              We start with one workflow, not a year-long contract.
            </h2>
            <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
              Hiring an outside firm is a real decision. We make the first one small: you see a
              working tool and the hours it gives back on a single workflow before there is any talk
              of expanding.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <RevealItem key={step.numeral}>
              <Card className="p-6">
                <p className="font-serif text-[2rem] font-semibold text-accent-text">
                  {step.numeral}
                </p>
                <Icon icon={step.icon} size="md" className="mt-2 text-accent-text" />
                <h3 className="mt-2 font-serif text-[1.375rem] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-muted">
          No long contract to start. Tell us the workflow that is costing you the most, and we will
          scope the first build.{" "}
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </p>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/how-we-work.test.tsx`
Expected: PASS (heading, three steps, fixed-scope emphasis, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/how-we-work.tsx src/components/sections/how-we-work.test.tsx
git commit -m "feat: add how-we-work landing section"
```

---

## Task 14: Team section

**Files:**
- Create: `src/components/sections/team.tsx`
- Test: `src/components/sections/team.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `Card`, `ButtonLink` from `@/components/ui`; `Reveal`, `RevealGroup`, `RevealItem` from `@/components/motion/reveal`. No lucide icons (headshot placeholders are typographic initials).
- Produces: `export function Team(): JSX.Element` rendered by the page assembly task. Renders the `#team` anchor. Real headshots are a later asset drop at `public/team/<name>.jpg`; until then each card shows an initials placeholder.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Team } from "./team";

describe("Team", () => {
  it("renders the section heading", () => {
    render(<Team />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /a small team that has been on your side of the table/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders each team member and their distinguishing copy", () => {
    render(<Team />);
    expect(screen.getByText("Michael Zamora")).toBeInTheDocument();
    expect(screen.getByText("Max Marohn")).toBeInTheDocument();
    expect(screen.getByText("Bridger Davidson")).toBeInTheDocument();
    expect(screen.getByText(/spent years as a fund financial analyst/i)).toBeInTheDocument();
    expect(screen.getByText(/Three people, not a vendor org chart/i)).toBeInTheDocument();
  });

  it("exposes a Book a call action", () => {
    render(<Team />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Team />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/team.test.tsx`
Expected: FAIL (Cannot find module './team').

- [ ] **Step 3: Implement the component**
```tsx
import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Person = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  cardClassName?: string;
};

const PEOPLE: Person[] = [
  {
    name: "Michael Zamora",
    initials: "MZ",
    role: "Business & Strategy",
    bio: "Michael owns the relationship, scopes the problem with you, and makes sure what we build actually moves the work, not just demos well.",
  },
  {
    name: "Max Marohn",
    initials: "MM",
    role: "Ex-Fund Financial Analyst",
    bio: "The reason this is different. Max spent years as a fund financial analyst, so he has sat where our clients sit: screening deal flow, working diligence, and assembling LP reporting. He speaks the workflow, so we build for it instead of guessing at it.",
    cardClassName: "border-accent-text/40",
  },
  {
    name: "Bridger Davidson",
    initials: "BD",
    role: "AI Software Engineer",
    bio: "Bridger turns the workflow into the actual tools, integrations, and automations, and ships them into how a business already operates.",
  },
];

export function Team() {
  return (
    <Section id="team" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>Who you work with</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              A small team that has been on your side of the table.
            </h2>
            <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
              Three people, not a vendor org chart. One of us spent years as a fund analyst, so the
              work is built by people who already speak deal flow, diligence, and LP reporting.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {PEOPLE.map((person) => (
            <RevealItem key={person.name}>
              <Card className={`p-6 ${person.cardClassName ?? ""}`}>
                {/* Replace with a real headshot at public/team/<name>.jpg */}
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 font-serif text-xl font-semibold text-accent-text">
                  {person.initials}
                </div>
                <p className="mt-4 font-serif text-[1.375rem] font-semibold">{person.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
                  {person.role}
                </p>
                <p className="mt-3 text-sm text-muted">{person.bio}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <ButtonLink variant="secondary" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/team.test.tsx`
Expected: PASS (heading, three members, Max differentiator, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/team.tsx src/components/sections/team.test.tsx
git commit -m "feat: add team landing section"
```

---

## Task 15: Final CTA section

**Files:**
- Create: `src/components/sections/final-cta.tsx`
- Test: `src/components/sections/final-cta.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Container`, `Eyebrow`, `ButtonLink` from `@/components/ui`; `Reveal` from `@/components/motion/reveal`.
- Produces: `export function FinalCta(): JSX.Element` rendered by the page assembly task. The charcoal `#final-cta` anchor, target of every nav and footer "Book a call".

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { FinalCta } from "./final-cta";

describe("FinalCta", () => {
  it("renders the closing heading", () => {
    render(<FinalCta />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /give your team back 10 to 20\+ hours a week/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and reassurance copy", () => {
    render(<FinalCta />);
    expect(screen.getByText(/start the conversation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a short call to scope the work\. no pitch deck, no obligation\./i),
    ).toBeInTheDocument();
  });

  it("links the Book a call action to the mailto address", () => {
    render(<FinalCta />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FinalCta />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/final-cta.test.tsx`
Expected: FAIL (Cannot find module './final-cta').

- [ ] **Step 3: Implement the component**
```tsx
import { Section, Container, Eyebrow, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <Section dark id="final-cta" className="scroll-mt-24">
      <Container className="mx-auto max-w-[42rem] text-center">
        <Reveal>
          <Eyebrow>Start the conversation</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Give your team back 10 to 20+ hours a week.
          </h2>
          <p className="mx-auto mt-5 max-w-[68ch] text-base leading-[1.65] text-muted">
            We find what is holding your business back and build the AI that moves it forward. Start
            with one workflow, fixed scope and fixed price. Book a call and we will walk through the
            work that is costing your team the most time, and what it would take to hand it off.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink variant="primary" href="mailto:hello@crosswellconsulting.com">
              Book a call
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            A short call to scope the work. No pitch deck, no obligation.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/final-cta.test.tsx`
Expected: PASS (heading, eyebrow, reassurance, Book a call, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/final-cta.tsx src/components/sections/final-cta.test.tsx
git commit -m "feat: add final-cta landing section"
```

---

## Task 16: Footer

**Files:**
- Create: `src/components/sections/footer.tsx`
- Test: `src/components/sections/footer.test.tsx`

**Interfaces:**
- Consumes: `Container`, `Eyebrow`, `TextLink` from `@/components/ui`. No motion (the footer is static chrome). Renders a semantic `<footer>` with `data-section="dark"`.
- Produces: `export function Footer(): JSX.Element` rendered last by the page assembly task.

- [ ] **Step 1: Write the failing test**
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the identity descriptor", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        /Custom AI tools, software, and automations for businesses that want to run leaner\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(/Crosswell Consulting, 2026\./i)).toBeInTheDocument();
  });

  it("links the contact email via mailto", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /hello@crosswellconsulting\.com/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("links the on-page anchors", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /what we do/i })).toHaveAttribute("href", "#what-we-do");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/components/sections/footer.test.tsx`
Expected: FAIL (Cannot find module './footer').

- [ ] **Step 3: Implement the component**
```tsx
import { Container, Eyebrow, TextLink } from "@/components/ui";

const pageLinks = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Why us", href: "#why-us" },
  { label: "How we work", href: "#how-we-work" },
  { label: "Book a call", href: "#final-cta" },
];

export function Footer() {
  return (
    <footer data-section="dark" className="bg-bg text-foreground">
      <Container className="py-16">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <img src="/xw_logo_light.svg" alt="Crosswell Consulting" className="h-7 w-auto" />
            <p className="mt-4 max-w-[32ch] text-sm text-muted">
              Custom AI tools, software, and automations for businesses that want to run leaner.
            </p>
            <TextLink href="mailto:hello@crosswellconsulting.com" className="mt-4 block">
              hello@crosswellconsulting.com
            </TextLink>
          </div>
          <nav aria-label="Footer">
            <Eyebrow>On this page</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-sm text-muted">
          Crosswell Consulting, 2026.
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/components/sections/footer.test.tsx`
Expected: PASS (descriptor, copyright, email, anchors, no axe violations).

- [ ] **Step 5: Commit**
```bash
git add src/components/sections/footer.tsx src/components/sections/footer.test.tsx
git commit -m "feat: add footer landing section"
```

---

## Task 17: Page assembly

**Files:**
- Modify: `src/app/page.tsx` (replace the starter)
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: all eleven section components (`Nav`, `Hero`, `Problem`, `Tools`, `Flagship`, `WhyUs`, `Value`, `HowWeWork`, `Team`, `FinalCta`, `Footer`).
- Produces: `export default function Home(): JSX.Element`, the composed landing page at `/`.

- [ ] **Step 1: Write the failing test**

Create `src/app/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Home from "./page";

describe("Home page", () => {
  it("renders exactly one h1", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the hero, flagship, and footer", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /holding your business back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /one system that runs the deal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Crosswell Consulting, 2026\./)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Home />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the test, expect failure**

Run: `npx vitest run src/app/page.test.tsx`
Expected: FAIL (the starter page has no matching h1, and the assertions fail).

- [ ] **Step 3: Replace the page**

Replace the entire contents of `src/app/page.tsx` with:
```tsx
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Tools } from "@/components/sections/tools";
import { Flagship } from "@/components/sections/flagship";
import { WhyUs } from "@/components/sections/why-us";
import { Value } from "@/components/sections/value";
import { HowWeWork } from "@/components/sections/how-we-work";
import { Team } from "@/components/sections/team";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Tools />
        <Flagship />
        <WhyUs />
        <Value />
        <HowWeWork />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run the test, expect pass**

Run: `npx vitest run src/app/page.test.tsx`
Expected: PASS (one h1, hero/flagship/footer present, no axe violations across the whole page).

- [ ] **Step 5: Commit**
```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: assemble the landing page"
```

---

## Task 18: Full verification and brain log

**Files:**
- None created. This task runs the whole-project gates and records the milestone.

**Interfaces:**
- Consumes: every prior task.
- Produces: a verified build and a brain build-log entry.

- [ ] **Step 1: Run the full test suite**

Run:
```bash
npm run test:run
```
Expected: PASS. Every section, motion island, primitive, and the page integration test are green.

- [ ] **Step 2: Lint**

Run:
```bash
npm run lint
```
Expected: no errors. (Apostrophes and the SVG `<img>` are allowed by the Task 1 ESLint overrides.)

- [ ] **Step 3: Production build**

Run:
```bash
npm run build
```
Expected: the build succeeds. The page is statically rendered; `motion` and `lenis` are in client bundles only.

- [ ] **Step 4: Manual verification (run the dev server)**

Run:
```bash
npm run dev
```
Then check `http://localhost:3000` and confirm:
- The hero entrance plays once on load with the subtle ambient drift; section headings and card grids reveal on scroll; the flagship agent flow lights up step by step; the value figures count up.
- Lenis momentum scroll is active; nav and footer anchor links glide to their section with the sticky-nav offset; the nav condenses past the hero; the mobile menu opens and closes.
- With OS "reduce motion" enabled (or DevTools rendering emulation `prefers-reduced-motion: reduce`): Lenis is off (native scroll), nothing animates, and all content (including the agent flow and the count-up numbers) is fully visible.
- At a 375px viewport there is no page-level horizontal scroll; keyboard Tab reaches every link and button with a visible focus ring; every "Book a call" opens an email to `hello@crosswellconsulting.com`.

- [ ] **Step 5: Record the milestone in the brain**

Run:
```bash
npm run log:brain -- "Built the Crosswell landing page: 11 sections (nav through footer) on the design foundation, broadened positioning (horizontal AI consulting, funds as the proven niche), mailto CTA to hello@crosswellconsulting.com, and a motion layer (Motion + Lenis) with four signature moments. Replaces the Next.js starter."
```
Expected: a dated entry appended to `Landing Site Build Log.md` in the brain.

- [ ] **Step 6: Final commit (if the brain sync or any cleanup changed tracked files)**

```bash
git add -A
git commit -m "chore: record landing page build milestone"
```
(If nothing is staged, skip the commit.)

---

> Positioning follow-up (not part of this build): the brain's strategy files still say "for investment funds". Per the spec's brain-reconciliation note, ask the founder before updating `Positioning & Messaging.md` and the brain `CLAUDE.md` to the broadened positioning.
