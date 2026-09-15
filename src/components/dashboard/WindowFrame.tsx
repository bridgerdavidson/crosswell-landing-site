"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * The frame a chapter shows the dashboard in. From lg the window is drawn
 * at its real size: it takes the frame's width up to 1440 and never less
 * than 1280, and the frame is 800 tall, so from 1440 up the whole window
 * shows and below that the frame crops its right side. Below lg the
 * 1280 by 800 window scales down to the frame's width whole. No masks and
 * no fades: what lights and what recedes is the chapter's to decide.
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
    <div ref={box} data-window className="relative aspect-[8/5] w-full overflow-hidden lg:aspect-auto lg:h-[800px]">
      <div
        className="absolute top-0 left-0 w-[1280px] origin-top-left lg:static lg:w-full lg:min-w-[1280px] lg:max-w-[1440px]"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
