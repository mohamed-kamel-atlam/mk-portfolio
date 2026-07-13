import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { fontVariables } from "@/shared/config/fonts";
import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  direction,
  isLocale,
  locales,
  openGraphLocales,
  type Locale,
} from "@/shared/i18n/config";
import { getThemeInitScript } from "@/shared/lib/theme-script";
import { localeAlternates } from "@/shared/lib/seo";
import { AppProviders } from "@/shared/providers";
import { ScrollProgress, SiteFooter, SiteHeader } from "@/shared/ui";
import { ThemeBackground } from "@/shared/ui/background";

import "../globals.css";

interface LocaleParams {
  locale: string;
}

/** One static tree per locale (INTERNATIONALIZATION.md §3.2). */
export function generateStaticParams(): LocaleParams[] {
  return locales.map((locale) => ({ locale }));
}

/** Only the supported locales are valid; any other first segment 404s. */
export const dynamicParams = false;

/**
 * Base, per-locale SEO. This is the *foundation* — a self-canonical, full
 * `hreflang` set, Open Graph, Twitter card, and crawl directives. The complete
 * per-route metadata, structured data, and generated OG images are layered on at
 * M5 (SEO.md); route segments extend or override this via their own
 * `generateMetadata`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    icons: { icon: "/icon.svg", apple: "/apple-icon" },
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `${siteConfig.url}/${active}`,
      languages: localeAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      url: `${siteConfig.url}/${active}`,
      locale: openGraphLocales[active],
      alternateLocale: locales
        .filter((code) => code !== active)
        .map((code) => openGraphLocales[code]),
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
  };
}

export const viewport: Viewport = {
  // Match the resolved canvas tokens: deep navy (dark) / warm off-white (light).
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#081423" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
  colorScheme: "dark light",
};

/**
 * Root layout — the application shell.
 *
 * It is the single place `lang` and `dir` are set on the document
 * (INTERNATIONALIZATION.md §4), and it owns the document shell, fonts, global
 * styles, the pre-paint theme script, and the provider mount point. Because
 * `<html lang/dir>` must know the locale, the App Router root layout lives at
 * this `[locale]` segment (the Next.js i18n pattern) rather than a locale-blind
 * `app/layout.tsx`.
 *
 * It is a **Server Component** that renders only the shell and passes
 * Server-Component `children` through {@link AppProviders} (the sole client
 * boundary). Route segments below stream by default under the App Router's RSC
 * model; each segment adds its own `loading` / `error` boundary when built. The
 * body is intentionally a thin shell so a future header/`<main>`/footer
 * (M3) slots in around `{children}` without touching this file's concerns.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      data-theme="dark"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        {/* Pre-paint theme resolution — prevents a flash of the wrong theme
            (ADR-0005). Must run before hydration, hence a raw inline script. */}
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        {/* Global ambient backdrop (fixed, behind all content). */}
        <ThemeBackground />
        <AppProviders>
          <SiteHeader locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} />
          <ScrollProgress />
        </AppProviders>
      </body>
    </html>
  );
}
