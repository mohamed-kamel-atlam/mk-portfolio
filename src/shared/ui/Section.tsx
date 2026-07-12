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

/**
 * A semantic `<section>` establishing the vertical rhythm between page sections.
 * Pairs with {@link Container} for horizontal bounds; spacing values come from
 * the section-padding steps of the spacing scale.
 */
export function Section({ spacing = "md", className, ...props }: SectionProps) {
  return (
    <section className={cn(sectionSpacing[spacing], className)} {...props} />
  );
}
