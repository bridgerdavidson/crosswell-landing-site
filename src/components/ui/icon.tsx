import type { LucideIcon } from "lucide-react";

const SIZES = { sm: 18, md: 24, lg: 32 } as const;

export function Icon({
  icon: LucideGlyph,
  size = "md",
  label,
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}) {
  return (
    <LucideGlyph
      size={SIZES[size]}
      strokeWidth={1.7}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
