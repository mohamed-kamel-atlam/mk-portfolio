"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  THEME_TRANSITION_MS,
  THEMES,
} from "@/shared/constants/theme";
import type { ResolvedTheme, Theme } from "@/shared/types/theme";

export interface ThemeContextValue {
  /** The user's preference: `light` | `dark` | `system`. */
  theme: Theme;
  /** The concrete theme applied to the document: `light` | `dark`. */
  resolvedTheme: ResolvedTheme;
  /** Persist a new preference and apply it. */
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const PREFERS_DARK = "(prefers-color-scheme: dark)";

function resolveSystem(): ResolvedTheme {
  return window.matchMedia(PREFERS_DARK).matches ? "dark" : "light";
}

function resolve(theme: Theme): ResolvedTheme {
  return theme === "system" ? resolveSystem() : theme;
}

/** Write the resolved theme to `<html data-theme>`; the CSS tokens do the rest. */
function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.dataset.theme = resolved;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Owns the theme preference (client/local + persisted state, per ADR-0005) and
 * flips the `data-theme` attribute. It never computes colors in JS — the CSS
 * variables do — so it stays a thin client island around otherwise-server
 * children (server-first preserved: passing Server Components as `children`
 * does not make them client).
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // SSR-safe defaults matching the server-rendered `<html data-theme="dark">`.
  // The pre-paint script has already applied the correct attribute; these
  // states are synced to it on mount, so nothing changes visually or in the DOM.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  // Sync React state to the persisted preference after hydration.
  useEffect(() => {
    // Validate the persisted value against the known themes — never trust a raw
    // localStorage string (tampering, extensions, schema drift).
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const next: Theme = THEMES.includes(stored as Theme)
      ? (stored as Theme)
      : DEFAULT_THEME;
    setThemeState(next);
    setResolvedTheme(resolve(next));
  }, []);

  // While the preference is `system`, follow live OS changes.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia(PREFERS_DARK);
    const onChange = () => {
      const next = resolveSystem();
      setResolvedTheme(next);
      applyTheme(next);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (e.g. private mode): apply for the session anyway.
    }

    const resolved = resolve(next);
    setResolvedTheme(resolved);

    // Enable a brief, reduced-motion-aware color cross-fade only on change
    // (FR-002), then remove it so normal interactions never transition.
    const root = document.documentElement;
    root.classList.add("theme-transition");
    applyTheme(resolved);
    window.setTimeout(
      () => root.classList.remove("theme-transition"),
      THEME_TRANSITION_MS,
    );
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
