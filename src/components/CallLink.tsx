import type { ReactNode } from "react";
import { CALL_MAILTO } from "@/lib/site";

/*
 * Every "Set up a call" on the site is this link. Today it opens an email
 * (lib/site.ts). When the scheduler is picked, this is the one file that
 * changes, to a booking page or an inline embed, and every call on the site
 * follows (spec section 8). The label stays "Set up a call", never "Book a
 * call".
 */
export default function CallLink({
  className = "",
  children = "Set up a call",
  onClick,
}: {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a href={CALL_MAILTO} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
