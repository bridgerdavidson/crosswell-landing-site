import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Input } from "./input";

describe("Input", () => {
  it("associates the visible label with the input", () => {
    render(<Input label="Work email" placeholder="you@fund.com" />);
    const input = screen.getByLabelText("Work email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "you@fund.com");
  });

  it("marks the field invalid and describes the error", () => {
    render(<Input label="Work email" error="Enter a valid email" />);
    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Input label="Work email" helperText="We never share this." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
