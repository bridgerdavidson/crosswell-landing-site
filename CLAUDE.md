# Crosswell Landing Site

The marketing site for **Crosswell Consulting**, the firm that builds custom AI tools, software, and automations for investment funds.

This file is the source of truth for working in this repo. Framework rules (Next.js 16 specifics) live in `@AGENTS.md`; read it before writing any page or component code.

---

## Two layers: the brain and this repo

Crosswell is split across two places. Keep the boundary clean.

| Layer | Location | Holds |
|-------|----------|-------|
| **Brain** (the "why") | `C:\AISecondBrain\03 Projects\Crosswell Consulting` | Strategy, positioning, brand, copy source, client context, sales |
| **Repo** (the "build") | `C:\Builds\Crosswell\landing-site` (here) | Code, components, deploy config, the actual site |

The brain is an Obsidian vault (markdown). It is the authority for anything about the business: brand, voice, audience, messaging, value props, proof. This repo is the authority for code and how the site is built. When the two disagree about strategy or copy, the brain wins. When they disagree about implementation, the repo wins.

Never invent positioning, claims, or copy. Pull them from the brain.

---

## Brain sync protocol

The brain and this repo communicate through a synced mirror plus a write-back log. Two commands run the loop.

### Pull (brain into repo)

```bash
npm run sync:brain
```

Mirrors the key brain files into `docs/brain/` (read-only snapshot, committed to the repo). Run it at the start of a working session and any time the brain has changed. After syncing, read brand, voice, positioning, and the page brief from `docs/brain/`, not from memory.

The mirror is a snapshot. The brain itself is always the live source. If something looks stale, re-sync.

### Write-back (repo into brain)

```bash
npm run log:brain -- "what changed"
```

Appends a dated milestone entry to `Landing Site Build Log.md` inside the brain's Crosswell project folder, so the strategy layer always knows what the build has done. Run it on meaningful milestones: scaffolding, shipping page sections, deploys, design or scope decisions. Keep entries specific and finance-credible.

### Rules for touching the brain

- The build log is written by this repo and is safe to append to.
- Do **not** edit other brain files (CLAUDE.md, Brand Guide, Positioning, etc.) without asking. They are the user's hand authored strategy.
- Never copy the brain's private client details into anything public. See the client rule below.

---

## Brand (the "Fern" system)

Warm, earthy, editorial, trustworthy. Deliberately not the aggressive high-tech blue startup look. Full guide: `docs/brain/05 Brand & Assets/Brand Guide.md`.

| Role | Color | Hex |
|------|-------|-----|
| Base / background | Ivory | `#F1EEE6` |
| Primary accent | Fern green | `#4E7A4E` |
| Dark / wordmark | Deep fern | `#3D633D` |
| Neutral | Warm gray | `#B8B2A7` |
| Dark surface | Charcoal | `#3D3A34` |
| Text | Warm near-black | `#1A1915` |

Logos: `docs/brain/05 Brand & Assets/xw_logo_dark.svg` and `xw_logo_light.svg`.

**Voice (non-negotiable):** Specific to fund workflows, not generic. Respect the reader's intelligence and time. Show we have been in the room where the decisions happen. No startup cliches, no buzzwords, no hype. **No em dashes anywhere**, in copy or in repo files.

**Audience:** Fund decision-makers (partners, principals, COOs, IR, analysts) at private equity, private credit, and family office funds with roughly $25M to $500M+ AUM, running lean.

---

## What this site is

A single landing page that sells Crosswell to funds. The full brief (8 sections: hero, problem, what we do, why us, value, how we work, team, final CTA) is at `docs/brain/03 Sales & Outreach/Landing Page Brief.md`. Copy is sourced from `docs/brain/02 Offerings & Positioning/`.

**The landing page itself is not built yet.** It will be planned in a dedicated brainstorming session before any page code is written. This repo is currently scaffold plus brain sync only.

Core CTA throughout the site: **book a call**.

**Never name the active fund client publicly.** Proof and case-study language must stay realistic but unnamed (see `docs/brain/01 Clients/Active Fund Client.md`).

---

## The team

| Person | Role |
|--------|------|
| Mikey | Business and strategy lead |
| Max | Ex fund analyst, the differentiator (we live in both finance and tech) |
| Bridger | AI software engineer |

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config lives in CSS, not `tailwind.config.js`)
- `src/` directory, import alias `@/*`, Turbopack dev
- Deploy target: **Vercel**

### Next.js 16 caution

This is not the Next.js in your training data. Before writing or changing page, layout, or route code, read the relevant guide in `node_modules/next/dist/docs/` and heed `@AGENTS.md`. Do not assume APIs from older versions.

---

## Key paths

```
Brain project root   C:\AISecondBrain\03 Projects\Crosswell Consulting
  Landing page brief   ...\03 Sales & Outreach\Landing Page Brief.md
  Brand guide          ...\05 Brand & Assets\Brand Guide.md
  Positioning          ...\02 Offerings & Positioning\Positioning & Messaging.md
  Offerings            ...\02 Offerings & Positioning\Offerings & Tools.md
  Client proof         ...\01 Clients\Active Fund Client.md
  Build log (write)    ...\Landing Site Build Log.md
Repo mirror (pull)   docs/brain/
Sync scripts         scripts/sync-brain.mjs, scripts/log-to-brain.mjs
```

## Commands

```bash
npm run dev               # start the dev server (Turbopack)
npm run build             # production build
npm run sync:brain        # pull brain context into docs/brain/
npm run log:brain -- "x"  # write a milestone back to the brain
```
