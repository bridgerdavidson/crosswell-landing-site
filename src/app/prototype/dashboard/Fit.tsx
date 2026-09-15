"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/* draws a 1440 by 900 window at full size when there is room, and scales it
   down to the column's width when there is not */
export default function Fit({ children, height = 900 }: { children: ReactNode; height?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current!;
    const measure = () => setScale(Math.min(1, el.clientWidth / 1440));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative w-full" style={{ height: height * scale }}>
      <div className="absolute top-0 left-0 w-[1440px] origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
