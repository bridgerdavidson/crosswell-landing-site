# Crosswell Landing Site

The public marketing site for Crosswell and Crosswell Core. Rebuilt fresh in July 2026 against the brief at `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/sales-outreach/landing-page-brief.md`, then migrated into this repo on 2026-07-08, replacing the scrapped pre-pivot site (archived in branch `old-site-archive`; only the Fern colors carried over).

## Locked design decisions (2026-07-07 session)

- **Brand name:** Crosswell wordmark, XW monogram as the mark. "Xwell" spelling not adopted.
- **Headline:** "The operating layer for financial stewards."
- **No "coming soon" badge.** The waitlist CTA carries the pre-launch message.
- **Vibe:** Anthropic-inspired. Warm, soft, editorial, approachable, deliberately not tech-company blue. Ivory-dominant canvas with charcoal reserved for two gravity moments (Security, final CTA).
- **Type:** Newsreader (editorial serif, headlines) + Schibsted Grotesk (sans, body and UI; replaced Inter 2026-07-09 as too default). The hierarchy is codified as `type-*` classes in `globals.css` (kicker, display, h2, h3, accent, body); small text is text-sm captions and text-xs labels by convention. The final CTA deliberately reuses `type-display` as a closing bookend.
- **Motion:** animation-rich because the site doubles as a visual aid in face-to-face pitches. Typed chat simulation in How it works, the secured-route diagram in Security (landed 2026-07-09, replacing the rotating vault rings: one dashed line draws from a source node and forks to two endpoints, a shield locks over the junction, then the dash gaps seal shut and the route warms to fern; plays once on scroll-into-view via `TrustDiagram.tsx`, then a quiet relay pulse loops), audience marquee, soft scroll reveals everywhere. All reduced-motion aware and no-JS safe (the diagram server-renders in its finished state).
- **Hero: the rotating woven core (landed 2026-07-09).** A full-viewport ambient background: an AI-generated still of a thread-woven sphere (Higgsfield Nano Banana 2, reference-anchored edits, Bytedance upscale; source generations in the Higgsfield account) rotating in-plane via pure CSS at 450s/revolution. No video and no JS: AI video was tried (Wan 2.7, three rolls) and always read as fabric blowing in wind; a code-drawn SVG replica lost the hand-drawn charm. Key pieces in `globals.css`: multiply blend dissolves the canvas into the ivory page (the level match is baked into the asset via ffmpeg `hqdn3d=1.5:1:0:0,unsharp=5:5:0.6,colorlevels imax 0.92,eq=gamma=0.82` on 2026-07-09: denoise, sharpen the thread edges, clip the mottled canvas to white, then deepen the midtones. The gamma step matters: a bare colorlevels stretch lightens the threads ~9% and reads washed out. Rendered at full opacity), a radial veil keeps copy on clean ivory, a circular mask on the artwork prevents its square corners sweeping into view on near-square viewports, and the rotation pivots on the measured sphere center (50.15% 49.9%) to avoid wobble. Reduced motion gets the still. Asset: `public/hero-core.jpg` (4k). Earlier scrapped attempts (CSS keyframes, GSAP knowledge-flow scene) remain scrapped.
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

The Vercel project `crosswell-landing-site` auto-deploys `main` to production at `crosswell-landing-site.vercel.app`, using the Next.js framework preset with default settings and Root Directory = repo root. No environment variables needed.

Keep `vercel.json` minimal (`cleanUrls` only). Do NOT add `installCommand`, `buildCommand`, or `outputDirectory` overrides: this is a static-export Next.js app, and an `outputDirectory: "out"` override makes the build fail with `NEXT_NO_ROUTES_MANIFEST`. Let the Next.js preset handle the export.

## Content rules honored (from the brief)

No pricing. No internal positioning. No fabricated metrics or client names (chat/hero conversations are labeled illustrative). No em dashes. Finance-credible voice, funds as the hero, trust as the through-line.
