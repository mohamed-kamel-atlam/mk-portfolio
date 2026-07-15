import {
  Archive,
  CircleCheck,
  FlaskConical,
  LoaderCircle,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import type { ProjectStatus } from "@/content/schema";

/**
 * Status registry — the single, strongly-typed source that turns a
 * {@link ProjectStatus} into its icon (the non-color cue required by WCAG 1.4.1)
 * and its visual class. Adding a status is one entry here + one CSS block in
 * `ProjectStatus.module.css` + one label per locale — never an ad-hoc badge
 * color at a call site. The colour itself is a soft, semantic tint (success /
 * warning / info / neutral), not a generic filled badge.
 */
export interface ProjectStatusMeta {
  icon: LucideIcon;
  /** CSS-module class key applied for the semantic tint. */
  tone: "production" | "completed" | "inProgress" | "archived" | "research";
}

export const PROJECT_STATUS_META: Record<ProjectStatus, ProjectStatusMeta> = {
  production: { icon: Rocket, tone: "production" },
  completed: { icon: CircleCheck, tone: "completed" },
  "in-progress": { icon: LoaderCircle, tone: "inProgress" },
  archived: { icon: Archive, tone: "archived" },
  research: { icon: FlaskConical, tone: "research" },
};
