# Design Tokens

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **token system** for the portfolio: what a design
token is, why the project uses tokens instead of literal values, how tokens are
layered and named, and how they resolve into CSS custom properties and the
Tailwind theme. It is the architectural home of the token model.

It exists to make one architectural principle enforceable in practice:
[Architecture → Principle 5, *Tokens over hardcoding*](../engineering/ARCHITECTURE.md#2-architectural-principles)
and [Design System → Design Tokens](./DESIGN_SYSTEM.md) require that **no design
value is ever hardcoded in a component**. A rule like that only holds if there
is a single, well-structured place for every value to live. This document is
that structure.

---

## Scope

**In scope.** The token architecture (the three-tier model), naming
conventions, the CSS-custom-property and Tailwind mapping, the theming mechanism
(dark / light / system) expressed through semantic tokens, and the concrete
values for the *structural* token families whose home is this document:
**spacing, radius, shadow, elevation, z-index, and breakpoints**.

**Out of scope — owned elsewhere.** Concrete values for the *visual-language*
families live in their own domain documents, and this document references them
rather than restating them (per the repository rule *prefer referencing over
repeating*):

| Family | Concrete values live in |
| --- | --- |
| Color primitives, semantic color mapping, contrast | [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) |
| Font families, type scale, line-height, weight, tracking | [TYPOGRAPHY.md](./TYPOGRAPHY.md) |
| Durations, easing curves, motion patterns | [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) |

This document owns the *system*; those own their *values*. Every value has
exactly one home.

---

## Goals

1. Give every design value a single canonical name and a single source of truth.
2. Make theming a data change (swap semantic values), never a code change.
3. Make the system tunable: because every value is a token, the entire visual
   identity can be re-tuned without touching component code (QAT-7,
   maintainability QAT-3).
4. Map cleanly onto both raw CSS (for runtime theming) and Tailwind (for
   authoring), with no divergence between the two.

---

## Responsibilities

- **This document:** defines token tiers, naming, resolution, theming mechanism,
  and structural-family values.
- **Domain docs (color/typography/motion):** define their family's concrete
  values using the naming and tiering defined here.
- **Components:** *consume* semantic (and where defined, component) tokens only.
  Components never read primitive tokens directly and never inline literals.

---

## Dependencies

| Source | Role |
| --- | --- |
| [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) | Principle 5 (tokens over hardcoding), theming as a cross-cutting concern, Tailwind + tokens decision (ADR-0003). |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | The token **categories** this document assigns values to. |
| [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) | Color, typography, and motion philosophy the values must express. |
| [BRAND.md](../product/BRAND.md) | Premium, minimal, dark-first, calm, technical character. |
| [PRODUCT_REQUIREMENTS.md → FR-002](../product/PRODUCT_REQUIREMENTS.md) | Dark / light / system theme, persistence, smooth transition, accessible colors. |

---

## 1. What a token is, and why

A **design token** is a named design decision. `--space-4` is not "16 pixels"; it
is "one unit of standard spacing," which *happens* to resolve to 16px in v1.0.0.
The name encodes intent; the value is an implementation detail that can change.

Tokens buy the project four things the brand and architecture explicitly demand:

- **Consistency (QAT-7).** A value used in fifty places is defined once. Drift
  becomes impossible by construction — the enforcement mechanism named in
  [Design Principles → Principle 7](./DESIGN_PRINCIPLES.md).
- **Themability.** Dark, light, and system themes ([FR-002](../product/PRODUCT_REQUIREMENTS.md))
  are the *same components* reading the *same semantic names* that resolve to
  different values per theme. No conditional styling in components.
- **Tunability.** The v1.0.0 palette, type scale, and motion timings are
  *proposed defaults*. Because they are tokens, re-tuning the brand is editing a
  value map, not refactoring components.
- **Reviewability.** A design decision has a name, so it can be discussed,
  diffed, and versioned like any other engineering artifact.

> **Every concrete value in this cluster is a "v1.0.0 proposed default."** The
> names are stable and referenced by other documents; the values are tunable
> precisely because everything is tokenized.

---

## 2. The three-tier model

Tokens are layered in three tiers. A component may only depend on the outer two
tiers, never on the innermost.

```
Tier 1 — PRIMITIVE (raw)        Tier 2 — SEMANTIC (intent)     Tier 3 — COMPONENT (optional)
the raw scale, theme-agnostic   role-based, theme-switched     component-scoped alias
--neutral-950: #0B0D0F     ──▶  --color-background        ──▶  --button-bg
--accent-500:  #5B7CFA     ──▶  --color-accent            ──▶  --button-accent-bg
--space unit                    (structural tokens are        (only when a component
                                 semantic-by-nature; see §2.4)  needs to vary a role)
```

### 2.1 Tier 1 — Primitive tokens

The raw, theme-agnostic scales: the full neutral ramp, the accent ramp, status
hues, and the raw numeric ladders. They carry **no meaning** — `--neutral-500`
is "the middle grey," not "a border." Primitives are defined once, are identical
across themes, and are **never consumed directly by components.** Their values
live in [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) (color) and in §4 of this document
(structural ladders).

### 2.2 Tier 2 — Semantic tokens

Role-based tokens that map intent to a primitive: `--color-background`,
`--color-foreground`, `--color-border`, `--color-accent`, and so on. **This is
the tier components consume.** Semantic tokens are the *only* thing that changes
between themes: the dark theme maps `--color-background → --neutral-950`, the
light theme maps it `→ --neutral-50`. The component that writes
`background: var(--color-background)` is correct in every theme without knowing
which theme is active.

### 2.3 Tier 3 — Component tokens (optional)

A component-scoped alias, introduced **only** when a component needs to vary a
role locally (e.g. a `Button` whose fill must differ from the page accent). A
component token always resolves to a semantic token, never to a primitive:
`--button-bg: var(--color-accent)`. Most components need no Tier‑3 tokens; do
not create them speculatively (Principle 8, *simplicity when in doubt*).

### 2.4 A note on structural tokens

Spacing, radius, shadow, z-index, and breakpoints are **semantic by nature**:
`--space-4` already expresses intent. They do not need a separate primitive
tier, so they are defined once (§4) and consumed directly. Color, typography,
and motion — which change with theme or carry richer meaning — use the full
tiering.

---

## 3. Naming conventions

Names are lowercase, kebab-case, and read **family → role → variant**:

```
--color-background          family: color   · role: background
--color-muted-foreground    family: color   · role: muted-foreground
--space-4                   family: space   · step: 4
--radius-lg                 family: radius  · step: lg
--duration-normal           family: duration· step: normal
```

Rules:

- **Semantic, not presentational.** `--color-accent`, never `--color-blue`. The
  name survives a hue change; the value does not.
- **Stable names, tunable values.** Other documents and components reference
  these names. Renaming a token is a breaking change; re-valuing one is not.
- **Numeric steps track a base unit.** Spacing steps are multiples of the 4px
  base (`--space-4` = 4 × 4px = 16px), matching Tailwind's spacing scale so the
  two systems never disagree.
- **T-shirt steps for perceptual ladders.** Radius, shadow, and typographic
  sizes use `xs … 2xl` because they are perceived, not arithmetic.
- **No abbreviations that hide meaning.** `--color-muted-foreground`, not
  `--clr-mfg`.

The canonical token names below are **fixed**; downstream documents reference
them verbatim.

---

## 4. Structural token inventory (values owned here)

All values are **v1.0.0 proposed defaults** and tunable.

### 4.1 Spacing — the 8-pt grid

The scale is the fixed set of allowed values from
[Design System → Spacing System](./DESIGN_SYSTEM.md): an 8-pt grid with a 4px
base step for fine adjustments. **No spacing value outside this scale is
permitted** ("never use random spacing"). Step numbers are the value in units of
4px, matching Tailwind's spacing scale exactly.

| Token | Value (px) | rem | Typical use |
| --- | --- | --- | --- |
| `--space-0` | 0 | 0 | Reset / flush |
| `--space-1` | 4 | 0.25rem | Icon-to-label gap, hairline insets |
| `--space-2` | 8 | 0.5rem | Tight stacks, chip padding |
| `--space-3` | 12 | 0.75rem | Control inner padding (y) |
| `--space-4` | 16 | 1rem | Default gap; base rhythm unit |
| `--space-6` | 24 | 1.5rem | Card padding, field spacing |
| `--space-8` | 32 | 2rem | Component grouping |
| `--space-10` | 40 | 2.5rem | Sub-section spacing |
| `--space-12` | 48 | 3rem | Block spacing |
| `--space-16` | 64 | 4rem | Section padding (mobile) |
| `--space-20` | 80 | 5rem | Section padding (tablet) |
| `--space-24` | 96 | 6rem | Section padding (desktop) |
| `--space-32` | 128 | 8rem | Major section breaks, hero rhythm |

The generous large steps (64–128px) are deliberate: *whitespace is a feature*
([Principle 8](./DESIGN_PRINCIPLES.md)) and the brand calls for *spacious
layouts* and *premium spacing* ([BRAND.md](../product/BRAND.md)).

### 4.2 Radius

Small, restrained radii — premium and calm, never playful/pill-heavy (except
where a fully-round shape is the correct affordance, e.g. avatars, toggles).

| Token | Value | rem | Use |
| --- | --- | --- | --- |
| `--radius-xs` | 2px | 0.125rem | Tags, inline code, hairline chips |
| `--radius-sm` | 4px | 0.25rem | Inputs, small buttons |
| `--radius-md` | 8px | 0.5rem | Buttons, form controls (default) |
| `--radius-lg` | 12px | 0.75rem | Cards, popovers |
| `--radius-xl` | 16px | 1rem | Large cards, dialogs |
| `--radius-2xl` | 24px | 1.5rem | Feature panels, media frames |
| `--radius-full` | 9999px | — | Avatars, pills, toggles, icon buttons |

### 4.3 Shadow

Shadows are **soft and low-contrast** — *elegant shadows*
([BRAND.md](../product/BRAND.md)), not drop-shadow drama. In the dark-first
theme, shadow alone is a weak elevation cue on a near-black canvas, so elevation
is expressed **primarily through surface color** (§4.4) and *reinforced* by
shadow. In light theme, shadow does more of the work.

| Token | Value (v1.0.0) | Use |
| --- | --- | --- |
| `--shadow-none` | `none` | Flat surfaces, default |
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.24)` | Subtle lift: buttons on hover, inputs |
| `--shadow-md` | `0 4px 12px -2px rgb(0 0 0 / 0.32)` | Cards, dropdowns |
| `--shadow-lg` | `0 12px 32px -4px rgb(0 0 0 / 0.40)` | Popovers, menus |
| `--shadow-xl` | `0 24px 64px -8px rgb(0 0 0 / 0.48)` | Modals, command palette |

Alpha-based (not solid) shadows so they compose over any surface in either
theme. Values may be tuned per theme if dark shadows prove too heavy.

### 4.4 Elevation

Elevation is a **semantic pairing of a surface color with a shadow**, mapping
the five levels from [Design System → Elevation](./DESIGN_SYSTEM.md). The
surface tokens referenced here are defined in
[COLOR_SYSTEM.md](./COLOR_SYSTEM.md); this table defines only the *pairing*.

| Level | Surface token | Shadow token | Example |
| --- | --- | --- | --- |
| 0 | `--color-background` | `--shadow-none` | Page canvas |
| 1 | `--color-surface` | `--shadow-none` | Cards, inline panels |
| 2 | `--color-surface` | `--shadow-md` | Dropdowns, hovered cards |
| 3 | `--color-surface` | `--shadow-lg` | Popovers, menus, sticky bars |
| 4 | `--color-surface` | `--shadow-xl` | Modals, dialogs, command palette |

Because dark elevation leans on surface lightness, moving up a level in dark
theme makes the surface *lighter*; in light theme it stays near-white and relies
on shadow. Same tokens, correct behavior in both — the theming model at work.

### 4.5 Z-index

A named ladder so stacking order is intentional and collisions are impossible.
Layers are spaced to leave room between them.

| Token | Value | Layer |
| --- | --- | --- |
| `--z-base` | 0 | Normal flow |
| `--z-raised` | 10 | Raised-in-flow (hover cards) |
| `--z-dropdown` | 1000 | Dropdowns, select menus |
| `--z-sticky` | 1100 | Sticky headers / bars |
| `--z-overlay` | 1200 | Modal scrim / backdrop |
| `--z-modal` | 1300 | Dialogs, sheets |
| `--z-popover` | 1400 | Popovers anchored above modals |
| `--z-toast` | 1500 | Toasts / notifications |
| `--z-tooltip` | 1600 | Tooltips (always on top) |

### 4.6 Breakpoints

Mobile-first, matching the five named breakpoints in
[Design System → Breakpoints](./DESIGN_SYSTEM.md). Values align with common
device classes and with Tailwind's default `md / lg / xl / 2xl`, so a Tailwind
utility prefix and a token name never disagree.

| Token | Name | Min-width | Notes |
| --- | --- | --- | --- |
| (base) | **Mobile** | 0 | Base styles; design reference width 375px |
| `--bp-tablet` | **Tablet** | 768px | Tailwind `md` |
| `--bp-laptop` | **Laptop** | 1024px | Tailwind `lg` |
| `--bp-desktop` | **Desktop** | 1280px | Tailwind `xl` |
| `--bp-wide` | **Wide** | 1536px | Tailwind `2xl` |

Layout is authored **mobile-first** ([Design Language → Responsive Design](./DESIGN_LANGUAGE.md)):
base styles target Mobile; each breakpoint *adds* at larger widths. Maximum
content width and the 12-column grid are layout concerns governed by
[DESIGN_SYSTEM.md → Grid System](./DESIGN_SYSTEM.md).

---

## 5. Token category map (values owned elsewhere)

The remaining families follow the naming and tiering defined here; their
concrete values are owned by their domain documents. Names are reproduced so
this document is a complete **index**, but values are **not** duplicated.

| Family | Canonical semantic tokens | Values |
| --- | --- | --- |
| **Color** | `--color-background`, `--color-foreground`, `--color-surface`, `--color-surface-muted`, `--color-border`, `--color-muted`, `--color-muted-foreground`, `--color-accent`, `--color-accent-foreground`, `--color-{success,warning,danger,info}` + `-foreground` | [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) |
| **Typography** | `--font-sans`, `--font-mono`; scale steps Display, H1–H4, Body-Large, Body, Small, Caption (each with size / line-height / weight / tracking) | [TYPOGRAPHY.md](./TYPOGRAPHY.md) |
| **Motion** | `--duration-{fast,normal,slow}`; `--ease-{standard,decelerate,accelerate}` | [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) |

---

## 6. From token to CSS custom property

Semantic tokens are declared as **CSS custom properties** on `:root`, scoped by
theme. Custom properties are chosen (over compile-time variables) because they
resolve **at runtime**, which is exactly what a live theme switch requires:
change the property on the `<html>` element and every consumer updates with no
re-render and no re-paint of component logic.

```css
/* Tier 1 — primitives: identical in every theme (see COLOR_SYSTEM.md for full ramp) */
:root {
  --neutral-50:  #F7F8F8;
  --neutral-950: #0B0D0F;
  --accent-500:  #5B7CFA;
  --accent-600:  #3F5CE0;
  /* … full scales in COLOR_SYSTEM.md … */

  /* Structural tokens: theme-agnostic, defined once (this document) */
  --space-4: 1rem;
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 12px -2px rgb(0 0 0 / 0.32);
  --z-modal: 1300;
}

/* Tier 2 — semantic mapping for the DARK theme (the default) */
:root,
[data-theme="dark"] {
  --color-background: var(--neutral-950);
  --color-foreground: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-accent-foreground: var(--neutral-950);
  /* … full mapping in COLOR_SYSTEM.md … */
}

/* Tier 2 — semantic mapping for the LIGHT theme: SAME names, different values */
[data-theme="light"] {
  --color-background: var(--neutral-50);
  --color-foreground: var(--neutral-900);
  --color-accent: var(--accent-600);
  --color-accent-foreground: #FFFFFF;
}
```

Only the semantic layer is re-declared per theme. Primitives and structural
tokens are declared once. This is the concrete expression of "themes are a data
change, not a code change."

---

## 7. From token to Tailwind

Per [ADR-0003 — Tailwind + design tokens](../engineering/ARCHITECTURE.md#12-key-architectural-decisions),
authoring is done with Tailwind utilities, and **Tailwind's theme is a
projection of the tokens, not a parallel system.** The Tailwind theme maps
utility names onto the CSS custom properties above, so `bg-background`,
`text-foreground`, `rounded-md`, `p-4`, and `shadow-md` all resolve to the same
variables a raw CSS rule would use.

```js
// tailwind.config — illustrative; the token names are canonical, the wiring is not
theme: {
  extend: {
    colors: {
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      surface: 'var(--color-surface)',
      'surface-muted': 'var(--color-surface-muted)',
      border: 'var(--color-border)',
      muted: 'var(--color-muted)',
      'muted-foreground': 'var(--color-muted-foreground)',
      accent: 'var(--color-accent)',
      'accent-foreground': 'var(--color-accent-foreground)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
      info: 'var(--color-info)',
    },
    spacing: {                     // steps mirror --space-* exactly
      1: 'var(--space-1)', 2: 'var(--space-2)', 3: 'var(--space-3)',
      4: 'var(--space-4)', 6: 'var(--space-6)', 8: 'var(--space-8)',
      /* … */
    },
    borderRadius: {
      xs: 'var(--radius-xs)', sm: 'var(--radius-sm)', md: 'var(--radius-md)',
      lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', '2xl': 'var(--radius-2xl)',
      full: 'var(--radius-full)',
    },
    boxShadow: {
      sm: 'var(--shadow-sm)', md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)', xl: 'var(--shadow-xl)',
    },
    zIndex: {
      dropdown: 'var(--z-dropdown)', sticky: 'var(--z-sticky)',
      modal: 'var(--z-modal)', toast: 'var(--z-toast)', tooltip: 'var(--z-tooltip)',
    },
    screens: {
      md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px', // Tablet…Wide
    },
    transitionDuration: {
      fast: 'var(--duration-fast)', normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
    },
  },
}
```

Because Tailwind reads the same custom properties, a theme switch flows through
Tailwind-styled and raw-CSS-styled elements identically. There is one system,
viewed two ways.

---

## 8. Theming through semantic tokens

Theming (FR-002: dark / light / system, persisted, no flash of incorrect theme)
is expressed **entirely** at the semantic tier:

1. **Dark is the default and primary theme** ([BRAND.md](../product/BRAND.md),
   [Design Language → Color Philosophy](./DESIGN_LANGUAGE.md)). Its mapping lives
   on `:root`.
2. **Light** re-declares only the semantic color tokens under
   `[data-theme="light"]`.
3. **System** applies no explicit attribute and follows
   `prefers-color-scheme` — resolved to a concrete `data-theme` value before
   paint to avoid a flash of the wrong theme.
4. Persistence and the flash-free switch are an **engineering** concern
   documented with the theme implementation
   ([Architecture → Cross-cutting: Theming](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns),
   ADR-0005). This document owns only the token contract they rely on.

Components never branch on theme. If a component contains `if (theme === …)` for
a *color*, that is a defect — the value belongs in the semantic map.

---

## Engineering Decisions

- **Three tiers, not two.** A primitive→semantic split alone forces components
  to occasionally reach for a raw scale. The optional component tier absorbs
  local variation so components still never touch primitives. It is *optional*
  to avoid ceremony where a semantic token already suffices.
- **CSS custom properties for the semantic tier.** Runtime resolution is the
  feature: it is what makes a flash-free, no-re-render theme switch possible.
- **Tailwind as a projection, not a source.** Defining the palette in the
  Tailwind config *and* in CSS would create two sources of truth that drift.
  Tailwind reads the custom properties, so the tokens remain the single source.
- **Spacing steps mirror Tailwind's scale.** `--space-4` = `p-4` = 16px by
  construction, eliminating a whole class of "which 16 is this" confusion.
- **Structural tokens skip the primitive tier.** They are already intent-bearing
  and theme-agnostic; a primitive tier would be ceremony (Principle 8).

## Best Practices

- Consume **semantic** tokens in components; reach for a primitive only when
  defining a new semantic token.
- Add a **component token** only when a component genuinely needs to vary a role;
  otherwise use the semantic token directly.
- When adding a value, add it to the **scale** — never introduce a one-off. If
  the scale cannot express it, the scale is wrong; fix the scale.
- Keep names **semantic**. If you are tempted to write `--color-blue`, you are
  encoding a value into a name.
- Cross-reference the owning document for values; never copy a hex, size, or
  duration into a second file.

## Common Mistakes

- **Hardcoding a literal** "just this once." This is the exact failure Principle
  5 exists to prevent; it breaks QAT-7 and theming simultaneously.
- **Consuming a primitive in a component** (`var(--neutral-800)`), which bypasses
  the theme mapping and produces a component that looks wrong in the other theme.
- **Branching on theme in a component.** Theme differences belong in the semantic
  map, not in component logic.
- **Off-grid spacing** (`13px`, `margin: 18px`). Only the §4.1 scale is allowed.
- **Duplicating values across docs.** A value copied is a value that will drift;
  reference the owner instead.
- **Renaming a token casually.** Names are a public contract across documents and
  components; a rename is a breaking change.

## Examples

```css
/* GOOD — semantic tokens; correct in every theme, on the grid */
.card {
  background: var(--color-surface);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);      /* Elevation level 2 */
}

/* GOOD — same intent, Tailwind projection */
/* <article class="bg-surface text-foreground border border-border
                   rounded-lg p-6 shadow-md"> */

/* BAD — hardcoded literals, off-grid, not themable */
.card-bad {
  background: #14171A;   /* breaks light theme */
  border-radius: 11px;   /* off the radius scale */
  padding: 18px;         /* off the 8-pt grid */
  box-shadow: 0 2px 5px #000;  /* not a shadow token */
}
```

## Checklist

Before merging any styling:

- [ ] Every color, space, radius, shadow, z-index, and motion value resolves to a
      token — no literals.
- [ ] Components consume **semantic** (or component) tokens, never primitives.
- [ ] Spacing values are on the §4.1 8-pt scale.
- [ ] No component branches on the active theme for a color.
- [ ] New values were added to a scale, not introduced as one-offs.
- [ ] Concrete values are referenced from their owning document, not duplicated.
- [ ] The Tailwind utility and the raw-CSS token resolve to the same property.

## Related Documents

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — the token categories this document values.
- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) — color primitives, semantic mapping, contrast.
- [TYPOGRAPHY.md](./TYPOGRAPHY.md) — font families and the type scale.
- [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) — durations, easing, motion patterns.
- [COMPONENT_PHILOSOPHY.md](./COMPONENT_PHILOSOPHY.md) — how components consume tokens.
- [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) · [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) — the philosophy behind the values.
- [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) — Principle 5, theming concern, ADR-0003/ADR-0005.
- [developer/COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) — the concrete components that consume these tokens.
