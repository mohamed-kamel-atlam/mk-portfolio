import Link from "next/link";

import { Badge, Card, Heading, Text } from "@/shared/ui";

export interface DocCardProps {
  href: string;
  kindLabel: string;
  title: string;
  summary: string;
}

/**
 * Presentational card for a single engineering doc — a category badge, title,
 * and summary. The whole card is one link; the accent border/title on hover
 * signals interactivity without relying on color alone.
 */
export function DocCard({ href, kindLabel, title, summary }: DocCardProps) {
  return (
    <Link href={href} className="group block h-full rounded-lg">
      <Card className="flex h-full flex-col gap-3 transition duration-normal group-hover:border-accent group-hover:shadow-lg motion-safe:group-hover:-translate-y-1">
        <div>
          <Badge variant="neutral">{kindLabel}</Badge>
        </div>
        <Heading
          level={4}
          size="h4"
          className="transition-colors duration-fast group-hover:text-accent"
        >
          {title}
        </Heading>
        <Text tone="muted" className="text-pretty">
          {summary}
        </Text>
      </Card>
    </Link>
  );
}
