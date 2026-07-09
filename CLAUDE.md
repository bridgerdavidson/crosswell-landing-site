# Crosswell Landing Site

The public marketing site for Crosswell and its flagship product, Crosswell Core. A static Next.js app (App Router, `output: "export"`). This repo is the code only; the strategy, brand, and copy source of truth lives in the AI second brain.

## Strategy & brand context (source of truth: the brain)

This repo holds no strategy. Before writing copy or making design calls, pull context from the brain:

- **Brief** (content + structure spec for this site): `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/sales-outreach/landing-page-brief.md`
- **Brand guide** (Fern palette, voice, personality): `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/brand-assets/brand-guide.md`
- **Company overview, offerings, positioning**: `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/offerings-positioning/`
- **Crosswell strategy layer**: `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/CLAUDE.md`
- **Locked design decisions for this build**: `README.md` in this repo.

## Voice & content rules

- Finance-credible voice: serious, specific, confident. Speak to a fund decision-maker (partner, principal, COO). Never generic "AI consultant" hype.
- Funds are the hero; trust is the through-line. AI is the vehicle, never the headline.
- **No em dashes. Ever.**
- No pricing, no fabricated client names or metrics. Any illustrative hero/chat copy is labeled illustrative.
- The brand name is the **Crosswell** wordmark (the "Xwell" spelling is not used).
- No AI prefix on files; do not mark files as AI-made.

## Stack & run

Next.js 15 + React 19 + Tailwind v4 + TypeScript, static export (`output: "export"`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build into out/
```

## Deploy (read before touching build config)

The Vercel project `crosswell-landing-site` auto-deploys `main` to production at `crosswell-landing-site.vercel.app`, using the **Next.js framework preset with default settings** (Vercel Node 24.x), Root Directory = repo root.

**Do not add `installCommand`, `buildCommand`, or `outputDirectory` to `vercel.json`.** This is a static-export Next.js app and the Next.js preset already handles it. An earlier `outputDirectory: "out"` override made the build fail with `NEXT_NO_ROUTES_MANIFEST` (the Next builder looks for its route manifest in the overridden directory). Keep `vercel.json` to `cleanUrls` only.

## Current focus: the hero

The hero is mid-redesign. It is currently a clean centered text composition (headline, subline, CTAs) in `src/components/Hero.tsx`. Two animation attempts were built, deployed, and scrapped as not good enough: CSS keyframes, then a GSAP knowledge-flow scene. GSAP was uninstalled; re-add an animation tool when the redesign starts.

Concept brief for the next attempt: make Core feel real and inevitable, warm and editorial, not tech-flashy. The full design record and page order are in `README.md`.

Open TODO: confirm the contact email in `src/lib/site.ts` (all CTAs are mailto links).

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`); existing history uses a `Co-Authored-By` trailer.
- The pre-pivot site is archived in branch `old-site-archive` and tag `old-site-pre-pivot`.
- No auto-sync here (that hook lives only in the brain). Commit and push normally; Vercel deploys `main` on push.
