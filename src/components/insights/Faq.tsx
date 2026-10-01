import type { ReactNode } from "react";

/* A post's FAQ: its questions as hairline rows (styles in globals.css,
   .article-body .faq). The FAQPage structured data comes from the same
   parse, so the two cannot disagree. */
export default function Faq({ children }: { children?: ReactNode }) {
  return <div className="faq">{children}</div>;
}
