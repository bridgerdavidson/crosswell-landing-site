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
- No uppercase text anywhere. Section labels are sentence case.
- No security, compliance, or hosting claims.

## Stack & run

Next.js 15 + React 19 + Tailwind v4 + TypeScript, static export (`output: "export"`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build into out/
npm test             # unit tests
npm run test:e2e     # build + e2e/browser tests
npm run check:copy   # copy guard on src/
```

## Deploy (read before touching build config)

The Vercel project `crosswell-landing-site` auto-deploys `main` to production at `crosswell-landing-site.vercel.app`, using the **Next.js framework preset with default settings** (Vercel Node 24.x), Root Directory = repo root.

**Do not add `installCommand`, `buildCommand`, or `outputDirectory` to `vercel.json`.** This is a static-export Next.js app and the Next.js preset already handles it. An earlier `outputDirectory: "out"` override made the build fail with `NEXT_NO_ROUTES_MANIFEST` (the Next builder looks for its route manifest in the overridden directory). Keep `vercel.json` to `cleanUrls` only.

## Current focus: the general-market redesign

The site moved off funds to a general market in September 2026 and became product-led: a run of six dashboard chapters in Linear's model, restyled to this site's editorial materials. The spec is `docs/superpowers/specs/2026-09-12-general-market-redesign-design.md` and the design-system reference is `docs/design-system.md`. The plumbing plan ships every chapter's finished state; choreography and polish run through the user-level `design-loop` skill piece by piece. GSAP is installed and is the one motion library.

Inside a product frame, the only text allowed is what the product would show its own user. Everything descriptive lives outside the frame.

Open TODO: confirm the contact email in `src/lib/site.ts` (all CTAs are mailto links).

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`); existing history uses a `Co-Authored-By` trailer.
- The pre-pivot site is archived in branch `old-site-archive` and tag `old-site-pre-pivot`.
- No auto-sync here (that hook lives only in the brain). Commit and push normally; Vercel deploys `main` on push.
