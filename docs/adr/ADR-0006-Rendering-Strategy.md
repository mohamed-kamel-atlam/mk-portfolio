# ADR-0006: Rendering Strategy

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ADR-0001 Next.js App Router](./ADR-0001-App-Router.md), [ARCHITECTURE → §5 Rendering & Execution Model](../engineering/ARCHITECTURE.md#5-rendering--execution-model), [engineering/RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md), [engineering/DATA_FETCHING.md](../engineering/DATA_FETCHING.md)

## Context

Performance by default (QAT-1) is the highest-priority quality attribute after
correctness and accessibility, and SEO (QAT-6) depends on server-rendered HTML.
The product principle *performance over visual effects*
([PRD → Product Principles](../product/PRODUCT_REQUIREMENTS.md),
[Design Principles → Principle 5](../design/DESIGN_PRINCIPLES.md)) makes the
rendering model a first-order product concern, not an implementation detail.

The content is known at build time: projects, case studies, articles, and
journey entries originate as MDX and structured data committed to the repository
([ARCHITECTURE → §8](../engineering/ARCHITECTURE.md#8-content-architecture)),
with no runtime database. This shapes *what kind* of rendering is even necessary.

[ADR-0001](./ADR-0001-App-Router.md) selected the Next.js App Router, which
makes React Server Components the default execution context. This ADR records
*how* we use that capability across the application: the standing rendering
posture that every page and component is built against.

## Decision

Adopt a **server-first rendering strategy**:

1. **Server Components by default.** A component is a Server Component unless it
   must run on the client. Server Components render to HTML on the server, ship
   no component JavaScript, and read content directly at render time.
2. **`"use client"` only when justified**, and only for genuine interactivity —
   event handlers, browser-only APIs, React state/effects, or a stateful
   third-party widget. Interactivity is pushed to the **leaves** of the tree so
   client "islands" stay small and isolated.
3. **Static by default.** Because content is known at build time, pages are
   statically generated and regenerated on deploy.
4. **Streaming with Suspense** where a page benefits from progressive delivery,
   so above-the-fold content is sent first; route-level `loading` and `error`
   states are part of the model.

Conceptually (from [ARCHITECTURE → §5.1](../engineering/ARCHITECTURE.md#51-server-first-by-default)):

```
app/[locale]/page.tsx        (Server) — reads content, composes layout
└─ HeroSection               (Server) — pure markup + tokens
   └─ ThemeToggle            (Client) — "use client": needs state + browser API
```

## Rationale (Why)

- **The biggest performance lever is not shipping JavaScript.** Server-rendering
  the layout, content, and structure, and hydrating only small leaf islands,
  minimizes bundle size and hydration cost — the primary mechanism for QAT-1
  ([ARCHITECTURE → §2, principle 2](../engineering/ARCHITECTURE.md#2-architectural-principles)).
- **Static output serves both QAT-1 and QAT-6.** Build-time HTML can be delivered
  from Vercel's edge network globally
  ([ARCHITECTURE → §11](../engineering/ARCHITECTURE.md#11-deployment--runtime-environment)),
  and crawlers receive complete, localized markup without executing JavaScript.
- **The content model makes static the natural fit.** With no runtime database
  and content validated at build time
  ([ARCHITECTURE → §8](../engineering/ARCHITECTURE.md#8-content-architecture)),
  there is nothing per-request to compute for most pages; paying for
  per-request rendering would be waste.
- **Streaming protects perceived performance** for any page with a slower or
  deferred section, without abandoning the static bias — the fast part still
  arrives first.
- **Islands keep the interactive surfaces honest.** Theme toggle, gallery
  interactions, command menu, and the contact form are real interactivity; the
  leaf-island rule contains their cost instead of letting it leak up the tree.

## Alternatives Considered

- **Client-first SPA (render/hydrate everything on the client).** *Rejected.* It
  ships a large bundle, hydrates the whole tree, and degrades Core Web Vitals
  and SEO — a direct conflict with QAT-1 and QAT-6 and with *performance over
  visual effects*
  ([ARCHITECTURE → §5.3](../engineering/ARCHITECTURE.md#53-why-not-a-client-first-spa)).
  This is the anti-pattern the whole architecture is designed to avoid.
- **SSR on every request (dynamic rendering everywhere).** *Rejected* as the
  default. For content fixed at build time it adds per-request compute and
  latency with no benefit, and forfeits cheap edge caching of static output.
  Dynamic rendering is reserved for the genuinely request-dependent path (the
  later contact flow), not adopted wholesale.
- **Full SSG only, without streaming.** *Rejected.* Pure static generation with
  no streaming or Suspense is close to the chosen model but strictly less
  capable: a single slow section would block the whole page's delivery. Keeping
  streaming and Suspense in the model costs nothing for fully static pages and
  preserves perceived performance where a page needs progressive delivery.

## Consequences

### Positive
- Minimal client JavaScript and maximal server-rendered HTML directly serve
  QAT-1 and QAT-6.
- The default path (Server Component + static generation) is also the simplest
  and cheapest, aligning with *simplicity when in doubt*.
- Edge-delivered static output gives consistent global performance.

### Negative
- Engineers must consciously manage the server/client boundary; adding
  `"use client"` too high in the tree collapses the model
  ([Common Mistakes → client-by-default](../engineering/ARCHITECTURE.md#common-mistakes)).
- Interactive features require deliberate island design rather than reaching for
  client-side state freely.
- Client-only libraries need isolation behind Client Component boundaries.

### Neutral
- Concrete per-route rendering, caching, and revalidation rules are deferred to
  [engineering/RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md) and
  [engineering/DATA_FETCHING.md](../engineering/DATA_FETCHING.md) (M5); this ADR
  fixes the posture, not the per-route mechanics.
- The strategy is enabled by, and depends on, [ADR-0001](./ADR-0001-App-Router.md).

## Compliance / Enforcement

- Write a Server Component first; add `"use client"` only when interactivity
  forces it, and push the boundary to the leaves
  ([Best Practices](../engineering/ARCHITECTURE.md#best-practices)).
- The [Architecture Checklist → Rendering & execution](../engineering/ARCHITECTURE.md#architecture-checklist)
  gates every page on: Server Component unless interactivity requires otherwise,
  islands pushed to the leaves, and static generation where content allows.
- Per-route rendering decisions are documented alongside their routes in
  [engineering/RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md).

## Related Documents

- [ARCHITECTURE → §5 Rendering & Execution Model](../engineering/ARCHITECTURE.md#5-rendering--execution-model)
- [ADR-0001 Next.js App Router](./ADR-0001-App-Router.md)
- [engineering/RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md), [engineering/DATA_FETCHING.md](../engineering/DATA_FETCHING.md)
- React Server Components — <https://react.dev/reference/rsc/server-components>
- Core Web Vitals — <https://web.dev/articles/vitals>
