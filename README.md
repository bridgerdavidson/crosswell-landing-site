# Crosswell Landing Site

The public marketing site for Crosswell and Crosswell Core. Built fresh on 2026-07-07 against the brief in `../sales-outreach/landing-page-brief.md`. The old `crosswell-landing-site` repo build is scrapped; only the Fern colors carried over.

## Locked design decisions (2026-07-07 session)

- **Brand name:** Crosswell wordmark, XW monogram as the mark. "Xwell" spelling not adopted.
- **Headline:** "The operating layer for financial stewards."
- **No "coming soon" badge.** The waitlist CTA carries the pre-launch message.
- **Vibe:** Anthropic-inspired. Warm, soft, editorial, approachable, deliberately not tech-company blue. Ivory-dominant canvas with charcoal reserved for two gravity moments (Security, final CTA).
- **Type:** Newsreader (editorial serif, headlines) + Inter (sans, body and UI).
- **Motion:** animation-rich because the site doubles as a visual aid in face-to-face pitches. Typed chat simulation in How it works, rotating vault rings in Security, audience marquee, soft scroll reveals everywhere. All reduced-motion aware and no-JS safe.
- **Hero animation: REMOVED 2026-07-07, starting over.** Two versions were built (CSS keyframes, then a GSAP knowledge-flow scene) and scrapped; the hero is a clean centered composition until the animation is redesigned from scratch. The concept brief for the next attempt: make Core feel real and inevitable, warm and editorial, not tech-flashy. GSAP was uninstalled; re-add it (or another tool) when the redesign starts.
- **CTAs:** mailto for both waitlist and book-a-call. Address lives in `src/lib/site.ts` (TODO: confirm final email).
- **Team:** text-only cards, one trust-earning line each. Photos later if wanted.

## Page order

Nav, Hero, How it works (+ chat demo), Why Crosswell, The value (time back), Security (dark), Beyond Core, Who it's for (marquee), Team, Final CTA (dark), Footer.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (fully static)
```

## Deploy

Point the existing Vercel project at this repo with Root Directory set to `projects/crosswell-consulting/landing-site`. Framework preset: Next.js. No environment variables needed.

## Content rules honored (from the brief)

No pricing. No internal positioning. No fabricated metrics or client names (chat/hero conversations are labeled illustrative). No em dashes. Finance-credible voice, funds as the hero, trust as the through-line.
