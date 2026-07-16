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
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { localeAlternates } from "@/shared/lib/seo";
import { getSplashInitScript } from "@/shared/lib/splash-script";
import { getThemeInitScript } from "@/shared/lib/theme-script";
import { AppProviders } from "@/shared/providers";
import { RouteProgress, SiteFooter, SiteHeader, Splash } from "@/shared/ui";
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      data-theme="dark"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        {/* Pre-paint scripts (run before hydration): resolve theme (ADR-0005)
            and flag a first visit for the splash. Both touch only an attribute. */}
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <script dangerouslySetInnerHTML={{ __html: getSplashInitScript() }} />
        {/* Navigation progress bar (client) + global ambient backdrop (fixed). */}
        <RouteProgress />
        <ThemeBackground />
        <AppProviders>
          <SiteHeader locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </AppProviders>
        {/* First-visit splash — CSS-gated by `data-splash`; client drives timing. */}
        <Splash messages={t.splash.messages} loadingLabel={t.splash.loading} />
      </body>
    </html>
  );
}
