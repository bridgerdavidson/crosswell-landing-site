"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * The frame a chapter shows the dashboard in. The window keeps its real
 * size and the frame crops it: from lg the window takes the frame's width,
 * never less than 1280 or more than 1440, and the frame shows its top 600,
 * so the page runs on past the cut; below lg the same 1280 by 600 crop
 * scales down to the frame's width. `light` names how the crop recedes into
 * the page (globals.css, "The dashboard window's light").
 */
export default function WindowFrame({ children, light = "" }: { children: ReactNode; light?: string }) {
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
    <div ref={box} data-window className={`relative aspect-[32/15] w-full overflow-hidden lg:aspect-auto lg:h-[600px] ${light}`}>
      <div
        className="absolute top-0 left-0 w-[1280px] origin-top-left lg:static lg:w-full lg:min-w-[1280px] lg:max-w-[1440px]"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
