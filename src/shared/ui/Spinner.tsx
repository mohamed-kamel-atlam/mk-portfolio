import { cn } from "@/shared/lib/cn";

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const;

export interface SpinnerProps {
  /** Visual size. */
  size?: keyof typeof spinnerSizes;
  /** Accessible label announced by assistive tech. Localize by passing a string. */
  label?: string;
  /**
   * Render purely decoratively (`aria-hidden`, no status role) — for when the
   * loading state is already announced elsewhere, e.g. inside a `Button` whose
   * `aria-busy` and localized visible text convey it. Avoids a redundant,
   * unlocalized "Loading" announcement.
   */
  decorative?: boolean;
  className?: string;
}

/**
 * Indeterminate loading indicator. Inherits `currentColor`, so it adopts its
 * parent's text color (e.g. a Button's foreground). Exposes `role="status"` with
 * an accessible label unless `decorative`; the spin honors reduced-motion via the
 * global rule.
 */
export function Spinner({
  size = "md",
  label = "Loading",
  decorative = false,
  className,
}: SpinnerProps) {
  return (
    <span
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        spinnerSizes[size],
        className,
      )}
    />
  );
}
