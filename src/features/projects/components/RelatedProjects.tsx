import type { Locale } from "@/shared/i18n/config";
import { Heading } from "@/shared/ui";

import type { Project } from "../lib/get-projects";
import { ProjectsGrid } from "./ProjectsGrid";

export interface RelatedProjectsProps {
  projects: Project[];
  locale: Locale;
  label: string;
}

/** "Related projects" block — reuses the grid; hidden when there are none. */
export function RelatedProjects({
  projects,
  locale,
  label,
}: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section aria-label={label} className="flex flex-col gap-6">
      <Heading level={2} size="h3">
        {label}
      </Heading>
      <ProjectsGrid projects={projects} locale={locale} />
    </section>
  );
}
