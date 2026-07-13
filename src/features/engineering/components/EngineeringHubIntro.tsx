import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";

export interface EngineeringHubIntroProps {
  locale: Locale;
}

/**
 * Engineering-hub introduction — the page hero. Holds the single `<h1>`
 * (Display step) and frames the hub as living documentation of the engineering
 * behind the portfolio. Server Component; the only motion is one CSS entrance.
 */
export async function EngineeringHubIntro({
  locale,
}: EngineeringHubIntroProps) {
  const t = await getDictionary(locale);
  const intro = t.engineering.intro;

  return (
    <Section spacing="lg">
      <Container className="flex max-w-3xl flex-col gap-6 motion-safe:animate-fade-in-up">
        <p className="text-caption uppercase text-accent">{intro.eyebrow}</p>
        <Heading level={1} size="display" className="text-balance">
          {intro.title}
        </Heading>
        <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
          {intro.lead}
        </Text>
      </Container>
    </Section>
  );
}
