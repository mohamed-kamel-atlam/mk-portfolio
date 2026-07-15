import {
  Braces,
  Brain,
  Component,
  FileText,
  Layers,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { getTechIcon } from "@/shared/lib/tech-icons";
import {
  Badge,
  Card,
  Container,
  Heading,
  Section,
  SectionHeading,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { toolGroups, type ToolGroupKey } from "../content";

export interface EngineeringToolsProps {
  locale: Locale;
}

/** Per-group header icon + fallback icon category for that group's chips. */
const GROUP_META: Record<
  ToolGroupKey,
  { icon: LucideIcon; iconCategory: string }
> = {
  frameworks: { icon: Component, iconCategory: "framework" },
  languages: { icon: Braces, iconCategory: "language" },
  state: { icon: Layers, iconCategory: "state" },
  styling: { icon: Palette, iconCategory: "styling" },
  animation: { icon: Sparkles, iconCategory: "animation" },
  content: { icon: FileText, iconCategory: "content" },
  quality: { icon: ShieldCheck, iconCategory: "tooling" },
  tooling: { icon: Wrench, iconCategory: "tooling" },
  infrastructure: { icon: Server, iconCategory: "infra" },
  ai: { icon: Brain, iconCategory: "ai" },
};

/**
 * Tools (§8) — grouped by the job they do, not dumped as a logo wall. Each group
 * is a card with an icon, a localized label, and iconified chips (names are
 * proper nouns). Reveals with `fade`.
 */
export async function EngineeringTools({ locale }: EngineeringToolsProps) {
  const t = await getDictionary(locale);
  const section = t.engineering.tools;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="fade" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolGroups.map((group) => {
              const GroupIcon = GROUP_META[group.key].icon;
              return (
                <Card
                  key={group.key}
                  interactive
                  className="group/tools flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-accent transition-colors duration-fast group-hover/tools:border-accent">
                      <GroupIcon aria-hidden="true" className="size-4" />
                    </span>
                    <Heading level={3} size="h4">
                      {section.groups[group.key]}
                    </Heading>
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
                </Card>
              );
            })}
          </div>
        </RevealGroup>
      </Container>
    </Section>
  );
}
