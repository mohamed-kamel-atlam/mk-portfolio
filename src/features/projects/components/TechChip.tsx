import type { ProjectFrontmatter } from "@/content/schema";
import { cn } from "@/shared/lib/cn";
import { getTechIcon } from "@/shared/lib/tech-icons";

type TechItem = ProjectFrontmatter["techStack"][number];

export interface TechChipProps {
  tech: TechItem;
  className?: string;
}

/**
 * A single technology chip: monochrome icon + label on a muted surface. Reacts
 * to the card hover (border + text lift) via the `group/card` group. Server
 * Component; the icon comes from the centralized {@link getTechIcon} mapping.
 */
export function TechChip({ tech, className }: TechChipProps) {
  const Icon = getTechIcon(tech);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-2 py-1 text-caption font-medium text-muted-foreground",
        "transition-colors duration-fast group-hover/card:border-border group-hover/card:text-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {tech.name}
    </span>
  );
}

export interface TechOverflowChipProps {
  count: number;
  /** Localized "+{count}" label. */
  label: string;
  className?: string;
}

/** Overflow indicator chip shown after the capped set of technologies. */
export function TechOverflowChip({
  count,
  label,
  className,
}: TechOverflowChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-transparent px-2 py-1 text-caption font-medium text-muted-foreground",
        className,
      )}
      aria-label={label.replace("{count}", String(count))}
    >
      +{count}
    </span>
  );
}
