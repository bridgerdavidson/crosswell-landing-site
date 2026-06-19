import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-md shadow-xs transition " +
          "hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transform-none",
        className,
      )}
      {...props}
    />
  );
}
