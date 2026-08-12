"use client";

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import { CALL_MAILTO, CONTACT_EMAIL } from "@/lib/site";

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

  // Strip any leftover URL hash on load so a refresh restores the scroll
  // position instead of jumping back to a previously-clicked section. Safari
  // honors the hash on every reload; the browser has already done its one-time
  // fragment scroll by the time this effect runs, so removing it is safe.
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // While the ink takeover is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Smooth-scroll a nav target so its title sits just below the nav (filling the
  // screen from there), without writing a hash to the URL (which is what made
  // reloads jump). The section's py-24/32 top padding lives on the section
  // itself (#how-it-works) or on an inner wrapper (the rest); we align below
  // whichever carries it, so there's no empty gap above the title.
  const NAV_H = 64; // scrolled nav height (h-16)
  const TOP_GAP = 20; // small breathing room under the nav
  const goToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const id = href.slice(1);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const padded =
      (parseFloat(getComputedStyle(el).paddingTop) || 0) > 0
        ? el
        : el.firstElementChild ?? el;
    const padTop = parseFloat(getComputedStyle(padded).paddingTop) || 0;
    const contentTop =
      padded.getBoundingClientRect().top + window.scrollY + padTop;
    const target = contentTop - NAV_H - TOP_GAP;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: "smooth" });
  };

  // Open sits the header on the ink overlay, so it goes transparent with a
  // light logo; otherwise the scrolled state gets the ivory blur bar.
  const headerChrome = open
    ? "border-transparent bg-transparent"
    : scrolled
      ? "border-ink/10 bg-ivory/85 backdrop-blur-md"
      : "border-transparent bg-transparent";

  return (
    <>
    <header
      className={`nav-enter fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${headerChrome}`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a
          href="#top"
          className="flex items-center"
          onClick={(e) => goToSection(e, "#top")}
        >
          <Image
            src={open ? "/xw-h-lockup-light.svg" : "/xw-h-lockup-dark.svg"}
            alt="Crosswell"
            width={295}
            height={36}
            priority
            className="h-6 w-auto md:h-7"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => goToSection(e, link.href)}
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
            Set up a call
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`-mr-2 flex h-11 w-11 items-center justify-center md:hidden ${
              open ? "text-ivory" : "text-ink"
            }`}
          >
            <span className={`nav-burger ${open ? "nav-burger-open" : ""}`} aria-hidden>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>

    {/* The ink takeover. Rendered as a SIBLING of the header: nav-enter's
        fill-mode keeps a transform on the header forever, which would turn it
        into the containing block for this fixed overlay and size it to the
        80px bar instead of the viewport. */}
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`menu-overlay md:hidden ${open ? "menu-overlay-open" : ""}`}
    >
      <nav className="menu-links">
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => goToSection(e, link.href)}
            className="menu-link"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="menu-idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="menu-txt">{link.label}</span>
          </a>
        ))}
      </nav>
      <div
        className="menu-bottom"
        style={{ "--i": links.length } as CSSProperties}
      >
        <a
          href={CALL_MAILTO}
          onClick={() => setOpen(false)}
          className="block rounded-[10px] bg-fern px-4 py-4 text-center text-[15px] font-semibold text-ivory"
        >
          Set up a call
        </a>
        <p className="menu-mail">{CONTACT_EMAIL}</p>
      </div>
    </div>
    </>
  );
}
