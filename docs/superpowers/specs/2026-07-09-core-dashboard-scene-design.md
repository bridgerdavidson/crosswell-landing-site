# Core dashboard scene: "The full room, dark"

Design spec for the second thing a visitor sees: replacing the chat-only demo in How It Works with a scripted, dark-mode Crosswell Core dashboard scene that plays the product's full loop (capture, organize, recall) as one continuous take.

Approved in brainstorming on 2026-07-09 (wireframes reviewed in the visual companion; dark "full room" locked).

## 1. Goal

The current `ChatDemo` reads as "just another AI chatbot" and undersells Core. The replacement shows Core as a complete system: a document is captured and filed, the brain's counts tick up, a question is asked, and the answer cites the note filed seconds earlier. Scripted and watch-only; the visitor never interacts except Replay.

## 2. Decisions of record

- **Scope:** full-vision dashboard (Chat, Add to the brain, Library, Analytics), beyond v1's shipped surface. Guardrail: everything is labeled "Product preview. Illustrative data." No real client names ("Your firm" is the workspace). No fabricated performance claims; the only numbers are obviously-illustrative product counts.
- **Staging:** "one living loop." A single dashboard frame, one continuous story, no view switching.
- **Layout:** "the full room": top bar, left sidebar, center chat canvas, right brain rail.
- **Mode:** dark. Ink and charcoal surfaces from the locked Fern palette; the frame sits on the light parchment page like a product window (echoes the dark Security section).
- **Chrome:** iOS-style restraint. Tone separates surfaces; hairlines only under the top bar and beside the rail; no boxed borders; large radii; generous padding.
- **Motion:** GSAP timeline (re-adding GSAP is sanctioned; concept brief said re-add an animation tool when redesign starts).

## 3. Placement and section restructure

`src/components/HowItWorks.tsx` currently renders steps (left column) and `ChatDemo` (right column, sticky) in a two-column grid. The full room needs full width, so the section restructures:

1. Kicker + H2 (unchanged).
2. The three numbered steps become a compact 3-across row (stack on mobile). Copy unchanged.
3. The dashboard scene, full width beneath (max-w-5xl, centered), with the illustrative caption below.

The steps map 1:1 onto the scene's beats (01 capture, 02 organize, 03 ask), so the section reads as: here are the three steps, now watch them happen.

`ChatDemo.tsx` is retired (deleted; its typewriter pattern and copy carry into the scene).

## 4. The frame: zones and content

Approved wireframe: `.superpowers/brainstorm/40110-1783644279/content/dashboard-dark-v2.html` (gitignored; visual reference only).

**Top bar** (hairline below): fern square mark + "Crosswell Core" wordmark, "· Your firm" workspace label, right side three initialed avatars + "3 online". A Replay text button occupies the far right end once the timeline reaches idle (section 6).

**Sidebar** (168px, no hairline, tonal): nav items Chat (active), Add to the brain, Library, Analytics. Lucide-style inline SVG stroke icons (1.8px stroke, one style, 14px). Active item: fern-tinted pill (`rgba(78,122,78,.20)` bg, `#b5cbb5` text).

**Chat canvas** (center, max-w-[560px] thread):
- Question bubble, right-aligned, charcoal `#3d3a34`: "Where did we land on wire approvals over $250k?"
- Answer card, left-aligned, raised surface: the existing dual-approval answer from `ChatDemo` (verbatim), with citation chips "Policy note · Apr 8" (the new one, glowing) and "Ops meeting · Mar 28".
- Composer: pill-shaped raised surface, placeholder "Ask anything about your firm…", fern send circle. Decorative only.

**Brain rail** (218px, sunken `#161512`, hairline left):
- "THE BRAIN" small-caps header.
- Big count "1,204 notes" (ticks from 1,203), "+1 just now" chip.
- 7-bar sparkline (dim fern bars, last bar fern-soft), "34 questions answered this week".
- Filed card (the capture payoff): fern-soft ring, check icon + "Filed just now", title "Policy note · Wire approvals", tag chips Operations / Policy / April.

Caption below frame: "Product preview. Illustrative data."

Copy rules: no em dashes anywhere, middots as separators. All copy above is final unless the user edits it.

## 5. Visual system

- **Surfaces (3-tone ladder):** canvas ink `#1a1915`; sunken rail `#161512`; raised cards `#24221c`; question bubble charcoal `#3d3a34`. Hairlines `rgba(241,238,230,.08-.10)`.
- **Text:** ivory `#f1eee6` primary; secondary `rgba(241,238,230,.55)`; faint `.38-.45`. Answer body at `.92`.
- **Accent discipline:** fern `#4e7a4e` for fills only (mark, send button, active pill tint); fern-soft `#93b393` for text accents, rings, glows; citation chips `rgba(78,122,78,.22)` bg with `#93b393` text (`#c2d6c2` on the highlighted new chip). Fern appears only at story beats.
- **Type:** Schibsted Grotesk throughout the frame (product chrome voice; serif stays outside the frame in section copy). Frame base 13px, answer 13px/1.55, big count 23px/600. `font-variant-numeric: tabular-nums` on all counters.
- **Shape:** frame radius 16px with soft ambient shadow; chat bubbles 16px, filed card 12px; pills/chips full-round.
- **Icons:** inline SVG only, single stroke family. No emoji.

Contrast (checked against dark surfaces): ivory on ink ~13:1; secondary text ~5:1; fern-soft on ink ~7:1; chip text on chip bg >4.5:1. All pass AA.

## 6. Motion spec (GSAP)

Dependencies: `gsap` + `@gsap/react` (`useGSAP` scoped to the section container for cleanup). ScrollTrigger registered once. Free plugins only (no SplitText; typing is the existing JS typewriter technique).

Timeline, plays once when the frame enters viewport (`start: "top 75%"`, `once: true`), ~9.5s:

| Beat | Time | What happens | How |
|---|---|---|---|
| Settle | 0.0-0.6s | Frame rises 12px and fades in; resting stats visible | opacity/y, power2.out |
| Capture | 0.6-2.4s | Filed card slides into rail; tags stagger 50ms; count ticks 1,203 to 1,204; one sparkline bar grows | x/opacity power2.out; textContent tick; scaleY (transform-origin bottom) |
| Question | 2.4-6.5s | Typewriter question in bubble; thinking dots pulse | JS typewriter sequenced via timeline `.call()`; CSS dot pulse |
| Answer | 6.5-8.0s | Answer card rises 14px + fades; citation chips stagger in | power2.out, stagger 80ms |
| Payoff | 8.0-9.5s | New citation chip and filed card pulse a shared fern-soft ring twice, in sync | boxShadow keyframes, two pulses |
| Idle | 9.5s+ | Last sparkline bar breathes (slow scaleY yoyo); Replay control fades in | repeat -1 transform-only |

Rules: transform/opacity only (the count tick and ring pulse are the deliberate exceptions); exits shorter than enters; no animation blocks reading; reserve all heights up front so nothing shifts layout (CLS 0).

**Replay:** text button rendered as an absolutely positioned sibling outside the aria-hidden frame (so screen readers can reach it), visually overlaying the far right of the top bar, with an aria-label; fades in when the timeline reaches idle (hidden until then). Restarts the timeline; keyboard-focusable with visible focus.

**Reduced motion:** `prefers-reduced-motion` skips the timeline and idle loop entirely; scene renders finished.

**No-JS / SSR:** server-render the finished scene (TrustDiagram precedent). On mount, GSAP `set()` arms initial hidden states before the timeline plays; if JS never runs, visitors see the completed scene, not a blank.

As built during review: the Replay relocation above was a review-driven fix; the caret carries a static invisible state so reduced-motion and no-JS viewers never see it blink.

## 7. Responsive

- **lg+ (1024px and up):** full three-zone frame.
- **md (768-1023):** sidebar hidden; top bar + chat + rail.
- **below md:** top bar + chat canvas only. The filed card plays as a floating toast (top-right over the canvas); the rail's stats compress to a horizontal strip under the composer (count, +1 chip, mini sparkline, questions-this-week). Same timeline, retargeted.

Verify at 1440, 1728, and 390 with screenshots before calling it done (standing rule for this site).

## 8. Accessibility

- The theatrical frame is `aria-hidden="true"`; an `sr-only` paragraph beside it summarizes the scene ("Product preview: a policy note is filed into the firm's brain, tagged, and moments later a question about wire approvals is answered with citations to that note.").
- Replay button: real `<button>`, labeled, focusable, works with the timeline restart.
- Contrast per section 5; no information conveyed by color alone (filed state has check + text, new citation has ring + position).

## 9. Tech and files

- `src/components/CoreDashboard.tsx`: new client component, the whole scene (frame, zones, timeline). Internal subcomponents in-file; split only if it grows past comfortable size.
- `src/components/HowItWorks.tsx`: restructured per section 3.
- `src/components/ChatDemo.tsx`: deleted.
- `package.json`: add `gsap`, `@gsap/react`.
- Styling via Tailwind utilities and the existing `@theme` tokens; add derived dark-surface hexes as component-local values (they are one-off scene surfaces, not site-wide tokens).
- Static export constraint unchanged (`output: "export"`); everything is client-side animation on server-rendered markup. Do not touch `vercel.json`.

## 10. Out of scope

Real interactivity (typing, clicking citations, tab switching), real data, mobile-app framing, any change to hero, Security, or other sections, site-wide dark mode.

## 11. Acceptance criteria

1. `npm run build` passes; inspect the built CSS if any gradient/mask tricks are used (minifier has eaten single-stop gradients before).
2. Scene plays once on scroll-in at 1440/1728/390, matches the beat table, replays cleanly, and never shifts layout.
3. Reduced-motion and JS-disabled render the finished scene.
4. Copy contains no em dashes, no client names, and carries the illustrative caption.
5. Dev server on the real port (check the dev log; 3000 is often taken by another app).
