import type { GlowPosition, GradientPreset } from "./layers";

export type BackgroundVariant =
  | "default"
  | "hero"
  | "projects"
  | "engineering"
  | "contact"
  | "footer"
  | "aurora"
  | "mesh"
  | "blueprint"
  | "glass"
  | "minimal";

export interface BackgroundComposition {
  gradient?: GradientPreset;
  aurora?: boolean;
  glows?: readonly GlowPosition[];
  /** Give this variant's glows a gentle ambient float. */
  floatingGlows?: boolean;
  grid?: boolean;
  noise?: boolean;
}

export const BACKGROUND_VARIANTS: Record<
  BackgroundVariant,
  BackgroundComposition
> = {
  // Ambient site-wide backdrop.
  default: { gradient: "primary", aurora: true, glows: ["top"], noise: true },
  // Cinematic: layered top + corner light with float.
  hero: {
    gradient: "hero",
    aurora: true,
    glows: ["top", "corner"],
    floatingGlows: true,
    noise: true,
  },
  // Structured: calm wash, single top light.
  projects: { gradient: "primary", glows: ["top"], noise: true },
  // Technical: engineering grid + cool wash.
  engineering: {
    gradient: "engineering",
    grid: true,
    glows: ["top"],
    noise: true,
  },
  // Warm: accent gradient + bottom light.
  contact: { gradient: "accent", aurora: true, glows: ["bottom"], noise: true },
  // Fades naturally into the base at the page end.
  footer: { gradient: "dark", glows: ["bottom"], noise: true },
  // Building-block variants:
  aurora: {
    aurora: true,
    glows: ["top", "bottom"],
    floatingGlows: true,
    noise: true,
  },
  mesh: { gradient: "accent", aurora: true, noise: true },
  blueprint: { gradient: "engineering", grid: true, noise: true },
  glass: { gradient: "secondary", glows: ["center"], noise: true },
  minimal: { noise: true },
};
