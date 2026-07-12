import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const badgeVariants = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

/**
 * Small status/category label. Status is conveyed by the text content, never by
 * color alone (WCAG 1.4.1). Each fill pairs with its `-foreground` token.
 */
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
