import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextLink } from "./text-link";

describe("TextLink", () => {
  it("renders an anchor with the link token color and hover underline", () => {
    render(<TextLink href="/tools">See the tools</TextLink>);
    const link = screen.getByRole("link", { name: "See the tools" });
    expect(link).toHaveAttribute("href", "/tools");
    expect(link).toHaveClass("text-link", "hover:underline");
  });
});
