# ADR-0005: Theme System

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ARCHITECTURE → §10 Cross-Cutting Concerns](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns), [ADR-0003 Tailwind + Design Tokens](./ADR-0003-Tailwind.md), [design/COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md), [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [design/DESIGN_LANGUAGE.md](../design/DESIGN_LANGUAGE.md)

## Context

A theme system is a **critical** requirement
([PRD → FR-002](../product/PRODUCT_REQUIREMENTS.md)): **dark**, **light**, and
**system** themes, with **persistence**, **smooth transitions**, and
**accessible colors**. The design direction is explicitly **dark-first** —
"Dark-first. Light mode should feel equally premium"
([Design Language → Color Philosophy](../design/DESIGN_LANGUAGE.md);
[Brand → Visual Principles](../product/BRAND.md): "Dark-first experience").

Theming is a cross-cutting concern in the architecture: themes are expressed
entirely through design tokens and components never reference raw colors
([ARCHITECTURE → §10](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns)),
which ties this decision directly to the token rule in
[ADR-0003](./ADR-0003-Tailwind.md) and QAT-7. Two forces shape the mechanism:
the server-first model ([ADR-0006](./ADR-0006-Rendering-Strategy.md)) means the
initial HTML is rendered before any client code runs, so the theme must be
correct on the first paint — a **flash of the wrong theme** is unacceptable and
QAT-2 requires the chosen palette to meet contrast standards in both modes.

## Decision

Adopt a **dark-first theme system** with three user-selectable modes — **dark**,
**light**, and **system** (follow the OS `prefers-color-scheme`) — expressed
**entirely through semantic design tokens**:

- **Semantic tokens, not raw colors.** Components reference semantic tokens
  (`surface`, `foreground`, `border`, `accent`, …) whose values are backed by
  CSS custom properties. Switching theme reassigns those variables; component
  markup and classes do not change. This is the same token binding used by
  [ADR-0003](./ADR-0003-Tailwind.md).
- **Dark as the default.** The dark palette is the baseline the design is built
  against; light is a first-class, equally premium alternative, not a
  wash-out of dark.
- **Persistence.** An explicit choice is persisted and restored on the next
  visit; `system` mode tracks the OS preference live.
- **No flash of incorrect theme.** The active theme is resolved and applied
  before first paint (a small blocking script sets the theme attribute from the
  persisted value / system preference ahead of hydration), so server-rendered
  HTML never flips theme after load.
- **Accessible in both modes.** Both palettes meet WCAG AA contrast (QAT-2);
  transitions respect reduced-motion.

The theme toggle is the canonical example of a leaf **Client Component** island
in the server-first model
([ARCHITECTURE → §5.1](../engineering/ARCHITECTURE.md#51-server-first-by-default)).

## Rationale (Why)

- **Tokens make theming free per component.** Because color is always a semantic
  token resolved through CSS variables, one component definition renders
  correctly in every theme; there is no per-component theme branching. This is
  the QAT-7 token rule doing double duty
  ([ADR-0003](./ADR-0003-Tailwind.md)) and it keeps the client thin (QAT-1).
- **Dark-first matches the product.** The premium, engineering-first SaaS
  aesthetic the brand targets is a dark-first one
  ([Design Language](../design/DESIGN_LANGUAGE.md),
  [Brand](../product/BRAND.md)); designing dark-first and deriving light avoids a
  light-biased palette that feels dim when inverted.
- **No-flash is a correctness requirement, not polish.** With server-rendered
  HTML ([ADR-0006](./ADR-0006-Rendering-Strategy.md)), a theme applied only after
  hydration would visibly flash. Resolving theme before paint keeps the
  experience premium and avoids a jarring first impression the brand cannot
  afford ([Brand → Target Impression](../product/BRAND.md)).
- **System mode respects the visitor.** Defaulting to the OS preference is the
  courteous default; an explicit toggle plus persistence gives control when they
  want it — satisfying FR-002 without imposing a choice.

## Alternatives Considered

- **Light-first (light default, dark derived).** The common web default.
  *Rejected* because it inverts the design intent: the brand and design language
  are explicitly dark-first, and deriving the primary experience from light
  tends to produce a dark mode that feels like an afterthought. It would
  contradict [Design Language → Color Philosophy](../design/DESIGN_LANGUAGE.md).
- **Class-per-color / hardcoded palettes per theme (e.g. `dark:` variants on raw
  colors throughout).** *Rejected* because it scatters theme logic across every
  component and reintroduces raw color values, violating the token rule (QAT-7)
  and [ADR-0003](./ADR-0003-Tailwind.md). Every new component would carry theme
  knowledge, and adding or tuning a theme would mean touching the whole UI.
- **A runtime theme library / context-based provider driving styles in JS.**
  *Rejected* because resolving colors in JavaScript at runtime fights the
  server-first model: it risks a flash before hydration, adds client work, and
  couples styling to a client provider — friction against QAT-1 and
  [ADR-0006](./ADR-0006-Rendering-Strategy.md). CSS variables flipped by a small
  pre-paint script achieve the same result with near-zero runtime cost. (A
  minimal client island still owns the *toggle* interaction and persistence;
  what is rejected is having the library *compute the styling*.)

## Consequences

### Positive
- One component definition serves all themes; theming adds no per-component cost
  and cannot drift into raw colors (QAT-7, QAT-1).
- No flash of incorrect theme; server-rendered HTML is theme-correct on first
  paint.
- Adding or tuning a theme is a token/variable change, not a UI-wide edit.

### Negative
- The pre-paint theme resolution is a small, deliberate exception to the
  "minimal client JS" rule — a tiny blocking script — justified by correctness.
- Every semantic color token must be defined for both palettes and contrast-
  checked; an unmapped token is a visible defect.

### Neutral
- The concrete palette values, semantic token names, contrast pairs, and
  transition tokens are owned by [design/COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md)
  and [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md); this ADR fixes the
  system, not the values.
- The theme preference is client/local + persisted state, distinct from the
  URL-based locale in [ADR-0004](./ADR-0004-Internationalization.md).

## Compliance / Enforcement

- Components use semantic color tokens only; raw color values are a lint and
  review failure ([ADR-0003](./ADR-0003-Tailwind.md) enforcement applies).
- Both palettes are contrast-verified against WCAG AA as part of the design-token
  definition (QAT-2).
- The [Architecture Checklist → Cross-cutting concerns](../engineering/ARCHITECTURE.md#architecture-checklist)
  gates every component on being theme-compatible (dark, light, system) via
  tokens, and on reduced-motion support for transitions.

## Related Documents

- [design/COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md), [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md)
- [design/DESIGN_LANGUAGE.md → Color Philosophy](../design/DESIGN_LANGUAGE.md)
- [ADR-0003 Tailwind + Design Tokens](./ADR-0003-Tailwind.md), [ADR-0006 Rendering Strategy](./ADR-0006-Rendering-Strategy.md)
- [ARCHITECTURE → §10 Cross-Cutting Concerns](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns)
- [PRD → FR-002 Theme System](../product/PRODUCT_REQUIREMENTS.md)
