import { getTechIcon } from "@/shared/lib/tech-icons";
import { Heading } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import type { Project } from "../lib/get-projects";

export interface ProjectTechStackProps {
  techStack: Project["frontmatter"]["techStack"];
  label: string;
  /** Anchor id so the TOC can target this section. */
  id?: string;
}

export function ProjectTechStack({
  techStack,
  label,
  id,
}: ProjectTechStackProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className="flex scroll-mt-24 flex-col gap-4"
    >
      <Heading level={2} size="h4">
        {label}
      </Heading>
      <RevealGroup variant="up" as="ul" className="flex flex-wrap gap-2">
        {techStack.map((tech) => {
          const Icon = getTechIcon(tech);
          return (
            <li key={tech.name}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1.5 text-small font-medium text-muted-foreground transition-colors duration-fast hover:border-accent hover:text-foreground">
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {tech.name}
              </span>
            </li>
          );
        })}
      </RevealGroup>
    </section>
  );
}
