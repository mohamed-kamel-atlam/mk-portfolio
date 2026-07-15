/**
 * Engineering-hub structural data — the non-translatable atoms (stable keys and
 * proper-noun tool names). Translatable copy lives in the `engineering`
 * dictionary namespace, keyed by the same identifiers. The hub groups the
 * engineering docs into categories by their `kind`; each overview section links
 * into its deep-dive doc by slug.
 *
 * Adding a doc is a content file plus (if a new category) one entry here.
 */

/** Category groups for the doc directory, mapped to the doc `kind` values. */
export const docGroups = [
  { key: "foundations", kinds: ["architecture", "folder-structure"] },
  { key: "rendering", kinds: ["rendering", "react-internals"] },
  { key: "quality", kinds: ["performance", "accessibility"] },
  { key: "workflow", kinds: ["ai-workflow", "workflow"] },
  { key: "decisions", kinds: ["design-decision"] },
] as const;

export type DocGroupKey = (typeof docGroups)[number]["key"];

/** The engineering-mindset facets in the hero (§1). */
export const introFacets = [
  "problemSolving",
  "maintainability",
  "performance",
  "ux",
  "architecture",
] as const;
export type IntroFacetKey = (typeof introFacets)[number];

/** The architecture-thinking loop (§2) — ordered, rendered as a cycle. */
export const architectureSteps = [
  "understand",
  "modularize",
  "reusable",
  "scalability",
  "optimize",
  "review",
  "iterate",
] as const;
export type ArchitectureStepKey = (typeof architectureSteps)[number];

/** The build pipeline (§3) — ordered, rendered as a linear flow. */
export const buildStages = [
  "research",
  "planning",
  "architecture",
  "implementation",
  "optimization",
  "accessibility",
  "testing",
  "deployment",
] as const;
export type BuildStageKey = (typeof buildStages)[number];

/** Performance levers (§4). */
export const performanceTopics = [
  "rendering",
  "hydration",
  "streaming",
  "codeSplitting",
  "images",
  "caching",
  "vitals",
  "bundle",
] as const;
export type PerformanceTopicKey = (typeof performanceTopics)[number];

/** Accessibility topics (§5). */
export const a11yTopics = [
  "semantics",
  "keyboard",
  "aria",
  "reducedMotion",
  "contrast",
  "screenReaders",
] as const;
export type A11yTopicKey = (typeof a11yTopics)[number];

/** Design-system topics (§6). */
export const designSystemTopics = [
  "tokens",
  "components",
  "variants",
  "composition",
  "consistency",
  "maintainability",
] as const;
export type DesignSystemTopicKey = (typeof designSystemTopics)[number];

/** Responsible AI practices (§7). */
export const aiPractices = [
  "architecture",
  "review",
  "docsFirst",
  "validation",
] as const;
export type AiPracticeKey = (typeof aiPractices)[number];

/** AI tools used, day to day (§7) — proper nouns, not localized. */
export const aiTools = ["Claude Code", "ChatGPT", "GitHub Copilot"] as const;

/**
 * Tools grouped by the job they do (§8). Labels are localized
 * (engineering.tools.groups); items are proper nouns kept in Latin. Grounded in
 * this project's real stack and the documented toolkit — no logo wall.
 */
export const toolGroups = [
  { key: "frameworks", items: ["Next.js", "React"] },
  { key: "languages", items: ["TypeScript", "JavaScript"] },
  {
    key: "state",
    items: ["Redux Toolkit", "RTK Query", "React Query", "Zustand"],
  },
  { key: "styling", items: ["Tailwind CSS", "Design Tokens"] },
  { key: "animation", items: ["CSS Transitions", "Framer Motion"] },
  { key: "content", items: ["MDX", "Zod", "gray-matter"] },
  {
    key: "quality",
    items: ["TypeScript strict", "ESLint", "Prettier", "Husky"],
  },
  { key: "tooling", items: ["Git", "GitHub Flow", "Figma", "VS Code"] },
  { key: "infrastructure", items: ["Node.js", "Vercel", "Docker"] },
  { key: "ai", items: ["Claude Code", "ChatGPT", "GitHub Copilot"] },
] as const;

export type ToolGroupKey = (typeof toolGroups)[number]["key"];

/** Engineering principles (§9). */
export const engineeringPrinciples = [
  "performance",
  "accessibility",
  "serverFirst",
  "maintainability",
  "scalability",
  "ownership",
  "documentation",
  "learning",
] as const;
export type EngineeringPrincipleKey = (typeof engineeringPrinciples)[number];

/** Curated engineering decisions (§10), drawn from the ADR log. */
export const engineeringDecisions = [
  "appRouter",
  "serverComponents",
  "tokens",
  "mdx",
  "featureFirst",
] as const;
export type EngineeringDecisionKey = (typeof engineeringDecisions)[number];

/** Slug of the full ADR log doc, linked from the decisions section. */
export const DECISIONS_DOC_SLUG = "architecture-decisions";
