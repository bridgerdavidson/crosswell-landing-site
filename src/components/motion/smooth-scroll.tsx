"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        // Anchors smooth-scroll to in-page ids; sections carry scroll-mt-24 for the
        // nav offset. If the sticky nav still overlaps a target after install, switch
        // to anchors: { offset: -88 } (the installed lenis supports the object form).
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
