import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildContentMetadata } from "@/content";
import { MDXContent } from "@/content/mdx";
import {
  getAdjacentProjects,
  getProject,
  getProjectSlugs,
  getRelatedProjects,
  ProjectArchitecture,
  ProjectGallery,
  ProjectPager,
  ProjectTechStack,
  RelatedProjects,
} from "@/features/projects";
import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  isLocale,
  localizedHref,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { ButtonLink, Container, Heading, Section, Text } from "@/shared/ui";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/** Prebuild every project route (MDX_PIPELINE §7). */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const project = await getProject(slug, active);
  if (!project) return {};
  return buildContentMetadata(project, `/projects/${slug}`);
}

/** Project detail — the engineering story: header, stack, decisions, MDX body. */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const project = await getProject(slug, active);
  if (!project) notFound();

  const t = await getDictionary(active);
  const { frontmatter } = project;
  const [related, adjacent] = await Promise.all([
    getRelatedProjects(slug, active),
    getAdjacentProjects(slug, active),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: frontmatter.title,
    description: frontmatter.summary,
    inLanguage: active,
    author: { "@type": "Person", name: siteConfig.name },
    url: `${siteConfig.url}${localizedHref(active, `/projects/${slug}`)}`,
  };

  return (
    <Section>
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <article className="mx-auto flex max-w-3xl flex-col gap-10">
          <Link
            href={localizedHref(active, "/projects")}
            className="inline-flex items-center gap-1 text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
          >
            <ArrowLeft
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
            {t.projectsPage.back}
          </Link>

          <header className="flex flex-col gap-4">
            <Text size="caption" tone="muted" className="uppercase">
              {frontmatter.role}
            </Text>
            <Heading level={1} size="display" className="text-balance">
              {frontmatter.title}
            </Heading>
            <Text size="body-lg" tone="muted" className="text-pretty">
              {frontmatter.summary}
            </Text>
            {frontmatter.github || frontmatter.liveDemo ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {frontmatter.github ? (
                  <ButtonLink
                    href={frontmatter.github}
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.projectsPage.viewSource}
                  </ButtonLink>
                ) : null}
                {frontmatter.liveDemo ? (
                  <ButtonLink
                    href={frontmatter.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.projectsPage.viewLive}
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}
          </header>

          <ProjectTechStack
            techStack={frontmatter.techStack}
            label={t.projectsPage.techStack}
          />

          {frontmatter.architectureDecisions?.length ? (
            <ProjectArchitecture
              decisions={frontmatter.architectureDecisions}
              label={t.projectsPage.keyDecisions}
            />
          ) : null}

          <div className="space-y-6">
            <MDXContent source={project.body} />
          </div>

          {frontmatter.gallery?.length ? (
            <ProjectGallery gallery={frontmatter.gallery} />
          ) : null}

          <RelatedProjects
            projects={related}
            locale={active}
            label={t.projectsPage.related}
          />

          <ProjectPager
            prev={adjacent.prev}
            next={adjacent.next}
            locale={active}
            labels={{
              previous: t.projectsPage.previous,
              next: t.projectsPage.next,
              nav: t.projectsPage.pager,
            }}
          />
        </article>
      </Container>
    </Section>
  );
}
