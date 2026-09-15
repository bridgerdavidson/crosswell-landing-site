import type { Metadata } from "next";
import Fit from "../dashboard/Fit";
import AgentsDemo from "./AgentsDemo";

export const metadata: Metadata = {
  title: "Agents chapter prototype",
  robots: { index: false, follow: false },
};

export default function AgentsPrototype() {
  return (
    <main className="min-h-screen bg-charcoal-deep px-6 pt-10 pb-24 font-sans text-ivory lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="font-serif text-[34px] leading-tight">Agents at work</h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-[1.6] text-ivory/65">
          A throwaway prototype of the agents chapter. The roster runs on its own; press send in the Core, then edit or approve the draft. The filters filter, and a row opens its last run.
        </p>
        <div className="mt-8">
          <Fit height={880}>
            <AgentsDemo />
          </Fit>
        </div>
      </div>
    </main>
  );
}
