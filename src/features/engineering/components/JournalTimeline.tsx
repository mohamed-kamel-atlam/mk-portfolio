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
import { RevealGroup } from "@/shared/ui/motion";

import { formatDate, getJournal } from "../lib/get-engineering";

export interface JournalTimelineProps {
  locale: Locale;
}

export async function JournalTimeline({ locale }: JournalTimelineProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.journal;
  const entries = await getJournal(locale);
  const lastIndex = entries.length - 1;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup variant="up" as="ol" className="flex flex-col">
            {entries.map((entry, index) => {
              const fm = entry.frontmatter;
              return (
                <li key={entry.slug} className="flex gap-4">
                  <div
                    className="flex flex-col items-center pt-1"
                    aria-hidden="true"
                  >
                    <span className="size-3 rounded-full border-2 border-accent bg-background" />
                    {index < lastIndex ? (
                      <span className="w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2 pb-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <Text size="small" tone="muted" className="tabular-nums">
                        {formatDate(locale, fm.date)}
                      </Text>
                      <Badge variant="neutral">
                        {t.engineering.journalKinds[fm.kind]}
                      </Badge>
                    </div>
                    <Heading level={3} size="h4">
                      {fm.title}
                    </Heading>
                    <Text tone="muted" className="text-pretty">
                      {fm.summary}
                    </Text>
                  </div>
                </li>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
