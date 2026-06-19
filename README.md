# Crosswell Landing Site

Marketing site for **Crosswell Consulting**: custom AI tools, software, and automations for investment funds.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

> The landing page is not built yet. This repo currently holds the scaffold plus the brain sync setup. The page itself will be planned before any page code is written.

## The brain

Strategy, brand, voice, copy, and the landing page brief live in the Crosswell "brain" (an Obsidian vault), not in this repo:

```
C:\AISecondBrain\03 Projects\Crosswell Consulting
```

A read-only snapshot is mirrored into `docs/brain/`. The full working contract (brand, voice, sync protocol, team) is in `CLAUDE.md`. Read it first.

## Develop

```bash
npm install      # if needed
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Brain sync

```bash
npm run sync:brain            # pull brain context into docs/brain/
npm run log:brain -- "note"   # write a build milestone back into the brain
```

## Conventions

- Finance credible voice, specific to fund workflows. No startup hype.
- No em dashes anywhere, in copy or in repo files.
- Never name the active fund client publicly. Keep proof realistic but unnamed.
