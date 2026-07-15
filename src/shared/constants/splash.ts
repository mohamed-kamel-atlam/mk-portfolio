/**
 * Splash-screen constants. The `localStorage` flag makes the splash a
 * once-per-browser first-visit moment: present ⇒ already visited ⇒ never shown
 * again unless the user clears storage.
 */
export const SPLASH_STORAGE_KEY = "mk:visited";

/** Minimum visible time (ms) so the brand moment reads; reduced-motion is short. */
export const SPLASH_MIN_MS = 1600;
export const SPLASH_MIN_MS_REDUCED = 500;
/** Hard cap so the splash can never block the app. */
export const SPLASH_MAX_MS = 2500;
