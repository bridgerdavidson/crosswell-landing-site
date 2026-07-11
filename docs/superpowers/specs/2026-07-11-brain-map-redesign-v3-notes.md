# Brain-map section redesign (v3) — decisions to carry into the next session

Status as of 2026-07-11: the v3 motion is **prototyped and approved-in-progress**, but **not yet implemented** in the real section. The current site (on `main`, local, unpushed) still has the **v1** animation from `2026-07-10-behind-the-chat-brain-map-design.md` / `...-plan.md`. This document captures the v3 redesign so a fresh session can resume. It supersedes the v1 *animation* design; the section's purpose, placement, palette, and copy are unchanged.

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
