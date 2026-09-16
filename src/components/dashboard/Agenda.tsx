import { agenda, agendaDay } from "@/lib/saguaro";
import { AppWindow, Button, Check, Icon, Label, Views, type Theme } from "./ui";

/* The agenda chapter's page, the site's copy of the prototype's Agenda.
   An agenda is a day on a clock, so the page is the day: hours down the
   side, each meeting a block as long as it runs, a line at now. The rest
   is kept to what today needs beside it: a short to-do list and what the
   team is doing right now, one line and one strip of the day per person.
   Tomorrow and the unassigned work sit behind the Week view instead of all
   on one screen. */

const DAY = { start: 8, end: 18, hour: 64 };
const NOW = 9 + 40 / 60;

const { blocks: BLOCKS, todo: TODO, team: TEAM_NOW } = agendaDay;

const clock = (h: number) => {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  return `${hr > 12 ? hr - 12 : hr}:${String(min).padStart(2, "0")}`;
};
const hourName = (h: number) => (h === 12 ? "12 pm" : h > 12 ? `${h - 12} pm` : `${h} am`);
const until = (h: number) => {
  const mins = Math.round((h - NOW) * 60);
  return mins >= 60 ? `in ${Math.floor(mins / 60)} hr ${mins % 60} min` : `in ${mins} min`;
};

function DayView() {
  const hours = Array.from({ length: DAY.end - DAY.start + 1 }, (_, i) => DAY.start + i);
  const y = (h: number) => (h - DAY.start) * DAY.hour;
  const next = BLOCKS.find((b) => b.from > NOW);

  return (
    <div className="relative mt-6" style={{ height: y(DAY.end) }}>
      {hours.map((h) => (
        <div key={h} className="absolute inset-x-0" style={{ top: y(h) }}>
          <span className="absolute left-0 w-11 -translate-y-1/2 text-right text-[11px] tabular-nums text-ink/45">
            {Math.abs(h - NOW) < 0.4 ? "" : hourName(h)}
          </span>
          <span className="absolute right-0 left-14 h-px bg-ink/[0.07]" />
        </div>
      ))}

      {BLOCKS.map((b) => {
        const past = b.to <= NOW;
        const short = b.to - b.from <= 0.5;
        const look = past ? "bg-ink/[0.035] text-ink/45" : b.kind === "focus" ? "bg-ink/[0.055]" : "bg-[var(--accent-wash)]";
        return (
          <div
            key={b.title}
            className={`absolute right-1 left-[62px] flex gap-3 overflow-hidden rounded-md px-3 ${short ? "items-center" : "items-start py-2"} ${look}`}
            style={{ top: y(b.from) + 4, height: (b.to - b.from) * DAY.hour - 8 }}
          >
            <div className={`min-w-0 flex-1 ${short ? "flex items-baseline gap-2" : ""}`}>
              <p className="flex items-center gap-1.5 truncate font-medium">
                {past && <Icon name="check" size={13} />}
                {b.title}
              </p>
              <p className={`truncate text-[12px] ${past ? "" : "text-ink/62"} ${short ? "" : "mt-0.5"}`}>
                {clock(b.from)} to {clock(b.to)}
                {b === next && <span className="font-medium text-[var(--accent-deep)]">, {until(b.from)}</span>}
                {b.note && !short && <span>, {b.note.toLowerCase()}</span>}
                {b.note && short && b !== next && <span>, {b.note.toLowerCase()}</span>}
              </p>
            </div>
            {b.people && (
              <div className={`flex flex-none items-center gap-1 self-center ${past ? "opacity-60" : ""}`}>
                {b.people.slice(0, 3).map((p) => (
                  <span
                    key={p}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-parchment text-[9.5px] font-semibold text-ink/70 ring-1 ring-ink/10"
                  >
                    {p}
                  </span>
                ))}
                {b.people.length > 3 && <span className="pl-0.5 text-[11px] font-medium text-ink/62">+{b.people.length - 3}</span>}
              </div>
            )}
          </div>
        );
      })}

      <div className="absolute inset-x-0" style={{ top: y(NOW) }}>
        <span className="absolute left-0 w-11 -translate-y-1/2 text-right text-[11px] font-semibold tabular-nums text-[var(--accent-deep)]">
          {clock(NOW)}
        </span>
        <span className="absolute right-0 left-14 h-[1.5px] -translate-y-1/2 bg-[var(--accent)]" />
        <span className="absolute left-[52px] h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      </div>
    </div>
  );
}

export function AgendaScreen({ theme, size, mainClassName }: { theme: Theme; size?: string; mainClassName?: string }) {
  const meetings = BLOCKS.filter((b) => b.kind === "meeting").length;
  const focus = BLOCKS.filter((b) => b.kind === "focus").length;
  const open = TODO.filter((t) => !t.done).length;

  return (
    <AppWindow
      theme={theme}
      size={size}
      mainClassName={mainClassName}
      active="agenda"
      controls={<Views items={[{ label: "Day" }, { label: "Week" }]} active="Day" />}
      actions={
        <>
          <span className="mr-2 inline-flex items-center gap-1.5 text-[12px] text-ink/62">
            <Icon name="sync" size={13} />
            Synced to {agenda.syncedTo}
          </span>
          <Button icon="plus">Add item</Button>
        </>
      }
      main={
        <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-10 px-7 pt-6 pb-10">
          <section className="min-w-0">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">Thursday, September 17</p>
                <p className="mt-1 text-ink/62">
                  {meetings} meetings, {focus} blocks of focus time, and {open} things to do.
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/12 text-ink/62">
                  <Icon name="back" size={14} />
                </span>
                <Button>Today</Button>
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/12 text-ink/62">
                  <Icon name="chevron" size={14} />
                </span>
              </div>
            </div>
            <DayView />
          </section>

          <aside className="min-w-0 pt-[66px]">
            <Label count={`${TODO.length - open} of ${TODO.length}`}>To do</Label>
            <ul className="border-t border-ink/8">
              {TODO.map((t) => (
                <li key={t.title} className="flex items-start gap-2.5 border-b border-ink/8 py-2.5">
                  <span className="pt-[3px]">
                    <Check done={t.done} />
                  </span>
                  <span className={`min-w-0 flex-1 ${t.done ? "text-ink/45" : ""}`}>{t.title}</span>
                  {t.meta && <span className="flex-none text-[12px] text-ink/62">{t.meta}</span>}
                </li>
              ))}
            </ul>

            <Label className="mt-9">What the team is up to</Label>
            <ul className="border-t border-ink/8">
              {TEAM_NOW.map((m) => (
                <li key={m.name} className="border-b border-ink/8 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ink/6 text-[10px] font-semibold text-ink/70">
                      {m.initials}
                    </span>
                    <span className="font-medium">{m.name}</span>
                    <span className="ml-auto text-[12px] tabular-nums text-ink/62">until {clock(m.until)}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 pl-[34px] text-[12px] text-ink/80">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                    <span className="truncate">{m.now}</span>
                  </p>
                  <div className="relative mt-2 ml-[34px] h-1.5 rounded-full bg-ink/[0.06]">
                    {m.busy.map(([a, b]) => (
                      <span
                        key={a}
                        className={`absolute inset-y-0 rounded-full ${a <= NOW && NOW < b ? "bg-[var(--accent)]" : "bg-ink/20"}`}
                        style={{
                          left: `calc(${((a - DAY.start) / (DAY.end - DAY.start)) * 100}% + 1px)`,
                          width: `calc(${((b - a) / (DAY.end - DAY.start)) * 100}% - 2px)`,
                        }}
                      />
                    ))}
                    <span
                      className="absolute -inset-y-1 w-px bg-ink/70"
                      style={{ left: `${((NOW - DAY.start) / (DAY.end - DAY.start)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      }
    />
  );
}
