"use client";

import { motion, useReducedMotion } from "motion/react";

// A single, barely-perceptible fern blob that drifts slowly behind the hero.
// Atmosphere, not decoration. Frozen under reduced motion.
export function AmbientBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-1/3 left-1/4 h-[40rem] w-[40rem] rounded-full bg-primary/[0.06] blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={
          reduce ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }
        }
      />
    </div>
  );
}
