import {
  Braces,
  Contrast,
  Ear,
  Keyboard,
  Wind,
  Code2,
  type LucideIcon,
} from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { a11yTopics, type A11yTopicKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";
import { IconCard } from "./IconCard";

export interface AccessibilityApproachProps {
  locale: Locale;
}

const TOPIC_ICON: Record<A11yTopicKey, LucideIcon> = {
  semantics: Code2,
  keyboard: Keyboard,
  aria: Braces,
  reducedMotion: Wind,
  contrast: Contrast,
  screenReaders: Ear,
};

/**
 * Accessibility (§5) — why it matters, then what it means in practice. Statement
 * anchored by an accent rule, topics as cards. Links to the accessibility doc.
 * Reveals with `up`.
 */
export async function AccessibilityApproach({
  locale,
}: AccessibilityApproachProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.accessibility;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
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
            {a11yTopics.map((key) => (
              <IconCard
                key={key}
                icon={TOPIC_ICON[key]}
                title={section.topics[key].title}
                description={section.topics[key].description}
              />
            ))}
          </div>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/accessibility")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
