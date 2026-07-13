import type { Metadata } from "next";

import { ContactForm, ContactInfo } from "@/features/contact";
import { defaultLocale, isLocale, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { buildRouteMetadata } from "@/shared/lib/seo";
import { Container, Heading, Section, Text } from "@/shared/ui";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const meta = (await getDictionary(active)).contact.meta;
  return buildRouteMetadata({
    locale: active,
    path: "/contact",
    title: meta.title,
    description: meta.description,
  });
}

/**
 * Contact (FR-010). Thin routing-layer composition: the server resolves the
 * locale and dictionary and passes localized copy to the interactive form (the
 * only client island) and the presentational info panel.
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const c = t.contact;

  return (
    <Section>
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-caption uppercase text-accent">
            {c.intro.eyebrow}
          </p>
          <Heading level={1} size="display" className="text-balance">
            {c.intro.title}
          </Heading>
          <Text size="body-lg" tone="muted" className="text-pretty">
            {c.intro.lead}
          </Text>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm copy={c.form} errors={c.errors} success={c.success} />
          <ContactInfo title={c.info.title} subtitle={c.info.subtitle} />
        </div>
      </Container>
    </Section>
  );
}
