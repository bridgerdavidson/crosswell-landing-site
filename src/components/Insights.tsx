import Reveal from "./Reveal";

/* A held slot. The blog and its post cards are a separate brief; nothing
   here links anywhere yet. */
export default function Insights() {
  return (
    <section id="insights" className="border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="type-label text-fern-deep">From the desk</p>
          <h2 className="type-h2 mt-3 text-ink">Insights</h2>
          <p className="type-body mt-5 max-w-2xl text-ink/80">
            What we are learning building company memory for teams that run on
            what they know. First pieces in editing now, publishing this fall.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
