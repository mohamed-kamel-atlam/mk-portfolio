import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import type { ProjectStatus as ProjectStatusValue } from "@/content/schema";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { cn } from "@/shared/lib/cn";
import { ButtonLink, Heading, Text } from "@/shared/ui";

import type { Project } from "../lib/get-projects";
import { ProjectCover } from "./ProjectCover";
import { ProjectLogo } from "./ProjectLogo";
import { ProjectStatus } from "./ProjectStatus";
import { TechChip, TechOverflowChip } from "./TechChip";

/** An icon component — a Lucide icon or an inline SVG (both take SVG props). */
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * GitHub mark — Lucide dropped brand icons, so the source CTA uses this inline
 * monochrome glyph (inherits `currentColor`), matching the site's other brand
 * marks (e.g. the home social icons).
 */
function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.11.82 2.24 0 1.61-.02 2.91-.02 3.31 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

/** Localized strings the card needs — shaped once by the grid, kept off the card. */
export interface ProjectCardLabels {
  status: Record<ProjectStatusValue, string>;
  coverAlt: string;
  viewLive: string;
  viewSource: string;
  viewLiveAria: string;
  viewSourceAria: string;
  /** Overflow chip template, e.g. "+{count}". */
  more: string;
}

/** Shape the card labels from the `projectsPage` dictionary namespace (DRY —
 *  reused by the index page and the related-projects block). */
export function buildProjectCardLabels(
  p: Dictionary["projectsPage"],
): ProjectCardLabels {
  return {
    status: p.status,
    coverAlt: p.coverAlt,
    viewLive: p.viewLive,
    viewSource: p.viewSource,
    viewLiveAria: p.viewLiveAria,
    viewSourceAria: p.viewSourceAria,
    more: p.moreTech,
  };
}

/** How many technology chips to show before collapsing into "+N". */
const MAX_VISIBLE_TECH = 5;

interface Cta {
  key: string;
  href: string;
  label: string;
  ariaLabel: string;
  icon: IconComponent;
  variant: "secondary" | "ghost";
  external: boolean;
}

function fill(template: string, value: string): string {
  return template.replace("{project}", value);
}

export interface ProjectShowcaseCardProps {
  project: Project;
  /** Localized href to the project's detail / case-study page. */
  href: string;
  labels: ProjectCardLabels;
  variant?: "standard" | "featured";
  /** Semantic heading level for the title — keeps document outline valid in
   *  whatever section the card is placed (index = 2, related strip = 3). */
  headingLevel?: 2 | 3;
  /** Priority-load the cover (LCP) — the featured, above-the-fold card. */
  priority?: boolean;
  className?: string;
}

/**
 * The premium project card — fully data-driven (no per-project layout). Hierarchy
 * reads cover → name → summary → tech → status → CTA in under five seconds. The
 * whole card is a stretched link to the detail page; the CTA links sit above that
 * overlay so they stay independently operable (valid, no nested anchors). A
 * Server Component: hover/reveal are pure CSS, so it ships zero JS.
 *
 * The CTA row is a data list — adding a third action (e.g. Case Study) is one
 * push into `ctas`, no layout change.
 */
export function ProjectShowcaseCard({
  project,
  href,
  labels,
  variant = "standard",
  headingLevel = 2,
  priority = false,
  className,
}: ProjectShowcaseCardProps) {
  const fm = project.frontmatter;
  const isFeatured = variant === "featured";
  const year = fm.date.slice(0, 4);

  const visibleTech = fm.techStack.slice(0, MAX_VISIBLE_TECH);
  const overflowCount = fm.techStack.length - visibleTech.length;

  const ctas: Cta[] = [];
  if (fm.liveDemo) {
    ctas.push({
      key: "live",
      href: fm.liveDemo,
      label: labels.viewLive,
      ariaLabel: fill(labels.viewLiveAria, fm.title),
      icon: ExternalLink,
      variant: "secondary",
      external: true,
    });
  }
  if (fm.github) {
    ctas.push({
      key: "source",
      href: fm.github,
      label: labels.viewSource,
      ariaLabel: fill(labels.viewSourceAria, fm.title),
      icon: GithubMark,
      variant: "ghost",
      external: true,
    });
  }
  // A third CTA (e.g. Case Study) slots in here with no layout change.

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col rounded-2xl border border-border bg-surface",
        "transition duration-normal ease-standard",
        "focus-within:border-accent focus-within:shadow-lg hover:border-accent hover:shadow-lg",
        "motion-safe:focus-within:-translate-y-1 motion-safe:hover:-translate-y-1",
        isFeatured && "lg:grid lg:grid-cols-2 lg:items-stretch",
        className,
      )}
    >
      {/* Cover region + glassy logo/status overlays */}
      <div className="relative">
        <ProjectCover
          cover={fm.cover}
          name={fm.title}
          alt={fill(labels.coverAlt, fm.title)}
          sizes={
            isFeatured
              ? "(min-width: 1024px) 50vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          priority={priority}
          className={cn(
            // A reserved aspect ratio at every breakpoint (never `h-full` with an
            // undetermined parent height) keeps the cover from collapsing then
            // jumping on first paint — the CLS defense. On lg, `self-start` stops
            // the body's height from stretching the cover, so text reflow never
            // resizes it.
            "aspect-video rounded-t-2xl",
            isFeatured && "lg:self-start lg:rounded-s-2xl lg:rounded-t-none",
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <ProjectLogo logo={fm.logo} name={fm.title} />
          {fm.status ? (
            <ProjectStatus
              status={fm.status}
              label={labels.status[fm.status]}
            />
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-4 p-6",
          isFeatured && "lg:gap-6 lg:p-8",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Heading
            level={headingLevel}
            size={isFeatured ? "h3" : "h4"}
            className="text-balance"
          >
            <Link
              href={href}
              className="transition-colors duration-fast after:absolute after:inset-0 after:content-[''] group-hover/card:text-accent"
            >
              {fm.title}
            </Link>
          </Heading>
          <span className="shrink-0 text-small tabular-nums text-muted-foreground">
            {year}
          </span>
        </div>

        <Text size="caption" tone="muted" className="uppercase">
          {fm.role}
        </Text>

        <Text tone="muted" className="line-clamp-2 text-pretty">
          {fm.summary}
        </Text>

        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {visibleTech.map((tech) => (
            <li key={tech.name}>
              <TechChip tech={tech} />
            </li>
          ))}
          {overflowCount > 0 ? (
            <li>
              <TechOverflowChip count={overflowCount} label={labels.more} />
            </li>
          ) : null}
        </ul>

        {ctas.length > 0 ? (
          <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2">
            {ctas.map((cta) => {
              const Icon = cta.icon;
              return (
                <ButtonLink
                  key={cta.key}
                  href={cta.href}
                  variant={cta.variant}
                  size="sm"
                  aria-label={cta.ariaLabel}
                  {...(cta.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {cta.label}
                </ButtonLink>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
