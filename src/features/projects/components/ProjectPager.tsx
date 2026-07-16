import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { localizedHref, type Locale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/cn";
import { Card, Heading, Text } from "@/shared/ui";
import { RevealGroup } from "@/shared/ui/motion";

import type { Project } from "../lib/get-projects";

export interface ProjectPagerProps {
  prev: Project | null;
  next: Project | null;
  locale: Locale;
  labels: { previous: string; next: string; nav: string; back: string };
}

interface PagerCardProps {
  project: Project;
  locale: Locale;
  label: string;
  direction: "prev" | "next";
}

/** A premium prev/next card. Directional arrows mirror in RTL via a flip. */
function PagerCard({ project, locale, label, direction }: PagerCardProps) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  const isNext = direction === "next";
  return (
    <Link
      href={localizedHref(locale, `/projects/${project.slug}`)}
      className="group/pager block h-full rounded-lg"
    >
      <Card
        className={cn(
          "flex h-full flex-col gap-2 transition duration-normal",
          "group-hover/pager:border-accent group-hover/pager:shadow-accent",
          "motion-safe:group-hover/pager:-translate-y-1",
          isNext && "items-end text-end",
        )}
      >
        <span className="flex items-center gap-1.5 text-caption uppercase text-muted-foreground">
          {!isNext ? (
            <Icon className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          ) : null}
          {label}
          {isNext ? (
            <Icon className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          ) : null}
        </span>
        <Heading
          level={2}
          size="h4"
          className="transition-colors duration-fast group-hover/pager:text-accent"
        >
          {project.frontmatter.title}
        </Heading>
        <Text size="small" tone="muted" className="text-pretty">
          {project.frontmatter.summary}
        </Text>
      </Card>
    </Link>
  );
}

export function ProjectPager({
  prev,
  next,
  locale,
  labels,
}: ProjectPagerProps) {
  return (
    <nav
      aria-label={labels.nav}
      className="flex flex-col gap-8 border-t border-border pt-10"
    >
      {prev || next ? (
        <RevealGroup variant="up" className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <PagerCard
              project={prev}
              locale={locale}
              label={labels.previous}
              direction="prev"
            />
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <PagerCard
              project={next}
              locale={locale}
              label={labels.next}
              direction="next"
            />
          ) : (
            <span className="hidden sm:block" />
          )}
        </RevealGroup>
      ) : null}
      <Link
        href={localizedHref(locale, "/projects")}
        className="group inline-flex items-center justify-center gap-1 self-center text-small text-muted-foreground transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {labels.back}
      </Link>
    </nav>
  );
}
