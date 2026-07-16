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
              "relative text-small font-medium transition-colors duration-fast",
              // Accent underline: persistent for the active page, grow-on-hover
              // otherwise. Origin flips in RTL so it grows from the reading start.
              "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-fast after:content-[''] rtl:after:origin-right",
              active
                ? "text-foreground after:scale-x-100"
                : "text-muted-foreground after:scale-x-0 hover:text-foreground motion-safe:hover:after:scale-x-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
