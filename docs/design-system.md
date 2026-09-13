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

No other hue on the page, with one exception: chapter 06's swatch picker
shows the fictional brands' own colors as small dots, and its alternate
accent colors live as variables scoped to that fragment's shell. Nothing
else on the page is amber, red, or blue.

## Type

- Serif: Newsreader. Display, h2, accent lines, the closing bookend, and
  inside the product for the greeting and panel titles only.
- Sans: Instrument Sans. Everything else, page and product. Tabular
  numerals on inside the product.
- Section label: 14px, medium, sentence case, fern-deep, optional two-digit
  index (ink at 60 percent) in the product run. No uppercase anywhere on
  the page. The two-letter avatar initials inside the product (MG, DW, ML,
  PS) are data, not styled text, and are the one exception.
- Ten sizes carry the page at 1440 and above (72, 48, 28, 26, 20, 16, 15,
  14, 13, 12); the roles are the classes in globals.css. Titles run tight,
  the lede sits between, running text opens up. Below 768px the display,
  h2, and accent scale with the viewport (52, 36, and 28 at 767) and the
  lede and h3 step down to 18px.

| Role | Class | Family | Size | Line-height | Weight | Tracking | Color |
|---|---|---|---|---|---|---|---|
| display | type-display | Newsreader | 72 (52 at 768) | 1.0 | 400 | -0.025em | ink |
| section title, chapter claim | type-h2 | Newsreader | 48 (36 at 768) | 1.05 | 400 | -0.02em | ink |
| accent line | type-accent | Newsreader | 28 | 1.3 | 400 | -0.01em | ink |
| lede | type-body | Instrument Sans | 20 | 1.45 | 400 | -0.01em | ink 80% |
| card title | type-h3 | Instrument Sans | 20 | 1.3 | 600 | -0.01em | ink |
| running text | type-text | Instrument Sans | 16 | 1.6 | 400 | 0 | ink 70% |
| nav link | Nav.tsx | Instrument Sans | 15 | 1.5 | 500 | 0 | ink 75% |
| section label | type-label | Instrument Sans | 14 | 1.4 | 500 | 0 | fern-deep |
| small text | text-sm leading-normal | Instrument Sans | 14 | 1.5 | 400 | 0 | ink 70% |
| caption, source | type-caption | Instrument Sans | 13 | 1.5 | 400 | 0 | ink 60% |
| product greeting | product-greeting | Newsreader | 28 | 1.15 | 400 | -0.01em | ink |
| product panel title | product-title | Newsreader | 20 | 1.3 | 400 | 0 | ink |
| product number | product-num | Instrument Sans | 26 | 1.1 | 500 | -0.01em | ink |
| product detail number | product-num-sm | Instrument Sans | 20 | 1.15 | 500 | -0.01em | ink |
| product UI | product-shell | Instrument Sans | 13 | 1.45 | 400 | 0 | ink |
| product label | product-label | Instrument Sans | 12 | 1.4 | 400 | 0 | opacity 60% |

- The lede follows every title and claim as its companion: one size up
  from running text, tighter, one shade dimmer than the title. A second
  paragraph after a lede is running text (type-text).
- Secondary text never drops below ink at 60 percent (ivory at 60 on dark
  ground): captions, sources, the fictional-company line, the footer, and
  the label index included. Inside the product, dimming is opacity and
  never below 60 percent; the chat chapter's dimmed dashboard (40 percent,
  so one thing is lit) is the exception.
- Nothing below 12px.

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
