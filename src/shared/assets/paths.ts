/**
 * Public asset directory roots — the single source of truth for where static
 * assets live under `public/` (served from the site root `/`). Nothing in the
 * app hardcodes one of these paths; helpers build on top of this map so a
 * directory can be renamed in exactly one place (FOLDER_STRUCTURE.md).
 */
export const ASSET_DIR = {
  profile: "/images/profile",
  projects: "/images/projects",
  projectGallery: "/images/projects/gallery",
  blog: "/images/blog",
  logosTech: "/logos/tech",
  logosCompanies: "/logos/companies",
  illustrations: "/illustrations",
  icons: "/icons",
  backgrounds: "/backgrounds",
  noise: "/textures/noise",
  patterns: "/patterns",
  gradients: "/gradients",
  placeholders: "/placeholders",
  og: "/og",
  ui: "/ui",
} as const;

export type AssetDir = keyof typeof ASSET_DIR;

/**
 * Build a root-relative public path from an asset directory + file name.
 * Example: `assetPath("backgrounds", "hero-glow.svg") → "/backgrounds/hero-glow.svg"`.
 */
export function assetPath(dir: AssetDir, file: string): string {
  return `${ASSET_DIR[dir]}/${file}`;
}
