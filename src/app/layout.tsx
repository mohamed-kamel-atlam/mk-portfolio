import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { defaultLocale, localeDirection } from "@/shared/config/i18n";
import { siteConfig } from "@/shared/config/site";

import "./globals.css";

/**
 * Base metadata for the whole application. Route-level and localized metadata,
 * Open Graph images, and structured data are layered on at M5
 * (docs/engineering/SEO.md); this establishes the foundation only.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  // Dark-first: the browser UI matches the default theme before paint.
  //
  // Documented exception to "tokens over hardcoding": the browser `theme-color`
  // meta tag requires a literal color and cannot read a CSS custom property.
  // These two values MUST mirror the background tokens in globals.css —
  // dark `--neutral-950` (#0B0D0F) and light `--neutral-50` (#F7F8F8),
  // per docs/design/COLOR_SYSTEM.md §3. Update both together.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8f8" },
  ],
  colorScheme: "dark light",
};

/**
 * Root layout — the routing layer's outermost frame.
 *
 * Owns the document shell, font variables, and global styles only. Locale/RTL
 * resolution moves into the `[locale]` segment at M2 (FOLDER_STRUCTURE.md §2.1,
 * INTERNATIONALIZATION.md); until then the document uses the default locale.
 * The theme is fixed to dark (the primary theme); the persisted, flash-free
 * theme switch is introduced with ADR-0005's implementation.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={defaultLocale}
      dir={localeDirection[defaultLocale]}
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
