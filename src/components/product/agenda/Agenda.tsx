import { AgendaScreen } from "@/components/dashboard/Agenda";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { themeOf } from "@/components/dashboard/worlds";
import { Chapter } from "../shared";

/*
 * The light: the morning is lit and everything else deliberately recedes.
 * An even wash of the page's ground covers the whole window except a soft
 * oval over its top (the date, the 9:40 line and the next call, the to-do
 * list, the top of the team), and the window dissolves into the page over
 * its last 160 at the bottom and its last 420 at the right, so the empty
 * Core's column falls away. Positions are in the window's own pixels.
 */
const WASH = "rgba(241, 238, 230, 0.74)";
const LIT = "radial-gradient(ellipse 620px 380px at 450px 260px, transparent 0%, transparent 58%, #000 100%)";
/* the window dissolves into the page along its bottom and up its right side, where the empty Core sits */
const FADE = [
  "linear-gradient(to bottom, #000 0, #000 calc(100% - 160px), transparent 100%)",
  "linear-gradient(to right, #000 0, #000 calc(100% - 420px), transparent 100%)",
].join(", ");

/**
 * The agenda chapter: the dashboard's Agenda page, the real window from the
 * dashboard (src/components/dashboard), whole at 800 tall so the day runs
 * 8 am to 6 pm, with the morning lit (above). The Core's column is empty.
 */
export default function Agenda() {
  return (
    <div data-chapter="agenda">
      <Chapter
        claim="Your day, and everyone else's, without asking."
        body="Your meetings, your focus time, and the list waiting on you, synced with the task tool your team already uses. Beside it, what everyone else is on right now and when they're free. Finish something anywhere and it checks off everywhere."
      >
        <WindowFrame height={800}>
          <div className="relative" style={{ WebkitMaskImage: FADE, maskImage: FADE, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
            <AgendaScreen theme={themeOf("saguaro")} size="h-[800px] w-full" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ background: WASH, WebkitMaskImage: LIT, maskImage: LIT }}
            />
          </div>
        </WindowFrame>
      </Chapter>
    </div>
  );
}
