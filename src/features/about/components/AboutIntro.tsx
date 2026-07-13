import { socialLinks } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { ButtonLink, Container, Heading, Section, Text } from "@/shared/ui";

export interface AboutIntroProps {
  locale: Locale;
}

/**
 * About introduction — the page hero. Holds the single `<h1>` (Display step)
 * and the positioning statement. A Server Component: content ships as HTML and
 * the only motion is one CSS entrance transition, honored by reduced-motion.
 */
export async function AboutIntro({ locale }: AboutIntroProps) {
  const t = await getDictionary(locale);
  const intro = t.about.intro;

  const meta = [intro.location, intro.education, intro.languages];

  return (
    <Section spacing="lg">
      <Container className="flex max-w-3xl flex-col items-start gap-6 motion-safe:animate-fade-in-up">
        <p className="text-caption uppercase text-accent">{intro.kicker}</p>

        <Heading level={1} size="display" className="text-balance">
          {intro.headline}
        </Heading>

        <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
          {intro.lead}
        </Text>

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

        <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          {socialLinks.map((social) => {
            const isExternal = social.href.startsWith("http");
            return (
              <li key={social.key}>
                <a
                  href={social.href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  {social.label}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
