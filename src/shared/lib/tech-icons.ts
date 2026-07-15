import {
  Atom,
  Boxes,
  Braces,
  Code,
  CodeXml,
  Component,
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

/**
 * Technology → monochrome icon mapping. Shared across features (project cards +
 * the landing skills section) so there is one icon vocabulary. Centralized and
 * extensible: a new technology needs one entry in {@link NAME_ICONS} (or none —
 * it falls back to a category icon, then a generic glyph). Icons are Lucide
 * (single-color, inherit `currentColor`), chosen to *read* as the tech
 * (Wind≈Tailwind, Zap≈Vite, Triangle≈Next/Vercel, Flame≈PyTorch, Hexagon≈Nest),
 * so chips communicate at a glance without shipping a rainbow of brand logos.
 */
export interface TechIconInput {
  name: string;
  category?: string;
}

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
  "design tokens": Palette,
  vite: Zap,
  mdx: FileCode2,
  rsc: Component,
  "react server components": Component,
  "redux toolkit": Layers,
  redux: Layers,
  "rtk query": Database,
  "react query": Database,
  "rest apis": Waypoints,
  "rest api": Waypoints,
  vercel: Triangle,
  python: SquareCode,
  pytorch: Flame,
  nestjs: Hexagon,
  "nest.js": Hexagon,
  "computer vision": ScanEye,
  "node.js": Server,
  nodejs: Server,
};

/** Category-level fallback when a technology has no exact icon. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
export function getTechIcon(tech: TechIconInput): LucideIcon {
  return (
    NAME_ICONS[normalize(tech.name)] ??
    (tech.category ? CATEGORY_ICONS[tech.category] : undefined) ??
    Code
  );
}
