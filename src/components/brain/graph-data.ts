export type RGB = [number, number, number];
export type Density = "sparse" | "medium" | "dense";

export interface ClusterCfg {
  key: string; label: string; color: RGB;
  fx: number; fy: number; n: number; spread: number;
  dx: number; dy: number; ph: number;
}

// Locked in the look lab: five area-clusters pulled toward the middle.
export const CLUSTERS: ClusterCfg[] = [
  { key: "deals",      label: "Deals",      color: [61, 99, 61],    fx: 0.365, fy: 0.395, n: 10, spread: 0.108, dx: 0.11, dy: 0.14, ph: 0.3 },
  { key: "investors",  label: "Investors",  color: [61, 58, 52],    fx: 0.665, fy: 0.375, n: 9,  spread: 0.096, dx: 0.13, dy: 0.10, ph: 1.7 },
  { key: "people",     label: "People",     color: [184, 178, 167], fx: 0.360, fy: 0.640, n: 10, spread: 0.108, dx: 0.10, dy: 0.13, ph: 2.9 },
  { key: "meetings",   label: "Meetings",   color: [147, 179, 147], fx: 0.510, fy: 0.520, n: 13, spread: 0.120, dx: 0.14, dy: 0.11, ph: 4.1 },
  { key: "operations", label: "Operations", color: [78, 122, 78],   fx: 0.650, fy: 0.615, n: 10, spread: 0.108, dx: 0.12, dy: 0.15, ph: 5.2 },
];

const DENS: Record<Density, number> = { sparse: 0.7, medium: 1.1, dense: 1.85 };
export const CALM = 0.5;        // locked motion factor
export const DEPTH = 0.30;      // locked "minimal" depth
export const SEED = 424242;
export const STILL_W = 1000;
export const STILL_H = 560;

export interface GNode {
  id: number; ci: number; color: RGB; hub: boolean; note: boolean;
  offA: number; offR: number; z: number; r: number; ph: number; dir: number;
}
export interface GEdge { a: number; b: number; inter: boolean; }
export interface Graph { nodes: GNode[]; edges: GEdge[]; lit: GEdge[]; noteIndex: number; }

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildGraph(density: Density): Graph {
  const rnd = mulberry32(SEED);
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const lit: GEdge[] = [];
  const ids: number[][] = CLUSTERS.map(() => []);
  CLUSTERS.forEach((c, ci) => {
    const count = Math.max(6, Math.round(c.n * DENS[density]));
    const hubId = nodes.length;
    nodes.push({ id: hubId, ci, color: c.color, hub: true, note: false, offA: 0, offR: 0, z: 0.78, r: 9.5, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
    ids[ci].push(hubId);
    for (let i = 0; i < count; i++) {
      const id = nodes.length;
      nodes.push({ id, ci, color: c.color, hub: false, note: false, offA: rnd() * 6.28, offR: 0.4 + rnd() * 0.55, z: rnd(), r: 2.8 + rnd() * 2.6, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
      ids[ci].push(id);
    }
    const cl = ids[ci];
    for (let j = 1; j < cl.length; j++) {
      if (j <= 2 || rnd() < 0.5) edges.push({ a: cl[j], b: hubId, inter: false });
      else edges.push({ a: cl[j], b: cl[1 + Math.floor(rnd() * (j - 1))], inter: false });
    }
    for (let m = 0; m < 2 && cl.length > 5; m++) {
      const a = cl[1 + Math.floor(rnd() * (cl.length - 1))], b = cl[1 + Math.floor(rnd() * (cl.length - 1))];
      if (a !== b) edges.push({ a, b, inter: false });
    }
  });
  const byKey: Record<string, number> = {};
  CLUSTERS.forEach((c, ci) => (byKey[c.key] = ci));
  ([["deals", "meetings"], ["meetings", "operations"], ["people", "meetings"], ["investors", "operations"], ["deals", "people"], ["meetings", "investors"]] as const).forEach((p) => {
    const A = ids[byKey[p[0]]], B = ids[byKey[p[1]]];
    edges.push({ a: A[1 + Math.floor(rnd() * (A.length - 1))], b: B[1 + Math.floor(rnd() * (B.length - 1))], inter: true });
  });
  const opsCi = byKey["operations"];
  const noteIndex = nodes.length;
  nodes.push({ id: noteIndex, ci: opsCi, color: [78, 122, 78], hub: false, note: true, offA: -1.15, offR: 0.52, z: 0.97, r: 7.5, ph: 0, dir: 1 });
  const meet = ids[byKey["meetings"]], people = ids[byKey["people"]];
  lit.push({ a: noteIndex, b: ids[opsCi][0], inter: false });
  lit.push({ a: noteIndex, b: meet[Math.min(4, meet.length - 1)], inter: false });
  lit.push({ a: noteIndex, b: people[Math.min(3, people.length - 1)], inter: false });
  return { nodes, edges, lit, noteIndex };
}

export function clusterCenter(ci: number, W: number, H: number, t: number, motion: number) {
  const c = CLUSTERS[ci];
  const amp = Math.min(W, H) * 0.028 * motion;
  return { x: c.fx * W + Math.sin(t * c.dx + c.ph) * amp, y: c.fy * H + Math.cos(t * c.dy + c.ph * 1.3) * amp };
}
export function nodeHome(n: GNode, W: number, H: number, t: number, motion: number) {
  const c = CLUSTERS[n.ci];
  const MIN = Math.min(W, H);
  const cc = clusterCenter(n.ci, W, H, t, motion);
  const ang = n.offA + t * 0.03 * motion * n.dir;
  const rad = n.offR * c.spread * MIN;
  const wob = MIN * 0.02 * motion;
  return { x: cc.x + Math.cos(ang) * rad + Math.sin(t * 0.5 + n.ph) * wob, y: cc.y + Math.sin(ang) * rad + Math.cos(t * 0.42 + n.ph) * wob };
}
// Settled (t=0) position; used by the still and as the canvas spring home base.
export function settled(n: GNode, W: number, H: number) { return nodeHome(n, W, H, 0, CALM); }

export function curveControl(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  const off = Math.min(24, len * 0.09), nx = -dy / len, ny = dx / len;
  return { mx: (ax + bx) / 2 + nx * off, my: (ay + by) / 2 + ny * off };
}
export function nodeSize(n: GNode) { return n.r * (1 - DEPTH * 0.5 + DEPTH * n.z); }
export function nodeAlpha(n: GNode) { return n.hub ? 0.95 : 0.5 + 0.5 * n.z; }
