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

/** Hero tech-stack badges — proper nouns, so not localized. Kept short. */
export const heroTech = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Redux Toolkit",
  "RTK Query",
] as const;

/**
 * Skills, grouped by intent rather than raw tech type — the categories a hiring
 * engineer scans for. Labels are localized (home.tech.groups); each group
 * renders with a category icon (TechStack.tsx). Items are proper nouns / concept
 * names, so they are not localized.
 */
export const techGroups = [
  {
    key: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    key: "architecture",
    items: [
      "React Server Components",
      "Design Tokens",
      "State Management",
      "REST APIs",
    ],
  },
  {
    key: "ai",
    items: ["AI Integration", "Streaming UIs", "Prompt Engineering"],
  },
  {
    key: "tooling",
    items: ["Vite", "Git & GitHub Flow", "Vercel", "MDX"],
  },
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
