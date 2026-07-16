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
  decorative?: boolean;
  className?: string;
}

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
