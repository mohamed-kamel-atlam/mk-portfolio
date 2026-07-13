import { listContent, type ContentItem } from "@/content";
import { type Locale } from "@/shared/i18n/config";

/** A validated experience entry (CONTENT_MODEL §3.5), typed from the schema. */
export type Experience = ContentItem<"experience">;

/**
 * All experience entries for a locale, ordered (most significant first via the
 * `order` field). Sourced from the Content layer so experience is data, not
 * hardcoded markup — the same engine that powers projects. Untranslated entries
 * fall back to the default locale per item (MDX_PIPELINE §8).
 */
export async function getExperience(locale: Locale): Promise<Experience[]> {
  return listContent("experience", locale);
}

/**
 * Localized period label from a start/optional-end ISO date, at year
 * granularity (INTERNATIONALIZATION §formatting — dates via `Intl`). An open
 * range (no end date) reads as "current" using the passed, localized label.
 */
export function formatPeriod(
  locale: Locale,
  startDate: string,
  endDate: string | undefined,
  presentLabel: string,
): string {
  const yearOf = (iso: string): string =>
    new Intl.DateTimeFormat(locale, { year: "numeric" }).format(new Date(iso));

  const start = yearOf(startDate);
  if (!endDate) return `${start} – ${presentLabel}`;
  const end = yearOf(endDate);
  return start === end ? start : `${start} – ${end}`;
}
