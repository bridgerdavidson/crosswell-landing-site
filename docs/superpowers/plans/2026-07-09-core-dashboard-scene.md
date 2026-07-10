# Core Dashboard Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the chat-only demo in How It Works with a dark, scripted Crosswell Core dashboard scene that plays the product's capture-organize-recall loop as one GSAP take.

**Architecture:** One new client component (`CoreDashboard.tsx`) server-renders the finished scene (all zones populated), then a scoped `useGSAP` timeline arms it to hidden states on mount and plays the loop once on scroll-in. `HowItWorks.tsx` restructures to steps-above, scene-below. `ChatDemo.tsx` is deleted.

**Tech Stack:** Next.js 15 (App Router, `output: "export"`), React 19, Tailwind v4 (`@theme` tokens in `src/app/globals.css`), GSAP 3 + `@gsap/react` (ScrollTrigger; free plugins only), TypeScript.

**Spec:** `docs/superpowers/specs/2026-07-09-core-dashboard-scene-design.md` (decisions of record live there; this plan implements it exactly).

## Global Constraints

- **No em dashes in any copy or docs. Ever.** Use middots (`·`) as separators.
- No real client names: the workspace label is "Your firm". Caption under the frame: "Product preview. Illustrative data."
- Copy is locked (section 4 of the spec); do not rewrite it.
- Brand tokens only (`ivory`, `parchment`, `fern`, `fern-deep`, `fern-soft`, `fern-mist`, `warmgray`, `charcoal`, `charcoal-deep`, `ink`) plus exactly three component-local dark hexes: `#161512` (sunken rail), `#24221c` (raised cards), `#3c4a38` (dim sparkline bars). Do not add them to `@theme`.
- Icons: inline SVG only (Lucide-style strokes, `strokeWidth={1.8}`). Never emoji.
- Tabular numerals (`tabular-nums`) on every animated counter.
- Animation: transform/opacity only, except the deliberate count-text swap and box-shadow ring pulse. Reserve heights; zero layout shift at rest.
- `prefers-reduced-motion` and no-JS must both show the finished scene.
- New runtime deps allowed: `gsap`, `@gsap/react` only. Playwright is verification-only: install with `--no-save`.
- Do not touch `vercel.json` or build config. Static export stays.
- Dev server: port 3000 is often taken by another app. Read the dev-server log for the real port; never assume.
- Conventional commits with the repo's trailer:

  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm
  ```

## File Structure

- `src/components/CoreDashboard.tsx` (create): the whole scene. In-file subcomponents: icons, `FiledCard`, `Sparkbars`. Task 1 writes the complete static markup for all breakpoints; Task 2 adds the timeline.
- `src/components/HowItWorks.tsx` (modify): kicker/H2 unchanged; steps become a 3-across row; scene mounts full-width below. Not wrapped in `Reveal` (GSAP owns the entrance).
- `src/components/ChatDemo.tsx` (delete): copy and the typing technique carry into the scene.
- `package.json` (modify, Task 2): add `gsap`, `@gsap/react`.
- `README.md` (modify, Task 3): design record update.
- `src/app/globals.css`: NOT modified. `.chat-caret` and `.chat-dot` are reused by the scene (the caret gets an inline fern-soft background override for dark surfaces).

---

### Task 1: Static finished scene + section restructure

**Files:**
- Create: `src/components/CoreDashboard.tsx`
- Modify: `src/components/HowItWorks.tsx` (full rewrite, 57 lines)
- Delete: `src/components/ChatDemo.tsx`

**Interfaces:**
- Consumes: `Reveal` (`src/components/Reveal.tsx`, props `{children, delay?, className?}`); Tailwind theme tokens; `.chat-caret`/`.chat-dot` classes from `globals.css`.
- Produces: default export `CoreDashboard(): JSX.Element` (no props). GSAP target classes that Task 2 relies on, exactly: `cwd-scope`, `cwd-frame`, `cwd-filed`, `cwd-tag`, `cwd-count`, `cwd-plus1`, `cwd-bar-new`, `cwd-q`, `cwd-qtext`, `cwd-caret`, `cwd-thinking`, `cwd-answer`, `cwd-cite`, `cwd-cite-new`, `cwd-replay`. Module constants `QUESTION`, `ANSWER`.

- [ ] **Step 1: Create `src/components/CoreDashboard.tsx`** with the complete static scene (finished state, all breakpoints):

```tsx
"use client";

export const QUESTION = "Where did we land on wire approvals over $250k?";
export const ANSWER =
  "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number.";

const SPARK_HEIGHTS = [35, 55, 40, 70, 50, 60, 90];

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

function IconChat() {
  return (
    <svg {...iconProps}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg {...iconProps}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconFolder() {
  return (
    <svg {...iconProps}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconBars() {
  return (
    <svg {...iconProps}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg {...iconProps} className="h-[11px] w-[11px] flex-none" strokeWidth={2.4}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconUp() {
  return (
    <svg {...iconProps} className="h-3 w-3 flex-none" strokeWidth={2.2}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Chat", icon: <IconChat />, active: true },
  { label: "Add to the brain", icon: <IconPlus />, active: false },
  { label: "Library", icon: <IconFolder />, active: false },
  { label: "Analytics", icon: <IconBars />, active: false },
];

function FiledCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`cwd-filed rounded-xl bg-[#24221c] p-3 shadow-[0_0_0_1.5px_rgba(147,179,147,0.55)] ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-fern-soft">
        <IconCheck />
        Filed just now
      </div>
      <p className="mt-0.5 mb-1.5 text-xs font-semibold text-ivory/90">
        Policy note · Wire approvals
      </p>
      <div className="flex flex-wrap gap-1">
        {["Operations", "Policy", "April"].map((tag) => (
          <span
            key={tag}
            className="cwd-tag rounded-full bg-ivory/8 px-2 py-px text-[9.5px] font-semibold text-ivory/55"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Sparkbars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {SPARK_HEIGHTS.map((h, i) => (
        <i
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-[2px] ${
            i === SPARK_HEIGHTS.length - 1
              ? "cwd-bar-new origin-bottom bg-fern-soft"
              : "bg-[#3c4a38]"
          }`}
        />
      ))}
    </div>
  );
}

export default function CoreDashboard() {
  return (
    <div className="cwd-scope mx-auto max-w-5xl">
      <p className="sr-only">
        Product preview: a policy note is filed into the firm&apos;s brain,
        tagged, and moments later a question about wire approvals is answered
        with citations to that note.
      </p>

      <div
        aria-hidden="true"
        className="cwd-frame overflow-hidden rounded-2xl bg-ink text-ivory shadow-[0_24px_60px_rgba(26,25,21,0.25)]"
      >
        {/* Top bar (hairline 1 of 2) */}
        <div className="flex items-center gap-2.5 border-b border-ivory/10 px-4 py-3 sm:px-5">
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-md bg-fern text-[10px] font-bold text-ivory">
            ✕
          </span>
          <span className="text-[13.5px] font-semibold tracking-[0.01em]">
            Crosswell Core
          </span>
          <span className="text-xs text-ivory/45">· Your firm</span>
          <span className="flex-1" />
          <span className="hidden items-center gap-2 text-[11px] text-ivory/45 sm:flex">
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
          <button
            type="button"
            hidden
            className="cwd-replay ml-2 cursor-pointer text-xs font-medium text-fern-soft transition-colors hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fern-soft"
          >
            Replay
          </button>
        </div>

        <div className="flex min-h-[420px]">
          {/* Sidebar (lg+ only, no hairline: tonal separation) */}
          <div className="hidden w-[168px] flex-none px-2.5 py-3.5 lg:block">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`mb-0.5 flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-xs font-medium ${
                  item.active ? "bg-fern/20 text-[#b5cbb5]" : "text-ivory/55"
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>

          {/* Chat canvas */}
          <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-5 sm:px-6">
            <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-3 pt-16 md:pt-0">
              {/* Mobile capture toast (below md the rail is hidden; the filed
                  card plays as a floating toast instead) */}
              <FiledCard className="cwd-filed-toast absolute right-0 top-0 z-10 w-[218px] md:hidden" />

              <div className="cwd-q max-w-[78%] self-end rounded-2xl rounded-br-[5px] bg-charcoal px-3.5 py-2 text-[13px] leading-relaxed">
                <span className="cwd-qtext">{QUESTION}</span>
                <span
                  className="cwd-caret chat-caret ml-0.5 opacity-0"
                  style={{ background: "var(--color-fern-soft)" }}
                />
              </div>

              <div className="relative min-h-[172px] sm:min-h-[128px]">
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

            <div className="mx-auto mt-4 flex w-full max-w-[560px] items-center gap-2.5 rounded-full bg-[#24221c] py-2.5 pl-4 pr-2.5 text-[13px] text-ivory/40">
              Ask anything about your firm…
              <span className="ml-auto flex h-6 w-6 flex-none items-center justify-center rounded-full bg-fern text-ivory">
                <IconUp />
              </span>
            </div>

            {/* Mobile stats strip (compresses the rail's numbers below md) */}
            <div className="mx-auto mt-4 flex w-full max-w-[560px] items-center gap-4 text-[11px] text-ivory/45 md:hidden">
              <span className="tabular-nums">
                <b className="cwd-count font-semibold text-ivory">1,204</b> notes
              </span>
              <span className="cwd-plus1 rounded-full bg-fern/20 px-2 py-px font-semibold text-fern-soft">
                +1 just now
              </span>
              <Sparkbars className="h-4 w-16 flex-none" />
              <span className="tabular-nums">34 this week</span>
            </div>
          </div>

          {/* Brain rail (md+, hairline 2 of 2, sunken tone) */}
          <div className="hidden w-[218px] flex-none border-l border-ivory/8 bg-[#161512] p-3.5 md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ivory/40">
              The brain
            </p>
            <p className="mt-2.5 text-[23px] font-semibold leading-none tabular-nums">
              <span className="cwd-count">1,204</span>{" "}
              <span className="text-[11px] font-medium text-ivory/45">notes</span>
            </p>
            <span className="cwd-plus1 mt-1.5 inline-block rounded-full bg-fern/20 px-2 py-px text-[10.5px] font-semibold text-fern-soft">
              +1 just now
            </span>
            <Sparkbars className="mb-1 mt-3.5 h-[30px]" />
            <p className="text-[11px] tabular-nums text-ivory/45">
              34 questions answered this week
            </p>
            <FiledCard className="mt-3.5" />
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-ink/45">
        Product preview. Illustrative data.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/HowItWorks.tsx`** (steps row above, scene below; steps copy unchanged):

```tsx
import CoreDashboard from "./CoreDashboard";
import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Knowledge flows in",
    body: "Forward an email, drop a file, leave a voice note, or let the meeting bot listen. Capture happens inside the work your team already does, not as a second job.",
  },
  {
    number: "02",
    title: "Core organizes it",
    body: "Every piece gets sorted, tagged, and linked to the people, deals, and decisions it touches. No folders, no filing, no maintenance. The brain stays sharp on its own.",
  },
  {
    number: "03",
    title: "Anyone asks anything",
    body: "Plain-language questions, answers grounded in your firm's actual context, with the sources shown. A new hire can inherit the whole firm on day one.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-kicker mb-4 text-fern-deep">How it works</p>
        <h2 className="type-h2 max-w-2xl text-ink">
          Your firm&apos;s memory, working for you.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 120}>
            <div className="flex gap-5">
              <span className="type-accent italic text-fern">{step.number}</span>
              <div>
                <h3 className="type-h3 text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <CoreDashboard />
      </div>
    </section>
  );
}
```

Note: the scene is deliberately NOT wrapped in `Reveal`; the GSAP settle beat (Task 2) owns its entrance, and until then the static frame simply shows.

- [ ] **Step 3: Delete the old demo**

Run: `rm src/components/ChatDemo.tsx && grep -rn "ChatDemo" src/ || echo "no references"`
Expected: `no references`

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: compiles with zero type errors; static export succeeds.

- [ ] **Step 5: Visual check in dev**

Run: `npm run dev` in the background, then READ THE LOG for the actual port (3000 is usually taken). Open `http://localhost:<port>/#how-it-works`. Verify: dark frame renders finished (question, answer, citations, filed card, counts all visible); three steps sit in a row above on desktop; caption below frame; sidebar visible at 1024px+, rail visible at 768px+, mobile shows toast + stats strip. Kill the dev server after.

- [ ] **Step 6: Commit**

```bash
git add src/components/CoreDashboard.tsx src/components/HowItWorks.tsx
git add -u src/components/ChatDemo.tsx
git commit -m "feat: restructure How It Works around the static Core dashboard scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

---

### Task 2: GSAP one-take timeline

**Files:**
- Modify: `package.json` + `package-lock.json` (via npm install)
- Modify: `src/components/CoreDashboard.tsx` (add imports, hook, replay handler; markup from Task 1 already carries every target class)

**Interfaces:**
- Consumes: Task 1's target classes (`cwd-frame`, `cwd-filed`, `cwd-tag`, `cwd-count`, `cwd-plus1`, `cwd-bar-new`, `cwd-q`, `cwd-qtext`, `cwd-caret`, `cwd-thinking`, `cwd-answer`, `cwd-cite`, `cwd-cite-new`, `cwd-replay`) and constants `QUESTION`.
- Produces: the finished component; nothing downstream consumes its internals.

- [ ] **Step 1: Install GSAP**

Run: `npm install gsap @gsap/react`
Expected: both appear under `dependencies` in `package.json`.

- [ ] **Step 2: Add the timeline to `CoreDashboard.tsx`**

Add imports and registration at the top of the file (below `"use client"`):

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPE_SECONDS = QUESTION.length * 0.028;
const RING_ON = "0 0 0 1.5px rgba(147,179,147,0.55)";
const RING_OFF = "0 0 0 1.5px rgba(147,179,147,0)";
```

Replace the `export default function CoreDashboard()` body's opening so the component holds refs and the hook (the returned JSX stays byte-identical to Task 1 except the two attributes flagged below):

```tsx
export default function CoreDashboard() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return; // finished scene stays as server-rendered; replay stays hidden
      }
      const scope = scopeRef.current;
      if (!scope) return;

      // NodeLists resolved once; late-created tweens (idle) must use elements,
      // not selector strings, because they run outside the useGSAP context.
      const qTexts = scope.querySelectorAll<HTMLElement>(".cwd-qtext");
      const counts = scope.querySelectorAll<HTMLElement>(".cwd-count");
      const replays = scope.querySelectorAll<HTMLButtonElement>(".cwd-replay");
      const newBars = scope.querySelectorAll<HTMLElement>(".cwd-bar-new");

      const setQuestion = (v: string) => qTexts.forEach((n) => (n.textContent = v));
      const setCounts = (v: string) => counts.forEach((n) => (n.textContent = v));

      const tw = { i: 0 };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top 75%", once: true },
        defaults: { ease: "power2.out" },
      });
      tlRef.current = tl;

      tl
        // Beat 0: arm. Lives inside the timeline so restart() re-arms cleanly.
        .call(() => {
          idleRef.current?.kill();
          idleRef.current = null;
          tw.i = 0;
          setQuestion("");
          setCounts("1,203");
          replays.forEach((b) => (b.hidden = false));
        })
        .set(".cwd-frame", { autoAlpha: 0, y: 12 })
        .set([".cwd-q", ".cwd-thinking", ".cwd-answer", ".cwd-plus1", ".cwd-replay"], {
          autoAlpha: 0,
        })
        .set(".cwd-filed", { autoAlpha: 0, x: 16, boxShadow: RING_OFF })
        .set(".cwd-tag", { autoAlpha: 0, y: 4 })
        .set(".cwd-cite", { autoAlpha: 0, y: 6 })
        .set(".cwd-cite-new", { boxShadow: RING_OFF })
        .set(".cwd-bar-new", { scaleY: 0.12 })

        // Settle: 0.0-0.6s
        .to(".cwd-frame", { autoAlpha: 1, y: 0, duration: 0.6 })

        // Capture: 0.6-2.4s
        .to(".cwd-filed", { autoAlpha: 1, x: 0, duration: 0.5 }, 0.7)
        .to(".cwd-tag", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 }, 1.0)
        .call(() => setCounts("1,204"), undefined, 1.5)
        .fromTo(".cwd-count", { y: -3 }, { y: 0, duration: 0.25 }, 1.5)
        .to(".cwd-plus1", { autoAlpha: 1, duration: 0.3 }, 1.55)
        .to(".cwd-bar-new", { scaleY: 1, duration: 0.6 }, 1.6)

        // Question: 2.4s onward (typewriter, then thinking dots)
        .to(".cwd-q", { autoAlpha: 1, duration: 0.2 }, 2.4)
        .to(".cwd-caret", { autoAlpha: 1, duration: 0.1 }, 2.4)
        .to(
          tw,
          {
            i: QUESTION.length,
            duration: TYPE_SECONDS,
            ease: "none",
            onUpdate: () => setQuestion(QUESTION.slice(0, Math.round(tw.i))),
          },
          2.6
        )
        .to(".cwd-caret", { autoAlpha: 0, duration: 0.15 }, 2.6 + TYPE_SECONDS + 0.35)
        .to(".cwd-thinking", { autoAlpha: 1, duration: 0.2 }, 2.6 + TYPE_SECONDS + 0.4)

        // Answer: after ~1.9s of thinking
        .to(".cwd-thinking", { autoAlpha: 0, duration: 0.15 }, "+=1.9")
        .fromTo(
          ".cwd-answer",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5 }
        )
        .to(".cwd-cite", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, "-=0.15")

        // Payoff: shared ring pulses twice, ends ON (matches the resting class)
        .fromTo(
          [".cwd-cite-new", ".cwd-filed"],
          { boxShadow: RING_OFF },
          {
            boxShadow: RING_ON,
            duration: 0.35,
            repeat: 2,
            yoyo: true,
            ease: "sine.inOut",
          },
          "+=0.4"
        )

        // Idle: last bar breathes; replay appears
        .call(() => {
          idleRef.current = gsap.to(newBars, {
            scaleY: 0.85,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        })
        .to(".cwd-replay", { autoAlpha: 1, duration: 0.4 });

      return () => {
        idleRef.current?.kill();
      };
    },
    { scope: scopeRef }
  );

  const replay = () => {
    tlRef.current?.restart();
  };

  return (
    <div ref={scopeRef} className="cwd-scope mx-auto max-w-5xl">
```

The only two JSX attribute changes from Task 1: `ref={scopeRef}` on the root div (shown above), and `onClick={replay}` on the Replay button:

```tsx
          <button
            type="button"
            hidden
            onClick={replay}
            className="cwd-replay ml-2 cursor-pointer text-xs font-medium text-fern-soft transition-colors hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fern-soft"
          >
            Replay
          </button>
```

Behavior notes baked into the code above, kept here so nobody "fixes" them:
- Server HTML is the finished scene; the arm beat runs inside the timeline so `restart()` re-arms. Until ScrollTrigger fires, the arm `.set()`s have NOT run, so an unscrolled scene stays finished. That is correct: ScrollTrigger at `top 75%` fires before the frame is meaningfully visible.
- `autoAlpha` (opacity + visibility) keeps hidden elements out of the focus order and preserves reserved space (no CLS).
- The mobile toast and rail card share `.cwd-filed`; both counters share `.cwd-count`. Tweens hit NodeLists; animating a `display: none` breakpoint twin is harmless.
- The idle tween is created inside a timeline `.call()`, outside the sync useGSAP context, so it uses the `newBars` NodeList and is killed both on re-arm and in the cleanup return.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: zero type errors, export succeeds.

- [ ] **Step 4: Behavior check in dev**

Run dev server (read log for port). Verify, in order:
1. Load the page fresh, scroll slowly to How It Works: scene starts hidden, plays settle, filed card slides in, tags stagger, count flips 1,203 to 1,204, bar grows, question types with caret, dots think, answer rises, citations stagger, the new citation and filed card pulse their ring twice together, last bar breathes, Replay fades in.
2. Click Replay: full loop replays identically.
3. Chrome DevTools > Rendering > "Emulate CSS prefers-reduced-motion: reduce", reload: scene renders finished immediately, nothing animates, Replay never appears.
4. Disable JavaScript (DevTools > Command menu > "Disable JavaScript"), reload: finished scene, no blank frame.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/components/CoreDashboard.tsx
git commit -m "feat: GSAP one-take capture-to-recall loop for the dashboard scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

---

### Task 3: Acceptance pass on the production build + design record

**Files:**
- Modify: `README.md` (two small edits)
- No product code changes expected; fix-forward if verification fails.

**Interfaces:**
- Consumes: the finished scene from Task 2; `npm run build` output in `out/`.
- Produces: verified screenshots (scratchpad, not committed) and the updated design record.

- [ ] **Step 1: Production build and serve**

```bash
npm run build
npx -y serve@latest out -l 4173
```

Expected: build passes; site serves at `http://localhost:4173`.

- [ ] **Step 2: Screenshot rig (verification-only dependency)**

```bash
npm install --no-save playwright
npx playwright install chromium
```

Write this script to the session scratchpad (NOT the repo) as `shot.mjs`:

```js
import { chromium } from "playwright";

const [url, out, w, h, rm] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  reducedMotion: rm === "rm" ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.locator("#how-it-works").scrollIntoViewIfNeeded();
await page.waitForTimeout(12000); // let the ~9s take finish and settle to idle
await page.locator("#how-it-works").screenshot({ path: out });
await browser.close();
console.log("saved", out);
```

- [ ] **Step 3: Capture the standing viewport set (1440 / 1728 / 390) plus reduced motion**

```bash
node <scratchpad>/shot.mjs http://localhost:4173/ <scratchpad>/scene-1440.png 1440 900
node <scratchpad>/shot.mjs http://localhost:4173/ <scratchpad>/scene-1728.png 1728 1000
node <scratchpad>/shot.mjs http://localhost:4173/ <scratchpad>/scene-390.png 390 844
node <scratchpad>/shot.mjs http://localhost:4173/ <scratchpad>/scene-390-rm.png 390 844 rm
```

Inspect all four (send to the user). Pass criteria:
- 1440/1728: full three-zone frame, played to idle (answer + citations + filed card + ring visible, count reads 1,204), steps row above, no horizontal overflow.
- 390: no sidebar, no rail; toast card and stats strip present; type legible (nothing under ~10px effective); no overlap between toast and question bubble.
- 390-rm: identical finished content without having played (validates the reduced-motion path on the production bundle, which also stands in for the no-JS-before-hydration state).

- [ ] **Step 4: Built-CSS sanity check**

The minifier has previously rewritten gradient stops. The scene uses no CSS gradients, but confirm the ring shadows and arbitrary values survived:

```bash
grep -o "147,179,147[^;\"]*" out/_next/static/css/*.css | head -5
grep -c "24221c" out/_next/static/css/*.css
```

Expected: the rgba(147,179,147,…) shadow values appear intact; `24221c` count is nonzero.

- [ ] **Step 5: Update the README design record**

In `README.md` line 12 (the `- **Motion:**` bullet), replace the clause `Typed chat simulation in How it works,` with:

```
The Core dashboard scene in How it works (dark full-room product frame; a GSAP one-take loop: a note files into the brain rail with tags, the counts tick up, a typed question is answered with a citation to the just-filed note, and the new citation and filed card pulse a shared fern ring; plays once on scroll-into-view via `CoreDashboard.tsx`, replayable, and reduced-motion or no-JS render the finished scene),
```

In `README.md` line 19 (page order), replace `How it works (+ chat demo)` with `How it works (+ dashboard scene)`.

- [ ] **Step 6: Final commit**

```bash
git add README.md
git commit -m "docs: record the Core dashboard scene in the design record

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HvdvdGJfLQc47L9rNDbkcm"
```

Do not push without the user's say-so: pushing `main` deploys to production.

---

## Self-review notes (issues found and fixed inline)

- Spec coverage: section 3 (restructure) → Task 1; section 4-5 (frame, visual system) → Task 1; section 6 (motion, replay, reduced motion, no-JS) → Task 2; section 7 (responsive, including the toast/strip mobile variant) → Task 1 markup + Task 3 verification; section 8 (a11y: sr-only summary, aria-hidden frame, focusable replay) → Task 1 markup + Task 2 autoAlpha behavior; section 9 (files, deps) → Tasks 1-2; section 11 acceptance → Task 3. No gaps.
- Type consistency: every GSAP selector in Task 2 exists as a class in Task 1's markup (checked name-by-name against the Interfaces list). `QUESTION` is exported from the same file the hook lives in.
- The spec's beat table says thinking ends near 6.5s; with the 47-character question the typewriter math lands the answer at ~6.4s. Within tolerance; no tuning step needed.
