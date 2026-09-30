import YAML from "yaml";
import { smart } from "./smart";
import type { ChartSpec } from "./types";
import { yamlHint, yamlWhat } from "./yaml";

const FIELDS = ["type", "title", "unit", "source", "sourceUrl", "data"];

/**
 * One chart block's YAML, checked. Maps parse as Maps so the data keeps the
 * order it was written in (a plain object would sort year keys). Returns the
 * chart, or every problem with it.
 */
export function parseChart(source: string): { chart?: ChartSpec; problems: string[] } {
  let top: unknown;
  try {
    top = YAML.parse(source, { mapAsMap: true });
  } catch (e) {
    return { problems: [`is not valid YAML (${yamlWhat(e)}). ${yamlHint(e, "chart", source.split("\n"))}`] };
  }
  if (!(top instanceof Map)) return { problems: ["must be fields like type:, title:, and data:, one per line."] };
  const fields: Map<unknown, unknown> = top;

  const problems: string[] = [];
  for (const key of fields.keys()) {
    if (!FIELDS.includes(String(key))) {
      problems.push(`"${String(key)}" is not a chart field. Chart fields: ${FIELDS.join(", ")}.`);
    }
  }
  const text = (key: string, required: boolean): string => {
    const v = fields.get(key);
    if (v === undefined || v === null || v === "") {
      if (required) problems.push(`${key} is missing.`);
      return "";
    }
    if (typeof v !== "string" && typeof v !== "number") {
      problems.push(`${key} must be text.`);
      return "";
    }
    return String(v);
  };

  const type = fields.get("type");
  if (type !== "line" && type !== "bar") problems.push('type must be "line" or "bar".');
  const title = text("title", true);
  const unit = text("unit", false);
  const origin = text("source", true);
  const sourceUrl = text("sourceUrl", true);
  if (sourceUrl && !/^https?:\/\//.test(sourceUrl)) problems.push("sourceUrl must start with http:// or https://.");

  const data: ChartSpec["data"] = [];
  const raw = fields.get("data");
  if (!(raw instanceof Map)) {
    problems.push("data must be label: number pairs, one per line, indented under data:.");
  } else {
    for (const [key, value] of raw) {
      const label = String(key);
      if (typeof value !== "number" || !Number.isFinite(value)) {
        const attached = typeof value === "string" && /^\d/.test(value) ? " Write the number alone and put the unit in unit:." : "";
        problems.push(`data value "${String(value)}" for "${label}" is not a number.${attached}`);
      } else if (value < 0) {
        problems.push(`data value ${value} for "${label}" is below zero. Charts plot zero and up.`);
      } else {
        data.push({ label, value });
      }
    }
    if (raw.size < 2 || raw.size > 12) {
      problems.push(`data has ${raw.size} point${raw.size === 1 ? "" : "s"}. A chart takes 2 to 12.`);
    }
  }

  if (problems.length) return { problems };
  return {
    chart: { type: type as ChartSpec["type"], title: smart(title), unit, source: smart(origin), sourceUrl, data },
    problems,
  };
}
