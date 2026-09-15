import { HomeScreen } from "@/components/dashboard/Home";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { saguaroHome } from "@/components/dashboard/worlds";
import { Chapter } from "../shared";

/**
 * Chapter 01: the dashboard's Home, the real window from the dashboard
 * (src/components/dashboard), cropped to its top 600 and lit from the
 * top-left: the greeting, the numbers, and what needs a person stay at full
 * strength, and the window recedes into the page along the bottom and up
 * the right side on one curve. Display only; nothing in the window takes
 * input.
 */
export default function Today() {
  return (
    <Chapter
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <WindowFrame light="window-light">
        <HomeScreen home={saguaroHome()} size="h-[900px] w-full" />
      </WindowFrame>
    </Chapter>
  );
}
