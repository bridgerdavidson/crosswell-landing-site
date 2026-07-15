import Reveal from "./Reveal";

const audiences = [
  "Hedge funds",
  "Private equity",
  "Private credit",
  "Family offices",
  "Registered investment advisers",
  "Wealth advisors",
];

// The marquee scrolls one half of the track and loops at -50%. For the loop to
// never reveal a blank edge, a single half must be wider than the viewport, so
// we repeat the list enough times that even a large display stays covered. The
// pr-4 trailing gap matches the flex gap, which keeps the -50% seam seamless.
const SETS_PER_HALF = 4;
const half = Array.from({ length: SETS_PER_HALF }, () => audiences).flat();
const row = [...half, ...half];

export default function WhoItsFor() {
  return (
    <section className="border-y border-ink/8 bg-fern-wash py-16 sm:py-20">
      <Reveal>
        <h2 className="type-h2 px-6 text-center text-ink">
          Built for the people who manage money.
        </h2>
        <p className="mt-3 px-6 text-center text-ink/60">
          Funds first. Arizona first. If your firm runs on knowledge and
          judgment, the Core fits.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="drift-slow flex w-max items-center gap-4 pr-4">
            {row.map((audience, i) => (
              <span
                key={`${audience}-${i}`}
                className="whitespace-nowrap rounded-full border border-fern/30 bg-parchment px-5 py-2.5 text-sm font-medium text-ink/75"
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
