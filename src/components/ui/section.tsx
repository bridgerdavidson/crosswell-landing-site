import { cn } from "@/lib/cn";

export function Section({
  dark = false,
  className,
  ...props
}: { dark?: boolean } & React.ComponentProps<"section">) {
  return (
    <section
      data-section={dark ? "dark" : undefined}
      className={cn(
        "bg-bg text-foreground py-[clamp(4rem,4rem+4vw,6rem)]",
        className,
      )}
      {...props}
    />
  );
}
