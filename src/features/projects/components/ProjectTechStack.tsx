import { Badge, Heading } from "@/shared/ui";

import type { Project } from "../lib/get-projects";

export interface ProjectTechStackProps {
  techStack: Project["frontmatter"]["techStack"];
  label: string;
}

/** The project's structured tech stack, rendered as token-styled badges. */
export function ProjectTechStack({ techStack, label }: ProjectTechStackProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-3">
      <Heading level={2} size="h4">
        {label}
      </Heading>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech.name}>{tech.name}</Badge>
        ))}
      </div>
    </section>
  );
}
