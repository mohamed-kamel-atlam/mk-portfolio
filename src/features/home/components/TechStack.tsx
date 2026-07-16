import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { getTechIcon } from "@/shared/lib/tech-icons";
import {
  Container,
  getTechLogo,
  Section,
  SectionHeading,
  TechLogo,
  Text,
} from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import { techGroups } from "../content";

export interface TechStackProps {
  locale: Locale;
}

// One tile in the stack: real brand logo (tints on hover) or a Lucide fallback,
// with a coordinated hover — border, surface, label and logo shift together.
function TechTile({ name }: { name: string }) {
  const logo = getTechLogo(name);
  const Icon = getTechIcon({ name });
  return (
    <li>
      <span className="group/tile inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-small text-muted-foreground transition duration-fast hover:border-accent hover:bg-surface-muted hover:text-foreground motion-safe:hover:-translate-y-0.5">
        {logo ? (
          <TechLogo
            name={name}
            className="size-4 transition-colors duration-fast group-hover/tile:text-[color:var(--brand)]"
          />
        ) : (
          <Icon aria-hidden="true" className="size-4 text-accent" />
        )}
        {name}
      </span>
    </li>
  );
}

// Landing tech stack — grouped like a developer's toolbox, label beside the tools.
export async function TechStack({ locale }: TechStackProps) {
  const t = await getDictionary(locale);
  const section = t.home.tech;

  return (
    <Section className="section-muted">
      <Container>
        <RevealGroup variant="up" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            intro={section.intro}
          />
          {techGroups.map((group) => (
            <div
              key={group.key}
              className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-baseline sm:gap-10"
            >
              <Text
                size="small"
                className="font-medium uppercase text-muted-foreground sm:w-40 sm:shrink-0"
              >
                {section.groups[group.key]}
              </Text>
              <ul className="flex flex-1 flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <TechTile key={item} name={item} />
                ))}
              </ul>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
