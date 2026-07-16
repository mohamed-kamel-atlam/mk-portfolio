import {
  Accessibility,
  Boxes,
  Gauge,
  Palette,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";
import { RevealGroup } from "@/shared/ui/motion";

import { philosophyPrinciples, type PhilosophyKey } from "../content";

export interface EngineeringPhilosophyProps {
  locale: Locale;
}

/** An icon per principle, so each conviction reads at a glance. */
const PRINCIPLE_ICON: Record<PhilosophyKey, LucideIcon> = {
  performance: Gauge,
  accessibility: Accessibility,
  designSystems: Palette,
  architecture: Boxes,
  maintainability: Wrench,
  ownership: ShieldCheck,
};

export async function EngineeringPhilosophy({
  locale,
}: EngineeringPhilosophyProps) {
  const t = await getDictionary(locale);
  const section = t.about.philosophy;

  return (
    <Section className="section-muted relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <Text
            size="body-lg"
            className="max-w-3xl text-pretty border-s-2 border-accent ps-6"
          >
            {section.statement}
          </Text>
          <RevealGroup
            variant="up"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {philosophyPrinciples.map((key) => {
              const item = section.items[key];
              const Icon = PRINCIPLE_ICON[key];
              return (
                <Card
                  key={key}
                  interactive
                  className="group/principle flex flex-col gap-3"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/principle:border-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <Heading level={3} size="h4">
                    {item.title}
                  </Heading>
                  <Text tone="muted" className="text-pretty">
                    {item.description}
                  </Text>
                </Card>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
