import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * A content placeholder shown while data loads. Decorative, so it is
 * `aria-hidden` — the loading state is announced elsewhere (e.g. a {@link Spinner}
 * with `role="status"`). Size it with `className` (`h-*`, `w-*`). The pulse
 * honors reduced-motion via the global rule.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
