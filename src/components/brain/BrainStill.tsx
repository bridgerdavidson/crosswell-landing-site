import { buildGraph, settled, curveControl, nodeSize, nodeAlpha, STILL_W, STILL_H, type GNode } from "./graph-data";

function rgb([r, g, b]: [number, number, number]) {
  return `rgb(${r},${g},${b})`;
}

// Settled radial brain with the note already an ordinary node (it looks like it
// never entered). This is the no-JS / reduced-motion fallback and the base layer
// the canvas hides when it runs.
export default function BrainStill() {
  const g = buildGraph();
  const pos = new Map<number, { x: number; y: number }>();
  g.nodes.forEach((n) => pos.set(n.id, settled(n, STILL_W, STILL_H)));
  const p = (id: number) => pos.get(id)!;
  const core = g.nodes[g.coreIndex];
  const cp = p(core.id);
  const note = g.nodes[g.noteIndex];
  const np = p(note.id);

  return (
    <svg
      className="brain-still"
      viewBox={`0 0 ${STILL_W} ${STILL_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* edges */}
      {g.edges.map((e, i) => {
        const a = p(e.a), b = p(e.b);
        const { mx, my } = curveControl(a.x, a.y, b.x, b.y);
        const col = e.kind === "ring" ? "184,178,167" : g.nodes[e.a].color.join(",");
        const op = e.kind === "ring" ? 0.2 : 0.2;
        return <path key={`e${i}`} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke={`rgba(${col},${op})`} strokeWidth={e.kind === "spoke" ? 0.8 : 0.7} />;
      })}
      {/* ordinary nodes (skip core + note; drawn last) */}
      {g.nodes.filter((n) => !n.note && !n.core).map((n: GNode) => {
        const c = p(n.id), s = nodeSize(n);
        return (
          <g key={n.id}>
            {n.hub && <circle cx={c.x} cy={c.y} r={s + 4} fill="none" stroke={`rgba(${n.color.join(",")},0.3)`} strokeWidth={1.1} />}
            <circle cx={c.x} cy={c.y} r={s} fill={rgb(n.color)} fillOpacity={nodeAlpha(n)} />
          </g>
        );
      })}
      {/* the core */}
      <circle cx={cp.x} cy={cp.y} r={nodeSize(core) + 5} fill="none" stroke={`rgba(${core.color.join(",")},0.36)`} strokeWidth={1.3} />
      <circle cx={cp.x} cy={cp.y} r={nodeSize(core)} fill={rgb(core.color)} />
      {/* the settled note: an ordinary fern node (matches the live settled radius) */}
      <circle cx={np.x} cy={np.y} r={5.5} fill="rgb(61,99,61)" />
    </svg>
  );
}
