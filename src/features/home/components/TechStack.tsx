import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Badge, Container, Section, Text } from "@/shared/ui";

import { techGroups } from "../content";
import { SectionHeading } from "./SectionHeading";

export interface TechStackProps {
  locale: Locale;
}

/** Technology groups. A muted-surface band for section rhythm. */
export async function TechStack({ locale }: TechStackProps) {
  const t = await getDictionary(locale);
  const section = t.home.tech;

  return (
    <Section className="bg-surface-muted">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((group) => (
            <div key={group.key} className="flex flex-col gap-3">
              <Text size="small" tone="muted" className="uppercase">
                {section.groups[group.key]}
              </Text>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
