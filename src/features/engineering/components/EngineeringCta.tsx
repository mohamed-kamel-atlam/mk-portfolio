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

export interface EngineeringCtaProps {
  locale: Locale;
}

/**
 * Closing call to action (§11 CTA) — an invitation to talk shop, mirroring the
 * landing and About closers so the site ends on one consistent, deliberate note.
 * Elevated centered card over a static focal glow; content reveals with `scale`.
 */
export async function EngineeringCta({ locale }: EngineeringCtaProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.cta;

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
