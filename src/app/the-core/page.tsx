import ComingSoon from "@/components/ComingSoon";
import { pageMetadata } from "@/lib/site";

/* not yet written: out of the sitemap, and noindex until it has content */
export const metadata = {
  ...pageMetadata({
    title: "The Core | Crosswell",
    description: "How the Core works, a layer down: what goes in, how it connects, and what you own.",
    path: "/the-core",
  }),
  robots: { index: false, follow: true },
};

export default function TheCorePage() {
  return (
    <ComingSoon
      path="/the-core"
      title="How the Core works."
      line="A layer down from the landing page: what goes in, how it connects, and what you own. We are writing it now. Until it is up, the thirty-minute call covers it."
    />
  );
}
