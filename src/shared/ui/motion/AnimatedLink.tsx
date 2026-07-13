import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  /** Render as an external anchor with safe rel/target. */
  external?: boolean;
  /** Reveal a trailing arrow that slides on hover. */
  arrow?: boolean;
  className?: string;
}

/**
 * A content link with the shared interaction language: an underline that grows
 * from the reading-start edge (RTL-safe), a token color transition, and an
 * optional trailing arrow that slides on hover. Server Component. Internal links
 * use `next/link`; external links get `rel="noopener noreferrer"`.
 */
export function AnimatedLink({
  href,
  children,
  external = false,
  arrow = false,
  className,
}: AnimatedLinkProps) {
  const classes = cn(
    "group/link inline-flex items-center gap-1 text-accent transition-colors duration-fast hover:text-foreground",
    className,
  );

  const content = (
    <>
      <span className={styles.underline}>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-fast group-hover/link:translate-x-1 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-1"
        />
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
