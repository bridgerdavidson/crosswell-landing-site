# Behind the chat: the firm's brain, floating free

Design spec for a new landing-page section that shows the brain behind the dashboard. The dashboard tour (`core-dashboard/`) shows the front door; this section shows what the front door opens onto: a living, connected knowledge graph. This is the "How it's built" backend section logged as the next TODO in `README.md` and in the brain at `ai-os/projects/crosswell-consulting/ideas/landing-site-backend-section.md`, reframed after brainstorming toward an elegant free-form brain rather than an infrastructure diagram.

Approved in brainstorming on 2026-07-10 after the user reviewed an interactive look lab (three node styles, tunable motion/density) and locked the look.

## 1. Goal

The problem, in the brain's own words: *"Chat alone makes Core look like a chatbot with a subscription."* The tour proves Core answers with citations, but the value a fund actually pays for, an institutional memory that stores, sorts, and connects everything the firm knows, stays invisible. This section makes that value legible and felt: the same note from the tour drops into the firm's brain and connects to everything it touches, so the viewer sees the memory, not just the chat window.

Success = a fund partner watches it and thinks "that is my firm's knowledge, alive and connected," in the site's warm editorial voice, with no tech-flashy neural-net theatrics.

## 2. Decisions of record (from brainstorming)

- **Standalone section**, placed immediately after How It Works and before Why Crosswell. Not a continuation of the tour; a distinct piece that reuses the tour's one note as its character.
- **Visually distinct from the hero.** The hero is an ambient 3D woven sphere you cannot read. This is a flat, legible, 2D field that grows and connects in front of you. Same DNA, different animal.
- **Wow through recognition, not spectacle.** Legible fund knowledge in the Fern palette. No neon, no tech-company blue, no glowing neural net.
- **Scope: the brain itself.** Storing, sorting, connecting. Recall/chat is the tour's job and is out of scope here.
- **No box, no vault.** Free-form and open, edges breathing into the ivory page. The security story (isolated, encrypted, host-it-yourself, the lock) stays entirely in the dedicated Security section. This section never encloses the brain. (This reverses an earlier "vault seal" idea; the user chose elegance and openness over a boxed climax.)
- **The look, locked in the lab:** minimal flat nodes, calm motion, dense, threads on, labels off, five area-clusters pulled close so they read as one tight brain.
- **The one note is the tour's note.** The wire-approval meeting transcript, sorted into the same policy note, enforced in code by a shared source of truth.

## 3. The section

- **Canvas:** the ivory page (`--ivory #f1eee6`). No dark frame. The brain is drawn directly on the page, its edges masked so nodes fade into the ivory (no container, no border).
- **Layout:** editorial. On wide screens, copy (kicker, headline, support) in a left column and the floating brain in a larger area to its right; on narrow screens they stack, copy above and brain below. The big note card animates over the brain during the sequence, centered on the brain area.
- **Copy (locked; middots, no em dashes):**
  - Section id: `the-brain`. Nav is left unchanged (discovered by scroll).
  - Kicker: `Behind the chat`
  - Headline (serif, `type-h2`, matching How It Works and the other mid-page sections; `type-display` stays reserved for the hero and the final-CTA bookend): **"Nothing your firm knows sits alone."**
    - Alternates on file if wanted: "Every memory, connected." / "One note, linked to everything it touches."
  - Support (sans, body): **"Every meeting, email, and file becomes a connected memory, linked to the people, deals, and decisions it touches. Your firm's knowledge stops living in inboxes and in people's heads, and starts compounding."**
    - Note: no security claim here on purpose. "Encrypted", "isolated", "yours to walk away with" belong to the Security section, so the two sections do not compete.
  - Caption near the brain: `Illustrative.`
  - Replay control label: `Replay` (fern-soft), matching the tour.

## 4. The sequence (plays once on scroll-in, replayable, ~10s of choreography then endless calm drift)

The ambient brain floats the whole time. The choreographed beats layer on top.

| Beat | Time | What happens |
|---|---|---|
| Settle | 0.0-1.0s | The brain drifts in (calm), already populated. It is the firm's existing memory. No card yet. |
| Capture | 1.0-2.8s | The wire-approval **meeting transcript** rises up as a large, readable dark card, centered over the brain; the field dims slightly behind it. Raw transcript lines visible. Holds long enough to read. |
| Sort | 2.8-5.0s | On the card, the raw transcript condenses to a clean summary; tags settle in (`Operations · Policy · April`); a `Filed` check appears. Messy input becomes a structured note, the "Core organizes it" magic, on the one thing we can read. |
| Link | 5.0-7.5s | The card shrinks and travels toward the **Operations** cluster, morphing into the bright fern note node. On arrival it pulses and threads fire to the nodes it touches: the Operations hub, an `Ops meeting · Mar 28` node (the tour's node), and a People node (the partners). Its cluster reads fern. |
| Settle again | 7.5s+ | The pulse eases to a steady ring, the brain drifts on calmly with one more connected memory. Replay fades in. |

Replay re-runs Capture through Settle. The ambient drift never stops (it is the resting state).

## 5. The visual system (locked look values)

All values below are the look study's locked parameters (see the interactive look lab). The build must reproduce them.

**Field**
- Free-form floating field of nodes on ivory. Edge fade via CSS mask on the canvas: `radial-gradient(120% 118% at 50% 48%, #000 62%, transparent 99%)`. No border, no card, no box.
- Deterministic layout: seeded PRNG (mulberry32, fixed seed) so the graph is identical every load and the SVG fallback matches the canvas.

**Five clusters = areas of the firm** (color from the Fern palette; RGB as used on canvas):
| Cluster | Color | RGB | Center (fx, fy) | Spread |
|---|---|---|---|---|
| Deals | fern-deep | 61,99,61 | 0.365, 0.395 | 0.108 |
| Investors | charcoal | 61,58,52 | 0.665, 0.375 | 0.096 |
| People | warmgray | 184,178,167 | 0.360, 0.640 | 0.108 |
| Meetings | fern-soft | 147,179,147 | 0.510, 0.520 | 0.120 |
| Operations | fern | 78,122,78 | 0.650, 0.615 | 0.108 |

Centers are pulled toward the middle so the five groups read as one tight brain (no big gaps). Labels off (no text on the field).

**Node roles**
- **Core memory (hub):** one per cluster, larger (baseR ~9.5), with one quiet concentric ring (r+5, ~0.34 alpha) and a whisper of presence. Reads as gravity, not a UI dot.
- **Notes (satellites):** dense, small (baseR ~2.8 to 5.4), colored by their cluster, varied in size and depth so the field has depth even in the flat "minimal" style. Dense multiplier ~1.85 on base counts (Deals 10, Investors 9, People 10, Meetings 13, Operations 10).
- **The just-added note:** bright fern core (r ~7.5) on an ivory ring (r ~9.5) with a steady ring (r ~13), a soft radial halo (r ~38), and an expanding "just arrived" pulse ring. Its three lit threads are brighter fern with a small traveling pulse dot.

**Threads (on)**
- Intra-cluster: mostly satellite to hub, but ~50% of satellites chain to a nearby sibling instead, plus ~2 mesh links per cluster, so it looks organic (an Obsidian graph), not a radial dandelion.
- Cross-cluster: ~6 faint curved bridges (warmgray, low alpha) knit the clusters into one brain.
- All threads gently bowed (perpendicular control point, offset `min(24, len*0.09)`). Colored threads inherit cluster color at ~0.10 to 0.32 alpha by depth; bridges warmgray ~0.24.

**Motion (calm)**
- Each node springs (k ~0.02, damp ~0.9) toward a slowly drifting home (cluster center lissajous + per-node wander), amplitudes scaled by the calm factor (~0.5). Reads as floating, alive, unhurried.

**Style (minimal)**
- Flat fills, no glow halos on ordinary nodes (glow is a lab option we did not choose). Depth conveyed by size and alpha variation only. The just-added note keeps its halo and pulse (it is the one accent).

Palette only. No hex outside the enumerated Fern tokens plus the node RGBs above (which are the tokens in RGB form).

## 6. Mechanics and technology

- **Ambient field: HTML5 canvas + requestAnimationFrame.** Continuous free-form physics over dozens of nodes is the reason for canvas rather than the site's usual SVG/GSAP. This is a deliberate new tool for this section, justified by the motion model; the hero is CSS, the tour is GSAP, the trust diagram is CSS/SVG, and this is canvas. Canvas is sized to devicePixelRatio (cap 2), redrawn each frame with transforms only, and the RAF loop is paused when the section is offscreen (IntersectionObserver) to save CPU. The render loop schedules its next frame before drawing so a stray error cannot kill it.
- **The note card: a DOM overlay** (crisp readable text), positioned over the canvas, animated by GSAP (rise in, content swap raw to sorted, then scale + translate toward the note's canvas position, fading out as the canvas note "arrives"). Handoff: when the card reaches the target, it hides and the canvas note's arrival (pulse + lit threads draw-in) triggers.
- **The note lives in the graph always** but is drawn hidden/faded until the Link beat reveals it. Before arrival its lit threads are not drawn.
- **Scroll trigger:** IntersectionObserver (or GSAP ScrollTrigger to match the tour), play once on scroll-into-view. Replay button re-runs the card-to-inject choreography; the ambient loop keeps running.
- **Determinism:** fixed PRNG seed. No `Math.random` at runtime for layout; any per-frame variation is time-based and reproducible.

## 7. Reduced motion and no-JS

- **A server-rendered static SVG of the settled brain** (note already connected, no pulse) is the fallback, rendered from the same `graph-data` layout so it matches the canvas composition. It is shown by default; when JS runs and motion is allowed, the canvas mounts over it and animates. This mirrors `TrustDiagram` (SSR finished state, JS arms).
- **Reduced motion:** show the static SVG, skip the canvas RAF and the card choreography. No Replay.
- **No-JS:** the static SVG is the whole experience. `Illustrative.` caption renders. Replay is absent.

## 8. Accessibility

- The canvas and the decorative SVG are `aria-hidden` (or `role="img"` with a concise `aria-label`), with an `sr-only` description: "Illustrative: a meeting transcript is captured, sorted into a tagged note, and connected into the firm's knowledge graph across deals, people, meetings, operations, and investors."
- The Replay button is a real, focusable `<button>` outside the aria-hidden region, with a visible focus ring, fading in at rest (tour pattern).
- No information by color alone (the sequence is narrated by the card's text and the sr-only description; color only groups).
- Respect `prefers-reduced-motion` as in section 7.

## 9. Architecture and files

New folder `src/components/brain/`, mirroring `core-dashboard/`:

- `BrainSection.tsx` (default export): the `<section id="the-brain">` wrapper. Kicker, headline, support copy, the field container, the `Illustrative.` caption, the Replay button, the sr-only description. Composes the field, the note card, and the SVG fallback.
- `BrainField.tsx` (`"use client"`): the canvas engine. Sets up the canvas, the seeded layout (via `graph-data`), the ambient RAF loop, and an imperative trigger for the inject choreography. Reduced-motion and IntersectionObserver aware.
- `NoteCard.tsx`: the large DOM card, raw transcript to sorted note, animated by the timeline.
- `graph-data.ts`: clusters, seeded deterministic layout (normalized coordinates in a canonical viewBox), edges (intra + cross-cluster), the note and its lit targets. Shared by the canvas and the SVG fallback so they always match.
- `BrainStill.tsx`: the server-rendered static SVG of the settled brain, from `graph-data`.

**Reuse (the "same note" promise, enforced in code):**
- Create `src/lib/core-note.ts` holding the canonical wire-approval note: the raw transcript excerpt lines, the sorted summary, the context line, the tags (`Operations · Policy · April`), and the links (`Ops meeting · Mar 28`). 
- `brain/NoteCard.tsx` imports from it. Confirmed in review: the tour's `core-dashboard` views are refactored to import the same strings, so the note text cannot drift between the two sections. `shared.tsx`'s `ANSWER` and the wire-approval strings in `AddView`/`LibraryView` move to `core-note.ts` and are imported back, in the same change. This is a small, in-scope refactor that serves the "same note" promise; the tour must render byte-identical to before.

**Wiring:** `src/app/page.tsx` inserts `<BrainSection />` between `<HowItWorks />` and `<Edge />`. `globals.css` gains the section's small pieces (the canvas mask, the card styles, reduced-motion rules, any `brain-` keyframes for the card). `gsap` + `@gsap/react` are already installed. `vercel.json` and build config are untouched (still a static export; the canvas is client-only and degrades to the SSR SVG).

## 10. Distinctness (so nothing on the page repeats)

- **vs the hero:** hero is an ambient rotating 3D sphere, unreadable and decorative; this is a flat 2D field that grows, connects, and is narrated by a readable card. Different dimensionality, different behavior.
- **vs the tour:** the tour is a dark product UI showing capture/ask/verify/report; this is an open ivory brain showing storage and connection. They share one note, nothing else.
- **vs Security:** Security owns every lock, boundary, and "even we cannot see it." This section is deliberately open and unboxed and makes no security claim.

## 11. Out of scope

Recall/chat/citations (the tour owns them), any counters or usage numbers, any vault/box/lock/security claim (Security owns them), node labels, jargon (no "vector index", "RAG", "embeddings"), a nav link for the section, real data, site-wide dark mode, and any change to the hero, tour, or Security section beyond the shared `core-note.ts` refactor.

## 12. Acceptance criteria

1. `npm run build` passes (static export intact); the section renders on the home page between How It Works and Why Crosswell.
2. Verified via the Playwright rig: the ambient brain floats; on scroll-in the sequence plays once (Capture, Sort, Link, Settle per section 4); Replay re-runs the choreography while the ambient drift continues.
3. Reduced-motion and no-JS both show the settled static SVG brain (note connected), the `Illustrative.` caption, and no Replay. The SVG composition matches the canvas layout (same seed/data).
4. Screenshots at 1440, 1728, and 390, plus a reduced-motion shot, plus mid-beat shots (readable card at ~2s, sorted card at ~4s, inject at ~6s, settled at ~9s). No horizontal overflow; the brain's edges fade into the ivory with no visible container.
5. The look matches the locked values in section 5 (minimal, calm, dense, threads on, labels off, five clusters pulled together). Palette-only color; no hex outside the enumerated set.
6. No em dashes, no client names, no usage metrics, no security claims anywhere in the section. The note text is imported from `src/lib/core-note.ts` and is byte-identical to the tour's.
7. CPU: the RAF loop pauses when the section is offscreen; no console errors across the run.

## 13. Risks and mitigations

- **Canvas is a new tool on this site.** Mitigation: it is isolated to `brain/`, degrades to an SSR SVG, and is justified by the physics model. If it ever misbehaves, the SVG fallback is a complete experience.
- **"Too busy" at dense.** Mitigation: density is a single tunable; the lab already validated dense-but-calm reads well. Keep threads subtle (low alpha) so density does not become noise.
- **Note drift between sections.** Mitigation: the shared `core-note.ts` module and acceptance criterion 6.
- **Overlap with Security.** Mitigation: no box, no lock, no security copy here (decision of record 2 and section 10).
