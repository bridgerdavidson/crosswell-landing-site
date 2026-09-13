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
- Seven sizes carry the page at 1440 and above (72, 48, 24, 20, 15, 13,
  12) and every size has exactly one line-height, so two roles that
  share a size share their leading. The display tier is three rungs, 72 /
  48 / 24. One body size (15) carries running text, card text, bios, the
  nav, and the buttons; one label size (13) carries section labels,
  captions, sources, and the product's UI text; the lede (24) is half the
  title and 1.6 times the body, and the serif accent lines and the
  product's greeting sit on that same rung. The product's numbers (24)
  and labels (12) are its own two sizes. Below 768px the display and h2
  scale with the viewport (52 and 36 at 767) and the lede sits on 20, so
  the phone ladder at 390 is 42.5, 30.8, 24, 20, 15, 13, 12.

| Size | Line-height | Roles (class, family, weight, tracking, color) |
|---|---|---|
| 72 (52 at 768) | 1.0 | display: type-display, Newsreader, 400, -0.025em, ink; balanced wrap |
| 48 (36 at 768) | 1.05 | section title and chapter claim: type-h2, Newsreader, 400, -0.02em, ink; balanced wrap. Also the phone menu's link text. Stat numerals: type-h2 in fern-deep |
| 24 | 1.3 | lede: type-body, Instrument Sans, 400, -0.01em, ink 80%; pretty wrap. Accent line: type-accent, Newsreader, 400, -0.01em, ink; may carry one emphasized word at 600, fern-deep (the bridge line's "Core"). Product greeting: product-greeting, Newsreader, 400, -0.01em. Product number: product-num, Instrument Sans, 500, -0.01em |
| 20 | 1.3 | card and person title: type-h3, Instrument Sans, 600, -0.01em, ink. Product panel title: product-title, Newsreader, 400. Product detail number: product-num-sm, Instrument Sans, 500, -0.01em |
| 15 | 1.6 | body: type-text, Instrument Sans, 400, 0, ink 70%. The nav links (500, ink 75%), every page button (600), the hero subline (ink 70%; its emphasis span is Newsreader italic, fern-deep), the footer |
| 13 | 1.5 | label: type-label, Instrument Sans, 500, 0, fern-deep. Caption and source: type-caption, 400, ink 60%. Product UI: product-shell, 400. Product buttons (600). The note card's lines, title, and summary |
| 12 | 1.4 | product label and note: product-label, Instrument Sans, 400, on the floor tone (ink 60). Product chips, receipts, avatars. The note card's badge, tags, context, and the Replay controls |

- Wherever a sentence follows a title or a claim, that sentence is the
  lede, the title's companion: half the title, 1.6 times the body, one
  shade dimmer than the title. A title followed directly by cards or a
  list (how we start) has no lede and needs none. A second paragraph
  after a lede is body text (type-text). The hero's subline is
  body text on one line, directly under the display, per the bar's
  mechanism 6.
- No title or lede line ends on a single word: titles wrap balanced,
  ledes wrap pretty, and a lede's measure is set so the rag lands.
- Secondary text never drops below ink at 60 percent (ivory at 60 on dark
  ground): captions, sources, the fictional-company line, the footer, and
  the label index included. Inside the product, dimming is a tone (a
  color variable, never a stacked opacity). The chapter's payload (what
  the spec names for it) never drops under 60 percent. Product periphery
  that is not the payload may sit at 40 only where a fade or the lit panel
  covers it (the calendar columns starting inside chapter 01's and 06's
  right fade, the page behind chapter 03's panel); periphery that is fully
  visible takes the field tone, and below lg, where no frame fades an
  edge, every periphery region renders at the field tone, so no readable
  text under 20px is ever below 60 in the open.
- Nothing below 12px.

## Materials

- Content cards: rounded-2xl, border warm gray 40%, shadow-whisper, hover
  shadow-lifted. The primary buttons (the hero's and how-we-start's "Start
  with the audit" and the nav's "Set up a call") carry shadow-whisper.
  Content cards and primary buttons are the only shadows on the page.
- Product fragments: parchment panels on ivory. The product has no
  container of its own: its canvas is the page's ivory, and the one
  parchment surface in a frame is the lit element's (the chat panel, the
  detail panel, the highlighted row, the top bar in chapter 06), so no
  frame reads as a rectangle placed on the page and the surface is where
  the eye lands. Tiles and cards in the field are hairline boxes at
  0.75rem radius on the canvas. The rail's and top bar's hairlines (warm
  gray 30%) carry the app's structure. No radius, border, or shadow around
  a fragment. One accent per panel. The dark chapter: a charcoal panel on
  the charcoal-deep band, ivory text, fern-soft accent.
- Fragments are cut by a frame; cut edges dissolve into the page with a
  mask gradient (double stops). The content edge stays crisp. The dissolve
  is written in pixels so every frame fades over the same distance: 160 at
  the right, 120 at the bottom (120 both ways on phones), so the product
  reaches the gutter. A mask exists only where the frame cuts the product:
  below lg a frame takes its product's own height and carries no bottom
  mask, and a shell that fits its frame carries none at all; only a shell
  that still overflows the frame's width keeps the right fade. Every frame is
  800 tall at lg and above (its product's own height below), so the run
  keeps one beat; a product shorter than that shows more of itself (the
  next rows, the panel below, the list under the buttons) and is cut, never
  scaled or padded. Where the frame cuts the product, no fill or hairline
  ends on the cut: it dissolves in the fade, or the surface is inset with
  its own rounded edge inside the frame. A wide frame's shell runs 80px
  past the right edge and is cut at the right and the bottom (the top bar's
  rule and the avatar go out with it, never half-faded); a fitted frame's
  product (chapter 05) fits its width, its top bar's rule stops 24 inside
  the right edge with the avatar inside it, and it is cut only at the
  bottom. A lit
  surface never sits inside a fade: the chat and detail panels float as
  inset cards over their fields, above the fades, and chapter 06's top bar
  is an inset card ending before the fade. Fragments render at real scale; nothing is scaled
  down. Below 768px a frame crops to a single column; chapter 04's column
  is the selected card's stage, with the panel out of the crop and the
  card lit.
- Inside every frame exactly one element is lit, and the eye lands on it
  under a blur. The lit element carries the frame's one parchment surface,
  full ink, its own secondary text at 75, its labels at 60, weight 600 on
  its strong words, and every one of the chapter's accent marks (its dot,
  its check, its bar, its button, its receipts, its avatar). The field, everything else, sits at exactly
  the floor: text at ink 60, weight 400, and no accent anywhere in it:
  dots, bars, sparklines, checks, the rail's current box, buttons and
  receipts outside the lit element take warm gray or hairline forms. Text
  of 20px and larger in the field (the greeting, the tile numbers, the
  panel titles) reads strong even at 60, so it sits at the periphery tone,
  40; text under 20px never drops below 60. Fern lives only inside the lit
  element. Lit per chapter: 01 the draw
  approval, 02 the Draw 4 row, 03 the chat panel (the dashboard behind it
  is periphery at 40), 04 the detail panel, 05 the inbox agent's row, 06
  the top bar.
- Chrome inside the product: a 48px rail (16px icons in 32px boxes, 12
  apart, the active one in accent wash, the rest on the label tone) and a
  48px top bar (company name left, 28px avatar right), so the top bar's
  rule lands on the first icon's bottom edge. A demo control that does
  nothing yet is presentation only (tabIndex -1, aria-hidden); chapter
  03's send button and follow-up chips are live only while there is
  something to send or choose, and inert otherwise.
- A progress row (chapter 02's rocks) sets its percentage under its title
  at the row's left, on the label size, above the bar, so every number
  reads before the frame's right fade whatever the width; only the bars'
  tails dissolve.
- Inside a frame the only text is what the product would show its own
  user. No informational pills, headers, captions, or feature labels
  inside a frame. Every description sits outside: the claim, the body, the
  caption "Interactive demo · Sample data".

## Motion

- Curve: cubic-bezier(0.22, 1, 0.36, 1). Entrances 0.6 to 0.9s. Staggers
  60 to 90ms. Nothing under 300ms except hover (150 to 200ms).
- Scroll reveals trigger with the block's top at about 70% of the viewport,
  once, and every reveal group on the page steps by the site's one 80ms
  step (a chapter's frame follows its band by 80; a row of cards steps 0,
  80, 160). Sequences play once and offer a small "Replay" outside the frame,
  beside the demo caption, revealed once the sequence has finished.
- A chapter's sequence is a paused GSAP timeline built over the frame by
  the shared useSequence hook, played once when the frame's top reaches
  the unified depth and restarted by Replay. The elements that play in
  carry data-seq and are pre-hidden only under the .js gate, so no-JS
  paints the finished state.
- Chapter 02 is the scroll-driven chapter. At 768 and above, under JS
  with motion, its frame holds (position: sticky, 80 under the nav or
  centered when the viewport has the room) while two viewport heights
  scroll past, and the scroll position scrubs one timeline over the frame:
  the team and rocks panels pan in on one rigid track from the right fade
  (linear in scroll, smoothed over 0.5s), each panel's rows assembling as
  it clears the fade, and one moment plays across the middle of the hold:
  the Draw 4 check draws in your day, Dana's site-walk row flips as the
  pan clears the team panel, the deployment rock nudges 68 to 70 as the
  rocks panel lands, and the synced chip settles; the last 12 percent is
  still. Scrolling back reverses it, which is the chapter's replay, so no
  Replay control shows at 768 and above. Your day itself assembles on the
  clock at the unified depth. Below 768 nothing pins or scrubs: each panel
  plays once, on the clock, when its own top reaches the unified depth,
  and Replay in the caption row restarts the three.
- Chapter 03 is the send mechanic. The first question sits composed in
  the input (full ink) beside a live send button; at the unified depth it
  waits one beat (1.0s) and sends itself unless the visitor sends it. The
  message lifts into the thread, two working lines rise and their dots
  turn into drawn checks, the answer's row opens to its full height and
  the answer streams in word chunks (two to four words every 300ms), the
  receipts rise 80ms apart, then the follow-up chips. A chip, clicked,
  collapses the chip row, lands its question in the input, waits 0.6s and
  sends the same way; the remaining chip returns after the answer. Three
  exchanges, then still. The panel hugs its thread, so it grows from the
  composer as an exchange arrives and the send happens in view; at lg the
  thread stops 24 above the frame's fade (max 512) and scrolls, and below
  lg the shell is held at the finished exchange's height so the band never
  moves. The input is never a field: nothing accepts typing, and it reads
  as the composer with a message ready. Replay collapses the thread and
  composes the first question again.
- A mark a sequence turns (a watch dot into a drawn check) lives in one
  14px slot (product-mark): the dot exists only under the .js gate with
  motion, the check carries data-seq, so no-JS and reduced motion show the
  check and nothing shifts when it draws.
- Reduced motion and no-JS both get the finished state of everything:
  no pin, no hold, every check drawn, 70, the chip, the first exchange
  complete with its chips, the input on its placeholder.
- Nothing loops except the hero rotation and a running agent's progress.
- Two kept exceptions to the band and the curve, both out of the
  redesign's scope: the hero's page-load entrance (the display's 0.95s
  rise and the woven core's 1.2s decode-gated fade) and the brain
  section's own transitions (its phrase highlights and Replay on ease).

## Layout

- Content width max-w-6xl (1152px), gutters px-6. Split sections in the
  company half use the 0.9fr / 1.1fr grid. Section rhythm py-24 (sm:
  py-32).
- The product run (its intro, the six chapters, the fictional line)
  follows the viewport inside fixed 48px gutters at lg (1344 wide at 1440,
  93 percent; 1632 at 1728), so the product runs gutter to gutter at every
  width. A chapter is a band and a frame that share both edges. The band
  is one row in two columns spanning the run: label and claim on the left
  (the claim at most 672 wide), the lede in a 576 column at the run's
  right edge with its cap height on the claim's, nothing stacked under the
  claim. 192 from the band to the frame (128 below lg, at least half the
  band), 16 from the frame
  to the caption row, 288 between chapters (192
  on phones) and across the
  dark band (its padding is 160 against the run sections' 128). One skeleton for six chapters: chapters 05 and 06 take
  it too (the spec's split rhythm was withdrawn in the design loop's run
  2), chapter 06's swatch row sitting in the caption row as a site
  control. Every frame is 800 tall at lg and above and takes its product's
  own height below.
- Two dark moments only: the chat chapter and the closing CTA.
- Verify at 1440, 1728, and 390 before calling a piece done.

## Copy rules the critic can see

No em dashes. No uppercase. "the Core", never bare "Core". No "brain" or
"mind". No logos; tool names in plain text. Every stat carries a printed
source. No security, hosting, or compliance claims.
