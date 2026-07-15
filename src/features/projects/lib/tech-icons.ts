import {
  Atom,
  Boxes,
  Braces,
  Code,
  CodeXml,
  Database,
  FileCode2,
  Flame,
  Hexagon,
  Layers,
  Palette,
  ScanEye,
  Server,
  Sparkles,
  SquareCode,
  Triangle,
  Waypoints,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { ProjectFrontmatter } from "@/content/schema";

/**
 * Technology → monochrome icon mapping. Centralized and extensible: a new
 * technology needs one entry in {@link NAME_ICONS} (or none — it falls back to a
 * category icon, then a generic glyph). Icons are Lucide (single-color, inherit
 * `currentColor`), chosen to *read* as the tech (Wind≈Tailwind, Zap≈Vite,
 * Flame≈PyTorch, Hexagon≈Nest, ScanEye≈vision), so chips communicate at a glance
 * without shipping a rainbow of brand logos.
 */

type TechItem = ProjectFrontmatter["techStack"][number];
type TechCategory = NonNullable<TechItem["category"]>;

/** Exact per-technology overrides (keys are normalized: lowercased, trimmed). */
const NAME_ICONS: Record<string, LucideIcon> = {
  react: Atom,
  "next.js": Triangle,
  nextjs: Triangle,
  typescript: FileCode2,
  javascript: Braces,
  html5: CodeXml,
  html: CodeXml,
  css3: Palette,
  css: Palette,
  "tailwind css": Wind,
  tailwindcss: Wind,
  tailwind: Wind,
  vite: Zap,
  "redux toolkit": Layers,
  redux: Layers,
  "rtk query": Database,
  "react query": Database,
  "rest apis": Waypoints,
  "rest api": Waypoints,
  python: SquareCode,
  pytorch: Flame,
  nestjs: Hexagon,
  "nest.js": Hexagon,
  "computer vision": ScanEye,
  "node.js": Server,
  nodejs: Server,
};

/** Category-level fallback when a technology has no exact icon. */
const CATEGORY_ICONS: Record<TechCategory, LucideIcon> = {
  framework: Boxes,
  language: Braces,
  styling: Palette,
  tooling: Wrench,
  infra: Server,
  ai: Sparkles,
};

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

/** Resolve the icon for a technology: exact name → category → generic. */
export function getTechIcon(tech: TechItem): LucideIcon {
  return (
    NAME_ICONS[normalize(tech.name)] ??
    (tech.category ? CATEGORY_ICONS[tech.category] : undefined) ??
    Code
  );
}
