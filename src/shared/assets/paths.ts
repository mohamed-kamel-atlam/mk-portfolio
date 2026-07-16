export const ASSET_DIR = {
  profile: "/images/profile",
  projects: "/images/projects",
  /** Project cover screenshots — kept separate from logos (never mixed). */
  projectCovers: "/images/projects/covers",
  projectLogos: "/logos/projects",
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

export function assetPath(dir: AssetDir, file: string): string {
  return `${ASSET_DIR[dir]}/${file}`;
}
