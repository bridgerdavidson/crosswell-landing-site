import ComingSoon from "@/components/ComingSoon";
import { pageMetadata } from "@/lib/site";

/* not yet written: out of the sitemap, and noindex until it has content */
export const metadata = {
  ...pageMetadata({
    title: "How we start | Crosswell",
    description: "The three steps in detail: the first call, the audit and the map it leaves you, and what week three looks like from your side.",
    path: "/how-we-start",
  }),
  robots: { index: false, follow: true },
};

export default function HowWeStartPage() {
  return (
    <ComingSoon
      path="/how-we-start"
      title="How we start, in detail."
      line="The three steps, one at a time: what the first call is like, what the audit produces and why you keep it, and what week three looks like from your side. We are writing it now. Until it is up, the thirty-minute call covers it."
    />
  );
}
