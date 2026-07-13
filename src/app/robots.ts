import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/config/site";

/**
 * robots.txt (SEO.md) — generated from the single site-origin source of truth.
 * The whole site is indexable (no private areas); crawlers are pointed at the
 * sitemap and the canonical host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
