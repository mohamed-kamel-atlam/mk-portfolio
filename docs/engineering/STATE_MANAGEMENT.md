# State Management

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

> **This is a strategy document, not an ADR.** The state hierarchy is an ongoing
> engineering *practice*, not a single point-in-time choice, so it is recorded
> here rather than as an Architecture Decision Record — as stated in
> [ARCHITECTURE.md §12](./ARCHITECTURE.md#12-key-architectural-decisions). This
> document is the canonical, authoritative record of the state decision. If
> introducing global state ever *alters the architecture* (e.g. adopting a
> global-state library), that specific change additionally requires an ADR; the
> hierarchy itself does not.

---

## Purpose

This document defines how client-perceived state is managed in practice,
realizing the state model of
[ARCHITECTURE.md §7](./ARCHITECTURE.md#7-state-management-model). Where
[§7](./ARCHITECTURE.md#7-state-management-model) fixes the *stance* — the strict
**Server → URL → Local → Global** preference hierarchy — this document gives the
*operating rules*: a decision tree, concrete examples at every level, the
explicit position that **no global-state library is adopted by default**, the
criteria that would justify one, the forms/server-actions posture, and how
server data and URL state compose without any client store.

State is minimized because every descent down the hierarchy adds client
JavaScript, hydration cost, and a second source of truth that can drift from the
server — working directly against QAT-1 (performance) and QAT-3
(maintainability).

---

## Scope

**In scope.** The Server→URL→Local→Global hierarchy applied in practice;
per-level decision rules and examples; the no-global-library position and the
criteria to revisit it; the forms/server-actions posture from a state
perspective; how server data + URL state compose.

**Out of scope.**

- *Server vs Client Component* rules and the `"use client"` checklist — owned by
  [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md).
- *How data is read/cached* on the server — owned by
  [DATA_FETCHING.md](./DATA_FETCHING.md).
- *The i18n routing mechanism* that carries locale in the URL — owned by
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) /
  [ADR-0004](../adr/ADR-0004-Internationalization.md).
- *The theme system* internals (persistence, no-flash) — owned by
  [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) /
  [ADR-0005](../adr/ADR-0005-Theme-System.md). This document classifies theme as
  a state case only.
- *File placement* of client islands — owned by
  [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md).

---

## Goals

1. **Keep state high in the hierarchy.** Use the highest level that works;
   descend only when the level above genuinely cannot serve the need.
2. **Keep the client thin.** Avoid client machinery for anything derivable on
   the server or expressible in the URL (QAT-1).
3. **Single source of truth.** Prevent client state from shadowing server data.
4. **Shareable UI state.** Prefer URL-encoded state for anything that should be
   linkable, bookmarkable, or restorable.
5. **No premature global store.** Adopt a global-state library only against
   written criteria, never by default.

---

## Responsibilities

| This document owns | This document defers |
| --- | --- |
| The Server→URL→Local→Global hierarchy in practice | Server/Client Component rules → [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |
| Decision tree + per-level examples | Server data reading/caching → [DATA_FETCHING.md](./DATA_FETCHING.md) |
| The no-global-library position & revisit criteria | Locale routing mechanism → [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) |
| Forms/server-actions state posture | Theme persistence internals → [ADR-0005](../adr/ADR-0005-Theme-System.md) |
| Server + URL composition without a client store | Island file placement → [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) |

---

## Dependencies

| Source | Why it constrains this document |
| --- | --- |
| [ARCHITECTURE.md §7](./ARCHITECTURE.md#7-state-management-model) | Defines the hierarchy and the rule that global state needs written justification. |
| [ARCHITECTURE.md §4.2](./ARCHITECTURE.md#42-deliberately-deferred) | State-management library is deferred by design; RTK Query mention is illustrative, not binding. |
| [ARCHITECTURE.md §2](./ARCHITECTURE.md#2-architectural-principles) | Principle 4 (state minimization) and Principle 8 (simplicity). |
| [PRD → Non-Functional Requirements](../product/PRODUCT_REQUIREMENTS.md) | Minimal JavaScript; feeds the bias against client state. |

---

## 1. The Hierarchy

State is classified into four levels. **Each level is used only when the level
above it cannot serve the need.** This ordering is a hard preference from
[ARCHITECTURE.md §7](./ARCHITECTURE.md#7-state-management-model), not a
suggestion.

| # | Level | What it is | Where it lives | Default reach |
| --- | --- | --- | --- | --- |
| 1 | **Server** | Data known at render time (content, metadata) | Server Components / feature `lib/` | Almost everything |
| 2 | **URL** | State that should be shareable, bookmarkable, restorable | Route segments + `searchParams` | Locale, filters, query, tab |
| 3 | **Local** | Ephemeral, component-scoped UI state | `useState`/`useReducer` in a leaf Client Component | Menu open, input focus |
| 4 | **Global** | Client state shared across unrelated subtrees | *Only with written justification* | Rare (see [§6](#6-global-state-and-the-no-library-position)) |

**Why the ordering.** Level 1 ships no client state at all. Level 2 keeps state
in the URL — durable, server-readable, and free of a client store. Level 3
confines state to a small island. Level 4 introduces app-wide client state, the
largest cost to bundle size and predictability. Climbing down the list is
climbing up in cost.

---

## 2. Decision Tree

```text
Classifying a piece of state — answer in order:

1. Is it derivable from content/data at render time?
      → SERVER. Read it in a Server Component; pass as props. No client state.

2. Should it survive reload / be shareable / bookmarkable / linkable?
   (locale, active filter, search query, selected tab)
      → URL. Encode in the route segment or searchParams; read on the server.

3. Is it ephemeral UI state owned by ONE component/subtree?
   (menu open, input focus, hover, local form field before submit)
      → LOCAL. useState/useReducer in the nearest leaf Client Component.

4. Is it truly shared across UNRELATED parts of the tree AND
   none of 1–3 can express it?
      → GLOBAL — but STOP. Write the justification (§6) first.
        Prefer Context for a small, stable, mostly-static value before
        ever considering a global-state library.
```

The tree biases every question upward. If two answers seem to fit, choose the
higher (lower-numbered) level.

---

## 3. Server State (Level 1)

The default and the majority of the portfolio. Content — projects, articles,
journey entries, metadata — is read directly in Server Components and passed
down as props. There is **no client state machinery** involved.

```tsx
// app/[locale]/projects/page.tsx  (Server Component)
import { ProjectGrid } from "@/features/projects";
import { getProjects } from "@/features/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();       // server read — DATA_FETCHING.md
  return <ProjectGrid projects={projects} />;  // props, not state
}
```

- Data-shaping (sort, filter, format) happens on the server; islands receive
  finished props (see
  [RENDERING_STRATEGY.md §7](./RENDERING_STRATEGY.md#7-keeping-client-islands-small)).
- *How* that read works and is cached is owned by
  [DATA_FETCHING.md](./DATA_FETCHING.md); here it matters only that this is not
  "client state."

---

## 4. URL State (Level 2)

State that should be **shareable, bookmarkable, or restorable** lives in the
URL — the route segment or `searchParams` — and is read on the server. This
keeps the state durable across reloads and free of any client store.

**Concrete cases:**

- **Locale** — carried in the `[locale]` segment
  ([FOLDER_STRUCTURE.md §2](./FOLDER_STRUCTURE.md#2-the-routing-layer--app)); the
  mechanism is owned by
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md).
- **Project filters** (Version 2 — [PRD → FR-005/Version 2](../product/PRODUCT_REQUIREMENTS.md))
  — e.g. `?tag=react&sort=recent`. A shared filter link reproduces the same
  view.
- **Search query** ([PRD → FR-012](../product/PRODUCT_REQUIREMENTS.md)) — e.g.
  `?q=streaming`. The query is URL state, not a client field; results are
  fetched on the server (this makes the route dynamic — see
  [RENDERING_STRATEGY.md §2.2](./RENDERING_STRATEGY.md#22-when-dynamic-rendering-is-warranted)).
- **Selected tab / open detail** where it should be linkable.

```tsx
// app/[locale]/projects/page.tsx  (Server Component reads searchParams)
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { tag?: string; sort?: string };
}) {
  const projects = await getProjects({ tag: searchParams.tag, sort: searchParams.sort });
  return (
    <>
      <ProjectFilterBar />                 {/* "use client" — writes to the URL */}
      <ProjectGrid projects={projects} />  {/* Server — reads from the URL */}
    </>
  );
}
```

The client control **writes** to the URL (updating `searchParams`); the Server
Component **reads** from it and re-renders with new data. There is no shared
client state between them — the URL is the channel.

```tsx
// features/projects/components/project-filter-bar.tsx
"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function ProjectFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setTag(tag: string) {
    const next = new URLSearchParams(params);
    next.set("tag", tag);
    router.push(`${pathname}?${next.toString()}`); // URL is the source of truth
  }
  // ...renders tag buttons calling setTag
}
```

---

## 5. Local State (Level 3)

Ephemeral, component-scoped UI state held in the nearest leaf Client Component
with `useState`/`useReducer`. It does not need to survive reload and is not
shared beyond its subtree.

**Concrete cases:** an open/closed menu or disclosure, input focus, a hover or
pressed state, a controlled input value *before* submission, an accordion's open
panel that need not be linkable.

```tsx
// features/navigation/components/mobile-menu.tsx
"use client";
import { useState } from "react";

export function MobileMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);   // ephemeral, local, not shared
  return (
    <>
      <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>Menu</button>
      {open && <nav>{children}</nav>}          {/* children stay server-rendered */}
    </>
  );
}
```

- Use `useReducer` when several sub-values change together (e.g. a small
  multi-step form's local step + field state) — it keeps transitions explicit.
- Keep the island small: the directive sits on the leaf, and server content is
  passed through as `children`
  ([RENDERING_STRATEGY.md §1.3](./RENDERING_STRATEGY.md#13-composition-rule--push-the-boundary-to-the-leaves)).

---

## 6. Global State and the No-Library Position

### 6.1 The position

**No global-state library is adopted by default.** This restates
[ARCHITECTURE.md §4.2](./ARCHITECTURE.md#42-deliberately-deferred): the
state-management library is deliberately deferred, and the RTK Query reference
in [PRD → FR-007](../product/PRODUCT_REQUIREMENTS.md) is *illustrative content*
for the public Engineering Decisions page — **not** a binding stack decision.
Do not assume Redux, RTK Query, Zustand, Jotai, or any store. The V1 portfolio
has no proven need for one: the hierarchy above absorbs its state at levels 1–3.

### 6.2 When something *seems* global but is not

Most "global" candidates dissolve on inspection:

- **Locale** → URL state (Level 2), read on the server.
- **Theme** → resolved via CSS variables/tokens with persistence handled by the
  theme system ([ADR-0005](../adr/ADR-0005-Theme-System.md)); the *toggle* is a
  small client island, not an app-wide store. Classify it as a narrow client
  concern, not global application state.
- **Command menu / search open-state** ([PRD → FR-011/FR-012](../product/PRODUCT_REQUIREMENTS.md))
  → local state in the menu island; the query it produces is URL state.
- **Current content** → server state (Level 1).

### 6.3 The escalation ladder

If a genuinely shared client value remains, escalate in this order and stop at
the first that works:

1. **Lift local state** to the nearest common ancestor Client Component and pass
   it down. Sufficient for most sharing.
2. **React Context** for a small, stable, low-frequency value (e.g. an
   already-resolved theme preference) shared across a subtree. Context is part
   of React — it is not a "global-state library." Beware high-frequency updates
   (they re-render all consumers).
3. **A global-state library** — only if 1–2 are proven insufficient.

### 6.4 Criteria that would justify a library

Adopting a global-state library requires **all** of the following, recorded in
writing before adoption:

- [ ] Genuinely **cross-cutting** client state shared by unrelated subtrees that
      cannot be expressed as server or URL state.
- [ ] **High-frequency or complex** updates for which Context would cause
      unacceptable re-renders or unmanageable update logic.
- [ ] A demonstrated **maintainability or performance** problem with the
      lift/Context approach — not a hypothetical one.
- [ ] The addition respects the **performance budget**
      ([PERFORMANCE.md](./PERFORMANCE.md)); the bundle cost is justified by the
      benefit.

Because introducing a global-state library **alters the architecture**, it must
be recorded as an **ADR** in addition to updating this document
([ARCHITECTURE.md §7](./ARCHITECTURE.md#7-state-management-model)). Absent all
criteria, the answer is no.

---

## 7. Forms and Server Actions (State Posture)

The contact form ([PRD → FR-010](../product/PRODUCT_REQUIREMENTS.md)) is the one
write path in V1. Its state posture:

- **Field values are local state** (Level 3) in the form island until submit;
  they are not global and not URL state.
- **Submission uses a server action**, so the form does not maintain a duplicate
  client copy of server results. Use the framework's form/action hooks (pending
  and returned-state hooks) to reflect *submission* state — pending, success,
  validation errors — rather than hand-rolling a client store for it.
- **The action's returned result is server-owned.** Success/error state flows
  back from the action; the client renders it. This keeps the single source of
  truth on the server side of the boundary.
- The action's **data flow, validation, and security** are owned by
  [DATA_FETCHING.md](./DATA_FETCHING.md); the *rendering* split (server shell +
  client input leaf) by
  [RENDERING_STRATEGY.md §6](./RENDERING_STRATEGY.md#6-forms-and-server-actions).
  This section covers only the state classification.

---

## 8. Composing Server Data with URL State — No Client Store

The pattern that lets the portfolio avoid a client store almost everywhere:

1. A **client leaf** writes intent to the **URL** (updates `searchParams` or
   navigates a segment).
2. The **Server Component** reads the URL, fetches/derives the matching data,
   and re-renders.
3. The updated server-rendered HTML streams back; only the small island
   hydrated.

```text
[Client filter island] --writes--> [URL ?tag=react]
                                        |
                                     read on server
                                        v
[Server page] --fetch/derive--> [ProjectGrid re-renders with filtered data]
```

The URL is the shared channel between client intent and server rendering, so the
two never need a shared client store. This is why levels 1–2 cover the vast
majority of the app and why global state is rarely reachable.

---

## Engineering Decisions

Decisions fixed at v1.0.0, consistent with
[ARCHITECTURE.md §7](./ARCHITECTURE.md#7-state-management-model):

1. **Strict Server→URL→Local→Global preference.** Always use the highest viable
   level ([§1](#1-the-hierarchy), [§2](#2-decision-tree)).
2. **No global-state library by default.** RTK Query in the PRD is illustrative,
   not binding; no store is assumed ([§6.1](#61-the-position)).
3. **Shareable UI state goes in the URL.** Filters, query, locale, linkable
   tabs are URL state, read on the server ([§4](#4-url-state-level-2)).
4. **Theme and locale are not global application state.** Locale is URL state;
   theme is a token/CSS-variable concern with a small toggle island
   ([§6.2](#62-when-something-seems-global-but-is-not)).
5. **Context before any library; library only against written criteria + an
   ADR.** ([§6.3](#63-the-escalation-ladder), [§6.4](#64-criteria-that-would-justify-a-library)).
6. **Forms keep the source of truth on the server** via server actions; the
   client holds only pre-submit field state ([§7](#7-forms-and-server-actions-state-posture)).
7. **Server + URL compose without a client store** ([§8](#8-composing-server-data-with-url-state--no-client-store)).

---

## Best Practices

- **Ask "can the server own this?" first.** Most state is server state.
- **Reach for the URL before `useState`** whenever the value should be
  shareable or survive reload.
- **Keep local state in a leaf**, passing server content through as `children`.
- **Treat "global" as a red flag.** Re-classify before reaching for it; almost
  everything is server, URL, or local.
- **Never shadow server data on the client.** If the client copies server data
  into state, you now have two truths that can drift.
- **If you must go global, write the justification (and ADR) first**, not after.

---

## Common Mistakes

- **Premature global state** — introducing a store for state that is genuinely
  server, URL, or local; flagged as the most likely source of accidental
  complexity in
  [ARCHITECTURE.md Common Mistakes](./ARCHITECTURE.md#common-mistakes).
- **Assuming RTK Query / Redux** because FR-007 mentions it — it is illustrative
  content, not a decision ([§6.1](#61-the-position)).
- **Client-side filter/search state** — holding filters or the search query in
  `useState` instead of the URL, breaking shareability and forcing client data
  fetching ([§4](#4-url-state-level-2)).
- **Duplicating server data into client state** — creating a second source of
  truth that drifts.
- **Context for high-frequency values** — re-rendering every consumer on each
  update; a sign the value may not belong in Context
  ([§6.3](#63-the-escalation-ladder)).
- **A client store for form results** — server actions already return
  server-owned result state ([§7](#7-forms-and-server-actions-state-posture)).

---

## Examples

**Project filtering (Version 2).** A user clicks the "React" tag. The client
filter island pushes `?tag=react` to the URL; the Server Component reads
`searchParams.tag`, fetches the filtered projects, and re-renders the grid. The
link is shareable and survives reload. No client store, no client-side fetch.

**Command menu (Version 2, FR-011).** `Cmd+K` opens the menu — that open/closed
flag is **local** state in the menu island. Selecting "search" and typing sets
the **URL** query. Choosing a theme delegates to the theme system. Nothing here
is global application state.

**Contact form.** Field values are local state in the form island. On submit, a
server action validates and sends the message; pending and result state come
from the action via the framework's form hooks. The client never stores the
server result independently.

---

## Checklist

Before merging any stateful component:

- [ ] Is this state at the highest viable level (server → URL → local →
      global)?
- [ ] Could it be server-derived instead of held on the client?
- [ ] If it should be shareable/restorable, is it in the URL rather than
      `useState`?
- [ ] Is local state confined to a leaf island, with server content passed as
      `children`?
- [ ] Are you avoiding a duplicate client copy of server data?
- [ ] If global: are all [§6.4 criteria](#64-criteria-that-would-justify-a-library)
      met, with a written justification **and** an ADR?
- [ ] For forms: is the source of truth the server action, with only pre-submit
      field state on the client?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — §7 (state model), §4.2 (deferred
  library): the frame this document details.
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — Server/Client Component
  rules; forms rendering split; keeping islands small.
- [DATA_FETCHING.md](./DATA_FETCHING.md) — how server state is read/cached; the
  contact server action's data flow and validation.
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — where client-state islands live
  within a feature.
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — locale as URL state.
- [ADR-0005 — Theme System](../adr/ADR-0005-Theme-System.md) — theme
  persistence and no-flash internals.
- [PERFORMANCE.md](./PERFORMANCE.md) — the budget any global-state library must
  respect.
