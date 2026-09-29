# Insights: design spec

Date: 2026-09-29
Status: draft for review, brainstormed and approved section by section in session
Builds on: the general-market redesign spec (2026-09-12), which held `/insights` as an empty slot. Branch `insights`, cut from `team-page` because the people file below feeds the rebuilt team page.

## 1. Purpose

Turn `/insights` from a held slot into a working publication: the place the Crosswell team shares its research and what it is learning, written to teach rather than to sell. Anyone on the team can publish a post by pointing a repo command at a note they wrote in the team vault, previewing the real page locally, and opening one pull request. Merging the pull request publishes the post.

Success looks like this:

- Publishing a post is one command, one local preview, and one PR. Nobody hand-edits layout code.
- A stranger finds a post through a search, or an AI assistant's answer, that nobody paid for.
- Every post reads as part of this site: its grid, its type, its copy rules.
- A malformed post can never reach production. The build fails with a message the author can act on, and the last good deploy stays live.

## 2. Where this came from, and what changed

Max's content-engine brief (August 2026) set the shape, pointing at Accenture's [How agentic AI is redefining private equity in 2026](https://www.accenture.com/us-en/blogs/strategy/ai-redefining-private-equity) as the thing our buyers were reading instead of us. From it this build keeps: a named human author with a real title and a LinkedIn link; the argument up front and the detail after; related posts at the foot; one call to action per page; static files, no CMS, no database; HTML, never PDF; readable on a phone; SEO basics done properly. It leaves the subscribe funnel, gated downloads, and the enterprise consultant voice.

Max's blog notes add the post anatomy: an answer in the opening paragraph, a key-takeaways box, question-phrased section headings, sourced statistics, a visible FAQ, one chart where a post has one, visible published and updated dates, and a site checklist (Article and FAQPage schema as hygiene, AI crawlers explicitly allowed, no `llms.txt`).

Decided in session, 2026-09-29 (Bridger):

| Question | Decision |
|---|---|
| Audience | General market, matching the September pivot. The brief's fund-first framing is superseded. |
| The security article in the brief's queue | Cut for now. |
| Publishing flow | One file (plus any images) and one PR. Bridger approves; merge publishes. |
| Scheduler | None yet. One is coming, so the build leaves a single seam for it (section 8). |
| Cadence | None. The whole team posts research when they have it. |
| Source of truth | Once published, the post file in this repo is the source of truth, not the vault note. |
| How posts get written | In the vault, as now. A repo command converts, checks, previews, and opens the PR. |
| Author block | Name, role, LinkedIn, and one factual line. No bio. |
| Images | An optional cover per post. Without one, the share card is generated from the title and author. |
| Format | Plain Markdown with frontmatter, rendered at build. Not MDX, not a content-layer library. |
| Article layout | The site's own grid with a sticky rail (layout B). |
| How a post ends | Quiet: one line and a button beside the author. No dark closing band. |
| Index layout | The newest post featured, everything older as a list. |
| Titles and headings | Sentence case, like the rest of the site. |

## 3. Content model

### Files

- A post is `content/insights/<slug>.md`. The filename is the URL: `/insights/<slug>`.
- The slug matches `^[a-z0-9]+(-[a-z0-9]+)*$`, is at most 80 characters, and is permanent once published. Changing it breaks every link already shared.
- A post's images live in `public/media/insights/<slug>/`, served at `/media/insights/<slug>/<file>`. They do not live in `public/insights/<slug>/`, which would put a folder beside the exported `insights/<slug>.html` page.
- The loader skips `content/insights/README.md` (the format reference, section 10) and any file whose name starts with `_`.
- The content directory defaults to `content/insights` and can be overridden with the `INSIGHTS_DIR` environment variable (the e2e build uses it, section 12).

### Frontmatter

```yaml
title: What does your firm keep after AI finishes the work?
description: One line. The index card, the meta description, and the share preview.
author: max
published: 2026-10-06
updated: 2026-10-20
takeaways:
  - First takeaway.
  - Second takeaway.
cover: cover.jpg
coverAlt: What the cover image shows, for someone who cannot see it.
related: [another-post, a-third-post]
```

| Field | Required | Rule |
|---|---|---|
| `title` | yes | Plain text, sentence case. |
| `description` | yes | At most 160 characters. |
| `author` | yes | An id in `src/lib/people.ts`. One author per post. |
| `published` | yes | `YYYY-MM-DD`, not later than the build date (compared in UTC, which is never behind Arizona's date). |
| `updated` | no | `YYYY-MM-DD`, on or after `published`. Set only for substantive changes. |
| `takeaways` | no | 2 to 5 short items when present. |
| `cover` | no | A `.jpg` or `.png` in the post's media folder (the share-card renderer cannot read WebP). |
| `coverAlt` | with `cover` | Required whenever `cover` is set. |
| `related` | no | Up to 3 existing slugs, never the post's own. |

Unknown fields fail validation, so a typo like `publised` cannot pass silently.

### Body

GitHub-flavored Markdown, with these conventions:

- Sections are `##` headings; `###` is a subsection. A `#` heading in the body fails validation (the title comes from frontmatter), as does anything deeper than `###`.
- Question-phrased `##` headings are the house style. The publishing command nudges toward them; the build does not enforce them.
- **FAQ:** a `## Frequently asked questions` section (matched case-insensitively) whose `###` headings are the questions and whose following paragraphs are the answers. It renders as visible HTML and feeds the FAQPage schema from the same parse. The section must hold at least one question.
- **Images:** `![alt text](file.png "Optional caption")`. The path resolves inside the post's media folder, the file must exist, alt text is required, and the title becomes the caption.
- **Links:** sources are ordinary links. External links get `rel="noopener noreferrer"` and open in a new tab.
- Lists, tables, blockquotes (rendered as pull quotes), and footnotes (a numbered notes list at the end of the body) are supported.
- Raw HTML fails validation rather than being dropped silently.

### Charts

A fenced block with the language `chart` holds data only:

````markdown
```chart
type: line
title: Share of U.S. employees using AI in their role
unit: "%"
source: Gallup, 2026
sourceUrl: https://www.gallup.com/workplace/704225/rising-adoption-spurs-workforce-changes.aspx
data:
  2023: 21
  2026: 50
```
````

| Field | Required | Rule |
|---|---|---|
| `type` | yes | `line` or `bar`. |
| `title` | yes | Shown above the chart. |
| `unit` | no | A suffix on values and axis labels (`%`, ` hrs`). |
| `source` | yes | Shown under the chart. |
| `sourceUrl` | yes | The source's link. Every statistic on the site is sourced. |
| `data` | yes | 2 to 12 label and number pairs, in display order, each value zero or more. |

Charts render at build as static inline SVG in the Fern palette (a fern line or bars, hairline gridlines, the first and last values labeled, the source as a caption), matching the drawing approved in session. They ship no client JavaScript.

### People

`src/lib/people.ts` holds everyone who can appear on the site:

```ts
export type Person = {
  id: string;
  name: string;
  role: string;
  line?: string;       // one factual line on what they work on at Crosswell
  linkedin?: string;   // full URL
  portrait?: string;   // path under public/, absent until photographs exist
};
```

The team page (`Team.tsx`) reads from this file instead of its inline array, keeping its order and its placeholders, so a role or photo changes in one place. The LinkedIn link is omitted when `linkedin` is absent.

**One photo per person, used everywhere.** Each person's photograph is one file, `public/team/<id>.jpg`, named in `portrait`. Adding it is the only step: the team page and every place a post shows its author (the rail, the byline below lg, the end block, the index's featured post and list rows) pick it up on the next build, with no change to any post. A single `Portrait` component renders it in every place: the team page's 4:5 frame, and a round crop for the author placements (`object-fit: cover`, focused on the upper third of the 4:5 photo, where the face sits). Until a photo exists, `Portrait` draws the same placeholder the team page shows today.

## 4. Loading and rendering

All of this runs at build time. None of it ships to the browser.

### Modules (`src/lib/insights/`)

| Module | Does |
|---|---|
| `load.ts` | Reads the content directory, calls `parsePost` for each file, checks that every related slug is a post (filenames are the slugs, so the file system already rules out duplicates), sorts newest first by `published`, ties broken by slug. Exports `getAllPosts()` and `getPost(slug)`. |
| `parse.ts` | `parsePost(filename, source, people, mediaExists)`: pure. Parses frontmatter and body, validates, returns a `Post` or throws an `InsightError`. |
| `render.tsx` | Turns a post's Markdown tree into React elements with the site's components. |
| `chart.ts` | Parses and validates a chart block's data. |
| `faq.ts` | Extracts FAQ items from the body tree. |
| `related.ts` | Picks a post's related posts. |
| `jsonld.ts` | Builds the Article and FAQPage objects. |

`parsePost` takes `mediaExists` as a function so unit tests do not touch the disk.

### Validation errors

Every error is an `InsightError` whose message follows one pattern: `<file>: <field>: <what is wrong>. <how to fix it>.` Examples:

- `content/insights/what-firms-keep.md: author: "maxx" is not in src/lib/people.ts. Known ids: max, bridger, michael.`
- `content/insights/what-firms-keep.md: chart 2 ("AI use by year"): data value "fifty" is not a number.`
- `content/insights/what-firms-keep.md: published: 2026-11-02 is after today. The site only rebuilds on merge, so a future date does not schedule anything; use today's date.`

### Pipeline

remark-parse, remark-gfm, remark-smartypants (with dashes off, so a typed `--` never becomes an em dash), then our own transform (gives every heading its id from one github-slugger, so the outline's links and the headings' ids cannot disagree; turns `chart` code blocks into chart nodes; wraps the FAQ section; resolves images into the media folder), then remark-rehype, then `hast-util-to-jsx-runtime` with a component map: headings, links, images and captions, tables, blockquotes, chart nodes to `Chart`, the FAQ to `Faq`. remark-smartypants curls every straight apostrophe and quote, so authors never type a typographic one. Frontmatter text (title, description, takeaways, alt text) goes through retext-smartypants, the same curling without Markdown parsing.

### New dependencies

Runtime (build only): `gray-matter`, `yaml`, `unified`, `remark-parse`, `remark-gfm`, `remark-smartypants`, `remark-rehype`, `retext`, `retext-smartypants`, `github-slugger`, `mdast-util-to-string`, `unist-util-visit`, `hast-util-to-jsx-runtime`. Dev: `tsx` (runs the two scripts with the repo's path aliases), `@types/mdast`, `@types/hast`, `@fontsource/newsreader`, `@fontsource/instrument-sans` (the share cards' fonts, as `.woff`).

## 5. Routes

| Route | File | Notes |
|---|---|---|
| `/insights` | `src/app/insights/page.tsx` | The index. |
| `/insights/<slug>` | `src/app/insights/[slug]/page.tsx` | `generateStaticParams` from the loader, `dynamicParams = false`, `generateMetadata` per post. With zero posts it returns one placeholder, `_none`, whose page is the site's not-found page: a static export refuses a dynamic route with no params (confirmed by a probe build), and `_` can never start a real slug. |
| share card | `public/media/insights/<slug>/card.png` | Written by `scripts/insight-cards.ts`, which `npm run build` runs before `next build`. Git-ignored, regenerated every build. |

## 6. Page design

The drawings approved in session are the reference. Measurements below are at 1440 wide.

### Article, lg and up

- **Header.** The site's `Band`: label "Insights" (linking to `/insights`) and the title in the left column, the title as the page's only `h1`; the description as the lede in the right column.
- **Cover** (when present): the full page-column width under the band, a 2:1 crop, rounded like the site's frames, `coverAlt` as its alt text.
- **Body.** The left column, at most about 620 wide (near 68 characters a line at 18). In order: the takeaways box (fern-wash ground, the site's larger radius, label "Key takeaways"), then the body. Body text is 18 on 1.65; `##` headings in the serif near 30; links fern-deep and underlined; tables with ink hairlines; pull quotes in the serif accent; figures with captions in the label size; the FAQ as hairline-separated rows (question at 18 semibold, answer at 17).
- **Rail.** The right column, sticky just under the nav: the author (portrait, name, role in fern-deep, the one line, LinkedIn), the dates ("Published", and "Updated" when present), then "On this page": the `##` headings as links, the current section marked with a fern bar. The marker is a small client component (an IntersectionObserver), the only new client JavaScript on the page. Its links scroll the way the nav does, pinning the heading just below the nav and writing no hash to the URL (Safari jumps to a persistent hash on every reload). Headings keep their ids, so a pasted `#anchor` link still works.
- **Motion.** The body does not use the scroll reveal: text should not fade in while someone reads it. The index rows and the end sections use the site's `Reveal`.
- **End.** A hairline, then on the grid: "Written by" and the author block (a larger portrait, the name in the serif accent, role, line, LinkedIn) in the left column; the quiet line and a "Set up a call" button (`CallLink`) in the right. Then a hairline and "Keep reading": up to three related posts across, each with title (serif accent), description, author, and month. The section is omitted when there are no other posts. Then the footer. No `FinalCta` band.

### Article, below lg

- The rail folds into a byline under the title: portrait, name, published date. The outline is dropped.
- Everything stacks in one column; related posts stack; the author block and the call stack.
- No horizontal scroll at 390.

### Index

- The existing band, with its title as the page's `h1` and a new lede (section 13).
- **Newest post, featured:** on the grid, the label "Newest", the title in the serif near 40, the description, and the author's portrait, name, and date in the left column; the cover at 4:3 in the right column when there is one. Without a cover, the title block runs the full width.
- **Everything older:** hairline rows on the grid, title (serif near 30) and description in the left column, author and date in the right.
- **States:** zero posts shows today's held slot unchanged, so this build can merge before any post is cleared. One post shows the featured slot alone.

## 7. Components

`src/components/insights/`: `PostFeatured`, `PostRow`, `ArticleHeader`, `ArticleByline` (below lg), `ArticleRail`, `ArticleOutline` (client), `Takeaways`, `ArticleBody` (the long-form text styles, built from the existing `type-*` tokens), `Chart`, `Faq`, `AuthorBlock`, `ArticleEnd` (author plus the call), `RelatedPosts`.

`src/components/Insights.tsx` becomes the index band and takes the post list.

`src/components/Portrait.tsx` (shared, section 3): a person's photo or the placeholder, in the team frame or the round author crop. `Team.tsx` and every author placement render through it.

## 8. The call to action and the scheduler seam

A new `src/components/CallLink.tsx` renders the site's call link. Today it is an anchor to `CALL_MAILTO` with the caller's children and classes. Every place that links to the call moves onto it in this build: the nav (both links), the hero, `FinalCta`, `ComingSoon`, the contact page, the how-we-start cards (their `action` becomes a flag the card renders as `CallLink`), and the article end.

When the scheduler exists, `CallLink` is the one file that changes, whether it becomes a link to a booking page or opens an inline embed, and every call on the site follows. Button labels stay "Set up a call", never "Book a call", per the messaging handoff.

## 9. Search and share previews

- **Metadata.** `pageMetadata()` gains an `article` option (published and modified times, author name). With it the page's Open Graph type is `article` and the site-wide `og-image.jpg` is not emitted, so the post's own card is the only image. Title: `<post title> | Crosswell`. Description: the frontmatter's. Canonical: the existing `Canonical` component.
- **Share card.** `scripts/insight-cards.ts` renders each post's card with `next/og`'s `ImageResponse` (it runs outside Next, confirmed by a probe) to `public/media/insights/<slug>/card.png`: with a cover, the cover cropped to 1200 by 630; without one, the typographic card in the style of the existing `og-image.jpg` (ivory ground, the dark lockup, the title in Newsreader, the author's name under it). The fonts are the Fontsource packages' `.woff` files, read from `node_modules`, so building a card needs no network. Both `og:image` and `twitter:image` name the card; a probe showed a page otherwise inherits the site-wide `twitter:image`. The card is a real `.png` because `next/og`'s `opengraph-image.tsx` route exports an extension-less file, which a static host serves without an image content type.
- **Structured data.** One `<script type="application/ld+json">` per article: an `Article` (headline, description, `datePublished`, `dateModified`, `author` as a `Person` with name and LinkedIn URL, Crosswell as `publisher`, the share image, `mainEntityOfPage`), plus an `FAQPage` when the post has an FAQ, built from the same FAQ parse as the visible rows.
- **Sitemap.** `sitemap.ts` adds every post, `lastModified` from `updated`, else `published`.
- **Robots.** `robots.ts` keeps the allow-all rule and adds explicit allow rules for `GPTBot`, `ClaudeBot`, and `PerplexityBot`. No `llms.txt`.

## 10. The publishing command

### Where it lives

`.claude/skills/publish-insight/SKILL.md`, committed. An author runs `/publish-insight <path to the note>` in Claude Code from their checkout of this repo. The repo is public, so the skill names no vault paths, clients, or internal figures.

`content/insights/README.md` is the format reference (section 3, written for a person), and the skill points to it rather than repeating it.

### One-time setup per author (`docs/publishing-insights.md`)

- A clone of this repo, `npm install`, Claude Code, `gh` signed in.
- Write access to the repo. Max has it; Michael needs an invite.
- The never-publish file: `.claude/never-publish.local.txt`, one term per line (client names, internal figures, anything else that must never appear). It is git-ignored through a new `*.local.*` rule in `.gitignore`. Max keeps the master list in the team vault; each author copies it. **If the file is missing, the command stops**, so the check can never be skipped silently.

### What the command does

1. **Converts the note** into the post format:
   - The title from the note's `#` heading, in sentence case, keeping proper nouns and acronyms (SEC, Gallup, ChatGPT).
   - The description from the dek. Longer than 160 characters: the command proposes a shorter one and asks.
   - The author from the byline, mapped to a people id; asks when ambiguous.
   - "Key takeaways" to `takeaways`; a bold-question FAQ to `###` questions under `## Frequently asked questions`.
   - Chart data described in the note's build notes to a `chart` block. The author confirms the numbers against the source.
   - Obsidian image embeds copied into the media folder and rewritten as Markdown images. Asks for alt text where there is none.
   - Drops vault-only material: draft banners and callouts, breadcrumb lines, wiki links (a link to an already-published post becomes a site link), build notes, notes addressed to reviewers, the byline line.
   - Sentence case on `##` and `###` headings.
   - Proposes a short slug (at most six words) and asks the author to confirm.
2. **Screens the content.** A never-publish term anywhere stops the run and lists every hit. The author decides on each of these flags: em dashes (with a proposed rewrite for each), claims about Crosswell's security, compliance, or hosting (a standing site rule), pricing, client names or client metrics, statistics without a linked source, and the word "brain" used for the product (the product is the Core).
3. **Runs the checks.** `npm run check:copy` and `npm run check:insights`.
4. **Previews locally.** Starts the dev server (reads the real port from its log, since 3000 is often taken), opens `/insights/<slug>`, and loops on the author's requests. "Re-sync" re-converts from the edited note. Nothing is committed until step 5.
5. **Ships on an explicit "ship it".** Creates branch `insights/<slug>`, commits `feat: publish "<title>"` with the repo's trailer, pushes, and opens the PR with `gh pr create`. The PR description lists the checks run and every flag the author accepted. Bridger reviews the PR and its Vercel preview; merging publishes.

### Updating a published post

The same command on an existing slug starts from the repo file, which is now the source of truth. Pulling in a revised vault note shows the diff before anything is written. The command sets `updated` only when the author says the change is substantive. The slug never changes. The commit is `fix: update "<title>"`.

## 11. House rules, applied to posts

- **Em dashes:** none. `check-copy.mjs` walks `.md` files and applies the em dash rule to them; `check:copy` runs over `src` and `content`.
- **Apostrophes and quotes:** curled at build by remark-smartypants, so `.md` files are exempt from the straight-apostrophe rule.
- **Uppercase:** none, in copy or CSS. The article styles use no `text-transform`.
- **Sentence case** for titles and headings.
- **No security, compliance, or hosting claims about Crosswell**; no pricing; no client names or metrics. The command flags these; review is the gate.
- **Audience:** the general market. Posts teach and share research; the call to action stays quiet.

## 12. Testing

### Unit (vitest, `tests/unit/`)

- `insights-parse.test.ts`: a valid post parses to the expected `Post`; each rule in section 3 fails with its own message (missing field, unknown field, unknown author, description too long, bad or future date, `updated` before `published`, cover without alt, missing image file, bad slug, `#` in the body, raw HTML, empty FAQ).
- `insights-load.test.ts`: unknown related slugs fail; posts sort newest first; `README.md` and `_` files are skipped; zero posts returns an empty list.
- `insights-render.test.ts`: apostrophes and quotes are curled; a chart block becomes a chart node with parsed data, and a malformed one names the post and chart; FAQ items are extracted; the outline lists the `##` headings with their ids; external links carry `rel` and `target`.
- `insights-related.test.ts`: the explicit list wins; otherwise the newest others; never the post itself; at most three.
- `insights-jsonld.test.ts`: Article and FAQPage shapes; no FAQPage without an FAQ.
- `copy-guard.test.ts` (extended): a `.md` fixture with an em dash fails; a `.md` fixture with straight apostrophes passes.
- The index renders the held slot for zero posts.
- `portrait.test.tsx`: for a person with a `portrait`, the team page's image and the author block's image have the same `src`; for a person without one, both render the placeholder.

### End to end (`tests/e2e/`)

`test:e2e` builds with `INSIGHTS_DIR=tests/fixtures/insights`. The fixtures are invented sample posts written for testing, never real drafts: the repo is public, so a committed draft is a published draft. At least three fixtures, one with a cover, a chart, and an FAQ, one with none of them. Fixture slugs start with `fixture-`. Their images live in `tests/fixtures/insights/media/<slug>/`; the e2e build step copies them into `public/media/insights/` before building and removes them after, and `.gitignore` excludes `public/media/insights/fixture-*/` so they can never be committed or shipped.

Against the built site:

- The index shows the featured post and the list, newest first.
- An article has one `h1`, the takeaways, a chart `svg`, the FAQ, the author block, the `CallLink` pointing at the call, and the related posts.
- The JSON-LD parses and holds an `Article`, plus an `FAQPage` exactly when the post has an FAQ.
- Exactly one `og:image`, the post's own, and no meta tag on the article points at the site-wide `og-image.jpg`; the image exists in `out/` as a 1200 by 630 PNG.
- `sitemap.xml` lists the posts; `robots.txt` names the three crawlers.
- No em dash and no uppercase text-transform anywhere on the article.
- At 390 wide: no horizontal scroll, the byline shows, the rail does not.

### Before calling it done

Screenshots of an article (with and without a cover) and the index at 1440, 1728, and 390, per the repo's standing practice that layouts here shift between viewport sizes.

## 13. Copy pending Max

New sentences in this build, joining the clearance list:

- The index lede (today's says "publishing this fall").
- The quiet line at the end of a post. Working draft: "Working through this at your own business? We're glad to talk it over."
- Each person's `role` and `line` in the people file (roles are still placeholders on the team page).
- UI labels: "Key takeaways", "On this page", "Written by", "Keep reading", "Newest".

Posts themselves are cleared per post, in review. The August drafts are written for financial firms and need reframing for the general market before they publish; that editing is content work, not part of this build.

## 14. Risks and the first task

- **Share cards in a static export: resolved by probe builds (2026-09-29).** `opengraph-image.tsx` exported an extension-less PNG and left `twitter:image` on the site-wide image, and an empty `generateStaticParams` failed the export. Section 5 and section 9 carry the fixes: a build script writes `card.png`, the metadata names it twice, and zero posts builds a `_none` placeholder.
- **Authors without repo access** cannot run step 5; they can still convert and preview, and hand the branch to someone who can.
- **The never-publish file drifts** between authors' machines. Max's master list is the reference; the command states which file it read.

## 15. Out of scope, easy later

An RSS feed; tags or topic filters (worth it past about a dozen posts); reading time; co-authored posts; scheduled publishing; the scheduler itself (section 8 leaves its seam); a newsletter (explicitly not wanted).
