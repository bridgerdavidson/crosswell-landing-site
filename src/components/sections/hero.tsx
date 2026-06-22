"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Section, Container, Eyebrow, ButtonLink, Icon } from "@/components/ui";
import { AmbientBackground } from "./ambient-background";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function Hero() {
  const reduce = useReducedMotion();
  const animate = !reduce;
  return (
    <Section id="hero" className="relative overflow-hidden scroll-mt-24">
      <AmbientBackground />
      <Container className="relative">
        <motion.div
          className="max-w-[48rem]"
          variants={animate ? containerVariants : undefined}
          initial={animate ? "hidden" : false}
          animate={animate ? "show" : undefined}
        >
          <motion.div variants={animate ? itemVariants : undefined}>
            <Eyebrow>Custom AI for any business</Eyebrow>
          </motion.div>
          <motion.h1
            variants={animate ? itemVariants : undefined}
            className="mt-4 font-serif text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
          >
            We find what's holding your business back and build the AI that moves it forward.
          </motion.h1>
          <motion.p
            variants={animate ? itemVariants : undefined}
            className="mt-6 max-w-[40rem] text-[1.1875rem] leading-[1.55] text-muted"
          >
            Crosswell builds custom AI tools, software, and automations that take the manual work
            off your team, so their time and your money go toward results instead of busywork. The
            same approach works for any business that wants to run leaner.
          </motion.p>
          <motion.div
            variants={animate ? itemVariants : undefined}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>
            <ButtonLink variant="link" href="#what-we-do">
              See what we build
              <Icon icon={ArrowRight} size="sm" />
            </ButtonLink>
          </motion.div>
          <motion.p
            variants={animate ? itemVariants : undefined}
            className="mt-8 text-sm text-muted"
          >
            Our deepest proof is in investment funds, where we are building the full AI operating
            layer for a live private credit fund.
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  );
}
