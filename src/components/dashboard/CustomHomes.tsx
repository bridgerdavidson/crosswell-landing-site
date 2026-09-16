import { juniper, kestrel } from "@/lib/companies";
import { Avatar, Button, Label, Status } from "./ui";

/*
 * Chapter 06's other two Home pages, drawn in the same window as the
 * lender's: a distributor whose morning is a timeline of trucks, and an
 * accounting firm whose morning is a week of deadlines. Both keep the
 * lender's skeleton, because that is what the chapter's morph animates
 * between: a greeting, a hero block with its own shape, and two sections
 * under it. The data-morph names are that skeleton, shared by all three
 * pages, so a block can travel from one company's layout to the next
 * (src/components/product/custom/Custom.tsx).
 */

/* ---------- Juniper Row Supply: the day's deliveries ---------- */

const { day } = juniper;
const at = (h: number) => `${((h - day.start) / (day.end - day.start)) * 100}%`;
const hourLabel = (h: number) => `${h > 12 ? h - 12 : h} ${h >= 12 ? "pm" : "am"}`;
const HOURS = Array.from({ length: Math.floor(day.end - day.start) + 1 }, (_, i) => day.start + i);

const STOP = {
  done: "bg-ink/8 text-ink/55",
  now: "bg-[var(--accent)] text-ivory",
  late: "bg-[#f1e6d2] text-[#6f4a14] ring-1 ring-inset ring-[#b27a24]",
  next: "border border-ink/15 bg-parchment text-ink/80",
};

function Deliveries() {
  const stops = juniper.trucks.reduce((n, t) => n + t.stops.length, 0);
  return (
    <section className="mt-6">
      <div data-morph="hero-label">
        <Label aside={`${stops} stops, ${juniper.trucks.length} trucks, 1 running late`}>Deliveries today</Label>
      </div>
      <div className="border-t border-ink/8 pt-2">
        <div className="grid grid-cols-[96px_minmax(0,1fr)]">
          <span />
          <div className="relative h-5 text-[11px] tabular-nums text-ink/45">
            {HOURS.map((h) => (
              <span key={h} className="absolute -translate-x-1/2" style={{ left: at(h) }}>
                {h === day.start || h === day.end ? "" : hourLabel(h)}
              </span>
            ))}
          </div>
        </div>
        {juniper.trucks.map((t, i) => (
          <div key={t.truck} data-morph={`hero-${i + 1}`} className="grid h-14 grid-cols-[96px_minmax(0,1fr)] items-center border-b border-ink/8">
            <div>
              <p className="font-medium">{t.truck}</p>
              <p className="text-[12px] text-ink/62">{t.driver}</p>
            </div>
            <div className="relative h-full">
              {HOURS.map((h) => (
                <span key={h} className="absolute inset-y-0 w-px bg-ink/5" style={{ left: at(h) }} />
              ))}
              <span className="absolute inset-y-0 w-px bg-ink/70" style={{ left: at(day.now) }} />
              {t.stops.map((s) => (
                <span
                  key={s.name + s.from}
                  className={`absolute top-1/2 flex h-8 -translate-y-1/2 items-center gap-1.5 overflow-hidden rounded-md px-2 text-[12px] font-medium whitespace-nowrap ${STOP[s.state]}`}
                  style={{ left: `calc(${at(s.from)} + 2px)`, width: `calc(${at(s.to)} - ${at(s.from)} - 4px)` }}
                >
                  <span className="truncate">{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[96px_minmax(0,1fr)]">
          <span />
          <div className="relative h-5">
            <span className="absolute -translate-x-1/2 text-[11px] font-medium tabular-nums text-ink" style={{ left: at(day.now) }}>
              9:40
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const STOCK_COLS = "grid grid-cols-[minmax(0,1fr)_78px_66px_58px] items-center gap-3";

export function JuniperBody() {
  return (
    <div className="px-7 pt-7 pb-12">
      <p data-morph="greet" className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">
        {juniper.theme.user.greeting}
      </p>
      <p data-morph="sub" className="mt-1 text-ink/62">
        {juniper.subline}
      </p>

      <Deliveries />

      <div className="mt-8 grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10">
        <section className="min-w-0">
          <div data-morph="left-label">
            <Label aside={<Button commit>Approve 3 purchase orders</Button>}>Running low</Label>
          </div>
          <div className={`${STOCK_COLS} h-8 border-t border-ink/8 text-[12px] text-ink/62`}>
            <span>Item</span>
            <span>On hand</span>
            <span>Runs out</span>
            <span className="text-right">Order</span>
          </div>
          <ul>
            {juniper.lowStock.map((r, i) => (
              <li key={r.item} data-morph={`left-${i + 1}`} className={`${STOCK_COLS} h-9 border-t border-ink/8`}>
                <span className="truncate">{r.item}</span>
                <span className="tabular-nums text-ink/80">{r.onHand}</span>
                <span className="tabular-nums text-ink/80">{r.runsOut}</span>
                <span className="text-right font-medium tabular-nums">{r.order}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0">
          <div data-morph="right-label">
            <Label count={juniper.quotes.length}>Quotes to approve</Label>
          </div>
          <ul className="border-t border-ink/8">
            {juniper.quotes.map((q, i) => (
              <li key={q.customer} data-morph={`right-${i + 1}`} className="flex items-center gap-4 border-b border-ink/8 py-2">
                <div className="min-w-0">
                  <p className="font-medium">{q.customer}</p>
                  <p className="truncate text-[12px] text-ink/62">{q.job}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold tabular-nums">{q.amount}</p>
                  <p className="text-[12px] tabular-nums text-ink/62">{q.margin} margin</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ---------- Kestrel & Vane: the week's deadlines ---------- */

export function KestrelBody() {
  return (
    <div className="px-7 pt-7 pb-12">
      <p data-morph="greet" className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">
        {kestrel.theme.user.greeting}
      </p>
      <p data-morph="sub" className="mt-1 text-ink/62">
        {kestrel.subline}
      </p>

      <section className="mt-6">
        <div data-morph="hero-label">
          <Label aside="12 deadlines, 7 done">This week</Label>
        </div>
        <div className="grid grid-cols-5 gap-2 border-t border-ink/8 pt-3">
          {kestrel.week.map((d, i) => (
            <div key={d.day} data-morph={`hero-${i + 1}`} className={`min-w-0 rounded-lg p-1.5 ${d.today ? "bg-[var(--accent-wash)]" : "bg-ink/[0.035]"}`}>
              <div className="flex h-7 items-baseline gap-1.5 px-1.5 pt-1">
                <span className={`font-semibold ${d.today ? "text-[var(--accent-deep)]" : ""}`}>{d.day}</span>
                <span className={`tabular-nums ${d.today ? "text-[var(--accent-deep)]" : "text-ink/62"}`}>{d.date}</span>
                {d.today && <span className="ml-auto text-[11px] font-semibold text-[var(--accent-deep)]">Today</span>}
              </div>
              <ul className="mt-1 flex min-h-[238px] flex-col gap-1.5">
                {d.items.map((it) => (
                  <li key={it.client + it.task} className="rounded-md border border-ink/8 bg-parchment px-2.5 py-2">
                    <p className={`truncate font-medium ${it.status.kind === "done" ? "text-ink/55" : ""}`}>{it.client}</p>
                    <p className="mt-0.5 truncate text-[12px] text-ink/62">{it.task}</p>
                    <p className="mt-1.5 text-[12px] text-ink/80">
                      <Status kind={it.status.kind} text={it.status.text} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-10">
        <section className="min-w-0">
          <div data-morph="left-label">
            <Label count={kestrel.waiting.length} aside={<Button commit>Send 2 reminders</Button>}>
              Waiting on clients
            </Label>
          </div>
          <ul className="border-t border-ink/8">
            {kestrel.waiting.map((w, i) => (
              <li key={w.client} data-morph={`left-${i + 1}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-ink/8 py-2">
                <div className="min-w-0">
                  <p className="font-medium">{w.client}</p>
                  <p className="truncate text-[12px] text-ink/62">{w.missing}</p>
                </div>
                <div className="text-right text-[12px]">
                  <p className="text-ink/80">{w.reminder}</p>
                  <p className="text-ink/62">{w.asked}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0">
          <div data-morph="right-label">
            <Label aside="Hours booked">Team this week</Label>
          </div>
          <ul className="border-t border-ink/8">
            {kestrel.team.map((m, i) => {
              const over = m.booked > m.of;
              return (
                <li key={m.name} data-morph={`right-${i + 1}`} className="border-b border-ink/8 py-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={m.initials} />
                    <span className="font-medium">{m.name}</span>
                    <span className={`ml-auto text-[12px] tabular-nums ${over ? "font-medium text-[#8a5d1c]" : "text-ink/62"}`}>
                      {m.booked} of {m.of}
                      {over && `, ${m.booked - m.of} over`}
                    </span>
                  </div>
                  <span className="mt-2 ml-[34px] block h-[3px] rounded-full bg-ink/8">
                    <span
                      className={`block h-full rounded-full ${over ? "bg-[#b27a24]" : "bg-[var(--accent)]"}`}
                      style={{ width: `${Math.min(100, (m.booked / m.of) * 100)}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
