"use client";

import { useRef } from "react";
import gsap from "gsap";
import { today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar, inert } from "../shared";
import { countUp, ease, useSequence } from "../shared/useSequence";

/**
 * Chapter 01's sequence, once, on scroll-in. The frame's shell (rail, top
 * bar, calendar) arrives with the block's reveal; the payload plays in on
 * top of it: the greeting rises, the subline follows, the four tiles rise
 * with a stagger while their numbers count up over 900ms and the sparkline
 * draws left to right, the list title rises, the three items slide in 80ms
 * apart, and the status line settles as its count lands on 14. About 2.6s
 * end to end, every entrance 0.6 to 0.9s on the site's curve; after that the
 * frame is still.
 */
function build(frame: HTMLDivElement) {
  const q = gsap.utils.selector(frame);
  const greeting = q("[data-seq='greeting']");
  const subline = q("[data-seq='subline']");
  const tiles = q("[data-seq='tile']");
  const title = q("[data-seq='title']");
  const items = q("[data-seq='item']");
  const status = q<HTMLElement>("[data-seq='status']");
  const nums = q<HTMLElement>("[data-seq='tile'] [data-count]");
  const spark = q<SVGPolylineElement>("[data-spark]")[0];
  const len = spark ? spark.getTotalLength() : 0;

  const tl = gsap.timeline({ paused: true, defaults: { ease: ease() } });
  tl.set([greeting, subline, tiles, title, status], { opacity: 0, y: 14 });
  tl.set(items, { opacity: 0, x: -14 });
  if (spark) tl.set(spark, { strokeDasharray: len, strokeDashoffset: len });
  tl.to(greeting, { opacity: 1, y: 0, duration: 0.8 }, 0.45);
  tl.to(subline, { opacity: 1, y: 0, duration: 0.7 }, 0.6);
  tl.to(tiles, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.7);
  nums.forEach((el) => tl.add(countUp(el, 0.9), 0.75));
  if (spark) tl.to(spark, { strokeDashoffset: 0, duration: 0.9 }, 0.85);
  tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 1.2);
  tl.to(items, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 1.35);
  tl.to(status, { opacity: 1, y: 0, duration: 0.6 }, 1.95);
  status.forEach((el) => tl.add(countUp(el, 0.6), 1.95));
  return tl;
}

/**
 * Chapter 01. The top-left of the dashboard: the greeting, the numbers, the
 * three things that need a person with the draw approval lit, the status
 * line, and the calendar column fading at the right edge. The whole payload
 * clears the frame's bottom fade at 800 (the list is set tighter than the
 * other chapters' rows for it), so the only content cut is the calendar
 * column dissolving at the right; below lg the product is one column that
 * fits the frame at its own height, with the tiles two-up; the calendar
 * column shows from 1360 up, where the main column has the room for the
 * list to stay above the fade beside it.
 */
export default function Today() {
  const frame = useRef<HTMLDivElement>(null);
  const replay = useSequence(frame, build);

  return (
    <Chapter
      index="01"
      label="Today"
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
      controls={
        <button ref={replay} type="button" className="product-replay" tabIndex={-1}>
          Replay
        </button>
      }
    >
      <Frame ref={frame} fade="corner" fitNarrow height="h-auto lg:h-[800px]">
        <Rail active="home" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="grid flex-1 gap-8 p-5 pt-5 md:p-6 md:pt-5 min-[1360px]:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <p className="product-greeting" data-seq="greeting">
                {today.greeting}
              </p>
              <p className="product-t2 mt-0.5" data-seq="subline">
                {today.subline}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {today.tiles.map((tile) => (
                  <Tile key={tile.label} data-seq="tile" {...tile} />
                ))}
              </div>
              <p className="product-title mt-5" data-seq="title">
                Needs you today
              </p>
              <ul className="product-rule mt-1.5">
                {today.needsYou.map((item, i) => (
                  <li
                    key={item.id}
                    data-seq="item"
                    className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 py-2.5 md:grid-cols-[auto_minmax(0,1fr)_auto] ${
                      i === 0 ? "product-lit -mx-3 rounded-xl px-3" : ""
                    }`}
                  >
                    <Dot tone="ink" className="mt-2" />
                    <div className="min-w-0">
                      <p className="product-strong">{item.title}</p>
                      <p className="product-t2 mt-0.5">{item.body}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.receipts.map((r) => (
                          <Receipt key={r}>{r}</Receipt>
                        ))}
                      </div>
                    </div>
                    {item.action && (
                      <button
                        type="button"
                        {...inert}
                        className="product-button col-start-2 mt-3 justify-self-start md:col-start-3 md:mt-0 md:self-start"
                      >
                        {item.action}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <p className="product-label mt-2" data-seq="status">
                {today.filedOvernight} filed overnight
              </p>
            </div>
            <aside className="product-aside product-periphery hidden pl-6 min-[1360px]:block">
              <p className="product-label">Today</p>
              <ul className="mt-3 space-y-3">
                {today.calendar.map((slot) => (
                  <li key={slot.time} className="flex gap-3">
                    <span className="product-t3 w-10 flex-none">{slot.time}</span>
                    <span className="min-w-0">{slot.title}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </Frame>
    </Chapter>
  );
}
