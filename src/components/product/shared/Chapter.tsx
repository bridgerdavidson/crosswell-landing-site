import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type ChapterProps = {
  index: string;
  label: string;
  claim: ReactNode;
  body: string;
  layout?: "wide" | "split";
  dark?: boolean;
  children: ReactNode;
};

/**
 * One chapter of the product run: the label, the claim, one or two
 * sentences, then the frame. Everything that describes the product lives
 * here, outside the frame; the frame only ever shows the product. The demo
 * caption sits under the frame, outside it, per the demo rules.
 */
export function Chapter({
  index,
  label,
  claim,
  body,
  layout = "wide",
  dark = false,
  children,
}: ChapterProps) {
  const ink = dark ? "text-ivory" : "text-ink";
  const muted = dark ? "text-ivory/70" : "text-ink/70";
  const text = (
    <Reveal>
      <p className={`type-label ${dark ? "text-fern-soft" : "text-fern-deep"}`}>
        <span className="type-label-index">{index}</span>
        {label}
      </p>
      <h3 className={`type-h2 mt-3 max-w-2xl ${ink}`}>{claim}</h3>
      <p className={`type-body mt-4 max-w-xl ${muted}`}>{body}</p>
    </Reveal>
  );
  const frame = (
    <Reveal delay={120}>
      {children}
      <p className={`mt-3 text-xs ${dark ? "text-ivory/50" : "text-ink/50"}`}>
        Interactive demo · Sample data
      </p>
    </Reveal>
  );
  if (layout === "split") {
    return (
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        {text}
        {frame}
      </div>
    );
  }
  return (
    <div>
      {text}
      <div className="mt-10">{frame}</div>
    </div>
  );
}
