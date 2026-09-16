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
 * On a phone the frame starts at the window's own corner and shows the rail,
 * the greeting, the morning's numbers, and the whole list of what needs a
 * person, Approve and Review included, with the day's column starting at
 * the screen's edge; the Core's column waits off-screen to the right. 690
 * of the window's width sets the scale (about 0.55 on a phone, Linear's
 * proportion for a product shot: the whole first screen in a frame about
 * 350 tall), so the phone reads the page's structure more than its
 * sentences.
 */
const PHONE = { x: 0, y: 0, width: 690, height: 640 };

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
