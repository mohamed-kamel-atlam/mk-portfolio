import type { Theme } from "@/shared/types/theme";

/** All selectable preferences, in toggle order. */
export const THEMES = [
  "light",
  "dark",
  "system",
] as const satisfies readonly Theme[];

/** localStorage key holding the persisted preference. */
export const THEME_STORAGE_KEY = "mk-theme";

export const DEFAULT_THEME: Theme = "dark";

export const THEME_TRANSITION_MS = 200;
