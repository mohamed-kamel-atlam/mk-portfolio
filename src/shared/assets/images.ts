import { ASSET_DIR, assetPath } from "./paths";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

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

export function blurDataUrl(tone = "#101b2d"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${tone}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Default blur placeholder for `next/image` `placeholder="blur"`. */
export const BLUR_DATA_URL = blurDataUrl();

/** Profile / avatar photograph (single source: `public/images/profile`). */
export const PROFILE_IMAGE_SRC = assetPath("profile", "profile.png");

export function projectCover(file: string): string {
  return assetPath("projectCovers", file);
}

export function projectLogo(file: string): string {
  return assetPath("projectLogos", file);
}

/** A project gallery image path, namespaced by the project slug. */
export function projectGalleryImage(slug: string, file: string): string {
  return `${ASSET_DIR.projectGallery}/${slug}/${file}`;
}

/** A generic placeholder image (fallback / empty states). */
export function placeholderImage(file: string): string {
  return assetPath("placeholders", file);
}
