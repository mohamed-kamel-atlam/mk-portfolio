# Development Journal

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **development journal**: the sprint-by-sprint record
of how the portfolio is actually built. It is the operational realization of
[PRD → FR-015 Development Journal](../product/PRODUCT_REQUIREMENTS.md), whose
requirement is to *document every sprint — planning, problems, solutions,
lessons, retrospectives*.

The journal exists because this product's central claim is engineering
maturity, and maturity is proven by *how* decisions were made, not only by the
finished surface ([PROJECT_VISION → Product Identity](../product/PROJECT_VISION.md)).
The [ROADMAP.md](../product/ROADMAP.md) answers *in what order* the product is
built; the journal answers *what actually happened* in each increment — the
planning, the friction, the reasoning, and the retrospective. Together they are
the honest audit trail behind the public
[Engineering Journey](../product/PRODUCT_REQUIREMENTS.md) page
([FR-008](../product/PRODUCT_REQUIREMENTS.md)).

---

## Scope

**In scope.** The journal system itself: its purpose, cadence, structure, the
per-sprint file convention, the sprint entry template, and how the journal
relates to the public Engineering Journey page and to
[AI_WORKFLOW.md](../engineering/AI_WORKFLOW.md).

**Out of scope.** The individual sprint entries (each lives in its own
`SPRINT-NN.md` file); the delivery *sequence* and milestone exit criteria
(owned by [ROADMAP.md](../product/ROADMAP.md)); functional requirements (owned
by the [PRD](../product/PRODUCT_REQUIREMENTS.md)); and architectural decisions
(owned by [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) and the
[ADRs](../adr/README.md)). The journal *references* these by identifier; it
never restates or overrides them.

---

## Why a Journal (and not just commit history)

Git history records *what changed*; the journal records *why it changed and
what was learned*. A commit message is too small to hold a sprint's reasoning,
a rejected alternative, or a retrospective. The journal is the deliberate,
human-readable layer above the commit log:

- It preserves **decisions and their context** at the altitude a reader needs —
  linking to the [ADR](../adr/README.md) or strategy document that holds the
  full record, rather than duplicating it.
- It captures **problems and their solutions** while they are fresh, so lessons
  are not lost to memory.
- It makes the [PRD → Risks](../product/PRODUCT_REQUIREMENTS.md) — scope creep,
  overengineering — *observable*: a sprint that quietly grew is visible in its
  own retrospective.
- It is **content**. Per
  [ARCHITECTURE → §8 Content Architecture](../engineering/ARCHITECTURE.md),
  documentation is a content type; journal entries flow through the same MDX
  pipeline as projects and articles and surface publicly on the Engineering
  Journey.

---

## Cadence & Structure

The journal is organized by **sprint** — a bounded unit of work, typically
aligned to one roadmap milestone or a coherent slice of one. A sprint is not a
fixed calendar duration; it is a unit of *completed, reflected-upon* work. A new
entry is opened when a sprint begins and finalized (retrospective included) when
it ends.

The `docs/journal/` directory contains:

- **`README.md`** — this document: the system, the template, the conventions.
- **`SPRINT-NN.md`** — one file per sprint, in execution order.

### File naming

Sprint files use a **zero-padded, monotonically increasing** index:

```
docs/journal/
├─ README.md          ← this file
├─ SPRINT-00.md       ← Documentation Foundation (M0)
├─ SPRINT-01.md       ← next sprint
└─ SPRINT-NN.md       ← …
```

Rules:

- **`SPRINT-00`** is the first sprint — the documentation foundation — because
  the foundation precedes all implementation
  ([ROADMAP → Delivery Philosophy](../product/ROADMAP.md)).
- The index is **permanent and never reused**, exactly as
  [ADR identifiers](../adr/README.md) are permanent. Sprints are never
  renumbered; a superseded sprint is annotated, not deleted.
- Zero-padding (`00`, `01`, … `10`) keeps files sorted correctly in any listing.
- One sprint maps to one file. A sprint may advance more than one milestone, and
  a milestone may span more than one sprint; the entry names the milestone(s) it
  touches in its **Goals**.

---

## Sprint Entry Template

Every `SPRINT-NN.md` follows the structure below. The sections are fixed so the
journal is scannable and comparable across sprints; a section with nothing to
report is kept with an explicit "None this sprint" rather than dropped, so its
absence is a deliberate signal.

```markdown
# Sprint NN — <Title>

**Sprint:** NN
**Dates:** <Month YYYY> (<start> – <end>)
**Milestone(s):** <ROADMAP milestone id(s), e.g. M0>
**Status:** <Planned | In Progress | Complete>
**Owner:** Mohamed Kamel

---

## Goals
The one to three outcomes this sprint commits to. Each ties to a ROADMAP
milestone and/or a PRD functional requirement by identifier.

## Scope
What is in, and — just as important — what is explicitly out, to guard against
scope creep. Reference the governing documents; do not restate requirements.

## Work Completed
What was actually delivered, as verifiable statements. Link to the artifacts
(documents, ADRs, features) produced.

## Decisions
Decisions locked this sprint, each with a one-line rationale and a pointer to
its ADR or strategy document. The journal summarizes; the ADR holds the record.

## Problems & Solutions
Concrete problems encountered and how they were resolved (or deferred, with the
reason). Written honestly — a problem hidden is a lesson lost.

## Lessons Learned
Transferable insight: what to repeat, what to change. Distinct from a problem —
a lesson outlives the sprint that produced it.

## Retrospective
Brief, candid reflection: what went well, what did not, and what will change in
process next sprint.

## Next Sprint
The handoff: the goals the next sprint inherits, and any open questions passed
forward.
```

Section intent, at a glance:

| Section | Answers | Guards against |
| --- | --- | --- |
| Goals | What are we committing to? | Aimless work |
| Scope | Where does this sprint stop? | Scope creep |
| Work Completed | What is actually done? | "Done" as a feeling |
| Decisions | What is now locked, and why? | Silent, undocumented choices |
| Problems & Solutions | What broke, and how we fixed it? | Repeating mistakes |
| Lessons Learned | What do we carry forward? | Losing hard-won insight |
| Retrospective | How did the *process* go? | Stagnant workflow |
| Next Sprint | What comes next? | A cold start |

---

## Relationship to Other Documents

The journal sits deliberately between the plan and its public presentation.

- **[ROADMAP.md](../product/ROADMAP.md) — the plan.** The roadmap owns the
  ordered milestones and their exit criteria. The journal records the execution
  *against* that plan. When a sprint completes a milestone, its **Work
  Completed** should satisfy that milestone's exit criteria; the roadmap changes
  only when the *sequence* changes, whereas the journal grows every sprint.
- **[AI_WORKFLOW.md](../engineering/AI_WORKFLOW.md) — the method.**
  Development is AI-assisted ([PRD → Product Scope](../product/PRODUCT_REQUIREMENTS.md)).
  `AI_WORKFLOW.md` defines *how* AI is used as a methodology; each sprint's
  **Problems & Solutions** and **Retrospective** are where that methodology is
  observed in practice — what the workflow got right, where it needed human
  correction. The journal is the evidence base that keeps `AI_WORKFLOW.md`
  honest.
- **[Engineering Journey](../product/PRODUCT_REQUIREMENTS.md) (public,
  [FR-008](../product/PRODUCT_REQUIREMENTS.md)) — the presentation.** The public
  page is *curated from* the journal, not a raw dump of it. The journal is the
  complete internal record; the Engineering Journey selects and narrates the
  parts that demonstrate engineering thinking to visitors. Because both are
  content ([ARCHITECTURE → §8](../engineering/ARCHITECTURE.md)), the same source
  can feed both without a second writing system.
- **[ADRs](../adr/README.md) — the decision record.** When a sprint locks an
  architectural decision, the full rationale lives in an ADR; the journal's
  **Decisions** section links to it. The journal never becomes a second,
  divergent copy of the decision record.

---

## Best Practices

- **Write it as you go.** Fill **Work Completed**, **Decisions**, and
  **Problems & Solutions** during the sprint, not reconstructed after — fresh
  detail is the whole value.
- **Reference, do not restate.** Cite FRs, milestones, and ADRs by identifier
  and link. Duplication is how documentation rots
  ([ARCHITECTURE → Best Practices](../engineering/ARCHITECTURE.md)).
- **Be honest about problems.** The journal's credibility comes from recording
  what went wrong, not only what went right.
- **Keep the template intact.** Every section, every sprint — "None this
  sprint" is a valid, informative entry.
- **One sprint, one file.** Never edit a closed sprint to rewrite history;
  correct forward in the next entry.

---

## Common Mistakes

- **Retro-writing the journal at launch.** A journal assembled after the fact is
  fiction; it loses the friction that makes it worth reading.
- **Duplicating the ROADMAP or the ADRs.** The journal records *execution*, not
  the plan or the decision record — link to them.
- **Only logging successes.** Omitting problems defeats the purpose and breaks
  the honesty the [Brand voice](../product/BRAND.md) requires.
- **Renumbering sprints.** Indices are permanent; reordering them breaks every
  inbound reference.

---

## Related Documents

- [PRODUCT_REQUIREMENTS.md → FR-015](../product/PRODUCT_REQUIREMENTS.md) — the requirement this system realizes.
- [ROADMAP.md](../product/ROADMAP.md) — the milestone plan the journal records execution against.
- [AI_WORKFLOW.md](../engineering/AI_WORKFLOW.md) — the AI-assisted methodology observed in each sprint.
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — documentation-as-content and the Architecture-First philosophy.
- [adr/README.md](../adr/README.md) — the canonical decision record the journal links to.
- [SPRINT-00.md](./SPRINT-00.md) — the first sprint entry: Documentation Foundation.
