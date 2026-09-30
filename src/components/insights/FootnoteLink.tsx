"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { landOn } from "./land";

/**
 * A footnote's reference in the text, or the return arrow under the note:
 * remark-gfm's own link, with its href kept so it works without JavaScript,
 * that under JavaScript lands its target under the nav without writing a
 * hash and moves focus there, like the outline's links.
 */
export default function FootnoteLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    const id = decodeURIComponent((props.href ?? "").replace(/^#/, ""));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    landOn(el);
  };
  return <a {...props} onClick={go} />;
}
