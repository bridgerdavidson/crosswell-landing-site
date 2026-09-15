import { HomeScreen } from "@/components/dashboard/Home";
import { Exchange } from "@/components/dashboard/ui";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { saguaroHome } from "@/components/dashboard/worlds";
import { today } from "@/lib/saguaro";
import { Chapter } from "../shared";

/**
 * Chapter 01: the dashboard's Home, the real window from the dashboard
 * (src/components/dashboard), cropped to its top 600 and dissolving into
 * the page along its bottom. The Core's column holds one exchange about
 * this week, so the first dashboard a visitor sees has the Core in it.
 * Display only; nothing in the window takes input.
 */
export default function Today() {
  return (
    <Chapter
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <WindowFrame light="window-light">
        <HomeScreen home={saguaroHome()} size="h-[900px] w-full" core={<Exchange {...today.ask} />} />
      </WindowFrame>
    </Chapter>
  );
}
