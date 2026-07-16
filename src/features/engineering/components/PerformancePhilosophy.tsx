import {
  Activity,
  DatabaseZap,
  Droplets,
  Images,
  Package,
  Server,
  Split,
  Waves,
  type LucideIcon,
} from "lucide-react";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading, Text } from "@/shared/ui";
import { GlowLayer } from "@/shared/ui/background";
import { RevealGroup } from "@/shared/ui/motion";

import { performanceTopics, type PerformanceTopicKey } from "../content";
import { DeepDiveLink } from "./DeepDiveLink";
import { IconCard } from "./IconCard";

export interface PerformancePhilosophyProps {
  locale: Locale;
}

const TOPIC_ICON: Record<PerformanceTopicKey, LucideIcon> = {
  rendering: Server,
  hydration: Droplets,
  streaming: Waves,
  codeSplitting: Split,
  images: Images,
  caching: DatabaseZap,
  vitals: Activity,
  bundle: Package,
};

export async function PerformancePhilosophy({
  locale,
}: PerformancePhilosophyProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.performance;

  return (
    <Section className="section-muted relative isolate overflow-hidden">
      <GlowLayer position="top" />
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
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
          <RevealGroup
            variant="up"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {performanceTopics.map((key) => (
              <IconCard
                key={key}
                icon={TOPIC_ICON[key]}
                title={section.topics[key].title}
                description={section.topics[key].description}
              />
            ))}
          </RevealGroup>
          <DeepDiveLink
            href={localizedHref(locale, "/engineering/performance")}
            label={t.engineering.readMore}
          />
        </RevealGroup>
      </Container>
    </Section>
  );
}
