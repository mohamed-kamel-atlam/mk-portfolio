import { cache } from "react";

import { defaultLocale, type Locale } from "@/shared/i18n/config";

import { loadCollection } from "./loader";
import type { ContentItem, ContentType } from "./schema";

/** Order by explicit `order` (ascending), then by `date` descending (§2.4). */
function sortItems<T extends ContentType>(
  items: ContentItem<T>[],
): ContentItem<T>[] {
  return [...items].sort((a, b) => {
    const ao = a.frontmatter.order;
    const bo = b.frontmatter.order;
    if (ao !== undefined && bo !== undefined) return ao - bo;
    if (ao !== undefined) return -1;
    if (bo !== undefined) return 1;
    return b.frontmatter.date.localeCompare(a.frontmatter.date);
  });
}

export async function listContent<T extends ContentType>(
  type: T,
  locale: Locale,
): Promise<ContentItem<T>[]> {
  const all = (await loadCollection(type)).filter((e) => !e.frontmatter.draft);
  const slugs = [...new Set(all.map((e) => e.slug))];
  const items = slugs
    .map((slug) => {
      const forSlug = all.filter((e) => e.slug === slug);
      return (
        forSlug.find((e) => e.locale === locale) ??
        forSlug.find((e) => e.locale === defaultLocale) ??
        forSlug[0]
      );
    })
    .filter((e): e is ContentItem<T> => e !== undefined);
  return sortItems(items);
}

/** Featured members of a collection (`frontmatter.featured === true`). */
export async function featuredContent<T extends ContentType>(
  type: T,
  locale: Locale,
): Promise<ContentItem<T>[]> {
  return (await listContent(type, locale)).filter(
    (e) => e.frontmatter.featured,
  );
}

/** One item by slug + locale, falling back to the default locale (MDX_PIPELINE §8). */
export async function getContent<T extends ContentType>(
  type: T,
  slug: string,
  locale: Locale,
): Promise<ContentItem<T> | null> {
  const all = await loadCollection(type);
  const exact = all.find(
    (e) => e.slug === slug && e.locale === locale && !e.frontmatter.draft,
  );
  if (exact) return exact;
  const fallback = all.find(
    (e) =>
      e.slug === slug && e.locale === defaultLocale && !e.frontmatter.draft,
  );
  return fallback ?? null;
}

/** Distinct slugs for a type — feeds `generateStaticParams` (MDX_PIPELINE §7). */
export const getContentSlugs = cache(
  async (type: ContentType): Promise<string[]> => {
    const all = await loadCollection(type);
    return [...new Set(all.map((e) => e.slug))];
  },
);

export { buildContentMetadata } from "./metadata";
export type {
  ContentItem,
  ContentType,
  FrontmatterOf,
  ProjectFrontmatter,
  CaseStudyFrontmatter,
  ArticleFrontmatter,
  JourneyEntryFrontmatter,
  ExperienceFrontmatter,
  EngineeringDocFrontmatter,
} from "./schema";
