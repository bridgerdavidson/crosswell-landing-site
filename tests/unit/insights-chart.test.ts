import { describe, expect, it } from "vitest";
import { parseChart } from "@/lib/insights/chart";
import { smart } from "@/lib/insights/smart";

const lines = (...l: string[]) => l.join("\n");
const valid = lines(
  "type: line",
  "title: Share of employees using AI",
  'unit: "%"',
  "source: Gallup, 2026",
  "sourceUrl: https://www.gallup.com/example",
  "data:",
  "  2026: 50",
  "  2023: 21"
);

describe("chart blocks", () => {
  it("parses a valid chart, keeping the data in the order it was written", () => {
    const { chart, problems } = parseChart(valid);
    expect(problems).toEqual([]);
    expect(chart).toEqual({
      type: "line",
      title: "Share of employees using AI",
      unit: "%",
      source: "Gallup, 2026",
      sourceUrl: "https://www.gallup.com/example",
      data: [
        { label: "2026", value: 50 },
        { label: "2023", value: 21 },
      ],
    });
  });

  it("leaves the unit empty when there is none, and curls the title", () => {
    const { chart } = parseChart(valid.replace('unit: "%"\n', "").replace("Share of employees", "Employees' share"));
    expect(chart?.unit).toBe("");
    expect(chart?.title).toBe("Employees’ share using AI");
  });

  it("rejects YAML it cannot read", () => {
    expect(parseChart("type: [line").problems[0]).toMatch(/^is not valid YAML/);
  });

  it("names a value that is not a number", () => {
    expect(parseChart(valid.replace("2023: 21", "2023: twenty-one")).problems).toContain(
      'data value "twenty-one" for "2023" is not a number.'
    );
  });

  it("rejects a value below zero", () => {
    expect(parseChart(valid.replace("2023: 21", "2023: -4")).problems).toContain(
      'data value -4 for "2023" is below zero. Charts plot zero and up.'
    );
  });

  it("rejects an unknown field, a bad type, and a missing source link", () => {
    const { problems } = parseChart(
      valid.replace("type: line", "type: pie").replace("sourceUrl: https://www.gallup.com/example\n", "colour: green\n")
    );
    expect(problems).toContain('type must be "line" or "bar".');
    expect(problems).toContain("sourceUrl is missing.");
    expect(problems).toContain('"colour" is not a chart field. Chart fields: type, title, unit, source, sourceUrl, data.');
  });

  it("takes 2 to 12 points", () => {
    expect(parseChart(valid.replace("  2023: 21", "")).problems).toContain("data has 1 point. A chart takes 2 to 12.");
  });
});

describe("curled text", () => {
  it("curls apostrophes and quotes and leaves hyphens alone", () => {
    expect(smart(`It's a "test" -- really`)).toBe("It’s a “test” -- really");
  });
});
