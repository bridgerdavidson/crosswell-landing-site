# Insights posts

Every file in this folder is one post on crosswellconsulting.com/insights, except this README and any file whose name starts with `_`. The filename is the post's address: `what-firms-keep.md` is published at `/insights/what-firms-keep`. Use lowercase words joined by hyphens, and never rename a published post, because every link already shared would break.

Most people never write this file by hand. Run `/publish-insight <path to your note>` in Claude Code and it writes the post for you, then shows you the page before anything is committed. This page is the reference for what it writes.

## The top of the file

```yaml
---
title: What does your firm keep after AI finishes the work?
description: One line, at most 160 characters. It shows on the index, in search results, and in the share preview.
author: max
published: 2026-10-06
updated: 2026-10-20
takeaways:
  - First takeaway.
  - Second takeaway.
cover: cover.jpg
coverAlt: What the cover image shows, for someone who cannot see it.
related: [another-post, a-third-post]
---
```

- `title`, `description`, `author`, and `published` are required. Everything else is optional.
- `author` is an id from `src/lib/people.ts` (max, bridger, michael).
- Dates are `YYYY-MM-DD`. `published` cannot be in the future: the site only rebuilds when a pull request merges. Set `updated` only when a change is substantive, not for a typo.
- `takeaways` is 2 to 5 short lines, shown in a box at the top of the post.
- `cover` is a `.jpg` or `.png` in `public/media/insights/<slug>/`, and needs `coverAlt`. Never name a file `card.png`: the build writes the share card there, and git ignores it.
- `related` is up to 3 other posts. Leave it out and the newest posts fill in.
- Titles and headings are sentence case. Straight apostrophes and quotes are fine: the site curls them.
- A value with `: ` in it, or one starting with `%` or `#`, goes in double quotes: `title: "AI: what it keeps"`. Use double quotes rather than single ones, so an apostrophe inside is fine.

## The body

- Sections are `##` headings; `###` goes inside a section. Phrase sections as the questions a reader is asking. Never use a single `#`: the title comes from the top of the file.
- Link every statistic to its source.
- Images: put the file in `public/media/insights/<slug>/` and write `![what the image shows](file.png "Optional caption")`. Name files with letters, digits, hyphens, and dots, no spaces: a screenshot called `Screenshot 2026-09-30 at 10.00.png` becomes `screenshot-2026-09-30.png`.
- Tables, lists, and `>` pull quotes work as usual. Raw HTML does not.
- An FAQ is a section called `## Frequently asked questions` with each question as a `###` heading and its answer under it. It shows on the page and is marked up for search engines.
- A chart is a block of data. The site draws it:

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

`type` is `line` or `bar`; `data` is 2 to 12 points, zero or more, in the order they should appear. Never add a point the source does not give.

## House rules

No em dashes. No claims about Crosswell’s security, compliance, or hosting. No pricing. No client names or client numbers. `npm run check:insights` and `npm run check:copy` catch what a machine can; review catches the rest.
