"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { useReducedMotion } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

import styles from "./motion.module.css";

export interface MagneticProps {
  children: ReactNode;
  /** Max pull toward the pointer, in px (kept small per MOTION_GUIDELINES). */
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 6, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    const element = ref.current;
    if (reduced || !element) return;
    const rect = element.getBoundingClientRect();
    const x =
      ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) *
      strength;
    const y =
      ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) *
      strength;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function reset() {
    const element = ref.current;
    if (element) element.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className={cn(styles.magnetic, "inline-flex", className)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}
