# Color System

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **concrete v1.0.0 color values** for the portfolio:
the primitive color scales (neutral, accent, status) and the **semantic
mapping** that binds those raw values to the canonical `--color-*` tokens for
the dark theme (primary) and the light theme. It is the single source of truth
for color values; other documents reference it and never restate a hex.

The token *system* — tiers, naming, theming mechanism, Tailwind projection —
is defined in [DESIGN_TOKENS.md](./DESIGN_TOKENS.md). This document supplies the
*values* that system carries.

---

## Scope

**In scope.** Primitive scales (neutral 50–950, one accent 50–950, four status
hues), the dark and light semantic mappings for every `--color-*` token, and
WCAG AA contrast guidance for the key text/background pairings.

**Out of scope.** How color tokens resolve to CSS variables and Tailwind (see
[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)); the flash-free theme switch and
persistence mechanics (an engineering concern, ADR-0005); the full accessibility
program (see [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md)).

---

## Goals

1. A restrained, premium, dark-first palette consistent with the brand.
2. Semantic mappings that let one component render correctly in both themes.
3. Every text/background pair used for content meets **WCAG AA**.
4. Values that are tunable by design (proposed defaults), with the reasoning
   recorded so a re-tune is informed, not arbitrary.

---

## Dependencies

| Source | Role |
| --- | --- |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Token tiers, naming, theming mechanism, Tailwind mapping. |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | The color token categories being valued. |
| [DESIGN_LANGUAGE.md → Color Philosophy](./DESIGN_LANGUAGE.md) | Dark-first; color supports content; accent used intentionally; never overuse gradients. |
| [BRAND.md](../product/BRAND.md) | Premium, minimal, calm, technical, confident. |
| [PRODUCT_REQUIREMENTS.md → FR-002](../product/PRODUCT_REQUIREMENTS.md) | Dark / light / system, accessible colors. |
| [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) | WCAG AA program these ratios feed into. |

---

## 1. Dark-first rationale

The primary theme is **dark**; light is a first-class equal, not an afterthought
([Design Language → Color Philosophy](./DESIGN_LANGUAGE.md): "Light mode should
feel equally premium"). Dark-first is chosen because it best expresses the
brand's *premium, calm, technical* character and the "premium SaaS product"
target impression ([BRAND.md](../product/BRAND.md)) — the same instinct behind
the Vercel / Linear / Raycast / OpenAI reference set, arrived at independently
rather than imitated.

Two consequences shape every value below:

- **Near-black, not pure black.** The dark canvas is `#0B0D0F`, not `#000000`.
  Pure black against bright text causes halation (visual smear) and feels harsh;
  a very dark neutral reads as premium and reduces eye strain.
- **Elevation via lightness.** On a near-black canvas, shadow is a weak depth
  cue, so raised surfaces get *lighter* (see
  [DESIGN_TOKENS.md → Elevation](./DESIGN_TOKENS.md#44-elevation)). The neutral
  ramp is tuned to give clean, even steps for exactly this.

---

## 2. Primitive scales (v1.0.0 proposed default)

Primitives are theme-agnostic (Tier 1) and never consumed directly by
components — semantic tokens (§3) map to them. All values are tunable.

### 2.1 Neutral

A near-neutral grey with a faint **cool cast** (a trace of blue), which reads as
technical and calm and keeps the dark canvas from feeling warm or muddy. The
ramp is perceptually even so elevation steps look uniform.

| Token | Hex | Note |
| --- | --- | --- |
| `--neutral-50` | `#F7F8F8` | Primary text on dark; app bg on light |
| `--neutral-100` | `#ECEDEE` | Light-theme muted surface |
| `--neutral-200` | `#D9DBDE` | Light-theme border |
| `--neutral-300` | `#B8BCC2` | Disabled text (light) |
| `--neutral-400` | `#8A9099` | Secondary/muted text on dark |
| `--neutral-500` | `#626871` | Secondary/muted text on light |
| `--neutral-600` | `#454B54` | Strong border / hairline (dark, hover) |
| `--neutral-700` | `#2E333A` | Border (dark, emphasized) |
| `--neutral-800` | `#1D2126` | Muted surface / default border (dark) |
| `--neutral-900` | `#14171A` | Elevated surface (dark); primary text (light) |
| `--neutral-950` | `#0B0D0F` | App background (dark) |

Base primitives `--white: #FFFFFF` and `--black: #000000` exist for the few
roles that need an absolute (e.g. accent-foreground on light), but are rarely
consumed directly.

### 2.2 Accent — "iris" blue (v1.0.0 proposed default)

**One** restrained accent, per [Design Language](./DESIGN_LANGUAGE.md) ("accent
colors should be used intentionally"). The chosen hue is a cool blue carrying a
slight violet lean — an *iris* blue (hue ≈ 227°).

**Why this hue.** Blue reads as *trust, precision, and calm* — directly on-brand
([BRAND.md](../product/BRAND.md): confidence, trust, technical). A plain
corporate blue risks the "generic" the brand warns against, so the hue is nudged
cooler and slightly toward violet to feel considered and modern (the register of
the Linear/Vercel reference set) **without** matching any of their brand hues.
It is desaturated enough to stay *calm* rather than *flashy*.

| Token | Hex |
| --- | --- |
| `--accent-50` | `#EEF1FF` |
| `--accent-100` | `#DFE4FF` |
| `--accent-200` | `#C4CCFF` |
| `--accent-300` | `#9FACFF` |
| `--accent-400` | `#7C90FC` |
| `--accent-500` | `#5B7CFA` |
| `--accent-600` | `#3F5CE0` |
| `--accent-700` | `#3247B4` |
| `--accent-800` | `#2A3A8C` |
| `--accent-900` | `#26346E` |
| `--accent-950` | `#171E40` |

`--accent-500` is the bright accent for the **dark** theme; `--accent-600` is the
deeper accent for the **light** theme (see §3 for why the step differs).

### 2.3 Status hues (v1.0.0 proposed default)

Restrained, desaturated status colors that sit comfortably beside the neutral
canvas rather than shouting. One representative step per hue is given; the scale
can be extended if a state needs subtle/strong variants.

| Role | Dark value | Light value | Hue |
| --- | --- | --- | --- |
| Success | `#3FB37A` | `#1F8A56` | Green |
| Warning | `#E0A82E` | `#B4791A` | Amber |
| Danger | `#F0595E` | `#D22F35` | Red |
| Info | `#5B9DF6` | `#2B6FD6` | Blue (distinct from accent) |

The dark values are brighter (they sit on a dark canvas); the light values are
deeper (they sit on white). Info is deliberately a *different* blue from the
accent so "informational" never reads as "interactive/brand."

---

## 3. Semantic mapping

The semantic tier is the **only** thing that changes between themes. Every token
below is one of the canonical `--color-*` names; components consume these and
nothing else.

### 3.1 Dark theme (primary — declared on `:root`)

| Semantic token | → primitive | Hex | Role |
| --- | --- | --- | --- |
| `--color-background` | `--neutral-950` | `#0B0D0F` | App canvas (Elevation 0) |
| `--color-foreground` | `--neutral-50` | `#F7F8F8` | Primary text/icons |
| `--color-surface` | `--neutral-900` | `#14171A` | Cards, panels (Elevation 1+) |
| `--color-surface-muted` | `--neutral-800` | `#1D2126` | Inset/muted panels, code blocks |
| `--color-border` | `--neutral-800` | `#1D2126` | Hairline borders, dividers |
| `--color-muted` | `--neutral-800` | `#1D2126` | Muted fills (chips, track) |
| `--color-muted-foreground` | `--neutral-400` | `#8A9099` | Secondary text, captions |
| `--color-accent` | `--accent-500` | `#5B7CFA` | Interactive/brand: links, focus ring, primary fill |
| `--color-accent-foreground` | `--neutral-950` | `#0B0D0F` | Text/icon on an accent fill |
| `--color-success` | status | `#3FB37A` | Success state |
| `--color-success-foreground` | `--neutral-950` | `#0B0D0F` | On success fill |
| `--color-warning` | status | `#E0A82E` | Warning state |
| `--color-warning-foreground` | `--neutral-950` | `#0B0D0F` | On warning fill |
| `--color-danger` | status | `#F0595E` | Error/destructive state |
| `--color-danger-foreground` | `--neutral-950` | `#0B0D0F` | On danger fill |
| `--color-info` | status | `#5B9DF6` | Informational state |
| `--color-info-foreground` | `--neutral-950` | `#0B0D0F` | On info fill |

**On the accent pairing.** The dark accent is a *bright* iris blue (`#5B7CFA`)
paired with a *near-black* foreground (`#0B0D0F`). This is deliberate: bright
accent + dark text reaches AA for normal text on the fill (≈5.1:1, §4) *and* the
same bright accent works as link text on the dark canvas at the same ratio. A
darker fill with white text would fail as link text on the canvas — so the
bright-fill / dark-text pairing keeps a single accent token correct in both
uses.

### 3.2 Light theme (declared on `[data-theme="light"]`)

| Semantic token | → primitive | Hex | Role |
| --- | --- | --- | --- |
| `--color-background` | `--neutral-50` | `#F7F8F8` | App canvas |
| `--color-foreground` | `--neutral-900` | `#14171A` | Primary text/icons |
| `--color-surface` | `--white` | `#FFFFFF` | Cards, panels |
| `--color-surface-muted` | `--neutral-100` | `#ECEDEE` | Inset/muted panels, code blocks |
| `--color-border` | `--neutral-200` | `#D9DBDE` | Hairline borders, dividers |
| `--color-muted` | `--neutral-100` | `#ECEDEE` | Muted fills |
| `--color-muted-foreground` | `--neutral-500` | `#626871` | Secondary text, captions |
| `--color-accent` | `--accent-600` | `#3F5CE0` | Interactive/brand |
| `--color-accent-foreground` | `--white` | `#FFFFFF` | Text/icon on an accent fill |
| `--color-success` | status | `#1F8A56` | Success state |
| `--color-success-foreground` | `--white` | `#FFFFFF` | On success fill |
| `--color-warning` | status | `#B4791A` | Warning state |
| `--color-warning-foreground` | `--white` | `#FFFFFF` | On warning fill |
| `--color-danger` | status | `#D22F35` | Error/destructive state |
| `--color-danger-foreground` | `--white` | `#FFFFFF` | On danger fill |
| `--color-info` | status | `#2B6FD6` | Informational state |
| `--color-info-foreground` | `--white` | `#FFFFFF` | On info fill |

**Why the accent step differs by theme.** On light, a bright `#5B7CFA` fill
cannot carry white text at AA, so the light accent is the deeper `#3F5CE0`, which
pairs with white text at ≈5.5:1 and reads as an accent on the near-white canvas.
The token name (`--color-accent`) is identical; only the value changes — exactly
what the semantic tier is for.

---

## 4. WCAG AA contrast guidance

**Targets** (from [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md), WCAG 2.1
AA, supporting QAT-2):

- **Body / normal text (< 18.66px, or < 24px bold): ≥ 4.5:1**
- **Large text (≥ 24px, or ≥ 18.66px bold): ≥ 3:1**
- **Non-text UI (borders of controls, focus rings, icons that carry meaning):
  ≥ 3:1**

The critical content pairings for the v1.0.0 palette, computed against these
targets:

| Pair | Theme | Ratio | Target | Result |
| --- | --- | --- | --- | --- |
| `foreground` on `background` | Dark | ≈ 18:1 | 4.5:1 | Pass |
| `muted-foreground` on `background` | Dark | ≈ 5.8:1 | 4.5:1 | Pass |
| `accent` (`#5B7CFA`) on `background` (link text) | Dark | ≈ 5.1:1 | 4.5:1 | Pass |
| `accent-foreground` on `accent` (button label) | Dark | ≈ 5.1:1 | 4.5:1 | Pass |
| `foreground` on `background` | Light | ≈ 17:1 | 4.5:1 | Pass |
| `muted-foreground` on `background` | Light | ≈ 5.3:1 | 4.5:1 | Pass |
| `accent-foreground` (white) on `accent` (`#3F5CE0`) | Light | ≈ 5.5:1 | 4.5:1 | Pass |
| `border` on `background` (non-text) | Both | ≥ 3:1 where used as a control edge* | 3:1 | See note |

\* The **default** hairline border (`--color-border`) is intentionally low-contrast
for calm, premium dividers and does **not** need to meet 3:1 — it is decorative
separation, not a control boundary. Where a border is the **only** indicator of
an interactive control's edge (e.g. a text input at rest), use an emphasized
border (`--neutral-600` on dark / `--neutral-300` on light) or an accompanying
label/background so the control meets the 3:1 non-text requirement.

**Rules that follow from the targets:**

- Body copy uses `--color-foreground`; secondary copy uses
  `--color-muted-foreground` — never a raw neutral chosen by eye.
- **Never encode meaning in color alone** (WCAG 1.4.1): status and links carry a
  non-color cue too (icon, underline on focus/hover, text label). Color
  reinforces; it does not signal alone.
- The **focus ring** uses `--color-accent` and must clear 3:1 against both the
  component and the adjacent background; it is a visible, non-color-only
  indicator ([Design Language → Accessibility](./DESIGN_LANGUAGE.md): "Visible
  Focus").
- Ratios are **validated against the palette and re-checked whenever a value is
  tuned.** They are a property of the v1.0.0 defaults, not a fixed guarantee for
  arbitrary future values.

---

## 5. Usage rules

- **Color supports content; it does not dominate** ([Design Language → Color
  Philosophy](./DESIGN_LANGUAGE.md)). The interface is overwhelmingly neutral;
  accent appears sparingly on genuinely interactive or brand-critical elements.
- **Hierarchy comes from typography and space, not color**
  ([Principle 9](./DESIGN_PRINCIPLES.md)). Resist adding a hue to create
  emphasis; increase size, weight, or whitespace first.
- **Gradients are rare and soft** ([Design Language](./DESIGN_LANGUAGE.md):
  "Never overuse gradients"). When used, they stay within the accent/neutral
  families at low contrast.
- **One accent.** Introducing a second brand hue is a palette change requiring a
  version bump here, not an ad-hoc component decision.

---

## Engineering Decisions

- **Near-black canvas (`#0B0D0F`).** Avoids halation and reads as premium; pure
  black is reserved for the rare absolute.
- **Cool-neutral ramp.** A faint blue cast unifies with the iris accent and
  reads technical; a warm grey would fight the brand.
- **Bright accent + dark foreground on dark; deep accent + white on light.** The
  only way a single `--color-accent` token stays AA-correct as both a fill and
  as link text in each theme (§3).
- **Info ≠ accent.** Separating the informational blue from the brand blue keeps
  "interactive" and "informational" distinguishable.
- **Elevation by lightness on dark.** The ramp is tuned for even surface steps
  because shadow is a weak dark-theme depth cue.

## Best Practices

- Consume semantic `--color-*` tokens only; never a raw `--neutral-*`/`--accent-*`
  in a component.
- Pair every fill token with its `-foreground` partner for text on that fill.
- Verify any new text/background pair against §4 targets before shipping.
- Add a non-color cue anywhere color conveys meaning.
- Keep accent usage sparse and intentional.

## Common Mistakes

- **Meaning by color alone** — a red border with no icon or text fails WCAG 1.4.1.
- **Raw primitive in a component** — looks correct in one theme, wrong in the other.
- **Low-contrast body text** — choosing a mid-neutral "because it looks softer"
  and dropping below 4.5:1.
- **Accent inflation** — using accent for decoration until it stops signaling
  interactivity.
- **White text on the bright dark-accent fill** — fails AA; the dark theme pairs
  the bright accent with dark foreground on purpose.
- **Copying a hex into another document** — values live here only.

## Examples

```css
/* Primary + secondary text, correct in both themes */
.lead    { color: var(--color-foreground); }
.caption { color: var(--color-muted-foreground); }

/* Primary action — fill + its foreground partner */
.button-primary {
  background: var(--color-accent);
  color: var(--color-accent-foreground);
}

/* Link on the canvas — accent as text (AA on both themes) */
.link { color: var(--color-accent); }

/* Destructive action carries an icon + label, not color alone */
.button-danger {
  background: var(--color-danger);
  color: var(--color-danger-foreground);
}
```

## Checklist

- [ ] Text/background pair meets its §4 target (4.5:1 body, 3:1 large).
- [ ] Only semantic `--color-*` tokens are used in components.
- [ ] Every fill uses its matching `-foreground` for text.
- [ ] No meaning is conveyed by color alone.
- [ ] Focus ring (`--color-accent`) is visible at ≥ 3:1 in both themes.
- [ ] Accent usage is sparse and intentional.
- [ ] Any tuned value was re-validated for contrast.

## Related Documents

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — token tiers, theming mechanism, Tailwind mapping.
- [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) — the WCAG AA program these ratios support.
- [TYPOGRAPHY.md](./TYPOGRAPHY.md) — hierarchy via type (color's counterpart).
- [DESIGN_LANGUAGE.md → Color Philosophy](./DESIGN_LANGUAGE.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [BRAND.md](../product/BRAND.md).
- [ARCHITECTURE.md → Theming](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns) · ADR-0005.
