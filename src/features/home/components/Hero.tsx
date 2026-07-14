import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { BLUR_DATA_URL, PROFILE_IMAGE_SRC } from "@/shared/assets";
import { socialLinks } from "@/shared/config/site";
import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import {
  Badge,
  ButtonLink,
  Container,
  Heading,
  Section,
  Text,
} from "@/shared/ui";
import { AnimateIn, Magnetic, Typewriter } from "@/shared/ui/motion";

import { heroTech } from "../content";
import styles from "./Hero.module.css";
import { socialIcons } from "./social-icons";

export interface HeroProps {
  locale: Locale;
}

const IMAGE_SIZES = "(min-width: 1024px) 28rem, (min-width: 640px) 60vw, 85vw";

/**
 * Landing hero — the five-second pitch. A Server Component: content ships as HTML
 * and the only client islands are the rotating {@link Typewriter} and the
 * {@link Magnetic} social icons. Entrance is a staggered CSS reveal (zero JS),
 * sequenced badge → greeting → heading → paragraph → buttons → social → chips →
 * image. The ambient backdrop is the global ThemeBackground, so nothing is
 * recreated. Two columns on desktop (content + image) that mirror correctly in
 * RTL because the grid follows the writing direction — no physical ordering.
 */
export async function Hero({ locale }: HeroProps) {
  const t = await getDictionary(locale);
  const h = t.hero;

  return (
    <Section className={cn(styles.hero, "relative isolate flex items-center")}>
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Content */}
        <div className="flex flex-col items-start gap-8">
          <AnimateIn variant="fade">
            <Badge variant="neutral">
              <span
                className="size-2 rounded-full bg-success motion-safe:animate-pulse"
                aria-hidden="true"
              />
              {h.status}
            </Badge>
          </AnimateIn>

          <div className="flex flex-col gap-4">
            <AnimateIn variant="up" delay={60}>
              <p className="text-body-lg text-muted-foreground">
                {h.eyebrowLead}
                <span className="font-medium text-foreground">{h.name}</span>
              </p>
            </AnimateIn>

            <AnimateIn variant="up" delay={120}>
              <Heading level={1} size="display" className="text-balance">
                {h.headlineLead}
                <span className="text-accent">{h.headlineAccent}</span>
                {h.headlineTail}
              </Heading>
            </AnimateIn>

            <AnimateIn variant="up" delay={180}>
              <p className="font-mono text-body-lg font-medium text-accent">
                <Typewriter words={h.roles} />
              </p>
            </AnimateIn>
          </div>

          <AnimateIn variant="up" delay={240}>
            <Text size="body-lg" tone="muted" className="max-w-xl text-pretty">
              {h.description}
            </Text>
          </AnimateIn>

          <AnimateIn
            variant="up"
            delay={300}
            className="flex flex-wrap items-center gap-3"
          >
            <ButtonLink
              href={localizedHref(locale, "/projects")}
              size="lg"
              trailingArrow
            >
              {h.ctaPrimary}
            </ButtonLink>
            <ButtonLink
              href={localizedHref(locale, "/contact")}
              variant="secondary"
              size="lg"
            >
              {h.ctaSecondary}
            </ButtonLink>
          </AnimateIn>

          <AnimateIn variant="up" delay={360}>
            <ul className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.key];
                if (!Icon) return null;
                const isExternal = social.href.startsWith("http");
                return (
                  <li key={social.key}>
                    <Magnetic strength={4}>
                      <a
                        href={social.href}
                        aria-label={social.label}
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group inline-flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition duration-fast hover:border-accent hover:text-accent hover:shadow-accent motion-safe:hover:-translate-y-px"
                      >
                        <Icon className="size-5 transition-transform duration-fast motion-safe:group-hover:scale-110" />
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>
          </AnimateIn>

          <AnimateIn variant="up" delay={420}>
            <ul className="flex flex-wrap gap-2">
              {heroTech.map((tech) => (
                <li key={tech}>
                  <Badge
                    variant="outline"
                    className="transition-colors duration-fast hover:border-accent hover:text-foreground"
                  >
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>

        {/* Profile image — layered composition (glow → panel → portrait) */}
        <AnimateIn variant="scale" delay={480}>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div aria-hidden="true" className={styles.profileGlow} />
            <div aria-hidden="true" className={styles.profilePanel} />
            <div className={cn(styles.profileFloat, styles.profileMedia)}>
              <Image
                src={PROFILE_IMAGE_SRC}
                alt={h.imageAlt}
                width={501}
                height={498}
                priority
                sizes={IMAGE_SIZES}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="h-auto w-full"
              />
            </div>
          </div>
        </AnimateIn>
      </Container>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <ChevronDown
          className={cn("size-6 text-muted-foreground", styles.scrollCue)}
        />
      </div>
    </Section>
  );
}
