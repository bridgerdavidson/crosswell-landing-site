"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * The frame a chapter shows the dashboard in: the whole window, 640 tall,
 * so the rail, the top bar, and the Core's column with its message box all
 * read as an app. From lg the window takes the frame's width, never less
 * than 1280 or more than 1440 (below 1440 its right side crops); below lg
 * the 1280 by 640 window scales down to the frame's width. What recedes is
 * the chapter's to say, inside the window (globals.css, "The dashboard's
 * fade").
 */
export default function WindowFrame({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current!;
    const wide = window.matchMedia("(min-width: 1024px)");
    const measure = () => setScale(wide.matches ? 1 : Math.min(1, el.clientWidth / 1280));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    wide.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={box} data-window className="relative aspect-[2/1] w-full overflow-hidden lg:aspect-auto lg:h-[640px]">
      <div
        className="absolute top-0 left-0 w-[1280px] origin-top-left lg:static lg:w-full lg:min-w-[1280px] lg:max-w-[1440px]"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
