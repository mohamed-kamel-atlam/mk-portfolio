import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

import { Spinner } from "./Spinner";
import {
  buttonSizes,
  interactiveBase,
  interactiveVariants,
  type ButtonSize,
  type InteractiveVariant,
} from "./variants";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: InteractiveVariant;
  size?: ButtonSize;
  /** Show a spinner and mark the control busy + disabled. */
  isLoading?: boolean;
  /** Stretch to the container width. */
  fullWidth?: boolean;
}

/**
 * The primary action control. A shared (server-first) component that forwards
 * native button attributes, so consumers own the behavior (`onClick`, `type`, …)
 * and this owns only presentation. Defaults to `type="button"` to avoid
 * accidental form submits; composes {@link Spinner} for the loading state.
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  type,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        interactiveBase,
        interactiveVariants[variant],
        buttonSizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? <Spinner size="sm" decorative /> : null}
      {children}
    </button>
  );
}
