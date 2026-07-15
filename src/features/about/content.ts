/**
 * About-page structural data — the non-translatable atoms (stable identifiers
 * and proper-noun skill names). Translatable copy lives in the `about`
 * dictionary namespace, keyed by the same identifiers, so a label change never
 * touches this file (INTERNATIONALIZATION.md §5).
 *
 * Skill names are drawn from the résumé and are proper nouns, so they are not
 * translated; only their group labels and descriptions are localized.
 */

/**
 * Engineering philosophy — the convictions that answer "why trust him with a
 * complex frontend system". Rendered as an editorial statement plus a card per
 * principle (EngineeringPhilosophy.tsx), each with its own icon.
 */
export const philosophyPrinciples = [
  "performance",
  "accessibility",
  "designSystems",
  "architecture",
  "maintainability",
  "ownership",
] as const;
export type PhilosophyKey = (typeof philosophyPrinciples)[number];

/**
 * How a feature goes from ambiguity to production — an ordered, repeatable
 * workflow (MyProcess.tsx). Order is meaningful and drives the numbered `<ol>`.
 */
export const processSteps = [
  "understand",
  "research",
  "architect",
  "build",
  "optimize",
  "review",
  "deliver",
] as const;
export type ProcessStepKey = (typeof processSteps)[number];

/**
 * Skill groups — label + description localized, items are proper nouns kept in
 * Latin script. Each group also carries an icon in the component (TechStack.tsx)
 * so the toolkit reads as intentional capability areas, not a flat badge dump.
 */
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

/**
 * Core values — the human character behind the engineering (the traits a team
 * works alongside), kept distinct from the {@link philosophyPrinciples} that
 * govern the code itself, so the two sections never restate each other.
 */
export const coreValues = [
  "curiosity",
  "quality",
  "learning",
  "ownership",
  "communication",
  "detail",
] as const;
export type CoreValueKey = (typeof coreValues)[number];

/**
 * Fun facts — a small, professional row of signals about the person behind the
 * work (FunFacts.tsx). Kept to concrete, résumé-true facts, never gimmicks.
 */
export const funFacts = ["ai", "bilingual", "documentation", "craft"] as const;
export type FunFactKey = (typeof funFacts)[number];
