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

export interface AboutCtaProps {
  locale: Locale;
}

/**
 * Closing call to action — the page's conclusion. An elevated, centered card
 * over a single static focal glow mirrors the landing's closing beat, so the
 * story ends on the same deliberate note. Content reveals in a short `scale`
 * stagger; the glow is static to stay within the perf budget.
 */
export async function AboutCta({ locale }: AboutCtaProps) {
  const t = await getDictionary(locale);
  const section = t.about.cta;

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
