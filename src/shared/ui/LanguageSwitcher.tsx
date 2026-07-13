"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  localeNames,
  type Locale,
} from "@/shared/i18n/config";

import { Button } from "./Button";

export interface LanguageSwitcherProps {
  className?: string;
  /** Localized accessible label; falls back to an English default. */
  label?: string;
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Binary EN/AR language switch. Locale is URL state (INTERNATIONALIZATION.md §7),
 * so switching is a real navigation to the *same route* under the other locale
 * prefix — not a client-only toggle — persisting a cookie hint that never
 * overrides an explicit URL. Presentation is delegated to {@link Button}. The
 * label renders the TARGET language in its own script (`lang`) with an
 * accessible name; the icon never replaces the label.
 */
export function LanguageSwitcher({ className, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const current: Locale = isLocale(segments[1] ?? "")
    ? (segments[1] as Locale)
    : defaultLocale;
  const next: Locale = current === "en" ? "ar" : "en";

  function switchLanguage() {
    const parts = pathname.split("/");
    if (isLocale(parts[1] ?? "")) {
      parts[1] = next; // replace the locale segment, preserving the route
    } else {
      parts.splice(1, 0, next);
    }
    const nextPath = parts.join("/") || `/${next}`;

    // Persisted override — a redirect hint for prefix-less requests only (§7).
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${ONE_YEAR_SECONDS};samesite=lax`;
    router.push(nextPath);
  }

  return (
    <Button
      variant="secondary"
      onClick={switchLanguage}
      lang={next}
      aria-label={label ?? `Switch language to ${localeNames[next]}`}
      title={localeNames[next]}
      className={className}
    >
      <Languages className="h-5 w-5" aria-hidden="true" />
      {localeNames[next]}
    </Button>
  );
}
