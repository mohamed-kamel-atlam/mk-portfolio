import { localizedHref, type Locale } from "@/shared/i18n/config";
import { ProjectCard } from "@/shared/ui";

import type { Project } from "../lib/get-projects";

export interface ProjectsGridProps {
  projects: Project[];
  locale: Locale;
}

/** Responsive grid of project cards. Reuses the shared presentational card. */
export function ProjectsGrid({ projects, locale }: ProjectsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          href={localizedHref(locale, `/projects/${project.slug}`)}
          title={project.frontmatter.title}
          summary={project.frontmatter.summary}
          role={project.frontmatter.role}
          tags={project.frontmatter.techStack.map((tech) => tech.name)}
        />
      ))}
    </div>
  );
}
