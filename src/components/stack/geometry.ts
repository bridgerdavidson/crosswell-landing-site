/* The stack's geometry and timing: the Core's points, the three tiles of
   the work layer, the dashboard's skeleton, and the scroll's beats in
   timeline units. Every point comes from a fixed seed, so the server and
   the client draw the same stack. */

export const W = 560;
export const H = 360;
export const Z_AGENTS = 170;
export const Z_DASH = 340;
/* the roots start just under a tile, so their first light never shows
   through its face */
export const ROOT_TOP = Z_AGENTS - 6;
/* the camera: the plates turned 40 and tipped back 62, lowered 110 so the
   stack sits in the middle of its stage */
export const TILT = 62;
export const SPIN = -40;
export const LOWER = 110;

/* the palette's fern, ink, parchment, and ivory, as values a tween can
   cross between */
export const FERN = "#4e7a4e";
export const INK = "#1a1915";
export const PAPER = "#faf8f2";
export const IVORY = "#f1eee6";
export const ink = (a: number) => `rgba(26,25,21,${a})`;
export const fern = (a: number) => `rgba(78,122,78,${a})`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type P = { x: number; y: number };
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
/* two places is plenty for a drawing, and keeps the server's and the
   browser's style strings identical */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------- the Core ---------- */

/* every point is something the company knows */
export const POINTS: P[] = (() => {
  const r = rng(11);
  const out: P[] = [];
  let guard = 0;
  while (out.length < 30 && guard++ < 4000) {
    const p = { x: Math.round(44 + r() * (W - 88)), y: Math.round(44 + r() * (H - 88)) };
    if (out.every((n) => dist(n, p) > 58)) out.push(p);
  }
  return out;
})();

/* the sixteen most spread-out points arrive as things (a farthest-point pick) */
export const ARRIVALS: number[] = (() => {
  const chosen = [0];
  while (chosen.length < 16) {
    let best = -1;
    let bestD = -1;
    POINTS.forEach((p, i) => {
      if (chosen.includes(i)) return;
      const d = Math.min(...chosen.map((c) => dist(p, POINTS[c])));
      if (d > bestD) {
        bestD = d;
        best = i;
      }
    });
    chosen.push(best);
  }
  return chosen;
})();
export const IS_ARRIVAL = new Set(ARRIVALS);

/* every other point is a detail sorted out of the nearest arrival */
export const PARENT: number[] = POINTS.map((p, i) =>
  IS_ARRIVAL.has(i) ? i : ARRIVALS.reduce((a, b) => (dist(p, POINTS[a]) < dist(p, POINTS[b]) ? a : b)),
);

export const THREADS: { a: number; b: number; len: number }[] = (() => {
  const seen = new Set<string>();
  const out: { a: number; b: number; len: number }[] = [];
  POINTS.forEach((n, i) => {
    POINTS.map((m, j) => ({ j, d: dist(n, m) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ j, d }) => {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push({ a: i, b: j, len: Math.ceil(d) });
        }
      });
  });
  return out;
})();

export const KINDS = ["mail", "doc", "sheet", "meeting", "calendar", "chat"] as const;
export type Kind = (typeof KINDS)[number];

/* the Core's timing, in timeline units: things land one by one at uneven
   intervals and stay; once the last has landed they turn into points in
   an uneven order, details spring out of them, and the threads draw in
   as both of their ends exist */
export const CORE_T = (() => {
  const r = rng(5);
  const shuffle = (a: number[]) => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const land: Record<number, number> = {};
  shuffle(ARRIVALS).forEach((idx, i) => (land[idx] = 4 + i * 0.85 + r() * 0.6));
  const lastLanded = Math.max(...Object.values(land)) + 2.6;
  const turn: Record<number, number> = {};
  shuffle(ARRIVALS).forEach((idx, i) => (turn[idx] = lastLanded + 2 + i * 0.5 + r() * 0.4));
  const live: number[] = POINTS.map((_, i) => (IS_ARRIVAL.has(i) ? turn[i] + 0.9 : turn[PARENT[i]] + 1.8));
  const threadAt = THREADS.map((t) => Math.max(live[t.a], live[t.b]) + 0.6);
  const end = Math.max(...threadAt) + 2.2;
  return { land, turn, live, threadAt, end };
})();


/* ---------- the work layer: three tiles ---------- */

export const TILE = 92;
export type TileKind = "agent" | "automation" | "workflow";
export const TILES: (P & { kind: TileKind })[] = [
  { x: 132, y: 124, kind: "agent" },
  { x: 300, y: 250, kind: "automation" },
  /* toward the front of its layer, clear of the dashboard's footprint */
  { x: 452, y: 214, kind: "workflow" },
];

/* each tile reaches down to the three points nearest it */
const NEAREST: { tile: number; node: number }[] = TILES.flatMap((t, k) =>
  POINTS.map((p, i) => ({ i, d: dist(t, p) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(({ i }) => ({ tile: k, node: i })),
);
export const LIT = [...new Set(NEAREST.map((r) => r.node))];

/* ---------- the strands between layers ---------- */

type V = [number, number, number];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const times = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const unit = (a: V): V => times(a, 1 / Math.hypot(...a));
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const r4 = (n: number) => Math.round(n * 10000) / 10000;

/* the direction toward the reader in the plates' own space: the camera's
   tip (rotateX) and turn (rotate) undone */
const TOWARD: V = (() => {
  const t = (TILT * Math.PI) / 180;
  const s = (-SPIN * Math.PI) / 180;
  return [-Math.sin(t) * Math.sin(s), Math.sin(t) * Math.cos(s), Math.cos(t)];
})();

/* A strand runs from a top point down to a bottom point on a lower layer.
   It is drawn in the one plane that holds both ends and turns most toward
   the reader, so no strand is ever seen edge-on; the div's y axis runs
   along the strand, its x axis across it in that plane. The S-curve
   leaves its top and meets its bottom travelling straight down. */
export type Strand = { transform: string; d: string };
function strand(top: V, bottom: V): Strand {
  const run = sub(bottom, top);
  const L = Math.hypot(...run);
  const along = times(run, 1 / L);
  const facing = unit(sub(TOWARD, times(along, dot(TOWARD, along))));
  const across = cross(facing, along);
  const m = [...across, 0, ...along, 0, ...facing, 0, ...top, 1].map(r4);
  /* straight down, in the strand's own axes; the curve's handles are held
     short enough that it never dips through the layer below or rises
     through the one above (the handles' drop is k times the share of
     "down" that lies in the plane) */
  const inPlane = 1 - facing[2] * facing[2];
  const k = Math.min(L * 0.5, (0.4 * (top[2] - bottom[2])) / inPlane);
  const dx = -across[2] * k;
  const dy = -along[2] * k;
  const d = `M0 0 C${r2(dx)} ${r2(dy)} ${r2(-dx)} ${r2(L - dy)} 0 ${r2(L)}`;
  return { transform: `matrix3d(${m.join(",")})`, d };
}

/* ---------- the dashboard ---------- */

/* one inset (24) on every edge: a 40 top bar, a 120 rail, and the main
   column from 144 to 536, its rows on the rail's first line (64) */
export const D = {
  pad: 24,
  bar: 40,
  rail: 120,
  x0: 144,
  x1: 536,
  tileY: 110,
  tileH: 48,
  gap: 12,
  labelY: 178,
  cardY: 196,
  cardH: 40,
  cardGap: 10,
};
export const CARD_W = D.x1 - D.x0;
export const slotTop = (k: number) => D.cardY + k * (D.cardH + D.cardGap);

/* each tile's line up to its card's button on the dashboard */
const PILLS: P[] = [0, 1, 2].map((k) => ({ x: D.x1 - 12 - 30, y: slotTop(k) + D.cardH / 2 }));
export const DOCKS: Strand[] = TILES.map((t, k) => strand([PILLS[k].x, PILLS[k].y, Z_DASH], [t.x, t.y, Z_AGENTS]));

/* each tile's roots, from just under the tile to its three nearest points */
export const ROOTS: ({ tile: number; node: number } & Strand)[] = NEAREST.map((r) => ({
  ...r,
  ...strand([TILES[r.tile].x, TILES[r.tile].y, ROOT_TOP], [POINTS[r.node].x, POINTS[r.node].y, 0]),
}));

/* ---------- the scroll's beats, in timeline units ---------- */

/* 1 the Core lands and connects, 2 the tiles work one at a time, 3 the
   dashboard settles and each tile's work pulses up to a card, 4 the
   layers close and the camera comes round to the dashboard */
export const B = CORE_T.end + 2;
export const AG_START = B + 10;
export const AG_STEP = 11;
export const D0 = AG_START + TILES.length * AG_STEP + 1;
export const DOCK_START = D0 + 10;
export const DOCK_STEP = 5;
export const M0 = DOCK_START + TILES.length * DOCK_STEP + 2;
export const END = M0 + 19;
