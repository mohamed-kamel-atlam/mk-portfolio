import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Heading } from "@/shared/ui";

import type { Project } from "../lib/get-projects";
import { buildProjectCardLabels } from "./ProjectShowcaseCard";
import { ProjectsGrid } from "./ProjectsGrid";

export interface RelatedProjectsProps {
  projects: Project[];
  locale: Locale;
  label: string;
}

/** "Related projects" block — reuses the showcase grid; hidden when empty. */
export async function RelatedProjects({
  projects,
  locale,
  label,
}: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  const p = (await getDictionary(locale)).projectsPage;

  return (
    <section aria-label={label} className="flex flex-col gap-6">
      <Heading level={2} size="h3">
        {label}
      </Heading>
      <ProjectsGrid
        projects={projects}
        locale={locale}
        labels={buildProjectCardLabels(p)}
        emptyLabel={p.empty}
        featureFirst={false}
        headingLevel={3}
      />
    </section>
  );
}
