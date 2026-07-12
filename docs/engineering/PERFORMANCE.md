# Performance Budget & Strategy

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

Performance is the portfolio's first proof of competence: a visitor should
think *"this feels like a premium product"* within ten seconds
([PRD → Success Metrics](../product/PRODUCT_REQUIREMENTS.md)), and a slow site
disproves that claim before a single word is read. This document turns the
architectural quality attribute **QAT-1 — performance by default**
([ARCHITECTURE §1](./ARCHITECTURE.md#1-architectural-goals--quality-attributes))
into an enforceable engineering contract: a concrete **budget** the site must
stay within, the **techniques** that keep it there, and the **measurement** that
gates regressions.

It is where the architectural principle *server-first, minimal client*
([ARCHITECTURE §2](./ARCHITECTURE.md#2-architectural-principles)) is made
quantitative. The architecture says *ship minimal client JavaScript*; this
document says *how much*, *measured how*, and *enforced where*.

---

## Scope

**In scope.** The v1.0.0 performance budget (Lighthouse, Core Web Vitals, and a
per-route JavaScript ceiling); the techniques that deliver it (server-first
rendering, static bias, streaming, image and font strategy, prefetching,
code-splitting at islands); and the measurement and CI-gate intent that keeps
the budget honest.

**Out of scope.** The product-facing **KPI targets and how success is reported**
— those are owned by [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md), which
this document references rather than duplicates (see
[§1](#1-ownership-metrics-vs-budget)). The rendering *rules* themselves (per-route
static/dynamic decisions, caching, revalidation) belong to
[RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md); this document consumes them.
Token values and the font *design* belong to
[TYPOGRAPHY.md](../design/TYPOGRAPHY.md); this document specifies only the
*loading strategy*. The public FR-014 Performance Dashboard is a product feature,
not this internal budget.

---

## Goals

1. **Never trade performance for visual effect.** Encode the product principle
   *performance over visual effects* as a hard budget, not an aspiration.
2. **Make the budget measurable and gated.** Every number here is checkable in
   CI so a regression fails a check rather than shipping silently.
3. **Attribute cost to its source.** Client JavaScript is budgeted per route so
   a heavy island is visible and owned, not averaged away.
4. **Default to zero client cost.** The cheapest byte is the one never shipped;
   the server-first model is the primary performance mechanism, not an
   optimization applied afterward.

---

## Responsibilities

| This document owns | Deferred to |
| --- | --- |
| Performance budgets (Lighthouse, CWV thresholds, per-route JS ceiling) | — |
| Performance techniques and their rationale | — |
| Measurement approach and CI-gate intent | — |
| Product KPI targets and success reporting | [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) |
| Per-route rendering / caching rules | [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |
| Font design & type scale | [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) |
| Data access & caching patterns | [DATA_FETCHING.md](./DATA_FETCHING.md) |

---

## Dependencies

| Document | Relationship |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Frame: QAT-1, server-first, static bias, streaming, `next/image`. |
| [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) | Owns KPI targets; this document owns the techniques and budgets that achieve them. |
| [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) | Rendering rules this budget assumes (static-by-default, streaming, islands). |
| [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) | Font families this document loads without layout shift. |
| [DATA_FETCHING.md](./DATA_FETCHING.md) | Caching and data access that keep server render fast. |

---

## 1. Ownership: Metrics vs. Budget

The product KPI targets — the numbers reported as evidence of success — are
owned by [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md). This document owns
the **engineering budget and techniques** that make those KPIs achievable. The
two are related but distinct:

> **SUCCESS_METRICS.md** answers *"what result do we promise, and how do we
> report it?"* **PERFORMANCE.md** answers *"what constraints and techniques
> guarantee we can keep that promise?"*

Where a threshold appears in both, SUCCESS_METRICS.md is authoritative for the
*target as a reported metric*; the budget below is the engineering bound the
build is held to, set at or tighter than that target so the site clears it with
margin. The two must not disagree; if they do, the metric target governs the
promise and the budget is reconciled to be at least as strict.

---

## 2. The Performance Budget (v1.0.0 proposed defaults)

These are the v1.0.0 budgets. They are proposed defaults, deliberately set at or
tighter than the [PRD non-functional requirements](../product/PRODUCT_REQUIREMENTS.md)
so the site clears the product bar with headroom. Each is justified.

### 2.1 Lighthouse

| Category | Budget | Source / Justification |
| --- | --- | --- |
| Performance | **≥ 95** | [PRD → Performance](../product/PRODUCT_REQUIREMENTS.md) ("Lighthouse ≥ 95"). |
| Accessibility | **≥ 95** | QAT-2; the accessibility standard is WCAG 2.1 AA ([ACCESSIBILITY.md](./ACCESSIBILITY.md)). |
| Best Practices | **≥ 95** | Premium-product bar; catches console errors, insecure requests, deprecated APIs. |
| SEO | **≥ 95** | QAT-6; server-rendered HTML + metadata make this reachable ([SEO.md](./SEO.md)). |

The brief and PRD require Lighthouse ≥ 95; v1.0.0 applies that floor to **all
four categories**, not performance alone, because the portfolio's credibility
depends on accessibility and SEO scoring as highly as speed.

### 2.2 Core Web Vitals (field + lab thresholds)

| Metric | Budget | Meaning |
| --- | --- | --- |
| **LCP** — Largest Contentful Paint | **≤ 2.5 s** | Time to render the largest above-the-fold element. |
| **INP** — Interaction to Next Paint | **≤ 200 ms** | Responsiveness to user input across the visit. |
| **CLS** — Cumulative Layout Shift | **≤ 0.1** | Visual stability; no content jumping. |

These are the "good" thresholds defined by Core Web Vitals and required by
[PRD → Performance](../product/PRODUCT_REQUIREMENTS.md) ("Excellent Core Web
Vitals"). INP is used as the responsiveness metric (it superseded FID as a Core
Web Vital). For a statically-biased, minimal-JS site these are comfortably
attainable; the budget exists to *keep* them so, not to reach them once.

### 2.3 Per-route JavaScript ceiling

Bundle size is budgeted **per route**, not globally, so the cost of any one page
is owned rather than averaged. The v1.0.0 ceilings (compressed, first-load JS
delivered to the client for a route):

| Route class | First-load JS ceiling (gzip/br) | Rationale |
| --- | --- | --- |
| **Content routes** (landing, about, projects, blog, docs) | **≤ 100 KB** | Mostly Server Components; the only client JS is the framework runtime plus tiny islands (theme toggle, language switcher). |
| **Interaction-heavy routes** (playground, command menu — later milestones) | **≤ 160 KB** | Genuine interactivity justifies more, but each addition is reviewed against this ceiling. |
| **Any single client island** | **≤ 30 KB** added | Keeps islands at the leaves and small ([ARCHITECTURE §5.1](./ARCHITECTURE.md#51-server-first-by-default)). |

**Why these numbers.** They are chosen to be *achievable by the server-first
architecture, not by heroic optimization*. A page that is almost entirely
Server Components ships little more than the framework runtime; 100 KB leaves
generous room for that plus the handful of small islands the design calls for,
while being tight enough that adding a heavy client dependency trips the gate and
forces a conscious decision. The ceilings are proposed defaults for v1.0.0 and
are revisited if a justified feature (e.g. the playground) proves them wrong —
but the revision is explicit, not silent drift.

---

## 3. Techniques

The budget is the target; these techniques are how it is met. They are ordered
by leverage — the earliest items prevent cost, the later ones optimize what
remains.

### 3.1 Server-first rendering (the primary lever)

The single largest performance decision is architectural: **components are
Server Components unless interactivity forces otherwise**
([ARCHITECTURE §5.1](./ARCHITECTURE.md#51-server-first-by-default)). Server
Components ship *zero* component JavaScript, render to HTML on the server, and
read content directly. This is what makes the per-route JS ceiling attainable
and directly serves LCP (HTML arrives ready) and INP (little JS to block the main
thread). Every other technique here is secondary to keeping the client tree
small.

### 3.2 Static bias and streaming

- **Static by default.** Content is known at build time, so pages are statically
  generated and served from the Vercel edge
  ([ARCHITECTURE §5.2](./ARCHITECTURE.md#52-static-bias-streaming-and-boundaries)).
  Edge-delivered static HTML is the fastest possible LCP path. The concrete
  static/dynamic decision per route is owned by
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md).
- **Streaming & Suspense.** Where a page benefits from progressive delivery,
  above-the-fold content streams first inside Suspense boundaries, improving
  perceived LCP and letting slower sections resolve without blocking the shell.

### 3.3 Images

Per [DESIGN_SYSTEM → Images](../design/DESIGN_SYSTEM.md) and
[ARCHITECTURE §4.1](./ARCHITECTURE.md#41-decided):

- Use **`next/image`** for all raster imagery; serve **AVIF/WebP** with
  automatic responsive `srcset`.
- **Always set explicit `width`/`height`** (or `fill` with a sized container) so
  the layout reserves space — the primary defense for **CLS ≤ 0.1**.
- **Prioritize the LCP image** (e.g. the hero) so it is not lazy-loaded; lazy-load
  everything below the fold.
- Prefer SVG for icons (Lucide) and logos so they cost near-nothing and scale
  crisply.

### 3.4 Fonts

Font loading is a top CLS and LCP risk. The font *design* is owned by
[TYPOGRAPHY.md](../design/TYPOGRAPHY.md); the loading strategy here:

- Load fonts through the framework's font optimization (self-hosted, no
  render-blocking third-party request) so there is no external round-trip.
- Use `font-display: swap` with a **size-adjusted fallback** so text is visible
  immediately and the swap does not shift layout (protecting CLS).
- **Subset** to the glyphs actually used; the Arabic face
  ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)) is loaded only for the
  `ar` locale, not shipped to English visitors.
- Keep the family count minimal (a primary and a monospace), consistent with the
  "minimal font weights" typography philosophy.

### 3.5 Minimal client JavaScript & code-splitting at islands

- **Push interactivity to the leaves.** Client Components are small islands
  (theme toggle, language switcher, gallery, command menu); the surrounding
  layout stays server-rendered ([ARCHITECTURE §5.1](./ARCHITECTURE.md#51-server-first-by-default)).
- **Code-split heavy or rarely-used islands.** A feature that is not needed for
  first paint (e.g. the playground, a modal) is dynamically imported so its cost
  is not in the initial bundle and does not count against first-load JS.
- **No global-state library by default** ([ARCHITECTURE §7](./ARCHITECTURE.md#7-state-management-model)):
  such libraries add client weight and are introduced only with a documented
  justification.
- **Audit every dependency.** A client dependency is a budget line item; prefer
  a platform API or a server-side solution before adding one.

### 3.6 Route prefetching

Let the App Router prefetch in-viewport links so that navigations feel instant
without a manual data layer. Prefetching is a perceived-performance win (fast
subsequent navigations) that costs nothing at initial load; it is left at the
framework default and not defeated.

---

## 4. Measurement & CI Gate

A budget that is not measured is a wish. The intent for v1.0.0:

- **Lab measurement in CI.** A Lighthouse run (via Lighthouse CI or an
  equivalent) executes on representative routes for **every pull request**, on
  **both locales**, in dark and light themes. The category budgets in
  [§2.1](#21-lighthouse) are **assertions**: a score below budget **fails the
  check**. This is the gate that makes the budget real.
- **Bundle budget in CI.** The per-route JS ceilings in
  [§2.3](#23-per-route-javascript-ceiling) are enforced as a size check on the
  build output; exceeding a ceiling fails the check and names the offending
  route.
- **Field measurement.** Real-user Core Web Vitals (LCP/INP/CLS) are collected
  in production once analytics land — a [Version 2](../product/PRODUCT_REQUIREMENTS.md)
  concern, consistent with the architecture deferring analytics
  ([ARCHITECTURE §10](./ARCHITECTURE.md#10-cross-cutting-concerns)). Lab gating
  covers v1.0.0; field data confirms it later.
- **Preview deployments** (Vercel, per change) provide a production-like target
  for these measurements before merge.

The CI gate is intent, not yet tooling: this document defines *what must be
enforced*; the concrete workflow lands with the engineering-workflow
documentation. Until then the budgets are review criteria.

---

## 5. Engineering Decisions

- **Lighthouse ≥ 95 across all four categories**, not performance alone —
  raising the PRD floor to cover accessibility, best practices, and SEO because
  the portfolio's credibility is holistic.
- **CWV budgets are the "good" thresholds** (LCP ≤ 2.5 s, INP ≤ 200 ms,
  CLS ≤ 0.1); INP is the chosen responsiveness metric.
- **JavaScript is budgeted per route** (100 KB content / 160 KB interaction / 30 KB
  per island), attributing cost to its source rather than a global average.
- **Server-first is the primary technique**, not an optimization; every other
  technique is secondary to keeping the client tree small.
- **CI gates the budget on every PR**, across both locales and themes; a failing
  score or an oversized bundle blocks merge.
- **KPI targets live in SUCCESS_METRICS.md**; this document owns budgets and
  techniques and stays at least as strict.

---

## Best Practices

- Write a Server Component first; reach for `"use client"` only when
  interactivity genuinely requires it, and keep the island small.
- Reserve space for every image and embed (explicit dimensions) to hold CLS.
- Prioritize the LCP element; lazy-load everything below the fold.
- Dynamically import anything not needed for first paint.
- Treat each new client dependency as a budget line item and justify it.
- Subset and locale-scope fonts; never ship the Arabic face to English readers.
- Run the Lighthouse and bundle checks locally before opening a PR.

---

## Common Mistakes

- **Client-by-default** — adding `"use client"` to a page or layout "to be
  safe," collapsing the server-first model and blowing the JS budget.
- **Unsized media** — images or embeds without dimensions, causing layout shift
  and a CLS failure.
- **A heavy dependency for a small effect** — importing a large library
  (animation, date, icon) for something the platform or a few lines of server
  code could do.
- **Blocking or unsubset fonts** — render-blocking font requests, or shipping
  every weight and both scripts to every visitor.
- **Averaging away cost** — reasoning about total bundle size instead of the
  per-route ceiling, so one heavy route hides behind light ones.
- **Optimizing before measuring** — hand-tuning without a Lighthouse/bundle
  number to confirm the change helped.
- **Treating the budget as advisory** — merging a regression because "it's only
  a little over."

---

## Examples

**A prioritized, sized hero image (illustrative).**

```tsx
// Server Component — no client JS.
import Image from "next/image";

<Image
  src={hero.src}
  alt={hero.alt}          // localized; see INTERNATIONALIZATION.md
  width={1280}
  height={720}            // explicit dimensions → no layout shift (CLS)
  priority                // it is the LCP element → not lazy-loaded
  sizes="(max-width: 768px) 100vw, 1280px"
/>
```

**Code-splitting a non-critical island (illustrative).**

```tsx
// The command menu is not needed for first paint → keep it out of first-load JS.
import dynamic from "next/dynamic";
const CommandMenu = dynamic(() => import("@/features/command-menu/CommandMenu"));
```

**Bundle budget as a CI assertion (illustrative shape).**

```jsonc
// Conceptual — per-route first-load JS ceilings enforced in CI.
{
  "content-routes":     { "maxFirstLoadKB": 100 },
  "interaction-routes": { "maxFirstLoadKB": 160 }
}
```

---

## Checklist

Use alongside the
[Architecture Checklist](./ARCHITECTURE.md#architecture-checklist).

- [ ] Is the page a Server Component except for small, justified islands?
- [ ] Does the route stay within its first-load JS ceiling
      ([§2.3](#23-per-route-javascript-ceiling))?
- [ ] Do all images use `next/image` with explicit dimensions and AVIF/WebP?
- [ ] Is the LCP element prioritized and everything below the fold lazy-loaded?
- [ ] Are fonts self-hosted, subset, `swap`-loaded with a sized fallback, and
      locale-scoped?
- [ ] Is anything not needed for first paint dynamically imported?
- [ ] Does the page meet Lighthouse ≥ 95 in all four categories, both locales,
      both themes?
- [ ] Are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 satisfied in the lab run?
- [ ] Do the CI Lighthouse and bundle checks pass?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — QAT-1, server-first, static bias.
- [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) — KPI targets (owner of the
  reported metrics).
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — per-route rendering &
  caching rules this budget assumes.
- [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) — font families loaded here.
- [DATA_FETCHING.md](./DATA_FETCHING.md) — data access & caching.
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — the accessibility category in the
  Lighthouse budget.
- [SEO.md](./SEO.md) — the SEO category in the Lighthouse budget.

---

## Revision History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 1.0.0 | July 2026 | Draft | Initial performance budget & strategy backing QAT-1: Lighthouse ≥ 95 (all categories), CWV (LCP ≤ 2.5 s / INP ≤ 200 ms / CLS ≤ 0.1), per-route JS ceilings, techniques, and CI-gate intent. |
