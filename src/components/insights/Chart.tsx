import type { ChartSpec } from "@/lib/insights/types";

/** a round gridline step for four intervals */
export function niceStep(max: number): number {
  if (max <= 0) return 1;
  const raw = max / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const factor = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((f) => f * power >= raw) ?? 10;
  return Number((factor * power).toPrecision(6));
}

/* a number the way the page prints one: at most two decimals, thousands grouped */
const num = (v: number) => Number(v.toFixed(2)).toLocaleString("en-US");

/* the sans at a size: an average glyph runs about 0.6em wide (the digits a
   little under, capitals a little over), the estimate the labels are laid
   out by, since nothing measures text at build */
const textWidth = (text: string, size: number) => text.length * size * 0.6;
/* the air a label keeps from its neighbour */
const GAP = 8;
const AXIS = 12;
const VALUE = 14;
const LINE = 14;

/**
 * Which of a run of labels to draw when they sit `pitch` apart: every k-th
 * so no label overprints its neighbour, the first and the last always (the
 * last wins over a neighbour that would crowd it), so a reader always has
 * the run's two ends. `widths` may stand in for the labels' text.
 */
export function thinLabels(labels: (string | number)[], pitch: number, size = AXIS): boolean[] {
  const n = labels.length;
  const widest = Math.max(...labels.map((l) => (typeof l === "number" ? l : textWidth(l, size)))) + GAP;
  const every = Math.max(1, Math.ceil(widest / pitch));
  return labels.map((_, i) => i === n - 1 || (i % every === 0 && n - 1 - i >= every));
}

/**
 * A bar's label on up to two lines: whole when it fits its slot, otherwise
 * broken at the space that leaves the two lines most even. A label with no
 * space, or one too long for two lines, still comes back and is thinned
 * with the rest.
 */
export function wrapLabel(label: string, pitch: number, size = AXIS): string[] {
  if (textWidth(label, size) + GAP <= pitch || !label.includes(" ")) return [label];
  const words = label.split(" ");
  let best: string[] = [label];
  let bestWidth = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const width = Math.max(...lines.map((l) => textWidth(l, size)));
    if (width < bestWidth) {
      best = lines;
      bestWidth = width;
    }
  }
  return best;
}

type Frame = { width: number; height: number; left: number; right: number; top: number; bottom: number };
/* drawn at about 1:1 where they show: the wide one in the 620 text column
   from sm, the narrow one on a phone, so the 12px labels stay 12px */
const WIDE: Frame = { width: 620, height: 260, left: 44, right: 12, top: 28, bottom: 34 };
const NARROW: Frame = { width: 340, height: 240, left: 40, right: 8, top: 28, bottom: 34 };

function Plot({ chart, frame, className }: { chart: ChartSpec; frame: Frame; className: string }) {
  const { width, height, top } = frame;
  const step = niceStep(Math.max(...chart.data.map((d) => d.value)));
  const n = chart.data.length;
  const bar = chart.type === "bar";
  const value = (v: number) => `${num(v)}${chart.unit}`;
  const tick = (v: number) => (chart.unit.length <= 2 ? value(v) : num(v));
  const ticks = [0, 1, 2, 3, 4].map((i) => tick(step * i));

  /* the margins fit what sits in them: the widest tick on the left (8 to
     the axis, 6 to the edge), and on the right the last label's overhang
     past its point (a line's last point sits 16 in; a bar's centre half a
     slot in), so no label is cut at the drawing's edge */
  const left = Math.max(frame.left, Math.max(...ticks.map((t) => textWidth(t, AXIS))) + 14);
  const labels = chart.data.map((d) => d.label);
  const pitch0 = bar ? (width - left - frame.right) / n : (width - left - frame.right - 32) / (n - 1);
  const lines = bar ? labels.map((l) => wrapLabel(l, pitch0)) : labels.map((l) => [l]);
  const half = (i: number) => Math.max(...lines[i].map((l) => textWidth(l, AXIS))) / 2;
  const lastOver = bar ? width - left - ((width - 4 - left - half(n - 1)) * n) / (n - 0.5) : half(n - 1) - 12;
  const right = Math.max(frame.right, Math.ceil(lastOver));
  const wrapped = lines.some((l) => l.length > 1);
  const bottom = frame.bottom + (wrapped ? LINE : 0);

  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const y = (v: number) => top + plotH - (v / (step * 4)) * plotH;
  const slot = plotW / n;
  const x = (i: number) => (bar ? left + slot * (i + 0.5) : left + 16 + (i / (n - 1)) * (plotW - 32));
  const pitch = n > 1 ? x(1) - x(0) : plotW;
  const shown = thinLabels(
    lines.map((l) => Math.max(...l.map((t) => textWidth(t, AXIS)))),
    pitch
  );
  /* a bar's value sits over it only where every value has the room;
     otherwise the gridlines carry the reading (and the label names every
     value for a screen reader) */
  const valuesFit = !bar || Math.max(...chart.data.map((d) => textWidth(value(d.value), VALUE))) + 4 <= pitch;
  const barW = slot * 0.56;
  const labelY = height - 10 - (wrapped ? LINE : 0);
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
            {ticks[i]}
          </text>
        </g>
      ))}
      {chart.data.map((d, i) =>
        shown[i] ? (
          <text key={d.label} x={x(i)} y={labelY} textAnchor="middle" className="chart-axis">
            {lines[i].length > 1
              ? lines[i].map((l, j) => (
                  <tspan key={j} x={x(i)} dy={j ? LINE : 0}>
                    {l}
                  </tspan>
                ))
              : d.label}
          </text>
        ) : null
      )}
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
            {valuesFit && (
              <text x={x(i)} y={y(d.value) - 8} textAnchor="middle" className="chart-value">
                {value(d.value)}
              </text>
            )}
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
 * a phone; CSS shows one. Labels that would overprint each other thin out
 * (the run's two ends always stay), a bar's two-word name wraps, and the
 * margins grow to fit the ticks and the last label.
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
