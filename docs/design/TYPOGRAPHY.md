# Typography

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines the **concrete v1.0.0 type system**: the sans and mono
font families, the full type scale (Display → Caption) with size, line-height,
weight, and letter-spacing for each step, the responsive scaling approach, and
Arabic / RTL typography. It is the single source of truth for typographic
values; other documents reference it.

Typography is not decoration here — it is *the* primary design element. The
brand relies on **hierarchy over color** and treats type as the strongest
carrier of confidence ([Design Language → Typography Philosophy](./DESIGN_LANGUAGE.md),
[Principle 9](./DESIGN_PRINCIPLES.md)). This document makes that stance
concrete.

---

## Scope

**In scope.** `--font-sans` and `--font-mono`; the type scale steps and their
values; responsive scaling; Arabic/RTL considerations; usage rules for hierarchy
and weight.

**Out of scope.** Token tiers / CSS-variable and Tailwind wiring (see
[DESIGN_TOKENS.md](./DESIGN_TOKENS.md)); color of text (see
[COLOR_SYSTEM.md](./COLOR_SYSTEM.md)); the i18n routing mechanism that selects a
locale (an engineering concern — [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md),
ADR-0004).

---

## Goals

1. A modern, neutral, highly legible type system that reads as premium and
   technical.
2. Hierarchy strong enough to structure a page **without** relying on color.
3. A minimal set of weights — restraint as an aesthetic (Principle 3).
4. Legible, correctly-shaped Arabic in RTL, treated as a first-class locale.

---

## Dependencies

| Source | Role |
| --- | --- |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Token naming, CSS-var/Tailwind mapping, breakpoints for responsive scaling. |
| [DESIGN_SYSTEM.md → Typography](./DESIGN_SYSTEM.md) | The scale steps and typographic categories being valued. |
| [DESIGN_LANGUAGE.md → Typography Philosophy](./DESIGN_LANGUAGE.md) | Large headings, strong hierarchy, minimal weights, confidence. |
| [BRAND.md](../product/BRAND.md) | Premium, modern, minimal, technical; large typography. |
| [PRODUCT_REQUIREMENTS.md → FR-001](../product/PRODUCT_REQUIREMENTS.md) | English + Arabic, RTL. |

---

## 1. Font families (v1.0.0 proposed default)

### 1.1 `--font-sans` — Geist Sans

```
--font-sans: "Geist Sans", "Inter", ui-sans-serif, system-ui, -apple-system,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Why Geist Sans.** It is a modern, neutral, screen-first sans purpose-built for
interfaces and technical content: even rhythm, low idiosyncrasy, a true variable
weight axis, and excellent small-size legibility. Its neutrality lets *hierarchy
and spacing* — not the typeface's personality — carry the design, which is
exactly the brand's stance. It pairs metrically with Geist Mono (§1.2) for a
coherent system. Choosing a typeface associated with the reference set is
consistent with the *inspiration, not imitation* rule: a font is a tool, and the
layout, scale, and voice built on it are the portfolio's own.

**Fallbacks.** `Inter` (an Inter-class metric-compatible sans) then the native
system stack, so text renders sensibly before the web font loads and if it
fails. The web font is loaded with `font-display: swap` and preloaded to protect
LCP (QAT-1); this loading strategy is an engineering concern
([PERFORMANCE.md](../engineering/PERFORMANCE.md)).

### 1.2 `--font-mono` — Geist Mono

```
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono",
             "Cascadia Code", Menlo, Consolas, monospace;
```

**Why Geist Mono.** A technical monospace that shares design DNA and metrics with
Geist Sans, so code, tokens, metrics, and inline technical strings feel part of
the same system rather than bolted on. It is highly legible at small sizes with
clearly differentiated `0/O`, `1/l/I`, and `{}/()` — essential for a portfolio
that *shows code* and engineering artifacts. Mono is used intentionally: code
blocks, inline code, keyboard keys, and numeric/technical labels — never as a
decorative "techy" display face.

---

## 2. Type scale (v1.0.0 proposed default)

Base is **16px = 1rem**. Sizes are in `rem` so they honor the user's browser
font-size preference (an accessibility requirement). Every step names its
intended role; the scale is deliberately compact — nine steps — because *less
but better* (Principle 3) applies to type as much as to color.

| Step | Size (rem / px) | Line-height | Weight | Tracking | Role |
| --- | --- | --- | --- | --- | --- |
| **Display** | 3.5rem / 56px | 1.05 | 600 | −0.02em | Hero statement; one per page |
| **H1** | 2.5rem / 40px | 1.10 | 600 | −0.02em | Page title |
| **H2** | 2rem / 32px | 1.15 | 600 | −0.015em | Section heading |
| **H3** | 1.5rem / 24px | 1.25 | 600 | −0.01em | Sub-section heading |
| **H4** | 1.25rem / 20px | 1.35 | 600 | −0.005em | Minor heading / card title |
| **Body-Large** | 1.125rem / 18px | 1.65 | 400 | 0 | Lead paragraphs, intros |
| **Body** | 1rem / 16px | 1.60 | 400 | 0 | Default body copy |
| **Small** | 0.875rem / 14px | 1.50 | 400 | 0 | Secondary text, metadata |
| **Caption** | 0.75rem / 12px | 1.45 | 500 | +0.01em | Labels, captions, overlines |

**Reading the values:**

- **Tight line-height and negative tracking on large steps** make big headings
  feel deliberate and premium (large type appears loose and over-tracked at
  default metrics). **Generous line-height (1.6–1.65) on body** maximizes
  readability for long-form case studies — content comes first
  ([Principle 2](./DESIGN_PRINCIPLES.md)).
- **Positive tracking on Caption** improves legibility of small, often
  uppercase, labels.
- **Display is used once per page** as the primary statement; it is not a
  general "big heading" — that is H1.

### 2.1 Weights — deliberately minimal

The system uses **three weights only**:

| Weight | Value | Use |
| --- | --- | --- |
| Regular | 400 | All body text (Body-Large, Body, Small) |
| Medium | 500 | Captions/labels, UI controls, emphasis within body |
| Semibold | 600 | All headings (Display → H4) |

No Light, Bold, or Black. Restraint is the aesthetic
([Design Language](./DESIGN_LANGUAGE.md): "Minimal font weights"): headings earn
prominence through **size and space**, not heavier ink. Emphasis inside body
copy uses Medium (500), not Bold. A variable font supplies these as axis stops,
so adding one later is a token change, not a new asset.

---

## 3. Responsive scaling

Type is authored **mobile-first** and scales up at the named breakpoints
([DESIGN_TOKENS.md → Breakpoints](./DESIGN_TOKENS.md#46-breakpoints)). The values
in §2 are the **desktop (Laptop+) targets**; the largest steps step *down* on
small screens so a hero never overwhelms a 375px viewport.

Two mechanisms, used deliberately:

- **Fluid interpolation with `clamp()`** for the display/heading steps
  (Display, H1, H2). Size scales smoothly between a mobile minimum and the
  desktop maximum, avoiding abrupt jumps:

  ```css
  /* Display: 36px on small screens → 56px at large; fluid between */
  --font-size-display: clamp(2.25rem, 1.5rem + 3.2vw, 3.5rem);
  /* H1: 30px → 40px */
  --font-size-h1: clamp(1.875rem, 1.4rem + 2vw, 2.5rem);
  /* H2: 26px → 32px */
  --font-size-h2: clamp(1.625rem, 1.35rem + 1.2vw, 2rem);
  ```

  `clamp()` is capped at both ends so text never becomes illegibly small nor
  unbounded on ultra-wide screens.

- **Fixed rem sizes** for H3 → Caption. Below H2 the differences are small
  enough that fluid scaling adds complexity without benefit (Principle 8,
  *simplicity when in doubt*); these steps keep constant sizes across
  breakpoints, with line-height doing minor responsive work if needed.

Line-height and weight do **not** change responsively; only the size of the
large steps does.

---

## 4. Arabic & RTL typography

Arabic is a **first-class locale** ([FR-001](../product/PRODUCT_REQUIREMENTS.md)),
not a translation layer. Arabic script differs from Latin in ways that type must
respect — retrofitting it is the expensive rework the architecture warns against
([ARCHITECTURE.md → Cross-cutting: i18n](../engineering/ARCHITECTURE.md#10-cross-cutting-concerns)).

- **Arabic-capable face.** Geist Sans does not cover Arabic. For the `ar` locale,
  the `--font-sans` stack resolves to a dedicated Arabic sans —
  **IBM Plex Sans Arabic** (v1.0.0 proposed default): modern, neutral, and
  metrically calm, so it reads as the *same system* as Geist Sans rather than a
  different voice. It is applied via the locale/`dir`-scoped font stack, so no
  new canonical token is introduced — the *name* `--font-sans` is stable; its
  *resolved stack* is locale-aware.
- **No faux styling.** Never synthesize bold or italic for Arabic. Arabic has no
  italic tradition — emphasis uses weight (Medium 500) or color, never slant.
  Use real weight stops only.
- **Larger effective size & looser line-height.** Arabic letterforms carry more
  detail below the baseline and in diacritics; at the same px size Arabic reads
  smaller and denser. Body Arabic uses a slightly larger effective size and
  **increased line-height** (≈ +0.1 over the Latin value) so ascenders,
  descenders, and harakat are not crowded.
- **Letter-spacing must be zero.** Arabic is cursive/connected; positive tracking
  breaks letter joins and is a correctness bug, not a style choice. The negative
  tracking on Latin headings is **not** applied to Arabic — tracking resets to
  `0` for `dir="rtl"`.
- **Direction is layout-level.** `dir="rtl"` on the document flips text
  alignment, logical properties, and reading order. Type styles use
  **logical properties** (`margin-inline-start`, `text-align: start`) so they
  mirror automatically; directional motion mirroring is covered in
  [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md).
- **Numerals & mixed content.** Latin numerals, code, and identifiers embedded in
  Arabic keep LTR direction within the RTL flow (bidi isolation) so technical
  strings render correctly.

---

## 5. Usage rules

- **Hierarchy over color** ([Principle 9](./DESIGN_PRINCIPLES.md)). Structure a
  page with size, weight, and space — not by tinting text. If two things need to
  differ, change the *step* before reaching for color.
- **One Display per page**, one H1 per page; heading levels descend without
  skipping (also a semantic-HTML / accessibility requirement — headings map to
  real `<h1>`–`<h4>`).
- **Readable measure.** Long-form body copy is constrained to a comfortable line
  length (≈ 60–75 characters); this is a layout constraint
  ([DESIGN_SYSTEM.md → Layout Rules](./DESIGN_SYSTEM.md): "Readable content
  width").
- **Emphasis is Medium, not Bold.** With a three-weight system, in-body emphasis
  is 500, not a heavier stand-in.
- **Mono is intentional.** Code, keys, tokens, and technical labels — never
  body prose or decorative headings.
- **Semantic level ≠ visual step.** The visual step is a style; the HTML heading
  level is structure. A card title may *look* like H4 while being the correct
  semantic level for its context.

---

## Engineering Decisions

- **Geist Sans + Geist Mono.** One metrically-related pair gives sans and mono a
  single voice; both are variable, so the three weights are axis stops, not
  extra font files (protecting the performance budget, QAT-1).
- **rem, not px.** Honors user font-size preferences — an accessibility
  requirement, not a preference.
- **`clamp()` only for large steps.** Fluid scaling matters where size varies
  most; applying it everywhere adds complexity for no perceptible gain.
- **Three weights.** Enforces hierarchy-by-structure and keeps the system calm
  and premium; also smaller font payload.
- **Locale-aware `--font-sans` stack, not a new token.** Keeps the canonical
  name stable while giving Arabic a correct face.

## Best Practices

- Apply type via the scale-step tokens; never set an ad-hoc `font-size`.
- Descend heading levels in order; match visual step to semantic level by intent.
- Constrain body measure for readability.
- For Arabic: real weights only, zero tracking, looser line-height, logical
  properties.
- Preload the sans web font and use `font-display: swap`.

## Common Mistakes

- **Color for hierarchy** where a larger/heavier step is the correct tool.
- **Skipping heading levels** (H2 → H4), breaking the document outline and
  screen-reader navigation.
- **Faux-bold/italic Arabic**, or **positive tracking on Arabic**, which breaks
  cursive joins — a correctness bug.
- **Bold (700) emphasis** in a three-weight system; use Medium (500).
- **px font sizes**, which ignore user zoom/preferences.
- **Mono as a display face** for style rather than technical meaning.
- **Copying scale values** into another document instead of referencing here.

## Examples

```css
/* Heading — hierarchy via size/weight/space, color stays foreground */
.h2 {
  font-family: var(--font-sans);
  font-size: var(--font-size-h2);   /* clamp(): 26→32px */
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--color-foreground);
}

/* Body — generous line-height for long-form readability */
.body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 400;
}

/* Inline code — intentional mono */
.code { font-family: var(--font-mono); font-size: 0.875rem; }

/* RTL correction — reset Latin heading tracking for Arabic */
[dir="rtl"] .h2 { letter-spacing: 0; line-height: 1.25; }
```

## Checklist

- [ ] Text uses a scale step (Display → Caption), not an ad-hoc size.
- [ ] Sizes are in `rem`.
- [ ] Only weights 400 / 500 / 600 are used; emphasis is 500.
- [ ] Heading levels descend without skipping; one Display and one H1 per page.
- [ ] Hierarchy is carried by type and space, not color.
- [ ] Arabic: correct face, zero tracking, looser line-height, no faux styling.
- [ ] Logical properties used so layout mirrors in RTL.
- [ ] Body measure is constrained to a readable line length.

## Related Documents

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — token naming, CSS-var/Tailwind mapping, breakpoints.
- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) — text color (hierarchy's counterpart).
- [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) — RTL directional mirroring.
- [DESIGN_LANGUAGE.md → Typography Philosophy](./DESIGN_LANGUAGE.md) · [DESIGN_SYSTEM.md → Typography](./DESIGN_SYSTEM.md) · [BRAND.md](../product/BRAND.md).
- [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md) — locale selection / RTL routing (ADR-0004).
- [PERFORMANCE.md](../engineering/PERFORMANCE.md) — font loading strategy.
