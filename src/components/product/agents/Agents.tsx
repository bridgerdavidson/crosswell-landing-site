import { AgentsScreen } from "@/components/dashboard/Agents";
import WindowFrame from "@/components/dashboard/WindowFrame";
import { themeOf } from "@/components/dashboard/worlds";
import { Chapter } from "../shared";

/* Saguaro Capital on the dark band: the fern accent, its soft tint for text and the selected tab, a
   fern wash that reads on charcoal, and the mark in fern-soft */
const saguaro = themeOf("saguaro");
const dark = { ...saguaro, mark: "/demo/saguaro-mark-light.svg", accentDeep: "#93b393", accentWash: "#414b3e" };

/**
 * The agents chapter, on the run's one dark band: the dashboard's Agents
 * page (src/components/dashboard), whole at 800 tall, in the dashboard's
 * dark colours (.dashboard-dark), static and at full opacity while its
 * lighting and any interaction are worked out. The Core's column is empty.
 */
export default function Agents() {
  return (
    <div data-chapter="05">
      <Chapter
        dark
        claim="Each one has a single job. They run while you don't."
        body="Custom agents built for the work your team names: reading the inbox, chasing the silent deal, drafting the report. Each one reports what it did and waits for your yes before anything leaves the building."
      >
        <WindowFrame height={800}>
          <div className="dashboard-dark">
            <AgentsScreen theme={dark} size="h-[800px] w-full" />
          </div>
        </WindowFrame>
      </Chapter>
    </div>
  );
}
