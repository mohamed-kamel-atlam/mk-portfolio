import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  ButtonLink,
  Card,
  Container,
  Heading,
  Section,
  Text,
} from "@/shared/ui";

export interface FinalCtaProps {
  locale: Locale;
}

/** Closing call to action — an elevated, centered card that ends the page. */
export async function FinalCta({ locale }: FinalCtaProps) {
  const t = await getDictionary(locale);
  const section = t.home.finalCta;

  return (
    <Section>
      <Container>
        <Card
          elevation={2}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="flex flex-col gap-3">
            <Heading level={2} size="h1" className="text-balance">
              {section.title}
            </Heading>
            <Text
              size="body-lg"
              tone="muted"
              className="mx-auto max-w-xl text-pretty"
            >
              {section.subtitle}
            </Text>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={localizedHref(locale, "/contact")} size="lg">
              {section.primary}
            </ButtonLink>
            <ButtonLink
              href={localizedHref(locale, "/projects")}
              variant="secondary"
              size="lg"
            >
              {section.secondary}
            </ButtonLink>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
