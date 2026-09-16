import Band, { CONTAINER } from "./Band";
import Canonical from "./Canonical";
import Footer from "./Footer";
import Nav from "./Nav";
import { CALL_MAILTO } from "@/lib/site";
import { tie } from "./tie";

/*
 * A page that exists before it is written: its name as a band under the
 * nav, one honest line about what it will hold, and the call button, since
 * the thirty-minute call covers the page until it is up. Marked noindex and
 * kept out of the sitemap by its page.tsx, so nobody arrives from search
 * to an empty page, while a visitor moving around the site sees a whole
 * one. The band fills the window so the footer sits at the bottom.
 */
export default function ComingSoon({ path, title, line }: { path: string; title: string; line: string }) {
  return (
    <main className="flex min-h-dvh flex-col">
      <Canonical path={path} />
      <Nav />
      <div className="flex-1">
        <section className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
          <Band
            label="Coming soon"
            title={title}
            aside={
              <div className="flex flex-col items-start gap-5">
                <p className="type-body text-ink/80">{tie(line)}</p>
                <a
                  href={CALL_MAILTO}
                  className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
                >
                  Set up a call
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
