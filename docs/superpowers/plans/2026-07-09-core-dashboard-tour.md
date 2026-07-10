# Core Dashboard Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the How It Works dashboard scene from a single-view loop into a ~16s cursor-driven five-beat tour across the dashboard's four sections (Add to the brain, Chat, Library, Analytics).

**Architecture:** The v1 single-file `CoreDashboard.tsx` splits into `src/components/core-dashboard/` (shared bits, one file per view, and the frame+timeline component). All four views are server-rendered in their finished states, absolutely stacked in a fixed-height canvas; CSS defaults show the answered Chat view (the reduced-motion/no-JS resting frame); the GSAP timeline arms everything and plays the tour once on scroll-in, driven by a soft cursor dot. The brain rail is gone.

**Tech Stack:** Next.js 15 (App Router, `output: "export"`), React 19, Tailwind v4, GSAP 3 + `@gsap/react` (already installed; ScrollTrigger only), TypeScript.

**Spec:** `docs/superpowers/specs/2026-07-09-core-dashboard-tour-design.md`. The v1 spec's visual system carries over (`2026-07-09-core-dashboard-scene-design.md`, superseded for staging).

## Global Constraints

- **No em dashes in any copy or docs. Ever.** Middots (`·`) as separators.
- Copy is locked (spec section 4). Workspace label "Your firm". Caption "Product preview. Illustrative data." No client names, no usage metrics, no performance claims.
- Brand tokens plus these component-local hexes only: `#161512`, `#24221c`, `#3c4a38`, avatar fills `#5c6b52` / `#6b5f4c` / `#4c5c6b`, active-nav text `#b5cbb5`, new-citation chip text `#c2d6c2`. None added to `@theme`.
- Icons: inline SVG only (`strokeWidth={1.8}` family). Never emoji. Tabular numerals on every animated counter.
- Animation: transform/opacity only. Deliberate exceptions: textContent count swaps and instant `gsap.set` of nav-pill width/label colors (sets, not tweens). No width/height/color TWEENS.
- `prefers-reduced-motion` and no-JS both show the answered Chat view; the cursor and Replay never appear for them.
- The capture beat runs with NO cursor involvement; the cursor's first press is the Chat nav item.
- No new dependencies. `src/app/globals.css`, `vercel.json`, build config untouched (`.chat-caret`/`.chat-dot` are reused).
- A `next dev` server may be running in the background from earlier in the session; kill any running `next dev` (by PID) before `npm run build` (shared `.next` state corrupts). Dev server port: read the log, never assume 3000.
- Playwright is verification-only (`npm install --no-save playwright`; probably already present from the v1 pass).
- Conventional commits with the repo trailer:

  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm
  ```

- Do NOT push (pushing main deploys production).

## File Structure

- Create `src/components/core-dashboard/shared.tsx`: icons, `TagChip`, `QUESTION`/`ANSWER` constants.
- Create `src/components/core-dashboard/AddView.tsx`, `ChatView.tsx`, `LibraryView.tsx`, `AnalyticsView.tsx`: presentational, finished-state markup, `cwd-` target classes.
- Create `src/components/core-dashboard/CoreDashboard.tsx`: frame, top bar, nav (sidebar + mobile tab strip), cursor, Replay, the timeline. Default export.
- Delete `src/components/CoreDashboard.tsx` (v1).
- Modify `src/components/HowItWorks.tsx`: import path only.
- Modify `README.md` (Task 4): design record.

Naming registry (every GSAP selector used in Task 3 exists in Tasks 1-2):
`cwd-frame`, `cwd-view` + `cwd-view-add|chat|library|analytics`, `cwd-nav` (2 containers), `cwd-nav-item` + `cwd-nav-item-<key>`, `cwd-nav-label`, `cwd-nav-pill` (2), `cwd-nav-chat-static`, `cwd-cursor`, `cwd-feed`, `cwd-feed-reading`, `cwd-feed-tags`, `cwd-tag`, `cwd-feed-filed`, `cwd-brain-count`, `cwd-q`, `cwd-composer-text`, `cwd-caret`, `cwd-send`, `cwd-thinking`, `cwd-answer`, `cwd-cite`, `cwd-cite-new`, `cwd-lib-highlight`, `cwd-lib-cited`, `cwd-stat` (with `data-count`), `cwd-report-bar`, `cwd-replay`.

---

### Task 1: Shared pieces and the four views

**Files:**
- Create: `src/components/core-dashboard/shared.tsx`
- Create: `src/components/core-dashboard/AddView.tsx`
- Create: `src/components/core-dashboard/ChatView.tsx`
- Create: `src/components/core-dashboard/LibraryView.tsx`
- Create: `src/components/core-dashboard/AnalyticsView.tsx`

**Interfaces:**
- Consumes: Tailwind theme tokens; `.chat-caret`/`.chat-dot` from `globals.css`.
- Produces: named exports `AddView`, `ChatView`, `LibraryView`, `AnalyticsView` (no props); `shared.tsx` exports `QUESTION`, `ANSWER`, `IconChat`, `IconPlus`, `IconFolder`, `IconBars`, `IconCheck`, `IconUp`, `TagChip`. Every `cwd-` class in the naming registry above except the frame/nav/cursor/replay ones (those come in Task 2).

- [ ] **Step 1: Create `src/components/core-dashboard/shared.tsx`**

```tsx
export const QUESTION = "Where did we land on wire approvals over $250k?";
export const ANSWER =
  "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number.";

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-3.5 w-3.5 flex-none",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function IconChat() {
  return (
    <svg {...iconProps}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function IconPlus() {
  return (
    <svg {...iconProps}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function IconFolder() {
  return (
    <svg {...iconProps}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function IconBars() {
  return (
    <svg {...iconProps}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
export function IconCheck() {
  return (
    <svg {...iconProps} className="h-[11px] w-[11px] flex-none" strokeWidth={2.4}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
export function IconUp() {
  return (
    <svg {...iconProps} className="h-3 w-3 flex-none" strokeWidth={2.2}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="cwd-tag rounded-full bg-ivory/8 px-2 py-px text-[9.5px] font-semibold text-ivory/55">
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create `src/components/core-dashboard/AddView.tsx`** (finished state: item ingested, tagged, filed)

```tsx
import { IconCheck, TagChip } from "./shared";

const SOURCES = [
  { label: "Meeting bot · in today's ops meeting", live: true },
  { label: "Email · watching forwarded mail", live: false },
  { label: "Files · synced", live: false },
];

export function AddView() {
  return (
    <div className="cwd-view cwd-view-add invisible absolute inset-0 flex flex-col p-5 sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ivory/40">
        Connected sources
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {SOURCES.map((s) => (
          <span
            key={s.label}
            className="flex items-center gap-1.5 rounded-full bg-[#24221c] px-3 py-1.5 text-[11px] font-medium text-ivory/70"
          >
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                s.live ? "cwd-live-dot bg-fern-soft" : "bg-ivory/25"
              }`}
            />
            {s.label}
          </span>
        ))}
      </div>

      <div className="cwd-feed mt-5 max-w-[480px] rounded-xl bg-[#24221c] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ivory/90">
            Meeting transcript · Wire approval policy
          </p>
          <span className="flex-none rounded-full bg-fern/20 px-2 py-px text-[9.5px] font-semibold text-fern-soft">
            Ingested automatically
          </span>
        </div>
        <p className="cwd-feed-reading invisible mt-2 text-[11px] text-ivory/45 opacity-0">
          Reading…
        </p>
        <div className="cwd-feed-tags mt-2 flex flex-wrap gap-1">
          <TagChip label="Operations" />
          <TagChip label="Policy" />
          <TagChip label="April" />
        </div>
        <div className="cwd-feed-filed mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-fern-soft">
          <IconCheck />
          Filed ✓
          <span className="ml-2 font-medium text-ivory/45 tabular-nums">
            <span className="cwd-brain-count">1,204</span> notes in the brain
          </span>
        </div>
      </div>

      <p className="mt-auto pt-4 text-[11px] text-ivory/40">
        Drop files or paste notes for anything the bots can&apos;t catch.
      </p>
    </div>
  );
}
```

Note: `cwd-feed-reading` carries `invisible opacity-0` statically (the finished state has no "Reading…"); the timeline reveals and re-hides it mid-capture.

- [ ] **Step 3: Create `src/components/core-dashboard/ChatView.tsx`** (finished state: answered thread; this is the no-JS/reduced-motion resting frame, so NOTHING here is hidden statically except the caret)

```tsx
import { ANSWER, IconUp, QUESTION } from "./shared";

export function ChatView() {
  return (
    <div className="cwd-view cwd-view-chat absolute inset-0 flex flex-col p-5 sm:p-6">
      <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-3">
        <div className="cwd-q max-w-[78%] self-end rounded-2xl rounded-br-[5px] bg-charcoal px-3.5 py-2 text-[13px] leading-relaxed">
          {QUESTION}
        </div>

        <div className="relative min-h-[150px] sm:min-h-[118px]">
          <div className="cwd-thinking absolute left-0 top-0 flex items-center gap-1.5 rounded-2xl rounded-bl-[5px] bg-[#24221c] px-3.5 py-3 opacity-0">
            <span className="chat-dot" />
            <span className="chat-dot" />
            <span className="chat-dot" />
          </div>
          <div className="cwd-answer max-w-[88%] rounded-2xl rounded-bl-[5px] bg-[#24221c] px-4 py-3 text-[13px] leading-relaxed text-ivory/90">
            {ANSWER}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="cwd-cite cwd-cite-new rounded-full bg-fern/30 px-2.5 py-0.5 text-[10.5px] font-semibold text-[#c2d6c2] shadow-[0_0_0_1.5px_rgba(147,179,147,0.55)]">
                Policy note · Apr 8
              </span>
              <span className="cwd-cite rounded-full bg-fern/20 px-2.5 py-0.5 text-[10.5px] font-semibold text-fern-soft">
                Ops meeting · Mar 28
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-[560px] items-center gap-2.5 rounded-full bg-[#24221c] py-2.5 pl-4 pr-2.5 text-[13px]">
        <span className="min-w-0 flex-1 truncate text-ivory/40">
          <span className="cwd-composer-text text-ivory/85" />
          <span
            className="cwd-caret chat-caret ml-0.5 opacity-0 invisible"
            style={{ background: "var(--color-fern-soft)" }}
          />
          <span className="cwd-composer-hint">Ask anything about your firm…</span>
        </span>
        <span className="cwd-send ml-auto flex h-6 w-6 flex-none items-center justify-center rounded-full bg-fern text-ivory">
          <IconUp />
        </span>
      </div>
    </div>
  );
}
```

Composer mechanics: statically the typed span is empty and the hint shows (question already sent). During the ask beat the timeline hides `cwd-composer-hint`, types into `cwd-composer-text`, then clears it and restores nothing (bubble pops instead).

- [ ] **Step 4: Create `src/components/core-dashboard/LibraryView.tsx`** (finished state: note open, highlight swept, cited chip visible)

```tsx
import { TagChip } from "./shared";

const ROWS = [
  { title: "Ops meeting notes", date: "Mar 28" },
  { title: "Q2 investor letter draft", date: "Jun 12" },
  { title: "Committee minutes", date: "Jun 3" },
];

export function LibraryView() {
  return (
    <div className="cwd-view cwd-view-library invisible absolute inset-0 flex flex-col gap-3 p-5 sm:p-6 md:flex-row md:gap-5">
      <div className="flex flex-col gap-1 md:w-[218px] md:flex-none">
        <div className="rounded-[10px] bg-fern/20 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-semibold text-[#b5cbb5]">
              Policy note · Wire approvals
            </p>
            <span className="text-[10px] text-ivory/40 tabular-nums">Apr 8</span>
          </div>
        </div>
        {ROWS.map((r) => (
          <div key={r.title} className="flex items-center justify-between gap-2 px-3 py-2">
            <p className="truncate text-xs text-ivory/60">{r.title}</p>
            <span className="text-[10px] text-ivory/35 tabular-nums">{r.date}</span>
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1 rounded-xl bg-[#24221c] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ivory/90">Policy note · Wire approvals</p>
          <span className="cwd-lib-cited rounded-full bg-fern/20 px-2 py-px text-[9.5px] font-semibold text-fern-soft">
            Cited just now
          </span>
        </div>
        <p className="relative mt-3 text-[12.5px] leading-relaxed text-ivory/85">
          <span className="cwd-lib-highlight absolute -inset-x-1 -inset-y-0.5 origin-left rounded-sm bg-fern/25" />
          <span className="relative">
            Any wire over $250k requires sign-off from both a managing partner and operations.
          </span>
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ivory/60">
          Context: a near miss in March with a mistyped account number.
        </p>
        <p className="mt-3 text-[11px] text-ivory/40">
          Filed in Operations · Linked to Ops meeting · Mar 28
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <TagChip label="Operations" />
          <TagChip label="Policy" />
          <TagChip label="April" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/core-dashboard/AnalyticsView.tsx`** (finished state: numbers at value, bars full)

```tsx
const STATS = [
  { label: "Meetings captured", value: 41, sub: "" },
  { label: "Decisions logged", value: 12, sub: "" },
  { label: "Open items", value: 7, sub: "3 owners" },
];

const AREAS = [
  { label: "Deals", value: 18, height: "100%" },
  { label: "Investors", value: 9, height: "50%" },
  { label: "Operations", value: 14, height: "78%" },
];

export function AnalyticsView() {
  return (
    <div className="cwd-view cwd-view-analytics invisible absolute inset-0 flex flex-col p-5 sm:p-6">
      <p className="text-sm font-semibold text-ivory/90">June report</p>
      <p className="mt-0.5 text-[11px] text-ivory/45">
        Compiled from meetings, notes, and documents.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="cwd-stat-tile rounded-xl bg-[#24221c] px-3 py-3">
            <p className="text-[19px] font-semibold leading-none tabular-nums sm:text-[22px]">
              <span className="cwd-stat" data-count={s.value}>
                {s.value}
              </span>
            </p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-ivory/50">
              {s.label}
              {s.sub ? <span className="text-ivory/35"> · {s.sub}</span> : null}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 max-w-[360px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ivory/40">
          Activity by area
        </p>
        <div className="mt-2.5 flex items-end gap-4">
          {AREAS.map((a) => (
            <div key={a.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[72px] w-full items-end">
                <div
                  style={{ height: a.height }}
                  className="cwd-report-bar w-full origin-bottom rounded-t-[3px] bg-fern-soft/80"
                />
              </div>
              <p className="text-[10px] text-ivory/50">
                {a.label} <span className="text-ivory/35 tabular-nums">{a.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck via build** (kill any running `next dev` first; the files are not yet imported, which is fine)

Run: `npm run build`
Expected: passes with zero type errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/core-dashboard/
git commit -m "feat: four tour views and shared pieces for the dashboard tour

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

---

### Task 2: The frame: nav, cursor, Replay, static wiring

**Files:**
- Create: `src/components/core-dashboard/CoreDashboard.tsx` (static version; Task 3 adds the timeline)
- Modify: `src/components/HowItWorks.tsx` (import line only)
- Delete: `src/components/CoreDashboard.tsx`

**Interfaces:**
- Consumes: Task 1's view components and shared icons.
- Produces: default export `CoreDashboard(): JSX.Element`; frame/nav/cursor/replay classes from the naming registry; `NAV: { key, label, short, Icon }[]` in tour order (add, chat, library, analytics).

- [ ] **Step 1: Create `src/components/core-dashboard/CoreDashboard.tsx`** (static; no GSAP yet)

```tsx
"use client";

import { AddView } from "./AddView";
import { AnalyticsView } from "./AnalyticsView";
import { ChatView } from "./ChatView";
import { LibraryView } from "./LibraryView";
import { IconBars, IconChat, IconFolder, IconPlus } from "./shared";

const NAV = [
  { key: "add", label: "Add to the brain", short: "Add", Icon: IconPlus },
  { key: "chat", label: "Chat", short: "Chat", Icon: IconChat },
  { key: "library", label: "Library", short: "Library", Icon: IconFolder },
  { key: "analytics", label: "Analytics", short: "Analytics", Icon: IconBars },
] as const;

function NavItems({ variant }: { variant: "side" | "strip" }) {
  return (
    <>
      {NAV.map(({ key, label, short, Icon }) => (
        <div
          key={key}
          className={`cwd-nav-item cwd-nav-item-${key} relative z-10 flex items-center ${
            variant === "side"
              ? "h-9 gap-2 rounded-[10px] px-2.5 text-xs font-medium"
              : "h-8 gap-1.5 rounded-full px-3 text-[11px] font-medium"
          }`}
        >
          {key === "chat" && (
            <span className="cwd-nav-chat-static absolute inset-0 -z-10 rounded-[inherit] bg-fern/20" />
          )}
          <Icon />
          <span
            className={`cwd-nav-label ${
              key === "chat" ? "text-[#b5cbb5]" : "text-ivory/55"
            }`}
          >
            {variant === "side" ? label : short}
          </span>
        </div>
      ))}
    </>
  );
}

export default function CoreDashboard() {
  return (
    <div className="cwd-scope mx-auto max-w-5xl">
      <p className="sr-only">
        Product preview: the firm&apos;s brain ingests a meeting transcript
        automatically, a teammate asks about wire approvals and gets a cited
        answer, the citation opens the source note in the library, and a June
        report summarizes activity across the firm.
      </p>

      <div className="relative">
        <div
          aria-hidden="true"
          className="cwd-frame relative overflow-hidden rounded-2xl bg-ink text-ivory shadow-[0_24px_60px_rgba(26,25,21,0.25)]"
        >
          {/* Top bar (hairline 1 of 1) */}
          <div className="flex items-center gap-2.5 border-b border-ivory/10 px-4 py-3 sm:px-5">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-md bg-fern text-[10px] font-bold text-ivory">
              ✕
            </span>
            <span className="text-[13.5px] font-semibold tracking-[0.01em]">
              Crosswell Core
            </span>
            <span className="text-xs text-ivory/45">· Your firm</span>
            <span className="flex-1" />
            <span className="hidden items-center gap-2 text-[11px] text-ivory/45 sm:mr-12 sm:flex">
              <span className="flex">
                <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#5c6b52] text-[8.5px] font-semibold text-ivory">
                  MB
                </span>
                <span className="-ml-2 flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#6b5f4c] text-[8.5px] font-semibold text-ivory">
                  JT
                </span>
                <span className="-ml-2 flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#4c5c6b] text-[8.5px] font-semibold text-ivory">
                  RS
                </span>
              </span>
              3 online
            </span>
          </div>

          {/* Mobile tab strip (below lg) */}
          <div className="cwd-nav relative flex gap-1 px-3 pt-3 lg:hidden">
            <span className="cwd-nav-pill invisible absolute left-0 top-0 rounded-full bg-fern/20" />
            <NavItems variant="strip" />
          </div>

          <div className="flex">
            {/* Sidebar (lg+) */}
            <div className="hidden w-[168px] flex-none px-2.5 py-3.5 lg:block">
              <div className="cwd-nav relative flex flex-col gap-0.5">
                <span className="cwd-nav-pill invisible absolute left-0 top-0 rounded-[10px] bg-fern/20" />
                <NavItems variant="side" />
              </div>
            </div>

            {/* Canvas: four stacked views */}
            <div className="relative min-h-[500px] min-w-0 flex-1 lg:min-h-[440px]">
              <AddView />
              <ChatView />
              <LibraryView />
              <AnalyticsView />
            </div>
          </div>

          {/* Cursor dot (playback only) */}
          <div className="cwd-cursor invisible absolute left-0 top-0 z-20 h-3.5 w-3.5 rounded-full bg-ivory/90 shadow-[0_0_0_5px_rgba(147,179,147,0.25),0_2px_8px_rgba(26,25,21,0.45)]" />
        </div>

        <button
          type="button"
          hidden
          aria-label="Replay the product preview animation"
          className="cwd-replay absolute right-4 top-3 z-10 cursor-pointer text-xs font-medium text-fern-soft transition-colors hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fern-soft sm:right-5"
        >
          Replay
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-ink/45">
        Product preview. Illustrative data.
      </p>
    </div>
  );
}
```

Static-state contract this markup implements: Chat view visible (no `invisible` on it), other three views `invisible`; Chat nav item shows its static pill span + `#b5cbb5` label; both `cwd-nav-pill` indicators and the cursor are `invisible`; Replay `hidden`. The `onClick` and ref wiring arrive in Task 3.

- [ ] **Step 2: Update the import in `src/components/HowItWorks.tsx`**

Replace the line `import CoreDashboard from "./CoreDashboard";` with:

```tsx
import CoreDashboard from "./core-dashboard/CoreDashboard";
```

No other changes to that file.

- [ ] **Step 3: Delete the v1 component**

Run: `rm src/components/CoreDashboard.tsx && grep -rn "components/CoreDashboard" src/ || echo "no stale imports"`
Expected: `no stale imports`

- [ ] **Step 4: Build** (kill any running `next dev` first)

Run: `npm run build`
Expected: passes.

- [ ] **Step 5: Static verification via dev server**

Start `npm run dev` in the background, READ THE LOG for the real port, then check the served HTML:

```bash
curl -s http://localhost:<port>/ > /tmp/tour.html
grep -c "cwd-view" /tmp/tour.html          # expect 4 view containers
grep -c "cwd-nav-pill" /tmp/tour.html      # expect 2
grep -c "cwd-cursor" /tmp/tour.html        # expect 1
grep -c "Ingested automatically" /tmp/tour.html   # expect 1
grep -c "June report" /tmp/tour.html       # expect 1
grep -c "Cited just now" /tmp/tour.html    # expect 1
grep -c "questions answered" /tmp/tour.html # expect 0 (usage metric removed)
grep -c "cwd-rail\|The brain</p>" /tmp/tour.html   # expect 0 (rail gone)
grep -c "Product preview. Illustrative data." /tmp/tour.html  # expect 1
```

Confirm the Chat view div does NOT carry `invisible` while the other three do (inspect the four `cwd-view-` class attributes in the HTML). Kill the dev server by PID.

- [ ] **Step 6: Commit**

```bash
git add src/components/core-dashboard/CoreDashboard.tsx src/components/HowItWorks.tsx
git add -u src/components/CoreDashboard.tsx
git commit -m "feat: tour frame with nav, cursor, and stacked views replacing the v1 scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

---

### Task 3: The tour timeline

**Files:**
- Modify: `src/components/core-dashboard/CoreDashboard.tsx` (add imports, refs, the hook, Replay onClick)

**Interfaces:**
- Consumes: every class in the naming registry; `QUESTION` from `./shared`.
- Produces: the finished component. No downstream consumers.

- [ ] **Step 1: Add imports and constants** below `"use client"`:

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { QUESTION } from "./shared";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPE_SECONDS = QUESTION.length * 0.03;
```

- [ ] **Step 2: Add refs and the hook** inside `CoreDashboard()`, before the `return`; add `ref={scopeRef}` to the root `cwd-scope` div and `onClick={replay}` to the Replay button. Everything else in the JSX stays byte-identical to Task 2.

```tsx
  const scopeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return; // resting Chat view stays as server-rendered
      }
      const scope = scopeRef.current;
      if (!scope) return;
      const frame = scope.querySelector<HTMLElement>(".cwd-frame");
      if (!frame) return;

      const composerText = scope.querySelectorAll<HTMLElement>(".cwd-composer-text");
      const brainCounts = scope.querySelectorAll<HTMLElement>(".cwd-brain-count");
      const stats = scope.querySelectorAll<HTMLElement>(".cwd-stat");
      const replays = scope.querySelectorAll<HTMLButtonElement>(".cwd-replay");
      const reportBars = scope.querySelectorAll<HTMLElement>(".cwd-report-bar");

      const setComposer = (v: string) =>
        composerText.forEach((n) => (n.textContent = v));

      // Cursor targeting: measured from the live layout at tween start.
      // Function-based values re-evaluate after tl.invalidate() on replay.
      const center = (sel: string) => {
        const el = scope.querySelector<HTMLElement>(sel);
        if (!el) return { x: 0, y: 0 };
        const b = el.getBoundingClientRect();
        const f = frame.getBoundingClientRect();
        return { x: b.left - f.left + b.width / 2, y: b.top - f.top + b.height / 2 };
      };
      // Nav containers differ per breakpoint; target whichever is visible.
      const navSel = (key: string) => {
        const items = Array.from(
          scope.querySelectorAll<HTMLElement>(`.cwd-nav-item-${key}`)
        );
        const visible = items.find((el) => el.offsetParent !== null);
        return visible ?? items[0];
      };
      const navCenter = (key: string) => {
        const el = navSel(key);
        if (!el) return { x: 0, y: 0 };
        const b = el.getBoundingClientRect();
        const f = frame.getBoundingClientRect();
        return { x: b.left - f.left + b.width / 2, y: b.top - f.top + b.height / 2 };
      };

      // Nav indicator: instant width/position set + label colors (sets, not tweens).
      const setNav = (key: string, animate: boolean) => {
        scope.querySelectorAll<HTMLElement>(".cwd-nav").forEach((nav) => {
          const item = nav.querySelector<HTMLElement>(`.cwd-nav-item-${key}`);
          const pill = nav.querySelector<HTMLElement>(".cwd-nav-pill");
          if (!item || !pill) return;
          gsap.set(pill, {
            width: item.offsetWidth,
            height: item.offsetHeight,
            autoAlpha: 1,
          });
          gsap[animate ? "to" : "set"](pill, {
            x: item.offsetLeft,
            y: item.offsetTop,
            ...(animate ? { duration: 0.25, ease: "power2.inOut" } : {}),
          });
          nav.querySelectorAll<HTMLElement>(".cwd-nav-label").forEach((l) =>
            gsap.set(l, { color: "rgba(241,238,230,0.55)" })
          );
          const label = item.querySelector<HTMLElement>(".cwd-nav-label");
          if (label) gsap.set(label, { color: "#b5cbb5" });
        });
      };

      const tw = { i: 0 };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top 75%", once: true },
        defaults: { ease: "power2.out" },
      });
      tlRef.current = tl;

      tl
        // ===== Arm (t=0; restart() re-runs all of this) =====
        .call(() => {
          idleRef.current?.kill();
          idleRef.current = null;
          tw.i = 0;
          setComposer("");
          brainCounts.forEach((n) => (n.textContent = "1,203"));
          stats.forEach((n) => (n.textContent = "0"));
          replays.forEach((b) => (b.hidden = false));
          setNav("add", false);
        })
        .set(".cwd-nav-chat-static", { autoAlpha: 0 })
        .set(".cwd-frame", { autoAlpha: 0, y: 12 })
        .set(".cwd-view-add", { autoAlpha: 1 })
        .set([".cwd-view-chat", ".cwd-view-library", ".cwd-view-analytics"], {
          autoAlpha: 0,
        })
        .set(".cwd-feed", { autoAlpha: 0, x: 16 })
        .set(".cwd-feed-reading", { autoAlpha: 0 })
        .set(".cwd-tag", { autoAlpha: 0, y: 4 })
        .set(".cwd-feed-filed", { autoAlpha: 0 })
        .set(".cwd-q", { autoAlpha: 0, y: 8, scale: 0.96 })
        .set([".cwd-thinking", ".cwd-answer"], { autoAlpha: 0 })
        .set(".cwd-answer", { y: 14 })
        .set(".cwd-cite", { autoAlpha: 0, y: 6 })
        .set(".cwd-caret", { autoAlpha: 0 })
        .set(".cwd-composer-hint", { autoAlpha: 1 })
        .set(".cwd-lib-highlight", { scaleX: 0 })
        .set(".cwd-lib-cited", { autoAlpha: 0, scale: 0.85 })
        .set(".cwd-stat-tile", { autoAlpha: 0, y: 8 })
        .set(".cwd-report-bar", { scaleY: 0.1 })
        .set(".cwd-cursor", { autoAlpha: 0, scale: 1, xPercent: -50, yPercent: -50 })
        .set(".cwd-replay", { autoAlpha: 0 })

        // ===== Settle (0-0.5) =====
        .to(".cwd-frame", { autoAlpha: 1, y: 0, duration: 0.5 }, 0)

        // ===== Auto-capture (0.5-3.5): no cursor anywhere =====
        .addLabel("capture", 0.5)
        .to(".cwd-feed", { autoAlpha: 1, x: 0, duration: 0.45 }, "capture")
        .to(".cwd-feed-reading", { autoAlpha: 1, duration: 0.2 }, "capture+=0.55")
        .to(".cwd-feed-reading", { autoAlpha: 0, duration: 0.15 }, "capture+=1.15")
        .to(".cwd-tag", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 }, "capture+=1.25")
        .to(".cwd-feed-filed", { autoAlpha: 1, duration: 0.3 }, "capture+=1.8")
        .call(
          () => brainCounts.forEach((n) => (n.textContent = "1,204")),
          undefined,
          "capture+=2.0"
        )
        .fromTo(".cwd-brain-count", { y: -3 }, { y: 0, duration: 0.25 }, "capture+=2.0")

        // ===== Go to Chat (3.5-4.4) =====
        .addLabel("goChat", 3.5)
        .call(
          () => {
            const c = center(".cwd-view-add .cwd-feed");
            gsap.set(".cwd-cursor", { x: c.x, y: c.y + 40 });
          },
          undefined,
          "goChat"
        )
        .to(".cwd-cursor", { autoAlpha: 1, duration: 0.2 }, "goChat")
        .to(
          ".cwd-cursor",
          { x: () => navCenter("chat").x, y: () => navCenter("chat").y, duration: 0.55, ease: "power2.inOut" },
          "goChat+=0.15"
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, "goChat+=0.72")
        .call(() => setNav("chat", true), undefined, "goChat+=0.78")
        .to(".cwd-view-add", { autoAlpha: 0, duration: 0.18 }, "goChat+=0.78")
        .fromTo(
          ".cwd-view-chat",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          "goChat+=0.88"
        )

        // ===== Ask (4.4-8.4) =====
        .addLabel("ask", 4.4)
        .set(".cwd-composer-hint", { autoAlpha: 0 }, "ask")
        .to(".cwd-caret", { autoAlpha: 1, duration: 0.1 }, "ask")
        .to(
          ".cwd-cursor",
          { x: () => center(".cwd-send").x - 60, y: () => center(".cwd-send").y, duration: 0.5, ease: "power2.inOut" },
          "ask"
        )
        .to(
          tw,
          {
            i: QUESTION.length,
            duration: TYPE_SECONDS,
            ease: "none",
            onUpdate: () => setComposer(QUESTION.slice(0, Math.round(tw.i))),
          },
          "ask+=0.2"
        )
        .to(
          ".cwd-cursor",
          { x: () => center(".cwd-send").x, y: () => center(".cwd-send").y, duration: 0.35, ease: "power2.inOut" },
          `ask+=${0.3 + TYPE_SECONDS}`
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, `ask+=${0.7 + TYPE_SECONDS}`)
        .fromTo(".cwd-send", { scale: 1 }, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 }, `ask+=${0.7 + TYPE_SECONDS}`)
        .call(
          () => {
            setComposer("");
            gsap.set(".cwd-caret", { autoAlpha: 0 });
          },
          undefined,
          `ask+=${0.85 + TYPE_SECONDS}`
        )
        .to(".cwd-q", { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 }, `ask+=${0.85 + TYPE_SECONDS}`)
        .to(".cwd-thinking", { autoAlpha: 1, duration: 0.2 }, `ask+=${1.25 + TYPE_SECONDS}`)
        .to(".cwd-thinking", { autoAlpha: 0, duration: 0.15 }, `ask+=${2.45 + TYPE_SECONDS}`)
        .to(".cwd-answer", { autoAlpha: 1, y: 0, duration: 0.45 }, `ask+=${2.55 + TYPE_SECONDS}`)
        .to(".cwd-cite", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, `ask+=${2.85 + TYPE_SECONDS}`)

        // ===== Verify (8.4-11.7) =====
        .addLabel("verify", `ask+=${3.3 + TYPE_SECONDS}`)
        .to(
          ".cwd-cursor",
          { x: () => center(".cwd-cite-new").x, y: () => center(".cwd-cite-new").y, duration: 0.55, ease: "power2.inOut" },
          "verify"
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, "verify+=0.6")
        .fromTo(".cwd-cite-new", { scale: 1 }, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1 }, "verify+=0.6")
        .call(() => setNav("library", true), undefined, "verify+=0.75")
        .to(".cwd-view-chat", { autoAlpha: 0, duration: 0.18 }, "verify+=0.75")
        .fromTo(
          ".cwd-view-library",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          "verify+=0.85"
        )
        .to(".cwd-lib-cited", { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "verify+=1.3")
        .to(".cwd-lib-highlight", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "verify+=1.5")

        // ===== Report (11.7-15.5) =====
        .addLabel("report", "verify+=3.3")
        .to(
          ".cwd-cursor",
          { x: () => navCenter("analytics").x, y: () => navCenter("analytics").y, duration: 0.6, ease: "power2.inOut" },
          "report"
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, "report+=0.65")
        .call(() => setNav("analytics", true), undefined, "report+=0.78")
        .to(".cwd-view-library", { autoAlpha: 0, duration: 0.18 }, "report+=0.78")
        .fromTo(
          ".cwd-view-analytics",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          "report+=0.88"
        )
        .to(".cwd-stat-tile", { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.12 }, "report+=1.05")
        .call(
          () => {
            stats.forEach((el) => {
              const target = Number(el.dataset.count ?? "0");
              const o = { v: 0 };
              gsap.to(o, {
                v: target,
                duration: 0.6,
                ease: "power1.out",
                onUpdate: () => (el.textContent = String(Math.round(o.v))),
              });
            });
          },
          undefined,
          "report+=1.15"
        )
        .to(".cwd-report-bar", { scaleY: 1, duration: 0.5, stagger: 0.08 }, "report+=1.7")

        // ===== Rest =====
        .addLabel("rest", "report+=2.6")
        .to(".cwd-cursor", { autoAlpha: 0, duration: 0.3 }, "rest")
        .call(
          () => {
            idleRef.current = gsap.to(reportBars[0] ?? reportBars, {
              scaleY: 0.86,
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
          undefined,
          "rest+=0.2"
        )
        .to(".cwd-replay", { autoAlpha: 1, duration: 0.4 }, "rest+=0.2");

      return () => {
        idleRef.current?.kill();
      };
    },
    { scope: scopeRef }
  );

  const replay = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.invalidate(); // re-measure cursor targets against the current layout
    tl.restart();
  };
```

Behavior notes, kept here so nobody "fixes" them:
- The arm lives inside the timeline so `restart()` re-arms; `invalidate()` before restart re-evaluates the function-based cursor coordinates (GSAP caches them on first run).
- Count swaps and the analytics count-ups are deliberate textContent exceptions; pill width and label colors are instant `gsap.set`s at switch moments, not tweens.
- The capture beat contains zero cursor tweens; the cursor's first appearance is at `goChat`.
- `navSel` picks whichever nav container is actually laid out (sidebar on lg+, strip below), so cursor glides land on the visible nav at any width.
- Analytics count-up tweens are created inside a `.call` (outside the sync context), so they use pre-resolved elements; they are 0.6s one-shots and need no kill bookkeeping. The idle breathe tween IS tracked and killed on re-arm and unmount.
- `stats.forEach` restore: the arm resets stat text to "0"; SSR markup holds the final values for no-JS/reduced-motion.
- `.cwd-tag` matches six chips (three in AddView's feed, three in LibraryView's open note). The capture stagger animates all six; AddView's are DOM-first so the visible ones get indices 0-2 and the intended offsets, while LibraryView's animate 0.15s later inside a hidden view and are at rest long before the library beat. Deliberate: one selector, no visible defect. Do not split the class per view.

- [ ] **Step 3: Build** (kill any running `next dev` first)

Run: `npm run build`
Expected: zero type errors.

- [ ] **Step 4: SSR-unchanged check**

Start dev (read log for port), then:

```bash
curl -s http://localhost:<port>/ > /tmp/tour2.html
grep -c "Where did we land on wire approvals over \$250k?" /tmp/tour2.html  # expect 1 (bubble)
grep -c "1,204" /tmp/tour2.html   # expect 1 (Add view brain count)
grep -o 'data-count="[0-9]*"' /tmp/tour2.html | sort | uniq -c              # expect 41, 12, 7 once each
grep -c "Replay" /tmp/tour2.html  # expect 1
```

Kill the dev server by PID.

- [ ] **Step 5: Commit**

```bash
git add src/components/core-dashboard/CoreDashboard.tsx
git commit -m "feat: cursor-driven five-beat tour timeline

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

---

### Task 4: Production acceptance pass + design record

**Files:**
- Modify: `README.md` (Motion bullet)
- Fix-forward policy: small, obvious defects found during verification may be fixed in `src/components/core-dashboard/*` as separate `fix:` commits (no locked-copy changes, no timeline restructuring); anything structural stops with evidence.

**Interfaces:**
- Consumes: the finished tour; the Playwright rig pattern from the v1 pass.
- Produces: verified screenshots (scratchpad), updated README.

- [ ] **Step 1: Production build and serve** (kill any running `next dev` first)

```bash
npm run build
npx -y serve@latest out -l 4173   # background; kill by PID when done
```

- [ ] **Step 2: Screenshot rig**

`npm install --no-save playwright` if `node -e "require('playwright')"` fails; `npx playwright install chromium` if the browser is missing. Write `tour-shots.mjs` to the session scratchpad:

```js
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4173";
const OUT = process.argv[3] ?? ".";

async function ctx(browser, { w, h, rm }) {
  return browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: rm ? "reduce" : "no-preference",
  });
}

async function scrollAndArm(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 1));
}

async function waitForIdle(page) {
  await page.waitForFunction(
    () => {
      const b = document.querySelector(".cwd-replay");
      return b && !b.hidden && Number(getComputedStyle(b).opacity) > 0.9;
    },
    { timeout: 25000 }
  );
}

const browser = await chromium.launch();
const errors = [];

// End-state shots at three widths
for (const [name, w, h] of [["1440", 1440, 900], ["1728", 1728, 1000], ["390", 390, 844]]) {
  const c = await ctx(browser, { w, h, rm: false });
  const page = await c.newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  await scrollAndArm(page);
  await waitForIdle(page);
  await page.locator("#how-it-works").screenshot({ path: `${OUT}/tour-${name}.png` });
  await c.close();
}

// Mid-take beat shots at 1440
for (const [name, ms] of [["mid-capture", 2200], ["mid-send", 6600], ["mid-library", 10600]]) {
  const c = await ctx(browser, { w: 1440, h: 900, rm: false });
  const page = await c.newPage();
  await scrollAndArm(page);
  await page.waitForTimeout(ms);
  await page.locator("#how-it-works").screenshot({ path: `${OUT}/tour-${name}.png` });
  await c.close();
}

// Reduced-motion resting frame at 390 (Chat answered, no cursor, no Replay)
{
  const c = await ctx(browser, { w: 390, h: 844, rm: true });
  const page = await c.newPage();
  await scrollAndArm(page);
  await page.waitForTimeout(3000);
  const state = await page.evaluate(() => {
    const vis = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).visibility : "missing";
    };
    return {
      chat: vis(".cwd-view-chat"),
      add: vis(".cwd-view-add"),
      cursor: vis(".cwd-cursor"),
      caret: vis(".cwd-caret"),
      replayHidden: document.querySelector(".cwd-replay")?.hidden ?? "missing",
    };
  });
  console.log("RM state:", JSON.stringify(state));
  await page.locator("#how-it-works").screenshot({ path: `${OUT}/tour-390-rm.png` });
  await c.close();
}

// Replay round-trip at 1440: click Replay, confirm the tour re-runs to idle
{
  const c = await ctx(browser, { w: 1440, h: 900, rm: false });
  const page = await c.newPage();
  await scrollAndArm(page);
  await waitForIdle(page);
  await page.locator(".cwd-replay").click();
  await page.waitForTimeout(1500);
  const midReplay = await page.evaluate(() => {
    const add = document.querySelector(".cwd-view-add");
    return add ? Number(getComputedStyle(add).opacity) : -1;
  });
  console.log("mid-replay Add view opacity (expect > 0):", midReplay);
  await waitForIdle(page);
  console.log("replay round-trip: reached idle again");
  await c.close();
}

console.log("page errors:", errors.length ? errors : "none");
await browser.close();
```

Run: `node <scratchpad>/tour-shots.mjs http://localhost:4173 <scratchpad>`
Expected: seven screenshots; `RM state` shows chat visible, add/cursor/caret hidden, replayHidden true; mid-replay Add opacity > 0; "replay round-trip: reached idle again"; page errors none.

- [ ] **Step 3: Inspect every screenshot** (the implementer reads images) against:

- tour-1440/1728: Analytics view at rest (tiles 41/12/7, bars grown), nav indicator on Analytics, Replay visible top-right, no rail, no horizontal overflow.
- tour-390: same resting Analytics via the tab strip; tiles legible.
- tour-mid-capture: Add view, feed card present with tags or Reading state, NO cursor visible, count area present.
- tour-mid-send: Chat view, question bubble present (sent) or composer mid-type with cursor near send; no answer yet or answer just arriving.
- tour-mid-library: Library view, cited note open, highlight swept or sweeping, "Cited just now" chip visible.
- tour-390-rm: answered Chat thread, both citation chips, composer with hint text, no cursor, no Replay, no blinking caret.

- [ ] **Step 4: README design record**

In `README.md`, replace the Motion bullet's dashboard clause (it currently reads `The Core dashboard scene in How it works (dark full-room product frame; a GSAP one-take loop: a note files into the brain rail with tags, the counts tick up, a typed question is answered with a citation to the just-filed note, and the new citation and filed card pulse a shared fern ring; plays once on scroll-into-view via \`CoreDashboard.tsx\`, replayable, and reduced-motion or no-JS render the finished scene),`) with:

```
The Core dashboard tour in How it works (dark product frame; a cursor-driven GSAP take across four views: a meeting transcript ingests itself in Add to the brain, the cursor sends a question in Chat and gets a cited answer, clicking the citation opens the source note in Library, and a June report builds in Analytics; plays once on scroll-into-view via `core-dashboard/CoreDashboard.tsx`, replayable, and reduced-motion or no-JS rest on the answered Chat view),
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: record the dashboard tour in the design record

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

Do not push.

---

## Self-review notes (issues found and fixed inline)

- Spec coverage: section 3 beat table → Task 3 labels match (capture/goChat/ask/verify/report/rest); section 4 copy → Tasks 1-2 verbatim; section 5 deltas (rail gone, sliding pill, cursor spec) → Tasks 2-3; section 6 mechanics (stacked views, measured cursor, send moment, arm-inside-timeline, invalidate-on-replay) → Task 3; section 7 responsive (tab strip, no toast/strip) → Task 2 markup + Task 4 shots; section 8 a11y (sr-only narrative, Replay sibling, cursor decorative) → Task 2; section 9 architecture → file structure; section 11 acceptance → Task 4 (including the no-cursor capture criterion via tour-mid-capture and the replay round-trip probe).
- Type consistency: every selector in Task 3 exists in Task 1/2 markup (checked against the naming registry); `QUESTION` imported from `./shared`; `cwd-stat-tile` and `cwd-live-dot` added to the registry's implied set via Task 1 markup (`cwd-stat-tile` is tweened in Task 3; `cwd-live-dot` is static-only).
- Timing arithmetic: TYPE_SECONDS ≈ 47 × 0.03 ≈ 1.41s; ask beat ends ≈ 4.4 + 3.3 + 1.41 ≈ 9.1 (verify label), report ≈ 12.4, rest ≈ 15.0, idle ≈ 15.6. Within the spec's ~16s.
- The chat composer hint uses `.cwd-composer-hint` which appears in ChatView markup and in the arm/ask sets; registered.
