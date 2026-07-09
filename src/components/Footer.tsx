import Image from "next/image";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-charcoal-deep text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-12 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Image src="/xw-logo-light.svg" alt="Crosswell" width={40} height={16} />
          <div>
            <p className="font-serif text-lg tracking-tight">Crosswell</p>
            <p className="text-xs text-ivory/50">
              The technology arm for the people who manage money. Arizona.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 text-sm sm:items-end">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-ivory/80 transition-colors hover:text-fern-soft"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="text-xs text-ivory/45">
            © 2026 Crosswell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
