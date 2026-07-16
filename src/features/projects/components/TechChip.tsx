import type { ProjectFrontmatter } from "@/content/schema";
import { cn } from "@/shared/lib/cn";
import { getTechIcon } from "@/shared/lib/tech-icons";
import { getTechLogo, TechLogo } from "@/shared/ui";

type TechItem = ProjectFrontmatter["techStack"][number];

export interface TechChipProps {
  tech: TechItem;
  className?: string;
}

// Tech chip: real brand logo (tinting to its color on card hover) with a Lucide
// fallback for anything without an official mark. Reacts to the parent card's
// `group/card` hover.
export function TechChip({ tech, className }: TechChipProps) {
  const logo = getTechLogo(tech.name);
  const Icon = getTechIcon(tech);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2 py-1 text-caption font-medium text-muted-foreground",
        "transition-colors duration-fast group-hover/card:border-border group-hover/card:text-foreground",
        className,
      )}
    >
      {logo ? (
        <TechLogo
          name={tech.name}
          className="size-3.5 transition-colors duration-fast group-hover/card:text-[color:var(--brand)]"
        />
      ) : (
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      )}
      {tech.name}
    </span>
  );
}

export interface TechOverflowChipProps {
  count: number;
  label: string;
  className?: string;
}

// "+N" chip after the capped set of technologies.
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
