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

- Serif: Newsreader, in exactly these places: the display, section titles
  and chapter claims (and the phone menu's links, which carry the title
  role), accent lines, the closing bookend, the hero subline's emphasis
  span (italic at the body size, fern-deep), the stat numerals (48,
  fern-deep), and inside the product the greeting and panel titles.
  Nowhere else.
- Sans: Instrument Sans. Everything else, page and product. Tabular
  numerals on inside the product.
- Section label: 13px, medium, sentence case, fern-deep, optional two-digit
  index (ink at 60 percent) in the product run. No styled uppercase
  anywhere on the page: no text-transform, no all-caps strings set as
  labels or kickers, no wide-tracked small caps. Acronyms and initials
  that are data (AI, LTC, the avatar initials MG, DW, ML, PS) are not
  styled uppercase and are allowed.
- Eight sizes carry the page at 1440 and above (72, 48, 28, 24, 20, 15,
  13, 12) and every size has exactly one line-height, so two roles that
  share a size share their leading. One body size (15) carries running
  text, card text, bios, the nav, and the buttons; one label size (13)
  carries section labels, captions, sources, and the product's UI text;
  the lede (24) is half the title and 1.6 times the body. The product's
  numbers (24) and labels (12) are its own two sizes. Below 768px the
  display and h2 scale with the viewport (52 and 36 at 767), the accent
  sits on 24 and the lede on 20, so the phone ladder at 390 is 42.5,
  30.8, 28, 24, 20, 15, 13, 12.

| Size | Line-height | Roles (class, family, weight, tracking, color) |
|---|---|---|
| 72 (52 at 768) | 1.0 | display: type-display, Newsreader, 400, -0.025em, ink; balanced wrap |
| 48 (36 at 768) | 1.05 | section title and chapter claim: type-h2, Newsreader, 400, -0.02em, ink; balanced wrap. Also the phone menu's link text. Stat numerals: type-h2 in fern-deep |
| 28 | 1.3 | accent line: type-accent, Newsreader, 400, -0.01em, ink; may carry one emphasized word at 600, fern-deep (the bridge line's "Core"). Product greeting: product-greeting, Newsreader, 400, -0.01em |
| 24 | 1.3 | lede: type-body, Instrument Sans, 400, -0.01em, ink 80%; pretty wrap. Product number: product-num, Instrument Sans, 500, -0.01em |
| 20 | 1.3 | card and person title: type-h3, Instrument Sans, 600, -0.01em, ink. Product panel title: product-title, Newsreader, 400. Product detail number: product-num-sm, Instrument Sans, 500, -0.01em |
| 15 | 1.6 | body: type-text, Instrument Sans, 400, 0, ink 70%. The nav links (500, ink 75%), every page button (600), the hero subline (ink 70%; its emphasis span is Newsreader italic, fern-deep), the footer |
| 13 | 1.5 | label: type-label, Instrument Sans, 500, 0, fern-deep. Caption and source: type-caption, 400, ink 60%. Product UI: product-shell, 400. Product buttons (600). The note card's lines, title, and summary |
| 12 | 1.4 | product label and note: product-label, Instrument Sans, 400, opacity 60% to 70%. Product chips, receipts, avatars. The note card's badge, tags, context, and Replay |

- The lede follows every title and claim as its companion: half the
  title, 1.6 times the body, one shade dimmer than the title. A second
  paragraph after a lede is body text (type-text). The hero's subline is
  body text on one line, directly under the display, per the bar's
  mechanism 6.
- No title or lede line ends on a single word: titles wrap balanced,
  ledes wrap pretty, and a lede's measure is set so the rag lands.
- Secondary text never drops below ink at 60 percent (ivory at 60 on dark
  ground): captions, sources, the fictional-company line, the footer, and
  the label index included. Inside the product, dimming is opacity and
  never below 60 percent; the chat chapter's dimmed dashboard (40 percent,
  so one thing is lit) is the exception.
- Nothing below 12px.

## Materials

- Content cards: rounded-2xl, border warm gray 40%, shadow-whisper, hover
  shadow-lifted. The two primary buttons (the hero's and how-we-start's
  "Start with the audit") carry shadow-whisper. Content cards and primary
  buttons are the only shadows on the page.
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
