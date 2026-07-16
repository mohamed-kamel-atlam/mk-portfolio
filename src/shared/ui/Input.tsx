import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/lib/cn";

export type InputProps = ComponentPropsWithRef<"input">;

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
