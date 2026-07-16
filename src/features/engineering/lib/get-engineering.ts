import {
  getContent,
  getContentSlugs,
  listContent,
  type ContentItem,
} from "@/content";
import { type Locale } from "@/shared/i18n/config";
import { buildToc, type TocItem } from "@/shared/lib/toc";

import { docGroups, type DocGroupKey } from "../content";

// Re-exported so existing consumers (the engineering barrel + DocToc) keep their
// import path; the implementation now lives in the shared toc util (DRY).
export { buildToc, type TocItem };

/** A validated engineering doc (frontmatter + raw MDX body). */
export type EngineeringDoc = ContentItem<"engineering">;
/** A validated development-journal entry. */
export type JournalEntry = ContentItem<"journey">;

/** All engineering docs for a locale, ordered (CONTENT_MODEL §2.4). */
export function getEngineeringDocs(locale: Locale): Promise<EngineeringDoc[]> {
  return listContent("engineering", locale);
}

/** One engineering doc by slug (with default-locale fallback). */
export function getEngineeringDoc(
  slug: string,
  locale: Locale,
): Promise<EngineeringDoc | null> {
  return getContent("engineering", slug, locale);
}

/** Every engineering-doc slug — feeds `generateStaticParams`. */
export function getEngineeringSlugs(): Promise<string[]> {
  return getContentSlugs("engineering");
}

/** All development-journal entries for a locale, newest first. */
export function getJournal(locale: Locale): Promise<JournalEntry[]> {
  return listContent("journey", locale);
}

export interface DocGroup {
  key: DocGroupKey;
  docs: EngineeringDoc[];
}

/**
 * Group the engineering docs into hub categories by `kind` (data shaping kept
 * out of the view). Empty groups are dropped so the hub only shows real
 * sections. Docs within a group keep the collection's `order`.
 */
export async function getGroupedDocs(locale: Locale): Promise<DocGroup[]> {
  const docs = await getEngineeringDocs(locale);
  return docGroups
    .map((group) => ({
      key: group.key,
      docs: docs.filter((doc) =>
        (group.kinds as readonly string[]).includes(doc.frontmatter.kind),
      ),
    }))
    .filter((group) => group.docs.length > 0);
}

/** Previous/next in the ordered doc list, for article paging. */
export async function getAdjacentDocs(
  slug: string,
  locale: Locale,
): Promise<{ prev: EngineeringDoc | null; next: EngineeringDoc | null }> {
  const all = await getEngineeringDocs(locale);
  const index = all.findIndex((doc) => doc.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (all[index - 1] ?? null) : null,
    next: index < all.length - 1 ? (all[index + 1] ?? null) : null,
  };
}

/** Localized long-form date (INTERNATIONALIZATION §formatting — `Intl`). */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
