import Band from "./Band";

/* A held slot. The blog and its post cards are a separate brief; nothing
   here links anywhere yet. */
export default function Insights() {
  return (
    <section id="insights" className="border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Band
          label="From the desk"
          title="Insights"
          lede="What we are learning building company memory for teams that run on what they know. First pieces in editing now, publishing this fall."
        />
      </div>
    </section>
  );
}
