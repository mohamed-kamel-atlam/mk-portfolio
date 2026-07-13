import { assetPath } from "./paths";

/**
 * Standalone SVG icon path (e.g. `svgIcon("download") → "/icons/download.svg"`).
 *
 * Note: interactive UI iconography comes from `lucide-react` (tree-shaken, no
 * network request). This helper is for bespoke brand/marketing SVGs that live in
 * `public/icons` and are referenced by path.
 */
export function svgIcon(name: string): string {
  return assetPath("icons", `${name}.svg`);
}

/** Illustration asset path. */
export function illustration(name: string, ext = "svg"): string {
  return assetPath("illustrations", `${name}.${ext}`);
}
