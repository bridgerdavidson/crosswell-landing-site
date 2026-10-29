"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BEAT } from "./enter";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/* A block already inside the viewport on arrival is part of the page's
   entrance (enter.ts), not a scroll reveal: it rises one beat after the
   last part of the opening in view began (the landing page's buttons, a
   page's lede), plus its own delay. Timed from the opening's own
   animations rather than from navigation start, so the order holds on a
   fresh load, wherever hydration lands, and after a tab click, when the
   new page's opening has only just begun. */
function arrivalWait(delay: number) {
  const now = performance.now();
  let last = -Infinity;
  for (const el of document.querySelectorAll("main .page-enter")) {
    const box = el.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) continue;
    for (const a of el.getAnimations()) {
      // a pending animation (the page has just been inserted) starts now
      last = Math.max(last, Number(a.startTime ?? now) + Number(a.effect?.getTiming().delay ?? 0));
    }
  }
  return Math.max(0, (last === -Infinity ? now : last) + BEAT + delay - now);
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [arrival, setArrival] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // on arrival: anything whose top is already inside the viewport is part
    // of the first frame and enters with the page's entrance, wherever the
    // unified depth falls on this viewport
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      setArrival(arrivalWait(delay));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      // fire when the block's top has risen to ~70% of the viewport, so nothing
      // reveals while still half-off-screen (unified with the other triggers)
      { threshold: 0, rootMargin: "0px 0px -30% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  if (arrival !== null) {
    return (
      <div ref={ref} className={`reveal-enter ${className}`} style={{ animationDelay: `${Math.round(arrival)}ms` }}>
        {children}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-shown" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
