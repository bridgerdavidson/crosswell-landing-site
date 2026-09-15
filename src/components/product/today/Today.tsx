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
 * one exchange about this week and a half-typed next message, so the first
 * dashboard a visitor sees shows the Core as a chat. Static, display only.
 */
export default function Today() {
  return (
    <Chapter
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <WindowFrame>
        <HomeScreen
          home={saguaroHome()}
          size="h-[640px] w-full"
          mainClassName="dashboard-fade"
          core={<Exchange {...today.ask} />}
          draft={today.ask.draft}
        />
      </WindowFrame>
    </Chapter>
  );
}
