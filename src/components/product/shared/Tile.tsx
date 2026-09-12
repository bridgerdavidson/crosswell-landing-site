import type { Tile as TileData } from "@/lib/saguaro";

export function Tile({ label, value, note, spark }: TileData) {
  return (
    <div className="product-tile">
      <p className="text-[12px] opacity-60">{label}</p>
      <p className="product-num mt-2">{value}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-[12px] opacity-55">{note}</p>
        {spark && <Sparkline points={spark} />}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 72;
  const h = 22;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((p, i) => {
      const x = ((i / (points.length - 1)) * w).toFixed(1);
      const y = (h - 1 - ((p - min) / (max - min || 1)) * (h - 2)).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="flex-none">
      <polyline
        points={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
