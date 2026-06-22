import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { AgentFlow } from "./agent-flow";

describe("AgentFlow", () => {
  it("renders the five steps as list items", () => {
    render(<AgentFlow />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("A deal lands")).toBeInTheDocument();
    expect(screen.getByText("The team decides")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<AgentFlow />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
