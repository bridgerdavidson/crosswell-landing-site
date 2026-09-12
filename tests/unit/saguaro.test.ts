import { describe, expect, it } from "vitest";
import { agenda, agents, brand, chat, company, pipeline, today } from "@/lib/saguaro";
import type { Card, Detail } from "@/lib/saguaro";

const all = JSON.stringify({ agenda, agents, brand, chat, company, pipeline, today });

describe("saguaro dataset", () => {
  it("shares Draw 4 across Today, Agenda, and Pipeline", () => {
    expect(today.needsYou[0].id).toBe("draw-4");
    expect(agenda.yourDay.find((i) => i.ref === "draw-4")?.done).toBe(true);
    expect(agenda.team.flatMap((r) => r.items).find((i) => i.ref === "draw-4")?.done).toBe(true);
    const funded = pipeline.stages.find((s) => s.name === "Funded");
    expect(funded?.cards.some((c: Card) => c.ref === "draw-4")).toBe(true);
  });

  it("has three chat exchanges, each with a receipt and working lines", () => {
    expect(chat.exchanges).toHaveLength(3);
    for (const e of chat.exchanges) {
      expect(e.receipts.length).toBeGreaterThan(0);
      expect(e.working.length).toBeGreaterThan(0);
    }
  });

  it("has five stages and a selected card with three prompts", () => {
    expect(pipeline.stages.map((s) => s.name)).toEqual([
      "Screened", "Term sheet", "Underwriting", "Docs out", "Funded",
    ]);
    expect((pipeline.details as Record<string, Detail>)[pipeline.selected].prompts).toHaveLength(3);
    expect(pipeline.stages.flatMap((s) => s.cards).some((c) => c.id === pipeline.selected)).toBe(true);
  });

  it("has five agents with known statuses", () => {
    expect(agents.roster).toHaveLength(5);
    for (const a of agents.roster) {
      expect(["running", "waiting", "done", "scheduled"]).toContain(a.status.kind);
      expect(a.log.length).toBe(3);
    }
  });

  it("has four brand swatches, Saguaro first, all hex", () => {
    expect(brand.swatches).toHaveLength(4);
    expect(brand.swatches[0].company).toBe(company.name);
    for (const s of brand.swatches) {
      for (const k of ["accent", "accentDeep", "accentSoft", "accentWash"] as const) {
        expect(s[k]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("follows the copy rules", () => {
    expect(all).not.toMatch(/\u2014/);
    expect(all).not.toMatch(/\bbrain\b|\bmind\b/i);
  });
});
