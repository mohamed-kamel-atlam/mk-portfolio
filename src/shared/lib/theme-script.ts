import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/shared/constants/theme";

/**
 * Builds the tiny, synchronous script that resolves and applies the theme on
 * `<html>` **before first paint**, eliminating a flash of the wrong theme
 * (ADR-0005). It reads the persisted preference (falling back to the default),
 * resolves `system` against the OS `prefers-color-scheme`, and sets
 * `data-theme` — after which the CSS custom-property tokens do all the work.
 *
 * This is the single deliberate blocking script in the app: it must run ahead
 * of hydration, so it is inlined via `dangerouslySetInnerHTML` in the root
 * layout rather than loaded as a module. It touches only `data-theme`, keeping
 * the client cost near zero.
 */
export function getThemeInitScript(): string {
  return `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var p=localStorage.getItem(k)||${JSON.stringify(
    DEFAULT_THEME,
  )};var r=p==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.dataset.theme=r;}catch(e){}})();`;
}
