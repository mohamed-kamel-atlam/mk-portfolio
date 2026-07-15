import { localizedHref, type Locale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/cn";
import { Text } from "@/shared/ui";
import { Reveal } from "@/shared/ui/motion";

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
  /**
   * Render the lead project as a full-width hero card. On for the main showcase;
   * off for secondary strips (e.g. related projects) where all cards are equal.
   */
  featureFirst?: boolean;
  /** Heading level for card titles — 2 under a page `h1`, 3 under a section. */
  headingLevel?: 2 | 3;
}

/** Stagger step between successive card reveals (ms). */
const STAGGER_STEP = 80;

/**
 * The premium showcase grid: a 1 / 2 / 3 responsive grid where `featured`
 * projects span the full row as a side-by-side hero. Fully data-driven — order
 * and prominence come from frontmatter (`order`, `featured`), never hardcoded —
 * so it scales to any number of projects without a layout change. Cards reveal
 * on scroll with a subtle stagger; a Server Component that renders the existing
 * {@link Reveal} island around each server-rendered card.
 */
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
    <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        // The lead project (first by content order) is the full-width hero;
        // the rest fill the 1/2/3 grid. One standout, data-driven by ordering.
        const isHero = featureFirst && index === 0;
        return (
          <li
            key={project.slug}
            className={cn("h-full", isHero && "sm:col-span-2 lg:col-span-3")}
          >
            <Reveal delay={index * STAGGER_STEP} className="h-full">
              <ProjectShowcaseCard
                project={project}
                href={localizedHref(locale, `/projects/${project.slug}`)}
                labels={labels}
                variant={isHero ? "featured" : "standard"}
                headingLevel={headingLevel}
                priority={isHero}
                className="h-full"
              />
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
