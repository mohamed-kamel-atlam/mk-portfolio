/**
 * Internationalization configuration — the single source of truth for locales
 * (INTERNATIONALIZATION.md §2). Every subsystem (routing, middleware, metadata,
 * the switcher, the future sitemap) reads from here; none re-declares the list.
 * Adding a locale is a change here plus its dictionary, not a cross-cutting edit.
 */

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

/** English is the default and the SEO `x-default` (INTERNATIONALIZATION.md §10). */
export const defaultLocale: Locale = "en";

/** Endonym per locale (each language's own name), shown in the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/** OpenGraph BCP-47 locale tags. */
export const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AR",
};

/** Cookie holding the persisted language override (a redirect hint only — §7). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Document direction, a pure function of the locale (INTERNATIONALIZATION.md §4). */
export function direction(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Type guard: is an arbitrary string one of the supported locales? */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
