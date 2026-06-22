import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AmbientBackground } from "./ambient-background";

describe("AmbientBackground", () => {
  it("renders a decorative, aria-hidden layer", () => {
    const { container } = render(<AmbientBackground />);
    const layer = container.firstChild as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden");
  });
});
