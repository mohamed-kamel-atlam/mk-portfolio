import { type Locale } from "./config";
import enCommon from "./dictionaries/en/common.json";

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

function isNamespace(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Merge a localized dictionary over the `en` base, one namespace level deep. */
function mergeWithFallback(
  base: Dictionary,
  override: Partial<Dictionary>,
): Dictionary {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = (base as Record<string, unknown>)[key];
    result[key] =
      isNamespace(baseValue) && isNamespace(value)
        ? { ...baseValue, ...value }
        : value;
  }
  return result as Dictionary;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const localized = await loaders[locale]();
  return mergeWithFallback(enCommon, localized);
}
