import Band, { CONTAINER } from "@/components/Band";
import Canonical from "@/components/Canonical";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { AUDIT_MAILTO, CALL_MAILTO, CONTACT_EMAIL, pageMetadata } from "@/lib/site";
import { tie } from "@/components/tie";

export const metadata = pageMetadata({
  title: "Contact | Crosswell",
  description: "Two ways in: a thirty-minute call, or the two-week audit. Both start with an email.",
  path: "/contact",
});

/* The contact page: the two ways in and the address, whole from day one
   since it needs no writing. The scheduler replaces the mailto links when
   it is picked (lib/site.ts). The band fills the window so the footer sits
   at the bottom. */
export default function ContactPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <Canonical path="/contact" />
      <Nav />
      <div className="flex-1">
        <section className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
          <Band
            label="Contact"
            title="Two ways in."
            aside={
              <div className="flex flex-col items-start gap-5">
                <p className="type-body text-ink/80">
                  {tie("A thirty-minute call, where we ask how your firm handles knowledge today and tell you straight whether the audit is worth it. Or the two-week audit itself. Both start with an email.")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={CALL_MAILTO}
                    className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
                  >
                    Set up a call
                  </a>
                  <a
                    href={AUDIT_MAILTO}
                    className="type-text rounded-lg border border-ink/15 px-6 py-3 font-semibold text-ink transition-colors hover:border-fern hover:text-fern-deep"
                  >
                    Start with the audit
                  </a>
                </div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="type-text text-ink/70 transition-colors hover:text-fern-deep">
                  {CONTACT_EMAIL}
                </a>
              </div>
            }
          />
        </section>
      </div>
      <Footer />
    </main>
  );
}
