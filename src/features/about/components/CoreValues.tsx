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

import { coreValues } from "../content";

export interface CoreValuesProps {
  locale: Locale;
}

/** The convictions behind the work — drawn from the documented brand values. */
export async function CoreValues({ locale }: CoreValuesProps) {
  const t = await getDictionary(locale);
  const section = t.about.values;

  return (
    <Section className="bg-surface-muted">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((key) => {
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
