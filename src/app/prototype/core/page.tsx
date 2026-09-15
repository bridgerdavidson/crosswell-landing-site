import type { Metadata } from "next";
import Fit from "../dashboard/Fit";
import CoreDemo from "./CoreDemo";

export const metadata: Metadata = {
  title: "Core chapter prototype",
  robots: { index: false, follow: false },
};

export default function CorePrototype() {
  return (
    <main className="min-h-screen bg-ivory px-6 pt-10 pb-24 font-sans text-ink lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="font-serif text-[34px] leading-tight">Ask the Core</h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-[1.6] text-ink/65">
          A throwaway prototype of the Core chapter&apos;s choreography. Click Ask the Core on Redrock Flips; tap a question or Send to jump ahead.
        </p>
        <div className="mt-8">
          <Fit height={960}>
            <CoreDemo />
          </Fit>
        </div>
      </div>
    </main>
  );
}
