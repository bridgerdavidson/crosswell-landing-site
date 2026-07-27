import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "./Footer";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

/* Shared shell for the Privacy and Terms pages. Deliberately minimal: the
   main nav's section links only work on the home page, so these pages get a
   plain wordmark bar that leads back home. */
export default function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <>
      <header className="border-b border-ink/10">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/xw-h-lockup-dark.svg"
              alt="Crosswell"
              width={295}
              height={36}
              priority
              className="h-7 w-auto"
            />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <h1 className="type-h2 text-ink">{title}</h1>
        <p className="mt-3 text-sm text-ink/55">Last updated {updated}.</p>
        <div className="mt-10 space-y-6 leading-relaxed text-ink/75">
          {children}
        </div>
        <p className="mt-12">
          <Link
            href="/"
            className="text-sm font-medium text-fern-deep transition-colors hover:text-fern"
          >
            Back to the site
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
