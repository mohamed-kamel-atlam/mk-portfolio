import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { ButtonLink, Container, Heading, Section, Text } from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";

import { WHATSAPP } from "../content";

export interface ContactHeroProps {
  locale: Locale;
}

/**
 * Contact hero — the page's single `<h1>` and its warm opening, with a primary
 * CTA that jumps to the form and a direct WhatsApp CTA. Server Component; the
 * only motion is one CSS entrance, honored by reduced-motion.
 */
export async function ContactHero({ locale }: ContactHeroProps) {
  const t = await getDictionary(locale);
  const hero = t.contact.hero;

  return (
    <Section spacing="lg" className="relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container className="flex max-w-3xl flex-col items-start gap-6 motion-safe:animate-fade-in-up">
        <p className="text-caption uppercase text-accent">{hero.eyebrow}</p>
        <Heading level={1} size="display" className="text-balance">
          {hero.title}
        </Heading>
        <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
          {hero.lead}
        </Text>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ButtonLink href="#contact-form" size="lg" trailingArrow>
            {hero.primary}
          </ButtonLink>
          <ButtonLink
            href={WHATSAPP.href}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            {hero.secondary}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
