import { AgendaScreen } from "@/components/dashboard/Agenda";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { themeOf } from "@/components/dashboard/worlds";
import { Chapter } from "../shared";

/**
 * The agenda chapter: the dashboard's Agenda page, the real window from the
 * dashboard (src/components/dashboard), whole at 800 tall so the day runs
 * 8 am to 6 pm, static and at full opacity while its lighting and any
 * interaction are worked out. The Core's column is empty.
 */
export default function Agenda() {
  return (
    <div data-chapter="agenda">
      <Chapter
        claim="One list, and the whole team is on it."
        body="Your day, the team's week, and the quarter's rocks, kept in one place and synced with the task tool the team already uses. Finish something anywhere and it checks off everywhere."
      >
        <WindowFrame height={800}>
          <AgendaScreen theme={themeOf("saguaro")} size="h-[800px] w-full" />
        </WindowFrame>
      </Chapter>
    </div>
  );
}
