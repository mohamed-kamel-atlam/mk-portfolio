"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

export interface NavLinkItem {
  key: string;
  href: string;
  label: string;
  /** Home is active only on an exact match; others match nested routes too. */
  isHome: boolean;
}

export interface DesktopNavProps {
  items: readonly NavLinkItem[];
  /** Localized landmark label. */
  ariaLabel: string;
  className?: string;
}

/** Active-link matcher shared by the desktop and mobile navs (single source). */
export function useIsActive() {
  const pathname = usePathname();
  return (item: NavLinkItem) =>
    item.isHome
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Horizontal primary navigation for wider viewports. Client-only for active-link
 * detection via `usePathname`; links use `next/link` (prefetch + client nav).
 * The active link carries `aria-current="page"`; hierarchy is color, not weight
 * jumps, with a token transition.
 */
export function DesktopNav({ items, ariaLabel, className }: DesktopNavProps) {
  const isActive = useIsActive();

  return (
    <nav aria-label={ariaLabel} className={cn("items-center gap-6", className)}>
      {items.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-small font-medium transition-colors duration-fast",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
