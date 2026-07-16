import { listContent, type ContentItem } from "@/content";
import { type Locale } from "@/shared/i18n/config";

/** A validated experience entry (CONTENT_MODEL §3.5), typed from the schema. */
export type Experience = ContentItem<"experience">;

export async function getExperience(locale: Locale): Promise<Experience[]> {
  return listContent("experience", locale);
}

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
