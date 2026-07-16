import {
  Boxes,
  Gauge,
  Puzzle,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";

import { introFacets, type IntroFacetKey } from "../content";

export interface EngineeringHubIntroProps {
  locale: Locale;
}

const FACET_ICON: Record<IntroFacetKey, LucideIcon> = {
  problemSolving: Puzzle,
  maintainability: Wrench,
  performance: Gauge,
  ux: Users,
  architecture: Boxes,
};

export async function EngineeringHubIntro({
  locale,
}: EngineeringHubIntroProps) {
  const t = await getDictionary(locale);
  const intro = t.engineering.intro;

  return (
    <Section spacing="lg" className="relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container className="flex flex-col gap-12 motion-safe:animate-fade-in-up">
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="text-caption uppercase text-accent">{intro.eyebrow}</p>
          <Heading level={1} size="display" className="text-balance">
            {intro.title}
          </Heading>
          <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
            {intro.lead}
          </Text>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {introFacets.map((key) => {
            const facet = intro.facets[key];
            const Icon = FACET_ICON[key];
            return (
              <li
                key={key}
                className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <p className="font-medium text-foreground">{facet.title}</p>
                </div>
                <Text size="small" tone="muted" className="text-pretty">
                  {facet.description}
                </Text>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
