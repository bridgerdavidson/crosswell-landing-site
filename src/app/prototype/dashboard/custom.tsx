import { AppWindow, Avatar, Button, Icon, Label, Status, type Page, type StatusKind, type Theme } from "./ui";

/*
 * Chapter 06: the same product built for different businesses. The window,
 * the rail's place, and the Core column never change; the pages, the Home
 * page's shape, its words, the colours, and the mark do. Each Home has its
 * own dominant form so the difference reads at a glance: the lender's is
 * lists, the distributor's is a timeline of horizontal bars, the accounting
 * firm's is a week of vertical columns. Every name and number is invented.
 */

/* ---------- Juniper Row Supply: a building-supply distributor ---------- */

export const juniperTheme: Theme = {
  company: "Juniper Row Supply",
  initial: "J",
  mark: "/prototype/juniper-mark.png",
  user: { name: "Nina Alvarez", initials: "NA", greeting: "Good morning, Nina." },
  accent: "#a24a25",
  accentDeep: "#843a1b",
  accentSoft: "#d4a08a",
  accentWash: "#f2e2d9",
};

const JUNIPER_PAGES: Page[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "orders", label: "Orders", icon: "orders" },
  { key: "deliveries", label: "Deliveries", icon: "truck" },
  { key: "inventory", label: "Inventory", icon: "inventory" },
  { key: "customers", label: "Customers", icon: "people" },
  { key: "agents", label: "Agents", icon: "agents" },
];

type Stop = { from: number; to: number; name: string; state: "done" | "now" | "late" | "next" };

const TRUCKS: { truck: string; driver: string; stops: Stop[] }[] = [
  {
    truck: "Truck 1",
    driver: "Luis",
    stops: [
      { from: 6.5, to: 7.5, name: "Ridgeline", state: "done" },
      { from: 7.75, to: 9.25, name: "Canyon Framing", state: "done" },
      { from: 9.5, to: 11, name: "Painted Hills", state: "now" },
      { from: 12, to: 13, name: "Blue Mesa", state: "next" },
      { from: 13.5, to: 15, name: "Saddleback Homes", state: "next" },
    ],
  },
  {
    truck: "Truck 2",
    driver: "Dee",
    stops: [
      { from: 6.75, to: 8, name: "Sun Corridor", state: "done" },
      { from: 8.5, to: 10.5, name: "Copper Ridge, 40 min late", state: "late" },
      { from: 11.25, to: 12.75, name: "Painted Desert", state: "next" },
      { from: 14, to: 15.5, name: "Ridgeline Homes", state: "next" },
    ],
  },
  {
    truck: "Truck 3",
    driver: "Marco",
    stops: [
      { from: 7, to: 9, name: "Mesa yard transfer", state: "done" },
      { from: 10, to: 11.5, name: "Arroyo Pools", state: "next" },
      { from: 12.5, to: 14, name: "Canyon Framing", state: "next" },
    ],
  },
  {
    truck: "Truck 4",
    driver: "Ana",
    stops: [
      { from: 8, to: 9, name: "Blue Mesa", state: "done" },
      { from: 9.25, to: 10.25, name: "Hohokam", state: "now" },
      { from: 11, to: 12.5, name: "Verde Ridge", state: "next" },
      { from: 13.5, to: 15, name: "Desert Bloom", state: "next" },
    ],
  },
];

const DAY_START = 6;
const DAY_END = 15.5;
const NOW = 9 + 40 / 60;
const at = (h: number) => `${((h - DAY_START) / (DAY_END - DAY_START)) * 100}%`;
const hourLabel = (h: number) => `${h > 12 ? h - 12 : h} ${h >= 12 ? "pm" : "am"}`;

const LOW_STOCK = [
  { item: "Joint compound, 5 gal", onHand: "42 pails", runsOut: "4 days", order: "200" },
  { item: "Deck screws, 3 in, 5 lb", onHand: "64 boxes", runsOut: "5 days", order: "250" },
  { item: "Studs, 2x6x8", onHand: "1,150", runsOut: "6 days", order: "3,000" },
];

const QUOTES = [
  { customer: "Ridgeline Homes", job: "Drywall and framing, Buckeye phase", amount: "$184.2K", margin: "22%" },
  { customer: "Canyon Framing", job: "Lumber package, Glendale", amount: "$38.6K", margin: "19%" },
  { customer: "Blue Mesa Remodeling", job: "Tile and backer board", amount: "$12.4K", margin: "26%" },
];

function Deliveries() {
  const stops = TRUCKS.reduce((n, t) => n + t.stops.length, 0);
  const hours = Array.from({ length: Math.floor(DAY_END - DAY_START) + 1 }, (_, i) => DAY_START + i);
  const look = {
    done: "bg-[#eceae4] text-ink/55",
    now: "bg-[var(--accent)] text-ivory",
    late: "bg-[#f1e6d2] text-[#6f4a14] ring-1 ring-inset ring-[#b27a24]",
    next: "border border-ink/15 bg-parchment text-ink/80",
  };
  return (
    <section>
      <Label aside={`${stops} stops, ${TRUCKS.length} trucks, 1 running late`}>Deliveries today</Label>
      <div className="border-t border-ink/8 pt-2">
        <div className="grid grid-cols-[96px_minmax(0,1fr)]">
          <span />
          <div className="relative h-5 text-[11px] tabular-nums text-ink/45">
            {hours.map((h) => (
              <span key={h} className="absolute -translate-x-1/2" style={{ left: at(h) }}>
                {h === DAY_START || h === DAY_END ? "" : hourLabel(h)}
              </span>
            ))}
          </div>
        </div>
        {TRUCKS.map((t) => (
          <div key={t.truck} className="grid h-14 grid-cols-[96px_minmax(0,1fr)] items-center border-b border-ink/8">
            <div>
              <p className="font-medium">{t.truck}</p>
              <p className="text-[12px] text-ink/62">{t.driver}</p>
            </div>
            <div className="relative h-full">
              {hours.map((h) => (
                <span key={h} className="absolute inset-y-0 w-px bg-ink/5" style={{ left: at(h) }} />
              ))}
              <span className="absolute inset-y-0 w-px bg-ink/70" style={{ left: at(NOW) }} />
              {t.stops.map((s) => (
                <span
                  key={s.name + s.from}
                  className={`absolute top-1/2 flex h-8 -translate-y-1/2 items-center gap-1.5 overflow-hidden rounded-md px-2 text-[12px] font-medium whitespace-nowrap ${look[s.state]}`}
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
            <span className="absolute -translate-x-1/2 text-[11px] font-medium tabular-nums text-ink" style={{ left: at(NOW) }}>
              9:40
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JuniperHome() {
  return (
    <AppWindow
      theme={juniperTheme}
      pages={JUNIPER_PAGES}
      active="home"
      actions={<Button icon="plus">New order</Button>}
      main={
        <div className="px-7 pt-7 pb-12">
          <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">{juniperTheme.user.greeting}</h1>
          <p className="mt-1 text-ink/62">Thursday, 9:40 am. Sixteen deliveries on the road, and three items running low.</p>

          <div className="mt-6">
            <Deliveries />
          </div>

          <div className="mt-8 grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10">
            <section className="min-w-0">
              <Label aside={<Button commit>Approve 3 purchase orders</Button>}>Running low</Label>
              <div className="grid h-8 grid-cols-[minmax(0,1fr)_76px_64px_56px] items-center gap-3 border-t border-ink/8 text-[12px] text-ink/62">
                <span>Item</span>
                <span>On hand</span>
                <span>Runs out</span>
                <span className="text-right">Order</span>
              </div>
              <ul>
                {LOW_STOCK.map((r) => (
                  <li key={r.item} className="grid h-9 grid-cols-[minmax(0,1fr)_76px_64px_56px] items-center gap-3 border-t border-ink/8">
                    <span className="truncate">{r.item}</span>
                    <span className="tabular-nums text-ink/80">{r.onHand}</span>
                    <span className="tabular-nums text-ink/80">{r.runsOut}</span>
                    <span className="text-right font-medium tabular-nums">{r.order}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="min-w-0">
              <Label count={QUOTES.length}>Quotes to approve</Label>
              <ul className="border-t border-ink/8">
                {QUOTES.map((q) => (
                  <li key={q.customer} className="flex items-center gap-4 border-b border-ink/8 py-2">
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
      }
    />
  );
}

/* ---------- Kestrel & Vane: an accounting firm ---------- */

export const kestrelTheme: Theme = {
  company: "Kestrel & Vane",
  initial: "K",
  mark: "/prototype/kestrel-mark.png",
  user: { name: "Daniel Hart", initials: "DH", greeting: "Good morning, Daniel." },
  accent: "#2f4f73",
  accentDeep: "#243d59",
  accentSoft: "#9fb2c7",
  accentWash: "#e0e7ef",
};

const KESTREL_PAGES: Page[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "clients", label: "Clients", icon: "clients" },
  { key: "deadlines", label: "Deadlines", icon: "deadlines" },
  { key: "documents", label: "Documents", icon: "files" },
  { key: "billing", label: "Billing", icon: "billing" },
  { key: "agents", label: "Agents", icon: "agents" },
];

type Deadline = { client: string; task: string; status: { kind: StatusKind; text: string } };

const WEEK: { day: string; date: number; today?: boolean; items: Deadline[] }[] = [
  {
    day: "Mon",
    date: 14,
    items: [
      { client: "Marigold Bakery Co.", task: "Sales tax, August", status: { kind: "done", text: "Filed" } },
      { client: "Pruitt Engineering", task: "Payroll, first half", status: { kind: "done", text: "Filed" } },
    ],
  },
  {
    day: "Tue",
    date: 15,
    items: [
      { client: "Hollis Dental Group", task: "S corp return, extended", status: { kind: "done", text: "Filed" } },
      { client: "North Fork Brewing", task: "Partnership return, extended", status: { kind: "done", text: "Filed" } },
      { client: "Alvarez Landscaping", task: "Q3 estimated tax", status: { kind: "done", text: "Paid" } },
      { client: "Sato Family Trust", task: "Q3 estimated tax", status: { kind: "done", text: "Paid" } },
    ],
  },
  {
    day: "Wed",
    date: 16,
    items: [{ client: "Canyon Vista HOA", task: "Budget review", status: { kind: "done", text: "Sent" } }],
  },
  {
    day: "Thu",
    date: 17,
    today: true,
    items: [
      { client: "Redline Auto Body", task: "Bank reconciliation, August", status: { kind: "waiting", text: "Waiting on client" } },
      { client: "Pruitt Engineering", task: "Payroll filing", status: { kind: "running", text: "In review" } },
    ],
  },
  {
    day: "Fri",
    date: 18,
    items: [
      { client: "Sato Family Trust", task: "Engagement letter", status: { kind: "waiting", text: "Waiting on client" } },
      { client: "Marigold Bakery Co.", task: "Monthly close", status: { kind: "scheduled", text: "Due Friday" } },
      { client: "Hollis Dental Group", task: "Partner meeting prep", status: { kind: "scheduled", text: "Due Friday" } },
    ],
  },
];

const WAITING = [
  { client: "Redline Auto Body", missing: "August bank statements", asked: "Asked Sep 8", reminder: "Reminder sent Monday" },
  { client: "Sato Family Trust", missing: "Signed engagement letter", asked: "Asked Sep 10", reminder: "Reminder drafted" },
  { client: "North Fork Brewing", missing: "Q3 payroll report", asked: "Asked Sep 11", reminder: "Reminder drafted" },
];

const TEAM = [
  { name: "Amara Osei", initials: "AO", booked: 34, of: 40 },
  { name: "Ben Castillo", initials: "BC", booked: 41, of: 40 },
  { name: "Lucia Park", initials: "LP", booked: 28, of: 40 },
  { name: "Tom Werner", initials: "TW", booked: 22, of: 32 },
];

export function KestrelHome() {
  return (
    <AppWindow
      theme={kestrelTheme}
      pages={KESTREL_PAGES}
      active="home"
      actions={<Button icon="plus">New client</Button>}
      main={
        <div className="px-7 pt-7 pb-12">
          <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">{kestrelTheme.user.greeting}</h1>
          <p className="mt-1 text-ink/62">Thursday, 9:40 am. Five deadlines left this week, and two are waiting on clients.</p>

          <section className="mt-6">
            <Label aside="12 deadlines, 7 done">This week</Label>
            <div className="grid grid-cols-5 gap-2 border-t border-ink/8 pt-3">
              {WEEK.map((d) => (
                <div key={d.day} className={`min-w-0 rounded-lg p-1.5 ${d.today ? "bg-[var(--accent-wash)]" : "bg-ink/[0.035]"}`}>
                  <div className="flex h-7 items-baseline gap-1.5 px-1.5 pt-1">
                    <span className={`font-semibold ${d.today ? "text-[var(--accent-deep)]" : ""}`}>{d.day}</span>
                    <span className={`tabular-nums ${d.today ? "text-[var(--accent-deep)]" : "text-ink/62"}`}>{d.date}</span>
                    {d.today && <span className="ml-auto text-[11px] font-semibold text-[var(--accent-deep)]">Today</span>}
                  </div>
                  <ul className="mt-1 flex min-h-[248px] flex-col gap-1.5">
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
              <Label count={WAITING.length} aside={<Button commit>Send 2 reminders</Button>}>
                Waiting on clients
              </Label>
              <ul className="border-t border-ink/8">
                {WAITING.map((w) => (
                  <li key={w.client} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-ink/8 py-2">
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
              <Label aside="Hours booked">Team this week</Label>
              <ul className="border-t border-ink/8">
                {TEAM.map((m) => {
                  const over = m.booked > m.of;
                  return (
                    <li key={m.name} className="border-b border-ink/8 py-2">
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
      }
    />
  );
}
