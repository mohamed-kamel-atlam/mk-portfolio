import { SPLASH_STORAGE_KEY } from "@/shared/constants/splash";

/**
 * Tiny synchronous script that marks a **first visit** before first paint, by
 * setting `data-splash` on `<html>` only when the "visited" flag is absent
 * (mirrors {@link getThemeInitScript}). CSS shows the splash overlay solely when
 * that attribute is present, so returning visitors never flash the splash and no
 * client JS is needed to decide visibility. Inlined via `dangerouslySetInnerHTML`
 * in the root layout so it runs ahead of hydration; touches only one attribute.
 */
export function getSplashInitScript(): string {
  return `(function(){try{if(!localStorage.getItem(${JSON.stringify(
    SPLASH_STORAGE_KEY,
  )})){document.documentElement.setAttribute("data-splash","");}}catch(e){}})();`;
}
