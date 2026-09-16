import { FERN, INK, IVORY } from "./stack/geometry";

/*
 * How we start's two drawings, in the stack's hand (the same ink, the same
 * ivory cards, fern as the one accent), at 96 square beside each step's
 * name. Neither is an icon: each is the step itself, small.
 */

const card = { fill: IVORY, stroke: INK, strokeOpacity: 0.45, strokeWidth: 1.4 } as const;
const line = { stroke: INK, strokeOpacity: 0.55, strokeWidth: 1.6, fill: "none", strokeLinecap: "round" } as const;

/* the audit: three things the company knows, lying where they are, the
   route we walk between them, and the one place along it ringed, where the
   work drops what it knew; from the ring on, the route is drawn in fern */
export function AuditArt() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden overflow="visible">
      {/* the route between them, walked and mapped */}
      <path d="M36 25 C46 25 50 19 58 19" {...line} strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3 4" />
      <path d="M72 32 C72 42 68 46 63 49" {...line} strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3 4" />
      <path d="M61 52 C57 56 54 58 50 61" fill="none" stroke={FERN} strokeOpacity={0.9} strokeWidth={1.6} strokeLinecap="round" />
      {/* mail */}
      <rect x="6" y="14" width="30" height="22" rx="4" {...card} />
      <path d="M8 17 L21 27 L34 17" {...line} />
      {/* a sheet */}
      <rect x="58" y="6" width="28" height="26" rx="4" {...card} />
      <rect x="58.7" y="6.7" width="26.6" height="7" rx="3" fill={FERN} fillOpacity="0.22" />
      <path d="M58 15 H86 M58 22 H86 M58 29 H86 M70 6 V32" {...line} strokeOpacity={0.3} strokeWidth={1.1} />
      {/* a meeting */}
      <rect x="32" y="60" width="32" height="26" rx="6" {...card} />
      {[38, 43, 48, 53, 58].map((x, i) => {
        const h = [3, 7, 5, 9, 4][i];
        return <line key={x} x1={x} x2={x} y1={73 - h} y2={73 + h} stroke={FERN} strokeOpacity={0.9} strokeWidth={2.2} strokeLinecap="round" />;
      })}
      {/* where it gets dropped, found */}
      <circle cx="63" cy="49" r="6.5" fill={FERN} fillOpacity="0.14" stroke={FERN} strokeOpacity="0.7" strokeWidth="1.5" />
    </svg>
  );
}

/* onboarding: the stack from what we do, small and side on, installed and
   running. The Core plate at the bottom with its points joined, the work
   plate with three tiles on it, the dashboard on top with its one green
   light, ringed: it is on */
export function OnboardArt() {
  const plate = (dy: number) => `M16 ${52 + dy} L48 ${36 + dy} L80 ${52 + dy} L48 ${68 + dy} Z`;
  const tile = (cx: number, cy: number) => `M${cx - 7} ${cy} L${cx} ${cy - 3.5} L${cx + 7} ${cy} L${cx} ${cy + 3.5} Z`;
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden overflow="visible">
      {/* the Core */}
      <path d={plate(24)} {...card} />
      <path d="M36 76 L50 70 L60 80 L36 76" {...line} strokeOpacity={0.3} strokeWidth={1} />
      {[[36, 76], [50, 70], [60, 80]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill={FERN} />
      ))}
      {/* the work */}
      <path d={plate(0)} {...card} />
      {[[38, 53], [48, 47], [58, 53]].map(([x, y]) => (
        <path key={`${x}${y}`} d={tile(x, y)} fill={IVORY} stroke={INK} strokeOpacity={0.6} strokeWidth={1.2} />
      ))}
      {/* the dashboard, on */}
      <path d={plate(-24)} {...card} />
      <path d="M34 29 L46 23 M40 33 L52 27" {...line} strokeOpacity={0.4} strokeWidth={1.3} />
      <circle cx="60" cy="30" r="3.2" fill={FERN} />
      <circle cx="60" cy="30" r="7" fill="none" stroke={FERN} strokeOpacity="0.5" strokeWidth="1.2" />
    </svg>
  );
}
