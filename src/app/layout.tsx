import type { Metadata } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
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
    "Crosswell Core is your firm's institutional memory, built on AI and managed for you. Knowledge flows in, anyone can ask it anything, and the busywork runs itself. Built by people who have worked inside funds.",
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
        {/* start the heavy hero JPEG downloading immediately, in parallel with
            the HTML, so its decode-gated fade finishes sooner */}
        <link
          rel="preload"
          as="image"
          href="/hero-core.jpg"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
