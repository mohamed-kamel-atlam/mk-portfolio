/**
 * Locale configuration.
 *
 * Declares the supported locales, the default, and their writing direction.
 * This is configuration only — the locale *routing mechanism* (the `[locale]`
 * segment, dictionaries, detection) is introduced at M2 and governed by
 * docs/engineering/INTERNATIONALIZATION.md and ADR-0004. English is the default
 * (LTR); Arabic is RTL (docs/product/PRODUCT_REQUIREMENTS.md → FR-001).
 */

export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};
