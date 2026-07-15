import {
  ArrowRight,
  Boxes,
  Lightbulb,
  Palette,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { evolutionStages, type EvolutionStageKey } from "../content";

export interface EngineeringEvolutionProps {
  locale: Locale;
}

const STAGE_ICON: Record<EvolutionStageKey, LucideIcon> = {
  logic: Lightbulb,
  craft: Palette,
  architecture: Boxes,
  systems: Waypoints,
};

/**
 * Engineering evolution (§3) — the mindset arc distilled into before → after
 * leaps, so the growth reads at a glance rather than being inferred from the
 * timeline. Reveals with `up`.
 */
export async function EngineeringEvolution({
  locale,
}: EngineeringEvolutionProps) {
  const t = await getDictionary(locale);
  const section = t.journey.evolution;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {evolutionStages.map((key) => {
              const item = section.items[key];
              const Icon = STAGE_ICON[key];
              return (
                <Card
                  key={key}
                  interactive
                  className="group/stage flex flex-col gap-3"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/stage:border-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <p className="flex flex-wrap items-center gap-2 text-h4 font-semibold">
                    <span className="text-muted-foreground">{item.before}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-accent rtl:-scale-x-100"
                    />
                    <span className="text-foreground">{item.after}</span>
                  </p>
                  <Text tone="muted" className="text-pretty">
                    {item.description}
                  </Text>
                </Card>
              );
            })}
          </div>
        </RevealGroup>
      </Container>
    </Section>
  );
}
