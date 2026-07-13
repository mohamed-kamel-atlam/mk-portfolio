/**
 * Social platform configuration — the single source of truth for every social
 * channel. The platform *catalog* (`SocialPlatform` + `SOCIAL_LABELS`) is
 * scalable to many networks; `socialLinks` holds only the channels with a real
 * URL, so adding one (X, Medium, Dev.to, a personal site, …) is a single entry.
 * Consumed by the header/footer, the About page, and the Person JSON-LD.
 */

/** Every supported platform. Add a network here, then a `socialLinks` entry. */
export type SocialPlatform =
  "github" | "linkedin" | "email" | "x" | "medium" | "devto" | "portfolio";

/** Default accessible names per platform (proper nouns; not localized). */
export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  x: "X",
  medium: "Medium",
  devto: "Dev.to",
  portfolio: "Portfolio",
};

export interface SocialLink {
  key: SocialPlatform;
  /** Accessible name (defaults to {@link SOCIAL_LABELS}). */
  label: string;
  href: string;
}

/**
 * Active social links — only the platforms with a real destination. To surface
 * another network, add an entry keyed by its {@link SocialPlatform}.
 */
export const socialLinks: readonly SocialLink[] = [
  {
    key: "github",
    label: SOCIAL_LABELS.github,
    href: "https://github.com/mohamed-kamel-atlam",
  },
  {
    key: "linkedin",
    label: SOCIAL_LABELS.linkedin,
    href: "https://www.linkedin.com/in/mohamed-atlam-597496290",
  },
  {
    key: "email",
    label: SOCIAL_LABELS.email,
    href: "mailto:mohamedatlam1710@gmail.com",
  },
] as const;

/** @deprecated Use {@link SocialPlatform}. Kept for backward compatibility. */
export type SocialKey = SocialPlatform;
