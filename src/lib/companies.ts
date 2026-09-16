import type { StatusKind } from "@/components/dashboard/ui";

/*
 * Chapter 06's other two businesses. The run's own company, Saguaro Capital,
 * is a private lender and lives in saguaro.ts; these two are a building
 * supply distributor and an accounting firm, so the chapter can show the
 * same product built three different ways. Each carries its own colours,
 * mark, rail pages, and a Home page with its own dominant shape: the
 * lender's is lists, the distributor's is a timeline of horizontal bars,
 * the firm's is a week of vertical columns. Every name and number is
 * invented.
 */

export type CompanyTheme = {
  company: string;
  initial: string;
  mark: string;
  user: { name: string; initials: string; greeting: string };
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentWash: string;
};

export type CompanyPage = { key: string; label: string; icon: string };

/* ---------- Juniper Row Supply: a building supply distributor ---------- */

export const juniper = {
  theme: {
    company: "Juniper Row Supply",
    initial: "J",
    mark: "/demo/juniper-mark.png",
    user: { name: "Nina Alvarez", initials: "NA", greeting: "Good morning, Nina." },
    accent: "#a24a25",
    accentDeep: "#843a1b",
    accentSoft: "#d4a08a",
    accentWash: "#f2e2d9",
  } satisfies CompanyTheme,
  pages: [
    { key: "home", label: "Home", icon: "home" },
    { key: "orders", label: "Orders", icon: "orders" },
    { key: "deliveries", label: "Deliveries", icon: "truck" },
    { key: "inventory", label: "Inventory", icon: "inventory" },
    { key: "customers", label: "Customers", icon: "people" },
    { key: "agents", label: "Agents", icon: "agents" },
  ] satisfies CompanyPage[],
  action: "New order",
  subline: "Thursday, 9:40 am. Sixteen deliveries on the road, and three items running low.",
  /* the day the delivery board runs across, and where 9:40 falls in it */
  day: { start: 6, end: 15.5, now: 9 + 40 / 60 },
  trucks: [
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
  ] as { truck: string; driver: string; stops: { from: number; to: number; name: string; state: "done" | "now" | "late" | "next" }[] }[],
  lowStock: [
    { item: "Joint compound, 5 gal", onHand: "42 pails", runsOut: "4 days", order: "200" },
    { item: "Deck screws, 3 in, 5 lb", onHand: "64 boxes", runsOut: "5 days", order: "250" },
    { item: "Studs, 2x6x8", onHand: "1,150", runsOut: "6 days", order: "3,000" },
  ],
  quotes: [
    { customer: "Ridgeline Homes", job: "Drywall and framing, Buckeye phase", amount: "$184.2K", margin: "22%" },
    { customer: "Canyon Framing", job: "Lumber package, Glendale", amount: "$38.6K", margin: "19%" },
    { customer: "Blue Mesa Remodeling", job: "Tile and backer board", amount: "$12.4K", margin: "26%" },
  ],
};

/* ---------- Kestrel & Vane: an accounting firm ---------- */

export const kestrel = {
  theme: {
    company: "Kestrel & Vane",
    initial: "K",
    mark: "/demo/kestrel-mark.png",
    user: { name: "Daniel Hart", initials: "DH", greeting: "Good morning, Daniel." },
    accent: "#2f4f73",
    accentDeep: "#243d59",
    accentSoft: "#9fb2c7",
    accentWash: "#e0e7ef",
  } satisfies CompanyTheme,
  pages: [
    { key: "home", label: "Home", icon: "home" },
    { key: "clients", label: "Clients", icon: "clients" },
    { key: "deadlines", label: "Deadlines", icon: "deadlines" },
    { key: "documents", label: "Documents", icon: "files" },
    { key: "billing", label: "Billing", icon: "billing" },
    { key: "agents", label: "Agents", icon: "agents" },
  ] satisfies CompanyPage[],
  action: "New client",
  subline: "Thursday, 9:40 am. Five deadlines left this week, and two are waiting on clients.",
  week: [
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
  ] as { day: string; date: number; today?: boolean; items: { client: string; task: string; status: { kind: StatusKind; text: string } }[] }[],
  waiting: [
    { client: "Redline Auto Body", missing: "August bank statements", asked: "Asked Sep 8", reminder: "Reminder sent Monday" },
    { client: "Sato Family Trust", missing: "Signed engagement letter", asked: "Asked Sep 10", reminder: "Reminder drafted" },
    { client: "North Fork Brewing", missing: "Q3 payroll report", asked: "Asked Sep 11", reminder: "Reminder drafted" },
  ],
  team: [
    { name: "Amara Osei", initials: "AO", booked: 34, of: 40 },
    { name: "Ben Castillo", initials: "BC", booked: 41, of: 40 },
    { name: "Lucia Park", initials: "LP", booked: 28, of: 40 },
    { name: "Tom Werner", initials: "TW", booked: 22, of: 32 },
  ],
};
