import { agents, type AgentStatus } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, TopBar, inert } from "../shared";

const TONE: Record<AgentStatus["kind"], "accent" | "watch" | "ink"> = {
  running: "accent",
  waiting: "ink",
  done: "accent",
  scheduled: "watch",
};

/**
 * Chapter 05, finished state: the roster after the six-second live
 * sequence has played (the inbox agent done, the follow-up agent waiting,
 * the filing agent still running), and the hand-off composer with its
 * task ready. The ticking statuses, the row expand, and the hand-off
 * adding a row are design-loop work. The lit element is the inbox agent's
 * row, the one the live sequence lands on. The frame is 800 at lg like
 * every frame, so the roster runs on below the composer (the spec's two
 * spares, not yet running) and is cut at the bottom; the top bar's rule
 * stops inside the frame's right edge.
 */
export default function Agents() {
  const running = agents.roster.filter((a) => a.status.kind === "running").length;
  return (
    <div data-chapter="05">
      <Chapter
        index="05"
        label="Agents"
        layout="split"
        claim="Each one has a single job. They run while you don't."
        body="Custom agents built for the work your team names: reading the inbox, chasing the silent deal, drafting the report. Each one reports what it did and waits for your yes before anything leaves the building."
      >
        <Frame fade="bottom" fit height="h-auto lg:h-[800px]">
          <Rail active="settings" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar inset />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline gap-3">
                <p className="product-title">Agents</p>
                <span className="product-t3">{running} running</span>
              </div>
              <ul className="product-rule mt-3">
                {agents.roster.map((agent) => (
                  <li
                    key={agent.id}
                    data-agent={agent.id}
                    className={`grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-[1fr_260px] sm:gap-6 ${
                      agent.id === agents.roster[0].id ? "product-lit -mx-3 rounded-xl px-3" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="product-strong">{agent.name}</p>
                      <p className="product-label mt-0.5">{agent.job}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2">
                        <Dot tone={TONE[agent.status.kind]} />
                        <span>{agent.status.text}</span>
                      </p>
                      <p className="product-label mt-0.5">{agent.lastResult}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="product-input mt-6">
                <span className="min-w-0 flex-1 truncate">{agents.handoff.task}</span>
                <button type="button" {...inert} className="product-button">
                  {agents.handoff.button}
                </button>
              </div>
              <p className="product-title mt-8">Available</p>
              <ul className="product-rule mt-3">
                {agents.spares.map((spare) => (
                  <li
                    key={spare.id}
                    data-spare={spare.id}
                    className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-[1fr_260px] sm:gap-6"
                  >
                    <div className="min-w-0">
                      <p className="product-strong">{spare.name}</p>
                      <p className="product-label mt-0.5">{spare.job}</p>
                    </div>
                    <p className="flex items-center gap-2">
                      <Dot tone="watch" />
                      <span>Not running</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
