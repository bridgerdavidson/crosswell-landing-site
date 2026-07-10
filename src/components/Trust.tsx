import Reveal from "./Reveal";
import TrustDiagram from "./TrustDiagram";

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

          <div className="mt-6 lg:mt-0">
            <TrustDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
