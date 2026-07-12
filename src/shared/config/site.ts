/**
 * App-wide site configuration.
 *
 * Single source of truth for site-level metadata consumed by the root layout
 * and (later) the SEO layer (docs/engineering/SEO.md). Product-descriptive
 * values are drawn from docs/product/PROJECT_VISION.md and docs/product/BRAND.md;
 * none are invented here.
 */

/** Absolute site origin, used for canonical URLs and `metadataBase`. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohamedkamel.dev";

export const siteConfig = {
  /** Person / brand name. */
  name: "Mohamed Kamel",
  /** Default document title. */
  title: "Mohamed Kamel — Frontend Engineer",
  /** Concise, factual description (PROJECT_VISION.md / BRAND.md). */
  description:
    "Premium engineering portfolio demonstrating frontend architecture, " +
    "performance, accessibility, and AI product engineering.",
  /** Absolute origin. */
  url: siteUrl,
} as const;

export type SiteConfig = typeof siteConfig;
