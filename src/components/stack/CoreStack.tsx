"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTAINER } from "../Band";
import { tie } from "../tie";
import {
  AG_START,
  AG_STEP,
  ARRIVALS,
  B,
  CORE_T,
  D0,
  DOCKS,
  DOCK_START,
  DOCK_STEP,
  END,
  FERN,
  H,
  INK,
  IS_ARRIVAL,
  KINDS,
  LOWER,
  M0,
  PARENT,
  POINTS,
  ROOTS,
  SPIN,
  THREADS,
  TILES,
  TILT,
  W,
  Z_AGENTS,
  Z_DASH,
  fern,
  ink,
} from "./geometry";
import { AgentTiles, CoreArt, DashArt, Legend, PieceIcon, Standing } from "./StackArt";

gsap.registerPlugin(ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";

const CAPTIONS = [
  {
    label: "The Core",
    title: "Everything your company knows, in one place.",
    body: "Emails, files, meetings, and decisions go in. The Core sorts them and connects them, so AI can find and use them.",
  },
  {
    label: "Agents and automations",
    title: "The work, built on what you know.",
    body: "Custom agents, automations, and workflows read the Core for context, then do the manual work your team names.",
    legend: true,
  },
  {
    label: "Your dashboard",
    title: "One screen for the whole team.",
    body: "What the agents found, what needs a yes, and what comes next, all in one place.",
  },
  {
    label: "Built by Crosswell",
    title: "Your team sees one screen. Everything under it is what makes it smart.",
    body: "You tell us the problem. We build every layer around your business and keep it running.",
  },
];

const d3: CSSProperties = { transformStyle: "preserve-3d" };
const plate = "absolute inset-0 rounded-[18px]";
const scaler = "absolute top-1/2 left-1/2 h-0 w-0 scale-[0.5] sm:scale-75 lg:scale-90 xl:scale-100";

/* The camera over the stack: the plates turned and tipped back, the
   lines standing between them. Rendered twice: once for the stack, and
   once more on top holding only the lines up to the dashboard, so they
   draw over its face and read all the way into their cards. */
function Camera({ children, over = false }: { children: ReactNode; over?: boolean }) {
  return (
    <div className={`${scaler}${over ? " pointer-events-none" : ""}`} style={{ perspective: "2600px" }}>
      <div
        className="tilt absolute"
        style={{ left: -W / 2, top: -H / 2, width: W, height: H, transform: `translate3d(0, ${LOWER}px, 0) rotateX(${TILT}deg)`, ...d3 }}
      >
        <div className="spin absolute inset-0" style={{ transform: `rotate(${SPIN}deg)`, ...d3 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * What we do, drawn: the Core (everything the company knows), the work
 * layer on it (agents, automations, workflows), and the dashboard on top.
 * Under JS with motion the frame holds while the scroll scrubs one
 * timeline: things land on the Core and turn into connected points, each
 * tile reads the Core in turn, each tile's work pulses up to a card, and
 * the layers close as the camera comes round to the dashboard. Reduced
 * motion and no-JS show the finished stack beside the four captions.
 */
export default function CoreStack() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const q = gsap.utils.selector(el);

      /* the starting state, over the finished one the markup draws */
      gsap.set(q(".tilt, .spin, .core-group, .agents-group, .dash-group"), { clearProps: "transform" });
      gsap.set(q(".tilt"), { rotationX: TILT, y: LOWER });
      gsap.set(q(".spin"), { rotation: SPIN });
      /* the plates fade, never their groups: a group below full opacity
         flattens its 3D children, which drew a falling thing as landed */
      gsap.set(q(".core-group"), { z: -80 });
      gsap.set(q(".core-plate"), { opacity: 0 });
      gsap.set(q(".agents-group"), { z: 0, opacity: 0 });
      gsap.set(q(".dash-group"), { z: Z_DASH + 180, opacity: 0 });
      /* things fall flat, parallel to the board, and land flush on it */
      gsap.set(q(".piece"), { z: 380, opacity: 0, transformOrigin: "50% 50%" });
      el.querySelectorAll<SVGLineElement>(".thread").forEach((t) => gsap.set(t, { strokeDashoffset: Number(t.dataset.len) }));
      POINTS.forEach((p, i) => {
        const from = POINTS[PARENT[i]];
        gsap.set(q(`.node-${i}`), { scale: 0, x: from.x - p.x, y: from.y - p.y, transformOrigin: "50% 50%" });
      });
      gsap.set(q(".tile"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(q(".tile-check"), { opacity: 0 });
      gsap.set(q(".root-line"), { strokeDashoffset: 100, strokeOpacity: 0.55 });
      gsap.set(q(".dash-pill"), { fill: ink(0.1) });
      gsap.set(q(".stack-cap"), { opacity: 0, y: 18 });
      gsap.set(q(".stack-cap-0"), { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });

      /* 1. the Core: things land one by one and stay, then become points */
      tl.to(q(".core-group"), { z: 0, duration: 5 }, 0);
      tl.to(q(".core-plate"), { opacity: 1, duration: 5 }, 0);
      ARRIVALS.forEach((idx) => {
        const land = CORE_T.land[idx];
        tl.to(q(`.piece-${idx}`), { opacity: 1, duration: 0.8, ease: "none" }, land);
        tl.to(q(`.piece-${idx}`), { z: 0, duration: 2.6, ease: "power3.in" }, land);
        const turn = CORE_T.turn[idx];
        tl.to(q(`.piece-${idx}`), { scale: 0, opacity: 0, duration: 1.1, ease: "power2.in" }, turn);
        tl.fromTo(
          q(`.pulse-${idx}`),
          { attr: { r: 5 }, opacity: 0.7 },
          { attr: { r: 24 }, opacity: 0, duration: 2, ease: "power1.out", immediateRender: false },
          turn + 0.8,
        );
      });
      POINTS.forEach((_, i) => {
        const arrival = IS_ARRIVAL.has(i);
        tl.to(
          q(`.node-${i}`),
          { scale: 1, x: 0, y: 0, duration: arrival ? 1 : 1.4, ease: arrival ? "back.out(2.4)" : "power2.out" },
          CORE_T.live[i] - (arrival ? 0.1 : 1.4),
        );
      });
      THREADS.forEach((_, i) => {
        tl.to(q(`.thread-${i}`), { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, CORE_T.threadAt[i]);
      });

      /* 2. the work layer lifts out of the Core; one tile works at a time */
      tl.to(q(".stack-cap-0"), { opacity: 0, y: -18, duration: 2 }, B);
      tl.to(q(".stack-cap-1"), { opacity: 1, y: 0, duration: 2 }, B + 2);
      tl.to(q(".agents-group"), { z: Z_AGENTS, opacity: 1, duration: 7, ease: "power2.inOut" }, B + 1);
      tl.to(q(".tile"), { scale: 1, opacity: 1, duration: 1.6, stagger: 0.8, ease: "back.out(1.6)" }, B + 6);
      TILES.forEach((_, k) => {
        const at = AG_START + k * AG_STEP;
        tl.to(q(`.tile-box-${k}`), { borderColor: fern(0.9), duration: 0.8 }, at);
        tl.to(q(`.tile-glow-${k}`), { opacity: 1, duration: 1 }, at);
        let j = 0;
        ROOTS.forEach((r, ri) => {
          if (r.tile !== k) return;
          const el = `.root-${ri}`;
          const base = IS_ARRIVAL.has(r.node) ? 0.78 : 0.5;
          tl.to(q(`${el} .root-line`), { strokeDashoffset: 0, duration: 2.2, ease: "power1.inOut" }, at + 0.4 + j * 0.4);
          tl.set(q(`${el} .root-light`), { opacity: 1 }, at + 2.8 + j * 0.3);
          tl.fromTo(q(`${el} .root-light`), { strokeDashoffset: 7 }, { strokeDashoffset: -93, duration: 2.2, ease: "power1.in", immediateRender: false }, at + 2.8 + j * 0.3);
          tl.to(q(`.node-${r.node}`), { fill: FERN, fillOpacity: 1, scale: 1.7, duration: 0.8, ease: "back.out(2)" }, at + 5 + j * 0.3);
          tl.fromTo(q(`.lit-${r.node}`), { opacity: 0, attr: { r: 6 } }, { opacity: 1, attr: { r: 13 }, duration: 0.8, immediateRender: false }, at + 5 + j * 0.3);
          tl.to(q(`${el} .root-light`), { strokeDashoffset: 7, duration: 2.2, ease: "power1.out" }, at + 5.8 + j * 0.3);
          tl.set(q(`${el} .root-light`), { opacity: 0 }, at + 8 + j * 0.3);
          tl.to(q(`.node-${r.node}`), { fill: INK, fillOpacity: base, scale: 1, duration: 1 }, at + 9);
          tl.to(q(`.lit-${r.node}`), { opacity: 0, duration: 1 }, at + 9);
          tl.to(q(`${el} .root-line`), { strokeOpacity: 0.2, duration: 1 }, at + 9);
          j++;
        });
        tl.to(q(`.tile-check-${k}`), { opacity: 1, duration: 0.6 }, at + 8.6);
        tl.to(q(`.tile-box-${k}`), { borderColor: ink(0.16), duration: 1 }, at + 9);
        tl.to(q(`.tile-glow-${k}`), { opacity: 0, duration: 1 }, at + 9);
      });

      /* 3. the dashboard settles on top; each tile's work pulses up to a card */
      tl.to(q(".stack-cap-1"), { opacity: 0, y: -18, duration: 2 }, D0);
      tl.to(q(".stack-cap-2"), { opacity: 1, y: 0, duration: 2 }, D0 + 2);
      tl.to(q(".dash-group"), { z: Z_DASH, opacity: 1, duration: 8, ease: "power3.out" }, D0 + 1);
      TILES.forEach((_, k) => {
        const at = DOCK_START + k * DOCK_STEP;
        const el = `.dock-${k}`;
        tl.to(q(`.tile-glow-${k}`), { opacity: 1, duration: 0.6 }, at);
        tl.fromTo(q(`${el} .root-line`), { strokeDashoffset: -100 }, { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut", immediateRender: false }, at);
        tl.set(q(`${el} .root-light`), { opacity: 1 }, at + 1);
        tl.fromTo(q(`${el} .root-light`), { strokeDashoffset: -93 }, { strokeDashoffset: 7, duration: 2, ease: "power1.inOut", immediateRender: false }, at + 1);
        tl.set(q(`${el} .root-light`), { opacity: 0 }, at + 3);
        tl.to(q(`.dash-pill-${k}`), { fill: FERN, duration: 0.5 }, at + 2.9);
        tl.fromTo(
          q(`.dash-ping-${k}`),
          { opacity: 0.9, scale: 1, transformOrigin: "50% 50%" },
          { opacity: 0, scale: 1.6, duration: 1.4, ease: "power1.out", immediateRender: false },
          at + 2.9,
        );
        tl.to(q(`${el} .root-line`), { strokeOpacity: 0, duration: 1 }, at + 3.6);
        tl.to(q(`.tile-glow-${k}`), { opacity: 0, duration: 1 }, at + 3.6);
      });

      /* 4. the layers close into one system, and the camera comes round */
      tl.to(q(".stack-cap-2"), { opacity: 0, y: -18, duration: 2 }, M0);
      tl.to(q(".stack-cap-3"), { opacity: 1, y: 0, duration: 2 }, M0 + 2);
      tl.to(q(".root, .dock"), { opacity: 0, duration: 2 }, M0);
      /* the lower layers keep their spacing under the dashboard as it comes
         down, fading as they go, so nothing ever passes over its face */
      tl.to(q(".agents-group"), { z: Z_AGENTS - Z_DASH, duration: 14, ease: "power2.inOut" }, M0 + 1);
      tl.to(q(".core-group"), { z: -Z_DASH, duration: 14, ease: "power2.inOut" }, M0 + 1);
      tl.to(q(".agents-group, .core-group"), { opacity: 0, duration: 9, ease: "power1.in" }, M0 + 1);
      tl.to(q(".tilt"), { rotationX: 0, y: 0, duration: 14, ease: "power2.inOut" }, M0 + 1);
      tl.to(q(".spin"), { rotation: 0, duration: 14, ease: "power2.inOut" }, M0 + 1);
      tl.to(q(".dash-group"), { z: 0, scale: 1.3, duration: 14, ease: "power2.inOut" }, M0 + 1);
      tl.to({}, { duration: END - (M0 + 15) }, M0 + 15);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="stack-scroll" style={{ "--stack-units": END } as CSSProperties}>
      <div className={`stack-frame ${CONTAINER}`}>
        <div className="stack-caps">
          {CAPTIONS.map((c, i) => (
            <div key={c.label} className={`stack-cap stack-cap-${i} max-w-md`}>
              <p className="type-label text-fern-deep">{c.label}</p>
              <h3 className="type-h2 mt-3 text-ink">{tie(c.title)}</h3>
              <p className="type-text mt-4 text-ink/80">{tie(c.body)}</p>
              {c.legend && <Legend />}
            </div>
          ))}
        </div>

        <div className="stack-stage" aria-hidden>
          <Camera>
            {/* the Core */}
            <div className="core-group absolute inset-0" style={d3}>
              <div className={`core-plate ${plate} border border-ink/12 bg-parchment`}>
                <CoreArt />
              </div>
              {ARRIVALS.map((idx, i) => (
                <div
                  key={idx}
                  className={`piece piece-${idx} absolute flex items-center justify-center`}
                  style={{ left: POINTS[idx].x - 32, top: POINTS[idx].y - 32, width: 64, height: 64, opacity: 0 }}
                >
                  <div className="scale-[1.5]">
                    <PieceIcon kind={KINDS[i % KINDS.length]} />
                  </div>
                </div>
              ))}
            </div>

            {/* the work layer */}
            <div className="agents-group absolute inset-0" style={{ transform: `translateZ(${Z_AGENTS}px)`, ...d3 }}>
              <div className={`${plate} border border-ink/10 bg-parchment/50`} />
              <AgentTiles />
            </div>

            {ROOTS.map((r, i) => (
              <Standing key={i} className={`root root-${i}`} strand={r} shown={0.2} />
            ))}

            {/* the dashboard */}
            <div className="dash-group absolute inset-0" style={{ transform: `translateZ(${Z_DASH}px)`, ...d3 }}>
              <div className={`${plate} overflow-hidden border border-ink/12 bg-parchment`}>
                <DashArt />
              </div>
            </div>
          </Camera>

          <Camera over>
            {DOCKS.map((d, k) => (
              <Standing key={k} className={`dock dock-${k}`} strand={d} shown={0} />
            ))}
          </Camera>
        </div>
      </div>
    </section>
  );
}
