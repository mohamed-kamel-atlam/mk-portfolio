import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, SectionHeading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { getGroupedDocs } from "../lib/get-engineering";
import { DocCard } from "./DocCard";

export interface DocDirectoryProps {
  locale: Locale;
}

export async function DocDirectory({ locale }: DocDirectoryProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.deepDives;
  const groups = await getGroupedDocs(locale);

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-14">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          {groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-6">
              <Heading level={3} size="h4" className="text-muted-foreground">
                {t.engineering.groups[group.key]}
              </Heading>
              <RevealGroup
                variant="up"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {group.docs.map((doc) => (
                  <DocCard
                    key={doc.slug}
                    href={localizedHref(locale, `/engineering/${doc.slug}`)}
                    kindLabel={t.engineering.kinds[doc.frontmatter.kind]}
                    title={doc.frontmatter.title}
                    summary={doc.frontmatter.summary}
                  />
                ))}
              </RevealGroup>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
