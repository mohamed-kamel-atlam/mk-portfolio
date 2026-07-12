import {
  defaultLocale,
  direction,
  isLocale,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Temporary bootstrap placeholder, localized and rendered inside the app shell
 * (M2/M3). It provides only content — the header, footer, and navigation live in
 * the layout. Every string is server-resolved from the dictionary. It composes
 * shared UI primitives (Section/Container/Heading/Text). The real landing page
 * arrives at M5.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const t = await getDictionary(active);
  const isRtl = direction(active) === "rtl";

  return (
    <Section spacing="lg">
      <Container className="flex flex-col gap-4">
        <Text
          as="p"
          size="caption"
          tone="muted"
          className={isRtl ? "font-sans" : "font-mono uppercase"}
        >
          {t.foundationEyebrow}
        </Text>
        <Heading level={1} size="display">
          {t.name}
        </Heading>
        <Text size="body-lg" tone="muted">
          {t.tagline}
        </Text>
        <Text size="small" tone="muted">
          {t.note}
        </Text>
      </Container>
    </Section>
  );
}
