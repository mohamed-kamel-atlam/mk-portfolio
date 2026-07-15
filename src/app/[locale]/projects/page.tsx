import type { Metadata } from "next";

import {
  buildProjectCardLabels,
  getProjects,
  ProjectsGrid,
} from "@/features/projects";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";
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
  return buildRouteMetadata({
    locale: active,
    path: "/projects",
    title: t.projectsPage.title,
    description: t.projectsPage.intro,
  });
}

/** Projects index — the engineering-story showcase (FR-005). */
export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const projects = await getProjects(active);

  const p = t.projectsPage;
  const labels = buildProjectCardLabels(p);

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-caption uppercase text-accent">{p.eyebrow}</p>
          <Heading level={1} size="display" className="text-balance">
            {p.title}
          </Heading>
          <Text size="body-lg" tone="muted" className="text-pretty">
            {p.intro}
          </Text>
        </div>
        <ProjectsGrid
          projects={projects}
          locale={active}
          labels={labels}
          emptyLabel={p.empty}
        />
      </Container>
    </Section>
  );
}
