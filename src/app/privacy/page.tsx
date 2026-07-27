import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Crosswell",
  description: "What this website collects and how Crosswell handles it.",
};

/* Copy is exact from the public messaging handoff (Part Three, Legal Pages).
   Publish only after the counsel pass. The analytics sentence was verified
   against the codebase on July 26, 2026: no analytics tooling, no cookies. */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 26, 2026">
      <p>
        Crosswell is a technology firm based in Arizona. This policy explains
        what this website collects and how we handle it.
      </p>
      <p>
        <strong className="font-semibold text-ink">What we collect:</strong>{" "}
        when you email us, book a call, or join the waitlist, we receive what
        you send, your name, email address, firm, role, and the content of your
        message. This site requires no account and collects no payment
        information. This site uses no analytics tools and sets no cookies.
      </p>
      <p>
        <strong className="font-semibold text-ink">How we use it:</strong> to
        respond to you, manage the waitlist, and run our business. We
        don&apos;t sell your information, and we don&apos;t share it with
        anyone except the service providers that run our email and hosting.
        Client data is different: information a client entrusts to us under an
        engagement is governed by that engagement&apos;s agreement, including a
        data processing agreement. This policy covers the website only.
      </p>
      <p>
        <strong className="font-semibold text-ink">
          Retention and your choices:
        </strong>{" "}
        we keep inquiry emails only as long as we have a business reason to.
        Email{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-medium text-fern-deep transition-colors hover:text-fern"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        to ask what we hold about you or to ask us to delete it.
      </p>
      <p>
        <strong className="font-semibold text-ink">Changes:</strong> if this
        policy changes, the new version is posted here with a new date.
      </p>
    </LegalPage>
  );
}
