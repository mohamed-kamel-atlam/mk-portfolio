/**
 * Engineering-journey structural data — the non-translatable atoms (stable keys,
 * years, proper-noun technology names, and links to real project pages).
 * Translatable copy (stories, lessons, mindset shifts, labels) lives in the
 * `journey` dictionary namespace, keyed by the same identifiers.
 *
 * The facts here — years, technologies, project links — are the source of truth
 * from the documented timeline; the copy sharpens the wording without changing
 * a single fact.
 */

/**
 * The year-chapters of the journey (2022 → 2026). `year` is a number so it can
 * be formatted per locale (Arabic-Indic in AR); `techs` are proper nouns kept in
 * Latin script.
 */
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

/**
 * Major projects and what they taught (§4). `slug` links to the real project
 * page when one exists; `null` renders the card without a link.
 */
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
