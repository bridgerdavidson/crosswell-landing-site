import { HomeScreen } from "@/components/dashboard/Home";
import { Exchange } from "@/components/dashboard/ui";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { saguaroHome } from "@/components/dashboard/worlds";
import { today } from "@/lib/saguaro";
import { Chapter } from "../shared";

/**
 * Chapter 01: the dashboard's Home, the real window from the dashboard
 * (src/components/dashboard), whole at 640 tall, its page dissolving into
 * the app's ground above the window's bottom edge. The Core's column holds
 * one exchange about this week above its empty message box, so the first
 * dashboard a visitor sees shows the Core as a chat. Static, display only.
 *
 * On a phone the frame holds the page's left side: the greeting, the
 * morning's numbers, and the list of what needs a person, with its Approve
 * and Review buttons at the crop's right edge (the list ends at 564, plus
 * the page's own breathing room). The rail and the Core's column wait
 * outside the frame; the top bar stays, so it still reads as the app.
 */
const PHONE = { x: 69, y: 0, width: 511, height: 640 };

export default function Today() {
  return (
    <Chapter
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night’s mail, filed what is routine, and put the three things that need a person at the top."
    >
      <WindowFrame phone={PHONE}>
        <HomeScreen
          home={saguaroHome()}
          size="h-[640px] w-full"
          mainClassName="dashboard-fade"
          core={<Exchange {...today.ask} />}
        />
      </WindowFrame>
    </Chapter>
  );
}
