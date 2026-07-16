import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { Text } from "@/shared/ui";

import { type EngineeringDoc } from "../lib/get-engineering";

export interface DocPagerProps {
  prev: EngineeringDoc | null;
  next: EngineeringDoc | null;
  locale: Locale;
  labels: { previous: string; next: string; nav: string };
}

export function DocPager({ prev, next, locale, labels }: DocPagerProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={labels.nav}
      className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={localizedHref(locale, `/engineering/${prev.slug}`)}
          className="group flex flex-col gap-1 rounded-md"
        >
          <span className="inline-flex items-center gap-1 text-small text-muted-foreground">
            <ArrowLeft
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
            {labels.previous}
          </span>
          <Text className="transition-colors duration-fast group-hover:text-accent">
            {prev.frontmatter.title}
          </Text>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={localizedHref(locale, `/engineering/${next.slug}`)}
          className="group flex flex-col gap-1 rounded-md text-end sm:items-end"
        >
          <span className="inline-flex items-center gap-1 text-small text-muted-foreground">
            {labels.next}
            <ArrowRight
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </span>
          <Text className="transition-colors duration-fast group-hover:text-accent">
            {next.frontmatter.title}
          </Text>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
