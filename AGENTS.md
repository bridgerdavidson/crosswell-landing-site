<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Crosswell Landing Site: project context

This repo is the marketing site for Crosswell Consulting (custom AI tools for investment funds). Full working rules, brand, and the brain sync protocol are in `CLAUDE.md`. Read it first.

Essentials for any agent:

- **Strategy and copy live in the brain**, not here: `C:\AISecondBrain\03 Projects\Crosswell Consulting`. A synced snapshot is in `docs/brain/`. Run `npm run sync:brain` to refresh it; read brand, voice, and the page brief from there. Never invent positioning.
- **Write build milestones back to the brain** with `npm run log:brain -- "what changed"`.
- **Brand voice:** finance credible, specific to fund workflows, no startup hype. No em dashes anywhere, in copy or in repo files.
- **Never name the active fund client publicly.** Keep proof realistic but unnamed.
- The landing page is not built yet. It will be planned before any page code is written.
