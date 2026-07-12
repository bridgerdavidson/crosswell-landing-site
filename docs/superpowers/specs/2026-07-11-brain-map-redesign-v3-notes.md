# Brain-map section redesign (v3) — decisions + as-built record

Status as of 2026-07-11: **IMPLEMENTED** on branch `brain-map-v3` (not yet merged/committed). The v3 motion below was ported from the prototype into the real section (`src/components/brain/`), replacing the v1 animation, and verified end-to-end (prod build + Playwright beat shots on desktop/mobile + reduced-motion + no-JS, zero console errors, no horizontal overflow). This document captures the v3 redesign and the as-built deviations. It supersedes the v1 *animation* design (`2026-07-10-behind-the-chat-brain-map-design.md` / `...-plan.md`); the section's purpose, placement, palette, and copy are unchanged.

## As-built deviations from the prototype
- **Ambient time is decoupled from the sequence clock.** The prototype froze the brain whenever the 11s sequence wasn't playing. The real build runs a continuous `tAmb` for the node drift and a separate `clock` for the 7 beats, so the brain keeps breathing before/after the sequence. Both freeze together only when the section is scrolled offscreen (IntersectionObserver).
- **Card header is concise + persistent.** The head shows `Meeting transcript` (derived from `CORE_NOTE.sourceLabel.split(" · ")[0]`) with the badge (`Capturing` -> `Sorted`); the full `· Wire approval policy` was dropped so the head fits one line at 390px without overflow. Header identity persists while the body transforms (raw -> sorted).
- **Mask uses a double stop.** `.brain-field` mask is `radial-gradient(130% 130% at 50% 50%, #000 0 68%, transparent 100%)`. A single stop (`#000 68%`) is collapsed to `#000 0` by the prod minifier and washes the field out (see brain-map + css-minifier-gradient-trap memory). Verified in the built CSS.
- **Trigger/replay** use `ScrollTrigger` (start `top 70%`, once) to start the clock and the Replay button to restart; everything else is a hand-rolled RAF clock (no GSAP tweens drive the beats). Replay fades in after the sequence ends.
- Section grid widened to `lg:grid-cols-[0.62fr_1.55fr]` and stage height to `clamp(500px, 54vw, 660px)` for the enlarged brain.

## Review outcome (adversarial multi-agent pass)
Fixed: Replay fade-in tween now killed on replay (no ghost-back); tag-fly indexing guarded so a future 4th tag can't throw; Replay `aria-hidden` toggled (out of the a11y tree until revealed); the SSR still SVG is now `aria-hidden` (the sr-only `<p>` in BrainSection is the single description, no duplicate); settled note radius aligned to 5.5 in both still and live; `will-change` moved off static CSS and toggled on the card in JS only during the sequence window.

Known limitation (accepted, not a regression): the SSR still uses a fixed `viewBox 0 0 1000 640` (`meet`) while the live canvas lays out from the stage's actual pixel size, so the brain can scale/shift at the still->live swap. This matches v1's structure, happens off-screen on mount for a below-fold section, and can't be made exact from SSR (no runtime px). Only a #the-brain deep-link on load could briefly expose it.

## Where the prototype lives
- **Repo (source of truth):** `docs/superpowers/prototypes/2026-07-11-brain-scene-v3.html` (self-contained; open in a browser, or run the shoot rig against it).
- **Live artifact (editable from a new session by passing this URL to the Artifact tool):** https://claude.ai/code/artifact/78e6ba29-2a51-4105-8111-8131ef02b629
- The artifact and the repo file are the same HTML; either can regenerate the other (`WebFetch` the URL, or re-publish the file).

## What stays the same (from v1)
Placement after How It Works, before Why Crosswell (`#the-brain`). Ivory canvas, no box, no vault, no security copy (the Security section owns the lock/vault story). Copy: kicker `Behind the chat`, headline "Nothing your firm knows sits alone.", the support paragraph, `Illustrative` caption. Palette only. No em dashes. The shared note stays `src/lib/core-note.ts`. Reduced-motion / no-JS still show a server-rendered static SVG of the settled brain. Canvas + RAF is still the render approach.

## What changes in v3 (the redesign)

**Brain structure — radial with a center, dense, one organic disc.**
- A deep-fern **core node** at the center.
- The five area-clusters (Operations, Deals, Investors, People, Meetings) arranged in a **ring around the core**, satellites radiating.
- Meshed so it reads as one filled disc, not five spokes: satellites mostly chain to siblings (fewer straight-to-hub), intra-cluster mesh links, and **rim links between neighboring clusters**.
- **Dense** (~100 nodes; prototype uses cluster counts 18/18/15/18/20 + ~11 core-inner). Edge fade via canvas radial mask so it floats (no container).
- **Enlarged in place**: bigger, more central brain; copy stays in the left column, brain in a larger right area.

**The sequence (approx 11s, roomier, smoother physics k≈0.028 / damp≈0.9 / low wobble):**
1. **Arrive** — the transcript card flies in from the **top-left corner** on an arc, scaling up, to a readable center-top spot. **No "Today's ops meeting" bubble** (removed); the corner entrance alone implies it came from the meeting.
2. **Read + highlight** — phrases in the raw transcript **highlight in sequence** (like reading). **No scan bar.**
3. **Sort** — the tags (`Operations · Policy · April`) **detach from their highlighted phrases and fly to the tag row**; the raw text resolves **smoothly** into the sorted summary. Card layout is a flex column so spacing is correct (header / summary / context / tags never overlap — this was a v1 bug).
4. **Convert** — the sorted card **converts into a big node at center first** (crossfade: card rounds, shrinks, fades while the canvas big fern node fades in at the same point) and **holds there, big, before any movement**.
5. **Drop** — the big node **drops softly** into the dense field to an **offset landing** (down and to the side, clear of the core), with gentle physics (not spider-web snap).
6. **Part** — nearby dots **smoothly part into a circular clearing** around the landing (soft open, hold, close), while a temporary emphasis draws its connections to the core and a few nearby nodes.
7. **Settle / normalize** — the node **shrinks to normal size**, the thick emphasis **fades to ordinary thin edges**, glow/ring disappear. It **resolves into an ordinary node** ("looks like it never entered").

**Connections after settle:** ordinary thin edges to the core plus a few nearby nodes. **No persistent thick/lit lines, no glow, no ring.**

## Implementation notes for the real build (translate the prototype)
- The prototype is vanilla canvas + a hand-rolled clock/timeline. The real build should keep the v1 architecture (`src/components/brain/`: `graph-data.ts`, `BrainStill.tsx`, `BrainField.tsx`, `NoteCard.tsx`, `BrainSection.tsx`) and port these mechanics:
  - `graph-data.ts` → radial layout (core + ring of clusters), denser counts, meshed + rim edges; deterministic seed retained; positions still a function of dims + time.
  - New timeline in `BrainField.tsx` for the 7 beats above; the note is **scripted** (center → landing) until handoff, then springs at home == landing.
  - A `partAmt`-style **circular-clearing displacement** (push nodes within a radius out to the clearing rim, eased open/hold/close) replaces the v1 impact impulse.
  - The note's connections are ordinary edges in the graph (drawn thin once visible) with a **temporary thick emphasis overlay** that fades to zero by settle end.
  - `NoteCard.tsx` → flex-column layout (fix spacing), sequential phrase highlight (no scan bar), tags fly from measured phrase positions to the row.
  - `BrainStill.tsx` (reduced-motion/no-JS) → the settled radial brain with the note already an ordinary node.
- Re-run the full flow: build + Playwright beat shots (arrive / sorted / big-node-at-center / drop+part / settled-normal) + reduced-motion + mobile, zero console errors.

## Next step
Rewrite the v1 spec + plan to v3 (or supersede them), then re-implement via subagent-driven development, replacing the v1 animation. The section shell, wiring, `core-note.ts`, copy, and fallback strategy can be reused; the graph layout, timeline, and card interaction are the parts that change.
