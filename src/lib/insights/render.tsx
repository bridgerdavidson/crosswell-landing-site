import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime, type Components, type Jsx } from "hast-util-to-jsx-runtime";
import Chart from "@/components/insights/Chart";
import Faq from "@/components/insights/Faq";
import type { Post } from "./types";

/**
 * A post's body as React: the site's own components for its charts and its
 * FAQ, plain elements for everything else. Runs at build; ships no client
 * JavaScript.
 */
export function renderBody(post: Post): ReactNode {
  const components = {
    "x-chart": (props: Record<string, unknown>) => {
      const chart = post.charts[Number(props["data-chart"] ?? props.dataChart)];
      return chart ? <Chart chart={chart} /> : null;
    },
    "x-faq": ({ children }: { children?: ReactNode }) => <Faq>{children}</Faq>,
  } as unknown as Partial<Components>;
  return toJsxRuntime(post.body, { Fragment, jsx: jsx as Jsx, jsxs: jsxs as Jsx, components });
}
