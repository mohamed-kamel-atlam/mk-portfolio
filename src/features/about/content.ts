/**
 * About-page structural data — the non-translatable atoms (stable identifiers
 * and proper-noun skill names). Translatable copy lives in the `about`
 * dictionary namespace, keyed by the same identifiers, so a label change never
 * touches this file (INTERNATIONALIZATION.md §5).
 *
 * Skill names are drawn from the résumé and are proper nouns, so they are not
 * translated; only their group labels are localized.
 */

/** "What kind of engineer" pillars (Engineering Mindset). */
export const mindsetPillars = [
  "product",
  "architecture",
  "performance",
  "ai",
] as const;
export type MindsetKey = (typeof mindsetPillars)[number];

/** Skill groups — label localized, items are proper nouns kept in Latin. */
export const skillGroups = [
  {
    key: "core",
    items: ["React", "TypeScript", "Next.js", "JavaScript (ES6+)", "Vite"],
  },
  {
    key: "state",
    items: [
      "Redux Toolkit",
      "RTK Query",
      "React Query",
      "Zustand",
      "Context API",
    ],
  },
  {
    key: "styling",
    items: [
      "Tailwind CSS",
      "Design Systems",
      "Responsive Design",
      "Framer Motion",
    ],
  },
  {
    key: "architecture",
    items: [
      "Feature-Based Architecture",
      "Component-Driven Design",
      "SOLID",
      "Clean Code",
    ],
  },
  {
    key: "apis",
    items: [
      "REST APIs",
      "Axios",
      "JWT Auth",
      "Role-Based Access",
      "React Hook Form",
      "Zod",
    ],
  },
  {
    key: "performance",
    items: [
      "Code Splitting",
      "Lazy Loading",
      "Memoization",
      "Bundle Optimization",
    ],
  },
  {
    key: "tooling",
    items: ["Git", "GitHub Flow", "Code Review", "Jira", "Figma", "Docker"],
  },
  {
    key: "ai",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Python",
      "PyTorch",
    ],
  },
] as const;

export type SkillGroupKey = (typeof skillGroups)[number]["key"];

/** Core values — drawn from the documented Brand Values (BRAND.md). */
export const coreValues = [
  "excellence",
  "simplicity",
  "ownership",
  "accessibility",
  "performance",
  "curiosity",
] as const;
export type CoreValueKey = (typeof coreValues)[number];

/**
 * Working principles — the project's own non-negotiable engineering principles
 * (ARCHITECTURE.md §2 / CLAUDE.md), the same convictions this codebase is built
 * on. Rendered in order.
 */
export const workingPrinciples = [
  "documentation",
  "architecture",
  "serverFirst",
  "stateDiscipline",
  "tokens",
  "simplicity",
] as const;
export type WorkingPrincipleKey = (typeof workingPrinciples)[number];
