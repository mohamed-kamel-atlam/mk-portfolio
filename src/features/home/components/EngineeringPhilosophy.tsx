import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Heading, Section, Text } from "@/shared/ui";

import { philosophyPrinciples } from "../content";
import { SectionHeading } from "./SectionHeading";

export interface EngineeringPhilosophyProps {
  locale: Locale;
}

/** Principle cards, drawn from the project's documented engineering values. */
export async function EngineeringPhilosophy({
  locale,
}: EngineeringPhilosophyProps) {
  const t = await getDictionary(locale);
  const section = t.home.philosophy;

  return (
    <Section className="bg-surface-muted">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {philosophyPrinciples.map((key) => {
            const item = section.items[key];
            return (
              <Card key={key} className="flex flex-col gap-2">
                <Heading level={3} size="h4">
                  {item.title}
                </Heading>
                <Text tone="muted">{item.description}</Text>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
