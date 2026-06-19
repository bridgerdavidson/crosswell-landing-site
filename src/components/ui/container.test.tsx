import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container";

describe("Container", () => {
  it("renders children and applies the max-width and gutter classes", () => {
    render(<Container>inside</Container>);
    const el = screen.getByText("inside");
    expect(el).toHaveClass("mx-auto", "max-w-[70rem]", "px-6");
  });

  it("merges a passed className", () => {
    render(<Container className="text-center">x</Container>);
    expect(screen.getByText("x")).toHaveClass("text-center");
  });
});
