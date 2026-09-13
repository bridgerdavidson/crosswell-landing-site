"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/* The hero's page-load entrance ends with its buttons rising at 1.0s; a
   block already inside the viewport on arrival enters one site step (80ms)
   after them, so the first frame completes itself without a scroll. */
const ARRIVAL_MS = 1080;

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [arrivalDelay, setArrivalDelay] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // on arrival: anything whose top is already inside the viewport is part
    // of the first frame and enters with the page-load entrance, wherever the
    // unified depth falls on this viewport
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight && el.getBoundingClientRect().bottom > 0) {
      setArrivalDelay(Math.max(0, ARRIVAL_MS - performance.now()) + delay);
      setShown(true);
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

  const wait = arrivalDelay ?? delay;
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-shown" : ""} ${className}`}
      style={wait ? { transitionDelay: `${Math.round(wait)}ms` } : undefined}
    >
      {children}
    </div>
  );
}
