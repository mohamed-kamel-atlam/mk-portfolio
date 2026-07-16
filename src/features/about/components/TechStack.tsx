import {
  Brain,
  Component,
  Layers,
  Palette,
  Server,
  Waypoints,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { getTechIcon } from "@/shared/lib/tech-icons";
import {
  Badge,
  Card,
  Container,
  getTechLogo,
  Heading,
  Section,
  SectionHeading,
  TechLogo,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { skillGroups, type SkillGroupKey } from "../content";

export interface TechStackProps {
  locale: Locale;
}

// Header icon + fallback icon category per group.
const GROUP_META: Record<
  SkillGroupKey,
  { icon: LucideIcon; iconCategory: string }
> = {
  core: { icon: Component, iconCategory: "framework" },
  state: { icon: Layers, iconCategory: "state" },
  styling: { icon: Palette, iconCategory: "styling" },
  architecture: { icon: Waypoints, iconCategory: "infra" },
  apis: { icon: Server, iconCategory: "backend" },
  performance: { icon: Zap, iconCategory: "performance" },
  tooling: { icon: Wrench, iconCategory: "tooling" },
  ai: { icon: Brain, iconCategory: "ai" },
};

// Tech stack — toolkit grouped by capability, each group a card of logo chips.
export async function TechStack({ locale }: TechStackProps) {
  const t = await getDictionary(locale);
  const section = t.about.skills;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <RevealGroup variant="up" className="grid gap-6 md:grid-cols-2">
            {skillGroups.map((group) => {
              const GroupIcon = GROUP_META[group.key].icon;
              return (
                <Card
                  key={group.key}
                  interactive
                  className="group/skill flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/skill:border-accent">
                      <GroupIcon aria-hidden="true" className="size-5" />
                    </span>
                    <Heading level={3} size="h4">
                      {section.groups[group.key]}
                    </Heading>
                  </div>
                  <Text size="small" tone="muted" className="text-pretty">
                    {section.descriptions[group.key]}
                  </Text>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {group.items.map((item) => {
                      const logo = getTechLogo(item);
                      const Icon = getTechIcon({
                        name: item,
                        category: GROUP_META[group.key].iconCategory,
                      });
                      return (
                        <li key={item}>
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            {logo ? (
                              <TechLogo
                                name={item}
                                className="size-3.5 transition-colors duration-fast group-hover/skill:text-[color:var(--brand)]"
                              />
                            ) : (
                              <Icon aria-hidden="true" className="size-3.5" />
                            )}
                            {item}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              );
            })}
          </RevealGroup>
        </RevealGroup>
      </Container>
    </Section>
  );
}
