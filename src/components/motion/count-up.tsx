"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CountUp({
  to,
  from = 0,
  duration = 1.2,
  format,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  format?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const renderValue = (v: number) => (format ? format(v) : String(Math.round(v)));
  // Initialize to the FINAL value so server-rendered / no-JS output shows the real
  // number (not 0), and hydration matches. With JS the effect arms the start value
  // while the element is out of view, then animates up when it scrolls into view.
  const [text, setText] = useState(() => renderValue(to));

  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sync of animation display state to reduced-motion / in-view; single non-cascading update
      setText(renderValue(to));
      return;
    }
    if (!inView) {
      setText(renderValue(from));
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setText(renderValue(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${text}${suffix}`}
    </span>
  );
}
