import type { Theme } from "@/shared/types/theme";

/**
 * Theme constants. `satisfies` keeps the runtime list in lockstep with the
 * `Theme` union in `@/shared/types/theme` — add a mode there and this fails to
 * compile until updated.
 */

/** All selectable preferences, in toggle order. */
export const THEMES = [
  "light",
  "dark",
  "system",
] as const satisfies readonly Theme[];

/** localStorage key holding the persisted preference. */
export const THEME_STORAGE_KEY = "mk-theme";

/**
 * Default when nothing is persisted. **Dark**, per ADR-0005 → Decision
 * ("Dark as the default"), preserving the dark-first first impression the brand
 * targets. `system` and `light` remain explicitly selectable via the toggle.
 */
export const DEFAULT_THEME: Theme = "dark";

/**
 * Duration (ms) of the on-change color cross-fade. Mirrors `--duration-normal`
 * (MOTION_GUIDELINES.md); kept here because JS cannot read the CSS token
 * directly. Update both together if the token changes.
 */
export const THEME_TRANSITION_MS = 200;
