import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Badge, Container, Section, SectionHeading, Text } from "@/shared/ui";

import { skillGroups } from "../content";

export interface SkillsOverviewProps {
  locale: Locale;
}

/** Skills, grouped by domain. Group labels are localized; items are proper nouns. */
export async function SkillsOverview({ locale }: SkillsOverviewProps) {
  const t = await getDictionary(locale);
  const section = t.about.skills;

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.key} className="flex flex-col gap-3">
              <Text size="small" tone="muted" className="uppercase">
                {section.groups[group.key]}
              </Text>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
