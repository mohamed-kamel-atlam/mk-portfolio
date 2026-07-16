import {
  AiWorkflowPreview,
  EngineeringPhilosophy,
  ExperienceTimeline,
  FeaturedProjects,
  FinalCta,
  Hero,
  TechStack,
} from "@/features/home";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { websiteJsonLd } from "@/shared/lib/structured-data";
import { JsonLd } from "@/shared/ui";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Landing page (FR-003). A thin routing-layer composition: it resolves the
 * locale and assembles the home feature's sections in narrative order. Each
 * section is a Server Component and owns its own content and layout.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <JsonLd data={websiteJsonLd(active)} />
      <Hero locale={active} />
      <FeaturedProjects locale={active} />
      <TechStack locale={active} />
      <ExperienceTimeline locale={active} />
      <EngineeringPhilosophy locale={active} />
      <AiWorkflowPreview locale={active} />
      <FinalCta locale={active} />
    </>
  );
}
