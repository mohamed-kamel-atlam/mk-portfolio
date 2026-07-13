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

import { workingPrinciples } from "../content";

export interface WorkingPrinciplesProps {
  locale: Locale;
}

/**
 * How the work gets done — the same non-negotiable engineering principles this
 * codebase is built on (ARCHITECTURE.md §2). The `<ol>` carries the ordering;
 * the accent index is decorative.
 */
export async function WorkingPrinciples({ locale }: WorkingPrinciplesProps) {
  const t = await getDictionary(locale);
  const section = t.about.principles;

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <ol className="grid gap-6 sm:grid-cols-2">
          {workingPrinciples.map((key, index) => {
            const item = section.items[key];
            const number = new Intl.NumberFormat(locale).format(index + 1);
            return (
              <li key={key}>
                <Card className="flex h-full gap-4">
                  <span
                    className="text-h3 tabular-nums text-accent"
                    aria-hidden="true"
                  >
                    {number}
                  </span>
                  <div className="flex flex-col gap-2">
                    <Heading level={3} size="h4">
                      {item.title}
                    </Heading>
                    <Text tone="muted">{item.description}</Text>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
