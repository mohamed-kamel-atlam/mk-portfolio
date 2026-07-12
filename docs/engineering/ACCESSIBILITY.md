# Accessibility Standards

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

Accessibility is non-negotiable in this project. The architecture states it as a
standing principle — *accessibility is a build-time requirement of every
component, not a later audit*
([ARCHITECTURE §2](./ARCHITECTURE.md#2-architectural-principles)) — and elevates
it to the one quality attribute that is *never traded away*
([ARCHITECTURE §1](./ARCHITECTURE.md#1-architectural-goals--quality-attributes),
QAT-2). This document is the concrete standard that realizes QAT-2: the target
conformance level, the rules every component must meet, and how conformance is
verified.

The target is **WCAG 2.1 Level AA**
([PRD → Accessibility](../product/PRODUCT_REQUIREMENTS.md);
[DESIGN_SYSTEM → Accessibility](../design/DESIGN_SYSTEM.md)). This document
translates that standard into portfolio-specific engineering rules and ties them
to the components that must satisfy them
([COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md)).

---

## Scope

**In scope.** WCAG 2.1 AA as applied to this codebase: semantic HTML and
document structure; landmarks and heading order; keyboard operability and focus
management; visible, token-driven focus indication; color contrast; motion and
`prefers-reduced-motion`; forms and error messaging; images and alternative
text; the "ARIA only when needed" rule; RTL accessibility; screen-reader
expectations; and the testing approach (automated, manual, keyboard).

**Out of scope.** Contrast *values and ratios* per token, owned by
[COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md); this document references those
targets rather than restating them. The motion *system and timings*, owned by
[MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md); this document specifies
only the reduced-motion contract. Per-component API detail, owned by
[COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md). The i18n mechanics of
direction and language, owned by
[INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md); this document covers only
their accessibility consequences.

---

## Goals

1. **WCAG 2.1 AA on every page, in both locales and both directions.** Not a
   subset, not "the important pages" — the whole site.
2. **Accessibility by construction, not by audit.** Build components accessible;
   use testing to *confirm*, never to *discover* baseline failures.
3. **Keyboard parity.** Everything achievable with a pointer is achievable from
   the keyboard, in a logical order, with an always-visible focus indicator.
4. **Semantics first, ARIA last.** Reach for the correct native element before
   any ARIA attribute; ARIA supplements, it never substitutes.

---

## Responsibilities

| This document owns | Deferred to |
| --- | --- |
| WCAG 2.1 AA conformance rules for the codebase | — |
| Keyboard, focus, and screen-reader expectations | — |
| Reduced-motion contract | [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) owns timings |
| Testing approach (axe / manual / keyboard) | — |
| Contrast ratios and token values | [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md) |
| Per-component accessible API | [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) |
| Direction/language mechanics | [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |

---

## Dependencies

| Document | Relationship |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Frame: QAT-2, accessibility as a build-time constraint on every component. |
| [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md) | Target contrast ratios; theme-aware, token-driven colors. |
| [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) | Motion system honoured by the reduced-motion contract. |
| [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) | Components that must meet these rules. |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Language, direction, and switcher accessibility. |
| [PERFORMANCE.md](./PERFORMANCE.md) | The Lighthouse accessibility budget (≥ 95). |

---

## 1. Standard & Conformance Target

The conformance target is **WCAG 2.1 Level AA**, evaluated against the four POUR
principles. Every page must be:

- **Perceivable** — content and UI are presentable to the senses the visitor
  has (text alternatives, sufficient contrast, no information by color alone).
- **Operable** — all functionality works from a keyboard, with enough time and
  without motion that harms (focus order, visible focus, reduced motion).
- **Understandable** — content and operation are predictable (language declared,
  consistent navigation, clear error messages).
- **Robust** — markup is valid and works with assistive technologies (semantic
  HTML, correct names/roles/values, ARIA only when needed).

AA is the product requirement; where AAA is cheap and non-disruptive (for
example, exceeding minimum contrast) the project takes it, but AA is the bar
that must always be met.

---

## 2. Semantic HTML & Document Structure

Semantic HTML is the foundation; it is what makes the rest possible and is the
cheapest accessibility win.

- **Use the element that means the thing.** `<button>` for actions, `<a href>`
  for navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`,
  `<section>`, `<ul>/<ol>` for lists. Never a `<div>` with a click handler where
  a `<button>` belongs.
- **One `<main>` per page**, plus the landmark set below.
- **Buttons vs. links:** a link changes the URL (including the language switcher,
  which is a real navigation — see
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)); a button performs an
  in-page action (theme toggle, opening a dialog). Choosing wrongly breaks
  keyboard and screen-reader expectations.

### 2.1 Landmarks

Every page exposes a consistent landmark structure so assistive-technology users
can jump directly to regions: `banner` (`<header>`), `navigation` (`<nav>`),
`main` (`<main>`), `contentinfo` (`<footer>`), and `complementary` (`<aside>`)
where used. Landmarks are provided by native elements, not by adding `role=` to
generic containers.

### 2.2 Headings

- Exactly **one `<h1>` per page**, naming the page's purpose.
- Heading levels **descend without skipping** (`h1 → h2 → h3`); levels convey
  structure, not size — size is a typography-token concern
  ([TYPOGRAPHY.md](../design/TYPOGRAPHY.md)), never chosen by picking a heading
  tag for its font size.
- Long content pages (docs, case studies) use their heading outline as the
  navigable structure.

### 2.3 Skip link

A "Skip to main content" link is the first focusable element on every page,
visible on focus, so keyboard and screen-reader users can bypass the header and
navigation.

---

## 3. Keyboard Operability & Focus Management

Keyboard parity is mandatory (QAT-2; [PRD → Accessibility](../product/PRODUCT_REQUIREMENTS.md)).

- **Everything operable by keyboard.** Every interactive element is reachable and
  activatable with `Tab`/`Shift+Tab`, `Enter`/`Space`, and arrow keys where a
  pattern expects them (menus, tabs, the command menu).
- **Logical focus order** follows reading order. In RTL the reading order is
  right-to-left; because layout uses logical CSS
  ([INTERNATIONALIZATION.md §4.2](./INTERNATIONALIZATION.md#42-logical-css-properties-not-physical))
  the DOM order stays correct and focus order follows it in both directions.
- **No keyboard traps.** Focus can always move away from any element by keyboard
  alone.
- **Focus management for overlays.** When a dialog, command menu, or mobile
  navigation opens, focus moves into it, is **trapped within it** while open,
  `Escape` closes it, and focus **returns to the triggering control** on close.
- **`tabindex` discipline.** Use `tabindex="0"` to include a custom control and
  `tabindex="-1"` for programmatic focus targets; **never** a positive
  `tabindex`, which corrupts the natural order.

---

## 4. Visible Focus Indication

A visible focus indicator is required (QAT-2;
[DESIGN_SYSTEM → Accessibility](../design/DESIGN_SYSTEM.md):"Visible focus").

- Every focusable element shows a **clearly visible** focus indicator that meets
  AA contrast against its background.
- The indicator is **token-driven** — a dedicated focus-ring token, theme-aware
  so it is visible in both dark and light themes
  ([COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md)). No hardcoded focus colors
  ([ARCHITECTURE §2](./ARCHITECTURE.md#2-architectural-principles), *tokens over
  hardcoding*).
- Use **`:focus-visible`** so the ring appears for keyboard focus without adding
  noise for pointer clicks — but never remove focus styling outright
  (`outline: none` with no replacement is a defect).
- The indicator must not be clipped by `overflow: hidden` on ancestors.

---

## 5. Color & Contrast

Color must never be the *only* carrier of meaning, and text must meet contrast
minimums.

- **Contrast ratios** meet WCAG AA: **≥ 4.5:1** for normal text, **≥ 3:1** for
  large text and for meaningful UI components and graphical objects. The
  **target ratios and the token values that satisfy them are owned by
  [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md)**; this document requires that
  every text/background and control pairing hits those targets in **both
  themes**. The color system is dark-first
  ([DESIGN_LANGUAGE → Color Philosophy](../design/DESIGN_LANGUAGE.md)), and light
  mode must clear the same bar.
- **Never encode information by color alone** (WCAG 1.4.1). A state, a required
  field, an error, or a link is distinguished by an icon, text, underline, or
  shape in addition to color.
- Color values are always tokens; components never reference raw colors
  ([ARCHITECTURE §10](./ARCHITECTURE.md#10-cross-cutting-concerns)).

---

## 6. Motion & `prefers-reduced-motion`

Motion must never harm. Reduced-motion support is a design and architecture
requirement
([DESIGN_LANGUAGE → Accessibility](../design/DESIGN_LANGUAGE.md);
[ARCHITECTURE Checklist](./ARCHITECTURE.md#architecture-checklist)).

- **Honour `prefers-reduced-motion: reduce`.** When set, non-essential motion
  (parallax, large transitions, autoplay, decorative animation) is removed or
  replaced with an instantaneous or minimal change. Essential motion that
  conveys meaning is reduced to its gentlest form, never a jarring one.
- **No motion that risks harm** — nothing that flashes more than three times per
  second (WCAG 2.3.1), and no large, unavoidable vestibular triggers.
- The **motion system, tokens, and timings** are owned by
  [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md); this document owns only
  the contract that every animation checks the reduced-motion preference and has
  a defined reduced state. Reduced-motion applies equally in LTR and RTL.

This aligns with the brand's own motion stance — purposeful, never decorative,
never distracting ([BRAND → Motion Principles](../product/BRAND.md)).

---

## 7. Forms & Error Messaging

The contact form (FR-010) is the primary interactive form; these rules apply to
it and any future form.

- **Every input has a programmatically associated `<label>`** (via `for`/`id` or
  wrapping). Placeholder text is never a substitute for a label.
- **Required fields and constraints are stated in text**, not signalled by color
  alone, and are exposed to assistive tech (`aria-required`,
  `aria-describedby` for hints).
- **Errors are perceivable, specific, and associated.** On validation failure:
  the field is marked (`aria-invalid`), the message is linked via
  `aria-describedby`, the message is **specific and actionable** ("Enter a valid
  email address," not "Invalid"), and focus moves to the first invalid field.
- **Errors are announced.** A summary or the message region uses a polite live
  region so screen-reader users learn of the failure without losing their place.
- **All form strings are localized** ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)),
  including labels, hints, and error messages.

---

## 8. Images & Alternative Text

Per [DESIGN_SYSTEM → Images](../design/DESIGN_SYSTEM.md):

- **Informative images** have concise, meaningful `alt` text describing their
  purpose; **decorative images** have empty `alt=""` so screen readers skip
  them.
- **Complex images** (diagrams, architecture figures in case studies) have a
  text description nearby or via a described-by reference.
- **Alt text is content** and is therefore **localized** — it comes from the
  content layer per locale ([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)),
  not hardcoded in English.
- Icons (Lucide) that are purely decorative are hidden from assistive tech
  (`aria-hidden`); an icon that carries meaning has an accessible name, and per
  the design system icons never *replace* a text label
  ([DESIGN_SYSTEM → Iconography](../design/DESIGN_SYSTEM.md)).

---

## 9. ARIA — Only When Needed

> "No ARIA is better than bad ARIA." Use a native element first.

- Reach for ARIA **only** when no native element expresses the semantics (custom
  widgets: command menu, tabs, disclosure, combobox). Prefer established WAI-ARIA
  Authoring Practices patterns for these, implemented in full (roles *and* the
  keyboard interaction they imply).
- **Never** use ARIA to paper over the wrong element (`role="button"` on a
  `<div>` instead of using `<button>`).
- Keep the accessible name, role, and value correct and in sync with the visible
  state; a mislabelled or stale ARIA attribute is worse than none.
- These custom patterns are catalogued with their accessible APIs in
  [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md).

---

## 10. RTL Accessibility

Accessibility and internationalization intersect; RTL must be accessible, not
merely rendered.

- **`lang` and `dir` are correct** on the document, set from the active locale
  at the root layout
  ([INTERNATIONALIZATION.md §4.1](./INTERNATIONALIZATION.md#41-the-dir-attribute)),
  so assistive tech pronounces content in the right language and voices reading
  order correctly.
- **Language of parts** — an inline run in another language (an English term in
  Arabic prose) carries its own `lang` so it is pronounced correctly.
- **Focus and reading order follow logical direction**, which the logical-CSS
  layout preserves automatically in RTL (see [§3](#3-keyboard-operability--focus-management)).
- **Directional controls are labelled by meaning, not direction** — a
  "Previous" control is named "Previous" in both locales even though its icon
  mirrors.

---

## 11. Screen-Reader Expectations

The site is validated against at least one screen reader per major platform
(e.g. VoiceOver on macOS/iOS, NVDA on Windows). A screen-reader user must be able
to:

- Identify the page by its `<title>` and `<h1>`.
- Navigate by landmark and by heading, and skip to main content.
- Understand every control's name, role, and state.
- Complete the contact form and recover from validation errors.
- Perceive dynamic changes (form errors, menu open/close) through correct focus
  movement and, where appropriate, polite live regions — without spammy or
  redundant announcements.

---

## 12. Testing Approach

Accessibility is verified by a layered approach; no single method is sufficient,
and automation catches at most a fraction of issues.

| Layer | What it catches | When |
| --- | --- | --- |
| **Automated (axe)** | Contrast, missing labels/alt, invalid ARIA, landmark and heading issues, duplicate ids. | On every PR, integrated with the Lighthouse accessibility budget (≥ 95, [PERFORMANCE.md](./PERFORMANCE.md)); across both locales and themes. |
| **Keyboard-only pass** | Focus order, traps, visible focus, operability of every control and overlay. | Manually, for every new interactive component and before release. |
| **Manual screen-reader pass** | Names/roles/states, announcement quality, reading order — the majority automation cannot see. | For interactive components and key flows (navigation, contact). |
| **Manual review** | Meaningful alt text, error-message clarity, color-not-alone, reduced-motion behavior. | During component and content review. |

Automated checks are a floor, not a certificate: a green axe run with a broken
keyboard experience is still a failure. The CI gate (Lighthouse ≥ 95 for
accessibility) enforces the automated floor; the manual passes are the
substantive test.

---

## Engineering Decisions

- **WCAG 2.1 AA is the conformance target**, applied to every page in both
  locales and both directions — not a subset.
- **Semantics before ARIA**: the correct native element is always the first
  choice; ARIA supplements custom widgets only.
- **Focus indication is token-driven and `:focus-visible`-based**, visible in
  both themes, never removed without replacement.
- **Contrast ratios are owned by COLOR_SYSTEM.md**; this document requires every
  pairing to meet AA in both themes and forbids color-only meaning.
- **Reduced motion is a per-animation contract**; every animation defines a
  reduced state and checks the preference.
- **Testing is layered**: automated axe as a CI floor, plus mandatory manual
  keyboard and screen-reader passes for interactive work.

---

## Best Practices

- Start from the correct semantic element; add ARIA only if the platform has no
  element for the job.
- Tab through every new component before considering it done; confirm the focus
  ring is always visible.
- Give overlays focus-trap, `Escape`-to-close, and focus-return behavior.
- Write specific, localized error messages and associate them with their fields.
- Provide meaningful, localized `alt`; mark decorative imagery `alt=""` /
  `aria-hidden`.
- Define a reduced-motion variant for every animation.
- Never signal state by color alone — pair it with text, icon, or shape.

---

## Common Mistakes

- **`<div onClick>` instead of `<button>`**, losing keyboard operability and
  role.
- **`outline: none`** with no visible replacement, erasing the focus indicator.
- **Placeholder-as-label**, leaving inputs unnamed for assistive tech.
- **Color-only state** (red border alone for an error) failing WCAG 1.4.1.
- **Skipped heading levels** or multiple `<h1>`s, breaking the document outline.
- **ARIA misuse** — roles on the wrong element, or stale `aria-*` values that
  contradict the visible state.
- **Overlays without focus management** — no trap, no `Escape`, no focus return.
- **Ignoring `prefers-reduced-motion`**, animating regardless of the user's
  stated preference.
- **English-only `alt`/errors**, breaking accessibility for Arabic visitors.

---

## Examples

**A focus-managed dialog (illustrative).**

```tsx
// Native <dialog> gives focus trap + Escape for free; label it and return focus.
<dialog ref={ref} aria-labelledby="dlg-title" onClose={returnFocusToTrigger}>
  <h2 id="dlg-title">{t.contact.title}</h2>
  {/* ...form... */}
</dialog>
```

**An accessible, localized error message (illustrative).**

```tsx
<label htmlFor="email">{t.form.email.label}</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error" role="alert">{t.form.email.errors[error]}</p>}
```

**Token-driven, keyboard-only focus ring (illustrative).**

```css
/* Ring uses a theme-aware token; only for keyboard focus. */
:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
```

---

## Checklist

Use alongside the
[Architecture Checklist](./ARCHITECTURE.md#architecture-checklist).

- [ ] Is the markup semantic (correct elements, one `<main>`, one `<h1>`, no
      skipped heading levels)?
- [ ] Are landmarks present and a skip link the first focusable element?
- [ ] Is every interactive element keyboard-operable, in logical order, with no
      traps?
- [ ] Do overlays trap focus, close on `Escape`, and return focus to the
      trigger?
- [ ] Is there a visible, token-driven, `:focus-visible` focus indicator in both
      themes?
- [ ] Do all text and UI pairings meet AA contrast in both themes, with no
      color-only meaning?
- [ ] Does every animation honour `prefers-reduced-motion`?
- [ ] Do forms have associated labels, specific localized errors, and correct
      focus/announcement on failure?
- [ ] Is `alt` meaningful (or empty for decorative) and localized?
- [ ] Is ARIA used only where native semantics fall short, and kept in sync?
- [ ] Are `lang`/`dir` correct and language-of-parts marked, with focus order
      correct in RTL?
- [ ] Do the automated (axe/Lighthouse ≥ 95) and manual keyboard/screen-reader
      passes pass?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — QAT-2; accessibility as a build-time
  constraint.
- [COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md) — contrast ratios and token
  values.
- [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) — motion system honoured
  by reduced-motion.
- [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) — components and
  their accessible APIs.
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — language, direction, and
  switcher accessibility.
- [PERFORMANCE.md](./PERFORMANCE.md) — the Lighthouse accessibility budget.

---

## Revision History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 1.0.0 | July 2026 | Draft | Initial accessibility standard realizing QAT-2: WCAG 2.1 AA rules for semantics, keyboard/focus, contrast, reduced motion, forms, images, ARIA discipline, RTL, screen-reader expectations, and a layered testing approach. |
