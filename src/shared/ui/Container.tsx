import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Semantic element to render. Defaults to `div`. */
  as?: "div" | "section" | "main" | "article";
}

/**
 * Centered, responsive page container — max content width + responsive gutter,
 * all token-driven (DESIGN_TOKENS §4.7 via the `container-page` utility). Layout
 * mirrors automatically in RTL because the utility uses logical padding.
 */
export function Container({
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return <Tag className={cn("container-page", className)} {...props} />;
}
