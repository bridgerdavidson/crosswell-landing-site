"use client";

import {
  Inbox,
  Filter,
  FileSearch,
  FilePen,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui";

type Step = { label: string; title: string; detail: string; icon: LucideIcon };

const STEPS: Step[] = [
  {
    label: "Inbound",
    title: "A deal lands",
    detail: "A new opportunity arrives by email or CRM and enters the system automatically.",
    icon: Inbox,
  },
  {
    label: "Screening agent",
    title: "It gets scored",
    detail:
      "The screening agent scores the deal against the fund's criteria and surfaces whether it is worth a partner's time.",
    icon: Filter,
  },
  {
    label: "Diligence agent",
    title: "Risks get flagged",
    detail:
      "The diligence agent reads the data room, extracts key terms and covenants, and flags the risks that matter.",
    icon: FileSearch,
  },
  {
    label: "Memo agent",
    title: "The memo gets drafted",
    detail: "The memo agent drafts the first-pass write-up from the fund's own data and template.",
    icon: FilePen,
  },
  {
    label: "Decision-ready",
    title: "The team decides",
    detail:
      "A decision-ready package lands in front of the team. They do the one thing only people can do: decide.",
    icon: CheckCircle2,
  },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.18 } } };
const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};
// The final step lands with a subtle one-time pulse as the payoff.
const lastStepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, scale: [1, 1.04, 1], transition: { duration: 0.6, ease: EASE_OUT } },
};
// Connectors draw left to right in sequence with the stagger.
const connectorVariants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

export function AgentFlow() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  return (
    <motion.ol
      className="mt-12 grid gap-4 md:grid-cols-5"
      variants={animate ? listVariants : undefined}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "show" : undefined}
      viewport={{ once: true, amount: 0.4 }}
    >
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        return (
          <motion.li
            key={step.title}
            variants={animate ? (isLast ? lastStepVariants : stepVariants) : undefined}
            className="relative"
          >
            <div
              className={`flex h-full flex-col rounded-md border p-5 ${
                isLast ? "border-accent-text bg-primary/10" : "border-border bg-surface"
              }`}
            >
              <Icon icon={step.icon} className="text-accent-text" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
                {step.label}
              </p>
              <p className="mt-1 font-sans text-base font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.detail}</p>
            </div>
            {!isLast && (
              <motion.span
                aria-hidden
                variants={animate ? connectorVariants : undefined}
                style={{ transformOrigin: "left" }}
                className="pointer-events-none absolute right-[-0.5rem] top-1/2 hidden h-px w-4 bg-border-strong md:block"
              />
            )}
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
