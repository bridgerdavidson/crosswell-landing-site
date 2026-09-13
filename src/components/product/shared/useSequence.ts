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
      tl.eventCallback("onComplete", () => {
        if (!replay) return;
        replay.classList.add("is-ready");
        replay.tabIndex = 0;
      });
    }, el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl?.play(0);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -30% 0px" }
    );
    io.observe(el);
    const onReplay = () => tl?.restart();
    replay?.addEventListener("click", onReplay);
    return () => {
      io.disconnect();
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
