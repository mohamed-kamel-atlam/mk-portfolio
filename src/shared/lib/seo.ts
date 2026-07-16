import type { Metadata } from "next";

import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  locales,
  openGraphLocales,
  type Locale,
} from "@/shared/i18n/config";

/** hreflang alternates for a locale-agnostic path (all locales + `x-default`). */
export function localeAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${siteConfig.url}/${locale}${path}`;
  }
  languages["x-default"] = `${siteConfig.url}/${defaultLocale}${path}`;
  return languages;
}

export function socialImage(locale: Locale, kind: "opengraph" | "twitter") {
  return {
    url: `/${locale}/${kind}-image`,
    width: 1200,
    height: 630,
    alt: siteConfig.title,
  };
}

export interface RouteMetadataInput {
  locale: Locale;
  /** Locale-agnostic route path, e.g. `/about` (`""` for home). */
  path: string;
  /** Page title (the document title template adds the site name). */
  title: string;
  description: string;
  ogType?: "website" | "profile" | "article";
}

/** Complete, consistent metadata for a localized route. */
export function buildRouteMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
}: RouteMetadataInput): Metadata {
  const canonical = `${siteConfig.url}/${locale}${path}`;
  // OG/Twitter titles don't inherit the document-title template, so compose the
  // full title here; the document `title` keeps using the parent template.
  const socialTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical, languages: localeAlternates(path) },
    openGraph: {
      type: ogType,
      title: socialTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) => openGraphLocales[code]),
      images: [socialImage(locale, "opengraph")],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage(locale, "twitter")],
    },
  };
}
