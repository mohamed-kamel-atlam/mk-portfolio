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

export interface JourneyCtaProps {
  locale: Locale;
}

/**
 * Closing CTA (§8) — the journey's forward-looking invitation, mirroring the
 * landing/About/Engineering closers so the site ends on one consistent note.
 * Content reveals with `scale` over a static focal glow.
 */
export async function JourneyCta({ locale }: JourneyCtaProps) {
  const t = await getDictionary(locale);
  const section = t.journey.cta;

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
            <div className="flex flex-col items-center gap-3">
              <span className="text-caption uppercase text-accent">
                {section.eyebrow}
              </span>
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
