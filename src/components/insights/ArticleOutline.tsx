"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { OutlineItem } from "@/lib/insights/types";

/* a heading counts as the one being read once its top is this close to the
   viewport's: the scrolled nav's 64 and a little air */
const LINE = 120;
/* where a clicked heading lands: under the scrolled nav, with 24 to spare */
const LAND = 88;

/**
 * The rail's "On this page": the post's ## sections, the one being read
 * marked with a fern bar. Its links scroll the way the nav does, pinning the
 * heading under the nav and writing no hash to the URL (Safari jumps back to
 * a persistent hash on every reload); the headings keep their ids, so a
 * pasted #anchor still works.
 */
export default function ArticleOutline({ items }: { items: OutlineItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= LINE) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - LAND, behavior: "smooth" });
  };

  return (
    <nav aria-label="On this page" className="mt-9">
      <p className="type-label text-ink/60">On this page</p>
      <ul className="mt-2.5 max-w-xs">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className="type-caption block border-l-2 border-ink/10 py-1.5 pl-3.5 text-ink/60 transition-colors hover:text-ink aria-[current=location]:border-fern aria-[current=location]:text-ink"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
