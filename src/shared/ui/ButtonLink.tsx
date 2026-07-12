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
}

/**
 * A navigation control styled as a button — a `next/link` wearing the shared
 * interactive variants, so a call-to-action that *navigates* stays a real link
 * (correct semantics/accessibility) while matching {@link Button} visually. No
 * duplicated variant styling.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        interactiveBase,
        interactiveVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
