import {
  Briefcase,
  Boxes,
  Globe,
  Laptop,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { availabilityItems, type AvailabilityKey } from "../content";

export interface AvailabilityProps {
  locale: Locale;
}

const ITEM_ICON: Record<AvailabilityKey, LucideIcon> = {
  fulltime: Briefcase,
  freelance: Laptop,
  remote: Globe,
  ai: Sparkles,
  saas: Boxes,
};

export async function Availability({ locale }: AvailabilityProps) {
  const t = await getDictionary(locale);
  const section = t.contact.availability;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-1 text-caption font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {section.statusLabel}
            </span>
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              intro={section.intro}
            />
          </div>
          <RevealGroup
            variant="up"
            as="ul"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {availabilityItems.map((key) => {
              const Icon = ITEM_ICON[key];
              return (
                <li key={key}>
                  <Card
                    interactive
                    className="group/avail flex h-full flex-col items-start gap-3"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/avail:border-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Text className="font-medium text-foreground">
                      {section.items[key]}
                    </Text>
                  </Card>
                </li>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
