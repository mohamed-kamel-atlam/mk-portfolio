import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";
import { localizedHref, locales, openGraphLocales } from "@/shared/i18n/config";
import { localeAlternates, socialImage } from "@/shared/lib/seo";

import type { ContentItem, ContentType } from "./schema";

export function buildContentMetadata<T extends ContentType>(
  item: ContentItem<T>,
  routePath: string,
): Metadata {
  const { frontmatter, locale } = item;
  const title = frontmatter.seo?.title ?? frontmatter.title;
  const description = frontmatter.seo?.description ?? frontmatter.summary;
  const url = `${siteConfig.url}${localizedHref(locale, routePath)}`;

  // An author-provided OG image wins; otherwise fall back to the branded card.
  const ogImage = frontmatter.seo?.ogImage
    ? { url: frontmatter.seo.ogImage, width: 1200, height: 630, alt: title }
    : socialImage(locale, "opengraph");

  return {
    title,
    description,
    // Content slugs are locale-invariant, so hreflang alternates map cleanly to
    // the same route per locale, incl. x-default (SEO.md §6).
    alternates: { canonical: url, languages: localeAlternates(routePath) },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) => openGraphLocales[code]),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [frontmatter.seo?.ogImage ?? socialImage(locale, "twitter")],
    },
  };
}
