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

import { featuredProjects } from "../content";
import { SectionHeading } from "./SectionHeading";

export interface FeaturedProjectsProps {
  locale: Locale;
}

/** Selected-work grid. Cards are equal-height (tags pinned to the base). */
export async function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  const t = await getDictionary(locale);
  const section = t.home.projects;

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => {
            const item = section.items[project.key];
            return (
              <Card key={project.key} className="flex flex-col gap-4">
                <Heading level={3} size="h4">
                  {item.title}
                </Heading>
                <Text tone="muted">{item.summary}</Text>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Card>
            );
          })}
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
