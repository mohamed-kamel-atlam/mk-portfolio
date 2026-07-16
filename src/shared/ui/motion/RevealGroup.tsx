"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export type RevealVariant = "up" | "fade" | "scale" | "mask";

export interface RevealGroupProps {
  children: ReactNode;
  /** Which reveal style to use (default `up`). */
  variant?: RevealVariant;
  /** Render element — use `ul`/`ol` so a staggered grid keeps list semantics. */
  as?: "div" | "ul" | "ol";
  className?: string;
}

type RevealState = "idle" | "hidden" | "visible";

export function RevealGroup({
  children,
  variant = "up",
  as = "div",
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

  // Cast to a single intrinsic tag so the ref type stays concrete; the runtime
  // element is still `as` (div/ul/ol), which we only measure via the ref.
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={cn(styles.revealGroup, className)}
      data-reveal={state === "idle" ? undefined : state}
      data-variant={variant}
    >
      {children}
    </Tag>
  );
}
