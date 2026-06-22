# Crosswell Landing Page: Structure, Copy & Behavior

> Spec type: page structure, final copy, and interaction behavior for the single Crosswell landing page.
> Date: 2026-06-22
> Status: drafted in brainstorming, pending user review.
> Builds on: `2026-06-19-design-foundation-design.md` (the locked visual system, tokens, and base primitives). This spec assumes that foundation exists and is the source of truth for color, type, spacing, motion, and component character.

## Context and what this spec covers

The design foundation is built and committed: the Fern token system with the `[data-section="dark"]` charcoal remap, Source Serif 4 + Inter via `next/font`, and the base primitives (Container, Section, Eyebrow, Button, TextLink, Input, Icon, Card) plus a `/styleguide` route. `src/app/page.tsx` is still the Next.js starter.

This spec defines the actual landing page: section order, final copy, per-section layout and behavior, the global chrome (sticky nav, footer), and the assets and configuration the build needs. It does not redefine the visual system; it consumes it.

## Positioning decision (read this first)

The original brain framing ("Crosswell builds custom AI tools, software, and automations for investment funds") was **narrowed**. The locked positioning for the site is:

**Crosswell is a horizontal AI consulting firm that helps any business run leaner and save money by integrating custom AI tools, software, and automations into how they already work. Investment funds are the proven niche and the flagship proof, not the ceiling.**

Rationale: the founder confirmed Crosswell wants to serve all businesses; funds became the early focus because the team has connections in two funds and an active private credit fund build, which makes funds the one vertical with real proof today. The honest way to broaden is to widen the framing in the hero and connective copy while keeping the fund-specific body as the visible flagship that earns the broader claim. No second vertical is invented, because there is no second proof vertical yet.

This drove five coherence edits versus a funds-only page (all baked into the copy below):
1. Hero leads with universal business value (the brand promise); funds appear as proof.
2. Problem statement is widened one notch to any lean team, with universal busywork pains.
3. The tools section adds a transition that frames the five fund tools as "what this looks like where we go deepest."
4. The value table is labeled as fund proof, under a general argument.
5. Why-us closes on the transferable insight (we learn a workflow from the inside, and that travels to any business).

This is a strategy change relative to the brain. See "Brain reconciliation" at the end.

## Locked decisions

| Decision | Value |
|----------|-------|
| Build scope | The full single page, all 11 parts (nav through footer), one pass. |
| Positioning | Horizontal AI consulting, investment funds as the proven niche / flagship proof. |
| Primary CTA | "Book a call", a `mailto:` link. No form, no scheduler, no backend. |
| CTA / contact email | `hello@crosswellconsulting.com` (same address everywhere). |
| Canonical domain | `crosswellconsulting.com` (set as canonical; update Vercel before outreach). |
| Hero direction | Brand-promise-led (option 1). |
| Team names | Full names: Max Marohn, Michael Zamora, Bridger Davidson. |
| Team photos | Real headshots, reserved slot per card. No LinkedIn or social links. |
| Logos | `xw_logo_dark.svg` (light surfaces) and `xw_logo_light.svg` (charcoal). Present in `docs/brain/05 Brand & Assets/`; copy into `public/` during build. |
| Motion intensity | Baseline tasteful motion everywhere plus four signature moments. Not flashy. See the Motion and interaction layer below. |
| Smooth scroll | Lenis momentum smooth-scroll site-wide, disabled under reduced motion. |
| Animation libraries | Motion (Framer Motion, the `motion` package) for React animation; Lenis for smooth scroll. No GSAP, WebGL, or Lottie. |

## Page-level setup

- **Route:** the home route at `src/app/page.tsx`, replacing the starter. A Server Component by default; only the nav (mobile menu) and any scroll-reveal need client behavior.
- **Metadata** (via the App Router `metadata` export):
  - Title: `Crosswell Consulting | Custom AI tools and automations for your business`
  - Description: `Crosswell builds custom AI tools, software, and automations that take manual work off your team so your business runs leaner and saves money. Our deepest proof is in investment funds. Book a call.`
  - Canonical: `https://crosswellconsulting.com`
- **Fonts:** already loaded by the foundation (`--font-serif`, `--font-sans`). No change.
- **Section order and anchor ids:**
  1. Nav (sticky, no id)
  2. Hero (`#hero`)
  3. Problem (`#problem`, not in nav)
  4. What we do / tools (`#what-we-do`)
  5. Fund Operating System flagship (`#flagship`, charcoal)
  6. Why us (`#why-us`)
  7. Value (`#value`, not in nav)
  8. How we work (`#how-we-work`)
  9. Team (`#team`)
  10. Final CTA (`#final-cta`, charcoal)
  11. Footer (charcoal)
- **Nav links:** What we do (`#what-we-do`), Why us (`#why-us`), How we work (`#how-we-work`), Team (`#team`). Problem and Value are intentionally omitted (people navigate to outcomes, not problem framing).
- **Global behaviors:**
  - Smooth scroll to in-page anchors; account for the sticky nav height with `scroll-margin-top` on each section target.
  - Sticky nav condenses on scroll past the hero (hairline bottom border, whisper shadow, slight background shift) per the foundation's `--shadow-md` and motion tokens.
  - Scroll-reveal: subtle fade + 12px rise, grids stagger 50ms, fully disabled under `prefers-reduced-motion` (content visible by default; reveal is progressive enhancement).
  - All "Book a call" actions point to `mailto:hello@crosswellconsulting.com`. No prefilled subject in v1 (kept simple; can add `?subject=` later).

---

## Section specs

Copy below is final and verbatim. No em dashes anywhere. Jargon is expanded on first page-wide use only (see the consistency rules at the end).

### 1. Nav (sticky) `light`

- **Purpose:** orient the reader, signal who Crosswell is, keep the single conversion action one glance away.
- **Layout:** full-width sticky bar on the ivory base, inner content in a Container, height ~64 to 72px. Left: wordmark (`xw_logo_dark.svg`, links to `#hero`). Center/right: the four anchor links (TextLink nav treatment, no underline at rest, fern on hover). Far right: the fern "Book a call" Button, the only filled element. Condenses on scroll. Below `md`: links collapse behind a Lucide menu/x toggle; the wordmark and the fern Button stay visible. The toggle opens a full-width ivory panel listing the four links stacked with generous tap targets, a hairline divider, then a full-width fern "Book a call" Button.
- **Copy:** wordmark alt `Crosswell Consulting`; links `What we do` / `Why us` / `How we work` / `Team`; button `Book a call`.
- **Components:** Container, Button (primary), TextLink (nav), Icon (Lucide menu/x).
- **Behavior / a11y:** the mobile menu is a client component; toggle has an accessible name and `aria-expanded`; focus moves into the open panel and Escape closes it; 44px minimum tap targets.

### 2. Hero `light` `#hero`

- **Purpose:** state what Crosswell does for any business, drive the one action, set the editorial finance-credible tone.
- **Layout:** single-column, left-aligned, generous top/bottom padding. Stack on one left edge: Eyebrow, serif H1 (wraps 2 to 3 lines, the single most emphasized element), Inter lead subline constrained to ~34 to 40rem, an action row (primary Button then secondary link), then a small quiet proof line in muted text. No image, no card; authority from type and whitespace. On mobile the actions stack with the primary on top.
- **Copy:**
  - Eyebrow: `Custom AI for any business`
  - H1: `We find what's holding your business back and build the AI that moves it forward.`
  - Subline: `Crosswell builds custom AI tools, software, and automations that take the manual work off your team, so their time and your money go toward results instead of busywork. The same approach works for any business that wants to run leaner.`
  - Primary action: `Book a call` to the mailto.
  - Secondary action: `See what we build` (link with arrow) to `#what-we-do`.
  - Proof line: `Our deepest proof is in investment funds, where we are building the full AI operating layer for a live private credit fund.`
- **Components:** Section (light), Container, Eyebrow, Button (primary), Button (link), Icon.
- **a11y:** one H1 on the page; the proof line is plain text, not a heading.

### 3. Problem statement `light` `#problem`

- **Purpose:** name the busywork pain any lean team feels so the reader feels understood; set up "what we do" as the answer without pitching it.
- **Layout:** centered editorial column. Eyebrow, serif H2 (~720px max), a two-paragraph Inter lead (~620px), then a four-up grid of pain Cards (4 desktop, 2 tablet, 1 mobile), each with a Lucide icon top-left, a semibold title, and one tight line. No CTA.
- **Copy:**
  - Eyebrow: `The cost of busywork`
  - H2: `Your sharpest people are buried in work a system should be doing.`
  - Lead paragraph 1: `Most teams run leaner than they would like. The people who cost the most and decide the most lose hours every week to manual work: rekeying the same data between systems, chasing documents, rebuilding the same reports, and assembling updates by hand.`
  - Lead paragraph 2: `The cost is not only hours. It is slower decisions, missed opportunities, and your team's real edge, their judgment, spent on tasks that never needed a person in the first place.`
  - Pain cards:
    1. Title `Data moved by hand` · `The same numbers get rekeyed from one tool to another, and the hours and the errors pile up.` · icon `repeat-2`
    2. Title `Documents read line by line` · `Contracts, reports, and filings get read manually and slowly, with real risk of missing what matters.` · icon `file-search`
    3. Title `The same reports, rebuilt every time` · `Recurring updates and dashboards get assembled from scratch instead of generated on demand.` · icon `line-chart`
    4. Title `Work that stalls on a person` · `Multi-step processes wait on someone to push them forward, so everything moves at the speed of the busiest person.` · icon `hourglass`
- **Components:** Section (light), Container, Eyebrow, Card, Icon.

### 4. What we do, five tools `light` `#what-we-do`

- **Purpose:** make the firm concrete and buyable; show five standalone tools that each fix one workflow, with a before/after on every card as proof. Framed as "what this looks like where we go deepest," so the fund specificity reads as proof of a horizontal capability.
- **Layout:** left-aligned header (Eyebrow, H2, subheading, one framing line), then a five-Card grid (1 / 2 / 3 responsive; equal height). Each Card: Lucide icon top-left, tool name (Inter semibold), one-line description, hairline divider, then the before/after value pinned to the card bottom with the key figure in deep fern so proof lines align across the grid. One quiet caption under the grid, plus a "Book a call" link with arrow.
- **Copy:**
  - Eyebrow: `What we build`
  - H2: `Five tools we built for funds, each aimed at one workflow a team dreads`
  - Subheading: `Point solutions that drop into how a business already works. Every one replaces a specific manual job, and the before-and-after time is the proof.`
  - Framing line: `Investment funds, the private equity, private credit, and family offices that run lean on roughly $25M to $500M+ in AUM (Assets Under Management), are where we go deepest. This is what that looks like there. The same approach fits whatever manual workflow is costing your team the most.`
  - Tool cards (title · description · before/after meta):
    1. `Deal Screening Engine` · `Ingests inbound deals from email and CRM (Customer Relationship Management), scores them against the fund's criteria, and surfaces only the ones worth a partner's time.` · `Before: hundreds of inbounds reviewed by hand. After: a ranked short list, roughly 80% less screening time.` · icon `inbox`
    2. `Diligence Document Agent` · `Point it at a data room or a stack of PDFs and it extracts key terms, covenants, risks, and financials into a structured summary you can actually read.` · `Before: a 3-day read. After: a 20-minute review.` · icon `file-search`
    3. `Memo & IC Deck Drafter` · `Drafts first-pass investment memos and Investment Committee (IC) decks straight from the fund's data and its own template.` · `Before: 6 to 10 hours per deal. After: a drafted first pass in minutes.` · icon `file-pen`
    4. `LP Reporting Automation` · `Pulls portfolio numbers and auto-builds consistent, branded investor updates for the fund's Limited Partners (LPs).` · `Before: a quarterly week of formatting. After: an afternoon of review.` · icon `bar-chart-3`
    5. `Portfolio & Pipeline Dashboard` · `One live view across deals and holdings, replacing the scattered spreadsheets a team rebuilds by hand.` · `Before: a day of data-pulling. After: real-time answers.` · icon `layout-dashboard`
  - Caption: `Numbers drawn from a private credit fund we work with.`
  - Action: `Book a call` (link with arrow) to the mailto.
- **Components:** Section (light), Container, Eyebrow, Card, Icon, Button (link).

### 5. The Fund Operating System, flagship `charcoal` `#flagship`

- **Purpose:** the strategic peak. Move from "five tools" to a connected set of AI agents that runs a core workflow end to end. This is the flagship niche build and the clearest proof of depth.
- **Layout:** full-bleed charcoal anchor, generously padded, centered Container. Centered intro (Eyebrow, serif H2, one subheading). Below it, the visual core: a five-step agent flow left to right (deal in, screen, diligence, memo, decision-ready), each a slim raised card on a one-shade-lighter dark surface with a hairline border, connected by small fern chevrons; step five carries a subtle fern accent as the payoff. On tablet it wraps 3 + 2; on mobile it stacks with downward chevrons. Beneath the flow, one emphasized serif value line. Then a quieter wide Card for Custom Agents & Integrations with an inline link. Bottom: a centered primary "Book a call" Button.
- **Copy:**
  - Eyebrow: `The Fund Operating System`
  - H2: `One system that runs the deal, not five tools that each do a piece of it`
  - Subheading: `The tools above each fix one job. The Fund Operating System connects them into agentic systems, software that runs multi-step work on its own, so a deal hits the inbox and the team gets a decision-ready package back without lifting a finger.`
  - Intro line: `Watch a single inbound deal move through the system. Each agent does its job and hands off to the next, so work that used to span days and several people happens in hours.`
  - Five steps (title · detail · label):
    1. `A deal lands` · `A new opportunity arrives by email or CRM and enters the system automatically.` · `Inbound`
    2. `It gets scored` · `The screening agent scores the deal against the fund's criteria and surfaces whether it is worth a partner's time.` · `Screening agent`
    3. `Risks get flagged` · `The diligence agent reads the data room, extracts key terms and covenants, and flags the risks that matter.` · `Diligence agent`
    4. `The memo gets drafted` · `The memo agent drafts the first-pass write-up from the fund's own data and template.` · `Memo agent`
    5. `The team decides` · `A decision-ready package lands in front of the team. They do the one thing only people can do: decide.` · `Decision-ready`
  - Value line: `It collapses a multi-day, multi-person workflow into hours, and frees the team to do the one thing only people can: decide.`
  - Custom Agents block: title `Custom Agents & Integrations` · `When the workflow eating your week is specific to your business, we build bespoke agents wired into your existing stack: CRM, email, data providers, and accounting. We start with whatever costs the most time.`
  - Action: `Book a call` (primary) to the mailto.
- **Components:** Section (dark), Container, Eyebrow, Card, Icon, Button (primary), TextLink.
- **Note:** the duplicated client-proof paragraph from the earlier draft was cut here, since Why-us carries the unnamed fund proof.

### 6. Why us `light` `#why-us`

- **Purpose:** the single most important credibility claim. One partner spent years as a fund analyst, so the team understands fund workflows from the inside, and that operator habit is what makes the work fit any business.
- **Layout:** an editorial lede block (serif H2 + subheading on the left, a margin-note differentiator line set off to the right with a thin fern rule), then a three-Card support row (icon, title, one to two sentences), then a closing line and a quiet "Book a call" link.
- **Copy:**
  - Eyebrow: `Why Crosswell`
  - H2: `We have sat on your side of the table.`
  - Subheading: `One of our partners spent years as a fund analyst. We understand deal flow, diligence, the IC memo, and LP reporting from the inside, not from a deck about an industry. We learn a workflow before we automate it.`
  - Margin note: `We don't translate between finance and tech. We live in both. Most AI consultants can't say that.`
  - Cards (title · detail · icon):
    1. `We know the workflow` · `Screening inbound deals, reading a data room line by line, building the IC memo, assembling the quarterly LP update. We have done these jobs, so we build for how they really run, not how a generic tool assumes they do.` · `clipboard-list`
    2. `Production systems, not slideware` · `We ship working software your team uses on Monday, not a roadmap and a strategy deck. The proof is real: we are building the full AI operating layer for a private credit fund we work with.` · `terminal`
    3. `Fixed scope, fixed price` · `We start with one painful, visible workflow, agree the scope and the price up front, and deliver a tool that earns its keep. No open-ended retainer, no surprise invoice.` · `file-check`
  - Closing line: `We learn a workflow from the inside before we build for it. That is what makes the work fit a fund, and what makes it fit any business we take on.`
  - Action: `Book a call` (link with arrow) to the mailto.
- **Components:** Section (light), Container, Eyebrow, Card, Icon, Button (link), TextLink.

### 7. Value, before / after + ROI `light` `#value`

- **Purpose:** make the financial case in concrete terms. State the general argument (expensive people's time should go to judgment, not busywork), then show four high-cost fund workflows before and after as the proof, and close on the ROI line.
- **Layout:** left-aligned header (Eyebrow, H2, one-line subheading). A small label marks the table as fund-measured. The comparison is a single warm-white Card holding a four-row table: columns Workflow / Before (muted) / After (emphasized, figure in deep fern), small uppercase column headers, hairline row dividers, tabular figures so the After column aligns. On mobile it collapses to stacked row blocks. Below the table, a fern-tinted ROI callout, then a secondary outline "Book a call" Button.
- **Copy:**
  - Eyebrow: `The math`
  - H2: `Your people are expensive, and their judgment is what you pay for. We stop it going to manual work.`
  - Subheading: `A lean team does not have hours to spare on formatting and first drafts. Here is what changes when expert time stops going to the work a system should do.`
  - Table label: `Measured inside a private credit fund we work with:`
  - Column headers: `Workflow` / `Before` / `After`
  - Rows (workflow · before · after):
    1. `Deal screening` · `Hundreds of inbounds reviewed by hand.` · `A ranked short list, about 80% less time.`
    2. `Diligence` · `Three days reading a data room.` · `A 20-minute structured review.`
    3. `Memos` · `Six to ten hours per deal writing.` · `A drafted first pass in minutes.`
    4. `LP reporting` · `A week of quarterly formatting.` · `An afternoon of review.`
  - ROI callout: `A system that gives a lean team back 10 to 20+ hours a week pays for itself in the first month, and lets them do more without hiring.`
  - Action: `Book a call` (secondary outline) to the mailto.
- **Components:** Section (light), Container, Eyebrow, Card, Button (secondary), Icon (optional arrow between Before and After).

### 8. How we work, three steps `light` `#how-we-work`

- **Purpose:** lower the perceived risk of hiring an outside firm. Start with one workflow at fixed scope and fixed price; expand only after the business has seen the time saved.
- **Layout:** left-aligned header (Eyebrow, H2, one-sentence intro). Three steps as a 3-up Card row (stacks to 1 on mobile). Each Card: a large serif numeral (01, 02, 03) in deep fern, an optional Lucide icon, a serif title, one Inter sentence. "Fixed scope, fixed price" is emphasized in step two. A closing line plus a "Book a call" link.
- **Copy:**
  - Eyebrow: `How we work`
  - H2: `We start with one workflow, not a year-long contract.`
  - Subheading: `Hiring an outside firm is a real decision. We make the first one small: you see a working tool and the hours it gives back on a single workflow before there is any talk of expanding.`
  - Steps (numeral · title · detail · icon):
    1. `01` · `Find the pain` · `We start by identifying one painful, visible workflow, the task quietly costing your team the most hours.` · `search`
    2. `02` · `Build and prove it` · `Fixed scope, fixed price. We deliver a working tool that handles the workflow, so you can measure the time saved against exactly what you paid.` · `wrench`
    3. `03` · `Expand` · `Once your team sees the time saved, we build out from there, one proven workflow at a time.` · `trending-up`
  - Closing line: `No long contract to start. Tell us the workflow that is costing you the most, and we will scope the first build.`
  - Action: `Book a call` (link with arrow) to the mailto.
- **Components:** Section (light), Container, Eyebrow, Card, Icon, Button (link).

### 9. The team `light` `#team`

- **Purpose:** put faces and credentials behind the firm. The section lands one point: this team has sat on the fund's side of the table, so the work is built by people who understand the workflows, not just the technology.
- **Layout:** left-aligned header (Eyebrow, H2, one-line subheading), then a three-Card grid (3 desktop, 1 mobile). Each Card: a reserved square headshot slot at top, the full name in serif, a fern role label, a hairline divider, then one to two Inter sentences. Max's card is centered and may carry a subtle fern top accent as the differentiator while keeping all three the same size. A reserved bottom row keeps layout stable if links are ever added (none in v1). One centered secondary "Book a call" Button below the grid.
- **Copy:**
  - Eyebrow: `Who you work with`
  - H2: `A small team that has been on your side of the table.`
  - Subheading: `Three people, not a vendor org chart. One of us spent years as a fund analyst, so the work is built by people who already speak deal flow, diligence, and LP reporting.`
  - Cards (name · role · detail):
    1. `Michael Zamora` · `Business & Strategy` · `Michael owns the relationship, scopes the problem with you, and makes sure what we build actually moves the work, not just demos well.`
    2. `Max Marohn` · `Ex-Fund Financial Analyst` · `The reason this is different. Max spent years as a fund financial analyst, so he has sat where our clients sit: screening deal flow, working diligence, and assembling LP reporting. He speaks the workflow, so we build for it instead of guessing at it.`
    3. `Bridger Davidson` · `AI Software Engineer` · `Bridger turns the workflow into the actual tools, integrations, and automations, and ships them into how a business already operates.`
  - Action: `Book a call` (secondary outline) to the mailto.
- **Components:** Section (light), Container, Eyebrow, Card, Button (secondary).
- **Assets:** three headshots required (square). Suggested paths `public/team/michael.jpg`, `public/team/max.jpg`, `public/team/bridger.jpg`. Until supplied, render a neutral initial-based placeholder block in brand colors (no stock or illustrated avatars). Each headshot needs descriptive alt text (name).

### 10. Final CTA `charcoal` `#final-cta`

- **Purpose:** close with one confident ask. Restate the core value and drive to a single action.
- **Layout:** full-width charcoal anchor directly above the footer (the two read as one continuous dark close), extra-generous padding, a single centered column (~720px), center-aligned. Order: Eyebrow, serif H2, one short body line, a single centered primary Button with clear breathing room, then one small soft reassurance line. No secondary action, no form, no competing links.
- **Copy:**
  - Eyebrow: `Start the conversation`
  - H2: `Give your team back 10 to 20+ hours a week.`
  - Body: `We find what is holding your business back and build the AI that moves it forward. Start with one workflow, fixed scope and fixed price. Book a call and we will walk through the work that is costing your team the most time, and what it would take to hand it off.`
  - Action: `Book a call` (primary) to the mailto.
  - Reassurance line: `A short call to scope the work. No pitch deck, no obligation.`
- **Components:** Section (dark), Container, Eyebrow, Button (primary).

### 11. Footer `charcoal`

- **Purpose:** close the page on charcoal: who Crosswell is in one line, a direct way to reach the firm, minimal in-page navigation, and the copyright.
- **Layout:** full-width charcoal Section beneath the final CTA, Container, a two-zone stack with a hairline divider. Upper band: left identity column (`xw_logo_light.svg` wordmark, one-line descriptor in muted warm gray, then the contact email as a slightly brighter TextLink); right links column under a small Eyebrow label. Lower band: copyright left, the right side reserved/empty. Generous bottom padding. No buttons (Book a call lives directly above).
- **Copy:**
  - Wordmark alt: `Crosswell Consulting`
  - Descriptor: `Custom AI tools, software, and automations for businesses that want to run leaner.`
  - Contact: `hello@crosswellconsulting.com` (TextLink, `mailto:`).
  - Links eyebrow: `On this page`
  - Links: `What we do` (`#what-we-do`), `Why us` (`#why-us`), `How we work` (`#how-we-work`), `Book a call` (`#final-cta`).
  - Copyright: `Crosswell Consulting, 2026.`
- **Components:** Section (dark), Container, Eyebrow, TextLink.

---

## Voice and consistency rules (page-wide)

- **No em dashes.** Ranges use "to" (6 to 10 hours, $25M to $500M+, 10 to 20+). Asides use commas.
- **Jargon expanded on first page-wide use only**, in render order: AUM in the tools framing line; CRM, IC, and LP first in the tools cards; "agentic systems" defined in the flagship subheading. Plain everywhere after. COO and KPI do not appear in shipped copy.
- **Tool names are product labels.** The five tool titles (including "IC Deck Drafter" and "LP Reporting Automation") are proper product names; the parenthetical expansion for IC and LP appears in the first sentence of that card's body, immediately under the title, so a non-finance reader is never left with an unexplained acronym. Build note: render each card's body expansion as the first prose occurrence (e.g. "...investment memos and Investment Committee (IC) decks...", "...investor updates for the fund's Limited Partners (LPs)...").
- **CTA label is always "Book a call"**, target always `mailto:hello@crosswellconsulting.com`, except the footer's "Book a call" link, which is an in-page anchor to `#final-cta`, and the footer contact line, which shows the email address itself.
- **The active fund client is never named.** Only "a private credit fund we work with" or "an active investment fund". No headcount, opportunity count, or pipeline figures from the client file.
- **No fabricated metrics.** Every number traces to the brain: ~80% less screening, 3 days to 20 minutes, 6 to 10 hours per memo, a week to an afternoon, 10 to 20+ hours a week, $25M to $500M+ AUM. No price, client count, or call length is stated.
- **Headlines and eyebrows are all distinct** (verified). The "side of the table" image recurs in Why-us and Team as deliberate thematic bookending of the differentiator.

## Assets and configuration

- **Logos:** copy `xw_logo_dark.svg` and `xw_logo_light.svg` from `docs/brain/05 Brand & Assets/` into `public/`. The text "Crosswell Consulting" is the alt/aria-label fallback.
- **Headshots:** three square images to be supplied (see Team). Placeholder treatment until then.
- **Favicon / OG:** out of scope for this pass unless trivial; note as a follow-up.
- **Email:** `hello@crosswellconsulting.com` must exist and be monitored before the page is shared in outreach.
- **Domain:** point `crosswellconsulting.com` at the Vercel project and set canonical before outreach.

## Brain reconciliation (positioning change)

The brain currently states a funds-only positioning ("for investment funds", "the go-to technology partner for funds"). This spec broadens it to horizontal-with-funds-as-niche. Per the repo's brain protocol:
- Log this decision with `npm run log:brain -- "..."` as a milestone (safe append).
- The strategy files (`Positioning & Messaging.md`, brain `CLAUDE.md`) should be updated to reflect the broadened positioning, but those are hand-authored strategy files, so ask the founder before editing them. Treat this as a follow-up, not part of the page build.

## Motion and interaction layer

This layer sits on top of the foundation's existing motion tokens (`--dur`, `--dur-fast`, `--dur-slow`, the easing tokens, the scroll-reveal pattern, and `prefers-reduced-motion` support). The goal is a page that feels smooth and quietly advanced, with a few moments that genuinely impress, without reading as flashy. It was planned with the UI/UX Pro Max skill and grounded in current Motion and Lenis docs.

### Intent and guardrails

- **Baseline plus signature moments.** Tasteful micro-interaction and reveal on everything; four signature moments carry the wow. No section tries to show off on its own.
- **One to two focal animations per view, maximum** (UI/UX Pro Max, High). Reveals are grouped, not per-element confetti.
- **Transform and opacity only.** Never animate width, height, top, or left. This keeps Cumulative Layout Shift under 0.1.
- **Timing.** Micro-interactions 150 to 300ms; reveals and the signature sequences stay within the foundation cap of `--dur-slow` (400ms) per element, with staggers of about 50ms. Ease-out on enter, ease-in on exit.
- **Reduced motion is a hard gate, not a nicety.** Under `prefers-reduced-motion: reduce`: Lenis is fully off (native scroll), every reveal renders in its final visible state, the ambient hero background is frozen, count-ups show their final number immediately, and the flagship agent flow renders fully lit with connectors drawn and no animation.
- **No scroll-jacking.** Lenis adds gentle momentum only. It never snaps sections, never hijacks the scroll position, and never blocks input. Anchor links keep working through Lenis. (The skill flags forced scroll effects and `ScrollTrigger`-style scroll-jacking as a High-severity motion-sickness risk, which is why momentum stays subtle and reduced-motion disables it entirely.)
- **Content is visible without JavaScript.** Reveals are progressive enhancement: server-rendered content is readable on its own, and the hidden-then-revealed initial state only applies once hydrated, so a JS failure or a crawler never hides copy.

### Stack and how it stays fast

- **Motion (Framer Motion), imported from the `motion` package (`motion/react`).** Used for scroll reveals (`whileInView` with `viewport={{ once: true, amount }}`, or `useInView`), staggered groups (variants with `staggerChildren`), the flagship sequence, and the count-ups (`useInView` plus an animated `useMotionValue`). `useReducedMotion` drives the kill switch.
- **Lenis, imported from `lenis/react`.** A `<ReactLenis root>` provider with gentle options (roughly `lerp: 0.1`, `duration: 1.0` to `1.2`, a soft easing) and `anchors: true` so the nav and footer in-page links glide to their target. Honors `scroll-margin-top` for the sticky-nav offset.
- **CSS for the baseline micro-interactions** (hover, focus, link underline, button press), driven entirely by the foundation tokens. No JavaScript for these.
- **The page stays a Server Component.** All motion lives in small client islands (`"use client"`): `<SmoothScroll>`, `<Reveal>` / `<RevealGroup>`, `<AgentFlow>`, `<CountUp>`, and the existing nav menu. Motion is code-split so it does not weigh down the initial render. This is the React 19 / Next 16 correct pattern: Motion hooks require a Client Component, so we isolate them rather than make the whole page client.
- **Explicitly not used:** GSAP / ScrollTrigger, Three.js / WebGL, and Lottie. They exceed the lightweight mandate and, in ScrollTrigger's case, invite the scroll-jacking pattern we are avoiding.

### Global mechanisms

- **`<SmoothScroll>`** wraps the app in the root layout (client island). It mounts Lenis with the options above, disables itself under `prefers-reduced-motion`, and is the single source of momentum scroll.
- **`<Reveal>` and `<RevealGroup>`** are the reusable reveal primitives: a subtle fade plus a 12px upward translate, `once: true`, triggered at about 30% in view. `<RevealGroup>` staggers its children by ~50ms. Both collapse to the final visible state under reduced motion and when not yet hydrated.
- **Nav condense-on-scroll** uses a lightweight scroll position check (or `useScroll`) to toggle the condensed state (hairline border, whisper shadow, slight background shift) past the hero.

### Per-section choreography

| Section | Baseline motion | Signature moment |
|---------|-----------------|------------------|
| Nav | Link underline grows on hover; button press scale 0.99; condense-on-scroll; mobile menu fades in over the scrim | none |
| Hero | none extra | **#1 Composed entrance + ambient background** |
| Problem | Heading reveal; the four pain cards stagger in | none |
| What we do (tools) | Heading and intro reveal; five cards stagger in; card hover lift (foundation `--shadow-sm`) | Headline reveal (#2) |
| Flagship | Heading and intro reveal | **#3 Animated agent flow** |
| Why us | Heading and margin-note reveal; three cards stagger; the fern margin rule draws in | Headline reveal (#2) |
| Value | Heading reveal | **#4 Count-ups + before/after** |
| How we work | Heading reveal; three step cards stagger; serif numerals fade up | Headline reveal (#2) |
| Team | Heading reveal; three cards stagger; headshot subtle scale on hover | none |
| Final CTA | Composed reveal of eyebrow, heading, body, button; button gets a refined glow-on-hover | Headline reveal (#2) |
| Footer | Gentle fade | none |

### The four signature moments

1. **Hero entrance and ambient background.** On load, the eyebrow, H1, subline, actions, and proof line arrive in a composed stagger (~50ms steps, fade plus small rise), so the first screen feels authored. Behind the ivory sits a very subtle living layer: a soft fern-tinted radial gradient that drifts slowly (animating `transform` on a blurred element, very low opacity, roughly 0.04 to 0.06), optionally over a static fine grain texture at about 3% opacity. It must read as atmosphere, not decoration: barely perceptible, GPU-cheap, and frozen under reduced motion (the static grain may stay). This is the first wow and the only on-load animation.
2. **Elegant headline and content reveals.** Every section heading and its content group reveal on scroll via `<Reveal>` / `<RevealGroup>`. Serif H2s use a refined clip-and-rise (the line translates up from behind a mask) for an editorial feel; supporting cards and rows stagger in beneath. Discipline: the heading plus its one group are the only focal elements moving in that view.
3. **Animated flagship agent flow.** When the charcoal flagship enters view, the five-step deal flow plays once: steps light up in sequence (stagger ~150 to 200ms each), the connectors between them draw left to right (SVG line `pathLength` 0 to 1), and the final step (Decision-ready) lands with a single fern accent pulse as the payoff. It plays on enter (not scroll-linked), which avoids any scroll-jacking. Under reduced motion it renders fully lit and drawn, instantly. This is the centerpiece.
4. **Value count-ups and before/after.** When the value table enters view, the figures count up to their final numbers (80%, the 3-day and 20-minute pair, 6 to 10, 10 to 20+) using `useInView` plus an animated `useMotionValue`, and the After column crossfades up from a muted to an emphasized state. Tabular figures (already specced for this table) keep the width fixed so nothing shifts while the numbers run. Under reduced motion the final numbers and the After state show immediately.

### Baseline micro-interactions (everywhere, CSS via foundation tokens)

- Buttons: shift to `--color-primary-hover` on hover, scale to 0.99 on press, visible focus ring with offset.
- Links and TextLinks: underline grows from the start on hover.
- Cards: hover lift of 2px with `--shadow-sm`.
- Icons and state changes: transition with `--dur-fast` and the foundation easing.
- All of the above already align with the foundation's Motion section; this layer simply applies them consistently.

### Performance and accessibility budget

- Motion library is code-split; motion components are client islands; the page and its copy render server-side without them.
- Only `transform` and `opacity` animate, so there is no layout reflow and CLS stays under 0.1.
- Reveals degrade to visible (no JS, or reduced motion). Nothing essential depends on an animation to be readable.
- Lenis is disabled under reduced motion and must be verified not to fight native anchor behavior or trap focus; `anchors: true` plus `scroll-margin-top` handles the sticky-nav offset.
- Respect the one-to-two-focal-elements-per-view rule; do not animate every element in a section.
- Verify at 375px, with reduced motion enabled, and on a throttled CPU, before calling the motion layer done.

### Dependencies to add

- `motion` (Framer Motion, current major; imported as `motion/react`).
- `lenis` (with the React entry `lenis/react`).

Both are lightweight and tree-shakeable. No other animation dependency is introduced.

## Out of scope (this spec)

- Favicon, OG image, analytics, and a sitemap (follow-ups).
- Any second (non-fund) case study or vertical, which does not exist yet and must not be fabricated.
- Booking via scheduler or form (explicitly chosen against; mailto only).
- Changes to the design foundation tokens or primitives.

## Success criteria

- `src/app/page.tsx` renders all 11 parts in order, using only the foundation primitives and tokens, with the two charcoal anchors (flagship, final CTA + footer).
- Copy matches this spec verbatim, with the broadened positioning and the five coherence edits intact, and passes the voice rules (no em dashes, jargon expansion order, unnamed client, no fabricated metrics).
- The sticky nav, mobile menu, smooth-anchor scroll, and scroll-reveal all work and respect `prefers-reduced-motion`; every "Book a call" opens `mailto:hello@crosswellconsulting.com`.
- AA accessible per the foundation's contrast record: one H1, ordered H2s, 44px targets, visible focus rings, decorative icons `aria-hidden`, logos and headshots have alt text.
- The motion layer works as specced: Lenis momentum scroll with working anchor links, the four signature moments (hero entrance and ambient background, scroll reveals, the flagship agent flow, the value count-ups), and tasteful baseline micro-interactions. Under `prefers-reduced-motion` everything renders in its final state with Lenis off, and with no CLS regression.
- Reads as Quiet Authority on the Fern brand: warm, editorial, finance-credible, broad enough for any business with investment funds as the visible flagship proof.
