import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import SafeAreaTheme from "@/components/SafeAreaTheme";
import { SITE, SITE_DESCRIPTION, SITE_TITLE, pageMetadata } from "@/lib/site";
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

/* every page overrides this with its own (lib/site.ts, pageMetadata) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  ...pageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" }),
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Crosswell Consulting",
  url: SITE,
  logo: `${SITE}/xw-h-lockup-dark.svg`,
  description: SITE_DESCRIPTION,
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
