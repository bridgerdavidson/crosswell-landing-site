import Reveal from "./Reveal";

const audiences = [
  "Hedge funds",
  "Private equity",
  "Private credit",
  "Family offices",
  "Registered investment advisers",
  "Wealth advisors",
];

export default function WhoItsFor() {
  const row = [...audiences, ...audiences];
  return (
    <section className="border-y border-ink/8 bg-fern-mist/60 py-16 sm:py-20">
      <Reveal>
        <h2 className="type-h2 px-6 text-center text-ink">
          Built for the people who manage money.
        </h2>
        <p className="mt-3 px-6 text-center text-ink/60">
          Funds first. Arizona first. If your firm runs on knowledge and
          judgment, Core fits.
        </p>
      </Reveal>

      <div
        className="mt-10 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="drift-slow flex w-max items-center gap-4 pr-4">
          {row.map((audience, i) => (
            <span
              key={`${audience}-${i}`}
              className="whitespace-nowrap rounded-full border border-fern/25 bg-parchment px-5 py-2.5 text-sm font-medium text-ink/75"
            >
              {audience}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
