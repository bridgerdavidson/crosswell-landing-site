import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

describe("Reveal", () => {
  it("renders the wrapped content", () => {
    render(
      <Reveal>
        <p>Revealed copy</p>
      </Reveal>,
    );
    expect(screen.getByText("Revealed copy")).toBeInTheDocument();
  });

  it("renders all grouped items", () => {
    render(
      <RevealGroup>
        <RevealItem>
          <span>One</span>
        </RevealItem>
        <RevealItem>
          <span>Two</span>
        </RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Reveal>
        <p>Accessible content</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
