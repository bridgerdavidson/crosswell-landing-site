"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const QUESTION = "Where did we land on wire approvals over $250k?";
export const ANSWER =
  "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number.";

const TYPE_SECONDS = QUESTION.length * 0.028;
const RING_ON = "0 0 0 1.5px rgba(147,179,147,0.55)";
const RING_OFF = "0 0 0 1.5px rgba(147,179,147,0)";

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
      const filedCards = scope.querySelectorAll<HTMLElement>(".cwd-filed");

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

      filedCards.forEach((card) => {
        tl.to(
          card.querySelectorAll<HTMLElement>(".cwd-tag"),
          { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 },
          1.0
        );
      });

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
      <p className="sr-only">
        Product preview: a policy note is filed into the firm&apos;s brain,
        tagged, and moments later a question about wire approvals is answered
        with citations to that note.
      </p>

      <div className="relative">
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
              <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-3 pt-24 md:pt-0">
                {/* Mobile capture toast (below md the rail is hidden; the filed
                    card plays as a floating toast instead) */}
                <FiledCard className="cwd-filed-toast absolute right-0 top-0 z-10 w-[218px] md:hidden" />

                <div className="cwd-q max-w-[78%] self-end rounded-2xl rounded-br-[5px] bg-charcoal px-3.5 py-2 text-[13px] leading-relaxed">
                  <span className="cwd-qtext">{QUESTION}</span>
                  <span
                    className="cwd-caret chat-caret ml-0.5 opacity-0 invisible"
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

        <button
          type="button"
          hidden
          onClick={replay}
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
