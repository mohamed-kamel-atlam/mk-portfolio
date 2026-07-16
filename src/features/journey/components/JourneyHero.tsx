import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Heading, Section, Text } from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";

import { journeyMilestones } from "../content";

export interface JourneyHeroProps {
  locale: Locale;
}

export async function JourneyHero({ locale }: JourneyHeroProps) {
  const t = await getDictionary(locale);
  const hero = t.journey.hero;

  const fmt = new Intl.NumberFormat(locale, { useGrouping: false });
  const first = journeyMilestones[0].year;
  const last = journeyMilestones.at(-1)?.year ?? first;

  return (
    <Section spacing="lg" className="relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container className="flex max-w-3xl flex-col items-start gap-6 motion-safe:animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-caption uppercase text-accent">
          {fmt.format(first)} — {fmt.format(last)}
        </span>
        <p className="text-caption uppercase text-accent">{hero.eyebrow}</p>
        <Heading level={1} size="display" className="text-balance">
          {hero.title}
        </Heading>
        <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
          {hero.lead}
        </Text>
      </Container>
    </Section>
  );
}
