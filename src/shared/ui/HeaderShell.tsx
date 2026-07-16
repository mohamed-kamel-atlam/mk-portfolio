"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export interface HeaderShellProps {
  children: ReactNode;
}

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
        // Translucent flat fill (no backdrop-filter): avoids re-blurring the
        // scrolled-under region every frame — the biggest scroll-jank source.
        "data-[scrolled=true]:border-border data-[scrolled=true]:bg-header data-[scrolled=true]:shadow-sm",
      )}
    >
      {children}
    </header>
  );
}
