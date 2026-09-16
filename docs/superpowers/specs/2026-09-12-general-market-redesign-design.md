# General-market redesign: design spec

Date: 2026-09-12
Status: draft for review, brainstormed and approved section by section in session
Supersedes: the July 2026 fund-first page (README "Page order") for content and structure. Locked hero decisions in README still hold.

## 1. Purpose

Rebuild the landing site's content and UI around two changes:

1. **The audience moves from funds to a general market.** Max's "Website Redesign v6, Gen 6" HTML (the content reference for this build, not a UI reference) moves every line off financial services. The site was the last surface still saying "funds only."
2. **The page becomes product-led.** Linear's homepage is the model: a run of short chapters, each pairing one editorial claim with a real fragment of the product, cropped and dissolving into the page. The current autoplay dashboard tour and every finance-specific section go. The hero, the woven core, and the brain animation stay.

The site keeps its editorial character (ivory, serif, warm, no drop shadows, no tech-blue) and gains a product spine. Success is a visitor who scrolls the first three screens and understands what the Core does without reading a paragraph.

## 2. What the business now says

| | Live site (July 2026) | This build |
|---|---|---|
| Who Crosswell is | The technology arm for the people who manage money | Custom agentic AI, built around how a team actually works |
| The product | A managed institutional memory for funds | The operating layer a business actually runs on: memory, plus the workflows, automations, and agents on top |
| The edge | We have worked inside funds | Off the shelf fits nobody, so we do not sell it; we sell trust; you work directly with us |
| Who it is for | Hedge funds, PE, private credit, family offices, RIAs, advisors | Manufacturing, healthcare, logistics, professional services, construction, private credit |
| Trust proof | A dark Security section with technical guarantees | Trust as a value with its cost named. No technical security claims anywhere. |
| Team bios | Fund history | Crosswell roles only |
| The offer | Audit, Core install, custom layer | Unchanged |
| Closing line | Your firm already knows the answers. Give it a memory. | Unchanged |

**Non-goals.** No pricing, no client names, no case studies, no ship dates, no competitor names, no security or compliance claims, no blog build (the Insights slot is held, not built), no scheduler wiring (CTAs stay mailto).

## 3. Sources of truth and clearance

- **Content source:** Max's Gen 6 HTML. Its copy is the working text for every section, replacing the live finance copy wholesale.
- **Clearance ledger:** the team vault's Website Direction v6. Its rule stands: if a sentence is not in that file, it is not public until Max clears it.
- **Product truth:** Bridger, in this session, corrected the Gen 6 claims listed in section 7.
- **The demo:** the Saguaro Capital demo, a fictional private credit fund, is the source for what the product does and what its screens contain. It is not a UI reference; the fragments are restyled to this site's materials.

Every line on the page carries one of four tags in the implementation plan:

| Tag | Meaning | Ships when |
|---|---|---|
| Cleared | Verbatim in Website Direction v6 | Now |
| Gen 6 | Max's new sentences in the Gen 6 file, which he flagged as uncleared (about fifteen, including the headline) | Max clears them |
| New | Written in this session: the six chapter claims and their sublines, the Stewardship rewrite, the meta description | Max clears them |
| Demo | Fictional Saguaro content inside the fragments | Now, under the demo rules in section 5.4 |

Max receives one checklist of every Gen 6 and New line (section 12). Nothing waits on anything else; each line ships the day it clears.

## 4. Page architecture

Top to bottom:

1. **Nav.** Links: How it works, Why Crosswell, How we start, Team, Insights. Button: Set up a call. No Security link.
2. **Hero.** Composition, woven core, veil, edge fades, entrance choreography all unchanged. New headline and a static subline (section 6.1). Two CTAs. The "worked inside funds" line is removed.
3. **The product run** (`#how-it-works`). Six chapters, each a claim plus a fragment (section 5). Replaces the dashboard tour.
4. **Behind the chat is the Core.** The bridge line and the brain animation, kept as built. Gen 6 copy with two removals (section 6.3).
5. **Who it's for.** "Built for businesses that run on what they know," the six industries as a static row, the platforms-gap paragraph. Replaces the dark audience marquee.
6. **Stats.** The two Gen 6 chips, moved here from under the hero as a quiet parchment band that sets up Why Crosswell. Citations pending Max's ledger.
7. **Why Crosswell.** "Off the shelf fits nobody. So we do not sell it." Three cards (Built around your work, We sell trust, You work directly with us).
8. **What a business actually loses.** Intro, the four sinks with retention first, the hours close, the worth-more sentence.
9. **How we start.** Audit, install, custom layer, the thirty-minute line, one CTA.
10. **Beyond Core.** "Your outsourced technology arm." Two cards (custom tools and automations, the support layer). Text only; no fragment, since the agents chapter already carries the custom-layer proof.
11. **Values.** The vision line, then Trust, Stewardship, Continuity, each with its cost line. No "Mission" or "Vision" headings. Stewardship's cost line rewritten (section 7).
12. **Team.** Three cards, Gen 6 bios. The headshot easter egg is untouched.
13. **Insights.** A held slot: the heading, the one-line intro, and a "first pieces publishing this fall" line. Designed later from a separate brief.
14. **Final CTA and footer.** Closing line and CTAs unchanged. Footer line from Gen 6.

**Removed** (each confirmed in session): the Security section and its route diagram, the GSAP four-view dashboard tour, the audience marquee, the "worked inside funds" hero line. The stats band is moved and reworded, not cut.

**Dark moments.** The closing CTA, and chapter 3 of the product run. Nothing else is dark. The mobile safe-area theming continues to repaint for both.

## 5. The product run

### 5.1 Rules every chapter follows

**The product looks like itself.** Text inside a frame is only ever something the product would show its own user: greetings, numbers, statuses, chips, buttons, the user's own data. Nothing inside a frame addresses the website visitor. No informational pills, no explanatory headers, no captions, no feature labels, no "this is read-only" statements. Everything that describes the product lives outside the frame: the chapter claim, the one or two sentences beneath it, and the demo caption under the frame. This is a binary check for the design loop's system critic.

**Same materials as the page.** Parchment panels on ivory. Hairline borders at warm gray, 30% alpha. Card radius matched to the existing cards. One fern accent per panel. Ink for text, ink at 60% for secondary. No shadow anywhere in or around a fragment. The dark chapter uses the site's charcoal and charcoal-deep, never the demo's green-black.

**Cropped, never shrunk.** Fragments render at real product scale and are cut by the frame. Every cut edge dissolves into the page with a mask gradient (the hero's treatment). The edge where the content begins stays crisp. Fragments are never scaled down to fit; the crop does the work. Minimum frame height on desktop is 420px.

**The serif crosses over.** The product's greeting line and panel titles set in Newsreader. All other product text in Instrument Sans, tabular numerals on.

**One motion language.** The page's existing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, durations 0.6 to 0.9s for entrances, 60 to 90ms staggers, 300ms minimum for anything but hover. Sequences trigger at the site's unified scroll depth (the block's top at about 70% of the viewport), play once, and offer a small "Replay" text control outside the frame where a sequence exists.

**Three states, all complete.** Server-rendered finished state for no-JS. Finished state, instantly, for reduced motion. JS-gated pre-hide so the first paint never flashes an empty frame before the sequence starts (the brain section's pattern).

**Chrome inside the product.** A thin left rail of five or six icons with no labels, a top bar with the company name and the user's initials. No window chrome, no fake traffic lights, no browser bar.

**Mobile (below 768px).** Every frame crops to a single column at real scale, never scaled down. Split chapters stack claim over frame. Chapter-specific fallbacks are noted per chapter; where none is noted, the desktop sequence plays unchanged.

### 5.2 The six chapters

Layout rhythm: wide, wide (pinned), wide (dark), wide, split, split. "Wide" is claim above, frame full content width. "Split" is claim left in the narrow column, frame right in the wide column, matching the site's existing 0.9fr / 1.1fr grids.

**Chapter 01. Today.**
Claim: "Your morning, already assembled."
Frame: the top-left of the dashboard. Serif greeting "Good morning, Morgan." Subline "Thursday, 9:40 am. Three things need you today, everything else is filed." Four number tiles (cash to deploy, assets under management, active loans, committed and undrawn), one with a sparkline. Below, the needs-you list: the draw approval, the new deal, the maturities, each with receipt chips. A calendar column is visible at the right edge and fades.
Sequence on scroll-in: greeting rises; tiles count up over 900ms while the sparkline draws left to right; the three items slide in staggered; a status line at the foot of the list settles to "14 filed overnight."
Interaction: none. Replay control outside the frame.

**Chapter 02. Agenda.** The scroll-driven chapter.
Claim: "One list, and the whole team is on it." (superseded, see section 19)
Frame: a horizontal track wider than the frame, pinned for about two viewport heights. Three panels: your day (the timed agenda), the team's week (one row per person, what each is on), the quarter's rocks (progress bars).
Scroll behavior: scroll position scrubs the track sideways. Each panel assembles as it enters the frame. At the midpoint, one choreographed moment: "Approve Draw 4" gets its check in your day, the check propagates as the pan crosses the team panel (the site-walk row flips done) and the rocks panel (the deployment rock nudges from 68 to 70), and a status chip settles: "synced to Asana." Scrolling back reverses everything.
Mobile (below 768px): no pinning, no scrub. The three panels stack vertically and animate in on scroll; the propagation plays once.

**Chapter 03. The Core chat.** The dark chapter.
Claim: "Ask it anything the business has written down. It answers with receipts."
Frame: full-bleed charcoal-deep band. The chat panel docked right, the dashboard dimmed behind it at the left edge and fading. Panel surface charcoal, text ivory, accent fern-soft.
Mechanic (Linear's): the first question sits pre-composed in the input beside a live send button. On scroll-in it waits one beat and sends itself unless the visitor sends it first. The message lifts into the thread; two working lines tick with checks; the answer streams in word chunks, not characters; two receipt chips rise on. Then two follow-up chips appear. Each has its own scripted answer. Three exchanges total. No free typing; the input accepts nothing.
Exchanges (Demo): "What's at risk this week?", "Which loans mature inside 60 days?", "What did we decide about extension fees?" Answers are short, rounded, and each carries one or two receipts.

**Chapter 04. Pipeline.**
Claim: "Every client, every stage, and the whole history one click away."
Frame: a board of stage columns with client cards (name, address, amount, rate, type). Stand-in stages until Max's pipeline reference arrives: Screened, Term sheet, Underwriting, Docs out, Funded, with three to two cards each from the dataset. The mechanic does not wait on the reference; only the dataset changes when it lands.
Sequence on scroll-in: cards deal in column by column. One card gets a soft highlight and a detail panel slides in from the right: summary, last touch, key numbers, three quick-action buttons ("Who is this?", "What's outstanding?", "Draft an update"). "Who is this?" fires on its own once: the prompt drops into a mini Core thread inside the panel and a three-line answer streams in with receipts, the chapter 03 mechanic reused so it reads as one product.
Interaction: any card opens its panel; any button fires its prompt. Three cards carry full scripted content; the rest get a short generic answer.
Mobile: two visible columns with horizontal scroll and snap; the detail expands in place beneath the tapped card.

**Chapter 05. Agents.**
Claim: "Each one has a single job. They run while you don't."
Frame: the agents roster as rows: name, one-line job, status, last result. A hand-off composer at the foot: a pre-typed task and a "Hand it off" button.
Live sequence on scroll-in, about six seconds: the Inbox agent ticks "reading 14 new" down to "3 drafts ready for your yes"; the Follow-up agent goes scheduled, running, then "1 draft waiting"; a done row's check pops.
Interaction: a row expands to a three-line log of its last run. "Hand it off" adds a new running row.
Roster (Demo), five on screen: Inbox agent (reads the shared inbox, files the routine, drafts replies for approval), Follow-up agent (watches for silence, drafts the nudge), Report agent (assembles the monthly report overnight, every line sourced), Screening agent (runs every new deal against the limits), Filing agent (sweeps chat decisions and call notes into the Core nightly). Spares: Meeting-prep agent, Expiry watcher.

**Chapter 06. Your brand.**
Claim: "It looks like your company, not ours." (superseded, see section 21)
Frame: a small version of chapter 01's corner beside four swatches, each a fictional company. Saguaro Capital in fern, then three invented companies in colors chosen to sit on ivory.
Sequence on scroll-in: cycles once at 2.5s per swatch, then stops.
Interaction: a swatch cross-fades the accent everywhere in the mini dashboard over 500ms (buttons, sparkline, bars, the rail dot), swaps the company name in the top bar with a fade, and updates the greeting. Alternate colors are CSS variables scoped to the fragment root and can never leak into the site palette.

### 5.3 One dataset

`src/lib/saguaro.ts` holds the entire fictional world every chapter reads from: the company, the user (Morgan Gray, managing partner), the numbers, the needs-you items, the agenda, the team, the rocks, the pipeline, the agents, the chat exchanges, the brand swatches. The Draw 4 approval in chapter 01 is the same Draw 4 checked in chapter 02 and the same loan on the board in chapter 04. One file changes when Max's pipeline reference arrives.

### 5.4 Demo rules (from Website Direction v6, unchanged)

- Invented company, invented people, invented and rounded numbers. Nothing derived from a real client, even renamed.
- ~~"Interactive demo · Sample data" visible at every chapter, as a caption outside the frame.~~ Removed from all six chapters in the hand-tuning pass (2026-09-15), pending Max; the fictional line below and the lead-in's "sample private lending company" carry the disclosure.
- "Saguaro Capital is fictional. Every number is invented, rounded demo data." appears once, under the run.
- The demo demonstrates the pattern (ask, cited answer, approval, hand-off). It promises nothing Crosswell would not build.
- No control is ever labeled "Try the product."

## 6. The company half

### 6.1 Hero
Headline (Gen 6): "The operating layer your business actually runs on."
Subline (Gen 6, made static; shortened 2026-09-14): "We build the workflows, automations, and agents that run on it." The list is set in the serif italic as the one accent, matching how "financial stewards" is set today. No word rotation.
CTAs: Start with the audit (primary), Set up a call (secondary). Nothing beneath them.

### 6.2 Product run copy
The six claims in section 5.2 (New). One or two sentences under each claim, drawn from Gen 6's core section and the tour captions where they fit, otherwise New.

### 6.3 Behind the chat is the Core
Gen 6 copy for the bridge line, the heading, and the three paragraphs. Removed: the "Connections read, they never write" line, and the connections belt ("Messenger, Email, Files and documents, Scheduled exports, Paste or upload, Straight from chat"). What the Core connects to is now shown, not listed, by chapters 02, 04, and 05.

### 6.4 Who it's for
Gen 6: the heading, the Arizona line, the platforms-gap paragraph. The six industries as a static row of plain text items, not chips, not a marquee.

### 6.5 Stats
Gen 6's two chips. Both ship only after Max reconciles the citation in the ledger (his note names Gallup; the file names Microsoft and LinkedIn). A number without its printed source does not ship.

### 6.6 Why Crosswell, What a business actually loses, How we start, Beyond Core
Gen 6 copy as written, with the tags from section 3. Beyond Core loses nothing from Gen 6; it only gains no fragment.

### 6.7 Values
Gen 6 vision line and the three values with their cost lines, no headings. Stewardship's cost line is replaced (section 7).

### 6.8 Team
Gen 6 bios. Roles: Business & Strategy; Software & Engineering; Finance & Operations.

### 6.9 Insights, closing, footer
Insights: heading and intro line from Gen 6, no post cards. Closing: unchanged. Footer line: "Custom agentic AI, built around how your team actually works. Arizona."

## 7. Copy rules and corrections

**Corrections to Gen 6 from this session (product truth):**

| Gen 6 said | Truth | Action |
|---|---|---|
| Connections read, they never write | The Core reads and writes to the systems a client asks for, custom-built per client | Line removed; chapter 05's roster and chapter 02's "synced" chip show writing |
| The connections belt (Messenger, Email, Files, By hand...) | Undersells range and confuses an outside reader | Removed; shown in fragments instead |
| Stewardship cost: "Everything we build leaves with you in open files on the day you go" | The data is theirs and exports on the day they go. The software is licensed while they are a client. | Cost line becomes: "What your business knows leaves with you in open files on the day you go. That forfeits the switching costs most software firms are built on. We forfeit them deliberately." (New, pending Max) |
| The Security section and every technical guarantee | Not something the current build promises | Section removed. No isolation, encryption, self-host, audit-trail, or data-processing-agreement claims anywhere. "We sell trust" and the values stay. |

**Lines Website Direction v6 had gated on Bridger, now confirmed true and shippable:** "Every answer shows its work" (under chapter 03) and the approval gate ("waits for your yes," chapter 05).

**Standing rules:** no em dashes; "agentic AI" defined in plain words on first use per page ("AI that does the work, not just answers questions"); "the Core," never bare "Core," except in "Crosswell Core"; no "brain" or "mind" in body copy; no pricing; no client, advisor, or competitor names; no ship dates; no "beta"; no number without its printed source; tool and system names in plain text, no logos.

**Word choice (pending Max):** standardize on "business" for the company and "team" for the people. "Firm" survives only inside lines already cleared with it.

**Left out on purpose:** the v6 "Fair questions" block. Gen 6 dropped it and it is fund-worded. Noted for Max, not built.

## 8. Typography and chrome

- **Sans: Instrument Sans** replaces Schibsted Grotesk everywhere, page and product, loaded through next/font/google as `--font-instrument`. Geist is the runner-up; the first design-loop run renders both side by side before the choice is final.
- **Serif: Newsreader**, unchanged.
- **No uppercase anywhere.** `type-kicker` becomes a sentence-case label: 14px, medium, fern-deep, letter-spacing normal. In the product run it carries a two-digit index in tabular figures ("01 · Today").
- **Nav links:** sentence-case, 15px, medium, ink at 75%, fern underline on hover kept. Heights, blur bar, lockup, button, and the mobile ink takeover unchanged.
- **Fragment scale:** numbers 24 to 28px tabular; UI text 13px; labels 12px; panel titles serif 20px. Nothing below 12px anywhere, receipt chips included.
- **Everything else** in the type hierarchy (`type-display`, `type-h2`, `type-h3`, `type-accent`, `type-body`) is unchanged, including the mobile overrides.

## 9. Visual system

- **Palette:** the locked Fern palette, unchanged. Fragments use ivory, parchment, warm gray, fern, fern-deep, fern-soft, fern-wash, charcoal, charcoal-deep, ink. Status inside the product is conveyed with a small filled dot and text: fern for on pace, warm gray for watch, ink for needs you. No amber, no red. Chapter 06's three alternate brand colors exist only as scoped variables inside that fragment.
- **Surfaces:** parchment on ivory for every light fragment; charcoal on charcoal-deep for the dark one.
- **Fade masks:** `mask-image` linear gradients on the cut edges, always written with double stops (the production minifier collapses single-stop gradients; see the memory and the hero's comment). The built CSS is checked for every mask.
- **Shadows:** none in or around fragments. The site's `shadow-whisper` and `shadow-lifted` remain on the existing content cards only.
- **Motion:** section 5.1. Hover states 150 to 200ms. Nothing loops except a running agent's progress indicator in chapter 05 and the existing hero rotation.

## 10. Technical approach

**Stack:** Next 15, static export, React 19, Tailwind v4, TypeScript. GSAP (already installed) is the one motion library: timelines for choreographed sequences, ScrollTrigger with pin and scrub for chapter 02, plain CSS transitions for simple state (brand retint, card expand). No framer-motion.

**Structure:**

```
src/components/product/
  ProductRun.tsx            the run: six chapters, index labels, the fictional-company line
  shared/                   Frame (fade mask), Rail, TopBar, Tile, Chip, Receipt, SendButton, DemoCaption, Replay
  today/  agenda/  chat/  pipeline/  agents/  brand/
src/lib/saguaro.ts          the one dataset
```

Each chapter server-renders its finished state and hydrates as a client island. Pre-hide is JS-gated (`.js` on the root, set in the head script) so no-JS shows the finished product.

**Removed from the tree:** `Trust.tsx`, `TrustDiagram.tsx`, `core-dashboard/` (all six files), `HowItWorks.tsx` (replaced by `ProductRun.tsx`). The trust-diagram, chat-demo, marquee, and `.cwd-frame` CSS blocks in `globals.css` go with them.

**Rewritten:** `WhoItsFor.tsx` (static row, no marquee), `ProblemBand.tsx` (becomes `Stats.tsx`), and copy-only changes in `Edge.tsx`, `TimeBack.tsx`, `HowWeStart.tsx`, `BeyondCore.tsx`, `Team.tsx`, `Footer.tsx`. A new `Values.tsx` and `Insights.tsx`.

**Kept as built:** `Hero.tsx`, `HeroCore.tsx`, `brain/`, `Reveal.tsx`, `SafeAreaTheme.tsx`, `Team.tsx` (bios change), `Nav.tsx` (links and link styling change), `Footer.tsx` (line changes), `FinalCta.tsx`.

**Fonts:** `layout.tsx` swaps `Schibsted_Grotesk` for `Instrument_Sans`; `globals.css` maps `--font-sans` to it.

**Site metadata (the fix pack add-on):** `layout.tsx` gains `metadataBase`, canonical, Open Graph, and Twitter card fields with the new headline; one Organization JSON-LD block; `app/robots.ts` allowing all and pointing at the sitemap; `app/sitemap.ts` listing the home page. A 1200 by 630 OG image made from the brand kit with cleared language only. The meta description is New copy and goes on Max's checklist.

**Branching:** all work on `redesign/general-market`, landing on `main` by PR (main requires PR and owner approval). Conventional commits.

**Verification, before any piece is called done:**
- `npm run build` passes (static export).
- Playwright screenshots at 1440, 1728, and 390 via `scripts/shot.mjs`, plus reduced-motion and no-JS passes.
- Built CSS grep confirms every mask gradient kept its stops.
- Chapter 02 checked on a real phone for scroll feel (no pinning below 768px).
- No em dash anywhere in `src/` copy.

## 11. Design-loop handoff

The design loop (user-level skill) runs after the plumbing lands, so critics only judge visuals on a page whose words are already right.

- **Goal:** this page.
- **Bar:** linear.app's homepage, specifically the hero product shot and the feature chapters (Intake, Planning, AI and automations). Screenshotted with headless Chromium in preflight; the in-app browser pane renders it black past the fold.
- **Files:** the brand guide, this spec, and `docs/design-system.md`, written as the first plumbing task from `globals.css` plus sections 8 and 9 here. The system critic checks against it, including the in-product text rule as a binary item.
- **Runs, in order,** each with a builder and the three critics (brief, system, craft), binary verdicts, all three must pass:
  1. Chrome and type system, with Instrument Sans and Geist side by side.
  2. The shared frame and chapter 01, because the anchor sets the material rules the rest inherit.
  3. Chapters 02 and 03.
  4. Chapters 04, 05, and 06.
  5. The company half, top to bottom.
- A live progress page tracks piece status, verdicts, gap history, and round count.

## 12. Open items and gates

**Max clears (one checklist):**
1. The headline and static subline.
2. The roughly fifteen Gen 6 sentences he flagged, including "Off the shelf fits nobody" and the Why Crosswell "Built around your work" card.
3. The six chapter claims and their sublines (New).
4. The Stewardship cost line rewrite (New).
5. The two stat citations (Gallup, or Microsoft and LinkedIn).
6. "Business" and "team" as the standard words.
7. The meta description.
8. The pipeline reference for chapter 04 (columns and fields).

**Bridger confirms:** nothing outstanding. Citations and the approval gate were confirmed in session.

**Later, separate briefs:** the Insights section design; the blog itself; a scheduler for the CTAs.

## 13. Out of scope

The blog and its posts. Privacy and Terms (gated on counsel; the `legal-pages` branch is untouched). Any change to the hero composition, the woven core asset, or the brain animation's motion. Security, compliance, or hosting claims of any kind.

## 14. As-built amendments (plumbing, 2026-09-12)

Decisions made while executing the plan, recorded so the design loop starts from what is actually on the branch. Each keeps the spec's intent; where one bends a rule, the reason is given.

- **Fitted shells.** `Frame` gained a `fit` prop (`product-shell-fit`: no minimum width, fills the frame at real scale). The split chapters (05, 06) and the dark chat chapter (03) use it with `fade="bottom"`, because a 960px-minimum shell in a 572px split frame pushed the roster's status column and the composer entirely off-frame. Text stays 13px at 1x; the product reads as a narrow window rather than a cut corner. Chapters 01, 02, and 04 keep the overflowing shell and the cut edges.
- **Mobile masks.** Below 768px: cut-right frames (`product-frame-right`) and bottom-fade frames (`product-frame-bottom`) both use the corner mask, since the shell is still wider than a phone; fitted frames keep only the bottom fade. The pipeline board's inner fade has its own class (`product-board-fade`) with no mobile override.
- **Chapter 03 on phones** hides the dimmed dashboard and gives the chat panel the whole frame.
- **Frame heights.** Chapter 05 is `h-[860px] sm:h-[600px]`, chapter 06 `h-[560px] sm:h-[420px]`, chapter 01 `h-[540px]`, chapter 04 `h-[600px]`; the fitted roster and the wrapped tiles needed the room on phones. Chapter 01's tiles are two-up below `md`.
- **Pipeline opens on Redrock**, the second column, because at 1440 only about three of five columns fit beside the detail panel and the Ironline card sat off-frame. Ironline keeps its Draw 4 reference for the loop's click interaction.
- **The run intro** carries one sentence under its heading defining agentic AI, the page's first use. (Superseded by section 15.)
- **Section 5.1 "cropped, never shrunk"** is read as a rule about scale, not about overflow: a fitted shell at 1x satisfies it.
- **Finished-state payload past the crop.** In the no-JS state, chapter 01 shows one needs-you item and not the "filed overnight" line, chapter 02's rock percentages sit past the right fade, chapter 04 shows about three columns, and chapter 05's composer sits in the bottom fade. The design loop decides heights and crops with the spec's payload visible.
- **Stats** ship on the branch with both chips; the second citation stays on Max's checklist and gates the merge (section 6.5).
- **Screenshots** of this site need `--reduced-motion` on full-page captures (scroll reveals never fire in a headless full-page capture), and the loop's preflight should shoot the built export, not the dev server.
- **The copy guard** strips `className` attribute regions by brace depth before checking copy lines, exempts `src/components/brain/` from the "brain" rule (component names), and is run on `src/` as a gate.
- **The split rhythm withdrawn (design loop, run 2, 2026-09-13).** Section 5.2's "wide, wide, wide dark, wide, split, split" is withdrawn: chapters 05 and 06 take the wide skeleton too (label and claim left, lede right, the frame hanging 192 below the band, gutter to gutter, 800 tall). Read blind, the two split chapters stacked the lede under the claim, shrank the product to a half-width panel with no hang, and broke the run's beat; one skeleton for six chapters holds it. Chapter 06's swatch picker stays a site control outside the frame, in the caption row.

## 15. What we do: the stack (hand-tuning pass, 2026-09-14)

Bridger's direction after the design loop: a first-time visitor should understand what Crosswell does before seeing any dashboard, without technical words. Settled over a scroll prototype, then built.

- **The run intro is replaced, and renamed.** The section and its nav link are "What we do" (id `what-we-do`), not "How it works": the page has not yet named what Crosswell builds when a visitor reaches it. It opens with one statement, the first sentence in full ink and the rest at the floor tone: "AI is only as useful as what it knows about your business. So we start there. Crosswell brings everything your company knows into one place, then builds the agents and automations that use it." The chatbot heading and the agentic AI definition are gone; the run's chapters follow a lead-in, "Here's what that looks like on a Thursday morning."
- **The stack.** Between the statement and chapter 01, a pinned scroll draws the system as three flat layers (the Core, the work layer, the dashboard) with four captions: The Core ("Everything your company knows, in one place."), Agents and automations ("The work, built on what you know.", with a key: Agent, Automation, Workflow), Your dashboard ("One screen for the whole team."), and Built by Crosswell ("Your team sees one screen. Everything under it is what makes it smart."). The choreography is in docs/design-system.md, Motion.
- **Drawn in code, not generated.** A generated video was considered and set aside: scroll-scrubbed video stutters, garbles interface text, and fine lines turned to fabric in the hero's video attempts. The stack's dashboard is a wordless skeleton, so the product-frame text rule holds.
- **Copy.** The statement, the lead-in, and the four captions and their bodies are new and join Max's clearance list. The page's first "agentic AI" is now the stats section, undefined; flagged with the copy.
- **Open.** Whether "Behind the chat is the Core" now repeats the stack is to be decided after a visual pass.

## 16. The page column (hand-tuning pass, 2026-09-15)

The page ran to 48 gutters at every width, so on a 1728 or wider window the content ran nearly side to side (1632 wide at 1728, about 2400 at 2560). Measured against linear.app at seven widths: Linear caps its pictures at 1344 and its words at 1280 and centres the column, so its margins grow with the window while its vertical spacing stays fixed px at every width (the two are not linked; at about 1680 its text margin happens to equal its 200 nav-to-headline gap). Of three options (cap only, cap plus Linear's text inset, a tighter 1248 cap) the owner chose the cap plus the inset.

- One page column for every section, the nav, and the footer: 24 below lg, 48 at lg, never wider than 1344. From xl the words sit 32 further in (1280 from 1440 up) and only the six product frames, with their caption rows, hang out to the column's edge.
- The grid's right column moves from 576 to 528 so the title column stays 672 from 1440 up and no claim or title re-wraps; four ledes gain a line.
- At 1440 the words move from x 48 to 80 and the frames stay at 48; at 1728 words 224, frames 192. Below xl nothing moves. The vertical system is untouched.
- The hero's words are centred and 848 wide, so the cap never touches them; its drawing still runs the full window.

## 17. The dashboard, designed first (hand-tuning pass, 2026-09-15)

The six chapters were animated over a dashboard that was never designed as a product, so the product was designed first, page by page, in a local prototype (`/prototype/dashboard`, not shipped): Home, Agenda, Pipeline, and Agents for Saguaro Capital, and two other businesses' Homes for chapter 06. The structure follows Max's Saguaro demo; the look was restyled after a ui-ux-pro-max audit to move off a generated feel (one sans family and a tight scale, page titles in the top bar, no boxed stat cards or chips, the accent only where a decision or state lives). The Core is a column down the right of every page, empty until a chapter shows it at work. The rail is icons only and carries the company's own mark.

- The window has no outline. Its chrome (the rail and the Core's column, and the lifted Core in chapter 02) is `chrome` (#e6e2d8), a step darker than the page's ivory, and its page is parchment, a step lighter, so the window reads against the page by colour alone (2026-09-15; prototype and site alike).
- The site's copy of the window and its parts lives in `src/components/dashboard/` (`ui.tsx`, `Home.tsx`, `worlds.ts`, `WindowFrame.tsx`). The prototype keeps its own copy and never imports site code: design changes land in the prototype, and a chapter copies what it needs and adapts it.
- Chapter 01 renders the Home window, display only and static (nothing in it scrolls; its old entrance sequence and Replay went with the old markup), lit after Linear's treatment rather than dimming the whole frame and lifting one element. Tried and dropped along the way: a 600 crop dissolving on an L (bottom and right), which read as the picture ending beside an empty Core column, and a bottom-only fade of the whole crop, which cut the Core's message box off so the column read as a panel of text. As built: the whole window at 640 tall, its rail, top bar, and Core column crisp to its bottom edge, and the page inside it dissolving into the app's ground over its last 200 (`.dashboard-fade`). The Core's column shows it as a chat: one exchange ("Which draws are due this week?", the answer, its sources, "You" and "The Core" with the time, from `today.ask`) above its message box, empty on its placeholder. Chapter 03 keeps its own question, and may lift the Core out as a floating chat card over its dashboard (Linear's thread-over-board composition), held in reserve.
- `WindowFrame`: the whole window at 640 tall; from lg it takes the frame's width, never under 1280 or over 1440, so from 1440 up it shows whole and below that its right side crops; below lg the 1280 by 640 window scales down whole (a phone pass is still owed).

## 18. Chapter 02: Ask the Core (hand-tuning pass, 2026-09-15)

After chapter 01 a visitor's eye goes to the Core's column, so the run's second chapter is now the Core, and the agenda moves to third. Designed in a throwaway prototype (`/prototype/core`) over several passes with Bridger, after Linear's button-triggered demos.

- The pipeline dashboard, lowered from the first frame: an even wash of the page's ground over the whole window, border included, and a curved fall-off toward its bottom-left corner (a mask on the window, so its outline dissolves too). One card stays at full strength above the wash: Redrock Flips, first in Docs out, "Quiet 21 days", with an "Ask the Core" button. No pulse; the lit card is the cue.
- Every step waits for a click. Ask the Core pulls the Core up out of its own docked column toward the viewer: 6% larger, a soft shadow (the only one in the product), hanging past the window's top, right, and bottom edges. The deal attaches to the message box as a tag, the deal's numbers show, and three questions wait.
- Each question has its own reply (`core.replies` in `src/lib/saguaro.ts`): working lines, the answer streaming in, its sources, and anything prepared. "Who is this?" informs; "What's outstanding?" hands over the follow-up agent's check-in; "Draft an update" shows a draft in the Core's voice. Either draft can be sent, which logs it and turns the card to "Nudged today". Questions not yet asked come back under each reply; the thread slides up rather than scrolls once it outgrows the column. Replay (under the frame) resets it. Under reduced motion each reply appears whole.
- Stage (`src/components/product/core/Core.tsx`): the window takes the frame's width (1280 to 1440) less 12 of room on the right, with 24 above and below, so the lifted Core never crops; a narrower frame scales the whole stage down. A phone pass is still owed.
- Band copy (general market, no finance terms): "Your whole business, a question away. The next step, a yes away." / "Open a client, a project, or a file and the Core already has it in hand. It answers from everything your business has on record, from meeting notes to email threads, and shows where each answer came from. Then it takes the next step, drafting the follow-up and holding it for your yes." The band never invites typing, since the message box takes no input; only the button and the questions are clickable.
- Decided (2026-09-15, option A of two): one chapter carries the chat, so the Core is shown once. The page already explains the knowledge base twice (the stack's first layer and the brain section), so this chapter proves both halves of the Core through its questions: the deal ("Who is this?"), the business around it ("What's our rule on first-time borrowers?", a rule set at the August 12 partner meeting applied to this deal: its rate lock lapsed September 10), the work outstanding, and an action. Openable sources were considered and dropped.
- The run is now five chapters: Today, Ask the Core, the agenda, the agents (moved onto the run's one dark band), and the custom chapter. The dark chat chapter and the pipeline chapter are cut (their components are deleted; git history keeps them), and the floating chat card held in reserve for the chat chapter is no longer needed. Their CSS in globals.css still ships and wants a cleanup pass. The follow-up agent's roster line now reads "Redrock Flips, quiet 21 days in docs out" to match this chapter.

## 19. The agenda chapter, redrawn (hand-tuning pass, 2026-09-15)

The old chapter was built for a scroll: a pinned frame panning three list panels while Draw 4 checked off, Dana's row flipped, and a rock ticked from 68 to 70. Bridger found the lists confusing and not agenda-like, and the scroll mechanic is gone. The chapter now draws the dashboard's redesigned Agenda page (`src/components/dashboard/Agenda.tsx`, data in `agendaDay` in `src/lib/saguaro.ts`): the day on a clock from 8 am to 6 pm with a line at 9:40, meetings and focus time as blocks, a short to-do list, and "What the team is up to" (each teammate's current task, when they are free, and a strip of their day). Whole window at 800 tall, static, full opacity, the Core's column empty. Marcus's current task reads "Term sheet review, Ocotillo Commons" so it no longer contradicts chapter 02's Redrock Flips.

- Lighting (chosen over lighting the team): the morning is lit. An even wash of the page's ground at 74% covers the whole window except a soft oval over its top (the date, the 9:40 line and the next call, the to-do list, the top of the team), heavy enough to read as deliberate, and the window dissolves into the page over its last 160 at the bottom and its last 420 at the right, so the empty Core's column falls away.
- **The band** (reworded 2026-09-15). Claim: "Your day, and everyone else's, without asking." Body: "Your meetings, your focus time, and the list waiting on you, synced with the task tool your team already uses. Beside it, what everyone else is on right now and when they're free. Finish something anywhere and it checks off everywhere." The old band named "the quarter's rocks", a panel the redesign replaced with "What the team is up to", and the claim now leads with the thing a calendar cannot do. The sync line stays because the page shows it ("Synced to Asana" in the top bar).
- Open: whether anything is clickable.

## 20. The agents chapter, redrawn in the dark dashboard (hand-tuning pass, 2026-09-15)

The old chapter played a six-second live moment over a fragment (rows arriving, the inbox counting down, statuses settling, a log opening), with rows that opened their logs and a "Hand it off" composer. It now draws the dashboard's redesigned Agents page (`src/components/dashboard/Agents.tsx`): the five agents with status, last result, and last run, the inbox agent's log open with "Review 3 drafts", the status filters, and "Ready to add". Handing off work belongs to the Core now, so the composer is gone.

- The chapter keeps the run's one dark band, so the window is the dashboard in dark colours (chosen over a light window on the band, or moving the band): `.dashboard-dark` in globals.css overrides the window's colour variables in its scope, text on ivory, the page #3b3833 a step lighter than the band, the chrome #2b2925 a step darker, mirroring the light window. Saguaro's theme there reads fern-soft for text and the selected tab, a fern wash that reads on charcoal (#414b3e), and the mark in fern-soft (`public/demo/saguaro-mark-light.svg`).
- Whole window at 800 tall. The page's static copy (`src/components/dashboard/Agents.tsx`) was folded into the chapter itself on 2026-09-15 and deleted; the chapter is now the one place the Agents page is drawn.
- **At work, and clickable.** The roster runs a 30 second loop: the inbox agent reads two more messages and files them, the screening agent works through a new application each time round (Desert Vista Homes, Mesquite Court, Palo Brea Homes), and the filing agent counts up to nine decisions. Never more than one agent changes at a time, and "now" reads in the accent. The loop's clock runs only while the chapter is on screen, and reduced motion holds the roster at its first frame. The status filters filter, and a row opens or closes its own log.
- **The hand-off, from the Core.** The Core's message box holds a typed request with its send button lit ("Send the team a recap of this morning's standup, with who owns what.", `agents.recap` in src/lib/saguaro.ts, which replaced the old "Hand it off" data). Send drops an email agent into the top of the roster, marked New, which reads the standup notes and drafts to four people while the Core says what it is doing. The draft arrives in the Core with its recipients, subject, and the four owners, and a line saying it goes by email and to each person's dashboard. Edit is drawn but disabled, so "Approve and send" is the one way on; approving marks the row sent, and the Core says all four have it by email and on their own dashboards. Replay puts it back (the reduced-motion rule that hid Replay was dropped: these chapters are click-driven, not sequences, so a visitor needs the reset).
- **The band.** The claim names the agents and who builds them ("You name the work. We build the agent that does it.", its two sentences on their own lines as in chapter 02), and the body carries the three things the chapter cannot show: Crosswell builds each agent, they run whole workflows custom to the company rather than email tricks, and they read the Core for context. "Chasing the silent deal" is gone with the rest of the finance terms on the general-market bands.
- **The lighting.** A long crescent takes the window's bottom-left corner: an SVG mask traced along a hand-drawn line (off the left edge about a third down, through the lower rows, meeting the bottom edge short of the Core column, then diving away so the column stays whole), blurred at 100 so the line itself sits at half strength and the fade runs light to heavy over about 250. A radial gradient could not hold that shape, which is why the mask is a drawn path.

## 21. The custom chapter, rebuilt as one page becoming another (hand-tuning pass, 2026-09-15)

The old chapter 06 was a fragment of chapter 01's morning in four swatches, with a picker under it: the colours changed and the words in the top bar changed, but the layout never did, so it argued for branding rather than for custom work. It now draws the real window and rebuilds the page inside it, business by business, with nothing to click.

- **Three businesses, one product.** Saguaro Capital, the lender the run has used throughout, then Juniper Row Supply, a building supply distributor (rust #a24a25), then Kestrel & Vane, an accounting firm (navy #2f4f73). Their marks are `/demo/juniper-mark.png` and `/demo/kestrel-mark.png`; their data is `src/lib/companies.ts` and their pages `src/components/dashboard/CustomHomes.tsx`. Every name and number is invented, and the run's closing line names all three.
- **Each Home has its own dominant shape,** so the difference reads without reading a word: the lender's morning is lists, the distributor's is a timeline of trucks across the day, the firm's is a week of deadline columns. The rail's pages change with the business (orders, deliveries, inventory for one; clients, deadlines, billing for the other), as does the top bar's one action.
- **The morph, in three beats.** All three pages share one four-part skeleton, named with `data-morph`: head (the greeting), hero (the block whose shape is the business's own), left and right (the two sections under it). On the change each section's box becomes a bare shell in a layer over the page: the page fades out under them (0.22s), the four shells travel and resize into this business's layout (0.58s, on one clock with no stagger between them, carrying the colours and the chrome), and the new page fills them in (0.34s, its sections 60ms apart). A shell with no counterpart goes as the others move; a section this business alone has arrives late, so the shape is whole before it fills.
- **Two passes it took to get there.** The first moved the content itself and read as a cut, not a morph: blocks cannot be scaled (a list row stretched into a timeline bar smears its text), so what changes shape has to be the empty section, not the words. The second shelled every row, about twenty of them in 7% ink, which read as a page still loading and crossed over itself while moving. Shelling the four sections only, drawn in the dashboard's own hairline (13% ink, 1px, radius 10) over a 2% wash, is what made it sleek: four shapes, in the material the rest of the window is already made of. The last overlap was the reading-order stagger itself: sections that are clear of each other in both layouts stay clear the whole way only while they move at the same rate, since a head start puts one section where the one above it is still going. They move on one clock now, checked by sampling the shells every frame through two changes (no overlapping pair).
- **The colours** are tweened on a wrapper the chapter owns, with `tint={false}` on the window so it does not set its own; the mark, the rail's pages, the user's initials and the action carry `data-chrome` and fade with the change.
- **It loops while on screen** (about 3.8s a business) and stops when it scrolls away, chosen over a switcher with chips: the chapter's argument is that the product is built around the business, and a visitor who never clicks should still see it happen. Reduced motion holds the lender's page still. The window keeps the run's bottom fade, since the firm's week runs past 800.
- The chapter's own fragment components (Frame, Rail, TopBar, Tile, Chip, SendButton, inert, useSequence in `src/components/product/shared`) were the last of the fragment era and are deleted with it; only Chapter remains.

