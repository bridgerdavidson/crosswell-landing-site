# Crosswell Landing Site: Design Foundation

> Spec type: design foundation (visual system + tokens + component inventory). This is not the page structure or copy. Those get their own brainstorm and spec.
> Date: 2026-06-19
> Status: approved in brainstorming, hardened by an adversarial review pass, pending final user review.

## Context

The Crosswell landing site is scaffolded (Next.js 16, React 19, TypeScript, Tailwind v4) but the page is not built. Before building structure, we need a locked visual foundation: the feel, the typography, the color system, and the base tokens for every component the page will use. This avoids the common failure where layout gets built first and the look is retrofitted, which produces an inconsistent, templated result.

The foundation was decided through a brainstorming session driven by the `ui-ux-pro-max` skill, grounded in the brain's Brand Guide and Landing Page Brief (mirrored in `docs/brain/`), then hardened by a multi-reviewer pass that verified contrast math and token completeness. The brand is the locked "Fern" palette: warm, earthy, editorial, premium, trustworthy, deliberately not the high-tech-blue startup look. The audience is fund decision-makers (partners, principals, COOs) at private equity, private credit, and family office funds with roughly $25M to $500M+ AUM. The voice is finance-credible, specific, no startup hype, no em dashes.

## Locked decisions

| Dimension | Decision |
|-----------|----------|
| Overall feel | Quiet Authority: editorial serif headlines + clean sans body. Reads like a research note or a partner's letter. |
| Typography | Source Serif 4 for headlines, Inter for body, UI, and labels. |
| Color strategy | Ivory editorial base with charcoal anchor sections for the Fund Operating System flagship and the final CTA (plus footer). |
| Component character | Refined: radius 8px, hairline borders, whisper shadows. Borders do most of the separation work. |

## Typography

Two families, loaded with `next/font/google` as **variable fonts** (call `Source_Serif_4` and `Inter` with no `weight` array so the full weight axis is available; subset latin; `display: swap`), exposed as CSS variables `--font-serif` and `--font-sans` on the root element. Weights used: serif 600 (and 400 if serif body is ever needed); sans 400, 500, 600. Weight 700 is not loaded because no role uses it.

| Role | Family | Size (px, responsive) | Weight | Line-height | Tracking | Use |
|------|--------|----------------------|--------|-------------|----------|-----|
| Display | Serif | clamp 40 to 60 (`clamp(2.5rem,5vw,3.75rem)`) | 600 | 1.05 | -0.02em | Hero H1 |
| H2 | Serif | clamp 32 to 40 (`clamp(2rem,3.5vw,2.5rem)`) | 600 | 1.12 | -0.01em | Section headings |
| H3 | Sans | 22 (1.375rem) | 600 | 1.2 | -0.01em | Card and subsection titles |
| H4 | Sans | 17 (1.0625rem) | 600 | 1.3 | normal | Small titles |
| Lead | Sans | clamp 18 to 20 (`clamp(1.125rem,1.6vw,1.25rem)`) | 400 | 1.55 | normal | Hero subline, section intros |
| Body | Sans | 16 (1rem) | 400 | 1.65 | normal | Paragraphs |
| Body small | Sans | 14 (0.875rem) | 400 | 1.55 | normal | Captions, notes |
| Eyebrow / label | Sans | 12 (0.75rem) | 600 | 1 | 0.14em, uppercase | Section eyebrows |
| Button | Sans | 15 (0.9375rem) | 500 | 1 | normal | Button labels |

Rules:
- Heading **level** follows document structure, not the serif/sans visual mapping. A serif H2 and an Inter H3 differ in level, not just font.
- Headlines render in serif at H1 and H2; component titles (H3, H4) use Inter to keep the UI crisp.
- H4 is a real heading element where structure calls for it; it is not a skip of H3.
- Body measure default 68ch, hard max 75ch, applied via a `.measure` (prose) utility using `ch` units.
- Tabular figures (`font-variant-numeric: tabular-nums`) are scoped to the ValueTable and any metric display, not global.

## Color

The system is **semantic tokens with a sectional charcoal remap**. Every semantic token has a light value (the default) and a charcoal value (active inside a charcoal section). There is no global dark mode and no `prefers-color-scheme` behavior; charcoal is a per-section context.

### Semantic tokens

| Token | Light value | Charcoal value | Role |
|-------|-------------|----------------|------|
| `--color-bg` | `#F1EEE6` | `#3D3A34` | Page / section background |
| `--color-surface` | `#FBFAF6` | `#45423B` | Raised cards and inputs |
| `--color-foreground` | `#1A1915` | `#F1EEE6` | Primary text |
| `--color-muted` | `#5C574D` | `#B8B2A7` | Secondary text |
| `--color-border` | `#E2DDD2` | `#565249` | Decorative hairline divider |
| `--color-border-strong` | `#B8B2A7` | `#6E695E` | Stronger non-interactive divider |
| `--color-control-border` | `#8A8475` | `#8FB68F` | Interactive control boundary at rest (inputs, secondary outline), meets 3:1 |
| `--color-primary` | `#4E7A4E` | `#4E7A4E` | Fern: primary button fill, key accents |
| `--color-primary-hover` | `#3D633D` | `#5C8C5C` | Primary hover and pressed |
| `--color-primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text and icons on fern |
| `--color-accent-text` | `#3D633D` | `#8FB68F` | Green text and eyebrow accents |
| `--color-link` | `#3D633D` | `#8FB68F` | Inline links (underline grows on hover) |
| `--color-ring` | `#4E7A4E` | `#8FB68F` | Focus ring |
| `--color-error` | `#A23B2B` | `#E2A093` | Error text and border (warm rust) |
| `--color-error-bg` | `#F4E4DF` | rgba(226,160,147,0.14) | Subtle error fill |
| `--color-success` | `#3D633D` | `#8FB68F` | Success text and icon (fern family) |
| `--color-disabled-bg` | `#E7E3D9` | charcoal surface at 45% opacity | Disabled control background |
| `--color-disabled-foreground` | `#A39D8F` | on-dark text at 45% opacity | Disabled text |

Notes:
- `--color-primary-hover` and `--color-accent-text` deliberately share deep fern `#3D633D` on light so they cannot silently drift. The Brand Guide reserves deep fern for green text and the wordmark; reusing it as the button hover is an intentional, approved overload (it is the natural darker fern and reads cohesively).
- `--color-control-border` (`#8A8475`) is darker than the brand warm gray on purpose: input and outline boundaries are the sole visual indicator of the control, so they must meet the 3:1 non-text contrast rule, which `#B8B2A7` does not.
- On charcoal, the fern button keeps its `#4E7A4E` fill with white label (the fill is self-contained). The focus ring and any green accent use the lightened fern `#8FB68F`, never `#4E7A4E`, which is near-invisible on charcoal.
- Disabled controls intentionally sit below AA contrast; WCAG exempts disabled controls from the contrast minimums. Disabled also sets `cursor: not-allowed`.

### Utility tokens

- `--color-scrim`: `rgba(26,25,21,0.5)` (warm near-black) for the mobile menu backdrop and any future modal.
- Z-index scale (in `@theme`): `--z-sticky: 10` (nav), `--z-overlay: 40` (scrim), `--z-menu: 50` (mobile menu panel).
- `::selection`: pale fern, `rgba(78,122,78,0.18)`; inside charcoal sections a lighter fern tint.
- `--border-width-hairline`: `1px`.

### Verified contrast (WCAG 2.1, computed)

| Pair | Ratio | Verdict |
|------|-------|---------|
| `--color-foreground` `#1A1915` on bg `#F1EEE6` | 15.17:1 | AAA |
| `--color-muted` `#5C574D` on bg `#F1EEE6` | 6.19:1 | AA normal |
| `--color-accent-text` `#3D633D` on bg `#F1EEE6` | 5.94:1 | AA normal |
| White on `--color-primary` `#4E7A4E` | 4.98:1 | AA normal, only 0.48 above the 4.5 floor |
| `--color-foreground` ivory `#F1EEE6` on charcoal `#3D3A34` | 9.77:1 | AAA |
| `--color-muted` on dark `#B8B2A7` on charcoal | 5.38:1 | AA normal |
| `--color-accent-text` on dark `#8FB68F` on charcoal | 4.99:1 | AA normal, ~0.5 margin |
| `--color-control-border` `#8A8475` on bg and surface | about 3.2:1 to 3.5:1 | meets 3:1 non-text |

Guardrails: fern `#4E7A4E` may not be lightened, and white-on-fern button labels (button text is normal-size, not WCAG-large) may not drop below the 4.5 floor, without re-verifying, because that pair has almost no headroom. `#8FB68F` on charcoal has only about 0.5 margin, so do not darken it or lighten the charcoal background without re-checking. The old worry that `#B8B2A7` body text fails on charcoal does not apply: it passes at 5.38:1.

### How charcoal sections work (mechanism)

Semantic color tokens are declared with **`@theme inline`** in `src/app/globals.css`, each referencing an underlying raw variable (for example `--color-foreground: var(--raw-foreground)`). The default `:root` sets the light raw values. A scoped selector, `[data-section="dark"]`, overrides only the raw variables that change to their charcoal values. Because the tokens are declared `@theme inline`, the generated utilities (`bg-bg`, `text-foreground`, `text-muted`, `border-border`, `ring-ring`, and so on) resolve through the raw variables at runtime, so every descendant adapts with no per-component re-classing. (Plain `@theme`, by contrast, bakes literal values into the utilities and would ignore the scoped override.) The `create-next-app` scaffold's `globals.css` already uses `@theme inline`; its default `@media (prefers-color-scheme: dark)` block is removed, since charcoal is sectional, not system-driven.

## Spacing and layout

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section vertical padding (top and bottom): `clamp(4rem, 4rem + 4vw, 6rem)`, which runs 64px on small screens to 96px on wide screens.
- Container max-width: 1120px (70rem). Gutters: 24px, rising to 32px at `md` and up.
- Body measure: default 68ch, max 75ch (see Typography).
- Breakpoints (mobile first): 640 `sm`, 768 `md`, 1024 `lg`, 1280 `xl`. Baseline tested at 375px.

## Radius, border, elevation

- Radius: `--radius-sm` 4px (small controls), `--radius-md` 8px (default: cards, buttons, inputs), `--radius-lg` 12px (large panels).
- Border: 1px hairline default (`--color-border`). Non-interactive stronger dividers use `--color-border-strong`. Interactive control boundaries (inputs, secondary button outline) use `--color-control-border`.
- Shadows, warm-tinted and sparse:
  - `--shadow-xs`: `0 1px 2px rgba(61,58,52,0.05)` (cards at rest)
  - `--shadow-sm`: `0 2px 8px rgba(61,58,52,0.06)` (card hover)
  - `--shadow-md`: `0 10px 30px rgba(61,58,52,0.10)` (sticky nav, floating and overlay elements)
- Separation comes from borders first; shadows are reserved for hover and floating elements. Card hover uses `--shadow-sm` (not `--shadow-md`).

## Motion

Restrained and calm, matching the brand.

- Durations: `--dur-fast` 150ms (hover, press), `--dur` 220ms (the base default for transitions), `--dur-slow` 400ms cap (larger reveals).
- Easing tokens: `--ease-out` `cubic-bezier(0.16,1,0.3,1)` (enter), `--ease-in` `cubic-bezier(0.4,0,1,1)` (exit), `--ease` `cubic-bezier(0.25,0.1,0.25,1)` (hover and default).
- Patterns: scroll reveal is a subtle fade with a 12px upward translate; grids (tools, team, value rows) stagger by 50ms. Card hover lifts 2px with `--shadow-sm`. Links grow an underline. Buttons shift to `--color-primary-hover` and scale to 0.99 on press.
- Reduced motion: under `prefers-reduced-motion: reduce`, scroll-reveal elements are set to their final visible state (`opacity: 1`, `translateY(0)`) with no transition. Content is visible by default and reveal is progressive enhancement, so no element depends on JavaScript or IntersectionObserver to become visible.

## Section and contrast mapping

The page splits the brief's "What we do" into two sections (the tools grid and a charcoal flagship panel) for rhythm, giving nine content sections plus the footer. Headings are all top-level H2 (the hero is H1).

| Section | Surface | Heading |
|---------|---------|---------|
| Hero | Ivory (serif headline, lead, primary CTA, small proof line) | H1 |
| Problem statement | Ivory | H2 |
| What we do (5 tools grid) | Ivory, warm-white tool cards | H2 |
| Fund Operating System flagship | Charcoal (anchor 1) | H2 |
| Why us / analyst differentiator | Ivory | H2 |
| Value (before and after) | Ivory, warm-white value table | H2 |
| How we work (3 steps) | Ivory | H2 |
| The team | Ivory | H2 |
| Final CTA | Charcoal (anchor 2) | H2 |
| Footer | Charcoal | n/a |

## Component inventory

### Base primitives (the token-bearing building blocks)

| Component | Purpose | Variants and states |
|-----------|---------|---------------------|
| Container | Max-width and responsive gutters | one |
| Section | Vertical rhythm wrapper that sets surface context | `light` default, `dark` sets `data-section="dark"` |
| Eyebrow | Uppercase tracked section label | adapts via tokens |
| Button | Actions | `primary` (fern fill, white label), `secondary` (control-border outline, foreground label), `link` (text + arrow); states hover, active, focus-visible, disabled; all adapt on charcoal via tokens. Standalone buttons meet 44px min target. |
| TextLink | Inline link | `--color-link`, underline grows on hover; inline links in prose are exempt from the 44px target (WCAG 2.5.8) |
| Input | Text and email entry | default, focus (fern ring), error (`--color-error`), disabled; with label and helper text; min-height 44px |
| Icon | Lucide wrapper | sizes sm 18, md 24, lg 32 (extensible); stroke 1.7; `currentColor`; decorative icons `aria-hidden` |
| Card | Base surface | `--color-surface`, hairline border, radius md, shadow-xs; hover lift 2px with shadow-sm |

### Composed page sections

Nav (sticky, `--z-sticky`: logo, minimal links, Book a call; mobile menu over `--color-scrim` at `--z-menu`, with a 44px toggle), Hero, ProblemStatement, ToolCard and ToolGrid (the five tools), FlagshipPanel (charcoal Fund OS with workflow bullets), Differentiator (the ex-analyst "in the room" block), ValueTable (before and after rows: screening, diligence, memos, LP reporting; tabular figures), StepList (numbered 3-step engagement model), TeamCard and TeamGrid (three roles), CTASection (charcoal closing with Book a call), Footer (charcoal, minimal, 44px link targets), EmailCaptureForm (Input + Button; can appear in the charcoal CTA, so it uses on-dark token values).

Logo: `xw_logo_dark.svg` on light surfaces, `xw_logo_light.svg` on charcoal. Both are in `docs/brain/05 Brand & Assets/` and will be placed in `public/`.

## Accessibility requirements

- All text and meaningful UI meets WCAG AA: 4.5:1 for normal text, 3:1 for large text and for non-text UI boundaries and focus indicators (SC 1.4.11). The contrast table above is the verified record; control borders use `--color-control-border` and on-charcoal focus uses `--color-ring` `#8FB68F` specifically to satisfy 3:1.
- Visible focus rings, 2px ring plus 2px offset, on all interactive elements. The offset gap renders in the surrounding surface color so the ring never sits on a same-color fill.
- Logical heading order: one H1, then H2 for each section, then H3 and H4 by structure, no skipped levels.
- Color is never the only indicator; pair with icon or text.
- `prefers-reduced-motion` respected throughout (see Motion).
- Touch targets at least 44px for all standalone buttons (primary, secondary, and link variants), form controls, the mobile menu toggle, and footer links. Inline TextLinks within prose are exempt.
- Logo has alt text; decorative icons are `aria-hidden`.
- Fonts use `display: swap` with reserved space to keep CLS under 0.1.

## Stack mapping (how this becomes code)

This describes intent. The implementation plan (writing-plans) and the Next 16 and Tailwind v4 docs in `node_modules` determine exact syntax.

- Fonts: `next/font/google` for Source Serif 4 and Inter, both as variable fonts (no `weight` array), subset latin, exposed as `--font-serif` and `--font-sans` on the root element.
- Tokens: Tailwind v4 is CSS-first. All tokens live in `src/app/globals.css` inside `@theme inline` (colors via raw variables, fonts, spacing, radius, shadows, durations, z-index). Semantic color tokens generate utilities (for example `bg-bg`, `text-foreground`, `text-muted`, `bg-primary`, `ring-ring`).
- Charcoal sections: a `[data-section="dark"]` scope overrides the raw color variables to their charcoal values; because tokens are `@theme inline`, descendant utilities adapt automatically. This is a remap of the same semantic tokens, not a parallel token set and not Tailwind's `dark:` variant. Remove the scaffold's `@media (prefers-color-scheme: dark)` block.
- Components: React Server Components by default in `src/components/`, TypeScript, typed props, client components only where interaction requires it (nav menu, form).
- Before writing any page, layout, or component code, read the relevant Next 16 guides in `node_modules/next/dist/docs/` per `AGENTS.md`.

## Out of scope (future specs)

- Final page copy and wording (pulled from `docs/brain/` in its own pass).
- Section layouts and wireframes (the page-structure brainstorm and spec).
- Booking integration choice (Calendly link versus in-page form) and analytics.

This spec covers the visual foundation, the token system, and the component inventory only.

## Success criteria

- A token layer in `globals.css` (`@theme inline`) implementing every token above, with the `[data-section="dark"]` charcoal remap working so utilities adapt inside charcoal sections.
- Source Serif 4 and Inter loaded via `next/font` as variable fonts with no layout shift and swap behavior.
- A set of base components (Container, Section, Eyebrow, Button, TextLink, Input, Icon, Card) built to the Refined character, AA-compliant (per the verified contrast table), and reduced-motion aware.
- A tokens and components reference (a `/styleguide` route is acceptable) to visually verify the foundation before page sections are built.
- The result reads as Quiet Authority on the Fern brand: warm, editorial, premium, finance-credible, with charcoal anchors carrying the flagship and the CTA.
