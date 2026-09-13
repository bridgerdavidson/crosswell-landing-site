import type { CSSProperties } from "react";
import { brand, today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar, inert } from "../shared";

/**
 * Chapter 06, finished state: a small copy of the morning dashboard in the
 * first swatch's colors, with the swatch picker under the frame, quiet, so
 * it does not fight the product. The picker is a site control, so it lives
 * outside the frame; the product inside only ever shows one brand. The accent variables are set inline on
 * the shell, so they override the shell's defaults and can never leak into
 * the page. Cycling and retinting on click are design-loop work. The lit
 * element is the top bar, where the company name lives; the field carries
 * no accent, so the swatch's color shows in the bar until the retint piece
 * moves the light, and the bar is an inset card so no edge of it lands on
 * the frame. The frame is 800 at lg like every frame, so the dashboard
 * continues into the needs-you list and is cut at the bottom.
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
        layout="split"
        claim="It looks like your company, not ours."
        body="Your name, your colors, every screen. The Core is set up to look like it was always yours, because to your team it was."
      >
        <div>
          <Frame fade="bottom" fit height="h-auto lg:h-[800px]" style={vars}>
            <Rail active="home" />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar name={active.company} lit />
              <div className="p-6">
                <p className="product-greeting">{today.greeting}</p>
                <p className="product-t2 mt-1.5">{today.subline}</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {today.tiles.slice(0, 3).map((tile) => (
                    <Tile key={tile.label} {...tile} />
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button type="button" {...inert} className="product-button">
                    New deal
                  </button>
                  <button type="button" {...inert} className="product-button product-button-quiet">
                    Ask the Core
                  </button>
                </div>
                <p className="product-title mt-8">Needs you today</p>
                <ul className="product-rule mt-2">
                  {today.needsYou.map((item) => (
                    <li key={item.id} className="flex gap-4 py-3">
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
              </div>
            </div>
          </Frame>
          <ul className="mt-4 flex flex-wrap gap-2">
            {brand.swatches.map((s) => (
              <li key={s.id}>
                <button type="button" aria-pressed={s.id === active.id} className="product-swatch">
                  <span aria-hidden style={{ background: s.accent }} />
                  {s.company}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>
    </div>
  );
}
