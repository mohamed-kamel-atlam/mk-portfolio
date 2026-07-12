# Articles & Official Documentation

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document curates the **official documentation and canonical articles** that
define the technical standards the implementation follows. Where
[books.md](./books.md) holds the *principles*, this file holds the *specifications
and primary references* — the authoritative sources for the decided technology
stack and the non-functional requirements.

Every entry links a primary source (an official docs site or a standards body),
never a mirror or aggregator, with one line on why it is relevant here.

---

## Scope

**In scope.** First-party documentation and canonical references for the
framework, rendering model, performance, accessibility, styling, and metadata
standards adopted in the [architecture](../engineering/ARCHITECTURE.md).

**Out of scope.** Books (see [books.md](./books.md)); product inspirations (see
[inspiration.md](./inspiration.md)); and any non-primary or paywalled source.

---

## Framework & rendering

### Next.js — App Router documentation

The official reference for the mandated framework and routing model, covering
Server Components, layouts, streaming, and file-system routing. Authority for
[ADR-0001](../adr/ADR-0001-App-Router.md) and the rendering model in
[ARCHITECTURE → §5](../engineering/ARCHITECTURE.md).
<https://nextjs.org/docs/app>

### React — Server Components

The primary explanation of the React Server Components model that the
server-first architecture is built on. Grounds the *server-first, minimal
client* principle in [ARCHITECTURE → §2](../engineering/ARCHITECTURE.md).
<https://react.dev/reference/rsc/server-components>

### Next.js — Metadata API (`generateMetadata`)

The official reference for producing server-rendered, per-route, localized
metadata. Authority for the SEO approach (QAT-6) and localized metadata in
[PRD → SEO](../product/PRODUCT_REQUIREMENTS.md).
<https://nextjs.org/docs/app/api-reference/functions/generate-metadata>

---

## Performance

### web.dev — Core Web Vitals

Google's canonical definition of the Core Web Vitals (LCP, INP, CLS) and how
they are measured. The source of the measurable performance targets behind QAT-1
in [ARCHITECTURE → §1](../engineering/ARCHITECTURE.md) and
[SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md).
<https://web.dev/articles/vitals>

---

## Accessibility

### W3C — Web Content Accessibility Guidelines (WCAG) 2.1

The standard the project conforms to at level AA. The authoritative reference
for QAT-2 (*accessibility is non-negotiable*) and the accessibility
requirements in [PRD → Accessibility](../product/PRODUCT_REQUIREMENTS.md).
<https://www.w3.org/TR/WCAG21/>

### MDN Web Docs

The reference for HTML semantics, ARIA, and web-platform behavior underpinning
the *semantic HTML first* accessibility standard and cross-browser correctness.
<https://developer.mozilla.org>

---

## Styling

### Tailwind CSS — Documentation

The official reference for the utility-first styling engine wired to the
project's design tokens. Authority for [ADR-0003](../adr/ADR-0003-Tailwind.md)
and the *tokens over hardcoding* principle.
<https://tailwindcss.com/docs>

---

## Summary

| Reference | Standard for | Relevant to |
| --- | --- | --- |
| Next.js App Router | Framework & routing | [ADR-0001](../adr/ADR-0001-App-Router.md), [ARCHITECTURE §5](../engineering/ARCHITECTURE.md) |
| React Server Components | Rendering model | [ARCHITECTURE §2, §5](../engineering/ARCHITECTURE.md) |
| Next.js Metadata API | SEO metadata | [PRD → SEO](../product/PRODUCT_REQUIREMENTS.md) |
| web.dev Core Web Vitals | Performance targets | [QAT-1](../engineering/ARCHITECTURE.md), [SUCCESS_METRICS](../product/SUCCESS_METRICS.md) |
| WCAG 2.1 | Accessibility (AA) | [QAT-2](../engineering/ARCHITECTURE.md) |
| MDN Web Docs | Web-platform semantics | Accessibility, correctness |
| Tailwind CSS docs | Styling | [ADR-0003](../adr/ADR-0003-Tailwind.md) |

---

## Related Documents

- [references/README.md](./README.md) — how this section is organized.
- [books.md](./books.md) — the principles behind the design decisions.
- [inspiration.md](./inspiration.md) — product inspirations.
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — the standards these references define.
- [SUCCESS_METRICS.md](../product/SUCCESS_METRICS.md) — the measurable targets several of these references set.
