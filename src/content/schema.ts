import { z } from "zod";

import { locales, type Locale } from "@/shared/i18n/config";

/**
 * Content schemas (CONTENT_MODEL.md §3). Each is a Zod schema whose **inferred
 * type is the TypeScript type pages consume** — one definition serves both
 * build-time validation and compile-time typing (MDX_PIPELINE.md ED-2), so
 * there is no duplicated schema. Every type extends {@link contentBase}.
 */

// Locale validation mirrors the single source of truth in @/shared/i18n/config.
const localeSchema = z.enum(locales as unknown as [Locale, ...Locale[]]);

// YAML parses an unquoted `2026-03-01` into a Date; normalize it back to an
// ISO date string so authors can write dates naturally (CONTENT_MODEL §2.2).
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string(),
);

/** Fields shared by every content type (CONTENT_MODEL.md §2.2). */
export const contentBase = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  date: isoDate,
  order: z.number().optional(),
  featured: z.boolean().optional(),
  locale: localeSchema,
  draft: z.boolean().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

const techStackItem = z.object({
  name: z.string(),
  category: z
    .enum(["framework", "language", "styling", "tooling", "infra", "ai"])
    .optional(),
});

const galleryImage = z.object({
  src: z.string(),
  alt: z.string(), // required — accessibility contract (QAT-2)
  width: z.number(), // required — layout stability (QAT-1)
  height: z.number(),
  caption: z.string().optional(),
});

export const projectSchema = contentBase.extend({
  role: z.string(),
  techStack: z.array(techStackItem),
  architectureDecisions: z
    .array(z.object({ title: z.string(), rationale: z.string() }))
    .optional(),
  github: z.string().url().optional(),
  liveDemo: z.string().url().optional(),
  gallery: z.array(galleryImage).optional(),
  caseStudy: z.string().optional(),
  relatedArticles: z.array(z.string()).optional(),
});

export const caseStudySchema = contentBase.extend({
  project: z.string().optional(),
  problem: z.string(),
  outcome: z.string(),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  relatedArticles: z.array(z.string()).optional(),
});

export const articleSchema = contentBase.extend({
  category: z.enum([
    "frontend",
    "architecture",
    "ai",
    "performance",
    "accessibility",
    "learning-notes",
  ]),
  tags: z.array(z.string()).optional(),
  readingTime: z.number().optional(),
  relatedProjects: z.array(z.string()).optional(),
  relatedArticles: z.array(z.string()).optional(),
});

export const journeyEntrySchema = contentBase.extend({
  kind: z.enum(["learning", "project", "career", "decision", "goal"]),
  endDate: isoDate.optional(),
  project: z.string().optional(),
  article: z.string().optional(),
});

export const experienceSchema = contentBase.extend({
  organization: z.string(),
  roleTitle: z.string(),
  startDate: isoDate,
  endDate: isoDate.optional(),
  location: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  techStack: z.array(techStackItem).optional(),
});

export const engineeringDocSchema = contentBase.extend({
  kind: z.enum([
    "architecture",
    "folder-structure",
    "performance",
    "rendering",
    "react-internals",
    "accessibility",
    "ai-workflow",
    "workflow",
    "design-decision",
    "code-quality",
    "journal",
  ]),
  section: z.string().optional(),
  relatedProjects: z.array(z.string()).optional(),
});

/**
 * The collection registry — the single, scalable mapping of content type to its
 * directory and schema. Adding a content type is one entry here plus a folder.
 */
export const collections = {
  projects: { dir: "projects", schema: projectSchema },
  "case-studies": { dir: "case-studies", schema: caseStudySchema },
  articles: { dir: "articles", schema: articleSchema },
  journey: { dir: "journey", schema: journeyEntrySchema },
  experience: { dir: "experience", schema: experienceSchema },
  engineering: { dir: "engineering", schema: engineeringDocSchema },
} as const;

export type ContentType = keyof typeof collections;

/** Frontmatter type for a content type, inferred from its schema. */
export type FrontmatterOf<T extends ContentType> = z.infer<
  (typeof collections)[T]["schema"]
>;

/** A loaded, validated content item: frontmatter + raw MDX body (CONTENT_MODEL §6). */
export interface ContentItem<T extends ContentType> {
  slug: string;
  locale: Locale;
  frontmatter: FrontmatterOf<T>;
  /** Raw MDX body; compiled + rendered by the MDX render module. */
  body: string;
}

// Convenience aliases matching CONTENT_MODEL.md §6.
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudySchema>;
export type ArticleFrontmatter = z.infer<typeof articleSchema>;
export type JourneyEntryFrontmatter = z.infer<typeof journeyEntrySchema>;
export type ExperienceFrontmatter = z.infer<typeof experienceSchema>;
export type EngineeringDocFrontmatter = z.infer<typeof engineeringDocSchema>;
