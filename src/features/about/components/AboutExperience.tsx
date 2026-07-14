import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Badge,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";

import { formatPeriod, getExperience } from "../lib/get-experience";

export interface AboutExperienceProps {
  locale: Locale;
}

/**
 * Experience timeline (FR-004). Entries come from the Content layer
 * (`experience` collection) — validated, ordered data, not hardcoded markup.
 * The marker column uses flexbox rather than absolute offsets, so the dot and
 * connector mirror correctly in RTL.
 */
export async function AboutExperience({ locale }: AboutExperienceProps) {
  const t = await getDictionary(locale);
  const section = t.about.experience;
  const items = await getExperience(locale);
  const lastIndex = items.length - 1;

  return (
    <Section className="section-muted">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          intro={section.intro}
        />
        <ol className="flex flex-col">
          {items.map((item, index) => {
            const fm = item.frontmatter;
            const period = formatPeriod(
              locale,
              fm.startDate,
              fm.endDate,
              section.present,
            );
            return (
              <li key={item.slug} className="flex gap-4">
                <div
                  className="flex flex-col items-center pt-1"
                  aria-hidden="true"
                >
                  <span className="size-3 rounded-full border-2 border-accent bg-background" />
                  {index < lastIndex ? (
                    <span className="w-px flex-1 bg-border" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 pb-10">
                  <div className="flex flex-col gap-1">
                    <Text size="small" tone="muted" className="tabular-nums">
                      {period}
                    </Text>
                    <Heading level={3} size="h4">
                      {fm.title}
                    </Heading>
                    <Text size="small">{fm.roleTitle}</Text>
                    <Text size="small" tone="muted">
                      {fm.organization}
                      {fm.location ? ` · ${fm.location}` : ""}
                    </Text>
                  </div>

                  <Text tone="muted" className="text-pretty">
                    {fm.summary}
                  </Text>

                  {fm.highlights && fm.highlights.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {fm.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span
                            className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          <Text size="small" tone="muted">
                            {highlight}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {fm.techStack && fm.techStack.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {fm.techStack.map((tech) => (
                        <li key={tech.name}>
                          <Badge>{tech.name}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
