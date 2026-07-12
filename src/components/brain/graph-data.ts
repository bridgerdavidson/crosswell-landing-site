export type RGB = [number, number, number];
export type EdgeKind = "spoke" | "in" | "ring" | "note";

// v3 radial brain: a deep-fern core at the center, five area-clusters in a ring
// around it, satellites radiating and meshed so the whole thing reads as one
// filled disc (not five spokes). Layout is a pure function of dims + time, so
// the SSR still and the live canvas agree exactly.
export interface Area {
  key: string;
  label: string;
  color: RGB;
  ang: number; // seat angle on the ring (radians)
  n: number; // satellite count
}

export const AREAS: Area[] = [
  { key: "operations", label: "Operations", color: [78, 122, 78], ang: -Math.PI / 2, n: 18 },
  { key: "deals", label: "Deals", color: [61, 99, 61], ang: -Math.PI / 2 + 1.256, n: 18 },
  { key: "investors", label: "Investors", color: [61, 58, 52], ang: -Math.PI / 2 + 2.513, n: 15 },
  { key: "people", label: "People", color: [184, 178, 167], ang: -Math.PI / 2 + 3.77, n: 18 },
  { key: "meetings", label: "Meetings", color: [147, 179, 147], ang: -Math.PI / 2 + 5.026, n: 20 },
];

export const SEED = 424242;
export const STILL_W = 1000;
export const STILL_H = 640;
export const RING = 0.235; // cluster ring radius as a fraction of MIN(W,H)
export const SPREAD = 0.165; // satellite spread as a fraction of MIN(W,H)

export interface GNode {
  id: number;
  ci: number; // area index, or -1 for core / inner / note
  color: RGB;
  core?: boolean;
  inner?: boolean; // the dense inner halo around the core
  hub?: boolean;
  note?: boolean; // the just-filed memory
  z: number;
  r: number;
  ph: number;
  dir: number;
  ang?: number; // orbit seed (inner + satellites)
  radK?: number; // orbit radius seed (inner + satellites)
  areaIndex?: number; // which area this hub anchors
}
export interface GEdge {
  a: number;
  b: number;
  kind: EdgeKind;
}
export interface Graph {
  nodes: GNode[];
  edges: GEdge[];
  coreIndex: number;
  noteIndex: number;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildGraph(): Graph {
  const rnd = mulberry32(SEED);
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];

  const coreIndex = 0;
  nodes.push({ id: 0, ci: -1, color: [61, 99, 61], core: true, hub: true, z: 0.85, r: 11, ph: 0, dir: 1 });

  // inner halo: a dozen small nodes orbiting close to the core so the middle
  // reads dense rather than a bare hub.
  const inner: number[] = [];
  for (let i = 0; i < 11; i++) {
    const id = nodes.length;
    nodes.push({ id, ci: -1, color: [61, 99, 61], inner: true, ang: rnd() * 6.28, radK: 0.05 + rnd() * 0.08, z: rnd(), r: 2.6 + rnd() * 2, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
    inner.push(id);
  }

  const areaHub: number[] = [];
  const areaSats: number[][] = [];
  AREAS.forEach((a, ci) => {
    const hubId = nodes.length;
    nodes.push({ id: hubId, ci, color: a.color, hub: true, areaIndex: ci, z: 0.78, r: 8, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
    areaHub[ci] = hubId;
    const sats: number[] = [];
    for (let i = 0; i < a.n; i++) {
      const id = nodes.length;
      nodes.push({ id, ci, color: a.color, ang: rnd() * 6.28, radK: 0.35 + rnd() * 0.72, z: rnd(), r: 2.4 + rnd() * 2.3, ph: rnd() * 6.28, dir: rnd() < 0.5 ? -1 : 1 });
      sats.push(id);
    }
    areaSats[ci] = sats;
    edges.push({ a: hubId, b: coreIndex, kind: "spoke" });
    // satellites chain to siblings (fewer straight-to-hub) so it meshes
    for (let j = 0; j < sats.length; j++) {
      if (j < 2 || rnd() < 0.3) edges.push({ a: sats[j], b: hubId, kind: "in" });
      else edges.push({ a: sats[j], b: sats[Math.floor(rnd() * j)], kind: "in" });
    }
    // extra intra-cluster mesh links
    for (let m = 0; m < 4 && sats.length > 4; m++) {
      const s1 = sats[Math.floor(rnd() * sats.length)];
      const s2 = sats[Math.floor(rnd() * sats.length)];
      if (s1 !== s2) edges.push({ a: s1, b: s2, kind: "in" });
    }
  });

  // rim links between neighboring clusters so the ring closes into a disc
  for (let k = 0; k < AREAS.length; k++) {
    const A = k;
    const B = (k + 1) % AREAS.length;
    edges.push({ a: areaHub[A], b: areaHub[B], kind: "ring" });
    for (let rr = 0; rr < 3; rr++) {
      edges.push({ a: areaSats[A][Math.floor(rnd() * areaSats[A].length)], b: areaSats[B][Math.floor(rnd() * areaSats[B].length)], kind: "ring" });
    }
  }

  // the new memory node: drops near the center; ordinary thin edges to the core
  // plus a few nearby nodes (it settles in looking like it was always there).
  const noteIndex = nodes.length;
  nodes.push({ id: noteIndex, ci: -1, color: [61, 99, 61], note: true, z: 0.9, r: 5.5, ph: 0, dir: 1 });
  edges.push({ a: noteIndex, b: coreIndex, kind: "note" });
  edges.push({ a: noteIndex, b: inner[0], kind: "note" });
  edges.push({ a: noteIndex, b: inner[3], kind: "note" });
  edges.push({ a: noteIndex, b: inner[6], kind: "note" });
  edges.push({ a: noteIndex, b: areaSats[0][2], kind: "note" });

  return { nodes, edges, coreIndex, noteIndex };
}

// ---- layout: pure functions of (node, W, H, t) ----
export function areaCenter(ci: number, W: number, H: number, t: number) {
  const MIN = Math.min(W, H);
  const a = AREAS[ci];
  const d = 0.008 * MIN * Math.sin(t * 0.16 + ci);
  return { x: W * 0.5 + Math.cos(a.ang) * (RING * MIN + d), y: H * 0.5 + Math.sin(a.ang) * (RING * MIN + d) };
}

// soft-drop target for the note: dense, offset down-and-to-the-side so it clears the core
export function landPos(W: number, H: number) {
  const MIN = Math.min(W, H);
  return { x: W * 0.5 + 0.11 * MIN, y: H * 0.5 + 0.05 * H };
}

// readable spot where the card is read and converts into the big node
export function cardCenter(W: number, H: number) {
  return { x: W * 0.5, y: H * 0.35 };
}

export function nodeHome(n: GNode, W: number, H: number, t: number) {
  const MIN = Math.min(W, H);
  const cx = W * 0.5;
  const cy = H * 0.5;
  if (n.core) return { x: cx + Math.sin(t * 0.12) * 3, y: cy + Math.cos(t * 0.1) * 3 };
  if (n.inner) {
    const ang = n.ang! + t * 0.04 * n.dir;
    return { x: cx + Math.cos(ang) * n.radK! * MIN, y: cy + Math.sin(ang) * n.radK! * MIN };
  }
  if (n.hub) return areaCenter(n.areaIndex!, W, H, t);
  if (n.note) return landPos(W, H);
  const c = areaCenter(n.ci, W, H, t);
  const ang = n.ang! + t * 0.03 * n.dir;
  const rad = n.radK! * SPREAD * MIN;
  const wob = MIN * 0.008 * Math.sin(t * 0.4 + n.ph);
  return { x: c.x + Math.cos(ang) * rad + wob, y: c.y + Math.sin(ang) * rad + Math.cos(t * 0.36 + n.ph) * wob };
}

// settled (t=0) position; used by the still and the note's spring home.
export function settled(n: GNode, W: number, H: number) {
  return nodeHome(n, W, H, 0);
}

export function curveControl(ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const off = Math.min(18, len * 0.07);
  const nx = -dy / len;
  const ny = dx / len;
  return { mx: (ax + bx) / 2 + nx * off, my: (ay + by) / 2 + ny * off };
}
export function nodeSize(n: GNode) {
  return n.r * (0.85 + 0.3 * n.z);
}
export function nodeAlpha(n: GNode) {
  return n.hub ? 0.95 : 0.5 + 0.5 * n.z;
}
