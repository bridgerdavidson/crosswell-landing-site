import { cn } from "@/lib/cn";

export function Eyebrow({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em] text-accent-text",
        className,
      )}
      {...props}
    />
  );
}
