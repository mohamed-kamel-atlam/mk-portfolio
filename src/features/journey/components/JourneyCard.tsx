import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Card, Heading, Text } from "@/shared/ui";

export interface JourneyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  interactive?: boolean;
  className?: string;
}

/**
 * The journey feature's recurring card: an accent icon badge, an `<h3>`, and a
 * description. Feature-local (mirrors the same grammar the other pages use)
 * rather than imported across features, keeping the feature self-contained.
 */
export function JourneyCard({
  icon: Icon,
  title,
  description,
  interactive = true,
  className,
}: JourneyCardProps) {
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
