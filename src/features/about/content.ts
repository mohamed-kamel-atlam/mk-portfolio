export const philosophyPrinciples = [
  "performance",
  "accessibility",
  "designSystems",
  "architecture",
  "maintainability",
  "ownership",
] as const;
export type PhilosophyKey = (typeof philosophyPrinciples)[number];

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

export const coreValues = [
  "curiosity",
  "quality",
  "learning",
  "ownership",
  "communication",
  "detail",
] as const;
export type CoreValueKey = (typeof coreValues)[number];

export const funFacts = ["ai", "bilingual", "documentation", "craft"] as const;
export type FunFactKey = (typeof funFacts)[number];
