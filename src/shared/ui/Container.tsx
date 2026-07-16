import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Semantic element to render. Defaults to `div`. */
  as?: "div" | "section" | "main" | "article";
}

export function Container({
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return <Tag className={cn("container-page", className)} {...props} />;
}
