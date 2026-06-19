import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./section";

describe("Section", () => {
  it("is a light section with no data-section by default", () => {
    render(<Section>body</Section>);
    const el = screen.getByText("body");
    expect(el.tagName).toBe("SECTION");
    expect(el).not.toHaveAttribute("data-section");
    expect(el).toHaveClass("bg-bg", "text-foreground");
  });

  it("sets data-section=dark when dark", () => {
    render(<Section dark>body</Section>);
    expect(screen.getByText("body")).toHaveAttribute("data-section", "dark");
  });
});
