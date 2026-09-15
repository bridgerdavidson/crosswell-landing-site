import { agents } from "@/lib/saguaro";
import { AppWindow, Button, Icon, Label, Status, Views, type Theme } from "./ui";

/* The agents chapter's page, the site's copy of the prototype's Agents. */

const lastRun = (log: string[]) => log[log.length - 1].split("  ")[0];

export function AgentsScreen({ theme, size }: { theme: Theme; size?: string }) {
  const rows = agents.roster;
  const count = (k: string) => rows.filter((a) => a.status.kind === k).length;
  const yours = rows.filter((a) => a.status.kind === "waiting" || a.status.text.includes("your yes")).length;
  const cols = "grid grid-cols-[minmax(0,1.25fr)_216px_minmax(0,1fr)_64px_20px] gap-5";

  return (
    <AppWindow
      theme={theme}
      size={size}
      active="agents"
      controls={
        <Views
          items={[
            { label: `All ${rows.length}` },
            { label: `Running ${count("running")}` },
            { label: `Waiting on you ${yours}` },
            { label: `Scheduled ${count("scheduled")}` },
          ]}
          active={`All ${rows.length}`}
        />
      }
      actions={<Button icon="plus">New agent</Button>}
      main={
        <div className="px-7 pt-3 pb-12">
          <div className={`${cols} h-9 items-center border-b border-ink/8 text-[12px] text-ink/62`}>
            <span>Agent</span>
            <span>Status</span>
            <span>Last result</span>
            <span>Last run</span>
            <span />
          </div>
          <ul>
            {rows.map((a) => (
              <li key={a.id} className="border-b border-ink/8 py-2.5">
                <div className={`${cols} items-start`}>
                  <div className="min-w-0">
                    <p className="font-medium">{a.name}</p>
                    <p className="mt-0.5 text-[12px] text-ink/62 [text-wrap:pretty]">{a.job}</p>
                  </div>
                  <Status kind={a.status.kind} text={a.status.text} />
                  <p className="text-ink/80 [text-wrap:pretty]">{a.lastResult}</p>
                  <p className="text-[12px] whitespace-nowrap tabular-nums text-ink/62">{lastRun(a.log)}</p>
                  <span className="flex h-5 items-center justify-end text-ink/45">
                    <Icon name="more" size={16} />
                  </span>
                </div>
                {a.id === "inbox" && (
                  <div className="mt-2.5 flex items-end gap-6 rounded-md bg-ink/[0.035] px-3 py-2.5">
                    <ol className="flex flex-col gap-1">
                      {a.log.map((l) => {
                        const [time, ...rest] = l.split("  ");
                        return (
                          <li key={l} className="flex gap-3 text-[12px]">
                            <span className="w-14 flex-none tabular-nums text-ink/62">{time}</span>
                            <span className="text-ink/80">{rest.join(" ")}</span>
                          </li>
                        );
                      })}
                    </ol>
                    <span className="ml-auto">
                      <Button commit>Review 3 drafts</Button>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <Label className="mt-8">Ready to add</Label>
          <ul className="border-t border-ink/8">
            {agents.spares.map((s) => (
              <li key={s.id} className="flex items-center gap-6 border-b border-ink/8 py-2.5">
                <div className="min-w-0">
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink/62">{s.job}</p>
                </div>
                <span className="ml-auto">
                  <Button>Set up</Button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
