"use client";

import { AddView } from "./AddView";
import { AnalyticsView } from "./AnalyticsView";
import { ChatView } from "./ChatView";
import { LibraryView } from "./LibraryView";
import { IconBars, IconChat, IconFolder, IconPlus } from "./shared";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { QUESTION } from "./shared";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPE_SECONDS = QUESTION.length * 0.03;

const NAV = [
  { key: "add", label: "Add to Core", short: "Add", Icon: IconPlus },
  { key: "chat", label: "Chat", short: "Chat", Icon: IconChat },
  { key: "library", label: "Library", short: "Library", Icon: IconFolder },
  { key: "analytics", label: "Analytics", short: "Analytics", Icon: IconBars },
] as const;

// One caption per view, revealed in sync with the tour. Default (reduced-motion
// / no-JS rest) is the Chat line, matching the resting Chat view.
const CAPTIONS = {
  add: "Meetings, emails, and files flow in on their own. Add anything else by hand.",
  chat: "Ask in plain language. Every answer is grounded in your firm's own context.",
  library: "Each answer traces back to the exact note it came from.",
  analytics: "Ask for a read on the whole firm, and it writes the report.",
} as const;

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
  const scopeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Tween | null>(null);
  const liveRef = useRef<gsap.core.Tween | null>(null);

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
      const liveDots = scope.querySelectorAll<HTMLElement>(".cwd-live-dot");
      const captionEl = scope.querySelector<HTMLElement>(".cwd-caption");

      const setComposer = (v: string) =>
        composerText.forEach((n) => (n.textContent = v));

      // Swap the caption in sync with the active view (quick crossfade).
      const setCaption = (text: string) => {
        if (!captionEl) return;
        gsap.to(captionEl, {
          opacity: 0,
          duration: 0.18,
          onComplete: () => {
            captionEl.textContent = text;
            gsap.to(captionEl, { opacity: 1, duration: 0.28 });
          },
        });
      };

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

      let navKey = "chat";
      let armed = false;

      // Nav indicator: instant width/position set + label colors (sets, not tweens).
      const setNav = (key: string, animate: boolean) => {
        navKey = key;
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

      const onResize = () => {
        if (armed) setNav(navKey, false);
      };
      window.addEventListener("resize", onResize);

      const tw = { i: 0 };

      const tl = gsap.timeline({
        // start once the dashboard is comfortably in view (~60% down) so the
        // whole tour is caught from the first frame
        scrollTrigger: { trigger: scope, start: "top 62%", once: true },
        defaults: { ease: "power2.out" },
      });
      tlRef.current = tl;

      tl
        // ===== Arm (t=0; restart() re-runs all of this) =====
        .call(() => {
          armed = true;
          idleRef.current?.kill();
          idleRef.current = null;
          liveRef.current?.kill();
          liveRef.current = gsap.to(liveDots, {
            opacity: 0.35,
            duration: 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          tw.i = 0;
          setComposer("");
          brainCounts.forEach((n) => (n.textContent = "1,203"));
          stats.forEach((n) => (n.textContent = "0"));
          replays.forEach((b) => (b.hidden = false));
          setNav("add", false);
          if (captionEl) {
            captionEl.textContent = CAPTIONS.add;
            gsap.set(captionEl, { opacity: 1 });
          }
        })
        .set(".cwd-nav-chat-static", { autoAlpha: 0 })
        // frame is pre-hidden via CSS (.js .cwd-frame{opacity:0}); only offset it
        // here, then fade it in below. Never yank a visible frame to 0 (that
        // flashed the light page through the black frame on first play).
        .set(".cwd-frame", { y: 22 })
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
        .set(".cwd-cursor", { autoAlpha: 0, scale: 1, xPercent: 0, yPercent: 0, transformOrigin: "0% 0%" })
        .set(".cwd-replay", { autoAlpha: 0 })

        // ===== Settle (0-0.7): clean fade+rise in, matching the site reveals =====
        .to(".cwd-frame", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)

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
        .addLabel("goChat", 5.2)
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
        .call(() => setCaption(CAPTIONS.chat), undefined, "goChat+=0.78")
        .to(".cwd-view-add", { autoAlpha: 0, duration: 0.18 }, "goChat+=0.78")
        .fromTo(
          ".cwd-view-chat",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.28 },
          "goChat+=0.88"
        )

        // ===== Ask (4.4-8.4) =====
        .addLabel("ask", 6.1)
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
        .addLabel("verify", `ask+=${5.9 + TYPE_SECONDS}`)
        .to(
          ".cwd-cursor",
          { x: () => center(".cwd-cite-new").x, y: () => center(".cwd-cite-new").y, duration: 0.55, ease: "power2.inOut" },
          "verify"
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, "verify+=0.6")
        .fromTo(".cwd-cite-new", { scale: 1 }, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1 }, "verify+=0.6")
        .call(() => setNav("library", true), undefined, "verify+=0.75")
        .call(() => setCaption(CAPTIONS.library), undefined, "verify+=0.75")
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
        .addLabel("report", "verify+=5.3")
        .to(
          ".cwd-cursor",
          { x: () => navCenter("analytics").x, y: () => navCenter("analytics").y, duration: 0.6, ease: "power2.inOut" },
          "report"
        )
        .to(".cwd-cursor", { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, "report+=0.65")
        .call(() => setNav("analytics", true), undefined, "report+=0.78")
        .call(() => setCaption(CAPTIONS.analytics), undefined, "report+=0.78")
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
        .addLabel("rest", "report+=3.0")
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
        window.removeEventListener("resize", onResize);
        idleRef.current?.kill();
        liveRef.current?.kill();
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

  return (
    <div className="cwd-scope mx-auto max-w-5xl" ref={scopeRef}>
      <p className="sr-only">
        Product preview: your firm&apos;s Core ingests a meeting transcript
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
            <span className="text-[13.5px] font-semibold tracking-[0.01em]">
              Your firm&apos;s Core
            </span>
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

          {/* Cursor (playback only) — a white mouse pointer; the tip is the
              hotspot, so the GSAP arm sets its origin to the top-left corner */}
          <div className="cwd-cursor invisible absolute left-0 top-0 z-20">
            <svg
              width="21"
              height="21"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="block drop-shadow-[0_2px_5px_rgba(26,25,21,0.5)]"
            >
              <path
                d="M1.2 1.2 L1.2 16.4 L5.3 12.6 L8 18.7 L10.5 17.6 L7.9 11.6 L13.4 11.6 Z"
                fill="#fff"
                stroke="rgba(26,25,21,0.55)"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
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

      <div className="mt-5 text-center">
        <p className="cwd-caption mx-auto min-h-[2.75rem] max-w-xl text-sm leading-relaxed text-charcoal/80 sm:text-[15px]">
          {CAPTIONS.chat}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-warmgray">
          Product preview · Illustrative
        </p>
      </div>
    </div>
  );
}
