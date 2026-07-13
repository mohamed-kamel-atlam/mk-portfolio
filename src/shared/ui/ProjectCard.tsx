import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import { Badge } from "./Badge";
import { Card } from "./Card";
import { Heading } from "./Heading";
import { Text } from "./Text";

export interface ProjectCardProps {
  href: string;
  title: string;
  summary: string;
  tags?: readonly string[];
  role?: string;
  className?: string;
}

/**
 * Presentational project card — a linked surface used by both the home
 * "featured" section and the projects index. Purely presentational (primitive
 * props, no content-type dependency), so it lives in `shared/ui` and is shared
 * across features without a cross-feature import. The whole card is one link;
 * hover feedback is a token color shift.
 */
export function ProjectCard({
  href,
  title,
  summary,
  tags,
  role,
  className,
}: ProjectCardProps) {
  return (
    <Link href={href} className={cn("group block rounded-lg", className)}>
      <Card
        elevation={1}
        className="flex h-full flex-col gap-3 transition duration-normal group-hover:border-accent group-hover:shadow-lg motion-safe:group-hover:-translate-y-1"
      >
        {role ? (
          <Text size="caption" tone="muted" className="uppercase">
            {role}
          </Text>
        ) : null}
        <Heading
          level={3}
          size="h4"
          className="transition-colors duration-fast group-hover:text-accent"
        >
          {title}
        </Heading>
        <Text tone="muted">{summary}</Text>
        {tags && tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </Card>
    </Link>
  );
}
