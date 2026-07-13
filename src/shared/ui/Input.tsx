import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/lib/cn";

export type InputProps = ComponentPropsWithRef<"input">;

/**
 * Text input primitive. Token-driven surface/border/text; the border turns
 * `danger` when the control is marked `aria-invalid` (never color alone — a
 * paired error message conveys the state). Focus uses the global focus ring.
 * Forwards `ref` (React 19) for imperative focus / form-library integration.
 */
export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-body text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors duration-fast focus-visible:border-accent",
        "aria-[invalid=true]:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
