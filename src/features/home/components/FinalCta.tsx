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
import { GlowLayer } from "@/shared/ui/background";
import { RevealGroup } from "@/shared/ui/motion";

export interface FinalCtaProps {
  locale: Locale;
}

export async function FinalCta({ locale }: FinalCtaProps) {
  const t = await getDictionary(locale);
  const section = t.home.finalCta;

  return (
    <Section className="relative isolate overflow-hidden">
      <GlowLayer position="center" />
      <Container>
        <Card
          elevation={2}
          className="relative flex flex-col items-center gap-8 text-center"
        >
          <RevealGroup
            variant="scale"
            className="flex flex-col items-center gap-6"
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
              <ButtonLink
                href={localizedHref(locale, "/contact")}
                size="lg"
                trailingArrow
              >
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
          </RevealGroup>
        </Card>
      </Container>
    </Section>
  );
}
