"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface RevealGroupProps {
  children: ReactNode;
  className?: string;
}

type RevealState = "idle" | "hidden" | "visible";

/**
 * Reveals a section's direct children in a gentle staggered sequence as the
 * group scrolls into view (fade + ≤8px rise, CSS-staggered by child order).
 *
 * Perf-minimal by design: **one** IntersectionObserver per group drives the
 * whole stagger through CSS `nth-child` delays — no per-child island, no scroll
 * listener — and the observer disconnects after firing. Robust like {@link
 * Reveal}: it only hides children that start OFF-screen, so SSR, no-JS,
 * reduced-motion and screen readers always get visible content (opacity/
 * transform only, never `display:none`). The global reduced-motion rule settles
 * the transition instantly.
 */
export function RevealGroup({ children, className }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setState("visible");
      return;
    }

    // Already on screen at mount → reveal immediately (no hidden flash).
    if (element.getBoundingClientRect().top < window.innerHeight) {
      setState("visible");
      return;
    }

    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState("visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(styles.revealGroup, className)}
      data-reveal={state === "idle" ? undefined : state}
    >
      {children}
    </div>
  );
}
