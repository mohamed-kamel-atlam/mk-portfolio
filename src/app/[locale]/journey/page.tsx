import type { Metadata } from "next";

import {
  ChallengesLessons,
  EngineeringEvolution,
  FutureRoadmap,
  JourneyCta,
  JourneyCurrentFocus,
  JourneyHero,
  JourneyProjects,
  JourneyTimeline,
} from "@/features/journey";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";

interface JourneyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: JourneyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const meta = (await getDictionary(active)).journey.meta;
  return buildRouteMetadata({
    locale: active,
    path: "/journey",
    title: meta.title,
    description: meta.description,
  });
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <JourneyHero locale={active} />
      <JourneyTimeline locale={active} />
      <EngineeringEvolution locale={active} />
      <JourneyProjects locale={active} />
      <ChallengesLessons locale={active} />
      <JourneyCurrentFocus locale={active} />
      <FutureRoadmap locale={active} />
      <JourneyCta locale={active} />
    </>
  );
}
