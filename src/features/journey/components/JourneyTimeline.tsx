import {
  Atom,
  Braces,
  BrainCircuit,
  GraduationCap,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import { getTechIcon } from "@/shared/lib/tech-icons";
import {
  Badge,
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";
import { Reveal } from "@/shared/ui/motion";

import { journeyMilestones, type MilestoneKey } from "../content";

export interface JourneyTimelineProps {
  locale: Locale;
}

/** An icon per year, capturing that chapter's theme. */
const MILESTONE_ICON: Record<MilestoneKey, LucideIcon> = {
  "2022": GraduationCap,
  "2023": BrainCircuit,
  "2024": Braces,
  "2025": Atom,
  "2026": Rocket,
};

export async function JourneyTimeline({ locale }: JourneyTimelineProps) {
  const t = await getDictionary(locale);
  const section = t.journey.timeline;
  const yearFmt = new Intl.NumberFormat(locale, { useGrouping: false });
  const lastIndex = journeyMilestones.length - 1;

  return (
    <Section className="section-muted relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container>
        <div className="flex flex-col gap-14">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />

          <ol className="flex flex-col">
            {journeyMilestones.map((milestone, index) => {
              const key = milestone.key;
              const item = section.milestones[key];
              const Icon = MILESTONE_ICON[key];
              const cardOnEnd = index % 2 === 1;
              const isLast = index === lastIndex;

              return (
                <li
                  key={key}
                  className="grid grid-cols-[auto_1fr] gap-x-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12"
                >
                  {/* Spine: year badge + connector. Mobile col 1 (start), desktop col 2 (center). */}
                  <div className="flex flex-col items-center lg:col-start-2 lg:row-start-1">
                    <span className="z-base inline-flex min-w-16 items-center justify-center rounded-2xl border border-border bg-surface px-3 py-2 text-body font-semibold tabular-nums text-accent shadow-accent">
                      {yearFmt.format(milestone.year)}
                    </span>
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className="w-px flex-1 bg-border"
                      />
                    ) : null}
                  </div>

                  {/* Milestone card. Mobile col 2; desktop alternates col 1 / col 3. */}
                  <div
                    className={cn(
                      "pb-14 lg:row-start-1",
                      cardOnEnd ? "lg:col-start-3" : "lg:col-start-1",
                    )}
                  >
                    <Reveal>
                      <Card
                        interactive
                        className="group/milestone flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/milestone:border-accent">
                            <Icon aria-hidden="true" className="size-5" />
                          </span>
                          <Heading level={3} size="h4">
                            {item.title}
                          </Heading>
                        </div>

                        <Text tone="muted" className="text-pretty">
                          {item.story}
                        </Text>

                        <div className="flex flex-col gap-2">
                          <p className="text-caption uppercase text-muted-foreground">
                            {section.labels.technologies}
                          </p>
                          <ul className="flex flex-wrap gap-2">
                            {milestone.techs.map((tech) => {
                              const TechIcon = getTechIcon({ name: tech });
                              return (
                                <li key={tech}>
                                  <Badge
                                    variant="outline"
                                    className="text-muted-foreground"
                                  >
                                    <TechIcon
                                      aria-hidden="true"
                                      className="size-3.5"
                                    />
                                    {tech}
                                  </Badge>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="flex flex-col gap-1 border-s-2 border-accent ps-4">
                          <p className="text-caption uppercase text-accent">
                            {section.labels.lesson}
                          </p>
                          <Text size="small">{item.lesson}</Text>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg bg-surface-muted p-4">
                          <Sparkles
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-accent"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-caption uppercase text-accent">
                              {section.labels.mindset}
                            </p>
                            <Text size="small" tone="muted">
                              {item.mindset}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
