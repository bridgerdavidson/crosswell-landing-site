import Image from "next/image";
import { CALL_MAILTO } from "@/lib/site";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-crosswell", label: "Why Crosswell" },
  { href: "#security", label: "Security" },
  { href: "#team", label: "Team" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/xw-logo-dark.svg"
            alt="Crosswell"
            width={44}
            height={18}
            priority
          />
          <span className="font-serif text-xl tracking-tight text-ink">
            Crosswell
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={CALL_MAILTO}
          className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-fern hover:text-fern-deep"
        >
          Book a call
        </a>
      </div>
    </header>
  );
}
