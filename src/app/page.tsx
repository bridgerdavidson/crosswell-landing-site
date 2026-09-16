import Canonical from "@/components/Canonical";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProductRun from "@/components/product/ProductRun";
import WhoItsFor from "@/components/WhoItsFor";
import HowWeStart from "@/components/HowWeStart";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

/*
 * The landing page: explain, qualify, ask. The hero, what we do (with the
 * two figures under it and the stack), the run of five chapters, who it's
 * for, how we start, the closing call. The team and its values live at
 * /team and the blog at /insights (2026-09-15, spec section 22).
 *
 * Parked, not deleted: components/brain/BrainSection (the Core's map,
 * "Nothing your firm knows sits alone.") and components/TimeBack (the four
 * pain and fix pairs). Both are for a future page on how the Core works,
 * where they carry an argument the run now makes on its own here.
 */
export default function Home() {
  return (
    <main>
      <Canonical path="/" />
      <Nav />
      <Hero />
      <ProductRun />
      <WhoItsFor />
      <HowWeStart />
      <FinalCta />
      <Footer />
    </main>
  );
}
