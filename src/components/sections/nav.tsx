"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container, ButtonLink, Icon } from "@/components/ui";

const NAV_LINKS = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Why us", href: "#why-us" },
  { label: "How we work", href: "#how-we-work" },
  { label: "Team", href: "#team" },
];

const MAILTO = "mailto:hello@crosswellconsulting.com";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When the mobile menu opens, move focus into it and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-10 bg-bg transition ${
        condensed ? "border-b border-border shadow-md" : ""
      }`}
    >
      <Container className="flex h-16 items-center justify-between md:h-[4.5rem]">
        <a href="#hero" aria-label="Crosswell Consulting, back to top">
          <img src="/xw_logo_dark.svg" alt="Crosswell Consulting" className="h-7 w-auto" />
        </a>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground transition hover:text-accent-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={MAILTO} className="hidden sm:inline-flex">
            Book a call
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon icon={open ? X : Menu} />
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" ref={panelRef} className="border-t border-border bg-bg md:hidden">
          <Container className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 text-base text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href={MAILTO} className="mt-2" onClick={() => setOpen(false)}>
              Book a call
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}
