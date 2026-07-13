# Public assets

Static assets served as-is from the site root (`/`). This tree is the **single
physical home** for visual assets; application code never hardcodes a path into
it — it resolves every path through the typed helpers in
[`src/shared/assets`](../src/shared/assets) (`@/shared/assets`).

> Favicons, the OG/Twitter cards, and the Apple touch icon are **generated** by
> file-convention routes in `src/app/` (`icon.svg`, `opengraph-image.tsx`,
> `twitter-image.tsx`, `apple-icon.tsx`), not stored here.

## Structure

```text
public/
├─ images/
│  ├─ profile/            # profile / avatar photography
│  ├─ projects/           # project cover images (one per project)
│  │  └─ gallery/         # per-project galleries: gallery/<project-slug>/*
│  └─ blog/               # future blog post covers/inline images
├─ logos/
│  ├─ tech/               # technology logos (react, typescript, …) — prefer SVG
│  └─ companies/          # company / client logos — prefer SVG
├─ illustrations/         # bespoke illustrations / spot art
├─ icons/                 # standalone SVG icons (UI icons come from lucide-react)
├─ backgrounds/           # section background images
├─ textures/
│  └─ noise/              # noise textures for depth
├─ patterns/              # repeatable SVG/PNG patterns
├─ gradients/             # exported gradient meshes / backdrops
├─ placeholders/          # generic fallback / empty-state imagery
├─ og/                    # static Open Graph assets (dynamic cards are generated)
└─ ui/                    # miscellaneous UI chrome assets
```

## Conventions

- **Formats.** Prefer `.svg` for logos/icons/patterns; `.webp`/`.avif` for
  photography (Next/Image also serves AVIF/WebP automatically). Keep originals
  out of `public/`.
- **Naming.** `kebab-case`, descriptive, no spaces. Project covers and gallery
  folders are keyed by the **content slug** (e.g. `projects/gallery/misra-ai/`).
- **Never hardcode a path.** Import from `@/shared/assets`
  (`assetPath`, `projectCover`, `techLogo`, `IMAGE_SIZES`, …).
- **Accessibility.** Every rendered image needs meaningful, localized `alt`.
  Informative images describe content; purely decorative assets use `alt=""`
  and/or `aria-hidden`. Content images (project gallery) carry `alt` in their
  MDX frontmatter (`gallery[].alt` — required by the content schema).
- **Optimization.** Render through `next/image` with a `sizes` preset from
  `IMAGE_SIZES`, a `blurDataURL` placeholder for photography, and `priority`
  only for above-the-fold images (e.g. a hero/LCP image).
