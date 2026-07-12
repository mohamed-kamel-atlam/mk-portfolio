# Documentation

**Version:** 1.0.0
**Status:** Active
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This is the documentation system for **MohamedKamel.dev**, a production-grade
engineering portfolio built with Next.js (App Router). In this project the
documentation is **part of the product**: it is the single source of truth for
what we build, how we build it, and why. A Senior Frontend Engineer should be
able to start implementation from these documents without needing additional
architectural clarification.

If you read only one document first, read
[engineering/ARCHITECTURE.md](./engineering/ARCHITECTURE.md) — it is the
keystone that every engineering document refines.

---

## How this documentation works

The repository follows five operating principles. They explain the shape of
everything below.

- **Documentation-Driven Development** — documentation precedes and drives
  implementation; code conforms to the documented design.
- **Architecture First** — structural decisions are made and recorded before
  the code that depends on them.
- **Incremental & Just-in-Time Documentation** — detailed, implementation-level
  documents are written in the milestone that first needs them, so they stay
  accurate instead of drifting.
- **Single source of truth** — every fact lives in exactly one document; other
  documents reference it rather than restating it.
- **Every decision is justified** — nothing is asserted without a *why*.

Precedence, when documents appear to disagree:
[ARCHITECTURE](./engineering/ARCHITECTURE.md) defines the *frame*; the detailed
documents define the *detail*; the canonical record of a decision is its
[ADR](./adr/README.md). A genuine contradiction is a defect to be fixed, not a
choice to be made ad hoc.

---

## Structure

Documentation is organized by audience and responsibility:

| Folder | Answers the question | Primary audience |
| --- | --- | --- |
| [`product/`](#product) | *What are we building, and why?* | Everyone |
| [`design/`](#design) | *What should it look and feel like?* | Design + engineering |
| [`engineering/`](#engineering) | *How is it architected and built?* | Engineering |
| [`developer/`](#developer) | *What are the concrete building blocks and conventions?* | Engineering |
| [`adr/`](#architecture-decision-records) | *Which decisions are locked, and why?* | Engineering |
| [`journal/`](#journal) | *What happened, sprint by sprint?* | Everyone |
| [`references/`](#references) | *What external knowledge informs our standards?* | Everyone |

---

## Product

The intent, requirements, and plan. Start here to understand the *what* and
*why*.

- [Project Vision](./product/PROJECT_VISION.md) — vision, mission, and success
  criteria.
- [Product Requirements (PRD)](./product/PRODUCT_REQUIREMENTS.md) — scope,
  personas, functional (`FR-*`) and non-functional requirements, phasing.
- [Brand Identity](./product/BRAND.md) — positioning, voice, visual and motion
  direction.
- [Delivery Roadmap](./product/ROADMAP.md) — the milestone plan (M0→M9) mapping
  requirements to buildable increments.
- [Success Metrics](./product/SUCCESS_METRICS.md) — measurable performance,
  accessibility, and SEO targets.

## Design

The visual and interaction system. Philosophy first, then concrete tokens.

- [Design Principles](./design/DESIGN_PRINCIPLES.md) — the philosophy behind
  every UI decision.
- [Design Language](./design/DESIGN_LANGUAGE.md) — layout, typography, color,
  motion, and interaction philosophy.
- [Design System](./design/DESIGN_SYSTEM.md) — token categories, component
  standards, iconography, imagery.
- [Design Tokens](./design/DESIGN_TOKENS.md) — the token architecture and the
  concrete structural values (spacing, radius, shadow, breakpoints).
- [Color System](./design/COLOR_SYSTEM.md) — the palette and dark/light
  semantic mappings.
- [Typography](./design/TYPOGRAPHY.md) — fonts and the type scale.
- [Motion Guidelines](./design/MOTION_GUIDELINES.md) — durations, easings, and
  motion patterns.
- [Component Philosophy](./design/COMPONENT_PHILOSOPHY.md) — how components are
  designed (principles, states, variants).

## Engineering

The architecture and the systems that realize it.

- [Technical Architecture Overview](./engineering/ARCHITECTURE.md) — **the
  keystone**; read first.
- [Folder Structure](./engineering/FOLDER_STRUCTURE.md) — the feature-based
  directory tree and import boundaries.
- [Rendering Strategy](./engineering/RENDERING_STRATEGY.md) — Server/Client
  Components, static bias, streaming.
- [State Management](./engineering/STATE_MANAGEMENT.md) — the
  Server→URL→Local→Global hierarchy in practice.
- [Data Fetching](./engineering/DATA_FETCHING.md) — the server-side content
  access layer and caching.
- [Internationalization & Routing](./engineering/INTERNATIONALIZATION.md) —
  English/Arabic, RTL, localized routing.
- [Performance Budget & Strategy](./engineering/PERFORMANCE.md) — budgets and
  techniques.
- [Accessibility Standards](./engineering/ACCESSIBILITY.md) — WCAG 2.1 AA in
  practice.
- [SEO & Metadata](./engineering/SEO.md) — metadata, structured data, sitemaps.
- [Development Guidelines](./engineering/DEVELOPMENT_GUIDELINES.md) — the
  engineering workflow and Definition of Done.
- [AI-Assisted Development Workflow](./engineering/AI_WORKFLOW.md) — the
  human-in-the-loop AI methodology.
- [CLAUDE.md — AI Repository Context](./engineering/CLAUDE.md) — the operating
  guide for AI-assisted contributions.

## Developer

The concrete building blocks and code conventions.

- [Component Catalog](./developer/COMPONENT_CATALOG.md) — the MVP component
  inventory with variants, states, and a11y contracts.
- [Content Model](./developer/CONTENT_MODEL.md) — content-type schemas
  (records the local-MDX / no-CMS decision).
- [MDX Pipeline](./developer/MDX_PIPELINE.md) — how MDX is parsed, validated,
  and rendered.
- [Coding Standards](./developer/CODING_STANDARDS.md) — TypeScript, naming,
  imports, styling, and accessibility-in-code rules.

## Architecture Decision Records

The canonical record of locked decisions. The
[ADR index](./adr/README.md) explains the process; the
[ARCHITECTURE §12 table](./engineering/ARCHITECTURE.md#12-key-architectural-decisions)
is a convenience pointer into it.

- [ADR-0001 — Next.js App Router](./adr/ADR-0001-App-Router.md)
- [ADR-0002 — Feature-Based Architecture](./adr/ADR-0002-Feature-Architecture.md)
- [ADR-0003 — Tailwind CSS Driven by Design Tokens](./adr/ADR-0003-Tailwind.md)
- [ADR-0004 — Internationalization Approach](./adr/ADR-0004-Internationalization.md)
- [ADR-0005 — Theme System](./adr/ADR-0005-Theme-System.md)
- [ADR-0006 — Rendering Strategy](./adr/ADR-0006-Rendering-Strategy.md)

> Two further locked decisions are recorded as **strategy documents** rather
> than ADRs, because they define ongoing practice rather than a single choice:
> the state hierarchy ([State Management](./engineering/STATE_MANAGEMENT.md))
> and content as local MDX ([Content Model](./developer/CONTENT_MODEL.md)).

## Journal

The living development record.

- [Development Journal](./journal/README.md) — the journaling system and
  sprint template.
- [Sprint 00 — Documentation Foundation](./journal/SPRINT-00.md) — the current
  sprint.

## References

Curated external knowledge that informs our standards.

- [References overview](./references/README.md)
- [Inspiration](./references/inspiration.md) · [Books](./references/books.md) ·
  [Articles & Official Documentation](./references/articles.md)

---

## Reading paths

Different readers need different entry points:

- **Implementing a feature (Senior Engineer):**
  [ARCHITECTURE](./engineering/ARCHITECTURE.md) →
  [FOLDER_STRUCTURE](./engineering/FOLDER_STRUCTURE.md) →
  [RENDERING_STRATEGY](./engineering/RENDERING_STRATEGY.md) →
  [CODING_STANDARDS](./developer/CODING_STANDARDS.md) →
  [DEVELOPMENT_GUIDELINES](./engineering/DEVELOPMENT_GUIDELINES.md) → the
  feature's relevant design/developer docs.
- **Building UI:** [DESIGN_TOKENS](./design/DESIGN_TOKENS.md) →
  [COLOR_SYSTEM](./design/COLOR_SYSTEM.md) /
  [TYPOGRAPHY](./design/TYPOGRAPHY.md) →
  [COMPONENT_PHILOSOPHY](./design/COMPONENT_PHILOSOPHY.md) →
  [COMPONENT_CATALOG](./developer/COMPONENT_CATALOG.md) →
  [ACCESSIBILITY](./engineering/ACCESSIBILITY.md).
- **Working with content:** [CONTENT_MODEL](./developer/CONTENT_MODEL.md) →
  [MDX_PIPELINE](./developer/MDX_PIPELINE.md) →
  [DATA_FETCHING](./engineering/DATA_FETCHING.md).
- **AI-assisted contribution:** [CLAUDE.md](./engineering/CLAUDE.md) →
  [AI_WORKFLOW](./engineering/AI_WORKFLOW.md).
- **Evaluating the project (reviewer/recruiter):**
  [PROJECT_VISION](./product/PROJECT_VISION.md) →
  [ROADMAP](./product/ROADMAP.md) →
  [ADR index](./adr/README.md).

---

## Conventions

- **Metadata.** Each document opens with `Version`, `Status`, `Last Updated`,
  and `Owner`.
- **Status lifecycle.** `Draft` → `In Review` → `Accepted`/`Active` →
  `Superseded`. Foundation documents are `Draft` until the owner accepts them.
- **Versioning.** Documents use semantic-style versions; a change that alters a
  decision or the architectural frame bumps the version and updates the
  document's revision history and, where relevant, an ADR.
- **Terminology.** Shared vocabulary — *Server/Client Component*, the
  *Server → URL → Local → Global* state hierarchy, the four architectural
  layers, and the `QAT-*` quality attributes — is defined in
  [ARCHITECTURE](./engineering/ARCHITECTURE.md) and used consistently
  everywhere.
- **Single source of truth.** Prefer linking to the authoritative document over
  duplicating its content.

---

## Current status

The documentation foundation (Sprint 00) is complete: product intent, the
design system, the engineering architecture and its subsystems, developer
conventions, the six canonical ADRs, and the references are all in place.
Implementation begins at **M0** per the [Delivery Roadmap](./product/ROADMAP.md).
Detailed, implementation-level documents will continue to be added
just-in-time as later milestones begin.

---

## Related Documents

- [Technical Architecture Overview](./engineering/ARCHITECTURE.md)
- [Delivery Roadmap](./product/ROADMAP.md)
- [Architecture Decision Records](./adr/README.md)
- [Development Journal](./journal/README.md)
