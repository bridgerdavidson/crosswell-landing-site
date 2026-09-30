import type { ChartSpec } from "@/lib/insights/types";

/** a round gridline step for four intervals */
export function niceStep(max: number): number {
  if (max <= 0) return 1;
  const raw = max / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const factor = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((f) => f * power >= raw) ?? 10;
  return Number((factor * power).toPrecision(6));
}

const num = (v: number) => String(Number(v.toFixed(2)));

type Frame = { width: number; height: number; left: number; right: number; top: number; bottom: number };
/* drawn at about 1:1 where they show: the wide one in the 620 text column
   from sm, the narrow one on a phone, so the 12px labels stay 12px */
const WIDE: Frame = { width: 620, height: 260, left: 44, right: 12, top: 28, bottom: 34 };
const NARROW: Frame = { width: 340, height: 240, left: 40, right: 8, top: 28, bottom: 34 };

function Plot({ chart, frame, className }: { chart: ChartSpec; frame: Frame; className: string }) {
  const { width, height, left, right, top, bottom } = frame;
  const step = niceStep(Math.max(...chart.data.map((d) => d.value)));
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const y = (v: number) => top + plotH - (v / (step * 4)) * plotH;
  const n = chart.data.length;
  const slot = plotW / n;
  const x = (i: number) =>
    chart.type === "line" ? left + 16 + (i / (n - 1)) * (plotW - 32) : left + slot * (i + 0.5);
  const value = (v: number) => `${num(v)}${chart.unit}`;
  const tick = (v: number) => (chart.unit.length <= 2 ? value(v) : num(v));
  const barW = slot * 0.56;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`${chart.title}: ${chart.data.map((d) => `${d.label}, ${value(d.value)}`).join("; ")}`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={left} x2={width - right} y1={y(step * i)} y2={y(step * i)} className="chart-grid" />
          <text x={left - 8} y={y(step * i) + 4} textAnchor="end" className="chart-axis">
            {tick(step * i)}
          </text>
        </g>
      ))}
      {chart.data.map((d, i) => (
        <text key={d.label} x={x(i)} y={height - 10} textAnchor="middle" className="chart-axis">
          {d.label}
        </text>
      ))}
      {chart.type === "line" ? (
        <>
          <polyline points={chart.data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ")} className="chart-line" />
          {chart.data.map((d, i) => (
            <circle key={d.label} cx={x(i)} cy={y(d.value)} r={4.5} className="chart-mark" />
          ))}
          {[0, n - 1].map((i) => (
            <text key={i} x={x(i)} y={y(chart.data[i].value) - 12} textAnchor="middle" className="chart-value">
              {value(chart.data[i].value)}
            </text>
          ))}
        </>
      ) : (
        chart.data.map((d, i) => (
          <g key={d.label}>
            <rect x={x(i) - barW / 2} y={y(d.value)} width={barW} height={top + plotH - y(d.value)} rx={3} className="chart-mark" />
            <text x={x(i)} y={y(d.value) - 8} textAnchor="middle" className="chart-value">
              {value(d.value)}
            </text>
          </g>
        ))
      )}
    </svg>
  );
}

/**
 * A post's chart, drawn at build as static SVG in the Fern palette: a fern
 * line or bars on hairline gridlines, the values labeled, the source under
 * it. Two drawings, one per width, so its labels never shrink to nothing on
 * a phone; CSS shows one.
 */
export default function Chart({ chart }: { chart: ChartSpec }) {
  return (
    <figure className="chart">
      <p className="chart-title">{chart.title}</p>
      <Plot chart={chart} frame={WIDE} className="hidden sm:block" />
      <Plot chart={chart} frame={NARROW} className="sm:hidden" />
      <figcaption>
        Source:{" "}
        <a href={chart.sourceUrl} target="_blank" rel="noopener noreferrer">
          {chart.source}
        </a>
      </figcaption>
    </figure>
  );
}
