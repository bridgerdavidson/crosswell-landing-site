import { agents, brand, chat, today, type NeedsYou, type Tile } from "@/lib/saguaro";
import type { StatusKind, Theme } from "./ui";

/*
 * A sample company's Home, as data. Saguaro Capital, the private lender,
 * reads from the site's existing sample world. The other businesses in
 * chapter 06 (custom.tsx) carry their own pages, so their data lives with
 * them. Every name and number is invented.
 */

export type HomeWorld = {
  theme: Theme;
  subline: string;
  action: string;
  tiles: Tile[];
  needsYou: NeedsYou[];
  filedOvernight: number;
  filed: { title: string; to: string }[];
  calendar: { time: string; title: string }[];
  overnight: { name: string; status: { kind: StatusKind; text: string } }[];
  ask: { question: string; working: string[]; answer: string; receipts: string[]; suggestions: string[] };
};

/* the company marks on file; Saguaro Capital's is Bridger's generated S and saguaro */
const MARKS: Record<string, string> = { saguaro: "/prototype/saguaro-mark.svg" };

export const themeOf = (id: string): Theme => {
  const s = brand.swatches.find((w) => w.id === id)!;
  return {
    company: s.company,
    initial: s.company[0],
    mark: MARKS[id],
    user: s.user,
    accent: s.accent,
    accentDeep: s.accentDeep,
    accentSoft: s.accentSoft,
    accentWash: s.accentWash,
  };
};

const [risk, ...later] = chat.exchanges;

export const saguaroHome = (theme: Theme = themeOf("saguaro")): HomeWorld => ({
  theme,
  subline: today.subline,
  action: "New deal",
  tiles: today.tiles,
  needsYou: today.needsYou,
  filedOvernight: today.filedOvernight,
  filed: today.filed,
  calendar: today.calendar,
  overnight: agents.roster
    .filter((a) => ["inbox", "screening", "filing"].includes(a.id))
    .map((a) => ({ name: a.name, status: a.status })),
  ask: { ...risk, suggestions: later.map((e) => e.question) },
});
