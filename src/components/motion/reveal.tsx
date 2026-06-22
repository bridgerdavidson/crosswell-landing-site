"use client";

import { motion, useReducedMotion } from "motion/react";
import { useReady } from "./use-ready";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DURATION = 0.4;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ready = useReady();
  const reduce = useReducedMotion();
  const animate = ready && !reduce;
  return (
    <motion.div
      // Remount when animation turns on. `animate` is false at mount (useReady flips
      // in a post-mount effect) and motion reads `initial` only at mount, so without a
      // fresh mount the hidden start state is never committed and the entrance animates
      // visible -> visible (nothing moves). The key forces that fresh mount.
      key={animate ? "motion" : "static"}
      className={className}
      initial={animate ? { opacity: 0, y } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ready = useReady();
  const reduce = useReducedMotion();
  const animate = ready && !reduce;
  return (
    <motion.div
      // See Reveal: remount on enable so the "hidden" initial is committed and the
      // staggered children actually reveal instead of mounting already-visible.
      key={animate ? "motion" : "static"}
      className={className}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "show" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}
