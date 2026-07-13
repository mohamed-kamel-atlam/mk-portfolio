import { ASSET_DIR, assetPath } from "./paths";

/**
 * A described image: path + accessibility + intrinsic size. Pairing `alt` with
 * the source keeps the accessibility contract at the data layer (QAT-2), the
 * same discipline the content schema's `gallery` images use.
 */
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Responsive `sizes` presets for `next/image` — declared once so callers never
 * hand-write viewport math. Pick the preset matching the layout slot.
 */
export const IMAGE_SIZES = {
  /** Full-bleed / edge-to-edge. */
  full: "100vw",
  /** Hero media beside text on large screens. */
  hero: "(min-width: 1024px) 50vw, 100vw",
  /** Card in the 1/2/3-column responsive grid used across the site. */
  card: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  /** Two-up gallery item. */
  gallery: "(min-width: 768px) 50vw, 100vw",
  /** Fixed avatar. */
  avatar: "96px",
  /** Small logo glyph. */
  logo: "48px",
} as const;

export type ImageSizePreset = keyof typeof IMAGE_SIZES;

/**
 * A lightweight solid-tone blur placeholder for local photography, as an SVG
 * data URL (no Buffer/btoa, works on server and client). The tone is the
 * resolved `--color-surface-muted` (neutral-800) — a literal is required here
 * because a data URL cannot read a CSS variable; kept in sync with globals.css.
 */
export function blurDataUrl(tone = "#1d2126"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${tone}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Default blur placeholder for `next/image` `placeholder="blur"`. */
export const BLUR_DATA_URL = blurDataUrl();

/** Profile / avatar photograph (single source: `public/images/profile`). */
export const PROFILE_IMAGE_SRC = assetPath("profile", "profile.png");

/**
 * A project cover image path. `file` is the cover's file name (with extension)
 * as stored in the project's MDX `cover` frontmatter — the author owns the
 * exact asset, keeping project data in the content layer (content-as-data).
 */
export function projectCover(file: string): string {
  return assetPath("projects", file);
}

/** A project gallery image path, namespaced by the project slug. */
export function projectGalleryImage(slug: string, file: string): string {
  return `${ASSET_DIR.projectGallery}/${slug}/${file}`;
}

/** A generic placeholder image (fallback / empty states). */
export function placeholderImage(file: string): string {
  return assetPath("placeholders", file);
}
