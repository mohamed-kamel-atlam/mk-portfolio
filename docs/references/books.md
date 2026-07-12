# Books

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document is a curated list of books whose principles inform this project's
engineering and design standards. Each entry is a real, well-known title, cited
with its author(s) and one line on why it is relevant *here*.

The list is deliberately short. It favors books that shaped an actual decision
in the [architecture](../engineering/ARCHITECTURE.md) or
[design](../design/DESIGN_LANGUAGE.md) documents over a broad survey of the
field.

---

## Scope

**In scope.** Foundational books on software design, UI, accessibility, and
engineering craft that underpin the project's principles.

**Out of scope.** Official documentation and articles (see
[articles.md](./articles.md)); product inspirations (see
[inspiration.md](./inspiration.md)); and titles that have not informed a
decision here.

---

## Software design & engineering craft

### A Philosophy of Software Design — John Ousterhout

On managing complexity as the central problem of software design. Its argument
for deep modules and against needless complexity is the intellectual backbone of
the *Simplicity when in doubt* principle and the feature-boundary discipline in
[ARCHITECTURE → §2](../engineering/ARCHITECTURE.md).

### The Pragmatic Programmer — Andrew Hunt & David Thomas

A field guide to pragmatic engineering habits. Its DRY principle and its stance
on deliberate, incremental craft inform the project's *reference-don't-repeat*
documentation rule and the just-in-time delivery philosophy in
[ROADMAP.md](../product/ROADMAP.md).

### Refactoring — Martin Fowler

The canonical catalog of behavior-preserving code improvement. It grounds the
project's expectation that structure is continuously improved rather than
frozen — relevant to [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) and
the maintainability attribute (QAT-3).
<https://martinfowler.com/books/refactoring.html>

---

## Design, UI & interaction

### Refactoring UI — Adam Wathan & Steve Schoger

Practical rules for building polished interfaces without a designer's
background: hierarchy through spacing and typography, restrained color, and
systematic decisions. Directly supports the token-driven design system and the
[Typography Philosophy](../design/DESIGN_LANGUAGE.md).
<https://www.refactoringui.com>

### Atomic Design — Brad Frost

The methodology for building interfaces as composable, reusable systems rather
than one-off pages. It underpins the component philosophy — reusable,
composable, single-responsibility components — in
[DESIGN_LANGUAGE → Component Philosophy](../design/DESIGN_LANGUAGE.md) and the
[COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md).
<https://atomicdesign.bradfrost.com>

### The Design of Everyday Things — Don Norman

The foundational text on affordances, feedback, and human-centered design. It
informs the [UX Principles](../product/BRAND.md) of clarity and discoverability
and the standard that every interaction communicates its purpose.

---

## Accessibility

### Inclusive Components — Heydon Pickering

A pattern-by-pattern guide to building genuinely accessible, robust interface
components. It is the practical reference behind QAT-2 (*accessibility is
non-negotiable*) in [ARCHITECTURE → §1](../engineering/ARCHITECTURE.md) and the
accessibility requirements in [DESIGN_LANGUAGE → Accessibility](../design/DESIGN_LANGUAGE.md).
<https://inclusive-components.design>

---

## Related Documents

- [references/README.md](./README.md) — how this section is organized.
- [articles.md](./articles.md) — official documentation and canonical articles.
- [inspiration.md](./inspiration.md) — product inspirations.
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — the engineering principles these books underpin.
- [DESIGN_LANGUAGE.md](../design/DESIGN_LANGUAGE.md) — the design philosophy these books inform.
