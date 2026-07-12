# CLAUDE.md — AI Repository Context

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This is the operating context any AI agent reads **before** working in this
repository. It is deliberately short and directive: the locked decisions, the
map of where things live, and the hard rules — enough to act correctly without
re-deriving the architecture every session.

This file is a *condensed index*, not a replacement for the documentation. When
you need depth, follow the links. When this file and a governing document
disagree, the governing document wins — and the disagreement is a defect to
report, not a choice to make. The full method is in
[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md); the methodology behind
AI-assisted work is in [AI_WORKFLOW.md](./AI_WORKFLOW.md).

---

## What this project is

MohamedKamel.dev is a premium engineering portfolio built to behave like a
modern SaaS product, not a personal website — the site itself is the proof of
the engineer's skill ([PROJECT_VISION.md](../product/PROJECT_VISION.md),
[BRAND.md](../product/BRAND.md)). It is a statically-biased, content-driven
Next.js application: content lives in the repository as MDX and structured data;
there is no backend, database, or user accounts. It publishes its own
engineering documentation and AI workflow as first-class content
([PRD → FR-006](../product/PRODUCT_REQUIREMENTS.md)). **The documentation is
part of the product.**

---

## Non-negotiable principles

Sourced verbatim in intent from
[ARCHITECTURE.md → Architectural Principles](./ARCHITECTURE.md#2-architectural-principles):

1. **Documentation-Driven** — the governing doc is written before the code.
2. **Architecture-First** — structure and decisions precede implementation.
3. **Server-first, minimal client** — RSC by default; `"use client"` is opt-in.
4. **State minimization** — Server → URL → Local → Global, in that strict order.
5. **Tokens over hardcoding** — every design value resolves to a token.
6. **Content as data** — typed, validated, in-repo MDX; no CMS in V1.
7. **Accessibility is non-negotiable** — WCAG AA, at build time, per component.
8. **Simplicity when in doubt** — choose the simpler solution; guard against
   overengineering and scope creep.

---

## Locked decisions

These are settled. Do not reopen them in code; changing one requires an ADR and
owner sign-off.

| Area | Decision | Authority |
| --- | --- | --- |
| Framework & routing | Next.js **App Router** (mandatory) | [ADR-0001](../adr/ADR-0001-App-Router.md) |
| Architecture | **Feature-based**, four layers | [ADR-0002](../adr/ADR-0002-Feature-Architecture.md) |
| Rendering | **React Server Components, server-first** | [ADR-0006](../adr/ADR-0006-Rendering-Strategy.md) |
| Styling | **Tailwind CSS driven by design tokens** | [ADR-0003](../adr/ADR-0003-Tailwind.md) |
| State | **Server → URL → Local → Global** hierarchy | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| Content | **Local MDX + structured data, no CMS (V1)** | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) |
| i18n | **English + Arabic, RTL-aware**, localized routes/metadata | [ADR-0004](../adr/ADR-0004-Internationalization.md) |
| Theme | **Dark, light, system** via tokens; no theme flash | [ADR-0005](../adr/ADR-0005-Theme-System.md) |
| Deployment | **Vercel** | Owner directive |
| Language | **TypeScript** (open assumption — see notes) | [ARCHITECTURE.md → §4.1](./ARCHITECTURE.md#41-decided) |

The canonical decision set is **exactly these six ADRs** (App Router, Feature
Architecture, Tailwind, Internationalization, Theme System, Rendering Strategy).
The state hierarchy and local-MDX decisions are recorded as *strategy documents*,
not ADRs. Do not invent new ADR numbers or cite ADRs that do not exist.

**Deliberately deferred** (open by design — do not close silently in code): the
global-state library, the animation library, the concrete i18n mechanism, and
the testing tooling. Resolve each in its milestone with an ADR, never by an
accidental import. See
[ARCHITECTURE.md → §4.2](./ARCHITECTURE.md#42-deliberately-deferred).

---

## The four layers

Code is organized by feature domain, not by technical type
([ARCHITECTURE.md → §6](./ARCHITECTURE.md#6-application-structure),
[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)):

| Layer | Role | Dependency rule |
| --- | --- | --- |
| **Routing** | `app/` — thin; maps URLs, owns layouts, metadata, locale segments. Composes features. | may depend on features + shared |
| **Feature** | Self-contained domains (`projects`, `contact`, …). Owns its components, logic, types. | may depend on shared + content; **never another feature** |
| **Shared** | Cross-feature UI, hooks, utilities. Promoted deliberately. | depends on nothing feature-specific |
| **Content** | Typed MDX + structured data and its loaders. | leaf |

Dependencies point **inward and downward** only. A feature importing another
feature's internals is an architectural violation — promote the shared piece
instead.

---

## Where things live — which doc governs what

| I need to… | Read |
| --- | --- |
| Understand the whole system | [ARCHITECTURE.md](./ARCHITECTURE.md) *(keystone — never contradict)* |
| Know the working process / DoR / DoD | [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) |
| Understand AI-assisted method | [AI_WORKFLOW.md](./AI_WORKFLOW.md) |
| Place a file / respect boundaries | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) |
| Decide Server vs Client / caching | [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md), [DATA_FETCHING.md](./DATA_FETCHING.md) |
| Place state | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) |
| Localize / handle RTL | [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |
| Hit the performance budget | [PERFORMANCE.md](./PERFORMANCE.md) |
| Meet accessibility | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Handle metadata / SEO | [SEO.md](./SEO.md) |
| Write code (style, naming) | [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) |
| Use design values | [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md), [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md) |
| Model content / MDX | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md), [MDX_PIPELINE.md](../developer/MDX_PIPELINE.md) |
| Find a locked decision | [adr/README.md](../adr/README.md) |
| Record the journey | [journal/README.md](../journal/README.md) |
| Trace a requirement | [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) |

---

## Hard rules

### DO

- **Default to Server Components.** Write the server version first; add
  `"use client"` only when interactivity, browser APIs, state, or effects
  genuinely require it, and push that boundary to the leaves.
- **Resolve every design value to a token** — color, spacing, radius, shadow,
  typography, motion. No exceptions.
- **Build EN/AR and LTR/RTL, and dark/light/system, from the first draft.**
  Retrofitting direction or theme is the most expensive avoidable rework here.
- **Keep state at the highest viable level** (Server → URL → Local → Global).
- **Keep content in the content layer** as typed, validated MDX/data.
- **Update the governing document in the same change as the code.**
  Documentation is a deliverable, not an afterthought.
- **Trace every change to a functional requirement** (FR-xxx) or explicit owner
  directive.
- **Escalate missing decisions** to the owner and record them; propose, don't
  impose.
- **Use the canonical vocabulary:** Server/Client Component; the state
  hierarchy names; the four layers; QAT-1…QAT-7 (never "QA-"); ADR-0001…0006.

### DON'T

- **Don't default to `"use client"`** on pages or layouts "to be safe." It
  collapses the server-first model and inflates the bundle (breaks QAT-1).
- **Don't introduce global state** — or any global-state library — without a
  documented justification proving Server/URL/Local are insufficient. None is in
  the decided stack; do not assume Redux/RTK Query. (The RTK Query mention in
  [FR-007](../product/PRODUCT_REQUIREMENTS.md) is illustrative *content*, not a
  stack decision.)
- **Don't hardcode design values.** A hex code or pixel value in a component is
  a defect.
- **Don't add anything from the non-goals list:** no authentication, user
  accounts, payments, backend APIs, database, admin dashboard, or CMS
  ([ARCHITECTURE.md → §3.2](./ARCHITECTURE.md#32-non-goals-out-of-scope)).
- **Don't couple features.** No feature imports another feature's internals.
- **Don't contradict the documentation** or invent product requirements,
  decisions, ADRs, or file paths. If a doc is wrong, report it; don't route
  around it in code.
- **Don't run git** or manage version control — the owner does this manually.
  Prepare changes; do not commit, branch, or merge.
- **Don't reproduce copyrighted third-party content** in code or docs.

---

## Keeping docs in sync when code changes

Documentation-Driven means the doc leads and never lags. When you change code:

1. **Decide first.** If the change involves a decision the docs don't cover,
   surface it to the owner and record it (ADR for an architectural choice; a
   strategy document for ongoing practice; an explicit deferral otherwise)
   *before* writing the code.
2. **Edit the governing document in the same change** as the code it governs —
   the one named in the "where things live" map above. A code change with a
   stale doc is not Done ([DEVELOPMENT_GUIDELINES.md → DoD](./DEVELOPMENT_GUIDELINES.md#4-definition-of-done)).
3. **Bump versions honestly.** A change that alters the architectural *frame*
   (a new layer, a reversed decision) requires a version bump and an ADR, and
   resets the affected document's status to `In Review`.
4. **Keep the frame consistent.** If a change would make
   [ARCHITECTURE.md](./ARCHITECTURE.md) and a subsystem doc disagree, stop and
   reconcile — a conflict with the keystone is a defect, not a fork.
5. **Record the journey.** Note notable decisions, problems, and lessons in the
   [journal](../journal/README.md).

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — keystone; the frame for everything.
- [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — the working loop.
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — AI-assisted development methodology.
- [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) — code-level rules.
- [adr/README.md](../adr/README.md) — the six canonical decisions.
- [PRODUCT_REQUIREMENTS.md](../product/PRODUCT_REQUIREMENTS.md) — requirements,
  scope, Definition of Done.
