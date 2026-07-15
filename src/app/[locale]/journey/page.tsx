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

/**
 * Engineering Journey — the story of the evolution from AI student to systems-
 * minded frontend engineer, told year by year. A thin routing-layer composition:
 * hero, the milestone timeline, the mindset evolution, the projects that taught
 * the most, the honest challenges, the current focus and future roadmap, and a
 * closing CTA. Every section is a Server Component owning its own content; only
 * the scroll-reveal islands run on the client.
 */
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
