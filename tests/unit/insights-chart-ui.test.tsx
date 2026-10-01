import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Chart, { thinLabels } from "@/components/insights/Chart";
import type { ChartSpec } from "@/lib/insights/types";

const chart = (over: Partial<ChartSpec>): ChartSpec => ({
  type: "line",
  title: "A test chart",
  unit: "",
  source: "Test",
  sourceUrl: "https://example.com/s",
  data: [],
  ...over,
});
const years = Array.from({ length: 12 }, (_, i) => ({ label: String(2015 + i), value: 4 + i * 3 }));
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** the two drawings' markup: [wide, narrow] */
const drawings = (spec: ChartSpec) => renderToStaticMarkup(<Chart chart={spec} />).split("<svg ").slice(1);
/** the x-axis labels one drawing shows, in order (a wrapped label's lines joined by a space) */
const xLabels = (svg: string) =>
  [...svg.matchAll(/<text[^>]*text-anchor="middle"[^>]*class="chart-axis"[^>]*>(.*?)<\/text>/g)].map((m) =>
    m[1].replace(/<tspan[^>]*>/g, " ").replace(/<\/tspan>/g, "").trim()
  );
const valueLabels = (svg: string) => [...svg.matchAll(/class="chart-value"[^>]*>(.*?)<\/text>/g)].map((m) => m[1]);
/** the x of the y-axis tick labels (they are right-aligned on the axis) */
const tickX = (svg: string) => Number(svg.match(/<text x="([\d.]+)"[^>]*text-anchor="end"/)![1]);

describe("chart labels that would collide", () => {
  it("thins a run of labels to what fits, always keeping the first and the last", () => {
    const labels = years.map((d) => d.label);
    // 24px a point: a four-digit year at 12px needs about 37 with its gap, so every other one
    const shown = thinLabels(labels, 24).map((s, i) => (s ? labels[i] : null)).filter(Boolean);
    expect(shown[0]).toBe("2015");
    expect(shown[shown.length - 1]).toBe("2026");
    expect(shown).toEqual(["2015", "2017", "2019", "2021", "2023", "2026"]);
    // room for all of them: nothing is dropped
    expect(thinLabels(labels, 48).every(Boolean)).toBe(true);
  });

  it("keeps every year on the wide drawing and thins them on the narrow one", () => {
    const [wide, narrow] = drawings(chart({ data: years }));
    expect(xLabels(wide)).toHaveLength(12);
    const shown = xLabels(narrow);
    expect(shown.length).toBeLessThan(12);
    expect(shown[0]).toBe("2015");
    expect(shown[shown.length - 1]).toBe("2026");
  });

  it("thins long bar labels on both drawings rather than overprinting them", () => {
    const [wide, narrow] = drawings(chart({ type: "bar", data: months.map((label, i) => ({ label, value: 7 + i })) }));
    for (const svg of [wide, narrow]) {
      const shown = xLabels(svg);
      expect(shown.length).toBeLessThan(12);
      expect(shown[0]).toBe("January");
      expect(shown[shown.length - 1]).toBe("December");
    }
  });

  it("wraps a two-word bar label onto two lines before thinning", () => {
    const data = ["Professional services", "Manufacturing", "Private credit", "Construction"].map((label, i) => ({ label, value: 10 + i }));
    const [wide] = drawings(chart({ type: "bar", data }));
    expect(xLabels(wide)).toEqual(["Professional services", "Manufacturing", "Private credit", "Construction"]);
    expect(wide).toContain("<tspan");
  });

  it("drops the bars' value labels when they would collide, and keeps them when they fit", () => {
    const twelve = chart({ type: "bar", unit: " hrs", data: months.map((label, i) => ({ label, value: 7 + i })) });
    const three = chart({ type: "bar", unit: " hrs", data: months.slice(0, 3).map((label, i) => ({ label, value: 7 + i })) });
    for (const svg of drawings(twelve)) expect(valueLabels(svg)).toEqual([]);
    for (const svg of drawings(three)) expect(valueLabels(svg)).toEqual(["7 hrs", "8 hrs", "9 hrs"]);
  });

  it("still names every value for a screen reader when the drawing cannot", () => {
    const [wide] = drawings(chart({ type: "bar", unit: " hrs", data: months.map((label, i) => ({ label, value: 7 + i })) }));
    expect(wide).toContain('aria-label="A test chart: January, 7 hrs; February, 8 hrs;');
  });
});

describe("the chart's axis", () => {
  it("widens its margin so five-digit ticks are not cut off, and groups their thousands", () => {
    const small = chart({ type: "bar", data: [{ label: "A", value: 12 }, { label: "B", value: 8 }] });
    const big = chart({ type: "bar", data: [{ label: "North", value: 12400 }, { label: "South", value: 8300 }, { label: "West", value: 15100 }] });
    const [, smallNarrow] = drawings(small);
    const [bigWide, bigNarrow] = drawings(big);
    expect(tickX(bigNarrow)).toBeGreaterThan(tickX(smallNarrow) + 10);
    expect(bigWide).toContain(">16,000</text>");
    expect(valueLabels(bigWide)).toEqual(["12,400", "8,300", "15,100"]);
  });

  it("keeps the last label inside the drawing", () => {
    const [, narrow] = drawings(chart({ type: "bar", data: months.map((label, i) => ({ label, value: 7 + i })) }));
    const width = Number(narrow.match(/viewBox="0 0 (\d+)/)![1]);
    const last = [...narrow.matchAll(/<text x="([\d.]+)"[^>]*text-anchor="middle"[^>]*class="chart-axis"/g)].pop()!;
    // "December" at 12px is about 58 wide; its centre must sit at least half that from the edge
    expect(Number(last[1])).toBeLessThanOrEqual(width - 29);
  });
});
