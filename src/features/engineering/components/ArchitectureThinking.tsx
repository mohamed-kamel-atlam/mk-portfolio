import {
  Boxes,
  Component,
  Gauge,
  RefreshCw,
  ScanEye,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

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

import { architectureSteps, type ArchitectureStepKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";

export interface ArchitectureThinkingProps {
  locale: Locale;
}

const STEP_ICON: Record<ArchitectureStepKey, LucideIcon> = {
  understand: Search,
  modularize: Boxes,
  reusable: Component,
  scalability: TrendingUp,
  optimize: Gauge,
  review: ScanEye,
  iterate: RefreshCw,
};

export async function ArchitectureThinking({
  locale,
}: ArchitectureThinkingProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.architecture;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            as="ol"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {architectureSteps.map((key, index) => {
              const item = section.steps[key];
              const Icon = STEP_ICON[key];
              const number = new Intl.NumberFormat(locale, {
                minimumIntegerDigits: 2,
              }).format(index + 1);
              return (
                <li key={key}>
                  <Card
                    interactive
                    className="group/step flex h-full flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/step:border-accent">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span
                        className="text-h3 font-semibold tabular-nums text-muted"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                    </div>
                    <Heading level={3} size="h4">
                      {item.title}
                    </Heading>
                    <Text tone="muted" className="text-pretty">
                      {item.description}
                    </Text>
                  </Card>
                </li>
              );
            })}
          </RevealGroup>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/architecture")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
