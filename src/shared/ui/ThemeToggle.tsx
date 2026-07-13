"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/hooks";

import { IconButton } from "./IconButton";

export interface ThemeToggleProps {
  className?: string;
  /** Localized accessible label; falls back to an English default. */
  label?: string;
}

/**
 * Binary dark/light theme switch (default dark). A Client leaf that consumes
 * `useTheme()`; presentation is delegated to {@link IconButton}, so it shares the
 * design system's button styling rather than duplicating it (ADR-0005).
 */
export function ThemeToggle({ className, label }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <IconButton
      label={label ?? `Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className={className}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </IconButton>
  );
}
