import { localizedHref, type Locale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/cn";
import { Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import type { Project } from "../lib/get-projects";
import {
  ProjectShowcaseCard,
  type ProjectCardLabels,
} from "./ProjectShowcaseCard";

export interface ProjectsGridProps {
  projects: Project[];
  locale: Locale;
  labels: ProjectCardLabels;
  /** Localized empty-state message. */
  emptyLabel: string;
  featureFirst?: boolean;
  /** Heading level for card titles — 2 under a page `h1`, 3 under a section. */
  headingLevel?: 2 | 3;
}

export function ProjectsGrid({
  projects,
  locale,
  labels,
  emptyLabel,
  featureFirst = true,
  headingLevel = 2,
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <Text tone="muted" role="status">
        {emptyLabel}
      </Text>
    );
  }

  return (
    // Each card is a direct child, so RevealGroup staggers them individually
    // (capped delay) as the grid scrolls into view.
    <RevealGroup
      as="ul"
      className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project, index) => {
        // The lead project (first by content order) is the full-width hero;
        // the rest fill the 1/2/3 grid. One standout, data-driven by ordering.
        const isHero = featureFirst && index === 0;
        return (
          <li
            key={project.slug}
            className={cn("h-full", isHero && "sm:col-span-2 lg:col-span-3")}
          >
            <ProjectShowcaseCard
              project={project}
              href={localizedHref(locale, `/projects/${project.slug}`)}
              labels={labels}
              variant={isHero ? "featured" : "standard"}
              headingLevel={headingLevel}
              priority={isHero}
              className="h-full"
            />
          </li>
        );
      })}
    </RevealGroup>
  );
}
