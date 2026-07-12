import { type Locale } from "./config";
import enCommon from "./dictionaries/en/common.json";

/**
 * The dictionary shape is the canonical `en` key set (INTERNATIONALIZATION.md
 * §5). Other locales are validated against it, and missing keys fall back to
 * `en` (§2) so a partially translated build degrades gracefully.
 */
export type Dictionary = typeof enCommon;

// Non-`en` dictionaries are dynamically imported so only the active locale's
// strings are pulled into the server render. Add a locale here + its folder.
const loaders: Record<Locale, () => Promise<Partial<Dictionary>>> = {
  en: () => Promise.resolve(enCommon),
  ar: () =>
    import("./dictionaries/ar/common.json").then(
      (module) => module.default as Partial<Dictionary>,
    ),
};

/**
 * Resolve the `common` dictionary for a locale — **server-only** (called from
 * Server Components / metadata). Because it runs on the server, localized text
 * ships as HTML with no dictionary or translation runtime on the client (QAT-1,
 * server-first). Missing keys fall back to `en`.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const localized = await loaders[locale]();
  return { ...enCommon, ...localized };
}
