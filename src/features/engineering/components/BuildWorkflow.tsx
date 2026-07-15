import {
  Accessibility,
  BookOpen,
  ClipboardList,
  Code2,
  FlaskConical,
  PenTool,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { buildStages, type BuildStageKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";

export interface BuildWorkflowProps {
  locale: Locale;
}

const STAGE_ICON: Record<BuildStageKey, LucideIcon> = {
  research: BookOpen,
  planning: ClipboardList,
  architecture: PenTool,
  implementation: Code2,
  optimization: Zap,
  accessibility: Accessibility,
  testing: FlaskConical,
  deployment: Rocket,
};

/**
 * How I build (§3) — the pipeline every change runs, rendered as a numbered
 * ledger (spec-sheet feel) rather than cards, so it reads distinctly from the
 * architecture cycle above it. Links to the development-workflow doc. Reveals
 * with `fade`.
 */
export async function BuildWorkflow({ locale }: BuildWorkflowProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.build;

  return (
    <Section>
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
            {buildStages.map((key, index) => {
              const item = section.stages[key];
              const Icon = STAGE_ICON[key];
              const number = new Intl.NumberFormat(locale, {
                minimumIntegerDigits: 2,
              }).format(index + 1);
              return (
                <li
                  key={key}
                  className="grid gap-2 p-6 transition-colors duration-fast hover:bg-surface-muted md:grid-cols-[minmax(0,16rem)_1fr] md:items-baseline md:gap-8"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-small font-semibold tabular-nums text-accent"
                      aria-hidden="true"
                    >
                      {number}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-accent"
                    />
                    <Heading level={3} size="h4">
                      {item.title}
                    </Heading>
                  </div>
                  <Text tone="muted" className="text-pretty">
                    {item.description}
                  </Text>
                </li>
              );
            })}
          </ol>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/development-workflow")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
