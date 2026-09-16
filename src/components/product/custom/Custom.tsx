"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { HomeBody } from "@/components/dashboard/Home";
import { JuniperBody, KestrelBody } from "@/components/dashboard/CustomHomes";
import { AppWindow, Button, LENDER_PAGES, type Page, type Theme } from "@/components/dashboard/ui";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { saguaroHome, themeOf } from "@/components/dashboard/worlds";
import { juniper, kestrel } from "@/lib/companies";
import { Chapter } from "../shared";

/**
 * Chapter 06: the same product, built three ways. The window never swaps
 * and there is nothing to click. While the chapter is on screen the page
 * inside it rebuilds itself, business by business, in three beats: the
 * page empties out, leaving its sections as bare blocks; those blocks
 * travel and resize into the next business's layout, carrying the colours
 * and the mark with them; then the new page fills them in. The lender's
 * four numbers become the distributor's four trucks, then gather into the
 * firm's five days. Reduced motion holds the lender's page still.
 */

const HOLD = 3.8;
/* the three beats: empty, rearrange, fill */
const CLEAR = 0.22;
const MOVE = 0.58;
const FILL = 0.34;
const MORPH = CLEAR + MOVE + FILL;

type Step = { id: string; theme: Theme; pages: Page[]; action: string; body: ReactNode };

const lender = saguaroHome();
const STEPS: Step[] = [
  { id: "saguaro", theme: themeOf("saguaro"), pages: LENDER_PAGES, action: lender.action, body: <HomeBody home={lender} /> },
  { id: "juniper", theme: juniper.theme, pages: juniper.pages as Page[], action: juniper.action, body: <JuniperBody /> },
  { id: "kestrel", theme: kestrel.theme, pages: kestrel.pages as Page[], action: kestrel.action, body: <KestrelBody /> },
];

const varsOf = (t: Theme) =>
  ({ "--accent": t.accent, "--accent-deep": t.accentDeep, "--accent-soft": t.accentSoft, "--accent-wash": t.accentWash }) as CSSProperties;

type Box = { left: number; top: number; width: number; height: number };
type Rects = Map<string, Box>;

/** every named block in the page, placed against the window's own box so a
    scroll between one business and the next cannot skew the travel */
function measure(page: HTMLElement | null, base: HTMLElement | null): Rects {
  const rects: Rects = new Map();
  if (!page || !base) return rects;
  const box = base.getBoundingClientRect();
  page.querySelectorAll<HTMLElement>("[data-morph]").forEach((el) => {
    const r = el.getBoundingClientRect();
    rects.set(el.dataset.morph!, { left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height });
  });
  return rects;
}

/** one bare section: the outline a block leaves behind when its content
    goes, drawn in the dashboard's own hairline rather than as a grey fill,
    which read as a page still loading */
function shellAt(box: Box, into: HTMLElement) {
  const el = document.createElement("div");
  el.style.cssText = [
    "position:absolute",
    "border-radius:10px",
    "border:1px solid color-mix(in oklab, var(--color-ink) 13%, transparent)",
    "background:color-mix(in oklab, var(--color-ink) 2%, transparent)",
    `left:${box.left}px`,
    `top:${box.top}px`,
    `width:${box.width}px`,
    `height:${box.height}px`,
    "opacity:0",
  ].join(";");
  into.appendChild(el);
  return el;
}

export default function Custom() {
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const shells = useRef<Map<string, HTMLElement>>(new Map());
  const before = useRef<Rects>(new Map());
  const first = useRef(true);

  /* the run: one business at a time, and only while the chapter is on screen */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    let loop: number | undefined;
    let swap: number | undefined;

    /* beat one: the page empties out and its sections are left standing */
    const tick = () => {
      const from = measure(page.current, main.current);
      before.current = from;
      shells.current.clear();
      layer.current!.replaceChildren();
      from.forEach((box, key) => shells.current.set(key, shellAt(box, layer.current!)));
      gsap.to(page.current, { opacity: 0, duration: CLEAR, ease: "power2.in" });
      gsap.to([...shells.current.values()], { opacity: 1, duration: CLEAR * 0.8, ease: "power2.out" });
      swap = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), CLEAR * 1000);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && loop === undefined) loop = window.setInterval(tick, (HOLD + MORPH) * 1000);
        else if (!e.isIntersecting && loop !== undefined) {
          clearInterval(loop);
          loop = undefined;
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root.current!);
    return () => {
      io.disconnect();
      if (loop !== undefined) clearInterval(loop);
      if (swap !== undefined) clearTimeout(swap);
    };
  }, []);

  /* beats two and three, against the page that just rendered: the bare
     sections rearrange into this business's layout, then it fills them */
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const to = measure(page.current, main.current);
    const from = before.current;
    const tweens: gsap.core.Tween[] = [];
    const blocks = page.current!.querySelectorAll<HTMLElement>("[data-morph]");

    /* the new page waits, invisible, until its sections are in place */
    gsap.set(page.current, { opacity: 0 });
    gsap.set(blocks, { opacity: 0 });

    /* every section travels on one clock, with no stagger between them.
       Two sections that are clear of each other in both layouts stay clear
       the whole way only if they move at the same rate: give one a head
       start and the one below it is still where the one above is going. */
    const order = [...to.entries()].sort((a, b) => a[1].top - b[1].top);
    order.forEach(([key, box], i) => {
      const shell = shells.current.get(key);
      if (shell) {
        tweens.push(gsap.to(shell, { left: box.left, top: box.top, width: box.width, height: box.height, duration: MOVE, ease: "power2.inOut" }));
        return;
      }
      /* a section this business has and the last one did not: it arrives as
         the others are still moving, so the new shape is whole before it fills */
      const made = shellAt(box, layer.current!);
      shells.current.set(key, made);
      tweens.push(gsap.fromTo(made, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: MOVE * 0.6, delay: MOVE * 0.3 + i * 0.02, ease: "power2.out" }));
    });

    /* a section the last business had and this one does not simply goes */
    from.forEach((_, key) => {
      if (to.has(key)) return;
      const shell = shells.current.get(key);
      if (shell) tweens.push(gsap.to(shell, { opacity: 0, scale: 0.96, duration: MOVE * 0.5, ease: "power2.in" }));
    });

    /* the colours and the chrome move with the sections */
    tweens.push(gsap.to(win.current, { ...varsOf(STEPS[step].theme), duration: MOVE, ease: "power2.inOut" }));
    tweens.push(gsap.fromTo(win.current!.querySelectorAll("[data-chrome]"), { opacity: 0.15 }, { opacity: 1, duration: MOVE * 0.8, ease: "power2.out" }));

    /* beat three: the sections hand over to the page that fills them */
    tweens.push(gsap.set(page.current, { opacity: 1, delay: MOVE }) as unknown as gsap.core.Tween);
    tweens.push(gsap.to([...shells.current.values()], { opacity: 0, duration: FILL * 0.6, delay: MOVE + 0.06, ease: "power2.in", onComplete: () => layer.current?.replaceChildren() }));
    tweens.push(gsap.to(blocks, { opacity: 1, duration: FILL * 0.9, delay: MOVE, stagger: 0.06, ease: "power2.out", clearProps: "opacity" }));

    /* kill, never revert: what a tween leaves behind is the state */
    return () => tweens.forEach((t) => t.kill());
  }, [step]);

  const active = STEPS[still ? 0 : step];

  return (
    <div ref={root} data-chapter="06">
      <Chapter
        claim="The same product, built around how your business works."
        body="One company’s morning is a list of what needs a yes, another’s is a board of trucks on the road, another’s is the week’s deadlines. Same Core underneath, same agents, same screen your team opens. What sits on it is built around your work, in your colors, under your name."
      >
        <WindowFrame height={800}>
          {/* the accent variables start on the first business and are the morph's
              to move from there, so they are set once and never re-rendered */}
          <div ref={win} style={varsOf(STEPS[0].theme)}>
            <AppWindow
              tint={false}
              theme={active.theme}
              pages={active.pages}
              active="home"
              size="h-[800px] w-full"
              /* the firm's week runs past 800, so every page ends in the
                 window's own fade rather than on a half-cut row */
              mainClassName="dashboard-fade"
              actions={<Button icon="plus">{active.action}</Button>}
              main={
                <div ref={main} className="relative h-full">
                  <div ref={page}>{active.body}</div>
                  <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0" />
                </div>
              }
            />
          </div>
        </WindowFrame>
      </Chapter>
    </div>
  );
}
