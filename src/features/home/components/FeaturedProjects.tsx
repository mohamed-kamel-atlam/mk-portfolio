import { featuredContent } from "@/content";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  ButtonLink,
  Container,
  ProjectCard,
  Section,
  SectionHeading,
} from "@/shared/ui";

export interface FeaturedProjectsProps {
  locale: Locale;
}

/**
 * Selected-work grid. Project data comes from the MDX content engine
 * (`@/content`) — validated, ordered, locale-scoped frontmatter — rendered with
 * the shared {@link ProjectCard} (reused by the projects index). Section chrome
 * is localized via the dictionary.
 */
export async function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  const t = await getDictionary(locale);
  const section = t.home.projects;
  const projects = await featuredContent("projects", locale);

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              href={localizedHref(locale, `/projects/${project.slug}`)}
              title={project.frontmatter.title}
              summary={project.frontmatter.summary}
              role={project.frontmatter.role}
              tags={project.frontmatter.techStack.map((tech) => tech.name)}
            />
          ))}
        </div>
        <div>
          <ButtonLink
            href={localizedHref(locale, "/projects")}
            variant="secondary"
          >
            {section.cta}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
