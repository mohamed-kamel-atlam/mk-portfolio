/**
 * Contact-page structural data — the non-translatable atoms (method keys, the
 * WhatsApp destination, and the availability / quick-fact keys). Translatable
 * copy lives in the `contact` dictionary namespace, keyed by the same
 * identifiers. Method hrefs for github/linkedin/email are resolved from the
 * single social config; WhatsApp is contact-page-only, so it lives here.
 */

/** WhatsApp destination and the format shown on the card (owner-provided). */
export const WHATSAPP = {
  href: "https://wa.me/201550047877",
  display: "+20 155 004 7877",
} as const;

/** Contact methods, in display order. */
export const contactMethods = [
  "github",
  "linkedin",
  "email",
  "whatsapp",
] as const;
export type ContactMethodKey = (typeof contactMethods)[number];

/** What I'm available for (§5). */
export const availabilityItems = [
  "fulltime",
  "freelance",
  "remote",
  "ai",
  "saas",
] as const;
export type AvailabilityKey = (typeof availabilityItems)[number];

/** Compact quick facts (§6). Proper-noun values live in the dictionary. */
export const quickFacts = [
  "role",
  "location",
  "react",
  "nextjs",
  "typescript",
  "relocation",
] as const;
export type QuickFactKey = (typeof quickFacts)[number];
