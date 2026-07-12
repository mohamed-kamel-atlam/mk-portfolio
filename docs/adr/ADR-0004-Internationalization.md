# ADR-0004: Internationalization Approach

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ARCHITECTURE → §9 Data Flow](../engineering/ARCHITECTURE.md#9-data-flow--request-lifecycle), [ARCHITECTURE → §10 Cross-Cutting Concerns](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns), [engineering/INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md), [engineering/SEO.md](../engineering/SEO.md), [ADR-0001 Next.js App Router](./ADR-0001-App-Router.md)

## Context

Internationalization is a **critical** requirement
([PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md)) and a foundational quality
attribute (QAT-5): the portfolio must ship in **English and Arabic**, with **RTL
support**, localized routes, localized metadata, a language switcher, and
automatic language detection. The architecture treats i18n as cross-cutting and
non-retrofittable — "retrofitting RTL after the fact is the most expensive
avoidable rework in this project"
([ARCHITECTURE → §10](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns)).

The *requirement* was fixed from the start; the *mechanism* was deliberately
deferred until routing was implemented
([ARCHITECTURE → §4.2](../engineering/ARCHITECTURE.md#42-deliberately-deferred)),
and the §9 request-lifecycle example flagged its `/ar/...` path as illustrative
pending this ADR
([ARCHITECTURE → §9 note](../engineering/ARCHITECTURE.md#9-data-flow--request-lifecycle)).
This ADR closes that deferral. It is the decision of record; the mechanics are
detailed in [engineering/INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md).

## Decision

Adopt **path-prefixed locale routing** built on the App Router
([ADR-0001](./ADR-0001-App-Router.md)):

- **Route shape.** All routes live under a dynamic locale segment,
  `app/[locale]/…`. The locale is the first path segment: `/en/projects`,
  `/ar/projects`.
- **Locales.** `en` (English, **LTR, default**) and `ar` (Arabic, **RTL**).
- **Direction from locale.** The document `dir` (and `lang`) is derived from the
  active locale — `ltr` for `en`, `rtl` for `ar` — and set on the server so
  layout is direction-correct in the first paint. RTL is a first-class layout
  concern, not a stylesheet afterthought.
- **Dictionary translations.** UI strings are resolved from per-locale
  dictionaries, loaded on the server for the active locale. Content (MDX +
  structured data) is authored per locale through the content layer.
- **Localized metadata + hreflang.** Titles, descriptions, Open Graph, and
  structured data are localized per route via the Metadata API, and reciprocal
  `hreflang` alternate links are emitted for every localized route (QAT-6).
- **Detection with user override.** When no locale prefix is present, the
  preferred locale is detected (e.g. `Accept-Language`) and the visitor is
  routed to it; an explicit choice via the language switcher overrides detection
  and is remembered. The URL prefix always wins as the source of truth for the
  active locale.

## Rationale (Why)

- **The URL is the locale's source of truth.** Encoding the locale in the path
  makes it URL state ([ARCHITECTURE → §7, level 2](../engineering/ARCHITECTURE.md#7-state-management-model)),
  read on the server — shareable, bookmarkable, and crawlable — instead of
  hidden client or cookie state. This is exactly the "state that should be
  shareable" the state hierarchy assigns to URL state.
- **SEO wants distinct, indexable URLs per locale.** Each language version has
  its own address, and `hreflang` tells search engines how the versions relate —
  directly serving QAT-6 and [PRD → SEO (Localized SEO)](../product/PRODUCT_REQUIREMENTS.md).
- **Server-set direction avoids a flash and rework.** Deriving `dir`/`lang` from
  the locale segment on the server means the first paint is already correct for
  RTL, honoring the "build direction-aware from line one" mandate
  ([ARCHITECTURE → §10](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns))
  and QAT-2/QAT-1.
- **It fits the App Router natively.** A `[locale]` segment with nested layouts
  is idiomatic ([ADR-0001](./ADR-0001-App-Router.md)); the locale is available
  to every Server Component for dictionary and metadata resolution without
  client plumbing.
- **Detection is convenience, not authority.** Automatic detection satisfies
  FR-001, but because the path is authoritative, a shared or bookmarked link is
  deterministic regardless of the recipient's browser settings — and the visitor
  can always override.

## Alternatives Considered

- **Domain / subdomain per locale (`example.com` + `ar.example.com`, or ccTLDs).**
  A recognized i18n pattern with strong geo-signaling. *Rejected* for a single
  personal portfolio on **Vercel**: it multiplies DNS, certificate, and
  deployment configuration, fragments analytics and link equity, and buys
  geo-targeting the product does not need. The complexity serves large
  multi-region businesses, not a two-locale portfolio — contrary to *simplicity
  when in doubt*.
- **Cookie-only locale (no locale in the path).** Store the choice in a cookie
  and serve the same URL in different languages. *Rejected* because it makes the
  URL ambiguous: the same address renders different content per visitor, which
  breaks shareable links, complicates caching of static output, and is hostile
  to SEO (no distinct URL to index, no clean `hreflang`). It also pushes locale
  out of URL state and into hidden state, contradicting the state hierarchy.
- **Query-parameter locale (`?lang=ar`).** *Rejected* for the same
  URL-as-source-of-truth reasons, plus weaker SEO treatment of query variants
  and a less clean, less premium URL than a path prefix.

## Consequences

### Positive
- Every locale has a distinct, shareable, indexable URL with correct `hreflang`
  (QAT-5, QAT-6).
- Direction and language are resolved on the server, so RTL is correct in the
  first paint and treated as first-class throughout.
- Locale is plain URL state, read in Server Components, keeping the client thin
  and consistent with the state hierarchy.

### Negative
- Every route lives under `[locale]`, so links and navigation must be
  locale-aware by construction; a locale-agnostic link is a bug.
- Two content trees (en/ar) must be authored and kept in sync; missing
  translations need a defined fallback policy (specified in
  [engineering/INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md)).
- RTL correctness must be verified for every component, not assumed.

### Neutral
- The concrete dictionary format, detection/fallback rules, locale-aware link
  helpers, and middleware are specified in
  [engineering/INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md);
  this ADR fixes the routing strategy, not the file-level mechanics.
- Adding a third locale later is additive under this scheme (a new prefix +
  dictionary + content), not a structural change.

## Compliance / Enforcement

- All application routes live under `app/[locale]/`; there are no locale-less
  page routes.
- Links use locale-aware helpers rather than hardcoded paths; direction-sensitive
  styling uses logical properties so RTL is correct by default.
- The [Architecture Checklist → Cross-cutting concerns](../engineering/ARCHITECTURE.md#architecture-checklist)
  gates every component on being locale-aware and direction-aware (LTR and RTL)
  and on correct localized metadata for SEO.

## Related Documents

- [engineering/INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md) — the detailed mechanics.
- [engineering/SEO.md](../engineering/SEO.md) — localized metadata, hreflang, canonical URLs.
- [ARCHITECTURE → §9](../engineering/ARCHITECTURE.md#9-data-flow--request-lifecycle), [§10](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns)
- [ADR-0001 Next.js App Router](./ADR-0001-App-Router.md)
- [PRD → FR-001 Internationalization](../product/PRODUCT_REQUIREMENTS.md)
