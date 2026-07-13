"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { useReducedMotion } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface CursorGlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * A soft accent light that follows the pointer inside a surface (the glow sits on
 * the `z-behind` plane, so content stays readable above it). The position is
 * written to CSS variables imperatively (no re-render); the glow fades in on
 * hover and is disabled under reduced motion. Best on a bare panel/section.
 */
export function CursorGlow({ children, className }: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (reduced || !element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      className={cn(styles.cursorGlow, className)}
      onPointerMove={handleMove}
    >
      {children}
    </div>
  );
}
