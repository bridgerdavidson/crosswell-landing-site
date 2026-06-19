import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "./button";

describe("Button", () => {
  it("renders a primary button by default with the fern fill", () => {
    render(<Button>Book a call</Button>);
    const btn = screen.getByRole("button", { name: "Book a call" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("bg-primary", "text-primary-foreground", "min-h-11");
  });

  it("applies the secondary outline variant", () => {
    render(<Button variant="secondary">See the tools</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "border",
      "border-control-border",
      "text-foreground",
    );
  });

  it("sets disabled styling and attribute", () => {
    render(<Button disabled>x</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("disabled:cursor-not-allowed");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Book a call</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
