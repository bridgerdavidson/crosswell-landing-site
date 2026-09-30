---
name: publish-insight
description: Publishes a post to the site's Insights section from a note in the team vault. Converts the note to the post format, screens it, runs the checks, previews the real page locally, and opens one pull request only after the author says "ship it". Use when someone runs /publish-insight, says "publish this note", or wants to update a published insight.
---

# Publish an insight

You turn one note into one post on the site, show the author the real page, and open one pull request when they say so. Merging that pull request publishes the post. You never merge it.

Usage: `/publish-insight <path to the note>`. The path is your only input. Never go looking for notes on your own.

The post format is in `content/insights/README.md`. Read it before converting anything; it is the reference, and this skill does not repeat it.

## 0. Before anything else

1. You are in this repo's root. Run `git status --short`. If there are changes that are not the author's current post, stop and ask what to do with them.
2. Read `.claude/never-publish.local.txt`. **If it does not exist, stop** and tell the author: "The never-publish list is missing. Copy it from the team vault's publishing note into .claude/never-publish.local.txt, then run this again." Do not continue without it. Tell the author which file you read and how many terms it holds.
3. Read the note at the path given. If it does not exist, stop.
4. Propose the slug: at most six lowercase words from the title, joined by hyphens (for example `what-firms-keep`). Ask the author to confirm it; a slug is permanent once published.
5. Decide whether this is a new post or an update. A post is published when its file is on `origin/main`:

   ```bash
   git fetch origin main
   git cat-file -e origin/main:content/insights/<slug>.md
   ```

   Success means an update, which follows section 6. A file that exists only in this checkout is an earlier run of this command that was never shipped: the post is still new, and you continue from that file (section 1). The author saying "this is an update" also makes it one.

## 1. Convert the note

The branch is `insights/<slug>` for a new post and `insights/update-<slug>` for an update:

```bash
git switch -c insights/<slug> origin/main
```

If that fails because the branch already exists (an earlier run that stopped before shipping, or a pull request already open), run `git switch insights/<slug>` and continue from what is there: read `content/insights/<slug>.md` and show the author the diff against the note before writing anything.

Write `content/insights/<slug>.md`:

- **title**: the note's `#` heading, in sentence case. Lowercase every word after the first except proper nouns, acronyms, and product names, which keep their case (SEC, Gallup, ChatGPT, Crosswell, the Core). A title that is a question keeps its question mark.
- **description**: the note's dek, the italic line under the title, or its first sentence. If it is over 160 characters, propose a shorter one and ask.
- **author**: the byline's person, as their id in `src/lib/people.ts`. If the byline is ambiguous, ask. If the person is not in that file, stop: adding a person is its own change.
- **published**: today's date in UTC, `YYYY-MM-DD`. Tell the author: the page prints the date in the file, so if the pull request merges on a later day, the reviewer sets `published` to the merge day before merging (the pull request body asks for it).
- **takeaways**: the note's "Key takeaways" list, if it has one (2 to 5 lines).
- **cover**: ask "Does this post have a cover image?" If yes, the file must be a `.jpg` or `.png`; copy it to `public/media/insights/<slug>/` and ask for `coverAlt` if the note does not describe it. A `.webp` or `.heic` has to be exported as `.jpg` first; ask the author to do that. Never name a file `card.png`: the build writes the share card there.
- **related**: leave it out unless the author names related posts.
- **The body**:
  - Keep the `##` sections, in sentence case. Where a section heading is a statement and a reader would ask it as a question, suggest the question form; the author decides.
  - A bold question followed by its answer, under a "Frequently asked questions" heading, becomes `### Question?` with the answer under it, inside `## Frequently asked questions` (exactly that heading, no colon, no "FAQ").
  - A chart the note describes (often in its build notes: a title, a source, the numbers) becomes a `chart` block. Show the author every number beside its source link and ask them to confirm each one. **Never invent, round, or fill in a data point.** If the source gives two years, the chart has two points.
  - An Obsidian image embed (`![[file.png]]`) becomes `![alt](file.png)` with the file copied to `public/media/insights/<slug>/`. Copy it under a name of lowercase letters, digits, hyphens, and dots, with no spaces: `Screenshot 2026-09-30 at 10.00.png` becomes `screenshot-2026-09-30.png`, since a name with spaces does not parse as an image. Ask for alt text where there is none.
  - A wiki link (`[[...]]`) becomes plain text, unless it names a post already on the site, in which case it becomes a link to `/insights/<that-slug>`.
  - Drop everything that belongs to the vault: the note's own frontmatter, breadcrumb lines (lines of links at the top), draft banners, callouts (`> [!note]`), comments (`%% ... %%`), highlights (`==text==`), tags, the byline line (the page prints it from frontmatter), the `#` title (it moves to frontmatter), and every section addressed to reviewers or builders, such as build notes, flags, and notes for a named person. The check in section 3 refuses any of these that slip through.

## 2. Screen it

1. **Never-publish terms.** Search the post and its media file names for every term in the never-publish list, ignoring case. Blank lines and lines starting with `#` in the list are not terms, so drop them before searching:

   ```bash
   grep -v -E '^\s*(#|$)' .claude/never-publish.local.txt | grep -i -n -F -f /dev/stdin content/insights/<slug>.md
   ```

   Any hit stops the run: list every hit with its line and ask the author to rewrite those lines in the note. Nothing continues until the post has no hits. The terms themselves never go into a commit, a pull request, or a file in the repo.
2. **Flags the author decides on.** Show each one with its line and a proposed fix, and record what the author chose:
   - every em dash, with a rewrite that uses a comma, a colon, or a period instead;
   - any claim about Crosswell's security, compliance, or hosting (the site makes none);
   - pricing of any kind;
   - a client's name, or a number about a client;
   - a statistic with no link to its source in the same paragraph;
   - the word "brain" for the product (the product is the Core; write "the Core").

## 3. Check it

```bash
npm run check:insights
npm run check:copy
```

Both must pass. Their messages name the file, the field, and the fix; make the fix (or ask the author when the fix is a choice) and run them again.

## 4. Preview it

1. Run `npm run cards` so the share card exists.
2. Start the dev server (`npm run dev`) the way this Claude Code session runs servers: the preview tool if it has one, otherwise in the background. Read the real port from its output, because port 3000 is often taken.
3. Open `/insights/<slug>` and `/media/insights/<slug>/card.png` for the author.
4. Loop on what they ask for ("shorten the description," "that chart should be bars"). If they edit the note instead, they say "re-sync": convert the note again (section 1) and show the diff against the current post before writing it. The dev server does not watch posts: after each change, run `npm run check:insights` again and ask the author to refresh the page.

Nothing is committed during the preview.

## 5. Ship it

Only when the author says "ship it" (or says plainly that it is ready to go live):

```bash
git add content/insights/<slug>.md
git add public/media/insights/<slug>/<the cover and each body image>
git commit -m "feat: publish \"<title>\"" -m "<the Co-Authored-By trailer this session uses>"
git push -u origin insights/<slug>
gh pr create --base main --title "Publish: <title>" --body-file <a file you wrote with the body below>
```

Run the second `git add` only when the post has a cover or images, naming each file: `git add` on a folder that does not exist fails, and the generated `card.png` is git-ignored and never added. The build makes the share card.

The pull request and the commit never name the note's path, the vault, or a never-publish term. The pull request body:

```markdown
New insight: **<title>** by <author name>, at /insights/<slug>.

Published date: <published>. If this merges on a later day, set `published` to the merge day before merging: the page prints the date in the file, and the site only rebuilds on merge.

Checks run: `npm run check:insights`, `npm run check:copy`, never-publish screen (<n> terms, no hits).

Flags the author accepted:
- <each flag, its line, and what the author chose, or "none">

Review the Vercel preview on this PR. Merging publishes the post.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Give the author the pull request's URL. **Never merge it. Never push to `main`. Never enable auto-merge.**

## 6. Updating a published post

- Start from the repo's file, `content/insights/<slug>.md`: once published, it is the source of truth, not the note. The branch is `insights/update-<slug>`; if it already exists, switch to it and continue, as in section 1.
- If the author brings a revised note, convert it and show the diff against the published file before writing anything.
- Set `updated` to today only if the author says the change is substantive; never for a typo. The same merge-day rule applies to `updated`: the pull request body asks the reviewer to set it to the merge day.
- The slug never changes. `published` never changes.
- Screen, check, and preview as above. The commit is `fix: update "<title>"`.
