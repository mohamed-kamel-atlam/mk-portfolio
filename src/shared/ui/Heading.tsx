import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const headingSizes = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
} as const;

const headingTags = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level `<h1>`–`<h4>` (document outline). */
  level: 1 | 2 | 3 | 4;
  /** Visual step, decoupled from the level (TYPOGRAPHY §5). Defaults to match. */
  size?: keyof typeof headingSizes;
}

/**
 * A heading that separates semantic level from visual size: `level` sets the
 * element for the outline (accessibility), `size` sets the type step. The type
 * token carries weight/line-height/tracking (and resets tracking in RTL).
 */
export function Heading({
  level,
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = headingTags[level];
  const visual = size ?? (`h${level}` as keyof typeof headingSizes);

  return (
    <Tag
      className={cn("text-foreground", headingSizes[visual], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
