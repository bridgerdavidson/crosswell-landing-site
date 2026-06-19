import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Search } from "lucide-react";
import { Icon } from "./icon";

describe("Icon", () => {
  it("is decorative (aria-hidden) without a label", () => {
    const { container } = render(<Icon icon={Search} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "24");
  });

  it("is labelled (role img) with a label", () => {
    const { container } = render(
      <Icon icon={Search} label="Search" size="sm" />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Search");
    expect(svg).toHaveAttribute("width", "18");
  });
});
