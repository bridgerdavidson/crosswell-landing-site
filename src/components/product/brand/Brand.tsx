import type { CSSProperties } from "react";
import { brand, today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar, inert } from "../shared";

/**
 * Chapter 06, finished state, on the run's one skeleton: chapter 01's
 * corner of the morning dashboard in the first swatch's colors, cut at the
 * right and the bottom like chapter 01, with the swatch picker in the
 * caption row under the frame, quiet, so it does not fight the product.
 * The picker is a site control, so it lives outside the frame; the product
 * inside only ever shows one brand. The accent variables are set inline on
 * the shell, so they override the shell's defaults and can never leak into
 * the page. Cycling and retinting on click are design-loop work. The lit
 * element is the top bar, where the company name lives; it is an inset
 * card ending before the fade, and the field carries no accent, so the
 * swatch's color shows in the bar until the retint piece moves the light.
 */
export default function Brand() {
  const active = brand.swatches[0];
  const vars = {
    "--accent": active.accent,
    "--accent-deep": active.accentDeep,
    "--accent-soft": active.accentSoft,
    "--accent-wash": active.accentWash,
  } as CSSProperties;

  return (
    <div data-chapter="06">
      <Chapter
        index="06"
        label="Your brand"
        claim="It looks like your company, not ours."
        body="Your name, your colors, every screen. The Core is set up to look like it was always yours, because to your team it was."
        controls={
          <ul className="flex flex-wrap gap-2">
            {brand.swatches.map((s) => (
              <li key={s.id}>
                <button type="button" aria-pressed={s.id === active.id} className="product-swatch">
                  <span aria-hidden style={{ background: s.accent }} />
                  {s.company}
                </button>
              </li>
            ))}
          </ul>
        }
      >
        <Frame fade="corner" fitNarrow height="h-auto lg:h-[800px]" style={vars}>
          <Rail active="home" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar name={active.company} lit cut />
            <div className="grid flex-1 gap-8 p-5 pt-5 md:p-6 md:pt-5 min-[1360px]:grid-cols-[minmax(0,1fr)_240px]">
              <div className="min-w-0">
                <p className="product-greeting">{today.greeting}</p>
                <p className="product-t2 mt-0.5">{today.subline}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {today.tiles.map((tile) => (
                    <Tile key={tile.label} {...tile} />
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button type="button" {...inert} className="product-button">
                    New deal
                  </button>
                  <button type="button" {...inert} className="product-button product-button-quiet">
                    Ask the Core
                  </button>
                </div>
                <p className="product-title mt-5">Needs you today</p>
                <ul className="product-rule mt-1.5">
                  {today.needsYou.map((item) => (
                    <li key={item.id} className="flex gap-4 py-2.5">
                      <Dot tone="ink" className="mt-2" />
                      <div className="min-w-0 flex-1">
                        <p className="product-strong">{item.title}</p>
                        <p className="product-t2 mt-0.5">{item.body}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {item.receipts.map((r) => (
                            <Receipt key={r}>{r}</Receipt>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="product-label mt-2">{today.filedOvernight} filed overnight</p>
                <ul className="product-rule mt-3">
                  {today.filed.map((f) => (
                    <li key={f.title} className="flex items-center justify-between gap-4 py-3">
                      <span>{f.title}</span>
                      <span className="product-t3 flex-none">{f.to}</span>
                    </li>
                  ))}
                </ul>
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
    </div>
  );
}
