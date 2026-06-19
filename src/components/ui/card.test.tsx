import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./card";

describe("Card", () => {
  it("renders a surface card with border, radius, and rest shadow", () => {
    render(<Card>tool</Card>);
    const el = screen.getByText("tool");
    expect(el).toHaveClass(
      "bg-surface",
      "border",
      "border-border",
      "rounded-md",
      "shadow-xs",
    );
  });
});
