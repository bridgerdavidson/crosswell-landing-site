import {
  buildGraph, CLUSTERS, settled, curveControl, nodeSize, nodeAlpha,
  STILL_W, STILL_H, type GNode,
} from "./graph-data";

function rgb([r, g, b]: [number, number, number]) { return `rgb(${r},${g},${b})`; }

// Settled brain with the note already connected. This is the no-JS /
// reduced-motion fallback and the base layer the canvas hides when it runs.
export default function BrainStill() {
  const g = buildGraph("dense");
  const pos = new Map<number, { x: number; y: number }>();
  g.nodes.forEach((n) => pos.set(n.id, settled(n, STILL_W, STILL_H)));
  const p = (id: number) => pos.get(id)!;
  const note = g.nodes[g.noteIndex];
  const np = p(note.id);

  return (
    <svg
      className="brain-still"
      viewBox={`0 0 ${STILL_W} ${STILL_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Illustrative: the firm's knowledge as a connected graph across deals, people, meetings, operations, and investors, with a newly filed note linked in."
    >
      {/* edges */}
      {g.edges.map((e, i) => {
        const a = p(e.a), b = p(e.b);
        const { mx, my } = curveControl(a.x, a.y, b.x, b.y);
        const col = e.inter ? "184,178,167" : g.nodes[e.a].color.join(",");
        return <path key={`e${i}`} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke={`rgba(${col},${e.inter ? 0.24 : 0.22})`} strokeWidth={e.inter ? 0.7 : 0.8} />;
      })}
      {/* lit threads from the note */}
      {g.lit.map((e, i) => {
        const b = p(e.b);
        return <line key={`l${i}`} x1={np.x} y1={np.y} x2={b.x} y2={b.y} stroke="rgba(78,122,78,0.85)" strokeWidth={1.7} />;
      })}
      {/* ordinary nodes (skip the note; drawn last) */}
      {g.nodes.filter((n) => !n.note).map((n: GNode) => {
        const c = p(n.id), s = nodeSize(n);
        return (
          <g key={n.id}>
            {n.hub && <circle cx={c.x} cy={c.y} r={s + 5} fill="none" stroke={`rgba(${n.color.join(",")},0.34)`} strokeWidth={1.3} />}
            <circle cx={c.x} cy={c.y} r={s} fill={rgb(n.color)} fillOpacity={nodeAlpha(n)} />
          </g>
        );
      })}
      {/* the just-added note */}
      <circle cx={np.x} cy={np.y} r={13} fill="none" stroke="rgba(78,122,78,0.55)" strokeWidth={1.4} />
      <circle cx={np.x} cy={np.y} r={9.5} fill="#f1eee6" />
      <circle cx={np.x} cy={np.y} r={7.5} fill="rgb(78,122,78)" />
    </svg>
  );
}
