import { siteConfig } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";

/**
 * Structured-data (JSON-LD) builders (SEO.md §5). Centralized so every page
 * emits schema.org data consistently — same origin, same identity, same URL
 * construction — instead of hand-assembling objects per route. The primary
 * entity is a {@link Person} (this is a personal site); `WebSite` describes the
 * site itself and `BreadcrumbList` gives nested pages their trail.
 */

/** `WebSite` schema — the site entity, published by the person. */
export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.title,
    url: `${siteConfig.url}/${locale}`,
    inLanguage: locale,
    publisher: { "@type": "Person", name: siteConfig.name },
  } as const;
}

/** One breadcrumb hop — a localized `name` and a locale-agnostic `path`. */
export interface BreadcrumbCrumb {
  name: string;
  /** Route path relative to the locale root; `""` is home. */
  path: string;
}

/** `BreadcrumbList` schema — the navigational trail to the current page. */
export function breadcrumbJsonLd(locale: Locale, crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${localizedHref(locale, crumb.path)}`,
    })),
  };
}
