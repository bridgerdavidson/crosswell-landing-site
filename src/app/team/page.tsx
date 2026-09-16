import Canonical from "@/components/Canonical";
import Nav from "@/components/Nav";
import Values from "@/components/Values";
import Team from "@/components/Team";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Team | Crosswell",
  description:
    "Three people, one team. The values Crosswell is built on, what each one costs us, and the people who build and run your Core.",
  path: "/team",
});

/* The team page: what we are building toward and what it costs us, then
   the three people, then the closing call. It opens on the values, under
   the nav, with no hero. */
export default function TeamPage() {
  return (
    <main>
      <Canonical path="/team" />
      <Nav />
      <Values first />
      <Team />
      <FinalCta />
      <Footer />
    </main>
  );
}
