import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CallLink from "@/components/CallLink";
import { CALL_MAILTO } from "@/lib/site";

/** every file under a folder, skipping the local-only prototypes */
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (p.includes("prototype")) return [];
    return statSync(p).isDirectory() ? files(p) : [p];
  });

describe("the call link", () => {
  it("asks for the call where the site sends it", () => {
    const html = renderToStaticMarkup(<CallLink className="x" />);
    expect(html).toBe(`<a href="${CALL_MAILTO.replace(/&/g, "&amp;")}" class="x">Set up a call</a>`);
  });

  it("is the only component that knows where the call goes", () => {
    const users = files("src").filter((f) => /\.tsx?$/.test(f) && readFileSync(f, "utf8").includes("CALL_MAILTO"));
    expect(users.sort()).toEqual([join("src", "components", "CallLink.tsx"), join("src", "lib", "site.ts")]);
  });
});
