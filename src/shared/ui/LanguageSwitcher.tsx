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
import { cn } from "@/shared/lib/cn";

export interface LanguageSwitcherProps {
  className?: string;
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Binary EN/AR language switch. Locale is URL state (INTERNATIONALIZATION.md §7),
 * so switching is a real navigation to the *same route* under the other locale
 * prefix — not a client-only toggle — and it persists a cookie hint that never
 * overrides an explicit URL. The button shows the TARGET language in its own
 * script (`lang`) with an accessible label; the icon never replaces the label
 * (DESIGN_SYSTEM → Iconography). Token-styled; inherits the global focus ring.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
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
    <button
      type="button"
      onClick={switchLanguage}
      lang={next}
      aria-label={`Switch language to ${localeNames[next]}`}
      title={localeNames[next]}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-foreground transition-colors duration-fast hover:bg-muted",
        className,
      )}
    >
      <Languages className="h-5 w-5" aria-hidden="true" />
      <span className="text-small font-medium">{localeNames[next]}</span>
    </button>
  );
}
