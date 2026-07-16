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
  label: string;
  variant?: InteractiveVariant;
  size?: ButtonSize;
  /** The icon element, e.g. a Lucide icon. */
  children: ReactNode;
}

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
