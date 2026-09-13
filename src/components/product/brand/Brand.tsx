"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import gsap from "gsap";
import { brand, today, type Swatch } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar, inert } from "../shared";
import { ease, onEnter, readyReplay } from "../shared/useSequence";

/** the swatch's four colors as the shell's scoped variables */
function varsOf(s: Swatch) {
  return {
    "--accent": s.accent,
    "--accent-deep": s.accentDeep,
    "--accent-soft": s.accentSoft,
    "--accent-wash": s.accentWash,
  };
}

/** a swatch cycles in about every 2.5s */
const STEP = 2.5;

/**
 * Chapter 06's sequence: from the frame reaching the unified depth the
 * swatches cycle once, 2.5s each (Bellwether at 2.5, Northline at 5.0,
 * Copperfield at 7.5), and stop back on Saguaro at 10.0. A swatch, clicked,
 * stops the cycle and retints: the four accent variables cross-fade over
 * 0.5s on the shell (the buttons, the sparkline, the receipts, the avatar,
 * the rail's current box all read them), the company name, the initials
 * and the greeting swap under a 0.3s fade, and the picker's pressed state
 * moves. The variables live on the shell's inline style and are tweened
 * there, so nothing outside the frame can read them. Replay cycles again.
 * Under reduced motion a click sets the swatch instantly; no-JS shows
 * Saguaro.
 */
function useBrandMotion(
  frame: RefObject<HTMLDivElement | null>,
  picker: RefObject<HTMLUListElement | null>,
  replay: RefObject<HTMLButtonElement | null>
) {
  useEffect(() => {
    const el = frame.current;
    const list = picker.current;
    if (!el || !list) return;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(el);
    const shell = el.firstElementChild as HTMLElement;
    const name = q<HTMLElement>(".product-topbar .product-strong")[0];
    const initials = q<HTMLElement>(".product-topbar .product-avatar")[0];
    const greeting = q<HTMLElement>(".product-greeting")[0];
    const swatches = Array.from(list.querySelectorAll<HTMLButtonElement>("button[data-swatch]"));
    const home = brand.swatches[0];
    let current = home;

    const press = (s: Swatch) => swatches.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.swatch === s.id)));
    const words = (s: Swatch) => {
      name.textContent = s.company;
      initials.textContent = s.user.initials;
      greeting.textContent = s.user.greeting;
    };

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let cycle: gsap.core.Timeline | null = null;
      let tint: gsap.core.Timeline | null = null;

      /* the retint: colors cross-fade 0.5s, the words swap under a 0.3s fade */
      const retint = (s: Swatch) => {
        if (s === current) return;
        current = s;
        press(s);
        tint?.kill();
        tint = gsap.timeline({ defaults: { ease: ease() } });
        tint.to(shell, { ...varsOf(s), duration: 0.5, onComplete: () => gsap.set(shell, varsOf(s)) }, 0);
        tint.to([name, initials, greeting], { opacity: 0, duration: 0.3 }, 0);
        tint.add(() => words(s), 0.3);
        tint.to([name, initials, greeting], { opacity: 1, duration: 0.3 }, 0.3);
      };
      const stop = () => {
        cycle?.kill();
        cycle = null;
      };
      const play = () => {
        stop();
        const order = [...brand.swatches.slice(1), home];
        cycle = gsap.timeline({ onComplete: () => readyReplay(replay.current) });
        order.forEach((s, i) => cycle!.add(() => retint(s), STEP * (i + 1)));
        cycle.to({}, { duration: 0.6 }, STEP * order.length);
      };

      const onSwatch = (ev: Event) => {
        const s = brand.swatches.find((x) => x.id === (ev.currentTarget as HTMLElement).dataset.swatch);
        if (!s) return;
        stop();
        retint(s);
        readyReplay(replay.current);
      };
      const onReplay = () => {
        tint?.kill();
        tint = null;
        if (current !== home) {
          current = home;
          press(home);
          words(home);
          gsap.set(shell, varsOf(home));
          gsap.set([name, initials, greeting], { opacity: 1 });
        }
        play();
      };
      swatches.forEach((b) => b.addEventListener("click", onSwatch));
      const btn = replay.current;
      btn?.addEventListener("click", onReplay);
      const off = onEnter(el, play);
      return () => {
        off();
        stop();
        tint?.kill();
        swatches.forEach((b) => b.removeEventListener("click", onSwatch));
        btn?.removeEventListener("click", onReplay);
        current = home;
        press(home);
        words(home);
        gsap.set(shell, varsOf(home));
        gsap.set([name, initials, greeting], { clearProps: "opacity" });
      };
    });

    /* under reduced motion a swatch still works, instantly */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const onSwatch = (ev: Event) => {
        const s = brand.swatches.find((x) => x.id === (ev.currentTarget as HTMLElement).dataset.swatch);
        if (!s) return;
        current = s;
        press(s);
        words(s);
        gsap.set(shell, varsOf(s));
      };
      swatches.forEach((b) => b.addEventListener("click", onSwatch));
      return () => {
        swatches.forEach((b) => b.removeEventListener("click", onSwatch));
        current = home;
        press(home);
        words(home);
        gsap.set(shell, varsOf(home));
      };
    });

    return () => mm.revert();
  }, [frame, picker, replay]);
}

/**
 * Chapter 06. Chapter 01's corner of the morning dashboard in the first
 * swatch's colors, cut at the right and the bottom like chapter 01, with
 * the swatch picker in the caption row under the frame as a site control.
 * This chapter's lit element is the whole mini dashboard (the run's one
 * carve-out, written into the design system beside the lit-element rule):
 * the shell's content is one lit region at full ink with the accent on its
 * buttons, sparkline, receipts, avatar and the rail's current box, the top
 * bar its one parchment surface, so a swatch retints all of it. The accent
 * variables are set inline on the shell and tweened there, so they can
 * never leak into the page.
 */
export default function Brand() {
  const frame = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLUListElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  useBrandMotion(frame, picker, replay);
  const active = brand.swatches[0];
  const vars = varsOf(active) as CSSProperties;

  return (
    <div data-chapter="06">
      <Chapter
        index="06"
        label="Your brand"
        claim="It looks like your company, not ours."
        body="Your name, your colors, every screen. The Core is set up to look like it was always yours, because to your team it was."
        controls={
          <>
            <ul ref={picker} className="flex flex-wrap gap-2">
              {brand.swatches.map((s) => (
                <li key={s.id}>
                  <button type="button" aria-pressed={s.id === active.id} data-swatch={s.id} className="product-swatch">
                    <span aria-hidden style={{ background: s.accent }} />
                    {s.company}
                  </button>
                </li>
              ))}
            </ul>
            <button ref={replay} type="button" className="product-replay" tabIndex={-1}>
              Replay
            </button>
          </>
        }
      >
        <Frame ref={frame} fade="corner" fitNarrow height="h-auto lg:h-[800px]" style={vars}>
          <div className="product-lit product-lit-region contents">
            <Rail active="home" />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar name={active.company} initials={active.user.initials} lit cut />
              <div className="grid flex-1 gap-8 p-5 pt-5 md:p-6 md:pt-5 min-[1360px]:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-w-0">
                  <p className="product-greeting">{active.user.greeting}</p>
                  <p className="product-t2 mt-0.5">{today.subline}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {today.tiles.map((tile) => (
                      <Tile key={tile.label} {...tile} />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <button type="button" {...inert} className="product-button">
                      New deal
                    </button>
                    <button type="button" {...inert} className="product-button product-button-quiet">
                      Ask the Core
                    </button>
                  </div>
                  <p className="product-title mt-5">Needs you today</p>
                  <ul className="product-rule mt-1.5">
                    {today.needsYou.map((item) => (
                      <li key={item.id} className="flex gap-4 py-2.5">
                        <Dot tone="ink" className="mt-2" />
                        <div className="min-w-0 flex-1">
                          <p className="product-strong">{item.title}</p>
                          <p className="product-t2 mt-0.5">{item.body}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {item.receipts.map((r) => (
                              <Receipt key={r}>{r}</Receipt>
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="product-label mt-2">{today.filedOvernight} filed overnight</p>
                  <ul className="product-rule mt-3">
                    {today.filed.map((f) => (
                      <li key={f.title} className="flex items-center justify-between gap-4 py-3">
                        <span>{f.title}</span>
                        <span className="product-t3 flex-none">{f.to}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <aside className="product-aside product-periphery hidden pl-6 min-[1360px]:block">
                  <p className="product-label">Today</p>
                  <ul className="mt-3 space-y-3">
                    {today.calendar.map((slot) => (
                      <li key={slot.time} className="flex gap-3">
                        <span className="product-t3 w-10 flex-none">{slot.time}</span>
                        <span className="min-w-0">{slot.title}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
