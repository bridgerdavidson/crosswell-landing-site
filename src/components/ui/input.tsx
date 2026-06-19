"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export function Input({
  label,
  helperText,
  error,
  id,
  className,
  ...props
}: {
  label: string;
  helperText?: string;
  error?: string;
} & React.ComponentProps<"input">) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = `${inputId}-desc`;
  const message = error ?? helperText;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? describedById : undefined}
        className={cn(
          "min-h-11 rounded-md border bg-surface px-3.5 text-foreground placeholder:text-muted " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
            "disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-foreground",
          error ? "border-error" : "border-control-border",
          className,
        )}
        {...props}
      />
      {message ? (
        <p
          id={describedById}
          className={cn("text-sm", error ? "text-error" : "text-muted")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
