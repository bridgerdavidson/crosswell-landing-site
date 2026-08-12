# Mobile Redesign: Hero, Menu, Full-Page Pass

**Date:** 2026-08-11
**Status:** Approved (decisions made via visual companion mockups against the real artwork)
**Scope:** Mobile only (below the `md` breakpoint, 768px). Desktop stays pixel-identical.

## Problem

On phones the hero's woven-core artwork undermines the page instead of carrying it:

1. **The sphere shows fully in the vertical axis.** The art container is sized `100vmax`. On desktop, `vmax` picks the viewport width, so the sphere is cropped top and bottom and its dense woven edges frame the left and right sides ("shows wide, never fully"). On a phone, `vmax` picks the viewport height, so the full top and bottom arcs come into view while the dense side edges get pushed off-screen. The composition inverts into exactly what the desktop design avoids.
2. **The text shield does not carry to mobile.** The ivory veil (`.hero-core-veil`, `ellipse 46% 42%`) fits desktop's short, wide text block. Mobile text wraps into a tall column that extends far past the veil, so thread lines cut through the paragraph and the trust line.
3. **Phones download the full 2.2MB, 4096px JPEG** at high fetch priority.

Separately, the mobile menu is a bare dropdown list with no animation, out of step with the polish of the rest of the site. And the remaining sections have never had a deliberate mobile pass.

## Decisions (all chosen from side-by-side mockups using the real asset)

- **Hero: "A2, arcs tucked."** Keep the untouched circular artwork, scale it up uniformly so the top and bottom arcs slide just off-frame. Rejected: stretching the art to mirror the desktop crop (visible distortion), shrinking the sphere into a contained band, and heavier zooms that emptied out the middle.
- **Menu: ink takeover with indexed serif tabs.** Full-screen inversion into ink, left-aligned Newsreader links with fern index numbers and hairline dividers. Rejected: ivory takeover, floating parchment sheet, centered airy layout, oversized editorial layout, uppercase sans layout.
- **Scope: full-page mobile pass**, not just the two headline items.

## 1. Mobile hero

All changes gated to `max-width: 767px`. Desktop rules stay exactly as they are.

**Art scale.** `.hero-core` goes from `100vmax` to `119vmax` on mobile (matches the approved mockup's 880/740 ratio). The top and bottom arcs land just outside the frame, under the existing top (`h-36`) and bottom (`h-44`) fade gradients. No new art, no distortion; rotation, multiply blend, `saturate(0.92)`, and both radial masks stay untouched. The measured `transform-origin` (50.15% 49.9%) is a ratio, so it survives any uniform scale.

**Text shield.** `.hero-core-veil` gets a mobile override sized to the tall text column. Starting values, tuned live against the dev server:

```css
background: radial-gradient(
  ellipse 100% 54% at 50% 52%,
  var(--color-ivory) 36%,
  rgba(241, 238, 230, 0) 86%
);
```

All hero copy must sit on effectively clean ivory; the weave stays full strength at the left and right frame edges. Note the existing minifier trap documented in `globals.css`: any new gradient must keep explicit double stops where a stop position could be rewritten to 0.

**Asset.** Phones stop downloading the 4096px original. Generate `public/hero-core-mobile.jpg` from the original (about 1600px, quality about 78, target at or under 600KB; the brainstorm mockups used exactly this recipe and it read identically at phone size). Serve via `<picture>` in `HeroCore.tsx`:

```html
<picture>
  <source media="(max-width: 767px)" srcset="/hero-core-mobile.jpg" />
  <img src="/hero-core.jpg" ... />
</picture>
```

The existing decode-then-crossfade logic (`is-loaded` class, `onLoad`, cached-image check) keeps working unchanged: the `load` event and `complete` flag live on the `img` element regardless of which source the browser picks.

## 2. Mobile menu: ink takeover, indexed serif

Replaces the current dropdown entirely on mobile. Desktop nav is untouched.

**Layout.** Full-screen fixed overlay in ink (`#1a1915`). Vertically centered link stack, left-aligned, 32px horizontal padding:

- Each row: fern-soft index number (`#93b393`, 11px, weight 600, letter-spacing 0.14em) then the label in Newsreader 32px ivory, baseline-aligned, 17px vertical padding, bottom hairline `rgba(241, 238, 230, 0.12)`.
- Rows: 01 How it works, 02 Why Crosswell, 03 Security, 04 Team (same targets as today, same `goToSection` smooth-scroll handler).
- Bottom block, 36px from the bottom edge: full-width fern CTA "Set up a call" (`CALL_MAILTO`), then `CONTACT_EMAIL` centered beneath in ivory at 50% opacity, 13px.

**Chrome while open.** The header sits above the overlay. Logo swaps to the existing `xw-h-lockup-light.svg`. The hamburger's two lines morph into an X with a transform transition (a real morph, not an icon swap). Header background/border go transparent over the ink.

**Motion.** Site's easing (`cubic-bezier(0.22, 1, 0.36, 1)`) throughout:

- Open: overlay fades in around 0.4s; rows and bottom block rise 22px and fade in over 0.65s, staggered 90ms apart with a 150ms lead delay (index 0 through 4).
- Close: single quick fade around 0.25s, no stagger.
- `prefers-reduced-motion: reduce`: instant open and close, no animation.

**Behavior and accessibility.**

- Body scroll locks while open, restored on close and on unmount.
- Tapping a link closes the menu and smooth-scrolls (existing handler already does `setOpen(false)`).
- Escape closes. The overlay has `role="dialog"`, `aria-modal="true"`, an aria-label, focus moves to the close button on open and returns to the hamburger on close. `aria-expanded` stays on the toggle.

## 3. Full-page mobile pass

After hero and menu land, audit every remaining section against the dev server at 390px and 360px, with a 320px spot check: ProblemBand, HowItWorks, the core dashboard demo, BeyondCore, TimeBack, Edge, Trust and TrustDiagram, WhoItsFor, HowWeStart, Team, FinalCta, Footer.

Fix criteria for every section:

- No horizontal overflow at any width from 320px to 430px.
- All text readable without zooming; type scales and paddings feel intentional, not squeezed.
- Tap targets at least 44px.
- Animations and reveals behave on touch (no hover-dependent content).

The audit produces the concrete fix list; specific per-section changes are enumerated in the implementation plan, not guessed here.

## 4. Success criteria

- Hero copy fully legible on a phone; no thread lines through text; no full-sphere read.
- Menu opens as a full-screen ink takeover with staggered motion and closes cleanly; works with reduced motion; scroll stays locked while open.
- No horizontal scroll anywhere on the page from 320px to 430px.
- Mobile hero image payload drops from 2.2MB to at or under 600KB.
- Desktop rendering is pixel-identical to production today.

## Out of scope

- Any desktop change.
- New or regenerated artwork.
- Copy changes, CTA wiring changes (mailto stays until the scheduler is picked), pricing, analytics.
- The stale "Current focus: the hero" section in `CLAUDE.md` describes a pre-woven-core state; updating it is a docs follow-up, not part of this build.

## Files expected to change

- `src/app/globals.css`: mobile overrides for `.hero-core` and `.hero-core-veil`; menu overlay and motion styles.
- `src/components/HeroCore.tsx`: `<picture>` swap.
- `src/components/Nav.tsx`: ink takeover menu replacing the dropdown; hamburger-to-X morph; scroll lock; dialog semantics.
- `public/hero-core-mobile.jpg`: new generated asset.
- Section components as the audit dictates (pass 3).
