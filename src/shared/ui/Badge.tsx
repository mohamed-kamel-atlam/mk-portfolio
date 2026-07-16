import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const badgeVariants = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
  /** Elegant outlined chip — a hairline border instead of a fill. */
  outline: "border border-border bg-transparent text-muted-foreground",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-caption",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
