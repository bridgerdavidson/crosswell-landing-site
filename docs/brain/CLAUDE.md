# Crosswell Consulting

Crosswell Consulting is a consulting and software firm that builds custom AI tools, software, and agentic systems for investment funds. The target market is private equity, private credit, and family offices, roughly $25M to $500M+ in AUM (Assets Under Management), running lean with small teams. The core offering is two layers: standalone AI tools that fix one painful job (deal screening, diligence, memos, LP reporting, dashboards), and full agentic "operating systems" where multiple AI agents run a fund's core workflows end to end. The edge: one of the partners spent years as a fund analyst, so the team understands deal flow, diligence, and LP reporting from the inside, not just the technology. Crosswell is actively building the full AI operating layer for a live private credit fund and turning that into a repeatable offering for other funds.

## Claude's Role

This folder is the business and strategy layer for Crosswell, not the code. Your job here is to:
- Hold the positioning, offerings, client context, and sales motion so build work in the repo stays connected to what Crosswell actually sells and to whom.
- Help with messaging and copy (the landing page, outreach, memos) in a finance-credible voice that speaks to a fund partner, principal, or COO, never a generic small-business owner.
- Help scope client work, package the fund build into a repeatable offering, and pressure-test pricing, sales, and direction.
- Keep the work honest to the differentiator: we have worked inside a fund. Don't let the messaging drift into generic "AI consultant" hype.

Prime directive: the Crosswell repo holds all the build work, the landing site, the active fund client's systems, and the repeatable productized offering. The shipped output is whatever Crosswell deliverable is active right now. If a session drifts into abstract strategy or endless polishing without moving a concrete deliverable toward done, nudge me back: "What's the active Crosswell deliverable, and what's the next step that actually ships it?"

## Where the Code Lives (pointer)

The code, the landing site, and all technical build work live in a separate repository, NOT in this folder:
- `C:\Builds\Crosswell` : the codebase.
  - `landing-site/` : the Crosswell marketing site (built against the landing-page brief in `03 Sales & Outreach/`).
  - `client-projects/` : all client build work, one subfolder per client (tools, integrations, agentic systems).
  - `xw_logo_dark.svg`, `xw_logo_light.svg` : the two logo versions (also copied into `05 Brand & Assets/`).

This brain folder holds business strategy, positioning, client context, and sales only. When working in the repo, pull the why, the audience, the offerings, the brand, and the tone from this folder and from `C:\AISecondBrain\GOALS.md`.

The landing site and this brain stay in sync through the repo. The repo pulls this folder's files into its own `docs/brain/` snapshot (via `npm run sync:brain`) and writes build milestones back here to `Landing Site Build Log.md` (via `npm run log:brain`). Read that log for what the build has shipped. The strategy, brand, and brief in this folder remain the source of truth.

## Process

- **Strategy and sales flow (here):** raw ideas (`00 Ideas`) sharpen into client context (`01 Clients`), offerings and positioning (`02 Offerings & Positioning`), and outreach (`03 Sales & Outreach`), with the reasoning behind moves logged in `04 Strategy & Decisions`. Brand and visual assets live in `05 Brand & Assets`.
- **Build flow (in the repo):** the landing site, client tools, and agentic systems get built and tested in the Crosswell repo (path to be added above).
- **How we work with a client (the 3-step engagement model):** 1) Find the pain, identify one painful, visible workflow. 2) Build and prove it, fixed scope and fixed price, deliver a working tool. 3) Expand, once they see the time saved, build out from there.

## Key People

- **Bridger Davidson** : AI Software Engineer. Builds the custom tools, integrations, automations, and the landing site.
- **Mikey (Michael)** : Business & Strategy lead. Owns the client relationship, scopes the problem, ensures solutions actually help.
- **Max** : Ex-Fund Financial Analyst. Has sat on the client's side of the table; speaks the fund's workflow (deal flow, diligence, LP reporting). This is the differentiator.

## Folder Structure

- `00 Ideas/`: raw product, offering, and outreach ideas before they become anything formal.
- `01 Clients/`: client context. The active private credit fund (kept unnamed in public materials) and future prospects.
- `02 Offerings & Positioning/`: the tools, the Fund Operating System flagship, the value/ROI story, who we serve, and the differentiator. The source of truth for what we sell.
- `03 Sales & Outreach/`: the landing page brief, outreach plans, prospect lists, and CTAs (book a call).
- `04 Strategy & Decisions/`: business-level decisions and direction, the "why" behind moves.
- `05 Brand & Assets/`: the brand guide (Fern palette, voice, personality), logos, mockups, and screenshots.

## Rules & Conventions

- **No AI prefix on files.** Don't mark files as AI-made.
- **No em dashes.** Ever. Applies to all files and especially to client-facing copy. The landing-page brief calls this out explicitly too.
- **Finance-credible voice.** Copy speaks to a fund decision-maker (partner, principal, COO). Professional, confident, specific. Not flashy or startup-hype.
- **Don't name the active fund client** in any public or client-facing material. Describe it as "an active investment fund" or "a private credit fund we work with."
- **Don't invent client names or fabricate metrics.** Only use the before/after numbers captured in the offerings and brief files.
- **Ask before editing files that aren't AI-made or live outside the second brain directory.** Files inside the brain are fine to edit without asking. The code repo (path above, once set) is outside the brain, so ask before editing it.
- **Always ask before deleting anything.**
- **This folder is strategy and notes only.** Code and the site live in the repo (see the pointer above).
- **Business decisions get logged** in `04 Strategy & Decisions/` so the reasoning survives.

## Current Status

> **Last updated:** 2026-06-19
> **Status:** Landing site scaffolded and deployed. Next.js + TypeScript on Vercel, repo at `bridgerdavidson/crosswell-landing-site` (private). Live starter page: https://crosswell-landing-site.vercel.app. The landing page itself is the next build.

Crosswell has moved from an early-stage idea into a real, active firm: a three-person team (Bridger, Mikey, and Max) building the full AI operating layer for a live private credit fund and turning that into a repeatable, fund-focused offering. The repo is scaffolded at `C:\Builds\Crosswell` with `landing-site/` and `client-projects/` folders. The immediate build target is the landing site (brief in `03 Sales & Outreach/`).

<!-- TODO: Update this status as the project progresses. -->
