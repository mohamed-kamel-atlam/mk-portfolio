"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export interface HeaderShellProps {
  children: ReactNode;
}

/**
 * Sticky header shell that transitions to a translucent "glass" state on scroll
 * (blur + hairline border + soft shadow + a one-step height shrink). A minimal
 * client island — one passive scroll listener, no re-render churn beyond a
 * boolean — wrapping server-rendered header content. Transitions are token-timed
 * and settle instantly under reduced motion (global rule). The `data-scrolled`
 * flag drives the child height shrink via a named group.
 */
export function HeaderShell({ children }: HeaderShellProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "group/header sticky top-0 z-sticky border-b border-transparent",
        "transition-[background-color,border-color,box-shadow] duration-normal ease-standard",
        "data-[scrolled=true]:border-border data-[scrolled=true]:bg-header data-[scrolled=true]:shadow-sm data-[scrolled=true]:backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}
