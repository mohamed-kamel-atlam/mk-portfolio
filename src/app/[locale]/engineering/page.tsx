import type { Metadata } from "next";

import {
  AccessibilityApproach,
  AiAssisted,
  ArchitectureThinking,
  BuildWorkflow,
  DesignSystemApproach,
  DocDirectory,
  EngineeringCta,
  EngineeringDecisions,
  EngineeringHubIntro,
  EngineeringPrinciples,
  EngineeringTools,
  JournalTimeline,
  PerformancePhilosophy,
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
 * Engineering Hub (FR-006) — the portfolio's technical front door. A thin
 * routing-layer composition: the mindset hero, the architecture/build workflow,
 * the performance/accessibility/design-system/AI overviews (each linking into
 * its deep-dive MDX doc), the tools, principles, and ADR-style decisions, then
 * the doc directory + development journal, closing on a CTA. Every section is a
 * Server Component that owns its own content and layout.
 */
export default async function EngineeringPage({
  params,
}: EngineeringPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <EngineeringHubIntro locale={active} />
      <ArchitectureThinking locale={active} />
      <BuildWorkflow locale={active} />
      <PerformancePhilosophy locale={active} />
      <AccessibilityApproach locale={active} />
      <DesignSystemApproach locale={active} />
      <AiAssisted locale={active} />
      <EngineeringTools locale={active} />
      <EngineeringPrinciples locale={active} />
      <EngineeringDecisions locale={active} />
      <DocDirectory locale={active} />
      <JournalTimeline locale={active} />
      <EngineeringCta locale={active} />
    </>
  );
}
