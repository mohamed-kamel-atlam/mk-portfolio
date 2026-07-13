import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge, Heading, Text } from "@/shared/ui";

export interface DocHeaderProps {
  backHref: string;
  backLabel: string;
  kindLabel: string;
  title: string;
  summary: string;
  updatedLabel: string;
  updatedDate: string;
}

/** Documentation article header — back link, category, title, and metadata. */
export function DocHeader({
  backHref,
  backLabel,
  kindLabel,
  title,
  summary,
  updatedLabel,
  updatedDate,
}: DocHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        {backLabel}
      </Link>

      <div>
        <Badge variant="neutral">{kindLabel}</Badge>
      </div>

      <Heading level={1} size="display" className="text-balance">
        {title}
      </Heading>

      <Text size="body-lg" tone="muted" className="text-pretty">
        {summary}
      </Text>

      <Text size="small" tone="muted" className="tabular-nums">
        {updatedLabel} · {updatedDate}
      </Text>
    </header>
  );
}
