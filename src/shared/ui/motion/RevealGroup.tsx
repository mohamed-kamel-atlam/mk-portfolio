"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

/**
 * Reveal styles — so sections don't all animate identically while staying one
 * consistent system:
 * - `up`    fade + ≤8px rise (default)
 * - `fade`  fade only (no travel)
 * - `scale` fade + a subtle scale-in (never from 0)
 * - `mask`  a one-shot clip-path wipe from the bottom edge
 */
export type RevealVariant = "up" | "fade" | "scale" | "mask";

export interface RevealGroupProps {
  children: ReactNode;
  /** Which reveal style to use (default `up`). */
  variant?: RevealVariant;
  className?: string;
}

type RevealState = "idle" | "hidden" | "visible";

/**
 * Reveals a section's direct children in a gentle staggered sequence as the
 * group scrolls into view. The motion style is chosen per section via
 * {@link RevealVariant}, so the page feels intentional rather than uniform.
 *
 * Perf-minimal by design: **one** IntersectionObserver per group drives the
 * whole stagger through CSS `nth-child` delays — no per-child island, no scroll
 * listener — and the observer disconnects after firing. Robust like {@link
 * Reveal}: it only hides children that start OFF-screen, so SSR, no-JS,
 * reduced-motion and screen readers always get visible content (never
 * `display:none`). The global reduced-motion rule settles the transition
 * instantly.
 */
export function RevealGroup({
  children,
  variant = "up",
  className,
}: RevealGroupProps) {
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
      data-variant={variant}
    >
      {children}
    </div>
  );
}
