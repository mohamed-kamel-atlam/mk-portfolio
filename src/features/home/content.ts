/**
 * Home-page structural data — the non-translatable atoms (tech names, tags,
 * route paths, stage/principle keys). Translatable copy lives in the `home`
 * dictionary namespace, keyed by the same identifiers.
 *
 * Project/experience entries are v1.0.0 **placeholders** illustrating the
 * sections; real content moves to the MDX content layer at M4
 * (developer/CONTENT_MODEL.md).
 */

// Featured projects now come from the MDX content engine (@/content); see
// FeaturedProjects.tsx. The remaining data below backs sections not yet migrated
// to content collections.

export const techGroups = [
  { key: "framework", items: ["Next.js", "React"] },
  { key: "language", items: ["TypeScript"] },
  { key: "styling", items: ["Tailwind CSS", "Design Tokens"] },
  { key: "content", items: ["MDX", "RSC"] },
  { key: "platform", items: ["Vercel"] },
] as const;

export type TechGroupKey = (typeof techGroups)[number]["key"];

export const timelineStages = ["foundations", "scaling", "ai"] as const;
export type TimelineStageKey = (typeof timelineStages)[number];

export const philosophyPrinciples = [
  "engineering",
  "performance",
  "accessibility",
  "simplicity",
] as const;
export type PhilosophyKey = (typeof philosophyPrinciples)[number];
