import Image from "next/image";

import { BLUR_DATA_URL, PROFILE_IMAGE_SRC } from "@/shared/assets";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  ButtonLink,
  Container,
  Heading,
  Section,
  SocialLinks,
  Text,
} from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";

export interface AboutIntroProps {
  locale: Locale;
}

/**
 * About introduction — the page hero. A two-column story: the positioning
 * statement and narrative beside a framed portrait. Holds the single `<h1>`
 * (Display step). A Server Component: content ships as HTML, the portrait is a
 * priority `next/image` (the hero's LCP candidate), and the only motion is a CSS
 * entrance transition honored by reduced-motion.
 */
export async function AboutIntro({ locale }: AboutIntroProps) {
  const t = await getDictionary(locale);
  const intro = t.about.intro;

  const meta = [intro.location, intro.education, intro.languages];

  return (
    <Section spacing="lg" className="relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-6 motion-safe:animate-fade-in-up">
          <p className="text-caption uppercase text-accent">{intro.kicker}</p>

          <Heading level={1} size="display" className="text-balance">
            {intro.headline}
          </Heading>

          <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
            {intro.lead}
          </Text>

          <div className="flex max-w-2xl flex-col gap-4">
            {intro.narrative.map((paragraph) => (
              <Text key={paragraph} tone="muted" className="text-pretty">
                {paragraph}
              </Text>
            ))}
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li className="flex items-center gap-2 text-small text-foreground">
              <span
                className="size-2 rounded-full bg-success"
                aria-hidden="true"
              />
              {intro.availability}
            </li>
            {meta.map((item) => (
              <li key={item} className="text-small text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <ButtonLink href={localizedHref(locale, "/projects")} size="lg">
              {intro.ctaPrimary}
            </ButtonLink>
            <ButtonLink
              href={localizedHref(locale, "/contact")}
              variant="secondary"
              size="lg"
            >
              {intro.ctaSecondary}
            </ButtonLink>
          </div>

          <SocialLinks variant="inline" className="mt-2" />
        </div>

        <div className="mx-auto w-full max-w-sm motion-safe:animate-fade-in lg:mx-0 lg:ms-auto">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <Image
              src={PROFILE_IMAGE_SRC}
              alt={intro.imageAlt}
              width={501}
              height={498}
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 60vw, 80vw"
              className="aspect-square h-auto w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
