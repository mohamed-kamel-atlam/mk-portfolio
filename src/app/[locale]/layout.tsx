import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { notFound } from "next/navigation";

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
import { ThemeProvider } from "@/shared/providers";

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

  // Self-canonical + hreflang alternates incl. x-default (INTERNATIONALIZATION §6).
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, `${siteConfig.url}/${code}`]),
  );
  languages["x-default"] = `${siteConfig.url}/${defaultLocale}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    icons: { icon: "/icon.svg" },
    alternates: {
      canonical: `${siteConfig.url}/${active}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url: `${siteConfig.url}/${active}`,
      locale: openGraphLocales[active],
      alternateLocale: locales
        .filter((code) => code !== active)
        .map((code) => openGraphLocales[code]),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8f8" },
  ],
  colorScheme: "dark light",
};

/**
 * Locale layout — the application root. It is the single place `lang` and `dir`
 * are set on the document (INTERNATIONALIZATION.md §4); everything below inherits
 * direction and localizes through logical CSS + server-loaded dictionaries. It
 * also owns the document shell, fonts, the pre-paint theme script, and the
 * theme provider. Passing Server-Component `children` keeps the tree server-first.
 */
export default async function LocaleLayout({
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {/* Pre-paint theme resolution — prevents a flash of the wrong theme
            (ADR-0005). Must run before hydration, hence a raw inline script. */}
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
