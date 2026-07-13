import { assetPath } from "./paths";

/**
 * Technology logo path (e.g. `techLogo("react") → "/logos/tech/react.svg"`).
 * SVG by default; pass an extension for raster logos.
 */
export function techLogo(name: string, ext = "svg"): string {
  return assetPath("logosTech", `${name}.${ext}`);
}

/** Company / client logo path. */
export function companyLogo(name: string, ext = "svg"): string {
  return assetPath("logosCompanies", `${name}.${ext}`);
}
