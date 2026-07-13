import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  localizedHref,
  locales,
  openGraphLocales,
} from "@/shared/i18n/config";

import type { ContentItem, ContentType } from "./schema";

/**
 * Build per-item, per-locale metadata from a content item's frontmatter
 * (MDX_PIPELINE §8: localized SEO). `seo` overrides fall back to title/summary.
 * The route-level SEO contract (OG images, structured data) is layered on at M5
 * per SEO.md; this covers the localized title/description/canonical.
 */
export function buildContentMetadata<T extends ContentType>(
  item: ContentItem<T>,
  routePath: string,
): Metadata {
  const { frontmatter, locale } = item;
  const title = frontmatter.seo?.title ?? frontmatter.title;
  const description = frontmatter.seo?.description ?? frontmatter.summary;
  const url = `${siteConfig.url}${localizedHref(locale, routePath)}`;

  // Content slugs are locale-invariant, so hreflang alternates map cleanly to
  // the same route per locale, incl. x-default (SEO.md §6).
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [
      code,
      `${siteConfig.url}${localizedHref(code, routePath)}`,
    ]),
  );
  languages["x-default"] =
    `${siteConfig.url}${localizedHref(defaultLocale, routePath)}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
    },
  };
}
