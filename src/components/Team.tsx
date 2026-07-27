"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Reveal from "./Reveal";

/* Type this anywhere on the page and the headshots flip to the golden-hour
   set. Type it again to flip back; a reload always restores the real photos. */
const SECRET = "turtleneck";

const team = [
  {
    name: "Max Marohn",
    role: "Business & Strategy",
    photo: "/team-max.jpg",
    altPhoto: "/team-max-alt.jpg",
    line: "Runs operations inside a private credit fund. Finds the problem, owns the relationship, and speaks fund fluently because he lives there.",
  },
  {
    name: "Bridger Davidson",
    role: "Software & Engineering",
    photo: "/team-bridger.jpg",
    altPhoto: "/team-bridger-alt.jpg",
    line: "Builds the Core and everything that runs on it: the tools, the integrations, the automations. The engineering arm of the operation.",
  },
  {
    name: "Michael Zamora",
    role: "Finance & Fund Operations",
    photo: "/team-michael.jpg",
    altPhoto: "/team-michael-alt.jpg",
    line: "Fund and family-office finance. Knows deal flow, investor reporting, and how a fund actually runs from the inside.",
  },
];

export default function Team() {
  const [wants, setWants] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) {
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer !== SECRET) return;
      buffer = "";
      setWants((f) => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The joke set is fetched only once the code fires, so an ordinary visit never
  // pays for it. Decode first so the back of the card is never blank mid-flip.
  useEffect(() => {
    if (!wants || ready) return;
    let cancelled = false;
    Promise.all(
      team.map((person) => {
        const img = new window.Image();
        img.src = person.altPhoto;
        return img.decode().catch(() => undefined);
      })
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [wants, ready]);

  const flipped = wants && ready;

  return (
    <section id="team" className="border-t border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="type-kicker mb-4 text-fern-deep">The team</p>
          <h2 className="type-h2 max-w-2xl text-ink">
            Three people. Both worlds.
          </h2>
          <p className="type-body mt-5 max-w-2xl text-ink/70">
            Crosswell lives in finance and technology at the same time. That is
            the whole point.
          </p>
          <p className="type-body mt-4 max-w-2xl text-ink/70">
            Small is deliberate: you work directly with the three people who
            build and run your Core, and because your knowledge lives in open,
            portable files, nothing about your firm ever depends on ours.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {team.map((person, i) => (
            <Reveal key={person.name} delay={i * 120}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-warmgray/40 bg-ivory shadow-whisper transition-shadow hover:shadow-lifted">
                <div
                  className="team-flip relative aspect-square w-full bg-warmgray/20 sm:aspect-4/5"
                  data-flipped={flipped}
                  style={{ "--flip-delay": `${i * 90}ms` } as CSSProperties}
                >
                  <div className="team-flip-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.photo}
                      alt={person.name}
                      width={760}
                      height={760}
                      loading="lazy"
                      decoding="async"
                      className="team-flip-face"
                    />
                    {ready && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={person.altPhoto}
                        alt=""
                        aria-hidden
                        width={760}
                        height={760}
                        decoding="async"
                        className="team-flip-face team-flip-back"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="type-h3 text-ink">{person.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-fern-deep">
                    {person.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {person.line}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
