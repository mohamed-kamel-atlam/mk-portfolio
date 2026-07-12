# Motion Guidelines

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **concrete v1.0.0 motion system**: duration and easing
token values, the standard motion patterns (entrance, exit, hover, focus, route
transition, loading), the principle that motion is purposeful and never
decorative, mandatory `prefers-reduced-motion` handling, and RTL directionality.
It is the single source of truth for motion values.

The concrete **animation library is deliberately deferred** and selected at M3
([ARCHITECTURE.md → §4.2](../engineering/ARCHITECTURE.md#42-deliberately-deferred)).
This document defines the *system that library will consume*: fixing the tokens
and patterns now means the library, whenever chosen, implements this contract
rather than inventing its own.

---

## Scope

**In scope.** `--duration-*` and `--ease-*` values; motion patterns and their
token compositions; the purpose principle; reduced-motion behavior; RTL
mirroring of directional motion.

**Out of scope.** The animation library choice and its API (deferred to M3);
token wiring to CSS/Tailwind (see [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)); the
broader accessibility program (see [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md)).

---

## Goals

1. Motion that improves usability — orientation, continuity, feedback — never
   decoration ([Principle 4](./DESIGN_PRINCIPLES.md), [BRAND.md → Motion](../product/BRAND.md)).
2. Motion that feels *smooth, fast, natural, premium* — and never *bouncy,
   elastic, long, or distracting* ([BRAND.md](../product/BRAND.md)).
3. A small, composable set of tokens and patterns any component (and the future
   library) applies consistently (QAT-7).
4. Full respect for reduced-motion and RTL as build-time requirements, not
   audits (QAT-2, QAT-5).

---

## Dependencies

| Source | Role |
| --- | --- |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Token naming and CSS/Tailwind mapping for durations and easings. |
| [DESIGN_SYSTEM.md → Motion System](./DESIGN_SYSTEM.md) | Duration and easing categories, motion patterns being valued. |
| [BRAND.md → Motion Principles](../product/BRAND.md) | Smooth/fast/natural/premium; no bounce/elastic/long/distracting. |
| [DESIGN_PRINCIPLES.md → Principle 4](./DESIGN_PRINCIPLES.md) · [DESIGN_LANGUAGE.md → Motion](./DESIGN_LANGUAGE.md) | Motion with intention; explains, improves perception and navigation, never distracts. |
| [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) | Reduced-motion requirement. |
| [PRODUCT_REQUIREMENTS.md → FR-001/FR-002](../product/PRODUCT_REQUIREMENTS.md) | RTL; smooth theme transition. |

---

## 1. The principle: motion is purposeful

Every animation must answer *what does this help the user understand or do?*
before it earns a place ([Principle 4](./DESIGN_PRINCIPLES.md): "Never animate
for decoration only"). Motion in this product does exactly one of four jobs:

- **Orient** — show where something came from or went (a panel slides from the
  edge it is anchored to).
- **Maintain continuity** — connect two states so a change is understood, not
  discovered (a list item settling into place).
- **Give feedback** — confirm an action registered (a button's press, a toggle
  flipping).
- **Direct attention** — briefly, to something that genuinely needs it (a newly
  arrived toast).

Motion that does none of these is removed. This is the brand's *calm, minimal,
premium* character expressed in time rather than space, and it aligns motion
with QAT-1: less motion is also less main-thread work.

---

## 2. Duration tokens (v1.0.0 proposed default)

Fast, restrained durations — the brand explicitly rejects *long transitions*.
Three steps cover the system; a route transition composes them rather than
adding a fourth.

| Token | Value | Use |
| --- | --- | --- |
| `--duration-fast` | **120ms** | Micro-feedback: hover, focus ring, small state flips, press |
| `--duration-normal` | **200ms** | The default: entrances, dropdowns, most transitions |
| `--duration-slow` | **320ms** | Larger surfaces: modals, route/page transitions, expanding panels |

**Rationale.** Below ~100ms a transition is imperceptible and reads as an abrupt
jump; beyond ~350–400ms it feels sluggish and *distracting* (the brand's
warning). 120/200/320 sits in the responsive-but-smooth band the reference
products live in: fast enough to feel instant, long enough to be legible. The
ratio (roughly ×1.6 per step) keeps the steps distinguishable. Larger travel
distances use the longer duration so *velocity* stays roughly constant across
elements — a small chip and a full modal should not move at the same speed.

---

## 3. Easing tokens (v1.0.0 proposed default)

Easing gives motion its character. All curves are **asymmetric ease** with **no
overshoot** — the brand forbids *bouncing* and *elastic* motion, so no
`cubic-bezier` here exceeds 1 on the output axis.

| Token | `cubic-bezier` | Character | Use |
| --- | --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Accelerate then settle | Movement between two on-screen states (hover, toggle, reposition) |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Fast in, gentle stop | **Entrances** — elements arriving into view |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Gentle start, fast out | **Exits** — elements leaving view |

**Rationale.** Entrances decelerate so an arriving element "arrives" and settles
(natural, premium). Exits accelerate so leaving elements get out of the way
quickly without lingering. `--ease-standard` is the general-purpose curve for
things that move but stay on screen. This entrance-decelerate / exit-accelerate
convention matches how physical objects move and is what makes motion read as
*natural* rather than mechanical — without any bounce.

---

## 4. Motion patterns

Each pattern is a **composition of tokens**, so patterns stay consistent and
tunable. Values below are the v1.0.0 defaults the future animation library will
implement.

| Pattern | Duration | Easing | Properties | Notes |
| --- | --- | --- | --- | --- |
| **Entrance** | `normal` (200ms) | `decelerate` | opacity 0→1, translateY 8px→0 | Small travel; content settles in. Never scale from 0. |
| **Exit** | `fast` (120ms) | `accelerate` | opacity 1→0, translateY 0→4px | Quick, unobtrusive removal. |
| **Hover** | `fast` (120ms) | `standard` | background / border / color / subtle translateY (≤2px) | Responsive feedback ([Interaction Philosophy](./DESIGN_LANGUAGE.md)). |
| **Focus** | `fast` (120ms) | `standard` | focus-ring opacity/offset | Ring uses `--color-accent`; motion is subtle and never replaces the ring's visibility (QAT-2). |
| **Active / press** | `fast` (120ms) | `standard` | translateY/scale ≤ 1px/0.98 | Momentary tactile confirmation. |
| **Route / page transition** | `slow` (320ms) | `standard` | cross-fade (opacity), optional ≤8px translate | Continuity between routes; subtle, never a "slide show". |
| **Loading** | n/a (loop) | linear (spinner) / `standard` (skeleton) | opacity pulse or indeterminate spin | For genuine waits only; skeletons for content, spinner for actions. |
| **Theme transition** | `normal` (200ms) | `standard` | color/background cross-fade | Satisfies FR-002 "smooth transition"; see §7. |

**Distances stay small.** Entrance/exit travel is ≤ 8px — motion suggests
direction without moving content across the screen. Large, sweeping motion is
*distracting* and off-brand.

---

## 5. `prefers-reduced-motion` — mandatory

Respecting `prefers-reduced-motion: reduce` is a **build-time requirement of
every animated element** ([Design Language → Accessibility](./DESIGN_LANGUAGE.md),
[DESIGN_SYSTEM.md → Accessibility](./DESIGN_SYSTEM.md), QAT-2) — not an optional
enhancement. Motion is an accessibility hazard for people with vestibular
disorders; the system therefore degrades safely by default.

When reduced motion is requested:

- **Remove movement** — no translate, scale, or parallax. State changes are
  **instant or a short opacity cross-fade** (≤ `--duration-fast`).
- **Preserve meaning without motion.** Anything motion communicated (a menu
  opening, a toast arriving) must remain understandable from its static
  end-state. Motion is *reinforcement*, never the sole signal.
- **Stop non-essential looping/auto-playing motion** entirely.
- **Keep essential feedback** — focus rings, error states — which are conveyed by
  color/shape, not motion, and are unaffected.

```css
/* Global safety net; components still design their reduced state intentionally */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The blanket rule is a floor, not a substitute for designing the reduced
experience — prefer an intentional opacity-only fallback per component.

---

## 6. RTL directionality

Motion has direction, and **direction must mirror in RTL**
([FR-001](../product/PRODUCT_REQUIREMENTS.md); RTL is architectural, not
cosmetic). Directional motion designed for LTR is *wrong*, not merely mirrored,
if it plays unchanged in Arabic.

- **Directional motion follows reading direction.** A drawer entering from the
  "start" edge enters from the **left in LTR** and the **right in RTL**. Author
  with **logical direction**, not physical: animate the *inline-start* edge, and
  it mirrors automatically.
- **Horizontal translate sign flips.** A `translateX(8px)` entrance in LTR is
  `translateX(-8px)` in RTL. Express horizontal offsets in logical terms or
  invert them under `[dir="rtl"]`.
- **Vertical motion is unaffected.** Entrance translateY, press, and fades are
  direction-neutral and behave identically in both.
- **Non-directional motion is unaffected.** Opacity fades, spinners, and scale
  need no mirroring.

```css
/* Logical: same rule, correct direction in both LTR and RTL */
.drawer-enter { transform: translateX(-8px); opacity: 0; }
[dir="rtl"] .drawer-enter { transform: translateX(8px); }
```

---

## 7. Theme transition (FR-002)

The dark/light switch is *smooth* per FR-002, but must not be theatrical: a
`--duration-normal` cross-fade of color/background using `--ease-standard`. It
respects reduced motion (instant swap when reduce is set) and must not cause
layout shift or a flash of incorrect theme — the flash-free mechanics are an
engineering concern ([ARCHITECTURE.md → Theming](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns),
ADR-0005); this document owns only the transition's timing and easing.

---

## Engineering Decisions

- **System now, library later.** Tokens and patterns are fixed at M0 so the M3
  library implements a defined contract; the deferral is intentional
  ([ARCHITECTURE.md → §4.2](../engineering/ARCHITECTURE.md#42-deliberately-deferred)).
- **120 / 200 / 320ms.** Inside the perceptible-but-fast band; longer would read
  as sluggish and off-brand.
- **No overshoot in any curve.** Enforces the brand's no-bounce/no-elastic rule
  at the token level, so it cannot be violated per-component.
- **Entrance-decelerate / exit-accelerate.** Matches physical intuition; the
  main lever that makes motion feel natural.
- **Logical direction for motion.** RTL correctness by construction, echoing the
  logical-properties approach in [TYPOGRAPHY.md](./TYPOGRAPHY.md).
- **Reduced motion as a floor + intentional per-component fallback.** The global
  rule guarantees safety even if a component forgets.

## Best Practices

- Justify every animation against one of the four jobs (§1); if none applies,
  remove it.
- Compose patterns from tokens; never hardcode a duration or bezier in a
  component.
- Keep entrance/exit travel small (≤ 8px) and durations short.
- Author directional motion with logical direction so RTL mirrors automatically.
- Design the reduced-motion state deliberately; do not rely only on the global
  override.
- Use skeletons for content waits, spinners for action waits — only for genuine
  latency.

## Common Mistakes

- **Decorative motion** with no usability purpose — the primary thing to avoid.
- **Bounce / elastic / overshoot** curves — explicitly off-brand.
- **Durations too long** (> ~350ms) making the UI feel slow.
- **Hardcoded timings/beziers** in components, breaking consistency and
  tunability (Principle 5, QAT-7).
- **Ignoring reduced motion**, or relying solely on the global override instead
  of an intentional fallback.
- **Physical-direction motion** that plays backwards in RTL.
- **Motion as the only signal** for a state change, leaving reduced-motion users
  without the information.
- **Large-distance travel** that pulls the eye and distracts.

## Examples

```css
/* Entrance — decelerate, small travel, normal duration */
.enter {
  animation: enter var(--duration-normal) var(--ease-decelerate) both;
}
@keyframes enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Hover feedback — fast, standard easing, token-driven */
.button {
  transition: background-color var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard);
}
.button:hover { transform: translateY(-1px); }

/* Reduced-motion: keep the meaning, drop the movement */
@media (prefers-reduced-motion: reduce) {
  .enter { animation: fade var(--duration-fast) var(--ease-standard) both; }
  .button:hover { transform: none; }
}
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
```

## Checklist

- [ ] Every animation serves orientation, continuity, feedback, or attention.
- [ ] Duration and easing come from tokens — no hardcoded values.
- [ ] No overshoot/bounce/elastic curves.
- [ ] Entrance decelerates; exit accelerates; travel ≤ 8px.
- [ ] `prefers-reduced-motion` handled with an intentional fallback.
- [ ] The state change is understandable without motion.
- [ ] Directional motion uses logical direction and mirrors correctly in RTL.
- [ ] Theme transition is a smooth, layout-stable cross-fade.

## Related Documents

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — duration/easing token wiring.
- [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) — reduced-motion program.
- [TYPOGRAPHY.md](./TYPOGRAPHY.md) — logical-direction/RTL counterpart.
- [DESIGN_LANGUAGE.md → Motion](./DESIGN_LANGUAGE.md) · [DESIGN_PRINCIPLES.md → Principle 4](./DESIGN_PRINCIPLES.md) · [DESIGN_SYSTEM.md → Motion System](./DESIGN_SYSTEM.md) · [BRAND.md → Motion Principles](../product/BRAND.md).
- [ARCHITECTURE.md → §4.2 (deferred animation library), Theming](../engineering/ARCHITECTURE.md) · ADR-0005.
