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
accent colors live as variables scoped to that fragment's shell (set and
tweened inline on the shell from the dataset, so the built CSS never
carries them). Nothing else on the page is amber, red, or blue.

## Type

- Serif: Newsreader, in exactly these places: the display, section titles
  and chapter claims (and the phone menu's links, which carry the title
  role), accent lines, the closing bookend, the page's one emphasis (the
  next line), the stat numerals (48, fern-deep), and inside the product
  the greeting and panel titles. Nowhere else.
- One emphasis on the whole page: Newsreader italic, 400, in the accent
  colour (fern-deep on light ground, fern-soft on dark), over a word or a
  clause. It appears in four places: the hero subline's span (at the body
  size), what a business loses' four fix clauses and the run's closing
  line's "Core" (on the accent rung), and the closing bookend's "Give it
  a memory." (on the display). Nothing else on the page's own text is
  italic or emphasized; an accent line is otherwise roman, 400, full ink.
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
| 24 | 1.3 | lede: type-body, Instrument Sans, 400, -0.01em, ink 80%; pretty wrap. Accent line: type-accent, Newsreader, 400, -0.01em, roman, full ink: why Crosswell's pull quote, the industries row, what a business loses' ledger lines, the run's closing line; its only emphasis is the page's one emphasis (italic, fern-deep). Product greeting: product-greeting, Newsreader, 400, -0.01em. Product number: product-num, Instrument Sans, 500, -0.01em |
| 20 | 1.3 | card and person title: type-h3, Instrument Sans, 600, -0.01em, ink. Product panel title: product-title, Newsreader, 400. Product detail number: product-num-sm, Instrument Sans, 500, -0.01em |
| 15 | 1.6 | body: type-text, Instrument Sans, 400, 0, ink 70%, everywhere running text, card text, bios, the stats' lines, and the values' lines sit. The nav links (500, ink 75%), every page button (600), the hero subline (ink 70%; its emphasis span is the page's one emphasis), the footer |
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

- Content cards (why Crosswell, how we start, beyond the Core, the team):
  rounded-2xl, border warm gray 40%, shadow-whisper, hover shadow-lifted.
  The primary buttons (the hero's and how-we-start's "Start with the
  audit" and the nav's "Set up a call") carry shadow-whisper. Content
  cards and primary buttons are the only shadows on the page.
- The team card is the one card whose picture bleeds: the portrait fills
  the card's top edge to edge, with no padding around it (square at lg
  and on phones, 4:5 between), and the text block under it pads 32 (28 on
  phones), the name on the block's first line, the discipline label 2
  under the name, the bio 12 under the label. Every other card holds the
  card rule below (32 inside, the body 10 under the title).
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
  the whole mini dashboard (the carve-out below).
- Chapter 06's carve-out, the run's one exception to one lit element: the
  chapter is about whose product it is, so its lit element is the entire
  mini dashboard, the shell's content as one lit region (full ink, the
  weights, and the accent on every mark: the buttons, the sparkline, the
  receipts, the avatar, the rail's current box), and a swatch retints all
  of it. The region has no surface of its own (a parchment shell would read
  as a box on the page); its one parchment surface stays the top bar's
  inset card, where the name lives. The calendar column inside the right
  fade stays periphery at 40. Every other chapter keeps one lit element.
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
- Chapter 04's detail panel floats over the board at lg (360 wide, inset
  24 from the top, ending 24 before the right fade, at most 632 tall so its
  bottom stays 24 above the bottom fade; its thread scrolls past that) and
  lives in the selected card's list item, out of the flow, so below lg the
  same panel sits in the flow beneath the card, under a hairline, inside
  the lit card. Below lg the board is a snap scroller: columns at real
  scale (200 wide, three across where the width allows, one and the next
  peeking at 390), opened on the selected card's stage, the previous
  column's tail dissolving in the scroller's 24 of padding and the next
  column's peek over the scroller's own 40 fade (the product's cut, not
  the frame's; double stops). A card with no full detail on file shows its
  own fields (place and kind, loan amount and rate) and every prompt on it
  gets the dataset's one generic answer.
- Chapter 05's rows are controls that open their last run's log (three
  lines, one row open at a time; the inbox's open in the finished state).
  A status mark's slot holds the faces the live moment plays through: a
  turning ring while an agent runs (the one loop the run allows, 1.2s a
  turn, linear), a drawn check when it is done, a dot otherwise. The
  hand-off row the composer adds is in the markup, hidden, until "Hand it
  off" lands it.
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
- Chapter 04 deals in: the stage headers rise 90ms apart from 0.3, the
  cards rise column by column (column i from 0.4 + 0.15 i, 60ms apart
  within a column, on their faces so the item never carries a transform),
  the selected card's highlight arrives at 1.2, the detail panel slides in
  from the right at 1.3 (0.8s; below lg it expands in place beneath the
  card), and "Who is this?" fires on its own at 2.3: the chat mechanic's
  pieces (the prompt lifts into the mini thread as a bubble, the answer's
  row opens and the answer streams in word chunks every 300ms, the receipts
  rise 80ms apart), done at about 6.7. Any card opens its panel (0.35 out,
  0.7 back) and asks "Who is this?" after a 0.5s beat; any button fires its
  prompt into the thread; a click while an exchange runs waits its turn
  and plays 0.4s after. Replay resets the board to Redrock and deals again.
- Chapter 05's live moment, about six seconds: the title rises at 0.3, the
  rows slide in 80ms apart from 0.45, the inbox agent's "Reading 14 new"
  ticks down to 1 (13 steps over 2.4s from 0.9), the follow-up agent goes
  scheduled to running at 1.6 (its dot becomes a turning ring, its status
  swaps under a 0.3s fade) and the count reads 3 running, the screening
  agent's check pops in at 2.7 (scale 0.4 to 1 as it draws), the inbox
  settles at 3.4 (ring to drawn check, "3 drafts ready for your yes", its
  last result rises, 2 running), the follow-up agent settles at 4.2 (ring
  to dot, "1 draft waiting", 1 running), and the inbox row's log opens at
  4.8 with its lines rising 80ms apart; still at 5.8. "Hand it off" clears
  the composer to its placeholder under a fade, lands the running row for
  the task under the roster (0.6 open, 0.7 slide), and ticks the count up;
  the button is then presentation only. Replay resets the roster and plays
  the moment again. The filing agent's ring, and any ring an agent is
  running on, keeps turning after the moment resolves.
- Chapter 06 cycles once: from the frame reaching the unified depth the
  swatches take turns every 2.5s (Bellwether at 2.5, Northline at 5.0,
  Copperfield at 7.5) and stop back on Saguaro at 10.0, Replay following.
  A swatch retints: the shell's four accent variables cross-fade over
  0.5s (GSAP tweens them inline on the shell, so nothing outside the frame
  can read them), the company name, the initials and the greeting swap
  under a 0.3s fade, and the picker's pressed state moves; a click during
  the cycle stops it. Under reduced motion a swatch sets instantly (a site
  control still works); no-JS shows Saguaro.
- A mark a sequence turns (a watch dot into a drawn check) lives in one
  14px slot (product-mark): the dot exists only under the .js gate with
  motion, the check carries data-seq, so no-JS and reduced motion show the
  check and nothing shifts when it draws.
- Reduced motion and no-JS both get the finished state of everything:
  no pin, no hold, every check drawn, 70, the chip, the first exchange
  complete with its chips, the input on its placeholder, the board dealt
  with Redrock open and "Who is this?" answered, the roster settled with
  the inbox log open and the composer holding its task, Saguaro's colors.
- Nothing loops except the hero rotation and a running agent's ring.
- Two kept exceptions to the band and the curve, both out of the
  redesign's scope: the hero's page-load entrance (the display's 0.95s
  rise and the woven core's 1.2s decode-gated fade) and the brain
  section's own transitions (its phrase highlights and Replay on ease).

## Layout

- One container and one grid, hero to footer. Every section, the nav, the
  closing band, and the footer sit in the run's container: 48 gutters at
  lg (1344 wide at 1440, 1632 at 1728), 24 below lg, so the page has one
  left edge, x 48, at lg and above. The grid has two column lines: two
  equal columns 80 apart at lg, and at xl a 576 right column at the
  container's right edge with the left column taking the rest (48 to 736
  and 816 to 1392 at 1440; 48 to 1024 and 1104 to 1680 at 1728; 48 to 472
  and 552 to 976 at 1024). Every two-column arrangement on the page lands
  on those lines; the hero's words and the closing bookend centre in the
  container. The shared code is `src/components/Band.tsx` (the container,
  the grid, the beat, the band, and its split form).
- The beat, in one sentence: neighbouring sections' content sits 288
  apart (192 on phones) and a band hangs what it introduces by 192 (128
  below lg), so inside any section the hang is the largest space and a
  band always groups with its own content. The run is the model (192 from
  a band to its frame, 288 between chapters) and the company half takes
  the same two numbers. A company section pads 160 above its content and
  128 below (96 and 96 on phones); the run's light sections pad 128 and
  the two dark bands (the chat chapter's and the closing) 160 on both
  sides (96 on phones), so every pair of neighbours adds up to 288. The
  run's closing line ("Behind the chat is the Core.") sits the beat below
  the fictional-company line and the beat above the brain section's label.
  Every other space inside a section is smaller than the hang: 64 from a
  card row to how we start's closing line, 32 from the industries' hairline
  to their row, 24 on each side of a ledger hairline. The hero at lg is
  not the viewport's height: 80 under the fixed nav, 128 to the eyebrow,
  the words (the display 168 under the nav), 128 to its edge, then the
  run's own 128, so the buttons sit 256 above the run intro's label and
  the sphere dissolves under them; below lg the hero keeps the viewport's
  height. The footer is chrome, not a section: 64 above and below its one
  row.
- The title band (`Band`) carries every titled section: the run's six
  chapters and who it's for, why Crosswell, how we start, the values, the
  team, and insights. One row on the grid: the label and the title in the
  left column (the title at most 672 wide), the lede in the right column
  with its cap height on the title's (the lede's top margin 9 where the
  title's is 12), nothing stacked under the title; below lg the three
  stack. Why Crosswell's right column holds its pull quote in the lede's
  place, its words on the column line and its rule hanging in the gap; how
  we start's right column is empty (cards follow its title); who it's
  for's running text follows its lede in the lede's column. At 1440 and
  1728 titles run one or two lines (the values' vision line four), wrapped
  balanced, and ledes two or three. What a band introduces (the
  industries row, the cards, the values' columns) hangs from it by the
  section's hang at the container's full width.
- The split form (`Split`) carries the three sections whose words sit
  beside what they introduce: the brain section, what a business loses,
  and beyond the Core. The label, title, lede, and running text stack in
  the left column (the title at most 672, the lede at most 576); the
  section's content takes the right column from the title's row: the
  ledger's first line on the title's cap height, beyond's first card's top
  edge on the title's cap height, and the brain stage (below). Below lg
  the content hangs 128 under the words. A split lede is its paragraph's
  first sentence, or its first two when the first alone is short (the
  brain section and beyond the Core), two or three lines at 1440 and 1728
  (the brain section three, what a business loses two, beyond the Core
  three), and the rest of the paragraph follows as running text. What a
  business loses' ledger rows sit 24 above and below each hairline.
- The brain stage at lg is the right column's width at 5:4, the still's
  own viewBox aspect, so the still and the live field draw the same disc.
  It hangs from the section's top without adding to the section's height
  (the words set the row) and is lifted 3.5 percent of its own height, so
  in every phase of the sequence the drawing lies between the label's top
  and the words' last line; the section's first ink is its label and its
  last is the caption. Below lg it hangs 128 under the words, square on
  phones, its margins cancelling the drawing's inset in its box (13
  percent above, 15 below).
- Running text (15) holds a measure of at most 448, about 65 characters,
  wherever it sits (who it's for, the three splits, how we start's closing
  line); card bodies, the values' columns, and the stats' lines (40ch) are
  held narrower by their own boxes.
- Cards and ledgers on the grid: why Crosswell's, how we start's, and the
  team's card rows run three across the container, 24 apart (432 wide at
  1440, 528 at 1728); the values' three columns take the same lines;
  beyond the Core's two cards stack in the right column; the stats' two
  figures sit on the two column lines (x 48 and 816 at 1440); the
  industries row runs the container under its hairline.
- Bands: the stats open the parchment band why Crosswell sits in (one
  band, the beat between the stats' sources and the label); how we start
  and the team are parchment bands; the closing is the charcoal band and
  the footer charcoal-deep. Every band edge carries exactly one hairline
  (ink 8 on the light bands, ivory 10 on the footer).
- Cards are one object across the page: why Crosswell's three points, how
  we start's three engagements, beyond the Core's two, the team's three.
  Rounded-2xl, a warm gray 40 hairline, shadow-whisper, 32 inside (28 on
  phones), 24 between cards, the title on the card's first line and the
  body 10 under it (the team card's portrait and text block are named in
  Materials); ivory cards on a parchment band, parchment cards on ivory; a
  row of cards shares its top edge and its bottom edge (h-full). The
  values are a ledger, not cards: three columns on five shared rows
  (subgrid: rule, name, line, "What it costs", cost), so the labels sit on
  one line across the row whatever the lines above them wrap to.
- The product run (its intro, the six chapters, the fictional line)
  follows the viewport inside the page's container, so the product runs
  gutter to gutter at every width. A chapter is a band and a frame that
  share both edges: the title band spanning the run (688 / 80 / 576 at
  1440), 192 from the band to the frame (128 below lg, at least half the
  band), 16 from the frame to the caption row, 288 between chapters (192
  on phones) and across the dark band. One skeleton for six chapters:
  chapters 05 and 06 take it too (the spec's split rhythm was withdrawn in
  the design loop's run 2), chapter 06's swatch row sitting in the caption
  row as a site control. Every frame is 800 tall at lg and above and takes
  its product's own height below.
- Two dark moments only: the chat chapter and the closing CTA.
- Verify at 1440, 1728, 1024, and 390 before calling a piece done.

## Copy rules the critic can see

No em dashes. No uppercase. "the Core", never bare "Core". No "brain" or
"mind". No logos; tool names in plain text. Every stat carries a printed
source. No security, hosting, or compliance claims.
