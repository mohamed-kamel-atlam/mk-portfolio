import type { Metadata } from "next";

import {
  AboutCta,
  AboutExperience,
  AboutIntro,
  CoreValues,
  EngineeringPhilosophy,
  FunFacts,
  MyProcess,
  PersonJsonLd,
  TechStack,
} from "@/features/about";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const meta = (await getDictionary(active)).about.meta;
  return buildRouteMetadata({
    locale: active,
    path: "/about",
    title: meta.title,
    description: meta.description,
    ogType: "profile",
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <PersonJsonLd locale={active} />
      <AboutIntro locale={active} />
      <EngineeringPhilosophy locale={active} />
      <MyProcess locale={active} />
      <TechStack locale={active} />
      <AboutExperience locale={active} />
      <CoreValues locale={active} />
      <FunFacts locale={active} />
      <AboutCta locale={active} />
    </>
  );
}
