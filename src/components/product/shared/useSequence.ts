"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

let siteEase: gsap.EaseFunction | undefined;

/** the site's one curve, cubic-bezier(0.22, 1, 0.36, 1), as a GSAP ease */
export function ease() {
  siteEase ??= CustomEase.create("site", "M0,0 C0.22,1 0.36,1 1,1");
  return siteEase;
}

/** the site's unified reveal depth: the block's top at about 70% of the viewport, once */
export function onEnter(el: Element, cb: () => void) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        cb();
        io.disconnect();
      }
    },
    { threshold: 0, rootMargin: "0px 0px -30% 0px" }
  );
  io.observe(el);
  return () => io.disconnect();
}

/** reveals a Replay control once its sequence has finished, and lets it take focus */
export function readyReplay(btn: HTMLButtonElement | null) {
  if (!btn) return;
  btn.classList.add("is-ready");
  btn.tabIndex = 0;
}

/**
 * A chapter's scroll-in sequence, the pattern every chapter follows. Builds
 * a paused GSAP timeline over the frame, plays it once when the frame's top
 * reaches about 70 percent of the viewport (the site's unified reveal
 * depth), then holds still; the returned ref goes on a Replay control that
 * restarts it and is revealed once the sequence has finished. Under reduced
 * motion nothing runs and the server-rendered finished state stands; the
 * [data-seq] pre-hide in globals.css is lifted by the same media query.
 */
export function useSequence(
  frame: RefObject<HTMLDivElement | null>,
  build: (frame: HTMLDivElement) => gsap.core.Timeline
) {
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const replay = replayRef.current;
    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = build(el);
      tl.pause(0);
      tl.eventCallback("onComplete", () => readyReplay(replay));
    }, el);
    const off = onEnter(el, () => tl?.play(0));
    const onReplay = () => tl?.restart();
    replay?.addEventListener("click", onReplay);
    return () => {
      off();
      replay?.removeEventListener("click", onReplay);
      ctx.revert();
    };
  }, [frame, build]);

  return replayRef;
}

/** counts a number's text up from zero, keeping any prefix and suffix ("$4M", "14") */
export function countUp(el: HTMLElement, duration: number) {
  const text = el.textContent ?? "";
  const m = /^([^\d]*)(\d+)(.*)$/.exec(text);
  if (!m) return gsap.to({}, { duration: 0 });
  const [, prefix, digits, suffix] = m;
  const target = Number(digits);
  const n = { v: 0 };
  return gsap.to(n, {
    v: target,
    duration,
    ease: ease(),
    onUpdate() {
      el.textContent = `${prefix}${Math.round(n.v)}${suffix}`;
    },
  });
}

/** primes a check's path so a sequence can draw it; returns its length */
export function primeDraw(path: SVGPathElement) {
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  return len;
}

/* ---------- the chat mechanic's pieces, shared by chapters 03 and 04 ---------- */

/** the answer arrives in chunks of two to four words, one every 300ms */
export const CHUNK_EVERY = 0.3;

/** splits an answer into word chunks, breaking after punctuation when it can */
export function chunk(text: string) {
  const words = text.split(" ");
  const out: string[] = [];
  let cur: string[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const last = i === words.length - 1;
    const stop = /[.,;:]$/.test(w);
    if (last || cur.length >= 4 || (stop && cur.length >= 2)) {
      out.push(cur.join(" ") + (last ? "" : " "));
      cur = [];
    }
  });
  return out;
}

/** a row opens from 0 to its height over 0.6s; the wrapper's height is cleared once it lands */
export function grow(tl: gsap.core.Timeline, wrap: HTMLElement, at: number) {
  return tl.to(wrap, { height: "auto", duration: 0.6, onComplete: () => gsap.set(wrap, { clearProps: "height" }) }, at);
}

/** a piece rises into place from y below, opacity 0 to 1, 0.7s, with an optional stagger */
export function rise(tl: gsap.core.Timeline, els: HTMLElement | HTMLElement[], at: number, y: number, stagger = 0) {
  return tl.fromTo(els, { opacity: 0, y }, { opacity: 1, y: 0, duration: 0.7, stagger }, at);
}

/** a mark turns: its watch dot goes (0.3s) and its check draws (0.45s) */
export function tick(tl: gsap.core.Timeline, mark: HTMLElement, path: SVGPathElement, len: number, at: number) {
  const pre = mark.parentElement!.querySelector(".product-mark-pre");
  tl.to(pre, { opacity: 0, scale: 0.6, duration: 0.3 }, at);
  tl.set(mark, { opacity: 1 }, at + 0.1);
  tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.45 }, at + 0.1);
}

/** a text swaps under a fade: out over 0.3s, the new text, in over 0.3s */
export function swapText(tl: gsap.core.Timeline, el: HTMLElement, text: string, at: number) {
  tl.to(el, { opacity: 0, duration: 0.3 }, at);
  tl.add(() => {
    el.textContent = text;
  }, at + 0.3);
  tl.to(el, { opacity: 1, duration: 0.3 }, at + 0.3);
}

/**
 * an answer streams in: the element's text is split into word chunks that
 * land one every 300ms from `at`; returns the time the last chunk lands
 */
export function stream(tl: gsap.core.Timeline, el: HTMLElement, at: number) {
  const text = el.textContent ?? "";
  el.textContent = "";
  const spans = chunk(text).map((c) => {
    const s = document.createElement("span");
    s.textContent = c;
    s.style.opacity = "0";
    el.appendChild(s);
    return s;
  });
  spans.forEach((s, i) => tl.set(s, { opacity: 1 }, at + i * CHUNK_EVERY));
  return at + spans.length * CHUNK_EVERY;
}

/** a demo control goes live (in the tab order and the tree) or back to presentation only */
export function setLive(el: HTMLElement, on: boolean) {
  el.tabIndex = on ? 0 : -1;
  if (on) el.removeAttribute("aria-hidden");
  else el.setAttribute("aria-hidden", "true");
}
