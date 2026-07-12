import { ChevronDown } from "lucide-react";

import { socialLinks } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import { Badge, ButtonLink, Container, Heading, Text } from "@/shared/ui";

import styles from "./Hero.module.css";

export interface HeroProps {
  locale: Locale;
}

/**
 * Landing hero — the first screen. A Server Component: all content ships as HTML
 * and every animation is CSS-only (ambient glow, one entrance transition, a
 * gentle scroll cue), so it adds **zero client JavaScript**. Motion is
 * `motion-safe` and calm. Inspired by, not copied from, modern SaaS heroes.
 */
export async function Hero({ locale }: HeroProps) {
  const t = await getDictionary(locale);
  const h = t.hero;

  return (
    <section
      className={cn(styles.hero, "relative flex items-center overflow-hidden")}
    >
      {/* Decorative animated background. */}
      <div aria-hidden="true" className={cn(styles.backdrop, "-z-10")}>
        <div className={styles.glow} />
      </div>

      <Container className="relative">
        <div className="flex max-w-3xl flex-col items-start gap-6 motion-safe:animate-fade-in-up">
          <Badge variant="neutral">
            <span
              className="size-2 rounded-full bg-success motion-safe:animate-pulse"
              aria-hidden="true"
            />
            {h.availability}
          </Badge>

          <Heading level={1} size="display" className="text-balance">
            {h.headline}
          </Heading>

          <Text size="body-lg" tone="muted" className="max-w-2xl text-pretty">
            {h.subheadline}
          </Text>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <ButtonLink href={localizedHref(locale, "/projects")} size="lg">
              {h.ctaPrimary}
            </ButtonLink>
            <ButtonLink
              href={localizedHref(locale, "/contact")}
              variant="secondary"
              size="lg"
            >
              {h.ctaSecondary}
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
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <ChevronDown
          className={cn("size-6 text-muted-foreground", styles.scrollCue)}
        />
      </div>
    </section>
  );
}
