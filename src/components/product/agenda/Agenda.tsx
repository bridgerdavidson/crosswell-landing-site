import type { ReactNode } from "react";
import { agenda } from "@/lib/saguaro";
import { Chapter, Check, Chip, Dot, Frame, Rail, TopBar } from "../shared";

/**
 * Chapter 02, finished state. Three panels on one horizontal track: your
 * day, the team's week, the quarter's rocks. Draw 4 is already checked in
 * your day and on Dana's row, and the deployment rock already reads 70,
 * which is where the scroll-driven propagation (design loop) ends up. The
 * track is wider than the frame on desktop and fades at the right; on
 * phones it stacks, fitted to the frame. The lit element is the Draw 4 row;
 * the scroll piece may move the light to the synced chip as the moment
 * plays. The frame takes the product's own height and is cut only at the
 * right, where the rocks dissolve.
 */
export default function Agenda() {
  return (
    <Chapter
      index="02"
      label="Agenda"
      claim="One list, and the whole team is on it."
      body="Your day, the team's week, and the quarter's rocks, kept in one place and synced with the task tool the team already uses. Finish something anywhere and it checks off everywhere."
    >
      <Frame fade="right" fitPhone height="h-auto">
        <Rail active="list" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="product-track flex-1 p-6">
            <Panel title="Your day">
              <ul className="product-rule">
                {agenda.yourDay.map((item) => (
                  <li
                    key={item.time}
                    className={`flex items-center gap-3 py-3 ${item.ref === "draw-4" ? "product-lit -mx-4 rounded-xl px-4" : ""}`}
                  >
                    <span className="product-t3 w-10 flex-none">{item.time}</span>
                    <span className={`flex-1 ${item.done ? "product-t2" : ""}`}>{item.title}</span>
                    {item.done ? <Check /> : <Dot tone="watch" />}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Chip accent>synced to {agenda.syncedTo}</Chip>
              </div>
            </Panel>

            <Panel title="The team this week">
              <ul className="product-rule">
                {agenda.team.map((row) => (
                  <li key={row.name} className="flex gap-3 py-3">
                    <span className="product-avatar flex-none">{row.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="product-strong">{row.name}</p>
                      <ul className="mt-1 space-y-1">
                        {row.items.map((it) => (
                          <li key={it.title} className="flex items-center gap-2">
                            {it.done ? <Check /> : <Dot tone="watch" />}
                            <span className="product-t2">{it.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Quarterly rocks">
              <ul className="space-y-4">
                {agenda.rocks.map((rock) => (
                  <li key={rock.title}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span>{rock.title}</span>
                      <span className="product-t3 flex-none">
                        {rock.pct}%{rock.note ? `, ${rock.note}` : ""}
                      </span>
                    </div>
                    <div className="product-bar mt-2">
                      <span style={{ width: `${rock.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </Frame>
    </Chapter>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="w-[380px] max-w-full flex-none">
      <p className="product-title">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}
