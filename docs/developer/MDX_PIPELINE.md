# MDX Pipeline

**Version:** 1.0.0 / **Status:** Draft / **Last Updated:** July 2026 / **Owner:** Mohamed Kamel

---

## Purpose

This document specifies **how MDX content is processed** — from a file in the
repository to rendered HTML inside a Server Component. It covers file
organization, frontmatter parsing, build-time schema validation, the
remark/rehype plugin roles, the MDX-to-component mapping, rendering within the
server-first model, the typed content-access API's shape, and localization
handling.

It is the operational half of the content strategy. Where
[CONTENT_MODEL.md](./CONTENT_MODEL.md) owns *what content is* (the schemas and
the no-CMS decision), this document owns *how that content becomes a page*. Where
[COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) owns *which component* renders an
element, this document owns *the mapping and the render path*.

---

## Scope

**In scope.** The `content/` file organization; frontmatter parsing; build-time
validation and its failure behavior; the remark and rehype plugin pipeline and
each plugin's role; the MDX component map; rendering MDX within Server
Components; the typed content-access API shape; and how localization (en/ar) is
handled through the pipeline.

**Out of scope.** The schemas themselves and the no-CMS strategy decision —
owned by [CONTENT_MODEL.md](./CONTENT_MODEL.md). Caching, revalidation, and
call-site data-access patterns — owned by
[DATA_FETCHING.md](../engineering/DATA_FETCHING.md). The visual/behavioral
contract of each mapped component — owned by
[COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md). Locale routing and direction
mechanics — owned by
[INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md).

---

## Goals

- Turn committed MDX into **statically generated, server-rendered** pages
  (QAT-1, QAT-6).
- Make **invalid content fail the build**, never production
  ([ARCHITECTURE §8](../engineering/ARCHITECTURE.md); QAT-3).
- Render content **inside Server Components** with client interactivity confined
  to explicit leaf islands ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)).
- Keep content rendering **inside the design system** via the component map, so
  no page emits unstyled raw HTML (QAT-7).
- Handle **localization** (en/ar, RTL) through the same single pipeline (QAT-5).

---

## Responsibilities

| This document owns | This document defers to |
| --- | --- |
| `content/` file organization and locale file arrangement. | Schemas & field rules → [CONTENT_MODEL.md](./CONTENT_MODEL.md) |
| Parsing, the plugin pipeline, and validation *mechanism*. | Caching/access patterns → [DATA_FETCHING.md](../engineering/DATA_FETCHING.md) |
| The MDX → component mapping (canonical table). | Component contracts → [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) |
| The render path within Server Components. | Server-first rules → [ARCHITECTURE §5](../engineering/ARCHITECTURE.md) |

---

## Dependencies

| Source | Why it constrains this pipeline |
| --- | --- |
| [ARCHITECTURE §8](../engineering/ARCHITECTURE.md) | Content-as-data; build-time validation; documentation-as-content; static bias. |
| [ARCHITECTURE §5](../engineering/ARCHITECTURE.md) | Server-first rendering; interactivity at the leaves. |
| [CONTENT_MODEL.md](./CONTENT_MODEL.md) | Supplies the schemas this pipeline validates against. |
| [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) | Supplies the components the map targets. |
| [DATA_FETCHING.md](../engineering/DATA_FETCHING.md) | Consumes the access API this pipeline produces. |
| [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md) | Defines locale/direction the pipeline must respect. |

---

## 1. Why MDX + local content

Restating, at the operational level, the rationale locked in
[ARCHITECTURE §8](../engineering/ARCHITECTURE.md) and
[CONTENT_MODEL.md §1](./CONTENT_MODEL.md):

- **Rich composition.** MDX is Markdown that can render components. A project or
  article can drop a live demonstration ([PRD → FR-013](../product/PRODUCT_REQUIREMENTS.md))
  into otherwise-prose content without a bespoke page build.
- **Type safety.** Frontmatter is validated against a schema at build time; the
  compiled body is rendered by typed Server Components. Broken content cannot
  ship (QAT-3).
- **Versioned.** Content is committed, reviewed, and diffed like code — the
  editorial history *is* the git history, which suits the
  [Development Journal (FR-015)](../product/PRODUCT_REQUIREMENTS.md).
- **Static and server-first.** Because content is known at build time it is
  statically generated and server-rendered, minimizing client JavaScript
  (QAT-1) and maximizing indexable HTML (QAT-6).

MDX is therefore not a convenience; it is the mechanism that makes
"content as data" ([ARCHITECTURE Principle 6](../engineering/ARCHITECTURE.md))
real.

---

## 2. File organization under `content/`

Content is the **Content layer** of the architecture
([ARCHITECTURE §6](../engineering/ARCHITECTURE.md)) and lives at the repository
root under `content/`, one directory per content type:

```
content/
  projects/         ProjectFrontmatter    (FR-005)
  case-studies/     CaseStudyFrontmatter
  articles/         ArticleFrontmatter     (FR-009, V2 surface)
  journey/          JourneyEntryFrontmatter (FR-008)
  experience/       ExperienceFrontmatter  (FR-004)
  engineering/      EngineeringDocFrontmatter (FR-006, FR-015)
```

**Locale arrangement (v1.0.0 decision).** Each logical item has one file per
locale, distinguished by a locale suffix on the filename, keyed by the shared,
locale-invariant `slug` ([CONTENT_MODEL.md §2.3, §5](./CONTENT_MODEL.md)):

```
content/projects/
  streaming-platform.en.mdx
  streaming-platform.ar.mdx
  design-system.en.mdx        # ar missing → locale fallback (DATA_FETCHING.md)
```

- The `slug` is derived from the filename **before** the locale suffix, so both
  files resolve to the same logical item.
- A suffixed filename is monolingual, keeping each file reviewable and
  directionally consistent, and letting Arabic bodies diverge structurally where
  the language requires.
- The alternative (per-locale directory trees, `content/en/…`) was rejected for
  V1 because the suffix keeps an item's translations adjacent in the same
  directory, making a missing translation obvious at a glance.

The directory/type binding is fixed; a file placed in the wrong type directory
fails validation because its frontmatter will not match that type's schema.

---

## 3. Frontmatter parsing and build-time validation

### 3.1 Parse

At build time the pipeline, for every file under `content/`:

1. **Reads** the file and splits YAML frontmatter from the MDX body.
2. **Parses** frontmatter to a plain object and derives `slug` (from filename)
   and `locale` (from the suffix), cross-checking them against any values
   present in the frontmatter.
3. **Validates** the frontmatter object against the schema for that content type
   ([CONTENT_MODEL.md §3](./CONTENT_MODEL.md)).
4. **Compiles** the body to a renderable module (see §5).

### 3.2 Validate — failure fails the build

Validation is a **compile-time gate**, per
[ARCHITECTURE §8](../engineering/ARCHITECTURE.md). Each content type's schema
([CONTENT_MODEL.md](./CONTENT_MODEL.md)) is expressed as a runtime validator
(schema-first, e.g. a Zod schema) whose inferred type is the same TypeScript type
pages consume — one definition, used for both validation and typing. A file
**fails the build** when any of the following hold:

- A **required field is missing** or has the wrong type.
- An **enum field** (`category`, `kind`, …) holds a value outside its closed
  union ([CONTENT_MODEL.md §3.3–3.6](./CONTENT_MODEL.md)).
- A **duplicate `slug`** exists within a content type.
- A **relationship slug** (`caseStudy`, `project`, `relatedArticles[]`, …) does
  not resolve to an existing item — referential integrity
  ([CONTENT_MODEL.md §4](./CONTENT_MODEL.md)).
- A **required body section** is absent (e.g. a Project missing "Lessons
  Learned", [CONTENT_MODEL.md §3.1](./CONTENT_MODEL.md)).
- A **gallery image** lacks `alt`, `width`, or `height` (accessibility and
  layout-stability contract).

The build error names the file, field, and reason, so authoring feedback is
immediate. There is no runtime fallback for invalid content: the guarantee is
that anything deployed has already passed the schema.

---

## 4. Remark / rehype plugin roles

MDX compilation runs a **remark** stage (operating on the Markdown/MDX abstract
syntax tree) followed by a **rehype** stage (operating on the resulting HTML AST).
Each plugin has a single, named responsibility. The concrete plugin *packages*
are an implementation detail; their **roles** are fixed here:

| Stage | Role | Why (traced) |
| --- | --- | --- |
| remark | **GFM** — tables, task lists, strikethrough, autolinks. | Authors expect GitHub-flavored Markdown; consistency across content. |
| remark | **Frontmatter extraction** — separate YAML for validation (§3). | Feeds the build-time gate. |
| rehype | **Heading slugs + anchors** — stable `id`s and linkable anchors on headings. | Deep-linkable docs/articles; feeds the on-page table of contents (QAT-6, usability). |
| rehype | **Code syntax highlighting** — build-time tokenization of fenced code. | Highlighting at build time ships **zero** client highlighter JS (QAT-1). |
| rehype | **External-link handling** — detect off-site `href`s, add `rel="noopener noreferrer"` and an external marker. | Security and the `Link` external contract ([COMPONENT_CATALOG.md → Link](./COMPONENT_CATALOG.md)). |
| rehype | **Image optimization hooks** — rewrite `img` to the `next/image` wrapper, carrying `width`/`height`. | Layout stability and optimized formats (QAT-1; [DESIGN_SYSTEM.md → Images](../design/DESIGN_SYSTEM.md)). |

**Ordering matters.** Syntax highlighting runs before the component map wraps
`pre`/`code` so the map receives already-tokenized markup; external-link handling
runs before anchors are mapped to `Link` so the external flag is available to the
component. Highlighting and image handling are **build-time** transforms
specifically to avoid shipping client JavaScript for them (QAT-1).

Reduced-motion, focus, and contrast are **not** plugin concerns — they are
satisfied by the mapped components' accessibility contracts
([COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md);
[ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md)).

---

## 5. The MDX component map

MDX output is bound to catalog components through a **component map** so content
renders inside the design system rather than as raw browser-default HTML. This is
the render half of the mapping introduced in
[COMPONENT_CATALOG.md → MDX component map](./COMPONENT_CATALOG.md); the canonical
element→component table lives here:

| MDX / HTML element | Rendered by | Notes |
| --- | --- | --- |
| `h1`–`h4` | Heading styles / `PageHeader` for the page title | Slug anchors from rehype; single `<h1>` per page. |
| `p`, `strong`, `em` | Typographic primitives | Body type steps ([TYPOGRAPHY.md](../design/TYPOGRAPHY.md)). |
| `a` | [`Link`](./COMPONENT_CATALOG.md) | Internal = locale-aware; external = `rel` + marker. |
| `ul`, `ol`, `li` | List primitives | Spacing via `--space-*`; RTL-aware markers. |
| `blockquote` | Quote primitive | `--color-surface-muted`, accent rule. |
| `pre` / `code` | Code block primitive | Build-time highlighting; language label; keyboard-scrollable. |
| `img` | `next/image` wrapper | `width`/`height` required; AVIF/WebP. |
| `table`, `thead`, `td` … | Table primitives | Responsive, RTL-aware. |
| `hr` | [`Separator`](./COMPONENT_CATALOG.md) | Decorative. |
| Custom `<Callout>`, `<Note>` | [`Badge`](./COMPONENT_CATALOG.md)-styled admonition | Status in text, not color alone. |
| Custom demo components | Feature/Client leaf islands | Only these hydrate ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)). |

**Rule.** The map is the *only* sanctioned way for content to reach a visual
element. Authors do not hand-write styled markup in MDX; they write semantic
Markdown (and sanctioned custom components), and the map renders it in the design
system. Any component embedded in MDX that needs interactivity is a Client leaf;
the surrounding content stays server-rendered.

---

## 6. Rendering within Server Components

Rendering follows the server-first model
([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)):

1. A route Server Component requests an item from the content-access API (§7).
2. The API returns validated `frontmatter` and a **compiled MDX body**.
3. The page renders the body through the component map (§5) **on the server** —
   emitting HTML, shipping no highlighter or Markdown-runtime JavaScript to the
   browser.
4. Only **custom interactive embeds** (a playground demo, a gallery lightbox)
   are Client leaves and hydrate in isolation; the prose around them does not.
5. Pages are **statically generated** at build (content is build-time known),
   and streamed with Suspense/`loading` boundaries where a section benefits
   ([ARCHITECTURE §5.2](../engineering/ARCHITECTURE.md);
   [COMPONENT_CATALOG.md → Skeleton](./COMPONENT_CATALOG.md)).

This keeps the "bulk of the page is static HTML" property from the request
lifecycle in [ARCHITECTURE §9](../engineering/ARCHITECTURE.md).

---

## 7. Typed content-access API (shape)

The pipeline exposes a **typed access surface** consumed by Server Components.
This document defines its *shape*; its caching, memoization, and revalidation are
owned by [DATA_FETCHING.md](../engineering/DATA_FETCHING.md), and its return
types are the schema types from
[CONTENT_MODEL.md §6](./CONTENT_MODEL.md).

```ts
/** Illustrative surface. Caching/revalidation defined in DATA_FETCHING.md. */
interface ContentApi {
  /** All items of a type for a locale, ordered per CONTENT_MODEL.md §2.4. */
  list<T extends ContentType>(type: T, locale: Locale): Promise<ItemOf<T>[]>;

  /** One item by slug + locale; applies the §8 locale fallback. */
  get<T extends ContentType>(
    type: T, slug: string, locale: Locale,
  ): Promise<ItemOf<T> | null>;

  /** Slugs for a type — drives static path generation at build time. */
  slugs(type: ContentType): Promise<string[]>;

  /** Featured members of a collection (frontmatter.featured === true). */
  featured<T extends ContentType>(type: T, locale: Locale): Promise<ItemOf<T>[]>;
}
```

- The API returns the **same types** validated at build time, so a consuming
  page cannot receive an unexpected shape (QAT-3).
- `slugs()` feeds Next.js static path generation, keeping every content route
  statically generated ([ARCHITECTURE §5.2](../engineering/ARCHITECTURE.md)).
- Because validation already ran at build, the access API does not re-validate at
  request time; it reads compiled, trusted output.

---

## 8. Localization handling

The pipeline processes en/ar through **one path**, honoring QAT-5 and
[PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md):

- **Locale from filename.** The locale suffix (§2) sets each item's `locale`;
  the pre-suffix filename sets the shared `slug`
  ([CONTENT_MODEL.md §5](./CONTENT_MODEL.md)).
- **`list`/`get` are locale-scoped.** They return content in the requested
  locale; the two localized versions of an item share identity via slug so
  cross-links resolve within a locale.
- **Fallback.** When a requested locale's file is missing, the *fallback policy*
  (serve default locale vs. omit from listing) is defined in
  [DATA_FETCHING.md](../engineering/DATA_FETCHING.md); the pipeline's obligation
  is only to make the missing state explicit — never to emit empty or
  mixed-language output.
- **Direction.** Arabic renders RTL; the pipeline does not set direction itself
  (that is routing/layout per
  [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md)) but the
  mapped components are direction-aware so RTL content renders correctly
  ([COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md)).
- **Localized SEO.** Per-file `seo` frontmatter flows to the Metadata API so
  metadata is correct per locale (QAT-6).

---

## Engineering Decisions

- **ED-1 — Validation is a build gate, not runtime.** Failing the build on
  invalid content ([ARCHITECTURE §8](../engineering/ARCHITECTURE.md)) means
  production only ever serves schema-valid content; there is no runtime
  degradation path to reason about.
- **ED-2 — Schema-first validators generate the types.** One schema definition
  (per [CONTENT_MODEL.md](./CONTENT_MODEL.md)) serves both runtime validation and
  the compile-time type, eliminating drift between "what we check" and "what we
  type."
- **ED-3 — Highlighting and image transforms at build time.** Doing these in
  rehype at build ships zero client JavaScript for them, directly serving QAT-1;
  a runtime highlighter would violate the performance budget.
- **ED-4 — Locale suffix on filename.** Chosen over per-locale directory trees so
  an item's translations sit adjacent and a missing translation is visible in the
  directory listing ([CONTENT_MODEL.md §5](./CONTENT_MODEL.md)).
- **ED-5 — The component map is the only styling path for content.** Content
  never carries hardcoded styling; it maps to catalog components, keeping QAT-7
  and the design system authoritative.
- **ED-6 — Access API does not re-validate.** Since the build already validated,
  the request-time path reads trusted compiled output, keeping rendering fast.

## Best Practices

- **Write semantic Markdown**, not styled markup; trust the component map.
- **Keep interactive embeds small and leaf-level** so hydration stays minimal.
- **Fix validation errors at authoring time** — they are precise and
  file-scoped by design.
- **Let the build verify cross-links and required sections** rather than
  eyeballing them.
- **Author each locale file monolingually** and check the counterpart exists.

## Common Mistakes

- **Expecting invalid content to "just render."** It will not — the build fails
  by design.
- **Reaching for a runtime syntax highlighter**, re-introducing client JS the
  build-time plugin was chosen to avoid (QAT-1).
- **Hand-styling MDX** with raw HTML/classes instead of using the component map.
- **Marking a whole content page `"use client"`** because one embed is
  interactive — only the embed is a Client leaf
  ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)).
- **Locale-specific slugs**, breaking item identity and cross-locale linking
  ([CONTENT_MODEL.md §5](./CONTENT_MODEL.md)).
- **Images without `width`/`height`**, causing layout shift and a validation
  failure.

## Examples

**Illustrative render path in a route Server Component:**

```tsx
// app/[locale]/projects/[slug]/page.tsx — Server Component
export async function generateStaticParams() {
  // slugs() feeds static generation for every project route
  return (await content.slugs("projects")).map((slug) => ({ slug }));
}

export default async function ProjectPage(
  { params: { locale, slug } }: { params: { locale: Locale; slug: string } },
) {
  const project = await content.get("projects", slug, locale);
  if (!project) notFound();

  // Body was compiled + validated at build; rendered on the server via the map.
  return (
    <article>
      <PageHeader title={project.frontmatter.title} />
      <MDXContent code={project.body} components={mdxComponents} />
    </article>
  );
}
```

**Illustrative plugin pipeline configuration (roles, not packages):**

```ts
const mdxOptions = {
  remarkPlugins: [
    remarkGfm,               // tables, task lists, autolinks
    remarkFrontmatter,       // split YAML for build-time validation
  ],
  rehypePlugins: [
    rehypeSlug,              // heading ids
    rehypeAutolinkHeadings,  // anchor links on headings
    rehypeHighlight,         // build-time code highlighting (no client JS)
    rehypeExternalLinks,     // rel + external marker
    rehypeImageDimensions,   // hook img -> next/image with width/height
  ],
};
```

## Checklist

Before relying on the pipeline for a new content type or file:

- [ ] The file is under the correct `content/<type>/` directory.
- [ ] Filename encodes the locale suffix and yields the intended `slug`.
- [ ] Frontmatter passes schema validation
      ([CONTENT_MODEL.md](./CONTENT_MODEL.md)).
- [ ] Required body sections are present.
- [ ] Every element used has a mapping entry (§5) or a sanctioned custom
      component.
- [ ] Interactive embeds are Client leaves; the page stays a Server Component.
- [ ] Images carry `width`/`height`; code blocks highlight at build time.
- [ ] The localized counterpart exists or its fallback is intentional.

## Related Documents

- [Content Model](./CONTENT_MODEL.md) — schemas, slugs, relationships, the no-CMS
  strategy this pipeline enforces.
- [Component Catalog](./COMPONENT_CATALOG.md) — the components the map targets and
  their contracts.
- [Data Fetching](../engineering/DATA_FETCHING.md) — access API caching,
  revalidation, and locale fallback policy.
- [Architecture](../engineering/ARCHITECTURE.md) — §5 rendering, §8 content
  architecture.
- [Internationalization](../engineering/INTERNATIONALIZATION.md) — locale routing
  and direction.
- [Design System → Images](../design/DESIGN_SYSTEM.md),
  [Typography](../design/TYPOGRAPHY.md) — image and type rules the plugins honor.
