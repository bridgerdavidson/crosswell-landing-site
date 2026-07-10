"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The secured-route diagram for the Security section.
 *
 * Sequence (plays once, when scrolled into view): source node -> one
 * continuous dashed stroke that forks at the junction -> endpoint nodes ->
 * shield draws over the junction -> lock clicks -> the dash gaps seal shut
 * and the route warms to fern -> endpoints confirm -> ambient relay pulse.
 *
 * The server-rendered markup shows the finished diagram, so the section
 * still reads without JS. With JS, the diagram is hidden ("armed") until
 * the IntersectionObserver fires, then the CSS animations run. Reduced
 * motion skips the animations entirely and fades the finished diagram in.
 */
export default function TrustDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "armed" | "play">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setState("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("play");
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shieldPath =
    "M0 -40 C12 -34 24 -31 36 -31 L36 -2 C36 20 21 36 0 46 C-21 36 -36 20 -36 -2 L-36 -31 C-24 -31 -12 -34 0 -40 Z";
  const shieldInnerPath =
    "M0 -34 C10 -29 20 -26.5 30 -26.5 L30 -2 C30 16 17.5 29.5 0 38.5 C-17.5 29.5 -30 16 -30 -2 L-30 -26.5 C-20 -26.5 -10 -29 0 -34 Z";

  return (
    <div ref={ref} data-state={state} className="trust-diagram" aria-hidden="true">
      <svg viewBox="0 0 300 300" className="h-auto w-full">
        <defs>
          <mask id="td-route-reveal">
            <line className="td-rev td-rev-trunk" x1="46" y1="150" x2="150" y2="150" pathLength="100" />
            <path className="td-rev td-rev-branch" d="M150 150 C210 150 220 102 254 102" pathLength="100" />
            <path className="td-rev td-rev-branch" d="M150 150 C210 150 220 198 254 198" pathLength="100" />
          </mask>
        </defs>

        <g mask="url(#td-route-reveal)">
          <line className="td-route" x1="46" y1="150" x2="150" y2="150" />
          <path className="td-route" d="M150 150 C210 150 220 102 254 102" />
          <path className="td-route" d="M150 150 C210 150 220 198 254 198" />
        </g>

        <circle className="td-pulse td-pulse-trunk" cx="0" cy="0" r="3" />
        <circle className="td-pulse td-pulse-b1" cx="0" cy="0" r="3" />
        <circle className="td-pulse td-pulse-b2" cx="0" cy="0" r="3" />

        <g className="td-node td-node-src">
          <circle cx="42" cy="150" r="7" fill="var(--color-charcoal-deep)" stroke="var(--color-fern-soft)" strokeWidth="1.5" />
          <circle cx="42" cy="150" r="2.5" fill="var(--color-fern-soft)" />
        </g>
        <g className="td-node td-node-ep">
          <circle cx="258" cy="100" r="7" fill="var(--color-charcoal-deep)" stroke="var(--color-fern-soft)" strokeWidth="1.5" />
          <circle cx="258" cy="100" r="2.5" fill="var(--color-fern-soft)" />
        </g>
        <g className="td-node td-node-ep">
          <circle cx="258" cy="200" r="7" fill="var(--color-charcoal-deep)" stroke="var(--color-fern-soft)" strokeWidth="1.5" />
          <circle cx="258" cy="200" r="2.5" fill="var(--color-fern-soft)" />
        </g>

        <circle className="td-halo" cx="258" cy="100" r="11" strokeWidth="1" />
        <circle className="td-halo" cx="258" cy="200" r="11" strokeWidth="1" />
        <circle className="td-confirm td-confirm-1" cx="258" cy="100" r="9" strokeWidth="1" />
        <circle className="td-confirm td-confirm-2" cx="258" cy="200" r="9" strokeWidth="1" />

        <g className="td-shield-pop">
          <path className="td-shield-face" d={shieldPath} transform="translate(150 148)" />
          <path className="td-shield-warmth" d={shieldPath} transform="translate(150 148)" />
          <path className="td-shield-outline" pathLength="1" d={shieldPath} transform="translate(150 148)" />
          <path className="td-shield-inner" pathLength="1" d={shieldInnerPath} transform="translate(150 148)" />
          <g transform="translate(150 146)">
            <path
              className="td-shackle"
              d="M-7 1.5v-4.5a7 7 0 0 1 14 0v4.5"
              fill="none"
              stroke="var(--color-fern-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <g className="td-lock-body">
              <rect x="-10" y="1" width="20" height="15" rx="3" fill="none" stroke="var(--color-fern-soft)" strokeWidth="1.6" />
              <circle cx="0" cy="8.5" r="2" fill="var(--color-fern-soft)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
