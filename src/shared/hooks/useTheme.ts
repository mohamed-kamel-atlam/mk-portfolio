"use client";

import { useContext } from "react";

import {
  ThemeContext,
  type ThemeContextValue,
} from "@/shared/providers/ThemeProvider";

/**
 * Read the current theme preference, the resolved theme, and the setter.
 * The consumption API for the theme system — used by the (future) theme toggle
 * and any component that needs to reflect the active theme.
 *
 * @throws if used outside a `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
}
