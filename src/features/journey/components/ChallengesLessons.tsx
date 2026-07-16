import { Anchor, Building2, Signpost, type LucideIcon } from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Container, Section, SectionHeading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { challenges, type ChallengeKey } from "../content";
import { JourneyCard } from "./JourneyCard";

export interface ChallengesLessonsProps {
  locale: Locale;
}

const CHALLENGE_ICON: Record<ChallengeKey, LucideIcon> = {
  detour: Signpost,
  depth: Anchor,
  commercial: Building2,
};

export async function ChallengesLessons({ locale }: ChallengesLessonsProps) {
  const t = await getDictionary(locale);
  const section = t.journey.challenges;

  return (
    <Section>
      <Container>
        <RevealGroup variant="scale" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup variant="up" className="grid gap-6 sm:grid-cols-3">
            {challenges.map((key) => (
              <JourneyCard
                key={key}
                icon={CHALLENGE_ICON[key]}
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
