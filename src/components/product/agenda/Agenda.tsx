"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { agenda } from "@/lib/saguaro";
import { Chapter, Check, Chip, Dot, Frame, Mark, Rail, TopBar } from "../shared";
import { ease, primeDraw, readyReplay } from "../shared/useSequence";

gsap.registerPlugin(ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Chapter 02's choreography, the scroll-driven chapter.
 *
 * At md and above the frame holds (position: sticky, set in globals.css
 * under the .js gate) while two viewport heights scroll past, and the
 * scroll position scrubs one timeline over the frame:
 *
 *   0.00 to 0.62  the team panel and the rocks panel pan in on one rigid
 *                 track (linear in scroll): at 0 the team panel's left edge
 *                 sits at the right fade's start, its title dissolving in
 *                 the fade, and the rocks panel is past the frame's edge;
 *                 your day stays put as the frozen first column. The team
 *                 panel's rows assemble 0.02 apart as it clears the fade;
 *                 the rocks panel's rows assemble and its bars draw as it
 *                 crosses the fade from 0.38.
 *   0.44 to 0.50  the moment: the Draw 4 row's watch dot goes and its check
 *                 draws in your day.
 *   0.52 to 0.58  the check propagates: Dana's site-walk row flips done as
 *                 the pan clears the team panel.
 *   0.66 to 0.74  the deployment rock nudges from 68 to 70, number and bar,
 *                 as the rocks panel lands.
 *   0.80 to 0.88  the status chip settles under your day: "synced to Asana".
 *   0.88 to 1.00  still; then the frame releases.
 *
 * Scrubbed, so scrolling back reverses all of it. Your day itself assembles
 * on the clock when the frame reaches the unified depth (the title rises,
 * the rows slide in 80ms apart, tomorrow follows), like chapter 01. Below
 * 768 there is no pin and no scrub: each panel plays once, on the clock,
 * when its own top reaches the unified depth (your day with the check and
 * the chip, the team with Dana's flip, the rocks with the nudge), and
 * Replay in the caption row restarts the three. Reduced motion and no-JS
 * get the flat finished chapter: no pin, every check drawn, 70, the chip.
 */
function useAgendaMotion(
  frame: RefObject<HTMLDivElement | null>,
  replay: RefObject<HTMLButtonElement | null>
) {
  useEffect(() => {
    const el = frame.current;
    const pin = el?.parentElement;
    if (!el || !pin) return;
    const mm = gsap.matchMedia();

    /* what both layouts share: the rock's before and after, the checks */
    const q = gsap.utils.selector(el);
    const prime = () => {
      const rock = q<HTMLElement>("[data-rock='draw-4']")[0];
      const num = rock.querySelector<HTMLElement>("[data-rock-num]")!;
      const bar = rock.querySelector<HTMLElement>("[data-rock-bar]")!;
      const was = Number(rock.dataset.was);
      const pct = Number(num.textContent);
      const bars = q<HTMLElement>("[data-rock-bar]");
      const targets = bars.map((b) => (b === bar ? `${was}%` : b.style.width));
      const checks = q<SVGPathElement>("[data-seq='mark-day'] path, [data-seq='mark-team'] path");
      const lens = checks.map(primeDraw);
      num.textContent = String(was);
      return { num, bar, was, pct, bars, targets, checks, lens };
    };
    const restore = (s: ReturnType<typeof prime>) => {
      s.num.textContent = String(s.pct);
    };
    const dayIntro = (tl: gsap.core.Timeline, at: number) => {
      tl.fromTo(q("[data-seq='day-title']"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, at);
      tl.fromTo(q("[data-seq='day']"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, at + 0.15);
      tl.fromTo(q("[data-seq='tomorrow']"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, at + 0.8);
    };
    /* a mark flips: the dot goes, the check draws */
    const flip = (tl: gsap.core.Timeline, seq: string, path: SVGPathElement, len: number, at: number, dur: number) => {
      const mark = q(`[data-seq='${seq}']`)[0];
      const pre = mark.parentElement!.querySelector(".product-mark-pre");
      tl.to(pre, { opacity: 0, scale: 0.6, duration: dur * 0.6 }, at);
      tl.set(mark, { opacity: 1 }, at + dur * 0.2);
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: dur }, at + dur * 0.2);
    };
    const nudge = (tl: gsap.core.Timeline, s: ReturnType<typeof prime>, at: number, dur: number) => {
      const n = { v: s.was };
      tl.fromTo(
        n,
        { v: s.was },
        { v: s.pct, duration: dur, onUpdate: () => (s.num.textContent = String(Math.round(n.v))) },
        at
      );
      tl.fromTo(s.bar, { width: `${s.was}%` }, { width: `${s.pct}%`, duration: dur }, at);
    };

    mm.add(`(min-width: 768px) and ${MOTION}`, () => {
      const s = prime();
      const p2 = q<HTMLElement>("[data-panel='team']")[0];
      const p3 = q<HTMLElement>("[data-panel='rocks']")[0];
      const fadeX = () => parseFloat(getComputedStyle(el).getPropertyValue("--fade-x")) || 160;
      /* the track starts with the team panel's left edge at the fade's start */
      const travel = () => Math.max(0, el.clientWidth - fadeX() - p2.offsetLeft);

      /* your day, on the clock at the unified depth */
      const intro = gsap.timeline({ paused: true, defaults: { ease: ease() } });
      dayIntro(intro, 0.3);
      ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => intro.play(0) });

      /* the track, scrubbed by the pin */
      const tl = gsap.timeline({ paused: true, defaults: { ease: ease() } });
      tl.fromTo([p2, p3], { x: () => travel() }, { x: 0, duration: 0.62, ease: "none" }, 0);
      tl.fromTo(q("[data-seq='team-row']"), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.1, stagger: 0.02 }, 0.05);
      tl.fromTo(q("[data-seq='rock']"), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.1, stagger: 0.02 }, 0.38);
      tl.fromTo(s.bars, { width: 0 }, { width: (i: number) => s.targets[i], duration: 0.12, stagger: 0.02 }, 0.42);
      flip(tl, "mark-day", s.checks[0], s.lens[0], 0.44, 0.05);
      flip(tl, "mark-team", s.checks[1], s.lens[1], 0.52, 0.05);
      nudge(tl, s, 0.66, 0.08);
      tl.fromTo(q("[data-seq='chip']"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.08 }, 0.8);
      tl.to({}, { duration: 0.12 }, 0.88);

      const top = () => parseFloat(getComputedStyle(el).top) || 0;
      ScrollTrigger.create({
        trigger: pin,
        start: () => `top ${top()}px`,
        end: () => `bottom ${top() + el.offsetHeight}px`,
        scrub: 0.5,
        animation: tl,
        invalidateOnRefresh: true,
      });
      /* the frame's reveal translates the block by 22px until it lands;
         measure again once it has */
      const reveal = pin.parentElement;
      const onLand = () => ScrollTrigger.refresh();
      reveal?.addEventListener("transitionend", onLand, { once: true });
      return () => {
        reveal?.removeEventListener("transitionend", onLand);
        restore(s);
      };
    });

    mm.add(`(max-width: 767px) and ${MOTION}`, () => {
      const s = prime();
      const p2 = q<HTMLElement>("[data-panel='team']")[0];
      const p3 = q<HTMLElement>("[data-panel='rocks']")[0];
      const d = { ease: ease() };

      const day = gsap.timeline({ paused: true, defaults: d });
      dayIntro(day, 0.3);
      flip(day, "mark-day", s.checks[0], s.lens[0], 1.4, 0.45);
      day.fromTo(q("[data-seq='chip']"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7 }, 1.9);

      const team = gsap.timeline({ paused: true, defaults: d });
      team.fromTo(q("[data-seq='team-row']"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 0.3);
      flip(team, "mark-team", s.checks[1], s.lens[1], 1.2, 0.45);

      const rocks = gsap.timeline({ paused: true, defaults: d });
      rocks.fromTo(q("[data-seq='rock']"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 0.3);
      rocks.fromTo(s.bars, { width: 0 }, { width: (i: number) => s.targets[i], duration: 0.9, stagger: 0.08 }, 0.45);
      nudge(rocks, s, 1.9, 0.6);
      rocks.eventCallback("onComplete", () => readyReplay(replay.current));

      ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => day.play(0) });
      ScrollTrigger.create({ trigger: p2, start: "top 70%", once: true, onEnter: () => team.play(0) });
      ScrollTrigger.create({ trigger: p3, start: "top 70%", once: true, onEnter: () => rocks.play(0) });
      const onReplay = () => {
        s.num.textContent = String(s.was);
        day.restart();
        team.restart();
        rocks.restart();
      };
      const btn = replay.current;
      btn?.addEventListener("click", onReplay);
      return () => {
        btn?.removeEventListener("click", onReplay);
        restore(s);
      };
    });

    return () => mm.revert();
  }, [frame, replay]);
}

/**
 * Chapter 02. Three panels on one horizontal track: your day, the team's
 * week, the quarter's rocks. The lit element is the Draw 4 row. The frame
 * is 800 at lg like every frame, so the panels run on (tomorrow's agenda,
 * the unassigned items, last quarter's rocks) and are cut at the bottom;
 * they grow to fill the overflowing shell, so the rocks panel crosses the
 * frame's right edge and dissolves in the fade. A rock's percentage sits
 * under its title, at the panel's left, so every one reads before the fade
 * whatever the width. Below md the panels stack at the frame's width, so
 * nothing is cut at the right. The frame sits in a pin wrapper that, at md
 * and above under JS with motion, holds it for two viewport heights while
 * the scroll scrubs the track (see useAgendaMotion).
 */
export default function Agenda() {
  const frame = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  useAgendaMotion(frame, replay);

  return (
    <Chapter
      index="02"
      label="Agenda"
      claim="One list, and the whole team is on it."
      body="Your day, the team's week, and the quarter's rocks, kept in one place and synced with the task tool the team already uses. Finish something anywhere and it checks off everywhere."
      controls={
        <button ref={replay} type="button" className="product-replay product-replay-phone" tabIndex={-1}>
          Replay
        </button>
      }
    >
      <div className="product-pin">
        <Frame ref={frame} fade="corner" fitPhone height="h-auto lg:h-[800px]">
          <Rail active="list" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="product-track flex-1 p-6">
              <Panel title="Your day" titleSeq="day-title">
                <ul className="product-rule">
                  {agenda.yourDay.map((item) => {
                    const lit = item.ref === "draw-4";
                    return (
                      <li
                        key={item.time}
                        data-seq="day"
                        className={`flex items-center gap-3 py-3 ${lit ? "product-lit -mx-3 rounded-xl px-3" : ""}`}
                      >
                        <span className="product-t3 w-10 flex-none">{item.time}</span>
                        <span className={`flex-1 ${lit ? "product-strong" : item.done ? "product-t2" : ""}`}>
                          {item.title}
                        </span>
                        {lit ? <Mark seq="mark-day" /> : item.done ? <Check /> : <Dot tone="watch" />}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4" data-seq="chip">
                  <Chip accent>synced to {agenda.syncedTo}</Chip>
                </div>
                <div data-seq="tomorrow">
                  <p className="product-title mt-8">Tomorrow</p>
                  <ul className="product-rule mt-3">
                    {agenda.tomorrow.map((item) => (
                      <li key={item.time} className="flex items-center gap-3 py-3">
                        <span className="product-t3 w-10 flex-none">{item.time}</span>
                        <span className="flex-1">{item.title}</span>
                        <Dot tone="watch" />
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>

              <Panel title="The team this week" panel="team">
                <ul className="product-rule">
                  {agenda.team.map((row) => (
                    <li key={row.name} data-seq="team-row" className="flex gap-3 py-3">
                      <span className="product-avatar flex-none">{row.initials}</span>
                      <div className="min-w-0 flex-1">
                        <p className="product-strong">{row.name}</p>
                        <ul className="mt-1 space-y-1">
                          {row.items.map((it) => (
                            <li key={it.title} className="flex items-center gap-2">
                              {it.ref === "draw-4" ? <Mark seq="mark-team" /> : it.done ? <Check /> : <Dot tone="watch" />}
                              <span className="product-t2">{it.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
                <div data-seq="team-row">
                  <p className="product-title mt-8">Unassigned</p>
                  <ul className="product-rule mt-3">
                    {agenda.unassigned.map((it) => (
                      <li key={it.title} className="flex items-center gap-2 py-3">
                        <Dot tone="watch" />
                        <span className="product-t2">{it.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>

              <Panel title="Quarterly rocks" panel="rocks">
                <ul className="space-y-4">
                  {agenda.rocks.map((rock) => (
                    <li key={rock.title} data-seq="rock" data-rock={rock.ref} data-was={rock.was}>
                      <RockRow rock={rock} />
                    </li>
                  ))}
                </ul>
                <div data-seq="rock">
                  <p className="product-title mt-8">Last quarter</p>
                  <ul className="mt-4 space-y-4">
                    {agenda.lastQuarter.map((rock) => (
                      <li key={rock.title}>
                        <RockRow rock={rock} quiet />
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            </div>
          </div>
        </Frame>
      </div>
    </Chapter>
  );
}

function RockRow({ rock, quiet = false }: { rock: (typeof agenda.rocks)[number]; quiet?: boolean }) {
  return (
    <>
      <p className={quiet ? "product-t2" : ""}>{rock.title}</p>
      <p className="product-label mt-0.5">
        <span data-rock-num>{rock.pct}</span>%{rock.note ? `, ${rock.note}` : ""}
      </p>
      <div className="product-bar mt-2">
        <span data-rock-bar style={{ width: `${rock.pct}%` }} />
      </div>
    </>
  );
}

function Panel({
  title,
  panel,
  titleSeq,
  children,
}: {
  title: string;
  panel?: string;
  titleSeq?: string;
  children: ReactNode;
}) {
  return (
    <section className="w-full flex-1 md:w-auto md:min-w-[380px]" data-panel={panel}>
      <p className="product-title" data-seq={titleSeq}>
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}
