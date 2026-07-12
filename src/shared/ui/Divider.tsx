import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
}

/**
 * A hairline separator. Horizontal renders a semantic `<hr>`; vertical renders a
 * `separator`-role element with the correct `aria-orientation`. Uses the border
 * token so it reads as a calm divider in both themes.
 */
export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px self-stretch bg-border", className)}
        {...props}
      />
    );
  }

  return (
    <hr
      className={cn("h-px w-full border-0 bg-border", className)}
      {...props}
    />
  );
}
