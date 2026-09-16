import ComingSoon from "@/components/ComingSoon";
import { pageMetadata } from "@/lib/site";

/* not yet written: out of the sitemap, and noindex until it has content */
export const metadata = {
  ...pageMetadata({
    title: "What we build | Crosswell",
    description: "The kinds of agents and workflows Crosswell builds, by the work they do, for businesses that run on what they know.",
    path: "/what-we-build",
  }),
  robots: { index: false, follow: true },
};

export default function WhatWeBuildPage() {
  return (
    <ComingSoon
      path="/what-we-build"
      title="What we build."
      line="The kinds of agents and workflows we build, by the work they do, for a manufacturer, a clinic, a logistics company, a construction firm. We are writing it now. Until it is up, the thirty-minute call covers it."
    />
  );
}
