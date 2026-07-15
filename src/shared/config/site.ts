/**
 * App-wide site configuration.
 *
 * Single source of truth for site-level metadata, the navigation structure, and
 * social links (FOLDER_STRUCTURE.md §4). Product-descriptive values are drawn
 * from docs/product/PROJECT_VISION.md and docs/product/BRAND.md; none invented.
 */

/** Absolute site origin, used for canonical URLs and `metadataBase`. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohamedkamel.dev";

export const siteConfig = {
  name: "Mohamed Kamel",
  title: "Mohamed Kamel — Frontend Engineer",
  description:
    "Premium engineering portfolio demonstrating frontend architecture, " +
    "performance, accessibility, and AI product engineering.",
  url: siteUrl,
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Navigation is data-driven: this one list feeds the desktop navbar, the mobile
 * menu, and the footer, so links are never duplicated (Task-08 rule). `key`
 * indexes the localized label in the `nav` dictionary namespace; `path` is the
 * locale-agnostic route appended to the active locale via `localizedHref`.
 * Adding a route is a single entry here (+ its label + its page).
 */
export type NavKey =
  "home" | "about" | "projects" | "engineering" | "journey" | "contact";

export interface NavItem {
  key: NavKey;
  /** Route relative to the locale root; "" is the home page. */
  path: string;
}

export const mainNav: readonly NavItem[] = [
  { key: "home", path: "" },
  { key: "about", path: "/about" },
  { key: "projects", path: "/projects" },
  { key: "engineering", path: "/engineering" },
  { key: "journey", path: "/journey" },
  { key: "contact", path: "/contact" },
] as const;

// Social configuration lives in its own module for scalability; re-exported here
// so `@/shared/config/site` remains the one config entry point (no consumer churn).
export {
  socialLinks,
  SOCIAL_LABELS,
  type SocialLink,
  type SocialKey,
  type SocialPlatform,
} from "./social";
