# Architecture Decision Records

**Status:** Living index
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This folder is the **canonical record** of the architecturally significant
decisions made for this portfolio. Each Architecture Decision Record (ADR)
captures one decision: the context that forced it, the option chosen, the
alternatives that were rejected, and the consequences the team agrees to live
with.

An ADR exists to answer a single question for a future reader — *"why is it
this way, and what else did we consider?"* — without requiring that reader to
find the person who made the call. The decision and its reasoning are recorded
at the moment they are made, while the trade-offs are still fresh, so that the
record is honest rather than reconstructed after the fact.

Two audiences depend on these records:

- **Engineers and AI-assisted contributions**, who must extend the system
  without silently re-litigating settled decisions or violating their
  constraints.
- **Visitors of the portfolio itself.** Recording engineering decisions is a
  product requirement, not just an internal hygiene practice: the
  [PRD → FR-007 Engineering Decisions](../product/PRODUCT_REQUIREMENTS.md) page
  ("Why Next.js", "Why Server Components", "Why Feature Architecture", "Why
  Tailwind") is the public-facing counterpart of this internal record. These
  ADRs are the source material that page is written from.

## This folder is canonical; §12 is a convenience index

The [Architecture Overview → §12 Key Architectural Decisions](../engineering/ARCHITECTURE.md#12-key-architectural-decisions)
table lists the same decisions, but it is explicitly a **convenience index** —
it links each decision to the sections of the overview that exercise it. The
full rationale, alternatives, and consequences live **here**. When the §12
table and this folder disagree, **this folder wins**; the discrepancy is a
defect to be reconciled, not a choice.

---

## What counts as an ADR

An ADR records a decision that is **architecturally significant**: it is
expensive to reverse, it constrains many future decisions, or it embodies a
non-obvious trade-off between the quality attributes in
[ARCHITECTURE → §1](../engineering/ARCHITECTURE.md#1-architectural-goals--quality-attributes)
(QAT-1 … QAT-7). A choice that is local, cheap to change, or self-evident does
not need a record.

### Decisions recorded as strategy documents, not ADRs

Two locked decisions surfaced in the architecture overview are deliberately
**not** ADRs. They define *ongoing practice* rather than a single
point-in-time choice, so they are maintained as living strategy documents:

| Decision | Recorded in | Overview section |
| --- | --- | --- |
| The state-management hierarchy (Server → URL → Local → Global) | [engineering/STATE_MANAGEMENT.md](../engineering/STATE_MANAGEMENT.md) | [§7](../engineering/ARCHITECTURE.md#7-state-management-model) |
| Content as local MDX + structured data (no CMS in Version 1) | [developer/CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) | [§8](../engineering/ARCHITECTURE.md#8-content-architecture) |

A concrete future choice *within* those strategies — for example adopting a
specific global-state library because the hierarchy proved a genuine global
need — would itself be recorded as a new ADR at that time.

---

## Numbering

- ADRs are numbered sequentially and zero-padded: `ADR-0001`, `ADR-0002`, …
- **A number is permanent and is never reused.** Once assigned it belongs to
  that decision forever, even if the decision is later superseded.
- The file name is `ADR-000N-Short-Title.md`. The number orders the record; the
  title is a human hint, not an identifier.
- Superseding a decision does **not** recycle its number. The old record stays,
  its status changes to `Superseded`, and a new record with the next free
  number takes over.

## Lifecycle

An ADR moves through a small, explicit set of states:

| Status | Meaning |
| --- | --- |
| **Proposed** | Drafted and under discussion; not yet binding. |
| **Accepted** | Signed off by the owner; binding on all subsequent work. |
| **Superseded** | Replaced by a later ADR. The record is retained for history and links forward to its replacement (`Superseded by ADR-00NN`). |

Records are **append-only in spirit**: an Accepted decision is not edited to say
something different. When reality changes, a new ADR supersedes the old one, so
the history of *why the system is the way it is* remains legible. Every ADR in
this folder is currently **Accepted** and dated July 2026.

---

## ADR template

Every record in this folder uses the following structure. Copy it verbatim when
adding a new ADR.

```markdown
# ADR-000N: <Title>

**Status:** Proposed | Accepted | Superseded by ADR-00NN
**Date:** <Month Year>
**Deciders:** <names>
**Related:** <links to ADRs and governing documents>

## Context
The forces at play: the requirement, the constraint, the quality attributes in
tension. Why a decision is needed now.

## Decision
The option chosen, stated plainly in one or two sentences, then elaborated.

## Rationale (Why)
Why this option best serves the drivers. WHY before HOW.

## Alternatives Considered
Each realistic alternative, with an honest account of why it was rejected.

## Consequences
### Positive
### Negative
### Neutral

## Compliance / Enforcement
How we keep the codebase faithful to this decision (review, lint, CI, docs).

## Related Documents
Links to the governing detail documents and related ADRs.
```

Notes on filling it in:

- **WHY before HOW.** Rationale explains the trade-off; it does not restate the
  decision.
- **Honest alternatives.** Every rejected option must be one a competent
  engineer would genuinely consider, with a real reason for rejection — not a
  straw man.
- **Reference, do not repeat.** Link to the authoritative detail document rather
  than duplicating its content; duplication is how documentation rots.

---

## Index

The six records below are the **canonical decision set** for the current phase.

| ADR | Title | Status | Summary |
| --- | --- | --- | --- |
| [ADR-0001](./ADR-0001-App-Router.md) | Next.js App Router | Accepted | Build on Next.js with the App Router for Server Components, streaming, the Metadata API, and file-system routing. |
| [ADR-0002](./ADR-0002-Feature-Architecture.md) | Feature-Based Architecture | Accepted | Organize code by feature domain across four layers (routing → feature → shared/content) with dependencies pointing downward only. |
| [ADR-0003](./ADR-0003-Tailwind.md) | Tailwind CSS Driven by Design Tokens | Accepted | Style with Tailwind bound to design tokens; no design value is hardcoded in a component. |
| [ADR-0004](./ADR-0004-Internationalization.md) | Internationalization Approach | Accepted | Path-prefixed locale routing via `app/[locale]/` for `en` (LTR default) and `ar` (RTL), with dictionary translations, localized metadata + hreflang, and detection with user override. |
| [ADR-0005](./ADR-0005-Theme-System.md) | Theme System | Accepted | Dark-first theming (dark / light / system) expressed entirely through semantic tokens, persisted, with no flash of incorrect theme. |
| [ADR-0006](./ADR-0006-Rendering-Strategy.md) | Rendering Strategy | Accepted | Server-first React Server Components, static by default with streaming and Suspense, client islands only at the leaves. |

---

## Related Documents

- [Architecture Overview](../engineering/ARCHITECTURE.md) — the keystone frame these decisions detail; canonical index is §12.
- [Product Requirements → FR-007 Engineering Decisions](../product/PRODUCT_REQUIREMENTS.md) — the public-facing counterpart of this record.
- [engineering/STATE_MANAGEMENT.md](../engineering/STATE_MANAGEMENT.md), [developer/CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) — decisions recorded as strategy documents rather than ADRs.
