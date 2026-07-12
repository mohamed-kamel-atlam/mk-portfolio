# Sprint 00 — Documentation Foundation

**Sprint:** 00
**Dates:** July 2026
**Milestone(s):** [M0 — Foundation & bootstrap](../product/ROADMAP.md) (documentation half)
**Status:** Complete
**Owner:** Mohamed Kamel

---

## Goals

Establish the **complete documentation foundation** before any implementation
begins, in accordance with the project's Documentation-Driven and
Architecture-First philosophy
([ROADMAP → Delivery Philosophy](../product/ROADMAP.md);
[ARCHITECTURE → §2, Principle 1](../engineering/ARCHITECTURE.md)).

Concretely, this sprint commits to three outcomes:

1. Author the keystone [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) and the
   product, design, engineering, developer, decision, journal, and reference
   documents that frame every subsystem — enough that no implementation
   milestone (M1+) starts without its governing document in place.
2. Lock the foundational architectural decisions as a canonical
   [ADR](../adr/README.md) set, so that M1+ builds on settled ground.
3. Stand up this development journal ([FR-015](../product/PRODUCT_REQUIREMENTS.md))
   so the build is recorded from its first sprint.

No application code is a goal of this sprint. Per the roadmap, M0's *bootstrap*
half (running App Router skeleton, tooling) follows the documentation half and
is recorded in the next sprint.

---

## Scope

**In scope.** Documentation only:

- Product: [ROADMAP.md](../product/ROADMAP.md),
  [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) (alongside the existing
  [PROJECT_VISION.md](../product/PROJECT_VISION.md),
  [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md),
  [BRAND.md](../product/BRAND.md)).
- Design: tokens, color, typography, motion, and component-philosophy documents
  under [`docs/design/`](../design/DESIGN_LANGUAGE.md).
- Engineering: the keystone [ARCHITECTURE.md](../engineering/ARCHITECTURE.md)
  plus the folder-structure, rendering-strategy, state-management,
  data-fetching, internationalization, performance, accessibility, SEO,
  development-guidelines, AI-repository-context, and AI-workflow documents.
- Developer: component catalog, content model, MDX pipeline, and coding
  standards.
- Decisions: the [six canonical ADRs](../adr/README.md).
- References: the [inspiration](../references/inspiration.md),
  [books](../references/books.md), and [articles](../references/articles.md)
  catalog.
- This journal: its [README](./README.md) and this entry.

**Out of scope (deferred by design).** All application code; the M0 tooling
bootstrap; and any *detailed* subsystem document whose milestone has not begun —
these are written just-in-time ([ROADMAP → Delivery Philosophy §3](../product/ROADMAP.md)),
so their files may exist as forward-referenced stubs but their full content
lands with their milestone. Closing a deferred stack decision
([ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md)) early was explicitly out
of scope.

---

## Work Completed

The documentation foundation was authored as a connected graph rooted at the
keystone architecture. Delivered this sprint:

**Product**
- [ROADMAP.md](../product/ROADMAP.md) — the M0–M9 delivery sequence, release-phase
  mapping, and risk mitigations.
- [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) — the qualitative brand
  ambitions and NFR targets turned into measurable KPIs.

**Design**
- Design-token, color-system, typography, motion-guidelines, and
  component-philosophy documents establishing the dark-first, token-driven
  visual system that M1 implements.

**Engineering**
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — the keystone overview:
  quality attributes (QAT-1..QAT-7), architectural principles, system
  boundaries, the server-first rendering model, the four-layer feature
  structure, the state hierarchy, content architecture, and the request
  lifecycle.
- The subsystem frame documents — folder structure, rendering strategy, state
  management, data fetching, internationalization, performance, accessibility,
  and SEO — plus [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md),
  the AI repository-context file, and
  [AI_WORKFLOW.md](../engineering/AI_WORKFLOW.md).

**Developer**
- Component catalog, content model, MDX pipeline, and coding-standards documents
  defining how content becomes typed, validated build-time data and how
  components are authored.

**Decisions**
- The [six canonical ADRs](../adr/README.md): App Router, Feature Architecture,
  Tailwind + tokens, Internationalization, Theme System, Rendering Strategy.

**References**
- The [references section](../references/README.md): curated
  [inspiration](../references/inspiration.md), [books](../references/books.md),
  and [articles](../references/articles.md).

**Journal**
- This journal system ([README](./README.md)) and this SPRINT-00 entry.

Verification: the M0 documentation exit criterion in
[ROADMAP → Milestones](../product/ROADMAP.md) — "Foundation docs authored" — is
met. The graph is internally consistent: every subsystem named in the keystone
resolves to a governing document, and terminology (QAT-*, the Server→URL→Local→
Global hierarchy) is used uniformly.

---

## Decisions

The locked decisions of this sprint, each summarized with a pointer to its
authoritative record. The journal does not restate the rationale — the ADR or
strategy document holds it.

| Decision | Summary | Record |
| --- | --- | --- |
| Next.js **App Router** | Mandated framework and routing; provides Server Components, streaming, and the Metadata API required by QAT-1/QAT-6. | [ADR-0001](../adr/ADR-0001-App-Router.md) |
| **Feature-based architecture** | Code organized by feature domain with inward/downward dependency boundaries, not by technical type. | [ADR-0002](../adr/ADR-0002-Feature-Architecture.md) |
| **Tailwind + design tokens** | Token-driven utility styling; no hardcoded design values, enforcing consistency (QAT-7). | [ADR-0003](../adr/ADR-0003-Tailwind.md) |
| **Internationalization (en/ar, RTL)** | Locale-aware routing and direction-aware layout as a foundation, not a retrofit. | [ADR-0004](../adr/ADR-0004-Internationalization.md) |
| **Dark-first theme system** | Dark/light/system themes via tokens, with persistence and no flash of incorrect theme. | [ADR-0005](../adr/ADR-0005-Theme-System.md) |
| **Rendering strategy (RSC-first, static bias)** | Server Components by default; client islands at the leaves; static generation with streaming. | [ADR-0006](../adr/ADR-0006-Rendering-Strategy.md) |
| **State hierarchy** | Server → URL → Local → Global; global state requires documented justification. Recorded as a strategy document, not an ADR (ongoing practice, not a point-in-time choice). | [STATE_MANAGEMENT.md](../engineering/STATE_MANAGEMENT.md) |
| **Content as local MDX (no CMS in V1)** | Typed, validated, in-repo MDX + structured data. Recorded as a strategy document. | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) |
| **Deployment: Vercel** | First-class Next.js hosting — edge delivery, image optimization, preview deployments. | [ARCHITECTURE → §11](../engineering/ARCHITECTURE.md) |

Two decisions were deliberately **kept open** ([ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md)):
the global-state library and the animation library, to be closed in the
milestone that first requires them (M3+).

---

## Problems & Solutions

- **Reconciling ADR numbering to a canonical set.** Early drafts referenced ADRs
  inconsistently and pointed the decision index at a `docs/decisions/` directory.
  *Solution:* fixed the canonical decision set at exactly **six** ADRs
  (App Router, Feature Architecture, Tailwind, Internationalization, Theme
  System, Rendering Strategy) under `docs/adr/`, and demoted the two ongoing
  practices (state hierarchy, local MDX) to **strategy documents** rather than
  ADRs — they describe standing practice, not a single point-in-time choice.
  This is captured in [ARCHITECTURE → §12](../engineering/ARCHITECTURE.md) and
  its revision history.

- **Avoiding documentation duplication.** With many documents describing one
  system, the same fact risked being stated — and later diverging — in several
  places. *Solution:* adopted a strict **frame-vs-detail responsibility
  boundary**: the keystone [ARCHITECTURE.md](../engineering/ARCHITECTURE.md)
  owns the frame and *names* each subsystem; each companion document owns its
  detail; the [PRD](../product/PRODUCT_REQUIREMENTS.md) owns requirements; the
  [ROADMAP](../product/ROADMAP.md) owns sequence. Every document references the
  others by identifier instead of restating them.

- **Deciding how much to document now versus later.** The Architecture-First
  principle pulls toward documenting everything up front; the just-in-time
  principle pushes back. *Solution:* split each subsystem into *frame* (written
  now, because it constrains everything) and *detail* (written in its milestone,
  because it drifts if written early), per
  [ROADMAP → Delivery Philosophy §3](../product/ROADMAP.md). Deferred stack
  decisions were recorded *as deferred* rather than closed.

- **Journal location discrepancy.** The existing [ROADMAP.md](../product/ROADMAP.md)
  links the journal at `docs/product/journal/`, while the documentation
  structure places top-level sections (`engineering/`, `design/`, `product/`,
  `developer/`, `adr/`) as siblings under `docs/`. *Solution:* the journal was
  placed at the top level (`docs/journal/`) for structural consistency with its
  peers; the ROADMAP cross-reference is flagged for reconciliation in the next
  documentation pass.

---

## Lessons Learned

- **The frame-vs-detail split is the load-bearing idea.** Deciding *what altitude
  each document owns* did more to prevent contradiction than any amount of
  careful wording. It is worth stating that boundary explicitly in every new
  document's Scope section.
- **Deferring is a decision, and must be recorded as one.** Writing down *why* a
  choice is open (state library, animation library) is as valuable as writing
  down a closed one — it stops an accidental choice in code from becoming a de
  facto architecture.
- **Identifiers are infrastructure.** Stable, permanent identifiers (QAT-*n*,
  ADR-000*n*, FR-0*nn*, M*n*, SPRINT-*nn*) make cross-referencing cheap and
  refactoring safe. The one-hour cost of standardizing them paid for itself
  immediately.
- **Terminology discipline compounds.** Fixing a single vocabulary
  (Server/Client Component; Server→URL→Local→Global) once, in the keystone, kept
  every downstream document coherent for free.

---

## Retrospective

**What went well.** The documentation graph is coherent and genuinely usable as
a starting point for implementation — a reader can trace any subsystem from the
keystone to its governing document without a dead end. The Architecture-First
ordering proved its worth: locking the six ADRs and the two strategy documents
removed the largest sources of future rework before a line of code exists.

**What did not go as well.** ADR numbering and the decision-index location
churned before settling, costing a revision cycle (visible in the
[ARCHITECTURE revision history](../engineering/ARCHITECTURE.md)). The
journal-location discrepancy with the ROADMAP is an unresolved cross-reference.
Both are symptoms of authoring several documents in parallel before the
structure was fully frozen.

**What changes next sprint.** Freeze the canonical `docs/` structure and the
identifier scheme *first*, then author within it, to avoid retroactive
renumbering. Add a lightweight cross-reference check to catch broken or
inconsistent links (like the journal path) before a sprint closes.

---

## Next Sprint

**Sprint 01 — M0 bootstrap → M1 design-system core**, per
[ROADMAP → Milestones](../product/ROADMAP.md):

1. **Finish M0 (bootstrap half).** Stand up the App Router project skeleton with
   the four-layer folder structure and import boundaries
   ([FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)), TypeScript, and
   lint tooling green — meeting the remaining M0 exit criteria.
2. **Begin M1 (design-system core).** Make the dark-first, token-driven theme
   system real and enforceable: all design values resolve to tokens; dark/light/
   system themes switch with persistence and no flash; Tailwind wired to the
   token layer ([ADR-0003](../adr/ADR-0003-Tailwind.md),
   [ADR-0005](../adr/ADR-0005-Theme-System.md)).

**Open questions carried forward.** Reconcile the journal path with
[ROADMAP.md](../product/ROADMAP.md); confirm the [TypeScript assumption](../engineering/ARCHITECTURE.md)
with the owner; and decide the timing of the testing strategy
([ARCHITECTURE → Engineering Notes](../engineering/ARCHITECTURE.md)).

---

## Related Documents

- [journal/README.md](./README.md) — the journal system and this entry's template.
- [ROADMAP.md](../product/ROADMAP.md) — the milestone plan this sprint executes against.
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — the keystone authored this sprint.
- [adr/README.md](../adr/README.md) — the six canonical ADRs locked this sprint.
- [PRODUCT_REQUIREMENTS.md → FR-015](../product/PRODUCT_REQUIREMENTS.md) — the journal requirement.
