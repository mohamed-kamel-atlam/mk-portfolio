import { Children, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Reveal } from "./Reveal";

export interface StaggerRevealProps {
  children: ReactNode;
  /** Delay step between successive children, in ms. */
  step?: number;
  className?: string;
}

/**
 * Reveal a group of children in sequence as they scroll into view. A Server
 * Component that composes {@link Reveal} per child with an incremental delay —
 * the staggering is data (index × step), never hand-written per item. Apply the
 * layout (grid/flex) via `className`.
 */
export function StaggerReveal({
  children,
  step = 80,
  className,
}: StaggerRevealProps) {
  return (
    <div className={cn(className)}>
      {Children.toArray(children).map((child, index) => (
        <Reveal key={index} delay={index * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
