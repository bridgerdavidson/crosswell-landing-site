"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CALL_MAILTO } from "@/lib/site";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-crosswell", label: "Why Crosswell" },
  { href: "#security", label: "Security" },
  { href: "#team", label: "Team" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid
          ? "border-ink/10 bg-ivory/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/xw-logo-dark.svg"
            alt=""
            width={63}
            height={26}
            priority
            className="h-[26px] w-auto"
          />
          <span className="text-xl font-semibold leading-none tracking-tight text-ink">
            Crosswell
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs font-medium uppercase tracking-[0.15em] text-ink/75 transition-colors duration-200 hover:text-ink after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-fern after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CALL_MAILTO}
            className="hidden rounded-lg bg-fern px-4 py-2 text-sm font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep md:inline-block"
          >
            Book a call
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ink md:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" />
              ) : (
                <path d="M2 6h16M2 14h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-ivory/95 px-6 pb-6 pt-2 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/8 py-3.5 text-sm font-medium uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={CALL_MAILTO}
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-lg bg-fern px-4 py-3 text-center text-sm font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
          >
            Book a call
          </a>
        </nav>
      )}
    </header>
  );
}
