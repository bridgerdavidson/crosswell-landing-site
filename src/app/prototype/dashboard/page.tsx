import type { Metadata } from "next";
import type { ReactNode } from "react";
import { company } from "@/lib/saguaro";
import Fit from "./Fit";
import { JuniperHome, KestrelHome } from "./custom";
import { AgendaScreen, AgentsScreen, PipelineScreen } from "./screens";
import { HomeScreen } from "./home";
import { saguaroHome, themeOf } from "./worlds";

export const metadata: Metadata = {
  title: "Dashboard prototype",
  robots: { index: false, follow: false },
};

const saguaro = themeOf("saguaro");

const SCREENS: { id: string; name: string; note: string; screen: ReactNode }[] = [
  { id: "home", name: "Home", note: "Chapter 01.", screen: <HomeScreen home={saguaroHome()} /> },
  { id: "agenda", name: "Agenda", note: "Chapter 02.", screen: <AgendaScreen theme={saguaro} /> },
  { id: "pipeline", name: "Pipeline", note: "Chapter 04. Redrock Flips is selected.", screen: <PipelineScreen theme={saguaro} /> },
  { id: "agents", name: "Agents", note: "Chapter 05.", screen: <AgentsScreen theme={saguaro} /> },
  { id: "custom-supply", name: "Custom: Juniper Row Supply", note: "Chapter 06. The same product for a building-supply distributor: its own pages, and a Home built around the day’s deliveries.", screen: <JuniperHome /> },
  { id: "custom-firm", name: "Custom: Kestrel & Vane", note: "Chapter 06. The same product for an accounting firm: its own pages, and a Home built around the week’s deadlines.", screen: <KestrelHome /> },
];

export default function DashboardPrototype() {
  return (
    <main className="min-h-screen bg-[#e3ded3] px-6 pt-10 pb-24 font-sans text-ink lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="font-serif text-[34px] leading-tight">The dashboard, page by page</h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-[1.6] text-ink/65">
          Every page the six chapters use, drawn flat at a real laptop size (1440 by 900) with {company.name}’s sample data.
          Nothing is cut or faded, and the main area scrolls inside each window. The Core column stays empty until a chapter shows it at work.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
          {SCREENS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="font-medium text-fern-deep hover:text-ink">
              {s.name}
            </a>
          ))}
        </nav>
        <div className="mt-10 flex flex-col gap-16">
          {SCREENS.map((s) => (
            <section key={s.id} id={s.id}>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-[15px] font-semibold">{s.name}</h2>
                <p className="text-[13px] text-ink/60">{s.note}</p>
              </div>
              <Fit>{s.screen}</Fit>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
