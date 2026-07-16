import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/shared/constants/theme";

export function getThemeInitScript(): string {
  return `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY,
  )};var p=localStorage.getItem(k)||${JSON.stringify(
    DEFAULT_THEME,
  )};var r=p==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.dataset.theme=r;}catch(e){}})();`;
}
