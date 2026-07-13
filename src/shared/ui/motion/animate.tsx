import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * On-load entrance primitives — pure CSS (Server Components, zero client JS).
 * They apply a token-driven keyframe animation, gated by `motion-safe` and the
 * global reduced-motion rule. Use these for above-the-fold content; use
 * {@link Reveal} for content that should animate when scrolled into view.
 */

type AnimateTag = "div" | "section" | "span" | "li" | "article" | "header";

const variantClass = {
  fade: "motion-safe:animate-fade-in",
  up: "motion-safe:animate-fade-in-up",
  down: "motion-safe:animate-fade-in-down",
  scale: "motion-safe:animate-scale-in",
} as const;

export type AnimateInVariant = keyof typeof variantClass;

export interface AnimateInProps {
  as?: AnimateTag;
  variant?: AnimateInVariant;
  /** Entrance delay in ms — for staggering an on-load group. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Animate content in on mount, with an optional stagger delay. */
export function AnimateIn({
  as: Tag = "div",
  variant = "up",
  delay,
  className,
  children,
}: AnimateInProps) {
  const style = delay
    ? ({ animationDelay: `${delay}ms` } as CSSProperties)
    : undefined;
  return (
    <Tag className={cn(variantClass[variant], className)} style={style}>
      {children}
    </Tag>
  );
}

type AliasProps = Omit<AnimateInProps, "variant">;

/** Fade in (no travel). */
export function FadeIn(props: AliasProps) {
  return <AnimateIn variant="fade" {...props} />;
}

/** Fade + rise (the default entrance). */
export function SlideIn(props: AliasProps) {
  return <AnimateIn variant="up" {...props} />;
}

/** Fade + subtle scale (never from 0). */
export function ScaleIn(props: AliasProps) {
  return <AnimateIn variant="scale" {...props} />;
}
