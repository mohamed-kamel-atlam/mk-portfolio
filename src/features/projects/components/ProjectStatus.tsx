import type { ProjectStatus as Status } from "@/content/schema";
import { cn } from "@/shared/lib/cn";

import {
  PROJECT_STATUS_META,
  type ProjectStatusMeta,
} from "../lib/project-status";
import styles from "./ProjectStatus.module.css";

/** Map each status tone to its CSS-module tint class. */
const TONE_CLASS: Record<ProjectStatusMeta["tone"], string | undefined> = {
  production: styles.production,
  completed: styles.completed,
  inProgress: styles.inProgress,
  archived: styles.archived,
  research: styles.research,
};

export interface ProjectStatusProps {
  status: Status;
  /** Localized status label (from `projectsPage.status`). */
  label: string;
  className?: string;
}

/**
 * Semantic status chip: a soft-tinted pill carrying an icon **and** a text
 * label, so status is never conveyed by color alone. Purely presentational
 * (Server Component); the tint + icon come from the strongly-typed registry.
 */
export function ProjectStatus({
  status,
  label,
  className,
}: ProjectStatusProps) {
  const { icon: Icon, tone } = PROJECT_STATUS_META[status];
  return (
    <span className={cn(styles.chip, TONE_CLASS[tone], className)}>
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </span>
  );
}
