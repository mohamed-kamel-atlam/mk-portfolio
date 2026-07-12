import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";

import { timelineStages } from "../content";
import { SectionHeading } from "./SectionHeading";

export interface ExperienceTimelineProps {
  locale: Locale;
}

/**
 * Vertical journey timeline. The marker column (dot + connector) uses flexbox
 * rather than absolute positioning, so it mirrors correctly in RTL.
 */
export async function ExperienceTimeline({ locale }: ExperienceTimelineProps) {
  const t = await getDictionary(locale);
  const section = t.home.timeline;
  const lastIndex = timelineStages.length - 1;

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <ol className="flex flex-col">
          {timelineStages.map((key, index) => {
            const item = section.items[key];
            return (
              <li key={key} className="flex gap-4">
                <div className="flex flex-col items-center" aria-hidden="true">
                  <span className="size-3 rounded-full border-2 border-accent bg-background" />
                  {index < lastIndex ? (
                    <span className="w-px flex-1 bg-border" />
                  ) : null}
                </div>
                <div className="pb-8">
                  <Heading level={3} size="h4">
                    {item.title}
                  </Heading>
                  <Text tone="muted" className="mt-1">
                    {item.summary}
                  </Text>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
