import Link from "next/link";
import Band, { CONTAINER } from "@/components/Band";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

/* New copy, pending Max (spec section 13). */
const TITLE = "There’s nothing at this address.";
const LEDE = "The link may be old, or a letter is off. Everything we have published is on the insights page, and the rest of the site starts at home.";

/*
 * The site's not-found page: what a mistyped address, an old link, or the
 * insights route's `_none` placeholder (spec section 5) shows. The site's
 * own band on the site's own ground, with the two ways on, so a visitor
 * arriving from an old share lands on Crosswell rather than a blank
 * default. Short like the index, so the footer sits at the bottom of the
 * window.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col">
      <Nav />
      <div className="flex-1">
        <section id="not-found" className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
          <Band
            label="Not found"
            title={TITLE}
            titleAs="h1"
            lede={LEDE}
            more={
              <p className="type-text mt-5 flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/insights" className="text-fern-deep underline decoration-fern-deep/35 underline-offset-2 hover:decoration-current">
                  Read the insights
                </Link>
                <Link href="/" className="text-fern-deep underline decoration-fern-deep/35 underline-offset-2 hover:decoration-current">
                  Go to the home page
                </Link>
              </p>
            }
          />
        </section>
      </div>
      <Footer />
    </main>
  );
}
