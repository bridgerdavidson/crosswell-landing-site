import type { CSSProperties } from "react";
import {
  ARRIVALS,
  CARD_W,
  D,
  FERN,
  H,
  INK,
  IS_ARRIVAL,
  IVORY,
  LIT,
  PAPER,
  POINTS,
  THREADS,
  TILE,
  TILES,
  W,
  ink,
  slotTop,
  type Kind,
  type TileKind,
} from "./geometry";

/* The stack's drawings. Each renders its finished state (the Core
   connected, the tiles done, the cards' buttons green), which is what
   no-JS and reduced motion show; the scroll timeline sets the starting
   state over it. */

/* a thing the company knows, lying flat on the Core */
export function PieceIcon({ kind }: { kind: Kind }) {
  const line = { stroke: INK, strokeOpacity: 0.55, strokeWidth: 1.6, fill: "none", strokeLinecap: "round" } as const;
  const card = { fill: IVORY, stroke: INK, strokeOpacity: 0.45, strokeWidth: 1.4 } as const;
  switch (kind) {
    case "mail":
      return (
        <svg viewBox="0 0 40 30" width="40" height="30" overflow="visible">
          <rect x="1" y="1" width="38" height="28" rx="4" {...card} />
          <path d="M3 4 L20 17 L37 4" {...line} />
        </svg>
      );
    case "sheet":
      return (
        <svg viewBox="0 0 38 34" width="38" height="34" overflow="visible">
          <rect x="1" y="1" width="36" height="32" rx="4" {...card} />
          <rect x="1.7" y="1.7" width="34.6" height="8" rx="3" fill={FERN} fillOpacity="0.22" />
          <path d="M1 10 H37 M1 18 H37 M1 26 H37 M13 1 V33 M25 1 V33" {...line} strokeOpacity={0.3} strokeWidth={1.1} />
        </svg>
      );
    case "meeting":
      return (
        <svg viewBox="0 0 38 34" width="38" height="34" overflow="visible">
          <rect x="1" y="1" width="36" height="32" rx="6" {...card} />
          {[8, 12.5, 17, 21.5, 26, 30.5].map((x, i) => {
            const h = [4, 8, 11, 6, 9, 4][i];
            return <line key={x} x1={x} x2={x} y1={17 - h} y2={17 + h} {...line} stroke={FERN} strokeOpacity={0.9} strokeWidth={2.2} />;
          })}
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" overflow="visible">
          <rect x="1" y="4" width="34" height="31" rx="5" {...card} />
          <path d="M1 12 H35" {...line} strokeOpacity={0.35} />
          <path d="M10 1 V7 M26 1 V7" {...line} />
          <rect x="21" y="19" width="8" height="8" rx="2" fill={FERN} />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 38 34" width="38" height="34" overflow="visible">
          <path d="M6 1 H32 A5 5 0 0 1 37 6 V21 A5 5 0 0 1 32 26 H15 L8 33 V26 H6 A5 5 0 0 1 1 21 V6 A5 5 0 0 1 6 1 Z" {...card} />
          <path d="M9 10 H29 M9 17 H22" {...line} strokeOpacity={0.45} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 38" width="32" height="38" overflow="visible">
          <path d="M5 1 H21 L31 11 V33 A4 4 0 0 1 27 37 H5 A4 4 0 0 1 1 33 V5 A4 4 0 0 1 5 1 Z" {...card} />
          <path d="M21 1 V11 H31" {...line} strokeOpacity={0.35} strokeWidth={1.2} />
          <path d="M8 19 H24 M8 25 H24 M8 31 H17" {...line} strokeOpacity={0.4} />
        </svg>
      );
  }
}

/* the Core's points and threads, with the rings the scroll lights */
export function CoreArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0 overflow-visible">
      {THREADS.map((t, i) => (
        <line
          key={i}
          className={`thread thread-${i}`}
          data-len={t.len}
          x1={POINTS[t.a].x}
          y1={POINTS[t.a].y}
          x2={POINTS[t.b].x}
          y2={POINTS[t.b].y}
          stroke={INK}
          strokeOpacity={0.22}
          strokeWidth={1}
          strokeDasharray={t.len}
          strokeDashoffset={0}
        />
      ))}
      {ARRIVALS.map((idx) => (
        <circle key={`p${idx}`} className={`pulse pulse-${idx}`} cx={POINTS[idx].x} cy={POINTS[idx].y} r={5} fill="none" stroke={FERN} strokeWidth={1.5} opacity={0} />
      ))}
      {LIT.map((idx) => (
        <circle key={`l${idx}`} className={`lit lit-${idx}`} cx={POINTS[idx].x} cy={POINTS[idx].y} r={12} fill={FERN} fillOpacity={0.14} stroke={FERN} strokeOpacity={0.6} opacity={0} />
      ))}
      {POINTS.map((n, i) => (
        <circle
          key={i}
          className={`node node-${i}`}
          cx={n.x}
          cy={n.y}
          r={IS_ARRIVAL.has(i) ? 5 : 3.2}
          style={{ fill: INK, fillOpacity: IS_ARRIVAL.has(i) ? 0.78 : 0.5 }}
        />
      ))}
    </svg>
  );
}

export function TileGlyph({ kind, size = 28 }: { kind: TileKind; size?: number }) {
  const s = { fill: "none", stroke: INK, strokeOpacity: 0.7, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (kind === "automation")
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden>
        <path d="M22.5 11 A9.5 9.5 0 0 0 6 8.5" {...s} />
        <path d="M5.5 3.5 V9 H11" {...s} />
        <path d="M5.5 17 A9.5 9.5 0 0 0 22 19.5" {...s} />
        <path d="M22.5 24.5 V19 H17" {...s} />
      </svg>
    );
  if (kind === "workflow")
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden>
        <circle cx="5" cy="20" r="3" {...s} />
        <circle cx="14" cy="8" r="3" {...s} />
        <circle cx="23" cy="20" r="3" {...s} />
        <path d="M7 17.5 L12 10.5 M16 10.5 L21 17.5" {...s} />
      </svg>
    );
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden>
      <path d="M3.5 15 L7.5 5.5 H20.5 L24.5 15 V22.5 H3.5 Z" {...s} />
      <path d="M3.5 15 H9.5 L11.5 18 H16.5 L18.5 15 H24.5" {...s} />
    </svg>
  );
}

/* the tiles are HTML so their glyphs stay crisp; they lie in their plate */
export function AgentTiles() {
  return (
    <>
      {TILES.map((t, k) => (
        <div
          key={k}
          className={`tile tile-${k} absolute`}
          style={{ left: t.x - TILE / 2, top: t.y - TILE / 2, width: TILE, height: TILE }}
        >
          <div className={`tile-glow tile-glow-${k} absolute -inset-4 rounded-[30px] bg-fern/10 opacity-0`} />
          <div
            className={`tile-box tile-box-${k} relative flex h-full w-full items-center justify-center rounded-[22px] border-[1.5px] bg-parchment`}
            style={{ borderColor: ink(0.16) }}
          >
            <TileGlyph kind={t.kind} size={42} />
            <span className={`tile-check tile-check-${k} absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-fern`}>
              <svg viewBox="0 0 10 10" width="12" height="12" aria-hidden>
                <path d="M2 5.2 L4.2 7.2 L8 3" fill="none" stroke={PAPER} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

/* A line standing between two layers: its plane is turned toward its far
   end and stood up, so an S-curve runs from the top point down to the
   bottom point; a short bright dash is the light that travels it. The
   transform places it; the finished state shows the line at `shown`. */
export function Standing({
  className,
  width,
  height,
  transform,
  shown,
}: {
  className: string;
  width: number;
  height: number;
  transform: string;
  shown: number;
}) {
  const d = `M0 0 C0 ${height * 0.55} ${width} ${height * 0.45} ${width} ${height}`;
  const style: CSSProperties = { width, height, transform, transformOrigin: "0 0" };
  return (
    <div className={`${className} absolute top-0 left-0`} style={style}>
      <svg width={Math.max(width, 1)} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
        <path
          className="root-line"
          d={d}
          pathLength={100}
          fill="none"
          stroke={FERN}
          strokeWidth={1.4}
          strokeDasharray="100 100"
          style={{ strokeOpacity: shown, strokeDashoffset: shown ? 0 : 100 }}
        />
        <path className="root-light" d={d} pathLength={100} fill="none" stroke={FERN} strokeWidth={3.2} strokeLinecap="round" strokeDasharray="7 110" strokeDashoffset={7} opacity={0} />
      </svg>
    </div>
  );
}

/* the dashboard's skeleton: no words, only its shapes */
export function DashArt() {
  const tileW = (CARD_W - D.gap * 3) / 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" aria-hidden>
      <rect x={0} y={D.bar} width={D.rail} height={H - D.bar} fill={IVORY} />
      <line x1={0} x2={W} y1={D.bar} y2={D.bar} stroke={ink(0.08)} />
      <line x1={D.rail} x2={D.rail} y1={D.bar} y2={H} stroke={ink(0.08)} />
      <circle cx={D.pad + 6} cy={D.bar / 2} r={6} fill={FERN} />
      <rect x={D.pad + 18} y={D.bar / 2 - 4} width={64} height={8} rx={4} fill={ink(0.22)} />
      <circle cx={D.x1 - 9} cy={D.bar / 2} r={9} fill={ink(0.1)} />
      {[72, 58, 64, 50, 60].map((w, i) => (
        <rect key={i} x={D.pad} y={64 + i * 22} width={w} height={8} rx={4} fill={i === 0 ? "rgba(78,122,78,0.55)" : ink(0.14)} />
      ))}
      <rect x={D.x0} y={64} width={200} height={14} rx={5} fill={ink(0.7)} />
      <rect x={D.x0} y={88} width={280} height={8} rx={4} fill={ink(0.22)} />
      {[0, 1, 2, 3].map((i) => {
        const x = D.x0 + i * (tileW + D.gap);
        return (
          <g key={i}>
            <rect x={x} y={D.tileY} width={tileW} height={D.tileH} rx={8} fill={IVORY} stroke={ink(0.08)} />
            <rect x={x + 12} y={D.tileY + 12} width={36} height={10} rx={3} fill={ink(0.6)} />
            <rect x={x + 12} y={D.tileY + 30} width={52} height={6} rx={3} fill={ink(0.2)} />
          </g>
        );
      })}
      <rect x={D.x0} y={D.labelY} width={84} height={8} rx={4} fill={ink(0.4)} />
      {[0, 1, 2].map((k) => {
        const y = slotTop(k);
        return (
          <g key={k}>
            <rect x={D.x0} y={y} width={CARD_W} height={D.cardH} rx={8} fill={IVORY} stroke={ink(0.08)} />
            <rect x={D.x0 + 14} y={y + 11} width={118 - k * 16} height={8} rx={4} fill={ink(0.6)} />
            <rect x={D.x0 + 14} y={y + 25} width={220 - k * 24} height={6} rx={3} fill={ink(0.22)} />
            {/* the part that turns green when its tile's work arrives */}
            <rect className={`dash-pill dash-pill-${k}`} x={D.x1 - 12 - 60} y={y + 11} width={60} height={18} rx={9} style={{ fill: FERN }} />
            <rect className={`dash-ping dash-ping-${k}`} x={D.x1 - 12 - 60} y={y + 11} width={60} height={18} rx={9} fill="none" stroke={FERN} strokeWidth={1.5} opacity={0} />
          </g>
        );
      })}
    </svg>
  );
}

/* the key beside the work layer's caption, in the tiles' own shapes */
export function Legend() {
  const names: [TileKind, string][] = [
    ["agent", "Agent"],
    ["automation", "Automation"],
    ["workflow", "Workflow"],
  ];
  return (
    <ul className="type-caption mt-6 flex flex-wrap gap-x-6 gap-y-2 text-ink/70">
      {names.map(([kind, name]) => (
        <li key={kind} className="inline-flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-ink/15 bg-parchment">
            <TileGlyph kind={kind} size={16} />
          </span>
          {name}
        </li>
      ))}
    </ul>
  );
}
