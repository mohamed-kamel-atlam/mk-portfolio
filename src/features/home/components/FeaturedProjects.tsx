import { featuredContent } from "@/content";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Badge,
  ButtonLink,
  Card,
  Container,
  Heading,
  Section,
  Text,
} from "@/shared/ui";

import { SectionHeading } from "./SectionHeading";

export interface FeaturedProjectsProps {
  locale: Locale;
}

/**
 * Selected-work grid. Project data comes from the MDX content engine
 * (`@/content`) — validated frontmatter, ordered and locale-scoped — while the
 * section chrome (eyebrow/title/intro/cta) is localized via the dictionary.
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
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} className="flex flex-col gap-4">
              <Heading level={3} size="h4">
                {project.frontmatter.title}
              </Heading>
              <Text tone="muted">{project.frontmatter.summary}</Text>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {project.frontmatter.techStack.map((tech) => (
                  <Badge key={tech.name}>{tech.name}</Badge>
                ))}
              </div>
            </Card>
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
