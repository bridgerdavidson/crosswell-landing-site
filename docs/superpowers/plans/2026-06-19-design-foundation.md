# Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Crosswell design foundation: the Tailwind v4 token layer, the two fonts, and the set of AA-compliant base components, plus a `/styleguide` route to verify it, all matching the approved design-foundation spec.

**Architecture:** Tokens live in `src/app/globals.css` as `@theme inline` color tokens that reference raw CSS variables; a `[data-section="dark"]` scope overrides the raw variables so charcoal sections adapt automatically. Components are React Server Components in `src/components/ui/`, styled with the generated token utilities, and tested with Vitest + React Testing Library (behavior and accessibility, not pixels). Visual fidelity is verified on a `/styleguide` route.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, next/font, lucide-react, Vitest, @testing-library/react, jest-axe, clsx, tailwind-merge.

## Global Constraints

These apply to every task. Exact values from the spec (`docs/superpowers/specs/2026-06-19-design-foundation-design.md`).

- Stack floors: Next.js 16, React 19, TypeScript, Tailwind CSS v4. Components are React Server Components by default; add `"use client"` only where interaction requires it.
- Before writing any page, layout, or route code, read the relevant Next 16 guide in `node_modules/next/dist/docs/` per `AGENTS.md`. APIs may differ from training data.
- No em dashes in any file, code comment, or copy. Ever.
- Fern tokens are exact hex. Light: bg `#F1EEE6`, surface `#FBFAF6`, foreground `#1A1915`, muted `#5C574D`, border `#E2DDD2`, border-strong `#B8B2A7`, control-border `#8A8475`, primary `#4E7A4E`, primary-hover `#3D633D`, primary-foreground `#FFFFFF`, accent-text `#3D633D`, link `#3D633D`, ring `#4E7A4E`, error `#A23B2B`, error-bg `#F4E4DF`, success `#3D633D`, disabled-bg `#E7E3D9`, disabled-foreground `#A39D8F`. Charcoal overrides: bg `#3D3A34`, surface `#45423B`, foreground `#F1EEE6`, muted `#B8B2A7`, border `#565249`, border-strong `#6E695E`, control-border `#8FB68F`, primary-hover `#5C8C5C`, accent-text `#8FB68F`, link `#8FB68F`, ring `#8FB68F`, error `#E2A093`.
- Accessibility: AA contrast per the spec's verified table; visible focus rings (2px ring + 2px offset) whose offset renders in the section background; charcoal-section focus rings use `--color-ring` (which is `#8FB68F` there); standalone buttons, form controls, the menu toggle, and footer links meet 44px; inline links in prose are exempt; respect `prefers-reduced-motion`; logical heading order.
- Fonts loaded via next/font as variable fonts (no `weight` array): Source Serif 4 (`--font-source-serif`) and Inter (`--font-inter`), subset latin, `display: swap`.
- Charcoal sections use the `@theme inline` + `[data-section="dark"]` raw-variable override mechanism. There is no global dark mode and no `prefers-color-scheme` behavior.

---

### Task 1: Test harness and the cn utility

**Files:**
- Modify: `package.json` (add devDependencies and scripts)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/cn.ts`
- Test: `src/lib/cn.test.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` from `@/lib/cn` (merges class names; later Tailwind classes win).

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install clsx tailwind-merge lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event jest-axe
```

- [ ] **Step 2: Add test scripts to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 4: Create the test setup file**

Create `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
```

- [ ] **Step 5: Write the failing test for cn**

Create `src/lib/cn.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("lets later tailwind classes win on conflict", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm run test:run -- src/lib/cn.test.ts`
Expected: FAIL with a module-not-found error for `./cn`.

- [ ] **Step 7: Implement cn**

Create `src/lib/cn.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm run test:run -- src/lib/cn.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/cn.ts src/lib/cn.test.ts
git commit -m "Add test harness (Vitest + RTL + jest-axe) and cn utility"
```

---

### Task 2: Token layer and fonts

**Files:**
- Modify: `src/app/globals.css` (replace scaffold theme with the Fern token layer)
- Modify: `src/app/layout.tsx` (swap Geist for Source Serif 4 + Inter; set metadata)
- Test: `src/app/layout.test.tsx`

**Interfaces:**
- Produces: the token utilities used by every later component: colors (`bg-bg`, `bg-surface`, `text-foreground`, `text-muted`, `text-accent-text`, `text-link`, `bg-primary`, `text-primary-foreground`, `bg-primary-hover`, `border-border`, `border-border-strong`, `border-control-border`, `ring-ring`, `text-error`, `bg-error-bg`, `bg-disabled-bg`, `text-disabled-foreground`), radius (`rounded-sm|md|lg`), shadow (`shadow-xs|sm|md`), and the `data-section="dark"` remap. Fonts expose `font-sans` (Inter) and `font-serif` (Source Serif 4).

- [ ] **Step 1: Replace globals.css with the token layer**

Replace the entire contents of `src/app/globals.css` with:
```css
@import "tailwindcss";

/* Raw values. The default is light. A charcoal section overrides only the raw
   variables that change, and because the color tokens below are declared with
   @theme inline (var() references), every token utility adapts automatically. */
:root {
  --raw-bg: #f1eee6;
  --raw-surface: #fbfaf6;
  --raw-foreground: #1a1915;
  --raw-muted: #5c574d;
  --raw-border: #e2ddd2;
  --raw-border-strong: #b8b2a7;
  --raw-control-border: #8a8475;
  --raw-primary: #4e7a4e;
  --raw-primary-hover: #3d633d;
  --raw-primary-foreground: #ffffff;
  --raw-accent-text: #3d633d;
  --raw-link: #3d633d;
  --raw-ring: #4e7a4e;
  --raw-error: #a23b2b;
  --raw-error-bg: #f4e4df;
  --raw-success: #3d633d;
  --raw-disabled-bg: #e7e3d9;
  --raw-disabled-foreground: #a39d8f;
}

[data-section="dark"] {
  --raw-bg: #3d3a34;
  --raw-surface: #45423b;
  --raw-foreground: #f1eee6;
  --raw-muted: #b8b2a7;
  --raw-border: #565249;
  --raw-border-strong: #6e695e;
  --raw-control-border: #8fb68f;
  --raw-primary-hover: #5c8c5c;
  --raw-accent-text: #8fb68f;
  --raw-link: #8fb68f;
  --raw-ring: #8fb68f;
  --raw-error: #e2a093;
}

@theme inline {
  --color-bg: var(--raw-bg);
  --color-surface: var(--raw-surface);
  --color-foreground: var(--raw-foreground);
  --color-muted: var(--raw-muted);
  --color-border: var(--raw-border);
  --color-border-strong: var(--raw-border-strong);
  --color-control-border: var(--raw-control-border);
  --color-primary: var(--raw-primary);
  --color-primary-hover: var(--raw-primary-hover);
  --color-primary-foreground: var(--raw-primary-foreground);
  --color-accent-text: var(--raw-accent-text);
  --color-link: var(--raw-link);
  --color-ring: var(--raw-ring);
  --color-error: var(--raw-error);
  --color-error-bg: var(--raw-error-bg);
  --color-success: var(--raw-success);
  --color-disabled-bg: var(--raw-disabled-bg);
  --color-disabled-foreground: var(--raw-disabled-foreground);

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-source-serif), ui-serif, Georgia, serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-xs: 0 1px 2px rgba(61, 58, 52, 0.05);
  --shadow-sm: 0 2px 8px rgba(61, 58, 52, 0.06);
  --shadow-md: 0 10px 30px rgba(61, 58, 52, 0.1);

  --z-sticky: 10;
  --z-overlay: 40;
  --z-menu: 50;
}

body {
  background: var(--color-bg);
  color: var(--color-foreground);
  font-family: var(--font-sans);
}

::selection {
  background: rgba(78, 122, 78, 0.18);
}
[data-section="dark"] ::selection {
  background: rgba(143, 182, 143, 0.28);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Swap the fonts in layout.tsx**

Replace the contents of `src/app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Crosswell Consulting",
  description:
    "Custom AI tools, software, and automations for investment funds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Write a smoke test for the layout font wiring**

Create `src/app/layout.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("exposes the serif and sans font variables on <html>", () => {
    // next/font returns deterministic className/variable strings in tests.
    const { baseElement } = render(<RootLayout>content</RootLayout>);
    // RootLayout renders <html>; assert the className carries both variables.
    const html = baseElement.ownerDocument.documentElement;
    expect(html.className).toMatch(/font-source-serif|--font-source-serif|__variable/);
  });
});
```

Note: next/font generates hashed class names in test. If this assertion proves brittle in the environment, replace the regex with a check that `RootLayout` renders its children: `expect(baseElement.textContent).toContain("content")`. The real verification for this task is the build and the styleguide, below.

- [ ] **Step 4: Run the smoke test**

Run: `npm run test:run -- src/app/layout.test.tsx`
Expected: PASS. If next/font throws in jsdom, keep the children-render assertion only.

- [ ] **Step 5: Verify the production build compiles**

Run: `npm run build`
Expected: Compiles successfully, types pass, no Tailwind unknown-utility errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/layout.test.tsx
git commit -m "Add Fern token layer (@theme inline + charcoal remap) and load Source Serif 4 + Inter"
```

---

### Task 3: Container

**Files:**
- Create: `src/components/ui/container.tsx`
- Test: `src/components/ui/container.test.tsx`

**Interfaces:**
- Produces: `Container` (`React.ComponentProps<"div">`) that centers content at max 70rem with responsive gutters.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/container.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("renders children and applies the max-width and gutter classes", () => {
    render(<Container>inside</Container>);
    const el = screen.getByText("inside");
    expect(el).toHaveClass("mx-auto", "max-w-[70rem]", "px-6");
  });

  it("merges a passed className", () => {
    render(<Container className="text-center">x</Container>);
    expect(screen.getByText("x")).toHaveClass("text-center");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/container.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Container**

Create `src/components/ui/container.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[70rem] px-6 md:px-8", className)}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/container.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/container.tsx src/components/ui/container.test.tsx
git commit -m "Add Container primitive"
```

---

### Task 4: Section

**Files:**
- Create: `src/components/ui/section.tsx`
- Test: `src/components/ui/section.test.tsx`

**Interfaces:**
- Consumes: nothing (uses token utilities from Task 2).
- Produces: `Section` (`{ dark?: boolean } & React.ComponentProps<"section">`). When `dark`, sets `data-section="dark"` and uses charcoal tokens; vertical padding `clamp(4rem,4rem+4vw,6rem)`.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/section.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./section";

describe("Section", () => {
  it("is a light section with no data-section by default", () => {
    render(<Section>body</Section>);
    const el = screen.getByText("body");
    expect(el.tagName).toBe("SECTION");
    expect(el).not.toHaveAttribute("data-section");
    expect(el).toHaveClass("bg-bg", "text-foreground");
  });

  it("sets data-section=dark when dark", () => {
    render(<Section dark>body</Section>);
    expect(screen.getByText("body")).toHaveAttribute("data-section", "dark");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/section.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Section**

Create `src/components/ui/section.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function Section({
  dark = false,
  className,
  ...props
}: { dark?: boolean } & React.ComponentProps<"section">) {
  return (
    <section
      data-section={dark ? "dark" : undefined}
      className={cn(
        "bg-bg text-foreground py-[clamp(4rem,4rem+4vw,6rem)]",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/section.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/section.tsx src/components/ui/section.test.tsx
git commit -m "Add Section primitive with charcoal data-section toggle"
```

---

### Task 5: Eyebrow

**Files:**
- Create: `src/components/ui/eyebrow.tsx`
- Test: `src/components/ui/eyebrow.test.tsx`

**Interfaces:**
- Produces: `Eyebrow` (`React.ComponentProps<"p">`) rendering a 12px, 600, uppercase, tracked accent label that adapts on charcoal via `text-accent-text`.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/eyebrow.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./eyebrow";

describe("Eyebrow", () => {
  it("renders an uppercase tracked accent label", () => {
    render(<Eyebrow>How we work</Eyebrow>);
    const el = screen.getByText("How we work");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("uppercase", "text-accent-text", "font-semibold");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/eyebrow.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Eyebrow**

Create `src/components/ui/eyebrow.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function Eyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em] text-accent-text",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/eyebrow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/eyebrow.tsx src/components/ui/eyebrow.test.tsx
git commit -m "Add Eyebrow label primitive"
```

---

### Task 6: Icon

**Files:**
- Create: `src/components/ui/icon.tsx`
- Test: `src/components/ui/icon.test.tsx`

**Interfaces:**
- Consumes: `lucide-react` icon components (type `LucideIcon`).
- Produces: `Icon` (`{ icon: LucideIcon; size?: "sm" | "md" | "lg"; label?: string; className?: string }`). With `label`, renders `role="img"` and `aria-label`; without, `aria-hidden`. Sizes: sm 18, md 24, lg 32; stroke 1.7.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/icon.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Search } from "lucide-react";
import { Icon } from "./icon";

describe("Icon", () => {
  it("is decorative (aria-hidden) without a label", () => {
    const { container } = render(<Icon icon={Search} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "24");
  });

  it("is labelled (role img) with a label", () => {
    const { container } = render(
      <Icon icon={Search} label="Search" size="sm" />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Search");
    expect(svg).toHaveAttribute("width", "18");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/icon.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Icon**

Create `src/components/ui/icon.tsx`:
```tsx
import type { LucideIcon } from "lucide-react";

const SIZES = { sm: 18, md: 24, lg: 32 } as const;

export function Icon({
  icon: LucideGlyph,
  size = "md",
  label,
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  return (
    <LucideGlyph
      size={SIZES[size]}
      strokeWidth={1.7}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/icon.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/icon.tsx src/components/ui/icon.test.tsx
git commit -m "Add Icon wrapper (lucide-react, a11y-aware)"
```

---

### Task 7: Button

**Files:**
- Create: `src/components/ui/button.tsx`
- Test: `src/components/ui/button.test.tsx`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Button` (`{ variant?: "primary" | "secondary" | "link" } & React.ComponentProps<"button">`). Renders a `<button>` with the variant styles, a 44px min target on primary and secondary, a token focus ring, and disabled token styling. Default `type="button"`.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/button.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "./button";

describe("Button", () => {
  it("renders a primary button by default with the fern fill", () => {
    render(<Button>Book a call</Button>);
    const btn = screen.getByRole("button", { name: "Book a call" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("bg-primary", "text-primary-foreground", "min-h-11");
  });

  it("applies the secondary outline variant", () => {
    render(<Button variant="secondary">See the tools</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "border",
      "border-control-border",
      "text-foreground",
    );
  });

  it("sets disabled styling and attribute", () => {
    render(<Button disabled>x</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("disabled:cursor-not-allowed");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Book a call</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/button.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Button**

Create `src/components/ui/button.tsx`:
```tsx
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans text-[0.9375rem] font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-foreground disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "min-h-11 px-5 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99]",
  secondary:
    "min-h-11 px-5 border border-control-border text-foreground hover:bg-primary/5 active:scale-[0.99]",
  link: "min-h-11 px-1 text-link underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: { variant?: Variant } & React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/button.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/button.test.tsx
git commit -m "Add Button (primary, secondary, link) with token focus ring and disabled state"
```

---

### Task 8: TextLink

**Files:**
- Create: `src/components/ui/text-link.tsx`
- Test: `src/components/ui/text-link.test.tsx`

**Interfaces:**
- Produces: `TextLink` (`React.ComponentProps<"a">`) for inline links: `text-link`, underline grows on hover. Exempt from the 44px rule (inline in prose).

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/text-link.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextLink } from "./text-link";

describe("TextLink", () => {
  it("renders an anchor with the link token color and hover underline", () => {
    render(<TextLink href="/tools">See the tools</TextLink>);
    const link = screen.getByRole("link", { name: "See the tools" });
    expect(link).toHaveAttribute("href", "/tools");
    expect(link).toHaveClass("text-link", "hover:underline");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/text-link.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement TextLink**

Create `src/components/ui/text-link.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function TextLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "text-link underline-offset-4 hover:underline " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/text-link.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/text-link.tsx src/components/ui/text-link.test.tsx
git commit -m "Add TextLink for inline links"
```

---

### Task 9: Input

**Files:**
- Create: `src/components/ui/input.tsx`
- Test: `src/components/ui/input.test.tsx`

**Interfaces:**
- Consumes: `cn`, React `useId`.
- Produces: `Input` (`{ label: string; helperText?: string; error?: string } & React.ComponentProps<"input">`). Associates a visible label, wires `aria-describedby` to helper or error text, sets `aria-invalid` on error, min-height 44px, token focus ring. This is a client component (uses `useId` and is interactive).

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/input.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Input } from "./input";

describe("Input", () => {
  it("associates the visible label with the input", () => {
    render(<Input label="Work email" placeholder="you@fund.com" />);
    const input = screen.getByLabelText("Work email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "you@fund.com");
  });

  it("marks the field invalid and describes the error", () => {
    render(<Input label="Work email" error="Enter a valid email" />);
    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Input label="Work email" helperText="We never share this." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/input.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Input**

Create `src/components/ui/input.tsx`:
```tsx
"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export function Input({
  label,
  helperText,
  error,
  id,
  className,
  ...props
}: {
  label: string;
  helperText?: string;
  error?: string;
} & React.ComponentProps<"input">) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = `${inputId}-desc`;
  const message = error ?? helperText;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? describedById : undefined}
        className={cn(
          "min-h-11 rounded-md border bg-surface px-3.5 text-foreground placeholder:text-muted " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
            "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-foreground",
          error ? "border-error" : "border-control-border",
          className,
        )}
        {...props}
      />
      {message ? (
        <p
          id={describedById}
          className={cn("text-sm", error ? "text-error" : "text-muted")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/input.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/input.tsx src/components/ui/input.test.tsx
git commit -m "Add Input with label association, error and helper states"
```

---

### Task 10: Card

**Files:**
- Create: `src/components/ui/card.tsx`
- Test: `src/components/ui/card.test.tsx`

**Interfaces:**
- Produces: `Card` (`React.ComponentProps<"div">`) rendering a warm-white surface with a hairline border, radius md, rest shadow xs, and a 2px hover lift to shadow sm.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/card.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

describe("Card", () => {
  it("renders a surface card with border, radius, and rest shadow", () => {
    render(<Card>tool</Card>);
    const el = screen.getByText("tool");
    expect(el).toHaveClass(
      "bg-surface",
      "border",
      "border-border",
      "rounded-md",
      "shadow-xs",
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/components/ui/card.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement Card**

Create `src/components/ui/card.tsx`:
```tsx
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-md shadow-xs transition " +
          "hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transform-none",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/components/ui/card.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/card.tsx src/components/ui/card.test.tsx
git commit -m "Add Card surface primitive"
```

---

### Task 11: Styleguide route (visual verification)

**Files:**
- Create: `src/components/ui/index.ts` (barrel export)
- Create: `src/app/styleguide/page.tsx`

**Interfaces:**
- Consumes: every component from Tasks 3 to 10.
- Produces: a `/styleguide` route that renders the type scale, color swatches, and every component on a light section and inside a charcoal `Section`, for visual fidelity and contrast checking.

- [ ] **Step 1: Create the barrel export**

Create `src/components/ui/index.ts`:
```ts
export { Container } from "./container";
export { Section } from "./section";
export { Eyebrow } from "./eyebrow";
export { Button } from "./button";
export { TextLink } from "./text-link";
export { Input } from "./input";
export { Icon } from "./icon";
export { Card } from "./card";
```

- [ ] **Step 2: Read the Next 16 routing guide**

Before writing the route, read the App Router page guidance in `node_modules/next/dist/docs/` (per `AGENTS.md`) to confirm the page file convention for this version.

- [ ] **Step 3: Create the styleguide page**

Create `src/app/styleguide/page.tsx`:
```tsx
import { Search } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  Button,
  TextLink,
  Input,
  Icon,
  Card,
} from "@/components/ui";

function Showcase() {
  return (
    <Container className="flex flex-col gap-10">
      <div>
        <Eyebrow>Type scale</Eyebrow>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Judgment is your edge
        </h1>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
          What we build for funds
        </h2>
        <h3 className="font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
          Deal Screening Engine
        </h3>
        <p className="text-[1.1875rem] leading-[1.55]">
          Lead paragraph. Software and automations that take manual work off
          your team.
        </p>
        <p className="text-base leading-[1.65] text-muted max-w-[68ch]">
          Body. Funds run lean. The people whose judgment is your edge spend
          their days on manual work.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Book a call</Button>
        <Button variant="secondary">See the tools</Button>
        <Button variant="link">Learn more</Button>
        <TextLink href="#">An inline link</TextLink>
      </div>

      <Card className="max-w-sm p-5">
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon icon={Search} size="sm" />
        </span>
        <h3 className="font-sans text-base font-semibold">Ranked, not piled</h3>
        <p className="mt-1 text-sm text-muted">
          Hundreds of inbound deals become a short list.
        </p>
      </Card>

      <div className="max-w-sm">
        <Input label="Work email" placeholder="you@fund.com" helperText="We never share this." />
      </div>
    </Container>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <Section>
        <Showcase />
      </Section>
      <Section dark>
        <Showcase />
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: Compiles successfully, `/styleguide` listed as a route.

- [ ] **Step 5: Verify visually**

Run: `npm run dev`, open `http://localhost:3000/styleguide`. Confirm: serif headlines and Inter body load (no fallback flash), ivory base, the charcoal Section shows ivory text with lightened-fern accents and a visible focus ring on Tab, buttons hover to deep fern, the card lifts on hover, and the input focus ring is visible. Tab through every control to confirm focus rings, including inside the charcoal section.

- [ ] **Step 6: Run the full test suite**

Run: `npm run test:run`
Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/index.ts src/app/styleguide/page.tsx
git commit -m "Add /styleguide route to verify the design foundation"
```

---

## Self-Review

**Spec coverage:**
- Typography (fonts, scale): Task 2 loads both fonts; the scale is exercised in Task 11 and used by components. Covered.
- Color tokens + charcoal remap: Task 2 (`@theme inline` + `[data-section="dark"]`); Task 4 (Section toggles it); Task 11 renders both contexts. Covered.
- Spacing, radius, shadow, motion tokens: Task 2 defines them; components consume them; reduced-motion handled in Task 2 and Card. Covered.
- Component inventory base primitives (Container, Section, Eyebrow, Button, TextLink, Input, Icon, Card): Tasks 3 to 10. Covered.
- Accessibility (focus rings, labels, aria, 44px, reduced-motion): focus-ring classes on Button/TextLink/Input; Input label/aria; 44px via min-h-11; jest-axe on Button and Input; reduced-motion globally. Covered.
- Styleguide verification route: Task 11. Covered.
- Composed page sections (Nav, Hero, ToolGrid, FlagshipPanel, ValueTable, etc.): intentionally NOT in this plan. They belong to the page-structure spec and plan, which is out of scope for the design foundation. Noted, not a gap.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N". Each step has complete code. The one conditional note (Task 2 Step 3, next/font test brittleness) gives an exact fallback assertion, not a placeholder.

**Type consistency:** `cn` signature is stable across all tasks. Component prop types use `React.ComponentProps<...>` consistently. Token utility class names (`bg-bg`, `text-foreground`, `border-control-border`, `ring-ring`, `shadow-xs/sm`, `rounded-md`, `bg-primary-hover`, `text-disabled-foreground`) match the `@theme inline` definitions in Task 2. `Icon` prop `icon` is `LucideIcon` in both definition and test. `Section` `dark` prop matches between definition, test, and Task 11 usage.

## Notes for the implementer

- Tailwind v4 generates the `bg-bg`, `text-foreground`, etc. utilities from the `@theme inline` color tokens in Task 2. If a utility appears unknown at build time, the token name in `@theme inline` does not match the utility prefix; reconcile against the Task 2 token list.
- `min-h-11` is 2.75rem (44px) from Tailwind's default spacing scale; do not redefine it.
- If next/font or Tailwind v4 syntax differs from what is shown, the installed versions' docs win; read `node_modules/next/dist/docs/` and the Tailwind v4 docs before adjusting, and keep the token names and the charcoal remap mechanism intact.
