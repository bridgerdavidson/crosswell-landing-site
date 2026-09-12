import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import SafeAreaTheme from "@/components/SafeAreaTheme";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

const SITE = "https://crosswellconsulting.com";
const TITLE = "Crosswell | The operating layer your business actually runs on";
/* New copy, pending Max (spec section 12, item 7). */
const DESCRIPTION =
  "Crosswell builds custom agentic AI around how your team actually works. The Core is the memory and operating layer your business runs on, and the workflows, automations, and agents we build run on it. Arizona.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Crosswell Consulting",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Crosswell" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Crosswell Consulting",
  url: SITE,
  logo: `${SITE}/xw-h-lockup-dark.svg`,
  description: DESCRIPTION,
  areaServed: "US",
};

// iOS Safari paints its chrome with theme-color; the base pins to the same
// ivory the page and nav paint so chrome and page read as one piece, and
// SafeAreaTheme repaints it on phones as dark sections or the menu takeover
// reach the viewport edges. viewport-fit=cover lets those surfaces extend
// into the notch and home-indicator zones instead of stopping at a seam.
export const viewport: Viewport = {
  themeColor: "#f1eee6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Hand-authored instead of metadata.alternates.canonical: for a root
            path, Next's own resolver (resolveAbsoluteUrlWithPathname) collapses
            the URL to the bare origin and only re-adds the trailing slash when
            next.config sets trailingSlash, which this static export doesn't set.
            This tag carries the trailing-slash canonical directly. */}
        <link rel="canonical" href={`${SITE}/`} />
        {/* start the hero JPEG downloading immediately, in parallel with the
            HTML, so its decode-gated fade finishes sooner; media-split so a
            phone never fetches the 2.2MB desktop original */}
        <link
          rel="preload"
          as="image"
          href="/hero-core.jpg"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/hero-core-mobile.jpg"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </head>
      <body>
        <SafeAreaTheme />
        {children}
      </body>
    </html>
  );
}
