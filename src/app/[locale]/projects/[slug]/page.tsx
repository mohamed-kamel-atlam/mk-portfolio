import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildContentMetadata } from "@/content";
import { MDXContent } from "@/content/mdx";
import {
  CaseStudyToc,
  getAdjacentProjects,
  getProject,
  getProjectSlugs,
  getRelatedProjects,
  ProjectArchitecture,
  ProjectGallery,
  ProjectPager,
  ProjectTechStack,
  ReadingProgress,
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
import { breadcrumbJsonLd } from "@/shared/lib/structured-data";
import { buildToc, type TocItem } from "@/shared/lib/toc";
import {
  ButtonLink,
  Container,
  Heading,
  JsonLd,
  Section,
  Text,
} from "@/shared/ui";
import { Reveal } from "@/shared/ui/motion";

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

/**
 * Project detail — a premium engineering case study: a hero, a reading-progress
 * bar and sticky TOC, the numbered story (MDX), then the supporting tech stack
 * and key decisions, and a closing next-project navigation. Server-first; only
 * the progress bar and the TOC scroll-spy are small client islands.
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const project = await getProject(slug, active);
  if (!project) notFound();

  const t = await getDictionary(active);
  const p = t.projectsPage;
  const { frontmatter } = project;
  const [related, adjacent] = await Promise.all([
    getRelatedProjects(slug, active),
    getAdjacentProjects(slug, active),
  ]);

  // TOC: the story's chapters (from the MDX headings) plus the supporting
  // structured sections that follow it.
  const toc: TocItem[] = [
    ...buildToc(project.body),
    { id: "tech-stack", text: p.techStack, level: 2 },
    ...(frontmatter.architectureDecisions?.length
      ? [{ id: "key-decisions", text: p.keyDecisions, level: 2 } as TocItem]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: frontmatter.title,
    description: frontmatter.summary,
    inLanguage: active,
    author: { "@type": "Person", name: siteConfig.name },
    url: `${siteConfig.url}${localizedHref(active, `/projects/${slug}`)}`,
  };
  const breadcrumb = breadcrumbJsonLd(active, [
    { name: t.nav.home, path: "" },
    { name: t.nav.projects, path: "/projects" },
    { name: frontmatter.title, path: `/projects/${slug}` },
  ]);

  return (
    <Section>
      <ReadingProgress label={p.readingProgress} />
      <Container>
        <JsonLd data={jsonLd} />
        <JsonLd data={breadcrumb} />
        <article className="flex flex-col gap-16">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
            <div className="flex min-w-0 flex-col gap-16">
              <header className="flex flex-col gap-4 motion-safe:animate-fade-in-up">
                <Link
                  href={localizedHref(active, "/projects")}
                  className="inline-flex items-center gap-1 text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  <ArrowLeft
                    className="h-4 w-4 rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  {p.back}
                </Link>
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
                        {p.viewSource}
                      </ButtonLink>
                    ) : null}
                    {frontmatter.liveDemo ? (
                      <ButtonLink
                        href={frontmatter.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {p.viewLive}
                      </ButtonLink>
                    ) : null}
                  </div>
                ) : null}
              </header>

              <Reveal>
                <div className="case-study-prose">
                  <MDXContent source={project.body} />
                </div>
              </Reveal>

              <Reveal>
                <ProjectTechStack
                  id="tech-stack"
                  techStack={frontmatter.techStack}
                  label={p.techStack}
                />
              </Reveal>

              {frontmatter.architectureDecisions?.length ? (
                <Reveal>
                  <ProjectArchitecture
                    id="key-decisions"
                    decisions={frontmatter.architectureDecisions}
                    label={p.keyDecisions}
                  />
                </Reveal>
              ) : null}

              {frontmatter.gallery?.length ? (
                <Reveal>
                  <ProjectGallery gallery={frontmatter.gallery} />
                </Reveal>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <CaseStudyToc items={toc} label={p.onThisPage} />
            </aside>
          </div>

          <RelatedProjects
            projects={related}
            locale={active}
            label={p.related}
          />

          <ProjectPager
            prev={adjacent.prev}
            next={adjacent.next}
            locale={active}
            labels={{
              previous: p.previous,
              next: p.next,
              nav: p.pager,
              back: p.back,
            }}
          />
        </article>
      </Container>
    </Section>
  );
}
