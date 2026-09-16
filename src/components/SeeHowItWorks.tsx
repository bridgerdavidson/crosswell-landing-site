"use client";

import type { MouseEvent } from "react";

/*
 * The hero's quiet second link, for the visitor who is not ready to ask
 * for a call: it goes down the page to the what-we-do statement. It scrolls
 * there itself, with the statement's label sitting just under the nav, and
 * writes no hash to the URL (Safari re-scrolls to a hash on every reload,
 * which is why the nav never wrote one either). Without JavaScript the
 * href does the same job.
 */
const NAV_H = 64;
const TOP_GAP = 20;

export default function SeeHowItWorks() {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById("what-we-do");
    if (!el) return;
    e.preventDefault();
    const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY + padTop - NAV_H - TOP_GAP;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };
  return (
    <a href="#what-we-do" onClick={go} className="type-text group font-medium text-ink/75 transition-colors hover:text-ink">
      See how it works{" "}
      <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">
        ↓
      </span>
    </a>
  );
}
