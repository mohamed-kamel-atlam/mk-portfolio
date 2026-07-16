import {
  GraduationCap,
  Lightbulb,
  Microscope,
  MessagesSquare,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import {
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { coreValues, type CoreValueKey } from "../content";

export interface CoreValuesProps {
  locale: Locale;
}

/** An icon per value, so each trait registers before the text is read. */
const VALUE_ICON: Record<CoreValueKey, LucideIcon> = {
  curiosity: Lightbulb,
  quality: Sparkles,
  learning: GraduationCap,
  ownership: Target,
  communication: MessagesSquare,
  detail: Microscope,
};

/** The human character behind the code — the traits a team works alongside. */
export async function CoreValues({ locale }: CoreValuesProps) {
  const t = await getDictionary(locale);
  const section = t.about.values;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {coreValues.map((key) => {
              const item = section.items[key];
              const Icon = VALUE_ICON[key];
              return (
                <Card
                  key={key}
                  interactive
                  className="group/value flex flex-col gap-3"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/value:border-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <Heading level={3} size="h4">
                    {item.title}
                  </Heading>
                  <Text tone="muted" className="text-pretty">
                    {item.description}
                  </Text>
                </Card>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
