import type { CSSProperties } from "react";
import { brand, today } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Tile, TopBar, inert } from "../shared";

/**
 * Chapter 06, finished state: a small copy of the morning dashboard in the
 * first swatch's colors, with the swatch picker above the frame. The
 * picker is a site control, so it lives outside the frame; the product
 * inside only ever shows one brand. The accent variables are set inline on
 * the shell, so they override the shell's defaults and can never leak into
 * the page. Cycling and retinting on click are design-loop work. The lit
 * element is the top bar, where the company name lives.
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
          <ul className="mb-4 flex flex-wrap gap-2">
            {brand.swatches.map((s) => {
              const pressed = s.id === active.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    className={`type-caption flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                      pressed ? "border-ink/30 text-ink" : "border-ink/10 text-ink/60 hover:text-ink"
                    }`}
                  >
                    <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: s.accent }} />
                    {s.company}
                  </button>
                </li>
              );
            })}
          </ul>

          <Frame fade="bottom" fit height="h-[600px] sm:h-[480px]" style={vars}>
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
                <div className="product-bar mt-6">
                  <span style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </Frame>
        </div>
      </Chapter>
    </div>
  );
}
