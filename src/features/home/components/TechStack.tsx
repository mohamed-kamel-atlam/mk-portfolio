import {
  Boxes,
  Component,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { getTechIcon } from "@/shared/lib/tech-icons";
import { Badge, Container, Section, SectionHeading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { techGroups, type TechGroupKey } from "../content";

export interface TechStackProps {
  locale: Locale;
}

/**
 * Category header icon + the fallback icon category for each group's chips, so
 * the skills read as intentional capability areas rather than a flat badge dump.
 */
const GROUP_META: Record<
  TechGroupKey,
  { icon: LucideIcon; iconCategory: string }
> = {
  frontend: { icon: Component, iconCategory: "framework" },
  architecture: { icon: Boxes, iconCategory: "infra" },
  ai: { icon: Sparkles, iconCategory: "ai" },
  tooling: { icon: Wrench, iconCategory: "tooling" },
};

/** Skills, grouped by capability area. A muted band gives the section identity. */
export async function TechStack({ locale }: TechStackProps) {
  const t = await getDictionary(locale);
  const section = t.home.tech;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {techGroups.map((group) => {
              const GroupIcon = GROUP_META[group.key].icon;
              return (
                <div key={group.key} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-accent">
                      <GroupIcon aria-hidden="true" className="size-4" />
                    </span>
                    <Text
                      size="small"
                      className="font-medium uppercase text-foreground"
                    >
                      {section.groups[group.key]}
                    </Text>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => {
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
                            <Icon aria-hidden="true" className="size-3.5" />
                            {item}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </RevealGroup>
      </Container>
    </Section>
  );
}
