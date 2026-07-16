export const journeyMilestones = [
  {
    key: "2022",
    year: 2022,
    techs: [
      "Python",
      "Data Structures",
      "Data Analysis",
      "Problem Solving",
      "Mathematics",
    ],
  },
  {
    key: "2023",
    year: 2023,
    techs: [
      "Machine Learning",
      "Deep Learning",
      "CNN",
      "RNN",
      "Computer Vision",
      "C#",
      "ASP.NET",
      "HTML",
      "CSS",
    ],
  },
  {
    key: "2024",
    year: 2024,
    techs: [
      "JavaScript (ES6+)",
      "DOM",
      "Async JS",
      "Fetch API",
      "Bootstrap",
      "Tailwind CSS",
    ],
  },
  {
    key: "2025",
    year: 2025,
    techs: [
      "React",
      "React Router",
      "State Management",
      "TypeScript",
      "Material UI",
      "Git & GitHub",
    ],
  },
  {
    key: "2026",
    year: 2026,
    techs: ["Next.js", "NestJS", "MongoDB", "Docker", "Jira", "AI Dashboards"],
  },
] as const;

export type MilestoneKey = (typeof journeyMilestones)[number]["key"];

/** The mindset arc (§3) — how the way of thinking evolved, as before → after leaps. */
export const evolutionStages = [
  "logic",
  "craft",
  "architecture",
  "systems",
] as const;
export type EvolutionStageKey = (typeof evolutionStages)[number];

export const journeyProjects = [
  { key: "tiger", slug: "e-commerce-tiger" },
  { key: "fitness", slug: "fitness-booking" },
  { key: "sanabel", slug: "sanabel-rahaf" },
  { key: "graduation", slug: null },
] as const;
export type JourneyProjectKey = (typeof journeyProjects)[number]["key"];

/** Honest turning points and what each taught (§5). */
export const challenges = ["detour", "depth", "commercial"] as const;
export type ChallengeKey = (typeof challenges)[number];

/** What I'm mastering now (§6). */
export const currentFocusItems = [
  "reactInternals",
  "appRouter",
  "rendering",
  "performance",
  "accessibility",
  "designSystems",
  "architecture",
  "aiAssisted",
] as const;
export type CurrentFocusKey = (typeof currentFocusItems)[number];

/** Where the journey heads next (§7). */
export const roadmapItems = ["graduate", "lead", "systems", "growth"] as const;
export type RoadmapKey = (typeof roadmapItems)[number];
