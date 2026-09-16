import Canonical from "@/components/Canonical";
import Nav from "@/components/Nav";
import Values from "@/components/Values";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Team | Crosswell",
  description: "The values Crosswell is built on, and what each one costs us.",
  path: "/team",
});

/* The team page: what we are building toward and what it costs us, then
   the closing call. It opens on the values, under the nav, with no hero.
   The bios and headshots that followed the values came out in September
   2026; the page keeps its route and its place in the nav. */
export default function TeamPage() {
  return (
    <main>
      <Canonical path="/team" />
      <Nav />
      <Values first />
      <FinalCta />
      <Footer />
    </main>
  );
}
