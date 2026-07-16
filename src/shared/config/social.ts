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
