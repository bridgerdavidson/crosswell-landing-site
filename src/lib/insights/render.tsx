import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime, type Components, type Jsx } from "hast-util-to-jsx-runtime";
import Chart from "@/components/insights/Chart";
import Faq from "@/components/insights/Faq";
import FootnoteLink from "@/components/insights/FootnoteLink";
import type { Post } from "./types";

type Props = Record<string, unknown> & { children?: ReactNode };

/**
 * A post's body as React: the site's own components for its charts and its
 * FAQ, plain elements for everything else. A footnote's links land without
 * a hash (FootnoteLink), the footnotes' heading shows as a label rather
 * than a hidden heading, and a table sits in a box that scrolls sideways.
 * Runs at build; the only client JavaScript is the footnote links'.
 */
export function renderBody(post: Post): ReactNode {
  const components = {
    "x-chart": (props: Record<string, unknown>) => {
      const chart = post.charts[Number(props["data-chart"] ?? props.dataChart)];
      return chart ? <Chart chart={chart} /> : null;
    },
    "x-faq": ({ children }: { children?: ReactNode }) => <Faq>{children}</Faq>,
    a: (props: Props) =>
      "data-footnote-ref" in props || "data-footnote-backref" in props ? <FootnoteLink {...props} /> : <a {...props} />,
    h2: ({ className, ...props }: Props) => (props.id === "footnote-label" ? <h2 {...props} /> : <h2 className={className as string} {...props} />),
    table: (props: Props) => (
      <div className="table-scroll">
        <table {...props} />
      </div>
    ),
  } as unknown as Partial<Components>;
  return toJsxRuntime(post.body, { Fragment, jsx: jsx as Jsx, jsxs: jsxs as Jsx, components });
}
