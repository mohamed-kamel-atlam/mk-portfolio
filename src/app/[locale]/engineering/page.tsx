import type { Metadata } from "next";

import {
  DocDirectory,
  EngineeringHubIntro,
  JournalTimeline,
} from "@/features/engineering";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";

interface EngineeringPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: EngineeringPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const meta = (await getDictionary(active)).engineering.meta;
  return buildRouteMetadata({
    locale: active,
    path: "/engineering",
    title: meta.title,
    description: meta.description,
  });
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
