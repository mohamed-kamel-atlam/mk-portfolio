import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

import {
  buttonSizes,
  interactiveBase,
  interactiveVariants,
  type ButtonSize,
  type InteractiveVariant,
} from "./variants";

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: InteractiveVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Reveal a trailing arrow that slides on hover (for CTAs). RTL-mirrored. */
  trailingArrow?: boolean;
}

/**
 * A navigation control styled as a button — a `next/link` wearing the shared
 * interactive variants, so a call-to-action that *navigates* stays a real link
 * (correct semantics/accessibility) while matching {@link Button} visually. No
 * duplicated variant styling. `trailingArrow` adds the shared CTA arrow-slide.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  trailingArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        interactiveBase,
        interactiveVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        trailingArrow && "group/btn",
        className,
      )}
      {...props}
    >
      {children}
      {trailingArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-fast motion-safe:group-hover/btn:translate-x-1 rtl:-scale-x-100 rtl:motion-safe:group-hover/btn:-translate-x-1"
        />
      ) : null}
    </Link>
  );
}
