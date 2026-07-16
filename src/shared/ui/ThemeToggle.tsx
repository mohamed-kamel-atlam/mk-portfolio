"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/hooks";

import { IconButton } from "./IconButton";

export interface ThemeToggleProps {
  className?: string;
  /** Localized accessible label; falls back to an English default. */
  label?: string;
}

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
