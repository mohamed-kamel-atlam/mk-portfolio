import type { Metadata } from "next";

import {
  AboutExperience,
  AboutIntro,
  CoreValues,
  CurrentFocus,
  EngineeringMindset,
  FutureGoals,
  PersonJsonLd,
  SkillsOverview,
  WorkingPrinciples,
} from "@/features/about";
import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  isLocale,
  locales,
  openGraphLocales,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const meta = t.about.meta;

  // Self-canonical + hreflang alternates incl. x-default (SEO.md §6).
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, `${siteConfig.url}/${code}/about`]),
  );
  languages["x-default"] = `${siteConfig.url}/${defaultLocale}/about`;
  const canonical = `${siteConfig.url}/${active}/about`;
  // OG/Twitter titles don't inherit the document-title template, so compose the
  // full title here; the document `title` keeps using the parent template.
  const socialTitle = `${meta.title} — ${siteConfig.name}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "profile",
      title: socialTitle,
      description: meta.description,
      url: canonical,
      locale: openGraphLocales[active],
    },
    twitter: { title: socialTitle, description: meta.description },
  };
}

/**
 * About & Experience (FR-004). A thin routing-layer composition: it resolves the
 * locale and assembles the about feature's sections in narrative order. Each is
 * a Server Component owning its own content and layout; `PersonJsonLd` emits the
 * site's identity structured data.
 */
export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <PersonJsonLd locale={active} />
      <AboutIntro locale={active} />
      <EngineeringMindset locale={active} />
      <AboutExperience locale={active} />
      <SkillsOverview locale={active} />
      <CoreValues locale={active} />
      <WorkingPrinciples locale={active} />
      <CurrentFocus locale={active} />
      <FutureGoals locale={active} />
    </>
  );
}
