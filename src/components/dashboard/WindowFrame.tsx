"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** a rectangle of the window, in the window's own pixels (the window is 1280
 *  wide); the side where the window leaves the screen, which fades; and how
 *  long that fade is on the screen (96 unless the chapter says) */
export type Crop = { x: number; y: number; width: number; height: number; bleed?: "left" | "right"; fade?: number };

/*
 * The frame a chapter shows the dashboard in: the whole window (640 tall
 * by default, as tall as the page needs), so the rail, the top bar, and the
 * Core's column with its message box all read as an app. From 1376 of
 * viewport the window takes the frame's width, never more than 1440. On a
 * laptop between lg and there the column is narrower than the window, so
 * the whole window scales down as one to fit it (0.93 at 1280, 0.73 at
 * 1024): a laptop sees the whole dashboard a little smaller, never a
 * dashboard cut by the frame's edge. That is how Linear's product shots
 * behave at laptop widths, and what the Core's stage already did.
 *
 * Below lg the frame shows a crop of the same window, `phone`: the piece of
 * the product the chapter's claim is about, at 1:1 where the frame is wide
 * enough for it (a tablet) and scaled down as one where it is not (a phone),
 * never re-flowed. The window keeps its shape and its layout; the frame
 * moves over it like a camera. And the window is never cut by an edge of
 * its own: the crop starts at the window's top-left corner, so its own
 * corners show there; the crop holds the window's whole height, bottom
 * edge included; and the window runs off the right of the screen (the
 * frame starts 12 past the words and ends at the viewport's edge), fading
 * as it goes (`window-bleed-right`, globals.css; a crop that runs off the
 * left fades there instead). That is how Linear's phone product shots
 * hold their shape: the only edges a visitor sees are the screen's and
 * the window's. Without a crop the whole 1280-wide window scales to the
 * frame's width, the old fallback.
 *
 * What recedes is the chapter's to say, inside the window (globals.css,
 * "The dashboard's fade").
 */
export default function WindowFrame({ children, height = 640, phone }: { children: ReactNode; height?: number; phone?: Crop }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [wide, setWide] = useState(true);
  /* the width the frame must hold at 1:1 below lg: the crop's, or the whole window's */
  const fit = phone ? phone.width : 1280;

  useLayoutEffect(() => {
    const el = box.current!;
    const lg = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setWide(lg.matches);
      setScale(Math.min(1, el.clientWidth / (lg.matches ? 1280 : fit)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    lg.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      lg.removeEventListener("change", measure);
    };
  }, [fit]);

  /* a laptop column narrower than the window: the whole window, scaled to it */
  if (wide && scale < 1) {
    return (
      <div ref={box} data-window className="relative overflow-hidden" style={{ height: height * scale }}>
        <div className="absolute top-0 left-0 w-[1280px] origin-top-left" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    );
  }

  /* the crop's top-left corner lands on the frame's; from lg the classes
     drop the transform and the frame's height together */
  const move = phone ? `translate(${-phone.x * scale}px, ${-phone.y * scale}px) scale(${scale})` : `scale(${scale})`;

  return (
    <div
      ref={box}
      data-window
      className={`relative overflow-hidden lg:mx-0 lg:aspect-auto lg:h-(--window-h) ${
        phone ? `window-bleed-${phone.bleed ?? "right"} -mr-(--page-gutter) -ml-3 h-(--crop-h)` : "-mx-3 aspect-(--window-ratio)"
      }`}
      style={
        {
          "--window-h": `${height}px`,
          "--window-ratio": `1280 / ${height}`,
          "--crop-h": phone ? `${phone.height * scale}px` : undefined,
          "--bleed-fade": phone?.fade ? `${phone.fade}px` : undefined,
        } as CSSProperties
      }
    >
      <div
        className="absolute top-0 left-0 w-[1280px] origin-top-left transform-(--crop-t) lg:static lg:w-full lg:min-w-[1280px] lg:max-w-[1440px] lg:transform-none"
        style={{ "--crop-t": move } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
