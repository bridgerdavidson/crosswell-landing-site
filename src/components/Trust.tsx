import Reveal from "./Reveal";

const guarantees = [
  {
    title: "Isolated per firm",
    body: "Your brain runs in its own environment. No shared database, nothing to leak across clients.",
  },
  {
    title: "Encrypted everywhere",
    body: "At rest and in transit, with access controls and an audit trail at the application layer.",
  },
  {
    title: "Yours to walk away with",
    body: "Your knowledge lives in open, portable files. Leaving is losing nothing, which is exactly why clients stay.",
  },
  {
    title: "Host it yourself",
    body: "For the most sensitive firms, the brain can live entirely on your own servers. Even we cannot see it.",
  },
];

export default function Trust() {
  return (
    <section id="security" className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal>
              <p className="type-kicker mb-4 text-fern-soft">Security</p>
              <h2 className="type-h2 max-w-xl">Trust is the product.</h2>
              <p className="type-body mt-5 max-w-xl text-ivory/70">
                A firm that manages other people&apos;s money does not get to
                gamble on its vendors. Core is built to the standard funds
                actually require, and we sign a data processing agreement with
                every client.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {guarantees.map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <div>
                    <div className="mb-3.5 h-px w-10 bg-fern-soft" />
                    <h3 className="type-h3 text-ivory">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={150} className="hidden lg:block">
            <div className="relative mx-auto h-[420px] w-[420px]" aria-hidden="true">
              <svg viewBox="0 0 420 420" className="h-full w-full">
                <g className="vault-ring">
                  <circle
                    cx="210"
                    cy="210"
                    r="190"
                    fill="none"
                    stroke="var(--color-fern-soft)"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                    strokeDasharray="3 10"
                  />
                </g>
                <g className="vault-ring-reverse">
                  <circle
                    cx="210"
                    cy="210"
                    r="145"
                    fill="none"
                    stroke="var(--color-fern-soft)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                  />
                </g>
                <g className="vault-ring">
                  <circle
                    cx="210"
                    cy="210"
                    r="100"
                    fill="none"
                    stroke="var(--color-fern-soft)"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                    strokeDasharray="1 6"
                  />
                </g>
                <circle
                  cx="210"
                  cy="210"
                  r="56"
                  fill="var(--color-charcoal-deep)"
                  stroke="var(--color-fern-soft)"
                  strokeOpacity="0.6"
                  strokeWidth="1"
                />
                <g transform="translate(210 210)">
                  <path
                    d="M-11 4v-8a11 11 0 0 1 22 0v8"
                    fill="none"
                    stroke="var(--color-fern-soft)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="-16"
                    y="2"
                    width="32"
                    height="24"
                    rx="4"
                    fill="none"
                    stroke="var(--color-fern-soft)"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="14" r="3" fill="var(--color-fern-soft)" />
                </g>
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
