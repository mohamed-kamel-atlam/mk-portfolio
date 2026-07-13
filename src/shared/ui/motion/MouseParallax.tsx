"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { useReducedMotion } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface MouseParallaxProps {
  children: ReactNode;
  /** Max offset in px as the pointer crosses the element (small by default). */
  strength?: number;
  className?: string;
}

/**
 * Subtle pointer parallax — the content shifts a few px opposite the pointer for
 * gentle depth. Imperative transform (no re-render), eased back on leave, and
 * disabled under reduced motion. Kept small so it never distracts.
 */
export function MouseParallax({
  children,
  strength = 8,
  className,
}: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (reduced || !element) return;
    const rect = element.getBoundingClientRect();
    const x =
      ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) *
      -strength;
    const y =
      ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) *
      -strength;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function reset() {
    const element = ref.current;
    if (element) element.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={cn(styles.parallax, className)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
