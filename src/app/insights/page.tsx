import Canonical from "@/components/Canonical";
import Nav from "@/components/Nav";
import Insights from "@/components/Insights";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Insights | Crosswell",
  description: "What we are learning building company memory for teams that run on what they know.",
  path: "/insights",
});

/* The insights page: the blog's home. A held slot until the first pieces
   publish; the posts and their cards are a separate brief. */
export default function InsightsPage() {
  /* a short page: the band fills the viewport so the footer sits at the
     bottom of the window rather than a third of the way down it */
  return (
    <main className="flex min-h-dvh flex-col">
      <Canonical path="/insights" />
      <Nav />
      <div className="flex-1">
        <Insights />
      </div>
      <Footer />
    </main>
  );
}
