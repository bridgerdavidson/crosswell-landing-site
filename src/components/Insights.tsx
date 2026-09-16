import Band, { CONTAINER } from "./Band";

/* The insights page's opening band, under the nav. A held slot: the blog
   and its post cards are a separate brief, and nothing here links anywhere
   yet. */
export default function Insights() {
  return (
    <section id="insights" className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
      <Band
        label="From the desk"
        title="Insights"
        lede="What we are learning building company memory for teams that run on what they know. First pieces in editing now, publishing this fall."
      />
    </section>
  );
}
