import GithubSlugger from "github-slugger";

import {
  getContent,
  getContentSlugs,
  listContent,
  type ContentItem,
} from "@/content";
import { type Locale } from "@/shared/i18n/config";

import { docGroups, type DocGroupKey } from "../content";

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

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Build the "On this page" table of contents from an MDX body's `##`/`###`
 * headings. Slugs are generated with `github-slugger` — the same library
 * `rehype-slug` uses — so the anchors match the ids emitted on the rendered
 * headings. Fenced code blocks are skipped.
 */
export function buildToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    const hashes = match?.[1];
    const rawText = match?.[2];
    if (!hashes || !rawText) continue;

    const level = hashes.length as 2 | 3;
    // Strip inline markdown so the slug matches rendered text content.
    const text = rawText.replace(/[`*_]/g, "").trim();
    items.push({ id: slugger.slug(text), text, level });
  }

  return items;
}

/** Localized long-form date (INTERNATIONALIZATION §formatting — `Intl`). */
export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
