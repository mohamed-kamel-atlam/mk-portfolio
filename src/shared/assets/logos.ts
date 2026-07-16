import { assetPath } from "./paths";

export function techLogo(name: string, ext = "svg"): string {
  return assetPath("logosTech", `${name}.${ext}`);
}

/** Company / client logo path. */
export function companyLogo(name: string, ext = "svg"): string {
  return assetPath("logosCompanies", `${name}.${ext}`);
}
