# AI-Assisted Development Workflow

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document explains the methodology behind building this portfolio with heavy
AI assistance — *why* the approach fits the project, *how* the
human-in-the-loop model works, and *what* guardrails keep AI-generated work at
production quality.

It has two audiences. Internally, it is the reference for anyone (human or AI)
who needs to understand how AI work is directed, bounded, and verified.
Externally, it is the source for the public **Engineering → AI Workflow** page
([PRD → FR-006](../product/PRODUCT_REQUIREMENTS.md)): visitors should leave
understanding that AI here is an accelerant *under engineering control*, not a
substitute for engineering judgment.

The methodology is intentionally honest about the division of labor. The
portfolio's brand promise is trust earned through the product itself
([BRAND.md → Brand Promise](../product/BRAND.md)); overstating AI's role, or
hiding the human decisions, would undercut exactly that.

---

## Scope

**In scope.** The philosophy of AI-assisted development on this project; the
human-in-the-loop model; how documentation drives AI work; prompt and review
patterns at the level of *principle*; the guardrails that separate what AI may
decide from what it must escalate; how AI output is verified; and how the
workflow documents itself.

**Out of scope.** The concrete step-by-step engineering loop (owned by
[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)); the condensed rule set
an agent loads per session (owned by [CLAUDE.md](./CLAUDE.md)); specific vendor
tools, model names, or prompt transcripts. This document is about *method*, and
methods outlive tools.

---

## Goals

- Make the human-in-the-loop boundary explicit: AI proposes, the human decides.
- Show that documentation — not conversation — is the durable shared context
  that keeps AI work consistent with the architecture.
- Define clear guardrails so AI accelerates delivery without ever silently
  changing product requirements or architecture.
- Give the public page an accurate, non-marketing account of the practice.

---

## Responsibilities

| Actor | Responsibility |
| --- | --- |
| **Owner (Mohamed)** | The decision-maker and reviewer. Sets direction, approves or rejects every AI proposal, owns all architecture and product-scope decisions, and manages version control. Accountable for everything that ships. |
| **AI agent** | The accelerant. Reads the documentation as context, proposes implementations and drafts, explains trade-offs, and surfaces decisions it is not authorized to make. Never the final authority. |
| **Documentation** | The shared source of truth that grounds the agent. See [§3](#3-documentation-drives-ai-work). |

---

## Dependencies

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the frame AI work must never contradict.
- [CLAUDE.md](./CLAUDE.md) — the operating context an agent loads before working.
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — the loop AI work runs
  through.
- [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) — requirements AI
  work traces to and may not invent.
- [journal/README.md](../journal/README.md) — where the practice is recorded.

---

## 1. Why AI-Assisted Development Fits This Project

The portfolio's thesis is engineering maturity demonstrated through the product
itself ([PROJECT_VISION.md](../product/PROJECT_VISION.md)). AI-assisted
development is part of that thesis for three reasons:

1. **It is an honest reflection of modern practice.** Working effectively with
   AI is an explicit part of the engineering identity the brand communicates
   ([BRAND.md → Engineering Identity](../product/BRAND.md)). Demonstrating a
   disciplined AI workflow is itself a credential.

2. **The architecture makes AI reliable.** This is the deeper point. AI output
   is only as good as its context. Because the project is
   **documentation-driven** and **architecture-first**, the constraints an agent
   needs — locked decisions, layer boundaries, the state hierarchy, the token
   rule — already exist in writing. The same rigor that serves human
   maintainability (QAT-3) is what makes AI a dependable contributor rather than
   a source of drift.

3. **It accelerates the right things.** AI removes the cost of mechanical work —
   scaffolding a token-styled component, drafting localized copy, translating a
   pattern across features — so the scarce resource, engineering judgment, is
   spent on decisions. Speed is never traded for the quality bar; the
   [Definition of Done](../product/PRODUCT_REQUIREMENTS.md) is identical whoever
   produced the code.

AI is therefore a force multiplier on a well-specified system, not a shortcut
around specifying it.

---

## 2. The Human-in-the-Loop Model

The governing rule is one sentence: **AI proposes; the human reviews and
decides.** Everything below elaborates it.

```
   ┌──────────┐   context (docs)   ┌──────────┐
   │  Owner   │ ─────────────────▶ │    AI    │
   │ (decides)│                    │(proposes)│
   │          │ ◀───────────────── │          │
   └────┬─────┘   proposal + why   └──────────┘
        │
        │ reviews against Architecture Checklist + DoD
        ▼
   accept ──▶ owner commits (manual version control)
   reject ──▶ feedback ──▶ AI revises  (loop)
```

- **AI never has final authority.** It cannot change product requirements,
  reverse an architectural decision, add a dependency of consequence, or ship
  code. It can *recommend* any of these, with reasoning.
- **The owner is accountable for output.** Reviewing is not rubber-stamping;
  the owner judges every proposal against the
  [Architecture Checklist](./ARCHITECTURE.md#architecture-checklist) and the
  [Definition of Done](./DEVELOPMENT_GUIDELINES.md#4-definition-of-done). A
  proposal that "works" but violates a boundary is rejected.
- **Version control stays human.** The owner performs branching, commits, and
  merges manually ([DEVELOPMENT_GUIDELINES.md → §6.1](./DEVELOPMENT_GUIDELINES.md#61-version-control-is-owner-managed)).
  This keeps a curated history and an unambiguous accountable author.
- **The loop is the same loop.** AI occupies steps 1–4 of the
  [working loop](./DEVELOPMENT_GUIDELINES.md#12-the-loop) (frame, document,
  build, verify); the owner owns step 5 (review and commit). There is no
  separate, lighter track for AI-generated code.

---

## 3. Documentation Drives AI Work

The central methodology claim: **documentation, not the chat transcript, is the
shared context.** A conversation is ephemeral and unversioned; the documentation
is durable, reviewed, and versioned. Grounding AI in the docs is what makes its
output reproducible and consistent across sessions and agents.

- **[CLAUDE.md](./CLAUDE.md) is the entry point.** Every agent reads it before
  working: the locked decisions, the four layers, the map of which document
  governs what, and the hard DO/DON'T rules. It is the condensed contract.
- **The governing document is the specification.** Because the project is
  documentation-driven, the decision an agent needs usually already exists in
  writing. The agent's job is to *apply* the specification, not to reinvent it.
- **Consistency is a property of the context, not the model.** Two different
  agents, or the same agent weeks apart, produce compatible work because they
  read the same documents — the same token rule, the same state hierarchy, the
  same boundary rules. This is why documentation quality is treated as a
  first-class engineering investment, not clerical work.
- **The feedback runs both ways.** When code changes, its governing document is
  updated in the same change ([CLAUDE.md → Keeping docs in
  sync](./CLAUDE.md#keeping-docs-in-sync-when-code-changes)). Documentation
  leads the code and is corrected by it — never allowed to lag.

---

## 4. Prompt & Review Patterns

Stated as principles, deliberately not as reusable prompt text — prompt
templates date quickly, and the value is in the shape of the interaction.

### Prompting principles

- **Point to the document, don't paraphrase it.** Effective prompts reference
  the governing document ("build this per
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md), server-first") rather than
  restating rules inline, where they can drift from the source of truth.
- **State the requirement and the layer.** Name the functional requirement
  (FR-xxx) and the target layer up front, so the proposal is framed correctly
  from the first token.
- **Ask for the reasoning, not just the result.** A proposal is worth more with
  its trade-offs explained; the reasoning is what the owner reviews and what may
  become an ADR or a journal entry.
- **Prefer the smallest slice.** Constrain the agent to one coherent, shippable
  slice ([DEVELOPMENT_GUIDELINES.md → Incremental](./DEVELOPMENT_GUIDELINES.md#11-the-four-principles)),
  which keeps proposals reviewable and regressions visible.

### Review principles

- **Review against the checklist, not first impressions.** Every proposal is
  measured against the [Architecture Checklist](./ARCHITECTURE.md#architecture-checklist)
  and the [Definition of Done](./DEVELOPMENT_GUIDELINES.md#4-definition-of-done).
- **Interrogate the boundaries.** The highest-value review questions are the
  ones automated gates cannot answer: is this the right layer? the right state
  level? a genuine Client Component or a lazy one? tokens throughout?
- **Reject silent scope or decisions.** A proposal that introduces a non-goal,
  a global store, or a new dependency without justification is rejected on
  process grounds regardless of code quality.

---

## 5. Guardrails — Decide vs. Escalate

The boundary between what an agent may settle on its own and what it must bring
to the owner. This table is the practical core of the guardrails.

| AI **may decide** (within the docs) | AI **must escalate** (owner decides) |
| --- | --- |
| How to implement a settled requirement in the correct layer. | Whether to add, change, or drop a **product requirement**. |
| Which existing token, shared component, or pattern to reuse. | Any change to the **architecture** or a locked decision (ADR-0001…0006). |
| Local, ephemeral UI state placement (per the hierarchy). | Introducing **global state** or a global-state library. |
| Server vs. Client Component for a given node, server-first. | Adding a **dependency of consequence** or resolving a [deferred decision](./ARCHITECTURE.md#42-deliberately-deferred). |
| Naming and structure per [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md). | Anything touching the **non-goals** (auth, backend, CMS, payments, dashboard). |
| Localized copy drafts, subject to review. | **Committing, branching, merging** — version control is owner-managed. |
| Drafting or updating a governing document to match a change. | **Reversing** a documented decision or resolving a doc conflict with the keystone. |

The rule of thumb: **AI may choose *how* to satisfy a written decision; it may
never make or unmake the decision itself.** When unsure which column applies,
the agent escalates — a needless question is cheaper than a silent scope change.

---

## 6. How AI Work Is Verified

AI-generated work earns no trust discount. It passes through exactly the
verification any change does:

1. **Automated quality gates** — lint, type check, build (content validates),
   accessibility, and the Lighthouse/performance budget on a Vercel preview
   ([DEVELOPMENT_GUIDELINES.md → §5](./DEVELOPMENT_GUIDELINES.md#5-quality-gates)).
2. **Architectural review** — the owner walks the
   [Architecture Checklist](./ARCHITECTURE.md#architecture-checklist): correct
   layer, no cross-feature coupling, server-first, correct state level, tokens
   throughout, localized, themed, accessible, SEO-ready.
3. **Definition of Done** — every PRD exit criterion, including *documented*, is
   met before anything ships.
4. **Human sign-off** — the owner accepts and commits. Nothing merges on the
   agent's own authority.

Because the gates and the checklist are the same for humans and AI, the
provenance of a change makes no difference to the bar it must clear. That
equivalence *is* the guarantee.

---

## 7. How This Workflow Documents Itself

The practice is recorded, not just performed — consistent with the project's
principle that its own process is content.

- **The development journal** captures the real story per sprint: planning,
  problems, solutions, lessons, and retrospectives
  ([PRD → FR-015](../product/PRODUCT_REQUIREMENTS.md),
  [journal/README.md](../journal/README.md)). Notable AI collaborations —
  what was delegated, what was rejected and why — belong here.
- **Decisions become records.** A recommendation the owner accepts that alters
  architecture becomes an ADR; ongoing practice becomes a strategy document.
- **This document evolves with the practice.** As the AI workflow matures, this
  file is versioned alongside it, so the public
  [FR-006](../product/PRODUCT_REQUIREMENTS.md) account stays truthful rather than
  aspirational.

---

## Engineering Decisions

- **v1.0.0 — AI proposes, human decides, as an inviolable rule.** The value of a
  demonstrable, controlled workflow outweighs any speed gained by letting an
  agent ship autonomously; autonomy would also break the owner-managed
  version-control and accountability model.
- **v1.0.0 — Documentation is the shared context, not the chat.** Grounding
  agents in versioned docs (via [CLAUDE.md](./CLAUDE.md)) makes output
  reproducible across sessions and agents; relying on conversation history would
  make consistency a property of luck.
- **v1.0.0 — One quality bar regardless of provenance.** AI work runs the same
  gates and review as human work. A separate, lighter track was rejected as a
  guaranteed path to drift and a weaker public story.
- **v1.0.0 — Patterns documented as principles, not prompt templates.** Concrete
  prompts and vendor/model specifics date quickly and would violate
  Just-in-Time; the durable content is the *shape* of the interaction and the
  decide/escalate boundary.

---

## Best Practices

- **Ground the agent in the doc, then ask.** Reference the governing document
  instead of re-explaining rules that can drift.
- **Demand reasoning.** Accept proposals with explained trade-offs; the
  reasoning is the reviewable artifact.
- **Keep the human in the decision seat.** Use AI to widen options and remove
  toil, not to make the call.
- **Update the doc in the same breath as the code.** AI-assisted changes keep
  documentation-driven discipline like any other.
- **Record notable collaborations in the journal.** The story of the build is
  part of the product.

---

## Common Mistakes

- **Treating AI output as pre-verified.** It clears the same gates as any
  change; provenance grants no discount.
- **Letting the conversation become the source of truth.** Decisions that live
  only in a transcript are lost; they belong in a doc, ADR, or the journal.
- **Silent scope or decision creep.** Accepting a proposal that quietly adds a
  non-goal, a global store, or a dependency without escalation.
- **Over-claiming AI's role publicly.** Marketing the workflow beyond what the
  human-in-the-loop model actually is, undermining the trust the brand is built
  on.
- **AI running version control.** Committing or merging on the owner's behalf
  violates the model in [§2](#2-the-human-in-the-loop-model).

---

## Examples

**A healthy collaboration.** The owner asks, referencing
[RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md), for the project gallery
(FR-005). The agent proposes a Server Component for layout and a small
`"use client"` island for the lightbox, styled through tokens, localized and
direction-aware, and explains why the island is the only client code needed. The
owner reviews against the checklist, requests a reduced-motion adjustment, the
agent revises, and the owner commits. Documentation-driven, server-first,
human-decided.

**A correct escalation.** Asked to "make projects filterable and remember the
filter," the agent recognizes persistence *across the app* would imply global
state — a decision above its authority — and instead proposes URL state (the
next hierarchy level), noting it is shareable and server-readable, and flags that
anything beyond URL state needs an owner decision and likely an ADR. It proposes;
it does not quietly add a store.

---

## Checklist — Sound AI-Assisted Change

- [ ] The agent worked from the documentation (via [CLAUDE.md](./CLAUDE.md)), not
      from memory or the transcript alone.
- [ ] The change traces to a functional requirement; no invented requirements.
- [ ] No architectural decision was made or reversed without owner approval and a
      record.
- [ ] Nothing from the non-goals list was introduced.
- [ ] The proposal came with its reasoning; trade-offs were reviewable.
- [ ] It passed the same quality gates and Architecture Checklist as any change.
- [ ] Governing documents were updated in the same change.
- [ ] The owner reviewed, approved, and committed (AI did not run git).
- [ ] Notable decisions and lessons were recorded in the journal.

---

## Related Documents

- [CLAUDE.md](./CLAUDE.md) — the operating context every agent loads first.
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — the loop AI work runs
  through.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — the frame AI work must not contradict.
- [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) — requirements and
  the Definition of Done ([FR-006](../product/PRODUCT_REQUIREMENTS.md) is the
  public home of this content).
- [journal/README.md](../journal/README.md) — where the workflow records itself.
