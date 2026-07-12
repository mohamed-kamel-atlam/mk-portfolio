# Data Fetching

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines how data gets *into* Server Components: the typed
content-access layer that reads local MDX and structured content, the caching
and revalidation model, the deliberate absence of a client-side data-fetching
library, the single outbound side effect (the contact server action), and the
error/empty-handling posture. It realizes the content and data-flow subsystems
of [ARCHITECTURE.md §8–§9](./ARCHITECTURE.md#8-content-architecture).

Data access is server-side and static by default because content is known at
build time ([ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture)) —
the foundation of QAT-1 (performance) and QAT-6 (SEO), and the reason the client
carries almost no data machinery.

---

## Scope

**In scope.** The content-access layer and how features consume it; server-side
reading of MDX and structured content; the caching and revalidation model
(static by default; when to revalidate); the no-client-data-library position;
the contact server action as the one outbound side effect; error/empty handling
posture.

**Out of scope.**

- *Content schemas* (frontmatter shapes, validation rules) — owned by
  [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md). **Not duplicated here.**
- *MDX parsing/compilation pipeline* (plugins, component mapping, rendering) —
  owned by [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md). **Not duplicated
  here.**
- *Server vs Client / static vs dynamic rendering* rules — owned by
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md).
- *Client-perceived state* (including where the contact form holds field state)
  — owned by [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md).
- *Where the access code physically lives* — owned by
  [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md).
- *Contact security specifics* (CSP, spam, sanitization) — introduced with the
  contact milestone; see [ARCHITECTURE.md §10](./ARCHITECTURE.md#10-cross-cutting-concerns).

---

## Goals

1. **Server-only reads.** Content is read in Server Components through a typed
   access layer; the browser never fetches content.
2. **Static by default.** Reads resolve at build time; a rebuild is the
   revalidation mechanism while content is deploy-time.
3. **Typed at the boundary.** Every read returns a validated, typed value;
   invalid content fails the build, not the visitor.
4. **No client data library.** No client-side data-fetching/caching library is
   adopted by default, consistent with the state hierarchy.
5. **One controlled side effect.** The contact server action is the only
   outbound write, with explicit error/empty handling.

---

## Responsibilities

| This document owns | This document defers |
| --- | --- |
| The content-access layer contract & how features use it | Content schemas → [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) |
| Caching & revalidation model (static-by-default; when to revalidate) | MDX parsing/rendering pipeline → [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md) |
| No-client-data-library position | Static vs dynamic rendering rules → [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |
| The contact server action as the one side effect | Form field state → [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| Error/empty handling posture (data view) | Access-code placement → [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) |

---

## Dependencies

| Source | Why it constrains this document |
| --- | --- |
| [ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture) | Content is typed, validated, in-repo data; validated at build time. |
| [ARCHITECTURE.md §9](./ARCHITECTURE.md#9-data-flow--request-lifecycle) | The request lifecycle: content load → server render; contact is the one side effect. |
| [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) | Authoritative content schemas the access layer returns. |
| [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md) | Authoritative MDX parse/render pipeline the access layer invokes. |
| [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) | Static-bias and dynamic-trigger rules that govern how reads render. |

---

## 1. The Content-Access Layer

All content reads go through a **typed content-access layer** — a set of
functions that locate content, invoke the MDX pipeline, validate against the
schema, and return typed values. Server Components and feature `lib/` call these
functions; nothing reads the filesystem or parses MDX ad hoc.

```text
Server Component / feature lib
        │ calls
        ▼
Content-access layer   ── reads ──▶  content/<type>/*.mdx + structured data
   (typed functions)   ── invokes ─▶  MDX pipeline  (MDX_PIPELINE.md)
                        ── validates ▶ schema        (CONTENT_MODEL.md)
        │ returns typed, validated value
        ▼
Server render (HTML)   (RENDERING_STRATEGY.md)
```

### 1.1 The contract

The access layer exposes small, typed, purpose-named functions per content type.
It returns the types defined by [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)
(referenced, not redefined here):

```ts
// features/projects/lib/get-projects.ts  (server-only)
import { getAllContent, getContentBySlug } from "@/content/access";
import type { Project } from "@/features/projects";

export async function getProjects(filter?: ProjectFilter): Promise<Project[]> {
  const all = await getAllContent<Project>("projects");   // typed, validated
  return applyFilter(all, filter);                        // shape on the server
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const project = await getContentBySlug<Project>("projects", slug);
  if (!project) notFound();                               // §5 error/empty posture
  return project;
}
```

- **Server-only.** These modules run only on the server. Mark them accordingly
  (e.g. a server-only guard) so a client import fails at build rather than
  leaking content-access code into a bundle.
- **Typed boundary.** The generic (`<Project>`) ties the return to the schema in
  [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md). Validation lives in the
  pipeline/schema; a validation failure fails the **build**
  ([ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture)), never the
  visitor.
- **Feature-owned wrappers.** Features expose their own thin readers
  (`getProjects`, `getProjectBySlug`) through their public surface
  ([FOLDER_STRUCTURE.md §3.2](./FOLDER_STRUCTURE.md#32-the-public-surface-barrel-pattern)),
  delegating to the shared `content/access` layer. Routes call the feature
  reader, not the raw access layer.

### 1.2 What the access layer does *not* do

- It does **not** define schemas — see
  [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md).
- It does **not** implement MDX parsing/compilation — it *invokes*
  [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md).
- It does **not** run on the client.

---

## 2. Reading in Server Components

The consuming pattern is a direct, awaited call inside a Server Component. There
is no fetch client, no loader indirection, no client hydration of data.

```tsx
// app/[locale]/projects/[slug]/page.tsx  (Server Component)
import { getProjectBySlug } from "@/features/projects";
import { ProjectDetail } from "@/features/projects";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug); // server read, static
  return <ProjectDetail project={project} />;
}
```

- **Static params are enumerated** with `generateStaticParams` so every page is
  pre-rendered — the mechanics belong to
  [RENDERING_STRATEGY.md §2.1](./RENDERING_STRATEGY.md#21-static-by-default).
- **Shape data on the server**, passing finished props to any client island
  ([STATE_MANAGEMENT.md §3](./STATE_MANAGEMENT.md#3-server-state-level-1)).
- **Compose reads** at the page level; do not thread a data client through the
  tree.

---

## 3. Caching and Revalidation Model

### 3.1 Static by default

Because content is committed to the repository and known at build time, reads
are resolved during the build and the resulting pages are **statically
generated** and edge-cached on Vercel. This is the default and covers the entire
V1 content surface. No explicit caching directives are required for the common
case — the static build *is* the cache.

### 3.2 A rebuild is the revalidation mechanism

A content change is a commit, and a commit triggers a deploy that regenerates
the affected pages. Therefore, **while content is deploy-time, no incremental
revalidation (ISR) is used.** Reaching for `revalidate` here would add cache
complexity with no benefit, contrary to
[ARCHITECTURE.md Principle 8 (simplicity)](./ARCHITECTURE.md#2-architectural-principles).

### 3.3 When revalidation *would* be warranted

Time- or event-based revalidation becomes appropriate only if content can change
**without a deploy** — for example a future Version 3 CMS
([ARCHITECTURE.md §3.2 non-goals](./ARCHITECTURE.md#32-non-goals-out-of-scope)).
At that point:

- Choose **time-based** `revalidate` for content with a tolerable staleness
  window, or **on-demand** revalidation (path/tag) for precise invalidation on a
  content event.
- Record the change as it alters the rendering/caching model; align with
  [RENDERING_STRATEGY.md §2.3](./RENDERING_STRATEGY.md#23-when-revalidation-isr-is-warranted),
  which holds the rendering view of the same rule.

Until then, the rule is simple: **static build; rebuild to revalidate.**

### 3.4 Request-time reads

The narrow cases that read request-time input — an unbounded search query in
`searchParams`, or the contact action's POST — render dynamically per
[RENDERING_STRATEGY.md §2.2](./RENDERING_STRATEGY.md#22-when-dynamic-rendering-is-warranted).
Search still reads the same content-access layer; it is the *route* that is
dynamic, not a different data source.

---

## 4. No Client-Side Data-Fetching Library

**No client-side data-fetching or caching library is adopted by default** — no
React Query, no SWR, no RTK Query. This is the data-layer corollary of the state
hierarchy ([STATE_MANAGEMENT.md §6](./STATE_MANAGEMENT.md#6-global-state-and-the-no-library-position)):

- Content is **server state**; it is read on the server and passed as props, so
  there is nothing for a client cache to manage.
- Filters and search are **URL state**; changing them re-runs a *server* read,
  not a client fetch
  ([STATE_MANAGEMENT.md §8](./STATE_MANAGEMENT.md#8-composing-server-data-with-url-state--no-client-store)).
- The RTK Query mention in [PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md) is
  **illustrative content** for the public Engineering Decisions page, not a stack
  decision ([ARCHITECTURE.md §4.2](./ARCHITECTURE.md#42-deliberately-deferred)).

A client data library would only be justified if a genuine client-side,
frequently-refetching data need emerged that could not be served on the server
or through the URL — which V1 does not have. Such a change would follow the same
bar as adopting global state
([STATE_MANAGEMENT.md §6.4](./STATE_MANAGEMENT.md#64-criteria-that-would-justify-a-library)):
written justification and, because it alters the architecture, an ADR.

---

## 5. The One Outbound Side Effect — Contact Server Action

The contact form ([PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)) is the
system's **only** side-effecting integration
([ARCHITECTURE.md §9](./ARCHITECTURE.md#9-data-flow--request-lifecycle)),
introduced in a later milestone. From the data perspective:

- **It is a write via a server action** — a server-side POST handler — not a
  read through the content-access layer. It sends a message to the contact
  recipient; it does not read repository content.
- **Server-side validation is mandatory** before any transmission
  ([PRD → Security](../product/PRODUCT_REQUIREMENTS.md)). Validate and sanitize
  input on the server regardless of any client-side hints.
- **Returns a typed result** — success or a structured error/validation result —
  which the client renders. The result is server-owned; the client does not
  cache it ([STATE_MANAGEMENT.md §7](./STATE_MANAGEMENT.md#7-forms-and-server-actions-state-posture)).
- **Security posture** (CSP, spam protection, input sanitization) is documented
  with the contact milestone, not speculatively
  ([ARCHITECTURE.md §10](./ARCHITECTURE.md#10-cross-cutting-concerns)).

```ts
// features/contact/lib/send-message.ts  (server action)
"use server";
import { contactSchema } from "@/features/contact"; // validation schema

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "invalid", errors: parsed.error.flatten().fieldErrors }; // §6
  }
  try {
    await deliver(parsed.data);                       // the single outbound effect
    return { status: "sent" };
  } catch {
    return { status: "error" };                       // graceful failure — §6
  }
}
```

---

## 6. Error and Empty Handling Posture

Because the content surface is static and validated at build time, the runtime
failure surface is minimal. The posture:

- **Genuine not-found → `notFound()`.** When a read for a specific item finds
  nothing (unknown slug), the reader calls `notFound()`, which renders the
  segment's localized `not-found.tsx`
  ([RENDERING_STRATEGY.md §5.3](./RENDERING_STRATEGY.md#53-not-foundtsx)). Do not
  return `null` and render a blank page.
- **Empty collections are a valid state, not an error.** A list read that
  returns `[]` (e.g. no articles yet) renders a designed empty state, not an
  error boundary. Every list surface must have an empty state.
- **Malformed content fails the build.** Schema validation
  ([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)) rejects invalid content at
  build time; broken content never reaches a visitor
  ([ARCHITECTURE.md §8](./ARCHITECTURE.md#8-content-architecture)).
- **Unexpected runtime failures → `error.tsx`.** Any unexpected throw during a
  read is caught by the nearest segment error boundary
  ([RENDERING_STRATEGY.md §5.2](./RENDERING_STRATEGY.md#52-errortsx)) with
  recoverable, localized UX.
- **The contact action fails gracefully.** Validation rejection and transmission
  failure return structured states the form renders as inline messaging — never
  an unhandled throw ([§5](#5-the-one-outbound-side-effect--contact-server-action)).

---

## Engineering Decisions

Decisions fixed at v1.0.0, consistent with
[ARCHITECTURE.md §8–§9](./ARCHITECTURE.md#8-content-architecture):

1. **All reads go through a typed, server-only content-access layer.** No ad hoc
   filesystem reads or MDX parsing in components ([§1](#1-the-content-access-layer)).
2. **Features wrap the access layer** and expose readers via their public
   surface; routes call the feature reader ([§1.1](#11-the-contract)).
3. **Static by default; rebuild to revalidate.** No ISR while content is
   deploy-time ([§3](#3-caching-and-revalidation-model)).
4. **No client-side data-fetching library by default.** Content is server state;
   filters/search are URL state ([§4](#4-no-client-side-data-fetching-library)).
5. **The contact server action is the single outbound side effect**, with
   mandatory server-side validation and a server-owned typed result
   ([§5](#5-the-one-outbound-side-effect--contact-server-action)).
6. **Not-found is `notFound()`, empty is a designed state, malformed fails the
   build.** ([§6](#6-error-and-empty-handling-posture)).

---

## Best Practices

- **Read on the server, pass props down.** Never fetch content from the browser.
- **Call the feature reader from a route**, not the raw access layer or the
  filesystem.
- **Shape data server-side** so client islands receive minimal, finished props.
- **Let the build validate content.** Trust schema validation; do not
  defensively re-check shapes at render.
- **Design the empty state** for every list surface.
- **Keep the contact action strict.** Validate and sanitize server-side; return
  structured results.

---

## Common Mistakes

- **Client-side content fetching** — pulling content over the network in the
  browser, shipping data machinery, and hurting QAT-1. Fix: read on the server.
- **Ad hoc reads in components** — parsing MDX or reading files outside the
  access layer, bypassing typing and validation. Fix: use the access layer
  ([§1](#1-the-content-access-layer)).
- **Reaching for ISR with deploy-time content** — cache complexity for no
  benefit ([§3.2](#32-a-rebuild-is-the-revalidation-mechanism)).
- **Adopting a client data library** because FR-007 names RTK Query — that is
  illustrative content, not a decision ([§4](#4-no-client-side-data-fetching-library)).
- **Duplicating schemas here** — schemas live in
  [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md); copying them invites drift.
- **Rendering blank on a miss** — return `notFound()` instead of `null`
  ([§6](#6-error-and-empty-handling-posture)).
- **Trusting client-side validation for contact** — always validate on the
  server ([§5](#5-the-one-outbound-side-effect--contact-server-action)).

---

## Examples

**Project index and detail.** The index route calls `getProjects()`; the detail
route calls `getProjectBySlug(slug)` with params enumerated by
`generateStaticParams`. Both resolve at build time to static HTML. An unknown
slug triggers `notFound()`; an empty catalog renders a designed empty state.

**Filtered projects (Version 2).** The filter control writes `?tag=react` to the
URL; the Server Component reads `searchParams` and calls
`getProjects({ tag })` — the *same* server access layer, re-run on navigation.
No client fetch, no client cache
([STATE_MANAGEMENT.md §8](./STATE_MANAGEMENT.md#8-composing-server-data-with-url-state--no-client-store)).

**Contact submission.** The form posts to the `sendMessage` server action; the
action validates server-side, delivers the message (the one outbound effect), and
returns `sent`, `invalid` (with field errors), or `error`. The form renders the
result inline; nothing is cached client-side.

---

## Checklist

Before merging any data-reading or write path:

- [ ] Is the read on the server, through the typed content-access layer?
- [ ] Does the route call a feature reader rather than the filesystem or raw
      access layer?
- [ ] Is the page statically generated (params enumerated), with no unnecessary
      dynamic trigger?
- [ ] Have you avoided introducing a client-side data-fetching library?
- [ ] Is data shaped on the server so islands get minimal props?
- [ ] Does a miss call `notFound()`, and does every list have a designed empty
      state?
- [ ] For the contact action: is validation server-side, the result typed and
      server-owned, and failure handled gracefully?
- [ ] Are schemas referenced from [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)
      rather than duplicated?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — §8 (content architecture), §9 (request
  lifecycle): the frame this document details.
- [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) — authoritative content
  schemas the access layer returns.
- [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md) — authoritative MDX
  parse/render pipeline the access layer invokes.
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — static vs dynamic rendering;
  `not-found`/`error` UX; the contact form's rendering split.
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) — content as server state; URL
  state composition; contact form field-state posture.
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — where the access layer and
  feature readers live.
- [PERFORMANCE.md](./PERFORMANCE.md) — the budget the static-by-default model
  serves.
