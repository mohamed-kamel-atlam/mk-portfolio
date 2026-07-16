import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  ShoppingCart,
  Store,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { journeyProjects, type JourneyProjectKey } from "../content";

export interface JourneyProjectsProps {
  locale: Locale;
}

const PROJECT_ICON: Record<JourneyProjectKey, LucideIcon> = {
  tiger: ShoppingCart,
  fitness: CalendarCheck,
  sanabel: Store,
  graduation: GraduationCap,
};

export async function JourneyProjects({ locale }: JourneyProjectsProps) {
  const t = await getDictionary(locale);
  const section = t.journey.projects;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup variant="up" className="grid gap-6 sm:grid-cols-2">
            {journeyProjects.map((project) => {
              const item = section.items[project.key];
              const Icon = PROJECT_ICON[project.key];
              return (
                <Card
                  key={project.key}
                  interactive
                  className="group/project flex h-full flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/project:border-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Heading level={3} size="h4">
                      {item.title}
                    </Heading>
                  </div>
                  <Text tone="muted" className="text-pretty">
                    {item.story}
                  </Text>
                  <div className="flex flex-col gap-1 border-s-2 border-accent ps-4">
                    <p className="text-caption uppercase text-accent">
                      {t.journey.timeline.labels.lesson}
                    </p>
                    <Text size="small">{item.lesson}</Text>
                  </div>
                  {project.slug ? (
                    <Link
                      href={localizedHref(locale, `/projects/${project.slug}`)}
                      className="group/link mt-auto inline-flex items-center gap-2 rounded text-small font-medium text-accent transition-colors duration-fast hover:text-foreground"
                    >
                      {section.linkLabel}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-fast group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5"
                      />
                    </Link>
                  ) : null}
                </Card>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
