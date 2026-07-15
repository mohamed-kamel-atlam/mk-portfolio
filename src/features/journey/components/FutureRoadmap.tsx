import {
  Compass,
  GraduationCap,
  Boxes,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { roadmapItems, type RoadmapKey } from "../content";
import { JourneyCard } from "./JourneyCard";

export interface FutureRoadmapProps {
  locale: Locale;
}

const ROADMAP_ICON: Record<RoadmapKey, LucideIcon> = {
  graduate: GraduationCap,
  lead: Compass,
  systems: Boxes,
  growth: TrendingUp,
};

/**
 * Future roadmap (§7) — where the journey heads next, as forward-looking cards.
 * Reveals with `up`.
 */
export async function FutureRoadmap({ locale }: FutureRoadmapProps) {
  const t = await getDictionary(locale);
  const section = t.journey.roadmap;

  return (
    <Section>
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roadmapItems.map((key) => (
              <JourneyCard
                key={key}
                icon={ROADMAP_ICON[key]}
                title={section.items[key].title}
                description={section.items[key].description}
              />
            ))}
          </div>
        </RevealGroup>
      </Container>
    </Section>
  );
}
