# Technical Architecture Overview

**Version:** 1.2.0
**Status:** In Review
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document is the single, authoritative, high-level mental model of the
system. It exists so that every engineer and every AI-assisted contribution
reasons about the codebase from the same picture, using the same vocabulary,
and against the same set of locked architectural decisions.

It is the **root of the engineering documentation graph**. Every other
engineering document (folder structure, rendering strategy, state management,
internationalization, theming) refines a subsystem introduced here. When those
documents and this one disagree, this document defines the *frame* and they
define the *detail*; a genuine conflict is a defect to be reconciled, not a
choice to be made ad hoc.

---

## Scope

**In scope.** The overall system model: architectural goals, principles, system
boundaries, the technology stack, the rendering and execution model, the
application structure, the state model, the content architecture, the request
data flow, cross-cutting concerns, and the deployment environment — each at
*overview altitude*.

**Out of scope.** Concrete implementation detail. This document deliberately
does **not** specify the exact folder tree, per-route rendering rules, design
token values, or i18n routing mechanics. Each of those belongs to a dedicated
document (see [Dependencies](#dependencies) and
[Key Architectural Decisions](#key-architectural-decisions)). This document
names each subsystem and forward-references the document that details it. This
is a direct application of the repository rule *prefer referencing existing
documents over repeating them*.

---

## Dependencies

This document is derived from — and must never contradict — the following
sources of truth. Requirements are traced back to these; none are invented
here.

| Source | Role in this document |
| --- | --- |
| [Project Vision](../product/PROJECT_VISION.md) | Product intent, core principles, long-term goal. |
| [Product Requirements](../product/PRODUCT_REQUIREMENTS.md) | Functional and non-functional requirements, scope, phasing. |
| [Brand Identity](../product/BRAND.md) | Positioning, voice, visual and motion direction. |
| [Design Principles](../design/DESIGN_PRINCIPLES.md) | The philosophy behind every UI decision. |
| [Design Language](../design/DESIGN_LANGUAGE.md) | Layout, typography, color, motion, interaction philosophy. |
| [Design System](../design/DESIGN_SYSTEM.md) | Token categories, component standards, iconography, imagery. |

The following companion documents refine the subsystems introduced here. They
form the documentation foundation authored alongside this document: each is the
authoritative source for its subsystem's *detail*, while this document remains
the *frame*. Grouped by their location in the `docs/` tree:

**Engineering** (`docs/engineering/`)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — folder & feature architecture
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — rendering & execution rules
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) — the state hierarchy in practice
- [DATA_FETCHING.md](./DATA_FETCHING.md) — data access & caching
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — i18n & routing
- [PERFORMANCE.md](./PERFORMANCE.md) — performance budget & strategy
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — accessibility standards
- [SEO.md](./SEO.md) — SEO & metadata
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — engineering workflow
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — AI-assisted development methodology
- [CLAUDE.md](./CLAUDE.md) — AI repository context

**Design** (`docs/design/`)
- [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md),
  [TYPOGRAPHY.md](../design/TYPOGRAPHY.md), [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md),
  [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md)

**Developer** (`docs/developer/`)
- [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md), [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md),
  [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md), [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md)

**Decisions** (`docs/adr/`)
- [adr/README.md](../adr/README.md) — Architecture Decision Records (index + records)

---

## Table of Contents

1. [Architectural Goals & Quality Attributes](#1-architectural-goals--quality-attributes)
2. [Architectural Principles](#2-architectural-principles)
3. [System Context & Boundaries](#3-system-context--boundaries)
4. [Technology Stack — Decided & Deliberately Deferred](#4-technology-stack--decided--deliberately-deferred)
5. [Rendering & Execution Model](#5-rendering--execution-model)
6. [Application Structure](#6-application-structure)
7. [State Management Model](#7-state-management-model)
8. [Content Architecture](#8-content-architecture)
9. [Data Flow — Request Lifecycle](#9-data-flow--request-lifecycle)
10. [Cross-Cutting Concerns](#10-cross-cutting-concerns)
11. [Deployment & Runtime Environment](#11-deployment--runtime-environment)
12. [Key Architectural Decisions](#12-key-architectural-decisions)
13. [Best Practices](#best-practices)
14. [Common Mistakes](#common-mistakes)
15. [Engineering Notes](#engineering-notes)
16. [Architecture Checklist](#architecture-checklist)
17. [References](#references)

---

## 1. Architectural Goals & Quality Attributes

The architecture exists to serve product intent, not the reverse. Every
decision in this document traces to one of the quality attributes below, each
of which is drawn directly from the product and design documentation. These are
the *drivers*: when a design choice is ambiguous, the option that best serves
the highest-priority driver wins.

Each attribute has a stable identifier of the form **QAT-*n*** ("Quality
ATtribute"). The `QAT` prefix is used deliberately in place of the more common
`QA` to avoid collision with *Quality Assurance* (testing), which is a distinct
concern documented elsewhere.

| # | Quality attribute | Source of truth | Architectural implication |
| --- | --- | --- | --- |
| QAT-1 | **Performance by default** (Lighthouse ≥ 95, excellent Core Web Vitals) | [PRD → Non-Functional Requirements](../product/PRODUCT_REQUIREMENTS.md) | Ship minimal client JavaScript; render on the server by default; stream; optimize images. |
| QAT-2 | **Accessibility** (WCAG AA) | [PRD → Non-Functional Requirements](../product/PRODUCT_REQUIREMENTS.md), [Design System → Accessibility](../design/DESIGN_SYSTEM.md) | Semantic HTML, keyboard support, visible focus, reduced-motion — as an architectural constraint on every component. |
| QAT-3 | **Maintainability** | [PRD → Maintainability](../product/PRODUCT_REQUIREMENTS.md) | Feature-based architecture, design tokens, type safety, shared components. |
| QAT-4 | **Scalability of the codebase** | [Project Vision → Core Principles](../product/PROJECT_VISION.md) | Clear module boundaries so features are added without cross-cutting rewrites. |
| QAT-5 | **Internationalization** (English, Arabic, RTL) | [PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md) | Locale-aware routing and direction-aware layout are foundational, not retrofitted. |
| QAT-6 | **SEO** | [PRD → SEO](../product/PRODUCT_REQUIREMENTS.md) | Server-rendered HTML, Metadata API, structured data, localized metadata. |
| QAT-7 | **Consistency** | [Design Principles → Principle 7](../design/DESIGN_PRINCIPLES.md) | Tokens and shared components enforce uniform spacing, typography, color, and motion. |

**Priority ordering.** When two attributes conflict, resolve in the order the
product documentation implies: correctness and accessibility (QAT-2) are never
traded away; performance (QAT-1) outranks visual effect
([Design Principles → Principle 5](../design/DESIGN_PRINCIPLES.md),
[PRD → Product Principles](../product/PRODUCT_REQUIREMENTS.md):
"Performance over visual effects"). Maintainability and scalability (QAT-3,
QAT-4) outrank short-term implementation speed, consistent with the repository's
Architecture-First philosophy.

---

## 2. Architectural Principles

These are the standing rules used to decide questions this document does not
answer explicitly. They are the decision filter for the whole codebase.

1. **Architecture First.** Structural decisions precede implementation.
   Documentation describing a subsystem is written before that subsystem is
   built. A missing decision is deferred *explicitly* (see
   [§4](#4-technology-stack--decided--deliberately-deferred)), never resolved
   silently in code.

2. **Server-first, minimal client.** The default execution context is the
   server (React Server Components). Client-side JavaScript is opt-in and must
   be justified by genuine interactivity. This principle is the primary
   mechanism for satisfying QAT-1. Detailed in
   [§5](#5-rendering--execution-model).

3. **Feature-based modularity.** Code is organized by feature domain, not by
   technical type. Boundaries between features are explicit; shared code is
   promoted deliberately, not by accident. Detailed in
   [§6](#6-application-structure) and refined in `FOLDER_STRUCTURE.md`.

4. **State minimization.** State is kept at the lowest, most local level that
   works. The ordering — Server → URL → Local → Global — is a hard preference,
   not a suggestion. Global state requires a documented justification. Detailed
   in [§7](#7-state-management-model).

5. **Tokens over hardcoding.** No design value (color, spacing, typography,
   radius, shadow, motion timing) is hardcoded in a component. Every value
   resolves to a design token. This is the enforcement mechanism for QAT-7 and
   comes directly from
   [Design System → Design Tokens](../design/DESIGN_SYSTEM.md).

6. **Content as data.** Content is typed, validated, versioned data stored in
   the repository (MDX and structured data), not free-form markup embedded in
   components. Detailed in [§8](#8-content-architecture).

7. **Accessibility is non-negotiable.** Accessibility is a build-time
   requirement of every component, not a later audit — per
   [Design Language → Accessibility](../design/DESIGN_LANGUAGE.md).

8. **Simplicity when in doubt.** Restating
   [Design Principles → Final Rule](../design/DESIGN_PRINCIPLES.md): when a
   decision is difficult, choose the simpler solution. This principle
   explicitly guards against the project risks of *overengineering* and
   *scope creep* named in the [PRD → Risks](../product/PRODUCT_REQUIREMENTS.md).

---

## 3. System Context & Boundaries

### 3.1 What the system is

The system is a **statically-biased, content-driven web application**: a
premium engineering portfolio that behaves like a modern SaaS product
([Project Vision](../product/PROJECT_VISION.md)). Its content originates from
the repository itself. It has no user accounts, no application backend of its
own, and no runtime database. It is rendered and served through a single
Next.js application deployed to Vercel.

At the highest level there are three actors and one system:

- **Visitor** — reads content; the primary actor (recruiters, engineering
  managers, engineers; see [PRD → Target Audience](../product/PRODUCT_REQUIREMENTS.md)).
- **Author** — Mohamed; produces content as MDX and structured data committed
  to the repository.
- **Contact recipient** — the destination for the contact form
  ([PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)); the only meaningful
  outbound integration, introduced in a later milestone.

```
        commits (build-time)
 Author ───────────────────────▶ ┌──────────────────────────────┐
                                  │ Repository content           │
                                  │ (MDX + structured data)      │
                                  └───────────────┬──────────────┘
                                                  │ read at build/render
                                                  ▼
 Visitor ───── HTTP request ────▶ ┌──────────────────────────────┐
                                  │ Next.js application (Vercel) │ ── message ──▶ Contact
 Visitor ◀──── HTML response ──── │ App Router · RSC · tokens    │  (later M)     recipient
                                  └──────────────────────────────┘
```

*System context. The application is the only system; content is an input, not
an external service. The single side-effecting integration (contact) is
introduced in a later milestone.*

The application itself is the system boundary. Its only inputs are the
committed content and an inbound HTTP request; its only side-effecting output
(planned for a later milestone) is the transmission of a contact message.

### 3.2 Non-goals (out of scope)

The following are explicitly **not** part of the architecture. They are
recorded here because a stated system boundary is the primary defense against
the *scope creep* and *overengineering* risks in the
[PRD → Risks](../product/PRODUCT_REQUIREMENTS.md). Sourced from
[PRD → Out of Scope](../product/PRODUCT_REQUIREMENTS.md):

- Authentication and user accounts.
- Payment systems.
- Application backend APIs and runtime databases.
- Admin dashboard and multi-user support.
- A Content Management System (**Version 1** uses local content only; CMS is a
  Version 3 consideration).

Any requirement to introduce one of these is a product-scope change and must be
reflected in the product documentation *before* it appears in the architecture.

---

## 4. Technology Stack — Decided & Deliberately Deferred

The Architecture-First philosophy requires distinguishing what is decided from
what is intentionally still open. Recording the *deferred* set is as important
as recording the *decided* set: it prevents an accidental choice in code from
becoming a de facto architecture.

### 4.1 Decided

| Concern | Choice | Justification (why) | Authority |
| --- | --- | --- | --- |
| Framework & routing | **Next.js — App Router** | Mandated, non-negotiable. Provides Server Components, streaming, the Metadata API, and file-system routing required by QAT-1 and QAT-6. | Owner directive; [PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md); ADR-0001 |
| Rendering model | **React Server Components (server-first)** | Minimizes shipped JavaScript and maximizes server-rendered HTML; foundational to QAT-1. | [PRD → FR-006/FR-007](../product/PRODUCT_REQUIREMENTS.md) |
| Language | **TypeScript** | Type safety is a named maintainability requirement; components must be typed. *Inferred from the requirements below; pending explicit owner confirmation — see [Engineering Notes](#engineering-notes).* | [PRD → Maintainability](../product/PRODUCT_REQUIREMENTS.md); [Design System → Component Standards](../design/DESIGN_SYSTEM.md) |
| Styling | **Tailwind CSS driven by design tokens** | Token-based utility styling enforces consistency (QAT-7) and forbids hardcoded values. | [Design System → Design Tokens](../design/DESIGN_SYSTEM.md); owner directive; ADR-0003 |
| Content format | **MDX + structured data, stored in-repo** | Content-as-data with rich composition; no CMS in V1. | Owner directive; [PRD → Product Scope](../product/PRODUCT_REQUIREMENTS.md); [Content Model](../developer/CONTENT_MODEL.md) |
| Icons | **Lucide only** | Single, consistent icon system; icons never replace labels. | [Design System → Iconography](../design/DESIGN_SYSTEM.md) |
| Images | **`next/image`, AVIF/WebP, explicit dimensions** | Built-in optimization and layout stability serve QAT-1. | [Design System → Images](../design/DESIGN_SYSTEM.md) |
| Deployment | **Vercel** | First-class Next.js hosting: edge network, image optimization, preview deployments. | Owner directive |

### 4.2 Deliberately deferred

These decisions are open **by design** and will be resolved in the milestone
that first requires them, each recorded as an ADR at that time.

| Concern | Status | Rationale for deferral |
| --- | --- | --- |
| **State management library/approach** | Open — decide after the architecture is defined. | The default preference is to avoid global state entirely (see [§7](#7-state-management-model)). A library is selected only if the state hierarchy proves a global need. The mention of RTK Query in [PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md) is illustrative of the *Engineering Decisions* content page, **not** a binding stack decision. |
| **Animation library** | Open. The motion *system* is defined in [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md); the concrete library is selected at M3. | Motion is treated as intentional and usability-serving ([Brand → Motion Principles](../product/BRAND.md), [Design System → Motion System](../design/DESIGN_SYSTEM.md)). The token-based motion system is fixed now; the library that consumes it is chosen when the first real interactions are built, not before. |
| **Internationalization mechanism** | Open; resolved in `INTERNATIONALIZATION.md` (M2). | The *requirement* (English, Arabic, RTL, localized routes/metadata) is fixed; the routing/dictionary mechanism is chosen when routing is implemented. |
| **Testing tooling** | Deferred per the incremental documentation strategy. | Written when a stable, testable surface exists. Timing is an open question flagged in [Engineering Notes](#engineering-notes). |

---

## 5. Rendering & Execution Model

> This section is an overview. Concrete per-route rules, caching, and
> revalidation belong to `RENDERING_STRATEGY.md` (M5).

### 5.1 Server-first by default

The application is built on React Server Components. **A component is a Server
Component unless it must run on the client.** Server Components render to HTML
on the server, ship no component JavaScript to the browser, and can read
content directly at render time. This is the single most important lever for
QAT-1 (performance) and QAT-6 (SEO), because it maximizes server-rendered markup
and minimizes hydration cost.

A component becomes a **Client Component** — annotated with the `"use client"`
directive — only when it needs one of: interactive event handlers, browser-only
APIs, React state or effects, or a stateful third-party widget. Interactivity
is pushed to the *leaves* of the tree so that client "islands" stay small and
isolated. Conceptually:

```
app/[locale]/page.tsx                (Server) — reads content, composes layout
└─ HeroSection                       (Server) — pure markup + tokens
   └─ ThemeToggle                    (Client) — "use client": needs state + browser API
```

The layout, the content, and the structure are server-rendered; only the small
`ThemeToggle` island hydrates on the client.

### 5.2 Static bias, streaming, and boundaries

Content originates in the repository and is known at build time, so pages are
**static by default** and regenerated on deploy. Where a page benefits from
progressive delivery, React streaming and Suspense boundaries are used to send
above-the-fold content first. Route-level `loading` and `error` states are part
of the rendering model and are specified alongside the routes that use them.

### 5.3 Why not a client-first SPA

A client-rendered single-page application would ship a large JavaScript bundle,
hydrate the entire tree, and degrade Core Web Vitals and SEO — a direct
conflict with QAT-1 and QAT-6, and with the product principle *performance over
visual effects*. The server-first model is therefore not merely a default; it
is a requirement traced to product intent.

---

## 6. Application Structure

> This section is an overview. The concrete directory tree, naming rules, and
> import boundaries belong to `FOLDER_STRUCTURE.md` (M0).

The codebase is organized by **feature domain**, not by technical type. The
guiding question is "what does this belong to?" (the *projects* feature, the
*contact* feature) rather than "what kind of file is this?" (a component, a
hook). This keeps a feature's code cohesive and its boundaries explicit,
serving QAT-3 and QAT-4.

Conceptually, the system is composed of four layers:

| Layer | Responsibility | Examples (illustrative, not prescriptive) |
| --- | --- | --- |
| **Routing layer** | Maps URLs to pages; owns layouts, metadata, and locale segments. Thin — it composes features, it does not implement them. | `app/[locale]/projects/[slug]/page.tsx` |
| **Feature layer** | Self-contained domains. Each owns its components, logic, and types. Features do not import each other's internals. | `features/projects`, `features/contact` |
| **Shared layer** | Cross-feature building blocks: the UI component library, hooks, and utilities. Promoted here deliberately when reused. | `shared/ui`, `shared/lib` |
| **Content layer** | The typed content source (MDX + structured data) and the code that loads and validates it. | `content/projects/*.mdx` |

**Boundary rule.** Dependencies point *inward and downward*: routing may depend
on features and shared code; features may depend on shared code and content;
shared code depends on nothing feature-specific. A feature importing another
feature's internals is an architectural violation, to be resolved by promoting
the shared piece into the shared layer. The concrete enforcement (paths,
lint rules) is defined in `FOLDER_STRUCTURE.md` and `CODING_STANDARDS.md`.

```
        ┌──────────────────┐
        │  Routing layer   │  app/ — thin; composes features, owns layouts
        └────────┬─────────┘
                 │ depends on
                 ▼
        ┌──────────────────┐        ┌──────────────────┐
        │  Feature layer   │ ─────▶ │  Content layer   │  typed MDX + data
        └────────┬─────────┘        └──────────────────┘
                 │ depends on
                 ▼
        ┌──────────────────┐
        │  Shared layer    │  depends on nothing feature-specific
        └──────────────────┘
```

*Dependencies point downward only. A feature never imports another feature;
shared code never depends on a feature. An arrow that would point sideways
(feature → feature) or upward is an architectural violation.*

---

## 7. State Management Model

> This section defines the *stance*. The chosen tools and concrete patterns
> belong to `STATE_MANAGEMENT.md`, written when non-trivial state first appears.

State is minimized and kept as local as possible. The architecture mandates a
strict **preference hierarchy**; each level is used only when the level above
it cannot serve the need:

1. **Server state.** Data known at render time (content, metadata). Read
   directly in Server Components. No client state machinery involved. This is
   the default and covers the majority of the portfolio.
2. **URL state.** State that should be shareable, bookmarkable, or restorable —
   for example the active locale, or (in a later milestone) project filters and
   search queries. Encoded in the route or query string, read on the server.
3. **Local state.** Ephemeral, component-scoped UI state — an open menu, a
   focused input. Held in the nearest Client Component with `useState`/
   `useReducer`.
4. **Global state.** Client state shared across unrelated parts of the tree.
   **Used only with a documented engineering justification.** Introducing
   global state requires a justification recorded in
   [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) — and, where it alters the
   architecture, an ADR — explaining why levels 1–3 are insufficient.

**Why this ordering.** Each descent down the hierarchy adds client JavaScript,
hydration cost, and a source of truth that can drift from the server — working
against QAT-1 and QAT-3. Keeping state high in the hierarchy keeps the client
thin and the system predictable. This is why no global-state library is part of
the decided stack ([§4](#4-technology-stack--decided--deliberately-deferred)):
the need must be proven before the tool is chosen.

---

## 8. Content Architecture

> This section is an overview. The content schemas belong to `CONTENT_MODEL.md`
> and the parsing/rendering pipeline to `MDX_PIPELINE.md` (both M4).

Content is **data that lives in the repository**. For Version 1 there is no
CMS; the source of truth for projects, case studies, articles, and journey
entries is committed MDX and structured data
([PRD → Product Scope](../product/PRODUCT_REQUIREMENTS.md); owner directive).

This yields several architectural properties:

- **Type-safe content.** Each content type has a schema; frontmatter is
  validated at build time. Invalid content fails the build rather than shipping
  broken pages — serving QAT-3.
- **Build-time availability.** Because content is known at build time, pages
  are statically generated (see [§5](#5-rendering--execution-model)), which
  directly benefits QAT-1 and QAT-6.
- **Version control as history.** Content changes are reviewed and versioned
  like code; the [PRD → FR-015 Development Journal](../product/PRODUCT_REQUIREMENTS.md)
  is a natural fit for this model.
- **Rich composition.** MDX allows interactive components inside content where
  a demonstration adds value (e.g., the [PRD → FR-013 Playground](../product/PRODUCT_REQUIREMENTS.md)),
  without turning every page into a bespoke build.
- **Documentation is content.** The portfolio publishes its own engineering
  documentation and AI workflow as first-class content
  ([PRD → Product Scope](../product/PRODUCT_REQUIREMENTS.md)). These pages are
  consumed through the same content pipeline as projects and articles;
  engineering documentation is therefore a content *type*, not a special case,
  and the content model must accommodate it.

The rich structure required of a project page — Overview, Problem, Solution,
Role, Tech Stack, Architecture Decisions, Challenges, Lessons Learned, links,
and gallery ([PRD → FR-005](../product/PRODUCT_REQUIREMENTS.md)) — is expressed
through the content schema, not hardcoded per page.

---

## 9. Data Flow — Request Lifecycle

The following traces a single request end to end, tying the subsystems above
into one narrative. Example request: a visitor opens the Arabic version of a
project detail page, `/ar/projects/streaming-platform`.

1. **Request arrives** at the Vercel edge network.
2. **Locale resolution.** The routing layer resolves the active locale (`ar`)
   from the URL segment; automatic detection applies when no locale is present
   ([PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md)). Document direction is
   set to RTL for Arabic. *(Mechanism defined in `INTERNATIONALIZATION.md`.)*
3. **Route match.** The App Router matches the `[locale]/projects/[slug]`
   segment to its Server Component page.
4. **Content load.** The page reads the `streaming-platform` project from the
   content layer; its frontmatter has already been validated at build time.
5. **Server render.** The page renders as a Server Component tree — layout,
   sections, and content — to HTML. Design tokens resolve to the active theme
   (dark-first). No component JavaScript is emitted for server-only nodes.
6. **Streaming.** Above-the-fold content is streamed first; slower or deferred
   sections resolve within Suspense boundaries.
7. **Selective hydration.** Only Client Component islands (e.g., theme toggle,
   gallery interactions) hydrate on the browser. The bulk of the page remains
   static HTML.
8. **Metadata & SEO.** Localized metadata, Open Graph, and structured data are
   emitted via the Metadata API for this locale
   ([PRD → SEO](../product/PRODUCT_REQUIREMENTS.md)).

> **Note on the locale scheme.** The `/ar/...` path-prefix used above is
> *illustrative only*. The concrete internationalization mechanism — path
> prefix versus domain versus other — is a deferred decision recorded as
> ADR-0004 and specified in `INTERNATIONALIZATION.md` (see
> [§4.2](#42-deliberately-deferred)). This example must not be read as a
> commitment to path-prefix routing.

The contact flow is the one path that produces a side effect (sending a
message); it is introduced in a later milestone and documented then, together
with its validation and security posture (see [§10](#10-cross-cutting-concerns)).

---

## 10. Cross-Cutting Concerns

These concerns touch every layer. They are named here as system-wide
constraints so nothing is built blind to them; each is detailed just-in-time in
its own document.

- **Internationalization (EN/AR, RTL).** Locale-aware routing and
  direction-aware layout are architectural, not cosmetic. Every page and
  component is built locale- and direction-aware from the start, because
  retrofitting RTL after the fact is the most expensive avoidable rework in
  this project. Requirement: [PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md).
  Detail: [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md),
  [ADR-0004](../adr/ADR-0004-Internationalization.md).
- **Theming (dark-first).** Dark, light, and system themes with persistence and
  no flash of incorrect theme. Themes are expressed entirely through design
  tokens; components never reference raw colors. Requirement:
  [PRD → FR-002](../product/PRODUCT_REQUIREMENTS.md),
  [Design Language → Color Philosophy](../design/DESIGN_LANGUAGE.md). Detail:
  [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md),
  [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md),
  [ADR-0005](../adr/ADR-0005-Theme-System.md).
- **Performance (QAT-1).** A performance budget constrains bundle size and Core
  Web Vitals. The server-first model, static bias, and image optimization are
  the primary mechanisms. Detail: [PERFORMANCE.md](./PERFORMANCE.md).
- **Accessibility (QAT-2).** Semantic HTML, keyboard navigation, visible focus,
  and reduced-motion support are requirements of every component. Detail:
  [ACCESSIBILITY.md](./ACCESSIBILITY.md),
  [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md).
- **SEO (QAT-6).** Server-rendered HTML, the Metadata API, Open Graph, Twitter
  cards, structured data, sitemap, robots, canonical URLs, and localized SEO.
  Detail: [SEO.md](./SEO.md).
- **Security.** Content Security Policy headers, form validation, spam
  protection, and input sanitization. The attack surface is minimal until the
  contact form exists; security is documented in that milestone rather than
  speculatively. Requirement: [PRD → Security](../product/PRODUCT_REQUIREMENTS.md).
- **Observability & analytics.** Measuring the success metrics in the
  [PRD → Success Metrics](../product/PRODUCT_REQUIREMENTS.md) requires
  privacy-respecting analytics. This is a
  [Version 2](../product/PRODUCT_REQUIREMENTS.md) concern and is deferred; it is
  named here so that it is a conscious future addition, not an oversight. No
  analytics or third-party tracking is part of the Version 1 architecture.
- **Resilience & error handling.** For statically generated content the failure
  surface is minimal. The one exception is the contact flow, whose failure
  modes (transmission failure, validation rejection, spam) must be handled
  gracefully and surfaced to the user. Route-level error and loading states
  (see [§5.2](#52-static-bias-streaming-and-boundaries)) are specified with the
  routes that use them.

---

## 11. Deployment & Runtime Environment

> Overview only. The concrete deployment workflow (preview deployments,
> promotion, rollback) is documented at the launch milestone.

The application is deployed to **Vercel**. This is an architectural input, not
an afterthought, because the platform's capabilities are assumed by the
rendering model:

- **Edge network delivery** of statically generated pages serves QAT-1
  globally.
- **Server Component execution** runs in the platform's serverless/edge
  runtime; code must remain compatible with that runtime (no assumptions of a
  long-lived server or local filesystem writes at request time).
- **Built-in image optimization** backs the `next/image` decision in
  [§4](#4-technology-stack--decided--deliberately-deferred).
- **Preview deployments** per change support the review process introduced in a
  later milestone.

Because there is no application backend ([§3](#3-system-context--boundaries)),
the runtime footprint is limited to rendering and the single outbound contact
integration.

---

## 12. Key Architectural Decisions

This is a **convenience index** of the locked decisions surfaced throughout
this document. It is **not** the canonical record: full rationale, alternatives
considered, and consequences live in the corresponding ADR, and the canonical
ADR index is [`docs/adr/`](../adr/README.md). This table exists to link
decisions to the sections that exercise them; when it and `docs/adr/` disagree,
`docs/adr/` wins. The
[PRD → FR-007 Engineering Decisions](../product/PRODUCT_REQUIREMENTS.md) page is
the public-facing counterpart of this internal record.

| ID | Decision | Status | Section |
| --- | --- | --- | --- |
| [ADR-0001](../adr/ADR-0001-App-Router.md) | Next.js App Router (mandatory) | Accepted | [§4](#4-technology-stack--decided--deliberately-deferred), [§5](#5-rendering--execution-model) |
| [ADR-0002](../adr/ADR-0002-Feature-Architecture.md) | Feature-based architecture | Accepted | [§6](#6-application-structure) |
| [ADR-0003](../adr/ADR-0003-Tailwind.md) | Styling: Tailwind + design tokens | Accepted | [§4](#4-technology-stack--decided--deliberately-deferred) |
| [ADR-0004](../adr/ADR-0004-Internationalization.md) | Internationalization approach | Accepted | [§9](#9-data-flow--request-lifecycle), [§10](#10-cross-cutting-concerns) |
| [ADR-0005](../adr/ADR-0005-Theme-System.md) | Theme system | Accepted | [§10](#10-cross-cutting-concerns) |
| [ADR-0006](../adr/ADR-0006-Rendering-Strategy.md) | Rendering strategy | Accepted | [§5](#5-rendering--execution-model) |

> These six ADRs are the canonical decision set for the current phase; their
> records live in [`docs/adr/`](../adr/README.md). Two further locked decisions
> surfaced in this document are recorded as **strategy documents** rather than
> ADRs, because they define ongoing practice rather than a single point-in-time
> choice: the **state hierarchy** in
> [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) ([§7](#7-state-management-model))
> and **content as local MDX (no CMS in V1)** in
> [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)
> ([§8](#8-content-architecture)). ADR identifiers are permanent and are never
> reused.

---

## Best Practices

- **Start from the frame.** Before adding a subsystem, confirm where it sits in
  this document (which layer, which cross-cutting concerns apply) and which
  detailed document governs it.
- **Default to the server.** Write a Server Component first; add `"use client"`
  only when interactivity forces it, and push that boundary to the leaves.
- **Descend the state hierarchy reluctantly.** Prefer server, then URL, then
  local. Reaching for global state is a signal to stop and write an ADR.
- **Resolve every value to a token.** If you are typing a hex color, a pixel
  value, or a duration into a component, stop — the value belongs in the design
  system.
- **Keep content in the content layer.** Page components compose; they do not
  embed prose or data.
- **Build locale- and theme-aware from line one.** Never assume left-to-right
  or a single theme, even in the first draft of a component.
- **Reference, do not repeat.** Link to the authoritative document rather than
  restating its content; duplication is how documentation rots.

---

## Common Mistakes

- **Client-by-default.** Adding `"use client"` at the top of a page or layout
  "to be safe." This collapses the server-first model and inflates the bundle,
  violating QAT-1.
- **Premature global state.** Introducing a global store for state that is
  genuinely server, URL, or local. This is the most likely source of
  accidental complexity; the hierarchy in [§7](#7-state-management-model)
  exists to prevent it.
- **Hardcoded design values.** Bypassing tokens for a "quick" color or spacing
  value, breaking QAT-7 and the [Design System](../design/DESIGN_SYSTEM.md).
- **Retrofitting i18n or theming.** Building a component for one language,
  direction, or theme and intending to "add the rest later." Both are
  cross-cutting by design ([§10](#10-cross-cutting-concerns)).
- **Cross-feature coupling.** Importing another feature's internals instead of
  promoting shared code, eroding the boundaries in
  [§6](#6-application-structure).
- **Silent scope expansion.** Introducing anything from the non-goals list in
  [§3.2](#32-non-goals-out-of-scope) in code without first amending the product
  documentation.
- **Documenting ahead of need.** Writing detailed subsystem documentation
  before the milestone that implements it, contrary to the just-in-time
  strategy; such documents drift before they are ever used.

---

## Engineering Notes

- **This is a living document.** It is versioned and expected to evolve as
  subsystems are implemented and their detailed documents land. Changes that
  alter the frame (a new layer, a reversed decision) require a version bump and
  a corresponding ADR.
- **Deferred decisions are intentional.** The open items in
  [§4.2](#42-deliberately-deferred) are not omissions. Resist the urge to close
  them early in code; close them in their milestone with an ADR.
- **Open question — testing strategy timing.** The incremental roadmap places
  the testing strategy at the hardening milestone, but reusable components
  arrive far earlier (M3). Whether to pull the testing strategy forward to
  "test-alongside" from the first shared component is an open decision awaiting
  the owner's direction. It does not block this document.
- **Terminology.** "Server Component" and "Client Component" refer to the React
  Server Components model; "server state," "URL state," "local state," and
  "global state" refer strictly to the hierarchy in
  [§7](#7-state-management-model). These terms are used consistently across all
  engineering documentation.
- **Status lifecycle.** This document moves through `Draft` → `In Review` →
  `Accepted` → `Superseded`. `Accepted` requires owner sign-off. A change that
  alters the frame (a new layer, a reversed decision) resets the status to
  `In Review`, bumps the minor version, and requires a corresponding ADR.
- **Open assumption — TypeScript.** TypeScript is treated as the language
  ([§4.1](#41-decided)) by inference from the "Type Safety" requirement. This
  is not yet an explicit owner directive. If plain JavaScript is intended,
  §4.1 and the downstream tooling documents change accordingly.
- **Open assumption — locale scheme.** The path-prefixed locale in
  [§9](#9-data-flow--request-lifecycle) is illustrative; the mechanism is
  deferred to ADR-0004. No architectural claim depends on that specific scheme.

---

## Architecture Checklist

Use this checklist when introducing or reviewing any feature, page, or
component. It operationalizes the principles above. Every answer should be
"yes" (or a justified, documented exception) before the work is considered
architecturally sound.

**Rendering & execution**
- [ ] Is this a Server Component unless interactivity genuinely requires a
      Client Component?
- [ ] Are `"use client"` boundaries pushed to the leaves, keeping islands
      small?
- [ ] Is the page statically generated where its content allows?

**Structure & boundaries**
- [ ] Does the code live in the correct layer (routing, feature, shared,
      content)?
- [ ] Does it avoid importing another feature's internals?
- [ ] Is shared code promoted to the shared layer rather than duplicated?

**State**
- [ ] Is state held at the highest viable level (server → URL → local →
      global)?
- [ ] If global state is used, is there an ADR justifying why levels above it
      are insufficient?

**Design system**
- [ ] Do all colors, spacing, typography, radii, shadows, and motion timings
      resolve to design tokens?
- [ ] Does the component meet the [Design System](../design/DESIGN_SYSTEM.md)
      component standards (reusable, composable, accessible, typed)?

**Cross-cutting concerns**
- [ ] Is it locale-aware and direction-aware (LTR and RTL)?
- [ ] Is it theme-compatible (dark, light, system) via tokens?
- [ ] Is it accessible (semantic HTML, keyboard, visible focus, reduced
      motion)?
- [ ] Is server-rendered HTML and localized metadata correct for SEO?
- [ ] Does it respect the performance budget (minimal client JS, optimized
      images)?

**Scope & documentation**
- [ ] Does it stay within the system boundaries in
      [§3](#3-system-context--boundaries)?
- [ ] Is the governing detailed document updated if this work refines a
      subsystem?
- [ ] Is any new architectural decision recorded as an ADR?

---

## References

**Internal — sources of truth**
- [Project Vision](../product/PROJECT_VISION.md)
- [Product Requirements](../product/PRODUCT_REQUIREMENTS.md)
- [Brand Identity](../product/BRAND.md)
- [Design Principles](../design/DESIGN_PRINCIPLES.md)
- [Design Language](../design/DESIGN_LANGUAGE.md)
- [Design System](../design/DESIGN_SYSTEM.md)

**Internal — planned engineering documents**
- The canonical list of planned engineering documents, with their milestones,
  is maintained in [Dependencies](#dependencies) above. It is intentionally not
  duplicated here to avoid divergence.

**External**
- Next.js App Router documentation — <https://nextjs.org/docs/app>
- React Server Components — <https://react.dev/reference/rsc/server-components>
- Web Content Accessibility Guidelines (WCAG) 2.1 AA —
  <https://www.w3.org/TR/WCAG21/>
- Core Web Vitals — <https://web.dev/articles/vitals>

---

## Revision History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 1.0.0 | July 2026 | Draft | Initial keystone architecture overview (M0). |
| 1.1.0 | July 2026 | In Review | Principal-architect review revisions: renamed quality-attribute identifiers `QA-*` → `QAT-*` to remove the collision with *Quality Assurance*; added system-context and layer-dependency diagrams; corrected the §9 locale example to an explicit illustrative caveat pending ADR-0004; clarified ADR decision-vs-record status and named `docs/decisions/` as the canonical index; recorded the TypeScript inference as an open assumption; added *Observability & Analytics* and *Resilience & Error Handling* as cross-cutting concerns; acknowledged documentation as a content type; de-duplicated the planned-documents list; added status lifecycle and this revision history. |
| 1.2.0 | July 2026 | In Review | Aligned to the finalized `docs/` structure and canonical ADR numbering. Reconciled §12 to the six-ADR set (App Router, Feature Architecture, Tailwind, Internationalization, Theme System, Rendering Strategy) with linked records; moved the canonical ADR index from `docs/decisions/` to `docs/adr/`; recorded the state-hierarchy and local-MDX decisions as strategy documents rather than ADRs; rewrote the companion-document list and cross-cutting-concern detail links to the finalized paths (`design/` tokens/color/theme, `developer/` content/catalog, `engineering/` accessibility/SEO/performance). |
