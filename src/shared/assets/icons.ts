import { assetPath } from "./paths";

export function svgIcon(name: string): string {
  return assetPath("icons", `${name}.svg`);
}

/** Illustration asset path. */
export function illustration(name: string, ext = "svg"): string {
  return assetPath("illustrations", `${name}.${ext}`);
}
