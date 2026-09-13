import type { Tile as TileData } from "@/lib/saguaro";

type TileProps = TileData & { className?: string; "data-seq"?: string };

/**
 * A number tile. The number carries data-count and the sparkline's line
 * carries data-spark so a chapter's sequence can count it up and draw it;
 * without a sequence both are inert and the finished state renders.
 */
export function Tile({ label, value, note, spark, className = "", ...rest }: TileProps) {
  return (
    <div className={`product-tile ${className}`} {...rest}>
      <p className="product-label">{label}</p>
      <p className="product-num mt-2" data-count>
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
        <p className="product-label">{note}</p>
        {spark && <Sparkline points={spark} />}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 64;
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
        data-spark
        points={d}
        fill="none"
        stroke="var(--mark)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
