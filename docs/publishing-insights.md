# Publishing an insight

Anyone on the team can publish a post to crosswellconsulting.com/insights. You keep writing in the team vault the way you do now; a command in Claude Code turns your note into a post, shows you the real page on your own machine, and opens a pull request when you say it is ready. Bridger reviews the pull request, and merging it publishes the post.

## One-time setup

1. **Get access to the repo.** Ask Bridger for write access to the site's GitHub repository.
2. **Clone it and install.**

       git clone https://github.com/bridgerdavidson/crosswell-landing-site.git
       cd crosswell-landing-site
       npm install

3. **Sign in to GitHub from the terminal** with `gh auth login` (install the GitHub CLI first if you do not have it).
4. **Add the never-publish list.** Copy the list from the team vault's publishing note into a new file at `.claude/never-publish.local.txt` in the repo: one term per line (client names, internal figures, anything that must never appear on the site). The file never leaves your machine; git ignores it. The command will not run without it.
5. **Open the repo in Claude Code.**

## Publishing

1. In Claude Code, from the repo, run `/publish-insight <path to your note>`.
2. Confirm the address it proposes (the slug). It is permanent once published.
3. Answer its questions: the cover image, alt text, anything it flagged.
4. Look at the page it opens. Ask for changes, or edit your note and say "re-sync". Refresh the page after each change.
5. When it is right, say "ship it". You get a pull request link. Bridger reviews it and merges it, and the post goes live a minute or two later. The post's date is the day you ran the command; if it merges on a later day, Bridger sets `published` to the merge day before merging, so the page shows the day it went live.

## Updating a published post

Run the same command and say it is an update. It starts from the published version. It only marks the post "Updated" if you say the change is substantive.

## When something goes wrong

- **A check fails.** The message names the file, the field, and the fix, for example `author: "maxx" is not in src/lib/people.ts`. The command fixes it or asks you.
- **The preview will not open.** Another app may hold the port; the command reads the real port from the dev server's output.
- **You are not in `src/lib/people.ts`.** Ask Bridger to add you; that is its own change.
