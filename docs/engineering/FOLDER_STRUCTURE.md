# Folder Structure

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document turns the four-layer architecture of
[ARCHITECTURE.md §6](./ARCHITECTURE.md#6-application-structure) into a concrete,
navigable directory tree and a precise set of import-boundary rules. Where
[§6](./ARCHITECTURE.md#6-application-structure) defines the *frame* — routing,
feature, shared, and content layers with dependencies pointing downward only —
this document defines the *detail*: exactly where a given file lives, what each
directory is allowed to contain, and how a feature exposes itself to the rest of
the system.

The structure is not decoration. It is the primary mechanism for
maintainability (QAT-3) and codebase scalability (QAT-4): a contributor — human
or AI-assisted — should be able to place any new file without deliberation, and
a reviewer should be able to spot a misplaced file or an illegal import on
sight.

---

## Scope

**In scope.** The physical directory layout of the application; the anatomy of a
feature module and its public surface; the composition of the shared and content
layers; folder-naming conventions; the import-boundary rules and how they are
enforced; and a decision procedure for placing any new file.

**Out of scope.**

- *File-* and *symbol-*naming specifics (casing of components, hooks, utilities,
  test files) — owned by [developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md).
- *How* components render (Server vs Client, segment config, `loading`/`error`
  behavior) — owned by [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md).
- *How* content is read and cached — owned by
  [DATA_FETCHING.md](./DATA_FETCHING.md).
- Content *schemas* and the MDX *pipeline* — owned by
  [developer/CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) and
  [developer/MDX_PIPELINE.md](../developer/MDX_PIPELINE.md).
- i18n routing *mechanism* — owned by
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) and
  [ADR-0004](../adr/ADR-0004-Internationalization.md).

This document names those subsystems and points to the authoritative document
rather than restating it.

---

## Goals

1. **Zero-ambiguity placement.** Every file has exactly one correct home,
   derivable from the decision tree below.
2. **Enforceable boundaries.** The dependency direction from
   [§6](./ARCHITECTURE.md#6-application-structure) is expressed as concrete path
   rules that lint can check, not as folklore.
3. **Cohesion by feature.** A feature's code, logic, and types sit together, so
   a feature can be understood, changed, or removed as a unit (QAT-3, QAT-4).
4. **A thin routing layer.** `app/` composes features and owns framework
   concerns (layouts, metadata, locale segment); it never implements feature
   logic.
5. **Deliberate sharing.** Code becomes shared by an explicit promotion, never
   by one feature reaching into another.

---

## Responsibilities

| This document owns | This document defers |
| --- | --- |
| The directory tree and what each directory may contain | File/symbol naming → [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) |
| Feature anatomy and the public-surface (barrel) pattern | Rendering semantics of route files → [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |
| Import-boundary rules and their enforcement | Content access from these folders → [DATA_FETCHING.md](./DATA_FETCHING.md) |
| Folder-naming conventions | Content schemas → [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) |
| The file-placement decision tree | i18n routing mechanism → [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |

---

## Dependencies

| Source | Why it constrains this document |
| --- | --- |
| [ARCHITECTURE.md §6](./ARCHITECTURE.md#6-application-structure) | Defines the four layers and the downward-only dependency rule this tree realizes. |
| [ADR-0002 — Feature Architecture](../adr/ADR-0002-Feature-Architecture.md) | The locked decision to organize by feature domain, not technical type. |
| [ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture) | Content is typed, in-repo data (MDX + structured data); shapes the `content/` layer. |
| [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md) | Tokens and shared components live in the shared layer and global styles. |

---

## 1. Top-Level Layout

The repository root separates the four architectural layers into first-class
directories. Everything under `src/` is application code; configuration and
content sit where the framework and tooling expect them.

```text
mk-portfolio/
├─ app/                      # ROUTING LAYER — URLs, layouts, metadata, locale segment
├─ features/                # FEATURE LAYER — self-contained domains
├─ shared/                  # SHARED LAYER — cross-feature building blocks
├─ content/                 # CONTENT LAYER — typed MDX + structured data (source of truth)
├─ public/                  # static assets served as-is (favicons, fonts, robots.txt)
├─ docs/                    # the documentation product (this file lives here)
├─ messages/ or shared/config/i18n/  # locale dictionaries (see INTERNATIONALIZATION.md)
├─ next.config.*            # framework config
├─ tailwind.config.*        # token-driven Tailwind config (see DESIGN_TOKENS.md)
├─ tsconfig.json            # path aliases enforcing layer boundaries (§5)
└─ package.json
```

> **v1.0.0 decision — `src/` directory.** Application layers (`app/`,
> `features/`, `shared/`, `content/`) are colocated under a single `src/`
> directory. Rationale: it cleanly separates application code from
> root-level configuration and keeps the tsconfig path aliases in
> [§5](#5-import-boundaries) short and unambiguous. This is a convention the
> architecture leaves open; it is fixed here and does not alter the frame. Where
> this document writes `app/`, read `src/app/`, and so on. Teams that prefer the
> root-level layout may drop `src/` without changing any rule below, since the
> boundaries are expressed through path aliases, not physical depth.

The four application directories map one-to-one onto the layers in
[ARCHITECTURE.md §6](./ARCHITECTURE.md#6-application-structure). The dependency
arrows there (`routing → feature → shared`, `feature → content`) are the rules
enforced in [§5](#5-import-boundaries).

---

## 2. The Routing Layer — `app/`

`app/` is the Next.js App Router tree. It is **thin**: its files map URLs to
pages, own layouts and metadata, define the locale segment, and compose feature
modules. A route file's body should read like an assembly of feature exports and
layout primitives — not like the implementation of a feature.

### 2.1 Annotated tree

```text
app/
├─ layout.tsx                    # root layout: <html>, font links, providers mount point
├─ globals.css                   # single global stylesheet: token CSS vars, base/reset
├─ [locale]/                     # dynamic locale segment (en | ar) — see INTERNATIONALIZATION.md
│  ├─ layout.tsx                 # locale layout: sets lang/dir, wires dictionary + theme
│  ├─ page.tsx                   # "/" landing page (FR-003)
│  ├─ loading.tsx                # segment-level loading UI (see RENDERING_STRATEGY.md)
│  ├─ error.tsx                  # segment error boundary ("use client")
│  ├─ not-found.tsx              # localized 404 (FR IA: /404)
│  │
│  ├─ about/
│  │  └─ page.tsx                # About (FR-004)
│  │
│  ├─ projects/
│  │  ├─ page.tsx                # projects index (FR-005)
│  │  └─ [slug]/
│  │     ├─ page.tsx             # project detail (FR-005)
│  │     ├─ loading.tsx          # detail-specific skeleton
│  │     └─ not-found.tsx        # unknown slug
│  │
│  ├─ engineering/
│  │  ├─ page.tsx                # Engineering hub (FR-006)
│  │  ├─ decisions/page.tsx      # Engineering Decisions (FR-007)
│  │  └─ journey/page.tsx        # Engineering Journey (FR-008)
│  │
│  ├─ (legal)/                   # ROUTE GROUP — shared layout, no URL segment
│  │  ├─ layout.tsx
│  │  ├─ privacy/page.tsx
│  │  └─ terms/page.tsx
│  │
│  ├─ resume/page.tsx            # Resume (FR-004/FR-010)
│  └─ contact/page.tsx           # Contact (FR-010)
│
├─ sitemap.ts                    # SEO — see SEO.md
├─ robots.ts                     # SEO — see SEO.md
├─ opengraph-image.tsx           # default OG image (or per-route)
└─ icon.svg / apple-icon.png     # app icons
```

### 2.2 Conventions

- **`[locale]` is the outermost dynamic segment.** Every page is nested under it
  so locale and direction resolve once, at the top. The concrete routing scheme
  (path prefix vs. alternatives) is deferred to
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) /
  [ADR-0004](../adr/ADR-0004-Internationalization.md); this document only fixes
  that the segment exists and is outermost.
- **Route groups `(name)/`** organize routes and share a layout without adding a
  URL segment. Use them to group routes with a common frame (e.g. legal pages),
  never to smuggle feature logic into the routing layer.
- **Special files** — `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`,
  `not-found.tsx`, `template.tsx` — are the only React files that belong in
  `app/`. Their *rendering behavior and UX* are governed by
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md); their *placement* is governed
  here: they live at the segment they serve.
- **No feature implementation in `app/`.** A `page.tsx` imports from a feature's
  public surface (`features/<feature>`) and from `shared/`, arranges the pieces,
  and exports route metadata. If a `page.tsx` grows private components, helpers,
  or types, those belong in a feature or in `shared/`, not beside the route.
- **Metadata and data live at the edge of the route.** `generateMetadata`,
  `generateStaticParams`, and route segment config are declared in the route
  file; the data they read comes through the content-access layer described in
  [DATA_FETCHING.md](./DATA_FETCHING.md).

> **Colocation limit.** App Router permits colocating arbitrary files inside
> `app/`. This project deliberately does **not** use that affordance for
> components or logic: the only non-special files allowed in `app/` are
> route-scoped assets (e.g. a route's `opengraph-image.tsx`). This keeps the
> routing layer thin and the boundary with the feature layer sharp.

---

## 3. The Feature Layer — `features/`

A feature is a self-contained product domain (`projects`, `contact`, `search`,
`theme`, `command-menu`). It owns its components, logic, and types, and exposes a
single **public surface**. Features are the unit of cohesion in the codebase and
the primary vehicle for QAT-3 and QAT-4.

### 3.1 Feature anatomy

```text
features/
└─ projects/
   ├─ index.ts                   # PUBLIC SURFACE — the ONLY legal import path (§4)
   ├─ components/                # feature-owned React components (Server + Client)
   │  ├─ project-card.tsx
   │  ├─ project-grid.tsx
   │  ├─ project-detail.tsx
   │  └─ project-filter-bar.tsx  # "use client" island (URL-state; STATE_MANAGEMENT.md)
   ├─ lib/                       # feature-private logic (pure, framework-light)
   │  ├─ get-projects.ts         # composes the content-access layer (DATA_FETCHING.md)
   │  └─ sort-projects.ts
   ├─ types/                     # feature-local types
   │  └─ project.ts              # (content SCHEMA lives in content layer; CONTENT_MODEL.md)
   └─ hooks/                     # feature-local client hooks (optional)
      └─ use-project-filters.ts
```

Every feature follows the same shape. Not all subdirectories are required —
create `hooks/` only when a feature has client hooks, `types/` only when it
declares its own — but when present they mean the same thing in every feature.

### 3.2 The public surface (barrel) pattern

Each feature has exactly one `index.ts` that re-exports the symbols other layers
may use. This is the feature's **API**; everything else is private.

```ts
// features/projects/index.ts — the feature's entire public API
export { ProjectGrid } from "./components/project-grid";
export { ProjectDetail } from "./components/project-detail";
export { getProjects, getProjectBySlug } from "./lib/get-projects";
export type { Project } from "./types/project";
// project-card, sort-projects, use-project-filters are intentionally NOT exported
```

- **Consumers import from the feature root**, never from a deep path:

  ```ts
  import { ProjectGrid } from "@/features/projects";        // ✅ public surface
  import { ProjectCard } from "@/features/projects/components/project-card"; // ❌ private
  ```

- The barrel is the seam that makes internals refactorable: as long as
  `index.ts` is stable, a feature can reorganize its `components/` and `lib/`
  freely.
- Keep the surface **minimal**. Export the smallest set that consumers genuinely
  need. A symbol used only inside the feature is never exported.

### 3.3 Rules within a feature

- A feature may import from `shared/` and from `content/` (via its `lib/`), and
  from its own internals. It may **not** import from another feature — see
  [§5](#5-import-boundaries).
- Server/Client boundaries are decided per component by
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md); both kinds live under
  `components/`. Keep `"use client"` at the leaves.
- Feature `lib/` reads content through the typed content-access layer described
  in [DATA_FETCHING.md](./DATA_FETCHING.md); it does not parse MDX itself (that
  is the pipeline's job — [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md)).

---

## 4. The Shared Layer — `shared/`

`shared/` holds cross-feature building blocks. Code lands here by **deliberate
promotion** when it is genuinely reused or genuinely feature-agnostic — never
speculatively, and never because two features happened to need a copy.

```text
shared/
├─ ui/                     # the design-system component library (tokens only)
│  ├─ button.tsx
│  ├─ card.tsx
│  ├─ heading.tsx
│  ├─ icon.tsx             # Lucide wrapper (DESIGN_SYSTEM.md → Iconography)
│  └─ index.ts             # public surface for shared UI
├─ lib/                    # framework-agnostic utilities (pure functions)
│  ├─ cn.ts                # className composition
│  ├─ format-date.ts
│  └─ locale.ts            # locale/direction helpers used across features
├─ hooks/                  # cross-feature client hooks
│  ├─ use-media-query.ts
│  └─ use-mounted.ts
└─ config/                 # app-wide constants & configuration
   ├─ site.ts              # site metadata, nav structure, social links
   ├─ i18n.ts              # locale list, default locale (see INTERNATIONALIZATION.md)
   └─ routes.ts            # typed route builders
```

- **`shared/ui`** is the component library referenced by
  [DESIGN_SYSTEM.md → Component Standards](../design/DESIGN_SYSTEM.md): reusable,
  composable, accessible, typed. These components consume **tokens only** (no
  hardcoded design values — [ARCHITECTURE.md Principle 5](./ARCHITECTURE.md#2-architectural-principles)).
- **`shared/lib`** is for pure, feature-agnostic utilities. If a helper knows
  about the *projects* domain, it belongs in `features/projects/lib`, not here.
- **`shared/hooks`** holds client hooks used by more than one feature. A hook
  used by a single feature stays in that feature.
- **`shared/config`** holds app-wide constants: the site map/navigation, the
  locale configuration, typed route builders.
- **The shared layer depends on nothing feature-specific.** It never imports
  from `features/` or `app/`. This is what lets every feature depend on it
  safely.

> **Global styles & tokens.** The single global stylesheet is `app/globals.css`
> (token CSS custom properties, base and reset styles). Token *values* and their
> Tailwind wiring are owned by [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) and
> `tailwind.config.*`. Components reference tokens through Tailwind utilities or
> CSS variables; they never define raw values locally.

---

## 5. Import Boundaries

The dependency direction in
[ARCHITECTURE.md §6](./ARCHITECTURE.md#6-application-structure) is a hard rule.
Here it is stated precisely and made enforceable.

### 5.1 The allowed-import matrix

| From ↓ / May import → | `app/` | `features/*` (public surface) | `shared/*` | `content/*` |
| --- | :---: | :---: | :---: | :---: |
| **`app/`** (routing) | own segment tree | ✅ | ✅ | via feature only |
| **`features/A`** | ❌ | ❌ (never another feature) | ✅ | ✅ (via `lib/`) |
| **`shared/`** | ❌ | ❌ | ✅ (within shared) | ❌ |
| **`content/`** | ❌ | ❌ | ✅ (types/utils) | ✅ (within content) |

Three invariants summarize the matrix:

1. **Dependencies point downward only:** routing → feature → shared, and
   feature → content. Nothing points up.
2. **Features never import features.** A cross-feature need is resolved by
   promoting the shared piece into `shared/` (or `content/` if it is content
   logic), *not* by importing a sibling.
3. **Feature internals are private.** Cross-feature and routing imports go
   through the feature's `index.ts` public surface only
   ([§3.2](#32-the-public-surface-barrel-pattern)).

### 5.2 Enforcement

- **Path aliases (`tsconfig.json`).** Absolute aliases give every layer a stable
  prefix and make deep imports visually obvious in review:

  ```jsonc
  {
    "compilerOptions": {
      "baseUrl": "src",
      "paths": {
        "@/app/*":      ["app/*"],
        "@/features/*": ["features/*"],
        "@/shared/*":   ["shared/*"],
        "@/content/*":  ["content/*"]
      }
    }
  }
  ```

- **Lint boundary rules.** An import-boundary lint rule (e.g. an
  `import/no-restricted-paths` / boundaries configuration) encodes the matrix so
  a violation fails CI rather than review:
  - `features/A` may not import `features/B`.
  - Nothing outside a feature may import a path deeper than that feature's
    `index.ts`.
  - `shared/` may not import `features/` or `app/`.
  The exact rule syntax and lint stack are owned by
  [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) and
  [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md); this document defines
  *what* the rules must guarantee.

---

## 6. The Content Layer — `content/`

Content is typed, in-repo data
([ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture)). The `content/`
directory is the source of truth for projects, case studies, articles, journey
entries, and the published engineering documentation. It is organized by content
*type*.

```text
content/
├─ projects/                # one MDX file per project (FR-005)
│  ├─ streaming-platform.mdx
│  └─ design-system.mdx
├─ case-studies/            # long-form case studies
├─ articles/                # blog posts (FR-009; Version 2 surface)
├─ journey/                 # engineering-journey timeline entries (FR-008)
├─ docs/                    # engineering docs published as content (see §8 note)
└─ authors/                 # structured author data (JSON/TS)
```

- **Placement only.** This document fixes *where* content lives and that it is
  grouped by type. The **schemas** (frontmatter shape, validation) are owned by
  [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md); the **parsing/rendering
  pipeline** is owned by [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md); **how
  it is read and cached** is owned by [DATA_FETCHING.md](./DATA_FETCHING.md).
- **Locale within content.** Whether a locale is a file suffix, a subfolder, or
  a frontmatter field is an i18n-mechanism decision owned by
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md); it does not change the
  by-type grouping here.
- **Documentation as content.** Per
  [ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture), engineering
  documentation is a content *type*, consumed through the same pipeline. Its
  published form lives under `content/docs/`; the authoring source (this file and
  its siblings) lives under the repository-root `docs/` tree.

---

## 7. Folder-Naming Conventions

These rules govern **directory** names. Individual **file** and **symbol** names
(component casing, hook prefixes, test suffixes) are owned by
[CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) and are intentionally not
restated here.

- **`kebab-case` for all directories.** `command-menu/`, `case-studies/`,
  `project-detail/`. Lowercase and hyphenated, matching URL segments and
  avoiding cross-platform casing hazards (Windows/macOS are case-insensitive;
  Linux CI is not).
- **Feature directories are singular domain nouns** where the domain is
  singular (`contact`, `search`, `theme`) and plural where the domain is a
  collection (`projects`). Match the product vocabulary in the
  [PRD Information Architecture](../product/PRODUCT_REQUIREMENTS.md).
- **Fixed role names inside a feature.** Use exactly `components/`, `lib/`,
  `types/`, `hooks/` — never synonyms (`utils/`, `helpers/`, `models/`). The
  uniform vocabulary is what makes any feature legible at a glance.
- **App Router reserved names** (`app`, `layout`, `page`, `loading`, `error`,
  `not-found`, `template`, `[param]`, `(group)`, `@slot`) follow the framework's
  spelling exactly; they are the only place bracket/parenthesis syntax appears.
- **No numeric or generic folder names** (`components2/`, `misc/`, `common/`) —
  mirroring [DESIGN_SYSTEM.md → Naming](../design/DESIGN_SYSTEM.md). If you
  cannot name a folder by its role, it does not yet have a clear reason to
  exist.

---

## 8. File-Placement Decision Tree

Use this procedure to place any new file. Stop at the first matching branch.

```text
Placing a new file — answer in order:

1. Is it a URL, layout, or route-level UI/metadata
   (page, layout, loading, error, not-found, sitemap, robots)?
      → app/  (at the segment it serves)

2. Is it content — a project, case study, article, journey entry, doc?
      → content/<type>/     (schema? → CONTENT_MODEL.md)

3. Is it design-system/generic UI, usable with no knowledge of any feature?
      → shared/ui/

4. Is it a pure utility / hook / config with no feature knowledge,
   used (or clearly reusable) across features?
      → shared/lib | shared/hooks | shared/config

5. Does it belong to exactly ONE feature domain?
      → features/<feature>/{components|lib|types|hooks}/
        (expose it in index.ts ONLY if another layer must import it)

6. Two features need the same thing?
      → DON'T import feature→feature. Promote it:
        generic UI → shared/ui ; pure logic → shared/lib ;
        content logic → content/ (or its access layer)

7. Still unsure between "shared" and "feature-local"?
      → Default to feature-local. Promote later when a second real
        consumer appears. (ARCHITECTURE Principle 8: simplicity;
        premature sharing is a maintainability cost.)
```

The bias in steps 5 and 7 is deliberate: **start local, promote on evidence.**
It is cheap to move a file up into `shared/` when a second consumer proves the
need, and expensive to untangle a `shared/` module that only one feature ever
used.

---

## Engineering Decisions

Decisions fixed at v1.0.0 where the architecture required a concrete convention
but left the detail open. Each is consistent with
[ARCHITECTURE.md](./ARCHITECTURE.md) and justified.

1. **`src/` root for application layers.** Separates app code from root config;
   keeps path aliases short. Does not alter the four-layer frame
   ([§1](#1-top-level-layout)).
2. **One `index.ts` public surface per feature.** Makes the feature boundary a
   real, lint-checkable API and keeps internals refactorable
   ([§3.2](#32-the-public-surface-barrel-pattern)). Chosen over allowing deep
   imports, which would make every internal file part of the contract.
3. **Fixed intra-feature role folders (`components`/`lib`/`types`/`hooks`).**
   Uniform vocabulary across features beats per-feature creativity for
   legibility (QAT-3).
4. **Content grouped by type, not by locale or by feature.** Keeps content a
   clean input to the pipeline and lets multiple features read the same type
   ([§6](#6-the-content-layer--content)).
5. **`kebab-case` directories.** Cross-platform-safe and URL-aligned
   ([§7](#7-folder-naming-conventions)).
6. **Boundaries enforced by path aliases + lint, not convention alone.** A rule
   that CI can check is a rule that survives ([§5.2](#52-enforcement)).
7. **Start-local / promote-on-evidence.** Guards against speculative sharing and
   the overengineering risk in the
   [PRD](../product/PRODUCT_REQUIREMENTS.md) ([§8](#8-file-placement-decision-tree)).

---

## Best Practices

- **Import from a feature's root, never a deep path.** If you are typing
  `features/x/components/...` from outside `features/x`, stop — either use the
  public surface or the symbol should be shared.
- **Keep `app/` thin.** A `page.tsx` composes; it does not implement. Growing
  logic in a route file is a signal to move it into a feature.
- **Promote, don't reach.** When two features need the same thing, lift it to
  `shared/` (or `content/`); never import a sibling feature.
- **Name folders by role.** A folder whose name you cannot justify by its role
  probably should not exist.
- **Colocate within a feature.** A component's private helper and types live
  beside it in the same feature, not scattered into `shared/`.
- **Let the tree mirror the URL.** The `app/` segments should be readable as the
  site map in the [PRD IA](../product/PRODUCT_REQUIREMENTS.md).

---

## Common Mistakes

- **Deep-importing feature internals** (`features/projects/components/project-card`)
  from another layer — bypasses the public surface and freezes internals into
  the contract. Fix: export via `index.ts` or promote to `shared/`.
- **Feature-to-feature imports** — the most common boundary violation, flagged
  as an architectural error in
  [ARCHITECTURE.md Common Mistakes](./ARCHITECTURE.md#common-mistakes). Fix:
  promote the shared piece.
- **Logic in `app/`** — private components, hooks, or helpers colocated beside a
  `page.tsx`. Fix: move them into the owning feature.
- **Speculative `shared/`** — parking a single-feature helper in `shared/lib`
  "in case" it is reused. Fix: keep it feature-local until a second consumer
  appears.
- **Generic folder names** (`utils/`, `common/`, `misc/`) — erode the by-role
  vocabulary. Fix: name by role, or split into the fixed role folders.
- **Restating file-naming rules here** — casing and file-name conventions belong
  to [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md); duplicating them
  invites drift.

---

## Examples

**Adding a new "Case Studies" feature.** A new domain surfaces (`FR IA →
Case Studies`).

1. Content first: author entries under `content/case-studies/*.mdx` (schema per
   [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)).
2. Create the feature:

   ```text
   features/case-studies/
   ├─ index.ts
   ├─ components/ case-study-list.tsx  case-study-article.tsx
   ├─ lib/        get-case-studies.ts
   └─ types/      case-study.ts
   ```

3. Expose only what routes need:

   ```ts
   // features/case-studies/index.ts
   export { CaseStudyList } from "./components/case-study-list";
   export { CaseStudyArticle } from "./components/case-study-article";
   export { getCaseStudies, getCaseStudyBySlug } from "./lib/get-case-studies";
   export type { CaseStudy } from "./types/case-study";
   ```

4. Add the thin route:

   ```tsx
   // app/[locale]/engineering/case-studies/page.tsx
   import { CaseStudyList } from "@/features/case-studies";
   import { getCaseStudies } from "@/features/case-studies";

   export default async function CaseStudiesPage() {
     const studies = await getCaseStudies();      // read on the server — DATA_FETCHING.md
     return <CaseStudyList studies={studies} />;   // compose, don't implement
   }
   ```

**Sharing a formatter used by two features.** `projects` and `journey` both need
relative-date formatting. Do not import one feature from the other; place the
pure helper in `shared/lib/format-date.ts` and import it from both.

---

## Checklist

Before merging any structural change:

- [ ] Every new file resolves to a single home via the
      [decision tree](#8-file-placement-decision-tree).
- [ ] No import points upward (feature→routing, shared→feature,
      content→feature).
- [ ] No feature imports another feature.
- [ ] All cross-layer feature imports go through the feature's `index.ts`.
- [ ] `app/` files are limited to route special files and route-scoped assets.
- [ ] Shared code was promoted for a real second consumer, not speculatively.
- [ ] Directories are `kebab-case` and named by role.
- [ ] Intra-feature folders use the fixed `components`/`lib`/`types`/`hooks`
      vocabulary.
- [ ] Path aliases and boundary lint rules cover any new layer path.

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — §6 (application structure), §8 (content
  architecture): the frame this document details.
- [ADR-0002 — Feature Architecture](../adr/ADR-0002-Feature-Architecture.md) —
  the locked decision to organize by feature domain.
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — rendering semantics of the
  route files placed here.
- [DATA_FETCHING.md](./DATA_FETCHING.md) — how feature `lib/` reads the content
  layer.
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) — where client-state islands sit
  within a feature.
- [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) — file- and
  symbol-naming (deferred here).
- [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) /
  [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md) — content schemas and pipeline.
- [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) — token values consumed by
  `shared/ui` and `app/globals.css`.
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — the `[locale]` segment
  and content-locale mechanism.
