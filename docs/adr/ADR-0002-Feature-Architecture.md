# ADR-0002: Feature-Based Architecture

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ARCHITECTURE → §6 Application Structure](../engineering/ARCHITECTURE.md#6-application-structure), [engineering/FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md), [developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md)

## Context

Maintainability (QAT-3) and scalability of the codebase (QAT-4) rank above
short-term implementation speed
([ARCHITECTURE → §1](../engineering/ARCHITECTURE.md#1-architectural-goals--quality-attributes)).
The portfolio is planned to grow feature by feature across milestones — landing,
about, projects, engineering pages, journey, contact, and later a blog, command
menu, search, and playground
([PRD → Functional Requirements](../product/PRODUCT_REQUIREMENTS.md)). The
codebase must absorb that growth without cross-cutting rewrites, and its
structure is itself part of the product: the portfolio publicly demonstrates
frontend architecture ([Brand → Engineering Identity](../product/BRAND.md)).

A code-organization scheme must therefore make feature boundaries explicit,
keep a feature's code cohesive, and prevent the accidental coupling that erodes a
codebase over time. This decision governs *where code lives* and *what may
depend on what*.

## Decision

Organize the codebase **by feature domain, not by technical type**, across four
conceptual layers with a strict dependency direction
([ARCHITECTURE → §6](../engineering/ARCHITECTURE.md#6-application-structure)):

| Layer | Responsibility |
| --- | --- |
| **Routing layer** | Maps URLs to pages; owns layouts, metadata, and locale segments. Thin — it composes features, it does not implement them. |
| **Feature layer** | Self-contained domains (e.g. `features/projects`, `features/contact`). Each owns its components, logic, and types. Features do not import each other's internals. |
| **Shared layer** | Cross-feature building blocks: the UI component library, hooks, utilities. Promoted here deliberately when reused. |
| **Content layer** | The typed content source (MDX + structured data) and the code that loads and validates it. |

**Boundary rule — dependencies point inward and downward:** routing may depend
on features and shared code; features may depend on shared code and content;
shared code depends on nothing feature-specific. A feature importing another
feature's internals is an architectural violation, resolved by promoting the
shared piece into the shared layer.

```
Routing ──▶ Feature ──▶ Content
              │
              ▼
           Shared   (depends on nothing feature-specific)
```

## Rationale (Why)

- **Cohesion follows the mental model.** The guiding question is "what does this
  belong to?" (the *projects* feature) rather than "what kind of file is this?"
  (a component, a hook). Everything a feature needs sits together, so a change
  is local and legible — directly serving QAT-3.
- **Explicit boundaries enable scale.** Because dependencies only point downward,
  a new feature is *added* rather than *woven through* the codebase; it cannot
  silently entangle existing features. This is the mechanism behind QAT-4
  ([ARCHITECTURE → §2, principle 3](../engineering/ARCHITECTURE.md#2-architectural-principles)).
- **Deliberate sharing beats accidental sharing.** Promotion into the shared
  layer is a conscious act, so shared code is genuinely general rather than one
  feature's internals leaking into another. This prevents the most common source
  of long-term coupling ([Common Mistakes → cross-feature coupling](../engineering/ARCHITECTURE.md#common-mistakes)).
- **The structure is demonstrable.** A clean feature architecture is one of the
  engineering artifacts the portfolio showcases
  ([PRD → FR-005 Folder Structure](../product/PRODUCT_REQUIREMENTS.md),
  [PRD → FR-006](../product/PRODUCT_REQUIREMENTS.md)); the organization is both a
  working system and a piece of content.

## Alternatives Considered

- **Type-based organization (`components/`, `hooks/`, `pages/`, `utils/`).** The
  conventional React default. *Rejected* because it scatters a single feature
  across many top-level folders: understanding "projects" means opening five
  directories, and there is no structural barrier against any file importing any
  other. Cohesion and boundaries — the two things QAT-3 and QAT-4 need most —
  are exactly what it fails to provide as the codebase grows.
- **Atomic Design (atoms / molecules / organisms / templates).** A disciplined
  vocabulary for a *component library*. *Rejected* as the top-level architecture
  because its categories are about visual composition, not domains; classifying
  a component as a "molecule" versus an "organism" is subjective and says
  nothing about which feature owns it. Its useful ideas survive inside the
  shared UI layer, not as the organizing principle of the whole app.
- **Monolith-by-page (all logic inside each `page` file/route).** *Rejected*
  because it destroys reuse and testability: shared building blocks have nowhere
  to live, logic duplicates across routes, and the routing layer stops being
  thin. It optimizes for the first week and taxes every week after.

## Consequences

### Positive
- Feature code is cohesive and independently understandable; onboarding and
  AI-assisted contributions can reason about one feature in isolation.
- The dependency rule prevents accidental coupling, keeping the cost of adding a
  feature roughly constant as the codebase grows (QAT-4).
- The routing layer stays thin, reinforcing the composition-over-implementation
  posture from [ARCHITECTURE → §6](../engineering/ARCHITECTURE.md#6-application-structure).

### Negative
- Requires judgment about when code is genuinely shared versus feature-specific;
  premature promotion creates a bloated shared layer, late promotion creates
  duplication.
- Some cross-feature needs (e.g. global navigation, command menu) require
  deliberate design to respect the boundary rather than reaching across it.

### Neutral
- The concrete directory tree, path aliases, and lint-enforced import boundaries
  are specified in [engineering/FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)
  and [developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md); this ADR
  fixes the model, not the exact paths.

## Compliance / Enforcement

- Import-boundary lint rules enforce the downward dependency direction: no
  feature-to-feature internal imports, no shared-to-feature dependency. Rules
  live in [engineering/FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)
  and [developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md).
- The [Architecture Checklist → Structure & boundaries](../engineering/ARCHITECTURE.md#architecture-checklist)
  gates every change on living in the correct layer, not importing another
  feature's internals, and promoting shared code rather than duplicating it.
- A discovered sideways or upward dependency is treated as a defect to fix by
  promotion, not a pattern to accept.

## Related Documents

- [ARCHITECTURE → §6 Application Structure](../engineering/ARCHITECTURE.md#6-application-structure)
- [engineering/FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)
- [developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md)
