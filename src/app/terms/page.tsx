import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Terms of Use | Crosswell",
  description: "The terms that govern the use of this website.",
};

/* Copy is exact from the public messaging handoff (Part Three, Legal Pages).
   Publish only after the counsel pass. */
export default function TermsPage() {
  return (
    <LegalPage title="Website Terms of Use" updated="July 26, 2026">
      <p>
        This website is provided by Crosswell for general information about our
        services. Nothing on this site is investment, legal, or tax advice, and
        nothing here is an offer of securities or a solicitation of investment.
      </p>
      <p>
        No engagement is formed by using this site or emailing us; engagements
        begin only under a signed agreement.
      </p>
      <p>
        Content is provided as is. We work to keep it accurate but make no
        warranties about completeness. All content and marks on this site
        belong to Crosswell.
      </p>
      <p>These terms are governed by Arizona law.</p>
      <p>
        Questions:{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-fern-deep transition-colors hover:text-fern"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
