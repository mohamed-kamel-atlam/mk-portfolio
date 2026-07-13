import type { Metadata } from "next";

import {
  DocDirectory,
  EngineeringHubIntro,
  JournalTimeline,
} from "@/features/engineering";
import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  isLocale,
  locales,
  openGraphLocales,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

interface EngineeringPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: EngineeringPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const meta = t.engineering.meta;

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, `${siteConfig.url}/${code}/engineering`]),
  );
  languages["x-default"] = `${siteConfig.url}/${defaultLocale}/engineering`;
  const canonical = `${siteConfig.url}/${active}/engineering`;
  const socialTitle = `${meta.title} — ${siteConfig.name}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      title: socialTitle,
      description: meta.description,
      url: canonical,
      locale: openGraphLocales[active],
    },
    twitter: { title: socialTitle, description: meta.description },
  };
}

/**
 * Engineering Hub (FR-006). A thin routing-layer composition: the hero, the
 * grouped MDX-driven doc directory, and the development journal. Each section is
 * a Server Component that loads its own content from the Content layer.
 */
export default async function EngineeringPage({
  params,
}: EngineeringPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <EngineeringHubIntro locale={active} />
      <DocDirectory locale={active} />
      <JournalTimeline locale={active} />
    </>
  );
}
