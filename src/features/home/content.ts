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
