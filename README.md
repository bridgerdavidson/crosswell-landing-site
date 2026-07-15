# Crosswell Landing Site

The public marketing site for Crosswell and Crosswell Core. Rebuilt fresh in July 2026 against the brief at `/Users/bridgerdavidson/ai-os/projects/crosswell-consulting/sales-outreach/landing-page-brief.md`, then migrated into this repo on 2026-07-08, replacing the scrapped pre-pivot site (archived in branch `old-site-archive`; only the Fern colors carried over).

## Locked design decisions (2026-07-07 session)

- **Brand name:** Crosswell wordmark, XW monogram as the mark. "Xwell" spelling not adopted.
- **Headline:** "The operating layer for financial stewards."
- **No "coming soon" badge.** The waitlist CTA carries the pre-launch message.
- **Vibe:** Anthropic-inspired. Warm, soft, editorial, approachable, deliberately not tech-company blue. Ivory-dominant canvas with charcoal reserved for two gravity moments (Security, final CTA).
- **Type:** Newsreader (editorial serif, headlines) + Schibsted Grotesk (sans, body and UI; replaced Inter 2026-07-09 as too default). The hierarchy is codified as `type-*` classes in `globals.css` (kicker, display, h2, h3, accent, body); small text is text-sm captions and text-xs labels by convention. The final CTA deliberately reuses `type-display` as a closing bookend.
- **Motion:** animation-rich because the site doubles as a visual aid in face-to-face pitches. The Core dashboard tour in How it works (dark product frame; a cursor-driven GSAP take across four views: a meeting transcript ingests itself in Add to the brain, the cursor sends a question in Chat and gets a cited answer, clicking the citation opens the source note in Library, and a June report builds in Analytics; plays once on scroll-into-view via `core-dashboard/CoreDashboard.tsx`, replayable, and reduced-motion or no-JS rest on the answered Chat view), the secured-route diagram in Security (landed 2026-07-09, replacing the rotating vault rings: one dashed line draws from a source node and forks to two endpoints, a shield locks over the junction, then the dash gaps seal shut and the route warms to fern; plays once on scroll-into-view via `TrustDiagram.tsx`, then a quiet relay pulse loops), audience marquee, soft scroll reveals everywhere. All reduced-motion aware and no-JS safe (the diagram server-renders in its finished state).
- **Hero: the rotating woven core (landed 2026-07-09).** A full-viewport ambient background: an AI-generated still of a thread-woven sphere (Higgsfield Nano Banana 2, reference-anchored edits, Bytedance upscale; source generations in the Higgsfield account) rotating in-plane via pure CSS at 450s/revolution. No video and no JS: AI video was tried (Wan 2.7, three rolls) and always read as fabric blowing in wind; a code-drawn SVG replica lost the hand-drawn charm. Key pieces in `globals.css`: multiply blend dissolves the canvas into the ivory page (the level match is baked into the asset via ffmpeg `hqdn3d=1.5:1:0:0,unsharp=5:5:0.6,colorlevels imax 0.92,eq=gamma=0.82` on 2026-07-09: denoise, sharpen the thread edges, clip the mottled canvas to white, then deepen the midtones. The gamma step matters: a bare colorlevels stretch lightens the threads ~9% and reads washed out. Rendered at full opacity), a radial veil keeps copy on clean ivory, a circular mask on the artwork prevents its square corners sweeping into view on near-square viewports, and the rotation pivots on the measured sphere center (50.15% 49.9%) to avoid wobble. Reduced motion gets the still. Asset: `public/hero-core.jpg` (4k). Earlier scrapped attempts (CSS keyframes, GSAP knowledge-flow scene) remain scrapped.
- **CTAs:** mailto for both waitlist and book-a-call. Address lives in `src/lib/site.ts` (TODO: confirm final email).
- **Team (photos landed 2026-07-14).** Portrait cards, one trust-earning line each. Real headshots live at `public/team-{max,bridger,michael}.jpg`. Sources are square, so the card image is `aspect-square` on mobile (uncropped, honest to the source) and `sm:aspect-4/5` on the 3-up desktop grid, where the taller box crops the sides only and leaves headroom intact. Assets are downscaled to 760px (covers the ~362px desktop card at 2x) at quality 82. Michael's source was framed waist-up while the other two are chest-up, so it is pre-cropped to a 730px square (`sips -c 730 730 --cropOffset 29 125`, a ~1.4x zoom) before the downscale; that lands all three heads at ~40-44% of frame height so they read as one set. Any replacement headshot should be matched to that head-height ratio, not just dropped in. Card chrome deliberately matches the BeyondCore cards (`rounded-2xl`, `border-warmgray/40`, `shadow-whisper`, `p-7`, `hover:shadow-lifted`). Team keeps its parchment ground and ivory cards, pairing it with Edge, even though that inverts BeyondCore's lighter-card-on-ivory idiom; the photo carries the card, so the inversion does not read.

- **The turtleneck easter egg.** The golden-hour set is normalized the same way the real set is, but to its own target: head ~51% of frame height, hair-top ~9% down, which lands every crop bottom on the turtleneck collar. The three sources arrived at different zooms (Bridger ~39% head, Michael ~44%, Max ~49%), and since a crop can only tighten, Max's framing set the target and the other two crop in to meet it. Bridger's source has the least headroom of the three, which is what pins the target's headroom to ~9%; a looser target would run his crop off the top of the image. Regenerate from the 1024px originals, never from the 760px assets: `sips -c 802 802 --cropOffset 0 64` (Bridger), `-c 1002 1002 --cropOffset 22 22` (Max), `-c 895 895 --cropOffset 45 78` (Michael), each then `-Z 760 -s formatOptions 82`.

  Typing `turtleneck` anywhere on the page flips the headshots to that set on a staggered 3D turn; typing it again flips back and a reload always restores the real photos (state is React-only, never persisted, so the site cannot be left in joke mode in front of a prospect). The trigger is a keydown buffer in `Team.tsx` with no visible affordance, which is deliberate: anything clickable in the layout risks a fund partner tripping it mid-demo. The alt set is fetched only after the code fires and is decoded before the flip starts, so an ordinary visit never pays for it and the back face is never blank. **This is obscurity, not access control**: the alt JPEGs sit at public URLs and the code word is in the JS bundle, so it hides the joke from casual visitors, nothing more. Do not put anything actually sensitive behind it.

## Page order

Nav, Hero, How it works (+ dashboard tour), Why Crosswell, The value (time back), Security (dark), Beyond Core, Who it's for (marquee), Team, Final CTA (dark), Footer.

## Next up

- **"How it's built" backend section.** After the dashboard tour ships: a section showing the infrastructure clients are actually paying for, how their files are stored, tagged, linked, and kept, so Core reads as a brain with a front door rather than a chatbot. Idea logged in the brain at `ai-os/projects/crosswell-consulting/ideas/landing-site-backend-section.md`.

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
