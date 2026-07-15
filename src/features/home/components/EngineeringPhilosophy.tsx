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

import { philosophyPrinciples } from "../content";

export interface EngineeringPhilosophyProps {
  locale: Locale;
}

/**
 * Engineer identity: a first-person statement (the architecture mindset) leading
 * into the principle cards drawn from the documented engineering values. The
 * statement is anchored by a thin accent rule — a visual anchor, not a boxed
 * card — so it reads as a point of view, not another tile.
 */
export async function EngineeringPhilosophy({
  locale,
}: EngineeringPhilosophyProps) {
  const t = await getDictionary(locale);
  const section = t.home.philosophy;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup className="flex flex-col gap-12">
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
        </RevealGroup>
      </Container>
    </Section>
  );
}
