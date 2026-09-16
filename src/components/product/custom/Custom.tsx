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
 * inside it rebuilds itself, business by business: the colours tween, the
 * mark and the rail's pages change, and the body rearranges, every block
 * travelling from where it was in the last company's layout to where it
 * belongs in this one. What has no counterpart rises in behind it, which
 * is the part that reads as built for them. The lender's four numbers
 * stretch into the distributor's four trucks, then gather into the firm's
 * five days. Reduced motion holds the lender's page still.
 */

const HOLD = 3.8;
const MORPH = 0.85;

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

/** every named block in the body, placed against the page's own box so a
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

/** the outgoing page, left in place as a copy so it can fall away under the new one */
function ghostOf(page: HTMLElement, into: HTMLElement) {
  const copy = page.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  if (!copy) return null;
  copy.setAttribute("aria-hidden", "true");
  copy.style.position = "absolute";
  copy.style.inset = "0";
  copy.style.pointerEvents = "none";
  into.appendChild(copy);
  return copy;
}

export default function Custom() {
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const ghosts = useRef<HTMLDivElement>(null);
  const before = useRef<Rects>(new Map());
  const first = useRef(true);

  /* the run: one business at a time, and only while the chapter is on screen */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    let id: number | undefined;
    const tick = () => {
      before.current = measure(page.current, main.current);
      if (page.current && ghosts.current) ghostOf(page.current, ghosts.current);
      setStep((s) => (s + 1) % STEPS.length);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && id === undefined) id = window.setInterval(tick, (HOLD + MORPH) * 1000);
        else if (!e.isIntersecting && id !== undefined) {
          clearInterval(id);
          id = undefined;
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root.current!);
    return () => {
      io.disconnect();
      if (id !== undefined) clearInterval(id);
    };
  }, []);

  /* the morph, run against the page that just rendered */
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const now = measure(page.current, main.current);
    const was = before.current;
    const tweens: gsap.core.Tween[] = [];

    /* blocks arrive in the order they are read, so the page rebuilds down the
       screen rather than all at once */
    const order = [...now.entries()].sort((a, b) => a[1].top - b[1].top);
    order.forEach(([key, rect], i) => {
      const el = page.current!.querySelector<HTMLElement>(`[data-morph="${CSS.escape(key)}"]`);
      if (!el) return;
      const delay = Math.min(0.3, i * 0.022);
      const old = was.get(key);
      if (!old) {
        /* nothing to travel from: this block belongs to this business alone */
        tweens.push(gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: MORPH * 0.6, delay: delay + MORPH * 0.45, ease: "power2.out", clearProps: "transform,opacity" }));
        return;
      }
      /* a block that has a counterpart travels from where that one stood.
         It never scales: a list row stretched into a timeline bar would
         smear the text inside it, so the movement carries the change. It
         travels the whole way but only fades up in the back half, once the
         page it is replacing has cleared, so the two are never legible at
         once. */
      tweens.push(
        gsap.fromTo(el, { x: old.left - rect.left, y: old.top - rect.top }, { x: 0, y: 0, duration: MORPH, delay, ease: "power3.inOut", clearProps: "transform" })
      );
      tweens.push(
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: MORPH * 0.45, delay: delay + MORPH * 0.3, ease: "power2.out", clearProps: "opacity" })
      );
    });

    /* the page it was, fading out from where it stood */
    const leaving = ghosts.current?.children;
    if (leaving?.length)
      tweens.push(gsap.to(leaving, { opacity: 0, duration: MORPH * 0.35, ease: "power1.out", onComplete: () => ghosts.current?.replaceChildren() }));

    /* the colours, and the chrome that carries the business's own marks */
    tweens.push(gsap.to(win.current, { ...varsOf(STEPS[step].theme), duration: MORPH, ease: "power2.inOut" }));
    tweens.push(gsap.fromTo(win.current!.querySelectorAll("[data-chrome]"), { opacity: 0.15 }, { opacity: 1, duration: MORPH * 0.8, ease: "power2.out" }));

    /* kill, never revert: the colours a tween leaves behind are the state */
    return () => tweens.forEach((t) => t.kill());
  }, [step]);

  const active = STEPS[still ? 0 : step];

  return (
    <div ref={root} data-chapter="06">
      <Chapter
        claim="The same product, built around how your business works."
        body="One company’s morning is a list of what needs a yes, another’s is a board of trucks on the road, another’s is the week’s deadlines. Same Core underneath, same agents, same screen your team opens. What sits on it is built around your work, in your colours, under your name."
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
                  <div ref={ghosts} aria-hidden className="pointer-events-none absolute inset-0" />
                </div>
              }
            />
          </div>
        </WindowFrame>
      </Chapter>
    </div>
  );
}
