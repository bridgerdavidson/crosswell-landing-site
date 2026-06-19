import { cn } from "@/lib/cn";

export function TextLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "text-link underline-offset-4 hover:underline " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm",
        className,
      )}
      {...props}
    />
  );
}
