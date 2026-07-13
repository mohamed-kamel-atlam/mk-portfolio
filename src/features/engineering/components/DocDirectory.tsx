import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section } from "@/shared/ui";

import { getGroupedDocs } from "../lib/get-engineering";
import { DocCard } from "./DocCard";

export interface DocDirectoryProps {
  locale: Locale;
}

/**
 * The engineering-doc directory — categories, each a labeled `<h2>` group of
 * doc cards. Grouping is done in the lib (data shaping); this component only
 * lays the groups out.
 */
export async function DocDirectory({ locale }: DocDirectoryProps) {
  const t = await getDictionary(locale);
  const groups = await getGroupedDocs(locale);

  return (
    <Section>
      <Container className="flex flex-col gap-16">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-6">
            <Heading level={2} size="h3">
              {t.engineering.groups[group.key]}
            </Heading>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.docs.map((doc) => (
                <DocCard
                  key={doc.slug}
                  href={localizedHref(locale, `/engineering/${doc.slug}`)}
                  kindLabel={t.engineering.kinds[doc.frontmatter.kind]}
                  title={doc.frontmatter.title}
                  summary={doc.frontmatter.summary}
                />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}
