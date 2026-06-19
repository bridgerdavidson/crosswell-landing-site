import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Source_Serif_4: () => ({
    variable: "--font-source-serif",
    className: "font-source-serif",
  }),
  Inter: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("exposes the serif and sans font variables on <html>", () => {
    const { baseElement } = render(<RootLayout>content</RootLayout>);
    const html = baseElement.ownerDocument.documentElement;
    expect(html.className).toContain("--font-source-serif");
    expect(html.className).toContain("--font-inter");
  });

  it("renders children", () => {
    const { baseElement } = render(<RootLayout>content</RootLayout>);
    expect(baseElement.textContent).toContain("content");
  });
});
