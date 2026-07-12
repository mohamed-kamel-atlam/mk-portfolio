# Internationalization & Routing

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

This document defines *how* the portfolio is internationalized. It converts the
architectural constraint QAT-5 — [English, Arabic, and RTL are foundational, not
retrofitted](./ARCHITECTURE.md#10-cross-cutting-concerns) — into a concrete,
buildable mechanism: the routing scheme, the direction model, the translation
structure, and the localized-metadata contract.

It is the implementation-level realization of
[ADR-0004 — Internationalization](../adr/ADR-0004-Internationalization.md).
ADR-0004 owns the *decision and its rationale*; this document owns the *practice
that follows from it*. The two must agree exactly; where they appear to diverge,
ADR-0004 defines the decision and this document is corrected to match.

Internationalization is a cross-cutting concern
([ARCHITECTURE §10](./ARCHITECTURE.md#10-cross-cutting-concerns)): it touches
routing, rendering, layout, typography, and SEO. Every page and component is
built locale- and direction-aware from line one, because retrofitting RTL after
the fact is the most expensive avoidable rework in this project.

---

## Scope

**In scope.** The locale routing scheme (`app/[locale]/` path-prefix segment);
the locale set, default, and fallback; direction (`dir`) handling and its
consequences for CSS, icons, and motion; the dictionary/translation structure
and how it is loaded in Server Components; localized routes, metadata,
`hreflang`, and canonical URLs; the language-switcher UX; language detection,
user override, and persistence; and locale-aware formatting of numbers and dates
via the `Intl` APIs.

**Out of scope.** Per-route rendering, caching, and revalidation rules, which
belong to [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md). The full metadata,
Open Graph, and structured-data contract, which belongs to [SEO.md](./SEO.md);
this document specifies only the *localized* dimension of SEO and defers the
rest. Design-token values for typography and direction-sensitive spacing, which
belong to [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) and
[TYPOGRAPHY.md](../design/TYPOGRAPHY.md). The translation *authoring* workflow
for long-form content, which is governed by the content pipeline
([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)).

---

## Goals

1. **Locale is a first-class routing dimension.** Every indexable page exists at
   a locale-prefixed URL; there is no "hidden" default-locale page without a
   prefix that could split link equity or duplicate content.
2. **Direction is derived, never hardcoded.** `dir` is a pure function of the
   active locale. No component branches on "is this Arabic"; it branches on
   layout direction only through logical CSS and shared primitives.
3. **Translations resolve on the server.** Dictionaries are loaded in Server
   Components so localized text ships as HTML with zero translation JavaScript
   on the client (QAT-1, QAT-6).
4. **Localized SEO is complete.** Each locale emits its own metadata, `hreflang`
   alternates, and a self-referencing canonical, so both language versions are
   independently indexable ([SEO.md](./SEO.md)).
5. **The visitor is in control.** Detection provides a sensible default; an
   explicit user override always wins and persists across visits.

---

## Responsibilities

| This document owns | Deferred to |
| --- | --- |
| Locale routing scheme and segment shape | — |
| Locale set, default, fallback, `dir` mapping | — |
| Dictionary structure and server-side loading | — |
| Language switcher UX and persistence contract | [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md) for the component |
| Localized metadata / `hreflang` / canonical rules | [SEO.md](./SEO.md) owns the non-localized metadata contract |
| `Intl`-based number/date formatting policy | — |
| Per-route rendering & caching | [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |
| Accessibility of RTL & the switcher | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |

---

## Dependencies

| Document | Relationship |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Frame: QAT-5, server-first model, state hierarchy (locale is URL state). |
| [ADR-0004 — Internationalization](../adr/ADR-0004-Internationalization.md) | Canonical decision this document realizes. |
| [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) | How localized routes are statically generated and streamed. |
| [SEO.md](./SEO.md) | Metadata API, `hreflang`, canonical, sitemap — the localized subset is specified here. |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | RTL accessibility, language-of-parts, switcher operability. |
| [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) | Arabic font stack and direction-aware type. |
| [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) | Logical (direction-agnostic) spacing tokens. |
| [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) | Mirroring of directional motion in RTL. |
| [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) | Locale-scoped MDX content resolution. |

---

## 1. The v1.0.0 Decision

The internationalization mechanism was deferred by the architecture
([ARCHITECTURE §4.2](./ARCHITECTURE.md#42-deliberately-deferred)) and is closed
here, in agreement with ADR-0004, as the following locked decision for v1.0.0:

> **Path-prefixed locale routing** under a single dynamic `app/[locale]/`
> segment. Supported locales are **`en`** (LTR, the default) and **`ar`**
> (RTL). The document direction (`dir`) is derived from the active locale.
> Metadata is localized per route, with `hreflang` alternates and a
> self-referencing canonical URL per locale. Translations are **dictionary-based
> JSON**, loaded in Server Components. On a request without a locale prefix, the
> locale is **detected** (persisted override → `Accept-Language` → default `en`)
> and the visitor is redirected to the prefixed URL; an **explicit user
> override** through the language switcher always takes precedence and is
> persisted.

### 1.1 Why path-prefix routing

- **It is the most explicit, cacheable, and shareable scheme.** The locale lives
  in the URL, so it is bookmarkable and restorable — exactly the definition of
  **URL state** in the architecture's
  [state hierarchy](./ARCHITECTURE.md#7-state-management-model) (Server → URL →
  Local → Global). A locale carried only in a cookie or in client state would
  violate that hierarchy.
- **It maps one-to-one onto the App Router.** A `[locale]` segment is a native
  dynamic route; `generateStaticParams` produces one static tree per locale,
  preserving the static bias in
  [ARCHITECTURE §5.2](./ARCHITECTURE.md#52-static-bias-streaming-and-boundaries).
- **It is unambiguous for SEO.** Each locale has a distinct, crawlable URL that
  can carry its own metadata and `hreflang` — the cleanest possible signal to
  search engines (QAT-6).
- **It matches the illustrative example** already used throughout the
  architecture (`/ar/projects/streaming-platform`), so no downstream document
  needs to change its mental model.

### 1.2 Alternatives considered and rejected

| Alternative | Why rejected |
| --- | --- |
| **Domain / subdomain per locale** (`ar.example.com`, `example.ar`) | Operationally heavy for a single-owner portfolio: extra DNS, certificates, and separate deployment origins for no product benefit. Splits analytics and link equity. Justified only at a scale this project explicitly is not ([ARCHITECTURE §3.2](./ARCHITECTURE.md#32-non-goals-out-of-scope)). |
| **Cookie-only locale, single URL set** | The locale is invisible to the URL, so pages are neither shareable-with-locale nor independently indexable. Violates the URL-state preference and produces duplicate-content ambiguity for crawlers. Fails QAT-5 and QAT-6. |
| **Query-parameter locale** (`?lang=ar`) | Weak SEO signal, fragile canonicalization, and a poor fit for the App Router's file-system routing. Also risks placing locale in query strings, which the project avoids for state that belongs in the path. |
| **Client-side runtime translation** (translate after hydration) | Ships translation dictionaries and logic to the browser, defeats server-rendered localized HTML, and causes a flash of untranslated content. Directly conflicts with the server-first model and QAT-1. |

---

## 2. Locale Model

| Property | `en` | `ar` |
| --- | --- | --- |
| Code (BCP 47) | `en` | `ar` |
| Direction (`dir`) | `ltr` | `rtl` |
| Default | Yes | No |
| `<html lang>` | `en` | `ar` |

The supported-locale list, the default locale, and the direction mapping are the
**single source of truth** for the whole application and are defined in one
place (an `i18n` configuration module in the shared layer). Every other
subsystem — routing, metadata, the switcher, the sitemap — reads from that one
definition; none re-declares the list. Adding a third locale in a later
milestone is therefore a single-file change plus its dictionary, not a
cross-cutting edit.

**Fallback.** If a translation key is missing for `ar`, the value falls back to
`en` rather than rendering an empty string or the raw key, so a partially
translated build degrades gracefully. A missing key is a lint/CI warning (see
[§10](#10-engineering-decisions)), not a silent runtime hole.

---

## 3. Routing Scheme

### 3.1 The `[locale]` segment

All routes live beneath a single dynamic segment:

```
app/
  [locale]/
    layout.tsx              # sets <html lang> and dir; loads the dictionary
    page.tsx                # localized landing page
    projects/
      page.tsx              # localized index
      [slug]/page.tsx       # localized detail
    ...
  sitemap.ts                # emits every locale variant
  robots.ts
```

The `[locale]/layout.tsx` is the single point where the active locale is
validated and where `lang` and `dir` are applied to the document. A request
whose first segment is not a supported locale is either redirected (missing
prefix — see [§7](#7-detection-override-and-persistence)) or returns the
localized 404 (unknown, non-locale segment).

### 3.2 Static generation

Locale-prefixed routes are statically generated per locale via
`generateStaticParams`, consistent with the static bias in
[RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md). Conceptually, for a content
route:

```tsx
// Illustrative — shape only; canonical patterns live in RENDERING_STRATEGY.md.
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProjectSlugs(locale).map((slug) => ({ locale, slug })),
  );
}
```

### 3.3 Localized route segments

Route *segments* remain in a stable, English-based form (`/ar/projects`, not a
translated segment). This keeps routing predictable, avoids a translated-slug
lookup table, and is standard for developer-facing portfolios. Human-readable
localization happens in the rendered content and metadata, not in the path
tokens. If translated slugs are ever required, they are introduced through the
content layer's slug mapping, not by forking the route tree — but this is
explicitly **not** a v1.0.0 requirement.

---

## 4. Direction (RTL) Handling

Direction is the highest-leverage i18n concern because it affects layout, not
just text. The rule is absolute: **`dir` is derived from the locale and applied
once, at the document root; components never hardcode a physical side.**

### 4.1 The `dir` attribute

`[locale]/layout.tsx` sets both attributes on the document element:

```tsx
// Illustrative.
<html lang={locale} dir={direction(locale)}>   {/* "ltr" for en, "rtl" for ar */}
```

Everything below inherits direction from the root. This is the only place `dir`
is set; no component sets it locally except a deliberately bidirectional island
(e.g. a code block that must stay LTR inside RTL prose — see
[§4.4](#44-bidirectional-content)).

### 4.2 Logical CSS properties, not physical

Layout uses **logical** properties so it mirrors automatically under RTL:

| Use | Not |
| --- | --- |
| `margin-inline-start`, `padding-inline-end` | `margin-left`, `padding-right` |
| `inset-inline-start` | `left` |
| `border-start-start-radius` | `border-top-left-radius` |
| `text-align: start` | `text-align: left` |

Spacing and radius resolve to design tokens
([DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md)); this document adds the
constraint that the *properties* consuming those tokens are logical. Physical
`left`/`right` is permitted only where a thing is genuinely physical regardless
of reading direction (rare — e.g. a drop shadow's light source).

### 4.3 Direction-aware icons and motion

- **Directional icons** (arrows, chevrons, "next/previous", back buttons) must
  mirror in RTL. A "next" chevron points left in Arabic. Non-directional icons
  (a gear, a search glass, a logo) never mirror. Iconography is Lucide-only
  ([DESIGN_SYSTEM → Iconography](../design/DESIGN_SYSTEM.md)); mirroring is a
  transform on directional icons, applied through a shared icon primitive so no
  page decides per-instance.
- **Directional motion** mirrors too. A panel that slides in from the inline-end
  in LTR slides from the inline-end in RTL — i.e. motion is expressed in logical
  terms. The motion *system* and its tokens are owned by
  [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md); this document adds only
  the rule that directional motion is defined in inline/logical axes, never in
  hardcoded left/right pixels, and that reduced-motion still applies equally in
  both directions ([ACCESSIBILITY.md](./ACCESSIBILITY.md)).

### 4.4 Bidirectional content

Arabic prose frequently embeds LTR runs — code identifiers, URLs, product names,
numbers. These are wrapped so the bidi algorithm renders them correctly (e.g. an
inline element with its own `dir="ltr"`), preventing punctuation and brackets
from flipping. Code blocks are always LTR regardless of surrounding direction.

---

## 5. Dictionary & Translation Structure

### 5.1 Structure

UI strings (labels, navigation, aria-labels, form messages) are stored as
**per-locale JSON dictionaries**, namespaced by feature to match the
feature-based architecture
([ARCHITECTURE §6](./ARCHITECTURE.md#6-application-structure)):

```
shared/i18n/
  config.ts                 # locales, default, dir map — single source of truth
  dictionaries/
    en/
      common.json
      nav.json
      contact.json
    ar/
      common.json
      nav.json
      contact.json
```

Keys are stable, semantic, and identical across locales (`nav.projects`, not
`nav.item1`). The `en` set is the canonical key set; every other locale is
validated against it.

**Long-form content** (project case studies, articles, journey entries) is *not*
a dictionary concern. It lives as locale-scoped MDX in the content layer and is
resolved by locale there ([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)).
Dictionaries cover *chrome* — the reusable interface strings — not *content*.

### 5.2 Loading in Server Components

Dictionaries load **on the server**. A small async loader resolves the correct
dictionary for the active locale and returns only the requested namespace, so a
page pulls in the strings it needs and no more:

```tsx
// Illustrative — Server Component.
export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const t = await getDictionary(params.locale, "contact");
  return <ContactForm labels={t.form} />;
}
```

Because this runs on the server, translated text is emitted as HTML: **no
dictionary and no translation runtime ship to the client**, preserving QAT-1 and
the server-first model. A Client Component that needs a string receives it as a
prop from its Server Component parent, or — for a genuinely interactive island
that needs many strings — a scoped, already-resolved slice is passed down. The
client never fetches or holds the full dictionary.

The active locale is read from the route params (URL state); it is **not** put
into a global client store. This keeps locale on the correct rung of the state
hierarchy.

---

## 6. Localized Metadata, `hreflang`, and Canonical

SEO metadata is generated per locale via the Next.js Metadata API. This document
specifies the **localized** rules; the complete metadata, Open Graph, and
structured-data contract lives in [SEO.md](./SEO.md).

### 6.1 Per-locale metadata

Each route implements `generateMetadata` keyed on the active locale, producing a
localized `title`, `description`, and Open Graph locale:

```tsx
// Illustrative — see SEO.md for the full contract.
export async function generateMetadata({ params }): Promise<Metadata> {
  const t = await getDictionary(params.locale, "meta");
  return {
    title: t.home.title,
    description: t.home.description,
    openGraph: { locale: params.locale === "ar" ? "ar_AR" : "en_US" },
    alternates: { canonical: url(params.locale), languages: alternates() },
  };
}
```

### 6.2 `hreflang` alternates and canonical

Every localized page declares:

- A **self-referencing canonical** pointing at its own locale-prefixed URL.
- **`hreflang` alternates** for every supported locale, plus an `x-default`
  pointing at the default locale (`en`). This tells search engines the two pages
  are translations of one another and which to serve by default.

```
<link rel="canonical"  href="https://mohamedkamel.dev/ar/projects" />
<link rel="alternate" hreflang="en"        href="https://mohamedkamel.dev/en/projects" />
<link rel="alternate" hreflang="ar"        href="https://mohamedkamel.dev/ar/projects" />
<link rel="alternate" hreflang="x-default" href="https://mohamedkamel.dev/en/projects" />
```

The sitemap (`app/sitemap.ts`) emits every locale variant with its `hreflang`
alternates, so both languages are discovered and indexed independently. The
production origin is `https://mohamedkamel.dev`; it is defined once and read by
metadata, `hreflang`, canonical, sitemap, and robots ([SEO.md](./SEO.md)) so no
URL is hand-assembled.

---

## 7. Detection, Override, and Persistence

The locale a visitor sees is resolved by a strict precedence, highest first:

1. **Explicit URL locale.** If the path already has a supported locale prefix
   (`/ar/...`), that wins unconditionally. The URL is the source of truth.
2. **Persisted user override.** If the visitor previously chose a language via
   the switcher, that preference (a cookie) determines the redirect target for a
   prefix-less request.
3. **`Accept-Language` negotiation.** For a first-time visitor with no override,
   the request's `Accept-Language` header is matched against the supported
   locales.
4. **Default (`en`).** If nothing matches, fall back to the default locale.

Detection applies **only when the URL has no locale prefix** — for example a
bare `/` or a direct hit on an unprefixed path. In that case the visitor is
redirected to the resolved locale-prefixed URL (via middleware), so they always
land on a canonical, prefixed, indexable URL. Crawlers are never trapped in
redirect loops because prefixed URLs are served directly.

**Override and persistence.** Choosing a language in the switcher (a) navigates
to the same route under the new locale prefix and (b) writes a persistent cookie
recording the choice. The cookie only influences the *redirect for prefix-less
requests*; it never overrides an explicit prefixed URL, so a shared `/ar/...`
link always renders in Arabic for the recipient regardless of their own stored
preference. This is the correct interaction between URL state (authoritative)
and a persisted hint (a default only).

---

## 8. Language Switcher UX

The switcher is the visitor's explicit control (FR-001). Its behavior:

- **Preserves context.** Switching from `/ar/projects/streaming-platform`
  navigates to `/en/projects/streaming-platform` — the *same* page in the other
  language, not back to the home page.
- **Is a real navigation.** It changes the URL (and thus `dir` and metadata),
  because locale is URL state. It is not a client-only toggle.
- **Persists the choice** as described in [§7](#7-detection-override-and-persistence).
- **Is accessible.** It exposes each option's language name in that language
  (`English`, `العربية`), is fully keyboard-operable, has a visible focus state,
  and announces the current selection to assistive technology. Detailed
  operability requirements are in [ACCESSIBILITY.md](./ACCESSIBILITY.md); the
  component itself is catalogued in
  [COMPONENT_CATALOG.md](../developer/COMPONENT_CATALOG.md). It is also reachable
  from the command menu (FR-011) in a later milestone.

The switcher is a small Client Component island (it triggers navigation and
reflects the current locale); the surrounding chrome stays server-rendered,
consistent with pushing interactivity to the leaves.

---

## 9. Formatting: Numbers, Dates, and Collation

All locale-sensitive formatting uses the platform **`Intl`** APIs, keyed on the
active locale — never hand-rolled formatting or hardcoded separators.

- **Dates and times:** `Intl.DateTimeFormat(locale, …)` for article dates,
  journey timeline entries, and "last updated" stamps.
- **Numbers:** `Intl.NumberFormat(locale, …)`. Arabic may render Eastern Arabic
  numerals depending on the chosen numbering system; the choice is made once in
  the formatting utility, not per call site, so it stays consistent.
- **Relative time:** `Intl.RelativeTimeFormat` for "3 days ago"-style strings.
- **Collation:** `Intl.Collator(locale)` for any locale-aware sorting.

Formatting runs on the server wherever the value is server-known (which is the
common case), so formatted output ships as HTML. Formatting helpers live in the
shared layer and take the locale explicitly; no helper reads a global.

---

## 10. Engineering Decisions

- **Path-prefix over every alternative.** Locked in [§1](#1-the-v100-decision),
  in agreement with ADR-0004. Locale is URL state; the URL is the source of
  truth.
- **`en` is the default and the `x-default`.** English is the primary audience
  language for a global engineering portfolio; Arabic is a first-class,
  fully-supported peer, not a secondary bolt-on.
- **Direction is derived once.** `dir` is set only at `[locale]/layout.tsx`;
  components use logical CSS. This is what makes RTL a configuration, not a
  rewrite.
- **Dictionaries are server-loaded JSON, namespaced by feature.** No client
  translation runtime; strings ship as HTML. Content (MDX) is separate from
  chrome (dictionaries).
- **Missing keys fall back to `en` and warn in CI.** Graceful degradation at
  runtime, visibility at build time.
- **Detection redirects to a prefixed URL.** No page is ever served without a
  canonical locale prefix; crawlers always see stable URLs.
- **Override is a persisted default, never an authority over an explicit URL.**
  Shared links render in their embedded locale for every recipient.

---

## Best Practices

- Read the locale from route params; pass it down explicitly. Never reach for a
  global "current locale" store.
- Style with logical properties (`*-inline-*`, `start`/`end`) by default; treat
  every `left`/`right` as a bug until proven physical.
- Mirror directional icons and directional motion through shared primitives, not
  per component.
- Load dictionaries in Server Components and pass only the needed slice to client
  islands.
- Localize every user-visible string, including `aria-label`s, form errors, and
  metadata — not just body copy.
- Format every date and number through the `Intl` helpers with the active
  locale.
- Add both a self-canonical and full `hreflang` alternates (including
  `x-default`) to every indexable page.

---

## Common Mistakes

- **Hardcoding a physical side** (`ml-4`, `left-0`, `text-left`) so the layout
  breaks in RTL. Use logical properties.
- **Translating on the client**, shipping the dictionary to the browser and
  causing a flash of untranslated content.
- **Storing locale in global client state** instead of the URL, breaking
  shareability and the state hierarchy.
- **A switcher that resets to home** instead of preserving the current route.
- **A cookie that overrides an explicit `/ar/...` URL**, so shared links render
  in the wrong language.
- **Forgetting `hreflang`/`x-default`**, causing search engines to treat the two
  locales as duplicate content.
- **Concatenating dates and numbers by hand** instead of using `Intl`, producing
  wrong separators and numerals for Arabic.
- **Not mirroring directional icons**, leaving "next" arrows pointing the wrong
  way in Arabic.

---

## Examples

**A localized, direction-aware page (illustrative).**

```tsx
// app/[locale]/projects/page.tsx — Server Component
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const t = await getDictionary(params.locale, "meta");
  return {
    title: t.projects.title,
    description: t.projects.description,
    alternates: { canonical: url(params.locale, "/projects"), languages: alternates("/projects") },
  };
}

export default async function ProjectsPage({ params }) {
  const t = await getDictionary(params.locale, "projects");
  const projects = await getProjects(params.locale);
  return (
    <main>
      <h1>{t.heading}</h1>
      {/* logical spacing → mirrors in RTL automatically */}
      <ul className="ps-0">{projects.map((p) => <ProjectCard key={p.slug} project={p} />)}</ul>
    </main>
  );
}
```

**Direction map (illustrative single source of truth).**

```ts
// shared/i18n/config.ts
export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];
export const direction = (l: Locale): "ltr" | "rtl" => (l === "ar" ? "rtl" : "ltr");
```

---

## Checklist

Use alongside the
[Architecture Checklist](./ARCHITECTURE.md#architecture-checklist).

- [ ] Does the page live under `app/[locale]/` and render at a prefixed URL?
- [ ] Is `dir` derived from the locale (never hardcoded below the root layout)?
- [ ] Does the layout use logical CSS properties, not physical `left`/`right`?
- [ ] Do directional icons and directional motion mirror in RTL?
- [ ] Are all UI strings loaded from the dictionary on the server, with an `en`
      fallback for missing keys?
- [ ] Is long-form content resolved per locale from the content layer, not the
      dictionary?
- [ ] Does `generateMetadata` emit localized title/description and the correct
      Open Graph locale?
- [ ] Are a self-canonical and full `hreflang` alternates (incl. `x-default`)
      present, and is the page in the sitemap for both locales?
- [ ] Does the language switcher preserve the current route and persist the
      choice without overriding explicit URLs?
- [ ] Are dates and numbers formatted via `Intl` with the active locale?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — frame; QAT-5; state hierarchy.
- [ADR-0004 — Internationalization](../adr/ADR-0004-Internationalization.md) —
  canonical decision realized here.
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — static generation of
  localized routes.
- [SEO.md](./SEO.md) — full metadata / `hreflang` / sitemap contract.
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — RTL and switcher accessibility.
- [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) — Arabic font stack.
- [DESIGN_TOKENS.md](../design/DESIGN_TOKENS.md) — logical spacing tokens.
- [MOTION_GUIDELINES.md](../design/MOTION_GUIDELINES.md) — mirrored motion.
- [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) — locale-scoped content.

---

## Revision History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 1.0.0 | July 2026 | Draft | Initial i18n & routing strategy realizing ADR-0004: path-prefixed `[locale]` routing, `en`/`ar` with derived `dir`, server-loaded dictionaries, localized metadata/`hreflang`/canonical, detection with persisted override, and `Intl` formatting. |
