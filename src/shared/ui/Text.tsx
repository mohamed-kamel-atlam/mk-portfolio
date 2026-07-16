import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const textSizes = {
  "body-lg": "text-body-lg",
  body: "text-body",
  small: "text-small",
  caption: "text-caption",
} as const;

const textTones = {
  default: "text-foreground",
  muted: "text-muted-foreground",
} as const;

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to `p`. */
  as?: "p" | "span" | "div";
  size?: keyof typeof textSizes;
  /** Foreground emphasis. Both tones meet WCAG AA on the app background. */
  tone?: keyof typeof textTones;
}

export function Text({
  as: Tag = "p",
  size = "body",
  tone = "default",
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(textSizes[size], textTones[tone], className)}
      {...props}
    />
  );
}
