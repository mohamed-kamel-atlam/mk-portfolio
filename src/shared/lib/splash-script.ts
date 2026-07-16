import { SPLASH_STORAGE_KEY } from "@/shared/constants/splash";

export function getSplashInitScript(): string {
  return `(function(){try{if(!localStorage.getItem(${JSON.stringify(
    SPLASH_STORAGE_KEY,
  )})){document.documentElement.setAttribute("data-splash","");}}catch(e){}})();`;
}
