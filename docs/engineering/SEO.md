# SEO & Metadata

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** July 2026
**Owner:** Mohamed Kamel

---

## Purpose

The portfolio must be discoverable and must present itself correctly wherever it
is linked — in search results, in a Slack unfurl, on LinkedIn, in a recruiter's
message. This document realizes the architectural quality attribute **QAT-6 —
SEO** ([ARCHITECTURE §1](./ARCHITECTURE.md#1-architectural-goals--quality-attributes))
by defining the complete metadata contract: how the Next.js Metadata API is
used, what title/description/social/structured-data every route emits, and how
`sitemap.xml`, `robots.txt`, canonical URLs, and localized SEO fit together.

SEO here is not marketing bolt-on; it is a direct consequence of the
architecture. The server-first model
([ARCHITECTURE §5](./ARCHITECTURE.md#5-rendering--execution-model)) means every
page is real, crawlable HTML with its metadata present at first byte — the
single biggest SEO advantage the stack provides. This document ensures that
advantage is fully exploited.

---

## Scope

**In scope.** Next.js Metadata API usage (static and dynamic); title and
description conventions; Open Graph and Twitter cards and the OG-image strategy;
JSON-LD structured data (Person, WebSite, BreadcrumbList, and Article /
CreativeWork for content); `sitemap.xml` and `robots.txt`; canonical URLs;
localized SEO and `hreflang`; and indexability control.

**Out of scope.** The **localized SEO mechanism** (locale routing, the `dir`
model, and the precise `hreflang`/canonical link shapes) is owned by
[INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md); this document consumes it
and specifies only the metadata that rides on top. **Content field definitions**
(what a project or article's frontmatter contains) are owned by
[CONTENT_MODEL.md](../developer/CONTENT_MODEL.md); this document maps those
fields into metadata but does not define them. Rendering and caching rules
belong to [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md).

---

## Goals

1. **Every route ships complete, correct metadata as server-rendered HTML** —
   present at first byte, never injected by client JavaScript.
2. **Every shared link unfurls beautifully** with a title, description, and a
   purpose-built image on every major platform.
3. **Search engines understand the content's meaning**, not just its words,
   through accurate JSON-LD structured data.
4. **Both locales are independently discoverable and indexable**, correctly
   cross-linked with `hreflang`.
5. **One source of truth for URLs and site identity** — the origin, titles, and
   defaults are defined once and composed, never hand-assembled per page.

---

## Responsibilities

| This document owns | Deferred to |
| --- | --- |
| Metadata API usage & conventions | — |
| Title / description conventions | — |
| Open Graph, Twitter cards, OG-image strategy | — |
| JSON-LD structured-data types & mapping | — |
| `sitemap.xml`, `robots.txt`, canonical rules | — |
| Localized-SEO metadata that rides on i18n | [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) owns routing/`hreflang` mechanics |
| Mapping content fields → metadata | [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) owns the fields |
| Rendering/caching of metadata routes | [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) |

---

## Dependencies

| Document | Relationship |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Frame: QAT-6, server-rendered HTML, Metadata API, structured data. |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Locale routing, `hreflang`, canonical mechanics; localized metadata. |
| [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) | Content fields mapped into metadata and structured data. |
| [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) | Static generation of metadata and OG images. |
| [PERFORMANCE.md](./PERFORMANCE.md) | The Lighthouse SEO budget (≥ 95). |

---

## 1. Foundations: Server-Rendered Metadata

SEO rests on one architectural fact: **pages are server-rendered HTML**
([ARCHITECTURE §5](./ARCHITECTURE.md#5-rendering--execution-model)). Metadata is
therefore emitted through the Next.js **Metadata API** — never via client-side
`document.title` mutation, and never dependent on hydration. A crawler (or a
social scraper that does not run JavaScript) sees the complete `<head>` on the
first response.

The App Router provides two mechanisms; both are used:

- **Static `metadata` export** for routes whose metadata is fixed (e.g. a
  contact page).
- **`generateMetadata`** for routes whose metadata derives from params —
  content routes (`[locale]/projects/[slug]`), and any route that must localize.

Both run on the server. Metadata is produced from the same content the page
renders, so title, description, and social data can never drift from the page.

### 1.1 One source of truth for URLs and identity

The production origin (`https://mohamedkamel.dev`), the site name, the default
social image, and the author identity are defined **once** in a shared SEO
configuration and composed by every route. Consistent with
[INTERNATIONALIZATION.md §6.2](./INTERNATIONALIZATION.md#62-hreflang-alternates-and-canonical),
no URL is hand-assembled: canonical, `hreflang`, Open Graph URLs, the sitemap,
and robots all read from this one origin. `metadataBase` is set from it so
relative metadata URLs resolve correctly.

---

## 2. Titles & Descriptions

- **Title template.** A shared template composes each page title with the site
  identity — e.g. `"<Page Title> — Mohamed Kamel"` — with a distinct default for
  the home page. The template lives in the root layout's metadata; pages supply
  only their own segment.
- **Titles are unique, specific, and front-loaded** — the meaningful words
  first (`"Streaming Platform — Case Study"`), within ~60 characters so they are
  not truncated in results.
- **Descriptions** are unique per page, ~150–160 characters, written to inform
  (they influence click-through, not ranking directly), and follow the brand
  voice — technical, concise, no marketing fluff
  ([BRAND → Voice & Tone](../product/BRAND.md)).
- **Both are localized** per locale via the dictionary / content
  ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)); Arabic pages carry
  Arabic titles and descriptions, never machine-passthrough English.

---

## 3. Open Graph & Twitter Cards

Every route emits Open Graph and Twitter Card metadata so links render as rich
previews.

**Open Graph** (`og:` — used by LinkedIn, Slack, Facebook, iMessage, and most
unfurlers):

| Property | Value |
| --- | --- |
| `og:title` | The page title (localized). |
| `og:description` | The page description (localized). |
| `og:type` | `website` for site pages; `article` for blog posts / case studies. |
| `og:url` | The canonical, locale-prefixed URL. |
| `og:image` | The OG image (see [§4](#4-og-image-strategy)). |
| `og:locale` | `en_US` / `ar_AR`, from the active locale. |
| `og:site_name` | The site name from the shared config. |

**Twitter Cards:** `summary_large_image` with `twitter:title`,
`twitter:description`, `twitter:image`, and the author handle — so X/Twitter
renders the large-image card rather than a bare link.

The Metadata API's `openGraph` and `twitter` fields generate these tags; they
are populated from the same localized title/description used for the standard
metadata, so the three never disagree.

---

## 4. OG-Image Strategy

A link with no image looks broken; a bespoke image per page is unmaintainable.
The v1.0.0 strategy balances both:

- **Dynamic, templated OG images** generated at the edge via the framework's
  image-response capability (`ImageResponse` / an `opengraph-image` route),
  rendering a branded template — site wordmark, page title, and a subtle
  token-driven background — into a **1200×630** image.
- **Per-content-type templates.** Projects, articles, and generic pages share a
  layout system but vary accent and label, so a project card reads differently
  from an article card while staying on-brand
  ([DESIGN_LANGUAGE](../design/DESIGN_LANGUAGE.md)).
- **Localized.** The OG image renders the localized title in the correct script
  and direction, so an Arabic page's preview image is in Arabic.
- **Generated at build/deploy** for known content (static bias,
  [PERFORMANCE.md](./PERFORMANCE.md)); cached thereafter. No per-request cost for
  static routes.
- **A static default** OG image covers any route without a specific one, so a
  preview is never blank.

This keeps every link visually first-class without hand-designing an image per
page, and the images stay in sync with titles automatically because they are
generated from the same data.

---

## 5. Structured Data (JSON-LD)

Structured data (schema.org, JSON-LD, embedded in the server-rendered HTML) lets
search engines understand *what* a page is and can enable rich results. Emitted
per page type:

| Type | Where | Purpose |
| --- | --- | --- |
| **`Person`** | Site-wide (home / about) | Identifies Mohamed Kamel — name, role, `sameAs` links (GitHub, LinkedIn). The identity anchor. |
| **`WebSite`** | Home | Declares the site and its name; enables site-level understanding. |
| **`BreadcrumbList`** | Nested pages (project/article detail) | Exposes the navigational hierarchy as breadcrumb rich results. |
| **`BlogPosting` / `Article`** | Blog posts | Headline, author, dates, image — article rich results. |
| **`CreativeWork`** | Project / case-study pages | Represents a project as a creative work (name, description, author, URL, keywords). |

**Rules.**

- JSON-LD is rendered **server-side** as a `<script type="application/ld+json">`
  in the page, populated from the **content fields**
  ([CONTENT_MODEL.md](../developer/CONTENT_MODEL.md)) — never hand-duplicated, so
  it cannot drift from the visible content.
- Structured data **describes what is actually on the page**; no invented or
  hidden claims (a spam signal and a policy violation).
- It is **localized** — names/descriptions match the page locale, and `inLanguage`
  reflects it.
- Dates use ISO 8601; URLs are absolute and canonical.

---

## 6. Sitemap & Robots

- **`app/sitemap.ts`** generates `sitemap.xml` programmatically from the routes
  and content, emitting **every locale variant** of every indexable URL with its
  `hreflang` alternates
  ([INTERNATIONALIZATION.md §6.2](./INTERNATIONALIZATION.md#62-hreflang-alternates-and-canonical)),
  plus `lastModified` from content metadata. Because it is generated from the
  content source, it can never fall out of date by hand.
- **`app/robots.ts`** generates `robots.txt`: allow crawling in production, point
  to the sitemap, and **disallow indexing of non-production (preview)
  deployments** so Vercel preview URLs never appear in search results.
- Both read the single origin from the shared SEO config
  ([§1.1](#11-one-source-of-truth-for-urls-and-identity)).

---

## 7. Canonical URLs & Localized SEO

- **Every indexable page declares a self-referencing canonical** at its
  locale-prefixed URL, preventing duplicate-content ambiguity from query strings
  or trailing-slash variants.
- **`hreflang` alternates** (including `x-default` → the default `en` locale) tie
  the `en` and `ar` versions together as translations. The concrete link shapes
  and the routing that produces them are owned by
  [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md); this document requires
  that `generateMetadata`'s `alternates.canonical` and `alternates.languages` be
  populated on **every** indexable route.
- **Localized metadata** (titles, descriptions, OG locale, structured-data
  language) is produced per locale as described above, so each language version
  is independently and correctly indexable — satisfying QAT-6 and
  [PRD → SEO: Localized SEO](../product/PRODUCT_REQUIREMENTS.md).

---

## 8. Indexability

- **Production is fully indexable**; **preview deployments are not** (enforced
  via `robots.ts` and, where needed, a `noindex` on non-production).
- **Utility routes are excluded** from indexing and the sitemap where they add
  no search value (e.g. pure redirect targets); the localized **404** returns a
  proper `404` status so soft-404s are avoided.
- **No orphan indexable pages**: anything meant to be found is in the sitemap and
  reachable by an internal link.
- Metadata never sends conflicting signals (e.g. a canonical pointing one way
  while `hreflang` points another) — the single-origin composition in
  [§1.1](#11-one-source-of-truth-for-urls-and-identity) is what prevents this.

---

## Engineering Decisions

- **Metadata is server-rendered via the Metadata API** — static `metadata` for
  fixed routes, `generateMetadata` for content and all localized routes; never
  client-side.
- **URLs and identity have one source of truth**; `metadataBase`, canonical,
  `hreflang`, OG URLs, sitemap, and robots all compose from it.
- **OG images are dynamic, templated, localized, and build-generated**, with a
  static default fallback — first-class previews without per-page hand-design.
- **JSON-LD is generated from content fields**, per type (Person, WebSite,
  BreadcrumbList, Article/BlogPosting, CreativeWork), and localized.
- **Sitemap and robots are generated from the content source**, emit all locale
  variants, and keep previews out of the index.
- **Every indexable route is self-canonical with full `hreflang`**, so both
  locales are independently discoverable.

---

## Best Practices

- Derive metadata from the same content the page renders; never maintain it
  twice.
- Give every page a unique, specific, front-loaded title and a distinct
  description, both localized.
- Populate `alternates.canonical` and `alternates.languages` on every indexable
  route.
- Emit JSON-LD that mirrors what is visibly on the page, sourced from content
  fields.
- Verify a real unfurl (Slack/LinkedIn/X) and the OG image for new content
  types, in both locales.
- Keep preview deployments out of the index.

---

## Common Mistakes

- **Client-side titles/metadata** that crawlers and non-JS scrapers never see.
- **Duplicate or missing titles/descriptions** across pages, weakening results
  and click-through.
- **Missing or broken OG image**, so links unfurl blank or with a stretched
  asset.
- **Structured data that overclaims** — describing content not on the page, a
  spam signal.
- **Forgotten `hreflang`/`x-default`**, so search engines treat `en` and `ar` as
  duplicates ([INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md)).
- **Hand-maintained sitemap** that drifts from the real routes; generate it.
- **Indexable preview deployments** leaking staging URLs into search.
- **Conflicting canonical vs. `hreflang`** signals from hand-assembled URLs.

---

## Examples

**Localized metadata for a content route (illustrative).**

```tsx
// app/[locale]/projects/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.locale, params.slug);
  return {
    title: project.title,                       // composed with the site template
    description: project.summary,
    openGraph: {
      type: "article",
      url: url(params.locale, `/projects/${params.slug}`),
      locale: params.locale === "ar" ? "ar_AR" : "en_US",
      images: [ogImage(params.locale, `/projects/${params.slug}`)],
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: url(params.locale, `/projects/${params.slug}`),
      languages: alternates(`/projects/${params.slug}`),  // hreflang incl. x-default
    },
  };
}
```

**CreativeWork JSON-LD from content fields (illustrative).**

```tsx
// Rendered server-side in the page; sourced from CONTENT_MODEL fields.
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    inLanguage: params.locale,
    author: { "@type": "Person", name: "Mohamed Kamel" },
    url: url(params.locale, `/projects/${project.slug}`),
    keywords: project.techStack,
  }) }}
/>
```

**Programmatic sitemap (illustrative shape).**

```ts
// app/sitemap.ts — one entry per route per locale, with hreflang alternates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getAllRoutes();           // static + content-derived
  return routes.flatMap((r) =>
    locales.map((locale) => ({
      url: url(locale, r.path),
      lastModified: r.lastModified,
      alternates: { languages: alternates(r.path) },
    })),
  );
}
```

---

## Checklist

Use alongside the
[Architecture Checklist](./ARCHITECTURE.md#architecture-checklist).

- [ ] Is metadata server-rendered via the Metadata API (static or
      `generateMetadata`), present at first byte?
- [ ] Is the title unique, specific, templated, and localized; is the
      description distinct and localized?
- [ ] Are Open Graph and Twitter Card tags complete, with a valid, localized OG
      image?
- [ ] Is the correct JSON-LD type emitted, sourced from content fields, and
      localized?
- [ ] Does the route declare a self-canonical and full `hreflang` (incl.
      `x-default`)?
- [ ] Is the route in the generated sitemap for both locales, with
      `lastModified`?
- [ ] Are preview deployments kept out of the index, and does 404 return a real
      404 status?
- [ ] Do canonical and `hreflang` signals agree (composed from the single
      origin)?
- [ ] Does the page meet the Lighthouse SEO budget (≥ 95,
      [PERFORMANCE.md](./PERFORMANCE.md))?

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — QAT-6; server-rendered HTML; Metadata
  API.
- [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) — locale routing,
  `hreflang`, canonical mechanics.
- [CONTENT_MODEL.md](../developer/CONTENT_MODEL.md) — content fields mapped into
  metadata and structured data.
- [RENDERING_STRATEGY.md](./RENDERING_STRATEGY.md) — static generation of
  metadata and OG images.
- [PERFORMANCE.md](./PERFORMANCE.md) — the Lighthouse SEO budget.
- [BRAND.md](../product/BRAND.md) — voice and tone for titles and descriptions.

---

## Revision History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 1.0.0 | July 2026 | Draft | Initial SEO & metadata strategy realizing QAT-6: Metadata API usage, title/description conventions, Open Graph/Twitter cards, dynamic localized OG images, JSON-LD (Person/WebSite/BreadcrumbList/Article/CreativeWork), generated sitemap/robots, canonical URLs, and localized SEO. |
