# Component Philosophy

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **design-level philosophy** for components: the
qualities every component must have, the interaction states it must express, how
variants and prop APIs are shaped, how components are named, how they consume
design tokens, and their default rendering posture (server-first). It is the
*why* and the *principles* of component design.

It is **not** the concrete component inventory. The catalog of actual components
— their names, props, and usage — lives in
[developer/COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md). This
document governs *how* those components are conceived; the catalog documents
*which* exist.

---

## Scope

**In scope.** Component design principles (single responsibility, reusable,
composable, predictable, minimal, accessible); the standard interaction states;
variant and prop-API principles; naming rules; token consumption; the Server- vs
Client-Component default posture.

**Out of scope.** The concrete component list and per-component APIs
([COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md)); coding conventions
and file structure ([developer/CODING_STANDARDS.md](../developer/CODING_STANDARDS.md),
[engineering/FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)); token
values (the design-cluster documents).

---

## Goals

1. Components that are predictable, composable building blocks — not bespoke
   one-offs — so the UI reads as one system (QAT-7, QAT-3).
2. Accessibility and token-driven styling built in from line one, never audited
   in later.
3. A server-first default that keeps client JavaScript minimal (QAT-1).

---

## Dependencies

| Source | Role |
| --- | --- |
| [DESIGN_LANGUAGE.md → Component Philosophy](./DESIGN_LANGUAGE.md) | Reusable, accessible, composable, predictable, minimal; one responsibility each. |
| [DESIGN_SYSTEM.md → Component Standards / States / Naming](./DESIGN_SYSTEM.md) | Typed/documented standards, the eight states, naming prohibitions. |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | How components consume tokens (never hardcode). |
| [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) | Server-first posture (Principle 2, §5), accessibility non-negotiable (Principle 7). |
| [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) | Less-but-better; every component has a purpose; premium interactions. |
| [developer/COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) | The concrete inventory this philosophy governs. |

---

## 1. The six qualities

Every component is measured against six qualities, drawn from
[Design Language → Component Philosophy](./DESIGN_LANGUAGE.md) and
[Design System → Component Standards](./DESIGN_SYSTEM.md):

1. **Single responsibility.** A component does *one* thing
   ([Design Language](./DESIGN_LANGUAGE.md): "Every component must have one
   responsibility"). A `Button` is a button; it does not fetch data or own page
   layout. When a component grows a second reason to change, split it.
2. **Reusable.** Built for more than its first use site. Content and behavior
   arrive via props; nothing about one page is hardcoded inside it.
3. **Composable.** Small components combine into larger ones. Prefer composition
   (passing `children` / slots) over configuration flags; a component that
   accepts composition scales better than one with twenty booleans.
4. **Predictable.** Same props produce the same result. No hidden global reads,
   no surprising side effects. The API is small and its behavior obvious from
   the prop names.
5. **Minimal.** *Less but better* ([Principle 3](./DESIGN_PRINCIPLES.md)). Ship
   the smallest API that solves the real need; do not add props for hypothetical
   futures (guards against overengineering — [ARCHITECTURE.md → Principle 8](../engineering/ARCHITECTURE.md#2-architectural-principles)).
6. **Accessible.** Semantic HTML, keyboard operability, visible focus, correct
   roles/labels, and reduced-motion support are **build-time requirements**, not
   later fixes ([Principle 6](./DESIGN_PRINCIPLES.md), QAT-2). A component that
   is not accessible is not done.

---

## 2. Standard interaction states

Every interactive component must define **all applicable states** from
[Design System → States](./DESIGN_SYSTEM.md). *Every interaction should feel
premium* ([Principle 10](./DESIGN_PRINCIPLES.md)), which means no state is an
afterthought.

| State | Meaning | Design requirement |
| --- | --- | --- |
| **Default** | Resting | Token-driven; calm, minimal. |
| **Hover** | Pointer over | Responsive feedback via the Hover pattern ([MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md)); never the *only* affordance (touch has no hover). |
| **Focus** | Keyboard/programmatic focus | **Always a visible focus ring** using `--color-accent`; never removed. Non-negotiable for keyboard users (QAT-2). |
| **Active** | Being pressed/activated | Momentary tactile confirmation (Active pattern). |
| **Loading** | Awaiting async result | Communicated non-visually too (`aria-busy`); disables re-trigger; skeleton/spinner per motion guidelines. |
| **Disabled** | Not currently available | Reduced emphasis via tokens; conveys *why* where possible; not focusable if truly inert, but prefer explaining over disabling. |
| **Error** | Invalid/failed | Uses `--color-danger` **plus** text/icon — never color alone (WCAG 1.4.1); message is programmatically associated. |
| **Success** | Completed/valid | Uses `--color-success` **plus** a non-color cue. |

Focus and error/success states are the ones most often skipped and the most
important for accessibility; they are mandatory, not optional.

---

## 3. Variants and prop APIs

- **Variants encode intent, not appearance.** A Button's variant is
  `primary | secondary | ghost | danger` (what it means), never `blue | grey`
  (how it looks). Appearance is a token mapping behind the intent, so re-tuning
  the palette never changes a component's API — the same discipline as
  [semantic color tokens](./COLOR_SYSTEM.md).
- **Small, closed variant sets.** A handful of well-named variants beats an open
  field of style props. If a new variant is needed often, add it deliberately to
  the catalog; if it is needed once, it is probably a composition, not a variant.
- **Props are typed and minimal.** Every prop is typed (TypeScript) and
  documented ([Design System → Component Standards](./DESIGN_SYSTEM.md): typed,
  documented). Prefer a few expressive props over many overlapping ones.
- **Sensible defaults.** The most common use should need the fewest props; the
  default variant/size is the one used most.
- **Composition over configuration.** Expose `children`/slots before adding
  boolean flags. `<Card><Card.Header/>…</Card>` scales; `<Card hasHeader
  headerBig …/>` does not.
- **Controlled/uncontrolled predictability.** Stateful inputs follow the standard
  React controlled/uncontrolled contract so behavior is never surprising.
- **Style overrides are constrained.** Components accept layout-level className
  passthrough for spacing/positioning, but **not** arbitrary color/size
  overrides that would bypass tokens; visual variation goes through variants.

---

## 4. Naming

Names are meaningful and describe **purpose**, per
[Design System → Naming](./DESIGN_SYSTEM.md):

- **Never** `Component1`, `Box`, `Wrapper`, `Container2`, or other
  meaning-free names.
- Name by **role**: `ProjectCard`, `ThemeToggle`, `SectionHeading`, `Callout` —
  a reader knows what it is and where it belongs from the name alone.
- **PascalCase** for component names; consistent, predictable casing.
- A name should survive restyling: it describes what the component *is*, not how
  it currently *looks* (mirrors the semantic-token rule).
- Feature-specific components live with their feature; shared primitives are
  promoted deliberately to the shared UI layer
  ([ARCHITECTURE.md → §6](../engineering/ARCHITECTURE.md#6-application-structure)).

---

## 5. Consuming tokens

Components are the **primary enforcement point** of *tokens over hardcoding*
([ARCHITECTURE.md → Principle 5](../engineering/ARCHITECTURE.md#2-architectural-principles)):

- **Consume semantic tokens only.** Colors, spacing, radius, shadow, type, and
  motion resolve to semantic (or component) tokens from
  [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — **never** a literal, never a raw
  primitive. A hex, a `13px`, or a `250ms` inside a component is a defect.
- **Theme-agnostic by construction.** Because components read semantic tokens,
  they render correctly in dark, light, and system themes with **no theme
  branching** in component code (FR-002). If a component inspects the active
  theme to pick a *color*, the value belongs in the token map instead.
- **On the grid.** Spacing uses the 8-pt scale; radius/shadow use their scales.
- **A component token only when needed.** Introduce a Tier-3 component token
  (e.g. `--button-bg`) only to vary a role locally, and resolve it to a semantic
  token — never a primitive ([DESIGN_TOKENS.md → §2.3](./DESIGN_TOKENS.md#23-tier-3--component-tokens-optional)).

---

## 6. Server-first posture

Components default to **Server Components**, matching the architecture's
server-first, minimal-client principle
([ARCHITECTURE.md → Principle 2, §5](../engineering/ARCHITECTURE.md#5-rendering--execution-model),
QAT-1):

- **A component is a Server Component unless it must be a Client Component.**
  Presentational components (cards, headings, layout, most content) are
  server-rendered and ship **zero** component JavaScript.
- **`"use client"` is opt-in and justified** by genuine need: event handlers,
  React state/effects, browser APIs, or a stateful third-party widget. The
  `ThemeToggle` is a Client Component; the `ProjectCard` wrapping it is not.
- **Push interactivity to the leaves.** Keep client "islands" small and isolated
  so the surrounding tree stays server-rendered — a small interactive control is
  a Client Component, but its container need not be.
- **Design for the boundary.** A composable component splits cleanly into a
  server shell and a small client island, rather than forcing an entire subtree
  to the client. Composition (§3) is what makes this natural.

This posture is a design constraint, not only an implementation detail: how a
component is decomposed determines how much JavaScript the page ships.

---

## Engineering Decisions

- **Intent-based variants.** Decoupling variant names from appearance lets the
  palette re-tune without touching component APIs — the component-level echo of
  semantic tokens.
- **Composition over configuration.** Slots scale to unforeseen layouts; boolean
  matrices collapse under their own combinations and invite overengineering.
- **States as a required checklist.** Focus and error/success are mandated
  because they are the most-skipped and the most accessibility-critical.
- **Server-first default.** The single largest lever on client JS (QAT-1);
  making it the component default keeps performance a property of the system, not
  a per-page effort.
- **Tokens-only in components.** Components are where hardcoding tends to creep
  in, so the rule is stated at the component level, not just the token level.

## Best Practices

- Give each component one responsibility; split when a second reason to change
  appears.
- Prefer `children`/slots over flags; keep the prop API small and typed.
- Name variants by intent; name components by role.
- Define every applicable state, especially focus and error/success.
- Consume semantic tokens only; never branch on theme for color.
- Default to a Server Component; add `"use client"` only when forced, at the
  leaf.
- Reference [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) before
  creating a component — it may already exist.

## Common Mistakes

- **God components** that fetch, lay out, and render — violating single
  responsibility.
- **Boolean-flag sprawl** where composition was the answer.
- **Appearance-named variants** (`blue`, `big`) that leak styling into the API.
- **Meaning-free names** (`Box`, `Wrapper`, `Component1`) — explicitly banned.
- **Hardcoded values / raw primitives** in a component, breaking theming and
  QAT-7.
- **Theme branching in component logic** instead of the token map.
- **Removed focus outlines** — an accessibility regression, never acceptable.
- **Color-only error/success** with no text or icon (WCAG 1.4.1).
- **Client-by-default** (`"use client"` "to be safe"), inflating the bundle
  against QAT-1.

## Examples

```tsx
// GOOD — single responsibility, intent variants, tokens via Tailwind projection,
// server by default (no "use client"), accessible states.
type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
};

// Presentational, server-rendered. Variant → token mapping, never raw colors.
// bg-accent / text-accent-foreground resolve to semantic tokens (both themes),
// focus-visible ring uses the accent token, motion uses duration tokens.
// <button class="bg-accent text-accent-foreground rounded-md px-4 py-3
//                transition-colors duration-fast
//                focus-visible:outline-none focus-visible:ring-2 ring-accent
//                disabled:opacity-60" aria-busy={loading}>

// BAD — many concerns, appearance variant, hardcoded + theme branch, no focus.
// function Box({ blue, big }) {
//   const bg = theme === "dark" ? "#5B7CFA" : "#3F5CE0"; // hardcoded + branch
//   return <div style={{ background: bg, padding: 18, outline: "none" }} />;
// }
```

## Checklist

Before shipping any component (complements
[Design System → Review Checklist](./DESIGN_SYSTEM.md)):

- [ ] Single responsibility — one reason to change.
- [ ] Reusable and composable; prefers slots over flags.
- [ ] Typed, minimal, documented prop API; variants named by intent.
- [ ] Meaningful, role-based name (never `Box`/`Wrapper`/`Component1`).
- [ ] All applicable states defined — including visible focus and error/success.
- [ ] Styling uses semantic tokens only; on the 8-pt grid; no literals/primitives.
- [ ] Renders correctly in dark/light with no theme branching.
- [ ] Accessible: semantic HTML, keyboard, roles/labels, reduced motion.
- [ ] Server Component by default; `"use client"` only where justified, at the leaf.

## Related Documents

- [developer/COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) — the concrete component inventory (companion to this philosophy).
- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — how components consume tokens.
- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) · [TYPOGRAPHY.md](./TYPOGRAPHY.md) · [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) — the values components consume.
- [DESIGN_LANGUAGE.md → Component Philosophy](./DESIGN_LANGUAGE.md) · [DESIGN_SYSTEM.md → Component Standards / States / Naming](./DESIGN_SYSTEM.md) · [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md).
- [ARCHITECTURE.md → §5–6, Principles 2 & 7](../engineering/ARCHITECTURE.md) · [CODING_STANDARDS.md](../developer/CODING_STANDARDS.md) · [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md).
