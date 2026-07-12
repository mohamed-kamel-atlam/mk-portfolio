import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import {
  iconButtonSizes,
  interactiveBase,
  interactiveVariants,
  type ButtonSize,
  type InteractiveVariant,
} from "./variants";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> {
  /** Required accessible name — an icon-only control must be labelled
   *  (DESIGN_SYSTEM → Iconography: icons never replace labels). */
  label: string;
  variant?: InteractiveVariant;
  size?: ButtonSize;
  /** The icon element, e.g. a Lucide icon. */
  children: ReactNode;
}

/**
 * A square, icon-only button. Shares the interactive variant/size scales with
 * {@link Button}. The `label` becomes both the accessible name and the tooltip;
 * the icon itself must be `aria-hidden`.
 */
export function IconButton({
  label,
  variant = "secondary",
  size = "md",
  type,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? "button"}
      aria-label={label}
      title={label}
      className={cn(
        interactiveBase,
        interactiveVariants[variant],
        iconButtonSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
