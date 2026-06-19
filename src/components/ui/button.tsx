import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans text-[0.9375rem] font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-foreground disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "min-h-11 px-5 bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99]",
  secondary:
    "min-h-11 px-5 border border-control-border text-foreground hover:bg-primary/5 active:scale-[0.99]",
  link: "min-h-11 px-1 text-link underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: { variant?: Variant } & React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
