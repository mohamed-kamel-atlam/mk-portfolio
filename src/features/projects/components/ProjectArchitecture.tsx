import { Card, Heading, Text } from "@/shared/ui";

import type { Project } from "../lib/get-projects";

export interface ProjectArchitectureProps {
  decisions: NonNullable<Project["frontmatter"]["architectureDecisions"]>;
  label: string;
}

/**
 * Structured architecture decisions — the "why" behind the build, surfaced as
 * scannable cards. This is the engineering-story spine, distinct from prose.
 */
export function ProjectArchitecture({
  decisions,
  label,
}: ProjectArchitectureProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-4">
      <Heading level={2} size="h4">
        {label}
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        {decisions.map((decision) => (
          <Card key={decision.title} className="flex flex-col gap-2">
            <Heading level={3} size="h4">
              {decision.title}
            </Heading>
            <Text tone="muted">{decision.rationale}</Text>
          </Card>
        ))}
      </div>
    </section>
  );
}
