import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/cn";

import type { Project } from "../lib/get-projects";

export interface ProjectPagerProps {
  prev: Project | null;
  next: Project | null;
  locale: Locale;
  labels: { previous: string; next: string; nav: string };
}

interface PagerLinkProps {
  project: Project;
  locale: Locale;
  label: string;
  direction: "prev" | "next";
}

// Directional arrows mirror in RTL via a horizontal flip (INTERNATIONALIZATION §4.3).
function PagerLink({ project, locale, label, direction }: PagerLinkProps) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={localizedHref(locale, `/projects/${project.slug}`)}
      className={cn(
        "group flex flex-col gap-1",
        direction === "next" && "items-end text-end",
      )}
    >
      <span className="flex items-center gap-1 text-caption uppercase text-muted-foreground">
        {direction === "prev" ? (
          <Icon className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        ) : null}
        {label}
        {direction === "next" ? (
          <Icon className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        ) : null}
      </span>
      <span className="text-body font-medium text-foreground transition-colors duration-fast group-hover:text-accent">
        {project.frontmatter.title}
      </span>
    </Link>
  );
}

/** Previous/next navigation between project detail pages. */
export function ProjectPager({
  prev,
  next,
  locale,
  labels,
}: ProjectPagerProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={labels.nav}
      className="flex items-stretch justify-between gap-4 border-t border-border pt-8"
    >
      {prev ? (
        <PagerLink
          project={prev}
          locale={locale}
          label={labels.previous}
          direction="prev"
        />
      ) : (
        <span />
      )}
      {next ? (
        <PagerLink
          project={next}
          locale={locale}
          label={labels.next}
          direction="next"
        />
      ) : (
        <span />
      )}
    </nav>
  );
}
