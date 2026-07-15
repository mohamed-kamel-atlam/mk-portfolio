import {
  BookOpen,
  Code2,
  PenTool,
  Rocket,
  ScanEye,
  Search,
  Zap,
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
import { RevealGroup } from "@/shared/ui/motion";

import { processSteps, type ProcessStepKey } from "../content";

export interface MyProcessProps {
  locale: Locale;
}

/** An icon per step, reinforcing the workflow's forward motion. */
const STEP_ICON: Record<ProcessStepKey, LucideIcon> = {
  understand: Search,
  research: BookOpen,
  architect: PenTool,
  build: Code2,
  optimize: Zap,
  review: ScanEye,
  deliver: Rocket,
};

/**
 * My process — the repeatable workflow from ambiguity to production. Rendered as
 * a numbered `<ol>` of cards (the ordinal carries the sequence semantically),
 * deliberately card-based rather than the dotted timeline used by Experience, so
 * the two adjacent list-like sections stay visually distinct. Reveals with the
 * `up` variant.
 */
export async function MyProcess({ locale }: MyProcessProps) {
  const t = await getDictionary(locale);
  const section = t.about.process;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((key, index) => {
              const item = section.steps[key];
              const Icon = STEP_ICON[key];
              const number = new Intl.NumberFormat(locale, {
                minimumIntegerDigits: 2,
              }).format(index + 1);
              return (
                <li key={key}>
                  <Card className="group/step flex h-full flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/step:border-accent">
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
          </ol>
        </RevealGroup>
      </Container>
    </Section>
  );
}
