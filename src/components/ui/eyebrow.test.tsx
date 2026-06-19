import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./eyebrow";

describe("Eyebrow", () => {
  it("renders an uppercase tracked accent label", () => {
    render(<Eyebrow>How we work</Eyebrow>);
    const el = screen.getByText("How we work");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("uppercase", "text-accent-text", "font-semibold");
  });
});
