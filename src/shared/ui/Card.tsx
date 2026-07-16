import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const cardElevations = {
  0: "elevation-0",
  1: "elevation-1",
  2: "elevation-2",
  3: "elevation-3",
  4: "elevation-4",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface + shadow pairing (DESIGN_TOKENS §4.4). Defaults to a flat card. */
  elevation?: keyof typeof cardElevations;
  interactive?: boolean;
}

export function Card({
  elevation = 1,
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-6",
        cardElevations[elevation],
        interactive &&
          "transition duration-normal hover:border-accent hover:shadow-lg motion-safe:hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}
