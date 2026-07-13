import type { Metadata } from "next";

import { getProjects, ProjectsGrid } from "@/features/projects";
import { siteConfig } from "@/shared/config/site";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  return {
    title: t.projectsPage.title,
    description: t.projectsPage.intro,
    alternates: { canonical: `${siteConfig.url}/${active}/projects` },
  };
}

/** Projects index — the engineering-story showcase (FR-005). */
export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const projects = await getProjects(active);

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Heading level={1} size="h1">
            {t.projectsPage.title}
          </Heading>
          <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
            {t.projectsPage.intro}
          </Text>
        </div>
        <ProjectsGrid projects={projects} locale={active} />
      </Container>
    </Section>
  );
}
