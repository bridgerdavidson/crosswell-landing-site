import type { Metadata, Viewport } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import SafeAreaTheme from "@/components/SafeAreaTheme";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crosswell | The operating layer for financial stewards",
  description:
    "Crosswell Core is your firm's institutional memory, built and managed for you. Knowledge flows in, anyone can ask it anything, and custom agentic software stands on top. Made for the firms the enterprise platforms weren't built for.",
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
      className={`${schibsted.variable} ${newsreader.variable}`}
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
      </head>
      <body>
        <SafeAreaTheme />
        {children}
      </body>
    </html>
  );
}
