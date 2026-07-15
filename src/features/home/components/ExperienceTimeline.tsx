import { Layers, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { timelineStages, type TimelineStageKey } from "../content";

export interface ExperienceTimelineProps {
  locale: Locale;
}

/** A stage icon per journey step, so the timeline reads at a glance. */
const STAGE_ICON: Record<TimelineStageKey, LucideIcon> = {
  foundations: Layers,
  scaling: TrendingUp,
  ai: Sparkles,
};

/**
 * Vertical journey timeline. The marker column (dot + connector) uses flexbox
 * rather than absolute positioning, so it mirrors correctly in RTL.
 */
export async function ExperienceTimeline({ locale }: ExperienceTimelineProps) {
  const t = await getDictionary(locale);
  const section = t.home.timeline;
  const lastIndex = timelineStages.length - 1;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <ol className="flex flex-col">
            {timelineStages.map((key, index) => {
              const item = section.items[key];
              const StageIcon = STAGE_ICON[key];
              return (
                <li key={key} className="group/stage flex gap-4">
                  <div
                    className="flex flex-col items-center"
                    aria-hidden="true"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/stage:border-accent">
                      <StageIcon className="size-4" />
                    </span>
                    {index < lastIndex ? (
                      <span className="mt-2 w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className="pb-10">
                    <Heading
                      level={3}
                      size="h4"
                      className="transition-colors duration-fast group-hover/stage:text-accent"
                    >
                      {item.title}
                    </Heading>
                    <Text tone="muted" className="mt-1 max-w-xl text-pretty">
                      {item.summary}
                    </Text>
                  </div>
                </li>
              );
            })}
          </ol>
        </RevealGroup>
      </Container>
    </Section>
  );
}
