# Rendering Strategy

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the concrete rules behind the rendering and execution
model introduced in
[ARCHITECTURE.md §5](./ARCHITECTURE.md#5-rendering--execution-model) and locked
by [ADR-0006 — Rendering Strategy](../adr/ADR-0006-Rendering-Strategy.md). Where
[§5](./ARCHITECTURE.md#5-rendering--execution-model) states the *stance* —
server-first, static-biased, streaming where it helps — this document gives the
*operating rules*: when a component may be a Client Component, when a route may
be dynamic, where Suspense boundaries go, how route segment config is used, and
how `loading.tsx` / `error.tsx` / `not-found.tsx` behave.

Rendering is the single largest lever on performance (QAT-1) and SEO (QAT-6).
Every rule here exists to keep shipped JavaScript minimal and server-rendered
HTML maximal, in service of the product principle *performance over visual
effects* ([PRD](../product/PRODUCT_REQUIREMENTS.md)).

---

## Scope

**In scope.** Server vs Client Component decision rules; the exhaustive list of
valid reasons for `"use client"`; static vs dynamic rendering and when
revalidation/ISR is warranted; streaming and Suspense boundary placement; route
segment config conventions; `loading` / `error` / `not-found` conventions and
UX; techniques for keeping client islands small.

**Out of scope.**

- *How data gets into Server Components* — caching, revalidation mechanics, the
  content-access layer — owned by [DATA_FETCHING.md](./DATA_FETCHING.md). This
  document references the *rendering* consequences of those choices only.
- *Client-perceived state* — the Server→URL→Local→Global hierarchy — owned by
  [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md).
- *Where files physically live* — owned by
  [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md).
- *Performance budget numbers* — owned by [PERFORMANCE.md](./PERFORMANCE.md).
- *Metadata/SEO specifics* — owned by [SEO.md](./SEO.md).

---

## Goals

1. **Server by default, client by exception.** Make the Server Component the
   effortless default and the Client Component a deliberate, justified choice.
2. **Static by default.** Because content is known at build time, pages are
   statically generated unless a concrete need forces dynamic rendering.
3. **Small islands.** Keep `"use client"` boundaries at the leaves so hydration
   cost is proportional to genuine interactivity.
4. **Perceived speed.** Use streaming and Suspense to deliver above-the-fold
   content first; use `loading` states that reflect real layout.
5. **Predictable failure.** Every route segment has a defined loading, error,
   and not-found experience that is accessible and localized.

---

## Responsibilities

| This document owns | This document defers |
| --- | --- |
| Server vs Client decision rule and the `"use client"` checklist | Client-state hierarchy → [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| Static vs dynamic rendering; when ISR/revalidation is warranted (rendering view) | Caching/revalidation mechanics & data access → [DATA_FETCHING.md](./DATA_FETCHING.md) |
| Streaming and Suspense boundary placement | Performance budget targets → [PERFORMANCE.md](./PERFORMANCE.md) |
| Route segment config conventions | Metadata/structured data → [SEO.md](./SEO.md) |
| `loading` / `error` / `not-found` conventions and UX | File placement → [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) |

---

## Dependencies

| Source | Why it constrains this document |
| --- | --- |
| [ARCHITECTURE.md §5](./ARCHITECTURE.md#5-rendering--execution-model) | The server-first, static-biased, streaming stance this document operationalizes. |
| [ADR-0006 — Rendering Strategy](../adr/ADR-0006-Rendering-Strategy.md) | The locked rendering decision. |
| [ARCHITECTURE.md §2](./ARCHITECTURE.md#2-architectural-principles) | Principle 2 (server-first) and Principle 8 (simplicity). |
| [PRD → Non-Functional Requirements](../product/PRODUCT_REQUIREMENTS.md) | Lighthouse ≥ 95, minimal JavaScript, streaming, partial rendering. |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | `loading`/`error` UX must meet WCAG AA (QAT-2). |

---

## 1. Server vs Client Components

### 1.1 The default is Server

Per [ARCHITECTURE.md §5.1](./ARCHITECTURE.md#5-rendering--execution-model),
**a component is a Server Component unless it must run on the client.** Server
Components render to HTML on the server, ship *no component JavaScript* to the
browser, and can read content directly at render time
([DATA_FETCHING.md](./DATA_FETCHING.md)). This is the primary mechanism for
QAT-1 and QAT-6.

The default is not a preference to be weighed case by case; it is the starting
point for every component. You do not justify a Server Component — you justify a
Client Component.

### 1.2 The `"use client"` checklist — the only valid reasons

A component becomes a Client Component **only** if it needs at least one of the
following. If none apply, it stays a Server Component.

- [ ] **Interactive event handlers** — `onClick`, `onChange`, `onSubmit`, and
      the like that run in response to user input.
- [ ] **React state or lifecycle** — `useState`, `useReducer`, `useEffect`,
      `useRef` with effectful behavior, `useLayoutEffect`.
- [ ] **Browser-only APIs** — `window`, `document`, `localStorage`,
      `matchMedia`, `IntersectionObserver`, `navigator`, etc.
- [ ] **React Context consumption/provision** for client state (see
      [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)).
- [ ] **A stateful third-party widget** that itself requires the client (e.g. an
      animation or gallery library instance).
- [ ] **Custom hooks** that transitively depend on any of the above.

> If your only reason is "it's easier" or "to be safe," it is **not** a valid
> reason. Client-by-default is called out as a
> [Common Mistake in ARCHITECTURE.md](./ARCHITECTURE.md#common-mistakes) because
> it silently collapses the server-first model.

### 1.3 Composition rule — push the boundary to the leaves

Placing `"use client"` on a component makes that component **and its entire
import subtree** part of the client bundle. Therefore:

- Put `"use client"` on the **smallest** component that truly needs it — a
  toggle, a menu button, a filter control — not on a page, layout, or section.
- **Server Components may render Client Components**, but not the reverse by
  import. To place server-rendered content *inside* a client shell, pass it as
  `children` (or another prop), so it stays server-rendered:

  ```tsx
  // features/gallery/components/gallery-shell.tsx  ("use client" — needs state)
  "use client";
  export function GalleryShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return <div data-open={open}>{/* controls */}{children}</div>;
  }

  // features/gallery/components/gallery.tsx  (Server Component — default)
  import { GalleryShell } from "./gallery-shell";
  export function Gallery({ images }: { images: Image[] }) {
    return (
      <GalleryShell>
        {images.map((img) => (
          <ServerImage key={img.id} {...img} /> // stays server-rendered
        ))}
      </GalleryShell>
    );
  }
  ```

- A Client Component that receives server-rendered `children` does **not**
  re-render or bundle them; the boundary stays thin.

### 1.4 Illustrative topology

```text
app/[locale]/page.tsx                 (Server) reads content, composes layout
└─ HeroSection                        (Server) markup + tokens
   ├─ Prose / stats                   (Server)
   └─ ThemeToggle                     (Client) — state + localStorage + matchMedia
app/[locale]/projects/page.tsx        (Server) reads projects, reads searchParams
└─ ProjectGrid                        (Server) renders cards from server data
   └─ ProjectFilterBar                (Client) — writes filter to URL (see STATE_MANAGEMENT.md)
```

The page, layout, sections, and content are server-rendered; only the toggle and
the filter control hydrate.

---

## 2. Static vs Dynamic Rendering

### 2.1 Static by default

Content originates in the repository and is known at build time
([ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture)), so pages are
**statically generated** and regenerated on deploy. This is the strong default:
it maximizes edge-cacheable HTML on Vercel and directly serves QAT-1 and QAT-6.

- **Dynamic route params are enumerated at build time** with
  `generateStaticParams`, so each project/article/journey page is pre-rendered:

  ```tsx
  // app/[locale]/projects/[slug]/page.tsx
  import { locales } from "@/shared/config/i18n";
  import { getProjectSlugs } from "@/features/projects";

  export async function generateStaticParams() {
    const slugs = await getProjectSlugs();
    return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  }
  ```

### 2.2 When dynamic rendering is warranted

A route renders dynamically **only** when it genuinely depends on per-request
information. For this project the legitimate triggers are narrow:

- Reading **request-time input** that cannot be enumerated at build — e.g. an
  unbounded `searchParams` space (search results). Reading `searchParams`,
  `cookies()`, or `headers()` opts a route into dynamic rendering.
- The **contact server action** response path — a POST is inherently dynamic
  (see [§6](#6-forms-and-server-actions) and
  [DATA_FETCHING.md](./DATA_FETCHING.md)).

Note that **URL params that are enumerable** (locale, project slug, a fixed set
of filters expressed as routes) do **not** force dynamic rendering — they are
handled by static generation in [§2.1](#21-static-by-default). Prefer expressing
bounded state as enumerable params over unbounded `searchParams` when it keeps a
page static.

### 2.3 When revalidation (ISR) is warranted

Because the content source is the repository and a content change *is* a
deploy, **incremental revalidation is not needed by default** — a rebuild
already regenerates the affected pages. ISR/`revalidate` is reserved for a
future case where content can change *without* a deploy (e.g. a Version 3 CMS —
out of scope for V1 per
[ARCHITECTURE.md §3.2](./ARCHITECTURE.md#32-non-goals-out-of-scope)). The
mechanics of `revalidate`, cache tags, and on-demand revalidation are owned by
[DATA_FETCHING.md](./DATA_FETCHING.md); the *rendering* rule is simply: **do not
reach for ISR while content is deploy-time.**

---

## 3. Route Segment Config

Route segment config options are declared as exports at the top of a `page.tsx`
or `layout.tsx`. Conventions:

- **Prefer the defaults; be explicit only with a reason.** Static generation is
  already the default; adding `export const dynamic = "force-static"` is
  redundant noise unless it documents intent at a boundary that would otherwise
  be dynamic.
- **Never `force-dynamic` to paper over a caching problem.** If a page is
  accidentally dynamic, find the request-time API that caused it
  ([§2.2](#22-when-dynamic-rendering-is-warranted)) rather than forcing a mode.
- **`dynamicParams`.** With `generateStaticParams`, keep unknown params
  returning 404 (`export const dynamicParams = false`) for closed sets such as
  project slugs, so an unknown slug is a genuine not-found rather than an
  on-demand render.
- **Colocate config with the route it governs.** Segment config lives in the
  route file ([FOLDER_STRUCTURE.md §2.2](./FOLDER_STRUCTURE.md#22-conventions)),
  never in a shared module.

```tsx
// app/[locale]/projects/[slug]/page.tsx — closed set of slugs
export const dynamicParams = false;     // unknown slug → not-found
// (no `dynamic` export: static generation is the default and intended)
```

Caching-related config (`revalidate`, `fetchCache`) is documented in
[DATA_FETCHING.md](./DATA_FETCHING.md) to avoid duplicating the caching model
here.

---

## 4. Streaming and Suspense

### 4.1 Why stream

Streaming lets the server flush above-the-fold HTML immediately and resolve
slower or deferred subtrees within `<Suspense>` boundaries, improving perceived
performance and TTFB without shipping more client JavaScript. It is called for
in the [PRD → Non-Functional Requirements](../product/PRODUCT_REQUIREMENTS.md)
("Streaming", "Partial Rendering").

For a statically generated page there is little to stream — the HTML is already
complete. Streaming earns its keep on pages with a genuinely **slower or
independently-resolving** subtree.

### 4.2 Where to place Suspense boundaries

- **Wrap the slow part, not the page.** A boundary should surround the subtree
  whose data resolves later (e.g. a below-the-fold "related projects" strip),
  letting the fast shell paint first.
- **Segment-level loading is a Suspense boundary.** A `loading.tsx` implicitly
  wraps the segment's `page.tsx` in Suspense
  ([§5.1](#51-loadingtsx)); use it for whole-segment loading and use inline
  `<Suspense>` for within-page partial loading.
- **Give every boundary a fallback that matches final layout.** The fallback
  should occupy the same space and shape as the resolved content to avoid layout
  shift (protects CLS, QAT-1).
- **Do not over-fragment.** Each boundary has a cost in complexity and in
  fallback design. Add one where it measurably improves perceived load, not
  reflexively around every component (Principle 8, simplicity).

```tsx
// app/[locale]/projects/[slug]/page.tsx
import { Suspense } from "react";
import { ProjectDetail, RelatedProjects } from "@/features/projects";
import { RelatedProjectsSkeleton } from "@/features/projects";

export default async function ProjectPage({ params }) {
  const project = await getProjectBySlug(params.slug); // fast, static
  return (
    <article>
      <ProjectDetail project={project} />               {/* paints immediately */}
      <Suspense fallback={<RelatedProjectsSkeleton />}>
        <RelatedProjects slug={params.slug} />          {/* resolves independently */}
      </Suspense>
    </article>
  );
}
```

---

## 5. `loading`, `error`, and `not-found`

Route-level UX files are part of the rendering model
([ARCHITECTURE.md §5.2](./ARCHITECTURE.md#52-static-bias-streaming-and-boundaries)).
Their placement is fixed by
[FOLDER_STRUCTURE.md §2](./FOLDER_STRUCTURE.md#2-the-routing-layer--app); their
behavior and UX are fixed here.

### 5.1 `loading.tsx`

- **Purpose.** Instant loading UI for a segment while its `page.tsx` (and any
  awaited server work) resolves; implemented as an automatic Suspense boundary
  around the segment.
- **UX.** Prefer **skeletons that mirror the real layout** over spinners, to
  preserve perceived stability and minimize layout shift. Reserve space for
  images with known dimensions ([DESIGN_SYSTEM.md → Images](../design/DESIGN_SYSTEM.md)).
- **Accessibility.** Communicate busy state to assistive tech (e.g.
  `aria-busy`/`role="status"` on the region) and respect reduced-motion for any
  shimmer ([ACCESSIBILITY.md](./ACCESSIBILITY.md)).
- **Scope.** Because most pages are static, add `loading.tsx` where a segment
  has real awaited work or a streamed subtree — not to every segment by rote.

### 5.2 `error.tsx`

- **Client Component, always.** `error.tsx` must be a Client Component
  (`"use client"`) because it receives an `error` object and a `reset()`
  function and manages recovery — one of the valid `"use client"` reasons in
  [§1.2](#12-the-use-client-checklist--the-only-valid-reasons).
- **UX.** Show a calm, on-brand message (not a stack trace), offer `reset()` to
  retry, and provide a path home. Never expose raw error internals to visitors.
- **Granularity.** Place `error.tsx` at the segment whose failure it should
  contain. An error boundary catches errors in its segment and below, so a
  detail-page boundary keeps a single failed project from taking down the whole
  section.
- **Global fallback.** A root-level `global-error.tsx` covers failures in the
  root layout itself; keep it minimal and self-contained.
- **Localized.** Error copy is localized like all UI
  ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)).

### 5.3 `not-found.tsx`

- **Purpose.** Renders when `notFound()` is called (e.g. an unknown project
  slug) or a route does not match; maps to the `/404` in the
  [PRD Information Architecture](../product/PRODUCT_REQUIREMENTS.md).
- **Usage.** Content-access functions signal a genuine miss by calling
  `notFound()` (see [DATA_FETCHING.md](./DATA_FETCHING.md) for the
  error/empty posture); the segment's `not-found.tsx` renders the UI.
- **UX.** Localized, helpful, and navigational — offer links back to key
  sections rather than a dead end. Ensure the correct `404` status is emitted
  for SEO ([SEO.md](./SEO.md)).

---

## 6. Forms and Server Actions

The one interactive write path in V1 is the contact form
([PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)). From the *rendering*
perspective:

- The form **shell** can be server-rendered; only the interactive input control
  needs `"use client"` for validation feedback and pending UI.
- Submission uses a **server action** (a POST handled on the server), which is
  the single outbound side effect in the system
  ([ARCHITECTURE.md §9](./ARCHITECTURE.md#9-data-flow--request-lifecycle)). The
  action's data flow, validation, and security posture are owned by
  [DATA_FETCHING.md](./DATA_FETCHING.md) and
  [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) (forms posture); this document
  only notes that the action does not turn the *page* dynamic — the static form
  page coexists with a dynamic action endpoint.

---

## 7. Keeping Client Islands Small

Concrete techniques that follow from [§1.3](#13-composition-rule--push-the-boundary-to-the-leaves):

- **Extract the interactive leaf.** When a mostly-static section needs one
  interactive control, split the control into its own `"use client"` component
  rather than marking the section.
- **Pass server content as `children`.** Keep server-rendered subtrees out of
  the client bundle by threading them through client shells as props.
- **Keep data-shaping on the server.** Do the mapping/sorting/formatting in a
  Server Component or feature `lib/` and pass finished, minimal props to the
  island — don't ship raw data plus transformation code to the client.
- **Avoid client Context for server-derivable data.** If a value is known on the
  server (locale, content), pass it as a prop; do not lift it into a client
  provider (see [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)).
- **Lazy-load heavy client widgets.** Defer non-critical client components (a
  large animation or code-playground) with dynamic import so they do not weigh
  on initial load; the animation library itself is a deferred decision
  ([ARCHITECTURE.md §4.2](./ARCHITECTURE.md#42-deliberately-deferred)).

---

## Engineering Decisions

Decisions fixed at v1.0.0, consistent with
[ADR-0006](../adr/ADR-0006-Rendering-Strategy.md) and
[ARCHITECTURE.md §5](./ARCHITECTURE.md#5-rendering--execution-model):

1. **Justify the client, never the server.** The Server Component is the
   unquestioned default; only the [§1.2](#12-the-use-client-checklist--the-only-valid-reasons)
   checklist justifies `"use client"`.
2. **Static by default; dynamic only on real request-time input.** Enumerable
   params are statically generated; `searchParams`/`cookies`/`headers` are the
   only routine dynamic triggers ([§2](#2-static-vs-dynamic-rendering)).
3. **No ISR while content is deploy-time.** Revalidation is reserved for a
   future non-deploy content source; a rebuild is the V1 revalidation mechanism
   ([§2.3](#23-when-revalidation-isr-is-warranted)).
4. **`dynamicParams = false` for closed sets.** An unknown slug is a
   not-found, not an on-demand render ([§3](#3-route-segment-config)).
5. **Stream the slow subtree, not the page.** Suspense boundaries wrap
   independently-resolving parts, with layout-matching fallbacks
   ([§4](#4-streaming-and-suspense)).
6. **Skeletons over spinners.** Loading UI mirrors final layout to protect CLS
   and perceived stability ([§5.1](#51-loadingtsx)).
7. **Segment-scoped error boundaries.** Failures are contained at the smallest
   sensible segment, with localized, recoverable UX
   ([§5.2](#52-errortsx)).

---

## Best Practices

- **Write the Server Component first.** Add `"use client"` only when the
  checklist forces it, at the leaf.
- **Read the checklist honestly.** "Convenience" and "safety" are not on it.
- **Enumerate params at build time.** Reach for `generateStaticParams` before
  considering any dynamic mode.
- **Let fallbacks mirror reality.** A loading skeleton should be indistinguishable
  in shape from the resolved content.
- **Contain failure.** Put `error.tsx` where a failure should stop — not only at
  the root.
- **Measure before fragmenting.** Add a Suspense boundary because it improves a
  measured load, not by habit.

---

## Common Mistakes

- **`"use client"` on a page or layout** — the highest-impact anti-pattern;
  pulls the whole subtree into the client bundle. Fix: move the directive to the
  interactive leaf ([§1.3](#13-composition-rule--push-the-boundary-to-the-leaves)).
- **`force-dynamic` to "fix" a bug** — masks an accidental request-time
  dependency. Fix: locate and remove the dynamic API, or make the param
  enumerable ([§2.2](#22-when-dynamic-rendering-is-warranted)).
- **Reaching for ISR with deploy-time content** — adds cache complexity for no
  benefit in V1 ([§2.3](#23-when-revalidation-isr-is-warranted)).
- **Spinner-only loading** — causes layout shift and a worse perceived load than
  a layout-matched skeleton ([§5.1](#51-loadingtsx)).
- **A single root error boundary** — one failure blanks the whole app. Fix:
  segment-scoped boundaries ([§5.2](#52-errortsx)).
- **Shipping raw data to an island** — sending unshaped data plus transformation
  code to the client. Fix: shape on the server, pass minimal props
  ([§7](#7-keeping-client-islands-small)).

---

## Examples

**A landing page with one interactive control.** The hero, philosophy,
technologies, and CTA sections ([PRD → FR-003](../product/PRODUCT_REQUIREMENTS.md))
are all Server Components. The only client island is the theme toggle in the
header — a leaf marked `"use client"` because it uses state, `localStorage`, and
`matchMedia`. The rest of the page ships zero component JavaScript.

**A search page (dynamic by necessity).** Search
([PRD → FR-012](../product/PRODUCT_REQUIREMENTS.md), Version 2) reads an
unbounded query from `searchParams`, so the results route renders dynamically
([§2.2](#22-when-dynamic-rendering-is-warranted)). The query lives in the URL,
not a client store ([STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)); results are
fetched on the server; only the input box is a client island. Results below the
fold sit in a `<Suspense>` boundary with a skeleton fallback.

**An unknown project slug.** `getProjectBySlug` finds nothing and calls
`notFound()`; with `dynamicParams = false` the unknown slug never triggers an
on-demand render, and the localized `not-found.tsx` renders with a correct 404
status.

---

## Checklist

Before merging any component or route:

- [ ] Is this a Server Component, with `"use client"` added only per the
      [§1.2 checklist](#12-the-use-client-checklist--the-only-valid-reasons)?
- [ ] Is the `"use client"` boundary at the leaf, with server content passed as
      `children` where possible?
- [ ] Is the route statically generated, with params enumerated via
      `generateStaticParams`?
- [ ] If dynamic, is it because of genuine request-time input — not a forced
      mode?
- [ ] Are Suspense boundaries around genuinely slow subtrees, with
      layout-matching fallbacks?
- [ ] Does the segment have appropriate `loading` / `error` / `not-found` UX
      that is accessible and localized?
- [ ] Is loading UI a skeleton that mirrors final layout (not a bare spinner)?
- [ ] Is data shaped on the server so islands receive minimal props?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — §5 (rendering & execution model): the
  frame this document details.
- [ADR-0006 — Rendering Strategy](../adr/ADR-0006-Rendering-Strategy.md) — the
  locked rendering decision.
- [DATA_FETCHING.md](./DATA_FETCHING.md) — how Server Components read content;
  caching and revalidation mechanics; the contact server action.
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) — client-state hierarchy; where
  islands hold state; forms posture.
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — placement of route special
  files and client islands.
- [PERFORMANCE.md](./PERFORMANCE.md) — the performance budget these rules serve.
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — accessibility requirements for
  loading/error UX.
- [SEO.md](./SEO.md) — metadata and correct status codes for `not-found`.
