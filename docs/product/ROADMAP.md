# Delivery Roadmap

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document is the delivery roadmap: the ordered, milestone-based plan for
*building* the portfolio. It translates the phasing in the
[Product Requirements](./PRODUCT_REQUIREMENTS.md) (MVP / Version 2 / Version 3)
into an implementation sequence with explicit goals, scope, document
dependencies, and exit criteria per milestone.

It answers *in what order, and against what proof of completion* the product is
built. It does **not** restate what the product does — the functional
requirements are owned by the PRD and are referenced here by identifier
(e.g. FR-003), never duplicated.

---

## Scope

**In scope.** The build sequence (milestones M0–M9), the mapping of those
milestones onto the PRD's release phases, the post-MVP backlog, and the roadmap
risks with their mitigations.

**Out of scope.** Functional and non-functional requirement definitions (owned
by the [PRD](./PRODUCT_REQUIREMENTS.md)); architectural decisions (owned by
[ARCHITECTURE.md](../engineering/ARCHITECTURE.md) and the
[ADRs](../adr/README.md)); measurable targets (owned by
[SUCCESS_METRICS.md](./SUCCESS_METRICS.md)); and per-sprint execution detail
(owned by the [development journal](../journal/README.md), per
[PRD → FR-015](./PRODUCT_REQUIREMENTS.md)).

---

## Goals

- Give every contributor — human or AI-assisted — a single, ordered view of
  what is built when, and why that order.
- Make each milestone independently verifiable through explicit exit criteria,
  so "done" is never a judgment call.
- Keep documentation and implementation in lockstep, so no subsystem is built
  ahead of its governing document or documented ahead of its need.
- Protect the release against the [PRD → Risks](./PRODUCT_REQUIREMENTS.md) by
  sequencing foundational, cross-cutting work before feature work.

---

## Dependencies

| Source | Role in this document |
| --- | --- |
| [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) | Defines the layers, milestones referenced in its subsystem docs, and the Architecture-First philosophy this sequence obeys. Keystone; never contradicted. |
| [PROJECT_VISION.md](./PROJECT_VISION.md) | Product intent and the *Production-Ready Mindset* / *Architecture-First* principles behind the delivery philosophy. |
| [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) | The functional requirements, release phases (MVP/V2/V3), and risks this roadmap sequences. |
| [BRAND.md](./BRAND.md) | The quality bar each milestone's exit criteria must protect. |

---

## Delivery Philosophy

The roadmap is not merely a schedule; it is the operational form of three
principles inherited from the architecture and the vision. The order of the
milestones *is* an engineering decision.

### 1. Documentation-Driven Development

Documentation is part of the product, not a byproduct of it
([PROJECT_VISION → Product Identity](./PROJECT_VISION.md);
[PRD → Product Scope](./PRODUCT_REQUIREMENTS.md) lists *Documentation* and
*AI Workflow* as first-class deliverables). A subsystem is documented *before*
it is built: the document defines the frame, the code fills in the detail. This
is why M0 — the documentation foundation — precedes all implementation, and why
every later milestone lists the documents it depends on as a hard input.

### 2. Architecture First

Structural and cross-cutting decisions precede feature work
([ARCHITECTURE → §2, Principle 1](../engineering/ARCHITECTURE.md)). Concerns
that are expensive to retrofit — the design-token system, locale- and
direction-awareness, the rendering model — are established as foundations
(M1–M4) before the first page is composed (M5). Building a feature on an
unsettled foundation is the rework this ordering exists to prevent.

### 3. Incremental & Just-in-Time Documentation

Detailed subsystem documentation is written in the milestone that first needs
it, not speculatively up front
([ARCHITECTURE → Common Mistakes: "Documenting ahead of need"](../engineering/ARCHITECTURE.md)).
The keystone architecture and this roadmap exist now because they frame
everything; `RENDERING_STRATEGY.md` waits for M5, `CONTENT_MODEL.md` for M4, and
so on. Documents that arrive before their milestone drift before they are ever
used.

---

## Milestones

The implementation sequence is a chain: each milestone establishes a foundation
the next depends on. Cross-cutting concerns (internationalization, theming,
accessibility, performance, SEO) are built into every milestone from M1
onward per the [architecture's cross-cutting model](../engineering/ARCHITECTURE.md),
not bolted on at the end. The [Definition of Done](./PRODUCT_REQUIREMENTS.md)
applies to every user-facing deliverable in every milestone.

| # | Milestone | Goal | Scope (PRD refs) | Key document dependencies | Exit criteria |
| --- | --- | --- | --- | --- | --- |
| **M0** | Foundation & bootstrap | Establish the documentation foundation and a running, tooled, empty application skeleton. | Repository, tooling, and folder skeleton (no FRs — infrastructure); enables [Maintainability NFRs](./PRODUCT_REQUIREMENTS.md). | [ARCHITECTURE.md](../engineering/ARCHITECTURE.md), [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md), [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md), [ADR-0001](../adr/ADR-0001-App-Router.md), [ADR-0002](../adr/ADR-0002-Feature-Architecture.md) | Foundation docs authored; App Router project builds and runs; four-layer folder structure and import boundaries in place; TypeScript and lint tooling green. |
| **M1** | Design system core | Make the token-driven, dark-first theme system real and enforceable. | [FR-002](./PRODUCT_REQUIREMENTS.md) (Theme System); [Consistency NFR](./PRODUCT_REQUIREMENTS.md). | [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md), [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md), [TYPOGRAPHY.md](../design/TYPOGRAPHY.md), [ADR-0003](../adr/ADR-0003-Tailwind.md), [ADR-0005](../adr/ADR-0005-Theme-System.md) | All design values resolve to tokens; dark/light/system themes switch with persistence and no flash; Tailwind wired to the token layer. |
| **M2** | Routing & i18n | Establish locale-aware routing and RTL as foundations, not retrofits. | [FR-001](./PRODUCT_REQUIREMENTS.md) (Internationalization). | [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md), [ADR-0001](../adr/ADR-0001-App-Router.md), [ADR-0004](../adr/ADR-0004-Internationalization.md) | `en` and `ar` locales resolve and route; document direction flips to RTL for Arabic; localized metadata scaffolding in place; language switcher works. |
| **M3** | Shared UI & app shell | Build the shared component library, navigation, and the motion system's runtime. | [FR-002](./PRODUCT_REQUIREMENTS.md) (theme toggle); app shell serving [FR-003](./PRODUCT_REQUIREMENTS.md). | [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md), [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md), [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md), [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) | Shared UI primitives are reusable, typed, accessible, and theme-/locale-aware; animation library selected (per [ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md)); header, footer, and navigation composed from the shell. |
| **M4** | Content engine (MDX) | Turn content into typed, validated, build-time data. | Content foundation for [FR-005](./PRODUCT_REQUIREMENTS.md), [FR-015](./PRODUCT_REQUIREMENTS.md); documentation-as-content. | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md), [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md), [DATA_FETCHING.md](../engineering/DATA_FETCHING.md), [ADR-0006](../adr/ADR-0006-Rendering-Strategy.md) | Content schemas defined and frontmatter validated at build; invalid content fails the build; MDX renders through the shared pipeline for all content types. |
| **M5** | Landing page | Compose the first full page and lock the rendering strategy. | [FR-003](./PRODUCT_REQUIREMENTS.md) (Hero, Selected Projects, Engineering Philosophy, Technologies, CTA). | [RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md), [DESIGN_LANGUAGE.md](../design/DESIGN_LANGUAGE.md), [BRAND.md](./BRAND.md) | Landing page renders server-first with streaming; passes the [Definition of Done](./PRODUCT_REQUIREMENTS.md); meets the 10s "premium product" signal in [SUCCESS_METRICS.md](./SUCCESS_METRICS.md). |
| **M6** | Projects | Deliver the project showcase and rich project detail pages. | [FR-005](./PRODUCT_REQUIREMENTS.md) (Overview → Gallery), projects index. | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md), [RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md) | Projects list and detail pages are content-driven from the schema; every FR-005 section renders; statically generated per project; localized. |
| **M7** | About / Engineering / Journey | Ship the engineering-narrative pages and resume. | [FR-004](./PRODUCT_REQUIREMENTS.md), [FR-006](./PRODUCT_REQUIREMENTS.md), [FR-007](./PRODUCT_REQUIREMENTS.md), [FR-008](./PRODUCT_REQUIREMENTS.md). | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md), [AI_WORKFLOW.md](../engineering/AI_WORKFLOW.md) | About, Engineering, Engineering Decisions, and Journey pages ship as content; resume is downloadable; meets the 30s "understands engineering" signal. |
| **M8** | Contact | Deliver the one side-effecting flow with its security posture. | [FR-010](./PRODUCT_REQUIREMENTS.md) (form, links, resume download); [Security NFRs](./PRODUCT_REQUIREMENTS.md). | [ARCHITECTURE → §10 Security & Resilience](../engineering/ARCHITECTURE.md), [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md) | Contact form validates, sanitizes input, resists spam, and handles transmission/validation failure gracefully; GitHub/LinkedIn/email links present. |
| **M9** | Hardening & launch | Verify the whole against every non-functional target and ship. | All [Non-Functional Requirements](./PRODUCT_REQUIREMENTS.md); testing strategy. | [PERFORMANCE.md](../engineering/PERFORMANCE.md), [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md), [SEO.md](../engineering/SEO.md), [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) | All KPIs in [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) met; testing strategy in place; sitemap/robots/structured data/hreflang valid; production deploy on Vercel. |

> **Testing-strategy timing is an open question.** The
> [ARCHITECTURE → Engineering Notes](../engineering/ARCHITECTURE.md) flags
> whether the testing strategy should be pulled forward to "test-alongside"
> from the first shared component (M3) rather than living at M9. This roadmap
> places it at M9 by default but does not foreclose the earlier option; the
> decision awaits the owner and does not block any milestone.

---

## Mapping to Release Phases

The milestones map onto the [PRD](./PRODUCT_REQUIREMENTS.md) release phases as
follows. The entire M0–M9 chain constitutes the **MVP**; Version 2 and Version 3
are deferred backlogs, documented just-in-time when their milestone begins.

| PRD phase | Milestones | Delivers |
| --- | --- | --- |
| **MVP** | M0 → M9 | Landing, About, Projects, Engineering, Journey, Contact, Resume, English + Arabic, dark + light themes, SEO, responsive — the full [PRD → MVP](./PRODUCT_REQUIREMENTS.md) list. |
| **Version 2** | Post-MVP (see below) | [PRD → Version 2](./PRODUCT_REQUIREMENTS.md): Blog, Command Menu, Search, Analytics, Advanced Motion, Project Filters. |
| **Version 3** | Post-MVP (see below) | [PRD → Version 3](./PRODUCT_REQUIREMENTS.md): CMS, Admin Panel, AI Assistant, Interactive Demos, Project Analytics. |

> **M0 is currently in progress.** The documentation foundation — the keystone
> [ARCHITECTURE.md](../engineering/ARCHITECTURE.md), the product and design
> sources of truth, this roadmap, and its sibling foundation documents — is the
> M0 deliverable being authored now. No implementation milestone has begun.

---

## Post-MVP (Version 2 / Version 3)

These are recorded so the MVP scope stays honest — everything below is
explicitly **deferred**, and each item's detailed documentation is written in
the milestone that eventually implements it, not now. This is the primary
structural defense against the *scope creep* risk.

**Version 2 (enhancements on a shipped MVP)**

- **Command Menu — [FR-011](./PRODUCT_REQUIREMENTS.md).** CMD+K navigation,
  search, theme, and language. Depends on a stable route and content surface
  from the MVP.
- **Search — [FR-012](./PRODUCT_REQUIREMENTS.md).** Search across projects,
  articles, engineering notes, and case studies. Follows the content engine and
  the Blog.
- **Blog — [FR-009](./PRODUCT_REQUIREMENTS.md).** Technical articles across
  Frontend, Architecture, AI, Performance, Accessibility, and Learning Notes —
  built on the M4 content engine.
- **Playground — [FR-013](./PRODUCT_REQUIREMENTS.md).** Interactive
  demonstrations (streaming, Suspense, transitions, Server Actions, caching,
  rendering) embedded via MDX composition.
- **Performance Dashboard — [FR-014](./PRODUCT_REQUIREMENTS.md).** Surfacing
  Lighthouse, bundle size, Core Web Vitals, and scores — the public counterpart
  to [SUCCESS_METRICS.md](./SUCCESS_METRICS.md).
- **Analytics, Advanced Motion, Project Filters** — per
  [PRD → Version 2](./PRODUCT_REQUIREMENTS.md). Analytics is the privacy-
  respecting, deferred observability concern named in
  [ARCHITECTURE → §10](../engineering/ARCHITECTURE.md).

**Version 3 (platform evolution)**

- CMS, Admin Panel, AI Assistant, Interactive Demos, and Project Analytics per
  [PRD → Version 3](./PRODUCT_REQUIREMENTS.md). Introducing a CMS or admin
  surface changes the system boundary in
  [ARCHITECTURE → §3.2](../engineering/ARCHITECTURE.md) and must be reflected in
  the product documentation *before* it appears in the architecture.

---

## Risks

The [PRD → Risks](./PRODUCT_REQUIREMENTS.md) are the failure modes this roadmap
is sequenced to prevent. Each is mapped to a concrete mitigation in the plan.

| PRD risk | How the roadmap mitigates it |
| --- | --- |
| **Scope creep** | The MVP is fixed at M0–M9; every V2/V3 item is an explicitly deferred backlog entry. Anything outside the [system boundary](../engineering/ARCHITECTURE.md) requires a product-doc change first. |
| **Overengineering** | Just-in-time documentation and the *Simplicity when in doubt* principle ([ARCHITECTURE → §2.8](../engineering/ARCHITECTURE.md)) keep each milestone to what its FRs require. Deferred stack decisions ([ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md)) are not closed early. |
| **Excessive animations** | The motion *system* is token-based and the animation library is chosen at M3, governed by [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) and [BRAND → Motion Principles](./BRAND.md): motion serves usability, never decoration. |
| **Performance regression** | Server-first foundations land before features (M1–M4 precede M5); performance is a per-milestone Definition-of-Done gate, verified against the budgets in [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) and [PERFORMANCE.md](../engineering/PERFORMANCE.md), and hardened at M9. |
| **Inconsistent design** | The token-driven design system (M1) precedes all UI, and the shared component library (M3) precedes all pages, so consistency (QAT-7) is structural, not per-page discipline. |

---

## Best Practices

- **Respect the chain.** Do not start a milestone before its predecessors'
  exit criteria are met; the ordering encodes real dependencies.
- **Reference the PRD, never fork it.** Cite FRs by identifier; if a
  requirement seems wrong, amend the PRD rather than diverging in the plan.
- **Write the document, then the code.** A milestone's dependent documents are
  inputs, not deliverables produced afterward.
- **Treat exit criteria as gates.** A milestone is done when its criteria and
  the [Definition of Done](./PRODUCT_REQUIREMENTS.md) are met — not when the
  code "works."
- **Log the sprint, not the plan.** Per-sprint planning, problems, and
  retrospectives belong in the [journal](../journal/README.md) ([FR-015](./PRODUCT_REQUIREMENTS.md)); this roadmap changes only when the *sequence* changes.

---

## Common Mistakes

- **Building features on an unsettled foundation.** Composing pages (M5+) before
  tokens (M1), i18n (M2), and the content engine (M4) exist forces rework — the
  exact failure Architecture-First prevents.
- **Pulling V2/V3 work into the MVP.** "While we're here" additions are scope
  creep; they belong in the deferred backlog.
- **Documenting a milestone ahead of its turn.** Writing `RENDERING_STRATEGY.md`
  at M0 produces a document that drifts before M5 uses it.
- **Treating cross-cutting concerns as an M9 task.** Accessibility, i18n, and
  theming are per-milestone requirements from M1; M9 verifies them, it does not
  introduce them.
- **Redefining requirements here.** This document sequences the PRD; it does not
  own or alter functional requirements.

---

## Checklist

Use before declaring any milestone complete:

- [ ] All exit criteria for the milestone are met.
- [ ] The milestone's dependent documents existed *before* implementation began.
- [ ] Every user-facing deliverable satisfies the [Definition of Done](./PRODUCT_REQUIREMENTS.md).
- [ ] Cross-cutting concerns (i18n/RTL, theming, accessibility, SEO,
      performance) are satisfied, not deferred.
- [ ] No Version 2 / Version 3 scope leaked into the milestone.
- [ ] Any new architectural decision is recorded as an [ADR](../adr/README.md).
- [ ] The [journal](../journal/README.md) records the sprint(s) behind the
      milestone.

---

## Related Documents

- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — the frame this sequence obeys.
- [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) — the requirements and release phases sequenced here.
- [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) — the measurable targets each milestone's exit criteria protect.
- [PROJECT_VISION.md](./PROJECT_VISION.md) — the intent and principles behind the delivery philosophy.
- [BRAND.md](./BRAND.md) — the quality bar the exit criteria enforce.
- [journal/README.md](../journal/README.md) — per-sprint execution record ([FR-015](./PRODUCT_REQUIREMENTS.md)).
