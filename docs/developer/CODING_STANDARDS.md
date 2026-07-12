# Coding Standards

**Version:** 1.0.0 / **Status:** Draft / **Last Updated:** July 2026 / **Owner:** Mohamed Kamel

---

## Purpose

This document defines the **concrete code standards** every contribution — human
or AI — follows: TypeScript conventions, file and directory naming, the
one-component-per-file and public-surface pattern, import ordering and aliases,
component naming rules, prop and typing conventions, Server/Client Component file
conventions, styling rules, accessibility-in-code rules, comment/JSDoc
expectations, and the *intent* of the linting and formatting setup.

It is the code-level enforcement of the architecture's principles. Where
[ARCHITECTURE.md](../engineering/ARCHITECTURE.md) sets the frame (server-first,
feature layers, tokens over hardcoding) and
[FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md) sets the directory tree,
this document sets the rules a file must obey to belong in that structure.

---

## Scope

**In scope.** Language, naming, file layout, imports, typing, Server/Client
conventions, styling-in-code, accessibility-in-code, comments, and lint/format
*intent* — described as rules, not as configuration files.

**Out of scope.** The directory tree and import-boundary topology — owned by
[FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md). Engineering workflow
(branching, review, CI) — owned by
[DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md). Token
values — owned by [design/](../design/DESIGN_TOKENS.md). Component inventory —
owned by [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md). Per the shared rule,
this document describes lint/format **intent**; it does not author config files.

---

## Goals

- Make code **uniform enough to be read as one author's** — serving
  maintainability (QAT-3) and consistency (QAT-7).
- Encode the **server-first** and **tokens-over-hardcoding** principles as
  file-level rules so [ARCHITECTURE.md](../engineering/ARCHITECTURE.md) is
  enforced by construction.
- Make **type safety** concrete: no `any`, explicit public surfaces, typed props
  ([PRD → Maintainability](../product/PRODUCT_REQUIREMENTS.md)).
- Bake **accessibility into code review** so QAT-2 is a build-time obligation.

---

## Responsibilities

| This document owns | This document defers to |
| --- | --- |
| TypeScript, naming, import, prop, and comment rules. | Directory tree & boundaries → [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md) |
| Server/Client file conventions (`"use client"` placement). | Server-first rationale → [ARCHITECTURE §5](../engineering/ARCHITECTURE.md) |
| Styling-in-code rules (Tailwind + tokens, class order). | Token values → [design/](../design/DESIGN_TOKENS.md) |
| Lint/format **intent**. | Workflow & CI → [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md) |

---

## Dependencies

| Source | Why it constrains these standards |
| --- | --- |
| [ARCHITECTURE §5, §6, Principles 2/3/5](../engineering/ARCHITECTURE.md) | Server-first; feature layers; tokens over hardcoding. |
| [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md) | The tree these naming/import rules must be consistent with. |
| [DESIGN_SYSTEM.md → Naming, Component Standards](../design/DESIGN_SYSTEM.md) | The component-naming ban and the reusable/typed/documented standard. |
| [PRD → Maintainability](../product/PRODUCT_REQUIREMENTS.md) | Type safety, shared components, reusable patterns. |
| [ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md) | The a11y rules these code rules operationalize. |
| [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md) | Where these standards are enforced in the workflow. |

---

## 1. TypeScript conventions

- **TypeScript everywhere.** All source is `.ts`/`.tsx`
  ([ARCHITECTURE §4.1](../engineering/ARCHITECTURE.md)). No plain `.js` source in
  the app.
- **Strict posture.** The project compiles under `strict` (and its family:
  `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`,
  `noImplicitOverride`). Strictness is not selectively relaxed per file.
- **No `any`.** `any` is prohibited. When a type is genuinely unknown, use
  `unknown` and narrow. An unavoidable escape hatch requires an inline
  `// eslint-disable-next-line` with a one-line justification; a bare `any` fails
  review.
- **`type` vs `interface`.** Use `interface` for object/props shapes that
  describe a public surface (component props, content schemas), because they
  extend cleanly and produce clearer errors. Use `type` for unions, tuples,
  mapped/conditional types, and function-type aliases. Do not mix both to
  describe the same concept.
- **Explicit public boundaries.** Exported functions, components, and module
  APIs have **explicit return types**; local, obvious inference stays implicit.
  A public surface should never rely on inference to communicate its contract.
- **No enums; use unions or `as const`.** Prefer string-literal unions
  (`type Variant = "primary" | "ghost"`) and `as const` objects over TS `enum`s,
  which emit runtime code and interoperate poorly with the content schemas
  ([CONTENT_MODEL.md](./CONTENT_MODEL.md)).
- **Discriminated unions over optional-field soup** for variant-bearing props.
- **Named exports only** for shared code (see §3.3). Default exports are reserved
  for framework-required files (`page.tsx`, `layout.tsx`, etc.).

---

## 2. File and directory naming (v1.0.0 decision)

A single, justified convention removes a recurring source of churn:

| Artifact | Convention | Example |
| --- | --- | --- |
| **Component file** | **PascalCase**, matching the exported component | `ProjectCard.tsx` |
| **Hook file** | **camelCase**, `use`-prefixed | `useMediaQuery.ts` |
| **Non-component module** (utils, lib, config, types) | **kebab-case** | `format-date.ts`, `content-api.ts` |
| **Directory** | **kebab-case** | `features/projects/`, `shared/ui/` |
| **Route segment** (App Router) | framework-mandated lowercase / `[param]` | `app/[locale]/projects/[slug]/` |
| **Content file** | kebab-case slug + locale suffix | `streaming-platform.en.mdx` |
| **Test file** | mirrors subject + `.test` | `ProjectCard.test.tsx` |

**Why this split.** Component files are PascalCase so the filename equals the
symbol it exports — the file you open to edit `ProjectCard` is `ProjectCard.tsx`,
and the import path reads identically to the JSX tag. Everything non-component is
kebab-case because it is case-insensitive-filesystem-safe, URL-consistent, and
matches the route/content naming, avoiding the cross-platform casing bugs that
mixed conventions cause. Directories are kebab-case to align with feature and
route segments in [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md).

---

## 3. Module structure

### 3.1 One component per file

Each `.tsx` component file exports **exactly one** component as its public
surface. Small, private sub-components used only by that component may live in the
same file **below** it and must not be exported. A sub-component reused elsewhere
is promoted to its own file (and, if cross-feature, to `shared/ui` —
[ARCHITECTURE §6](../engineering/ARCHITECTURE.md)).

### 3.2 Public-surface (barrel) pattern

A feature or shared module exposes its **intended public API** through an
`index.ts` barrel; everything else is internal. Consumers import from the module
root, never deep-reaching into its internals — which is exactly the boundary the
architecture enforces ([ARCHITECTURE §6](../engineering/ARCHITECTURE.md);
topology in [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)).

```ts
// features/projects/index.ts — the feature's public surface
export { ProjectGrid } from "./components/ProjectGrid";
export { ProjectCard } from "./components/ProjectCard";
export type { ProjectCardProps } from "./components/ProjectCard";
// Internal helpers are intentionally NOT exported.
```

### 3.3 Named exports

Shared and feature modules use **named exports** so symbols keep one canonical
name across the codebase and barrels re-export cleanly. Default exports are used
only where a framework requires them (App Router special files).

---

## 4. Import ordering and aliases

Imports are grouped, each group separated by a blank line, ordered:

1. **Node/React/Next** built-ins and framework (`react`, `next/*`).
2. **Third-party** packages.
3. **Absolute aliases** — `@/shared/*`, `@/features/*`, `@/content/*`,
   `@/app/*` (aliases defined in tooling, consistent with
   [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md)).
4. **Relative** imports (`./`, `../`) — permitted only *within* the same module.
5. **Type-only** imports use `import type`; styles/assets last.

- **No deep cross-module relatives.** Reaching another feature via `../../` is a
  boundary violation; import from its public barrel via alias instead. This rule
  is the code-level expression of the "features never import features' internals"
  boundary ([ARCHITECTURE §6](../engineering/ARCHITECTURE.md)).
- Import order is auto-fixed by the formatter/linter (§10), not maintained by
  hand.

---

## 5. Component naming rules

- **Meaningful, domain names only.** Names describe *what the component is*
  (`ProjectCard`, `ThemeToggle`, `Timeline`).
- **Banned names.** `Box`, `Wrapper`, `Component1`, `Container2`, and any
  numbered or generic placeholder are prohibited outright
  ([DESIGN_SYSTEM.md → Naming](../design/DESIGN_SYSTEM.md)). This is a
  review-blocking rule, not a preference.
- **Component names are PascalCase**; hooks are camelCase `use*`; boolean props
  read as predicates (`isLoading`, `hasIcon`, `isFeatured`).
- **Match the catalog.** A component that exists in
  [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) uses that exact name; a new
  component earns a catalog entry rather than a synonym.

---

## 6. Props and typing conventions

- **Every component has a typed props `interface`** named `<Component>Props`,
  co-located with the component and exported when it is part of the public
  surface.
- **No inline anonymous prop object types** for exported components.
- **Prefer discriminated unions** for mutually exclusive variant sets over many
  optional booleans.
- **Destructure props with defaults** in the signature; do not mutate props.
- **Children and composition** are typed with `React.ReactNode`; polymorphic
  props use generics rather than `any`.
- **No prop drilling past one level** where server data or URL state can supply
  the value instead ([ARCHITECTURE §7](../engineering/ARCHITECTURE.md)).
- Props that carry design values must accept **token-bound variants** (e.g.
  `variant="primary"`), never raw colors or pixel values (§8).

```ts
interface ProjectCardProps {
  project: Project;               // typed content item (CONTENT_MODEL.md §6)
  variant?: "standard" | "featured";
  className?: string;             // for token-based composition only
}
```

---

## 7. Server / Client Component conventions

- **Server by default.** A component file has **no** `"use client"` unless the
  component genuinely needs interactivity, browser APIs, state, or effects
  ([ARCHITECTURE §5.1](../engineering/ARCHITECTURE.md)). Server-by-default is the
  rule; Client is the justified exception.
- **`"use client"` is the first line** of the file when present, above imports.
- **Islands at the leaves.** Put `"use client"` on the smallest component that
  needs it, not on a parent that merely contains it. A page or layout is
  effectively never a Client Component
  ([ARCHITECTURE → Common Mistakes](../engineering/ARCHITECTURE.md)).
- **No server-only imports in client files** (e.g. the content-access API, `fs`).
  Server data is fetched in a Server Component and passed down as typed props.
- **Naming does not encode environment.** Do not suffix files `.client.tsx` /
  `.server.tsx`; the `"use client"` directive is the single source of truth, and
  the default is server.
- **Async components are Server Components.** Data is awaited on the server; a
  Client Component never becomes `async` to fetch content.

---

## 8. Styling rules

- **Tailwind utilities driven by design tokens only.** Every color, spacing,
  radius, shadow, type step, and motion value resolves to a token
  ([ARCHITECTURE Principle 5](../engineering/ARCHITECTURE.md);
  [DESIGN_SYSTEM.md → Design Tokens](../design/DESIGN_SYSTEM.md)). Token names are
  the canonical `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`,
  `--duration-*`, `--ease-*` families and the `Display…Caption` type steps.
- **No hardcoded design values.** No hex/rgb colors, arbitrary pixel spacing, or
  magic durations in class names or inline styles. Tailwind **arbitrary-value**
  syntax (`bg-[#0af]`, `p-[7px]`) is prohibited for design values; it is a
  review-blocking smell. If a value is missing, it is a design-system gap to fix
  in [design/](../design/DESIGN_TOKENS.md), not a hardcode.
- **No inline `style` for design values.** Inline styles are reserved for
  genuinely dynamic, non-design values (e.g. a computed transform), never for
  color/spacing.
- **Logical properties for direction.** Use logical utilities (`ps-*`/`pe-*`,
  `ms-*`/`me-*`, `text-start`) so RTL mirrors automatically
  ([ARCHITECTURE §10](../engineering/ARCHITECTURE.md)); never hardcode
  left/right for layout that must flip.
- **Consistent class ordering.** Classes are ordered layout → box model →
  typography → color → state/variants → responsive, and this order is enforced
  by the formatter (§10), not maintained by hand.
- **Compose, do not duplicate.** Extract repeated class sets into a variant on a
  catalog component rather than copying utility strings.

---

## 9. Accessibility in code

Operationalizing QAT-2 and the contracts in
[COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) /
[ACCESSIBILITY.md](../engineering/ACCESSIBILITY.md):

- **Semantic elements first.** Use `<button>`, `<a href>`, `<nav>`, `<header>`,
  `<main>`, `<footer>`, headings — before reaching for `div` + ARIA. A clickable
  `div` is a defect.
- **Labels always.** Every control has an accessible name; icon-only controls
  carry `aria-label`; form fields are associated with a `Label`.
- **Visible focus preserved.** Never remove focus outlines without a
  token-based, equally visible replacement.
- **No color-only meaning.** Error/success/status is conveyed by text/icon in
  addition to color.
- **Reduced motion respected** for any animated behavior
  ([MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md)).
- **DOM order matches visual order** so keyboard and screen-reader traversal is
  correct.
- Accessibility lint rules (`jsx-a11y`, §10) run in CI; violations block merge.

---

## 10. Linting and formatting (intent)

Described as **intent**, not as configuration files (per the shared rule and
[DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md)):

- **Formatter (Prettier-style).** Formatting is automated and non-negotiable:
  2-space indent, double quotes, semicolons, trailing commas, ~80–100 col print
  width. Formatting is never hand-argued in review; the tool decides.
- **Linter (ESLint-style)** enforces, at minimum:
  - `no-explicit-any`, `no-unused-vars`, exhaustive-deps for hooks.
  - **Import ordering and the no-cross-feature-internals boundary** (§4),
    mirroring [FOLDER_STRUCTURE.md](../engineering/FOLDER_STRUCTURE.md).
  - **`jsx-a11y`** accessibility rules (§9).
  - **A hardcoded-design-value rule** flagging Tailwind arbitrary values and raw
    color/spacing literals (§8).
  - **Banned-component-names** (`Box`, `Wrapper`, numbered names — §5).
  - Next.js and React Server Components rules (e.g. no client-only APIs in Server
    Components).
- **Type-checking is part of the gate.** `tsc --noEmit` runs in CI; a type error
  fails the build, consistent with the content build gate
  ([MDX_PIPELINE.md](./MDX_PIPELINE.md)).
- **Auto-fix on commit.** Formatting, import order, and class order are fixed
  automatically so review focuses on substance, not style.

---

## 11. Comments and JSDoc

- **Comment the "why", not the "what".** Code says what it does; comments explain
  a non-obvious decision, constraint, or trade-off.
- **JSDoc on public surfaces.** Exported components, hooks, and the content-access
  API carry a short JSDoc describing purpose and non-obvious params — feeding the
  "documented" component standard
  ([DESIGN_SYSTEM.md → Component Standards](../design/DESIGN_SYSTEM.md)).
- **No commented-out code** in commits; version control is the history.
- **`TODO`/`FIXME` are tracked**, not orphaned — each references an issue or is
  resolved before merge.
- **No redundant narration** (`// increment i`); it decays and misleads.

---

## Engineering Decisions

- **ED-1 — PascalCase components, kebab-case everything else.** Chosen so a
  component's filename equals its symbol and import path (least surprise), while
  non-components stay filesystem- and URL-safe and consistent with routes/content.
  A single split beats per-folder conventions that drift.
- **ED-2 — Named exports for shared code.** Guarantees one canonical name per
  symbol and clean barrels; default exports confined to framework files.
- **ED-3 — Unions/`as const` over TS `enum`.** Avoids runtime enum emission and
  interops directly with the content schemas
  ([CONTENT_MODEL.md](./CONTENT_MODEL.md)).
- **ED-4 — `"use client"` is the only environment marker.** No `.client`/`.server`
  filename suffixes; the directive plus server-by-default is unambiguous
  ([ARCHITECTURE §5](../engineering/ARCHITECTURE.md)).
- **ED-5 — Hardcoded design values are lint errors.** Elevating the
  tokens-over-hardcoding principle ([ARCHITECTURE Principle 5](../engineering/ARCHITECTURE.md))
  from guidance to an automated gate is what makes QAT-7 real.
- **ED-6 — Lint/format intent, not config, lives here.** Per the shared rule this
  document does not author config files; the enforcing config lives in the repo
  and is described by [DEVELOPMENT_GUIDELINES.md](../engineering/DEVELOPMENT_GUIDELINES.md).

## Best Practices

- **Write the Server Component first;** add `"use client"` only when forced, at
  the leaf.
- **Type the public surface explicitly;** let locals infer.
- **Reach for a token, never a literal,** for any design value.
- **Import from a module's barrel,** never its internals.
- **Name for the domain;** if you cannot name it well, its responsibility is
  probably unclear.
- **Let the tools format;** spend review on correctness, accessibility, and
  architecture fit.

## Common Mistakes

- **`"use client"` on a page/layout** "to be safe" — collapses server-first
  ([ARCHITECTURE](../engineering/ARCHITECTURE.md)).
- **`any` or an untyped prop object** on an exported component.
- **Tailwind arbitrary values** (`text-[13px]`, `bg-[#111]`) instead of tokens.
- **Deep relative imports across features** (`../../features/...`), breaking the
  boundary.
- **Banned/generic names** (`Wrapper`, `Box`, `Component1`).
- **Hardcoded `left`/`right`** where logical properties are required for RTL.
- **Default-exporting shared components,** producing inconsistent import names.
- **Removing focus outlines** without a visible token-based replacement.

## Examples

**A conforming shared component file:**

```tsx
// shared/ui/Badge.tsx — Server Component (no "use client")
import type { ReactNode } from "react";

export interface BadgeProps {
  variant?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

/** Small status/category label. Status is also conveyed in text, never color alone. */
export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={badgeVariants({ variant })} // token-bound variants, no literals
    >
      {children}
    </span>
  );
}
```

**A conforming Client leaf:**

```tsx
// shared/ui/ThemeToggle.tsx
"use client"; // first line: this leaf needs browser storage + theme attribute

import { useTheme } from "@/shared/lib/use-theme";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
    >
      {/* icon is decorative; label lives in aria-label */}
    </button>
  );
}
```

## Checklist

Before opening a change for review:

- [ ] TypeScript strict passes; no `any`; public surfaces have explicit return
      types.
- [ ] File/dir names follow §2 (PascalCase components, kebab-case others).
- [ ] One exported component per file; module exposes a barrel; named exports.
- [ ] Imports grouped/ordered; no cross-feature internal imports.
- [ ] Component name is meaningful and not banned; matches the catalog.
- [ ] Props are a typed `<Component>Props` interface; no inline anonymous types.
- [ ] `"use client"` only where required, at the leaf, on line one.
- [ ] Only token-bound Tailwind classes; no arbitrary/hardcoded design values;
      logical properties for direction.
- [ ] Accessibility rules (§9) satisfied.
- [ ] JSDoc on public surfaces; no commented-out or dead code.
- [ ] Lint, format, and `tsc --noEmit` pass.

## Related Documents

- [Architecture](../engineering/ARCHITECTURE.md) — §5 server-first, §6 layers,
  Principle 5 tokens-over-hardcoding.
- [Folder Structure](../engineering/FOLDER_STRUCTURE.md) — the directory tree and
  import boundaries these rules align to.
- [Development Guidelines](../engineering/DEVELOPMENT_GUIDELINES.md) — workflow
  and where these standards are enforced.
- [Design System → Naming, Component Standards](../design/DESIGN_SYSTEM.md) — the
  naming ban and reusable/typed/documented standard.
- [Component Catalog](./COMPONENT_CATALOG.md) — canonical component names and
  contracts.
- [Content Model](./CONTENT_MODEL.md), [MDX Pipeline](./MDX_PIPELINE.md) — typed
  content the code consumes.
- [Accessibility](../engineering/ACCESSIBILITY.md) — the standard §9
  operationalizes.
