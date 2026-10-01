import Canonical from "@/components/Canonical";
import Nav from "@/components/Nav";
import Team from "@/components/Team";
import Values from "@/components/Values";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Team | Crosswell",
  description: "The people you’ll work with, the vision Crosswell is building toward, and the values it is built on.",
  path: "/team",
});

/* The team page: the three people, then what we are building toward and
   what it costs us, then the closing call. It opens on the team, under the
   nav, with no hero. The bios came out in September 2026 and the team
   returned as names and roles only. */
export default function TeamPage() {
  return (
    <main>
      <Canonical path="/team" />
      <Nav />
      <Team />
      <Values />
      <FinalCta />
      <Footer />
    </main>
  );
}
