import {
  Archive,
  CircleCheck,
  FlaskConical,
  LoaderCircle,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import type { ProjectStatus } from "@/content/schema";

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
