import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Card, Heading, Text } from "@/shared/ui";

export interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Opt out of the hover lift (e.g. under a `mask` reveal). Default on. */
  interactive?: boolean;
  className?: string;
}

/**
 * The engineering hub's recurring card: an accent icon badge, an `<h3>`, and a
 * description. Defined once so the overview sections share one visual grammar
 * instead of repeating the same markup. Presentational — copy and icon come from
 * the calling section.
 */
export function IconCard({
  icon: Icon,
  title,
  description,
  interactive = true,
  className,
}: IconCardProps) {
  return (
    <Card
      interactive={interactive}
      className={cn("group/card flex h-full flex-col gap-3", className)}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface-muted text-accent transition-colors duration-fast group-hover/card:border-accent">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <Heading level={3} size="h4">
        {title}
      </Heading>
      <Text tone="muted" className="text-pretty">
        {description}
      </Text>
    </Card>
  );
}
