# Core dashboard tour: five beats across the whole product

Design spec for reworking the How It Works dashboard scene from a single-view loop into a cursor-driven tour of the dashboard's four sections. Supersedes `2026-07-09-core-dashboard-scene-design.md` (the frame, visual system, and guardrails carry over; the staging changes).

Approved in brainstorming on 2026-07-09 after the user reviewed the v1 scene in dev.

## 1. Goal and what changed from v1

V1 played one loop inside a static Chat view. Feedback after seeing it live:

1. The question must behave like a real message: typed in the composer, sent with a click, popping up into the thread. No typewriter inside the bubble.
2. No usage bragging: "questions answered this week" is gone. Analytics means company-level reports the firm sets up, built from the brain and its sources.
3. The scene should tour the other sections (Add to the brain, Library, Analytics), showing what each does.
4. Automatic ingestion is the product's biggest win and must star in the capture beat. Manual adding exists but is secondary ("for anything the bots can't catch").

## 2. Decisions of record

- **Staging:** a five-beat guided tour across four views, one continuous take, ~16s. Ends resting on Analytics with Replay.
- **Interaction language:** a soft cursor dot glides to each target and presses (scale pulse + press state on the target). The cursor NEVER touches the capture beat; automatic ingestion happens visibly by itself.
- **View switching:** all four views pre-rendered and absolutely stacked in a fixed-height canvas; GSAP crossfades (autoAlpha + 6px rise). No React state during playback.
- **The brain rail is removed.** Its jobs moved into the views: capture confirmation lives in Add to the brain, numbers live in Analytics. Chat gets the full canvas.
- **Analytics flavor:** operational pulse. A monthly report about the FIRM's activity, not about product usage. Mundane, obviously illustrative numbers.
- **Reduced-motion / no-JS resting state: the answered Chat view** (the signature frame), NOT the tour's final Analytics frame. Deliberate divergence from "finished = final frame": a static Analytics screen undersells the product to non-animating visitors. Sidebar statically marks Chat active in that state; the cursor never renders.
- **Pacing:** brisk. No beat lingers past ~4s; composer typing is quicker than the old bubble typewriter.

## 3. The tour (beat table, ~16s)

| Beat | Time | View | What happens |
|---|---|---|---|
| Settle | 0.0-0.5s | Add to the brain | Frame rises 12px and fades in; sidebar indicator on Add to the brain; source chips already live |
| Auto-capture | 0.5-3.5s | Add to the brain | A feed item slides in BY ITSELF: "Meeting transcript · Wire approval policy" with an "Ingested automatically" badge; status ticks Reading… then tags Operations · Policy · April stagger in, then "Filed ✓" and "1,204 notes in the brain" (count ticks from 1,203). No cursor involvement |
| Go to Chat | 3.5-4.3s | transition | Cursor dot fades in near frame center, glides to Chat in the nav, presses; indicator slides, view crossfades to Chat |
| Ask | 4.3-8.2s | Chat | Question types INTO THE COMPOSER (~1.4s, proxy tween); cursor glides to the send circle, presses; composer text clears and the question pops up into the thread as a sent bubble (y 8 to 0, scale 0.96 to 1); thinking dots ~1.2s; answer card rises with citation chips staggering in, "Policy note · Apr 8" glowing |
| Verify | 8.2-11.5s | Library | Cursor glides to the glowing citation chip, presses; nav indicator jumps to Library, view switches; the wire-approvals note sits open in the list, marked "Cited just now"; a highlight sweeps its key line |
| Report | 11.5-15.5s | Analytics | Cursor glides to Analytics in the nav, presses; the June report builds: three tiles pop with quick count-ups, then the by-area bars grow |
| Rest | 15.5s+ | Analytics | One chart bar breathes (slow scaleY yoyo); cursor fades out; Replay fades in |

Replay restarts the full tour (re-arm inside the timeline, as v1 did).

## 4. View content (locked copy; middots, no em dashes)

**Add to the brain**
- Section label: "Connected sources", with three live chips: "Meeting bot · in today's ops meeting" (pulsing status dot), "Email · watching forwarded mail", "Files · synced".
- Feed item: "Meeting transcript · Wire approval policy" + badge "Ingested automatically" → status "Reading…" → tag chips Operations · Policy · April → "Filed ✓" + "1,204 notes in the brain".
- Manual line, quiet, below: "Drop files or paste notes for anything the bots can't catch."

**Chat**
- Thread empty at beat start except the composer ("Ask anything about your firm…", fern send circle).
- Question (typed in composer, then sent bubble): "Where did we land on wire approvals over $250k?"
- Answer (verbatim from v1, locked): "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number."
- Citation chips: "Policy note · Apr 8" (highlighted, glowing ring) and "Ops meeting · Mar 28".

**Library**
- Four rows (title · date): "Policy note · Wire approvals" · Apr 8 (open, marked "Cited just now"); "Ops meeting notes" · Mar 28; "Q2 investor letter draft" · Jun 12; "Committee minutes" · Jun 3.
- Open note panel: body line 1 (highlight-swept): "Any wire over $250k requires sign-off from both a managing partner and operations." Body line 2: "Context: a near miss in March with a mistyped account number."
- Metadata line (the kept-and-linked hint): "Filed in Operations · Linked to Ops meeting · Mar 28".
- Tag row: Operations · Policy · April.

**Analytics**
- Header: "June report"; subline "Compiled from meetings, notes, and documents."
- Tiles: "Meetings captured" 41 · "Decisions logged" 12 · "Open items" 7 (sub "3 owners").
- Bar chart "Activity by area": Deals 18 · Investors 9 · Operations 14.

Caption below the frame (unchanged): "Product preview. Illustrative data."
Workspace label (unchanged): "Your firm". No client names, no usage metrics, no performance claims.

## 5. Frame and visual system (carried from v1, deltas only)

Everything in the v1 spec's visual system holds (ink canvas, three-tone ladder, two hairlines max, fern rationed to story beats, fern-soft accents on dark, Schibsted Grotesk in the frame, tabular numerals, SVG-only icons). Deltas:

- The right rail and its hairline are gone; the canvas spans from the sidebar to the frame edge.
- The sidebar's active state becomes a single sliding indicator pill (transform-only). Server-rendered position: Chat (the no-JS/reduced-motion resting view). Nav label colors swap via timeline calls at each switch.
- The cursor dot: ~14px, ivory core with a soft fern-soft halo, slight blur, ~85% opacity; press = scale to 0.85 and back plus a momentary press state (background tint) on the target. Rendered only when the timeline runs.
- New-surface pieces (source chips, feed card, library rows, report tiles) reuse the raised-card tone `#24221c` and existing chip/tag styles. No new hex values beyond the enumerated set.

## 6. Mechanics

- **Stacked views:** each view is absolutely positioned in a relative canvas with a fixed min-height per breakpoint (desktop ~440px; mobile ~500px; exact values tuned at build, reserved up front so switches never shift layout). Default CSS shows Chat-answered and hides the other three (static `invisible` classes); the timeline's arm makes Add visible and Chat pre-answer only when it actually plays.
- **View switch:** outgoing autoAlpha 0 over 0.18s; incoming autoAlpha 1 + y 6 to 0 over 0.28s; nav indicator slides in the same window.
- **Cursor targeting:** positions are measured at play time from the live layout (getBoundingClientRect of target elements relative to the frame), computed inside timeline calls or functional tween values, so the tour lands correctly at any viewport width. Movement easing power2.inOut, 0.5-0.7s per glide.
- **Send moment:** the composer holds a typed span (proxy tween writes textContent); on press, the span clears and the pre-rendered thread bubble pops in. The bubble exists in SSR markup (it IS the resting state's content).
- **Counts:** quick textContent ticks (1,203 to 1,204 in Add; 0 to 41/12/7 fast count-ups in Analytics), tabular numerals throughout.
- **Timeline:** one GSAP timeline, useGSAP scoped, ScrollTrigger `top 75%` `once: true`, arm-inside-timeline so Replay's restart() re-arms; idle tweens created in calls with pre-resolved elements, killed on re-arm and unmount (v1 pattern).
- **Reduced motion:** early return before any set; Chat-answered view shows; cursor and Replay never appear.
- **No-JS:** same Chat-answered view via the CSS defaults; Replay stays hidden.

## 7. Responsive

- **lg+ (1024px+):** sidebar + canvas.
- **below lg:** the sidebar becomes a compact horizontal tab strip above the canvas (four items, icon + short label, same sliding indicator). The cursor targets the strip. Same beats.
- The v1 mobile toast and stats strip are gone with the rail.
- Verify at 1440, 1728, 390 plus a reduced-motion shot, plus mid-take beat shots (auto-capture ~2s, sent message ~6s, library ~10s, analytics idle).

## 8. Accessibility

- Frame stays `aria-hidden` with the sr-only narrative updated: "Product preview: the firm's brain ingests a meeting transcript automatically, a teammate asks about wire approvals and gets a cited answer, the citation opens the source note in the library, and a June report summarizes activity across the firm."
- Replay stays the absolutely positioned sibling outside the aria-hidden frame (aria-label, focus-visible ring), fading in at idle.
- The cursor dot is decorative (inside the aria-hidden frame) and absent under reduced motion.
- Color/contrast rules from v1 hold; no information by color alone.

## 9. Architecture and files

- `src/components/core-dashboard/CoreDashboard.tsx`: frame, top bar, nav (sidebar + tab strip), cursor dot, the timeline, Replay. Default export; `HowItWorks` updates its import.
- `src/components/core-dashboard/AddView.tsx`, `ChatView.tsx`, `LibraryView.tsx`, `AnalyticsView.tsx`: one view each, presentational, carrying their `cwd-` target classes.
- `src/components/core-dashboard/shared.tsx`: icons, tag chip, source chip, shared constants (QUESTION, ANSWER).
- `src/components/CoreDashboard.tsx` (v1 single file): deleted.
- Dependencies unchanged (gsap + @gsap/react already installed). `globals.css`, `vercel.json`, build config untouched.

## 10. Out of scope

Real interactivity beyond Replay, real data, the backend "how it's built" landing-page section (logged as the next idea in README and the brain), any other section of the site, site-wide dark mode.

## 11. Acceptance criteria

1. `npm run build` passes; production tour verified via the Playwright rig: plays once on scroll-in, beat order matches section 3's table, Replay round-trips cleanly.
2. Screenshots at 1440/1728/390 (idle on Analytics) plus reduced-motion at 390 (Chat-answered) plus the four mid-take beat shots. No layout shift across view switches; no horizontal overflow.
3. The capture beat visibly happens without the cursor; the cursor's first press is Chat.
4. No em dashes, no client names, no usage metrics anywhere; the illustrative caption renders.
5. Built-CSS check uses the 8-digit hex form for alpha colors (Tailwind v4 normalizes rgba).
