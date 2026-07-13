import {
  getContent,
  getContentSlugs,
  listContent,
  type ContentItem,
} from "@/content";
import type { Locale } from "@/shared/i18n/config";

/** A project content item (frontmatter + raw MDX body). */
export type Project = ContentItem<"projects">;

/** All projects for a locale, ordered (CONTENT_MODEL §2.4). */
export function getProjects(locale: Locale): Promise<Project[]> {
  return listContent("projects", locale);
}

/** One project by slug (with default-locale fallback). */
export function getProject(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  return getContent("projects", slug, locale);
}

/** Every project slug — feeds `generateStaticParams`. */
export function getProjectSlugs(): Promise<string[]> {
  return getContentSlugs("projects");
}

/** Other projects to surface alongside the current one. */
export async function getRelatedProjects(
  slug: string,
  locale: Locale,
  limit = 2,
): Promise<Project[]> {
  const all = await getProjects(locale);
  return all.filter((project) => project.slug !== slug).slice(0, limit);
}

/** Previous/next in the ordered list, for detail-page paging. */
export async function getAdjacentProjects(
  slug: string,
  locale: Locale,
): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getProjects(locale);
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? (all[index - 1] ?? null) : null,
    next: index < all.length - 1 ? (all[index + 1] ?? null) : null,
  };
}
