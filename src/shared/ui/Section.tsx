import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const sectionSpacing = {
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
} as const;

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Vertical rhythm between page sections (DESIGN_TOKENS spacing). Default `md`. */
  spacing?: keyof typeof sectionSpacing;
}

export function Section({ spacing = "md", className, ...props }: SectionProps) {
  return (
    <section className={cn(sectionSpacing[spacing], className)} {...props} />
  );
}
