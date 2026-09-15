import { HomeScreen } from "@/components/dashboard/Home";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { saguaroHome } from "@/components/dashboard/worlds";
import { Chapter } from "../shared";

/**
 * Chapter 01: the dashboard's Home, the real window from the dashboard
 * (src/components/dashboard), at full opacity with no fade while the
 * chapter's lighting is worked out: which part of the page is lit and how
 * the rest recedes into the app's own ground. Display only; nothing in the
 * window takes input.
 */
export default function Today() {
  return (
    <Chapter
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <WindowFrame>
        <HomeScreen home={saguaroHome()} size="h-[800px] w-full" />
      </WindowFrame>
    </Chapter>
  );
}
