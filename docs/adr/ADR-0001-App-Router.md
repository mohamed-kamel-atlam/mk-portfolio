# ADR-0001: Next.js App Router

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ADR-0006 Rendering Strategy](./ADR-0006-Rendering-Strategy.md), [ADR-0004 Internationalization](./ADR-0004-Internationalization.md), [ARCHITECTURE → §4 Technology Stack](../engineering/ARCHITECTURE.md#4-technology-stack--decided--deliberately-deferred), [ARCHITECTURE → §5 Rendering & Execution Model](../engineering/ARCHITECTURE.md#5-rendering--execution-model), [PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md)

## Context

The portfolio is a statically-biased, content-driven web application with no
application backend and no runtime database
([ARCHITECTURE → §3](../engineering/ARCHITECTURE.md#3-system-context--boundaries)).
Its highest-priority quality attributes are **performance by default** (QAT-1:
Lighthouse ≥ 95, excellent Core Web Vitals) and **SEO** (QAT-6:
server-rendered HTML, localized metadata, structured data), followed by
maintainability, scalability, and first-class internationalization (QAT-3,
QAT-4, QAT-5).

Meeting QAT-1 and QAT-6 well requires a framework that renders HTML on the
server by default, ships minimal client JavaScript, streams content
progressively, exposes a first-class metadata mechanism, and provides
file-system routing that stays thin. The framework decision is the foundation
every later decision (rendering, i18n, structure) is built on, so it must be
settled first.

This choice is also an **owner directive**: Next.js with the App Router is
mandated and non-negotiable ([PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md),
[ARCHITECTURE → §4.1](../engineering/ARCHITECTURE.md#41-decided)). This ADR
records the decision and the reasoning that makes it the right mandate, rather
than reopening it.

## Decision

Build the application on **Next.js using the App Router** (the `app/` directory
model), not the legacy Pages Router. The App Router is the routing, rendering,
and metadata substrate for the entire product. It brings four capabilities the
architecture depends on:

- **React Server Components** as the default execution context, enabling the
  server-first model in [ADR-0006](./ADR-0006-Rendering-Strategy.md).
- **Streaming and Suspense** at the route level, with built-in `loading` and
  `error` conventions.
- **The Metadata API** for per-route, per-locale metadata, Open Graph, and
  structured data.
- **File-system routing** with nested layouts and dynamic segments, including
  the `app/[locale]/` segment that ADR-0004 relies on.

## Rationale (Why)

- **The default is the one we want.** In the App Router a component is a Server
  Component unless it opts out. That default *is* the server-first, minimal-
  client posture QAT-1 demands
  ([ARCHITECTURE → §5.1](../engineering/ARCHITECTURE.md#51-server-first-by-default));
  we get it without swimming against the framework.
- **SEO is a rendering property, not a plugin.** Server-rendered markup plus the
  Metadata API give correct, localized, crawlable HTML for every route
  (QAT-6) as a native capability, including the localized metadata and hreflang
  that ADR-0004 requires.
- **Layouts and segments match the information architecture.** Nested layouts
  and dynamic segments map cleanly onto the routes in the
  [PRD Information Architecture](../product/PRODUCT_REQUIREMENTS.md) and keep the
  routing layer thin — it composes features rather than implementing them
  ([ARCHITECTURE → §6](../engineering/ARCHITECTURE.md#6-application-structure)).
- **Platform fit.** Next.js on **Vercel** is a first-party pairing: edge
  delivery of static output, built-in image optimization backing the
  `next/image` decision, and preview deployments
  ([ARCHITECTURE → §11](../engineering/ARCHITECTURE.md#11-deployment--runtime-environment)).
- **It is the strategic direction of the ecosystem.** The App Router and Server
  Components are where React and Next.js investment is concentrated; building on
  them keeps the portfolio — itself a demonstration of current engineering
  practice — aligned with the platform's future rather than its legacy.

## Alternatives Considered

- **Next.js Pages Router.** The mature, well-understood predecessor. *Rejected*
  because it is client-hydration-first: data fetching (`getServerSideProps` /
  `getStaticProps`) and the rendering model are less aligned with a server-first
  posture, it lacks native React Server Components and streaming layouts, and it
  is no longer the strategic surface. Choosing it would mean adopting the
  framework's past to demonstrate present-day engineering.
- **Vite + React SPA.** A fast, minimal client-side build. *Rejected* because a
  client-rendered single-page app ships a large bundle, hydrates the entire
  tree, and degrades Core Web Vitals and SEO — a direct conflict with QAT-1,
  QAT-6, and the product principle *performance over visual effects*
  ([ARCHITECTURE → §5.3](../engineering/ARCHITECTURE.md#53-why-not-a-client-first-spa)).
  SSR and metadata would have to be rebuilt by hand.
- **Remix.** Excellent server-first data and nested-routing story. *Rejected*
  because it does not change the outcome relative to the mandate: it overlaps
  heavily with what the App Router already provides, has a smaller ecosystem and
  weaker Server Components story at decision time, and its data model is oriented
  toward mutation-heavy apps — whereas this product is read-only content with a
  single contact side effect.
- **Astro.** Superb for static, island-based content sites and would serve QAT-1
  handsomely. *Rejected* because the product must behave like a modern SaaS
  application, not a document site
  ([Brand → Target Impression](../product/BRAND.md)); its interactive surfaces
  (theme, command menu, playground, gallery, contact) and the React Server
  Components model are better served by a full React framework. Adopting Astro
  would also contradict the owner mandate.

## Consequences

### Positive
- The server-first execution model (ADR-0006) is the framework default, directly
  serving QAT-1 and QAT-6.
- Localized routing (ADR-0004), streaming, and metadata are native capabilities,
  not bolt-ons.
- Tight Vercel integration gives edge delivery, image optimization, and preview
  deployments with minimal configuration.

### Negative
- The App Router / Server Components model has a real learning curve; the
  server/client boundary must be understood to avoid accidentally shipping
  client-heavy trees ([Common Mistakes → client-by-default](../engineering/ARCHITECTURE.md#common-mistakes)).
- Some third-party libraries assume a browser context and must be isolated
  behind Client Component boundaries.
- A degree of coupling to the Next.js and Vercel platform is accepted as a
  deliberate trade for the capabilities above.

### Neutral
- **TypeScript** is the working language ([ARCHITECTURE → §4.1](../engineering/ARCHITECTURE.md#41-decided));
  the App Router supports it first-class. (TypeScript itself is tracked as an
  open owner assumption in the overview, not decided by this ADR.)
- The framework is fixed; the animation and state-management libraries remain
  deliberately deferred ([ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md#42-deliberately-deferred)).

## Compliance / Enforcement

- All routing lives under `app/` using App Router conventions (layouts, route
  segments, `loading`/`error`, `metadata`). The Pages Router (`pages/`) is not
  used.
- The concrete rendering rules that follow from this choice are governed by
  [ADR-0006](./ADR-0006-Rendering-Strategy.md) and
  [engineering/RENDERING_STRATEGY.md](../engineering/RENDERING_STRATEGY.md).
- The [Architecture Checklist](../engineering/ARCHITECTURE.md#architecture-checklist)
  gates every feature on server-first rendering and correct SEO metadata,
  which presuppose this decision.

## Related Documents

- [ARCHITECTURE → §4](../engineering/ARCHITECTURE.md#4-technology-stack--decided--deliberately-deferred), [§5](../engineering/ARCHITECTURE.md#5-rendering--execution-model)
- [ADR-0006 Rendering Strategy](./ADR-0006-Rendering-Strategy.md)
- [ADR-0004 Internationalization](./ADR-0004-Internationalization.md)
- [PRD → FR-007 Engineering Decisions](../product/PRODUCT_REQUIREMENTS.md)
- Next.js App Router — <https://nextjs.org/docs/app>
