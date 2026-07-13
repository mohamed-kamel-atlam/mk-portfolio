import { ImageResponse } from "next/og";

import { siteConfig } from "@/shared/config/site";
import { locales } from "@/shared/i18n/config";

/** Prebuild the image per locale at build time (static, not on-demand). */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Default social share image (1200×630) for every route under `[locale]`
 * (SEO.md §4). A branded card built with `next/og` at build time — no binary
 * asset to maintain. Colors are resolved token literals (Satori cannot read CSS
 * variables): background neutral-950, foreground neutral-50, accent-500.
 * Text is the (Latin) brand name, so it renders consistently in both locales
 * while the page's title/description/og:locale carry the localization.
 */
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0b0d0f",
        color: "#f7f8f8",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "88px",
            height: "88px",
            borderRadius: "20px",
            backgroundColor: "#14171a",
            fontSize: "46px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#5b7cfa" }}>M</span>
          <span>K</span>
        </div>
        <span style={{ fontSize: "30px", color: "#8a9099" }}>
          mohamedkamel.dev
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            fontSize: "88px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          Mohamed Kamel
        </div>
        <div style={{ fontSize: "42px", color: "#8a9099" }}>
          Frontend Engineer · Premium AI products
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "30px",
          color: "#8a9099",
        }}
      >
        <span
          style={{
            display: "flex",
            width: "16px",
            height: "16px",
            borderRadius: "9999px",
            backgroundColor: "#5b7cfa",
          }}
        />
        <span>Architecture · Performance · Accessibility</span>
      </div>
    </div>,
    { ...size },
  );
}
