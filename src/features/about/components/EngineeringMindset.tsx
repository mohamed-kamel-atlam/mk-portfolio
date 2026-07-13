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

import { mindsetPillars } from "../content";

export interface EngineeringMindsetProps {
  locale: Locale;
}

/** How Mohamed approaches engineering — the "what kind of engineer" pillars. */
export async function EngineeringMindset({ locale }: EngineeringMindsetProps) {
  const t = await getDictionary(locale);
  const section = t.about.mindset;

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {mindsetPillars.map((key) => {
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
