import {
  Accessibility,
  FileText,
  Gauge,
  GraduationCap,
  Server,
  Target,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import {
  engineeringPrinciples,
  type EngineeringPrincipleKey,
} from "../content";
import { IconCard } from "./IconCard";

export interface EngineeringPrinciplesProps {
  locale: Locale;
}

const PRINCIPLE_ICON: Record<EngineeringPrincipleKey, LucideIcon> = {
  performance: Gauge,
  accessibility: Accessibility,
  serverFirst: Server,
  maintainability: Wrench,
  scalability: TrendingUp,
  ownership: Target,
  documentation: FileText,
  learning: GraduationCap,
};

export async function EngineeringPrinciples({
  locale,
}: EngineeringPrinciplesProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.principles;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup
            variant="up"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {engineeringPrinciples.map((key) => (
              <IconCard
                key={key}
                icon={PRINCIPLE_ICON[key]}
                title={section.items[key].title}
                description={section.items[key].description}
              />
            ))}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
