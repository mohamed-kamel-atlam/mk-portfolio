import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/lib/cn";

export type TextareaProps = ComponentPropsWithRef<"textarea">;

/**
 * Multi-line text input primitive; shares the {@link Input} visual language.
 * Forwards `ref` (React 19) for imperative focus / form-library integration.
 */
export function Textarea({ className, ref, ...props }: TextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-foreground",
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
