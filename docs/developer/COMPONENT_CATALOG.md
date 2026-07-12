# Component Catalog

**Version:** 1.0.0 / **Status:** Draft / **Last Updated:** July 2026 / **Owner:** Mohamed Kamel

---

## Purpose

This document is the **concrete component inventory** for the portfolio's MVP.
It answers a single question for every UI building block we ship: *what is it,
how does it vary, what states must it express, does it run on the server or the
client, which design tokens does it consume, and what is its accessibility
contract?*

It exists so that a contributor — human or AI — can look up any component before
building or using it and find the same answer every time. Where
[COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md) explains *why* our
components look and behave the way they do, this document is the *register* of
what actually exists. It is deliberately literal: names, variants, props-shape
intent, and contracts, not design theory.

---

## Scope

**In scope.** The components required by the MVP surface defined in
[PRD → MVP](../product/PRODUCT_REQUIREMENTS.md) and
[PRD → Information Architecture](../product/PRODUCT_REQUIREMENTS.md): Landing,
About, Projects, Project Detail, Engineering, Journey, Contact, and Resume, in
English and Arabic, dark and light. Components are grouped into **Primitives**,
**Layout**, and **Composite** tiers.

**Out of scope.** Design rationale and principles (owned by
[COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md)); token *values*
(owned by [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md),
[COLOR_SYSTEM.md](../design/COLOR_SYSTEM.md),
[TYPOGRAPHY.md](../design/TYPOGRAPHY.md)); accessibility *standards* and testing
procedure (owned by [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md)); code
style and file conventions (owned by [CODING_STANDARDS.md](./CODING_STANDARDS.md)).
V2 surfaces — Blog, Command Menu, Search
([PRD → Version 2](../product/PRODUCT_REQUIREMENTS.md)) — are noted where a
component is scaffolded for them but are not specified here.

---

## Goals

- Provide a **single lookup** for every MVP component and its contract.
- Make the **Server/Client default explicit** for each component so the
  server-first model ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)) is
  applied by construction, not by memory.
- Bind every component to the **design tokens and type steps** it consumes, so
  no component reintroduces hardcoded values (QAT-7).
- State each component's **accessibility contract** as a build-time obligation
  (QAT-2), not a later audit.

---

## Responsibilities

| This document owns | This document defers to |
| --- | --- |
| The list of MVP components and their tier. | Design principles → [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md) |
| Per-component variants, states, and Server/Client default. | Token values → [design/](../design/DESIGN_TOKENS.md) |
| The tokens/type steps each component consumes (by name). | A11y standards & audits → [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) |
| Each component's accessibility contract. | Naming & file rules → [CODING_STANDARDS.md](./CODING_STANDARDS.md) |

---

## Dependencies

| Source | Why it constrains this catalog |
| --- | --- |
| [PRD → FR-003…FR-010, IA, MVP](../product/PRODUCT_REQUIREMENTS.md) | Defines which surfaces exist, therefore which components are needed. |
| [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md) | Defines the canonical **state set** (default/hover/focus/active/loading/disabled/error/success), component standards, iconography, and the naming ban. |
| [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md) | One-responsibility, composable, predictable, minimal — the design contract each entry must satisfy. |
| [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) | The accessibility standard each component's contract refines. |
| [ARCHITECTURE §5–6](../engineering/ARCHITECTURE.md) | Server-first default; shared components live in the shared layer (`shared/ui`). |
| [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md), [TYPOGRAPHY.md](../design/TYPOGRAPHY.md), [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) | The token and type-step names referenced per component. |

---

## How to read an entry

Every component below is described with the same fields:

- **Purpose** — its single responsibility (one, per
  [COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md)).
- **Variants** — the intentional axes of visual/behavioral variation.
- **States** — which of the canonical states from
  [DESIGN_SYSTEM.md → States](../design/DESIGN_SYSTEM.md) it must express.
  Components that render no interactive affordance list only the states they can
  actually reach.
- **Default** — **Server** or **Client** Component
  ([ARCHITECTURE §5.1](../engineering/ARCHITECTURE.md)). "Client" always means
  the `"use client"` island is pushed to the smallest possible leaf.
- **Tokens** — the token families and type steps it consumes, **by name only**;
  values live in [design/](../design/DESIGN_TOKENS.md).
- **A11y contract** — the accessibility obligations that must hold for the
  component to ship, refining [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md).

Token shorthand used below: color tokens are the
`--color-*` family; spacing is `--space-*` (8-pt grid); radii `--radius-*`;
shadows `--shadow-*`; motion `--duration-*` / `--ease-*`; typography is the
`--font-sans` / `--font-mono` families rendered at the `Display…Caption` type
steps.

---

## 1. Primitives

Primitives are the irreducible building blocks. They are unaware of any feature,
live in `shared/ui`, and are Server Components unless interaction forces
otherwise.

### Button

- **Purpose.** Trigger an action or, as a link-styled variant, navigate.
- **Variants.** `primary`, `secondary`, `ghost`, `destructive`; sizes `sm`,
  `md`, `lg`; optional leading/trailing `Icon`; `iconOnly` (requires an
  accessible label). One primary button per screen
  ([DESIGN_SYSTEM.md → Layout Rules](../design/DESIGN_SYSTEM.md)).
- **States.** default, hover, focus, active, loading (spinner + disabled
  interaction, width preserved), disabled, success/error only when it owns an
  async result (e.g., contact submit).
- **Default.** **Server** for static navigation/actions rendered inside a form;
  **Client** only when it holds local pending/loading state.
- **Tokens.** `--color-accent` / `--color-accent-foreground` (primary),
  `--color-surface` / `--color-border` (secondary), `--radius-md`,
  `--space-*` padding, `--shadow-sm` on hover, `--duration-fast` +
  `--ease-standard` for state transitions; label at `Body`/`Small` step.
- **A11y contract.** Native `<button>` (or `<a>` when navigating); visible focus
  ring via focus token; `disabled` reflected to the accessibility tree;
  `iconOnly` requires `aria-label`; loading sets `aria-busy` and keeps the
  control's accessible name.

### Link

- **Purpose.** Navigate within the app or to an external destination.
- **Variants.** `internal` (locale-aware, prefetch-friendly), `external`
  (adds `rel="noopener noreferrer"` and a visible external indicator),
  `subtle` / `standalone` emphasis.
- **States.** default, hover, focus, active, visited (where meaningful).
- **Default.** **Server.** Internal links are locale-aware and rendered on the
  server; no client JS required for navigation.
- **Tokens.** `--color-accent` (text), underline offset via spacing tokens,
  `--duration-fast` for hover; inherits body type step.
- **A11y contract.** Real `<a href>` (never a click-handler div); external links
  are marked both visually and via `aria-label`/icon so intent is conveyed
  without color alone; focus visible.

### Icon

- **Purpose.** Render a single [Lucide](../design/DESIGN_SYSTEM.md) glyph.
  Icons never replace labels
  ([DESIGN_SYSTEM.md → Iconography](../design/DESIGN_SYSTEM.md)).
- **Variants.** Size tied to the surrounding type step; `decorative` vs
  `semantic`.
- **States.** Inherits the parent's interactive states; no independent states.
- **Default.** **Server.**
- **Tokens.** `currentColor` (inherits `--color-foreground`/`--color-muted-foreground`);
  size from spacing scale; stroke width fixed by the Lucide system.
- **A11y contract.** Decorative icons are `aria-hidden="true"`; semantic icons
  carry an accessible label on the icon or its control. An icon is never the
  sole carrier of meaning.

### Input

- **Purpose.** Single-line text entry.
- **Variants.** `text`, `email`, `url`, `search`; with/without leading icon;
  sizes `sm`/`md`.
- **States.** default, hover, focus, disabled, error, success (validated); no
  loading (the submitting control owns loading).
- **Default.** **Client** (holds value/validation state), kept as a leaf inside
  an otherwise-server form.
- **Tokens.** `--color-surface` background, `--color-border` (→
  `--color-danger` in error, `--color-success` when valid), `--radius-sm`,
  `--space-*` padding, focus ring token; text at `Body`.
- **A11y contract.** Always paired with a `Label` via `htmlFor`/`id`; error text
  linked by `aria-describedby`; `aria-invalid` in the error state; error is
  never conveyed by color alone (icon + message). RTL-aware text alignment.

### Textarea

- **Purpose.** Multi-line text entry (contact message).
- **Variants.** Fixed vs auto-grow; configurable `rows`.
- **States.** default, hover, focus, disabled, error, success.
- **Default.** **Client** (same rationale as `Input`).
- **Tokens.** Identical family to `Input`; `--radius-sm`.
- **A11y contract.** Same as `Input`; auto-grow must not trap focus or move it
  unexpectedly.

### Label

- **Purpose.** Name a form control.
- **Variants.** Default; `required` marker; `optional` hint.
- **States.** default; reflects the associated control's error/disabled styling.
- **Default.** **Server.**
- **Tokens.** `--color-foreground`, `Small` type step; required marker uses
  `--color-danger` *plus* text, never color alone.
- **A11y contract.** Programmatically associated with exactly one control;
  required state announced by text/`aria-required`, not color.

### Badge / Tag

- **Purpose.** Label a status or categorize (project tech tags, blog category
  in V2).
- **Variants.** `neutral`, `accent`, `success`, `warning`, `danger`, `info`;
  `solid` vs `soft`; optional leading icon.
- **States.** default; hover/focus only when interactive (filter chip).
- **Default.** **Server** when static; **Client** only as an interactive filter
  (a V2 concern, [PRD → Version 2](../product/PRODUCT_REQUIREMENTS.md)).
- **Tokens.** The semantic `--color-*` pair for its variant (e.g.
  `--color-info` / `--color-info-foreground`), `--radius-full` or `--radius-sm`,
  `Caption`/`Small` step.
- **A11y contract.** Contrast holds in both themes for every variant; if it
  encodes status, the status is also in text.

### Card

- **Purpose.** A surface that groups related content into a single unit.
- **Variants.** `static`, `interactive` (whole-card link), `elevated`;
  optional media slot, header, body, footer.
- **States.** default; hover, focus, active only when `interactive`.
- **Default.** **Server** (a composition surface; the interactive variant wraps
  a real `Link`, keeping the card itself server-rendered).
- **Tokens.** `--color-surface` / `--color-surface-muted`, `--color-border`,
  `--radius-lg`, `--shadow-sm` → `--shadow-md` on hover, `--space-*` padding.
- **A11y contract.** Interactive cards expose one clear focusable target (the
  primary link) rather than many competing ones; hover elevation has a
  non-motion focus equivalent; respects reduced-motion for elevation transition.

### Avatar

- **Purpose.** Represent the author (About/Hero).
- **Variants.** Sizes `sm`/`md`/`lg`; image or initials fallback.
- **States.** default; loading (skeleton) → loaded.
- **Default.** **Server** (renders `next/image`).
- **Tokens.** `--radius-full`, `--color-surface-muted` fallback,
  `--color-border` ring.
- **A11y contract.** Meaningful `alt` when the image conveys identity; empty
  `alt` when purely decorative beside a name.

### Separator

- **Purpose.** Divide content groups visually.
- **Variants.** `horizontal`, `vertical`; `subtle`/`strong`.
- **States.** none.
- **Default.** **Server.**
- **Tokens.** `--color-border`, spacing margins.
- **A11y contract.** Decorative separators use `role="separator"` only when they
  convey a semantic break; otherwise `aria-hidden`.

### Skeleton

- **Purpose.** Placeholder that reserves layout during a Suspense/loading
  boundary ([ARCHITECTURE §5.2](../engineering/ARCHITECTURE.md)).
- **Variants.** `text`, `block`, `circle`; sized to the content it stands in
  for.
- **States.** loading (its only state).
- **Default.** **Server** (rendered as `loading.tsx` fallbacks); the shimmer is
  CSS-only.
- **Tokens.** `--color-surface-muted`, `--radius-*` matching the target,
  `--duration-slow` shimmer.
- **A11y contract.** Shimmer honors reduced-motion (falls back to a static
  tint); container marks `aria-busy`; must match the final content's dimensions
  to avoid layout shift (QAT-1).

---

## 2. Layout

Layout components own structure, rhythm, and page chrome. They enforce the
spacing scale and content width so individual features never reinvent layout.

### Container

- **Purpose.** Constrain content to the readable maximum width and apply
  consistent horizontal padding
  ([DESIGN_SYSTEM.md → Grid System / Layout Rules](../design/DESIGN_SYSTEM.md)).
- **Variants.** `default`, `narrow` (prose), `wide` (galleries).
- **States.** none.
- **Default.** **Server.**
- **Tokens.** Max-width token, `--space-*` gutters (responsive).
- **A11y contract.** Purely structural; adds no ARIA. Direction-aware padding
  (logical properties) so RTL mirrors correctly.

### Section

- **Purpose.** A vertical page region with consistent section spacing.
- **Variants.** Spacing `sm`/`md`/`lg`; optional muted background
  (`--color-surface-muted`).
- **States.** none.
- **Default.** **Server.**
- **Tokens.** `--space-*` vertical rhythm, optional surface color.
- **A11y contract.** Renders a landmark (`<section>` with an accessible name via
  its heading) when it represents a distinct page region.

### Grid

- **Purpose.** Responsive multi-column layout (12-column model).
- **Variants.** Column count per breakpoint; gap scale; `auto-fit` for card
  grids.
- **States.** none.
- **Default.** **Server.**
- **Tokens.** `--space-*` gaps; breakpoint tokens.
- **A11y contract.** Visual order matches DOM order so keyboard and screen-reader
  order stay correct; mirrors under RTL via logical properties.

### Stack

- **Purpose.** One-dimensional flow layout with a consistent gap (vertical or
  horizontal).
- **Variants.** `direction`, `gap`, `align`, `wrap`.
- **States.** none.
- **Default.** **Server.**
- **Tokens.** `--space-*` gap only.
- **A11y contract.** Structural; no reordering that would desync DOM and visual
  order.

### PageHeader

- **Purpose.** The title block at the top of a content page (page title,
  optional description, optional actions/breadcrumbs slot).
- **Variants.** With/without description; with/without actions; with/without
  `Breadcrumbs`.
- **States.** none.
- **Default.** **Server.**
- **Tokens.** `Display`/`H1` title, `Body Large` description,
  `--space-*` rhythm.
- **A11y contract.** Contains the page's single `<h1>`; establishes the heading
  hierarchy for the page.

### SiteHeader

- **Purpose.** The global top navigation chrome: logo/home link, primary `Nav`,
  `ThemeToggle`, `LanguageSwitcher`.
- **Variants.** Transparent-on-hero vs solid; compact on scroll.
- **States.** default; scrolled; mobile menu open/closed.
- **Default.** **Server** shell composing **Client** islands (`ThemeToggle`,
  `LanguageSwitcher`, mobile-menu disclosure). The header itself does not
  hydrate; only its interactive leaves do.
- **Tokens.** `--color-background`/`--color-surface` (with translucency),
  `--color-border` bottom edge, `--shadow-sm` when scrolled,
  `--duration-normal` chrome transition.
- **A11y contract.** `<header>` landmark with `role="banner"`; nav is keyboard
  operable; mobile menu is a proper disclosure (`aria-expanded`, focus
  management, `Esc` to close); skip-link target precedes it.

### SiteFooter

- **Purpose.** Global footer: secondary nav, social links (GitHub, LinkedIn,
  email — [PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)), locale/theme
  hints, copyright.
- **Variants.** Full vs compact.
- **States.** none (its links use `Link` states).
- **Default.** **Server.**
- **Tokens.** `--color-surface-muted`, `--color-border`, `--space-*`.
- **A11y contract.** `<footer>` landmark with `role="contentinfo"`; social icons
  are labelled links, never bare icons.

### Nav

- **Purpose.** A navigation list (used by `SiteHeader` and `SiteFooter`).
- **Variants.** `horizontal`, `vertical`, `mobile` (stacked, in the disclosure).
- **States.** per-item default/hover/focus/active; `current` (active route).
- **Default.** **Server**; the active-route highlight is derived from the URL
  (URL state, [ARCHITECTURE §7](../engineering/ARCHITECTURE.md)) rather than
  client state.
- **Tokens.** `--color-foreground`/`--color-muted-foreground`,
  `--color-accent` for current, `--duration-fast` hover.
- **A11y contract.** `<nav>` with an accessible name; current item marked
  `aria-current="page"`; fully keyboard navigable; order preserved under RTL.

---

## 3. Composite

Composite components assemble primitives and layout into feature-facing units.
They live in the relevant feature (`features/*`) unless reused across features,
in which case they are promoted to `shared/ui`
([ARCHITECTURE §6](../engineering/ARCHITECTURE.md)).

### Hero

- **Purpose.** The landing-page opener that must earn trust in the first ten
  seconds ([PRD → FR-003, Success Metrics](../product/PRODUCT_REQUIREMENTS.md)).
- **Variants.** Home hero; page hero (lighter, per-section).
- **States.** none (its `Button`/`Link` children own theirs).
- **Default.** **Server.** Any motion is a small enhancement, not a hydration
  requirement.
- **Tokens.** `Display` headline, `Body Large` subhead, `--space-*` generous
  whitespace ([DESIGN_LANGUAGE.md → Layout](../design/DESIGN_LANGUAGE.md)),
  `--color-foreground`/`--color-muted-foreground`, accent used sparingly.
- **A11y contract.** Holds the page `<h1>`; entrance motion honors
  reduced-motion; contrast holds over any background treatment.

### ProjectCard

- **Purpose.** Summarize one project in a grid (title, summary, tech tags,
  thumbnail) linking to its detail page
  ([PRD → FR-005](../product/PRODUCT_REQUIREMENTS.md)).
- **Variants.** `featured` (larger, for Selected Projects) vs `standard`;
  with/without thumbnail.
- **States.** default, hover, focus, active (whole-card link).
- **Default.** **Server** (composes `Card`, `Badge`, `next/image`, `Link`).
- **Tokens.** Inherits `Card` tokens; `H3`/`H4` title, `Body`/`Small` summary,
  `Badge` tokens for tags.
- **A11y contract.** One primary focusable link per card; thumbnail `alt`
  derived from the project title; tag list is not the sole affordance.

### ProjectGrid

- **Purpose.** Lay out `ProjectCard`s responsively; host filters in V2.
- **Variants.** `featured` (Selected Projects on landing) vs `full` (Projects
  index); column counts per breakpoint.
- **States.** default; empty state (message, no cards); filtered (V2).
- **Default.** **Server** (composes `Grid` + `ProjectCard`). Filtering, when it
  arrives, is **URL state** read on the server, not a client store
  ([ARCHITECTURE §7](../engineering/ARCHITECTURE.md)).
- **Tokens.** Inherits `Grid`.
- **A11y contract.** Card order matches DOM order; empty state is announced in
  text.

### TechList / StackList

- **Purpose.** Render a project's tech stack
  ([PRD → FR-005 Tech Stack](../product/PRODUCT_REQUIREMENTS.md)) as a labelled
  set of `Badge`s.
- **Variants.** `inline` (in a card) vs `grouped` (by category on detail pages).
- **States.** default; interactive only if used as filters (V2).
- **Default.** **Server.**
- **Tokens.** `Badge` tokens; `--space-*` gaps.
- **A11y contract.** Rendered as a list (`<ul>`); each technology is text (icon
  optional, never sole).

### CTASection

- **Purpose.** A focused call-to-action band (landing CTA, end-of-page contact
  prompt — [PRD → FR-003 CTA](../product/PRODUCT_REQUIREMENTS.md)).
- **Variants.** `primary` (accent surface) vs `subtle`.
- **States.** none (button owns state).
- **Default.** **Server.**
- **Tokens.** `--color-accent`/`--color-surface`, `H2`/`Display` heading,
  `--space-*` generous padding.
- **A11y contract.** Exactly one primary action
  ([DESIGN_SYSTEM.md → Layout Rules](../design/DESIGN_SYSTEM.md)); the CTA is a
  real `Button`/`Link`.

### ThemeToggle

- **Purpose.** Switch between dark, light, and system themes with persistence
  and no flash ([PRD → FR-002](../product/PRODUCT_REQUIREMENTS.md);
  [ARCHITECTURE §10 Theming](../engineering/ARCHITECTURE.md)).
- **Variants.** Icon button; segmented (dark/light/system).
- **States.** default, hover, focus, active; reflects current theme (pressed).
- **Default.** **Client** — requires browser storage and the document theme
  attribute. Kept a leaf; the theme itself is expressed through tokens, so no
  other component depends on this one.
- **Tokens.** Consumes only surface/foreground tokens; toggling swaps the token
  set, it does not restyle components.
- **A11y contract.** Real toggle semantics (`aria-pressed` or a radio group for
  three-way); accessible name states the action; keyboard operable; the theme
  switch itself is not motion-dependent.

### LanguageSwitcher

- **Purpose.** Switch locale (English/Arabic) and set document direction
  ([PRD → FR-001](../product/PRODUCT_REQUIREMENTS.md)).
- **Variants.** Inline links vs dropdown.
- **States.** default, hover, focus; current locale marked.
- **Default.** **Client** only for the menu disclosure; locale itself is **URL
  state** — switching navigates to the localized route rather than mutating a
  store. Direction handling is defined in
  [INTERNATIONALIZATION.md](../engineering/INTERNATIONALIZATION.md).
- **Tokens.** `Nav`/`Link` tokens.
- **A11y contract.** Options expose their language name in that language;
  current locale marked `aria-current`; each target is a real localized link;
  focus managed on open/close.

### Breadcrumbs

- **Purpose.** Show hierarchical location on nested pages (e.g.
  Projects → *project*).
- **Variants.** With/without a leading home icon.
- **States.** per-link states; current page non-interactive.
- **Default.** **Server** (derived from the route).
- **Tokens.** `Small` step, `--color-muted-foreground`, `--color-accent` links.
- **A11y contract.** `<nav aria-label="Breadcrumb">` wrapping an ordered list;
  current page marked `aria-current="page"` and not a link; separators are
  `aria-hidden`; mirrors under RTL.

### MDX component map

- **Purpose.** The mapping from MDX/Markdown elements to catalog components so
  content renders in the design system rather than as raw HTML. This is the
  render half of the content pipeline; the parse/validate half and the full
  mapping table are owned by [MDX_PIPELINE.md](./MDX_PIPELINE.md).
- **Variants.** N/A (it is a mapping, not a visual variant set).
- **States.** N/A.
- **Default.** **Server** — MDX is rendered within Server Components
  ([ARCHITECTURE §8](../engineering/ARCHITECTURE.md)); any interactive embed is
  itself a Client leaf.
- **Mapping (summary; canonical version in [MDX_PIPELINE.md](./MDX_PIPELINE.md)).**
  headings → `PageHeader`/heading styles with slug anchors; `a` → `Link` (with
  external handling); `code`/`pre` → syntax-highlighted code block; `img` →
  `next/image` wrapper; `ul`/`ol`/`blockquote`/`table` → typographic primitives;
  callouts → `Badge`-styled admonitions.
- **A11y contract.** Generated heading anchors are labelled; code blocks are
  keyboard-scrollable with a language label; images require `alt` from
  frontmatter/inline; external links follow the `Link` external contract.

### Timeline (Engineering Journey)

- **Purpose.** Render the engineering journey as an ordered, dated sequence
  ([PRD → FR-008](../product/PRODUCT_REQUIREMENTS.md)).
- **Variants.** `vertical` (default), grouped by year; with/without media per
  entry.
- **States.** default; per-entry hover/focus if entries link out.
- **Default.** **Server** (reads `JourneyEntry` content — see
  [CONTENT_MODEL.md](./CONTENT_MODEL.md)).
- **Tokens.** `--color-border` rail, `--color-accent` markers, `H3`/`H4`
  entry titles, `Small` dates, `--space-*` rhythm.
- **A11y contract.** Ordered list semantics with real dates in `<time>`; the
  connecting rail is decorative (`aria-hidden`); order is chronological in the
  DOM, mirrored visually under RTL.

### ContactForm

- **Purpose.** Let a visitor send a message
  ([PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)). The single
  side-effecting flow in the product
  ([ARCHITECTURE §9–10](../engineering/ARCHITECTURE.md)).
- **Variants.** Standard (name, email, message); with optional subject.
- **States.** default; per-field focus/error/success; form-level
  submitting (loading), success, error.
- **Default.** **Client** for field state and submission; wraps
  server-rendered `Label`/structure. Submission uses a server action; validation
  runs on both client and server.
- **Tokens.** `Input`/`Textarea`/`Button`/`Label` tokens; success/error use
  `--color-success` / `--color-danger` **with** text and icon.
- **A11y contract.** Every field labelled; errors linked via `aria-describedby`
  and summarized on submit with focus moved to the summary; submit sets
  `aria-busy`; success/error announced via a live region; never relies on color
  alone; spam protection must not depend on a CAPTCHA that blocks keyboard/AT
  users.

### CommandMenu — Version 2 (not built in MVP)

- **Purpose.** `CMD+K` palette for search, navigation, theme, language, resume,
  contact ([PRD → FR-011](../product/PRODUCT_REQUIREMENTS.md)).
- **Status.** **Deferred to [Version 2](../product/PRODUCT_REQUIREMENTS.md).**
  Listed here so the catalog is complete and so MVP components (`Nav`,
  `ThemeToggle`, `LanguageSwitcher`) are designed to be reused by it, not
  duplicated. It will be a **Client** island with a full keyboard/focus-trap
  contract when specified.

### Search — Version 2 (not built in MVP)

- **Purpose.** Search across projects, articles, engineering notes, case studies
  ([PRD → FR-012](../product/PRODUCT_REQUIREMENTS.md)).
- **Status.** **Deferred to [Version 2](../product/PRODUCT_REQUIREMENTS.md).**
  Query state will be **URL state**; noted here only to reserve the name and its
  relationship to `CommandMenu`.

---

## Engineering Decisions

- **ED-1 — Three tiers, not a flat list.** Grouping into Primitives / Layout /
  Composite mirrors the shared-vs-feature boundary in
  [ARCHITECTURE §6](../engineering/ARCHITECTURE.md): primitives and layout are
  shared; composites may be feature-local until reused. The tier tells a
  contributor where the component lives and what it may depend on.
- **ED-2 — Server is the default column.** Every entry states Server or Client
  explicitly because "which is it?" is the most common and most consequential
  question ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)). The default is
  Server; Client is the justified exception, always pushed to a leaf.
- **ED-3 — State set is fixed, not per-component invented.** The canonical eight
  states come from [DESIGN_SYSTEM.md → States](../design/DESIGN_SYSTEM.md). Each
  entry lists only the subset it can reach; a component never invents a state
  outside that vocabulary.
- **ED-4 — Tokens referenced by name, values elsewhere.** To prevent drift, this
  catalog names token families only; the authoritative values live in
  [design/](../design/DESIGN_TOKENS.md). If a component needs a value not
  expressible as a token, that is a design-system gap to resolve there, not a
  hardcode here (QAT-7).
- **ED-5 — CommandMenu/Search deferred but named.** V2 components are recorded so
  MVP primitives are built to be reused by them, avoiding a later rewrite —
  directly serving the anti-scope-creep and reusability goals of the
  [PRD](../product/PRODUCT_REQUIREMENTS.md).

---

## Best Practices

- **Compose primitives; do not fork them.** Build a composite from `Button`,
  `Card`, `Badge` rather than a bespoke element.
- **Keep the Client island at the leaf.** If only a toggle is interactive, only
  the toggle is `"use client"` — not its parent section.
- **Reach every state through the token set.** Hover, focus, error, and success
  are token swaps, not new hardcoded colors.
- **Label before you style.** Wire the accessibility contract (labels, roles,
  focus) before visual polish; it is a build-time requirement (QAT-2).
- **Design for RTL from the first render** using logical properties, per
  [ARCHITECTURE §10](../engineering/ARCHITECTURE.md).

## Common Mistakes

- **Client-by-default composites.** Marking a whole section `"use client"`
  because one child is interactive — collapses the server-first model.
- **Icon-only affordances.** Shipping an icon button with no accessible label,
  violating [DESIGN_SYSTEM.md → Iconography](../design/DESIGN_SYSTEM.md).
- **Color-only status.** Signalling error/success with color alone, failing
  QAT-2 and the [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) contract.
- **Banned names.** `Box`, `Wrapper`, `Component1`, `Container2`
  ([DESIGN_SYSTEM.md → Naming](../design/DESIGN_SYSTEM.md); enforced by
  [CODING_STANDARDS.md](./CODING_STANDARDS.md)).
- **Layout order ≠ DOM order.** Using `Grid`/`Stack` to reorder visually so that
  keyboard and screen-reader order desync.
- **Duplicating a component instead of promoting it.** Copying a composite into a
  second feature rather than lifting it to `shared/ui`.

## Examples

**Illustrative Button props shape** (TypeScript, illustrative only — concrete
conventions in [CODING_STANDARDS.md](./CODING_STANDARDS.md)):

```ts
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;   // default: "primary"
  size?: ButtonSize;         // default: "md"
  isLoading?: boolean;       // sets aria-busy, preserves width, disables interaction
  iconStart?: LucideIcon;    // Lucide only; never the sole label
  iconEnd?: LucideIcon;
  disabled?: boolean;
  // iconOnly variants require an accessible name:
  "aria-label"?: string;
}
```

**Server shell composing a Client leaf** (illustrative):

```tsx
// SiteHeader.tsx — Server Component (no "use client")
export function SiteHeader() {
  return (
    <header role="banner">
      <Nav />               {/* Server: active item from the URL */}
      <ThemeToggle />       {/* Client leaf: browser storage + theme attr */}
      <LanguageSwitcher />  {/* Client leaf: disclosure only; locale is URL state */}
    </header>
  );
}
```

## Checklist

Before adding or using a component, confirm:

- [ ] It appears in this catalog with a defined tier, or it is proposed as a new
      entry with the same fields.
- [ ] Its Server/Client default is honored, with any Client island at the leaf.
- [ ] It expresses only canonical states
      ([DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)), and every applicable one.
- [ ] Every color/spacing/radius/shadow/motion value resolves to a token by
      name.
- [ ] Its accessibility contract holds (labels, roles, focus, no color-only
      signalling), per [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md).
- [ ] It is locale- and direction-aware (LTR and RTL) and theme-compatible.
- [ ] Its name is meaningful and not on the banned list.
- [ ] It has one responsibility
      ([COMPONENT_PHILOSOPHY.md](../design/COMPONENT_PHILOSOPHY.md)).

## Related Documents

- [Component Philosophy](../design/COMPONENT_PHILOSOPHY.md) — design principles
  behind these components (referenced, not duplicated here).
- [Design System](../design/DESIGN_SYSTEM.md) — canonical states, standards,
  naming, iconography.
- [Design Tokens](../design/DESIGN_TOKENS.md), [Color System](../design/COLOR_SYSTEM.md),
  [Typography](../design/TYPOGRAPHY.md), [Motion Guidelines](../design/MOTION_GUIDELINES.md)
  — token values.
- [Accessibility](../engineering/ACCESSIBILITY.md) — the standard each contract
  refines.
- [Architecture](../engineering/ARCHITECTURE.md) — §5 server-first, §6 layers.
- [Content Model](./CONTENT_MODEL.md), [MDX Pipeline](./MDX_PIPELINE.md) — the
  content these components render.
- [Coding Standards](./CODING_STANDARDS.md) — naming, file, and prop
  conventions.
