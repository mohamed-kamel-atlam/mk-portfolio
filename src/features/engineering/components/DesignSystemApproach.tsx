import {
  Blocks,
  Component,
  Palette,
  Ruler,
  SlidersHorizontal,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { designSystemTopics, type DesignSystemTopicKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";
import { IconCard } from "./IconCard";

export interface DesignSystemApproachProps {
  locale: Locale;
}

const TOPIC_ICON: Record<DesignSystemTopicKey, LucideIcon> = {
  tokens: Palette,
  components: Component,
  variants: SlidersHorizontal,
  composition: Blocks,
  consistency: Ruler,
  maintainability: Wrench,
};

/**
 * Design systems (§6) — how I build UI that scales. The page itself is the
 * proof: the statement makes the token rule concrete. Links to the architecture
 * doc. Reveals with `fade`.
 */
export async function DesignSystemApproach({
  locale,
}: DesignSystemApproachProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.designSystems;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <Text
            size="body-lg"
            className="max-w-3xl text-pretty border-s-2 border-accent ps-6"
          >
            {section.statement}
          </Text>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {designSystemTopics.map((key) => (
              <IconCard
                key={key}
                icon={TOPIC_ICON[key]}
                title={section.topics[key].title}
                description={section.topics[key].description}
              />
            ))}
          </div>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/architecture")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
