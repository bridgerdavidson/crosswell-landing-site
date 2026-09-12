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
