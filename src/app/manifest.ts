import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/config/site";
import { defaultLocale } from "@/shared/i18n/config";

/**
 * Web app manifest (SEO.md). Colors are the resolved dark-theme token values
 * (`--color-background` = navy-900) — literals are required here since a
 * manifest cannot read CSS variables; kept in sync with globals.css and the
 * root `viewport.themeColor`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#081423",
    theme_color: "#081423",
    lang: defaultLocale,
    dir: "ltr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
