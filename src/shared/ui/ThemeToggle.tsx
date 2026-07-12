"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Binary dark/light theme switch (default: dark). A leaf Client Component that
 * consumes `useTheme()`; a click flips between the two explicit themes and the
 * choice is persisted by the provider (ADR-0005). Icon-only, so it carries an
 * `aria-label` — icons never replace labels (DESIGN_SYSTEM → Iconography). It is
 * styled with design tokens only, and inherits the global token-based focus ring.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors duration-fast hover:bg-muted",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
