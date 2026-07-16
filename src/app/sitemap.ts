import type { MetadataRoute } from "next";

import { listContent } from "@/content";
import { siteConfig } from "@/shared/config/site";
import { defaultLocale, locales } from "@/shared/i18n/config";
import { localeAlternates } from "@/shared/lib/seo";

const STATIC_PATHS = [
  "",
  "/about",
  "/projects",
  "/engineering",
  "/journey",
  "/contact",
] as const;

function priorityFor(path: string): number {
  if (path === "") return 1;
  return path.split("/").length > 2 ? 0.6 : 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, engineering] = await Promise.all([
    listContent("projects", defaultLocale),
    listContent("engineering", defaultLocale),
  ]);

  const entries: { path: string; lastModified?: string }[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...projects.map((p) => ({
      path: `/projects/${p.slug}`,
      lastModified: p.frontmatter.date,
    })),
    ...engineering.map((d) => ({
      path: `/engineering/${d.slug}`,
      lastModified: d.frontmatter.date,
    })),
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${entry.path}`,
      lastModified: entry.lastModified,
      alternates: { languages: localeAlternates(entry.path) },
      changeFrequency: entry.path === "" ? "weekly" : "monthly",
      priority: priorityFor(entry.path),
    })),
  );
}
