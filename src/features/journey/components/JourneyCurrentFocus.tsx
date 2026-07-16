import {
  Accessibility,
  Atom,
  Boxes,
  Gauge,
  Palette,
  Route,
  Server,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { currentFocusItems, type CurrentFocusKey } from "../content";

export interface JourneyCurrentFocusProps {
  locale: Locale;
}

const FOCUS_ICON: Record<CurrentFocusKey, LucideIcon> = {
  reactInternals: Atom,
  appRouter: Route,
  rendering: Server,
  performance: Gauge,
  accessibility: Accessibility,
  designSystems: Palette,
  architecture: Boxes,
  aiAssisted: Sparkles,
};

export async function JourneyCurrentFocus({
  locale,
}: JourneyCurrentFocusProps) {
  const t = await getDictionary(locale);
  const section = t.journey.currentFocus;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            as="ul"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {currentFocusItems.map((key) => {
              const Icon = FOCUS_ICON[key];
              return (
                <li key={key}>
                  <Card
                    interactive
                    className="group/focus flex h-full items-center gap-3"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/focus:border-accent">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <Text className="font-medium text-foreground">
                      {section.items[key]}
                    </Text>
                  </Card>
                </li>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
