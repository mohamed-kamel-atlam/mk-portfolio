import { Award, Cpu, FileText, Languages, type LucideIcon } from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Card, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { funFacts, type FunFactKey } from "../content";

export interface FunFactsProps {
  locale: Locale;
}

/** An icon per fact — kept professional, one concrete signal each. */
const FACT_ICON: Record<FunFactKey, LucideIcon> = {
  ai: Cpu,
  bilingual: Languages,
  documentation: FileText,
  craft: Award,
};

export async function FunFacts({ locale }: FunFactsProps) {
  const t = await getDictionary(locale);
  const section = t.about.funFacts;

  return (
    <Section>
      <Container>
        <RevealGroup variant="mask" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            as="ul"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {funFacts.map((key) => {
              const item = section.items[key];
              const Icon = FACT_ICON[key];
              return (
                <li key={key}>
                  <Card className="flex h-full flex-col gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Text className="font-medium text-foreground">
                      {item.label}
                    </Text>
                    <Text size="small" tone="muted" className="text-pretty">
                      {item.value}
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
