import {
  Atom,
  Code2,
  FileCode2,
  MapPin,
  Plane,
  Triangle,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { quickFacts, type QuickFactKey } from "../content";

export interface QuickFactsProps {
  locale: Locale;
}

const FACT_ICON: Record<QuickFactKey, LucideIcon> = {
  role: Code2,
  location: MapPin,
  react: Atom,
  nextjs: Triangle,
  typescript: FileCode2,
  relocation: Plane,
};

export async function QuickFacts({ locale }: QuickFactsProps) {
  const t = await getDictionary(locale);
  const section = t.contact.quickFacts;

  return (
    <Section>
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            as="ul"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {quickFacts.map((key) => {
              const Icon = FACT_ICON[key];
              return (
                <li key={key}>
                  <Card
                    interactive
                    className="group/fact flex h-full items-center gap-3"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/fact:border-accent">
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
