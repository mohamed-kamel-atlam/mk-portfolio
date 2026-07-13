"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
}

type RevealState = "idle" | "hidden" | "visible";

/**
 * Reveal content when it scrolls into view (fade + ≤8px rise). Robust by design:
 * it only hides items that start OFF-screen, so SSR, no-JS, reduced-motion, and
 * screen readers always get visible content (opacity/transform only — never
 * `display:none`). The hidden→visible transition is token-driven.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
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

    // Already on screen at mount → reveal without a hide step (no flash).
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
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;

  return (
    <div
      ref={ref}
      className={cn(styles.reveal, className)}
      data-reveal={state === "idle" ? undefined : state}
      style={style}
    >
      {children}
    </div>
  );
}
