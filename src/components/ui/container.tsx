import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[70rem] px-6 md:px-8", className)}
      {...props}
    />
  );
}
