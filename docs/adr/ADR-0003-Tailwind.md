# ADR-0003: Tailwind CSS Driven by Design Tokens

**Status:** Accepted
**Date:** July 2026
**Deciders:** Mohamed Kamel
**Related:** [ARCHITECTURE → §4 Technology Stack](../engineering/ARCHITECTURE.md#4-technology-stack--decided--deliberately-deferred), [ADR-0005 Theme System](./ADR-0005-Theme-System.md), [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [design/DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)

## Context

Consistency (QAT-7) is enforced architecturally through one non-negotiable rule:
**no design value — color, spacing, typography, radius, shadow, motion timing —
is hardcoded in a component; every value resolves to a design token**
([ARCHITECTURE → §2, principle 5](../engineering/ARCHITECTURE.md#2-architectural-principles);
[Design System → Design Tokens](../design/DESIGN_SYSTEM.md): "Never hardcode
design values inside components").

The design system already defines the token vocabulary the UI must speak:
semantic colors, an 8-point spacing grid, a type scale, radii, shadows,
elevation, and motion durations/easings
([Design System](../design/DESIGN_SYSTEM.md)). The styling approach must make
using those tokens the path of least resistance and make hardcoding awkward or
detectable — otherwise QAT-7 depends on discipline alone, which does not scale.
This choice is also an **owner directive**
([ARCHITECTURE → §4.1](../engineering/ARCHITECTURE.md#41-decided)).

## Decision

Style the application with **Tailwind CSS, configured so that its utilities are
driven by the design tokens** rather than by ad-hoc values. The Tailwind theme
is the machine-readable projection of the design system: spacing, colors,
typography, radii, shadows, and motion in the config resolve to the tokens
defined in [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md). Semantic color
tokens are backed by CSS custom properties so the same utility class renders the
correct value per theme (see [ADR-0005](./ADR-0005-Theme-System.md)).

Concretely: authors compose UIs from token-bound utilities (e.g. spacing from
the 8-point scale, `bg-surface`/`text-foreground` semantic colors). Arbitrary
one-off values (raw hex colors, off-grid pixel spacing) are treated as
violations, not conveniences.

## Rationale (Why)

- **It makes the token rule the default action.** When the utility classes *are*
  the tokens, using the design system is the easiest way to write a component
  and stepping outside it is conspicuous. QAT-7 becomes structural rather than a
  matter of reviewer vigilance.
- **Constraint over freedom, by design.** A curated Tailwind theme exposes only
  the allowed spacing steps, colors, and scales
  ([Design System → Spacing System](../design/DESIGN_SYSTEM.md): "Never use
  random spacing"). The system prevents the drift it is meant to prevent.
- **Co-located styles fit the component model.** Utilities live with the markup,
  which suits small, single-responsibility, server-rendered components
  ([Design Language → Component Philosophy](../design/DESIGN_LANGUAGE.md)) and
  ships essentially no runtime styling cost — aligning with QAT-1.
- **Theme-awareness with zero per-component effort.** Because semantic colors
  resolve through CSS variables, one set of utilities serves dark, light, and
  system themes; components never branch on theme
  ([ADR-0005](./ADR-0005-Theme-System.md)).
- **Detectability.** Hardcoded values (arbitrary-value utilities, inline hex)
  are lintable, making the QAT-7 rule enforceable in CI rather than only in
  review.

## Alternatives Considered

- **CSS Modules.** Scoped, framework-agnostic, zero runtime. *Rejected* as the
  primary approach because it does not, by itself, constrain values: a developer
  can type any hex or pixel value into a `.module.css` file. Token discipline
  would rely on convention and review rather than being built into the tool, and
  styles drift from the markup they describe.
- **CSS-in-JS (styled-components / emotion).** Powerful theming and colocation.
  *Rejected* because most variants carry a runtime cost and complicate the
  server-first model (RSC compatibility, hydration, serialization concerns) —
  friction against QAT-1 and [ADR-0006](./ADR-0006-Rendering-Strategy.md) for a
  site that is predominantly static markup. The dynamic styling power it adds is
  not what a token-constrained, mostly-static UI needs.
- **vanilla-extract (zero-runtime, typed CSS).** Genuinely strong: type-safe
  tokens and no runtime. *Rejected* on balance because it delivers a similar
  token-enforcement outcome to token-bound Tailwind with a smaller ecosystem and
  more build wiring, and it does not match the owner directive. The marginal
  gain did not justify diverging from the mandated, widely-understood tool.
- **Plain CSS / global stylesheets.** *Rejected* outright: no scoping, weakest
  guardrails against hardcoded values, and the highest long-term maintenance
  cost — the opposite of QAT-3 and QAT-7.

## Consequences

### Positive
- The token rule (QAT-7) is enforced by the toolchain and lintable in CI, not
  left to discipline.
- Near-zero styling runtime keeps the client thin, reinforcing QAT-1 and the
  server-first model.
- One set of semantic utilities serves every theme, keeping [ADR-0005](./ADR-0005-Theme-System.md)
  cheap to implement per component.

### Negative
- Utility-dense markup has a learning curve and can look noisy; readability
  relies on extracting shared patterns into components rather than repeating long
  class lists.
- The Tailwind theme config becomes a critical artifact that must stay in lockstep
  with [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md); if they diverge, the
  guarantee weakens.

### Neutral
- The concrete token values, naming, and Tailwind theme mapping are owned by
  [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) and
  [design/DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md); this ADR fixes the
  *approach*, not the values.
- Iconography (Lucide) and imagery (`next/image`) are separate decisions recorded
  in [ARCHITECTURE → §4.1](../engineering/ARCHITECTURE.md#41-decided).

## Compliance / Enforcement

- The Tailwind theme is generated from / bound to the design tokens; adding a
  raw value to a component is a review and lint failure, not a shortcut.
- Lint rules flag arbitrary-value utilities and inline styles that bypass the
  token scale.
- The [Architecture Checklist → Design system](../engineering/ARCHITECTURE.md#architecture-checklist)
  requires that all colors, spacing, typography, radii, shadows, and motion
  timings resolve to design tokens before a component ships.

## Related Documents

- [ARCHITECTURE → §4 Technology Stack](../engineering/ARCHITECTURE.md#4-technology-stack--decided--deliberately-deferred)
- [design/DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [design/DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)
- [ADR-0005 Theme System](./ADR-0005-Theme-System.md)
