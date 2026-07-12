# Content Model

**Version:** 1.0.0 / **Status:** Draft / **Last Updated:** July 2026 / **Owner:** Mohamed Kamel

---

## Purpose

This document defines the **typed schemas** for every content type the portfolio
publishes, and it **records the strategy decision** that governs them:

> **Content is local, in-repository MDX plus structured frontmatter. There is no
> CMS in Version 1.**

That decision is introduced at overview altitude in
[ARCHITECTURE §8](../engineering/ARCHITECTURE.md) and marked there as a
**strategy document rather than an ADR** — precisely because it defines an
ongoing practice, not a single point-in-time choice
([ARCHITECTURE §12](../engineering/ARCHITECTURE.md)). This document is that
strategy record: it owns the "what" (the shape of each content type and the rule
that content lives in the repo). It defers *how content is parsed, validated, and
rendered* to [MDX_PIPELINE.md](./MDX_PIPELINE.md) and *how it is accessed at
render time* to [DATA_FETCHING.md](../engineering/DATA_FETCHING.md).

---

## Scope

**In scope.** The strategy decision and its justification; the schema for each
content type — **Project, CaseStudy, Article, JourneyEntry, Experience,
EngineeringDoc**; shared frontmatter conventions (required/optional fields and
their types); slugs, ordering, and featured flags; localization of content
(English/Arabic); and the relationships between content types.

**Out of scope.** Parsing, plugin behavior, schema *enforcement mechanism*, and
rendering — owned by [MDX_PIPELINE.md](./MDX_PIPELINE.md). The content-access
API's caching and call sites — owned by
[DATA_FETCHING.md](../engineering/DATA_FETCHING.md). Which catalog component
renders which element — owned by
[COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md). Token values and typography —
owned by [design/](../design/DESIGN_TOKENS.md).

---

## Goals

- Give every content type a **single, typed schema** so invalid content fails
  the build instead of shipping broken pages
  ([ARCHITECTURE §8](../engineering/ARCHITECTURE.md); QAT-3).
- Make content **statically generable** by keeping it fully known at build time
  (QAT-1, QAT-6).
- Make content **localizable** (en/ar) as a first-class property, never a
  retrofit (QAT-5).
- Define **relationships** between projects, case studies, and articles so
  cross-linking is data-driven, not hand-maintained.

---

## Responsibilities

| This document owns | This document defers to |
| --- | --- |
| The no-CMS / local-MDX **strategy decision**. | Overview framing → [ARCHITECTURE §8](../engineering/ARCHITECTURE.md) |
| The **schema** of each content type. | Validation *mechanism* → [MDX_PIPELINE.md](./MDX_PIPELINE.md) |
| Frontmatter fields, slugs, ordering, featured, localization. | Rendering & component map → [MDX_PIPELINE.md](./MDX_PIPELINE.md), [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) |
| Relationships between content types. | Access & caching → [DATA_FETCHING.md](../engineering/DATA_FETCHING.md) |

---

## Dependencies

| Source | Why it constrains this model |
| --- | --- |
| [ARCHITECTURE §8](../engineering/ARCHITECTURE.md) | Establishes content-as-data, build-time validation, documentation-as-content, and records this as a strategy doc. |
| [PRD → FR-005](../product/PRODUCT_REQUIREMENTS.md) | Fixes the required fields of a Project. |
| [PRD → FR-008, FR-009, FR-004, FR-006/FR-015](../product/PRODUCT_REQUIREMENTS.md) | Journey, Blog categories, Experience, Engineering docs/journal. |
| [PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md) | English + Arabic content, localized routes/metadata. |
| [MDX_PIPELINE.md](./MDX_PIPELINE.md) | Consumes these schemas for build-time validation. |
| [DATA_FETCHING.md](../engineering/DATA_FETCHING.md) | Consumes the typed access surface described here. |

---

## 1. Strategy: content is local MDX + structured data (no CMS in V1)

**Decision.** For Version 1, all published content — projects, case studies,
articles, journey entries, experience, and engineering documentation — is stored
in the repository as **MDX files with typed frontmatter**, under a top-level
`content/` tree (the Content layer,
[ARCHITECTURE §6](../engineering/ARCHITECTURE.md)). A CMS is explicitly **not**
part of V1; it is a [Version 3](../product/PRODUCT_REQUIREMENTS.md) consideration
and a stated non-goal ([ARCHITECTURE §3.2](../engineering/ARCHITECTURE.md)).

**Why (traced to product and architecture intent):**

- **Type safety and build-time validation.** Every file's frontmatter is
  validated against the schema in this document; a violation **fails the build**
  rather than shipping a broken page ([ARCHITECTURE §8](../engineering/ARCHITECTURE.md);
  QAT-3). A CMS would move that guarantee to runtime and out of version control.
- **Static generation.** Because content is known at build time, pages are
  statically generated and edge-delivered (QAT-1, QAT-6).
- **Version control as editorial history.** Content is reviewed and versioned
  like code — a natural fit for the
  [Development Journal (FR-015)](../product/PRODUCT_REQUIREMENTS.md) and for the
  product principle that the site itself is the proof of engineering practice.
- **Rich composition.** MDX lets content embed catalog components where a
  demonstration adds value ([PRD → FR-013](../product/PRODUCT_REQUIREMENTS.md))
  without turning each page into a bespoke build.
- **Simplicity.** No runtime database, no admin surface, no third-party editorial
  dependency — directly serving the anti-overengineering and anti-scope-creep
  risks in the [PRD → Risks](../product/PRODUCT_REQUIREMENTS.md).

**Consequence.** Authoring is a commit. Content shape is a compile-time contract.
The rest of this document is that contract.

---

## 2. Content organization and shared conventions

### 2.1 Location and file identity

Content lives under `content/<type>/…`, one directory per content type (e.g.
`content/projects/`, `content/articles/`). The precise directory layout and how
localized files are arranged on disk are specified in
[MDX_PIPELINE.md → file organization](./MDX_PIPELINE.md); this document specifies
the *fields*, not the folder mechanics.

### 2.2 The shared frontmatter base

Every content type shares a common base of frontmatter fields. Concrete schemas
below extend it. Types are shown as illustrative TypeScript interfaces; the
runtime validation mechanism is owned by
[MDX_PIPELINE.md](./MDX_PIPELINE.md).

```ts
/** ISO 8601 date string, e.g. "2026-03-14". Validated at build time. */
type ISODate = string;

/** BCP-47 subset used across the site. Mirrors PRD FR-001. */
type Locale = "en" | "ar";

/** Fields shared by every content type. */
interface ContentBase {
  /** URL-safe identifier, unique within a content type. See §2.3. */
  slug: string;
  /** Human-readable title in the file's locale. */
  title: string;
  /** One- to two-sentence summary; used in cards, lists, and meta description. */
  summary: string;
  /** Publication or effective date. Drives default ordering. */
  date: ISODate;
  /** Explicit manual ordering weight; lower sorts first. See §2.4. */
  order?: number;
  /** Surfaces the item in "selected"/"featured" collections. See §2.5. */
  featured?: boolean;
  /** Locale of THIS file's content. See §5. */
  locale: Locale;
  /** Hides the item from listings and generated routes without deleting it. */
  draft?: boolean;
  /** Optional SEO overrides; fall back to title/summary when absent. */
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string; // path under the public asset root
  };
}
```

### 2.3 Slugs

- The `slug` is the URL segment and the **stable identity** of an item within its
  type. It is unique per content type (a project and an article may not share a
  slug within their own type; across types they are independent namespaces).
- Slugs are lowercase, hyphen-separated, ASCII (`streaming-platform`), and are
  **locale-invariant**: the English and Arabic versions of one project share the
  same slug so they are recognized as the same item and can cross-link. The
  displayed/localized title differs; the identity does not.
- Slugs are validated at build time; a duplicate slug within a type is a build
  failure ([MDX_PIPELINE.md](./MDX_PIPELINE.md)).

### 2.4 Ordering

- **Default order** is by `date`, descending (newest first) — the natural order
  for articles, journey entries, and experience.
- **`order`** overrides date where a curated sequence matters (e.g. the sequence
  of Selected Projects). Lower `order` sorts first; items without `order` fall
  back to `date`. This keeps ordering **data-driven**, never hardcoded in a
  component ([COMPONENT_CATALOG.md → ProjectGrid](./COMPONENT_CATALOG.md)).

### 2.5 Featured flag

- `featured: true` opts an item into curated collections — Selected Projects on
  the landing page ([PRD → FR-003](../product/PRODUCT_REQUIREMENTS.md)),
  highlighted case studies, or pinned articles. It is orthogonal to `order`:
  `featured` decides *membership*, `order` decides *sequence within* the
  collection.

---

## 3. Content-type schemas

### 3.1 Project

Aligned field-for-field to
[PRD → FR-005](../product/PRODUCT_REQUIREMENTS.md). The narrative sections
(Overview, Problem, Solution, Challenges, Lessons Learned, and the Folder
Structure/Architecture Decisions prose) are authored as **MDX body** using named
sections; the structured metadata below is **frontmatter**. Keeping long-form
sections in the body preserves rich composition; keeping identity and links in
frontmatter keeps them queryable and validatable.

```ts
interface TechStackItem {
  name: string;                 // e.g. "Next.js"
  category?: "framework" | "language" | "styling" | "tooling" | "infra" | "ai";
}

interface GalleryImage {
  src: string;                  // path under the public asset root
  alt: string;                  // REQUIRED — accessibility contract (QAT-2)
  width: number;                // REQUIRED — layout stability (QAT-1)
  height: number;               // REQUIRED
  caption?: string;
}

interface ProjectFrontmatter extends ContentBase {
  /** Short role statement; the full "My Role" narrative lives in the MDX body. */
  role: string;
  /** Structured tech stack; rendered by TechList/StackList. */
  techStack: TechStackItem[];
  /** Named, structured architecture decisions; long-form rationale in body. */
  architectureDecisions?: Array<{ title: string; rationale: string }>;
  /** External links (FR-005). Optional because not every project has both. */
  github?: string;              // absolute URL
  liveDemo?: string;            // absolute URL
  /** Project media (FR-005 Gallery). */
  gallery?: GalleryImage[];
  /** Relationships — see §4. */
  caseStudy?: string;           // slug of a related CaseStudy
  relatedArticles?: string[];   // slugs of related Articles
}

/**
 * The MDX body of a project provides the required narrative sections
 * (FR-005): Overview, Problem, Solution, My Role, Folder Structure,
 * Architecture Decisions, Challenges, Lessons Learned. Section presence
 * is validated at build time; see MDX_PIPELINE.md.
 */
```

- **Required frontmatter:** `slug`, `title`, `summary`, `date`, `locale`,
  `role`, `techStack`.
- **Optional frontmatter:** `order`, `featured`, `draft`, `seo`,
  `architectureDecisions`, `github`, `liveDemo`, `gallery`, `caseStudy`,
  `relatedArticles`.
- **Required body sections:** Overview, Problem, Solution, My Role, Folder
  Structure, Architecture Decisions, Challenges, Lessons Learned
  ([PRD → FR-005](../product/PRODUCT_REQUIREMENTS.md)).

### 3.2 CaseStudy

A case study is a **deeper narrative** than a project detail page: it argues a
decision or outcome end to end (used by the engineering manager persona to
evaluate depth — [PRD → Personas](../product/PRODUCT_REQUIREMENTS.md)). It is a
distinct type because it has its own URL, its own listing, and a different shape
from a project, even when it is *about* a project.

```ts
interface CaseStudyFrontmatter extends ContentBase {
  /** The project this case study examines, if any. See §4. */
  project?: string;             // slug of a Project
  /** Concise problem statement shown in the header. */
  problem: string;
  /** Outcome/impact statement; body carries the full analysis. */
  outcome: string;
  /** Structured metrics where they exist (before/after, %, etc.). */
  metrics?: Array<{ label: string; value: string }>;
  relatedArticles?: string[];
}
```

- **Required:** base fields + `problem`, `outcome`.
- **Body:** the full case narrative (context, approach, decisions, results,
  reflection) as MDX.

### 3.3 Article (Blog)

Blog is a [Version 2](../product/PRODUCT_REQUIREMENTS.md) surface, but its schema
is defined now so V1 content and routing can be built without a later migration
(the same reasoning that keeps `CommandMenu`/`Search` named-but-deferred in
[COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md)). Categories are fixed by
[PRD → FR-009](../product/PRODUCT_REQUIREMENTS.md).

```ts
type ArticleCategory =
  | "frontend"
  | "architecture"
  | "ai"
  | "performance"
  | "accessibility"
  | "learning-notes";

interface ArticleFrontmatter extends ContentBase {
  category: ArticleCategory;    // exactly one primary category (FR-009)
  tags?: string[];              // free-form secondary tags
  /** Estimated reading time in minutes; may be derived at build time. */
  readingTime?: number;
  relatedProjects?: string[];   // slugs
  relatedArticles?: string[];   // slugs
}
```

- **Required:** base fields + `category`.
- **Category values are closed** — an unknown category fails validation, keeping
  the blog taxonomy stable (QAT-7).

### 3.4 JourneyEntry (Timeline)

Backs the Engineering Journey timeline
([PRD → FR-008](../product/PRODUCT_REQUIREMENTS.md);
[COMPONENT_CATALOG.md → Timeline](./COMPONENT_CATALOG.md)).

```ts
type JourneyKind = "learning" | "project" | "career" | "decision" | "goal";

interface JourneyEntryFrontmatter extends ContentBase {
  /** Which journey facet this entry represents (FR-008). */
  kind: JourneyKind;
  /** Point-in-time or ranged entry. `endDate` omitted = ongoing/point event. */
  endDate?: ISODate;
  /** Optional link to the thing this entry refers to. See §4. */
  project?: string;             // slug of a Project
  article?: string;             // slug of an Article
}
```

- **Required:** base fields + `kind`. `date` is the entry's start/occurrence
  date and drives chronological ordering.
- **Body:** short reflective note (kept concise per
  [DESIGN_LANGUAGE.md → Content Philosophy](../design/DESIGN_LANGUAGE.md)).

### 3.5 Experience

Backs the Experience section of About
([PRD → FR-004](../product/PRODUCT_REQUIREMENTS.md)) and the resume narrative. It
is structured data with an optional MDX body for accomplishments.

```ts
interface ExperienceFrontmatter extends ContentBase {
  organization: string;
  roleTitle: string;
  startDate: ISODate;
  endDate?: ISODate;            // omitted = current
  location?: string;
  /** Structured highlights; long-form detail may live in the body. */
  highlights?: string[];
  techStack?: TechStackItem[];
}
```

- **Required:** base fields + `organization`, `roleTitle`, `startDate`.
- Ordered by `startDate` descending; a missing `endDate` marks a current role.

### 3.6 EngineeringDoc (documentation-as-content)

[ARCHITECTURE §8](../engineering/ARCHITECTURE.md) states that the portfolio
publishes its own engineering documentation as **first-class content consumed
through the same pipeline** — documentation is a content *type*, not a special
case. This schema makes that explicit and backs the Engineering surface
([PRD → FR-006](../product/PRODUCT_REQUIREMENTS.md)) and Development Journal
([PRD → FR-015](../product/PRODUCT_REQUIREMENTS.md)).

```ts
type EngineeringDocKind =
  | "architecture"
  | "folder-structure"
  | "performance"
  | "rendering"
  | "ai-workflow"
  | "design-decision"
  | "code-quality"
  | "journal";                  // FR-015 sprint entries

interface EngineeringDocFrontmatter extends ContentBase {
  kind: EngineeringDocKind;     // maps to FR-006 sections / FR-015
  /** Optional grouping for multi-part docs (e.g. journal by sprint). */
  section?: string;
  relatedProjects?: string[];   // slugs
}
```

- **Required:** base fields + `kind`.
- These pages render through the same MDX component map as every other type
  ([COMPONENT_CATALOG.md → MDX component map](./COMPONENT_CATALOG.md)); the
  published engineering docs are the *content* form of the internal docs, not a
  second copy of them.

---

## 4. Relationships

Content types reference each other **by slug**, never by embedding one type's
body inside another. Relationships are one-directional in storage and made
bidirectional at build time by the access layer
([DATA_FETCHING.md](../engineering/DATA_FETCHING.md)).

| From | Field | To | Meaning |
| --- | --- | --- | --- |
| Project | `caseStudy` | CaseStudy | "This project has a deeper case study." |
| Project | `relatedArticles[]` | Article | "Articles discussing this project." |
| CaseStudy | `project` | Project | "The project this study examines." |
| Article | `relatedProjects[]` | Project | "Projects this article discusses." |
| JourneyEntry | `project` / `article` | Project / Article | "This milestone refers to X." |
| EngineeringDoc | `relatedProjects[]` | Project | "Docs illustrating this project." |

**Core triangle: Project ↔ CaseStudy ↔ Article.** A project may point to at most
one case study; a case study points back to at most one project; both may
reference many articles, and articles may reference many projects. Referential
integrity is validated at build time — a `caseStudy`/`project`/`relatedArticles`
slug that resolves to nothing is a **build failure**
([MDX_PIPELINE.md](./MDX_PIPELINE.md)), so cross-links can never dangle in
production.

```
        featured / order            relatedArticles[] (many)
Project ───────────────▶ (listing)  Project ─────────────────▶ Article
   │  caseStudy (0..1)                  ▲                          │
   ▼                                    │ relatedProjects[] (many) │
CaseStudy ── project (0..1) ────────────┘◀─────────────────────────┘
```

---

## 5. Localization of content (en / ar)

Localization is a first-class property of the model, per QAT-5 and
[PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md). The routing/direction
*mechanism* is owned by
[INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md); the **content
rule** is owned here:

- **Every item is identified by its locale-invariant `slug`** and carries a
  `locale` field naming the language of that file's content. The English and
  Arabic versions of one project share the slug and are recognized as the same
  logical item.
- **Per-locale files, not inline bilingual frontmatter.** English and Arabic
  content are separate MDX files (arrangement on disk defined in
  [MDX_PIPELINE.md](./MDX_PIPELINE.md)). This keeps each file monolingual,
  reviewable, and directionally correct, and lets translated bodies diverge in
  structure where the language requires.
- **Locale fallback.** If a localized file is missing for a requested locale, the
  access layer's fallback behavior (e.g. serve the default locale, or omit the
  item from that locale's listing) is defined in
  [DATA_FETCHING.md](../engineering/DATA_FETCHING.md). The content model's only
  requirement is that the missing state is explicit and never renders empty or
  mixed-language output.
- **Localized SEO** fields (`seo.title`/`description`) are per-file, so metadata
  is correct per locale (QAT-6).
- Arabic content is authored assuming **RTL**; components render it
  direction-aware ([COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md)).

---

## 6. Typed content-access surface (shape only)

The schemas above define the **shape returned** by the content-access API. The
API's implementation, caching, and revalidation are owned by
[DATA_FETCHING.md](../engineering/DATA_FETCHING.md); its parsing/validation is
owned by [MDX_PIPELINE.md](./MDX_PIPELINE.md). For cross-reference, the *typed
result* callers can expect is:

```ts
/** Illustrative return shapes; access/caching defined in DATA_FETCHING.md. */
interface ContentItem<TFrontmatter extends ContentBase> {
  frontmatter: TFrontmatter;
  /** Compiled MDX ready to render in a Server Component. */
  body: CompiledMDX;
}

type Project = ContentItem<ProjectFrontmatter>;
type CaseStudy = ContentItem<CaseStudyFrontmatter>;
type Article = ContentItem<ArticleFrontmatter>;
type JourneyEntry = ContentItem<JourneyEntryFrontmatter>;
type Experience = ContentItem<ExperienceFrontmatter>;
type EngineeringDoc = ContentItem<EngineeringDocFrontmatter>;
```

Because these types are the same ones validated at build time, a page that
consumes them is guaranteed a well-formed item or a failed build — never a
runtime shape surprise (QAT-3).

---

## Engineering Decisions

- **ED-1 — Frontmatter for identity/links, MDX body for narrative.** Structured,
  queryable, validatable data (slugs, dates, links, tech stack) belongs in
  frontmatter; long-form prose belongs in the body. This split makes listing,
  ordering, and relationship validation possible without parsing prose.
- **ED-2 — Slugs are locale-invariant identity.** One slug per logical item
  across locales lets en/ar files be recognized as the same thing and cross-link,
  and keeps localized routes consistent
  ([INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md)).
- **ED-3 — Closed enums for taxonomies.** `ArticleCategory`, `JourneyKind`,
  `EngineeringDocKind` are closed unions so taxonomies cannot silently sprawl —
  a new value is a deliberate schema change, serving consistency (QAT-7).
- **ED-4 — Relationships by slug with build-time integrity.** Referencing by
  slug (not by embedding) keeps types decoupled; validating those references at
  build time means broken cross-links fail the build, never production.
- **ED-5 — Documentation is a content type.** `EngineeringDoc` exists so the
  published engineering docs flow through the same pipeline as everything else,
  honoring [ARCHITECTURE §8](../engineering/ARCHITECTURE.md) rather than becoming
  a bespoke route.
- **ED-6 — Article/CaseStudy defined in V1 though surfaced in V2.** Defining the
  schema early avoids a later migration; only the *surface* is deferred, not the
  model.

## Best Practices

- **Author in the schema, not around it.** If a needed field is missing, extend
  the schema here first; do not stuff data into prose.
- **Keep summaries genuinely short** — they are reused as meta descriptions and
  card copy ([DESIGN_LANGUAGE.md](../design/DESIGN_LANGUAGE.md)).
- **Always provide `alt`, `width`, `height` for gallery images** — required by
  the schema for accessibility and layout stability.
- **Cross-link by slug** and let the build verify it, rather than pasting URLs.
- **Author Arabic as Arabic**, not as a translated afterthought of the English
  file; the schema treats each locale file as first-class.

## Common Mistakes

- **Inventing a new category/kind** instead of extending the closed enum —
  fails validation by design.
- **Reusing a slug within a type**, colliding two items — a build failure.
- **Putting narrative in frontmatter** (or structured data in prose), defeating
  querying and validation.
- **Dangling relationship slugs** — pointing `caseStudy` at a nonexistent study;
  caught at build time, but avoidable.
- **Locale-specific slugs**, which break item identity and cross-locale linking.
- **Treating docs as a special route** rather than `EngineeringDoc` content,
  contradicting [ARCHITECTURE §8](../engineering/ARCHITECTURE.md).

## Examples

**Illustrative Project frontmatter (`content/projects/streaming-platform.en.mdx`):**

```mdx
---
slug: streaming-platform
title: Streaming Platform
summary: A low-latency video platform rebuilt on the App Router for sub-second
  start times.
date: 2026-03-14
order: 1
featured: true
locale: en
role: Lead Frontend Engineer
techStack:
  - { name: Next.js, category: framework }
  - { name: TypeScript, category: language }
  - { name: Tailwind CSS, category: styling }
github: https://github.com/example/streaming-platform
liveDemo: https://streaming.example.com
caseStudy: streaming-platform-scale
relatedArticles: [rsc-in-production]
gallery:
  - { src: /img/streaming/hero.avif, alt: Player UI at start, width: 1600, height: 900 }
---

## Overview
...
## Problem
...
## Solution
...
## My Role
...
## Folder Structure
...
## Architecture Decisions
...
## Challenges
...
## Lessons Learned
...
```

## Checklist

Before committing any content file:

- [ ] Frontmatter satisfies its type's **required** fields.
- [ ] `slug` is unique within the type and identical across its locales.
- [ ] `locale` matches the file's actual language.
- [ ] Enum fields (`category`/`kind`) use an allowed value.
- [ ] Relationship slugs resolve to real items.
- [ ] Project body includes all FR-005 required sections.
- [ ] Gallery images have `alt`, `width`, `height`.
- [ ] `featured`/`order` reflect the intended collection and sequence.
- [ ] The Arabic counterpart exists (or its absence is an intentional, handled
      fallback).

## Related Documents

- [Architecture](../engineering/ARCHITECTURE.md) — §8 content architecture; §12
  records this as a strategy document.
- [MDX Pipeline](./MDX_PIPELINE.md) — parsing, validation mechanism, rendering,
  file organization.
- [Data Fetching](../engineering/DATA_FETCHING.md) — content-access API, caching,
  locale fallback.
- [Component Catalog](./COMPONENT_CATALOG.md) — components that render this
  content (Timeline, ProjectCard, MDX component map).
- [Internationalization](../engineering/INTERNATIONALIZATION.md) — locale routing
  and direction.
- [Product Requirements](../product/PRODUCT_REQUIREMENTS.md) — FR-005, FR-004,
  FR-006, FR-008, FR-009, FR-015.
