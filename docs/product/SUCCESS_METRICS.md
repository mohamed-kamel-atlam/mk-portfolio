# Success Metrics

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines what *success* means in measurable terms. It converts the
qualitative ambitions in the [Product Requirements](./PRODUCT_REQUIREMENTS.md)
and [Brand Identity](./BRAND.md) into concrete, testable targets, and names how
and when each is measured.

It exists so that "premium," "fast," and "accessible" are not opinions. Every
target here is either objectively verifiable (a Lighthouse score, an axe run) or
a defined qualitative signal with an explicit observation method. Where the PRD
states a requirement, this document turns it into a threshold; it does not
restate the requirement.

---

## Scope

**In scope.** The success signals and key performance indicators (KPIs) for
perception, performance, accessibility, and SEO, plus the high-level approach to
measuring them.

**Out of scope.** The *mechanisms* that produce these numbers — the performance
budget internals, exact byte counts, CI wiring, and audit tooling — which are
owned by [PERFORMANCE.md](../engineering/PERFORMANCE.md),
[ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md), and
[SEO.md](../engineering/SEO.md). This document sets the targets; those documents
implement the means.

---

## Goals

- Make product quality falsifiable: a build either meets the bar or it does not.
- Give each [roadmap](./ROADMAP.md) milestone objective exit gates rather than
  subjective sign-off.
- Tie every metric back to a source of truth (PRD, BRAND, or a quality
  attribute), so no target is invented.

---

## Dependencies

| Source | Role in this document |
| --- | --- |
| [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) | Owns the Success Metrics and Non-Functional Requirements this document makes testable. |
| [BRAND.md](./BRAND.md) | Owns the perception targets (10s / 30s / 1min impressions). |
| [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) | Owns the quality attributes (QAT-1 performance, QAT-2 accessibility, QAT-6 SEO) these KPIs measure. |
| [PERFORMANCE.md](../engineering/PERFORMANCE.md), [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md), [SEO.md](../engineering/SEO.md) | Own the measurement mechanisms and enforcement referenced throughout. |

---

## Perception Goals (Qualitative Signals)

The [PRD → Success Metrics](./PRODUCT_REQUIREMENTS.md) and
[BRAND → Target Impression](./BRAND.md) define success first as a *feeling* a
visitor forms in a defined window. These are qualitative by nature; they are
recorded here as named success signals with an explicit observation method, not
as numbers pretending to be objective.

| Window | Success signal | Source | How it is observed |
| --- | --- | --- | --- |
| **First 10 seconds** | "This feels like a premium product." | [PRD](./PRODUCT_REQUIREMENTS.md), [BRAND](./BRAND.md) | The landing page's first meaningful paint reads as a premium SaaS surface (typography, spacing, dark-first polish) — validated by moderated first-impression review against the [design review checklist](../design/DESIGN_PRINCIPLES.md). |
| **First 30 seconds** | "This developer understands software engineering." | [PRD](./PRODUCT_REQUIREMENTS.md), [PROJECT_VISION → Success Criteria](./PROJECT_VISION.md) | Above-the-fold content and the engineering-philosophy section communicate architecture-mindedness, not a technology list — reviewed against [BRAND → Engineering Identity](./BRAND.md). |
| **First minute** | "I want to interview this person." | [PRD](./PRODUCT_REQUIREMENTS.md), [BRAND](./BRAND.md) | Intent-to-contact signalled in first-impression reviews with representative audience proxies (recruiter / engineering manager personas from the [PRD](./PRODUCT_REQUIREMENTS.md)). |
| **After exploring projects** | "This developer can lead frontend architecture." | [PRD](./PRODUCT_REQUIREMENTS.md) | Project detail pages ([FR-005](./PRODUCT_REQUIREMENTS.md)) convey ownership and decision-making, reviewed for depth over breadth. |

These signals are the *ultimate* success criteria; the quantitative KPIs below
exist because they are the necessary, verifiable substrate of that perception —
a slow, inaccessible, or unindexable site cannot read as premium.

---

## Performance KPIs

Serves **QAT-1** ([ARCHITECTURE → §1](../engineering/ARCHITECTURE.md)) and the
[PRD → Performance NFRs](./PRODUCT_REQUIREMENTS.md). *"Performance over visual
effects"* ([PRD → Product Principles](./PRODUCT_REQUIREMENTS.md)) means these
are gates, not aspirations.

### Lighthouse

| Category | Target |
| --- | --- |
| Performance | ≥ 95 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

The ≥ 95 floor for all four categories is the [PRD → Performance](./PRODUCT_REQUIREMENTS.md)
requirement, applied to every route.

### Core Web Vitals

Measured at the field/lab thresholds Google defines as "good":

| Metric | Target |
| --- | --- |
| Largest Contentful Paint (LCP) | ≤ 2.5 s |
| Interaction to Next Paint (INP) | ≤ 200 ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |

These operationalize the PRD's "Excellent Core Web Vitals" requirement. The
server-first, statically-biased rendering model
([ARCHITECTURE → §5](../engineering/ARCHITECTURE.md)) and mandatory image
dimensions ([Design System → Images](../design/DESIGN_SYSTEM.md)) are the
primary levers that make them achievable.

### JavaScript bundle budget

A per-route JavaScript budget is the enforcement mechanism behind the
server-first principle: minimal client JavaScript is a
[PRD → Performance NFR](./PRODUCT_REQUIREMENTS.md), and a budget turns it from
intent into a build constraint.

> **v1.0.0 proposed default.** Adopt a **per-route client-JavaScript budget**,
> tracked and enforced per route rather than as a single site-wide number.
> **Rationale:** routes differ legitimately in interactivity — a mostly-static
> content page and the contact form have different honest costs, so one global
> number would either be too loose for content pages or too tight for
> interactive ones. A per-route budget preserves the server-first discipline
> ([ARCHITECTURE → §5.1](../engineering/ARCHITECTURE.md)) where it matters most:
> it forces each new Client Component to justify its cost against *that route's*
> ceiling. The **exact byte thresholds are deliberately deferred** to
> [PERFORMANCE.md](../engineering/PERFORMANCE.md), which owns the budget's
> concrete values and their enforcement; fixing byte numbers here — before the
> shared component library (M3) and first pages (M5) exist — would be a number
> invented ahead of evidence.

---

## Accessibility KPIs

Serves **QAT-2** ([ARCHITECTURE → §1](../engineering/ARCHITECTURE.md)) and the
[PRD → Accessibility NFRs](./PRODUCT_REQUIREMENTS.md). Accessibility is
non-negotiable ([ARCHITECTURE → §2, Principle 7](../engineering/ARCHITECTURE.md));
these are pass/fail, never traded away.

| KPI | Target |
| --- | --- |
| Conformance | WCAG 2.1 AA |
| Automated violations | Zero critical/serious axe violations, every route |
| Keyboard operability | Full — every interactive element reachable and operable by keyboard, with visible focus |
| Screen-reader support | Semantic HTML and correct roles/labels throughout |
| Reduced motion | Honored; motion never a barrier ([BRAND → Motion Principles](./BRAND.md)) |

The mechanism — audit tooling, manual review, and enforcement — is owned by
[ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md). "Zero critical violations"
is a necessary floor, not a sufficient proof of accessibility; manual keyboard
and screen-reader review remains required.

---

## SEO KPIs

Serves **QAT-6** ([ARCHITECTURE → §1](../engineering/ARCHITECTURE.md)) and the
[PRD → SEO NFRs](./PRODUCT_REQUIREMENTS.md).

| KPI | Target |
| --- | --- |
| Structured data | Valid, error-free (schema.org) on all applicable pages |
| Metadata | Complete title, description, Open Graph, and Twitter cards per route |
| Localization | Correct `hreflang` for `en` and `ar`; localized metadata per locale |
| Indexability | Valid sitemap and robots; canonical URLs; every public route indexable |
| Rendering | Server-rendered HTML for all indexable content ([ARCHITECTURE → §5](../engineering/ARCHITECTURE.md)) |

The mechanism — Metadata API usage, structured-data generation, sitemap/robots
production — is owned by [SEO.md](../engineering/SEO.md).

---

## How and When Measured

Measurement is continuous and gated, not a one-time pre-launch audit. This is
the high-level intent; the concrete tooling and thresholds are owned by
[PERFORMANCE.md](../engineering/PERFORMANCE.md),
[ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md), and
[SEO.md](../engineering/SEO.md).

- **Build time.** Type checking, lint, content-schema validation
  ([ARCHITECTURE → §8](../engineering/ARCHITECTURE.md)), and the bundle budget
  fail the build when violated — the earliest and cheapest gate.
- **Preview deployments.** Every change ships to a Vercel preview
  ([ARCHITECTURE → §11](../engineering/ARCHITECTURE.md)) where Lighthouse,
  accessibility, and SEO checks run against a production-like build.
- **CI intent.** Performance, accessibility, and SEO thresholds are intended to
  run as automated CI gates so a regression blocks merge rather than being
  discovered after launch. The exact pipeline is defined in
  [PERFORMANCE.md](../engineering/PERFORMANCE.md).
- **Milestone gates.** Each [roadmap](./ROADMAP.md) milestone's exit criteria
  reference these KPIs; M9 (Hardening & launch) verifies the full set before a
  production deploy.

---

## Engineering Decisions

- **Per-route JavaScript budget over a global one** — *v1.0.0 proposed default*;
  see [Performance KPIs](#javascript-bundle-budget). Exact bytes deferred to
  [PERFORMANCE.md](../engineering/PERFORMANCE.md).
- **≥ 95 applied to every route, not the homepage alone.** A single strong page
  is not the product; the [Definition of Done](./PRODUCT_REQUIREMENTS.md) binds
  every user-facing route, so the KPI does too.
- **Perception goals kept qualitative.** The 10s/30s/1min impressions are
  reviewed, not fabricated into pseudo-metrics, because inventing a number for a
  subjective signal would violate the honesty the [BRAND → Voice](./BRAND.md)
  demands.

---

## Best Practices

- **Measure per route.** A site-wide average hides the worst page; every
  indexable route is held to the bar.
- **Gate early.** Prefer the build-time gate to the preview gate, and the
  preview gate to a post-launch discovery.
- **Treat automated passes as necessary, not sufficient.** Zero axe violations
  and a green Lighthouse run do not replace manual keyboard, screen-reader, and
  first-impression review.
- **Trace every target to a source.** If a KPI cannot be traced to the PRD,
  BRAND, or a QAT, it does not belong here.

---

## Common Mistakes

- **Optimizing the homepage only.** Hitting ≥ 95 on `/` while inner routes
  regress defeats the metric's purpose.
- **Inventing exact byte budgets here.** Concrete thresholds belong in
  [PERFORMANCE.md](../engineering/PERFORMANCE.md); numbers set before the
  component library exists are guesses.
- **Reading "zero critical violations" as "accessible."** Automated tools catch
  a subset; manual review is still required.
- **Deferring measurement to launch.** Metrics discovered at M9 that should have
  gated M5 are expensive regressions, not findings.
- **Trading QAT-2 for visual effect.** Accessibility and correctness are never
  traded away ([ARCHITECTURE → §1](../engineering/ARCHITECTURE.md)).

---

## Checklist

Verify for every route before it is considered done:

- [ ] Lighthouse ≥ 95 for Performance, Accessibility, Best Practices, and SEO.
- [ ] LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- [ ] Within the per-route JavaScript budget defined in [PERFORMANCE.md](../engineering/PERFORMANCE.md).
- [ ] WCAG 2.1 AA; zero critical/serious axe violations; fully keyboard operable.
- [ ] Valid structured data, complete metadata, correct `hreflang`, indexable.
- [ ] Server-rendered HTML for all indexable content.
- [ ] Perception signals reviewed against [BRAND](./BRAND.md) and the [design review checklist](../design/DESIGN_PRINCIPLES.md).

---

## Related Documents

- [PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md) — the metrics and NFRs made testable here.
- [ROADMAP.md](./ROADMAP.md) — milestones whose exit criteria reference these KPIs.
- [BRAND.md](./BRAND.md) — the perception targets.
- [engineering/PERFORMANCE.md](../engineering/PERFORMANCE.md) — the performance budget and measurement mechanism.
- [engineering/ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) — the accessibility standard and audit mechanism.
- [engineering/SEO.md](../engineering/SEO.md) — the SEO and metadata mechanism.
