/**
 * Shared interactive-control variants. Internal to `shared/ui` (not exported from
 * the barrel): Button, IconButton, and the toggles all consume these so variant
 * styling lives in exactly one place — the "no duplicated variants" rule
 * (CODING_STANDARDS §8). Every class resolves to a design token.
 *
 * Token colors are `var(--color-*)`, so Tailwind alpha modifiers (`/90`) cannot
 * apply; filled variants use `hover:opacity-90` and subtle ones `hover:bg-muted`.
 */

export const interactiveBase =
  "inline-flex select-none items-center justify-center gap-2 rounded-md font-medium transition duration-fast disabled:pointer-events-none disabled:opacity-50";

export const interactiveVariants = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-danger text-danger-foreground hover:opacity-90",
} as const;

export type InteractiveVariant = keyof typeof interactiveVariants;

/** Height + inline padding + text step for text buttons. */
export const buttonSizes = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-6 text-body-lg",
} as const;

/** Square footprints for icon-only buttons. */
export const iconButtonSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

export type ButtonSize = keyof typeof buttonSizes;
