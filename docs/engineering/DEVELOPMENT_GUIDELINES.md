# Development Guidelines

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines *how work moves* on this project — the engineering
workflow that takes a feature from an idea to a production-ready, documented
result. It is the process companion to [ARCHITECTURE.md](./ARCHITECTURE.md):
the architecture defines *what* the system is and *why*; this document defines
the *loop* every contribution runs through to keep that system coherent.

It exists because the portfolio's credibility rests on its process as much as
its output. The site publishes its own engineering practice as first-class
content ([PRD → FR-006](../product/PRODUCT_REQUIREMENTS.md)); the way features
are built here *is* part of the product. A consistent, documented workflow is
therefore not overhead — it is a deliverable.

---

## Scope

**In scope.** The end-to-end engineering process: the four working principles
and how they compose into a concrete loop; the sequence of documents to consult
when building a feature; the Definition of Ready and Definition of Done;
branching and commit expectations; code review and the automated quality gates
that guard `main`.

**Out of scope.** Concrete code style, naming, and file-level conventions —
those are owned by [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) and
are referenced, never restated, here. Subsystem detail (rendering, state, i18n,
performance) lives in the documents named in
[ARCHITECTURE.md → Dependencies](./ARCHITECTURE.md#dependencies). This document
routes you *to* those documents at the right moment; it does not duplicate them.

---

## Goals

- Make the default path the correct path: following the loop should naturally
  produce work that satisfies every quality attribute (QAT-1…QAT-7).
- Guarantee that no feature ships without meeting the PRD
  [Definition of Done](../product/PRODUCT_REQUIREMENTS.md).
- Keep documentation and code in lockstep, so the published engineering story
  is always true.
- Give AI-assisted contributions ([AI_WORKFLOW.md](./AI_WORKFLOW.md)) and human
  contributions one identical process to follow.

---

## Responsibilities

| Role | Responsibility in this workflow |
| --- | --- |
| **Owner (Mohamed)** | Approves architecture and product-scope changes; performs the human review of every change; manages version control (branching, commits, merges) manually; signs off Definition of Done. |
| **Contributor (human or AI agent)** | Runs the loop below; consults the governing documents in order; produces code *and* its documentation; ensures quality gates pass before requesting review. |
| **Documentation** | The single source of truth. When code and a governing document disagree, the disagreement is a defect to reconcile — not a decision to improvise ([ARCHITECTURE.md → Purpose](./ARCHITECTURE.md#purpose)). |

---

## Dependencies

This document derives from and must never contradict:

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the frame; the workflow enforces it.
- [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) — the Definition
  of Done and the functional requirements each feature traces to.
- [PROJECT_VISION.md](../product/PROJECT_VISION.md),
  [BRAND.md](../product/BRAND.md) — the quality bar and voice.

It coordinates with, and defers detail to:

- [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) — code-level rules.
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — how AI agents run this same loop.
- [CLAUDE.md](./CLAUDE.md) — the condensed operating context for AI agents.
- Subsystem documents: [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md),
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md),
  [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md),
  [DATA_FETCHING.md](./DATA_FETCHING.md),
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md),
  [PERFORMANCE.md](./PERFORMANCE.md), [ACCESSIBILITY.md](./ACCESSIBILITY.md),
  [SEO.md](./SEO.md), and the design and developer documents they reference.

---

## 1. The Working Loop

The project's method rests on four principles, drawn directly from the
[Architectural Principles](./ARCHITECTURE.md#2-architectural-principles). They
are not independent slogans; they compose into a single loop that every unit of
work runs through.

### 1.1 The four principles

1. **Documentation-Driven.** The governing document is written or updated
   *before* the code it governs. Building against a written decision is what
   makes the decision real; code written first turns an accident into a de
   facto architecture. Documentation is the shared context for humans and AI
   agents alike.

2. **Architecture-First.** Structural decisions precede implementation. Before
   writing a component you know which of the four layers it belongs to
   (routing, feature, shared, content), which cross-cutting concerns apply, and
   which locked decision (ADR-0001…ADR-0006) constrains it. A missing decision
   is *deferred explicitly*, never resolved silently in code.

3. **Incremental.** Work is delivered in small, coherent, shippable slices.
   Each slice is production-ready on its own — not a fragment behind a flag
   waiting for three more slices to become useful. Small slices keep review
   honest and the performance budget observable.

4. **Just-in-Time.** Detail is documented at the milestone that first needs it,
   not speculatively. A subsystem document written far ahead of its
   implementation drifts before it is ever used
   ([ARCHITECTURE.md → Common Mistakes](./ARCHITECTURE.md#common-mistakes)).
   Just-in-Time applies to *depth*, not *existence*: the frame always exists;
   the detail arrives on demand.

### 1.2 The loop

```
   ┌─────────────────────────────────────────────────────────────┐
   │  1. FRAME    Locate the work in the architecture.            │
   │              Which layer? Which QATs? Which ADR? Which        │
   │              functional requirement (FR-xxx) does it serve?   │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  2. DOCUMENT Write/adjust the governing doc first. If a       │
   │              decision is missing, decide + record it (ADR or  │
   │              strategy doc) or defer it explicitly.            │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  3. BUILD    Implement the smallest shippable slice, server-  │
   │              first, tokens-only, locale- & theme-aware from   │
   │              line one. Follow CODING_STANDARDS.md.            │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  4. VERIFY   Run the quality gates (§5). Walk the             │
   │              Architecture Checklist and the Definition of Done│
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  5. REVIEW   Owner reviews code + docs together. Approved     │
   │              work is committed to version control manually.   │
   └───────────────────────────┬─────────────────────────────────┘
                               ▼
                     (repeat for the next slice)
```

The loop is deliberately identical whether the contributor is a person or an AI
agent. [AI_WORKFLOW.md](./AI_WORKFLOW.md) describes how an agent occupies steps
1–4 while the owner retains step 5.

---

## 2. Building a Feature End to End

This is the concrete reading order for a new feature. Each step names the
document that governs it, so the workflow doubles as a navigation map.

**Step 1 — Frame the feature.**
Start at [ARCHITECTURE.md](./ARCHITECTURE.md). Confirm the feature sits inside
the [system boundaries](./ARCHITECTURE.md#3-system-context--boundaries) (nothing
from the non-goals list — no auth, backend, CMS, payments). Identify the
functional requirement it satisfies in
[PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) (e.g. FR-005
Projects). A feature with no backing requirement is scope creep and stops here.

**Step 2 — Place it in the structure.**
Consult [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md). Decide which of the four
layers each piece belongs to. Feature code lives under its own feature domain;
a feature never imports another feature's internals. Anything genuinely shared
is promoted to the shared layer *deliberately*, not copied.

**Step 3 — Decide the rendering & data shape.**
Consult [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) and
[DATA_FETCHING.md](./DATA_FETCHING.md). Default to a Server Component. Reach for
`"use client"` only when interactivity, browser APIs, state, or effects force
it — and push that boundary to the leaves. Read content directly on the server.

**Step 4 — Decide state placement.**
Consult [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) and the
[state hierarchy](./ARCHITECTURE.md#7-state-management-model): **Server → URL →
Local → Global**. Use the highest level that works. Global state is used *only*
with a documented justification (and an ADR where it alters the architecture).
Never assume a global-state library exists — none is part of the decided stack.

**Step 5 — Style it through tokens.**
Consult [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md),
[COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md), and the
[DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md). Every color, spacing, radius,
shadow, typography, and motion value resolves to a token. No hardcoded design
values, ever. Build for dark, light, and system themes at once.

**Step 6 — Make it localized and accessible.**
Consult [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) and
[ACCESSIBILITY.md](./ACCESSIBILITY.md). Build EN/AR and LTR/RTL from the first
draft — retrofitting direction is the most expensive avoidable rework on this
project. Semantic HTML, keyboard support, visible focus, reduced-motion.

**Step 7 — Make it findable.**
Consult [SEO.md](./SEO.md). Emit localized metadata via the Metadata API,
Open Graph, structured data, and correct canonical URLs.

**Step 8 — Honor the performance budget.**
Consult [PERFORMANCE.md](./PERFORMANCE.md). Minimal client JavaScript, optimized
images via `next/image`, streaming where it helps. Performance outranks visual
effect ([PRD → Product Principles](../product/PRODUCT_REQUIREMENTS.md)).

**Step 9 — Model any content.**
If the feature introduces content, consult
[CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) and
[MDX_PIPELINE.md](../developer/MDX_PIPELINE.md). Content is typed, validated,
in-repo MDX and structured data — never prose embedded in components, and no CMS
in Version 1.

**Step 10 — Write the code.**
Now, and only now, apply [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md)
for naming, structure, and style. The architecture is already decided; this step
is disciplined execution, not discovery.

**Step 11 — Record the journey.**
Capture planning, problems, solutions, and lessons in the
[development journal](../journal/README.md)
([PRD → FR-015](../product/PRODUCT_REQUIREMENTS.md)). The journey is content.

---

## 3. Definition of Ready

A unit of work is **Ready** to start when all of the following hold. The DoR
protects the loop from beginning on unstable ground.

- [ ] It traces to a functional requirement in
      [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md), or to an
      explicit owner directive.
- [ ] It sits inside the system boundaries — nothing from the
      [non-goals](./ARCHITECTURE.md#32-non-goals-out-of-scope).
- [ ] Its layer and feature placement are clear
      ([FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)).
- [ ] The governing document exists (or is written as step 2 of the loop). Any
      new architectural decision has an ADR, or a deliberate deferral, on
      record.
- [ ] The slice is small enough to ship on its own and to review in one sitting.
- [ ] Acceptance is expressible in terms of the Definition of Done below.

---

## 4. Definition of Done

A feature is **Done** only when it satisfies every criterion in the
[PRD → Definition of Done](../product/PRODUCT_REQUIREMENTS.md). This document
does not invent a competing standard; it operationalizes that one and binds each
criterion to the concern that owns it.

| PRD criterion | What it means here | Governing document |
| --- | --- | --- |
| ✓ **Responsive** | Correct across every breakpoint (mobile → wide). | [DESIGN_SYSTEM.md → Breakpoints](../design/DESIGN_SYSTEM.md) |
| ✓ **Accessible** | WCAG AA: semantic HTML, keyboard, visible focus, reduced motion (QAT-2). | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| ✓ **Localized** | EN + AR, LTR + RTL, localized routes and metadata (QAT-5). | [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |
| ✓ **Theme Compatible** | Dark, light, system via tokens; no flash of incorrect theme. | [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [ADR-0005](../adr/ADR-0005-Theme-System.md) |
| ✓ **Performance Optimized** | Within the budget; minimal client JS; Lighthouse ≥ 95 intent (QAT-1). | [PERFORMANCE.md](./PERFORMANCE.md) |
| ✓ **SEO Ready** | Server-rendered HTML, localized metadata, structured data (QAT-6). | [SEO.md](./SEO.md) |
| ✓ **Fully Documented** | Governing docs updated; component documented; journey recorded. | this doc, [journal/README.md](../journal/README.md) |
| ✓ **Production Ready** | Passes every quality gate (§5); reviewed and approved by the owner. | §5, §6 |

"Documented" is a first-class exit criterion, not a courtesy. A feature whose
code is complete but whose governing document is stale is **not Done**.

---

## 5. Quality Gates

These gates guard `main`. They express *intent* now; the concrete tooling is
selected just-in-time and recorded in [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md)
and [PERFORMANCE.md](./PERFORMANCE.md) as it lands. A change that fails any gate
is not ready for review.

| Gate | Intent | Blocking? |
| --- | --- | --- |
| **Lint** | Code obeys the project style and boundary rules (including feature-import boundaries). | Yes |
| **Type check** | TypeScript compiles with no errors; no `any` escapes at boundaries. | Yes |
| **Build** | The production build succeeds; content frontmatter validates — invalid content fails the build rather than shipping broken pages. | Yes |
| **Accessibility** | Automated a11y checks plus manual keyboard and reduced-motion verification (QAT-2). | Yes |
| **Performance / Lighthouse** | Meets the [PERFORMANCE.md](./PERFORMANCE.md) budget; Lighthouse ≥ 95 target (QAT-1). Verified on a Vercel preview deployment. | Yes |

Automated gates are necessary but not sufficient: they cannot judge whether the
work respects the architecture. That judgment is the human review in §6, backed
by the [Architecture Checklist](#8-architecture-checklist).

---

## 6. Review, Branching & Commit Hygiene

### 6.1 Version control is owner-managed

The **owner manages version control manually** — branching, commit authoring,
and merges to `main` are performed by Mohamed, not automated by contributors or
AI agents. Contributors (including AI agents) prepare and stage changes and
their documentation; they do **not** run git operations on the owner's behalf.

### 6.2 Expectations

- **Branching.** Work happens on a focused branch per slice, off `main`. One
  slice, one coherent change set — do not bundle unrelated work.
- **Commits.** Small, atomic, and self-describing. A commit message states
  *why* the change exists, not merely *what* changed, and references the
  functional requirement or ADR it serves. `main` stays releasable at all times.
- **Previews.** Every branch produces a Vercel preview deployment; review and
  the performance gate run against that preview, not a local machine only.

### 6.3 Code review

Review is where the architecture is defended. Every change is reviewed by the
owner against three questions, in order:

1. **Is it architecturally sound?** Correct layer, no cross-feature coupling,
   server-first, correct state level, tokens throughout — the
   [Architecture Checklist](#8-architecture-checklist).
2. **Is it Done?** Every [Definition of Done](#4-definition-of-done) criterion
   met, including documentation.
3. **Is it well-made code?** Naming, clarity, and style per
   [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md).

A review that only reads the diff and skips the checklist has skipped the point.

---

## Engineering Decisions

- **v1.0.0 — The loop is mandatory and identical for humans and AI.** A single
  process removes ambiguity about how AI-assisted work is held to the same bar
  as human work, satisfying the PRD's "AI-Assisted Development" and production
  quality objectives. Alternative — a separate, lighter AI track — was rejected
  as a path to two quality bars and eventual drift.
- **v1.0.0 — Definition of Done is inherited, not redefined.** This document
  binds the PRD's eight criteria to their governing documents rather than
  authoring a parallel checklist, preserving a single source of truth.
- **v1.0.0 — Version control stays owner-managed.** Contributors prepare
  changes; the owner commits and merges. This keeps history curated and
  authorship accurate, and it makes step 5 of the loop a deliberate human gate.
- **v1.0.0 — Quality gates state intent, defer tooling.** Naming specific tools
  now would contradict the Just-in-Time principle and the
  [deferred-decisions](./ARCHITECTURE.md#42-deliberately-deferred) posture on
  testing tooling. The gates' *purpose* is fixed; their *implementation* lands
  with the milestone that needs it.

---

## Best Practices

- **Run the loop in order.** Framing before documenting, documenting before
  building, verifying before review. Skipping a step is how architecture erodes.
- **Read the governing document before touching its subsystem.** The reading
  order in §2 is the fast path, not bureaucracy.
- **Ship the smallest coherent slice.** Small slices keep the performance budget
  and the review honest.
- **Update the doc in the same change as the code.** Documentation and code move
  together or they rot apart.
- **Prefer the simpler solution when in doubt**
  ([ARCHITECTURE.md → Principle 8](./ARCHITECTURE.md#2-architectural-principles))
  — the direct guard against overengineering.
- **Escalate, don't improvise.** A missing decision is surfaced to the owner and
  recorded, never invented in code.

---

## Common Mistakes

- **Code before decision.** Implementing first and back-filling the document,
  inverting the Documentation-Driven principle.
- **Treating "Done" as "code works."** Shipping without localization, theming,
  a11y, SEO, or updated docs — none of which are optional.
- **Big-bang slices.** A change too large to review in one sitting hides
  regressions and defeats incremental delivery.
- **AI agent runs git.** Committing or merging on the owner's behalf violates
  the owner-managed version-control rule (§6.1).
- **Skipping the checklist in review.** Reading only the diff misses the
  architectural questions that automated gates cannot answer.
- **Documenting ahead of need.** Writing deep subsystem detail before its
  milestone, contrary to Just-in-Time.

---

## Examples

**A well-formed slice: "Add the project Tech Stack section" (serves FR-005).**

1. *Frame* — Feature layer, `projects` feature; serves
   [FR-005](../product/PRODUCT_REQUIREMENTS.md); inside boundaries.
2. *Document* — The Tech Stack shape already lives in the project content
   schema ([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)); no new decision,
   nothing to defer.
3. *Build* — A Server Component reads the validated frontmatter and renders a
   token-styled list. No `"use client"` — it is static. Labels are localized;
   layout is direction-aware.
4. *Verify* — Lint, types, build (content validates), a11y (list semantics,
   contrast), Lighthouse on the preview. Walk the Architecture Checklist.
5. *Review* — Owner confirms layer, tokens, localization, and that
   [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) still matches; approves;
   commits manually.

**A slice that must stop at framing:** "Add a login so visitors can save
projects." Authentication and user accounts are
[non-goals](./ARCHITECTURE.md#32-non-goals-out-of-scope). The work does not
start until the *product documentation* is amended — which is a product-scope
decision, not an engineering one.

---

## 7. Definition-of-Done Checklist

Copy this into the review of any feature. It is the operational form of §4.

- [ ] Traces to a functional requirement or owner directive.
- [ ] Responsive across all breakpoints.
- [ ] Accessible (WCAG AA: semantics, keyboard, focus, reduced motion).
- [ ] Localized (EN + AR, LTR + RTL, localized routes and metadata).
- [ ] Theme-compatible (dark, light, system) via tokens; no theme flash.
- [ ] Performance-optimized within budget; Lighthouse ≥ 95 on preview.
- [ ] SEO-ready (server HTML, localized metadata, structured data, canonical).
- [ ] Fully documented (governing docs updated; component documented; journey
      recorded).
- [ ] Passes every quality gate (§5).
- [ ] Production-ready and owner-approved.

---

## 8. Architecture Checklist

The workflow's architectural conscience is the single
[Architecture Checklist in ARCHITECTURE.md](./ARCHITECTURE.md#architecture-checklist).
It is **not** duplicated here — one checklist, one source of truth. Walk it in
step 4 (Verify) and again in step 5 (Review) of the loop. It covers rendering &
execution, structure & boundaries, state, design system, cross-cutting concerns,
and scope & documentation.

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the frame this workflow enforces.
- [CLAUDE.md](./CLAUDE.md) — condensed operating context for AI agents.
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — how AI agents run this loop.
- [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) — code-level rules.
- [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) — requirements
  and the Definition of Done.
- [journal/README.md](../journal/README.md) — the development journal.
- Subsystem documents: [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md),
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md),
  [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md),
  [DATA_FETCHING.md](./DATA_FETCHING.md),
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md),
  [PERFORMANCE.md](./PERFORMANCE.md), [ACCESSIBILITY.md](./ACCESSIBILITY.md),
  [SEO.md](./SEO.md).
