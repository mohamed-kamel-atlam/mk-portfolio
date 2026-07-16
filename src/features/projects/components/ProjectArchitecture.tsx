import { Scale } from "lucide-react";

import { Card, Heading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import type { Project } from "../lib/get-projects";

export interface ProjectArchitectureProps {
  decisions: NonNullable<Project["frontmatter"]["architectureDecisions"]>;
  label: string;
  /** Anchor id so the TOC can target this section. */
  id?: string;
}

export function ProjectArchitecture({
  decisions,
  label,
  id,
}: ProjectArchitectureProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className="flex scroll-mt-24 flex-col gap-6"
    >
      <Heading level={2} size="h4">
        {label}
      </Heading>
      <RevealGroup variant="up" className="grid gap-4 sm:grid-cols-2">
        {decisions.map((decision) => (
          <Card
            key={decision.title}
            interactive
            className="group/adr flex flex-col gap-3"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/adr:border-accent">
              <Scale aria-hidden="true" className="size-5" />
            </span>
            <Heading level={3} size="h4">
              {decision.title}
            </Heading>
            <Text tone="muted" className="text-pretty">
              {decision.rationale}
            </Text>
          </Card>
        ))}
      </RevealGroup>
    </section>
  );
}
