import { ArrowRight } from "lucide-react";

import { socialLinks } from "@/shared/config/site";
import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import {
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { contactMethods, WHATSAPP, type ContactMethodKey } from "../content";
import { methodIcons } from "./method-icons";

export interface ContactMethodsProps {
  locale: Locale;
}

/** Resolve each method's destination — social config for the known channels,
 *  the contact-local constant for WhatsApp. */
function hrefFor(key: ContactMethodKey): string {
  if (key === "whatsapp") return WHATSAPP.href;
  return socialLinks.find((social) => social.key === key)?.href ?? "#";
}

/** mailto stays in-app; the rest open in a new, secured tab. */
function externalAttrs(key: ContactMethodKey) {
  return key === "email"
    ? {}
    : { target: "_blank" as const, rel: "noopener noreferrer" };
}

/**
 * Contact methods (§2) — premium link cards for every direct channel. Each is a
 * real `<a>` (Server Component, zero JS): large icon, title, description, an
 * arrow that slides on hover, border-accent glow + elevation lift, and the
 * global focus ring for keyboard users. The WhatsApp card adds the number and a
 * reply-time note, in a subtle accent that blends with the design system.
 */
export async function ContactMethods({ locale }: ContactMethodsProps) {
  const t = await getDictionary(locale);
  const section = t.contact.methods;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((key) => {
              const item = section.items[key];
              const Icon = methodIcons[key];
              const isWhatsapp = key === "whatsapp";
              return (
                <li key={key}>
                  <a
                    href={hrefFor(key)}
                    {...externalAttrs(key)}
                    className="group/method block h-full rounded-lg"
                  >
                    <Card
                      className={cn(
                        "flex h-full flex-col gap-4 transition duration-normal",
                        "group-hover/method:border-accent group-hover/method:shadow-accent",
                        "motion-safe:group-hover/method:-translate-y-1",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span className="inline-flex size-12 items-center justify-center rounded-xl border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/method:border-accent">
                          <Icon className="size-6" />
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="size-5 text-muted-foreground transition-all duration-fast group-hover/method:text-accent motion-safe:group-hover/method:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover/method:-translate-x-0.5"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Heading level={3} size="h4">
                          {item.title}
                        </Heading>
                        <Text size="small" tone="muted" className="text-pretty">
                          {item.description}
                        </Text>
                      </div>
                      {isWhatsapp ? (
                        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
                          <span className="text-small font-medium tabular-nums text-foreground">
                            {WHATSAPP.display}
                          </span>
                          <span className="text-caption text-muted-foreground">
                            {"status" in item ? item.status : null}
                          </span>
                        </div>
                      ) : null}
                    </Card>
                  </a>
                </li>
              );
            })}
          </ul>
        </RevealGroup>
      </Container>
    </Section>
  );
}
